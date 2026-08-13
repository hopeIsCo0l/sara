'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sun, ShieldCheck, Zap, Sparkles, Terminal, Activity } from 'lucide-react';
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
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden bg-kith-bg border-b border-cyan-500/20">
        {/* Tech Grid Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d41a_1px,transparent_1px),linear-gradient(to_bottom,#06b6d41a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          <div className="absolute right-0 top-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1700px] mx-auto px-4 sm:px-8 py-20 w-full flex flex-col justify-center min-h-[75vh]">
          <div className="space-y-8 max-w-4xl relative">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-cyan-500/50 bg-cyan-500/10 text-[10px] font-mono font-bold tracking-superwide uppercase text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Terminal className="w-3.5 h-3.5" />
              SARA POWER SOLUTION PLC // CORE_SYSTEM
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-widest text-kith-bone uppercase leading-[1.1] text-glow-cyan font-mono">
              {HERO_HEADER}
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm font-mono text-cyan-100/70 leading-relaxed max-w-2xl border-l-2 border-cyan-500/50 pl-4">
              {BRAND_TAGLINE}. Discover high-capacity hybrid solar inverters and lithium batteries engineered for lasting performance. System telemetry active and ready for configuration.
            </p>

            {/* CTA Buttons */}
            <div className="pt-6 flex flex-wrap items-center gap-4">
              <Link
                href="/catalog"
                className="px-8 py-4 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30 hover:border-cyan-400 text-xs font-mono font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all flex items-center gap-2"
              >
                ACCESS_DATABASE
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/services"
                className="px-8 py-4 bg-transparent text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-500/50 text-xs font-mono font-bold uppercase tracking-widest transition-all"
              >
                ENGINEERING_SERVICES
              </Link>
            </div>
          </div>
          
          {/* Decorative Tech Overlay elements */}
          <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-80 h-96 border border-cyan-500/20 bg-kith-card backdrop-blur-md p-6 flex-col justify-between">
            <div className="flex justify-between items-center border-b border-cyan-500/30 pb-2">
              <span className="text-[10px] font-mono text-cyan-500 tracking-superwide uppercase">SYS_MONITOR</span>
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
            <div className="space-y-4 pt-4">
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-kith-muted uppercase">Grid Stability</div>
                <div className="h-1.5 w-full bg-cyan-950 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-kith-muted uppercase">Solar Yield</div>
                <div className="h-1.5 w-full bg-cyan-950 rounded-full overflow-hidden">
                  <div className="h-full w-[60%] bg-amber-500 shadow-[0_0_10px_#f59e0b]"></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-kith-muted uppercase">Battery State</div>
                <div className="h-1.5 w-full bg-cyan-950 rounded-full overflow-hidden">
                  <div className="h-full w-[98%] bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></div>
                </div>
              </div>
            </div>
            <div className="text-[9px] font-mono text-kith-darkMuted mt-auto uppercase tracking-widest">
              DATA_STREAM_ACTIVE /// SECURE_CONNECTION
            </div>
          </div>
        </div>
      </section>

      {/* Featured Equipment Grid Section */}
      <section id="featured" className="max-w-[1700px] mx-auto px-4 sm:px-8 space-y-10 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-cyan-500/30 pb-6 gap-4">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-superwide text-emerald-400 uppercase block mb-2 flex items-center gap-2">
              <Terminal className="w-3 h-3" /> HARDWARE_INVENTORY
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-kith-bone uppercase text-glow-cyan">
              Premium Solar Equipment
            </h2>
          </div>

          <Link
            href="/catalog"
            className="text-[10px] font-mono font-bold tracking-superwide text-cyan-500 hover:text-cyan-300 flex items-center gap-1 transition-colors bg-cyan-500/10 px-4 py-2 border border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] uppercase"
          >
            EXECUTE_FULL_CATALOG_QUERY →
          </Link>
        </div>

        <ProductGrid
          products={featuredProducts}
          onQuickView={(p) => setSelectedQuickView(p)}
        />
      </section>

      {/* Capabilities Showcase */}
      <section className="max-w-[1700px] mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="tech-panel p-10 space-y-4 group">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.1)]">
              <Sun className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-lg font-black font-mono text-kith-bone uppercase tracking-widest text-glow-cyan">
              Complete Solar Solutions
            </h3>
            <p className="text-xs font-mono text-cyan-100/60 leading-relaxed">
              Tier-1 monocrystalline panels, hybrid pure sine wave inverters, MPPT controllers, and long-life lithium battery storage systems designed for Ethiopian conditions.
            </p>
          </div>

          <div className="tech-panel p-10 space-y-4 group">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-black font-mono text-kith-bone uppercase tracking-widest text-glow-cyan">
              Verified Technical Specs
            </h3>
            <p className="text-xs font-mono text-cyan-100/60 leading-relaxed">
              Detailed voltage rating, frequency response, wattage output, and dimensional specifications rigorously verified for every single catalog item.
            </p>
          </div>
        </div>
      </section>

      {/* FR-2 Solar Sizing Calculator Feature Section */}
      <section className="max-w-[1700px] mx-auto px-4 sm:px-8 relative z-10">
        <div className="p-8 sm:p-14 tech-panel flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative overflow-hidden">
          
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="space-y-6 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold tracking-superwide uppercase border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              Automated Sizing Engine
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-mono tracking-widest text-kith-bone uppercase leading-tight text-glow-cyan">
              CALCULATE YOUR HOUSEHOLD SOLAR POWER INSTANTLY
            </h2>
            <p className="text-xs font-mono text-cyan-100/70 leading-relaxed border-l border-cyan-500/30 pl-4">
              Not sure which inverter or battery capacity you need? Select your household appliances (refrigerator, pump, TV, lights) or input your peak Kilowatts (kW) to get an automated sizing calculation with matching inventory kits.
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/calculator"
                className="px-8 py-4 bg-amber-500/20 text-amber-500 border border-amber-500/50 hover:bg-amber-500/30 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] text-xs font-mono font-bold tracking-widest uppercase transition-all flex items-center gap-2"
              >
                <Sun className="w-4 h-4" />
                <span>INITIATE_CALCULATOR_PROTOCOL</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:w-[450px] relative z-10">
            <div className="p-5 bg-kith-subBg/50 border border-cyan-500/20 space-y-1.5 hover:border-cyan-500/50 transition-colors">
              <div className="text-[9px] font-mono font-bold text-cyan-500 tracking-widest uppercase">Input Modes</div>
              <div className="text-sm font-black font-mono text-kith-bone uppercase">Appliance / kW</div>
              <div className="text-[10px] font-mono text-emerald-400">Real-time load math</div>
            </div>
            <div className="p-5 bg-kith-subBg/50 border border-cyan-500/20 space-y-1.5 hover:border-cyan-500/50 transition-colors">
              <div className="text-[9px] font-mono font-bold text-cyan-500 tracking-widest uppercase">Storage</div>
              <div className="text-sm font-black font-mono text-kith-bone uppercase">LiFePO4 Sizing</div>
              <div className="text-[10px] font-mono text-cyan-400">Night backup autonomy</div>
            </div>
            <div className="p-5 bg-kith-subBg/50 border border-cyan-500/20 space-y-1.5 hover:border-cyan-500/50 transition-colors">
              <div className="text-[9px] font-mono font-bold text-cyan-500 tracking-widest uppercase">PV Array</div>
              <div className="text-sm font-black font-mono text-kith-bone uppercase">Tier-1 550W</div>
              <div className="text-[10px] font-mono text-cyan-400">Ethiopia peak sun hours</div>
            </div>
            <div className="p-5 bg-kith-subBg/50 border border-cyan-500/20 space-y-1.5 hover:border-cyan-500/50 transition-colors">
              <div className="text-[9px] font-mono font-bold text-cyan-500 tracking-widest uppercase">Direct Inquiry</div>
              <div className="text-sm font-black font-mono text-kith-bone uppercase">WhatsApp Output</div>
              <div className="text-[10px] font-mono text-emerald-400">Pre-populated payloads</div>
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
