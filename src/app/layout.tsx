import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { GSAPProvider } from '@/components/animations/GSAPProvider';

export const metadata: Metadata = {
  title: {
    default: 'CUYUM Muebles Comerciales — Fabricación artesanal | Mendoza, Argentina',
    template: '%s | CUYUM Muebles Comerciales',
  },
  description:
    'Muebles comerciales y de hogar a medida fabricados en Las Heras, Mendoza. Mostradores, exhibidores, vitrinas y estanterías. Presupuesto por WhatsApp.',
  keywords: [
    'muebles mendoza',
    'amoblamientos a medida',
    'mostradores comerciales',
    'exhibidores mendoza',
    'vitrinas',
    'cuyum',
    'muebles comerciales',
    'fabricacion mendoza',
  ],
  openGraph: {
    title: 'CUYUM Muebles Comerciales — Fabricación artesanal',
    description: 'Muebles comerciales y de hogar a medida. Fabricados en Mendoza.',
    type: 'website',
    locale: 'es_AR',
    siteName: 'CUYUM Muebles Comerciales',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* Manrope + Inter + Material Symbols — single optimized request */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <GSAPProvider>
          <CartProvider>{children}</CartProvider>
        </GSAPProvider>
      </body>
    </html>
  );
}
