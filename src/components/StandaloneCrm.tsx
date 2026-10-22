import React, { useState, useEffect } from 'react';
import { ClientConfig } from '../types';
import {
  getCurrentClientSession,
  loginClient,
  loginWithGoogle,
  logoutClient,
  ClientUser,
  onClientAuthStateChanged,
} from '../auth/clientAuth';
import { LeadPilotDashboard } from './LeadPilotDashboard';
import { Building2, LogOut, ShieldCheck, UserCheck, Lock, Mail, Key, AlertCircle, RefreshCw } from 'lucide-react';
import { CLIENT_PRESETS, DEMO_CLIENT_CONFIG } from '../presets/clientPresets';
import { INDUSTRY_PRESETS } from '../presets/industryPresets';
import { migrateLocalStorageToFirestore } from '../utils/leadStorage';
import { IS_DEV_DEPLOYMENT } from '../config/appTarget';

interface StandaloneCrmProps {
  defaultClientId?: string;
  initialConfig?: ClientConfig;
}

export const StandaloneCrm: React.FC<StandaloneCrmProps> = ({ defaultClientId = 'demo-tarot-kochi', initialConfig }) => {
  const [currentUser, setCurrentUser] = useState<ClientUser | null>(() => getCurrentClientSession());
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<string | null>(null);

  // Sync auth state with Firebase Auth
  useEffect(() => {
    const unsubscribe = onClientAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Safe migration of existing local records when authenticated
  useEffect(() => {
    if (currentUser?.clientId) {
      migrateLocalStorageToFirestore(currentUser.clientId)
        .then((res) => {
          if (res.migratedCount > 0) {
            setMigrationStatus(res.message);
            setTimeout(() => setMigrationStatus(null), 5000);
          }
        })
        .catch(() => {});
    }
  }, [currentUser?.clientId]);

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
        setLoginError(res.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err: any) {
      setLoginError(err?.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoginError('');
    setIsSubmitting(true);
    try {
      const res = await loginWithGoogle();
      if (res.success && res.user) {
        setCurrentUser(res.user);
      } else {
        setLoginError(res.error || 'Google Sign-In was cancelled or failed.');
      }
    } catch (err: any) {
      setLoginError(err?.message || 'Google Sign-In failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logoutClient();
    setCurrentUser(null);
  };

  // Resolve client config strictly for the authenticated client ID
  const activeClientId = currentUser?.clientId || (IS_DEV_DEPLOYMENT ? defaultClientId : '');

  const resolvedConfig: ClientConfig = React.useMemo(() => {
    if (initialConfig && initialConfig.clientId === activeClientId) {
      return initialConfig;
    }
    if (CLIENT_PRESETS[activeClientId]) {
      return CLIENT_PRESETS[activeClientId];
    }
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

  // Production Secure Login Portal
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
              <span>Isolated Tenant Access • Firebase Auth & Security Rules</span>
            </div>

            {loginError && (
              <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 mb-4 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-xl shadow transition flex items-center justify-center gap-3 cursor-pointer text-sm disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="px-3 text-slate-500 text-xs uppercase font-medium">Or sign in with email</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@company.com"
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

            <div className="mt-6 pt-4 border-t border-slate-800/60 text-center">
              <p className="text-[11px] text-slate-500">
                Data is encrypted and bound to your organization's dedicated tenant boundary.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated but no tenant membership is assigned, block access to leads
  if (!currentUser.clientId) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 mb-4 border border-amber-500/30">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Tenant Membership Assigned</h2>
          <p className="text-xs text-slate-400 mb-6">
            Signed in as <strong className="text-slate-200">{currentUser.email}</strong>. Your account does not have an active business tenant assignment. Access to customer leads is restricted.
          </p>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Authenticated Client CRM View
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Migration Notification Banner */}
      {migrationStatus && (
        <div className="bg-emerald-950/80 border-b border-emerald-500/40 px-4 py-2 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            <span>{migrationStatus}</span>
          </div>
          <button
            onClick={() => setMigrationStatus(null)}
            className="text-slate-400 hover:text-white text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Client-Facing Navigation Header */}
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
