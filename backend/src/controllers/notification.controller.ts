import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Notification } from '../models/notification.model';
import { sendSuccess, sendError } from '../utils/appResponse';
import { logger } from '../utils/logger';

// Seed initial notifications for user if empty
const seedUserNotificationsIfNeeded = async (userId: mongoose.Types.ObjectId): Promise<void> => {
  const count = await Notification.countDocuments({ userId });
  if (count === 0) {
    await Notification.create([
      {
        userId,
        title: 'Welcome to NEXORA OS',
        message: 'Your decentralized AI career elevation workspace is configured and ready.',
        type: 'SYSTEM',
        read: false,
        link: '/explore',
      },
      {
        userId,
        title: 'Roadmap Milestone Available',
        message: 'Milestone 1: Fundamental Architecture & DAG Node Execution is active.',
        type: 'ROADMAP',
        read: false,
        link: '/roadmap',
      },
      {
        userId,
        title: 'Smart India Hackathon 2026 Registration',
        message: 'Registration window is live for SIH 2026 national public tech problems.',
        type: 'HACKATHON',
        read: false,
        link: '/hackathons',
      },
      {
        userId,
        title: 'MNC Mock Interview Proctoring Lab',
        message: 'Take a proctored AI interview with speech recognition and eye-tracking alerts.',
        type: 'INTERVIEW',
        read: false,
        link: '/mock-interview',
      },
    ]);
  }
};

// --- Get User Notifications ---------------------------------------------------
export const getMyNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json(sendError('Authentication required.', 401));
      return;
    }

    await seedUserNotificationsIfNeeded(userId);

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    const unreadCount = await Notification.countDocuments({ userId, read: false });

    res.status(200).json(
      sendSuccess(
        {
          notifications,
          unreadCount,
        },
        'Notifications fetched successfully.'
      )
    );
  } catch (err: any) {
    logger.error('[NotificationController] Error fetching notifications:', err?.message || err);
    res.status(500).json(sendError('Failed to fetch notifications.', 500));
  }
};

// --- Mark Single Notification Read -------------------------------------------
export const markNotificationRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    const notif = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { read: true },
      { new: true }
    );

    if (!notif) {
      res.status(404).json(sendError('Notification not found.', 404));
      return;
    }

    res.status(200).json(sendSuccess({ notification: notif }, 'Notification marked as read.'));
  } catch (err: any) {
    logger.error('[NotificationController] Error marking read:', err?.message || err);
    res.status(500).json(sendError('Failed to update notification.', 500));
  }
};

// --- Mark All Read -----------------------------------------------------------
export const markAllRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json(sendError('Authentication required.', 401));
      return;
    }

    await Notification.updateMany({ userId, read: false }, { read: true });
    res.status(200).json(sendSuccess(null, 'All notifications marked as read.'));
  } catch (err: any) {
    logger.error('[NotificationController] Error marking all read:', err?.message || err);
    res.status(500).json(sendError('Failed to mark all notifications as read.', 500));
  }
};
