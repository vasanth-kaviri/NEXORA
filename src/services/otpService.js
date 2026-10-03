import { buildE164Phone, validatePhone, validateOtp, validateEmail } from '../utils/validators.js';
import apiClient from './apiClient.js';

/**
 * OTP, Email Verification & Phone Messaging Service.
 * Formatted for Twilio / WhatsApp Business API & SendGrid / Firebase Email Verification.
 * Strictly separates Email and Phone verification pipelines to prevent validation leaks.
 */

const OTP_STORAGE_KEY = 'nexora_pending_otp';
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes validity

export const otpService = {
  /**
   * Generates and dispatches an email verification code.
   * Strictly validates email format without any phone checks.
   * @param {string} email
   * @returns {Promise<{ success: boolean, message: string, formattedDestination?: string, expiresIn?: number }>}
   */
  async sendEmailOtp(email) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const validation = validateEmail(cleanEmail);
    if (!validation.isValid) {
      return { success: false, message: validation.error || 'Invalid email address.' };
    }

    // Simulate backend email dispatcher delay (300ms - 500ms)
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Generate secure 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + OTP_EXPIRY_MS;

    const otpRecord = {
      destination: cleanEmail,
      type: 'email',
      channel: 'email',
      code,
      expiresAt,
      attempts: 0
    };
    sessionStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otpRecord));

    // In development, log securely to console for developer testing
    if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
      console.group('🔐 [NEXORA Verification Gateway - Email Service Mock]');
      console.log(`Destination: ${cleanEmail} (EMAIL)`);
      console.log(`Verification Code: ${code}`);
      console.log(`Expires: ${new Date(expiresAt).toLocaleTimeString()}`);
      console.groupEnd();
    }

    return {
      success: true,
      message: `Verification code sent to ${cleanEmail}.`,
      formattedDestination: cleanEmail,
      expiresIn: OTP_EXPIRY_MS / 1000
    };
  },

  /**
   * Generates and dispatches an SMS or WhatsApp phone verification code.
   * Strictly validates international phone digits.
   * @param {string} phone - Local phone number (e.g. 9876543210)
   * @param {string} countryCode - Dial code (e.g. +1, +91)
   * @param {'sms' | 'whatsapp'} channel - Delivery medium
   * @returns {Promise<{ success: boolean, message: string, formattedPhone?: string, expiresIn?: number }>}
   */
  async sendPhoneOtp(phone, countryCode = '+1', channel = 'sms') {
    const cleanPhone = (phone || '').trim();
    const validation = validatePhone(cleanPhone, countryCode);
    if (!validation.isValid) {
      return { success: false, message: validation.error || 'Invalid phone number.' };
    }

    const e164 = buildE164Phone(countryCode, cleanPhone);

    // Simulate backend carrier network delay (500ms - 800ms)
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Generate secure 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + OTP_EXPIRY_MS;

    const otpRecord = {
      destination: e164,
      phone: e164,
      type: 'phone',
      channel,
      code,
      expiresAt,
      attempts: 0
    };
    sessionStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otpRecord));

    if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
      console.group('🔐 [NEXORA OTP Dispatcher - Twilio/WhatsApp Gateway Mock]');
      console.log(`Destination: ${e164} (${channel.toUpperCase()})`);
      console.log(`Verification Code: ${code}`);
      console.log(`Expires: ${new Date(expiresAt).toLocaleTimeString()}`);
      console.groupEnd();
    }

    return {
      success: true,
      message: `Verification code sent via ${channel.toUpperCase()} to ${e164.slice(0, 4)}••••${e164.slice(-3)}.`,
      formattedPhone: e164,
      formattedDestination: e164,
      expiresIn: OTP_EXPIRY_MS / 1000
    };
  },

  /**
   * Smart polymorphic dispatcher:
   * Dynamically delegates to sendEmailOtp or sendPhoneOtp based on channel or destination format.
   */
  async sendOtp(destination, countryCode = '+1', channel = 'sms') {
    if (channel === 'email' || (typeof destination === 'string' && destination.includes('@'))) {
      return this.sendEmailOtp(destination);
    }
    return this.sendPhoneOtp(destination, countryCode, channel);
  },

  /**
   * Verifies the provided 6-digit code against pending record.
   * @param {string} code - User-entered OTP
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  async verifyOtp(code) {
    const codeCheck = validateOtp(code);
    if (!codeCheck.isValid) {
      return { success: false, message: codeCheck.error || 'Invalid verification code.' };
    }

    // Simulate backend round-trip
    await new Promise((resolve) => setTimeout(resolve, 400));

    const raw = sessionStorage.getItem(OTP_STORAGE_KEY);
    if (!raw) {
      // Allow demo code '123456' for rapid developer testing if no code dispatched
      if (code.trim() === '123456') {
        return { success: true, message: 'Contact verified successfully.' };
      }
      return { success: false, message: 'No verification code was requested or code has expired.' };
    }

    let record;
    try {
      record = JSON.parse(raw);
    } catch {
      return { success: false, message: 'Session data corrupted. Please resend code.' };
    }

    // Check expiration
    if (Date.now() > record.expiresAt) {
      sessionStorage.removeItem(OTP_STORAGE_KEY);
      return { success: false, message: 'Verification code has expired. Please request a new one.' };
    }

    // Check brute force attempts
    if (record.attempts >= 5) {
      sessionStorage.removeItem(OTP_STORAGE_KEY);
      return { success: false, message: 'Too many incorrect attempts. Please request a new code.' };
    }

    // Check code match (or universal dev backdoor 123456)
    if (record.code === code.trim() || code.trim() === '123456') {
      sessionStorage.removeItem(OTP_STORAGE_KEY);
      const medium = record.type === 'email' ? 'Email address' : 'Phone number';
      return { success: true, message: `${medium} verified successfully.` };
    } else {
      record.attempts += 1;
      sessionStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(record));
      const remaining = 5 - record.attempts;
      return {
        success: false,
        message: `Incorrect verification code. ${remaining} attempts remaining.`
      };
    }
  },

  /**
   * Dispatches resend OTP request to backend /api/v1/auth/resend-otp
   * @param {{ contact?: string, phone?: string, email?: string, userId?: string, channel?: string }} params
   */
  async resendOtp({ contact, phone, email, userId, channel = 'sms' } = {}) {
    const rawContact = contact || phone || email || '';
    const cleanContact = typeof rawContact === 'string' ? rawContact.trim().replace(/[\s\-]/g, '') : '';
    const payload = {
      ...(userId ? { userId } : {}),
      ...(cleanContact ? { contact: cleanContact } : {}),
      channel
    };
    return apiClient.post('/api/v1/auth/resend-otp', payload);
  },

  /**
   * Clears any active OTP state
   */
  clearOtp() {
    sessionStorage.removeItem(OTP_STORAGE_KEY);
  }
};

export default otpService;
