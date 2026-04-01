'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/products';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { imgPath } from '@/lib/assetPath';

interface CustomerData {
  nombre: string;
  telefono: string;
  localidad: string;
  nota: string;
}

const PHONE_RE = /^[\d\s+\-]{7,15}$/;

function buildWhatsAppMessage(data: CustomerData, items: ReturnType<typeof useCart>['items'], total: number): string {
  const lines: string[] = [
    `Hola CUYUM, quiero hacer un pedido:`,
    ``,
    `*Mis datos:*`,
    `Nombre: ${data.nombre}`,
    `Teléfono: ${data.telefono}`,
    `Localidad: ${data.localidad}`,
    ``,
    `*Productos:*`,
  ];
  items.forEach((item) => {
    lines.push(`• ${item.productName} (${item.variantLabel}) x${item.quantity} — ${formatPrice(item.price * item.quantity)}`);
  });
  lines.push(``, `*Total referencial: ${formatPrice(total)}*`);
  if (data.nota.trim()) {
    lines.push(``, `*Nota:* ${data.nota.trim()}`);
  }
  return lines.join('\n');
}

export function CheckoutClient() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [data, setData] = useState<CustomerData>({ nombre: '', telefono: '', localidad: '', nota: '' });
  const [errors, setErrors] = useState<Partial<CustomerData>>({});

  const validate = useCallback(() => {
    const e: Partial<CustomerData> = {};
    if (!data.nombre.trim()) e.nombre = 'Ingresá tu nombre';
    if (!data.telefono.trim()) e.telefono = 'Ingresá tu teléfono';
    else if (!PHONE_RE.test(data.telefono.trim())) e.telefono = 'Formato inválido (ej: 261 691-8409)';
    if (!data.localidad.trim()) e.localidad = 'Ingresá tu localidad';
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [data]);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setStep(2);
  };

  const handleConfirm = () => {
    const message = buildWhatsAppMessage(data, items, totalPrice);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    clearCart();
    setStep(3);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (items.length === 0 && step !== 3) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '16px' }}>Tu carrito está vacío</p>
        <Link href="/productos" className="btn btn-dark">Ver Catálogo</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '40px' }}>
        {([1, 2, 3] as const).map((s, idx) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: step >= s ? 'var(--color-black)' : 'transparent',
                border: `1.5px solid ${step >= s ? 'var(--color-black)' : 'var(--color-border)'}`,
                color: step >= s ? 'var(--color-bg)' : 'var(--color-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {s}
            </div>
            {idx < 2 && (
              <div style={{ flex: 1, height: '1px', background: step > s ? 'var(--color-black)' : 'var(--color-border)' }} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1 — Datos */}
      {step === 1 && (
        <form onSubmit={handleStep1Submit} noValidate>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '24px' }}>Tus datos</h2>
          {(
            [
              { name: 'nombre', label: 'Nombre completo', type: 'text', placeholder: 'Ej: María García' },
              { name: 'telefono', label: 'Teléfono / WhatsApp', type: 'tel', placeholder: 'Ej: 261 691-8409' },
              { name: 'localidad', label: 'Localidad en Mendoza', type: 'text', placeholder: 'Ej: Las Heras, Ciudad, Godoy Cruz' },
            ] as { name: keyof CustomerData; label: string; type: string; placeholder: string }[]
          ).map((field) => (
            <div key={field.name} style={{ marginBottom: '20px' }}>
              <label
                htmlFor={field.name}
                style={{ display: 'block', fontSize: 'var(--text-small)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px', color: 'var(--color-muted)' }}
              >
                {field.label}
              </label>
              <input
                id={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={data[field.name]}
                onChange={(e) => { setData((d) => ({ ...d, [field.name]: e.target.value })); setErrors((er) => ({ ...er, [field.name]: undefined })); }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: `1px solid ${errors[field.name] ? '#c0392b' : 'var(--color-border)'}`,
                  borderRadius: 0,
                  fontSize: 'var(--text-body)',
                  fontFamily: 'var(--font-body)',
                  background: 'transparent',
                  color: 'var(--color-text)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {errors[field.name] && (
                <p style={{ color: '#c0392b', fontSize: '0.75rem', marginTop: '4px' }}>{errors[field.name]}</p>
              )}
            </div>
          ))}
          <button type="submit" className="btn btn-dark" style={{ width: '100%', marginTop: '8px' }}>
            Continuar →
          </button>
        </form>
      )}

      {/* Step 2 — Revisión */}
      {step === 2 && (
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '24px' }}>Revisá tu pedido</h2>
          <div style={{ border: '1px solid var(--color-border)', marginBottom: '24px' }}>
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                style={{ display: 'flex', gap: '16px', padding: '16px', borderBottom: '1px solid var(--color-border)' }}
              >
                {item.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imgPath(item.imageUrl)} alt={item.productName} style={{ width: '64px', height: '64px', objectFit: 'cover', flexShrink: 0 }} />
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 500, marginBottom: '2px' }}>{item.productName}</p>
                  <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-muted)', marginBottom: '4px' }}>{item.variantLabel} · Cant: {item.quantity}</p>
                  <p style={{ fontSize: 'var(--text-body)', fontWeight: 500 }}>{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
            <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.05em' }}>Total referencial</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600 }}>{formatPrice(totalPrice)}</span>
            </div>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="nota" style={{ display: 'block', fontSize: 'var(--text-small)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px', color: 'var(--color-muted)' }}>
              Nota o aclaración (opcional)
            </label>
            <textarea
              id="nota"
              value={data.nota}
              onChange={(e) => setData((d) => ({ ...d, nota: e.target.value }))}
              placeholder="Medidas especiales, colores, consultas..."
              rows={3}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid var(--color-border)',
                borderRadius: 0,
                fontSize: 'var(--text-body)',
                fontFamily: 'var(--font-body)',
                background: 'transparent',
                color: 'var(--color-text)',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setStep(1)} className="btn btn-outline" style={{ flex: 1 }}>
              ← Volver
            </button>
            <button onClick={handleConfirm} className="btn btn-dark" style={{ flex: 2 }}>
              Confirmar y enviar por WhatsApp
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Confirmación */}
      {step === 3 && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-black)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '12px' }}>¡Pedido enviado!</h2>
          <p style={{ color: 'var(--color-muted)', fontWeight: 300, maxWidth: '400px', margin: '0 auto 32px', lineHeight: 1.6 }}>
            Tu pedido fue enviado por WhatsApp. Te contactaremos a la brevedad para confirmar y coordinar la entrega.
          </p>
          <Link href="/productos" className="btn btn-dark">
            Seguir comprando
          </Link>
        </div>
      )}
    </div>
  );
}
