import React, { useState } from 'react';
import { ClientConfig, ServiceItem, FaqItem } from '../types';
import { X, Save, RotateCcw, Copy, Check, Plus, Trash2, ArrowUp, ArrowDown, FileText } from 'lucide-react';

interface ConfigEditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: ClientConfig;
  onChangeConfig: (newConfig: ClientConfig) => void;
  onResetPreset: () => void;
}

export const ConfigEditorDrawer: React.FC<ConfigEditorDrawerProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
  onResetPreset,
}) => {
  const [activeTab, setActiveTab] = useState<'leadsystem' | 'general' | 'copy' | 'branding' | 'contact' | 'services' | 'seo' | 'integrations'>('leadsystem');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleFieldChange = (field: string, value: any) => {
    onChangeConfig({
      ...config,
      [field]: value,
    });
  };

  const handleAddFaq = () => {
    const currentFaqs = config.faqs || [];
    const newFaq: FaqItem = {
      question: 'New Frequently Asked Question',
      answer: 'Answer to the question goes here.',
    };
    onChangeConfig({
      ...config,
      faqs: [...currentFaqs, newFaq],
    });
  };

  const handleUpdateFaq = (index: number, key: keyof FaqItem, value: string) => {
    const updatedFaqs = [...(config.faqs || [])];
    updatedFaqs[index] = {
      ...updatedFaqs[index],
      [key]: value,
    };
    onChangeConfig({
      ...config,
      faqs: updatedFaqs,
    });
  };

  const handleRemoveFaq = (index: number) => {
    const updatedFaqs = (config.faqs || []).filter((_, i) => i !== index);
    onChangeConfig({
      ...config,
      faqs: updatedFaqs,
    });
  };

  const handleAddWhyUsItem = () => {
    const current = config.whyUsItems || [];
    onChangeConfig({
      ...config,
      whyUsItems: [...current, { title: 'New Trust Factor', description: 'Description of why customers choose us.' }],
    });
  };

  const handleUpdateWhyUsItem = (index: number, key: 'title' | 'description', value: string) => {
    const updated = [...(config.whyUsItems || [])];
    updated[index] = { ...updated[index], [key]: value };
    onChangeConfig({
      ...config,
      whyUsItems: updated,
    });
  };

  const handleRemoveWhyUsItem = (index: number) => {
    const updated = (config.whyUsItems || []).filter((_, i) => i !== index);
    onChangeConfig({
      ...config,
      whyUsItems: updated,
    });
  };

  const handleSeoChange = (field: string, value: any) => {
    onChangeConfig({
      ...config,
      seo: {
        ...config.seo,
        [field]: value,
      },
    });
  };

  const handleServiceChange = (index: number, key: keyof ServiceItem, value: any) => {
    const updatedServices = [...(config.services || [])];
    updatedServices[index] = {
      ...updatedServices[index],
      [key]: value,
    };
    onChangeConfig({
      ...config,
      services: updatedServices,
    });
  };

  const handleMoveService = (index: number, direction: 'up' | 'down') => {
    const updated = [...(config.services || [])];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    onChangeConfig({
      ...config,
      services: updated,
    });
  };

  const handleAddFeature = (serviceIndex: number) => {
    const updatedServices = [...(config.services || [])];
    const currentFeatures = updatedServices[serviceIndex].features || [];
    updatedServices[serviceIndex] = {
      ...updatedServices[serviceIndex],
      features: [...currentFeatures, 'New Feature Point'],
    };
    onChangeConfig({
      ...config,
      services: updatedServices,
    });
  };

  const handleUpdateFeature = (serviceIndex: number, featureIndex: number, value: string) => {
    const updatedServices = [...(config.services || [])];
    const currentFeatures = [...(updatedServices[serviceIndex].features || [])];
    currentFeatures[featureIndex] = value;
    updatedServices[serviceIndex] = {
      ...updatedServices[serviceIndex],
      features: currentFeatures,
    };
    onChangeConfig({
      ...config,
      services: updatedServices,
    });
  };

  const handleRemoveFeature = (serviceIndex: number, featureIndex: number) => {
    const updatedServices = [...(config.services || [])];
    const currentFeatures = (updatedServices[serviceIndex].features || []).filter((_, fi) => fi !== featureIndex);
    updatedServices[serviceIndex] = {
      ...updatedServices[serviceIndex],
      features: currentFeatures,
    };
    onChangeConfig({
      ...config,
      services: updatedServices,
    });
  };

  const handleAddService = () => {
    const newService: ServiceItem = {
      id: `service-${Date.now()}`,
      title: 'New Service',
      tagline: 'Professional service guarantee',
      description: 'Comprehensive service description for local customers.',
      iconName: 'Wrench',
      features: ['24/7 Availability', 'Licensed Technicians', 'Free Estimates'],
    };
    onChangeConfig({
      ...config,
      services: [...config.services, newService],
    });
  };

  const handleRemoveService = (index: number) => {
    const updatedServices = config.services.filter((_, i) => i !== index);
    onChangeConfig({
      ...config,
      services: updatedServices,
    });
  };

  const copyConfigJson = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-2xl bg-slate-900 text-slate-100 h-full shadow-2xl flex flex-col border-l border-slate-800">
        
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              ⚙️ Live CONFIG Editor
            </h2>
            <p className="text-xs text-slate-400">
              Changes reflect instantly on the preview website.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyConfigJson}
              className="flex items-center gap-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded border border-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy client.json'}
            </button>
            <button
              onClick={onResetPreset}
              className="flex items-center gap-1 text-xs font-semibold bg-rose-950/50 hover:bg-rose-900/50 text-rose-300 px-3 py-1.5 rounded border border-rose-800/50 transition"
              title="Reset to default values for this preset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/80 px-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('leadsystem')}
            className={`px-3 py-2.5 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'leadsystem' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            🎯 Lead System & GBP
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`px-3 py-2.5 border-b-2 whitespace-nowrap transition ${
              activeTab === 'general' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Business & Hero
          </button>
          <button
            onClick={() => setActiveTab('branding')}
            className={`px-3 py-2.5 border-b-2 whitespace-nowrap transition ${
              activeTab === 'branding' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Colors & Branding
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-3 py-2.5 border-b-2 whitespace-nowrap transition ${
              activeTab === 'contact' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Phone & Address
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-3 py-2.5 border-b-2 whitespace-nowrap transition ${
              activeTab === 'services' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Services ({config.services?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('copy')}
            className={`px-3 py-2.5 border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'copy' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ✍️ Website Copy
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`px-3 py-2.5 border-b-2 whitespace-nowrap transition ${
              activeTab === 'seo' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            SEO & Social
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'leadsystem' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-200 space-y-1">
                <div className="font-bold text-sm text-emerald-400 flex items-center gap-1.5">
                  ⚡ Local Lead Capture System & GBP Configuration
                </div>
                <p className="text-[11px] text-emerald-300/80 leading-relaxed">
                  Connect your Google Business Profile, dispatch call hotline, and Google Sheets / Apps Script lead ingestion endpoint.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Client ID (clientId)</label>
                  <input
                    type="text"
                    value={config.clientId || ''}
                    onChange={(e) => handleFieldChange('clientId', e.target.value)}
                    placeholder="client-hvac-dallas-01"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Lead Source Tag (leadSource)</label>
                  <input
                    type="text"
                    value={config.leadSource || ''}
                    onChange={(e) => handleFieldChange('leadSource', e.target.value)}
                    placeholder="Google Business Profile / Local Search"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Google Business Profile URL (googleBusinessProfileUrl)</label>
                <input
                  type="text"
                  value={config.googleBusinessProfileUrl || config.googleBusinessProfileLink || ''}
                  onChange={(e) => {
                    handleFieldChange('googleBusinessProfileUrl', e.target.value);
                    handleFieldChange('googleBusinessProfileLink', e.target.value);
                  }}
                  placeholder="https://maps.google.com/?q=Your+Business+Name"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Google Rating (0 to 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5.0"
                    value={config.averageRating ?? config.googleRating ?? 0}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                      onChangeConfig({
                        ...config,
                        averageRating: val,
                        googleRating: val,
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-bold outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Google Review Count</label>
                  <input
                    type="number"
                    value={config.reviewCount ?? config.googleReviewCount ?? 0}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                      onChangeConfig({
                        ...config,
                        reviewCount: val,
                        googleReviewCount: val,
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-bold outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Google Sheets / Webhook Form Endpoint (formEndpoint)</label>
                <input
                  type="text"
                  value={config.formEndpoint || ''}
                  onChange={(e) => handleFieldChange('formEndpoint', e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono outline-none focus:border-emerald-500"
                />
                <p className="text-[11px] text-amber-300/90 mt-1 leading-normal font-medium">
                  Deploy the client's Google Apps Script Web App first, then paste the Web App URL here. The landing-page enquiry form and LeadPilot CRM use this endpoint.
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  When left blank, form operates in Demo Mode locally, but production deployment requires a valid Web App URL.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Business Phone (businessPhone)</label>
                  <input
                    type="text"
                    value={config.phone ?? config.businessPhone ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      onChangeConfig({
                        ...config,
                        phone: val,
                        businessPhone: val,
                        phoneRaw: val.replace(/[^0-9+]/g, '')
                      });
                    }}
                    placeholder="(800) 555-0199 (Leave blank to hide)"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-bold outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Service Area Summary (serviceArea)</label>
                  <input
                    type="text"
                    value={config.serviceArea ?? config.cityStateZip ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      onChangeConfig({
                        ...config,
                        serviceArea: val,
                        cityStateZip: val,
                        serviceAreas: val ? val.split(',').map(s => s.trim()).filter(Boolean) : []
                      });
                    }}
                    placeholder="Greater Dallas Metro Area (Leave blank to hide)"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}
          {activeTab === 'general' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Business Name</label>
                  <input
                    type="text"
                    value={config.businessName}
                    onChange={(e) => handleFieldChange('businessName', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Business Category / Industry</label>
                  <input
                    type="text"
                    value={config.industry || config.businessCategory || ''}
                    onChange={(e) => {
                      handleFieldChange('industry', e.target.value);
                      handleFieldChange('businessCategory', e.target.value);
                    }}
                    placeholder="HVAC - Heating & Air Conditioning"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Website URL (websiteUrl)</label>
                <input
                  type="text"
                  value={config.websiteUrl || ''}
                  onChange={(e) => handleFieldChange('websiteUrl', e.target.value)}
                  placeholder="https://apexairheating.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Tagline / Motto</label>
                <input
                  type="text"
                  value={config.tagline}
                  onChange={(e) => handleFieldChange('tagline', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Hero Title (Headline)</label>
                <textarea
                  rows={2}
                  value={config.heroTitle}
                  onChange={(e) => handleFieldChange('heroTitle', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Hero Subheadline</label>
                <textarea
                  rows={3}
                  value={config.heroSubheadline}
                  onChange={(e) => handleFieldChange('heroSubheadline', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Years in Business</label>
                  <input
                    type="number"
                    value={config.yearsInBusiness}
                    onChange={(e) => handleFieldChange('yearsInBusiness', parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Jobs Completed</label>
                  <input
                    type="text"
                    value={config.jobsCompleted}
                    onChange={(e) => handleFieldChange('jobsCompleted', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Logo URL (logo / logoUrl)</label>
                <input
                  type="text"
                  value={config.logoUrl ?? config.logo ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChangeConfig({
                      ...config,
                      logoUrl: val,
                      logo: val,
                    });
                  }}
                  placeholder="https://example.com/logo.png (Leave blank to hide logo)"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Primary Color (primaryColor)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.primaryColor || '#0F172A'}
                      onChange={(e) => handleFieldChange('primaryColor', e.target.value)}
                      className="w-10 h-9 bg-slate-950 border border-slate-700 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.primaryColor || '#0F172A'}
                      onChange={(e) => handleFieldChange('primaryColor', e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Secondary Color (secondaryColor)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.secondaryColor || '#1E293B'}
                      onChange={(e) => handleFieldChange('secondaryColor', e.target.value)}
                      className="w-10 h-9 bg-slate-950 border border-slate-700 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.secondaryColor || '#1E293B'}
                      onChange={(e) => handleFieldChange('secondaryColor', e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Accent Button Color (accentColor)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.accentColor || '#2563EB'}
                      onChange={(e) => handleFieldChange('accentColor', e.target.value)}
                      className="w-10 h-9 bg-slate-950 border border-slate-700 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.accentColor || '#2563EB'}
                      onChange={(e) => handleFieldChange('accentColor', e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Text Color (textColor)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.textColor || '#0F172A'}
                      onChange={(e) => handleFieldChange('textColor', e.target.value)}
                      className="w-10 h-9 bg-slate-950 border border-slate-700 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.textColor || '#0F172A'}
                      onChange={(e) => handleFieldChange('textColor', e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Hero Background Image URL (heroBackground / heroImageUrl)</label>
                <input
                  type="text"
                  value={config.heroImageUrl ?? config.heroBackground ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChangeConfig({
                      ...config,
                      heroImageUrl: val,
                      heroBackground: val,
                    });
                  }}
                  placeholder="https://images.unsplash.com/... (Leave blank for dark gradient)"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none font-mono"
                />
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Display Phone Number (businessPhone)</label>
                  <input
                    type="text"
                    value={config.phone ?? config.businessPhone ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      onChangeConfig({
                        ...config,
                        phone: val,
                        businessPhone: val,
                        phoneRaw: val.replace(/[^0-9+]/g, '')
                      });
                    }}
                    placeholder="(800) 555-0199 (Leave blank to hide)"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Raw Phone (tel: link)</label>
                  <input
                    type="text"
                    value={config.phoneRaw ?? ''}
                    onChange={(e) => handleFieldChange('phoneRaw', e.target.value)}
                    placeholder="+18005550199"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Email Address (businessEmail)</label>
                <input
                  type="email"
                  value={config.email ?? config.businessEmail ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChangeConfig({
                      ...config,
                      email: val,
                      businessEmail: val,
                    });
                  }}
                  placeholder="info@example.com (Leave blank to hide)"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Street Address (businessAddress)</label>
                <input
                  type="text"
                  value={config.address ?? config.businessAddress ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChangeConfig({
                      ...config,
                      address: val,
                      businessAddress: val,
                    });
                  }}
                  placeholder="123 Main St (Leave blank to hide)"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">City, State & Zip (cityStateZip / serviceArea)</label>
                <input
                  type="text"
                  value={config.cityStateZip ?? config.serviceArea ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChangeConfig({
                      ...config,
                      cityStateZip: val,
                      serviceArea: val,
                      serviceAreas: val ? val.split(',').map(s => s.trim()).filter(Boolean) : []
                    });
                  }}
                  placeholder="Dallas, TX 75201 (Leave blank to hide)"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Business Hours</label>
                <input
                  type="text"
                  value={config.businessHours}
                  onChange={(e) => handleFieldChange('businessHours', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Emergency Availability Banner Text</label>
                <input
                  type="text"
                  value={config.emergencyAvailability}
                  onChange={(e) => handleFieldChange('emergencyAvailability', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">WhatsApp Business Number</label>
                  <input
                    type="text"
                    value={config.whatsAppNumber ?? ''}
                    onChange={(e) => handleFieldChange('whatsAppNumber', e.target.value)}
                    placeholder="+919000000000 (Leave blank to hide)"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">CRM Default Country Code</label>
                  <input
                    type="text"
                    value={config.defaultCountryCode ?? '+91'}
                    onChange={(e) => handleFieldChange('defaultCountryCode', e.target.value)}
                    placeholder="+91 or +1"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none font-mono"
                  />
                </div>
              </div>

              {/* WhatsApp Pre-filled Message Template */}
              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-200 font-bold text-sm">
                    💬 WhatsApp Pre-filled Message Template
                  </label>
                  <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                    LeadPilot WhatsApp Automation
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  This message opens automatically in WhatsApp when clicking the WhatsApp button for any lead. Use dynamic tokens to personalize it automatically.
                </p>

                <textarea
                  rows={3}
                  value={config.whatsAppMessageTemplate ?? ''}
                  onChange={(e) => handleFieldChange('whatsAppMessageTemplate', e.target.value)}
                  placeholder="Hi {name}, thank you for reaching out to {businessName} regarding your Tarot Reading session ({service}). When would you like to schedule your guidance reading?"
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-white text-xs focus:border-emerald-500 outline-none font-sans leading-relaxed"
                />

                {/* Dynamic Token Insert Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="text-slate-400 font-semibold mr-1">Insert Token:</span>
                  {[
                    { label: '{name}', desc: 'Lead Name' },
                    { label: '{businessName}', desc: 'Business Name' },
                    { label: '{service}', desc: 'Service / Reading Type' },
                  ].map((token) => (
                    <button
                      key={token.label}
                      type="button"
                      onClick={() => {
                        const current = config.whatsAppMessageTemplate ?? '';
                        handleFieldChange('whatsAppMessageTemplate', `${current} ${token.label}`.trim());
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-emerald-300 px-2 py-0.5 rounded font-mono border border-slate-700 transition"
                      title={token.desc}
                    >
                      +{token.label}
                    </button>
                  ))}
                </div>

                {/* Quick Presets */}
                <div className="space-y-1 pt-1 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-400 font-semibold block">Load Quick Preset:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleFieldChange('whatsAppMessageTemplate', 'Hi {name}, thank you for reaching out to {businessName} regarding your Tarot Reading session ({service}). When would you like to schedule your guidance reading?')}
                      className="text-[11px] bg-purple-950/70 hover:bg-purple-900/80 text-purple-200 border border-purple-800/60 px-2.5 py-1 rounded transition flex items-center gap-1"
                    >
                      🔮 Tarot Reading Preset
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFieldChange('whatsAppMessageTemplate', 'Namaste {name}, this is {businessName}. We received your inquiry for {service}. Are you available for a quick consultation on WhatsApp?')}
                      className="text-[11px] bg-amber-950/70 hover:bg-amber-900/80 text-amber-200 border border-amber-800/60 px-2.5 py-1 rounded transition flex items-center gap-1"
                    >
                      ✨ Consultation Inquiry
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFieldChange('whatsAppMessageTemplate', 'Hi {name}, this is {businessName}. We received your request for {service}. How can we help you?')}
                      className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2.5 py-1 rounded transition flex items-center gap-1"
                    >
                      💼 General Business
                    </button>
                  </div>
                </div>

                {/* Live Preview */}
                <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800 text-[11px]">
                  <span className="text-slate-400 font-bold block mb-1">Message Preview for Lead &quot;Priya&quot;:</span>
                  <span className="text-emerald-300 italic font-medium">
                    &quot;{(config.whatsAppMessageTemplate || 'Hi {name}, thank you for reaching out to {businessName} regarding your Tarot Reading session ({service}). When would you like to schedule your guidance reading?')
                      .replace('{name}', 'Priya')
                      .replace('{businessName}', config.businessName || 'Demo Business')
                      .replace('{service}', 'Personal Tarot Reading')}&quot;
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-300">Services List ({config.services?.length || 0})</span>
                <button
                  onClick={handleAddService}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded text-xs font-bold shadow"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Service
                </button>
              </div>

              {(config.services || []).map((srv, idx) => (
                <div key={srv.id || idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 relative space-y-3 shadow-md">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-extrabold text-xs">#{idx + 1}</span>
                      <span className="font-bold text-white text-sm">{srv.title || 'Untitled Service'}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveService(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300"
                        title="Move service up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveService(idx, 'down')}
                        disabled={idx === (config.services.length - 1)}
                        className="p-1 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300"
                        title="Move service down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemoveService(idx)}
                        className="p-1 rounded bg-rose-950/60 border border-rose-800 text-rose-300 hover:text-rose-100 ml-1"
                        title="Delete service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-bold text-[11px] mb-0.5">Service Name (title)</label>
                      <input
                        type="text"
                        value={srv.title || ''}
                        onChange={(e) => handleServiceChange(idx, 'title', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold text-[11px] mb-0.5">Icon Name (iconName)</label>
                      <select
                        value={srv.iconName || 'Wrench'}
                        onChange={(e) => handleServiceChange(idx, 'iconName', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white text-xs font-mono"
                      >
                        <option value="Snowflake">Snowflake (AC/Cooling)</option>
                        <option value="Flame">Flame (Heating/Fire)</option>
                        <option value="Zap">Zap (Electrical/Speed)</option>
                        <option value="Droplets">Droplets (Plumbing/Water)</option>
                        <option value="Wrench">Wrench (Tools/Repair)</option>
                        <option value="Home">Home (Roofing/Construction)</option>
                        <option value="Key">Key (Locksmith/Security)</option>
                        <option value="Shield">Shield (Protection/Pest)</option>
                        <option value="Palette">Palette (Paint/Remodel)</option>
                        <option value="Hammer">Hammer (Building)</option>
                        <option value="RefreshCw">RefreshCw (Maintenance/Overhaul)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold text-[11px] mb-0.5">Short Tagline (tagline)</label>
                    <input
                      type="text"
                      value={srv.tagline || ''}
                      onChange={(e) => handleServiceChange(idx, 'tagline', e.target.value)}
                      placeholder="Fast restored today"
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold text-[11px] mb-0.5">Full Description (description)</label>
                    <textarea
                      rows={2}
                      value={srv.description || ''}
                      onChange={(e) => handleServiceChange(idx, 'description', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white text-xs"
                    />
                  </div>

                  {/* Bullet Points / Features */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-300 font-bold text-[11px]">Bullet Points / Key Features ({srv.features?.length || 0})</label>
                      <button
                        type="button"
                        onClick={() => handleAddFeature(idx)}
                        className="text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Bullet Point
                      </button>
                    </div>

                    <div className="space-y-1">
                      {(srv.features || []).map((feat, fi) => (
                        <div key={fi} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={feat}
                            onChange={(e) => handleUpdateFeature(idx, fi, e.target.value)}
                            className="flex-1 bg-slate-900 border border-slate-700 rounded p-1 text-white text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(idx, fi)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                            title="Remove bullet point"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'copy' && (
            <div className="space-y-6 text-xs">
              <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-amber-200 space-y-1">
                <div className="font-bold text-sm text-amber-400 flex items-center gap-1.5">
                  ✍️ Landing Page Copy & Content Editor
                </div>
                <p className="text-[11px] text-amber-300/80 leading-relaxed">
                  Customize headlines, section text, button labels, FAQs, and subtexts. Changes apply immediately to the live preview and override industry preset defaults without requiring code edits or AI models. Leave any optional field empty to hide it on the page.
                </p>
              </div>

              {/* SECTION: SAMPLE DATA NOTICE */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="font-extrabold text-white text-sm flex items-center gap-1.5">
                    <span>⚠️ Sample Data Notice Banner</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="sampleDataNoticeEnabled"
                      checked={config.sampleDataNoticeEnabled === true}
                      onChange={(e) => handleFieldChange('sampleDataNoticeEnabled', e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                    <label htmlFor="sampleDataNoticeEnabled" className="text-white font-bold cursor-pointer text-xs">
                      Enable Sample Data Notice
                    </label>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  When enabled, displays a banner warning that claims, reviews, and stats are sample template placeholders. Keep disabled for client production sites.
                </p>
              </div>

              {/* SECTION: HERO COPY */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="font-extrabold text-white text-sm flex items-center gap-1.5">
                    <span>🚀 Hero Section Wording & Trust Badges</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="heroTrustBadgesEnabled"
                      checked={config.heroTrustBadgesEnabled === true}
                      onChange={(e) => handleFieldChange('heroTrustBadgesEnabled', e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                    <label htmlFor="heroTrustBadgesEnabled" className="text-white font-bold cursor-pointer text-xs">
                      Enable Hero Trust Badges
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Status Line (heroStatusText)</label>
                    <input
                      type="text"
                      value={config.heroStatusText ?? ''}
                      onChange={(e) => handleFieldChange('heroStatusText', e.target.value)}
                      placeholder="e.g. 24/7 DISPATCH • SAME DAY SERVICE"
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Eyebrow / Badge Text (heroEyebrow)</label>
                    <input
                      type="text"
                      value={config.heroEyebrow ?? ''}
                      onChange={(e) => handleFieldChange('heroEyebrow', e.target.value)}
                      placeholder="e.g. 4.9 ⭐ Rating (487+ Verified Local Reviews)"
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Main Headline (heroTitle) *</label>
                  <textarea
                    rows={2}
                    value={config.heroTitle || ''}
                    onChange={(e) => handleFieldChange('heroTitle', e.target.value)}
                    placeholder="e.g. Fast, Reliable AC & Heating Repair — 24/7 Emergency Service"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-bold focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Highlighted Headline Text</label>
                    <input
                      type="text"
                      value={config.heroTitleHighlight ?? ''}
                      onChange={(e) => handleFieldChange('heroTitleHighlight', e.target.value)}
                      placeholder="e.g. 24/7 Emergency Service"
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Headline Ending Text</label>
                    <input
                      type="text"
                      value={config.heroTitleEnd ?? ''}
                      onChange={(e) => handleFieldChange('heroTitleEnd', e.target.value)}
                      placeholder="e.g. Guaranteed"
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Subheadline (heroSubheadline)</label>
                  <textarea
                    rows={2}
                    value={config.heroSubheadline || ''}
                    onChange={(e) => handleFieldChange('heroSubheadline', e.target.value)}
                    placeholder="Reliable AC repair, water jet servicing, gas charging, and installation across Ernakulam & Kochi."
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Primary Button Text (heroPrimaryCtaText)</label>
                    <input
                      type="text"
                      value={config.heroPrimaryCtaText ?? ''}
                      onChange={(e) => handleFieldChange('heroPrimaryCtaText', e.target.value)}
                      placeholder="e.g. Call Now: (800) 555-0199"
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Secondary Button Text (heroSecondaryCtaText)</label>
                    <input
                      type="text"
                      value={config.heroSecondaryCtaText ?? ''}
                      onChange={(e) => handleFieldChange('heroSecondaryCtaText', e.target.value)}
                      placeholder="e.g. Request AC Service"
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: WHY CHOOSE US COPY */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="font-extrabold text-white text-sm flex items-center gap-1.5">
                    <span>⭐ Why Choose Us Wording & Features</span>
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddWhyUsItem}
                    className="flex items-center gap-1 bg-amber-600 hover:bg-amber-500 text-white px-2.5 py-1 rounded text-xs font-bold shadow"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Trust Point
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Eyebrow Label (whyUsEyebrow)</label>
                    <input
                      type="text"
                      value={config.whyUsEyebrow ?? ''}
                      onChange={(e) => handleFieldChange('whyUsEyebrow', e.target.value)}
                      placeholder="e.g. The Difference"
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Main Heading (whyUsHeading)</label>
                    <input
                      type="text"
                      value={config.whyUsHeading ?? ''}
                      onChange={(e) => handleFieldChange('whyUsHeading', e.target.value)}
                      placeholder="e.g. Why Customers Choose Our AC Services"
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Description Paragraph (whyUsDescription)</label>
                  <textarea
                    rows={2}
                    value={config.whyUsDescription ?? ''}
                    onChange={(e) => handleFieldChange('whyUsDescription', e.target.value)}
                    placeholder="We bring upfront pricing, experienced technicians, and quality service."
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none"
                  />
                </div>

                {/* Why Choose Us Cards / Points */}
                <div className="space-y-3 pt-2">
                  <span className="block text-slate-300 font-bold text-xs">Trust Cards / Feature Points (whyUsItems)</span>
                  {(config.whyUsItems || []).map((item, widx) => (
                    <div key={widx} className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-400 text-[11px]">Card #{widx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveWhyUsItem(widx)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                          title="Remove card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateWhyUsItem(widx, 'title', e.target.value)}
                          placeholder="Feature Title (e.g. Upfront Pricing)"
                          className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-white text-xs font-bold"
                        />
                      </div>
                      <div>
                        <textarea
                          rows={2}
                          value={item.description}
                          onChange={(e) => handleUpdateWhyUsItem(widx, 'description', e.target.value)}
                          placeholder="Feature Description"
                          className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-white text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION: SERVICES HEADER COPY */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <h3 className="font-extrabold text-white text-sm border-b border-slate-800 pb-2 flex items-center gap-1.5">
                  <span>🛠️ Services Section Wording</span>
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Eyebrow Label (servicesEyebrow)</label>
                    <input
                      type="text"
                      value={config.servicesEyebrow ?? ''}
                      onChange={(e) => handleFieldChange('servicesEyebrow', e.target.value)}
                      placeholder="e.g. Our Services"
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Main Heading (servicesHeading)</label>
                    <input
                      type="text"
                      value={config.servicesHeading ?? ''}
                      onChange={(e) => handleFieldChange('servicesHeading', e.target.value)}
                      placeholder="e.g. Professional Trade & Service Solutions"
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Description Paragraph (servicesDescription)</label>
                  <textarea
                    rows={2}
                    value={config.servicesDescription ?? ''}
                    onChange={(e) => handleFieldChange('servicesDescription', e.target.value)}
                    placeholder="Expert solutions tailored for residential and commercial clients."
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* SECTION: EMERGENCY BANNER COPY */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="font-extrabold text-white text-sm flex items-center gap-1.5">
                    <span>🚨 Emergency Dispatch Banner Wording</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="hasEmergencyService"
                      checked={config.hasEmergencyService !== false}
                      onChange={(e) => handleFieldChange('hasEmergencyService', e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
                    />
                    <label htmlFor="hasEmergencyService" className="text-white font-bold cursor-pointer text-xs">
                      Enable Emergency Banner
                    </label>
                  </div>
                </div>

                {config.hasEmergencyService !== false && (
                  <>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Heading (emergencyHeading)</label>
                      <input
                        type="text"
                        value={config.emergencyHeading ?? ''}
                        onChange={(e) => handleFieldChange('emergencyHeading', e.target.value)}
                        placeholder="e.g. Emergency Service Needed Right Now?"
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Description (emergencyDescription)</label>
                      <textarea
                        rows={2}
                        value={config.emergencyDescription ?? ''}
                        onChange={(e) => handleFieldChange('emergencyDescription', e.target.value)}
                        placeholder="Need urgent assistance? Call our dedicated hotline for immediate response."
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">CTA Button Text (emergencyCtaText)</label>
                      <input
                        type="text"
                        value={config.emergencyCtaText ?? ''}
                        onChange={(e) => handleFieldChange('emergencyCtaText', e.target.value)}
                        placeholder="e.g. Emergency Hotline: (800) 555-0199"
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* SECTION: FINANCING SECTION COPY */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="font-extrabold text-white text-sm flex items-center gap-1.5">
                    <span>💳 Financing Section Options & Wording</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="financingEnabled"
                      checked={config.financingEnabled === true}
                      onChange={(e) => handleFieldChange('financingEnabled', e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
                    />
                    <label htmlFor="financingEnabled" className="text-white font-bold cursor-pointer text-xs">
                      Enable Financing Section
                    </label>
                  </div>
                </div>

                {config.financingEnabled && (
                  <>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Heading (financingTitle)</label>
                      <input
                        type="text"
                        value={config.financingTitle ?? ''}
                        onChange={(e) => handleFieldChange('financingTitle', e.target.value)}
                        placeholder="e.g. Flexible Financing Options Available"
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Description (financingDescription)</label>
                      <textarea
                        rows={2}
                        value={config.financingDescription ?? ''}
                        onChange={(e) => handleFieldChange('financingDescription', e.target.value)}
                        placeholder="Ask us about easy payment plans and flexible financing options for your project."
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">CTA Button Text (financingCtaText)</label>
                      <input
                        type="text"
                        value={config.financingCtaText ?? ''}
                        onChange={(e) => handleFieldChange('financingCtaText', e.target.value)}
                        placeholder="e.g. Apply For Financing"
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* SECTION: REVIEWS SECTION COPY */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <h3 className="font-extrabold text-white text-sm border-b border-slate-800 pb-2 flex items-center gap-1.5">
                  <span>💬 Reviews & Testimonials Wording</span>
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Eyebrow Label (reviewsEyebrow)</label>
                    <input
                      type="text"
                      value={config.reviewsEyebrow ?? ''}
                      onChange={(e) => handleFieldChange('reviewsEyebrow', e.target.value)}
                      placeholder="e.g. Customer Testimonials"
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Heading (reviewsHeading)</label>
                    <input
                      type="text"
                      value={config.reviewsHeading ?? ''}
                      onChange={(e) => handleFieldChange('reviewsHeading', e.target.value)}
                      placeholder="e.g. Customer Reviews (480+)"
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Description (reviewsDescription)</label>
                  <textarea
                    rows={2}
                    value={config.reviewsDescription ?? ''}
                    onChange={(e) => handleFieldChange('reviewsDescription', e.target.value)}
                    placeholder="Verified customer feedback and service ratings across the metro area."
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* SECTION: FAQ SECTION COPY & ITEMS */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="font-extrabold text-white text-sm flex items-center gap-1.5">
                    <span>❓ Frequently Asked Questions (FAQs)</span>
                  </h3>
                  <button
                    onClick={handleAddFaq}
                    className="flex items-center gap-1 bg-amber-600 hover:bg-amber-500 text-white px-2.5 py-1 rounded text-xs font-bold shadow"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add FAQ
                  </button>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">FAQ Section Heading (faqHeading)</label>
                  <input
                    type="text"
                    value={config.faqHeading ?? ''}
                    onChange={(e) => handleFieldChange('faqHeading', e.target.value)}
                    placeholder="e.g. Frequently Asked Questions"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none font-bold"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  {(config.faqs || []).map((faq, fidx) => (
                    <div key={fidx} className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-400 text-[11px]">FAQ Item #{fidx + 1}</span>
                        <button
                          onClick={() => handleRemoveFaq(fidx)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                          title="Remove FAQ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold text-[10px] mb-0.5">Question</label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => handleUpdateFaq(fidx, 'question', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-white text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold text-[10px] mb-0.5">Answer</label>
                        <textarea
                          rows={2}
                          value={faq.answer}
                          onChange={(e) => handleUpdateFaq(fidx, 'answer', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-white text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION: SERVICE AREA SECTION COPY */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <h3 className="font-extrabold text-white text-sm border-b border-slate-800 pb-2 flex items-center gap-1.5">
                  <span>📍 Service Area Section Wording</span>
                </h3>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Heading (serviceAreaHeading)</label>
                  <input
                    type="text"
                    value={config.serviceAreaHeading ?? ''}
                    onChange={(e) => handleFieldChange('serviceAreaHeading', e.target.value)}
                    placeholder="e.g. Servicing Dallas, TX & Surrounding Communities"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Description (serviceAreaDescription)</label>
                  <textarea
                    rows={2}
                    value={config.serviceAreaDescription ?? ''}
                    onChange={(e) => handleFieldChange('serviceAreaDescription', e.target.value)}
                    placeholder="We provide prompt doorstep AC service across Ernakulam, Kochi and nearby areas."
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* SECTION: FINAL CTA / DISPATCH FORM COPY */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <h3 className="font-extrabold text-white text-sm border-b border-slate-800 pb-2 flex items-center gap-1.5">
                  <span>📋 Lead Form & Final CTA Wording</span>
                </h3>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Lead Form Status / Badge</label>
                  <input
                    type="text"
                    value={config.leadFormStatusText ?? ''}
                    onChange={(e) => handleFieldChange('leadFormStatusText', e.target.value)}
                    placeholder="e.g. AC SERVICE AVAILABLE"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Optional text displayed above the lead form. Leave empty to hide it.
                  </p>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Form Card Heading (finalCtaHeading)</label>
                  <input
                    type="text"
                    value={config.finalCtaHeading ?? ''}
                    onChange={(e) => handleFieldChange('finalCtaHeading', e.target.value)}
                    placeholder="e.g. Request AC Service"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Form Subtext / Description (finalCtaDescription)</label>
                  <textarea
                    rows={2}
                    value={config.finalCtaDescription ?? ''}
                    onChange={(e) => handleFieldChange('finalCtaDescription', e.target.value)}
                    placeholder="Fill out the form below for fast dispatch or call our hotline directly."
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Submit Button Label (finalCtaButtonText)</label>
                  <input
                    type="text"
                    value={config.finalCtaButtonText ?? ''}
                    onChange={(e) => handleFieldChange('finalCtaButtonText', e.target.value)}
                    placeholder="e.g. Dispatch Technician Now"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Lead Form Trust Text</label>
                  <input
                    type="text"
                    value={config.leadFormTrustText ?? ''}
                    onChange={(e) => handleFieldChange('leadFormTrustText', e.target.value)}
                    placeholder="e.g. 🔒 Zero spam guarantee"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Optional small text displayed below the lead form button. Leave empty to hide it.
                  </p>
                </div>
              </div>

              {/* SECTION: FOOTER COPY */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="font-extrabold text-white text-sm flex items-center gap-1.5">
                    <span>👣 Footer Copy & Emergency Contact</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="footerEmergencyEnabled"
                      checked={config.footerEmergencyEnabled === true}
                      onChange={(e) => handleFieldChange('footerEmergencyEnabled', e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                    <label htmlFor="footerEmergencyEnabled" className="text-white font-bold cursor-pointer text-xs">
                      Enable Footer Emergency Contact
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Footer Business Description (footerDescription)</label>
                  <textarea
                    rows={2}
                    value={config.footerDescription ?? ''}
                    onChange={(e) => handleFieldChange('footerDescription', e.target.value)}
                    placeholder="Premier Climate Control Specialists in your local area."
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Copyright Line (footerCopyrightText)</label>
                  <input
                    type="text"
                    value={config.footerCopyrightText ?? ''}
                    onChange={(e) => handleFieldChange('footerCopyrightText', e.target.value)}
                    placeholder={`© ${new Date().getFullYear()} ${config.businessName}. All rights reserved.`}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">SEO Title Tag (&lt;title&gt;)</label>
                <input
                  type="text"
                  value={config.seo.title}
                  onChange={(e) => handleSeoChange('title', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Meta Description</label>
                <textarea
                  rows={3}
                  value={config.seo.metaDescription}
                  onChange={(e) => handleSeoChange('metaDescription', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Canonical URL</label>
                <input
                  type="text"
                  value={config.seo.canonicalUrl}
                  onChange={(e) => handleSeoChange('canonicalUrl', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none font-mono"
                />
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Google Sheet Web App URL (CONFIG.formEndpoint)</label>
                <input
                  type="text"
                  value={config.formEndpoint}
                  onChange={(e) => handleFieldChange('formEndpoint', e.target.value)}
                  placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Deployed Google Apps Script Web App URL for Google Sheet lead persistence & LeadPilot sync.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Google Analytics ID</label>
                  <input
                    type="text"
                    value={config.googleAnalyticsId}
                    onChange={(e) => handleFieldChange('googleAnalyticsId', e.target.value)}
                    placeholder="G-XXXXXXX"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Facebook Pixel ID</label>
                  <input
                    type="text"
                    value={config.facebookPixelId}
                    onChange={(e) => handleFieldChange('facebookPixelId', e.target.value)}
                    placeholder="123456789"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2 rounded-lg transition"
          >
            Apply & Close Editor
          </button>
        </div>

      </div>
    </div>
  );
};
