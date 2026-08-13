'use client';

import React, { useState } from 'react';
import { ChevronDown, Phone, CheckCircle, Zap, Terminal } from 'lucide-react';
import { Service } from '@/lib/types';
import { PRIMARY_PHONE, WHATSAPP_LINK } from '@/lib/constants';

interface ServiceCardProps {
  service: Service;
  index: number;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="tech-panel p-6 sm:p-10 space-y-6 relative group overflow-hidden">
      {/* Decorative background scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none z-0 mix-blend-overlay"></div>
      
      {/* Top Meta & Title */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-cyan-500/20 pb-6 relative z-10">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[9px] font-mono font-bold tracking-superwide uppercase">
            <Terminal className="w-3 h-3" />
            SYS_PROCEDURE_0{index + 1}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-kith-bone uppercase text-glow-cyan">
            {service.title}
          </h3>
          {service.subtitle && (
            <p className="text-[11px] font-mono font-medium text-emerald-400/80 max-w-2xl leading-relaxed uppercase tracking-widest">
              {service.subtitle}
            </p>
          )}
        </div>

        {service.price_range && (
          <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-start gap-1">
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-superwide flex items-center gap-1.5 text-glow-emerald bg-emerald-500/10 border border-emerald-500/30 px-3 py-1">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              INITIATE_CONSULT
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-xs font-mono text-cyan-100/70 leading-relaxed border-l-2 border-cyan-500/40 pl-4 relative z-10">
        {service.description}
      </p>

      {/* Accordion Specification List */}
      <div className="border border-cyan-500/20 bg-kith-bg/50 p-5 space-y-4 relative z-10">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-[10px] font-mono font-bold tracking-superwide text-cyan-500 uppercase hover:text-cyan-300 transition-colors"
        >
          <span className="flex items-center gap-2">
            TECHNICAL_DELIVERABLES_LOG [{service.specifications.length}]
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${
              isExpanded ? 'rotate-180 text-emerald-400' : ''
            }`}
          />
        </button>

        {isExpanded && (
          <ul className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono border-t border-cyan-500/20">
            {service.specifications.map((spec, i) => (
              <li key={i} className="flex items-start gap-2.5 text-kith-bone py-1 hover:bg-cyan-500/5 px-2 transition-colors">
                <span className="text-emerald-500 font-bold flex-shrink-0 mt-0.5">{`>`}</span>
                <span>{spec}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer Inquiry CTA */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <span className="text-[9px] font-mono font-bold text-kith-muted uppercase tracking-superwide">
          // AWAITING_ENGINEER_INPUT //
        </span>
        <a
          href={`${WHATSAPP_LINK}?text=${encodeURIComponent(`[SECURE_COMMS] Requesting technical consultation for SYS_PROCEDURE: ${service.title}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-8 py-3 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30 hover:border-cyan-400 text-[10px] tracking-superwide font-mono uppercase font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
        >
          <Zap className="w-3.5 h-3.5" />
          ESTABLISH_COMMS_LINK
        </a>
      </div>
    </div>
  );
};
