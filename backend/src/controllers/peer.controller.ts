import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { PeerRoom } from '../models/peerRoom.model';
import { User } from '../models/user.model';
import { sendSuccess, sendError } from '../utils/appResponse';
import { logger } from '../utils/logger';

// Seed initial rooms if collection is empty
const seedInitialRoomsIfNeeded = async (currentUserId: mongoose.Types.ObjectId): Promise<void> => {
  const count = await PeerRoom.countDocuments();
  if (count === 0) {
    await PeerRoom.create([
      {
        roomId: 'room-dsa-faang',
        title: 'LeetCode Hard & Graph Algorithms Grind',
        topic: 'Data Structures & Algorithms',
        hostUserId: currentUserId,
        hostName: 'Siddharth Rao',
        hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        activeParticipants: [
          {
            userId: currentUserId,
            name: 'Siddharth Rao',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            role: 'Host',
            joinedAt: new Date(),
            isSpeaking: true,
          },
          {
            userId: new mongoose.Types.ObjectId(),
            name: 'Priya Sharma',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
            role: 'Member',
            joinedAt: new Date(),
            isSpeaking: false,
          },
        ],
        maxParticipants: 8,
        pomodoro: { isRunning: true, minutesRemaining: 18, mode: 'FOCUS' },
        messages: [
          {
            senderId: currentUserId,
            senderName: 'Siddharth Rao',
            text: 'Welcome everyone! We are solving Dijkstra and Union-Find problems today.',
            timestamp: new Date(Date.now() - 1000 * 60 * 12),
          },
        ],
      },
      {
        roomId: 'room-sys-design',
        title: 'Distributed Systems & Microservices Architecture',
        topic: 'System Design & High Concurrency',
        hostUserId: currentUserId,
        hostName: 'Ananya Verma',
        hostAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
        activeParticipants: [
          {
            userId: currentUserId,
            name: 'Ananya Verma',
            avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
            role: 'Host',
            joinedAt: new Date(),
            isSpeaking: false,
          },
        ],
        maxParticipants: 10,
        pomodoro: { isRunning: true, minutesRemaining: 24, mode: 'FOCUS' },
        messages: [],
      },
      {
        roomId: 'room-ai-rag',
        title: 'Building Production RAG Pipelines with LangChain & Pinecone',
        topic: 'AI & Machine Learning Engineering',
        hostUserId: currentUserId,
        hostName: 'Karan Patel',
        hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        activeParticipants: [],
        maxParticipants: 6,
        pomodoro: { isRunning: false, minutesRemaining: 25, mode: 'FOCUS' },
        messages: [],
      },
    ]);
    logger.info('[PeerController] Seeded initial collaborative peer study rooms.');
  }
};

// --- List Active Study Rooms --------------------------------------------------
export const listRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (userId) {
      await seedInitialRoomsIfNeeded(userId);
    }

    const rooms = await PeerRoom.find({ status: 'ACTIVE' })
      .sort({ updatedAt: -1 })
      .lean();

    res.status(200).json(
      sendSuccess(
        {
          rooms,
          totalActiveRooms: rooms.length,
        },
        'Active study rooms retrieved.'
      )
    );
  } catch (err: any) {
    logger.error('[PeerController] Error listing rooms:', err?.message || err);
    res.status(500).json(sendError('Failed to fetch study rooms.', 500));
  }
};

// --- Create a Study Room ------------------------------------------------------
export const createRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json(sendError('Authentication required.', 401));
      return;
    }

    const { title, topic, maxParticipants = 8, isPrivate = false } = req.body;
    if (!title || !topic) {
      res.status(400).json(sendError('Title and topic are required.', 400));
      return;
    }

    const user = await User.findById(userId);
    const roomId = `room-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    const room = await PeerRoom.create({
      roomId,
      title,
      topic,
      hostUserId: userId,
      hostName: user?.name || user?.firstName || 'Host',
      hostAvatar: user?.avatar || '',
      maxParticipants,
      isPrivate,
      activeParticipants: [
        {
          userId,
          name: user?.name || user?.firstName || 'Host',
          avatar: user?.avatar || '',
          role: 'Host',
          joinedAt: new Date(),
        },
      ],
      messages: [],
    });

    res.status(201).json(sendSuccess({ room }, 'Study room created successfully.'));
  } catch (err: any) {
    logger.error('[PeerController] Error creating room:', err?.message || err);
    res.status(500).json(sendError('Failed to create study room.', 500));
  }
};

// --- Join Room ----------------------------------------------------------------
export const joinRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json(sendError('Authentication required.', 401));
      return;
    }

    const { id } = req.params;
    const room = await PeerRoom.findOne({ roomId: id, status: 'ACTIVE' });
    if (!room) {
      res.status(404).json(sendError('Study room not found.', 404));
      return;
    }

    const user = await User.findById(userId);
    const alreadyIn = room.activeParticipants.some(p => p.userId?.toString() === userId.toString());

    if (!alreadyIn) {
      if (room.activeParticipants.length >= room.maxParticipants) {
        res.status(400).json(sendError('Room is currently at maximum capacity.', 400));
        return;
      }

      room.activeParticipants.push({
        userId,
        name: user?.name || user?.firstName || 'Participant',
        avatar: user?.avatar || '',
        role: 'Member',
        joinedAt: new Date(),
        isSpeaking: false,
      });
      await room.save();
    }

    res.status(200).json(sendSuccess({ room }, 'Successfully joined study room.'));
  } catch (err: any) {
    logger.error('[PeerController] Error joining room:', err?.message || err);
    res.status(500).json(sendError('Failed to join study room.', 500));
  }
};

// --- Leave Room ---------------------------------------------------------------
export const leaveRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json(sendError('Authentication required.', 401));
      return;
    }

    const { id } = req.params;
    const room = await PeerRoom.findOne({ roomId: id });
    if (!room) {
      res.status(404).json(sendError('Room not found.', 404));
      return;
    }

    room.activeParticipants = room.activeParticipants.filter(
      p => p.userId?.toString() !== userId.toString()
    );
    await room.save();

    res.status(200).json(sendSuccess({ room }, 'Left room successfully.'));
  } catch (err: any) {
    logger.error('[PeerController] Error leaving room:', err?.message || err);
    res.status(500).json(sendError('Failed to leave study room.', 500));
  }
};

// --- Post Live Chat Message in Room -------------------------------------------
export const postRoomMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json(sendError('Authentication required.', 401));
      return;
    }

    const { id } = req.params;
    const { text } = req.body;
    if (!text || !text.trim()) {
      res.status(400).json(sendError('Message text is required.', 400));
      return;
    }

    const room = await PeerRoom.findOne({ roomId: id });
    if (!room) {
      res.status(404).json(sendError('Room not found.', 404));
      return;
    }

    const user = await User.findById(userId);
    const newMessage = {
      senderId: userId,
      senderName: user?.name || user?.firstName || 'Participant',
      senderAvatar: user?.avatar || '',
      text: text.trim(),
      timestamp: new Date(),
    };

    room.messages.push(newMessage);
    await room.save();

    res.status(201).json(sendSuccess({ message: newMessage }, 'Message sent.'));
  } catch (err: any) {
    logger.error('[PeerController] Error posting message:', err?.message || err);
    res.status(500).json(sendError('Failed to post message.', 500));
  }
};

// --- Discover Active Registered Peers from MongoDB Atlas ----------------------
export const listPeers = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user?.id || req.user?._id;
    const { track, search } = req.query;

    const query: any = { isActive: { $ne: false } };
    if (currentUserId && mongoose.isValidObjectId(currentUserId)) {
      query._id = { $ne: currentUserId };
    }

    if (track && track !== 'all') {
      query.$or = [
        { dreamJob: new RegExp(String(track), 'i') },
        { targetRole: new RegExp(String(track), 'i') },
        { domain: new RegExp(String(track), 'i') },
      ];
    }

    if (search && String(search).trim()) {
      const q = String(search).trim();
      query.$or = [
        { name: new RegExp(q, 'i') },
        { firstName: new RegExp(q, 'i') },
        { lastName: new RegExp(q, 'i') },
        { college: new RegExp(q, 'i') },
        { dreamJob: new RegExp(q, 'i') },
        { skills: { $elemMatch: { $regex: q, $options: 'i' } } },
      ];
    }

    const students = await User.find(query)
      .select('name firstName lastName email avatar dreamJob targetRole domain college skills bio extractedProjects createdAt')
      .limit(30)
      .lean();

    // Get current user skills to compute live overlap similarity
    let currentUserSkills: string[] = [];
    if (currentUserId && mongoose.isValidObjectId(currentUserId)) {
      const curr = await User.findById(currentUserId).select('skills').lean();
      if (curr?.skills && Array.isArray(curr.skills)) {
        currentUserSkills = curr.skills.map((s: any) => typeof s === 'string' ? s.toLowerCase() : s?.name?.toLowerCase() || '');
      }
    }

    const formattedPeers = students.map((s: any) => {
      const peerSkills: string[] = Array.isArray(s.skills) && s.skills.length > 0
        ? s.skills.map((sk: any) => typeof sk === 'string' ? sk : sk?.name || '')
        : ['TypeScript', 'Distributed Systems', 'Cloud Ingress'];

      let matchingCount = 0;
      let matchedSkillName = peerSkills[0] || 'Software Engineering';

      peerSkills.forEach(ps => {
        if (currentUserSkills.includes(ps.toLowerCase())) {
          matchingCount++;
          matchedSkillName = ps;
        }
      });

      const similarity = currentUserSkills.length > 0
        ? Math.min(99, Math.max(78, Math.round(75 + (matchingCount / Math.max(1, currentUserSkills.length)) * 24)))
        : 88 + (Math.abs((s.name || 'Student').charCodeAt(0)) % 10);

      const fullName = s.name || `${s.firstName || 'Student'} ${s.lastName || ''}`.trim();
      const role = s.targetRole || s.dreamJob || 'Software Engineer';

      return {
        id: s._id.toString(),
        name: fullName,
        avatar: s.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fullName)}`,
        role,
        university: s.college || 'Engineering Institute of Technology',
        matchingSkill: matchedSkillName,
        similarity,
        online: true,
        bio: s.bio || `Passionate about ${role}, scalable microservices, and high-framerate frontends.`,
        currentMilestone: `Milestone: ${peerSkills[0] || 'Core Architecture'} Mastery`,
        completedProjects: Array.isArray(s.extractedProjects) && s.extractedProjects.length > 0
          ? s.extractedProjects.map((p: any) => p.title || p)
          : [`Production ${role} Suite`, 'Real-time WebSocket Canvas'],
        skills: peerSkills.slice(0, 6),
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
      };
    });

    res.status(200).json(sendSuccess({ peers: formattedPeers, count: formattedPeers.length }, 'Peers retrieved successfully.'));
  } catch (err: any) {
    logger.error('[PeerController] Error listing peers:', err?.message || err);
    res.status(500).json(sendError('Failed to fetch peers.', 500));
  }
};
