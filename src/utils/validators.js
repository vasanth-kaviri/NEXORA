/**
 * Form validation utilities for NEXORA auth flows.
 */

/**
 * Validates Step 1 of the signup form.
 * @param {object} formData - { contact, password, confirmPassword }
 * @param {string} contactType - 'email' | 'phone'
 * @returns {object} errors - keyed by field name; empty object means valid
 */
export function validateSignupStep1(formData, contactType) {
  const errors = {};

  // Password: min 8 chars, 1 uppercase, 1 number, 1 special char
  const hasUpperCase = /[A-Z]/.test(formData.password);
  const hasNumber    = /[0-9]/.test(formData.password);
  const hasSpecial   = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

  if (!hasUpperCase || !hasNumber || !hasSpecial || formData.password.length < 8) {
    errors.password = 'Must be 8+ chars, with 1 uppercase, 1 number, and 1 special char.';
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  // Contact: email or phone
  const isEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.contact);
  const isPhone = /^[0-9]{7,15}$/.test(formData.contact.replace(/\s+/g, ''));

  if (contactType === 'email' && !isEmail) {
    errors.contact = 'Please enter a valid email address.';
  } else if (contactType === 'phone' && !isPhone) {
    errors.contact = 'Please enter a valid phone number.';
  }

  return errors;
}
