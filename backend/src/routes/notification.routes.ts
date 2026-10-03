import { Router } from 'express';
import {
  getMyNotifications,
  markNotificationRead,
  markAllRead,
} from '../controllers/notification.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', authenticate, asyncHandler(getMyNotifications));
router.patch('/:id/read', authenticate, asyncHandler(markNotificationRead));
router.patch('/mark-all-read', authenticate, asyncHandler(markAllRead));

export default router;
