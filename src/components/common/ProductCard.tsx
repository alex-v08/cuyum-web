'use client';

import Link from 'next/link';
import { imgPath } from '@/lib/assetPath';
import type { Product } from '@/types/product.types';

interface ProductCardProps {
  product: Product;
  className?: string;
  /** Additional CSS class applied to the wrapping anchor (e.g. for GSAP targeting) */
  extraClass?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  mostradores: 'Mostradores',
  exhibidores: 'Exhibidores',
  vitrinas: 'Vitrinas',
  estanterias: 'Estanterías',
  gondolas: 'Góndolas',
  mesas: 'Mesas',
  hogar: 'Hogar',
};

function formatARS(amount: number): string {
  return amount.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function ProductCard({ product, extraClass = '' }: ProductCardProps) {
  const firstVariant = product.variants[0];
  const imageUrl = firstVariant?.images[0] ?? '';
  const inStock = product.variants.some((v) => v.inStock);
  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category;

  // WhatsApp pre-filled message
  const waText = encodeURIComponent(
    `Hola! Me interesa el producto "${product.name}". ¿Podrían darme más información?`
  );
  const waUrl = `https://wa.me/542616918409?text=${waText}`;

  return (
    <article
      className={`product-card-m2 ${extraClass}`.trim()}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {/* Image */}
      <Link
        href={`/productos/${product.slug}`}
        className="product-card-m2__image-wrap"
        tabIndex={-1}
        aria-hidden="true"
        style={{ display: 'block' }}
      >
        {/* Category badge */}
        <span className="product-card-m2__category-badge">{categoryLabel}</span>

        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imgPath(imageUrl)} alt={product.name} loading="lazy" />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'var(--color-surface-container-high)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '48px', color: 'var(--color-outline-variant)' }}
            >
              image
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="product-card-m2__image-overlay" aria-hidden="true">
          <span>Ver producto</span>
        </div>
      </Link>

      {/* Body */}
      <div className="product-card-m2__body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Name */}
        <Link href={`/productos/${product.slug}`} style={{ textDecoration: 'none' }}>
          <h3 className="product-card-m2__name">{product.name}</h3>
        </Link>

        {/* Color swatches */}
        {product.variants.length > 0 && (
          <div className="product-card-m2__swatches">
            {product.variants.slice(0, 5).map((v, i) => (
              <span
                key={v.id}
                className={`product-card-m2__swatch${i === 0 ? ' product-card-m2__swatch--active' : ''}`}
                style={{ background: v.colorHex }}
                title={v.color}
                aria-label={v.color}
              />
            ))}
            {product.variants.length > 5 && (
              <span className="product-card-m2__swatch-more">
                +{product.variants.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Pricing */}
        <div className="product-card-m2__pricing">
          <p className="product-card-m2__price-financed">
            Financiado {formatARS(Math.round(product.basePrice * 1.3))}
          </p>
          <p className="product-card-m2__price-cash">
            Contado {formatARS(product.basePrice)}
          </p>
        </div>

        {/* Stock badge */}
        <div
          className={`product-card-m2__stock-badge ${inStock ? 'stock-available' : 'stock-order'}`}
        >
          <span className="dot" />
          {inStock
            ? 'En stock'
            : `A pedido · ${product.leadTimeDays} días`}
        </div>

        {/* WhatsApp CTA — pushed to bottom */}
        <div style={{ marginTop: 'auto' }}>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-tonal"
            style={{ width: '100%', justifyContent: 'center', padding: '12px 16px' }}
            aria-label={`Consultar por WhatsApp sobre ${product.name}`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              chat
            </span>
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
