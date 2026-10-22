/**
 * Deployment Target & Mode Configuration
 * 
 * Supports 3 distinct environments:
 * 1. 'landing' - Public Landing Website: Client-facing landing page, GBP info, lead form, WhatsApp CTA.
 *                Zero dev tools, zero CRM dashboard, zero admin controls.
 * 2. 'crm'     - Separate Customer CRM: Client login/logout, lead dashboard, follow-ups, WhatsApp buttons.
 *                Zero dev controls, zero config drawer, zero landing page preview.
 * 3. 'dev'     - Internal Development Environment: Master suite with Dev Mode, Client Mode preview,
 *                Config Editor Drawer, Code Exporter, Preset switcher. Available only locally.
 * 
 * Target Resolution Priority:
 * 1. VITE_APP_TARGET environment variable ('landing' | 'crm' | 'dev')
 * 2. URL path: /crm or /portal -> 'crm', /landing -> 'landing'
 * 3. URL query parameter: ?target=landing or ?target=crm or ?target=dev
 * 4. Default: 'dev' in development, or fallback based on VITE_APP_MODE
 */

export type AppTarget = 'landing' | 'crm' | 'dev';

export function getAppTarget(): AppTarget {
  // 1. Explicit Vite Environment Variable
  const envTarget = (import.meta as any).env?.VITE_APP_TARGET?.toString().trim().toLowerCase();
  if (envTarget === 'landing') return 'landing';
  if (envTarget === 'crm') return 'crm';
  if (envTarget === 'dev') return 'dev';

  // Fallback for legacy VITE_APP_MODE="client"
  const envMode = (import.meta as any).env?.VITE_APP_MODE?.toString().trim().toLowerCase();
  if (envMode === 'landing') return 'landing';
  if (envMode === 'crm') return 'crm';

  // 2. URL Query Parameter (?target=landing | ?mode=landing | ?target=crm | ?mode=crm | ?target=dev)
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const targetParam = (params.get('target') || params.get('mode'))?.toLowerCase();
    if (targetParam === 'landing' || targetParam === 'crm' || targetParam === 'dev') {
      return targetParam as AppTarget;
    }

    // 3. URL Pathname (/crm, /portal, /landing)
    const path = window.location.pathname.toLowerCase();
    if (path.startsWith('/crm') || path.startsWith('/portal')) {
      return 'crm';
    }
    if (path.startsWith('/landing')) {
      return 'landing';
    }
  }

  // Default to internal dev mode
  return 'dev';
}

export const CURRENT_APP_TARGET: AppTarget = getAppTarget();

export const IS_LANDING_DEPLOYMENT = CURRENT_APP_TARGET === 'landing';
export const IS_CRM_DEPLOYMENT = CURRENT_APP_TARGET === 'crm';
export const IS_DEV_DEPLOYMENT = CURRENT_APP_TARGET === 'dev';

export const CLIENT_ID_ENV: string = ((import.meta as any).env?.VITE_CLIENT_ID || 'demo-tarot-kochi').trim();
