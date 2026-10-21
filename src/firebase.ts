import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  browserLocalPersistence,
  setPersistence,
  getRedirectResult,
  UserCredential,
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// CRITICAL: The app will break without specifying firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Explicitly configure local persistence to survive redirects and page reloads
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn('Could not set Firebase Auth persistence:', err);
  });
}

// Global top-level redirect capture executed immediately on script evaluation
export interface GlobalRedirectState {
  isChecking: boolean;
  result: UserCredential | null;
  error: any | null;
}

let redirectState: GlobalRedirectState = {
  isChecking: typeof window !== 'undefined',
  result: null,
  error: null,
};

const redirectListeners: Array<(state: GlobalRedirectState) => void> = [];

export function subscribeRedirectState(listener: (state: GlobalRedirectState) => void) {
  redirectListeners.push(listener);
  listener(redirectState);
  return () => {
    const idx = redirectListeners.indexOf(listener);
    if (idx !== -1) redirectListeners.splice(idx, 1);
  };
}

export function getGlobalRedirectState() {
  return redirectState;
}

if (typeof window !== 'undefined') {
  getRedirectResult(auth)
    .then((result) => {
      redirectState = { isChecking: false, result, error: null };
      if (result?.user) {
        try {
          sessionStorage.setItem('leadpilot_last_authenticated_uid', result.user.uid);
        } catch {}
      }
      redirectListeners.forEach((l) => l(redirectState));
    })
    .catch((err) => {
      redirectState = { isChecking: false, result: null, error: err };
      try {
        sessionStorage.setItem(
          'leadpilot_last_redirect_error',
          JSON.stringify({ code: err?.code || 'unknown', message: err?.message || String(err) })
        );
      } catch {}
      redirectListeners.forEach((l) => l(redirectState));
    });
}

// Secondary App, Auth, and Firestore instances for isolated testing without overriding primary admin session
export function getSecondaryProvisioningApp() {
  const SECONDARY_APP_NAME = 'LeadPilotProvisioningSecondaryApp';
  const existingApp = getApps().find((a) => a.name === SECONDARY_APP_NAME);
  return existingApp || initializeApp(firebaseConfig, SECONDARY_APP_NAME);
}

export function getSecondaryProvisioningAuth() {
  return getAuth(getSecondaryProvisioningApp());
}

export function getSecondaryProvisioningDb() {
  return getFirestore(getSecondaryProvisioningApp(), firebaseConfig.firestoreDatabaseId);
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validation connection to Firestore on boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
      return false;
    }
    // Permission denied or not found is normal for 'test/connection'
    return true;
  }
}

// Initial connection test
testConnection().catch(() => {});

export default app;
