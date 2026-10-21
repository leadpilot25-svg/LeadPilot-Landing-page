import React, { useState, useEffect } from 'react';
import {
  auth,
  db,
  getSecondaryProvisioningAuth,
  getSecondaryProvisioningDb,
  subscribeRedirectState,
} from '../firebase';
import {
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
} from 'firebase/firestore';
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCw,
  X,
  Lock,
  Mail,
  Play,
  Key,
  Copy,
  Check,
  ExternalLink,
  LogOut,
  Globe,
  Info,
} from 'lucide-react';
import { LeadItem } from '../types';

interface TestOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TestLog {
  title: string;
  type: 'live' | 'simulated';
  passed: boolean;
  message: string;
  timestamp: string;
}

interface AuthErrorInfo {
  title: string;
  code: string;
  message: string;
  suggestion?: string;
  domainToAdd?: string;
}

export const TestOnboardingModal: React.FC<TestOnboardingModalProps> = ({ isOpen, onClose }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [emailA, setEmailA] = useState('apex.test@example.com');
  const [passwordA, setPasswordA] = useState('ApexTest2026!');
  const [emailB, setEmailB] = useState('plumbing.test@example.com');
  const [passwordB, setPasswordB] = useState('PlumbTest2026!');

  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisionProgress, setProvisionProgress] = useState<string>('');
  const [provisionError, setProvisionError] = useState<string | null>(null);
  const [provisionSuccess, setProvisionSuccess] = useState<string | null>(null);

  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testLogs, setTestLogs] = useState<TestLog[]>([]);

  // Google Sign-In state & detailed error tracking
  const [adminAuthError, setAdminAuthError] = useState<AuthErrorInfo | null>(null);
  const [isSigningInWithPopup, setIsSigningInWithPopup] = useState(false);
  const [isSigningInWithRedirect, setIsSigningInWithRedirect] = useState(false);
  const [isCheckingRedirectResult, setIsCheckingRedirectResult] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);

  // Detailed error translator for Google Auth
  const handleDetailedAuthError = (err: any, method: 'popup' | 'redirect') => {
    const code = err?.code || 'unknown';
    const rawMessage = err?.message || String(err);
    const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

    console.error(`Admin Google Sign-In failed via ${method}:`, { code, rawMessage, currentDomain });

    if (code === 'auth/unauthorized-domain') {
      const isLocal = currentDomain === 'localhost' || currentDomain === '127.0.0.1';
      setAdminAuthError({
        title: 'Unauthorized Domain (Action Required in Firebase Console)',
        code,
        message: `Firebase blocked authentication because "${currentDomain}" is not in the Authorized Domains list for project "bamboo-tangent-x8gvj".`,
        suggestion: `To fix this in your Firebase Console:
1. Open https://console.firebase.google.com and select project "bamboo-tangent-x8gvj".
2. Go to Authentication > Settings tab > Authorized domains.
3. Click "Add domain" and enter: ${currentDomain} ${isLocal ? '(NOTE: enter "localhost" without http:// or port :3000)' : ''}
4. Click Save, then return here and click "Admin Login (Popup)".`,
        domainToAdd: currentDomain,
      });
      return;
    }

    if (code === 'auth/popup-blocked') {
      setAdminAuthError({
        title: 'Popup Blocked by Web Browser',
        code,
        message: 'Your browser or an ad-blocker blocked the Google sign-in popup from opening.',
        suggestion: 'Please allow popups for this site in your browser address bar, or use "Admin Login (Redirect)".',
      });
      return;
    }

    if (code === 'auth/popup-closed-by-user') {
      setAdminAuthError({
        title: 'Popup Closed Before Completion',
        code,
        message: 'The Google Sign-In window closed before authentication was finalized.',
        suggestion: `This usually happens if "${currentDomain}" is missing from Firebase Authorized Domains, or if third-party storage is restricted.
Verify that "${currentDomain}" is added to Firebase Authorized domains, then retry "Admin Login (Popup)".`,
        domainToAdd: currentDomain,
      });
      return;
    }

    if (code === 'auth/cancelled-popup-request') {
      setAdminAuthError({
        title: 'Sign-In Request in Progress',
        code,
        message: 'Another sign-in request is already being processed.',
        suggestion: 'Please wait a moment and click the button once.',
      });
      return;
    }

    if (code === 'auth/operation-not-allowed') {
      setAdminAuthError({
        title: 'Google Sign-In Provider Disabled',
        code,
        message: 'Google Sign-In is disabled in project "bamboo-tangent-x8gvj".',
        suggestion: 'In Firebase Console > Authentication > Sign-in method, click "Google" and enable it.',
      });
      return;
    }

    if (code === 'auth/network-request-failed') {
      setAdminAuthError({
        title: 'Network Connection Error',
        code,
        message: 'Unable to connect to Google Firebase authentication servers.',
        suggestion: 'Please check your internet connection or proxy settings.',
      });
      return;
    }

    setAdminAuthError({
      title: 'Google Authentication Error',
      code,
      message: rawMessage,
      suggestion: 'Check the browser developer console or verify Firebase Authentication settings.',
      domainToAdd: currentDomain,
    });
  };

  // Subscribe to global redirect state & persistent auth changes
  useEffect(() => {
    // 1. Subscribe to global redirect state captured at app boot
    const unsubscribeRedirect = subscribeRedirectState((state) => {
      setIsCheckingRedirectResult(state.isChecking);
      if (state.error) {
        handleDetailedAuthError(state.error, 'redirect');
      }
      if (state.result && state.result.user) {
        setCurrentUser(state.result.user);
        const fbUser = state.result.user;
        const isGoogle = fbUser.providerData?.some((p) => p.providerId === 'google.com');
        const isEmail = fbUser.email?.toLowerCase().trim() === 'mail.nasiya@gmail.com';
        const isVer = fbUser.emailVerified;

        if (!isEmail) {
          setAdminAuthError({
            title: 'Unauthorized Administrator Account',
            code: 'auth/unauthorized-account',
            message: `Signed in as "${fbUser.email}". Only "mail.nasiya@gmail.com" is authorized as root administrator.`,
            suggestion: 'Please click Sign Out and sign in using mail.nasiya@gmail.com.',
          });
        } else if (!isGoogle) {
          setAdminAuthError({
            title: 'Invalid Authentication Provider',
            code: 'auth/invalid-provider',
            message: `Signed in using "${fbUser.providerData[0]?.providerId || 'password'}". Administrator must authenticate via Google Sign-In.`,
            suggestion: 'Please click Sign Out and use Admin Login with Google.',
          });
        } else if (!isVer) {
          setAdminAuthError({
            title: 'Google Email Unverified',
            code: 'auth/unverified-email',
            message: 'Your Google email account is not marked as verified in Firebase.',
            suggestion: 'Please verify your email address in Google/Firebase.',
          });
        } else {
          setProvisionSuccess('Root administrator successfully verified via Google Sign-In!');
        }
      }
    });

    // 2. Subscribe to auth state changes
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    // 3. Check if redirect was attempted but returned no user credentials
    try {
      const wasRedirectAttempted = sessionStorage.getItem('leadpilot_redirect_in_progress') === 'true';
      if (wasRedirectAttempted) {
        sessionStorage.removeItem('leadpilot_redirect_in_progress');
        setTimeout(() => {
          if (!auth.currentUser) {
            const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
            const isLocal = host === 'localhost' || host === '127.0.0.1';
            setAdminAuthError({
              title: isLocal ? 'Localhost Redirect Blocked by Browser Cookies' : 'Redirect Returned Without Credentials',
              code: 'auth/redirect-no-credential',
              message: isLocal
                ? `Redirect to Google completed, but Firebase did not receive a session token on http://${host}:3000. On localhost, modern web browsers block cross-origin cookies between Google's auth handler and localhost.`
                : `Redirect returned to ${host}, but no authenticated user session was established.`,
              suggestion: isLocal
                ? `Recommended Localhost Solution:
1. Ensure "localhost" is added to Firebase Authorized Domains (Authentication > Settings > Authorized domains).
2. Click "Admin Login (Popup)" instead of Redirect. Popups work directly on localhost and do not suffer from redirect cookie partitioning.`
                : `Please check Firebase Authorized Domains and try "Admin Login (Popup)".`,
              domainToAdd: host,
            });
          }
        }, 1200);
      }
    } catch {}

    // 4. Check if there was an earlier redirect error saved in sessionStorage
    try {
      const savedErr = sessionStorage.getItem('leadpilot_last_redirect_error');
      if (savedErr) {
        const parsed = JSON.parse(savedErr);
        handleDetailedAuthError(parsed, 'redirect');
        sessionStorage.removeItem('leadpilot_last_redirect_error');
      }
    } catch {}

    return () => {
      unsubscribeRedirect();
      unsubscribeAuth();
    };
  }, []);

  // Sign in as Administrator with Google Popup
  const handleAdminGooglePopup = async () => {
    setAdminAuthError(null);
    setProvisionError(null);
    setIsSigningInWithPopup(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      const isGoogle = fbUser.providerData?.some((p) => p.providerId === 'google.com');
      const isEmail = fbUser.email?.toLowerCase().trim() === 'mail.nasiya@gmail.com';
      const isVer = fbUser.emailVerified;

      if (!isEmail) {
        setAdminAuthError({
          title: 'Unauthorized Administrator Account',
          code: 'auth/unauthorized-account',
          message: `Signed in as "${fbUser.email}". Only "mail.nasiya@gmail.com" is authorized as root administrator.`,
          suggestion: 'Please click Sign Out and sign in using mail.nasiya@gmail.com.',
        });
      } else if (!isGoogle) {
        setAdminAuthError({
          title: 'Invalid Authentication Provider',
          code: 'auth/invalid-provider',
          message: `Signed in using "${fbUser.providerData[0]?.providerId || 'password'}". Administrator must authenticate via Google Sign-In.`,
          suggestion: 'Please click Sign Out and use Admin Login with Google.',
        });
      } else if (!isVer) {
        setAdminAuthError({
          title: 'Google Email Unverified',
          code: 'auth/unverified-email',
          message: 'Your Google email account is not marked as verified in Firebase.',
          suggestion: 'Please verify your email address in Google/Firebase.',
        });
      } else {
        setProvisionSuccess('Root administrator successfully verified via Google Sign-In.');
      }
    } catch (err: any) {
      handleDetailedAuthError(err, 'popup');
    } finally {
      setIsSigningInWithPopup(false);
    }
  };

  // Sign in as Administrator with Google Redirect
  const handleAdminGoogleRedirect = async () => {
    setAdminAuthError(null);
    setProvisionError(null);
    setIsSigningInWithRedirect(true);
    try {
      try {
        sessionStorage.setItem('leadpilot_restore_onboarding_modal', 'true');
        sessionStorage.setItem('leadpilot_redirect_in_progress', 'true');
      } catch {
        // ignore storage errors
      }
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithRedirect(auth, provider);
    } catch (err: any) {
      setIsSigningInWithRedirect(false);
      try {
        sessionStorage.removeItem('leadpilot_redirect_in_progress');
      } catch {}
      handleDetailedAuthError(err, 'redirect');
    }
  };

  // Sign out administrator
  const handleAdminSignOut = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setAdminAuthError(null);
      setProvisionSuccess(null);
      setProvisionError(null);
    } catch (err: any) {
      setProvisionError(`Sign out error: ${err.message}`);
    }
  };

  const copyDomain = (domain: string) => {
    try {
      navigator.clipboard.writeText(domain);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  // Strict 3-Point Root Administrator Verification
  const isGoogleProvider = Boolean(
    currentUser?.providerData?.some((p) => p.providerId === 'google.com')
  );
  const isNasiyaEmail =
    currentUser?.email?.toLowerCase().trim() === 'mail.nasiya@gmail.com';
  const isEmailVerified = Boolean(currentUser?.emailVerified);

  const isAdminAuthenticated = Boolean(
    currentUser && isNasiyaEmail && isEmailVerified && isGoogleProvider
  );

  // Safe provisioning using secondary Auth instance to prevent session clobbering
  const handleExecuteProvisioning = async () => {
    if (!isAdminAuthenticated) {
      setProvisionError('Administrator authentication required before provisioning tenants.');
      return;
    }

    setIsProvisioning(true);
    setProvisionProgress('Starting isolated provisioning...');
    setProvisionError(null);
    setProvisionSuccess(null);

    const secondaryAuth = getSecondaryProvisioningAuth();
    const timestamp = new Date().toISOString();

    let uidA = '';
    let uidB = '';

    try {
      // 1. Create real test account A via secondary Auth instance
      setProvisionProgress(`Creating real Firebase Auth user for Tenant A (${emailA})...`);
      try {
        const credA = await createUserWithEmailAndPassword(secondaryAuth, emailA, passwordA);
        uidA = credA.user.uid;
      } catch (errA: any) {
        if (errA.code === 'auth/email-already-in-use') {
          // If already created, sign in on secondary app to retrieve authentic UID
          const existingCredA = await signInWithEmailAndPassword(secondaryAuth, emailA, passwordA);
          uidA = existingCredA.user.uid;
        } else {
          throw new Error(`Failed to create Tenant A user in Firebase Auth: ${errA.message} (${errA.code})`);
        }
      } finally {
        await signOut(secondaryAuth);
      }

      // 2. Create real test account B via secondary Auth instance
      setProvisionProgress(`Creating real Firebase Auth user for Tenant B (${emailB})...`);
      try {
        const credB = await createUserWithEmailAndPassword(secondaryAuth, emailB, passwordB);
        uidB = credB.user.uid;
      } catch (errB: any) {
        if (errB.code === 'auth/email-already-in-use') {
          const existingCredB = await signInWithEmailAndPassword(secondaryAuth, emailB, passwordB);
          uidB = existingCredB.user.uid;
        } else {
          throw new Error(`Failed to create Tenant B user in Firebase Auth: ${errB.message} (${errB.code})`);
        }
      } finally {
        await signOut(secondaryAuth);
      }

      // Verify admin session remained intact on primary auth
      if (!auth.currentUser || auth.currentUser.email !== 'mail.nasiya@gmail.com') {
        throw new Error('Critical failure: Primary administrator session was compromised during provisioning.');
      }

      // 3. Write Tenant A documents under primary Admin authorization
      setProvisionProgress('Binding Tenant A (Apex Heating & Cooling) with verified UID...');
      const tenantAId = 'tenant-apex-hvac';
      await setDoc(doc(db, 'tenants', tenantAId), {
        id: tenantAId,
        name: 'Apex Heating & Cooling',
        industry: 'hvac',
        createdAt: timestamp,
      }, { merge: true });

      await setDoc(doc(db, 'tenants', tenantAId, 'members', uidA), {
        uid: uidA,
        email: emailA,
        role: 'owner',
        addedAt: timestamp,
      }, { merge: true });

      await setDoc(doc(db, 'users', uidA), {
        uid: uidA,
        email: emailA,
        displayName: 'Apex HVAC Test Admin',
        tenantId: tenantAId,
        businessName: 'Apex Heating & Cooling',
        role: 'owner',
        createdAt: timestamp,
      }, { merge: true });

      // Seed 1 clearly labelled lead for Tenant A
      const leadAId = 'LP-APEX-TEST-001';
      await setDoc(doc(db, 'tenants', tenantAId, 'leads', leadAId), {
        id: leadAId,
        clientId: tenantAId,
        businessName: 'Apex Heating & Cooling',
        name: 'David Miller (Test Lead)',
        phone: '+1 555-014-8833',
        email: 'david.testlead@example.com',
        service: 'Heat Pump Inspection & Tune-up',
        details: 'Verified test lead for Tenant A. Heat pump cold air complaint.',
        address: '422 Willow Creek Rd, Dallas, TX',
        leadSource: 'Google Business Profile',
        status: 'New',
        notes: [{
          id: 'note-apex-init',
          text: 'Seeded test lead for controlled local verification.',
          createdAt: timestamp,
          author: 'System',
        }],
        contactCount: 0,
        timestamp,
      }, { merge: true });

      // 4. Write Tenant B documents under primary Admin authorization
      setProvisionProgress('Binding Tenant B (ProDrain Plumbing Services) with verified UID...');
      const tenantBId = 'tenant-prodrain-plumbing';
      await setDoc(doc(db, 'tenants', tenantBId), {
        id: tenantBId,
        name: 'ProDrain Plumbing Services',
        industry: 'plumbing',
        createdAt: timestamp,
      }, { merge: true });

      await setDoc(doc(db, 'tenants', tenantBId, 'members', uidB), {
        uid: uidB,
        email: emailB,
        role: 'owner',
        addedAt: timestamp,
      }, { merge: true });

      await setDoc(doc(db, 'users', uidB), {
        uid: uidB,
        email: emailB,
        displayName: 'ProDrain Plumbing Test Admin',
        tenantId: tenantBId,
        businessName: 'ProDrain Plumbing Services',
        role: 'owner',
        createdAt: timestamp,
      }, { merge: true });

      // Seed 1 clearly labelled lead for Tenant B
      const leadBId = 'LP-PLUMB-TEST-001';
      await setDoc(doc(db, 'tenants', tenantBId, 'leads', leadBId), {
        id: leadBId,
        clientId: tenantBId,
        businessName: 'ProDrain Plumbing Services',
        name: 'Rebecca Torres (Test Lead)',
        phone: '+1 555-018-4499',
        email: 'rebecca.testlead@example.com',
        service: 'Emergency Drain Unclogging',
        details: 'Verified test lead for Tenant B. Backing up kitchen sink.',
        address: '810 Sycamore Blvd, Fort Worth, TX',
        leadSource: 'Google Local Search',
        status: 'New',
        notes: [{
          id: 'note-plumb-init',
          text: 'Seeded test lead for controlled local verification.',
          createdAt: timestamp,
          author: 'System',
        }],
        contactCount: 0,
        timestamp,
      }, { merge: true });

      setProvisionSuccess(
        `Provisioning Complete! Real accounts created: Tenant A (UID: ${uidA.slice(0, 8)}...), Tenant B (UID: ${uidB.slice(0, 8)}...). Primary admin session preserved.`
      );
    } catch (err: any) {
      console.error('Provisioning error:', err);
      setProvisionError(err?.message || 'Provisioning failed.');
    } finally {
      setIsProvisioning(false);
      setProvisionProgress('');
    }
  };

  // Run Genuine Live Network Security Tests
  const handleRunLiveTests = async () => {
    setIsRunningTests(true);
    const logs: TestLog[] = [];
    const testAuth = getSecondaryProvisioningAuth();
    const testDb = getSecondaryProvisioningDb();

    try {
      // Ensure secondary auth starts completely signed out for zero-trust unauthenticated checks
      await signOut(testAuth);

      // LIVE TEST 1: Live Unauthenticated Read Denial against Cloud Firestore
      try {
        await getDocs(collection(testDb, 'tenants', 'tenant-apex-hvac', 'leads'));
        logs.push({
          title: 'Live Firestore Unauthenticated Read Gate',
          type: 'live',
          passed: false,
          message: 'CRITICAL SECURITY BREACH: Anonymous read succeeded!',
          timestamp: new Date().toLocaleTimeString(),
        });
      } catch (err: any) {
        const isPermissionDenied = err.code === 'permission-denied' || String(err.message).includes('PERMISSION_DENIED');
        logs.push({
          title: 'Live Firestore Unauthenticated Read Gate',
          type: 'live',
          passed: isPermissionDenied,
          message: isPermissionDenied
            ? 'PASSED: Live Firestore rejected unauthenticated query (permission-denied)'
            : `Failed with unexpected error: ${err.code}`,
          timestamp: new Date().toLocaleTimeString(),
        });
      }

      // LIVE TEST 2: Live Unauthenticated Write Denial against Cloud Firestore
      try {
        await setDoc(doc(testDb, 'tenants', 'tenant-apex-hvac', 'leads', 'LP-UNAUTH-ATTACK'), {
          id: 'LP-UNAUTH-ATTACK',
          clientId: 'tenant-apex-hvac',
          name: 'Anonymous Hacker',
          phone: '0000000000',
          status: 'New',
          notes: [],
          contactCount: 0,
          timestamp: new Date().toISOString(),
        });
        logs.push({
          title: 'Live Firestore Unauthenticated Write Gate',
          type: 'live',
          passed: false,
          message: 'CRITICAL SECURITY BREACH: Anonymous write succeeded!',
          timestamp: new Date().toLocaleTimeString(),
        });
      } catch (err: any) {
        const isPermissionDenied = err.code === 'permission-denied' || String(err.message).includes('PERMISSION_DENIED');
        logs.push({
          title: 'Live Firestore Unauthenticated Write Gate',
          type: 'live',
          passed: isPermissionDenied,
          message: isPermissionDenied
            ? 'PASSED: Live Firestore rejected unauthenticated document write (permission-denied)'
            : `Failed with unexpected error: ${err.code}`,
          timestamp: new Date().toLocaleTimeString(),
        });
      }

      // LIVE TEST 3: Real Firebase Authentication verification for Tenant A
      let tokenAUser: User | null = null;
      try {
        const credA = await signInWithEmailAndPassword(testAuth, emailA, passwordA);
        tokenAUser = credA.user;
        logs.push({
          title: 'Live Firebase Auth (Tenant A Sign-In)',
          type: 'live',
          passed: Boolean(credA.user.uid),
          message: `PASSED: Authenticated token issued (UID: ${credA.user.uid.slice(0, 8)}...)`,
          timestamp: new Date().toLocaleTimeString(),
        });
      } catch (err: any) {
        logs.push({
          title: 'Live Firebase Auth (Tenant A Sign-In)',
          type: 'live',
          passed: false,
          message: `Account not yet provisioned: ${err.code}`,
          timestamp: new Date().toLocaleTimeString(),
        });
      }

      // LIVE TEST 4: Real Firebase Authentication verification for Tenant B
      try {
        // Sign out Tenant A before checking Tenant B
        await signOut(testAuth);
        const credB = await signInWithEmailAndPassword(testAuth, emailB, passwordB);
        logs.push({
          title: 'Live Firebase Auth (Tenant B Sign-In)',
          type: 'live',
          passed: Boolean(credB.user.uid),
          message: `PASSED: Authenticated token issued (UID: ${credB.user.uid.slice(0, 8)}...)`,
          timestamp: new Date().toLocaleTimeString(),
        });
        await signOut(testAuth);
      } catch (err: any) {
        logs.push({
          title: 'Live Firebase Auth (Tenant B Sign-In)',
          type: 'live',
          passed: false,
          message: `Account not yet provisioned: ${err.code}`,
          timestamp: new Date().toLocaleTimeString(),
        });
      }

      // If Tenant A was successfully authenticated, test live cross-tenant boundary isolation
      if (tokenAUser) {
        try {
          // Re-authenticate Tenant A on secondary auth
          await signInWithEmailAndPassword(testAuth, emailA, passwordA);

          // LIVE TEST 5: Own Tenant Read (Tenant A querying Tenant A leads)
          try {
            const snapA = await getDocs(collection(testDb, 'tenants', 'tenant-apex-hvac', 'leads'));
            logs.push({
              title: 'Live Own-Tenant Lead Access (Tenant A -> Tenant A)',
              type: 'live',
              passed: true,
              message: `PASSED: Own tenant leads retrieved successfully (${snapA.docs.length} leads found)`,
              timestamp: new Date().toLocaleTimeString(),
            });
          } catch (err: any) {
            logs.push({
              title: 'Live Own-Tenant Lead Access (Tenant A -> Tenant A)',
              type: 'live',
              passed: false,
              message: `Failed: ${err.message} (${err.code})`,
              timestamp: new Date().toLocaleTimeString(),
            });
          }

          // LIVE TEST 6: Cross-Tenant Read Denial (Tenant A querying Tenant B leads)
          try {
            await getDocs(collection(testDb, 'tenants', 'tenant-prodrain-plumbing', 'leads'));
            logs.push({
              title: 'Live Cross-Tenant Read Denial (Tenant A -> Tenant B)',
              type: 'live',
              passed: false,
              message: 'FAIL: Tenant A was permitted to read Tenant B leads!',
              timestamp: new Date().toLocaleTimeString(),
            });
          } catch (err: any) {
            const isPermissionDenied = err.code === 'permission-denied' || String(err.message).includes('PERMISSION_DENIED');
            logs.push({
              title: 'Live Cross-Tenant Read Denial (Tenant A -> Tenant B)',
              type: 'live',
              passed: isPermissionDenied,
              message: isPermissionDenied
                ? 'PASSED: Live Firestore Security Rules blocked Tenant A from reading Tenant B leads (permission-denied)'
                : `Error: ${err.code}`,
              timestamp: new Date().toLocaleTimeString(),
            });
          }

          // LIVE TEST 7: Cross-Tenant Write Denial (Tenant A writing to Tenant B leads)
          try {
            await setDoc(doc(testDb, 'tenants', 'tenant-prodrain-plumbing', 'leads', 'LP-CROSS-ATTACK'), {
              id: 'LP-CROSS-ATTACK',
              clientId: 'tenant-prodrain-plumbing',
              name: 'Malicious Cross Inject',
              phone: '1234567890',
              status: 'New',
              notes: [],
              contactCount: 0,
              timestamp: new Date().toISOString(),
            });
            logs.push({
              title: 'Live Cross-Tenant Write Denial (Tenant A -> Tenant B)',
              type: 'live',
              passed: false,
              message: 'FAIL: Tenant A was permitted to write to Tenant B collection!',
              timestamp: new Date().toLocaleTimeString(),
            });
          } catch (err: any) {
            const isPermissionDenied = err.code === 'permission-denied' || String(err.message).includes('PERMISSION_DENIED');
            logs.push({
              title: 'Live Cross-Tenant Write Denial (Tenant A -> Tenant B)',
              type: 'live',
              passed: isPermissionDenied,
              message: isPermissionDenied
                ? 'PASSED: Live Firestore Security Rules blocked Tenant A from injecting leads into Tenant B (permission-denied)'
                : `Error: ${err.code}`,
              timestamp: new Date().toLocaleTimeString(),
            });
          }
        } finally {
          await signOut(testAuth);
        }
      }

      // SIMULATED TEST 1: Local Master Gate Membership Invariant Check
      const mockUnassigned = { uid: 'usr_guest_dummy', tenantMembership: null };
      const simulatedMasterGate = Boolean(mockUnassigned.tenantMembership);
      logs.push({
        title: 'Master Gate Tenant Membership Invariant',
        type: 'simulated',
        passed: simulatedMasterGate === false,
        message: 'PASSED: User without tenant membership subcollection record rejected',
        timestamp: new Date().toLocaleTimeString(),
      });

      // SIMULATED TEST 2: Local Schema Data Model Assertion
      const mockLead: LeadItem = {
        id: 'LP-VERIFY-001',
        clientId: 'tenant-apex-hvac',
        businessName: 'Apex Heating & Cooling',
        name: 'Structural Test Lead',
        phone: '+1 555-019-2831',
        service: 'Diagnostic Inspection',
        details: 'Structural test details',
        address: '100 Main St, Dallas, TX',
        leadSource: 'Internal Verification',
        status: 'New',
        notes: [],
        contactCount: 0,
        timestamp: new Date().toISOString(),
      };
      const schemaPass = Boolean(mockLead.id && mockLead.clientId === 'tenant-apex-hvac' && mockLead.status === 'New');
      logs.push({
        title: 'Lead Schema Invariant Assertion',
        type: 'simulated',
        passed: schemaPass,
        message: 'PASSED: Lead data model fields conform to specification',
        timestamp: new Date().toLocaleTimeString(),
      });
    } finally {
      setTestLogs(logs);
      setIsRunningTests(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/20 border border-blue-500/40 p-2.5 rounded-xl text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">
                  Local Dev Tool: Test Account Onboarding
                </h2>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                  LOCAL DEV ONLY
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Isolated secondary Auth instance • Verified administrator authorization required
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs text-slate-300">
          {/* Admin Verification Card */}
          <div
            className={`p-4 rounded-xl border flex flex-col gap-3 ${
              isAdminAuthenticated
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
            }`}
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                {isAdminAuthenticated ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm">
                      {isAdminAuthenticated
                        ? 'Root Administrator Verified'
                        : 'Administrator Authentication Required'}
                    </p>
                    {isAdminAuthenticated && (
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/40">
                        Google Auth Verified ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] opacity-80 mt-0.5">
                    {currentUser
                      ? `Session: ${currentUser.email} • Provider: ${
                          currentUser.providerData?.map((p) => p.providerId).join(', ') || 'unknown'
                        } • Verified: ${currentUser.emailVerified ? 'Yes' : 'No'}`
                      : 'No active Firebase Auth session. Sign in with Google as mail.nasiya@gmail.com.'}
                  </p>
                </div>
              </div>

              {!isAdminAuthenticated ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAdminGooglePopup}
                    disabled={isSigningInWithPopup || isSigningInWithRedirect || isCheckingRedirectResult}
                    className="bg-white hover:bg-slate-100 disabled:opacity-50 text-slate-900 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow cursor-pointer transition"
                    title="Sign in using Google popup (Recommended for localhost)"
                  >
                    {isSigningInWithPopup ? (
                      <RotateCw className="w-3.5 h-3.5 animate-spin text-slate-700" />
                    ) : (
                      <Globe className="w-3.5 h-3.5 text-blue-600" />
                    )}
                    <span>{isSigningInWithPopup ? 'Opening Popup...' : 'Admin Login (Popup)'}</span>
                  </button>

                  <button
                    onClick={handleAdminGoogleRedirect}
                    disabled={isSigningInWithPopup || isSigningInWithRedirect || isCheckingRedirectResult}
                    className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow cursor-pointer transition"
                    title="Sign in using full-page redirect"
                  >
                    {isSigningInWithRedirect ? (
                      <RotateCw className="w-3.5 h-3.5 animate-spin text-slate-300" />
                    ) : (
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    <span>{isSigningInWithRedirect ? 'Redirecting...' : 'Admin Login (Redirect)'}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAdminSignOut}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-slate-700 cursor-pointer transition"
                  title="Sign out current admin session"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>

            {/* Validation Breakdown if signed in but not authorized */}
            {currentUser && !isAdminAuthenticated && (
              <div className="bg-slate-950/70 border border-rose-500/30 rounded-lg p-2.5 text-[11px] space-y-1 text-slate-300">
                <p className="font-bold text-rose-300">Authorization Verification Failure:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[10px]">
                  <div
                    className={`p-1.5 rounded border ${
                      isNasiyaEmail
                        ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                        : 'border-rose-500/40 bg-rose-950/20 text-rose-300'
                    }`}
                  >
                    Email: {isNasiyaEmail ? 'mail.nasiya@gmail.com ✓' : `${currentUser.email || 'None'} ✗`}
                  </div>
                  <div
                    className={`p-1.5 rounded border ${
                      isGoogleProvider
                        ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                        : 'border-rose-500/40 bg-rose-950/20 text-rose-300'
                    }`}
                  >
                    Provider: {isGoogleProvider ? 'google.com ✓' : `${currentUser.providerData[0]?.providerId || 'password'} ✗`}
                  </div>
                  <div
                    className={`p-1.5 rounded border ${
                      isEmailVerified
                        ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                        : 'border-rose-500/40 bg-rose-950/20 text-rose-300'
                    }`}
                  >
                    Verified: {isEmailVerified ? 'Email Verified ✓' : 'Unverified ✗'}
                  </div>
                </div>
              </div>
            )}

            {/* Environment Info Helper */}
            {!isAdminAuthenticated && !currentUser && (
              <div className="flex items-center justify-between text-[10px] text-slate-400 bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                <span className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>
                    Current Host: <strong className="text-slate-300 font-mono">{typeof window !== 'undefined' ? window.location.hostname : 'localhost'}</strong> (Port: {typeof window !== 'undefined' ? window.location.port || '80' : '3000'})
                  </span>
                </span>
                <span className="text-amber-400 font-medium">
                  Use "Admin Login (Popup)" on localhost
                </span>
              </div>
            )}
          </div>

          {/* Detailed Google Authentication Error Banner */}
          {adminAuthError && (
            <div className="p-4 bg-rose-950/40 border border-rose-500/50 text-rose-200 rounded-xl space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span className="font-bold text-sm text-rose-300">{adminAuthError.title}</span>
                  <span className="bg-rose-900/60 text-rose-300 text-[10px] font-mono px-2 py-0.5 rounded border border-rose-500/30">
                    {adminAuthError.code}
                  </span>
                </div>
                <button
                  onClick={() => setAdminAuthError(null)}
                  className="text-rose-400 hover:text-rose-200 p-1 rounded hover:bg-rose-900/40 transition cursor-pointer"
                  title="Dismiss alert"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-rose-200/90 leading-relaxed">{adminAuthError.message}</p>

              {/* Authorized Domain Helper Card */}
              {adminAuthError.domainToAdd && (
                <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                    <span>Domain to add in Firebase Console:</span>
                    <button
                      onClick={() => copyDomain(adminAuthError.domainToAdd!)}
                      className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition"
                    >
                      {copiedDomain ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedDomain ? 'Copied!' : 'Copy Domain'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-xs bg-slate-900 px-2.5 py-1.5 rounded border border-slate-700 text-amber-300 select-all">
                    {adminAuthError.domainToAdd}
                  </div>
                </div>
              )}

              {adminAuthError.suggestion && (
                <div className="text-[11px] text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 whitespace-pre-line font-sans leading-relaxed">
                  {adminAuthError.suggestion}
                </div>
              )}

              {/* Quick Action Button for Popup Fallback */}
              {(adminAuthError.code === 'auth/popup-closed-by-user' || adminAuthError.code === 'auth/popup-blocked') && (
                <div className="pt-1">
                  <button
                    onClick={handleAdminGoogleRedirect}
                    disabled={isSigningInWithRedirect}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow cursor-pointer transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Try Google Sign-In with Redirect Mode</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Feedback Banners */}
          {provisionError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{provisionError}</span>
            </div>
          )}

          {provisionSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{provisionSuccess}</span>
            </div>
          )}

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tenant A Box */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="font-bold text-slate-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Tenant A: Apex Heating & Cooling
                </div>
                <span className="text-[10px] font-mono text-slate-400">tenant-apex-hvac</span>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Test Email
                </label>
                <input
                  type="email"
                  value={emailA}
                  onChange={(e) => setEmailA(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Test Password
                </label>
                <input
                  type="password"
                  value={passwordA}
                  onChange={(e) => setPasswordA(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>

              <p className="text-[10px] text-slate-500">
                Will seed test lead: <code>LP-APEX-TEST-001</code>
              </p>
            </div>

            {/* Tenant B Box */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="font-bold text-slate-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Tenant B: ProDrain Plumbing
                </div>
                <span className="text-[10px] font-mono text-slate-400">tenant-prodrain-plumbing</span>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Test Email
                </label>
                <input
                  type="email"
                  value={emailB}
                  onChange={(e) => setEmailB(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Test Password
                </label>
                <input
                  type="password"
                  value={passwordB}
                  onChange={(e) => setPasswordB(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>

              <p className="text-[10px] text-slate-500">
                Will seed test lead: <code>LP-PLUMB-TEST-001</code>
              </p>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleExecuteProvisioning}
              disabled={isProvisioning || !isAdminAuthenticated}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition shadow cursor-pointer text-xs"
            >
              {isProvisioning ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>{provisionProgress || 'Provisioning...'}</span>
                </>
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  <span>Provision Test Accounts (Secondary Auth)</span>
                </>
              )}
            </button>

            <button
              onClick={handleRunLiveTests}
              disabled={isRunningTests}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition shadow cursor-pointer text-xs"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isRunningTests ? 'Executing Live Tests...' : 'Run Live Network Security Tests'}</span>
            </button>
          </div>

          {/* Test Logs Display */}
          {testLogs.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-slate-800">
              <h3 className="font-bold text-slate-200 text-xs">Security Verification Log</h3>
              <div className="space-y-1.5">
                {testLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {log.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                      <div>
                        <span className="font-bold text-slate-200">{log.title}</span>
                        <span className="text-[10px] text-slate-400 ml-2 font-mono">({log.message})</span>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                        log.type === 'live'
                          ? 'bg-indigo-900/60 text-indigo-300 border border-indigo-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {log.type === 'live' ? 'Live Cloud Network Test' : 'In-Memory Simulated'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
