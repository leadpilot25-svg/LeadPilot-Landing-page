/**
 * APP_MODE configuration for Master vs Client deployment.
 * 
 * In Client Deployment mode (VITE_APP_MODE="client" or URL query parameter ?mode=client):
 * - The application is locked to client view.
 * - Developer controls (Dev Mode toggle, Edit CONFIG, Industry Preset selector, Code Exporter) are disabled/omitted.
 * - There is no route or action to return to developer/master mode.
 * - Client identity is scoped to VITE_CLIENT_ID.
 */

export const CLIENT_ID_ENV: string = ((import.meta as any).env?.VITE_CLIENT_ID || '').trim();

export const IS_CLIENT_DEPLOYMENT =
  ((import.meta as any).env?.VITE_APP_MODE === 'client') ||
  (typeof window !== 'undefined' && window.location.search.includes('mode=client'));

export const DEPLOYMENT_APP_MODE: 'development' | 'client' = IS_CLIENT_DEPLOYMENT ? 'client' : 'development';
