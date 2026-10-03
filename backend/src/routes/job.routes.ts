import { Router } from 'express';
import { getJobs, getJobById } from '../controllers/job.controller';
import { optionalAuthenticate } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router: Router = Router();

router.get('/', optionalAuthenticate, asyncHandler(getJobs));
router.get('/:id', optionalAuthenticate, asyncHandler(getJobById));

export default router;
