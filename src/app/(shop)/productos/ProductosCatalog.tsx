'use client';

import { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { products } from '@/data/products';
import { filterProducts, sortProducts } from '@/lib/products';
import { CATEGORIAS_VALIDAS, MATERIALES_VALIDOS } from '@/lib/constants';
import type { FilterState, SortOption } from '@/types/product.types';
import { ProductCard } from '@/components/common/ProductCard';
import gsap from 'gsap';

const CATEGORY_LABELS: Record<string, string> = {
  mostradores: 'Mostradores',
  exhibidores: 'Exhibidores',
  vitrinas: 'Vitrinas',
  estanterias: 'Estanterías',
  gondolas: 'Góndolas',
  mesas: 'Mesas',
  hogar: 'Hogar',
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Más relevantes' },
  { value: 'price_asc', label: 'Menor precio' },
  { value: 'price_desc', label: 'Mayor precio' },
  { value: 'newest', label: 'Más recientes' },
];

function isValidCategoria(v: string): v is (typeof CATEGORIAS_VALIDAS)[number] {
  return (CATEGORIAS_VALIDAS as readonly string[]).includes(v);
}
function isValidMaterial(v: string): v is (typeof MATERIALES_VALIDOS)[number] {
  return (MATERIALES_VALIDOS as readonly string[]).includes(v);
}
function isValidSort(v: string): v is SortOption {
  return ['relevance', 'price_asc', 'price_desc', 'newest'].includes(v);
}

export function ProductosCatalog() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const gridRef = useRef<HTMLDivElement>(null);
  const [onlyInStock, setOnlyInStock] = useState(false);

  /* ---- URL-driven filter state ---- */
  const activeCategories = useMemo<string[]>(() => {
    return searchParams.getAll('categoria').filter(isValidCategoria);
  }, [searchParams]);

  const activeMaterials = useMemo<string[]>(() => {
    return searchParams.getAll('material').filter(isValidMaterial);
  }, [searchParams]);

  const sortParam = searchParams.get('orden') ?? 'relevance';
  const activeSort: SortOption = isValidSort(sortParam) ? sortParam : 'relevance';

  const updateParams = useCallback(
    (updates: { categorias?: string[]; materiales?: string[]; orden?: SortOption }) => {
      const params = new URLSearchParams();
      const cats = updates.categorias ?? activeCategories;
      const mats = updates.materiales ?? activeMaterials;
      const ord = updates.orden ?? activeSort;
      cats.forEach((c) => params.append('categoria', c));
      mats.forEach((m) => params.append('material', m));
      if (ord !== 'relevance') params.set('orden', ord);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [activeCategories, activeMaterials, activeSort, pathname, router]
  );

  const toggleCategory = useCallback(
    (cat: string) => {
      if (!isValidCategoria(cat)) return;
      const next = activeCategories.includes(cat)
        ? activeCategories.filter((c) => c !== cat)
        : [...activeCategories, cat];
      updateParams({ categorias: next });
    },
    [activeCategories, updateParams]
  );

  const handleSort = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      if (isValidSort(val)) updateParams({ orden: val });
    },
    [updateParams]
  );

  /* ---- Derived product list ---- */
  const filterState: FilterState = {
    categories: activeCategories,
    materials: activeMaterials,
    searchQuery: '',
  };

  let filtered = filterProducts(products, filterState);
  if (onlyInStock) {
    filtered = filtered.filter((p) => p.variants.some((v) => v.inStock));
  }
  const sorted = sortProducts(filtered, activeSort);

  /* ---- Animate cards on filter change ---- */
  const animationKey = sorted.map((p) => p.id).join(',');
  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll('.catalog-card');
    if (!cards || cards.length === 0) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 32, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.055,
        ease: 'power2.out',
        clearProps: 'transform',
      }
    );
  }, [animationKey]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---- WhatsApp FAB ---- */
  const waFabUrl = 'https://wa.me/542616918409?text=Hola%20CUYUM%2C%20quiero%20consultar%20sobre%20sus%20productos.';

  return (
    <main>
      {/* Catalog heading */}
      <div className="catalog-header" style={{ paddingTop: '96px', paddingBottom: '0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '0' }}>
          <h1 className="catalog-header__title">Catálogo</h1>
          <p className="catalog-header__subtitle">
            Mobiliario comercial diseñado para elevar la experiencia estética y funcional de su negocio.
          </p>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div className="filter-bar">
        <div className="filter-bar__inner">
          <div className="filter-bar__content">
            {/* Category pills */}
            <div className="filter-bar__pills" role="group" aria-label="Filtrar por categoría">
              {/* "Todos" pill */}
              <button
                className={`filter-pill${activeCategories.length === 0 ? ' active' : ''}`}
                onClick={() => updateParams({ categorias: [] })}
                aria-pressed={activeCategories.length === 0}
              >
                Todos
              </button>
              {CATEGORIAS_VALIDAS.map((cat) => {
                const count = products.filter((p) => p.category === cat).length;
                if (count === 0) return null;
                const isActive = activeCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    className={`filter-pill${isActive ? ' active' : ''}`}
                    onClick={() => toggleCategory(cat)}
                    aria-pressed={isActive}
                  >
                    {CATEGORY_LABELS[cat] ?? cat}
                  </button>
                );
              })}
            </div>

            {/* Controls */}
            <div className="filter-bar__controls">
              {/* In-stock toggle */}
              <label className="stock-toggle" htmlFor="stock-toggle">
                <span className="stock-toggle__label">Solo en stock</span>
                <div
                  id="stock-toggle"
                  role="switch"
                  aria-checked={onlyInStock}
                  className={`stock-toggle__track${onlyInStock ? ' on' : ''}`}
                  onClick={() => setOnlyInStock(!onlyInStock)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOnlyInStock(!onlyInStock); }}
                  tabIndex={0}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="stock-toggle__thumb" />
                </div>
              </label>

              {/* Sort dropdown */}
              <div className="sort-dropdown">
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary)' }}>
                  sort
                </span>
                <select
                  id="sort-select"
                  value={activeSort}
                  onChange={handleSort}
                  aria-label="Ordenar productos"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Count */}
      <div className="catalog-count">
        <span>{sorted.length}</span>{' '}
        {sorted.length === 1 ? 'producto encontrado' : 'productos encontrados'}
        {(activeCategories.length > 0 || activeMaterials.length > 0 || onlyInStock) && (
          <button
            onClick={() => { updateParams({ categorias: [], materiales: [] }); setOnlyInStock(false); }}
            style={{
              marginLeft: '12px',
              color: 'var(--color-primary)',
              fontSize: '0.7rem',
              fontWeight: 600,
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-label)',
              letterSpacing: '0.08em',
            }}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Product grid */}
      {sorted.length === 0 ? (
        <div className="catalog-empty">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '56px', color: 'var(--color-outline-variant)', marginBottom: '16px', display: 'block' }}
          >
            search_off
          </span>
          <h3>Sin resultados</h3>
          <p>Probá con otros filtros o explorá todo el catálogo.</p>
        </div>
      ) : (
        <div className="catalog-grid" ref={gridRef}>
          {sorted.map((product) => (
            <ProductCard key={product.id} product={product} extraClass="catalog-card" />
          ))}
        </div>
      )}

      {/* WhatsApp FAB */}
      <a
        href={waFabUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-fab"
        aria-label="Consultar por WhatsApp"
        title="Consultar por WhatsApp"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </main>
  );
}
