import { body } from 'express-validator';

// --- Email Signup --------------------------------------------------------------
export const validateEmailSignup = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters.'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),

  body('confirmPassword')
    .optional()
    .custom((value, { req }) => {
      if (value && value !== req.body.password) {
        throw new Error('Passwords do not match.');
      }
      return true;
    }),
];

// --- Phone Signup -------------------------------------------------------------
export const validatePhoneSignup = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters.'),

  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required.')
    .customSanitizer((val) => (typeof val === 'string' ? val.trim().replace(/[\s\-]/g, '') : val))
    .matches(/^\+?[0-9]{7,15}$/).withMessage('Phone number must be 7-15 digits.'),

  body('countryCode')
    .optional()
    .trim()
    .customSanitizer((val) => (typeof val === 'string' ? val.trim().replace(/\s/g, '') : val))
    .matches(/^\+\d{1,4}$/).withMessage('Invalid country code format.'),

  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),

  body('confirmPassword')
    .optional()
    .custom((value, { req }) => {
      if (value && value !== req.body.password) {
        throw new Error('Passwords do not match.');
      }
      return true;
    }),
];

// --- Login --------------------------------------------------------------------
export const validateLogin = [
  body('contact')
    .optional()
    .trim(),

  body('email')
    .optional()
    .trim(),

  body('phone')
    .optional()
    .trim(),

  body('countryCode')
    .optional()
    .trim(),

  body().custom((body) => {
    const hasContact = Boolean(
      (body.contact && String(body.contact).trim().length > 0) ||
      (body.email && String(body.email).trim().length > 0) ||
      (body.phone && String(body.phone).trim().length > 0)
    );
    if (!hasContact) {
      throw new Error('Email or phone number is required.');
    }
    return true;
  }),

  body('password')
    .notEmpty().withMessage('Password is required.'),
];

// --- OTP Verify ---------------------------------------------------------------
export const validateOtpVerify = [
  body('otp')
    .trim()
    .notEmpty().withMessage('Verification code is required.')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits.')
    .isNumeric().withMessage('OTP must contain only digits.'),

  body('contact')
    .optional()
    .trim(),

  body('email')
    .optional()
    .trim(),

  body('phone')
    .optional()
    .trim(),

  body('userId')
    .optional()
    .trim(),
];

// --- Resend / Send OTP --------------------------------------------------------
export const validateResendOtp = [
  body('contact')
    .optional()
    .customSanitizer((val) => (typeof val === 'string' ? val.trim().replace(/[\s\-]/g, '') : val)),

  body('phone')
    .optional()
    .customSanitizer((val) => (typeof val === 'string' ? val.trim().replace(/[\s\-]/g, '') : val)),

  body('email')
    .optional()
    .trim()
    .normalizeEmail(),

  body('userId')
    .optional()
    .trim(),

  body().custom((body) => {
    const hasIdentifier = Boolean(
      (body.contact && String(body.contact).trim().length > 0) ||
      (body.phone && String(body.phone).trim().length > 0) ||
      (body.email && String(body.email).trim().length > 0) ||
      (body.userId && String(body.userId).trim().length > 0)
    );
    if (!hasIdentifier) {
      throw new Error('Please provide a contact, phone number, email address, or userId.');
    }
    return true;
  }),
];

// --- Password Reset Request ---------------------------------------------------
export const validatePasswordResetRequest = [
  body('contact')
    .trim()
    .notEmpty().withMessage('Email or phone number is required.'),
];

// --- Password Reset Confirm ---------------------------------------------------
export const validatePasswordReset = [
  body('token')
    .trim()
    .notEmpty().withMessage('Reset token is required.'),

  body('password')
    .notEmpty().withMessage('New password is required.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),

  body('confirmPassword')
    .optional()
    .custom((value, { req }) => {
      if (value && value !== req.body.password) {
        throw new Error('Passwords do not match.');
      }
      return true;
    }),
];
