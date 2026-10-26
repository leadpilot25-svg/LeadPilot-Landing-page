import React, { useState } from 'react';
import { StandaloneLanding } from './components/StandaloneLanding';
import { CLIENT_ID_ENV } from './config/appTarget';
import { getClientConfigForEnvClientId } from './config/clientConfigResolver';
import { ClientConfig } from './types';
import { AlertTriangle, Home } from 'lucide-react';

export default function AppLanding() {
  const [resolvedState] = useState<{
    config: ClientConfig | null;
    requestedId: string;
    isValid: boolean;
  }>(() => {
    let clientId = CLIENT_ID_ENV;
    let hasExplicitParam = false;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const clientParam = params.get('client') || params.get('clientId');
      if (clientParam) {
        hasExplicitParam = true;
        const normalized = clientParam.trim().toLowerCase();
        if (normalized.includes('tarot')) clientId = 'demo-tarot-kochi';
        else if (normalized.includes('hvac') || normalized.includes('apex')) clientId = 'client-apex-hvac';
        else if (normalized.includes('plumb')) clientId = 'demo-plumbing';
        else clientId = clientParam.trim();
      }
    }
    // If an explicit URL parameter was provided, do not allow silent fallback to default
    const res = getClientConfigForEnvClientId(clientId, !hasExplicitParam);
    return {
      config: res.config,
      requestedId: clientId,
      isValid: res.isValid,
    };
  });

  if (!resolvedState.isValid || !resolvedState.config) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Business Portal Not Found</h1>
          <p className="text-sm text-slate-400 mb-6">
            No active business configuration was found for client identifier:
            <br />
            <span className="font-mono text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded text-xs mt-1 inline-block border border-amber-500/20">
              {resolvedState.requestedId || 'unspecified'}
            </span>
          </p>
          <p className="text-xs text-slate-500 mb-6">
            Please verify the URL link or contact your business administrator. Unknown client IDs are rejected to ensure data privacy.
          </p>
          <a
            href="?client=demo-tarot-kochi"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-sm font-semibold transition border border-slate-700"
          >
            <Home className="w-4 h-4" />
            <span>Return to Tarot Demo</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <StandaloneLanding config={resolvedState.config} />
    </div>
  );
}
