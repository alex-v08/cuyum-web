'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export function AnimatedBanners() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo('.info-banner-item',
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%' },
      }
    );
  }, { scope: ref });

  return (
    <section ref={ref} className="info-banners">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
          <div className="info-banner-item" style={{ borderLeft: 'none' }}>
            <div className="info-banner-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div>
              <p className="info-banner-title">Envíos a Mendoza</p>
              <p className="info-banner-desc">Entregamos en toda la provincia. Flete incluido en pedidos de equipamiento completo.</p>
            </div>
          </div>
          <div className="info-banner-item">
            <div className="info-banner-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            <div>
              <p className="info-banner-title">Financiamiento Comercial</p>
              <p className="info-banner-desc">Cuotas diarias y semanales para comercios. Consultá nuestros planes de pago.</p>
            </div>
          </div>
          <div className="info-banner-item">
            <div className="info-banner-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div>
              <p className="info-banner-title">Sede en Las Heras</p>
              <p className="info-banner-desc">Visitanos y conocé nuestra fábrica. Atención personalizada de lunes a sábado.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
