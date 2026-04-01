import { Suspense } from 'react';
import { ProductosCatalog } from './ProductosCatalog';

export const metadata = {
  title: 'Catálogo de Productos',
  description: 'Mostradores, exhibidores, vitrinas y estanterías a medida fabricados en Mendoza.',
};

export default function ProductosPage() {
  return (
    <Suspense fallback={
      <main>
        <section className="section">
          <div className="container">
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-muted)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Cargando catálogo…</p>
            </div>
          </div>
        </section>
      </main>
    }>
      <ProductosCatalog />
    </Suspense>
  );
}
