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
  title: 'Sebrin Trading PLC // Solar Energy & Sound Equipment Showcase',
  description: 'Showcase catalog for Sebrin Trading PLC in Addis Ababa, Ethiopia. Tier-1 Solar Panels, Hybrid Inverters, Lithium Batteries & Professional Audio Speakers.',
  keywords: ['Sebrin Trading PLC', 'Solar Energy Ethiopia', 'Solar Panels Addis Ababa', 'Sound Equipment', 'Professional Speakers', 'Hybrid Inverters'],
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
