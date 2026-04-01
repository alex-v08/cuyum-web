'use client';

import { useRef } from 'react';
import Link from 'next/link';

interface CategorySlide {
  image: string;
  label: string;
  href: string;
}

const SLIDES: CategorySlide[] = [
  { image: '/images/2026-03-12_21-12-42_UTC.jpg', label: 'Mostradores', href: '/productos?categoria=mostradores' },
  { image: '/images/2026-03-04_00-19-38_UTC.jpg', label: 'Exhibidores', href: '/productos?categoria=exhibidores' },
  { image: '/images/2026-03-04_13-48-03_UTC.jpg', label: 'Vitrinas', href: '/productos?categoria=vitrinas' },
  { image: '/images/2026-03-05_01-30-59_UTC.jpg', label: 'Estanterías', href: '/productos?categoria=estanterias' },
  { image: '/images/2026-03-09_01-16-40_UTC.jpg', label: 'Góndolas', href: '/productos?categoria=gondolas' },
  { image: '/images/2026-03-16_21-12-53_UTC.jpg', label: 'Hogar', href: '/productos?categoria=hogar' },
  { image: '/images/2026-03-10_01-42-11_UTC.jpg', label: 'A Medida', href: '/productos' },
];

export function CategoryCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'prev' | 'next') => {
    const track = trackRef.current;
    if (!track) return;
    const slideWidth = track.firstElementChild
      ? (track.firstElementChild as HTMLElement).offsetWidth + 16
      : 260;
    track.scrollBy({ left: dir === 'next' ? slideWidth * 2 : -slideWidth * 2, behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: '16px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          paddingBottom: '4px',
        }}
      >
        {SLIDES.map((slide) => (
          <Link
            key={slide.href + slide.label}
            href={slide.href}
            style={{
              flex: '0 0 220px',
              scrollSnapAlign: 'start',
              display: 'block',
              position: 'relative',
              borderRadius: 0,
              overflow: 'hidden',
              aspectRatio: '9/16',
              background: '#111',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.image}
              alt={slide.label}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.85 }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)',
              }}
            />
            <span
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '16px',
                right: '16px',
                fontFamily: 'var(--font-display)',
                fontSize: '1.2rem',
                fontWeight: 600,
                color: '#fff',
                letterSpacing: '0.04em',
              }}
            >
              {slide.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Prev */}
      <button
        onClick={() => scroll('prev')}
        aria-label="Anterior"
        style={{
          position: 'absolute',
          left: '-16px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'var(--color-black)',
          color: 'var(--color-bg)',
          border: 'none',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 2,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Next */}
      <button
        onClick={() => scroll('next')}
        aria-label="Siguiente"
        style={{
          position: 'absolute',
          right: '-16px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'var(--color-black)',
          color: 'var(--color-bg)',
          border: 'none',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 2,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
