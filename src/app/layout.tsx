import type { Metadata } from 'next';
import { Cormorant_Garamond, Montserrat } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { GSAPProvider } from '@/components/animations/GSAPProvider';

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700'],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['300', '400', '500', '600'],
});

export const metadata: Metadata = {
  title: {
    default: 'CUYUM Amoblamientos — Diseño a Tu Medida | Las Heras, Mendoza',
    template: '%s | CUYUM Amoblamientos',
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
  ],
  openGraph: {
    title: 'CUYUM Amoblamientos — Diseño a Tu Medida',
    description: 'Muebles comerciales y de hogar a medida. Fabricados en Mendoza.',
    type: 'website',
    locale: 'es_AR',
    siteName: 'CUYUM Amoblamientos',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cormorantGaramond.variable} ${montserrat.variable}`}>
      <body>
        <GSAPProvider>
          <CartProvider>{children}</CartProvider>
        </GSAPProvider>
      </body>
    </html>
  );
}
