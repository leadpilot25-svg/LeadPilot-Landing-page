import React, { useState } from 'react';
import { StandaloneCrm } from './components/StandaloneCrm';
import { CLIENT_ID_ENV } from './config/appTarget';
import { getClientConfigForEnvClientId } from './config/clientConfigResolver';
import { ClientConfig } from './types';

export default function AppCrm() {
  const [currentConfig] = useState<ClientConfig | null>(() => {
    let clientId = CLIENT_ID_ENV;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const clientParam = params.get('client') || params.get('clientId');
      if (clientParam) {
        const normalized = clientParam.trim().toLowerCase();
        if (normalized.includes('tarot')) clientId = 'demo-tarot-kochi';
        else if (normalized.includes('hvac') || normalized.includes('apex')) clientId = 'client-apex-hvac';
        else if (normalized.includes('plumb')) clientId = 'demo-plumbing';
        else clientId = clientParam.trim();
      }
    }
    return getClientConfigForEnvClientId(clientId).config;
  });

  return (
    <div className="relative">
      <StandaloneCrm
        defaultClientId={currentConfig?.clientId || 'demo-tarot-kochi'}
        initialConfig={currentConfig || undefined}
      />
    </div>
  );
}
