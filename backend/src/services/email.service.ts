import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

const PLACEHOLDER_PATTERNS = ['your_email', 'example.com', 'placeholder'];

const isSmtpConfigured = (): boolean => {
  const user = process.env.SMTP_USER ?? '';
  const pass = process.env.SMTP_PASS ?? '';
  return (
    user.length > 0 &&
    pass.length > 0 &&
    !PLACEHOLDER_PATTERNS.some((p) => user.includes(p))
  );
};

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

function devBox(lines: string[]): void {
  const W = 62;
  const border = '+' + '-'.repeat(W) + '+';
  logger.warn('');
  logger.warn(border);
  lines.forEach((l) => logger.warn('| ' + l.padEnd(W - 2) + ' |'));
  logger.warn(border);
  logger.warn('');
}

export const sendEmailVerification = async (
  email: string,
  name: string,
  token: string,
): Promise<void> => {
  const verifyUrl = (process.env.CLIENT_URL ?? 'http://localhost:5173') + '/verify-email?token=' + token;

  if (!isSmtpConfigured()) {
    devBox([
      '[DEV] Email Verification Link (SMTP not configured)',
      'To    : ' + email,
      'Name  : ' + name,
      'URL   : ' + verifyUrl,
    ]);
    return;
  }

  try {
    await createTransporter().sendMail({
      from: 'NEXORA <' + (process.env.FROM_EMAIL ?? 'noreply@nexora.ai') + '>',
      to: email,
      subject: 'Verify your NEXORA account',
      html: buildVerifyHtml(name, verifyUrl),
    });
    logger.info('Email verification sent to ' + email);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error('SMTP sendEmailVerification failed: ' + msg);
    devBox(['[DEV FALLBACK] Verify URL: ' + verifyUrl]);
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  token: string,
): Promise<void> => {
  const resetUrl = (process.env.CLIENT_URL ?? 'http://localhost:5173') + '/reset-password?token=' + token;

  if (!isSmtpConfigured()) {
    devBox([
      '[DEV] Password Reset Link (SMTP not configured)',
      'To    : ' + email,
      'URL   : ' + resetUrl,
    ]);
    return;
  }

  try {
    await createTransporter().sendMail({
      from: 'NEXORA <' + (process.env.FROM_EMAIL ?? 'noreply@nexora.ai') + '>',
      to: email,
      subject: 'Reset your NEXORA password',
      html: buildResetHtml(name, resetUrl),
    });
    logger.info('Password reset email sent to ' + email);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error('SMTP sendPasswordResetEmail failed: ' + msg);
    devBox(['[DEV FALLBACK] Reset URL: ' + resetUrl]);
  }
};

export const sendOtpEmail = async (
  email: string,
  name: string,
  otp: string,
): Promise<void> => {
  if (!isSmtpConfigured()) {
    devBox([
      '[DEV] Email OTP (SMTP not configured)',
      'To    : ' + email,
      'Name  : ' + name,
      'OTP   : ' + otp,
    ]);
    return;
  }

  try {
    await createTransporter().sendMail({
      from: 'NEXORA <' + (process.env.FROM_EMAIL ?? 'noreply@nexora.ai') + '>',
      to: email,
      subject: 'Your NEXORA verification code: ' + otp,
      html: buildOtpHtml(name, otp),
    });
    logger.info('OTP email sent to ' + email);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error('SMTP sendOtpEmail failed: ' + msg);
    devBox(['[DEV FALLBACK] OTP for ' + email + ': ' + otp]);
  }
};

function buildVerifyHtml(name: string, url: string): string {
  return `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#f1f5f9;padding:40px;border-radius:12px">
<h1 style="color:#6366f1">Welcome to NEXORA, ${name}!</h1>
<p style="color:#94a3b8">Click below to verify your email. Expires in <strong>24 hours</strong>.</p>
<a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600">Verify Email</a>
<p style="color:#475569;margin-top:32px;font-size:13px">If you did not create this account, ignore this email.</p></div>`;
}

function buildResetHtml(name: string, url: string): string {
  return `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#f1f5f9;padding:40px;border-radius:12px">
<h1 style="color:#6366f1">Password Reset Request</h1>
<p style="color:#94a3b8">Hi ${name}, click below. Expires in <strong>1 hour</strong>, single-use only.</p>
<a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600">Reset Password</a>
<p style="color:#ef4444;margin-top:24px;font-size:13px">Did not request this? Secure your account immediately.</p></div>`;
}

function buildOtpHtml(name: string, otp: string): string {
  return `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#f1f5f9;padding:40px;border-radius:12px">
<h1 style="color:#6366f1">Verification Code</h1>
<p style="color:#94a3b8">Hi ${name}, your one-time code:</p>
<div style="background:#1e293b;border:1px solid #6366f1;border-radius:8px;padding:24px;text-align:center;margin:24px 0">
<span style="font-size:36px;font-weight:700;letter-spacing:8px;color:#6366f1">${otp}</span></div>
<p style="color:#475569;font-size:13px">Expires in <strong>10 minutes</strong>. Never share this code.</p></div>`;
}