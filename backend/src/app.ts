import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';

import { generalLimiter } from './middlewares/rateLimiter.middleware';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import { logger } from './utils/logger';

import authRoutes from './routes/auth.routes';
import healthRoutes from './routes/health.routes';
import userRoutes from './routes/user.routes';
import roadmapRoutes from './routes/roadmap.routes';
import jobRoutes from './routes/job.routes';
import applicationRoutes from './routes/application.routes';
import assessmentRoutes from './routes/assessment.routes';
import interviewRoutes from './routes/interview.routes';
import peerRoutes from './routes/peer.routes';
import catalogRoutes from './routes/catalog.routes';
import adminRoutes from './routes/admin.routes';
import aiRoutes from './routes/ai.routes';
import notificationRoutes from './routes/notification.routes';

const app: Application = express();

// --- Security Headers ---------------------------------------------------------
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// --- CORS ---------------------------------------------------------------------
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
];

const isAllowedOrigin = (origin?: string): boolean => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (process.env.NODE_ENV !== 'production') {
    try {
      const url = new URL(origin);
      if (
        url.hostname === 'localhost' ||
        url.hostname === '127.0.0.1' ||
        url.hostname === '[::1]'
      ) {
        return true;
      }
    } catch {
      return false;
    }
  }
  return false;
};

app.use(cors({
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: Origin ${origin} not allowed.`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Request-ID',
    'X-Client-Timestamp',
    'X-Client-Version',
    'Accept',
  ],
}));

// --- Body Parsers -------------------------------------------------------------
app.use(express.json({ limit: '10kb' }));       // Prevent large payload attacks
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// --- NoSQL Injection Sanitization --------------------------------------------
app.use(mongoSanitize());

// --- HTTP Logging -------------------------------------------------------------
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: { write: (msg: string) => logger.http(msg.trim()) },
  }));
}

// --- Global Rate Limiter ------------------------------------------------------
app.use('/api/', generalLimiter);

// --- Routes -------------------------------------------------------------------
app.use('/api/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/roadmap', roadmapRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/assessments', assessmentRoutes);
app.use('/api/v1/interviews', interviewRoutes);
app.use('/api/v1/peers', peerRoutes);
app.use('/api/v1/catalog', catalogRoutes);
app.use('/api/v1', catalogRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// --- 404 Handler -------------------------------------------------------------
app.use(notFoundHandler);

// --- Global Error Handler -----------------------------------------------------
app.use(errorHandler);

export default app;
