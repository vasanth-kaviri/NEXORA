import { Router } from 'express';
import {
  listRooms,
  createRoom,
  joinRoom,
  leaveRoom,
  postRoomMessage,
  listPeers,
} from '../controllers/peer.controller';
import { authenticate, optionalAuthenticate } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/users', optionalAuthenticate, asyncHandler(listPeers));
router.get('/rooms', optionalAuthenticate, asyncHandler(listRooms));
router.post('/rooms', authenticate, asyncHandler(createRoom));
router.post('/rooms/:id/join', authenticate, asyncHandler(joinRoom));
router.post('/rooms/:id/leave', authenticate, asyncHandler(leaveRoom));
router.post('/rooms/:id/messages', authenticate, asyncHandler(postRoomMessage));

export default router;
