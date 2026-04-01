'use client';

import { useState, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import { buildProductWhatsAppURL } from '@/lib/whatsapp';
import { formatCurrencyARS } from '@/lib/utils';
import { imgPath } from '@/lib/assetPath';
import type { Product, Variant } from '@/types/product.types';

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem, openCart } = useCart();

  const [selectedVariant, setSelectedVariant] = useState<Variant>(product.variants[0]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = selectedVariant.images;
  const activeImage = images[activeImageIndex] ?? images[0] ?? '';

  const handleVariantChange = useCallback(
    (variant: Variant) => {
      setSelectedVariant(variant);
      setActiveImageIndex(0);
    },
    []
  );

  const handleAddToCart = useCallback(() => {
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      quantity: 1,
      productName: product.name,
      variantLabel: `${selectedVariant.material} ${selectedVariant.color}`,
      price: product.basePrice + selectedVariant.priceModifier,
      imageUrl: selectedVariant.images[0] ?? '',
    });
    openCart();
  }, [addItem, openCart, product, selectedVariant]);

  const handleWhatsApp = useCallback(() => {
    const url = buildProductWhatsAppURL(
      product.name,
      `${selectedVariant.material} ${selectedVariant.color}`,
      product.leadTimeDays
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [product, selectedVariant]);

  const currentPrice = product.basePrice + selectedVariant.priceModifier;

  // Group variants by material for display
  const materials = Array.from(new Set(product.variants.map((v) => v.material)));

  return (
    <div className="product-detail-grid">
      {/* Gallery */}
      <div>
        <div className="gallery-main">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgPath(activeImage)}
            alt={`${product.name} — ${selectedVariant.color}`}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        </div>
        {images.length > 1 && (
          <div className="gallery-thumbs">
            {images.map((img, i) => (
              <button
                key={i}
                className={`gallery-thumb${i === activeImageIndex ? ' active' : ''}`}
                onClick={() => setActiveImageIndex(i)}
                aria-label={`Ver imagen ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgPath(img)}
                  alt={`${product.name} imagen ${i + 1}`}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <h1 className="product-info__name">{product.name}</h1>
        <p className="product-info__price">{formatCurrencyARS(currentPrice)}</p>

        <p
          style={{
            fontSize: 'var(--text-body)',
            fontWeight: 300,
            color: 'var(--color-muted)',
            marginBottom: '24px',
            lineHeight: 1.7,
          }}
        >
          {product.shortDescription}
        </p>

        {/* Variant selector — by material */}
        {materials.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <span className="variant-label">Material</span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {materials.map((mat) => {
                const isSelected = selectedVariant.material === mat;
                return (
                  <button
                    key={mat}
                    className={`variant-option${isSelected ? ' selected' : ''}`}
                    onClick={() => {
                      const variant = product.variants.find((v) => v.material === mat);
                      if (variant) handleVariantChange(variant);
                    }}
                  >
                    {mat}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Color selector */}
        {product.variants.filter((v) => v.material === selectedVariant.material).length > 1 && (
          <div style={{ marginBottom: '24px' }}>
            <span className="variant-label">Color</span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {product.variants
                .filter((v) => v.material === selectedVariant.material)
                .map((variant) => {
                  const isSelected = selectedVariant.id === variant.id;
                  return (
                    <button
                      key={variant.id}
                      className={`variant-option${isSelected ? ' selected' : ''}`}
                      onClick={() => handleVariantChange(variant)}
                      title={variant.color}
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: variant.colorHex,
                          border: '1px solid rgba(0,0,0,0.15)',
                          marginRight: '6px',
                          verticalAlign: 'middle',
                        }}
                      />
                      {variant.color}
                    </button>
                  );
                })}
            </div>
          </div>
        )}

        {/* CTA buttons */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '28px',
          }}
        >
          <button
            onClick={handleAddToCart}
            className="btn btn-dark"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={!selectedVariant.inStock}
          >
            {selectedVariant.inStock ? 'Agregar al carrito' : 'Sin stock'}
          </button>
          <button
            onClick={handleWhatsApp}
            className="btn btn-whatsapp"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Consultar por WhatsApp
          </button>
        </div>

        {/* Specs table */}
        <div style={{ marginBottom: '24px' }}>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-nav)',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Especificaciones
          </p>
          <table className="spec-table">
            <tbody>
              <tr>
                <td>Material</td>
                <td>{selectedVariant.material}</td>
              </tr>
              <tr>
                <td>Color</td>
                <td>{selectedVariant.color}</td>
              </tr>
              <tr>
                <td>Ancho</td>
                <td>{product.dimensions.width}</td>
              </tr>
              <tr>
                <td>Alto</td>
                <td>{product.dimensions.height}</td>
              </tr>
              <tr>
                <td>Profundidad</td>
                <td>{product.dimensions.depth}</td>
              </tr>
              <tr>
                <td>Peso aprox.</td>
                <td>{product.weightKg} kg</td>
              </tr>
              <tr>
                <td>Tiempo fabricación</td>
                <td>{product.leadTimeDays} días hábiles</td>
              </tr>
              <tr>
                <td>SKU</td>
                <td
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    color: 'var(--color-muted)',
                  }}
                >
                  {selectedVariant.sku}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Description */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-nav)',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            Descripción
          </p>
          <p
            style={{
              fontSize: 'var(--text-body)',
              fontWeight: 300,
              color: 'var(--color-black)',
              lineHeight: 1.7,
            }}
          >
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}
