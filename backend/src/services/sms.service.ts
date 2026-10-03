import twilio from 'twilio';
import { logger } from '../utils/logger';

// ── Credential Guard ──────────────────────────────────────────────────────────
const isTwilioConfigured = (): boolean => {
  const sid = process.env.TWILIO_ACCOUNT_SID ?? '';
  const token = process.env.TWILIO_AUTH_TOKEN ?? '';
  const phone = process.env.TWILIO_PHONE_NUMBER ?? '';
  return (
    sid.startsWith('AC') &&
    sid.length === 34 &&
    token.length > 10 &&
    !token.includes('your_') &&
    phone.startsWith('+') &&
    !phone.includes('x')
  );
};

function devBox(lines: string[]): void {
  const W = 62;
  const border = '+' + '-'.repeat(W) + '+';
  logger.warn('');
  logger.warn(border);
  lines.forEach((l) => logger.warn('| ' + l.padEnd(W - 2) + ' |'));
  logger.warn(border);
  logger.warn('');
}

const getClient = () => {
  const sid = process.env.TWILIO_ACCOUNT_SID!;
  const token = process.env.TWILIO_AUTH_TOKEN!;
  return twilio(sid, token);
};

// ── Send SMS OTP ──────────────────────────────────────────────────────────────
export const sendSmsOtp = async (phone: string, otp: string): Promise<void> => {
  if (!isTwilioConfigured()) {
    devBox([
      '[DEV] SMS OTP (Twilio not configured)',
      'To    : ' + phone,
      'OTP   : ' + otp,
      'Msg   : Use this code to verify your NEXORA account.',
    ]);
    return;
  }

  try {
    await getClient().messages.create({
      body: 'Your NEXORA verification code is: ' + otp + '. Valid for 10 minutes. Do not share.',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    logger.info('SMS OTP sent to ' + phone);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error('Twilio sendSmsOtp failed: ' + msg);
    devBox(['[DEV FALLBACK] OTP for ' + phone + ': ' + otp]);
  }
};

// ── Send WhatsApp OTP ─────────────────────────────────────────────────────────
export const sendWhatsappOtp = async (phone: string, otp: string): Promise<void> => {
  if (!isTwilioConfigured()) {
    devBox([
      '[DEV] WhatsApp OTP (Twilio not configured)',
      'To    : ' + phone,
      'OTP   : ' + otp,
    ]);
    return;
  }

  try {
    await getClient().messages.create({
      body: 'Your NEXORA verification code is: *' + otp + '*. Valid for 10 minutes. Do not share.',
      from: 'whatsapp:' + process.env.TWILIO_PHONE_NUMBER,
      to: 'whatsapp:' + phone,
    });
    logger.info('WhatsApp OTP sent to ' + phone);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error('Twilio sendWhatsappOtp failed: ' + msg);
    devBox(['[DEV FALLBACK] WhatsApp OTP for ' + phone + ': ' + otp]);
  }
};