import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { getFeaturedProducts } from '@/lib/products';
import { formatCurrencyARS } from '@/lib/utils';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CUYUM Amoblamientos — Diseño a Tu Medida | Las Heras, Mendoza',
};

export default function HomePage() {
  const featuredProducts = getFeaturedProducts(6);

  return (
    <>
      <Header />
      <CartDrawer />

      <div className="page-content">
        {/* Hero */}
        <section className="hero">
          <div className="container">
            <p className="hero__eyebrow">Las Heras, Mendoza · Fabricación propia</p>
            <h1 className="hero__title">
              Tu local equipado.<br />Tu hogar transformado.
            </h1>
            <p className="hero__subtitle">
              Muebles comerciales y de hogar fabricados a medida en Mendoza. Mostradores,
              exhibidores, vitrinas y estanterías para tu negocio o espacio.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/productos" className="btn btn-dark">
                Ver Catálogo
              </Link>
              <a
                href="https://wa.me/542616918409?text=Hola%20CUYUM%2C%20quiero%20consultar%20sobre%20muebles%20a%20medida."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                Contactar
              </a>
            </div>
          </div>
        </section>

        {/* Info banners */}
        <section className="info-banners">
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 0,
              }}
            >
              {/* Envíos */}
              <div className="info-banner-item" style={{ borderLeft: 'none' }}>
                <div className="info-banner-icon">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <div>
                  <p className="info-banner-title">Envíos a Mendoza</p>
                  <p className="info-banner-desc">
                    Entregamos en toda la provincia. Flete incluido en pedidos de equipamiento
                    completo.
                  </p>
                </div>
              </div>

              {/* Financiamiento */}
              <div className="info-banner-item">
                <div className="info-banner-icon">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                </div>
                <div>
                  <p className="info-banner-title">Financiamiento Comercial</p>
                  <p className="info-banner-desc">
                    Cuotas diarias y semanales para comercios. Consultá nuestros planes de pago.
                  </p>
                </div>
              </div>

              {/* Sede */}
              <div className="info-banner-item">
                <div className="info-banner-icon">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <div>
                  <p className="info-banner-title">Sede en Las Heras</p>
                  <p className="info-banner-desc">
                    Visitanos y conocé nuestra fábrica. Atención personalizada de lunes a sábado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="section">
          <div className="container">
            <div style={{ marginBottom: '32px' }}>
              <p className="section-title">Productos Destacados</p>
              <span className="title-underline" />
              <p
                style={{
                  fontSize: 'var(--text-body)',
                  fontWeight: 300,
                  color: 'var(--color-muted)',
                  maxWidth: '520px',
                }}
              >
                Fabricados a medida en Las Heras, Mendoza. Diseños adaptables a cualquier espacio
                comercial o de hogar.
              </p>
            </div>

            <div className="products-grid">
              {featuredProducts.map((product) => {
                const firstVariant = product.variants[0];
                const imageUrl = firstVariant?.images[0] ?? '';

                return (
                  <Link
                    key={product.id}
                    href={`/productos/${product.slug}`}
                    className="product-card"
                    style={{ display: 'block' }}
                  >
                    <div className="product-card__image-wrap">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageUrl} alt={product.name} loading="lazy" />
                      <div className="product-card__badges">
                        <span className="badge badge-free-shipping">Envío gratis</span>
                        {product.featured && (
                          <span className="badge badge-sale">Destacado</span>
                        )}
                      </div>
                    </div>
                    <div className="product-card__body">
                      <p className="product-card__name">{product.name}</p>
                      <p
                        style={{
                          fontSize: 'var(--text-small)',
                          color: 'var(--color-muted)',
                          fontWeight: 300,
                          marginBottom: '8px',
                          lineHeight: 1.4,
                        }}
                      >
                        {product.shortDescription}
                      </p>
                      <p className="product-card__price">
                        {formatCurrencyARS(product.basePrice)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <Link href="/productos" className="btn btn-outline">
                Ver Catálogo Completo
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter / CTA */}
        <section className="newsletter-section">
          <div className="container">
            <h3>¿Listo para equipar tu local?</h3>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-body)',
                fontWeight: 300,
                color: 'var(--color-muted)',
                maxWidth: '480px',
                margin: '12px auto 28px',
              }}
            >
              Consultanos por WhatsApp y recibí tu presupuesto personalizado en minutos.
            </p>
            <a
              href="https://wa.me/542616918409?text=Hola%20CUYUM%2C%20quiero%20un%20presupuesto%20para%20equipar%20mi%20local."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-dark"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Consultar por WhatsApp
            </a>
          </div>
        </section>
      </div>

      {/* WhatsApp float */}
      <a
        href="https://wa.me/542616918409"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Contactar por WhatsApp"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      <Footer />
    </>
  );
}
