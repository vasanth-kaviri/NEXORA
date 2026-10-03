import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getMe, updateMe, updateProfile, getProfile, syncResumeData } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validateUpdateMe } from '../validators/user.validator';
import { validate } from '../middlewares/validate.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router: Router = Router();

// Permissive auth middleware for legacy calibration if token is not yet stored
const optionalAuthenticate = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'your-default-secret';
      if (secret) {
        const decoded = jwt.verify(token, secret) as any;
        const userId = decoded.id || decoded.userId || decoded._id;
        req.user = {
          id: userId,
          role: decoded.role,
          isVerified: decoded.isVerified,
        };
      }
    }
  } catch {
    // Ignore invalid/expired token in permissive mode
  }
  next();
};

// --- Primary Standard Endpoints: /api/v1/users/me ---
router.get('/me', authenticate, asyncHandler(getMe));
router.put('/me', optionalAuthenticate, validateUpdateMe, validate, asyncHandler(updateMe));

// --- ATS Resume Profile Sync Endpoint ---
router.post('/sync-resume-data', optionalAuthenticate, asyncHandler(syncResumeData));

// --- Backward-Compatible Endpoints: /api/v1/users/profile ---
router.get('/profile', authenticate, asyncHandler(getProfile));
router.put('/profile', optionalAuthenticate, asyncHandler(updateProfile));
router.post('/profile', optionalAuthenticate, asyncHandler(updateProfile));

export default router;
