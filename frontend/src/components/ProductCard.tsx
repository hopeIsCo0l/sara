'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, Phone } from 'lucide-react';
import { Product } from '@/lib/types';
import { WHATSAPP_LINK } from '@/lib/constants';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);

  const primaryImage = product.images.find((img) => img.is_primary)?.url || product.images[0]?.url || 'https://images.unsplash.com/photo-1544441893-675973e31985';
  const secondaryImage = product.images.find((img) => !img.is_primary)?.url || primaryImage;

  const stockBadgeStyles = {
    in_stock: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/30',
    low_stock: 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/30',
    preorder: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/30',
    sold_out: 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/30',
  };

  const stockLabels = {
    in_stock: 'IN STOCK',
    low_stock: 'LIMITED STOCK',
    preorder: 'PRE-ORDER',
    sold_out: 'SOLD OUT',
  };

  return (
    <div
      className="group relative flex flex-col bg-kith-card border border-kith-border overflow-hidden transition-all duration-300 hover:border-kith-bone/50 shadow-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Display */}
      <div className="relative aspect-[3/4] w-full bg-kith-subBg overflow-hidden">
        <Image
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Stock Status Overlay Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase border backdrop-blur-md ${
              stockBadgeStyles[product.stock_status] || stockBadgeStyles.in_stock
            }`}
          >
            {stockLabels[product.stock_status]}
          </span>
        </div>

        {/* SKU tag */}
        {product.sku && (
          <div className="absolute top-3 right-3 z-10 hidden sm:block">
            <span className="px-1.5 py-0.5 text-[9px] font-mono tracking-wider uppercase bg-kith-card/90 text-kith-muted border border-kith-border backdrop-blur-md">
              {product.sku}
            </span>
          </div>
        )}

        {/* Hover Quick View Overlay Action */}
        <div className="absolute inset-0 bg-kith-overlayBg backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-4">
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="flex-1 py-2.5 px-3 bg-kith-btnSecondaryBg text-kith-btnSecondaryText border border-kith-btnSecondaryBorder hover:bg-kith-btnSecondaryHover text-xs font-mono tracking-widest uppercase font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md"
            >
              <Eye className="w-3.5 h-3.5" />
              QUICK VIEW
            </button>
          )}

          <a
            href={`${WHATSAPP_LINK}?text=${encodeURIComponent(`Hello Sebrin Trading PLC, I am interested in viewing specs for ${product.name} (SKU: ${product.sku || 'N/A'})`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-kith-btnSecondaryBg text-kith-btnSecondaryText border border-kith-btnSecondaryBorder hover:bg-kith-btnSecondaryHover transition-colors shadow-md"
            title="Contact via WhatsApp"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-500" />
          </a>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 flex flex-col justify-between flex-1 border-t border-kith-border bg-kith-card">
        <div>
          {/* Category & Details */}
          <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-kith-muted uppercase mb-1">
            <span>{product.category?.name || 'CAPSULE'}</span>
            {product.details?.material && (
              <span className="truncate max-w-[120px] text-kith-darkMuted">
                {product.details.material}
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={`/catalog/${product.slug}`}>
            <h3 className="text-xs sm:text-sm font-semibold tracking-wide text-kith-bone uppercase line-clamp-1 group-hover:text-kith-accent transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Action Link */}
        <div className="mt-3 pt-2.5 border-t border-kith-border/60 flex items-center justify-between">
          <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-kith-bone">
            {product.price.toLocaleString()} <span className="text-[10px] font-normal text-kith-muted">{product.currency || 'ETB'}</span>
          </span>

          <Link
            href={`/catalog/${product.slug}`}
            className="text-[10px] font-mono tracking-widest uppercase text-kith-muted hover:text-kith-bone flex items-center gap-1 group/link"
          >
            SPECS <span className="group-hover/link:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
