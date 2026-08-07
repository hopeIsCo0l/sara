'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sun, Volume2, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { getProducts } from '@/lib/supabase';
import { Product } from '@/lib/types';
import { ProductGrid } from '@/components/ProductGrid';
import { QuickViewModal } from '@/components/QuickViewModal';
import { HERO_HEADER, BRAND_TAGLINE } from '@/lib/constants';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [selectedQuickView, setSelectedQuickView] = useState<Product | null>(null);

  useEffect(() => {
    async function loadData() {
      const data = await getProducts({ isFeatured: true });
      setFeaturedProducts(data);
    }
    loadData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section - Sebrin Trading Showcase */}
      <section className="relative w-full min-h-[85vh] bg-kith-subBg border-b border-kith-border flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 opacity-20 dark:opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1800&auto=format&fit=crop"
            alt="Solar Panels & Sound Equipment Showcase Background"
            fill
            priority
            className="object-cover object-center grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-kith-bg via-kith-bg/85 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1700px] mx-auto px-4 sm:px-8 py-20 w-full flex flex-col justify-between min-h-[75vh]">
          <div className="space-y-6 max-w-2xl">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-kith-card/90 border border-kith-border backdrop-blur-md text-[10px] font-mono tracking-superwide uppercase text-kith-bone">
              <Sparkles className="w-3 h-3 text-amber-500" />
              SEBRIN TRADING PLC // EQUIPMENT SHOWCASE
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter uppercase text-kith-bone leading-none">
              {HERO_HEADER}
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm font-mono text-kith-muted leading-relaxed max-w-lg">
              {BRAND_TAGLINE}. Discover high-capacity hybrid solar inverters, lithium batteries, commercial stage speakers, and audio consoles.
            </p>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/catalog"
                className="px-8 py-4 bg-kith-btnPrimaryBg text-kith-btnPrimaryText hover:bg-kith-btnPrimaryHover text-xs font-mono tracking-widest uppercase font-bold flex items-center gap-2 transition-all shadow-xl"
              >
                BROWSE EQUIPMENT CATALOG
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/services"
                className="px-8 py-4 bg-transparent text-kith-bone border border-kith-border hover:border-kith-bone text-xs font-mono tracking-widest uppercase font-semibold transition-all"
              >
                SOLAR & SOUND SERVICES
              </Link>
            </div>
          </div>

          {/* Bottom Specs Ticker */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-kith-border text-xs font-mono text-kith-muted">
            <div>
              <span className="text-[10px] text-kith-darkMuted uppercase block">SOLAR PANELS & INVERTERS</span>
              <span className="text-kith-bone font-semibold">TIER-1 N-TYPE & 5.5KW HYBRID</span>
            </div>
            <div>
              <span className="text-[10px] text-kith-darkMuted uppercase block">ENERGY STORAGE</span>
              <span className="text-kith-bone font-semibold">5.12KWH LIFEPO4 LITHIUM & GEL</span>
            </div>
            <div>
              <span className="text-[10px] text-kith-darkMuted uppercase block">PRO AUDIO & SPEAKERS</span>
              <span className="text-kith-bone font-semibold">2000W POWERED LOUDSPEAKERS</span>
            </div>
            <div>
              <span className="text-[10px] text-kith-darkMuted uppercase block">LOCATION</span>
              <span className="text-kith-bone font-semibold">ADDIS ABABA, ETHIOPIA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Equipment 4-Column Grid Section */}
      <section id="featured" className="max-w-[1700px] mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-kith-border pb-4 gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-superwide text-kith-muted uppercase block">
              FEATURED INVENTORY
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-kith-bone uppercase">
              FEATURED SOLAR & SOUND EQUIPMENT
            </h2>
          </div>

          <Link
            href="/catalog"
            className="text-xs font-mono uppercase tracking-widest text-kith-muted hover:text-kith-bone flex items-center gap-1"
          >
            VIEW ALL CATALOG ITEMS →
          </Link>
        </div>

        <ProductGrid
          products={featuredProducts}
          onQuickView={(p) => setSelectedQuickView(p)}
        />
      </section>

      {/* Capabilities Showcase */}
      <section className="max-w-[1700px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-kith-card border border-kith-border p-8 space-y-3">
            <Sun className="w-6 h-6 text-amber-500" />
            <h3 className="text-sm font-mono tracking-widest text-kith-bone uppercase font-bold">
              SOLAR ENERGY SOLUTIONS
            </h3>
            <p className="text-xs font-mono text-kith-muted leading-relaxed">
              Tier-1 monocrystalline panels, hybrid pure sine wave inverters, MPPT controllers, and long-life lithium battery storage systems.
            </p>
          </div>

          <div className="bg-kith-card border border-kith-border p-8 space-y-3">
            <Volume2 className="w-6 h-6 text-sky-400" />
            <h3 className="text-sm font-mono tracking-widest text-kith-bone uppercase font-bold">
              COMMERCIAL SOUND EQUIPMENT
            </h3>
            <p className="text-xs font-mono text-kith-muted leading-relaxed">
              High-output powered stage speakers, multi-channel audio mixing consoles, subwoofers, and wireless microphone systems.
            </p>
          </div>

          <div className="bg-kith-card border border-kith-border p-8 space-y-3">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
            <h3 className="text-sm font-mono tracking-widest text-kith-bone uppercase font-bold">
              VERIFIED TECHNICAL SPECS
            </h3>
            <p className="text-xs font-mono text-kith-muted leading-relaxed">
              Detailed voltage rating, frequency response, wattage output, and dimensional specifications for every catalog item.
            </p>
          </div>
        </div>
      </section>

      {/* FR-2 Solar Sizing Calculator Feature Section */}
      <section className="max-w-[1700px] mx-auto px-4 sm:px-8">
        <div className="p-8 sm:p-12 bg-gradient-to-br from-kith-subBg via-kith-card to-kith-subBg border border-kith-border flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-4 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] font-mono tracking-superwide uppercase">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              FR-2 // AUTOMATED SOLAR SIZING ENGINE
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-kith-bone">
              Calculate Your Household Solar Power & Inverter Sizing Instantly
            </h2>
            <p className="text-xs sm:text-sm font-mono text-kith-muted leading-relaxed">
              Not sure which inverter or battery capacity you need? Select your household appliances (refrigerator, pump, TV, lights) or input your peak Kilowatts (kW) to get an automated sizing calculation with matching inventory kits.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/calculator"
                className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg"
              >
                <Sun className="w-4 h-4 text-black" />
                <span>LAUNCH SOLAR CALCULATOR (kW)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:w-[450px] relative z-10 text-xs font-mono">
            <div className="p-4 bg-kith-card border border-kith-border space-y-1">
              <div className="text-[10px] text-kith-muted uppercase">Dual Input Modes</div>
              <div className="text-sm font-bold text-kith-bone">Appliance / kW Input</div>
              <div className="text-[10px] text-amber-500">Real-time load math</div>
            </div>
            <div className="p-4 bg-kith-card border border-kith-border space-y-1">
              <div className="text-[10px] text-kith-muted uppercase">Battery Storage</div>
              <div className="text-sm font-bold text-emerald-400">LiFePO4 Sizing</div>
              <div className="text-[10px] text-kith-muted">Night backup autonomy</div>
            </div>
            <div className="p-4 bg-kith-card border border-kith-border space-y-1">
              <div className="text-[10px] text-kith-muted uppercase">Solar PV Array</div>
              <div className="text-sm font-bold text-sky-400">Tier-1 550W Panels</div>
              <div className="text-[10px] text-kith-muted">Ethiopia peak sun hours</div>
            </div>
            <div className="p-4 bg-kith-card border border-kith-border space-y-1">
              <div className="text-[10px] text-kith-muted uppercase">Direct Inquiry</div>
              <div className="text-sm font-bold text-kith-bone">WhatsApp Order</div>
              <div className="text-[10px] text-emerald-400">Pre-populated details</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal Overlay */}
      <QuickViewModal
        product={selectedQuickView}
        onClose={() => setSelectedQuickView(null)}
      />
    </div>
  );
}
