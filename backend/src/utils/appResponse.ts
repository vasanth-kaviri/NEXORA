// Standardized API response helpers
export const sendSuccess = <T>(
  data: T,
  message = 'Success',
  statusCode = 200,
) => ({ success: true, statusCode, message, data });

export const sendError = (
  message = 'Internal Server Error',
  statusCode = 500,
  errors?: unknown,
) => ({ success: false, statusCode, message, errors });

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
