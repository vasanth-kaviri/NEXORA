import { Router } from 'express';
import { chatWithMentor } from '../controllers/ai.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/chat', asyncHandler(chatWithMentor));

export default router;
