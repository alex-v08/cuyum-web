'use client';

import { useState, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
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
  const [imageLoaded, setImageLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const images = selectedVariant.images;
  const activeImage = images[activeImageIndex] ?? images[0] ?? '';

  // Entrance animation on mount
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      galleryRef.current,
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 0.9 }
    ).fromTo(
      infoRef.current,
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 0.9 },
      '-=0.7'
    ).fromTo(
      '.pd-stagger',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
      '-=0.6'
    );
  }, { scope: containerRef });

  // Crossfade when switching images
  const switchImage = useCallback((index: number) => {
    if (index === activeImageIndex) return;
    gsap.to(imgRef.current, {
      opacity: 0, scale: 0.97, duration: 0.18, ease: 'power2.in',
      onComplete: () => {
        setActiveImageIndex(index);
        setImageLoaded(false);
        gsap.fromTo(imgRef.current,
          { opacity: 0, scale: 1.03 },
          { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' }
        );
      }
    });
  }, [activeImageIndex]);

  const handleVariantChange = useCallback((variant: Variant) => {
    setSelectedVariant(variant);
    setActiveImageIndex(0);
    gsap.fromTo(imgRef.current,
      { opacity: 0, scale: 1.04 },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
    );
  }, []);

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
  const materials = Array.from(new Set(product.variants.map((v) => v.material)));

  return (
    <div ref={containerRef} className="pd-container">
      {/* Gallery */}
      <div ref={galleryRef} className="pd-gallery">
        <div className="pd-gallery__main">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={imgPath(activeImage)}
            alt={`${product.name} — ${selectedVariant.color}`}
            onLoad={() => setImageLoaded(true)}
            style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
          />
          {/* Badge overlay */}
          <div className="pd-gallery__badge">
            <span>A medida</span>
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="pd-gallery__thumbs">
            {images.map((img, i) => (
              <button
                key={i}
                className={`pd-gallery__thumb${i === activeImageIndex ? ' active' : ''}`}
                onClick={() => switchImage(i)}
                aria-label={`Ver imagen ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgPath(img)} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info panel */}
      <div ref={infoRef} className="pd-info">
        {/* Category tag */}
        <p className="pd-stagger pd-info__tag">{product.category}</p>

        {/* Name */}
        <h1 className="pd-stagger pd-info__name">{product.name}</h1>

        {/* Price block */}
        <div className="pd-stagger pd-info__price-block">
          <span className="pd-info__price">{formatCurrencyARS(currentPrice)}</span>
          <span className="pd-info__price-label">Precio referencial · A medida</span>
        </div>

        <p className="pd-stagger pd-info__desc">{product.shortDescription}</p>

        {/* Divider */}
        <div className="pd-stagger pd-divider" />

        {/* Material selector */}
        {materials.length > 0 && (
          <div className="pd-stagger pd-info__variants">
            <span className="pd-info__variant-label">Material</span>
            <div className="pd-info__variant-options">
              {materials.map((mat) => (
                <button
                  key={mat}
                  className={`pd-variant-btn${selectedVariant.material === mat ? ' active' : ''}`}
                  onClick={() => {
                    const v = product.variants.find((v) => v.material === mat);
                    if (v) handleVariantChange(v);
                  }}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CTA buttons */}
        <div className="pd-stagger pd-info__ctas">
          <button
            onClick={handleAddToCart}
            className="pd-btn pd-btn--dark"
            disabled={!selectedVariant.inStock}
          >
            {selectedVariant.inStock ? 'Agregar al carrito' : 'Sin stock'}
          </button>
          <button onClick={handleWhatsApp} className="pd-btn pd-btn--wa">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Consultar por WhatsApp
          </button>
        </div>

        {/* Divider */}
        <div className="pd-stagger pd-divider" />

        {/* Specs */}
        <div className="pd-stagger pd-specs">
          <p className="pd-specs__title">Especificaciones</p>
          <dl className="pd-specs__list">
            {[
              ['Material', selectedVariant.material],
              ['Color', selectedVariant.color],
              ['Ancho', product.dimensions.width],
              ['Alto', product.dimensions.height],
              ['Profundidad', product.dimensions.depth],
              ['Fabricación', `${product.leadTimeDays} días hábiles`],
            ].map(([label, value]) => (
              <div key={label} className="pd-specs__row">
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Description */}
        <div className="pd-stagger pd-desc">
          <p className="pd-specs__title">Descripción</p>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
}
