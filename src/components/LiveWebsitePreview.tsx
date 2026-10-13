import React, { useState } from 'react';
import { ClientConfig } from '../types';
import { saveLead } from '../utils/leadStorage';
import {
  Phone,
  Clock,
  MapPin,
  ShieldCheck,
  Star,
  CheckCircle2,
  AlertTriangle,
  Award,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Droplets,
  Snowflake,
  Flame,
  Home,
  Wrench,
  Search,
  Key,
  Shield,
  Palette,
  Hammer,
  RefreshCw,
  Send,
  Check,
  X,
  CreditCard,
  Building,
  CheckSquare
} from 'lucide-react';

interface LiveWebsitePreviewProps {
  config: ClientConfig;
  appMode?: 'development' | 'client';
}

export const LiveWebsitePreview: React.FC<LiveWebsitePreviewProps> = ({ config, appMode = 'development' }) => {
  // Interactive state
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [beforeAfterToggle, setBeforeAfterToggle] = useState<Record<string, 'after' | 'before'>>({});
  
  // Lead Form State
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(false);
  const [submittedPayload, setSubmittedPayload] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    address: '',
    details: '',
    message: '',
    gotcha: '', // Honeypot spam protection
  });

  const displayPhone = (config.phone || config.businessPhone || '').trim();
  const displayPhoneRaw = (config.phoneRaw || displayPhone).replace(/[^0-9+]/g, '');
  const displayEmail = (config.email || config.businessEmail || '').trim();
  const displayAddress = (config.address || config.businessAddress || '').trim();
  const displayCity = (config.cityStateZip || config.serviceArea || '').trim();
  const displayWebsiteUrl = (config.websiteUrl || '').trim();
  const displayGbpUrl = (config.googleBusinessProfileUrl || config.googleBusinessProfileLink || config.googleMapsLink || '').trim();
  const displayLogo = (config.logoUrl || config.logo || '').trim();
  const displayRating = config.averageRating ?? config.googleRating ?? 0;
  const displayReviewCount = config.reviewCount ?? config.googleReviewCount ?? 0;

  const isTarot = (config.industry || '').toLowerCase().includes('tarot') || (config.clientId || '').toLowerCase().includes('tarot') || (config.businessName || '').toLowerCase().includes('tarot');
  const isHVAC = (config.industry || '').toLowerCase().includes('hvac') || (config.industry || '').toLowerCase().includes('air conditioning') || (config.clientId || '').toLowerCase().includes('hvac');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Honeypot spam check
    if (formData.gotcha) {
      console.warn('Spam submission detected and blocked.');
      return;
    }

    // 2. Frontend Validation
    const cleanName = formData.name.trim().slice(0, 100);
    const cleanPhone = formData.phone.trim().slice(0, 25);
    const cleanService = formData.service.trim().slice(0, 100);
    const cleanDetails = (formData.details || formData.message || '').trim().slice(0, 1000);
    const cleanAddress = (formData.address || '').trim().slice(0, 200);

    if (!cleanName) {
      alert('Please enter your full name.');
      return;
    }

    const rawPhoneDigits = cleanPhone.replace(/\D/g, '');
    if (rawPhoneDigits.length < 7) {
      alert('Please enter a valid phone number with at least 7 digits.');
      return;
    }

    if (!cleanService) {
      alert('Please select a service requested.');
      return;
    }

    setFormSubmitting(true);
    setFormError(false);

    // Formatted payload structured for Google Apps Script / Google Sheets & LeadPilot mapping
    const endpoint = config.formEndpoint ? config.formEndpoint.trim() : '';
    
    const leadPayload = {
      clientId: config.clientId || `client-${(config.industry || 'trade').toLowerCase().replace(/[^a-z0-9]/g, '')}-01`,
      businessName: config.businessName,
      name: cleanName,
      phone: cleanPhone,
      service: cleanService,
      details: cleanDetails || 'No additional details provided.',
      address: cleanAddress || config.cityStateZip || '',
      leadSource: config.leadSource || 'Google Business Profile / Local Search',
      pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      timestamp: new Date().toISOString(),
    };

    try {
      // saveLead saves locally and syncs to Google Apps Script Web App remotely if endpoint is provided
      const savedLead = saveLead(leadPayload, endpoint);

      if (!endpoint) {
        // Simulation delay for local Demo Mode
        await new Promise((resolve) => setTimeout(resolve, 600));
      }

      setSubmittedPayload(savedLead);
      setFormSubmitted(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: '',
        address: '',
        details: '',
        message: '',
        gotcha: '',
      });
    } catch (err) {
      console.error('Lead submission error:', err);
      setFormError(true);
    } finally {
      setFormSubmitting(false);
    }
  };

  const renderIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'snowflake': return <Snowflake className="w-6 h-6" />;
      case 'flame': return <Flame className="w-6 h-6" />;
      case 'zap': return <Zap className="w-6 h-6" />;
      case 'droplets': return <Droplets className="w-6 h-6" />;
      case 'wrench': return <Wrench className="w-6 h-6" />;
      case 'home': return <Home className="w-6 h-6" />;
      case 'key': return <Key className="w-6 h-6" />;
      case 'shield': return <Shield className="w-6 h-6" />;
      case 'palette': return <Palette className="w-6 h-6" />;
      case 'hammer': return <Hammer className="w-6 h-6" />;
      case 'refreshcw': return <RefreshCw className="w-6 h-6" />;
      default: return <Wrench className="w-6 h-6" />;
    }
  };

  // Dynamic CSS styling derived from CONFIG
  const dynamicStyles = {
    primaryBg: { backgroundColor: config.primaryColor || '#0F172A' },
    primaryText: { color: config.primaryColor || '#0F172A' },
    accentBg: { backgroundColor: config.accentColor || '#2563EB' },
    accentText: { color: config.accentColor || '#2563EB' },
    accentBorder: { borderColor: config.accentColor || '#2563EB' },
  };

  return (
    <div className="font-sans bg-slate-50 text-slate-900 min-h-screen selection:bg-blue-100 selection:text-blue-900 pb-20 md:pb-0">
      
      {/* ----------------------------------------------------
         0. TEMPLATE SAMPLE DATA NOTICE BANNER
      ---------------------------------------------------- */}
      {config.sampleDataNoticeEnabled === true && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 px-4 py-1.5 text-xs">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 font-medium">
            <div className="flex items-center gap-2">
              <span className="bg-amber-200/80 text-amber-950 font-black px-2 py-0.5 rounded text-[10px] uppercase tracking-wide">
                Sample Data Notice
              </span>
              <span className="text-amber-900 text-[11px]">
                Customer claims, reviews, ratings, and statistics are sample template placeholders. Replace with real client data prior to launch.
              </span>
            </div>
            {displayGbpUrl && (
              <a
                href={displayGbpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-amber-900 underline hover:text-amber-700 flex items-center gap-1"
              >
                <span>View Client GBP</span>
                <Search className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
         1. TOP NOTIFICATION BAR
      ---------------------------------------------------- */}
      <div style={dynamicStyles.primaryBg} className="text-slate-100 text-xs py-2 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {config.heroStatusText && config.heroStatusText.trim() !== '' && (
              <span className="bg-rose-500/20 text-rose-300 font-extrabold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider border border-rose-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                {config.heroStatusText}
              </span>
            )}
            {config.emergencyAvailability && <span className="font-medium hidden sm:inline">{config.emergencyAvailability}</span>}
          </div>

          <div className="flex items-center gap-4 text-xs">
            {displayCity && (
              <div className="hidden md:flex items-center gap-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Serving: <strong className="text-white">{displayCity}</strong></span>
              </div>
            )}
            {displayPhone && (
              <a
                href={`tel:${displayPhoneRaw}`}
                className="flex items-center gap-1.5 font-black text-white hover:text-blue-300 transition"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                <span>{displayPhone}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------
         2. STICKY HEADER
      ---------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            {displayLogo ? (
              <img src={displayLogo} alt={config.businessName} className="h-10 w-auto rounded object-cover" />
            ) : (
              <div style={dynamicStyles.primaryBg} className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-black text-lg shrink-0">
                {config.businessName ? config.businessName.charAt(0) : 'B'}
              </div>
            )}
            <div>
              <span style={dynamicStyles.primaryText} className="font-black text-lg tracking-tight block leading-tight">
                {config.businessName}
              </span>
              {config.tagline && (
                <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase block">
                  {config.tagline}
                </span>
              )}
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-6 font-bold text-sm text-slate-700">
            {config.services && config.services.length > 0 && (
              <a href="#services" className="hover:text-blue-600 transition">Services</a>
            )}
            {((config.whyUsItems && config.whyUsItems.length > 0) || (config.trustBadges && config.trustBadges.length > 0)) && (
              <a href="#why-us" className="hover:text-blue-600 transition">Why Choose Us</a>
            )}
            {config.testimonials && config.testimonials.length > 0 && (
              <a href="#reviews" className="hover:text-blue-600 transition">Reviews</a>
            )}
            {config.faqs && config.faqs.length > 0 && (
              <a href="#faqs" className="hover:text-blue-600 transition">FAQs</a>
            )}
            <a href="#contact" className="hover:text-blue-600 transition">Contact</a>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            {displayPhone && (
              <a
                href={`tel:${displayPhoneRaw}`}
                style={dynamicStyles.accentBg}
                className="hidden sm:inline-flex items-center justify-center gap-2 text-white text-xs font-black px-3.5 sm:px-4 py-2.5 rounded-lg shadow-md hover:brightness-110 transition whitespace-nowrap min-w-0 shrink-0 text-center"
              >
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Call Now: {displayPhone}</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ----------------------------------------------------
         3. HERO SECTION
      ---------------------------------------------------- */}
      <section id="contact" style={dynamicStyles.primaryBg} className="text-white py-12 md:py-16 lg:py-20 relative overflow-hidden scroll-mt-20 md:scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            {/* HERO EYEBROW / BADGE */}
            {config.heroEyebrow !== undefined ? (
              config.heroEyebrow.trim() !== '' && (
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-200">
                  <span>{config.heroEyebrow}</span>
                </div>
              )
            ) : (config.testimonials && config.testimonials.length > 0 && displayRating > 0 && displayReviewCount > 0) ? (
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs font-semibold text-blue-200">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span><strong>{displayRating}</strong> Rating ({displayReviewCount}+ Verified Local Reviews)</span>
              </div>
            ) : config.tagline ? (
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs font-semibold text-blue-200">
                <span>{config.tagline}</span>
              </div>
            ) : null}

            {/* HERO HEADLINE */}
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {config.heroTitle}
              {config.heroTitleHighlight && (
                <span className="block text-amber-400 mt-1">{config.heroTitleHighlight}</span>
              )}
              {config.heroTitleEnd && (
                <span className="inline-block ml-2">{config.heroTitleEnd}</span>
              )}
            </h1>

            {/* HERO SUBHEADLINE */}
            {config.heroSubheadline && (
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                {config.heroSubheadline}
              </p>
            )}

            {/* HERO CTA BUTTONS */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* PRIMARY CTA */}
              {(config.heroPrimaryCtaText === undefined ? true : config.heroPrimaryCtaText.trim() !== '') && (
                displayPhone ? (
                  <a
                    href={`tel:${displayPhoneRaw}`}
                    style={dynamicStyles.accentBg}
                    className="inline-flex items-center justify-center gap-2 text-white font-extrabold text-sm sm:text-base px-5 sm:px-6 py-3.5 rounded-xl shadow-xl hover:scale-[1.02] transition whitespace-nowrap min-w-0 max-w-full text-center"
                  >
                    <Phone className="w-5 h-5 animate-bounce shrink-0" />
                    <span className="truncate">{config.heroPrimaryCtaText || `Call Now: ${displayPhone}`}</span>
                  </a>
                ) : (
                  <a
                    href="#contact"
                    style={dynamicStyles.accentBg}
                    className="inline-flex items-center justify-center gap-2 text-white font-extrabold text-sm sm:text-base px-5 sm:px-6 py-3.5 rounded-xl shadow-xl hover:scale-[1.02] transition whitespace-nowrap min-w-0 max-w-full text-center"
                  >
                    <Send className="w-5 h-5 shrink-0" />
                    <span className="truncate">{config.heroPrimaryCtaText || 'Request Service'}</span>
                  </a>
                )
              )}

              {/* SECONDARY CTA */}
              {(config.heroSecondaryCtaText === undefined ? true : config.heroSecondaryCtaText.trim() !== '') && (
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base px-5 sm:px-6 py-3.5 rounded-xl border border-white/20 transition whitespace-nowrap min-w-0 max-w-full text-center"
                >
                  <span className="truncate">{config.heroSecondaryCtaText || (isTarot ? 'Request Guidance' : isHVAC ? 'Request AC Service' : 'Request Service')}</span>
                </a>
              )}
            </div>

            {config.heroTrustBadgesEnabled === true && ((config.trustBadges && config.trustBadges.length > 0) || (config.whyUsItems && config.whyUsItems.length > 0)) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-white/10 text-xs">
                {config.trustBadges && config.trustBadges.length > 0 ? (
                  config.trustBadges.slice(0, 3).map((tb, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>{tb.title}</span>
                    </div>
                  ))
                ) : config.whyUsItems && config.whyUsItems.length > 0 ? (
                  config.whyUsItems.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>{item.title}</span>
                    </div>
                  ))
                ) : null}
              </div>
            )}
          </div>

          {/* DISPATCH TICKET FORM CARD */}
          <div className="lg:col-span-5">
            <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-2xl border-2 border-blue-500/30">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div>
                  {config.leadFormStatusText && config.leadFormStatusText.trim() !== '' && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 inline-flex">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      {config.leadFormStatusText}
                    </span>
                  )}
                  <h3 style={dynamicStyles.primaryText} className={`text-lg font-black ${config.leadFormStatusText && config.leadFormStatusText.trim() !== '' ? 'mt-2' : ''}`}>
                    {config.finalCtaHeading || 'Request Service'}
                  </h3>
                  {config.finalCtaDescription && (
                    <p className="text-xs text-slate-500 mt-0.5">{config.finalCtaDescription}</p>
                  )}
                </div>
              </div>

              {formSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-6 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <div>
                    <h4 className="text-base font-extrabold text-emerald-950">
                      Request received — we'll contact you shortly.
                    </h4>
                    <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                      Thank you for contacting <strong>{config.businessName}</strong>. Our team has received your service request and will call you back promptly.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline inline-block"
                    >
                      ← Submit another request
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-3">
                  {formError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-900 p-3 rounded-lg text-xs font-medium space-y-2">
                      <p className="font-bold">Something went wrong. Please call us directly.</p>
                      {displayPhone && (
                        <a
                          href={`tel:${displayPhone.replace(/[^0-9+]/g, '')}`}
                          className="inline-flex items-center justify-center gap-1.5 bg-rose-600 text-white font-bold px-3 py-1.5 rounded text-xs w-full"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          Call {displayPhone} Now
                        </a>
                      )}
                    </div>
                  )}

                  {/* Honeypot Spam Protection */}
                  <input
                    type="text"
                    name="gotcha"
                    value={formData.gotcha}
                    onChange={handleInputChange}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Anil Kumar"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Service Needed *</label>
                      <select
                        name="service"
                        required
                        value={formData.service}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none transition"
                      >
                        <option value="">Select Service...</option>
                        {config.services.map((s) => (
                          <option key={s.id} value={s.title}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isTarot ? "Session Details & Notes" : "Service Details & Notes"}
                    </label>
                    <textarea
                      name="details"
                      rows={2}
                      value={formData.details}
                      onChange={handleInputChange}
                      placeholder={isTarot ? "Tell us what you'd like guidance on (e.g. career, relationships, or personal growth)..." : isHVAC ? "Describe the problem or request (e.g. AC blowing warm air)..." : "Describe the problem or service details..."}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none transition resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isTarot ? "Location / Session Preference" : "Street Address"}
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder={isTarot ? "Online or in-person in Kochi" : `e.g. 123 Main St, ${config.cityStateZip}`}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    style={dynamicStyles.accentBg}
                    className="w-full text-white font-extrabold text-sm py-3 rounded-lg shadow-lg hover:brightness-110 transition flex items-center justify-center gap-2"
                  >
                    {formSubmitting ? (
                      <span>Dispatching Request...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{config.finalCtaButtonText || 'Request Service'}</span>
                      </>
                    )}
                  </button>

                  {config.leadFormTrustText && config.leadFormTrustText.trim() !== '' && (
                    <p className="text-[10px] text-center text-slate-400">
                      {config.leadFormTrustText}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ----------------------------------------------------
         4. STATS COUNTER BAR
      ---------------------------------------------------- */}
      {(config.stats && config.stats.length > 0) && (
        <section className="bg-white border-b border-slate-200 py-8 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {config.stats.map((st, i) => (
              <div key={i} className="space-y-1 relative group">
                <div style={dynamicStyles.accentText} className="text-3xl font-black tracking-tight">
                  {st.value}
                </div>
                <div style={dynamicStyles.primaryText} className="text-sm font-extrabold">
                  {st.label}
                </div>
                <div className="text-xs text-slate-500 font-medium flex items-center justify-center gap-1">
                  <span>{st.sublabel}</span>
                  {appMode === 'development' && (
                    <span className="text-[9px] bg-slate-100 text-slate-500 px-1 rounded font-mono border border-slate-200" title="Template Sample Metric">
                      Sample
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ----------------------------------------------------
         5. WHY CHOOSE US
      ---------------------------------------------------- */}
      {((config.whyUsItems && config.whyUsItems.length > 0) || (config.trustBadges && config.trustBadges.length > 0) || config.whyUsHeading) && (
        <section id="why-us" className="py-12 md:py-16 lg:py-20 bg-slate-100 border-t border-slate-200/60 scroll-mt-20 md:scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
              {(config.whyUsEyebrow === undefined || config.whyUsEyebrow.trim() !== '') && (
                <span style={dynamicStyles.accentText} className="text-xs font-black uppercase tracking-widest block mb-2">
                  {config.whyUsEyebrow ? config.whyUsEyebrow : `Why Choose ${config.businessName}`}
                </span>
              )}
              {(config.whyUsHeading === undefined || config.whyUsHeading.trim() !== '') && (
                <h2 style={dynamicStyles.primaryText} className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
                  {config.whyUsHeading ? config.whyUsHeading : (isTarot ? 'Why Clients Choose Our Services' : isHVAC ? 'Why Customers Choose Our AC Services' : 'Why Customers Choose Our Services')}
                </h2>
              )}
              {config.whyUsDescription && (
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {config.whyUsDescription}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {config.whyUsItems && config.whyUsItems.length > 0 ? (
                config.whyUsItems.map((item, idx) => (
                  <div key={idx} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                    <div style={dynamicStyles.accentBg} className="w-12 h-12 rounded-xl text-white flex items-center justify-center shrink-0 shadow-md">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : config.trustBadges && config.trustBadges.length > 0 ? (
                config.trustBadges.slice(0, 3).map((badge, idx) => (
                  <div key={idx} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                    <div style={dynamicStyles.accentBg} className="w-12 h-12 rounded-xl text-white flex items-center justify-center shrink-0 shadow-md">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">{badge.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {badge.subtitle}
                      </p>
                    </div>
                  </div>
                ))
              ) : null}
            </div>
          </div>
        </section>
      )}

      {/* ----------------------------------------------------
         6. SERVICES SECTION
      ---------------------------------------------------- */}
      <section id="services" className="py-12 md:py-16 lg:py-20 bg-white border-t border-slate-200/60 scroll-mt-20 md:scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
            {(config.servicesEyebrow === undefined || config.servicesEyebrow.trim() !== '') && (
              <span style={dynamicStyles.accentText} className="text-xs font-black uppercase tracking-widest block mb-2">
                {config.servicesEyebrow ? config.servicesEyebrow : 'Our Services'}
              </span>
            )}
            {(config.servicesHeading === undefined || config.servicesHeading.trim() !== '') && (
              <h2 style={dynamicStyles.primaryText} className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
                {config.servicesHeading ? config.servicesHeading : 'Professional Trade & Service Solutions'}
              </h2>
            )}
            {config.servicesDescription && (
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {config.servicesDescription}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {config.services.map((srv) => (
              <div
                key={srv.id}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 hover:shadow-lg transition flex flex-col justify-between h-full group"
              >
                <div className="flex-1 flex flex-col">
                  <div style={dynamicStyles.accentBg} className="w-12 h-12 rounded-xl text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition shrink-0">
                    {renderIcon(srv.iconName)}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{srv.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed flex-1">{srv.description}</p>

                  {srv.features && srv.features.length > 0 && (
                    <ul className="space-y-2 mb-6 pt-2 border-t border-slate-200/80">
                      {srv.features.map((feat, fi) => (
                        <li key={fi} className="text-xs sm:text-sm text-slate-700 font-medium flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {displayPhone ? (
                  <a
                    href={`tel:${displayPhoneRaw}`}
                    style={dynamicStyles.primaryBg}
                    className="w-full text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-lg text-center hover:opacity-95 transition flex items-center justify-center gap-2 min-w-0 mt-auto"
                  >
                    <span>{config.finalCtaButtonText || (isTarot ? 'Request Session' : isHVAC ? 'Request AC Service' : 'Request Service')}</span>
                  </a>
                ) : (
                  <a
                    href="#contact"
                    style={dynamicStyles.primaryBg}
                    className="w-full text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-lg text-center hover:opacity-95 transition flex items-center justify-center gap-2 min-w-0 mt-auto"
                  >
                    <span>{config.finalCtaButtonText || (isTarot ? 'Request Session' : isHVAC ? 'Request AC Service' : 'Request Service')}</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
         7. EMERGENCY CALLOUT BANNER
      ---------------------------------------------------- */}
      {(config.hasEmergencyService !== false && (Boolean(config.emergencyHeading) || Boolean(config.emergencyAvailability) || Boolean(config.emergencyDescription))) && (
        <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div style={dynamicStyles.primaryBg} className="rounded-3xl p-8 lg:p-12 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
              <h2 className="text-2xl sm:text-4xl font-black">
                {config.emergencyHeading || 'Emergency Service Needed Right Now?'}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
                {config.emergencyDescription || `Need urgent assistance? Our local dispatch team is ready to assist you${displayCity ? ` in ${displayCity}` : ''}.`}
              </p>
              {displayPhone ? (
                <a
                  href={`tel:${displayPhoneRaw}`}
                  style={dynamicStyles.accentBg}
                  className="inline-flex items-center justify-center gap-2 text-white font-black text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl shadow-xl hover:scale-[1.02] transition whitespace-nowrap min-w-0 max-w-full text-center"
                >
                  <Phone className="w-5 h-5 animate-bounce shrink-0" />
                  <span className="truncate">{config.emergencyCtaText || `Emergency Hotline: ${displayPhone}`}</span>
                </a>
              ) : (
                <a
                  href="#contact"
                  style={dynamicStyles.accentBg}
                  className="inline-flex items-center justify-center gap-2 text-white font-black text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl shadow-xl hover:scale-[1.02] transition whitespace-nowrap min-w-0 max-w-full text-center"
                >
                  <Send className="w-5 h-5 shrink-0" />
                  <span className="truncate">{config.emergencyCtaText || 'Request Priority Service'}</span>
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ----------------------------------------------------
         8. REVIEWS & TESTIMONIALS
      ---------------------------------------------------- */}
      {config.testimonials && config.testimonials.length > 0 && (
        <section id="reviews" className="py-12 md:py-16 lg:py-20 bg-slate-100 border-t border-slate-200/60 scroll-mt-20 md:scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
              <span style={dynamicStyles.accentText} className="text-xs font-black uppercase tracking-widest block mb-1">
                {config.reviewsEyebrow || (appMode === 'development' ? 'Sample Customer Testimonials' : 'Customer Testimonials')}
              </span>
              <h2 style={dynamicStyles.primaryText} className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
                {config.reviewsHeading || `Customer Reviews ${displayReviewCount > 0 ? `(${displayReviewCount}+)` : ''}`}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {config.reviewsDescription || (appMode === 'development'
                  ? '[Sample Template Reviews — Replace with real client feedback from Google Business Profile]'
                  : `Verified customer feedback and service ratings${displayCity ? ` across ${displayCity}` : ''}`)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {config.testimonials.map((t) => (
                <div key={t.id} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex text-amber-400">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      {appMode === 'development' ? (
                        <span className="bg-amber-100 text-amber-900 text-[9px] font-extrabold px-2 py-0.5 rounded border border-amber-200 uppercase tracking-wider">
                          Sample Review
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed mb-4">
                      "{t.comment}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm font-extrabold text-slate-900">{t.author}</div>
                      <div className="text-[10px] sm:text-xs text-slate-500">{t.location} • {t.service}</div>
                    </div>
                    {appMode === 'development' && (
                      <span className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded-full border border-slate-200">
                        Sample Client Data
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Google Business Profile Review CTA */}
            {displayGbpUrl && (
              <div className="mt-8 text-center bg-white p-4 sm:p-6 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-sm max-w-2xl mx-auto">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-current shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    Read all reviews & ratings on Google Business Profile
                  </span>
                </div>
                <a
                  href={displayGbpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-lg transition inline-flex items-center gap-1.5 shrink-0"
                >
                  <span>View Us On Google</span>
                  <Search className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

          </div>
        </section>
      )}

      {/* ----------------------------------------------------
         9. FINANCING AVAILABLE SECTION
      ---------------------------------------------------- */}
      {config.financingEnabled === true && (
        <section className="py-12 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600 shrink-0" />
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  {config.financingTitle || 'Flexible Financing Options Available'}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                {config.financingDescription || 'Ask us about easy payment plans and flexible financing options for your project.'}
              </p>
            </div>
            {displayPhone ? (
              <a
                href={`tel:${displayPhoneRaw}`}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-lg transition shrink-0"
              >
                {config.financingCtaText || 'Apply For Financing'}
              </a>
            ) : (
              <a
                href="#contact"
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-lg transition shrink-0"
              >
                {config.financingCtaText || 'Inquire About Financing'}
              </a>
            )}
          </div>
        </section>
      )}

      {/* ----------------------------------------------------
         10. FAQS
      ---------------------------------------------------- */}
      {config.faqs && config.faqs.length > 0 && (
        <section id="faqs" className="py-12 md:py-16 lg:py-20 bg-slate-50 border-t border-slate-200/60 scroll-mt-20 md:scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
              <span style={dynamicStyles.accentText} className="text-xs font-black uppercase tracking-widest block mb-2">
                Got Questions?
              </span>
              <h2 style={dynamicStyles.primaryText} className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
                {config.faqHeading || 'Frequently Asked Questions'}
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-3">
              {config.faqs.map((faq, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition"
                  >
                    <span>{faq.question}</span>
                    {activeFaq === idx ? <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>
                  {activeFaq === idx && (
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ----------------------------------------------------
         11. SERVICE AREAS & GOOGLE MAP
      ---------------------------------------------------- */}
      {((config.serviceAreas && config.serviceAreas.length > 0) || displayCity || config.googleMapsEmbedUrl) && (
        <section className="py-12 md:py-16 lg:py-20 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`grid grid-cols-1 ${config.googleMapsEmbedUrl ? 'lg:grid-cols-12' : ''} gap-8 lg:gap-10 items-center`}>
              <div className={`${config.googleMapsEmbedUrl ? 'lg:col-span-7' : 'max-w-4xl'} space-y-4`}>
                <span style={dynamicStyles.accentText} className="text-xs font-black uppercase tracking-widest block">
                  Local Service Coverage
                </span>
                <h2 style={dynamicStyles.primaryText} className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight max-w-4xl">
                  {config.serviceAreaHeading || `Servicing ${displayCity || config.businessName} & Surrounding Communities`}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                  {config.serviceAreaDescription || (isTarot ? 'Providing personal guidance and coaching sessions across Kochi, Kerala and online worldwide.' : isHVAC ? 'Providing doorstep AC repair, servicing and installation across Ernakulam, Kochi and nearby areas.' : `Providing professional services across ${displayCity || config.businessName || 'our service area'} and surrounding communities.`)}
                </p>

                {config.serviceAreas && config.serviceAreas.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {config.serviceAreas.map((area, ai) => (
                      <span key={ai} className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200">
                        📍 {area}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {config.googleMapsEmbedUrl && (
                <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-200 shadow-md h-72 bg-slate-100">
                  <iframe
                    src={config.googleMapsEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Service Map"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ----------------------------------------------------
         12. FOOTER
      ---------------------------------------------------- */}
      <footer style={dynamicStyles.primaryBg} className="text-slate-400 text-xs py-12 md:py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-3">
            <span className="font-black text-lg text-white block">{config.businessName}</span>
            {config.footerDescription !== undefined ? (
              config.footerDescription && <p className="text-slate-400 leading-relaxed max-w-md">{config.footerDescription}</p>
            ) : (
              config.tagline && <p className="text-slate-400 leading-relaxed max-w-md">{config.tagline}</p>
            )}
            {(displayAddress || displayCity) && (
              <p className="text-slate-300">
                📍 {displayAddress}{displayAddress && displayCity ? ', ' : ''}{displayCity}
              </p>
            )}
          </div>

          {(displayPhone || displayEmail || config.businessHours || displayWebsiteUrl) && (
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">Contact Info</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {displayPhone && (
                  <li>📞 Phone: <a href={`tel:${displayPhoneRaw}`} className="text-white font-semibold hover:underline">{displayPhone}</a></li>
                )}
                {displayEmail && <li>✉️ Email: <span className="text-white">{displayEmail}</span></li>}
                {config.businessHours && <li>🕒 Hours: <span className="text-white">{config.businessHours}</span></li>}
                {displayWebsiteUrl && (
                  <li>🌐 Website: <a href={displayWebsiteUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:underline">{displayWebsiteUrl}</a></li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-white/10 text-center text-xs text-slate-400">
          {config.footerCopyrightText !== undefined ? config.footerCopyrightText : `© ${new Date().getFullYear()} ${config.businessName}. All rights reserved.`}
        </div>
      </footer>

      {/* ----------------------------------------------------
         13. STICKY MOBILE BOTTOM BAR
      ---------------------------------------------------- */}
      <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 sm:p-3 flex items-center justify-center gap-2 shadow-2xl max-w-full overflow-hidden">
        {displayPhone ? (
          <>
            <a
              href={`tel:${displayPhoneRaw}`}
              style={dynamicStyles.accentBg}
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-white font-black text-xs py-3 px-2.5 rounded-lg text-center shadow whitespace-nowrap min-w-0"
            >
              <Phone className="w-4 h-4 shrink-0" />
              <span className="truncate">Call {displayPhone}</span>
            </a>
            <a
              href="#contact"
              style={dynamicStyles.primaryBg}
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-white font-bold text-xs py-3 px-2.5 rounded-lg text-center shadow whitespace-nowrap min-w-0"
            >
              <span className="truncate">{config.heroSecondaryCtaText || config.finalCtaButtonText || (isTarot ? 'Request Guidance' : isHVAC ? 'Request AC Service' : 'Request Service')}</span>
            </a>
          </>
        ) : (
          <a
            href="#contact"
            style={dynamicStyles.primaryBg}
            className="w-full inline-flex items-center justify-center gap-1.5 text-white font-bold text-xs py-3 px-2.5 rounded-lg text-center shadow whitespace-nowrap min-w-0"
          >
            <span className="truncate">{config.heroSecondaryCtaText || config.finalCtaButtonText || (isTarot ? 'Request Guidance' : isHVAC ? 'Request AC Service' : 'Request Service')}</span>
          </a>
        )}
      </div>

    </div>
  );
};
