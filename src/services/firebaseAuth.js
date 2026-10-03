import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth, rtdb, isFirebaseConfigured } from './firebase';
import db from './db';
import { set, ref } from 'firebase/database';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Firebase Authentication Service
 * All methods gracefully fall back when Firebase is not configured.
 */
export const firebaseAuth = {
  _ok() { return Boolean(auth) && isFirebaseConfigured(); },

  async loginWithGoogle() {
    if (!this._ok()) {
      return { success: false, error: 'Firebase is not configured. Use email/password login.' };
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const profile = {
        email: user.email,
        firstName: user.displayName ? user.displayName.split(' ')[0] : 'Google',
        lastName: user.displayName ? user.displayName.split(' ').slice(1).join(' ') : 'User',
        avatar: user.photoURL || ('https://api.dicebear.com/7.x/bottts/svg?seed=' + user.email),
        dreamJob: 'Software Engineer',
        authProvider: 'google',
        uid: user.uid
      };
      try { db.createOrUpdateUser(profile); } catch (_) {}
      if (rtdb) {
        try { await set(ref(rtdb, 'users/' + user.uid + '/profile'), { ...profile, updatedAt: new Date().toISOString() }); } catch (_) {}
      }
      return { success: true, user: profile };
    } catch (err) {
      console.warn('[FirebaseAuth] Google sign-in failed:', err.message);
      if (err.code === 'auth/popup-closed-by-user') return { success: false, error: 'Sign-in cancelled.' };
      if (err.code === 'auth/network-request-failed') return { success: false, error: 'Network error. Check your connection.' };
      return { success: false, error: 'Authentication failed. Please try again.' };
    }
  },

  async loginWithEmail(email, password) {
    if (!this._ok()) return { success: false, error: 'Firebase is not configured. Use local login.' };
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: { email: result.user.email, uid: result.user.uid } };
    } catch (err) {
      console.warn('[FirebaseAuth] Email login failed:', err.code);
      return { success: false, error: 'Invalid credentials.' };
    }
  },

  async registerWithEmail(email, password, displayName) {
    if (!this._ok()) return { success: false, error: 'Firebase is not configured.' };
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) await updateProfile(result.user, { displayName });
      return { success: true, user: { email: result.user.email, uid: result.user.uid } };
    } catch (err) {
      console.warn('[FirebaseAuth] Register failed:', err.code);
      if (err.code === 'auth/email-already-in-use') return { success: false, error: 'An account with this email already exists.' };
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  },

  async signupWithEmail(email, password, displayName) {
    return this.registerWithEmail(email, password, displayName);
  },

  async sendPasswordReset(email) {
    if (!this._ok()) return { success: false, error: 'Firebase is not configured.' };
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (err) {
      console.warn('[FirebaseAuth] Password reset failed:', err.code);
      return { success: false, error: 'Could not send reset email.' };
    }
  },

  async logout() {
    if (!auth) return { success: true };
    try { await signOut(auth); return { success: true }; }
    catch (err) { return { success: false, error: err.message }; }
  },

  getCurrentUser() {
    if (!auth) return null;
    return auth.currentUser;
  }
};

export default firebaseAuth;
