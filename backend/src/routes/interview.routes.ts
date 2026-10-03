import { Router } from 'express';
import {
  completeInterview,
  getMyInterviews,
  getLatestInterview,
} from '../controllers/interview.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/complete', authenticate, asyncHandler(completeInterview));
router.get('/my-history', authenticate, asyncHandler(getMyInterviews));
router.get('/latest', authenticate, asyncHandler(getLatestInterview));

export default router;
