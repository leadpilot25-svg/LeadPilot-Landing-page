import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

async function main() {
  console.log('=== LEADPILOT LIVE FIREBASE AUDIT ===');
  console.log('Target Project:', firebaseConfig.projectId);
  console.log('Target Firestore DB:', firebaseConfig.firestoreDatabaseId);

  const app = initializeApp(firebaseConfig, 'TestAuditApp');
  const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  const auth = getAuth(app);

  // 1. Live Unauthenticated Read Attempt
  console.log('\n[TEST 1] Live Unauthenticated Read: /tenants/tenant-apex-hvac/leads');
  try {
    const snap = await getDocs(collection(db, 'tenants', 'tenant-apex-hvac', 'leads'));
    console.log('FAIL: Unauthenticated read was allowed! Returned docs:', snap.docs.length);
  } catch (err: any) {
    console.log('SUCCESS: Live Firestore rejected unauthenticated read.');
    console.log('Error Code:', err.code);
    console.log('Error Message:', err.message);
  }

  // 2. Live Unauthenticated Write Attempt
  console.log('\n[TEST 2] Live Unauthenticated Write: /tenants/tenant-apex-hvac/leads/UNAUTH_TAMPER');
  try {
    await setDoc(doc(db, 'tenants', 'tenant-apex-hvac', 'leads', 'UNAUTH_TAMPER'), {
      id: 'UNAUTH_TAMPER',
      name: 'Tamper Attacker',
      clientId: 'tenant-apex-hvac',
    });
    console.log('FAIL: Unauthenticated write was allowed!');
  } catch (err: any) {
    console.log('SUCCESS: Live Firestore rejected unauthenticated write.');
    console.log('Error Code:', err.code);
    console.log('Error Message:', err.message);
  }

  // 3. Live Firebase Auth Check for Test Accounts
  console.log('\n[TEST 3] Check real Firebase Auth status for test accounts');
  try {
    await signInWithEmailAndPassword(auth, 'apex.test@example.com', 'DummyTestPassword123!');
    console.log('Account apex.test@example.com already exists!');
  } catch (err: any) {
    console.log('Firebase Auth response for apex.test@example.com:', err.code, err.message);
  }

  try {
    await signInWithEmailAndPassword(auth, 'plumbing.test@example.com', 'DummyTestPassword123!');
    console.log('Account plumbing.test@example.com already exists!');
  } catch (err: any) {
    console.log('Firebase Auth response for plumbing.test@example.com:', err.code, err.message);
  }

  console.log('\n=== AUDIT COMPLETE ===');
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
