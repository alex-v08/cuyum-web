import { Suspense } from 'react';
import { CheckoutClient } from './CheckoutClient';

export const metadata = {
  title: 'Checkout — CUYUM Amoblamientos',
  description: 'Completá tu pedido y recibí confirmación por WhatsApp.',
};

export default function CheckoutPage() {
  return (
    <main>
      <section className="section">
        <div className="container">
          <div style={{ marginBottom: '32px' }}>
            <h1 className="section-title">Checkout</h1>
            <span className="title-underline" />
          </div>
          <Suspense fallback={
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-muted)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Cargando…</p>
            </div>
          }>
            <CheckoutClient />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
