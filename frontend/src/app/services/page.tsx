'use client';

import React, { useState, useEffect } from 'react';
import { getServices } from '@/lib/supabase';
import { Service } from '@/lib/types';
import { ServiceCard } from '@/components/ServiceCard';
import { PRIMARY_PHONE, WHATSAPP_LINK } from '@/lib/constants';
import { Layers, Sun, Phone } from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    async function loadServices() {
      const data = await getServices();
      setServices(data);
    }
    loadServices();
  }, []);

  const workflowSteps = [
    {
      step: '01',
      title: 'SITE LOAD & ACOUSTIC AUDIT',
      desc: 'Technical site survey in Addis Ababa to calculate daily kilowatt-hour demand or venue acoustic dimensions.',
    },
    {
      step: '02',
      title: 'SYSTEM DESIGN & CAPACITY SIZING',
      desc: 'Custom solar array sizing, hybrid inverter specification, and lithium battery configuration.',
    },
    {
      step: '03',
      title: 'HARDWARE MOUNTING & WIRING',
      desc: 'Professional roof panel mounting, DC disconnect wiring, and LiFePO4 battery BMS setup.',
    },
    {
      step: '04',
      title: 'TESTING & COMMISSIONING',
      desc: 'Full load testing under grid-tied/off-grid mode, and MPPT charging calibration.',
    },
  ];

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-8 py-12 space-y-16">
      {/* Header Banner */}
      <div className="border-b border-kith-border pb-8 space-y-3">
        <div className="text-[10px] font-mono tracking-superwide text-kith-muted uppercase flex items-center gap-2">
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          SEBRIN TRADING PLC // SOLAR SYSTEM ENGINEERING
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight uppercase text-kith-bone">
          TURNKEY SOLAR INSTALLATION SOLUTIONS
        </h1>
        <p className="text-xs sm:text-sm font-mono text-kith-muted max-w-3xl leading-relaxed">
          From high-capacity 5.5kW hybrid solar inverter systems and LiFePO4 lithium battery banks, we deliver turnkey technical solutions in Addis Ababa.
        </p>
      </div>

      {/* Services List */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-kith-border pb-3">
          <h2 className="text-xs font-mono uppercase tracking-widest text-kith-bone font-bold flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            AVAILABLE TECHNICAL SERVICES ({services.length})
          </h2>
        </div>

        <div className="space-y-6">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </section>

      {/* Workflow Process Step Section */}
      <section className="bg-kith-card border border-kith-border p-8 sm:p-12 space-y-8">
        <div className="space-y-2 border-b border-kith-border pb-6">
          <span className="text-[10px] font-mono tracking-superwide text-kith-muted uppercase block">
            OUR TECHNICAL PROCESS
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-kith-bone uppercase">
            END-TO-END SYSTEM IMPLEMENTATION WORKFLOW
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((ws) => (
            <div key={ws.step} className="border border-kith-border bg-kith-subBg p-6 space-y-3">
              <span className="text-2xl font-mono font-extrabold text-amber-500 block">
                {ws.step}
              </span>
              <h3 className="text-xs font-mono font-bold uppercase text-kith-bone tracking-wider">
                {ws.title}
              </h3>
              <p className="text-xs font-mono text-kith-muted leading-relaxed">
                {ws.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="pt-6 border-t border-kith-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-mono font-bold text-kith-bone uppercase">
              NEED CUSTOM SOLAR SIZING QUOTE?
            </h4>
            <p className="text-xs font-mono text-kith-muted">
              Contact Sebrin Trading PLC directly via WhatsApp or phone to request an engineering consultation.
            </p>
          </div>

          <a
            href={`${WHATSAPP_LINK}?text=${encodeURIComponent('Hello Sebrin Trading PLC, I would like to request a quote for solar power sizing.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 bg-kith-btnPrimaryBg text-kith-btnPrimaryText hover:bg-kith-btnPrimaryHover text-xs font-mono tracking-widest uppercase font-bold flex items-center justify-center gap-2 transition-all shadow-xl"
          >
            <Phone className="w-4 h-4 text-emerald-500" />
            CONTACT WHATSAPP ({PRIMARY_PHONE})
          </a>
        </div>
      </section>
    </div>
  );
}
