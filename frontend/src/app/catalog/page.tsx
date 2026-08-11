'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getCategories, getProducts } from '@/lib/supabase';
import { Category, FilterState, Product } from '@/lib/types';
import { FilterSidebar } from '@/components/FilterSidebar';
import { ProductGrid } from '@/components/ProductGrid';
import { QuickViewModal } from '@/components/QuickViewModal';

export default function CatalogPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedQuickView, setSelectedQuickView] = useState<Product | null>(null);

  const initialFilters: FilterState = {
    categorySlug: 'all',
    searchQuery: '',
    stockStatus: 'all',
    maxPrice: 250000,
    sortBy: 'featured',
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);

  useEffect(() => {
    async function loadData() {
      const cats = await getCategories();
      const prods = await getProducts();
      setCategories(cats);
      setAllProducts(prods);
    }
    loadData();
  }, []);

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleReset = () => {
    setFilters(initialFilters);
  };

  // Filter & Sort Pipeline
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        // Category filter
        if (filters.categorySlug !== 'all' && p.category?.slug !== filters.categorySlug) {
          return false;
        }

        // Search query filter (matches name, description, SKU, details)
        if (filters.searchQuery.trim() !== '') {
          const q = filters.searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchSku = p.sku?.toLowerCase().includes(q);
          const matchMaterial = p.details?.material?.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchSku && !matchMaterial) return false;
        }

        // Stock status filter
        if (filters.stockStatus !== 'all' && p.stock_status !== filters.stockStatus) {
          return false;
        }

        // Max price filter
        if (p.price > filters.maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') return a.price - b.price;
        if (filters.sortBy === 'price-desc') return b.price - a.price;
        if (filters.sortBy === 'newest')
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      });
  }, [allProducts, filters]);

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="border-b border-kith-border pb-6 space-y-2">
        <div className="text-[10px] font-mono tracking-superwide text-kith-muted uppercase">
          SEBRIN TRADING PLC // FULL EQUIPMENT CATALOG
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight uppercase text-kith-bone">
          SOLAR ENERGY EQUIPMENT SHOWCASE
        </h1>
        <p className="text-xs font-mono text-kith-muted max-w-2xl">
          Filter through our Tier-1 solar panels, hybrid pure sine wave inverters, and LiFePO4 lithium batteries.
        </p>
      </div>

      {/* Main Layout: Sticky Sidebar + 4-Column Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSidebar
          categories={categories}
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          totalResults={filteredProducts.length}
        />

        <div className="flex-1 space-y-6">
          {/* FR-2 Solar Calculator Callout Banner */}
          <div className="p-4 bg-gradient-to-r from-kith-subBg via-kith-card to-kith-subBg border border-kith-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-amber-500 uppercase tracking-widest font-bold">
                ⚡ UNSURE ABOUT SOLAR SIZING OR INVERTER CAPACITY?
              </div>
              <p className="text-xs font-mono text-kith-muted">
                Use our interactive Solar Calculator to enter your appliances or kW load and get an exact equipment match.
              </p>
            </div>
            <a
              href="/calculator"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 flex-shrink-0 transition-colors shadow-md"
            >
              <span>LAUNCH CALCULATOR</span>
              <span>→</span>
            </a>
          </div>

          <ProductGrid
            products={filteredProducts}
            onQuickView={(product) => setSelectedQuickView(product)}
          />
        </div>
      </div>

      {/* Quick View Modal Overlay */}
      <QuickViewModal
        product={selectedQuickView}
        onClose={() => setSelectedQuickView(null)}
      />
    </div>
  );
}
