import Link from 'next/link';

const WA_BASE = 'https://wa.me/542616918409';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-m2" aria-label="Pie de página">
      <div className="container">
        <div className="footer-m2__grid">
          {/* Col 1 — Brand */}
          <div>
            <div className="footer-m2__logo">CUYUM</div>
            <p className="footer-m2__tagline">
              Fábrica de muebles comerciales a medida. Paneras, mostradores, vitrinas y
              exhibidores con calidad mendocina.
            </p>
            <div className="footer-m2__socials">
              {/* Instagram */}
              <a
                href="https://instagram.com/cuyum.amoblamientos"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-m2__social-link"
                aria-label="Instagram de CUYUM"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com/cuyum.amoblamientos"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-m2__social-link"
                aria-label="Facebook de CUYUM"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href={WA_BASE}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-m2__social-link"
                aria-label="WhatsApp de CUYUM"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2 — Productos */}
          <div>
            <p className="footer-m2__col-title">Productos</p>
            <ul className="footer-m2__links">
              <li><Link href="/productos?categoria=mostradores">Mostradores</Link></li>
              <li><Link href="/productos?categoria=exhibidores">Exhibidores</Link></li>
              <li><Link href="/productos?categoria=vitrinas">Vitrinas</Link></li>
              <li><Link href="/productos?categoria=estanterias">Estanterías</Link></li>
              <li><Link href="/productos?categoria=gondolas">Góndolas</Link></li>
              <li><Link href="/productos">Ver todo</Link></li>
            </ul>
          </div>

          {/* Col 3 — Empresa */}
          <div>
            <p className="footer-m2__col-title">Empresa</p>
            <ul className="footer-m2__links">
              <li><Link href="/">Inicio</Link></li>
              <li><Link href="/#nosotros">Nosotros</Link></li>
              <li>
                <a
                  href={`${WA_BASE}?text=Hola%20CUYUM%2C%20quiero%20informaci%C3%B3n%20sobre%20financiamiento`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Financiamiento
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4 — Contacto */}
          <div>
            <p className="footer-m2__col-title">Contacto</p>
            <ul className="footer-m2__links">
              <li>
                <a href={WA_BASE} target="_blank" rel="noopener noreferrer">
                  +54 261 691-8409
                </a>
              </li>
              <li><span>Las Heras, Mendoza</span></li>
              <li><span>Argentina</span></li>
              <li style={{ marginTop: '16px' }}>
                <a
                  href={`${WA_BASE}?text=Hola%20CUYUM%2C%20quiero%20un%20presupuesto`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-tonal"
                  style={{ fontSize: '0.65rem', padding: '10px 18px' }}
                >
                  Pedir presupuesto
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-m2__bottom">
          <span>© {year} CUYUM Muebles Comerciales. Todos los derechos reservados.</span>
          <span>Hecho en Mendoza 🍇</span>
        </div>
      </div>
    </footer>
  );
}
