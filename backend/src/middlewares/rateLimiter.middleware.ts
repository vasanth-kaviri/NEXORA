import rateLimit from 'express-rate-limit';
import { RedisStore, RedisReply } from 'rate-limit-redis';
import { Request, Response } from 'express';
import { sendError } from '../utils/appResponse';
import { getRedisClient, isRedisReady } from '../config/redis';
import { logger } from '../utils/logger';

/**
 * buildRedisStore — creates a RedisStore using the shared ioredis client.
 * Returns undefined (falls back to in-memory) if Redis is not yet ready,
 * so the app never crashes on a cold-start Redis delay.
 */
function buildRedisStore(prefix: string): RedisStore | undefined {
  try {
    return new RedisStore({
      sendCommand: (...args: string[]) =>
        getRedisClient().call(args[0], ...args.slice(1)) as unknown as Promise<RedisReply>,
      prefix: `nexora_rl_${prefix}_`,
    });
  } catch (_err) {
    return undefined;
  }
}

const isDevLoopback = (req: Request): boolean => {
  if (process.env.NODE_ENV === 'production') return false;
  const ip = req.ip || req.socket.remoteAddress || '';
  return (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip === '::ffff:127.0.0.1' ||
    ip.endsWith('127.0.0.1')
  );
};

// ── General API Rate Limiter (in-memory is fine) ──────────────────────────────
export const generalLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: isDevLoopback,
  handler: (_req: Request, res: Response) => {
    res.status(429).json(sendError('Too many requests. Please try again later.', 429));
  },
});

// ── Auth Route Rate Limiter — Redis-backed, strict ────────────────────────────
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  skip: isDevLoopback,
  store: buildRedisStore('auth'),
  handler: (_req: Request, res: Response) => {
    res.status(429).json(
      sendError('Too many authentication attempts. Access temporarily blocked.', 429),
    );
  },
});

// ── OTP Rate Limiter — Redis-backed ───────────────────────────────────────────
export const otpLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  skip: isDevLoopback,
  store: buildRedisStore('otp'),
  handler: (_req: Request, res: Response) => {
    res.status(429).json(
      sendError('Too many OTP requests. Please wait before requesting another.', 429),
    );
  },
});

// ── Password Reset Rate Limiter ───────────────────────────────────────────────
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  store: buildRedisStore('reset'),
  handler: (_req: Request, res: Response) => {
    res.status(429).json(
      sendError('Too many password reset requests. Please try again after 1 hour.', 429),
    );
  },
});
