import { Router } from 'express';
import {
  getStudents,
  updateStudent,
  deleteStudent,
  getPlatformStats,
  verifyAdminPasskey,
} from '../controllers/admin.controller';
import { optionalAuthenticate } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/verify-passkey', asyncHandler(verifyAdminPasskey));
router.get('/students', optionalAuthenticate, asyncHandler(getStudents));
router.patch('/students/:id', optionalAuthenticate, asyncHandler(updateStudent));
router.delete('/students/:id', optionalAuthenticate, asyncHandler(deleteStudent));
router.get('/stats', optionalAuthenticate, asyncHandler(getPlatformStats));

export default router;
