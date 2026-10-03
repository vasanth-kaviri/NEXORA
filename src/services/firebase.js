import { initializeApp, getApps, getApp } from 'firebase/app';
// getDatabase decommissioned - RTDB replaced with MongoDB REST endpoints
import { getAuth } from 'firebase/auth';

/**
 * Firebase Client Configuration
 * Falls back gracefully when credentials are missing/invalid (local mock mode).
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = () =>
  Boolean(
    firebaseConfig.apiKey &&
    !String(firebaseConfig.apiKey).toLowerCase().includes('demo')
  );

// Safe singleton - never crashes the app on bad/missing credentials
let app = null;
const rtdb = null; // RTDB decommissioned
let auth = null;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  // RTDB removed to eliminate '@firebase/database: FIREBASE WARNING'
  auth = getAuth(app);
} catch (err) {
  console.warn('[NEXORA] Firebase init failed - running in local mock mode:', err && err.message);
}

export { app, rtdb, auth, firebaseConfig };
export default rtdb;
