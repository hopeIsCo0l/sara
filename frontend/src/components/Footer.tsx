import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, ExternalLink, Instagram, Send } from 'lucide-react';
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
    <footer className="w-full border-t border-kith-border bg-kith-subBg pt-16 pb-12 text-kith-muted">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-kith-border">
          {/* Brand & Short About Us */}
          <div className="md:col-span-1 space-y-4">
            <h2 className="text-xl font-extrabold text-kith-bone tracking-kith uppercase">
              {COMPANY_NAME}
            </h2>
            <p className="text-xs font-mono leading-relaxed text-kith-muted">
              {SHORT_ABOUT_US}
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-kith-border bg-kith-card text-kith-bone hover:border-kith-bone transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={TELEGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-kith-border bg-kith-card text-kith-bone hover:border-kith-bone transition-colors"
                title="Telegram Channel"
              >
                <Send className="w-4 h-4 text-sky-400" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-kith-bone font-bold">
              SHOWCASE CATALOG
            </h3>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <Link href="/catalog" className="hover:text-kith-bone transition-colors">
                  EQUIPMENT CATALOG
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-kith-bone transition-colors text-amber-500 font-semibold flex items-center gap-1">
                  <span>SOLAR CALCULATOR (kW)</span>
                </Link>
              </li>
              <li>
                <Link href="/#featured" className="hover:text-kith-bone transition-colors">
                  FEATURED PRODUCTS
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-kith-bone transition-colors">
                  SOLAR SERVICES
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-kith-bone font-bold">
              CONTACT & INQUIRIES
            </h3>
            <ul className="space-y-2.5 text-xs font-mono">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-kith-accent flex-shrink-0" />
                <div className="flex flex-col">
                  <a href={`mailto:${PRIMARY_EMAIL}`} className="hover:text-kith-bone transition-colors">
                    {PRIMARY_EMAIL}
                  </a>
                  <a href={`mailto:${SECONDARY_EMAIL}`} className="hover:text-kith-bone transition-colors text-[11px] text-kith-darkMuted">
                    {SECONDARY_EMAIL}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-kith-bone transition-colors font-bold text-kith-bone">
                  {PRIMARY_PHONE} (WhatsApp)
                </a>
              </li>
              <li className="flex items-start gap-2 pt-1">
                <Clock className="w-3.5 h-3.5 text-kith-muted flex-shrink-0 mt-0.5" />
                <span>{BUSINESS_HOURS}</span>
              </li>
            </ul>
          </div>

          {/* Address & Google Maps Embed Link */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-kith-bone font-bold">
              LOCATION & OFFICE
            </h3>
            <div className="text-xs font-mono space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <span>{PHYSICAL_ADDRESS}</span>
              </div>
              <a
                href={GOOGLE_MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-kith-border bg-kith-card hover:border-kith-bone text-kith-bone text-[11px] font-mono tracking-widest uppercase transition-colors"
              >
                <span>OPEN GOOGLE MAPS</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright & specs */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-kith-darkMuted">
          <div>
            © {new Date().getFullYear()} {COMPANY_NAME}. ALL RIGHTS RESERVED. SHOWCASE CATALOG.
          </div>
          <div className="flex items-center gap-4">
            <span>ADDIS ABABA, ETHIOPIA</span>
            <span>•</span>
            <span>SOLAR SYSTEMS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
