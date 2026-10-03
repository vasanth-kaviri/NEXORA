import { Request, Response } from 'express';
import { Assessment } from '../models/assessment.model';
import { User } from '../models/user.model';
import { sendSuccess, sendError } from '../utils/appResponse';
import { logger } from '../utils/logger';

// --- Submit a Quiz or Technical Assessment ------------------------------------
export const submitAssessment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json(sendError('Authentication required to submit assessment.', 401));
      return;
    }

    const {
      type = 'QUIZ',
      track = 'Full-Stack Web Engineering',
      totalQuestions = 0,
      correctAnswers = 0,
      percentage = 0,
      timeSpentSeconds = 0,
      responses = [],
      skillVector,
    } = req.body;

    const passed = percentage >= 60;
    const score = correctAnswers * 15; // 15 XP per correct answer

    const newAssessment = await Assessment.create({
      userId,
      type,
      track,
      score,
      totalQuestions,
      correctAnswers,
      percentage,
      passed,
      timeSpentSeconds,
      responses,
      skillVector: skillVector || {
        frontend: Math.min(100, Math.max(40, percentage + 5)),
        backend: Math.min(100, Math.max(35, percentage - 5)),
        database: Math.min(100, Math.max(40, percentage)),
        systemDesign: Math.min(100, Math.max(30, percentage - 10)),
        devops: Math.min(100, Math.max(35, percentage - 8)),
        security: Math.min(100, Math.max(40, percentage + 2)),
        overallScore: percentage,
      },
    });

    // Update user stats in User model
    const user = await User.findById(userId);
    if (user) {
      // Award XP to user if field exists or append skills
      const currentSkills = user.skills || [];
      const newSkills = [...currentSkills];
      if (percentage >= 70 && !newSkills.includes(track)) {
        newSkills.push(track);
        user.skills = newSkills;
      }
      await user.save();
    }

    logger.info(`[AssessmentController] User ${userId} submitted ${type} for track "${track}". Score: ${percentage}%`);

    res.status(201).json(
      sendSuccess(
        {
          assessment: newAssessment,
          xpAwarded: score,
          passed,
        },
        'Assessment submitted and saved successfully.'
      )
    );
  } catch (err: any) {
    logger.error('[AssessmentController] Error submitting assessment:', err?.message || err);
    res.status(500).json(sendError(err?.message || 'Failed to submit assessment.', 500));
  }
};

// --- Get Student's Assessment & Quiz History ----------------------------------
export const getMyAssessments = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json(sendError('Authentication required.', 401));
      return;
    }

    const { type } = req.query;
    const query: any = { userId };
    if (type) {
      query.type = type;
    }

    const assessments = await Assessment.find(query)
      .sort({ completedAt: -1 })
      .limit(30)
      .lean();

    const totalSubmissions = await Assessment.countDocuments({ userId });
    const averageScore =
      assessments.length > 0
        ? Math.round(assessments.reduce((acc, a) => acc + (a.percentage || 0), 0) / assessments.length)
        : 0;

    res.status(200).json(
      sendSuccess(
        {
          assessments,
          totalSubmissions,
          averageScore,
        },
        'Assessment history retrieved.'
      )
    );
  } catch (err: any) {
    logger.error('[AssessmentController] Error fetching history:', err?.message || err);
    res.status(500).json(sendError('Failed to fetch assessment history.', 500));
  }
};

// --- Get Aggregated Skill Gap Analysis ----------------------------------------
export const getSkillGapAnalysis = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json(sendError('Authentication required.', 401));
      return;
    }

    const latestAssessment = await Assessment.findOne({ userId })
      .sort({ completedAt: -1 })
      .lean();

    const vector = latestAssessment?.skillVector || {
      frontend: 78,
      backend: 65,
      database: 60,
      systemDesign: 52,
      devops: 58,
      security: 62,
      overallScore: 68,
    };

    res.status(200).json(
      sendSuccess(
        {
          skillVector: vector,
          latestSubmission: latestAssessment ? latestAssessment.completedAt : null,
        },
        'Skill gap analysis retrieved.'
      )
    );
  } catch (err: any) {
    logger.error('[AssessmentController] Error fetching skill gap:', err?.message || err);
    res.status(500).json(sendError('Failed to fetch skill gap analysis.', 500));
  }
};
