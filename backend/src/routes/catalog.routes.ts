import { Router } from 'express';
import {
  getResources,
  getHackathons,
  getScholarships,
} from '../controllers/catalog.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/resources', asyncHandler(getResources));
router.get('/hackathons', asyncHandler(getHackathons));
router.get('/scholarships', asyncHandler(getScholarships));

export default router;
