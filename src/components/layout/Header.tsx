'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

const NAV_LINKS = [
  { href: '/', label: 'INICIO' },
  { href: '/productos', label: 'CATÁLOGO' },
  { href: '/#nosotros', label: 'NOSOTROS' },
  { href: 'https://wa.me/542616918409', label: 'CONTACTO', external: true },
];

export function Header() {
  const { totalItems, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile nav on resize above breakpoint
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Prevent body scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header__inner">
            {/* Logo */}
            <Link
              href="/"
              aria-label="CUYUM Muebles Comerciales — Inicio"
              style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none' }}
            >
              <span className="header__logo-wordmark">CUYUM</span>
              <span className="header__logo-sub">Muebles Comerciales</span>
            </Link>

            {/* Desktop Nav */}
            <nav aria-label="Navegación principal">
              <ul className="header__nav">
                {NAV_LINKS.map((link) =>
                  link.external ? (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="header__nav-link"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.href}>
                      <Link href={link.href} className="header__nav-link">
                        {link.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </nav>

            {/* Actions */}
            <div className="header__actions">
              {/* Cart */}
              <button
                onClick={openCart}
                className="header__icon-btn"
                aria-label={`Carrito (${totalItems} ${totalItems === 1 ? 'item' : 'items'})`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                  shopping_cart
                </span>
                {totalItems > 0 && (
                  <span className="cart-badge" aria-hidden="true">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>

              {/* Hamburger — mobile only */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={menuOpen}
                className="hamburger-btn"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                  {menuOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer nav */}
      <nav
        className={`mobile-nav${menuOpen ? ' open' : ''}`}
        aria-label="Menú móvil"
        aria-hidden={!menuOpen}
      >
        {NAV_LINKS.map((link) =>
          link.external ? (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-nav-link"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              className="mobile-nav-link"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          )
        )}

        {/* Mobile cart CTA */}
        <button
          onClick={() => { setMenuOpen(false); openCart(); }}
          className="mobile-nav-link"
          style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}
          aria-label={`Abrir carrito (${totalItems} items)`}
        >
          CARRITO {totalItems > 0 && `(${totalItems})`}
        </button>
      </nav>
    </>
  );
}
