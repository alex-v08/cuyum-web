'use client';

import { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { products } from '@/data/products';
import { filterProducts, sortProducts, formatPrice } from '@/lib/products';
import { CATEGORIAS_VALIDAS, MATERIALES_VALIDOS } from '@/lib/constants';
import type { FilterState, SortOption } from '@/types/product.types';
import { imgPath } from '@/lib/assetPath';

gsap.registerPlugin(ScrollTrigger);

const CATEGORY_LABELS: Record<string, string> = {
  mostradores: 'Mostradores',
  exhibidores: 'Exhibidores',
  vitrinas: 'Vitrinas',
  estanterias: 'Estanterías',
  gondolas: 'Góndolas',
  mesas: 'Mesas',
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const toggleMaterial = useCallback(
    (mat: string) => {
      if (!isValidMaterial(mat)) return;
      const next = activeMaterials.includes(mat)
        ? activeMaterials.filter((m) => m !== mat)
        : [...activeMaterials, mat];
      updateParams({ materiales: next });
    },
    [activeMaterials, updateParams]
  );

  const handleSort = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      if (isValidSort(val)) updateParams({ orden: val });
    },
    [updateParams]
  );

  const filterState: FilterState = {
    categories: activeCategories,
    materials: activeMaterials,
    searchQuery: '',
  };

  const filtered = filterProducts(products, filterState);
  const sorted = sortProducts(filtered, activeSort);

  const animationKey = sorted.map((p) => p.id).join(',');

  // Re-animate cards whenever the filtered/sorted list changes
  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll('.catalog-card');
    if (!cards || cards.length === 0) return;
    gsap.fromTo(cards,
      { opacity: 0, y: 36, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.06, ease: 'power2.out', clearProps: 'transform' }
    );
    // Attach hover overlay listeners
    cards.forEach((card) => {
      const overlay = card.querySelector('.product-card__overlay');
      if (!overlay) return;
      const enterHandler = () => gsap.to(overlay, { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' });
      const leaveHandler = () => gsap.to(overlay, { opacity: 0, y: 8, duration: 0.22, ease: 'power2.in' });
      card.addEventListener('mouseenter', enterHandler);
      card.addEventListener('mouseleave', leaveHandler);
    });
  }, [animationKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main>
      <section className="section">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Inicio</Link>
            <span className="breadcrumb-sep">/</span>
            <span>Productos</span>
          </nav>

          <div style={{ marginBottom: '32px' }}>
            <h1 className="section-title">Catálogo</h1>
            <span className="title-underline" />
          </div>

          <div className="catalog-layout">
            {/* Sidebar toggle (mobile only) */}
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-expanded={sidebarOpen}
            >
              <span>Filtros{(activeCategories.length + activeMaterials.length) > 0 ? ` (${activeCategories.length + activeMaterials.length})` : ''}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                {sidebarOpen
                  ? <polyline points="18 15 12 9 6 15" />
                  : <polyline points="6 9 12 15 18 9" />
                }
              </svg>
            </button>

            {/* Sidebar */}
            <aside className={`catalog-sidebar${sidebarOpen ? ' open' : ''}`} aria-label="Filtros">
              <div className="sidebar-section">
                <p className="sidebar-title">Categorías</p>
                {CATEGORIAS_VALIDAS.map((cat) => {
                  const count = products.filter((p) => p.category === cat).length;
                  if (count === 0) return null;
                  const isActive = activeCategories.includes(cat);
                  return (
                    <label key={cat} className={`sidebar-filter-item${isActive ? ' active' : ''}`}>
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => toggleCategory(cat)}
                        aria-label={`Filtrar por ${CATEGORY_LABELS[cat] ?? cat}`}
                      />
                      {CATEGORY_LABELS[cat] ?? cat}
                      <span style={{ marginLeft: 'auto', color: 'var(--color-muted)', fontSize: 'var(--text-small)' }}>
                        ({count})
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="sidebar-section">
                <p className="sidebar-title">Material</p>
                {MATERIALES_VALIDOS.map((mat) => {
                  const count = products.filter((p) => p.variants.some((v) => v.material === mat)).length;
                  if (count === 0) return null;
                  const isActive = activeMaterials.includes(mat);
                  return (
                    <label key={mat} className={`sidebar-filter-item${isActive ? ' active' : ''}`}>
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => toggleMaterial(mat)}
                        aria-label={`Filtrar por material ${mat}`}
                      />
                      {mat}
                      <span style={{ marginLeft: 'auto', color: 'var(--color-muted)', fontSize: 'var(--text-small)' }}>
                        ({count})
                      </span>
                    </label>
                  );
                })}
              </div>

              {(activeCategories.length > 0 || activeMaterials.length > 0) && (
                <button
                  onClick={() => updateParams({ categorias: [], materiales: [] })}
                  style={{ fontSize: 'var(--text-small)', color: 'var(--color-gold)', fontWeight: 400, letterSpacing: '0.05em', marginTop: '8px', textDecoration: 'underline' }}
                >
                  Limpiar filtros
                </button>
              )}
            </aside>

            {/* Main */}
            <div>
              <div className="sort-bar">
                <p className="sort-bar__count">
                  {sorted.length} {sorted.length === 1 ? 'producto' : 'productos'} encontrados
                </p>
                <label htmlFor="sort-select" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-small)', color: 'var(--color-muted)' }}>
                  Ordenar:
                  <select id="sort-select" className="sort-select" value={activeSort} onChange={handleSort}>
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </label>
              </div>

              {sorted.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-muted)' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginBottom: '8px' }}>Sin resultados</p>
                  <p style={{ fontSize: 'var(--text-body)', fontWeight: 300 }}>Probá con otros filtros</p>
                </div>
              ) : (
                <div className="products-grid" ref={gridRef}>
                  {sorted.map((product) => {
                    const imageUrl = product.variants[0]?.images[0] ?? '';
                    return (
                      <Link key={product.id} href={`/productos/${product.slug}`} className="product-card catalog-card" style={{ display: 'block' }}>
                        <div className="product-card__image-wrap">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={imgPath(imageUrl)} alt={product.name} loading="lazy" />
                          <div className="product-card__overlay" aria-hidden="true">
                            <span>Ver detalles</span>
                          </div>
                          <div className="product-card__badges">
                            <span className="badge badge-free-shipping">Envío gratis</span>
                            {product.featured && <span className="badge badge-sale">Destacado</span>}
                          </div>
                        </div>
                        <div className="product-card__body">
                          <p className="product-card__name">{product.name}</p>
                          <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', fontWeight: 300, marginBottom: '8px', lineHeight: 1.4 }}>
                            {product.shortDescription}
                          </p>
                          <p className="product-card__price">{formatPrice(product.basePrice)}</p>
                          <div className="product-card__swatches">
                            {product.variants.slice(0, 5).map((v) => (
                              <span
                                key={v.id}
                                className="product-card__swatch"
                                style={{ background: v.colorHex }}
                                title={v.color}
                              />
                            ))}
                            {product.variants.length > 5 && (
                              <span className="product-card__swatch-more">+{product.variants.length - 5}</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
