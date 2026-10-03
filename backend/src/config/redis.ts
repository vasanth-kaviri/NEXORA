import Redis from 'ioredis';
import { logger } from '../utils/logger';

let redisClient: Redis | null = null;
let _isReady = false;

/**
 * Strip surrounding quotes from REDIS_URL env var (common .env mistake).
 * Also auto-enables TLS for rediss:// (Upstash, etc).
 */
function buildRedisOptions(rawUrl: string): { url: string; tls: boolean } {
  const url = rawUrl.trim().replace(/^["']|["']$/g, '');
  const tls = url.startsWith('rediss://');
  return { url, tls };
}

export const getRedisClient = (): Redis => {
  if (redisClient) return redisClient;

  const raw = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
  const { url, tls } = buildRedisOptions(raw);

  redisClient = new Redis(url, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: true,
    ...(tls ? { tls: { rejectUnauthorized: false } } : {}),
  });

  redisClient.on('connect', () => logger.info('Redis connecting...'));
  redisClient.on('ready', () => { _isReady = true; logger.info('Redis ready.'); });
  redisClient.on('error', (err: Error) => { logger.error('Redis error: ' + err.message); });
  redisClient.on('close', () => { _isReady = false; logger.warn('Redis connection closed.'); });
  redisClient.on('reconnecting', () => logger.info('Redis reconnecting...'));

  return redisClient;
};

export const isRedisReady = (): boolean => _isReady;

export const connectRedis = async (): Promise<void> => {
  const client = getRedisClient();
  if (client.status === 'ready' || client.status === 'connecting' || client.status === 'connect') {
    return;
  }
  try {
    await client.connect();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (!msg.includes('already')) {
      logger.warn('Redis connection failed (non-fatal, falling back to in-memory): ' + msg);
    }
  }
};
