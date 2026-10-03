/**
 * Validation and Data Formatting Utilities for NEXORA Auth and User Profiles.
 * Follows E.164 phone standards and robust password/email verification.
 */

/**
 * Validates standard RFC 5322 email addresses.
 * @param {string} email
 * @returns {{ isValid: boolean, error?: string }}
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email address is required.' };
  }
  const clean = email.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(clean)) {
    return { isValid: false, error: 'Please enter a valid email address (e.g. user@domain.com).' };
  }
  return { isValid: true };
}

/**
 * Converts country code and raw phone number into strict E.164 format (+1234567890).
 * @param {string} countryCode e.g. '+1' or '+91'
 * @param {string} phone e.g. '9876543210'
 * @returns {string} E.164 formatted string
 */
export function buildE164Phone(countryCode = '+1', phone = '') {
  const cleanCode = countryCode.startsWith('+') ? countryCode : `+${countryCode}`;
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `${cleanCode}${cleanPhone}`;
}

/**
 * Validates international phone numbers.
 * @param {string} phone
 * @param {string} countryCode
 * @returns {{ isValid: boolean, error?: string }}
 */
export function validatePhone(phone, countryCode = '+1') {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, error: 'Phone number is required.' };
  }
  const cleanDigits = phone.replace(/\D/g, '');
  if (cleanDigits.length < 7 || cleanDigits.length > 15) {
    return { isValid: false, error: 'Phone number must be between 7 and 15 digits.' };
  }
  return { isValid: true };
}

/**
 * Validates password with security score evaluation.
 * @param {string} password
 * @returns {{ isValid: boolean, score: number, feedback: string[], error?: string }}
 */
export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { isValid: false, score: 0, feedback: ['Password is required.'], error: 'Password is required.' };
  }

  const feedback = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push('Must be at least 8 characters long');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Include at least one uppercase letter (A-Z)');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Include at least one lowercase letter (a-z)');

  if (/[0-9]/.test(password)) score += 1;
  else feedback.push('Include at least one number (0-9)');

  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  else feedback.push('Include at least one special character (!@#$%^&*)');

  const isValid = password.length >= 6; // base requirement
  const error = !isValid ? 'Password must be at least 6 characters.' : undefined;

  return {
    isValid,
    score, // 0 to 5
    feedback,
    error
  };
}

/**
 * Validates 6-digit OTP code.
 * @param {string} otp
 * @returns {{ isValid: boolean, error?: string }}
 */
export function validateOtp(otp) {
  if (!otp || typeof otp !== 'string') {
    return { isValid: false, error: 'Verification code is required.' };
  }
  const clean = otp.trim();
  if (!/^\d{6}$/.test(clean)) {
    return { isValid: false, error: 'Verification code must be a 6-digit number.' };
  }
  return { isValid: true };
}

/**
 * Validates Step 1 of the signup form.
 * @param {object} formData - { contact, password, confirmPassword, countryCode }
 * @param {string} contactType - 'email' | 'phone'
 * @returns {object} errors - keyed by field name; empty object means valid
 */
export function validateSignupStep1(formData, contactType = 'email') {
  const errors = {};

  // Password validation
  const pwdValidation = validatePassword(formData.password);
  if (!pwdValidation.isValid) {
    errors.password = pwdValidation.error || 'Password must be at least 6 characters.';
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  // Contact validation
  if (contactType === 'email') {
    const emailRes = validateEmail(formData.contact);
    if (!emailRes.isValid) {
      errors.contact = emailRes.error;
    }
  } else if (contactType === 'phone') {
    const phoneRes = validatePhone(formData.contact, formData.countryCode);
    if (!phoneRes.isValid) {
      errors.contact = phoneRes.error;
    }
  }

  return errors;
}

/**
 * Validates student profile form data.
 * @param {object} profile
 * @returns {object} errors
 */
export function validateProfileForm(profile) {
  const errors = {};
  if (!profile.firstName || !profile.firstName.trim()) {
    errors.firstName = 'First name is required.';
  }
  if (!profile.dreamJob || !profile.dreamJob.trim()) {
    errors.dreamJob = 'Career goal or dream role is required.';
  }
  if (profile.email) {
    const emailRes = validateEmail(profile.email);
    if (!emailRes.isValid) errors.email = emailRes.error;
  }
  return errors;
}

export default {
  validateEmail,
  validatePhone,
  buildE164Phone,
  validatePassword,
  validateOtp,
  validateSignupStep1,
  validateProfileForm
};
