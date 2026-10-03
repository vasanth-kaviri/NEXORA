import dotenv from 'dotenv';
import path from 'path';

// Robust dual-path environment loader (resolves backend/.env explicitly regardless of execution cwd)
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

import http from 'http';
import app from './app';
import { connectDB } from './config/db';
import { connectRedis } from './config/redis';
import { logger } from './utils/logger';
import { seedJobsDatabase } from './services/jobSeed.service';

const PORT = Number(process.env.PORT) || 5000;

const server = http.createServer(app);

// --- Graceful Shutdown --------------------------------------------------------
const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received. Shutting down gracefully...`);

  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });

  // Force exit after 30s if graceful shutdown hangs
  setTimeout(() => {
    logger.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 30_000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// --- Unhandled Rejection / Exception Guards -----------------------------------
process.on('unhandledRejection', (reason: unknown) => {
  logger.error('Unhandled Promise Rejection:', reason);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});

// --- Bootstrap ----------------------------------------------------------------
const bootstrap = async () => {
  try {
    await connectDB();
    await connectRedis();

    // Automatically seed real-world industry jobs on bootstrap if empty
    await seedJobsDatabase();

    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        logger.warn(`Port ${PORT} is temporarily busy. Retrying in 1.5 seconds...`);
        setTimeout(() => {
          try {
            server.close();
          } catch {}
          server.listen(PORT, '0.0.0.0');
        }, 1500);
      } else {
        logger.error('Server error:', err);
        process.exit(1);
      }
    });

    server.listen(PORT, '0.0.0.0', () => {
      logger.info(`NEXORA Backend Server Running on Port ${PORT} (http://localhost:${PORT})`);
      logger.info(`REST API Gateway: http://localhost:${PORT}/api/v1`);
      logger.info(`Health Endpoint : http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

bootstrap();
