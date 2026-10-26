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

export function getClientConfigForEnvClientId(
  envClientId?: string,
  allowDefaultIfEmpty = true
): { key: string; config: ClientConfig | null; isValid: boolean } {
  const cleanId = (envClientId || '').trim().toLowerCase();

  if (!cleanId) {
    if (allowDefaultIfEmpty) {
      return {
        key: 'demo-tarot-kochi',
        config: JSON.parse(JSON.stringify(DEMO_CLIENT_CONFIG)),
        isValid: true,
      };
    }
    return { key: '', config: null, isValid: false };
  }

  // 1. Direct match on key in CLIENT_PRESETS or INITIAL_CLIENT_CONFIGS
  if (CLIENT_PRESETS[cleanId]) {
    return {
      key: cleanId,
      config: JSON.parse(JSON.stringify(CLIENT_PRESETS[cleanId])),
      isValid: true,
    };
  }
  if (INITIAL_CLIENT_CONFIGS[cleanId]) {
    return {
      key: cleanId,
      config: JSON.parse(JSON.stringify(INITIAL_CLIENT_CONFIGS[cleanId])),
      isValid: true,
    };
  }

  // 2. Match on clientId property across all preset sources
  for (const [key, cfg] of Object.entries(CLIENT_PRESETS)) {
    if (cfg.clientId.toLowerCase() === cleanId) {
      return { key, config: JSON.parse(JSON.stringify(cfg)), isValid: true };
    }
  }
  for (const [key, cfg] of Object.entries(INITIAL_CLIENT_CONFIGS)) {
    if (cfg.clientId.toLowerCase() === cleanId) {
      return { key, config: JSON.parse(JSON.stringify(cfg)), isValid: true };
    }
  }
  for (const [key, cfg] of Object.entries(INDUSTRY_PRESETS)) {
    if (cfg.clientId.toLowerCase() === cleanId) {
      return { key: `client-${key}`, config: JSON.parse(JSON.stringify(cfg)), isValid: true };
    }
  }

  // 3. Strict rejection: Unknown client IDs MUST NOT fall back to Tarot
  return { key: cleanId, config: null, isValid: false };
}
