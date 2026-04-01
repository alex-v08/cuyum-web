'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo('.hero__eyebrow',
      { opacity: 0, y: -16 },
      { opacity: 1, y: 0, duration: 0.6 }
    )
    .fromTo('.hero__line',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 },
      '-=0.3'
    )
    .fromTo('.hero__subtitle',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.4'
    )
    .fromTo('.hero__cta',
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
      '-=0.3'
    );

    // Parallax: hero content scrolls slower than page
    gsap.to(ref.current, {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, { scope: ref });

  return (
    <section ref={ref} className="hero">
      <div className="container">
        <p className="hero__eyebrow">Las Heras, Mendoza · Fabricación propia</p>
        <h1 className="hero__title">
          <span className="hero__line" style={{ display: 'block' }}>Tu local equipado.</span>
          <span className="hero__line" style={{ display: 'block' }}>Tu hogar transformado.</span>
        </h1>
        <p className="hero__subtitle">
          Muebles comerciales y de hogar fabricados a medida en Mendoza. Mostradores,
          exhibidores, vitrinas y estanterías para tu negocio o espacio.
        </p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Link href="/productos" className="btn btn-dark hero__cta">
            Ver Catálogo
          </Link>
          <a
            href="https://wa.me/542616918409?text=Hola%20CUYUM%2C%20quiero%20consultar%20sobre%20muebles%20a%20medida."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline hero__cta"
          >
            Contactar
          </a>
        </div>
      </div>
    </section>
  );
}
