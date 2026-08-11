import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ThemeProvider } from '@/context/ThemeContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Sebrin Trading PLC // Solar Energy Equipment Showcase',
    template: '%s | Sebrin Trading PLC',
  },
  description: 'Premier supplier in Addis Ababa, Ethiopia. Tier-1 Solar Panels, Hybrid Pure Sine Wave Inverters, and LiFePO4 Lithium Batteries.',
  keywords: [
    'Sebrin Trading PLC',
    'Solar Energy Ethiopia',
    'Solar Panels Addis Ababa',
    'Hybrid Inverters Ethiopia',
    'Lithium LiFePO4 Battery',
    'Solar Sizing Calculator',
  ],
  authors: [{ name: 'Sebrin Trading PLC' }],
  creator: 'Sebrin Trading PLC Engineering',
  publisher: 'Sebrin Trading PLC',
  metadataBase: new URL('https://sebrin.et'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sebrin.et',
    title: 'Sebrin Trading PLC // Solar Energy Systems',
    description: 'Explore high-efficiency solar panels, hybrid inverters, and lithium batteries in Addis Ababa, Ethiopia.',
    siteName: 'Sebrin Trading PLC',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Sebrin Trading Solar Equipment Showcase',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sebrin Trading PLC // Solar Equipment',
    description: 'Tier-1 Solar Panels, Hybrid Inverters, and Lithium Battery Banks in Ethiopia.',
    images: ['https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1200&auto=format&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('kith_theme') || 'system';
      var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-kith-bg text-kith-bone flex flex-col selection:bg-white selection:text-black transition-colors duration-200">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
