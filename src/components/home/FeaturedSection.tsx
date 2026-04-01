'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { getFeaturedProducts } from '@/lib/products';
import { formatCurrencyARS } from '@/lib/utils';
import { imgPath } from '@/lib/assetPath';

gsap.registerPlugin(ScrollTrigger);

export function FeaturedSection() {
  const ref = useRef<HTMLElement>(null);
  const featuredProducts = getFeaturedProducts(6);

  useGSAP(() => {
    // Title underline grows in
    gsap.fromTo('.featured-underline',
      { scaleX: 0, transformOrigin: 'left center' },
      {
        scaleX: 1, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      }
    );
    // Section title fade up
    gsap.fromTo('.featured-title',
      { opacity: 0, y: 24 },
      {
        opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      }
    );
    // Cards stagger
    gsap.fromTo('.featured-card',
      { opacity: 0, y: 50, scale: 0.97 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.65, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.featured-grid', start: 'top 85%' },
      }
    );

    // Hover overlay reveal per card
    const cards = ref.current?.querySelectorAll('.featured-card');
    cards?.forEach((card) => {
      const overlay = card.querySelector('.product-card__overlay');
      if (!overlay) return;
      card.addEventListener('mouseenter', () => {
        gsap.to(overlay, { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(overlay, { opacity: 0, y: 8, duration: 0.22, ease: 'power2.in' });
      });
    });
  }, { scope: ref });

  return (
    <section ref={ref} className="section">
      <div className="container">
        <div style={{ marginBottom: '32px' }}>
          <p className="section-title featured-title">Productos Destacados</p>
          <span className="title-underline featured-underline" />
          <p style={{ fontSize: 'var(--text-body)', fontWeight: 300, color: 'var(--color-muted)', maxWidth: '520px' }}>
            Fabricados a medida en Las Heras, Mendoza. Diseños adaptables a cualquier espacio.
          </p>
        </div>
        <div className="products-grid featured-grid">
          {featuredProducts.map((product) => {
            const imageUrl = product.variants[0]?.images[0] ?? '';
            return (
              <Link key={product.id} href={`/productos/${product.slug}`} className="product-card featured-card" style={{ display: 'block' }}>
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
                  <p className="product-card__price">{formatCurrencyARS(product.basePrice)}</p>
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
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/productos" className="btn btn-outline">Ver Catálogo Completo</Link>
        </div>
      </div>
    </section>
  );
}
