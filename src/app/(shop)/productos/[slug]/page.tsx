import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { products } from '@/data/products';
import { getProductBySlug, getRelatedProducts, formatPrice } from '@/lib/products';
import { imgPath } from '@/lib/assetPath';
import { ProductDetailClient } from '@/components/product/ProductDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: 'Producto no encontrado' };

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | CUYUM Amoblamientos`,
      description: product.shortDescription,
      images: product.variants[0]?.images[0]
        ? [{ url: product.variants[0].images[0] }]
        : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const related = getRelatedProducts(product, 4);

  return (
    <main>
      <section className="section">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Inicio</Link>
            <span className="breadcrumb-sep">/</span>
            <Link href="/productos">Productos</Link>
            <span className="breadcrumb-sep">/</span>
            <span>{product.name}</span>
          </nav>

          {/* Product detail */}
          <ProductDetailClient product={product} />
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="section" style={{ borderTop: '1px solid rgba(28,28,26,0.08)' }}>
          <div className="container">
            <div style={{ marginBottom: '28px' }}>
              <p className="section-title">Productos relacionados</p>
              <span className="title-underline" />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 'var(--gutter)',
              }}
            >
              {related.map((rel) => {
                const firstVariant = rel.variants[0];
                const imageUrl = firstVariant?.images[0] ?? '';

                return (
                  <Link
                    key={rel.id}
                    href={`/productos/${rel.slug}`}
                    className="product-card"
                    style={{ display: 'block' }}
                  >
                    <div className="product-card__image-wrap">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imgPath(imageUrl)} alt={rel.name} loading="lazy" />
                      <div className="product-card__badges">
                        <span className="badge badge-free-shipping">Envío gratis</span>
                      </div>
                    </div>
                    <div className="product-card__body">
                      <p className="product-card__name">{rel.name}</p>
                      <p className="product-card__price">{formatPrice(rel.basePrice)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
