import { Router } from 'express';
import { getRoadmap, updateMilestoneProgress } from '../controllers/roadmap.controller';
import { authenticate, optionalAuthenticate } from '../middlewares/auth.middleware';

const router = Router();

// GET /api/v1/roadmap?role=...&domain=...
// Retrieves the authenticated user's active DAG roadmap or seeds from production catalog
router.get('/', optionalAuthenticate, getRoadmap);

// PATCH /api/v1/roadmap/milestones/:milestoneId
// Updates milestone status and triggers DAG sequential unlocks
router.patch('/milestones/:milestoneId', authenticate, updateMilestoneProgress);

export default router;
