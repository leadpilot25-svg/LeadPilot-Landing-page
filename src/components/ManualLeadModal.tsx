import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Phone,
  Mail,
  Calendar,
  FileText,
  Tag,
  Briefcase,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { ClientConfig, LeadItem, LeadStatus } from '../types';
import { saveLead } from '../utils/leadStorage';

interface ManualLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: ClientConfig;
  onLeadAdded: (newLead: LeadItem) => void;
}

const STATUS_OPTIONS: LeadStatus[] = [
  'New',
  'Contacted',
  'Follow-up',
  'Qualified',
  'Won',
  'Lost',
];

const SOURCE_OPTIONS = [
  'Phone Call (Direct Inbound)',
  'Google Business Profile / Local Search',
  'Website Form (Landing Page)',
  'Referral / Word of Mouth',
  'Walk-in Customer',
  'Facebook / Instagram',
  'SMS / WhatsApp Inquiry',
  'Other / Unspecified',
];

export const ManualLeadModal: React.FC<ManualLeadModalProps> = ({
  isOpen,
  onClose,
  currentConfig,
  onLeadAdded,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('');
  const [source, setSource] = useState('Phone Call (Direct Inbound)');
  const [status, setStatus] = useState<LeadStatus>('New');
  const [followUpDate, setFollowUpDate] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const targetTenant = (currentConfig.clientId || 'demo-tarot-kochi').trim().toLowerCase();
  const businessName = currentConfig.businessName || 'Tarot Coaching & Guidance';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      setErrorMsg('Please enter customer full name.');
      return;
    }

    const digitsOnly = cleanPhone.replace(/\D/g, '');
    if (digitsOnly.length < 7) {
      setErrorMsg('Please enter a valid phone number with at least 7 digits.');
      return;
    }

    const cleanService = service.trim() || 'General Inquiry';

    setIsSubmitting(true);
    try {
      const nowIso = new Date().toISOString();
      const initialNotes = details.trim()
        ? [
            {
              id: `note-${Date.now()}`,
              text: details.trim(),
              createdAt: nowIso,
              author: 'Agent (Manual Entry)',
            },
          ]
        : [];

      const leadPayload: Partial<LeadItem> & { name: string; phone: string; service: string } = {
        name: cleanName,
        phone: cleanPhone,
        email: email.trim() || undefined,
        service: cleanService,
        leadSource: source,
        status,
        followUpDate: followUpDate || undefined,
        details: email.trim()
          ? (details.trim() ? `${details.trim()} | Email: ${email.trim()}` : `Email: ${email.trim()}`)
          : (details.trim() || 'Manual lead entry via CRM dashboard.'),
        clientId: targetTenant,
        businessName,
        notes: initialNotes,
        timestamp: nowIso,
        contactCount: 0,
      };

      const endpoint = currentConfig.formEndpoint?.trim();
      const res = await saveLead(leadPayload, endpoint);

      if (res && res.lead) {
        onLeadAdded(res.lead);
        handleReset();
        onClose();
      } else {
        throw new Error('Failed to record lead in storage.');
      }
    } catch (err: any) {
      console.error('Error in manual lead creation:', err);
      setErrorMsg(err.message || 'Could not save lead. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setPhone('');
    setEmail('');
    setService('');
    setSource('Phone Call (Direct Inbound)');
    setStatus('New');
    setFollowUpDate('');
    setDetails('');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 space-y-5 animate-in fade-in duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                Add New Lead
              </h2>
              <p className="text-xs text-slate-400">
                Tenant: <span className="font-mono text-emerald-400 font-bold">{targetTenant}</span> ({businessName})
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Customer Name <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 text-white text-xs p-2.5 rounded-xl outline-none transition"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Phone Number <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 555-019-2834"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 text-white text-xs p-2.5 pl-8 rounded-xl outline-none font-mono transition"
                />
              </div>
            </div>
          </div>

          {/* Email & Service */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Email Address <span className="text-slate-500 text-[10px] font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sarah.j@example.com"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 text-white text-xs p-2.5 pl-8 rounded-xl outline-none transition"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Service Requested <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <Briefcase className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  placeholder="e.g. AC Maintenance & Filter Replacement"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 text-white text-xs p-2.5 pl-8 rounded-xl outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Lead Source & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Lead Source
              </label>
              <div className="relative">
                <Tag className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 text-white text-xs p-2.5 pl-8 rounded-xl outline-none transition cursor-pointer"
                >
                  {SOURCE_OPTIONS.map((src) => (
                    <option key={src} value={src}>
                      {src}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Initial Pipeline Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 text-white text-xs p-2.5 rounded-xl outline-none font-bold transition cursor-pointer"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Follow-up Date */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Schedule Follow-up Date <span className="text-slate-500 text-[10px] font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 text-white text-xs p-2.5 pl-8 rounded-xl outline-none font-mono transition"
              />
            </div>
          </div>

          {/* Initial Notes / Customer Details */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Initial Notes / Inquiry Details <span className="text-slate-500 text-[10px] font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <FileText className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Enter customer requests, preferred schedule time, or estimate details..."
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 text-white text-xs p-2.5 pl-8 rounded-xl outline-none resize-none transition"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                handleReset();
                onClose();
              }}
              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition shadow"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving Lead...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Lead to CRM</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
