import React, { useState } from 'react';
import { StandaloneLanding } from './components/StandaloneLanding';
import { CLIENT_ID_ENV } from './config/appTarget';
import { getClientConfigForEnvClientId } from './config/clientConfigResolver';
import { ClientConfig } from './types';

export default function AppLanding() {
  const [currentConfig] = useState<ClientConfig>(() => {
    let clientId = CLIENT_ID_ENV;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const clientParam = params.get('client') || params.get('clientId');
      if (clientParam) {
        if (clientParam.includes('tarot')) clientId = 'demo-tarot-kochi';
        else if (clientParam.includes('hvac')) clientId = 'client-apex-hvac';
        else if (clientParam.includes('plumb')) clientId = 'demo-plumbing';
        else clientId = clientParam;
      }
    }
    return getClientConfigForEnvClientId(clientId).config;
  });

  return (
    <div className="relative">
      <StandaloneLanding config={currentConfig} />
    </div>
  );
}
