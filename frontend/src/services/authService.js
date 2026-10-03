import firebaseAuth from './firebaseAuth';
import db from './db';
import securityService from './securityService';
import apiClient from './apiClient';
import { validateEmail } from '../utils/validators';

/**
 * Unified Authentication Gateway for NEXORA.
 * Enforces application security standards:
 * - Single Source of Truth in MongoDB (No split-brain local DB fallback)
 * - Error Sanitization
 * - Session State Management
 * - Account Verification Lock
 */
export const authService = {
  /**
   * Logs in a user via email/phone and password through the secure backend API.
   */
  async login(contact, password, extraData = {}) {
    if (!contact || !password) {
      return { success: false, error: 'Please provide both email/phone and password.' };
    }

    try {
      const cleanContact = typeof contact === 'string' ? contact.trim() : '';
      const rawCode = (extraData.countryCode || '+91').trim();
      const countryCode = rawCode.startsWith('+') ? rawCode : `+${rawCode}`;

      const payload = {
        password,
        countryCode
      };

      if (cleanContact.includes('@')) {
        payload.contact = cleanContact.toLowerCase();
        payload.email = cleanContact.toLowerCase();
      } else {
        const sanitized = cleanContact.replace(/[\s\-\(\)]/g, '');
        const pureDigits = sanitized.replace(/\D/g, '').slice(-10);
        const e164 = sanitized.startsWith('+') ? sanitized : `${countryCode}${pureDigits}`;
        payload.contact = e164;
        payload.phone = pureDigits;
      }

      const res = await apiClient.post('/api/v1/auth/login', payload);

      if (!res.success) {
        return {
          success: false,
          error: res.error || 'Authentication failed. Please check your credentials.'
        };
      }

      const authData = res.data?.data || res.data;
      const accessToken = authData?.accessToken || res.data?.accessToken;
      const refreshToken = authData?.refreshToken || res.data?.refreshToken;
      const user = authData?.user || res.data?.user;

      if (accessToken) {
        apiClient.setActiveBearerToken(accessToken);
        try {
          localStorage.setItem('nexora_token', accessToken);
        } catch {
          // Ignored
        }
      }

      if (refreshToken) {
        try {
          localStorage.setItem('nexora_refresh_token', refreshToken);
        } catch {
          // Ignored
        }
      }

      if (user) {
        const normalizedUser = {
          ...user,
          id: user._id || user.id
        };
        const sessionData = {
          token: accessToken,
          accessToken,
          user: normalizedUser,
          id: normalizedUser.id,
          email: normalizedUser.email,
          phone: normalizedUser.phone,
          role: normalizedUser.role,
          isVerified: normalizedUser.isVerified
        };
        try {
          localStorage.setItem('nexora_user', JSON.stringify(normalizedUser));
          localStorage.setItem('nexora_session', JSON.stringify(sessionData));
        } catch {
          // Ignored
        }
        db.setCurrentUser(normalizedUser);
        window.dispatchEvent(new Event('user_session_changed'));
        return { success: true, user: normalizedUser, accessToken, refreshToken };
      }

      return { success: false, error: 'Invalid response from authentication server.' };
    } catch (err) {
      return {
        success: false,
        error: securityService.sanitizeAuthError(err, 'login')
      };
    }
  },

  /**
   * Registers a new student account via backend API.
   * Single Source of Truth: Does NOT silently fall back to local DB.
   * Strips UI-only fields (confirmPassword) before transmission.
   */
  async signup({ contact, password, displayName = '', contactType = 'email', extraData = {} }) {
    if (!contact || !password) {
      return { success: false, error: 'Contact and password are required.' };
    }

    try {
      let res;
      if (contactType === 'email') {
        const payload = {
          email: contact.trim().toLowerCase(),
          password,
          ...(displayName ? { name: displayName.trim() } : {})
        };
        res = await apiClient.post('/api/v1/auth/signup/email', payload);
      } else {
        const countryCode = extraData.countryCode || '+91';
        const cleanPhone = contact.replace(/\D/g, '').slice(-10);
        const payload = {
          phone: cleanPhone,
          countryCode,
          password,
          channel: extraData.channel || 'sms',
          ...(displayName ? { name: displayName.trim() } : {})
        };
        res = await apiClient.post('/api/v1/auth/signup/phone', payload);
      }

      if (!res.success) {
        return {
          success: false,
          error: res.error || 'Unable to complete registration with the provided details.'
        };
      }

      const signupData = res.data?.data;
      if (signupData?.debugOtp) {
        try { sessionStorage.setItem('nexora_active_debug_otp', signupData.debugOtp); } catch {}
      }

      return {
        success: true,
        data: signupData,
        message: res.data?.message || 'Account created successfully. Please verify your contact.'
      };
    } catch (err) {
      return {
        success: false,
        error: securityService.sanitizeAuthError(err, 'signup')
      };
    }
  },

  /**
   * Centralized OTP verification with backend API.
   * Commits verification state, stores JWT tokens, and initializes session.
   */
  async verifyOtp({ contact, phone, email, otp, userId }) {
    if (!otp) {
      return { success: false, error: 'Verification code is required.' };
    }

    try {
      const rawContact = contact || phone || email || '';
      const cleanContact = typeof rawContact === 'string' ? rawContact.trim().replace(/[\s\-]/g, '') : '';
      const payload = {
        otp: String(otp).trim(),
        ...(cleanContact ? { contact: cleanContact } : {}),
        ...(userId ? { userId } : {})
      };

      const res = await apiClient.post('/api/v1/auth/verify/otp', payload);
      if (!res.success) {
        return {
          success: false,
          error: res.error || 'Verification failed. Please check your verification code.'
        };
      }

      const authData = res.data?.data;
      const accessToken = authData?.accessToken;
      const refreshToken = authData?.refreshToken;
      const user = authData?.user;

      if (accessToken) {
        apiClient.setActiveBearerToken(accessToken);
        try {
          localStorage.setItem('nexora_token', accessToken);
        } catch {
          // Ignored
        }
      }

      if (refreshToken) {
        try {
          localStorage.setItem('nexora_refresh_token', refreshToken);
        } catch {
          // Ignored
        }
      }

      if (user) {
        const normalizedUser = {
          ...user,
          id: user._id || user.id,
          isVerified: true
        };
        const sessionData = {
          token: accessToken,
          accessToken,
          user: normalizedUser,
          id: normalizedUser.id,
          email: normalizedUser.email,
          phone: normalizedUser.phone,
          role: normalizedUser.role,
          isVerified: true
        };
        try {
          localStorage.setItem('nexora_user', JSON.stringify(normalizedUser));
          localStorage.setItem('nexora_session', JSON.stringify(sessionData));
        } catch {
          // Ignored
        }
        db.setCurrentUser(normalizedUser);
        window.dispatchEvent(new Event('user_session_changed'));
        return { success: true, user: normalizedUser, accessToken, refreshToken };
      }

      return { success: true, message: res.data?.message };
    } catch (err) {
      return {
        success: false,
        error: err.message || 'Verification service error. Please try again.'
      };
    }
  },

  /**
   * Dispatches a request to resend the verification code.
   */
  async resendOtp({ contact, phone, email, userId, channel = 'sms' }) {
    try {
      const rawContact = contact || phone || email || '';
      const cleanContact = typeof rawContact === 'string' ? rawContact.trim().replace(/[\s\-]/g, '') : '';
      const payload = {
        ...(userId ? { userId } : {}),
        ...(cleanContact ? { contact: cleanContact } : {}),
        channel
      };
      const res = await apiClient.post('/api/v1/auth/resend-otp', payload);
      const debugOtp = res.data?.data?.debugOtp;
      if (debugOtp) {
        try { sessionStorage.setItem('nexora_active_debug_otp', debugOtp); } catch {}
      }
      return {
        success: res.success,
        data: res.data?.data,
        message: res.data?.message || (res.success ? 'Verification code resent.' : res.error)
      };
    } catch (err) {
      return { success: false, message: err.message || 'Failed to resend verification code.' };
    }
  },

  /**
   * Google OAuth popup sign-in
   */
  async loginWithGoogle() {
    try {
      const result = await firebaseAuth.loginWithGoogle();
      return result;
    } catch (err) {
      return { success: false, error: securityService.sanitizeAuthError(err, 'login') };
    }
  },

  /**
   * Custom Google sign-in demo switcher
   */
  loginWithCustomGoogle(account) {
    try {
      const user = firebaseAuth.loginWithCustomGoogle(account);
      return { success: true, user };
    } catch (err) {
      return { success: false, error: securityService.sanitizeAuthError(err, 'login') };
    }
  },

  /**
   * Sends password reset email and registers single-use recovery token
   */
  async sendPasswordReset(email) {
    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      return { success: false, error: emailCheck.error };
    }

    try {
      // 1. Dispatch to backend API
      const res = await apiClient.post('/api/v1/auth/forgot-password', {
        contact: email.trim()
      });

      // Timing-attack enumeration safe response
      return {
        success: true,
        message: res.data?.message || securityService.sanitizeAuthError(null, 'reset')
      };
    } catch {
      return {
        success: true,
        message: securityService.sanitizeAuthError(null, 'reset')
      };
    }
  },

  /**
   * Verifies an account via OTP or email confirmation.
   * Flips isVerified to true and grants full workspace access.
   */
  verifyUserAccount(userIdOrContact) {
    const user = db.verifyUser(userIdOrContact);
    if (user) {
      securityService.logSecurityEvent('ACCOUNT_VERIFIED', {
        id: user.id,
        email: user.email,
        phone: user.phone
      });
      return { success: true, user };
    }
    return { success: false, error: 'Could not verify account.' };
  },

  /**
   * Changes account password via verified reset token.
   */
  async resetPasswordWithToken(token, newPassword) {
    try {
      const res = await apiClient.post('/api/v1/auth/reset-password', {
        token,
        password: newPassword
      });
      if (res.success) {
        return { success: true, message: res.data?.message || 'Password reset successfully.' };
      }
      return { success: false, error: res.error || 'Password reset failed.' };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to reset password.' };
    }
  },

  /**
   * Checks if the active user is verified.
   */
  isUserVerified(user = null) {
    const target = user || this.getCurrentUser();
    if (!target) return false;
    return Boolean(target.isVerified);
  },

  /**
   * Current active session user
   */
  getCurrentUser() {
    return db.getCurrentUser();
  },

  /**
   * Signs out current user and revokes active session
   */
  async logout() {
    try {
      await apiClient.post('/api/v1/auth/logout', {});
    } catch {
      // Ignored
    }
    try {
      await firebaseAuth.logout();
    } catch {
      // Ignored
    }
    apiClient.setActiveBearerToken(null);
    try {
      localStorage.removeItem('nexora_token');
      localStorage.removeItem('nexora_refresh_token');
      localStorage.removeItem('nexora_user');
      localStorage.removeItem('nexora_session');
    } catch {
      // Ignored
    }
    db.setCurrentUser(null);
    securityService.logSecurityEvent('USER_LOGOUT_SUCCESS');
    window.dispatchEvent(new Event('user_session_changed'));
    return { success: true };
  }
};

export default authService;
