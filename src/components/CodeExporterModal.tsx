import React, { useState } from 'react';
import { ClientConfig } from '../types';
import {
  generateConfigJs,
  generateClientJson,
  generateIndexHtml,
  generateStylesCss,
  generateAppJs,
  generateGoogleAppsScript,
  generateReadmeMd,
} from '../utils/codeGenerator';
import { Copy, Check, Download, FileCode, FileText, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface CodeExporterModalProps {
  config: ClientConfig;
  onClose: () => void;
}

const isValidUrl = (urlStr?: string): boolean => {
  if (!urlStr || typeof urlStr !== 'string') return false;
  const trimmed = urlStr.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const CodeExporterModal: React.FC<CodeExporterModalProps> = ({ config, onClose }) => {
  const [activeTab, setActiveTab] = useState<'configJs' | 'clientJson' | 'indexHtml' | 'stylesCss' | 'appJs' | 'codeGs' | 'readmeMd'>('configJs');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const isClientIdValid = Boolean(config.clientId && config.clientId.trim().length > 0);
  const isBusinessNameValid = Boolean(config.businessName && config.businessName.trim().length > 0);
  const isPhoneValid = Boolean((config.phone || config.businessPhone) && String(config.phone || config.businessPhone).trim().length > 0);
  const isFormEndpointValid = isValidUrl(config.formEndpoint);

  const isProductionReady = isClientIdValid && isBusinessNameValid && isPhoneValid && isFormEndpointValid;

  const files = {
    configJs: { name: 'config.js', content: generateConfigJs(config), lang: 'javascript' },
    clientJson: { name: 'client.json', content: generateClientJson(config), lang: 'json' },
    codeGs: { name: 'Code.gs (Google Apps Script)', content: generateGoogleAppsScript(config), lang: 'javascript' },
    indexHtml: { name: 'index.html', content: generateIndexHtml(config), lang: 'html' },
    stylesCss: { name: 'styles.css', content: generateStylesCss(config), lang: 'css' },
    appJs: { name: 'app.js', content: generateAppJs(config), lang: 'javascript' },
    readmeMd: { name: 'README.md', content: generateReadmeMd(config), lang: 'markdown' },
  };

  const currentFile = files[activeTab];

  const handleCopy = (key: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedTab(key);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    Object.values(files).forEach((file) => {
      handleDownloadFile(file.name, file.content);
    });
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen p-4 md:p-8 flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <FileCode className="w-6 h-6 text-emerald-400" />
              Master Code & Asset Exporter
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Production-ready pure HTML, CSS, & JS bundle generated for <strong className="text-blue-400">{config.businessName || 'Client'}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadAll}
              className={`flex items-center gap-2 text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-lg ${
                isProductionReady
                  ? 'bg-emerald-600 hover:bg-emerald-500'
                  : 'bg-amber-600/80 hover:bg-amber-500/90'
              }`}
            >
              <Download className="w-4 h-4" />
              {isProductionReady ? 'Download All Files' : 'Export Draft Files (Incomplete)'}
            </button>
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2 rounded-lg border border-slate-700 transition"
            >
              Back to Live Website
            </button>
          </div>
        </div>

        {/* Deployment Readiness Banner */}
        {!isFormEndpointValid ? (
          <div className="bg-amber-950/60 border-b border-amber-800/60 px-6 py-3 text-xs text-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-amber-300">
                  ⚠️ Production Export Warning: Google Apps Script Web App URL (formEndpoint) Required
                </div>
                <p className="text-amber-200/90 leading-relaxed">
                  Deploy the client's Google Apps Script Web App first, then paste the Web App URL in <strong>Edit CONFIG &gt; Lead System</strong>.
                  Without a valid <code className="bg-amber-900/60 px-1 py-0.5 rounded text-amber-100">formEndpoint</code>, landing page enquiry submissions will not be sent to Google Sheets or LeadPilot CRM.
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-2 bg-amber-900/40 px-3 py-1.5 rounded-lg border border-amber-700/50 text-[11px] font-mono">
              <XCircle className="w-4 h-4 text-amber-400" />
              <span>formEndpoint: missing/invalid</span>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-950/40 border-b border-emerald-800/40 px-6 py-3 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>5-Minute Client Replication:</strong> <code className="bg-emerald-900/60 px-1.5 py-0.5 rounded text-emerald-200">formEndpoint</code> verified! To deploy a new client website, copy <code className="bg-emerald-900/60 px-1.5 py-0.5 rounded text-emerald-200">config.js</code> or <code className="bg-emerald-900/60 px-1.5 py-0.5 rounded text-emerald-200">client.json</code> and edit the business details!
            </span>
          </div>
        )}

        {/* File Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-4 overflow-x-auto text-xs font-bold">
          {Object.entries(files).map(([key, file]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`px-4 py-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
                activeTab === key
                  ? 'border-emerald-500 text-emerald-400 bg-slate-950'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              {file.name}
            </button>
          ))}
        </div>

        {/* Code Content Container */}
        <div className="flex-1 p-4 relative flex flex-col min-h-[450px]">
          <div className="absolute top-6 right-6 z-10 flex items-center gap-2">
            <button
              onClick={() => handleCopy(activeTab, currentFile.content)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-md border border-slate-700 transition shadow"
            >
              {copiedTab === activeTab ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              {copiedTab === activeTab ? 'Copied!' : `Copy ${currentFile.name}`}
            </button>
            <button
              onClick={() => handleDownloadFile(currentFile.name, currentFile.content)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-md border border-slate-700 transition shadow"
            >
              <Download className="w-4 h-4 text-slate-400" />
              Save File
            </button>
          </div>

          <pre className="flex-1 bg-slate-950 p-6 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 overflow-auto leading-relaxed selection:bg-emerald-900 selection:text-emerald-100">
            <code>{currentFile.content}</code>
          </pre>
        </div>

      </div>
    </div>
  );
};
