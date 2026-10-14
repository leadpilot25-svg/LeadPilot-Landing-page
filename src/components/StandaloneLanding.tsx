import React from 'react';
import { ClientConfig } from '../types';
import { LiveWebsitePreview } from './LiveWebsitePreview';
import { MapPin, Star, CheckCircle, Search, TrendingUp, Phone, MessageSquare } from 'lucide-react';
import { formatPhoneForWhatsApp } from '../utils/phoneUtils';

interface StandaloneLandingProps {
  config: ClientConfig;
}

/**
 * Standalone Client Landing Website Component
 * 
 * Standalone, customer-ready landing website.
 * Guaranteed to NEVER render:
 * - Dev Mode
 * - Client Mode selector / HeaderBar
 * - CRM dashboard
 * - Internal configuration drawer
 * - Developer debugging panels
 * 
 * Features:
 * - Client branding, hero, tagline, services, benefits
 * - Google Business Profile (GBP/GMP) Optimization showcase
 * - Responsive lead capture form with instant validation & Thank You state
 * - WhatsApp action buttons (with phone normalization & pre-filled messages)
 * - Click-to-call mobile buttons
 */
export const StandaloneLanding: React.FC<StandaloneLandingProps> = ({ config }) => {
  // Ensure sample data notice and dev toggles are strictly OFF for client landing deployment
  const productionConfig: ClientConfig = {
    ...config,
    sampleDataNoticeEnabled: false,
    heroTrustBadgesEnabled: false,
  };

  const whatsappPhone = config.whatsAppNumber || config.phoneRaw || config.phone || '';
  const formattedWaNumber = formatPhoneForWhatsApp(whatsappPhone, config.defaultCountryCode || '91');
  const defaultMessage = config.whatsAppMessageTemplate
    ? encodeURIComponent(
        config.whatsAppMessageTemplate
          .replace('{name}', 'Client')
          .replace('{businessName}', config.businessName)
          .replace('{service}', config.services?.[0]?.title || 'Consultation')
      )
    : encodeURIComponent(`Hi, I'm reaching out from ${config.businessName} to schedule a consultation.`);

  const waLink = formattedWaNumber
    ? `https://wa.me/${formattedWaNumber}?text=${defaultMessage}`
    : '#contact';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Google Business Profile & Local Search Highlights Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white text-xs py-2 px-4 shadow-sm border-b border-blue-600/30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 font-medium">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <Search className="w-3 h-3 text-amber-300" />
              Verified Local Business
            </span>
            <span className="hidden sm:inline text-blue-100">
              Top Ranked on Google Business Profile & Local Search in {config.serviceArea || config.cityStateZip}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {config.averageRating ? (
              <div className="flex items-center gap-1 text-amber-300 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                <span>{config.averageRating.toFixed(1)} Rating ({config.reviewCount || 45}+ Google Reviews)</span>
              </div>
            ) : null}

            {whatsappPhone && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-3 py-1 rounded-full text-[11px] flex items-center gap-1.5 transition shadow"
              >
                <MessageSquare className="w-3 h-3" />
                <span>Chat on WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Website Presentation (Client Mode: no dev controls, pure client UI) */}
      <main className="flex-1">
        <LiveWebsitePreview config={productionConfig} appMode="client" />
      </main>

      {/* Google Business Profile & Local Trust Footer Bar */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center font-black text-xs">
              {config.businessName?.charAt(0) || 'L'}
            </div>
            <div>
              <p className="font-bold text-white">{config.businessName}</p>
              <p className="text-[11px] text-slate-400">
                Google Business Profile Optimised • {config.cityStateZip}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5" /> Fast Response Guaranteed
            </span>
            <span className="flex items-center gap-1 text-blue-400">
              <TrendingUp className="w-3.5 h-3.5" /> High Customer Satisfaction
            </span>
          </div>

          <div className="text-right text-[11px] text-slate-500">
            © {new Date().getFullYear()} {config.businessName}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
