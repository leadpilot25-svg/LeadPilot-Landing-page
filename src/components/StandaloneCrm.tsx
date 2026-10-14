import React, { useState, useEffect } from 'react';
import { ClientConfig } from '../types';
import { getCurrentClientSession, loginClient, logoutClient, ClientUser, REGISTERED_CLIENT_ACCOUNTS } from '../auth/clientAuth';
import { LeadPilotDashboard } from './LeadPilotDashboard';
import { Building2, LogOut, ShieldCheck, UserCheck, Lock, Mail, Key, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { CLIENT_PRESETS, DEMO_CLIENT_CONFIG } from '../presets/clientPresets';
import { INDUSTRY_PRESETS } from '../presets/industryPresets';

interface StandaloneCrmProps {
  defaultClientId?: string;
  initialConfig?: ClientConfig;
}

export const StandaloneCrm: React.FC<StandaloneCrmProps> = ({ defaultClientId = 'demo-tarot', initialConfig }) => {
  const [currentUser, setCurrentUser] = useState<ClientUser | null>(() => getCurrentClientSession());
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync auth state on storage changes
  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(getCurrentClientSession());
    };
    window.addEventListener('leadpilot_auth_changed', handleAuthChange);
    return () => window.removeEventListener('leadpilot_auth_changed', handleAuthChange);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    try {
      const res = await loginClient(loginEmail, loginPassword);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setLoginEmail('');
        setLoginPassword('');
      } else {
        setLoginError(res.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err: any) {
      setLoginError(err?.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAccountSelect = (acc: typeof REGISTERED_CLIENT_ACCOUNTS[0]) => {
    setLoginEmail(acc.email);
    setLoginPassword(acc.passwordHash);
    setLoginError('');
  };

  const handleLogout = () => {
    logoutClient();
    setCurrentUser(null);
  };

  // Resolve client config for the authenticated client ID
  const activeClientId = currentUser?.clientId || defaultClientId;
  
  const resolvedConfig: ClientConfig = React.useMemo(() => {
    if (initialConfig && initialConfig.clientId === activeClientId) {
      return initialConfig;
    }
    if (CLIENT_PRESETS[activeClientId]) {
      return CLIENT_PRESETS[activeClientId];
    }
    // Match by industry preset or fallback
    const rawKey = activeClientId.replace(/^client-/, '').replace(/^demo-/, '');
    if (INDUSTRY_PRESETS[rawKey]) {
      return {
        ...INDUSTRY_PRESETS[rawKey],
        clientId: activeClientId,
        businessName: currentUser?.businessName || INDUSTRY_PRESETS[rawKey].businessName,
      };
    }
    return {
      ...DEMO_CLIENT_CONFIG,
      clientId: activeClientId,
      businessName: currentUser?.businessName || DEMO_CLIENT_CONFIG.businessName,
    };
  }, [activeClientId, currentUser, initialConfig]);

  // If user is not authenticated, display the secure Customer Login Portal
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 selection:bg-blue-600 selection:text-white">
        <div className="w-full max-w-md">
          {/* Brand header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/20 mb-4">
              <Building2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">LeadPilot Client CRM</h1>
            <p className="text-sm text-slate-400 mt-1">
              Secure Customer Portal & Lead Management
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Isolated Client Access • TLS Encrypted</span>
            </div>

            {loginError && (
              <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Email or Client ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="client@tarot.com or demo-tarot"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-extrabold rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm mt-2"
              >
                {isSubmitting ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>Sign In to CRM Portal</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Test Accounts for Review / Evaluation */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <p className="text-[11px] font-bold text-slate-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Quick Test Accounts (Click to Fill & Verify Isolation):
              </p>
              <div className="grid grid-cols-1 gap-2">
                {REGISTERED_CLIENT_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.clientId}
                    type="button"
                    onClick={() => handleQuickAccountSelect(acc)}
                    className="text-left p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs transition flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-slate-200 group-hover:text-blue-400">
                        {acc.businessName}
                      </div>
                      <div className="text-[10px] text-slate-400">{acc.email}</div>
                    </div>
                    <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono">
                      {acc.passwordHash}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Client CRM View
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Client-Facing Navigation Header (No Dev Mode, No Preset Switcher, No Website Tab) */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-white leading-tight">
                  {currentUser.businessName || resolvedConfig.businessName}
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-500/30">
                  Client CRM
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Lead Pipeline & Inquiries • Tenant ID: <span className="font-mono text-emerald-400">{currentUser.clientId}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentUser.email}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 hover:border-rose-500/40 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
              title="Sign out of CRM"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Scoped Client Dashboard */}
      <main className="flex-1">
        <LeadPilotDashboard
          currentConfig={resolvedConfig}
          appMode="client"
        />
      </main>
    </div>
  );
};
