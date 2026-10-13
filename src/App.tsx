import React, { useState, useEffect } from 'react';
import { INDUSTRY_PRESETS } from './presets/industryPresets';
import { CLIENT_PRESETS, DEMO_CLIENT_CONFIG } from './presets/clientPresets';
import { ClientConfig } from './types';
import { HeaderBar } from './components/HeaderBar';
import { ConfigEditorDrawer } from './components/ConfigEditorDrawer';
import { LiveWebsitePreview } from './components/LiveWebsitePreview';
import { LeadPilotDashboard } from './components/LeadPilotDashboard';
import { CodeExporterModal } from './components/CodeExporterModal';
import { IS_CLIENT_DEPLOYMENT, DEPLOYMENT_APP_MODE, CLIENT_ID_ENV } from './config/appMode';

const INITIAL_CLIENT_CONFIGS: Record<string, ClientConfig> = {
  'demo-tarot': JSON.parse(JSON.stringify(DEMO_CLIENT_CONFIG)),
  'demo-hvac': {
    ...JSON.parse(JSON.stringify(INDUSTRY_PRESETS['hvac'])),
    clientId: 'apex-hvac-kochi',
    businessName: 'Apex Heating & Cooling',
    cityStateZip: 'Kochi, Kerala',
    serviceArea: 'Kochi & Ernakulam',
    phone: '+91 98765 43210',
    email: 'contact@apexhvac.com',
  },
  'demo-plumbing': {
    ...JSON.parse(JSON.stringify(INDUSTRY_PRESETS['plumbing'])),
    clientId: 'prodrain-plumbing-kochi',
    businessName: 'ProDrain Plumbing Services',
    cityStateZip: 'Kochi, Kerala',
    serviceArea: 'Kochi & Nearby Areas',
    phone: '+91 98765 12345',
    email: 'info@prodrainplumbing.com',
  },
};

function getClientConfigForEnvClientId(envClientId: string): { key: string; config: ClientConfig } {
  if (!envClientId) {
    return { key: 'demo-tarot', config: JSON.parse(JSON.stringify(DEMO_CLIENT_CONFIG)) };
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

  // 3. Fallback: clone DEMO_CLIENT_CONFIG with requested envClientId
  const customConfig: ClientConfig = {
    ...JSON.parse(JSON.stringify(DEMO_CLIENT_CONFIG)),
    clientId: envClientId,
    businessName: envClientId.replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
  };
  return { key: envClientId, config: customConfig };
}

export default function App() {
  const [clientConfigs, setClientConfigs] = useState<Record<string, ClientConfig>>(() => {
    if (IS_CLIENT_DEPLOYMENT) {
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
    if (IS_CLIENT_DEPLOYMENT) {
      return getClientConfigForEnvClientId(CLIENT_ID_ENV).key;
    }
    return 'demo-tarot';
  });

  const [currentConfig, setCurrentConfig] = useState<ClientConfig>(() => {
    if (IS_CLIENT_DEPLOYMENT) {
      return getClientConfigForEnvClientId(CLIENT_ID_ENV).config;
    }
    return clientConfigs['demo-tarot'] || DEMO_CLIENT_CONFIG;
  });

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'leadpilot' | 'exporter'>('preview');
  const [appMode, setAppMode] = useState<'development' | 'client'>(DEPLOYMENT_APP_MODE);

  useEffect(() => {
    if (IS_CLIENT_DEPLOYMENT) {
      const resolved = getClientConfigForEnvClientId(CLIENT_ID_ENV);
      setAppMode('client');
      setActivePresetKey(resolved.key);
      setCurrentConfig(resolved.config);
      setClientConfigs({ [resolved.key]: resolved.config });
      if (viewMode === 'exporter') {
        setViewMode('preview');
      }
    }
  }, [viewMode]);

  // Persist master client configs to localStorage in dev mode
  useEffect(() => {
    if (!IS_CLIENT_DEPLOYMENT) {
      try {
        localStorage.setItem('master_client_configs', JSON.stringify(clientConfigs));
      } catch {
        // ignore storage quota errors
      }
    }
  }, [clientConfigs]);

  const handleSelectPreset = (presetKey: string) => {
    if (IS_CLIENT_DEPLOYMENT) return;

    // 1. If presetKey matches an existing active client configuration
    if (clientConfigs[presetKey]) {
      setActivePresetKey(presetKey);
      setCurrentConfig(JSON.parse(JSON.stringify(clientConfigs[presetKey])));
      return;
    }

    // 2. If presetKey is an industry template (e.g. 'hvac', 'plumbing', 'roofing', etc.)
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
    if (!IS_CLIENT_DEPLOYMENT) {
      setClientConfigs((prev) => ({
        ...prev,
        [activePresetKey]: JSON.parse(JSON.stringify(newConfig)),
      }));
    }
  };

  const handleResetPreset = () => {
    if (IS_CLIENT_DEPLOYMENT) return;
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
    if (IS_CLIENT_DEPLOYMENT) return;
    setAppMode(mode);
    if (mode === 'client' && viewMode === 'exporter') {
      setViewMode('leadpilot');
    }
  };

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
        isClientDeployment={IS_CLIENT_DEPLOYMENT}
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
