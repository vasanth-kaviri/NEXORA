import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * asyncHandler — eliminates try/catch boilerplate in Express route handlers.
 * Catches both synchronous throws and unhandled promise rejections,
 * forwarding them to the centralized global error middleware via next().
 *
 * Usage:
 *   router.post('/signup', asyncHandler(signupWithEmail));
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };