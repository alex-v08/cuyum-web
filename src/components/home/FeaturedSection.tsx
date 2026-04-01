'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { getFeaturedProducts } from '@/lib/products';
import { ProductCard } from '@/components/common/ProductCard';

gsap.registerPlugin(ScrollTrigger);

export function FeaturedSection() {
  const ref = useRef<HTMLElement>(null);
  const featuredProducts = getFeaturedProducts(6);

  useGSAP(
    () => {
      // Section header fade up
      gsap.fromTo(
        '.featured-header',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: ref.current, start: 'top 80%' },
        }
      );

      // Cards stagger in
      gsap.fromTo(
        '.featured-card',
        { opacity: 0, y: 48, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.featured-grid', start: 'top 85%' },
        }
      );
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="featured-section" aria-labelledby="featured-heading">
      <div className="container">
        {/* Header */}
        <div className="featured-section__header featured-header">
          <div>
            <h2 className="featured-section__title" id="featured-heading">
              Productos destacados
            </h2>
            <p className="featured-section__subtitle">
              Los más elegidos por nuestros clientes
            </p>
          </div>
          <Link href="/productos" className="featured-section__view-all">
            VER TODO EL CATÁLOGO
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Grid */}
        <div className="products-grid-m2 featured-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} extraClass="featured-card" />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link href="/productos" className="btn btn-outline">
            Ver catálogo completo
          </Link>
        </div>
      </div>
    </section>
  );
}
