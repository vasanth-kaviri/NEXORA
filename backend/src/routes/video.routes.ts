import { Router } from 'express';
import {
  getVideosByDomain,
  getVideoDetails,
  getUserVideoProgress,
  updateUserVideoProgress,
  addVideoNote,
  getCatalogOverview,
} from '../controllers/video.controller';
import { authenticate, optionalAuthenticate } from '../middlewares/auth.middleware';

const router = Router();

// GET /api/v1/videos/catalog/overview - All domains overview
router.get('/catalog/overview', getCatalogOverview);

// GET /api/v1/videos/domain/:domainId - Videos for a specific domain
router.get('/domain/:domainId', getVideosByDomain);

// GET /api/v1/videos/:videoId - Specific video details
router.get('/:videoId', getVideoDetails);

// GET /api/v1/videos/:videoId/progress - User watch progress
router.get('/:videoId/progress', authenticate, getUserVideoProgress);

// PATCH /api/v1/videos/:videoId/progress - Autosave position & update percentage
router.patch('/:videoId/progress', authenticate, updateUserVideoProgress);

// POST /api/v1/videos/:videoId/notes - Add timestamped notebook entry
router.post('/:videoId/notes', authenticate, addVideoNote);

export default router;
