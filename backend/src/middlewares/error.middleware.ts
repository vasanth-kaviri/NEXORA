import { Request, Response, NextFunction } from 'express';
import { AppError, sendError } from '../utils/appResponse';
import { logger } from '../utils/logger';

interface MongoError extends Error {
  code?: number | string;
  keyValue?: Record<string, unknown>;
  path?: string;
  value?: unknown;
}

export const errorHandler = (
  err: MongoError | AppError | SyntaxError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  // Log full internal details — never expose these to the client
  logger.error({
    message: err.message,
    name: err.name,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // ── 1. Known Operational Errors ───────────────────────────────────────────
  if (err instanceof AppError && err.isOperational) {
    res.status(err.statusCode).json(sendError(err.message, err.statusCode));
    return;
  }

  // ── 2. Mongoose Validation Error ──────────────────────────────────────────
  if (err.name === 'ValidationError') {
    res.status(400).json(sendError('Invalid input data. Please check your request.', 400));
    return;
  }

  // ── 3. Mongoose Bad ObjectId (CastError) ──────────────────────────────────
  if (err.name === 'CastError') {
    res.status(400).json(sendError('Invalid identifier format.', 400));
    return;
  }

  // ── 4. MongoDB Duplicate Key (email/phone already registered) ─────────────
  if ((err as MongoError).code === 11000 || err.name === 'MongoServerError') {
    res.status(409).json(sendError('An account with these credentials already exists.', 409));
    return;
  }

  // ── 5. Malformed JSON Body ────────────────────────────────────────────────
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json(sendError('Invalid JSON in request body.', 400));
    return;
  }

  // ── 6. JWT Errors ─────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json(sendError('Invalid authentication token.', 401));
    return;
  }
  if (err.name === 'TokenExpiredError') {
    res.status(401).json(sendError('Session expired. Please log in again.', 401));
    return;
  }

  // ── 7. Unknown / Programming Errors (never leak internals) ────────────────
  res.status(500).json(sendError('Something went wrong. Please try again later.', 500));
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json(sendError('Route ' + req.originalUrl + ' not found.', 404));
};