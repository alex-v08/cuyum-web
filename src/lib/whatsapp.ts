import { WHATSAPP_NUMBER, MAX_WHATSAPP_MSG_LENGTH } from './constants';

const WHATSAPP_REGEX = /^\+?[1-9]\d{6,14}$/;

function validateWhatsAppNumber(number: string): boolean {
  return WHATSAPP_REGEX.test(number.startsWith('+') ? number : `+${number}`);
}

export function buildWhatsAppURL(message: string): string {
  if (!validateWhatsAppNumber(WHATSAPP_NUMBER)) {
    throw new Error('Invalid WhatsApp number configuration');
  }
  const safeMessage = message.slice(0, MAX_WHATSAPP_MSG_LENGTH);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(safeMessage)}`;
}

export function buildProductWhatsAppURL(
  productName: string,
  variantLabel: string,
  leadTimeDays?: number
): string {
  const lines = [
    `Hola CUYUM, me interesa ${productName} en ${variantLabel}.`,
    '¿Tienen disponibilidad?',
  ];
  if (leadTimeDays) {
    lines.push(`Vi que el tiempo de fabricación es de ${leadTimeDays} días.`);
  }
  return buildWhatsAppURL(lines.join(' '));
}

export function buildCartWhatsAppURL(
  items: Array<{ productName: string; variantLabel: string; quantity: number }>
): string {
  const itemLines = items.map(
    (item) => `- ${item.quantity}x ${item.productName} (${item.variantLabel})`
  );
  const message = [
    'Hola CUYUM, me interesa cotizar:',
    ...itemLines,
    '¿Me pueden hacer un presupuesto?',
  ].join('\n');
  return buildWhatsAppURL(message);
}
