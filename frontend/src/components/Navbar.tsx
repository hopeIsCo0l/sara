'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Phone, Menu, X, ArrowRight, Sun, Zap } from 'lucide-react';
import { COMPANY_SHORT_NAME, PRIMARY_PHONE, WHATSAPP_LINK } from '@/lib/constants';

interface NavbarProps {
  onSearchToggle?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchToggle }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Equipment Catalog', href: '/catalog' },
    { label: 'Solar Calculator', href: '/calculator', highlight: true },
    { label: 'Featured Products', href: '/#featured' },
    { label: 'Solar Services', href: '/services' },
    { label: 'Admin Desk', href: '/admin' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-kith-bg/80 backdrop-blur-md shadow-[0_4px_30px_rgba(6,182,212,0.1)] transition-all border-b border-cyan-500/20">
      {/* Top Telemetry Banner */}
      <div className="bg-cyan-950/40 text-cyan-400 px-4 py-1.5 text-[10px] sm:text-xs tracking-superwide font-mono flex items-center justify-between border-b border-cyan-500/10">
        <span className="hidden sm:flex items-center gap-2">
          <Sun className="w-3 h-3 inline text-amber-400" /> SYSTEM ONLINE // GRID STABLE
        </span>
        <span className="w-full sm:w-auto flex items-center justify-center gap-2 font-bold text-emerald-400 text-glow-emerald">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]"></span>
          SARA POWER TELEMETRY ACTIVE
        </span>
        <span className="hidden sm:inline text-kith-muted">ADDIS ABABA, ETHIOPIA</span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group relative">
            <div className="absolute inset-0 -m-1 rounded-full bg-cyan-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative w-10 h-10 border border-cyan-500/40 bg-black p-1 flex items-center justify-center rounded-sm">
              <img src="/logo.png" alt="Sara Power Solution" className="h-full w-full object-contain filter invert" />
            </div>
            <div className="flex flex-col hidden sm:flex">
              <span className="text-xl sm:text-2xl font-black tracking-widest text-kith-bone group-hover:text-cyan-400 text-glow-cyan transition-colors font-mono uppercase">
                Sara Power
              </span>
              <span className="text-[9px] font-mono tracking-superwide text-emerald-400 uppercase font-bold text-glow-emerald">
                Energy Systems
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-1 ml-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-xs font-mono font-bold tracking-widest uppercase transition-all rounded-sm border border-transparent flex items-center gap-2 ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                      : link.highlight
                      ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-500/30'
                      : 'text-kith-muted hover:text-cyan-400 hover:bg-cyan-500/5 hover:border-cyan-500/20'
                  }`}
                >
                  {link.highlight && <Zap className="w-3.5 h-3.5 animate-pulse" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {onSearchToggle && (
            <button
              onClick={onSearchToggle}
              className="p-2 text-cyan-500/70 hover:text-cyan-400 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 rounded-sm transition-colors"
              title="Search Database"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-5 py-2 text-xs font-mono font-bold tracking-widest uppercase text-cyan-400 bg-cyan-500/10 border border-cyan-500/50 hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-200 group rounded-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{PRIMARY_PHONE}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-cyan-500 hover:text-cyan-400"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-cyan-500/30 bg-kith-bg/95 backdrop-blur-xl p-6 flex flex-col gap-2 shadow-2xl absolute w-full left-0 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xs font-mono font-bold tracking-widest uppercase py-3.5 px-4 border border-transparent hover:bg-cyan-500/10 hover:border-cyan-500/30 text-kith-bone hover:text-cyan-400 transition-all flex items-center gap-2 rounded-sm"
            >
              {link.highlight && <Zap className="w-4 h-4 text-emerald-400" />}
              {link.label}
            </Link>
          ))}

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all rounded-sm"
          >
            <Phone className="w-4 h-4" />
            SYS COMMS: {PRIMARY_PHONE}
          </a>
        </div>
      )}
    </header>
  );
};
