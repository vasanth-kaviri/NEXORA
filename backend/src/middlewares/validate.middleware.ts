import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { sendError } from '../utils/appResponse';

/**
 * Run express-validator checks and short-circuit with 422 if any fail.
 * Returns sanitized field errors to the client.
 */
export const validate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const fieldErrors = errors.array().map((err) => ({
      field: 'path' in err ? err.path : 'unknown',
      message: err.msg,
    }));
    const exactMessage = fieldErrors[0]?.message || 'Validation failed.';
    res.status(400).json(sendError(exactMessage, 400, fieldErrors));
    return;
  }
  next();
};
