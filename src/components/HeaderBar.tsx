import React from 'react';
import { ClientConfig } from '../types';
import { Wrench, SlidersHorizontal, Code2, Sparkles, Building2, Eye, ShieldAlert } from 'lucide-react';

interface HeaderBarProps {
  currentConfig: ClientConfig;
  activePresetKey: string;
  clientConfigs?: Record<string, ClientConfig>;
  onSelectPreset: (presetKey: string) => void;
  onOpenEditor: () => void;
  viewMode: 'preview' | 'leadpilot' | 'exporter';
  setViewMode: (mode: 'preview' | 'leadpilot' | 'exporter') => void;
  appMode: 'development' | 'client';
  setAppMode: (mode: 'development' | 'client') => void;
  isClientDeployment?: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentConfig,
  activePresetKey,
  clientConfigs,
  onSelectPreset,
  onOpenEditor,
  viewMode,
  setViewMode,
  appMode,
  setAppMode,
  isClientDeployment = false,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Branding & Info */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg flex items-center justify-center text-white shadow-md">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            {appMode === 'development' ? (
              <>
                <h1 className="text-sm font-extrabold leading-tight text-white flex items-center gap-2">
                  Local Trade Master Template Generator
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                    Dev Mode
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Active Client: <strong className="text-blue-400">{currentConfig.businessName}</strong> ({currentConfig.clientId || 'client-01'})
                </p>
              </>
            ) : (
              <>
                <h1 className="text-base font-black leading-tight text-white flex items-center gap-2">
                  {currentConfig.businessName}
                  <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-500/30">
                    Client Workspace
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Lead Management Portal • {currentConfig.serviceArea || currentConfig.cityStateZip}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Center: Preset Dropdown (Development Mode Only) */}
        {appMode === 'development' && (
          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-lg border border-slate-700">
            <Sparkles className="w-4 h-4 text-amber-400 ml-1 hidden sm:inline" />
            <span className="text-xs font-semibold text-slate-300 hidden md:inline">Industry Preset:</span>
            <select
              value={activePresetKey}
              onChange={(e) => onSelectPreset(e.target.value)}
              className="bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded border border-slate-600 focus:outline-none focus:border-blue-500 cursor-pointer max-w-[260px] md:max-w-none truncate"
            >
              <optgroup label="🏆 Active Client Configurations">
                {clientConfigs && (Object.entries(clientConfigs) as [string, ClientConfig][]).map(([key, cfg]) => (
                  <option key={key} value={key}>
                    🏢 {cfg.businessName} ({cfg.industry || key}) [{cfg.clientId}]
                  </option>
                ))}
              </optgroup>
              <optgroup label="🛠️ Industry Preset Templates (Start New Client)">
                <option value="hvac">❄️ HVAC - Heating & Cooling</option>
                <option value="plumbing">🚰 Plumbing & Drain Service</option>
                <option value="roofing">🏠 Roofing & Construction</option>
                <option value="electricians">⚡ Electrical Services</option>
                <option value="garage-door">🚪 Garage Door Service</option>
                <option value="locksmith">🔑 Locksmith & Security</option>
                <option value="pest-control">🐜 Pest Control</option>
                <option value="landscaping">🌿 Landscaping & Lawn Care</option>
                <option value="cleaning">🧹 Cleaning Services</option>
                <option value="painting">🎨 Painting Services</option>
                <option value="handyman">🛠️ Handyman & Home Repair</option>
              </optgroup>
            </select>
          </div>
        )}

        {/* Right: Navigation Controls & Mode Switcher */}
        <div className="flex items-center gap-2">
          {appMode === 'development' && (
            <button
              onClick={onOpenEditor}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-700 transition"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-400" />
              Edit CONFIG
            </button>
          )}

          <div className="bg-slate-800 p-1 rounded-lg border border-slate-700 flex items-center gap-1">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                viewMode === 'preview'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Live Website
            </button>
            <button
              onClick={() => setViewMode('leadpilot')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold rounded-md transition ${
                viewMode === 'leadpilot'
                  ? 'bg-emerald-600 text-white shadow ring-2 ring-emerald-500/30'
                  : 'text-emerald-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              LeadPilot CRM
            </button>
            {appMode === 'development' && (
              <button
                onClick={() => setViewMode('exporter')}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-md transition ${
                  viewMode === 'exporter'
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                Export & Code
              </button>
            )}
          </div>

          {/* Mode Switcher Toggle Button (Master Deployment Only) */}
          {!isClientDeployment && (
            appMode === 'development' ? (
              <button
                onClick={() => setAppMode('client')}
                className="flex items-center gap-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/50 px-3 py-1.5 rounded-lg text-xs font-extrabold transition shadow hover:scale-105"
                title="Switch to Client Mode (Hides developer controls & presets)"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>Client Mode</span>
              </button>
            ) : (
              <button
                onClick={() => setAppMode('development')}
                className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-700 transition"
                title="Switch back to Developer Mode"
              >
                <Wrench className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Dev Mode</span>
              </button>
            )
          )}
        </div>

      </div>
    </header>
  );
};
