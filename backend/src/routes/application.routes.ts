import { Router } from 'express';
import {
  createApplication,
  getMyApplicationCount,
  getMyApplications,
  getUserTimeline,
  updateApplicationStatus,
} from '../controllers/application.controller';
import { optionalAuthenticate } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router: Router = Router();

router.post('/', optionalAuthenticate, asyncHandler(createApplication));
router.get('/user-timeline', optionalAuthenticate, asyncHandler(getUserTimeline));
router.get('/my-count', optionalAuthenticate, asyncHandler(getMyApplicationCount));
router.get('/my-applications', optionalAuthenticate, asyncHandler(getMyApplications));
router.patch('/:id/status', optionalAuthenticate, asyncHandler(updateApplicationStatus));

export default router;
