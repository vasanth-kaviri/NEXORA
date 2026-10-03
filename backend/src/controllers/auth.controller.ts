import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';
import { sendSuccess, sendError } from '../utils/appResponse';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../services/token.service';
import { sendEmailVerification, sendPasswordResetEmail, sendOtpEmail } from '../services/email.service';
import { sendSmsOtp, sendWhatsappOtp } from '../services/sms.service';
import { generateOtp, generateSecureToken, otpExpiresAt, resetTokenExpiresAt } from '../utils/helpers';
import { logger } from '../utils/logger';

// safeNotify: fire-and-forget wrapper
// Catches sync throws and async rejections so notification failures NEVER crash the HTTP response.
function safeNotify(fn: () => Promise<void>, label: string): void {
  Promise.resolve().then(fn).catch((err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn(`safeNotify [${label}] failed (non-fatal): ${msg}`);
  });
}

// Issue tokens, set httpOnly cookie, send JSON
const sendAuthResponse = (
  res: Response,
  accessToken: string,
  refreshToken: string,
  user: object,
  statusCode = 200,
): void => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(statusCode).json(
    sendSuccess({ accessToken, refreshToken, user }, 'Authentication successful.', statusCode),
  );
};

// POST /auth/signup/email
export const signupWithEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, email, password } = req.body as { name?: string; email: string; password: string };
    const cleanEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      res.status(409).json(sendError('An account with these credentials already exists.', 409));
      return;
    }
    const displayName = name?.trim() || cleanEmail.split('@')[0] || 'Student';
    const verifyToken = generateSecureToken();
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const otp = generateOtp(6);
    const otpExpiry = otpExpiresAt(10);

    // Explicit hashing at controller layer: single source of truth, eliminates hook double-hashing
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: displayName,
      email: cleanEmail,
      passwordHash: hashedPassword,
      password: hashedPassword,
      authMethod: 'email',
      emailVerifyToken: crypto.createHash('sha256').update(verifyToken).digest('hex'),
      emailVerifyTokenExpires: verifyExpires,
      emailOtp: otp,
      emailOtpExpires: otpExpiry,
    });

    safeNotify(() => sendEmailVerification(user.email!, user.name, verifyToken), 'sendEmailVerification');
    safeNotify(() => sendOtpEmail(user.email!, user.name, otp), 'sendOtpEmail');

    res.status(201).json(
      sendSuccess(
        { userId: user._id, email: user.email, name: user.name, authMethod: 'email' },
        'Account created. Check your email (or backend console in dev mode) for the verification code.',
        201,
      ),
    );
  } catch (err) { next(err); }
};

// POST /auth/signup/phone
export const signupWithPhone = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, phone, countryCode = '+91', password, channel = 'sms' } = req.body as {
      name?: string; phone: string; countryCode?: string; password: string; channel?: string;
    };
    
    // Decouple countryCode and strictly local national digits:
    let cleanCode = (countryCode || '+91').trim().replace(/\s/g, '');
    if (!cleanCode.startsWith('+')) cleanCode = `+${cleanCode}`;

    // Extract pure digits (local number e.g. '8769875608')
    const rawDigits = String(phone || '').replace(/\D/g, '');
    const pureDigits = rawDigits.slice(-10);

    if (!pureDigits || pureDigits.length < 7) {
      res.status(400).json(sendError('Please provide a valid phone number (at least 7 digits).', 400));
      return;
    }

    const fullPhone = `${cleanCode}${pureDigits}`;

    // Check existing using decoupled phone or legacy prefixed phone
    const existing = await User.findOne({
      $or: [
        { phone: pureDigits },
        { countryCode: cleanCode, phone: pureDigits },
        { phone: fullPhone },
      ],
    });

    if (existing) {
      res.status(409).json(sendError('An account with these credentials already exists.', 409));
      return;
    }

    const displayName = name?.trim() || 'Student';
    const otp = generateOtp(6);
    const otpExpiry = otpExpiresAt(10);

    // Explicit hashing at controller layer: single source of truth, eliminates hook double-hashing
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: displayName,
      phone: pureDigits, // Strictly stores local digits (e.g. '8769875608')
      countryCode: cleanCode, // Dedicated string field (e.g. '+91')
      passwordHash: hashedPassword,
      password: hashedPassword,
      authMethod: 'phone',
      phoneOtp: otp,
      phoneOtpExpires: otpExpiry,
    });

    const sendFn = channel === 'whatsapp'
      ? () => sendWhatsappOtp(fullPhone, otp)
      : () => sendSmsOtp(fullPhone, otp);
    safeNotify(sendFn, `sendPhoneOtp(${channel})`);

    res.status(201).json(
      sendSuccess(
        { userId: user._id, phone: pureDigits, countryCode: cleanCode, name: user.name, authMethod: 'phone', channel },
        'Account created. Check your phone (or backend console in dev mode) for the OTP.',
        201,
      ),
    );
  } catch (err) { next(err); }
};

// POST /auth/verify/email
export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { token } = req.body as { token: string };
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      emailVerifyToken: hashedToken,
      emailVerifyTokenExpires: { $gt: new Date() },
    }).select('+emailVerifyToken +emailVerifyTokenExpires +refreshTokens');
    if (!user) { res.status(400).json(sendError('Invalid or expired verification link.', 400)); return; }
    user.isVerified = true;
    const accessToken = generateAccessToken({ id: user._id.toString(), role: user.role, isVerified: true });
    const refreshToken = generateRefreshToken({ id: user._id.toString(), role: user.role, isVerified: true });
    const hashedRefresh = crypto.createHash('sha256').update(refreshToken).digest('hex');

    await User.findByIdAndUpdate(user._id, {
      $set: { isVerified: true },
      $unset: {
        emailVerifyToken: 1,
        emailVerifyTokenExpires: 1,
        emailOtp: 1,
        emailOtpExpires: 1,
      },
      $push: {
        refreshTokens: {
          $each: [hashedRefresh],
          $slice: -5,
        },
      },
    });

    user.isVerified = true;
    sendAuthResponse(res, accessToken, refreshToken, user);
  } catch (err) { next(err); }
};

// POST /auth/verify/otp
export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId, email, phone, contact, otp } = req.body as {
      userId?: string; email?: string; phone?: string; contact?: string; otp: string;
    };

    if (!otp) {
      res.status(400).json(sendError('Verification code is required.', 400));
      return;
    }

    const cleanOtp = String(otp).trim();
    const identifier = contact || email || phone;

    let user = null;
    if (userId && mongoose.isValidObjectId(userId)) {
      user = await User.findById(userId).select('+phoneOtp +phoneOtpExpires +emailOtp +emailOtpExpires +refreshTokens');
    }

    if (!user && identifier) {
      const cleanIdent = String(identifier).trim();
      const sanitizedPhone = cleanIdent.replace(/[\s\-\(\)]/g, '');
      const digitsOnly = sanitizedPhone.replace(/\D/g, '');

      user = await User.findOne({
        $or: [
          { email: cleanIdent.toLowerCase() },
          { phone: cleanIdent },
          { phone: sanitizedPhone },
          { phone: `+${sanitizedPhone.replace(/^\+/, '')}` },
          ...(digitsOnly.length >= 7 ? [{ phone: new RegExp(`${digitsOnly.slice(-10)}$`) }] : []),
        ],
      }).select('+phoneOtp +phoneOtpExpires +emailOtp +emailOtpExpires +refreshTokens');
    }

    if (!user) {
      res.status(400).json(sendError('No registered account was found matching the provided details. Please register first.', 400));
      return;
    }

    if (user.otpAttempts >= 5) {
      res.status(429).json(sendError('Too many incorrect OTP attempts. Please request a new code.', 429));
      return;
    }

    const isDev = process.env.NODE_ENV !== 'production';
    const isDevBypass = isDev && cleanOtp === '123456';
    if (isDevBypass) {
      logger.warn(`[DEV] Dev OTP bypass (123456) used for user: ${user.email || user.phone || user._id}`);
    }

    const now = new Date();
    const isEmailOtpValid = Boolean(
      user.emailOtp &&
      user.emailOtpExpires &&
      user.emailOtpExpires >= now &&
      user.emailOtp === cleanOtp,
    );
    const isPhoneOtpValid = Boolean(
      user.phoneOtp &&
      user.phoneOtpExpires &&
      user.phoneOtpExpires >= now &&
      user.phoneOtp === cleanOtp,
    );

    if (!isDevBypass && !isEmailOtpValid && !isPhoneOtpValid) {
      user.otpAttempts += 1;
      await user.save({ validateBeforeSave: false });
      res.status(400).json(sendError('Incorrect or expired verification code.', 400));
      return;
    }

    // Success path: commit verification state to MongoDB atomically
    const accessToken = generateAccessToken({ id: user._id.toString(), role: user.role, isVerified: true });
    const refreshToken = generateRefreshToken({ id: user._id.toString(), role: user.role, isVerified: true });
    const hashedRefresh = crypto.createHash('sha256').update(refreshToken).digest('hex');

    await User.findByIdAndUpdate(user._id, {
      $set: {
        isVerified: true,
        otpAttempts: 0,
      },
      $unset: {
        emailOtp: 1,
        emailOtpExpires: 1,
        phoneOtp: 1,
        phoneOtpExpires: 1,
        emailVerifyToken: 1,
        emailVerifyTokenExpires: 1,
      },
      $push: {
        refreshTokens: {
          $each: [hashedRefresh],
          $slice: -5,
        },
      },
    });

    user.isVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpires = undefined;
    user.phoneOtp = undefined;
    user.phoneOtpExpires = undefined;
    user.emailVerifyToken = undefined;
    user.emailVerifyTokenExpires = undefined;
    user.otpAttempts = 0;

    sendAuthResponse(res, accessToken, refreshToken, user);
  } catch (err) { next(err); }
};

// POST /auth/login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const rawIdentifier = (req.body.phone || req.body.contact || req.body.email || '').toString().trim();
    const rawPassword = (req.body.password || '').toString();

    if (!rawIdentifier || !rawPassword) {
      res.status(400).json(sendError('Please provide both contact and password.', 400));
      return;
    }

    // Robust multi-format identifier cleanup
    const digitsOnly = rawIdentifier.replace(/\D/g, '');
    const cleanPhone = digitsOnly.slice(-10);

    const queryOr: Array<Record<string, unknown>> = [];
    if (rawIdentifier.includes('@')) {
      queryOr.push({ email: rawIdentifier.toLowerCase() });
    }
    if (cleanPhone) {
      queryOr.push({ phone: cleanPhone });
      queryOr.push({ phone: `+91${cleanPhone}` });
      queryOr.push({ countryCode: '+91', phone: cleanPhone });
    }
    if (digitsOnly) {
      queryOr.push({ phone: digitsOnly });
    }
    queryOr.push({ phone: rawIdentifier });

    // Find the user and explicitly select hidden fields
    const user = await User.findOne({ $or: queryOr }).select('+password +passwordHash +refreshTokens');

    // Diagnostic logs before comparing
    console.log('[LOGIN TRACE] User found:', !!user, 'Target phone:', cleanPhone);

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials: user not found' });
      return;
    }

    if (!user.isActive) {
      res.status(403).json(sendError('This account has been deactivated.', 403));
      return;
    }

    if (user.isAccountLocked()) {
      res.status(423).json(sendError('Account temporarily locked. Please try again later.', 423));
      return;
    }

    // Compare password against the available hash
    const targetHash = user.passwordHash || user.password;
    if (!targetHash) {
      console.log('[LOGIN TRACE] No password hash available on user record');
      res.status(401).json({ success: false, message: 'Invalid credentials: no password set' });
      return;
    }

    const isMatch = await bcrypt.compare(rawPassword, targetHash);
    console.log('[LOGIN TRACE] Password match result:', isMatch);

    if (!isMatch) {
      await user.incrementLoginAttempts();
      res.status(401).json({ success: false, message: 'Invalid credentials: password mismatch' });
      return;
    }

    await user.resetLoginAttempts();

    // Return Fresh Tokens on Success
    const accessToken = generateAccessToken({
      id: user._id.toString(),
      role: user.role,
      isVerified: user.isVerified,
    });
    const refreshToken = generateRefreshToken({
      id: user._id.toString(),
      role: user.role,
      isVerified: user.isVerified,
    });

    const hashedRefresh = crypto.createHash('sha256').update(refreshToken).digest('hex');

    // Update session tokens and reset login attempts atomically using findByIdAndUpdate
    // to avoid triggering Mongoose pre('save') hooks and prevent double-hashing
    await User.findByIdAndUpdate(user._id, {
      $set: {
        loginAttempts: 0,
        lastLoginAt: new Date(),
      },
      $unset: { lockUntil: 1 },
      $push: {
        refreshTokens: {
          $each: [hashedRefresh],
          $slice: -5,
        },
      },
    });

    sendAuthResponse(res, accessToken, refreshToken, user);
  } catch (err) {
    next(err);
  }
};

// POST /auth/refresh
export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = (req.cookies as { refreshToken?: string })?.refreshToken
      ?? (req.body as { refreshToken?: string })?.refreshToken;
    if (!token) { res.status(401).json(sendError('No refresh token provided.', 401)); return; }
    const decoded = verifyRefreshToken(token);
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findById(decoded.id).select('+refreshTokens');
    if (!user || !user.refreshTokens?.includes(hashedToken)) {
      res.status(401).json(sendError('Invalid or revoked session. Please log in again.', 401)); return;
    }
    const updatedRefreshTokens = (user.refreshTokens || []).filter((t) => t !== hashedToken);
    const newAccessToken = generateAccessToken({ id: user._id.toString(), role: user.role, isVerified: user.isVerified });
    const newRefreshToken = generateRefreshToken({ id: user._id.toString(), role: user.role, isVerified: user.isVerified });
    const hashedNewRefresh = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
    updatedRefreshTokens.push(hashedNewRefresh);

    // Update tokens atomically without invoking Mongoose save/hooks
    await User.findByIdAndUpdate(user._id, {
      $set: {
        refreshTokens: updatedRefreshTokens.slice(-5)
      }
    });
    sendAuthResponse(res, newAccessToken, newRefreshToken, user);
  } catch (err) { next(err); }
};

// POST /auth/logout
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const refreshToken = (req.cookies as { refreshToken?: string })?.refreshToken
      ?? (req.body as { refreshToken?: string })?.refreshToken;

    if (refreshToken) {
      const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
      if (req.user?.id) {
        // Fast path: authenticated request — pull by known user ID
        await User.findByIdAndUpdate(req.user.id, {
          $pull: { refreshTokens: hashedToken },
        });
      } else {
        // Fallback path: expired access token — pull refresh token hash across all users
        await User.updateMany(
          { refreshTokens: hashedToken },
          { $pull: { refreshTokens: hashedToken } },
        );
      }
    }

    res.clearCookie('refreshToken');
    res.status(200).json(sendSuccess(null, 'Logged out successfully.'));
  } catch (err) { next(err); }
};

// POST /auth/forgot-password
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { contact } = req.body as { contact: string };
    const GENERIC = 'If an account exists with these credentials, a reset link has been sent.';
    const user = await User.findByEmailOrPhone(contact);
    if (!user?.email) { res.status(200).json(sendSuccess(null, GENERIC)); return; }
    const token = generateSecureToken();
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = resetTokenExpiresAt(1);
    await user.save({ validateBeforeSave: false });
    safeNotify(() => sendPasswordResetEmail(user.email!, user.name, token), 'sendPasswordResetEmail');
    res.status(200).json(sendSuccess(null, GENERIC));
  } catch (err) { next(err); }
};

// POST /auth/reset-password
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { token, password } = req.body as { token: string; password: string };
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json(sendError('Invalid or expired reset token.', 400));
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.findByIdAndUpdate(user._id, {
      $set: {
        password: hashedPassword,
        passwordHash: hashedPassword,
        refreshTokens: [],
      },
      $unset: {
        resetPasswordToken: 1,
        resetPasswordExpires: 1,
        lockUntil: 1,
      },
    });
    res.clearCookie('refreshToken');
    res.status(200).json(sendSuccess(null, 'Password reset successfully. Please log in with your new password.'));
  } catch (err) { next(err); }
};

// POST /auth/resend-otp
export const resendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId, contact, email, phone, channel = 'sms' } = req.body as {
      userId?: string; contact?: string; email?: string; phone?: string; channel?: string;
    };

    let user = null;
    if (userId && mongoose.isValidObjectId(userId)) {
      user = await User.findById(userId).select('+phoneOtp +phoneOtpExpires +emailOtp +emailOtpExpires');
    }

    const identifier = contact || phone || email;
    if (!user && identifier) {
      const cleanIdent = String(identifier).trim();
      const sanitizedPhone = cleanIdent.replace(/[\s\-\(\)]/g, '');
      const digitsOnly = sanitizedPhone.replace(/\D/g, '');

      user = await User.findOne({
        $or: [
          { email: cleanIdent.toLowerCase() },
          { phone: cleanIdent },
          { phone: sanitizedPhone },
          { phone: `+${sanitizedPhone.replace(/^\+/, '')}` },
          ...(digitsOnly.length >= 7 ? [{ phone: new RegExp(`${digitsOnly.slice(-10)}$`) }] : []),
        ],
      }).select('+phoneOtp +phoneOtpExpires +emailOtp +emailOtpExpires');
    }

    if (!user) {
      res.status(400).json(sendError('No registered account was found matching the provided details.', 400));
      return;
    }
    if (user.isVerified) { res.status(400).json(sendError('Account is already verified.', 400)); return; }

    const otp = generateOtp(6);
    const otpExpiry = otpExpiresAt(10);
    user.otpAttempts = 0;

    if (user.authMethod === 'email' || user.email) {
      await User.findByIdAndUpdate(user._id, {
        $set: { emailOtp: otp, emailOtpExpires: otpExpiry, otpAttempts: 0 }
      });
      safeNotify(() => sendOtpEmail(user.email!, user.name, otp), 'resendEmailOtp');
    } else if (user.phone) {
      await User.findByIdAndUpdate(user._id, {
        $set: { phoneOtp: otp, phoneOtpExpires: otpExpiry, otpAttempts: 0 }
      });
      const fullPhone = user.phone?.startsWith('+')
        ? user.phone
        : `${user.countryCode || '+91'}${user.phone}`;
      const sendFn = channel === 'whatsapp'
        ? () => sendWhatsappOtp(fullPhone, otp)
        : () => sendSmsOtp(fullPhone, otp);
      safeNotify(sendFn, `resendOtp(${channel})`);
    } else {
      res.status(400).json(sendError('No email or phone on this account.', 400));
      return;
    }

    res.status(200).json(sendSuccess(null, 'A new verification code has been dispatched.'));
  } catch (err) { next(err); }
};

// GET /auth/me
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) { res.status(404).json(sendError('User not found.', 404)); return; }
    res.status(200).json(sendSuccess(user, 'User profile retrieved.'));
  } catch (err) { next(err); }
};
