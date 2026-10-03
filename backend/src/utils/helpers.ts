import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

/**
 * Generate a cryptographically secure random OTP of given length.
 */
export const generateOtp = (length = 6): string => {
  const digits = '0123456789';
  let otp = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    otp += digits[bytes[i] % 10];
  }
  return otp;
};

/**
 * Generate a secure single-use token (for password reset, email verify links).
 */
export const generateSecureToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Generate a UUID v4 for request tracing.
 */
export const generateTraceId = (): string => uuidv4();

/**
 * Compute OTP expiry timestamp (default: 10 minutes).
 */
export const otpExpiresAt = (minutes = 10): Date => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

/**
 * Compute password reset token expiry (default: 1 hour).
 */
export const resetTokenExpiresAt = (hours = 1): Date => {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
};
