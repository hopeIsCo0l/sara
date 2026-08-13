'use client';

import React, { useState, useEffect } from 'react';
import { getServices } from '@/lib/supabase';
import { Service } from '@/lib/types';
import { ServiceCard } from '@/components/ServiceCard';
import { PRIMARY_PHONE, WHATSAPP_LINK } from '@/lib/constants';
import { Layers, Sun, Phone, CheckCircle } from 'lucide-react';

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
      title: 'Site Load Audit',
      desc: 'Technical site survey in Addis Ababa to calculate daily kilowatt-hour demand or venue acoustic dimensions.',
    },
    {
      step: '02',
      title: 'System Design & Sizing',
      desc: 'Custom solar array sizing, hybrid inverter specification, and lithium battery configuration.',
    },
    {
      step: '03',
      title: 'Hardware Mounting',
      desc: 'Professional roof panel mounting, DC disconnect wiring, and LiFePO4 battery BMS setup.',
    },
    {
      step: '04',
      title: 'Commissioning',
      desc: 'Full load testing under grid-tied/off-grid mode, and MPPT charging calibration.',
    },
  ];

  return (
    <div className="bg-gray-50 pb-20">
      {/* Header Banner */}
      <div className="bg-white border-b border-gray-200 pt-16 pb-12">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 text-kith-accent rounded-full text-xs font-bold tracking-widest uppercase">
            <Sun className="w-4 h-4" />
            Sara Power Solution plc // Services
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Turnkey Solar Installation Solutions
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl leading-relaxed font-medium">
            From high-capacity 5.5kW hybrid solar inverter systems and LiFePO4 lithium battery banks, we deliver turnkey technical solutions in Addis Ababa.
          </p>
        </div>
      </div>

      <div className="max-w-[1700px] mx-auto px-4 sm:px-8 pt-12 space-y-20">
        {/* Services List */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <h2 className="text-sm font-bold tracking-widest text-gray-900 uppercase flex items-center gap-2">
              <Layers className="w-5 h-5 text-kith-accent" />
              Available Technical Services ({services.length})
            </h2>
          </div>

          <div className="space-y-8">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </section>

        {/* Workflow Process Step Section */}
        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-14 space-y-12">
          <div className="space-y-3 border-b border-gray-100 pb-6">
            <span className="text-xs font-bold tracking-widest text-kith-accent uppercase block">
              Our Technical Process
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
              End-to-End System Implementation Workflow
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflowSteps.map((ws) => (
              <div key={ws.step} className="bg-gray-50 rounded-2xl border border-gray-100 p-8 space-y-4 hover:shadow-md hover:bg-white transition-all duration-300">
                <span className="text-3xl font-extrabold text-amber-500 block">
                  {ws.step}
                </span>
                <h3 className="text-lg font-bold text-gray-900">
                  {ws.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {ws.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-lg font-bold text-gray-900">
                Need a Custom Solar Sizing Quote?
              </h4>
              <p className="text-sm text-gray-500 font-medium mt-1">
                Contact Sara Power Solution plc directly via WhatsApp or phone to request an engineering consultation.
              </p>
            </div>

            <a
              href={`${WHATSAPP_LINK}?text=${encodeURIComponent('Hello Sara Power Solution plc, I would like to request a quote for solar power sizing.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-kith-accent text-white hover:bg-[#8B1E20] rounded-full text-sm font-bold flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg"
            >
              <Phone className="w-5 h-5" />
              Contact WhatsApp ({PRIMARY_PHONE})
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
