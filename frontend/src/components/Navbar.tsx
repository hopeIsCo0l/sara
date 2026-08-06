'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Phone, Menu, X, ArrowRight, Sun, Volume2 } from 'lucide-react';
import { COMPANY_SHORT_NAME, PRIMARY_PHONE, WHATSAPP_LINK } from '@/lib/constants';
import { ThemeToggle, MobileThemeToggle } from '@/components/ThemeToggle';

interface NavbarProps {
  onSearchToggle?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchToggle }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'EQUIPMENT CATALOG', href: '/catalog' },
    { label: 'FEATURED PRODUCTS', href: '/#featured' },
    { label: 'SOLAR & SOUND SERVICES', href: '/services' },
    { label: 'ADMIN DESK', href: '/admin' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-kith-border bg-kith-bg/90 backdrop-blur-md transition-all">
      {/* Top Banner */}
      <div className="bg-kith-subBg border-b border-kith-border px-4 py-1.5 text-center text-[10px] uppercase tracking-superwide font-mono text-kith-muted flex items-center justify-between">
        <span className="hidden sm:inline text-kith-darkMuted flex items-center gap-1">
          <Sun className="w-3 h-3 text-amber-500 inline" /> SOLAR & <Volume2 className="w-3 h-3 text-sky-400 inline" /> SOUND
        </span>
        <span className="w-full sm:w-auto flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          SEBRIN TRADING PLC — SHOWCASE CATALOG & TECHNICAL SPECIFICATIONS
        </span>
        <span className="hidden sm:inline text-kith-darkMuted">ADDIS ABABA, ETHIOPIA</span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-baseline gap-2 group">
            <span className="text-xl sm:text-2xl font-extrabold tracking-kith text-kith-bone uppercase transition-colors">
              {COMPANY_SHORT_NAME}<span className="text-kith-muted font-light"> // </span>SHOWCASE
            </span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-6 ml-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-mono uppercase tracking-widest transition-colors py-1 relative ${
                    isActive ? 'text-kith-bone font-bold' : 'text-kith-muted hover:text-kith-bone'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-kith-bone"></span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {onSearchToggle && (
            <button
              onClick={onSearchToggle}
              className="p-2 text-kith-muted hover:text-kith-bone transition-colors"
              title="Search Catalog"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          <ThemeToggle />

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 border border-kith-border hover:border-kith-bone bg-kith-card text-kith-bone text-xs font-mono tracking-widest uppercase transition-all duration-200 group rounded-none"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-500 transition-colors" />
            <span>{PRIMARY_PHONE}</span>
            <ArrowRight className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-kith-bone"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-kith-border bg-kith-card p-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-mono uppercase tracking-widest text-kith-bone py-2 border-b border-kith-border/50"
            >
              {link.label}
            </Link>
          ))}

          <MobileThemeToggle />

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-center gap-2 w-full py-3 bg-kith-btnPrimaryBg text-kith-btnPrimaryText hover:bg-kith-btnPrimaryHover text-xs font-mono uppercase tracking-widest font-bold transition-colors"
          >
            <Phone className="w-4 h-4 text-emerald-500" />
            WhatsApp: {PRIMARY_PHONE}
          </a>
        </div>
      )}
    </header>
  );
};
