'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getCategories, getProducts } from '@/lib/supabase';
import { Category, FilterState, Product } from '@/lib/types';
import { FilterSidebar } from '@/components/FilterSidebar';
import { ProductGrid } from '@/components/ProductGrid';
import { QuickViewModal } from '@/components/QuickViewModal';
import { Zap, Sun } from 'lucide-react';

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
    <div className="bg-gray-50 pb-20">
      {/* Header Banner */}
      <div className="bg-white border-b border-gray-200 pt-10 pb-8">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-8 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-kith-accent rounded-full text-[10px] font-bold tracking-widest uppercase">
            <Sun className="w-3.5 h-3.5" />
            Sara Power Solution plc // Full Catalog
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 uppercase">
            Solar Equipment Showcase
          </h1>
          <p className="text-sm text-gray-500 max-w-2xl font-medium">
            Filter through our Tier-1 solar panels, hybrid pure sine wave inverters, and LiFePO4 lithium batteries.
          </p>
        </div>
      </div>

      <div className="max-w-[1700px] mx-auto px-4 sm:px-8 py-10">
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
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="text-xs text-amber-600 uppercase tracking-widest font-bold flex items-center gap-1.5">
                  <Zap className="w-4 h-4 animate-pulse" />
                  Unsure about solar sizing?
                </div>
                <p className="text-sm text-gray-500 font-medium max-w-xl">
                  Use our interactive Solar Calculator to enter your appliances or kW load and get an exact equipment match.
                </p>
              </div>
              <a
                href="/calculator"
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold rounded-full flex items-center justify-center gap-2 flex-shrink-0 transition-colors shadow-md hover:shadow-lg"
              >
                <span>Launch Calculator</span>
                <span>→</span>
              </a>
            </div>

            <ProductGrid
              products={filteredProducts}
              onQuickView={(product) => setSelectedQuickView(product)}
            />
          </div>
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
