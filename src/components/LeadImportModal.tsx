import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { ClientConfig, LeadItem, LeadStatus, LeadNote } from '../types';
import { saveAllLeads, getStoredLeads, generateLeadId, syncLeadActionToRemote, saveLead } from '../utils/leadStorage';
import {
  SUPPORTED_COUNTRY_CODES,
  detectDefaultCountryCode,
  normalizeImportedPhone,
  formatDisplayPhone,
} from '../utils/phoneUtils';
import {
  Upload,
  FileSpreadsheet,
  Check,
  X,
  AlertTriangle,
  Download,
  ChevronRight,
  CheckCircle2,
  HelpCircle,
  FileText,
  User,
  ArrowRight,
  Filter,
  Globe,
} from 'lucide-react';

interface LeadImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: ClientConfig;
  onImportSuccess: (importedCount: number, message: string) => void;
}

// Standard LeadPilot fields available for mapping
export type MappedFieldName =
  | 'none'
  | 'name'
  | 'phone'
  | 'email'
  | 'service'
  | 'address'
  | 'status'
  | 'followUpDate'
  | 'notes'
  | 'leadSource'
  | 'timestamp';

export interface FieldOption {
  key: MappedFieldName;
  label: string;
  recommended?: boolean;
}

const LEAD_FIELD_OPTIONS: FieldOption[] = [
  { key: 'none', label: 'Do not import this column' },
  { key: 'name', label: 'Lead Name', recommended: true },
  { key: 'phone', label: 'Phone Number', recommended: true },
  { key: 'email', label: 'Email Address' },
  { key: 'service', label: 'Service Needed' },
  { key: 'address', label: 'Address / Location' },
  { key: 'status', label: 'Status' },
  { key: 'followUpDate', label: 'Follow-up Date' },
  { key: 'notes', label: 'Notes / Remarks' },
  { key: 'leadSource', label: 'Lead Source' },
  { key: 'timestamp', label: 'Lead Date / Created At' },
];

// Helper to auto-detect mappings based on column header text
function detectFieldMapping(header: string): MappedFieldName {
  if (!header) return 'none';
  const clean = header.trim().toLowerCase();

  if (['name', 'full name', 'customer name', 'lead name', 'client name', 'contact name', 'person'].some((m) => clean === m || clean.includes('name'))) {
    return 'name';
  }
  if (['phone', 'mobile', 'mobile number', 'phone number', 'contact', 'cell', 'telephone', 'ph'].some((m) => clean === m || clean.includes('phone') || clean.includes('mobile'))) {
    return 'phone';
  }
  if (['email', 'email address', 'email id', 'e-mail', 'mail'].some((m) => clean === m || clean.includes('email'))) {
    return 'email';
  }
  if (['service', 'service needed', 'requirement', 'service requested', 'job', 'category', 'work'].some((m) => clean === m || clean.includes('service') || clean.includes('requirement'))) {
    return 'service';
  }
  if (['address', 'location', 'city', 'street', 'area', 'address / location', 'place'].some((m) => clean === m || clean.includes('address') || clean.includes('location'))) {
    return 'address';
  }
  if (['status', 'lead status', 'stage', 'pipeline status'].some((m) => clean === m || clean.includes('status'))) {
    return 'status';
  }
  if (['follow-up date', 'followup date', 'follow up', 'next follow up', 'followup', 'callback date', 'reminder'].some((m) => clean === m || clean.includes('follow'))) {
    return 'followUpDate';
  }
  if (['notes', 'remarks', 'comments', 'details', 'description', 'message', 'note'].some((m) => clean === m || clean.includes('note') || clean.includes('remark') || clean.includes('comment'))) {
    return 'notes';
  }
  if (['source', 'lead source', 'channel', 'campaign', 'medium'].some((m) => clean === m || clean.includes('source'))) {
    return 'leadSource';
  }
  if (['created date', 'date', 'timestamp', 'created at', 'lead date'].some((m) => clean === m || clean.includes('date') || clean.includes('time'))) {
    return 'timestamp';
  }

  return 'none';
}

// Phone normalization helper
export function normalizePhone(phone: any): string {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length > 10 && (digits.startsWith('1') || digits.startsWith('0'))) {
    return digits.slice(-10);
  }
  if (digits.length > 10 && digits.startsWith('91')) {
    return digits.slice(-10);
  }
  return digits;
}

// Status normalization helper
export function normalizeStatus(rawStatus: any): LeadStatus {
  if (!rawStatus) return 'New';
  const clean = String(rawStatus).trim().toLowerCase();
  if (clean.includes('new') || clean.includes('lead') || clean.includes('fresh')) return 'New';
  if (clean.includes('contact') || clean.includes('call') || clean.includes('talked')) return 'Contacted';
  if (clean.includes('follow') || clean.includes('pending') || clean.includes('sched')) return 'Follow-up';
  if (clean.includes('qualif') || clean.includes('prospect') || clean.includes('interested')) return 'Qualified';
  if (clean.includes('won') || clean.includes('close') || clean.includes('converted') || clean.includes('sale')) return 'Won';
  if (clean.includes('lost') || clean.includes('cancel') || clean.includes('reject') || clean.includes('dead')) return 'Lost';
  return 'New';
}

// Date parsing helper
export function parseImportDate(val: any): string | undefined {
  if (!val) return undefined;
  if (val instanceof Date) {
    if (!isNaN(val.getTime())) return val.toISOString();
  }
  if (typeof val === 'number') {
    try {
      const parsed = XLSX.SSF.parse_date_code(val);
      if (parsed) {
        const d = new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d, parsed.H || 0, parsed.M || 0, parsed.S || 0));
        if (!isNaN(d.getTime())) return d.toISOString();
      }
    } catch {
      // ignore
    }
  }
  const str = String(val).trim();
  if (!str) return undefined;
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d.toISOString();
  return undefined;
}

export interface ParsedRowData {
  rowIndex: number;
  rawObj: Record<string, any>;
  name: string;
  phone: string;
  email: string;
  service: string;
  address: string;
  status: LeadStatus;
  followUpDate?: string;
  notes: string;
  leadSource: string;
  timestamp?: string;
  validationStatus: 'valid' | 'warning' | 'error';
  validationMessage: string;
  isDuplicate: boolean;
  duplicateReason?: string;
}

export const LeadImportModal: React.FC<LeadImportModalProps> = ({
  isOpen,
  onClose,
  currentConfig,
  onImportSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Upload, 2: Mapping, 3: Preview & Duplicate Handling, 4: Complete
  const [fileName, setFileName] = useState<string>('');
  const [rawHeaders, setRawHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<Record<string, any>[]>([]);
  const [columnMappings, setColumnMappings] = useState<Record<string, MappedFieldName>>({});
  const [skipDuplicates, setSkipDuplicates] = useState<boolean>(true);
  const [fileError, setFileError] = useState<string>('');

  const [parsedRows, setParsedRows] = useState<ParsedRowData[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [importResultSummary, setImportResultSummary] = useState<{
    importedCount: number;
    skippedDuplicatesCount: number;
    errorCount: number;
  } | null>(null);

  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(() => detectDefaultCountryCode(currentConfig));

  useEffect(() => {
    if (isOpen) {
      setSelectedCountryCode(detectDefaultCountryCode(currentConfig));
    }
  }, [isOpen, currentConfig]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Reset modal state
  const handleReset = () => {
    setStep(1);
    setFileName('');
    setRawHeaders([]);
    setRawRows([]);
    setColumnMappings({});
    setSkipDuplicates(true);
    setFileError('');
    setParsedRows([]);
    setIsProcessing(false);
    setSelectedCountryCode(detectDefaultCountryCode(currentConfig));
    setImportResultSummary(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  // Download CSV template
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'Full Name': 'John Doe',
        'Phone Number': '+91 98765 43210',
        'Email Address': 'john@example.com',
        'Service Needed': 'AC Repair & Water Jet Service',
        'Address / Location': 'Kochi, Kerala',
        'Status': 'New',
        'Follow-up Date': '2026-08-20',
        'Notes': 'Customer requested morning appointment',
        'Lead Source': 'Website Form',
      },
      {
        'Full Name': 'Priya Sharma',
        'Phone Number': '+91 91234 56789',
        'Email Address': 'priya.s@example.com',
        'Service Needed': 'Inverter AC Installation',
        'Address / Location': 'Ernakulam, Kerala',
        'Status': 'Follow-up',
        'Follow-up Date': '2026-08-15',
        'Notes': 'Send quote details on WhatsApp',
        'Lead Source': 'Google Search',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'LeadPilot_Import_Template');
    XLSX.writeFile(workbook, 'LeadPilot_Import_Template.csv');
  };

  // Process File Reading
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError('');
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'csv' && ext !== 'xlsx') {
      setFileError('Unsupported file type. Please upload a .csv or .xlsx file.');
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });

        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          setFileError('The uploaded workbook contains no sheets.');
          setIsProcessing(false);
          return;
        }

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Parse to JSON rows
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!jsonData || jsonData.length === 0) {
          setFileError('The uploaded file is empty or contains no data rows.');
          setIsProcessing(false);
          return;
        }

        // Extract headers
        const headers = Object.keys(jsonData[0]);
        if (headers.length === 0) {
          setFileError('No header column names found in the uploaded file.');
          setIsProcessing(false);
          return;
        }

        setRawHeaders(headers);
        setRawRows(jsonData);

        // Auto-detect mappings
        const initialMappings: Record<string, MappedFieldName> = {};
        headers.forEach((h) => {
          initialMappings[h] = detectFieldMapping(h);
        });

        setColumnMappings(initialMappings);
        setStep(2); // Move to Column Mapping screen
      } catch (err: any) {
        console.error('Error parsing file:', err);
        setFileError(`Failed to parse file: ${err?.message || 'Invalid CSV/Excel structure'}`);
      } finally {
        setIsProcessing(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Change mapping for a header
  const handleMappingChange = (header: string, field: MappedFieldName) => {
    setColumnMappings((prev) => ({
      ...prev,
      [header]: field,
    }));
  };

  // Process Rows for Preview & Duplicate Detection (Transition Step 2 -> 3)
  const handleProceedToPreview = () => {
    setIsProcessing(true);

    // Get current stored leads for client-isolated duplicate check
    const existingLeads = getStoredLeads(currentConfig.clientId);

    const existingPhones = new Set(existingLeads.map((l) => normalizePhone(l.phone)).filter(Boolean));
    const existingEmails = new Set(existingLeads.map((l) => (l.email || '').trim().toLowerCase()).filter(Boolean));

    // Keep track of within-file duplicates
    const filePhonesSeen = new Set<string>();
    const fileEmailsSeen = new Set<string>();

    // Map raw fields to field keys
    const fieldToHeaderMap: Record<MappedFieldName, string | null> = {
      none: null,
      name: null,
      phone: null,
      email: null,
      service: null,
      address: null,
      status: null,
      followUpDate: null,
      notes: null,
      leadSource: null,
      timestamp: null,
    };

    Object.entries(columnMappings).forEach(([hdr, fld]) => {
      if (fld !== 'none') {
        fieldToHeaderMap[fld as MappedFieldName] = hdr;
      }
    });

    const parsed: ParsedRowData[] = rawRows.map((row, idx) => {
      const getVal = (fld: MappedFieldName) => {
        const hdr = fieldToHeaderMap[fld];
        if (!hdr || row[hdr] === undefined || row[hdr] === null) return '';
        return String(row[hdr]).trim();
      };

      const name = getVal('name');
      const phone = getVal('phone');
      const email = getVal('email');
      const service = getVal('service') || 'General Inquiry';
      const address = getVal('address');
      const rawStatus = getVal('status');
      const status = normalizeStatus(rawStatus);
      const rawFollowUp = getVal('followUpDate');
      const followUpDate = parseImportDate(rawFollowUp);
      const notes = getVal('notes');
      const leadSource = getVal('leadSource') || 'CSV Import';
      const rawTimestamp = getVal('timestamp');
      const timestamp = parseImportDate(rawTimestamp);

      // Validation check
      let validationStatus: 'valid' | 'warning' | 'error' = 'valid';
      let validationMessage = '✓ Valid lead';

      if (!name && !phone) {
        validationStatus = 'error';
        validationMessage = '✕ Missing Name and Phone';
      } else if (!name) {
        validationStatus = 'warning';
        validationMessage = '⚠ Missing Name';
      } else if (!phone) {
        validationStatus = 'warning';
        validationMessage = '⚠ Missing Phone';
      } else if (phone && phone.replace(/\D/g, '').length < 7) {
        validationStatus = 'warning';
        validationMessage = '⚠ Short Phone Number';
      }

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (validationStatus !== 'error') {
          validationStatus = 'warning';
          validationMessage = '⚠ Malformed Email';
        }
      }

      // Duplicate Check
      let isDuplicate = false;
      let duplicateReason = '';

      const normP = normalizePhone(phone);
      const cleanE = email.trim().toLowerCase();

      if (normP && existingPhones.has(normP)) {
        isDuplicate = true;
        duplicateReason = `Phone ${phone} matches existing CRM lead`;
      } else if (cleanE && existingEmails.has(cleanE)) {
        isDuplicate = true;
        duplicateReason = `Email ${email} matches existing CRM lead`;
      } else if (normP && filePhonesSeen.has(normP)) {
        isDuplicate = true;
        duplicateReason = `Duplicate phone ${phone} within file`;
      } else if (cleanE && fileEmailsSeen.has(cleanE)) {
        isDuplicate = true;
        duplicateReason = `Duplicate email ${email} within file`;
      }

      if (normP) filePhonesSeen.add(normP);
      if (cleanE) fileEmailsSeen.add(cleanE);

      return {
        rowIndex: idx + 1,
        rawObj: row,
        name,
        phone,
        email,
        service,
        address,
        status,
        followUpDate,
        notes,
        leadSource,
        timestamp,
        validationStatus,
        validationMessage,
        isDuplicate,
        duplicateReason,
      };
    });

    setParsedRows(parsed);
    setIsProcessing(false);
    setStep(3);
  };

  // Final Confirmation & Execute Import (Transition Step 3 -> 4)
  const handleExecuteImport = async () => {
    setIsProcessing(true);

    const existingLeads = getStoredLeads();
    const endpoint = currentConfig.formEndpoint ? currentConfig.formEndpoint.trim() : '';

    // Filter rows
    const rowsToImport = parsedRows.filter((r) => {
      if (r.validationStatus === 'error') return false; // skip fatal errors
      if (skipDuplicates && r.isDuplicate) return false; // skip duplicates if toggled
      return true;
    });

    const skippedDuplicatesCount = parsedRows.filter((r) => r.isDuplicate && skipDuplicates).length;
    const errorCount = parsedRows.filter((r) => r.validationStatus === 'error').length;

    const nowIso = new Date().toISOString();
    const newLeadItems: LeadItem[] = [];

    for (let i = 0; i < rowsToImport.length; i++) {
      const row = rowsToImport[i];
      const newLeadId = generateLeadId(existingLeads.length + newLeadItems.length);

      const notesArr: LeadNote[] = [];
      if (row.notes) {
        notesArr.push({
          id: `note-${Date.now()}-${i}`,
          text: `Import Note: ${row.notes}`,
          createdAt: nowIso,
          author: 'CSV Import',
        });
      }

      const normalizedPhone = normalizeImportedPhone(row.phone, selectedCountryCode);

      const newLead: LeadItem = {
        id: newLeadId,
        timestamp: row.timestamp || nowIso,
        clientId: currentConfig.clientId || 'client-01',
        businessName: currentConfig.businessName || 'Local Business',
        name: row.name || 'Unnamed Contact',
        phone: normalizedPhone || row.phone || '0000000000',
        email: row.email || undefined,
        service: row.service || 'General Inquiry',
        details: row.notes || 'Imported via CSV/Excel file.',
        address: row.address || '',
        leadSource: row.leadSource || 'CSV Import',
        status: row.status || 'New',
        notes: notesArr,
        followUpDate: row.followUpDate,
        contactCount: 0,
        contactLogs: [],
      };

      newLeadItems.push(newLead);
    }

    // Combine and save to scoped tenant cache
    const targetTenant = currentConfig.clientId || 'client-01';
    const updatedAllLeads = [...newLeadItems, ...existingLeads];
    saveAllLeads(updatedAllLeads, targetTenant);

    // Persist imported leads to Firestore subcollection /tenants/{tenantId}/leads
    for (const lead of newLeadItems) {
      try {
        await saveLead(lead);
      } catch (err) {
        console.warn('Failed to persist imported lead to Firestore:', err);
      }
    }

    // Sync each new lead to remote Google Sheet if endpoint configured
    if (endpoint && endpoint.startsWith('http')) {
      for (const lead of newLeadItems) {
        try {
          await syncLeadActionToRemote(endpoint, { action: 'createLead', ...lead });
        } catch (err) {
          console.warn('Failed to sync imported lead to Google Apps Script:', err);
        }
      }
    }

    const summary = {
      importedCount: newLeadItems.length,
      skippedDuplicatesCount,
      errorCount,
    };

    setImportResultSummary(summary);
    setIsProcessing(false);
    setStep(4);

    let toastMsg = `${newLeadItems.length} leads imported successfully.`;
    if (skippedDuplicatesCount > 0 || errorCount > 0) {
      toastMsg = `${newLeadItems.length} leads imported. ${skippedDuplicatesCount} duplicates skipped. ${errorCount} rows had errors.`;
    }

    onImportSuccess(newLeadItems.length, toastMsg);
  };

  // Stats calculation for Preview Screen
  const totalRowsCount = parsedRows.length;
  const duplicateRowsCount = parsedRows.filter((r) => r.isDuplicate).length;
  const invalidRowsCount = parsedRows.filter((r) => r.validationStatus === 'error').length;
  const validRowsCount = parsedRows.filter((r) => r.validationStatus !== 'error' && (!r.isDuplicate || !skipDuplicates)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/20 border border-emerald-500/30 p-2.5 rounded-xl text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                Import Leads from CSV / Excel
              </h2>
              <p className="text-xs text-slate-400">
                Target Client: <strong className="text-emerald-400">{currentConfig.businessName}</strong> ({currentConfig.clientId || 'client-01'})
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP PROGRESS BAR */}
        <div className="bg-slate-950 px-6 py-2.5 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-bold shrink-0">
          <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-emerald-400 font-extrabold' : step > 1 ? 'text-slate-300' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-emerald-600 text-white' : step > 1 ? 'bg-slate-800 text-emerald-400' : 'bg-slate-800'}`}>1</span>
            <span>Upload File</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-700" />
          <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-emerald-400 font-extrabold' : step > 2 ? 'text-slate-300' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-emerald-600 text-white' : step > 2 ? 'bg-slate-800 text-emerald-400' : 'bg-slate-800'}`}>2</span>
            <span>Column Mapping</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-700" />
          <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-emerald-400 font-extrabold' : step > 3 ? 'text-slate-300' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-emerald-600 text-white' : step > 3 ? 'bg-slate-800 text-emerald-400' : 'bg-slate-800'}`}>3</span>
            <span>Preview & Duplicates</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-700" />
          <div className={`flex items-center gap-1.5 ${step === 4 ? 'text-emerald-400 font-extrabold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 4 ? 'bg-emerald-600 text-white' : 'bg-slate-800'}`}>4</span>
            <span>Complete</span>
          </div>
        </div>

        {/* CONTENT BODY (SCROLLABLE) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">

          {/* STEP 1: FILE UPLOAD */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/80 transition rounded-2xl p-8 text-center bg-slate-950/50 space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">Select a CSV or Excel file to upload</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    Supported formats: <strong className="text-slate-200">.csv</strong> and <strong className="text-slate-200">.xlsx</strong>
                  </p>
                </div>

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="lead-file-input"
                  />
                  <label
                    htmlFor="lead-file-input"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer transition shadow-lg"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Choose File</span>
                  </label>
                </div>

                {fileName && (
                  <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 p-2 rounded-lg inline-block">
                    Selected: {fileName}
                  </div>
                )}
              </div>

              {fileError && (
                <div className="p-3.5 bg-red-950/50 border border-red-500/50 text-red-300 rounded-xl text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{fileError}</span>
                </div>
              )}

              {/* DOWNLOAD TEMPLATE BOX */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">Need a sample format?</div>
                    <div className="text-[11px] text-slate-400">Download our CSV import template with standard headers</div>
                  </div>
                </div>
                <button
                  onClick={handleDownloadTemplate}
                  className="bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Template</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: COLUMN MAPPING */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white">Map Source Columns to LeadPilot Fields</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    We auto-detected header matches. Review and adjust column mappings below.
                  </p>
                </div>
                <div className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg shrink-0">
                  {rawRows.length} total rows found
                </div>
              </div>

              {/* COUNTRY CODE SELECTOR FOR 10-DIGIT NUMBERS */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <span>Default Country Code for 10-digit Phone Numbers</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Applied to uploaded phone numbers without international prefix (e.g. 10-digit numbers)
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <select
                    value={selectedCountryCode}
                    onChange={(e) => setSelectedCountryCode(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-white font-bold text-xs rounded-lg p-2 outline-none focus:border-emerald-500"
                  >
                    {SUPPORTED_COUNTRY_CODES.map((opt) => (
                      <option key={opt.code} value={opt.code}>
                        {opt.flag} {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="text-xs text-emerald-400 font-mono">
                    Preview: 10-digit number <span className="text-white">8484888584</span> → <span className="font-bold underline">+{selectedCountryCode} 84848 88584</span> (for WhatsApp & CRM)
                  </div>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {rawHeaders.map((header) => {
                  const currentMapping = columnMappings[header] || 'none';
                  const sampleVal = rawRows[0]?.[header];

                  return (
                    <div
                      key={header}
                      className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 hover:border-slate-700 transition"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-extrabold text-white flex items-center gap-1.5 truncate">
                          <span>{header}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                          Sample: <span className="text-slate-300">{sampleVal !== undefined && sampleVal !== '' ? String(sampleVal) : '(empty)'}</span>
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-600 hidden md:block shrink-0" />

                      <div className="w-full md:w-64 shrink-0">
                        <select
                          value={currentMapping}
                          onChange={(e) => handleMappingChange(header, e.target.value as MappedFieldName)}
                          className={`w-full text-xs font-bold rounded-lg p-2 outline-none border transition ${
                            currentMapping !== 'none'
                              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                              : 'bg-slate-900 border-slate-700 text-slate-400'
                          }`}
                        >
                          {LEAD_FIELD_OPTIONS.map((opt) => (
                            <option key={opt.key} value={opt.key}>
                              {opt.label} {opt.recommended ? '★' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => setStep(1)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl transition"
                >
                  ← Back to Upload
                </button>
                <button
                  onClick={handleProceedToPreview}
                  disabled={isProcessing}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-lg"
                >
                  <span>Preview & Validate Leads</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PREVIEW, VALIDATION & DUPLICATE SETTINGS */}
          {step === 3 && (
            <div className="space-y-6">
              
              {/* SUMMARY STATS BAR */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Total File Rows</div>
                  <div className="text-xl font-black text-white mt-0.5">{totalRowsCount}</div>
                </div>
                <div className="bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-xl">
                  <div className="text-[10px] text-emerald-400 uppercase font-bold">Leads To Import</div>
                  <div className="text-xl font-black text-emerald-400 mt-0.5">{validRowsCount}</div>
                </div>
                <div className="bg-amber-950/40 border border-amber-800/60 p-3 rounded-xl">
                  <div className="text-[10px] text-amber-400 uppercase font-bold">Duplicates Found</div>
                  <div className="text-xl font-black text-amber-400 mt-0.5">{duplicateRowsCount}</div>
                </div>
                <div className="bg-red-950/40 border border-red-800/60 p-3 rounded-xl">
                  <div className="text-[10px] text-red-400 uppercase font-bold">Invalid Rows</div>
                  <div className="text-xl font-black text-red-400 mt-0.5">{invalidRowsCount}</div>
                </div>
              </div>

              {/* DUPLICATE HANDLING CONTROLS */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <Filter className="w-4 h-4 text-amber-400" />
                    <span>Duplicate Detection Strategy</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Primary check: <strong className="text-slate-300">Phone</strong> • Secondary check: <strong className="text-slate-300">Email</strong>
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="dupOption"
                      checked={skipDuplicates}
                      onChange={() => setSkipDuplicates(true)}
                      className="accent-emerald-500"
                    />
                    <span className="text-emerald-400">Skip Duplicates (Recommended)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="dupOption"
                      checked={!skipDuplicates}
                      onChange={() => setSkipDuplicates(false)}
                      className="accent-emerald-500"
                    />
                    <span className="text-slate-300">Import Duplicates Anyway</span>
                  </label>
                </div>
              </div>

              {/* PREVIEW TABLE (FIRST 20 ROWS) */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Import Preview (First {Math.min(20, parsedRows.length)} rows shown)</span>
                  <span className="text-[11px] text-slate-500">Validation & Duplicate Badges</span>
                </div>

                <div className="overflow-x-auto border border-slate-800 rounded-xl max-h-72">
                  <table className="w-full text-left text-xs text-slate-300 border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 text-[10px] uppercase font-extrabold">
                        <th className="py-2.5 px-3">Row</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Lead Name</th>
                        <th className="py-2.5 px-3">Phone</th>
                        <th className="py-2.5 px-3">Email</th>
                        <th className="py-2.5 px-3">Service</th>
                        <th className="py-2.5 px-3">Stage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {parsedRows.slice(0, 20).map((r) => (
                        <tr key={r.rowIndex} className="hover:bg-slate-800/40">
                          <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500">#{r.rowIndex}</td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            {r.isDuplicate ? (
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-flex items-center gap-1 ${
                                  skipDuplicates
                                    ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                                    : 'bg-blue-950/60 text-blue-300 border-blue-500/40'
                                }`}
                                title={r.duplicateReason}
                              >
                                <AlertTriangle className="w-3 h-3" />
                                {skipDuplicates ? 'Duplicate (Skipped)' : 'Duplicate (Importing)'}
                              </span>
                            ) : r.validationStatus === 'valid' ? (
                              <span className="bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded inline-flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-400" />
                                Valid
                              </span>
                            ) : r.validationStatus === 'warning' ? (
                              <span className="bg-amber-950/60 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded inline-flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-amber-400" />
                                {r.validationMessage}
                              </span>
                            ) : (
                              <span className="bg-red-950/60 text-red-300 border border-red-500/40 text-[10px] font-bold px-2 py-0.5 rounded inline-flex items-center gap-1">
                                <X className="w-3 h-3 text-red-400" />
                                {r.validationMessage}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <div className="font-mono text-white font-bold">
                              {formatDisplayPhone(r.phone, selectedCountryCode) || '(No Phone)'}
                            </div>
                            {r.phone && r.phone.replace(/\D/g, '').length === 10 && (
                              <div className="text-[9px] text-emerald-400 font-mono">
                                +{selectedCountryCode} WhatsApp ready
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-slate-400 truncate max-w-xs">{r.email || '-'}</td>
                          <td className="py-2.5 px-3 text-slate-300">{r.service}</td>
                          <td className="py-2.5 px-3 whitespace-nowrap font-bold text-emerald-400">{r.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => setStep(2)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl transition"
                >
                  ← Edit Mapping
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleClose}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExecuteImport}
                    disabled={isProcessing || validRowsCount === 0}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-lg"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isProcessing ? 'Importing...' : `Import ${validRowsCount} Valid Lead(s)`}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: COMPLETE */}
          {step === 4 && importResultSummary && (
            <div className="text-center py-8 space-y-6">
              <div className="bg-emerald-500/20 border border-emerald-500/40 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-black text-white">Import Successfully Completed!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Imported into <strong className="text-emerald-400">{currentConfig.businessName}</strong> ({currentConfig.clientId || 'client-01'})
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 max-w-md mx-auto space-y-3 text-left">
                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800">
                  <span className="text-slate-400 font-bold">Successfully Imported Leads:</span>
                  <span className="font-mono font-black text-emerald-400 text-sm">+{importResultSummary.importedCount}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800">
                  <span className="text-slate-400 font-bold">Duplicates Skipped:</span>
                  <span className="font-mono font-bold text-amber-400">{importResultSummary.skippedDuplicatesCount}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-slate-400 font-bold">Invalid Rows Skipped:</span>
                  <span className="font-mono font-bold text-red-400">{importResultSummary.errorCount}</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-8 py-3 rounded-xl transition shadow-lg inline-flex items-center gap-2"
              >
                <span>View Leads in CRM</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
