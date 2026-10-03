import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { sendError } from '../utils/appResponse';
import { logger } from '../utils/logger';

// --- Extend Express Request ---------------------------------------------------
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// --- Authenticate JWT (strict — blocks on failure) ----------------------------
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json(sendError('Authentication required.', 401));
      return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'your-default-secret';

    const decoded = jwt.verify(token, secret) as any;
    const userId = decoded.id || decoded.userId || decoded._id;

    // Verify user still exists and is active
    const user = await User.findById(userId).select('-password');
    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: 'User not found or inactive' });
      return;
    }

    req.user = user;
    next();
  } catch (err: any) {
    logger.error('[AuthMiddleware] Error:', err?.message || String(err));
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json(sendError('Session expired. Please log in again.', 401));
      return;
    }
    if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json(sendError('Invalid authentication token.', 401));
      return;
    }
    res.status(401).json(sendError('Authentication failed.', 401));
  }
};

// --- Optional Authenticate (permissive — never blocks, attaches user if token is valid) ---
export const optionalAuthenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'your-default-secret';
      try {
        const decoded = jwt.verify(token, secret) as any;
        const userId = decoded.id || decoded.userId || decoded._id;
        const user = await User.findById(userId).select('-password');
        if (user && user.isActive) {
          req.user = user;
        }
      } catch {
        // Silently ignore token errors — allows expired access tokens to still logout
      }
    }
  } catch {
    // Never block on optional auth errors
  }
  next();
};

// --- Require Verified Account -------------------------------------------------
export const requireVerified = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user?.isVerified) {
    res.status(403).json(
      sendError('Account verification required before accessing this resource.', 403),
    );
    return;
  }
  next();
};

// --- Role-Based Access Control ------------------------------------------------
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json(
        sendError('You do not have permission to perform this action.', 403),
      );
      return;
    }
    next();
  };
};
