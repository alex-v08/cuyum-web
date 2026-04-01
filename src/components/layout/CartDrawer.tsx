'use client';

import { useCart } from '@/context/CartContext';
import { formatCurrencyARS } from '@/lib/utils';
import { buildCartWhatsAppURL } from '@/lib/whatsapp';
import Image from 'next/image';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, totalPrice } =
    useCart();

  const handleWhatsApp = () => {
    if (items.length === 0) return;
    const url = buildCartWhatsAppURL(
      items.map((i) => ({
        productName: i.productName,
        variantLabel: i.variantLabel,
        quantity: i.quantity,
      }))
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div
        className={`cart-overlay${isOpen ? ' open' : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <div
        className={`cart-drawer${isOpen ? ' open' : ''}`}
        role="dialog"
        aria-label="Carrito de consultas"
        aria-modal="true"
      >
        {/* Header */}
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">Consultas ({totalItems})</h2>
          <button
            onClick={closeCart}
            aria-label="Cerrar carrito"
            style={{ color: 'var(--color-black)', display: 'flex', padding: '4px' }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="cart-drawer__body">
          {items.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '48px 0',
                color: 'var(--color-muted)',
              }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                style={{ margin: '0 auto 16px', opacity: 0.3 }}
                aria-hidden="true"
              >
                <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  marginBottom: '8px',
                }}
              >
                Sin productos
              </p>
              <p style={{ fontSize: 'var(--text-body)', fontWeight: 300 }}>
                Agregá productos para consultar
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} className="cart-item">
                <div className="cart-item__image">
                  <Image
                    src={item.imageUrl}
                    alt={item.productName}
                    width={80}
                    height={80}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 'var(--text-body)',
                      fontWeight: 400,
                      marginBottom: '2px',
                    }}
                  >
                    {item.productName}
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--text-small)',
                      color: 'var(--color-muted)',
                      marginBottom: '8px',
                    }}
                  >
                    {item.variantLabel}
                  </p>
                  <div className="qty-control">
                    <button
                      className="qty-btn"
                      onClick={() =>
                        updateQuantity(item.productId, item.variantId, item.quantity - 1)
                      }
                      aria-label="Reducir cantidad"
                    >
                      −
                    </button>
                    <span className="qty-value" aria-label={`Cantidad: ${item.quantity}`}>
                      {item.quantity}
                    </span>
                    <button
                      className="qty-btn"
                      onClick={() =>
                        updateQuantity(item.productId, item.variantId, item.quantity + 1)
                      }
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '8px',
                  }}
                >
                  <span style={{ fontSize: 'var(--text-body)', fontWeight: 500 }}>
                    {formatCurrencyARS(item.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeItem(item.productId, item.variantId)}
                    style={{ color: 'var(--color-muted)', fontSize: 'var(--text-small)' }}
                    aria-label={`Eliminar ${item.productName}`}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-drawer__footer">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                Total referencial
              </span>
              <span style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                {formatCurrencyARS(totalPrice)}
              </span>
            </div>
            <button
              onClick={handleWhatsApp}
              className="btn btn-whatsapp"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Consultar por WhatsApp
            </button>
            <p
              style={{
                textAlign: 'center',
                fontSize: 'var(--text-small)',
                color: 'var(--color-muted)',
                marginTop: '8px',
                fontWeight: 300,
              }}
            >
              Los precios son de referencia. Sujeto a disponibilidad.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
