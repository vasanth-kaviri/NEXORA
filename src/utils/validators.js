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

  // Password: min 6 chars
  if (!formData.password || formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
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
