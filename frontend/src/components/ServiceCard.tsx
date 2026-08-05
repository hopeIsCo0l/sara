'use client';

import React, { useState } from 'react';
import { ChevronDown, Phone, CheckCircle } from 'lucide-react';
import { Service } from '@/lib/types';
import { PRIMARY_PHONE, WHATSAPP_LINK } from '@/lib/constants';

interface ServiceCardProps {
  service: Service;
  index: number;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-kith-card border border-kith-border hover:border-kith-bone/50 transition-all p-6 sm:p-8 space-y-6">
      {/* Top Meta & Title */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-kith-border pb-6">
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-superwide text-kith-muted uppercase">
            SERVICE CAPABILITY // 0{index + 1}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-kith-bone uppercase">
            {service.title}
          </h3>
          {service.subtitle && (
            <p className="text-xs font-mono text-kith-muted max-w-xl">
              {service.subtitle}
            </p>
          )}
        </div>

        {service.price_range && (
          <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-start gap-1">
            <span className="text-[10px] font-mono tracking-widest text-kith-darkMuted uppercase">
              ESTIMATED COST
            </span>
            <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1">
              {service.price_range}
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-xs font-mono text-kith-bone leading-relaxed">
        {service.description}
      </p>

      {/* Accordion Specification List */}
      <div className="border border-kith-border bg-kith-subBg p-4 space-y-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-xs font-mono tracking-widest text-kith-muted uppercase hover:text-kith-bone"
        >
          <span className="font-bold text-kith-bone flex items-center gap-2">
            TECHNICAL SCOPE & DELIVERABLES ({service.specifications.length})
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isExpanded && (
          <ul className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono border-t border-kith-border/60">
            {service.specifications.map((spec, i) => (
              <li key={i} className="flex items-start gap-2 text-kith-muted py-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{spec}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer Inquiry CTA */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-[11px] font-mono text-kith-darkMuted uppercase">
          CONSULT DIRECTLY WITH OUR SOLAR & AUDIO ENGINEERS
        </span>
        <a
          href={`${WHATSAPP_LINK}?text=${encodeURIComponent(`Hello Sebrin Trading PLC, I am interested in consultation for service: ${service.title}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 py-3 bg-kith-btnPrimaryBg text-kith-btnPrimaryText hover:bg-kith-btnPrimaryHover text-xs font-mono tracking-widest uppercase font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-500" />
          WHATSAPP CONSULTATION ({PRIMARY_PHONE})
        </a>
      </div>
    </div>
  );
};
