import { Router } from 'express';
import {
  signupWithEmail,
  signupWithPhone,
  verifyEmail,
  verifyOtp,
  login,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  resendOtp,
  getMe,
} from '../controllers/auth.controller';
import { authenticate, optionalAuthenticate } from '../middlewares/auth.middleware';
import { authLimiter, otpLimiter, passwordResetLimiter } from '../middlewares/rateLimiter.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  validateEmailSignup,
  validatePhoneSignup,
  validateLogin,
  validateOtpVerify,
  validateResendOtp,
  validatePasswordResetRequest,
  validatePasswordReset,
} from '../validators/auth.validator';

const router = Router();

// --- Signup -------------------------------------------------------------------
router.post('/signup/email', authLimiter, validateEmailSignup, validate, signupWithEmail);
router.post('/signup/phone', authLimiter, validatePhoneSignup, validate, signupWithPhone);

// --- Verification -------------------------------------------------------------
router.post('/verify/email', verifyEmail);
router.post('/verify/otp', otpLimiter, validateOtpVerify, validate, verifyOtp);
router.post('/resend-otp', otpLimiter, validateResendOtp, validate, resendOtp);

// --- Login / Session ----------------------------------------------------------
router.post('/login', authLimiter, validateLogin, validate, login);
router.post('/refresh', refreshAccessToken);
router.post('/logout', optionalAuthenticate, logout);

// --- Password Reset -----------------------------------------------------------
router.post('/forgot-password', passwordResetLimiter, validatePasswordResetRequest, validate, forgotPassword);
router.post('/reset-password', validatePasswordReset, validate, resetPassword);

// --- Profile ------------------------------------------------------------------
router.get('/me', authenticate, getMe);

export default router;
