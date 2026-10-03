import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/appResponse';
import { logger } from '../utils/logger';
import {
  getVideosForDomain,
  getVideoById,
  getDomainVideoCounts,
  CURATED_VIDEO_CATALOG,
} from '../services/videoProvider.service';
import { UserVideoProgress } from '../models/videoProgress.model';
import { User } from '../models/user.model';

/**
 * GET /api/v1/videos/domain/:domainId
 * Retrieves all curated video masterclasses for a specific engineering domain.
 */
export const getVideosByDomain = async (req: Request, res: Response): Promise<void> => {
  try {
    const { domainId } = req.params;
    if (!domainId) {
      res.status(400).json(sendError('Domain ID parameter is required.', 400));
      return;
    }

    const videos = await getVideosForDomain(domainId);
    res.status(200).json(sendSuccess({ domainId, count: videos.length, videos }, 'Videos retrieved successfully.'));
  } catch (err) {
    logger.error('[VideoController] Error in getVideosByDomain:', err);
    res.status(500).json(sendError('Failed to retrieve video lectures for domain.', 500));
  }
};

/**
 * GET /api/v1/videos/:videoId
 * Retrieves a single video masterclass details including chapters and takeaways.
 */
export const getVideoDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { videoId } = req.params;
    const video = getVideoById(videoId);

    if (!video) {
      res.status(404).json(sendError(`Video with ID '${videoId}' not found.`, 404));
      return;
    }

    res.status(200).json(sendSuccess({ video }, 'Video details retrieved successfully.'));
  } catch (err) {
    logger.error('[VideoController] Error in getVideoDetails:', err);
    res.status(500).json(sendError('Failed to retrieve video details.', 500));
  }
};

/**
 * GET /api/v1/videos/:videoId/progress
 * Retrieves the authenticated student's playback position and notes for a video.
 */
export const getUserVideoProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user?._id) {
      res.status(401).json(sendError('Authentication required to retrieve video progress.', 401));
      return;
    }

    const { videoId } = req.params;
    const progress = await UserVideoProgress.findOne({
      userId: user._id,
      videoId,
    });

    if (!progress) {
      res.status(200).json(
        sendSuccess(
          {
            progress: {
              videoId,
              lastPositionSeconds: 0,
              totalDurationSeconds: 0,
              watchPercentage: 0,
              completed: false,
              notes: [],
            },
          },
          'Initial progress state.',
        ),
      );
      return;
    }

    res.status(200).json(sendSuccess({ progress }, 'User video progress retrieved.'));
  } catch (err) {
    logger.error('[VideoController] Error in getUserVideoProgress:', err);
    res.status(500).json(sendError('Failed to retrieve user progress.', 500));
  }
};

/**
 * PATCH /api/v1/videos/:videoId/progress
 * Atomically updates playback timestamp, watch percentage, and completion status.
 * Awards +50 XP if the student reaches >= 90% completion for the first time.
 */
export const updateUserVideoProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user?._id) {
      res.status(401).json(sendError('Authentication required to update video progress.', 401));
      return;
    }

    const { videoId } = req.params;
    const { domainId, lastPositionSeconds, totalDurationSeconds } = req.body;

    if (lastPositionSeconds === undefined || totalDurationSeconds === undefined) {
      res.status(400).json(sendError('lastPositionSeconds and totalDurationSeconds are required.', 400));
      return;
    }

    const video = getVideoById(videoId);
    const resolvedDomain = domainId || video?.domainId || 'fullstack';

    const watchPercentage =
      totalDurationSeconds > 0
        ? Math.min(100, Math.round((lastPositionSeconds / totalDurationSeconds) * 100))
        : 0;

    let progress = await UserVideoProgress.findOne({
      userId: user._id,
      videoId,
    });

    let newlyCompleted = false;

    if (!progress) {
      const isCompleted = watchPercentage >= 90;
      if (isCompleted) newlyCompleted = true;

      progress = new UserVideoProgress({
        userId: user._id,
        videoId,
        domainId: resolvedDomain,
        lastPositionSeconds,
        totalDurationSeconds,
        watchPercentage,
        completed: isCompleted,
        completedAt: isCompleted ? new Date() : undefined,
      });
    } else {
      progress.lastPositionSeconds = lastPositionSeconds;
      progress.totalDurationSeconds = totalDurationSeconds;
      progress.watchPercentage = Math.max(progress.watchPercentage, watchPercentage);

      if (!progress.completed && watchPercentage >= 90) {
        progress.completed = true;
        progress.completedAt = new Date();
        newlyCompleted = true;
      }
    }

    await progress.save();

    // Grant +50 XP if newly completed
    if (newlyCompleted) {
      try {
        await User.findByIdAndUpdate(user._id, { $inc: { xp: 50 } });
        logger.info(`[VideoController] Awarded +50 XP to user ${user._id} for completing video ${videoId}`);
      } catch (xpErr) {
        logger.warn('[VideoController] XP increment non-critical error:', xpErr);
      }
    }

    res.status(200).json(
      sendSuccess(
        {
          progress,
          newlyCompleted,
          xpAwarded: newlyCompleted ? 50 : 0,
        },
        'Video progress saved successfully.',
      ),
    );
  } catch (err) {
    logger.error('[VideoController] Error in updateUserVideoProgress:', err);
    res.status(500).json(sendError('Failed to update video progress.', 500));
  }
};

/**
 * POST /api/v1/videos/:videoId/notes
 * Adds a timestamped note to the student's notebook for this video masterclass.
 */
export const addVideoNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user?._id) {
      res.status(401).json(sendError('Authentication required to save notes.', 401));
      return;
    }

    const { videoId } = req.params;
    const { timestampSeconds, text, domainId } = req.body;

    if (!text || text.trim().length === 0) {
      res.status(400).json(sendError('Note text cannot be empty.', 400));
      return;
    }

    let progress = await UserVideoProgress.findOne({
      userId: user._id,
      videoId,
    });

    if (!progress) {
      progress = new UserVideoProgress({
        userId: user._id,
        videoId,
        domainId: domainId || 'fullstack',
        lastPositionSeconds: timestampSeconds || 0,
        totalDurationSeconds: 0,
        watchPercentage: 0,
        completed: false,
        notes: [],
      });
    }

    const newNote = {
      timestampSeconds: timestampSeconds || 0,
      text: text.trim(),
      createdAt: new Date(),
    };

    progress.notes.push(newNote);
    await progress.save();

    res.status(201).json(sendSuccess({ note: newNote, notesCount: progress.notes.length }, 'Note saved successfully.'));
  } catch (err) {
    logger.error('[VideoController] Error in addVideoNote:', err);
    res.status(500).json(sendError('Failed to add note.', 500));
  }
};

/**
 * GET /api/v1/videos/catalog/overview
 * Returns an overview of all 12 domains, their video counts, and featured lectures.
 */
export const getCatalogOverview = async (_req: Request, res: Response): Promise<void> => {
  try {
    const counts = getDomainVideoCounts();
    const featured = CURATED_VIDEO_CATALOG.slice(0, 6);

    res.status(200).json(
      sendSuccess(
        {
          totalVideos: CURATED_VIDEO_CATALOG.length,
          domainCounts: counts,
          featuredVideos: featured,
        },
        'Catalog overview retrieved.',
      ),
    );
  } catch (err) {
    logger.error('[VideoController] Error in getCatalogOverview:', err);
    res.status(500).json(sendError('Failed to retrieve catalog overview.', 500));
  }
};
