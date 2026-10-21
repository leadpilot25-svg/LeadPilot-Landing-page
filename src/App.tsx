import React, { useState, useEffect } from 'react';
import { INDUSTRY_PRESETS } from './presets/industryPresets';
import { CLIENT_PRESETS, DEMO_CLIENT_CONFIG, APEX_HVAC_CLIENT_CONFIG } from './presets/clientPresets';
import { ClientConfig } from './types';
import { HeaderBar } from './components/HeaderBar';
import { ConfigEditorDrawer } from './components/ConfigEditorDrawer';
import { LiveWebsitePreview } from './components/LiveWebsitePreview';
import { LeadPilotDashboard } from './components/LeadPilotDashboard';
import { CodeExporterModal } from './components/CodeExporterModal';
import { StandaloneLanding } from './components/StandaloneLanding';
import { StandaloneCrm } from './components/StandaloneCrm';
import {
  getAppTarget,
  AppTarget,
  IS_LANDING_DEPLOYMENT,
  IS_CRM_DEPLOYMENT,
  CLIENT_ID_ENV,
} from './config/appTarget';
import { ArrowLeft, Monitor, Smartphone, ShieldCheck, Sparkles } from 'lucide-react';

const INITIAL_CLIENT_CONFIGS: Record<string, ClientConfig> = {
  'client-apex-hvac': JSON.parse(JSON.stringify(APEX_HVAC_CLIENT_CONFIG)),
  'demo-hvac': JSON.parse(JSON.stringify(APEX_HVAC_CLIENT_CONFIG)),
  'demo-tarot': JSON.parse(JSON.stringify(DEMO_CLIENT_CONFIG)),
  'demo-plumbing': {
    ...JSON.parse(JSON.stringify(INDUSTRY_PRESETS['plumbing'])),
    clientId: 'client-prodrain-plumbing',
    businessName: 'ProDrain Plumbing Services',
    cityStateZip: 'Dallas, TX',
    serviceArea: 'Dallas & Fort Worth Metro',
    phone: '+1 (555) 389-1122',
    email: 'info@prodrainplumbing-demo.com',
  },
};

function getClientConfigForEnvClientId(envClientId: string): { key: string; config: ClientConfig } {
  if (!envClientId) {
    return { key: 'client-apex-hvac', config: JSON.parse(JSON.stringify(APEX_HVAC_CLIENT_CONFIG)) };
  }

  // 1. Direct match on key in CLIENT_PRESETS or INITIAL_CLIENT_CONFIGS
  if (CLIENT_PRESETS[envClientId]) {
    return { key: envClientId, config: JSON.parse(JSON.stringify(CLIENT_PRESETS[envClientId])) };
  }
  if (INITIAL_CLIENT_CONFIGS[envClientId]) {
    return { key: envClientId, config: JSON.parse(JSON.stringify(INITIAL_CLIENT_CONFIGS[envClientId])) };
  }

  // 2. Match on clientId property across all preset sources
  for (const [key, cfg] of Object.entries(CLIENT_PRESETS)) {
    if (cfg.clientId === envClientId) {
      return { key, config: JSON.parse(JSON.stringify(cfg)) };
    }
  }
  for (const [key, cfg] of Object.entries(INITIAL_CLIENT_CONFIGS)) {
    if (cfg.clientId === envClientId) {
      return { key, config: JSON.parse(JSON.stringify(cfg)) };
    }
  }
  for (const [key, cfg] of Object.entries(INDUSTRY_PRESETS)) {
    if (cfg.clientId === envClientId) {
      return { key: `client-${key}`, config: JSON.parse(JSON.stringify(cfg)) };
    }
  }

  // 3. Fallback: clone APEX_HVAC_CLIENT_CONFIG with requested envClientId
  const customConfig: ClientConfig = {
    ...JSON.parse(JSON.stringify(APEX_HVAC_CLIENT_CONFIG)),
    clientId: envClientId,
    businessName: envClientId.replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
  };
  return { key: envClientId, config: customConfig };
}

export default function App() {
  const [activeTarget, setActiveTarget] = useState<AppTarget>(() => getAppTarget());

  const [clientConfigs, setClientConfigs] = useState<Record<string, ClientConfig>>(() => {
    if (IS_LANDING_DEPLOYMENT || IS_CRM_DEPLOYMENT) {
      const resolved = getClientConfigForEnvClientId(CLIENT_ID_ENV);
      return { [resolved.key]: resolved.config };
    }
    try {
      const saved = localStorage.getItem('master_client_configs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback to initial configs
    }
    return INITIAL_CLIENT_CONFIGS;
  });

  const [activePresetKey, setActivePresetKey] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const clientParam = params.get('client') || params.get('clientId');
      if (clientParam) {
        if (clientParam.includes('tarot')) return 'demo-tarot';
        if (clientParam.includes('plumb')) return 'demo-plumbing';
        return 'client-apex-hvac';
      }
    }
    if (IS_LANDING_DEPLOYMENT || IS_CRM_DEPLOYMENT) {
      return getClientConfigForEnvClientId(CLIENT_ID_ENV).key;
    }
    return 'client-apex-hvac';
  });

  const [currentConfig, setCurrentConfig] = useState<ClientConfig>(() => {
    if (IS_LANDING_DEPLOYMENT || IS_CRM_DEPLOYMENT) {
      return getClientConfigForEnvClientId(CLIENT_ID_ENV).config;
    }
    return clientConfigs['client-apex-hvac'] || clientConfigs['demo-hvac'] || APEX_HVAC_CLIENT_CONFIG;
  });

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'leadpilot' | 'exporter'>(() => {
    try {
      if (typeof window !== 'undefined' && sessionStorage.getItem('leadpilot_restore_onboarding_modal') === 'true') {
        return 'leadpilot';
      }
    } catch {
      // ignore storage access errors
    }
    return 'preview';
  });
  const [appMode, setAppMode] = useState<'development' | 'client'>('development');

  // Persist master client configs to localStorage in dev mode
  useEffect(() => {
    if (!IS_LANDING_DEPLOYMENT && !IS_CRM_DEPLOYMENT) {
      try {
        localStorage.setItem('master_client_configs', JSON.stringify(clientConfigs));
      } catch {
        // ignore storage quota errors
      }
    }
  }, [clientConfigs]);

  const handleSelectPreset = (presetKey: string) => {
    if (clientConfigs[presetKey]) {
      setActivePresetKey(presetKey);
      setCurrentConfig(JSON.parse(JSON.stringify(clientConfigs[presetKey])));
      return;
    }

    if (INDUSTRY_PRESETS[presetKey]) {
      const template = INDUSTRY_PRESETS[presetKey];
      const newClientKey = `client-${presetKey}`;

      if (clientConfigs[newClientKey]) {
        setActivePresetKey(newClientKey);
        setCurrentConfig(JSON.parse(JSON.stringify(clientConfigs[newClientKey])));
        return;
      }

      const newClientConfig: ClientConfig = {
        ...JSON.parse(JSON.stringify(template)),
        clientId: `${presetKey}-client-01`,
        businessName: template.businessName || `New ${template.industry} Business`,
      };

      setClientConfigs((prev) => ({
        ...prev,
        [newClientKey]: newClientConfig,
      }));
      setActivePresetKey(newClientKey);
      setCurrentConfig(newClientConfig);
      return;
    }
  };

  const handleUpdateConfig = (newConfig: ClientConfig) => {
    setCurrentConfig(newConfig);
    setClientConfigs((prev) => ({
      ...prev,
      [activePresetKey]: JSON.parse(JSON.stringify(newConfig)),
    }));
  };

  const handleResetPreset = () => {
    const rawKey = activePresetKey.replace(/^client-/, '');
    const source = CLIENT_PRESETS[activePresetKey] || INDUSTRY_PRESETS[rawKey] || INDUSTRY_PRESETS[activePresetKey];
    if (source) {
      const resetConfig = JSON.parse(JSON.stringify(source));
      setCurrentConfig(resetConfig);
      setClientConfigs((prev) => ({
        ...prev,
        [activePresetKey]: resetConfig,
      }));
    }
  };

  const handleSetAppMode = (mode: 'development' | 'client') => {
    setAppMode(mode);
    if (mode === 'client' && viewMode === 'exporter') {
      setViewMode('leadpilot');
    }
  };

  // --------------------------------------------------------------------------
  // 1. DEDICATED PUBLIC LANDING WEBSITE DEPLOYMENT
  // --------------------------------------------------------------------------
  if (IS_LANDING_DEPLOYMENT || activeTarget === 'landing') {
    return (
      <div className="relative">
        <StandaloneLanding config={currentConfig} />

        {/* Floating return badge only if previewed inside Dev Environment */}
        {!IS_LANDING_DEPLOYMENT && (
          <div className="fixed bottom-4 right-4 z-50 bg-slate-900/95 text-white border border-slate-700 rounded-full px-4 py-2 shadow-2xl flex items-center gap-3 backdrop-blur-md text-xs">
            <span className="bg-indigo-500/20 text-indigo-300 font-extrabold px-2 py-0.5 rounded text-[10px]">
              Dev Preview: Landing
            </span>
            <button
              onClick={() => setActiveTarget('crm')}
              className="hover:text-blue-400 font-bold underline transition cursor-pointer"
            >
              Test CRM
            </button>
            <button
              onClick={() => setActiveTarget('dev')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-black px-2.5 py-1 rounded-full text-[11px] flex items-center gap-1 transition cursor-pointer shadow"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dev Suite</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 2. DEDICATED CUSTOMER-FACING CRM DEPLOYMENT
  // --------------------------------------------------------------------------
  if (IS_CRM_DEPLOYMENT || activeTarget === 'crm') {
    return (
      <div className="relative">
        <StandaloneCrm defaultClientId={currentConfig.clientId} initialConfig={currentConfig} />

        {/* Floating return badge only if previewed inside Dev Environment */}
        {!IS_CRM_DEPLOYMENT && (
          <div className="fixed bottom-4 right-4 z-50 bg-slate-900/95 text-white border border-slate-700 rounded-full px-4 py-2 shadow-2xl flex items-center gap-3 backdrop-blur-md text-xs">
            <span className="bg-emerald-500/20 text-emerald-300 font-extrabold px-2 py-0.5 rounded text-[10px]">
              Dev Preview: CRM
            </span>
            <button
              onClick={() => setActiveTarget('landing')}
              className="hover:text-blue-400 font-bold underline transition cursor-pointer"
            >
              Test Landing
            </button>
            <button
              onClick={() => setActiveTarget('dev')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-black px-2.5 py-1 rounded-full text-[11px] flex items-center gap-1 transition cursor-pointer shadow"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dev Suite</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 3. MASTER INTERNAL DEVELOPMENT SUITE
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Controller Bar */}
      <HeaderBar
        currentConfig={currentConfig}
        activePresetKey={activePresetKey}
        clientConfigs={clientConfigs}
        onSelectPreset={handleSelectPreset}
        onOpenEditor={() => setIsEditorOpen(true)}
        viewMode={viewMode}
        setViewMode={setViewMode}
        appMode={appMode}
        setAppMode={handleSetAppMode}
        isClientDeployment={false}
        targetOverride={activeTarget}
        setTargetOverride={setActiveTarget}
      />

      {/* Main Mode Area */}
      <main className="flex-1">
        {viewMode === 'preview' ? (
          <LiveWebsitePreview config={currentConfig} appMode={appMode} />
        ) : viewMode === 'leadpilot' ? (
          <LeadPilotDashboard currentConfig={currentConfig} appMode={appMode} />
        ) : (
          <CodeExporterModal
            config={currentConfig}
            onClose={() => setViewMode('preview')}
          />
        )}
      </main>

      {/* Config Drawer Editor */}
      <ConfigEditorDrawer
        isOpen={isEditorOpen && appMode === 'development'}
        onClose={() => setIsEditorOpen(false)}
        config={currentConfig}
        onChangeConfig={handleUpdateConfig}
        onResetPreset={handleResetPreset}
      />
    </div>
  );
}
