'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { imgPath } from '@/lib/assetPath';

gsap.registerPlugin(ScrollTrigger);

const WHATSAPP_URL =
  'https://wa.me/542616918409?text=Hola%20CUYUM%2C%20quiero%20consultar%20sobre%20muebles%20comerciales.';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.to('.hero__eyebrow', { opacity: 1, y: 0, duration: 0.7 })
        .to('.hero__line', { opacity: 1, y: 0, duration: 0.8, stagger: 0.18 }, '-=0.35')
        .to('.hero__subtitle', { opacity: 1, y: 0, duration: 0.7 }, '-=0.45')
        .to('.hero__ctas', { opacity: 1, y: 0, duration: 0.6 }, '-=0.35');

      // Parallax: hero image scrolls at a slower rate (depth cue)
      gsap.to('.hero__bg img', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="hero" aria-label="Sección principal">
      {/* Background image with parallax */}
      <div className="hero__bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgPath('/images/hero-bg.jpg')}
          alt="Interior de local comercial con muebles artesanales"
          fetchPriority="high"
          style={{ transform: 'scale(1.12)', transformOrigin: 'center center' }}
          onError={(e) => {
            // Fallback to a CSS gradient if image is missing
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="hero__overlay" />
      </div>

      {/* Content */}
      <div className="container">
        <div className="hero__content">
          <p
            className="hero__eyebrow"
            style={{ transform: 'translateY(-16px)' }}
          >
            Fabricación artesanal · Mendoza, Argentina
          </p>

          <h1 className="hero__title">
            <span
              className="hero__line"
              style={{ transform: 'translateY(40px)' }}
            >
              Equipá tu local
            </span>
            <span
              className="hero__line"
              style={{ transform: 'translateY(40px)' }}
            >
              con muebles que duran
            </span>
          </h1>

          <p
            className="hero__subtitle"
            style={{ transform: 'translateY(20px)' }}
          >
            Paneras, mostradores, vitrinas y exhibidores a medida para tu negocio.
            Calidad mendocina en cada detalle.
          </p>

          <div
            className="hero__ctas"
            style={{ transform: 'translateY(16px)' }}
          >
            <Link href="/productos" className="btn btn-primary">
              Ver catálogo
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-white"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                style={{ flexShrink: 0 }}
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll-indicator" aria-hidden="true">
        <span className="material-symbols-outlined" style={{ fontSize: '36px' }}>
          expand_more
        </span>
      </div>
    </section>
  );
}
