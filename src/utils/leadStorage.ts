import { LeadItem, LeadStatus, ContactMethod, LeadNote, LeadContactLog } from '../types';

const STORAGE_KEY = 'leadpilot_leads_v1';

/**
 * Deduplicate leads array to guarantee unique Lead IDs
 */
export function deduplicateLeads(leads: LeadItem[]): LeadItem[] {
  const seen = new Set<string>();
  const clean: LeadItem[] = [];

  for (const lead of leads) {
    if (!lead || !lead.id) continue;
    let uniqueId = lead.id.trim();

    if (seen.has(uniqueId)) {
      // Append a unique suffix to resolve duplicate key conflicts
      let counter = 1;
      while (seen.has(`${uniqueId}-${counter}`)) {
        counter++;
      }
      uniqueId = `${uniqueId}-${counter}`;
    }

    seen.add(uniqueId);
    clean.push({ ...lead, id: uniqueId });
  }

  return clean;
}

/**
 * Get all stored leads from localStorage (UI cache)
 */
export function getStoredLeads(): LeadItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: LeadItem[] = JSON.parse(raw);
    return deduplicateLeads(parsed);
  } catch (err) {
    console.error('Error reading LeadPilot leads from localStorage:', err);
    return [];
  }
}

/**
 * Save all leads array to localStorage (UI cache)
 */
export function saveAllLeads(leads: LeadItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    const cleanLeads = deduplicateLeads(leads);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanLeads));
    window.dispatchEvent(new Event('leadpilot_leads_updated'));
  } catch (err) {
    console.error('Error saving LeadPilot leads to localStorage:', err);
  }
}

/**
 * Helper to generate a sequential Lead ID (e.g., LP-20260809-0001)
 */
export function generateLeadId(existingCount: number = 0): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const existingLeads = getStoredLeads();
  
  let num = existingCount + 1;
  let candidate = `LP-${dateStr}-${String(num).padStart(4, '0')}`;

  while (existingLeads.some((l) => l.id === candidate)) {
    num++;
    candidate = `LP-${dateStr}-${String(num).padStart(4, '0')}`;
  }

  return candidate;
}

export interface ConnectionTestResult {
  success: boolean;
  statusText: string;
  message: string;
  leadCount?: number;
}

/**
 * Test health-check connection to Google Apps Script Web App
 */
export async function testGoogleSheetConnection(endpointUrl: string): Promise<ConnectionTestResult> {
  if (!endpointUrl || !endpointUrl.trim() || !endpointUrl.startsWith('http')) {
    return {
      success: false,
      statusText: 'Google Apps Script URL Required',
      message: 'Google Apps Script URL is missing or unconfigured in CONFIG.formEndpoint.',
    };
  }

  try {
    const url = new URL(endpointUrl.trim());
    url.searchParams.set('action', 'getLeads');
    url.searchParams.set('t', Date.now().toString());

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      return {
        success: false,
        statusText: 'Google Sheet Connection Failed',
        message: `Endpoint returned HTTP error ${res.status}.`,
      };
    }

    const json = await res.json();

    if (
      json.status === 'success' ||
      json.result === 'success' ||
      json.status === 'ok' ||
      Array.isArray(json.leads) ||
      Array.isArray(json)
    ) {
      const count = Array.isArray(json.leads)
        ? json.leads.length
        : (Array.isArray(json) ? json.length : (json.count || 0));
      return {
        success: true,
        statusText: 'Google Sheet Connected ✓',
        message: `Successfully connected to Google Sheet Web App. Found ${count} lead(s).`,
        leadCount: count,
      };
    } else if (typeof json === 'object' && json !== null) {
      if (json.error || json.status === 'error' || json.result === 'error') {
        return {
          success: false,
          statusText: 'Google Sheet Connection Failed',
          message: json.message || json.error || 'Google Apps Script returned an error response.',
        };
      }
      return {
        success: true,
        statusText: 'Google Sheet Connected ✓',
        message: 'Successfully reached Google Apps Script Web App.',
      };
    }

    return {
      success: false,
      statusText: 'Google Sheet Connection Failed',
      message: 'Google Apps Script returned an unrecognized response format.',
    };
  } catch (err: any) {
    return {
      success: false,
      statusText: 'Google Sheet Connection Failed',
      message: err?.message || 'Failed to reach Google Apps Script Web App URL.',
    };
  }
}

function normalizePhone(phone: string): string {
  return (phone || '').replace(/\D/g, '');
}

function isSameLead(a: LeadItem, b: LeadItem): boolean {
  // 1. Primary check: Exact Lead ID match
  if (a.id && b.id && a.id.trim() === b.id.trim()) {
    return true;
  }

  // 2. Fallback check: Normalized phone + service match
  const phoneA = normalizePhone(a.phone);
  const phoneB = normalizePhone(b.phone);
  const serviceA = (a.service || '').toLowerCase().trim();
  const serviceB = (b.service || '').toLowerCase().trim();

  if (phoneA && phoneB && phoneA === phoneB && serviceA === serviceB) {
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    if (!isNaN(timeA) && !isNaN(timeB)) {
      const diffMins = Math.abs(timeA - timeB) / (1000 * 60);
      if (diffMins <= 30) return true;
    }
    if (a.clientId && b.clientId && a.clientId === b.clientId) {
      return true;
    }
  }

  return false;
}

function mergeLeadRecords(local: LeadItem, remote: LeadItem): LeadItem {
  const existingNoteTexts = new Set((local.notes || []).map((n) => n.text.trim()));
  const mergedNotes = [...(local.notes || [])];

  (remote.notes || []).forEach((rNote) => {
    if (!existingNoteTexts.has(rNote.text.trim())) {
      mergedNotes.push(rNote);
      existingNoteTexts.add(rNote.text.trim());
    }
  });

  mergedNotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return {
    ...local,
    ...remote, // Remote values from Google Sheet are authoritative
    id: remote.id || local.id, // Ensure primary key aligns with Google Sheet
    notes: mergedNotes.length > 0 ? mergedNotes : (remote.notes || local.notes || []),
    contactLogs: remote.contactLogs && remote.contactLogs.length > 0
      ? remote.contactLogs
      : local.contactLogs || [],
  };
}

/**
 * FETCH REMOTE LEADS FROM GOOGLE SHEET VIA GOOGLE APPS SCRIPT WEB APP
 * This makes LeadPilot work across different devices, browsers, and tabs!
 */
export async function fetchRemoteLeads(endpointUrl: string, clientId: string = 'all'): Promise<LeadItem[]> {
  if (!endpointUrl || !endpointUrl.trim() || !endpointUrl.startsWith('http')) {
    return getStoredLeads();
  }

  try {
    const url = new URL(endpointUrl.trim());
    url.searchParams.set('action', 'getLeads');
    url.searchParams.set('clientId', clientId);
    url.searchParams.set('t', Date.now().toString());

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      console.warn('Google Apps Script GET response not OK:', res.status);
      return getStoredLeads();
    }

    const json = await res.json();
    if (
      json.status === 'success' ||
      json.result === 'success' ||
      json.status === 'ok' ||
      Array.isArray(json.leads) ||
      Array.isArray(json)
    ) {
      const remoteLeads: LeadItem[] = Array.isArray(json.leads) ? json.leads : (Array.isArray(json) ? json : []);
      const localLeads = getStoredLeads();

      const mergedList = [...localLeads];

      for (const remote of remoteLeads) {
        const matchIdx = mergedList.findIndex((local) => isSameLead(local, remote));
        if (matchIdx !== -1) {
          mergedList[matchIdx] = mergeLeadRecords(mergedList[matchIdx], remote);
        } else {
          mergedList.push(remote);
        }
      }

      // Sort newest first
      mergedList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      saveAllLeads(mergedList);

      if (clientId === 'all') {
        return mergedList;
      }
      return mergedList.filter((l) => !l.clientId || l.clientId === clientId);
    }
  } catch (err) {
    console.warn('Remote sync fetch failed (falling back to UI cache):', err);
  }

  return getStoredLeads();
}

/**
 * POST ACTION TO REMOTE GOOGLE APPS SCRIPT BACKEND
 */
export async function syncLeadActionToRemote(
  endpointUrl: string | undefined,
  payload: Record<string, any>
): Promise<{ success: boolean; result?: any; message: string }> {
  if (!endpointUrl || !endpointUrl.trim() || !endpointUrl.startsWith('http')) {
    return { success: true, message: 'Updated local state (No remote Google Apps Script URL configured).' };
  }

  try {
    const res = await fetch(endpointUrl.trim(), {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return {
        success: false,
        message: `Google Apps Script returned HTTP status ${res.status}`,
      };
    }

    const json = await res.json();
    if (json.result === 'success' || json.status === 'success' || json.status === 'ok') {
      return {
        success: true,
        result: json,
        message: json.message || 'Action synced to Google Sheet successfully',
      };
    } else {
      return {
        success: false,
        result: json,
        message: json.message || json.error || 'Google Apps Script returned an error response.',
      };
    }
  } catch (err: any) {
    console.error('Failed to sync lead action to Google Apps Script:', err);
    return {
      success: false,
      message: err?.message || 'Network error syncing to Google Apps Script Web App.',
    };
  }
}

/**
 * Save a new lead or update an existing lead (with duplicate prevention)
 */
export async function saveLead(
  input: Partial<LeadItem> & { name: string; phone: string; service: string },
  endpointUrl?: string
): Promise<{ success: boolean; message: string; lead: LeadItem }> {
  const leads = getStoredLeads();
  
  // 1. Check if explicit ID matches an existing lead
  let existingIndex = input.id ? leads.findIndex((l) => l.id === input.id) : -1;

  // 2. Duplicate prevention check: Check if same phone & service submitted within last 5 minutes
  if (existingIndex === -1) {
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    existingIndex = leads.findIndex(
      (l) =>
        l.phone.replace(/\D/g, '') === input.phone.replace(/\D/g, '') &&
        l.service.toLowerCase() === input.service.toLowerCase() &&
        l.timestamp >= fiveMinsAgo
    );
  }

  if (existingIndex !== -1) {
    // Update existing lead record to avoid duplicate
    const existing = leads[existingIndex];
    const updatedLead: LeadItem = {
      ...existing,
      name: input.name || existing.name,
      phone: input.phone || existing.phone,
      email: input.email || existing.email,
      service: input.service || existing.service,
      details: input.details ? `${existing.details} | Update: ${input.details}` : existing.details,
      address: input.address || existing.address,
      clientId: input.clientId || existing.clientId,
      businessName: input.businessName || existing.businessName,
      leadSource: input.leadSource || existing.leadSource,
      pageUrl: input.pageUrl || existing.pageUrl,
    };

    if (endpointUrl && endpointUrl.startsWith('http')) {
      const remoteRes = await syncLeadActionToRemote(endpointUrl, { action: 'createLead', ...updatedLead });
      if (!remoteRes.success) {
        return { success: false, message: remoteRes.message, lead: updatedLead };
      }
    }

    leads[existingIndex] = updatedLead;
    saveAllLeads(leads);

    return { success: true, message: 'Existing lead record updated.', lead: updatedLead };
  }

  // 3. Create new Lead
  const newLeadId = input.id || generateLeadId(leads.length);
  const nowIso = new Date().toISOString();

  const newLead: LeadItem = {
    id: newLeadId,
    timestamp: input.timestamp || nowIso,
    clientId: input.clientId || 'client-default-01',
    businessName: input.businessName || 'Local Business',
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email ? input.email.trim() : undefined,
    service: input.service.trim(),
    details: input.details || 'No additional details provided.',
    address: input.address || '',
    leadSource: input.leadSource || 'Google Search',
    pageUrl: input.pageUrl || '',
    status: (input.status as LeadStatus) || 'New',
    notes: input.notes || [],
    followUpDate: input.followUpDate,
    lastContacted: input.lastContacted,
    lastContactMethod: input.lastContactMethod,
    contactCount: input.contactCount || 0,
    contactLogs: input.contactLogs || [],
  };

  if (endpointUrl && endpointUrl.startsWith('http')) {
    const remoteRes = await syncLeadActionToRemote(endpointUrl, { action: 'createLead', ...newLead });
    if (!remoteRes.success) {
      return { success: false, message: remoteRes.message, lead: newLead };
    }
  }

  leads.unshift(newLead); // newest leads first
  saveAllLeads(leads);

  return { success: true, message: 'Lead created successfully.', lead: newLead };
}

/**
 * Update lead status
 */
export async function updateLeadStatus(
  leadId: string,
  status: LeadStatus,
  endpointUrl?: string
): Promise<{ success: boolean; message: string; lead: LeadItem | null }> {
  const leads = getStoredLeads();
  const idx = leads.findIndex((l) => l.id === leadId);
  if (idx === -1) return { success: false, message: `Lead ID ${leadId} not found`, lead: null };

  const targetLead = leads[idx];

  if (endpointUrl && endpointUrl.startsWith('http')) {
    const remoteRes = await syncLeadActionToRemote(endpointUrl, {
      action: 'updateStatus',
      leadId: targetLead.id,
      clientId: targetLead.clientId,
      status,
    });

    if (!remoteRes.success) {
      return { success: false, message: remoteRes.message, lead: targetLead };
    }
  }

  leads[idx].status = status;
  const autoNote: LeadNote = {
    id: `note-${Date.now()}`,
    text: `Status updated to "${status}"`,
    createdAt: new Date().toISOString(),
    author: 'System',
  };
  leads[idx].notes = [autoNote, ...(leads[idx].notes || [])];

  saveAllLeads(leads);

  return { success: true, message: `Status updated to ${status}`, lead: leads[idx] };
}

/**
 * Add a note to a lead
 */
export async function addLeadNote(
  leadId: string,
  text: string,
  author = 'Agent',
  endpointUrl?: string
): Promise<{ success: boolean; message: string; lead: LeadItem | null }> {
  const leads = getStoredLeads();
  const idx = leads.findIndex((l) => l.id === leadId);
  if (idx === -1) return { success: false, message: `Lead ID ${leadId} not found`, lead: null };

  const targetLead = leads[idx];

  if (endpointUrl && endpointUrl.startsWith('http')) {
    const remoteRes = await syncLeadActionToRemote(endpointUrl, {
      action: 'addNote',
      leadId: targetLead.id,
      clientId: targetLead.clientId,
      text: text.trim(),
      author,
    });

    if (!remoteRes.success) {
      return { success: false, message: remoteRes.message, lead: targetLead };
    }
  }

  const newNote: LeadNote = {
    id: `note-${Date.now()}`,
    text: text.trim(),
    createdAt: new Date().toISOString(),
    author,
  };

  leads[idx].notes = [newNote, ...(leads[idx].notes || [])];
  saveAllLeads(leads);

  return { success: true, message: 'Note added successfully', lead: leads[idx] };
}

/**
 * Schedule a follow-up date for a lead
 */
export async function scheduleLeadFollowUp(
  leadId: string,
  followUpDate: string,
  endpointUrl?: string
): Promise<{ success: boolean; message: string; lead: LeadItem | null }> {
  const leads = getStoredLeads();
  const idx = leads.findIndex((l) => l.id === leadId);
  if (idx === -1) return { success: false, message: `Lead ID ${leadId} not found`, lead: null };

  const targetLead = leads[idx];

  if (endpointUrl && endpointUrl.startsWith('http')) {
    const remoteRes = await syncLeadActionToRemote(endpointUrl, {
      action: 'scheduleFollowUp',
      leadId: targetLead.id,
      clientId: targetLead.clientId,
      followUpDate,
      status: 'Follow-up',
    });

    if (!remoteRes.success) {
      return { success: false, message: remoteRes.message, lead: targetLead };
    }
  }

  leads[idx].followUpDate = followUpDate;
  if (leads[idx].status === 'New') {
    leads[idx].status = 'Follow-up';
  }

  const autoNote: LeadNote = {
    id: `note-${Date.now()}`,
    text: followUpDate ? `Follow-up scheduled for ${new Date(followUpDate).toLocaleString()}` : 'Follow-up date cleared',
    createdAt: new Date().toISOString(),
    author: 'System',
  };
  leads[idx].notes = [autoNote, ...(leads[idx].notes || [])];

  saveAllLeads(leads);

  return { success: true, message: 'Follow-up scheduled successfully', lead: leads[idx] };
}

/**
 * Log a contact attempt (Call, WhatsApp, SMS, Email)
 */
export async function logLeadContact(
  leadId: string,
  method: ContactMethod,
  customNote?: string,
  endpointUrl?: string
): Promise<{ success: boolean; message: string; lead: LeadItem | null }> {
  const leads = getStoredLeads();
  const idx = leads.findIndex((l) => l.id === leadId);
  if (idx === -1) return { success: false, message: `Lead ID ${leadId} not found`, lead: null };

  const targetLead = leads[idx];

  if (endpointUrl && endpointUrl.startsWith('http')) {
    const remoteRes = await syncLeadActionToRemote(endpointUrl, {
      action: 'logContact',
      leadId: targetLead.id,
      clientId: targetLead.clientId,
      method,
      customNote,
    });

    if (!remoteRes.success) {
      return { success: false, message: remoteRes.message, lead: targetLead };
    }
  }

  const nowIso = new Date().toISOString();
  leads[idx].lastContacted = nowIso;
  leads[idx].lastContactMethod = method;
  leads[idx].contactCount = (leads[idx].contactCount || 0) + 1;

  if (leads[idx].status === 'New') {
    leads[idx].status = 'Contacted';
  }

  const logEntry: LeadContactLog = {
    id: `log-${Date.now()}`,
    method,
    timestamp: nowIso,
    notes: customNote || `Outbound ${method} initiated`,
  };

  leads[idx].contactLogs = [logEntry, ...(leads[idx].contactLogs || [])];

  const autoNote: LeadNote = {
    id: `note-${Date.now()}`,
    text: `Initiated outbound ${method} contact.${customNote ? ` Note: ${customNote}` : ''}`,
    createdAt: nowIso,
    author: 'System',
  };
  leads[idx].notes = [autoNote, ...(leads[idx].notes || [])];

  saveAllLeads(leads);

  return { success: true, message: `Logged ${method} contact`, lead: leads[idx] };
}
