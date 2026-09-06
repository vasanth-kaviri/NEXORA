import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

/**
 * Firebase Realtime Database Client Configuration
 * Supports environment variables with graceful fallback defaults.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoNEXORAPlatformKey2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nexora-career.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://nexora-career-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nexora-career",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nexora-career.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "104857600000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:104857600000:web:nexora990f1"
};

// Singleton App Initialization
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const rtdb = getDatabase(app);
const auth = getAuth(app);

export const isFirebaseConfigured = () => {
  return Boolean(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_DATABASE_URL
  );
};

export { app, rtdb, auth, firebaseConfig };
export default rtdb;
