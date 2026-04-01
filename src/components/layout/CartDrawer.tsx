'use client';

import { useCart } from '@/context/CartContext';
import { formatCurrencyARS } from '@/lib/utils';
import { buildCartWhatsAppURL } from '@/lib/whatsapp';
import Image from 'next/image';
import Link from 'next/link';

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
      {/* Backdrop overlay */}
      <div
        className={`cart-overlay${isOpen ? ' open' : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`cart-drawer${isOpen ? ' open' : ''}`}
        role="dialog"
        aria-label="Carrito de consultas"
        aria-modal="true"
      >
        {/* Header */}
        <header className="cart-drawer__header">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
            <h2 className="cart-drawer__title">Tu pedido</h2>
            <span className="cart-drawer__count">
              ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </span>
          </div>
          <button
            onClick={closeCart}
            aria-label="Cerrar carrito"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              borderRadius: '4px',
              color: 'var(--color-on-surface)',
              transition: 'background var(--transition-fast)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-surface-container-high)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
              close
            </span>
          </button>
        </header>

        {/* Body */}
        {items.length === 0 ? (
          /* Empty state */
          <div className="cart-empty-state">
            <div className="cart-empty-state__icon-wrap">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '52px', color: 'var(--color-outline-variant)' }}
              >
                shopping_bag
              </span>
            </div>
            <h3>Tu carrito está vacío</h3>
            <p>Aún no seleccionaste ninguna pieza para tu espacio.</p>
            <Link
              href="/productos"
              onClick={closeCart}
              className="btn btn-primary"
              style={{ marginTop: '8px', fontSize: '0.75rem' }}
            >
              VER CATÁLOGO
            </Link>
          </div>
        ) : (
          <div className="cart-drawer__body">
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} className="cart-item-m2">
                {/* Thumbnail */}
                <div className="cart-item-m2__image">
                  <Image
                    src={item.imageUrl}
                    alt={item.productName}
                    width={80}
                    height={80}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </div>

                {/* Info */}
                <div className="cart-item-m2__info">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p className="cart-item-m2__name">{item.productName}</p>
                      <p className="cart-item-m2__variant">{item.variantLabel}</p>
                    </div>
                    <button
                      className="cart-item-m2__delete"
                      onClick={() => removeItem(item.productId, item.variantId)}
                      aria-label={`Eliminar ${item.productName}`}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                        delete
                      </span>
                    </button>
                  </div>

                  <div className="cart-item-m2__bottom">
                    {/* Quantity selector */}
                    <div className="qty-control-m2">
                      <button
                        className="qty-btn-m2"
                        onClick={() =>
                          updateQuantity(item.productId, item.variantId, item.quantity - 1)
                        }
                        aria-label="Reducir cantidad"
                      >
                        −
                      </button>
                      <span
                        className="qty-value-m2"
                        aria-label={`Cantidad: ${item.quantity}`}
                      >
                        {item.quantity}
                      </span>
                      <button
                        className="qty-btn-m2"
                        onClick={() =>
                          updateQuantity(item.productId, item.variantId, item.quantity + 1)
                        }
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>

                    <p className="cart-item-m2__price">
                      {formatCurrencyARS(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer — only when items exist */}
        {items.length > 0 && (
          <footer className="cart-drawer__footer">
            {/* Subtotal */}
            <div className="cart-drawer__subtotal">
              <span className="cart-drawer__subtotal-label">Subtotal Estimado</span>
              <span className="cart-drawer__subtotal-value">
                {formatCurrencyARS(totalPrice)}
              </span>
            </div>

            {/* Disclaimer */}
            <div className="cart-drawer__disclaimer">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '18px', color: 'var(--color-primary-container)', flexShrink: 0 }}
              >
                info
              </span>
              <p>
                Los precios son orientativos. El precio final se confirma por WhatsApp
                considerando costos de envío y disponibilidad de materiales.
              </p>
            </div>

            {/* WhatsApp CTA */}
            <button
              onClick={handleWhatsApp}
              className="btn btn-whatsapp"
              style={{ width: '100%', justifyContent: 'center', gap: '10px', padding: '16px 24px' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Enviar pedido por WhatsApp
            </button>

            {/* Continue shopping */}
            <button
              onClick={closeCart}
              style={{
                textAlign: 'center',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-label)',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-on-surface-variant)',
                padding: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                transition: 'color var(--transition-fast)',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-on-surface)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-on-surface-variant)'; }}
            >
              Seguir comprando
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}
