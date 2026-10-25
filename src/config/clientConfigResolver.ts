import { ClientConfig } from '../types';
import { INDUSTRY_PRESETS } from '../presets/industryPresets';
import {
  CLIENT_PRESETS,
  DEMO_CLIENT_CONFIG,
  APEX_HVAC_CLIENT_CONFIG,
  DEMO_SKIN_CLINIC_CONFIG,
  DEMO_LOCAL_SERVICE_CONFIG,
} from '../presets/clientPresets';

export const INITIAL_CLIENT_CONFIGS: Record<string, ClientConfig> = {
  'demo-tarot-kochi': JSON.parse(JSON.stringify(DEMO_CLIENT_CONFIG)),
  'demo-tarot': JSON.parse(JSON.stringify(DEMO_CLIENT_CONFIG)),
  'client-apex-hvac': JSON.parse(JSON.stringify(APEX_HVAC_CLIENT_CONFIG)),
  'demo-hvac': JSON.parse(JSON.stringify(APEX_HVAC_CLIENT_CONFIG)),
  'demo-skin-clinic': JSON.parse(JSON.stringify(DEMO_SKIN_CLINIC_CONFIG)),
  'demo-local-service': JSON.parse(JSON.stringify(DEMO_LOCAL_SERVICE_CONFIG)),
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

export function getClientConfigForEnvClientId(envClientId: string): { key: string; config: ClientConfig } {
  if (!envClientId) {
    return { key: 'demo-tarot-kochi', config: JSON.parse(JSON.stringify(DEMO_CLIENT_CONFIG)) };
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
