import { Router } from 'express';
import {
  submitAssessment,
  getMyAssessments,
  getSkillGapAnalysis,
} from '../controllers/assessment.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/submit', authenticate, asyncHandler(submitAssessment));
router.get('/my-history', authenticate, asyncHandler(getMyAssessments));
router.get('/skill-gap', authenticate, asyncHandler(getSkillGapAnalysis));

export default router;
