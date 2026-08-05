'use client';

import React, { useState } from 'react';
import { LayoutGrid, Grid3X3 } from 'lucide-react';
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onQuickView: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onQuickView }) => {
  const [gridCols, setGridCols] = useState<4 | 2>(4);

  if (products.length === 0) {
    return (
      <div className="w-full p-12 border border-kith-border bg-kith-card text-center space-y-4">
        <h3 className="text-sm font-mono tracking-widest text-kith-bone uppercase">
          NO MATCHING ITEMS FOUND IN CATALOG
        </h3>
        <p className="text-xs font-mono text-kith-muted max-w-md mx-auto">
          Try resetting your active category, price threshold, or search queries to view all archival items.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Grid Toolbar Controls */}
      <div className="flex items-center justify-between px-2 py-1 text-xs font-mono text-kith-muted">
        <span className="uppercase tracking-widest text-[11px]">
          SHOWING {products.length} CATALOG ITEMS
        </span>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[10px] text-kith-darkMuted uppercase">GRID VIEW:</span>
          <button
            onClick={() => setGridCols(2)}
            className={`p-1.5 border transition-colors ${
              gridCols === 2
                ? 'border-kith-bone text-kith-btnPrimaryText bg-kith-btnPrimaryBg font-bold shadow'
                : 'border-kith-border text-kith-muted hover:text-kith-bone bg-kith-card'
            }`}
            title="2 Columns View"
          >
            <Grid3X3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setGridCols(4)}
            className={`p-1.5 border transition-colors ${
              gridCols === 4
                ? 'border-kith-bone text-kith-btnPrimaryText bg-kith-btnPrimaryBg font-bold shadow'
                : 'border-kith-border text-kith-muted hover:text-kith-bone bg-kith-card'
            }`}
            title="4 Columns View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid Items */}
      <div
        className={`grid grid-cols-1 ${
          gridCols === 4
            ? 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            : 'sm:grid-cols-2'
        } gap-4`}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={onQuickView}
          />
        ))}
      </div>
    </div>
  );
};
