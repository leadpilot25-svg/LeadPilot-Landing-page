import React, { useState, useEffect } from 'react';
import { ClientConfig, LeadItem, LeadStatus, ContactMethod } from '../types';
import { LeadImportModal } from './LeadImportModal';
import { ManualLeadModal } from './ManualLeadModal';
import { DeleteLeadModal } from './DeleteLeadModal';
import { TestOnboardingModal } from './TestOnboardingModal';
import {
  getStoredLeads,
  saveAllLeads,
  fetchRemoteLeads,
  updateLeadStatus,
  addLeadNote,
  scheduleLeadFollowUp,
  logLeadContact,
  testGoogleSheetConnection,
  deduplicateLeads,
  subscribeTenantLeads,
  deleteLead,
} from '../utils/leadStorage';
import {
  SUPPORTED_COUNTRY_CODES,
  detectDefaultCountryCode,
  formatPhoneForWhatsApp,
  formatDisplayPhone,
  normalizeImportedPhone,
} from '../utils/phoneUtils';
import {
  Phone,
  MessageSquare,
  Mail,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  Clock3,
  ShieldCheck,
  Search,
  Filter,
  Send,
  Building2,
  ChevronRight,
  Zap,
  Flame,
  RotateCw,
  FileSpreadsheet,
  Check,
  ExternalLink,
  AlertTriangle,
  TrendingUp,
  Star,
  Globe,
  Edit2,
  Plus,
  Trash2,
} from 'lucide-react';

interface LeadPilotDashboardProps {
  currentConfig: ClientConfig;
  appMode?: 'development' | 'client';
}

// Date helpers
const getTodayLocalDateStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getTomorrowLocalDateStr = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getInNDaysLocalDateStr = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getFollowUpDateStr = (isoOrDateStr: string | undefined): string | null => {
  if (!isoOrDateStr) return null;
  try {
    const d = new Date(isoOrDateStr);
    if (isNaN(d.getTime())) return isoOrDateStr.slice(0, 10);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  } catch {
    return isoOrDateStr.slice(0, 10);
  }
};

const formatFollowUpDisplay = (isoOrDateStr: string | undefined) => {
  if (!isoOrDateStr) return null;
  try {
    const d = new Date(isoOrDateStr);
    if (isNaN(d.getTime())) return isoOrDateStr;
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return isoOrDateStr;
  }
};

export const LeadPilotDashboard: React.FC<LeadPilotDashboardProps> = ({ currentConfig, appMode = 'development' }) => {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>(
    appMode === 'client' ? (currentConfig.clientId || 'client-01') : 'all'
  );
  const [activeTab, setActiveTab] = useState<LeadStatus | 'All'>('All');
  const [viewSection, setViewSection] = useState<'leads' | 'business_info'>('leads');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);

  // Enforce client isolation in Client Mode and sync active client in Dev Mode
  useEffect(() => {
    if (appMode === 'client') {
      setSelectedClientId(currentConfig.clientId || 'client-01');
    } else if (currentConfig.clientId && selectedClientId !== 'all') {
      setSelectedClientId(currentConfig.clientId);
    }
  }, [appMode, currentConfig.clientId]);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [syncingAction, setSyncingAction] = useState(false);
  const [actionNotification, setActionNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Connection testing state
  const [connStatus, setConnStatus] = useState<'testing' | 'connected' | 'failed' | 'unconfigured'>('unconfigured');
  const [connMsg, setConnMsg] = useState<string>('');
  const [isTestingConn, setIsTestingConn] = useState(false);

  // Note & Follow-up Form state inside detail modal
  const [newNoteText, setNewNoteText] = useState('');
  const [followUpDateInput, setFollowUpDateInput] = useState('');
  const [followUpTimeInput, setFollowUpTimeInput] = useState('09:00');

  // Manual Add Lead modal state
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  // Delete Lead modal confirmation state
  const [leadToDelete, setLeadToDelete] = useState<LeadItem | null>(null);

  // Import Leads modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  // Test Onboarding & Live Security modal state (Dev Mode Only, auto-restores after Google Redirect)
  const [isTestOnboardingModalOpen, setIsTestOnboardingModalOpen] = useState(() => {
    if (appMode !== 'development') return false;
    try {
      return sessionStorage.getItem('leadpilot_restore_onboarding_modal') === 'true';
    } catch {
      return false;
    }
  });

  // Clear modal restore flag once opened
  useEffect(() => {
    if (isTestOnboardingModalOpen) {
      try {
        sessionStorage.removeItem('leadpilot_restore_onboarding_modal');
      } catch {
        // ignore storage errors
      }
    }
  }, [isTestOnboardingModalOpen]);

  const handleImportSuccess = (importedCount: number, message: string) => {
    refreshLocalLeads();
    setActionNotification({ type: 'success', message });
  };

  const handleLeadAdded = (newLead: LeadItem) => {
    refreshLocalLeads();
    setActionNotification({
      type: 'success',
      message: `Lead "${newLead.name}" added to ${newLead.clientId} successfully! ✓`,
    });
  };

  const handleConfirmDeleteLead = async (lead: LeadItem) => {
    const res = await deleteLead(lead.id, lead.clientId, currentConfig.formEndpoint);
    if (!res.success) {
      setActionNotification({
        type: 'error',
        message: res.message || 'Permission denied: could not delete lead.',
      });
      return;
    }

    refreshLocalLeads();
    if (selectedLead?.id === lead.id) {
      setSelectedLead(null);
    }
    setActionNotification({
      type: 'success',
      message: res.message || `Lead "${lead.name}" deleted successfully. ✓`,
    });
  };

  const endpoint = currentConfig.formEndpoint ? currentConfig.formEndpoint.trim() : '';

  // Sync state when selected lead changes
  useEffect(() => {
    if (selectedLead?.followUpDate) {
      try {
        const d = new Date(selectedLead.followUpDate);
        if (!isNaN(d.getTime())) {
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          const hours = String(d.getHours()).padStart(2, '0');
          const mins = String(d.getMinutes()).padStart(2, '0');
          setFollowUpDateInput(`${year}-${month}-${day}`);
          setFollowUpTimeInput(`${hours}:${mins}`);
        } else {
          setFollowUpDateInput(selectedLead.followUpDate.slice(0, 10));
          setFollowUpTimeInput('09:00');
        }
      } catch {
        setFollowUpDateInput('');
        setFollowUpTimeInput('09:00');
      }
    } else {
      setFollowUpDateInput('');
      setFollowUpTimeInput('09:00');
    }
  }, [selectedLead?.id, selectedLead?.followUpDate]);

  // Connection test runner
  const runConnectionTest = async () => {
    if (!endpoint || !endpoint.startsWith('http')) {
      setConnStatus('unconfigured');
      setConnMsg('Google Apps Script URL is missing or unconfigured in CONFIG.formEndpoint.');
      return;
    }
    setIsTestingConn(true);
    setConnStatus('testing');
    try {
      const result = await testGoogleSheetConnection(endpoint);
      if (result.success) {
        setConnStatus('connected');
        setConnMsg(result.message);
      } else {
        setConnStatus('failed');
        setConnMsg(result.message);
      }
    } catch (err: any) {
      setConnStatus('failed');
      setConnMsg(err?.message || 'Connection test failed');
    } finally {
      setIsTestingConn(false);
    }
  };

  // Load local leads scoped strictly to active client / tenant
  const activeTenantScope = appMode === 'client' ? (currentConfig.clientId || 'client-01') : selectedClientId;

  const refreshLocalLeads = () => {
    const scope = appMode === 'client' ? (currentConfig.clientId || 'client-01') : selectedClientId;
    const clientLeads = deduplicateLeads(getStoredLeads(scope));
    setLeads(clientLeads);
    if (selectedLead) {
      const updated = clientLeads.find((l) => l.id === selectedLead.id);
      if (updated) setSelectedLead(updated);
    }
  };

  // Sync Remote Leads from Google Sheet
  const handleSyncRemoteLeads = async () => {
    setIsSyncing(true);
    try {
      const updatedList = deduplicateLeads(await fetchRemoteLeads(endpoint, activeTenantScope));
      setLeads(updatedList);
      if (selectedLead) {
        const updated = updatedList.find((l) => l.id === selectedLead.id);
        if (updated) setSelectedLead(updated);
      }
      setLastSyncTime(new Date().toLocaleTimeString());
    } catch (err: any) {
      console.warn('Sync notice:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    refreshLocalLeads();

    // Attach real-time Firestore listener for active tenant
    const unsubscribeFirestore = subscribeTenantLeads(
      activeTenantScope,
      (firestoreLeads) => {
        setLeads(deduplicateLeads(firestoreLeads));
        if (selectedLead) {
          const updated = firestoreLeads.find((l) => l.id === selectedLead.id);
          if (updated) setSelectedLead(updated);
        }
      }
    );

    if (endpoint && endpoint.startsWith('http')) {
      runConnectionTest();
      handleSyncRemoteLeads();
    } else {
      setConnStatus('unconfigured');
      setConnMsg('Google Apps Script URL is missing or unconfigured in CONFIG.formEndpoint.');
    }

    const handleUpdateEvent = () => refreshLocalLeads();
    window.addEventListener('leadpilot_leads_updated', handleUpdateEvent);
    return () => {
      unsubscribeFirestore();
      window.removeEventListener('leadpilot_leads_updated', handleUpdateEvent);
    };
  }, [endpoint, selectedClientId, activeTenantScope]);

  // Default dialing country code for 10-digit numbers (auto-detects from client business location/phone)
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(() => detectDefaultCountryCode(currentConfig));

  useEffect(() => {
    setSelectedCountryCode(detectDefaultCountryCode(currentConfig));
  }, [currentConfig]);

  // Lead detail modal phone & message editing state
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editedPhoneInput, setEditedPhoneInput] = useState('');
  const [customLeadWhatsAppMsg, setCustomLeadWhatsAppMsg] = useState<string>('');

  // Generate personalized WhatsApp message using clientConfig template or Tarot defaults
  const getWhatsAppMessage = (lead: LeadItem, customTemplate?: string) => {
    const isTarot = (currentConfig.industry ?? '').toLowerCase().includes('tarot') ||
                    (currentConfig.clientId ?? '').toLowerCase().includes('tarot') ||
                    (currentConfig.businessName ?? '').toLowerCase().includes('tarot');

    const defaultTarotTemplate = 'Hi {name}, thank you for reaching out to {businessName} regarding your Tarot Reading session ({service}). When would you like to schedule your guidance reading?';
    const defaultGeneralTemplate = 'Hi {name}, this is {businessName}. We received your request for {service}. How can we help you?';

    const template = customTemplate || currentConfig.whatsAppMessageTemplate || (isTarot ? defaultTarotTemplate : defaultGeneralTemplate);

    return template
      .replace(/{name}/g, lead.name || 'there')
      .replace(/{businessName}/g, currentConfig.businessName || lead.businessName || 'our team')
      .replace(/{service}/g, lead.service || (isTarot ? 'Personal Tarot Reading' : 'Service'))
      .replace(/{phone}/g, lead.phone || '');
  };

  useEffect(() => {
    if (selectedLead) {
      setCustomLeadWhatsAppMsg(getWhatsAppMessage(selectedLead));
    }
  }, [selectedLead, currentConfig]);

  // Clean raw phone for tel/wa/sms links using configured country code
  const getRawPhone = (phoneStr: string) => {
    return formatPhoneForWhatsApp(phoneStr, selectedCountryCode);
  };

  const handleSaveEditedPhone = () => {
    if (!selectedLead || !editedPhoneInput.trim()) return;
    const formatted = normalizeImportedPhone(editedPhoneInput.trim(), selectedCountryCode);
    const updatedLead: LeadItem = { ...selectedLead, phone: formatted };
    setSelectedLead(updatedLead);
    const stored = getStoredLeads(activeTenantScope);
    const idx = stored.findIndex((l) => l.id === selectedLead.id);
    if (idx !== -1) {
      stored[idx] = updatedLead;
      saveAllLeads(stored, activeTenantScope);
      refreshLocalLeads();
    }
    setIsEditingPhone(false);
    setActionNotification({ type: 'success', message: `Phone updated to ${formatted} ✓` });
  };

  // Filter leads based on Client ID, Status Tab, and Search Query
  const filteredLeads = leads.filter((lead) => {
    if (selectedClientId !== 'all' && lead.clientId !== selectedClientId) {
      return false;
    }
    if (activeTab !== 'All' && lead.status !== activeTab) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        lead.name.toLowerCase().includes(q) ||
        lead.phone.includes(q) ||
        lead.service.toLowerCase().includes(q) ||
        lead.details.toLowerCase().includes(q) ||
        lead.id.toLowerCase().includes(q) ||
        (lead.email && lead.email.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  // Calculate 7 core metrics
  const currentClientLeads = selectedClientId === 'all'
    ? leads
    : leads.filter((l) => l.clientId === selectedClientId);

  const todayStr = getTodayLocalDateStr();

  const totalLeadsCount = currentClientLeads.length;
  const newLeadsCount = currentClientLeads.filter((l) => l.status === 'New').length;
  const contactedCount = currentClientLeads.filter((l) => l.status === 'Contacted').length;

  // Overdue follow-ups
  const overdueFollowUps = currentClientLeads.filter((l) => {
    if (!l.followUpDate || l.status === 'Won' || l.status === 'Lost') return false;
    const fDateStr = getFollowUpDateStr(l.followUpDate);
    return !!(fDateStr && fDateStr < todayStr);
  });

  // Today's follow-ups
  const todayFollowUps = currentClientLeads.filter((l) => {
    if (!l.followUpDate || l.status === 'Won' || l.status === 'Lost') return false;
    const fDateStr = getFollowUpDateStr(l.followUpDate);
    return fDateStr === todayStr;
  });

  const overdueCount = overdueFollowUps.length;
  const todayFollowUpCount = todayFollowUps.length;
  const wonCount = currentClientLeads.filter((l) => l.status === 'Won').length;
  const lostCount = currentClientLeads.filter((l) => l.status === 'Lost').length;

  // Status Badge Helper
  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'New':
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0"><Zap className="w-3 h-3 fill-current" /> New Lead</span>;
      case 'Contacted':
        return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0"><Phone className="w-3 h-3" /> Contacted</span>;
      case 'Follow-up':
        return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0"><Clock className="w-3 h-3" /> Follow-up</span>;
      case 'Qualified':
        return <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0"><CheckCircle2 className="w-3 h-3" /> Qualified</span>;
      case 'Won':
        return <span className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0"><Flame className="w-3 h-3 fill-current" /> Deal Won</span>;
      case 'Lost':
        return <span className="bg-slate-700 text-slate-400 border border-slate-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0"><XCircle className="w-3 h-3" /> Closed / Lost</span>;
      default:
        return <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded shrink-0">{status}</span>;
    }
  };

  // Follow-up Badge Helper
  const getFollowUpBadge = (lead: LeadItem) => {
    if (!lead.followUpDate || lead.status === 'Won' || lead.status === 'Lost') {
      return <span className="text-[10px] text-slate-500 italic">Not scheduled</span>;
    }
    const fDateStr = getFollowUpDateStr(lead.followUpDate);
    const displayTime = formatFollowUpDisplay(lead.followUpDate);

    if (fDateStr && fDateStr < todayStr) {
      return (
        <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1" title="Overdue follow-up">
          <AlertTriangle className="w-3 h-3 text-red-400" />
          <span>Overdue: {displayTime}</span>
        </span>
      );
    }
    if (fDateStr && fDateStr === todayStr) {
      return (
        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1" title="Scheduled for Today">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>Today: {displayTime}</span>
        </span>
      );
    }
    return (
      <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
        <Calendar className="w-3 h-3 text-blue-400" />
        <span>{displayTime}</span>
      </span>
    );
  };

  // Communication Handlers with Auto-Logging & Remote Sync
  const handleActionCall = async (lead: LeadItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const raw = getRawPhone(lead.phone);
    if (!raw) {
      setActionNotification({ type: 'error', message: 'No valid phone number found for this lead.' });
      return;
    }
    // Initiate call immediately
    window.location.href = `tel:+${raw}`;

    setSyncingAction(true);
    setActionNotification(null);
    try {
      const res = await logLeadContact(lead.id, 'Call', undefined, endpoint);
      if (res.success) {
        refreshLocalLeads();
        setActionNotification({ type: 'success', message: `Call initiated (+${raw}) & logged ✓` });
      } else {
        setActionNotification({ type: 'warning', message: `Call initiated (+${raw}). Sheet sync notice: ${res.message}` });
      }
    } catch (err: any) {
      setActionNotification({ type: 'warning', message: `Call initiated (+${raw}). Contact logged locally.` });
    } finally {
      setSyncingAction(false);
    }
  };

  const handleActionWhatsApp = async (lead: LeadItem, e?: React.MouseEvent, overrideMsg?: string) => {
    if (e) e.stopPropagation();
    const raw = getRawPhone(lead.phone);
    if (!raw) {
      setActionNotification({ type: 'error', message: 'No valid phone number found for this lead.' });
      return;
    }
    const msg = overrideMsg || (selectedLead?.id === lead.id && customLeadWhatsAppMsg ? customLeadWhatsAppMsg : getWhatsAppMessage(lead));
    const waUrl = `https://wa.me/${raw}?text=${encodeURIComponent(msg)}`;

    // Open WhatsApp immediately in user interaction context to prevent browser popup blockers
    try {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch {
      window.location.href = waUrl;
    }

    setSyncingAction(true);
    setActionNotification({ type: 'success', message: `Opening WhatsApp chat with +${raw}...` });
    try {
      const res = await logLeadContact(lead.id, 'WhatsApp', undefined, lead.clientId || activeTenantScope, endpoint);
      if (res.success) {
        refreshLocalLeads();
        setActionNotification({ type: 'success', message: `WhatsApp opened (+${raw}) & contact logged to Google Sheet ✓` });
      } else {
        setActionNotification({ type: 'warning', message: `WhatsApp opened (+${raw}). Remote sheet notice: ${res.message}` });
      }
    } catch (err: any) {
      setActionNotification({ type: 'warning', message: `WhatsApp opened (+${raw}). Contact logged locally.` });
    } finally {
      setSyncingAction(false);
    }
  };

  const handleActionSms = async (lead: LeadItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const raw = getRawPhone(lead.phone);
    if (!raw) {
      setActionNotification({ type: 'error', message: 'No valid phone number found for this lead.' });
      return;
    }
    const msg = `Hi ${lead.name}, this is ${lead.businessName}. We received your request for ${lead.service}. We’ll be in touch shortly.`;
    
    // Initiate SMS immediately
    window.location.href = `sms:+${raw}?body=${encodeURIComponent(msg)}`;

    setSyncingAction(true);
    setActionNotification(null);
    try {
      const res = await logLeadContact(lead.id, 'SMS', undefined, lead.clientId || activeTenantScope, endpoint);
      if (res.success) {
        refreshLocalLeads();
        setActionNotification({ type: 'success', message: `SMS opened (+${raw}) & contact logged ✓` });
      } else {
        setActionNotification({ type: 'warning', message: `SMS opened (+${raw}). Sheet sync notice: ${res.message}` });
      }
    } catch (err: any) {
      setActionNotification({ type: 'warning', message: `SMS opened (+${raw}). Contact logged locally.` });
    } finally {
      setSyncingAction(false);
    }
  };

  const handleActionEmail = async (lead: LeadItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!lead.email) return;
    const subject = `Regarding your service request - ${lead.businessName}`;
    const body = `Hi ${lead.name},\n\nThank you for reaching out to ${lead.businessName} regarding ${lead.service}. We received your request and would like to discuss how we can assist you.\n\nBest regards,\n${lead.businessName}`;
    setSyncingAction(true);
    setActionNotification(null);
    try {
      const res = await logLeadContact(lead.id, 'Email', undefined, lead.clientId || activeTenantScope, endpoint);
      if (!res.success) {
        setActionNotification({ type: 'error', message: `Sync failed: ${res.message}` });
        return;
      }
      refreshLocalLeads();
      setActionNotification({ type: 'success', message: 'Email contact logged and synced to Google Sheet ✓' });
      window.location.href = `mailto:${lead.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } catch (err: any) {
      setActionNotification({ type: 'error', message: `Error syncing contact log: ${err?.message || 'Unknown error'}` });
    } finally {
      setSyncingAction(false);
    }
  };

  // Status Change with Remote Sync
  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    setSyncingAction(true);
    setActionNotification(null);
    try {
      const res = await updateLeadStatus(leadId, newStatus, selectedLead?.clientId || activeTenantScope, endpoint);
      if (!res.success) {
        setActionNotification({ type: 'error', message: `Failed to update status on Google Sheet: ${res.message}` });
        return;
      }
      refreshLocalLeads();
      setActionNotification({ type: 'success', message: `Status updated to "${newStatus}" and synced to Google Sheet ✓` });
    } catch (err: any) {
      setActionNotification({ type: 'error', message: `Error updating status: ${err?.message || 'Unknown error'}` });
    } finally {
      setSyncingAction(false);
    }
  };

  // Add Note with Remote Sync
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteText.trim()) return;
    setSyncingAction(true);
    setActionNotification(null);
    try {
      const res = await addLeadNote(selectedLead.id, newNoteText, 'Agent', selectedLead.clientId || activeTenantScope, endpoint);
      if (!res.success) {
        setActionNotification({ type: 'error', message: `Failed to add note on Google Sheet: ${res.message}` });
        return;
      }
      setNewNoteText('');
      refreshLocalLeads();
      setActionNotification({ type: 'success', message: 'Note added and synced to Google Sheet ✓' });
    } catch (err: any) {
      setActionNotification({ type: 'error', message: `Error adding note: ${err?.message || 'Unknown error'}` });
    } finally {
      setSyncingAction(false);
    }
  };

  // Schedule Follow-up with Remote Sync
  const handleSetFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !followUpDateInput) return;
    const timePart = followUpTimeInput || '09:00';
    const combinedIso = new Date(`${followUpDateInput}T${timePart}:00`).toISOString();
    setSyncingAction(true);
    setActionNotification(null);
    try {
      const res = await scheduleLeadFollowUp(selectedLead.id, combinedIso, selectedLead.clientId || activeTenantScope, endpoint);
      if (!res.success) {
        setActionNotification({ type: 'error', message: `Failed to schedule follow-up on Google Sheet: ${res.message}` });
        return;
      }
      refreshLocalLeads();
      setActionNotification({ type: 'success', message: 'Follow-up scheduled and synced to Google Sheet ✓' });
    } catch (err: any) {
      setActionNotification({ type: 'error', message: `Error scheduling follow-up: ${err?.message || 'Unknown error'}` });
    } finally {
      setSyncingAction(false);
    }
  };

  // Clear Follow-up
  const handleClearFollowUp = async () => {
    if (!selectedLead) return;
    setSyncingAction(true);
    setActionNotification(null);
    try {
      const res = await scheduleLeadFollowUp(selectedLead.id, '', selectedLead.clientId || activeTenantScope, endpoint);
      if (!res.success) {
        setActionNotification({ type: 'error', message: `Failed to clear follow-up on Google Sheet: ${res.message}` });
        return;
      }
      setFollowUpDateInput('');
      refreshLocalLeads();
      setActionNotification({ type: 'success', message: 'Follow-up cleared and synced to Google Sheet ✓' });
    } catch (err: any) {
      setActionNotification({ type: 'error', message: `Error clearing follow-up: ${err?.message || 'Unknown error'}` });
    } finally {
      setSyncingAction(false);
    }
  };

  // Quick Preset Handlers
  const handlePresetToday5pm = () => {
    setFollowUpDateInput(getTodayLocalDateStr());
    setFollowUpTimeInput('17:00');
  };

  const handlePresetTomorrow9am = () => {
    setFollowUpDateInput(getTomorrowLocalDateStr());
    setFollowUpTimeInput('09:00');
  };

  const handlePresetIn2Days10am = () => {
    setFollowUpDateInput(getInNDaysLocalDateStr(2));
    setFollowUpTimeInput('10:00');
  };

  // Unique list of Client IDs for agency filter
  const clientIdsList = Array.from(new Set(leads.map((l) => l.clientId)));
  if (currentConfig.clientId && !clientIdsList.includes(currentConfig.clientId)) {
    clientIdsList.push(currentConfig.clientId);
  }

  return (
    <div className="min-h-[calc(100vh-60px)] bg-slate-950 text-slate-100 p-4 md:p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* 1. TOP TITLE & GOOGLE SHEET SYNC BAR */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/20 border border-emerald-500/30 p-2.5 rounded-xl text-emerald-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white tracking-tight">
                  {appMode === 'client' ? `${currentConfig.businessName} CRM` : 'LeadPilot Dashboard'}
                </h1>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded">
                  {appMode === 'client' ? 'Live Lead Sync' : '2-Way Google Sheet Sync'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {appMode === 'client' ? (
                  <>Business Portal • {currentConfig.serviceArea || currentConfig.cityStateZip} • <span className="text-emerald-400 font-medium">Auto Sync Active</span></>
                ) : (
                  <>Client ID: <strong className="text-emerald-400 font-mono">{currentConfig.clientId || 'client-01'}</strong> • Business: <strong className="text-slate-200">{currentConfig.businessName}</strong></>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Section Toggle for Client Mode */}
            {appMode === 'client' && (
              <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
                <button
                  onClick={() => setViewSection('leads')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                    viewSection === 'leads'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📋 Incoming Leads
                </button>
                <button
                  onClick={() => setViewSection('business_info')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                    viewSection === 'business_info'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🏢 Business Profile
                </button>
              </div>
            )}

            {/* Test Connection Button (Dev Mode Only) */}
            {appMode === 'development' && (
              <button
                onClick={runConnectionTest}
                disabled={isTestingConn}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow cursor-pointer"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isTestingConn ? 'animate-spin' : ''}`} />
                <span>{isTestingConn ? 'Testing...' : 'Test Connection'}</span>
              </button>
            )}

            {/* Onboarding & Test Accounts Tool (Dev Mode Only) */}
            {appMode === 'development' && (
              <button
                onClick={() => setIsTestOnboardingModalOpen(true)}
                className="bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow cursor-pointer"
                title="Open isolated test accounts onboarding and live Firestore security verification"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-200" />
                <span>Onboarding & Test Accounts</span>
              </button>
            )}

            {/* Sync Status Button */}
            <button
              onClick={handleSyncRemoteLeads}
              disabled={isSyncing}
              className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-emerald-400 border border-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 transition shadow-sm"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-300' : ''}`} />
              <span>{isSyncing ? 'Syncing Sheet...' : 'Refresh Leads'}</span>
              {lastSyncTime && <span className="text-[10px] text-slate-500 font-mono">({lastSyncTime})</span>}
            </button>

            {/* Add Lead Action Button */}
            <button
              onClick={() => setIsAddLeadModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Lead</span>
            </button>

            {/* Import Leads Action Button */}
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Import Leads</span>
            </button>

            {/* Client Scope Filter (Dev Mode Only) */}
            {appMode === 'development' && (
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-2 rounded-xl text-xs">
                <Filter className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-slate-300">Client Scope:</span>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-white font-mono font-bold rounded px-2.5 py-1 outline-none focus:border-emerald-500"
                >
                  <option value="all">🌐 All Clients (Agency View)</option>
                  {clientIdsList.map((cid) => (
                    <option key={cid} value={cid}>
                      🏢 {cid} {cid === currentConfig.clientId ? `(${currentConfig.businessName})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Endpoint Connection Indicator Badge (Dev Mode Only) */}
        {appMode === 'development' && (
          <>
            {connStatus === 'connected' ? (
              <div className="bg-emerald-950/40 border border-emerald-500/50 p-3.5 rounded-xl text-xs text-emerald-300 flex items-center justify-between flex-wrap gap-2 shadow-lg">
                <div className="flex items-center gap-2 truncate max-w-full md:max-w-xl">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-extrabold text-emerald-400 text-sm shrink-0">Google Sheet Connected ✓</span>
                  {endpoint && (
                    <a
                      href={endpoint}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 hover:text-white px-2.5 py-1 rounded transition underline flex items-center gap-1.5 truncate border border-emerald-500/30 cursor-pointer shadow-sm"
                      title="Click to open Google Apps Script Web App URL in a new tab"
                    >
                      <span className="truncate">{endpoint}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 text-emerald-300" />
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-emerald-300 font-medium">{connMsg || 'Connected and synchronized'}</span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Connected
                  </span>
                </div>
              </div>
            ) : connStatus === 'failed' ? (
              <div className="bg-red-950/40 border border-red-500/50 p-3.5 rounded-xl text-xs text-red-300 flex items-center justify-between flex-wrap gap-2 shadow-lg">
                <div className="flex items-center gap-2 truncate max-w-full md:max-w-xl">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="font-extrabold text-red-400 text-sm shrink-0">Google Sheet Connection Failed</span>
                  {endpoint && (
                    <a
                      href={endpoint}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono bg-red-900/60 hover:bg-red-800 text-red-200 hover:text-white px-2.5 py-1 rounded transition underline flex items-center gap-1.5 truncate border border-red-500/30 cursor-pointer shadow-sm"
                      title="Click to open Google Apps Script Web App URL in a new tab"
                    >
                      <span className="truncate">{endpoint}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 text-red-300" />
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-red-200">{connMsg}</span>
                  <button
                    onClick={runConnectionTest}
                    className="bg-red-800 hover:bg-red-700 text-white font-bold text-xs px-2.5 py-1 rounded transition"
                  >
                    Retry Test
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-amber-950/30 border border-amber-800/40 p-3.5 rounded-xl text-xs text-amber-300 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Google Apps Script URL Required:</strong> Configure your Google Apps Script Web App URL in <code>CONFIG.formEndpoint</code> to enable Google Sheet integration.
                  </span>
                </div>
                <button
                  onClick={runConnectionTest}
                  className="bg-amber-800/60 hover:bg-amber-700 text-amber-200 font-bold text-xs px-3 py-1 rounded transition"
                >
                  Test Connection
                </button>
              </div>
            )}
          </>
        )}

        {/* Syncing / Action Notification Banner */}
        {syncingAction && (
          <div className="bg-blue-950/60 border border-blue-500/50 p-3 rounded-xl text-xs text-blue-300 flex items-center gap-2 animate-pulse">
            <RotateCw className="w-4 h-4 text-blue-400 animate-spin" />
            <span>Syncing update to Google Sheet Web App... Please wait.</span>
          </div>
        )}
        {actionNotification && !syncingAction && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center justify-between gap-2 shadow-lg ${
              actionNotification.type === 'success'
                ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-200'
                : 'bg-red-950/80 border border-red-500 text-red-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {actionNotification.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span className="font-semibold">{actionNotification.message}</span>
            </div>
            <button
              onClick={() => setActionNotification(null)}
              className="text-xs font-bold opacity-70 hover:opacity-100 px-2 py-0.5 rounded bg-slate-800/50"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Business Profile View (Client Mode View Section) */}
        {viewSection === 'business_info' ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-400" />
                  {currentConfig.businessName} — Business Profile
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Client ID: <strong className="text-emerald-400 font-mono">{currentConfig.clientId || 'client-01'}</strong> • Industry: <strong className="text-slate-200 capitalize">{currentConfig.industry}</strong>
                </p>
              </div>
              <button
                onClick={() => setViewSection('leads')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                Back to Incoming Leads →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card 1: Core Contact Info */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-4 h-4" /> Contact Information
                </h3>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Primary Phone</span>
                    <strong className="text-white font-mono text-sm">{currentConfig.phone}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Email Address</span>
                    <strong className="text-slate-200">{currentConfig.email}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Physical Address / City</span>
                    <strong className="text-slate-200">{currentConfig.address || currentConfig.cityStateZip}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Service Area</span>
                    <strong className="text-slate-200">{currentConfig.serviceArea || currentConfig.cityStateZip}</strong>
                  </div>
                </div>
              </div>

              {/* Card 2: Business Reputation & Google Profile */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-current" /> Reputation & GBP
                </h3>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Rating & Review Count</span>
                    <span className="text-amber-400 font-bold">{currentConfig.rating} ★ ({currentConfig.reviewCount}+ Verified Reviews)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Tagline</span>
                    <span className="text-slate-300 italic">"{currentConfig.tagline}"</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">License / Credentials</span>
                    <span className="text-slate-300 font-mono">{currentConfig.licenseNumber || 'Licensed & Insured'}</span>
                  </div>
                  <div className="pt-2">
                    <a
                      href={currentConfig.gbpUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentConfig.businessName + ' ' + currentConfig.cityStateZip)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition"
                    >
                      <span>Google Business Profile</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Card 3: Google Sheet Database Integration Status */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-blue-400" /> Lead Storage Backend
                </h3>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Backend Sync</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Active 2-Way Synchronization
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Client Isolation Scope</span>
                    <span className="text-white font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 inline-block">
                      {currentConfig.clientId || 'client-01'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Operating Hours</span>
                    <span className="text-slate-300">{currentConfig.hours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Offered Grid */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                Services Offered ({currentConfig.services.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {currentConfig.services.map((svc, i) => (
                  <div key={i} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-xs">
                    <div className="font-bold text-white">{svc.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{svc.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* 2. STATS OVERVIEW METRICS (7 Cards Required) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* Card 1: Total Leads */}
          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
            <div className="text-slate-400 text-xs font-bold flex items-center justify-between">
              <span>Total Leads</span>
              <Building2 className="w-4 h-4 text-slate-500" />
            </div>
            <div className="text-2xl font-black text-white mt-1">{totalLeadsCount}</div>
            <div className="text-[10px] text-slate-500 mt-1 truncate">Google Sheet Records</div>
          </div>

          {/* Card 2: New Leads */}
          <div className="bg-emerald-950/40 border border-emerald-800/60 p-3.5 rounded-xl">
            <div className="text-emerald-400 text-xs font-bold flex items-center justify-between">
              <span>New Leads</span>
              <Zap className="w-4 h-4 text-emerald-400 fill-current" />
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{newLeadsCount}</div>
            <div className="text-[10px] text-emerald-300/70 mt-1 truncate">Action required</div>
          </div>

          {/* Card 3: Contacted */}
          <div className="bg-blue-950/40 border border-blue-800/60 p-3.5 rounded-xl">
            <div className="text-blue-400 text-xs font-bold flex items-center justify-between">
              <span>Contacted</span>
              <Phone className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-blue-400 mt-1">{contactedCount}</div>
            <div className="text-[10px] text-blue-300/70 mt-1 truncate">In communication</div>
          </div>

          {/* Card 4: Follow-ups Today */}
          <div className="bg-amber-950/40 border border-amber-800/60 p-3.5 rounded-xl">
            <div className="text-amber-400 text-xs font-bold flex items-center justify-between">
              <span>Follow-ups Today</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400 mt-1">{todayFollowUpCount}</div>
            <div className="text-[10px] text-amber-300/70 mt-1 truncate">Scheduled today</div>
          </div>

          {/* Card 5: Overdue Follow-ups */}
          <div className="bg-red-950/40 border border-red-800/60 p-3.5 rounded-xl">
            <div className="text-red-400 text-xs font-bold flex items-center justify-between">
              <span>Overdue</span>
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-black text-red-400 mt-1">{overdueCount}</div>
            <div className="text-[10px] text-red-300/70 mt-1 truncate">Needs immediate response</div>
          </div>

          {/* Card 6: Won */}
          <div className="bg-purple-950/40 border border-purple-800/60 p-3.5 rounded-xl">
            <div className="text-purple-400 text-xs font-bold flex items-center justify-between">
              <span>Won</span>
              <Flame className="w-4 h-4 text-purple-400 fill-current" />
            </div>
            <div className="text-2xl font-black text-purple-300 mt-1">{wonCount}</div>
            <div className="text-[10px] text-purple-300/70 mt-1 truncate">Closed deals</div>
          </div>

          {/* Card 7: Lost */}
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl col-span-2 sm:col-span-1">
            <div className="text-slate-400 text-xs font-bold flex items-center justify-between">
              <span>Lost</span>
              <XCircle className="w-4 h-4 text-slate-500" />
            </div>
            <div className="text-2xl font-black text-slate-400 mt-1">{lostCount}</div>
            <div className="text-[10px] text-slate-500 mt-1 truncate">Closed / Lost</div>
          </div>
        </div>

        {/* 3A. OVERDUE FOLLOW-UPS PROMINENT BOX */}
        {overdueFollowUps.length > 0 && (
          <div className="bg-red-950/30 border border-red-800/60 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-red-300 uppercase tracking-wide flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Overdue Follow-ups ({overdueFollowUps.length})
              </h2>
              <span className="text-xs text-red-400 font-bold bg-red-900/40 px-2.5 py-0.5 rounded border border-red-700/50">
                Action Required Immediately
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {overdueFollowUps.map((lead, idx) => (
                <div key={`${lead.id}-overdue-${idx}`} className="bg-slate-900 p-3 rounded-xl border border-red-700/60 flex flex-col justify-between gap-2 shadow">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span>{lead.name}</span>
                      <span className="text-[10px] font-mono text-red-400">{lead.id}</span>
                    </div>
                    <div className="text-xs text-slate-300 font-medium mt-0.5">{lead.service}</div>
                    <div className="text-[11px] text-slate-400 mt-1 truncate">{lead.phone} • {lead.address || 'Local area'}</div>
                    <div className="text-[10px] font-bold text-red-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Scheduled: {formatFollowUpDisplay(lead.followUpDate)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="text-xs text-red-400 font-bold hover:underline"
                    >
                      Manage & Reschedule →
                    </button>
                    <div className="flex items-center gap-1">
                      <button onClick={(e) => handleActionCall(lead, e)} title="Call" className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-500">
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={(e) => handleActionWhatsApp(lead, e)} title="WhatsApp" className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-500">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={(e) => handleActionSms(lead, e)} title="SMS" className="p-1.5 bg-purple-600 text-white rounded hover:bg-purple-500">
                        <Send className="w-3.5 h-3.5" />
                      </button>
                      {lead.email && (
                        <button onClick={(e) => handleActionEmail(lead, e)} title="Email" className="p-1.5 bg-amber-600 text-white rounded hover:bg-amber-500">
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3B. TODAY'S FOLLOW-UP TASKS PROMINENT BOX */}
        {todayFollowUps.length > 0 && (
          <div className="bg-amber-950/30 border border-amber-800/60 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-amber-300 uppercase tracking-wide flex items-center gap-2">
                <Clock3 className="w-4 h-4 text-amber-400" />
                Today's Scheduled Follow-ups ({todayFollowUps.length})
              </h2>
              <span className="text-xs text-amber-400 font-bold bg-amber-900/40 px-2.5 py-0.5 rounded border border-amber-700/50">
                Scheduled for Today
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {todayFollowUps.map((lead, idx) => (
                <div key={`${lead.id}-today-${idx}`} className="bg-slate-900 p-3 rounded-xl border border-amber-700/50 flex flex-col justify-between gap-2 shadow">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span>{lead.name}</span>
                      <span className="text-[10px] font-mono text-amber-400">{lead.id}</span>
                    </div>
                    <div className="text-xs text-slate-300 font-medium mt-0.5">{lead.service}</div>
                    <div className="text-[11px] text-slate-400 mt-1 truncate">{lead.phone} • {lead.address || 'Local area'}</div>
                    <div className="text-[10px] font-bold text-amber-300 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" /> Time: {formatFollowUpDisplay(lead.followUpDate)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="text-xs text-amber-400 font-bold hover:underline"
                    >
                      View Details →
                    </button>
                    <div className="flex items-center gap-1">
                      <button onClick={(e) => handleActionCall(lead, e)} title="Call" className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-500">
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={(e) => handleActionWhatsApp(lead, e)} title="WhatsApp" className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-500">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={(e) => handleActionSms(lead, e)} title="SMS" className="p-1.5 bg-purple-600 text-white rounded hover:bg-purple-500">
                        <Send className="w-3.5 h-3.5" />
                      </button>
                      {lead.email && (
                        <button onClick={(e) => handleActionEmail(lead, e)} title="Email" className="p-1.5 bg-amber-600 text-white rounded hover:bg-amber-500">
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. MAIN LEADS LIST TABLE */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden space-y-4 p-4">
          
          {/* Controls: Search & Tabs */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            
            {/* Status Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto text-xs font-bold scrollbar-none pb-1 md:pb-0">
              {(['All', 'New', 'Contacted', 'Follow-up', 'Qualified', 'Won', 'Lost'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                    activeTab === tab
                      ? 'bg-emerald-600 text-white shadow font-extrabold'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Input & Actions */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="relative w-full sm:w-56">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search leads..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                />
              </div>

              {/* Country Code selector for WhatsApp & Calls */}
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 shrink-0">
                <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <select
                  value={selectedCountryCode}
                  onChange={(e) => setSelectedCountryCode(e.target.value)}
                  className="bg-transparent text-white font-bold text-xs outline-none cursor-pointer"
                  title="Default Country Code applied to 10-digit numbers for WhatsApp and phone links"
                >
                  {SUPPORTED_COUNTRY_CODES.map((opt) => (
                    <option key={opt.code} value={opt.code} className="bg-slate-900 text-white">
                      {opt.flag} +{opt.code} ({opt.label.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setIsImportModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow shrink-0"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Import Leads</span>
              </button>
            </div>
          </div>

          {/* Table / List */}
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="bg-slate-800/80 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-300">No leads found in LeadPilot</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No lead records match your search or filter. Submit a quote on the <strong>Live Website</strong> tab to capture a live lead!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-extrabold bg-slate-950/60">
                    <th className="py-3 px-3">Lead ID</th>
                    <th className="py-3 px-3">Customer Name</th>
                    <th className="py-3 px-3">Phone & Email</th>
                    <th className="py-3 px-3">Service & Address</th>
                    <th className="py-3 px-3">Lead Date</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Follow-up</th>
                    <th className="py-3 px-3 text-center">Communication Actions</th>
                    <th className="py-3 px-3 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredLeads.map((lead, idx) => (
                    <tr
                      key={`${lead.id}-${idx}`}
                      onClick={() => {
                        setSelectedLead(lead);
                        setEditedPhoneInput(lead.phone);
                        setIsEditingPhone(false);
                      }}
                      className="hover:bg-slate-800/50 cursor-pointer transition"
                    >
                      {/* Lead ID */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-mono font-bold text-emerald-400 text-xs">{lead.id}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{lead.clientId}</div>
                      </td>

                      {/* Customer Name */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-bold text-white text-sm">{lead.name}</div>
                        <div className="text-[10px] text-slate-400">{lead.businessName}</div>
                      </td>

                      {/* Phone & Email */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-bold text-slate-200">
                          {formatDisplayPhone(lead.phone, selectedCountryCode)}
                        </div>
                        {lead.email ? (
                          <div className="text-[10px] text-blue-400 underline">{lead.email}</div>
                        ) : (
                          <div className="text-[10px] text-slate-500 italic">No email provided</div>
                        )}
                      </td>

                      {/* Service & Address */}
                      <td className="py-3 px-3 max-w-xs">
                        <div className="font-bold text-slate-200">{lead.service}</div>
                        <div className="text-[10px] text-slate-400 truncate">{lead.address || 'Local area'}</div>
                      </td>

                      {/* Lead Date */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="text-slate-200 font-medium text-xs">
                          {new Date(lead.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {new Date(lead.timestamp).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {getStatusBadge(lead.status)}
                      </td>

                      {/* Follow-up */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {getFollowUpBadge(lead)}
                      </td>

                      {/* Communication Actions */}
                      <td className="py-3 px-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          {/* 1. CALL */}
                          <button
                            onClick={(e) => handleActionCall(lead, e)}
                            title="Call Now"
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition text-[11px]"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call</span>
                          </button>

                          {/* 2. WHATSAPP */}
                          <button
                            onClick={(e) => handleActionWhatsApp(lead, e)}
                            title="Open WhatsApp"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition text-[11px]"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </button>

                          {/* 3. SMS */}
                          <button
                            onClick={(e) => handleActionSms(lead, e)}
                            title="Send SMS"
                            className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition text-[11px]"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>SMS</span>
                          </button>

                          {/* 4. EMAIL */}
                          {lead.email ? (
                            <button
                              onClick={(e) => handleActionEmail(lead, e)}
                              title="Send Email"
                              className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition text-[11px]"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Email</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-600 bg-slate-800/50 px-2 py-1 rounded border border-slate-800 opacity-60 cursor-not-allowed">
                              No Email
                            </span>
                          )}
                        </div>
                      </td>

                      {/* View & Delete Buttons */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5 ml-auto">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1 transition cursor-pointer"
                          >
                            <span>Manage</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setLeadToDelete(lead);
                            }}
                            title={`Delete ${lead.name}`}
                            className="bg-slate-800/80 hover:bg-red-950/60 text-slate-400 hover:text-red-400 p-1.5 rounded-lg border border-slate-700/60 hover:border-red-500/40 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </>
    )}

      </div>

      {/* 5. CLEAN LEAD DETAIL MODAL / PANEL */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white">{selectedLead.name}</h2>
                  {getStatusBadge(selectedLead.status)}
                </div>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Lead ID: <strong className="text-emerald-400">{selectedLead.id}</strong> • Submitted: {new Date(selectedLead.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLeadToDelete(selectedLead)}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  title="Delete this lead"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg font-bold text-xs border border-slate-700 cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Direct Communication Action Bar */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block">
                Direct Communication Actions
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* 📞 CALL */}
                <button
                  onClick={() => handleActionCall(selectedLead)}
                  className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow transition"
                >
                  <Phone className="w-5 h-5" />
                  <span>📞 Call Customer</span>
                  <span className="text-[10px] font-mono text-blue-200 truncate">{selectedLead.phone}</span>
                </button>

                {/* 💬 WHATSAPP */}
                <button
                  onClick={() => handleActionWhatsApp(selectedLead, undefined, customLeadWhatsAppMsg)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow transition"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>💬 WhatsApp</span>
                  <span className="text-[10px] text-emerald-200 font-mono truncate max-w-full">
                    +{getRawPhone(selectedLead.phone)}
                  </span>
                </button>

                {/* 💬 SMS */}
                <button
                  onClick={() => handleActionSms(selectedLead)}
                  className="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow transition"
                >
                  <Send className="w-5 h-5" />
                  <span>💬 Send SMS</span>
                  <span className="text-[10px] text-purple-200 font-mono truncate max-w-full">
                    +{getRawPhone(selectedLead.phone)}
                  </span>
                </button>

                {/* 📧 EMAIL */}
                {selectedLead.email ? (
                  <button
                    onClick={() => handleActionEmail(selectedLead)}
                    className="bg-amber-600 hover:bg-amber-500 text-white p-3 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow transition"
                  >
                    <Mail className="w-5 h-5" />
                    <span>📧 Send Email</span>
                    <span className="text-[10px] text-amber-200 truncate max-w-full">{selectedLead.email}</span>
                  </button>
                ) : (
                  <div className="bg-slate-800 border border-slate-700 text-slate-500 p-3 rounded-xl text-xs flex flex-col items-center justify-center gap-1 opacity-60">
                    <Mail className="w-5 h-5" />
                    <span className="font-bold">Email Optional</span>
                    <span className="text-[9px]">Not provided</span>
                  </div>
                )}
              </div>
            </div>

            {/* Phone & WhatsApp Connection Info */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-400">Customer Phone:</span>
                  <strong className="text-white font-mono text-sm">
                    {formatDisplayPhone(selectedLead.phone, selectedCountryCode)}
                  </strong>
                </div>
                <button
                  onClick={() => {
                    setIsEditingPhone(!isEditingPhone);
                    setEditedPhoneInput(selectedLead.phone);
                  }}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 underline"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>{isEditingPhone ? 'Cancel Edit' : 'Edit Number'}</span>
                </button>
              </div>

              {isEditingPhone ? (
                <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={editedPhoneInput}
                    onChange={(e) => setEditedPhoneInput(e.target.value)}
                    placeholder="Enter 10-digit number or +91..."
                    className="bg-slate-900 border border-slate-700 text-white text-xs px-3 py-1.5 rounded-lg flex-1 outline-none font-mono focus:border-emerald-500"
                  />
                  <button
                    onClick={handleSaveEditedPhone}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shrink-0"
                  >
                    Save Number
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span>Target: <span className="text-emerald-400 font-bold">https://wa.me/{getRawPhone(selectedLead.phone)}</span></span>
                      <span className="text-slate-500">• Country: +{selectedCountryCode}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${getRawPhone(selectedLead.phone)}?text=${encodeURIComponent(customLeadWhatsAppMsg || getWhatsAppMessage(selectedLead))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold underline"
                      >
                        Direct Link ↗
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(`https://wa.me/${getRawPhone(selectedLead.phone)}?text=${encodeURIComponent(customLeadWhatsAppMsg || getWhatsAppMessage(selectedLead))}`);
                          setActionNotification({ type: 'success', message: 'WhatsApp link with message copied to clipboard ✓' });
                        }}
                        className="text-[11px] text-slate-300 hover:text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700"
                      >
                        Copy Link
                      </button>
                    </div>
                  </div>

                  {/* Pre-filled Message Editor for this Lead */}
                  <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs font-bold text-slate-200">WhatsApp Pre-filled Message</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-1.5 py-0.5 rounded font-medium">
                        Live Customizable
                      </span>
                    </div>

                    <textarea
                      rows={3}
                      value={customLeadWhatsAppMsg}
                      onChange={(e) => setCustomLeadWhatsAppMsg(e.target.value)}
                      placeholder="Type pre-filled WhatsApp message..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white text-xs leading-relaxed focus:border-emerald-500 outline-none"
                    />

                    {/* Quick Preset Buttons for Tarot / General */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Presets:</span>
                      <button
                        type="button"
                        onClick={() => setCustomLeadWhatsAppMsg(getWhatsAppMessage(selectedLead, 'Hi {name}, thank you for reaching out to {businessName} regarding your Tarot Reading session ({service}). When would you like to schedule your guidance reading?'))}
                        className="text-[10px] bg-purple-950/70 hover:bg-purple-900 text-purple-200 border border-purple-800/60 px-2 py-0.5 rounded transition"
                      >
                        🔮 Tarot Booking
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomLeadWhatsAppMsg(getWhatsAppMessage(selectedLead, 'Namaste {name}, this is {businessName}. We received your Tarot inquiry for {service}. Are you available for a quick discussion on WhatsApp?'))}
                        className="text-[10px] bg-amber-950/70 hover:bg-amber-900 text-amber-200 border border-amber-800/60 px-2 py-0.5 rounded transition"
                      >
                        ✨ Consultation
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomLeadWhatsAppMsg(getWhatsAppMessage(selectedLead, 'Hi {name}, following up regarding your Tarot session with {businessName}. Let us know your preferred date and time!'))}
                        className="text-[10px] bg-blue-950/70 hover:bg-blue-900 text-blue-200 border border-blue-800/60 px-2 py-0.5 rounded transition"
                      >
                        📅 Follow-up
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(customLeadWhatsAppMsg);
                          setActionNotification({ type: 'success', message: 'Message text copied to clipboard ✓' });
                        }}
                        className="text-[10px] text-slate-400 hover:text-slate-200 underline"
                      >
                        Copy text only
                      </button>
                      <button
                        onClick={() => handleActionWhatsApp(selectedLead, undefined, customLeadWhatsAppMsg)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-lg transition flex items-center gap-1.5 shadow"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Send via WhatsApp ↗</span>
                      </button>
                    </div>
                  </div>

                  {/* WhatsApp Error Helper explanation */}
                  <div className="text-[10px] text-slate-500 bg-slate-900/60 p-2 rounded border border-slate-800/80 leading-relaxed">
                    💡 <strong className="text-slate-400">Why does WhatsApp show &quot;Phone number shared via url is invalid&quot;?</strong> WhatsApp displays this if the number has no active WhatsApp account (e.g. test or dummy numbers) or if the wrong country code was applied. Use &quot;Edit Number&quot; above to correct it anytime.
                  </div>
                </div>
              )}
            </div>

            {/* Status Workflow (New -> Contacted -> Follow-up -> Qualified -> Won / Lost) */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider block">
                Update Status Workflow
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(['New', 'Contacted', 'Follow-up', 'Qualified', 'Won', 'Lost'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedLead.id, st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                      selectedLead.status === st
                        ? 'bg-emerald-600 text-white border-emerald-500 ring-2 ring-emerald-500/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer & Service Info Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block font-bold">Service Requested</span>
                <span className="text-white font-bold">{selectedLead.service}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-bold">Service Address</span>
                <span className="text-white font-bold">{selectedLead.address || 'Local area'}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-bold">Lead Source</span>
                <span className="text-slate-300">{selectedLead.leadSource}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-bold">Client / Business ID</span>
                <span className="text-emerald-400 font-mono">{selectedLead.clientId} ({selectedLead.businessName})</span>
              </div>
              <div className="col-span-2 border-t border-slate-800 pt-2">
                <span className="text-slate-500 block font-bold mb-1">Customer Message / Details</span>
                <p className="text-slate-200 bg-slate-900 p-2.5 rounded border border-slate-800 font-sans italic">
                  "{selectedLead.details}"
                </p>
              </div>
            </div>

            {/* Simple Follow-up Workflow Section */}
            <form onSubmit={handleSetFollowUp} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Calendar className="w-4 h-4" /> Schedule Follow-up Date & Time
                </label>
                {selectedLead.followUpDate && (
                  <button
                    type="button"
                    onClick={handleClearFollowUp}
                    className="text-[10px] text-slate-400 hover:text-red-400 underline font-bold"
                  >
                    Clear Follow-up
                  </button>
                )}
              </div>

              {/* Date & Time Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Select Date</label>
                  <input
                    type="date"
                    value={followUpDateInput}
                    onChange={(e) => setFollowUpDateInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white text-xs p-2 rounded-lg outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Select Time</label>
                  <input
                    type="time"
                    value={followUpTimeInput}
                    onChange={(e) => setFollowUpTimeInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white text-xs p-2 rounded-lg outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-500 font-bold mr-1">Quick Presets:</span>
                <button
                  type="button"
                  onClick={handlePresetToday5pm}
                  className="bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 text-[10px] font-bold px-2 py-1 rounded"
                >
                  Today 5 PM
                </button>
                <button
                  type="button"
                  onClick={handlePresetTomorrow9am}
                  className="bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 text-[10px] font-bold px-2 py-1 rounded"
                >
                  Tomorrow 9 AM
                </button>
                <button
                  type="button"
                  onClick={handlePresetIn2Days10am}
                  className="bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 text-[10px] font-bold px-2 py-1 rounded"
                >
                  In 2 Days 10 AM
                </button>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                <div className="text-[11px]">
                  {selectedLead.followUpDate ? (
                    <span className="text-amber-300 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Scheduled: {formatFollowUpDisplay(selectedLead.followUpDate)}
                    </span>
                  ) : (
                    <span className="text-slate-500 italic">No follow-up scheduled yet</span>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!followUpDateInput}
                  className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs px-4 py-2 rounded-lg transition"
                >
                  Save Follow-up Schedule
                </button>
              </div>
            </form>

            {/* Add Custom Note */}
            <form onSubmit={handleAddNote} className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Add Internal Agent Note</label>
              <div className="flex gap-2">
                <textarea
                  rows={2}
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Enter notes about phone call, estimate given, or customer response..."
                  className="bg-slate-950 border border-slate-800 text-white text-xs p-2.5 rounded-xl flex-1 outline-none focus:border-emerald-500 resize-none"
                />
                <button
                  type="submit"
                  disabled={!newNoteText.trim()}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs px-4 rounded-xl"
                >
                  Add Note
                </button>
              </div>
            </form>

            {/* Notes & Activity History Timeline */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                Communication & Activity History ({selectedLead.notes.length})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedLead.notes.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No notes recorded yet.</p>
                ) : (
                  selectedLead.notes.map((n, idx) => (
                    <div key={`${n.id}-${idx}`} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs space-y-0.5">
                      <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                        <span>{n.author || 'System'}</span>
                        <span>{new Date(n.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-200">{n.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Manual Add Lead Modal */}
      <ManualLeadModal
        isOpen={isAddLeadModalOpen}
        onClose={() => setIsAddLeadModalOpen(false)}
        currentConfig={currentConfig}
        onLeadAdded={handleLeadAdded}
      />

      {/* Delete Lead Confirmation Modal */}
      <DeleteLeadModal
        isOpen={Boolean(leadToDelete)}
        lead={leadToDelete}
        onClose={() => setLeadToDelete(null)}
        onConfirmDelete={handleConfirmDeleteLead}
      />

      {/* Import Leads Modal */}
      <LeadImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        currentConfig={currentConfig}
        onImportSuccess={handleImportSuccess}
      />

      {/* Test Onboarding & Live Security Verification Modal (Dev Mode Only) */}
      {appMode === 'development' && (
        <TestOnboardingModal
          isOpen={isTestOnboardingModalOpen}
          onClose={() => setIsTestOnboardingModalOpen(false)}
        />
      )}

    </div>
  );
};
