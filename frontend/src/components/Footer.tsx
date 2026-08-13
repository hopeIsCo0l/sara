import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, ExternalLink, Instagram, Send, Terminal } from 'lucide-react';
import {
  COMPANY_NAME,
  SHORT_ABOUT_US,
  PRIMARY_EMAIL,
  SECONDARY_EMAIL,
  PRIMARY_PHONE,
  WHATSAPP_LINK,
  PHYSICAL_ADDRESS,
  GOOGLE_MAPS_LINK,
  BUSINESS_HOURS,
  INSTAGRAM_LINK,
  TELEGRAM_LINK,
} from '@/lib/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-cyan-500/30 bg-kith-subBg pt-16 pb-12 text-kith-muted relative overflow-hidden">
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
           style={{ backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="max-w-[1700px] mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-cyan-500/20">
          {/* Brand & Short About Us */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 border border-cyan-500/40 bg-black p-1 flex items-center justify-center rounded-sm">
                <img src="/logo.png" alt="Sara Power Solution" className="h-full w-full object-contain filter invert opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-widest text-kith-bone group-hover:text-cyan-400 text-glow-cyan transition-colors font-mono uppercase">
                  Sara Power
                </span>
                <span className="text-[9px] font-mono tracking-superwide text-emerald-400 uppercase font-bold text-glow-emerald">
                  Energy Systems
                </span>
              </div>
            </Link>
            <p className="text-xs font-mono leading-relaxed text-kith-muted pt-2 border-l border-cyan-500/30 pl-3">
              {SHORT_ABOUT_US}
            </p>
            <div className="pt-4 flex items-center gap-3">
              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-sm bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={TELEGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-sm bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all"
                title="Telegram Channel"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono font-bold text-cyan-400 tracking-superwide uppercase flex items-center gap-2">
              <Terminal className="w-3 h-3" /> DATABASE_LINKS
            </h3>
            <ul className="space-y-3 text-xs font-mono">
              <li>
                <Link href="/catalog" className="hover:text-cyan-400 hover:pl-2 transition-all flex items-center before:content-['>'] before:text-emerald-500 before:mr-2 before:opacity-0 hover:before:opacity-100">
                  Equipment Catalog
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-cyan-400 hover:pl-2 transition-all flex items-center before:content-['>'] before:text-emerald-500 before:mr-2 before:opacity-0 hover:before:opacity-100">
                  System Sizing Engine
                </Link>
              </li>
              <li>
                <Link href="/#featured" className="hover:text-cyan-400 hover:pl-2 transition-all flex items-center before:content-['>'] before:text-emerald-500 before:mr-2 before:opacity-0 hover:before:opacity-100">
                  Featured Hardware
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-cyan-400 hover:pl-2 transition-all flex items-center before:content-['>'] before:text-emerald-500 before:mr-2 before:opacity-0 hover:before:opacity-100">
                  Engineering Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono font-bold text-cyan-400 tracking-superwide uppercase flex items-center gap-2">
              <Terminal className="w-3 h-3" /> COMMS_CHANNELS
            </h3>
            <ul className="space-y-4 text-xs font-mono">
              <li className="flex items-center gap-3">
                <div className="p-1.5 border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col">
                  <a href={`mailto:${PRIMARY_EMAIL}`} className="hover:text-cyan-400 transition-colors text-kith-bone">
                    {PRIMARY_EMAIL}
                  </a>
                  <a href={`mailto:${SECONDARY_EMAIL}`} className="hover:text-cyan-400 transition-colors text-[10px] text-kith-darkMuted">
                    {SECONDARY_EMAIL}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors text-kith-bone">
                  {PRIMARY_PHONE}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1.5 border border-amber-500/30 bg-amber-500/10 text-amber-400">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <span className="text-kith-muted">{BUSINESS_HOURS}</span>
              </li>
            </ul>
          </div>

          {/* Address & Google Maps Embed Link */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono font-bold text-cyan-400 tracking-superwide uppercase flex items-center gap-2">
              <Terminal className="w-3 h-3" /> GEO_LOCATION
            </h3>
            <div className="text-xs space-y-3 font-mono">
              <div className="flex items-start gap-3">
                <div className="p-1.5 border border-purple-500/30 bg-purple-500/10 text-purple-400 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span className="text-kith-muted leading-relaxed max-w-[200px] border-l border-purple-500/30 pl-2">{PHYSICAL_ADDRESS}</span>
              </div>
              <a
                href={GOOGLE_MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-kith-bg border border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-400 text-[10px] font-bold tracking-widest uppercase transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)] hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] rounded-sm"
              >
                <span>INITIATE_MAPS</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright & specs */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono tracking-widest uppercase text-kith-darkMuted">
          <div>
            © {new Date().getFullYear()} {COMPANY_NAME} // ALL SYSTEMS NOMINAL
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-500/50">ADDIS ABABA_ET</span>
            <span className="text-cyan-500/50">///</span>
            <span className="text-cyan-500/50">V_1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
