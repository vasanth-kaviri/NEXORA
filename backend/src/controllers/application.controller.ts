import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Application, ApplicationStatus, ITimelineEntry } from '../models/application.model';
import { Job } from '../models/job.model';
import { User } from '../models/user.model';
import { sendSuccess, sendError } from '../utils/appResponse';
import { logger } from '../utils/logger';

const VALID_STATUSES: ApplicationStatus[] = [
  'SUBMITTED',
  'IN_REVIEW',
  'TECHNICAL_SCREENING',
  'INTERVIEW_SCHEDULED',
  'OFFER_EXTENDED',
  'REJECTED',
];

const STAGE_INDEX_MAP: Record<ApplicationStatus, number> = {
  SUBMITTED: 0,
  IN_REVIEW: 1,
  TECHNICAL_SCREENING: 2,
  INTERVIEW_SCHEDULED: 3,
  OFFER_EXTENDED: 4,
  REJECTED: 4,
};

/**
 * POST /api/v1/applications
 * Persists a new job, internship, or scholarship application to MongoDB Atlas with
 * state machine triage and duplicate application guard.
 */
export const createApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?._id || req.body.userId;

    if (!userId) {
      res.status(401).json(sendError('Authentication required to submit applications.', 401));
      return;
    }

    const {
      opportunityId,
      opportunityType,
      title,
      role,
      company,
      applicantSnapshot,
      jobDetails,
      atsScore,
      candidateName,
      email,
      phone,
      education,
      resumeName,
      coverNote,
      portfolioLink,
    } = req.body;

    if (!opportunityId || (!title && !role) || !company) {
      res.status(400).json(sendError('Missing required application fields (opportunityId, title/role, company).', 400));
      return;
    }

    // 1. Duplicate Application Guard: Check if user already applied to this specific opportunity
    const existingApp = await Application.findOne({
      userId: new mongoose.Types.ObjectId(String(userId)),
      $or: [
        { opportunityId: String(opportunityId) },
        ...(mongoose.isValidObjectId(opportunityId) ? [{ opportunityId: new mongoose.Types.ObjectId(String(opportunityId)) }] : []),
      ],
    });

    if (existingApp) {
      res.status(409).json(
        sendError('You have already submitted an active application for this opportunity.', 409)
      );
      return;
    }

    // 2. Fetch User and Opportunity documents to calculate matched skills and score
    const userDoc = await User.findById(userId).lean();
    let jobDoc: any = null;
    if (mongoose.isValidObjectId(opportunityId)) {
      jobDoc = await Job.findById(opportunityId).lean();
    }
    if (!jobDoc) {
      jobDoc = await Job.findOne({
        $or: [
          { _id: opportunityId },
          { id: opportunityId },
          { title: title || role, company: company }
        ]
      }).lean();
    }

    // Extract user skill strings
    const rawUserSkills = userDoc?.skills || [];
    const userSkills: string[] = rawUserSkills.map((s: any) =>
      typeof s === 'string' ? s : s?.name || ''
    ).filter(Boolean);

    // Extract job required skill strings
    const requiredSkills: string[] = jobDoc?.requiredSkills || jobDetails?.tags || [];

    // Calculate matched skills
    const matchedSkills = userSkills.filter(uSkill =>
      requiredSkills.some(rSkill => rSkill.toLowerCase().trim() === uSkill.toLowerCase().trim())
    );

    // Determine candidate resume/ATS score
    let calculatedScore = 85;
    if (typeof atsScore === 'number' && atsScore > 0) {
      calculatedScore = atsScore;
    } else if (userDoc?.atsScore && userDoc.atsScore > 0) {
      calculatedScore = userDoc.atsScore;
    } else if (requiredSkills.length > 0) {
      const matchRatio = matchedSkills.length / requiredSkills.length;
      calculatedScore = Math.min(99, Math.max(65, Math.round(matchRatio * 35 + 64)));
    } else if (jobDetails?.match) {
      calculatedScore = Number(jobDetails.match);
    }

    // Build applicant snapshot
    const resolvedSnapshot = {
      fullName: applicantSnapshot?.fullName || candidateName || applicantSnapshot?.name || userDoc?.name || 'Applicant',
      name: applicantSnapshot?.name || applicantSnapshot?.fullName || candidateName || userDoc?.name || 'Applicant',
      email: applicantSnapshot?.email || email || userDoc?.email || 'applicant@nexora.internal',
      phone: applicantSnapshot?.phone || phone || userDoc?.phone || '',
      resumeScore: calculatedScore,
      matchedSkills: matchedSkills.length > 0 ? matchedSkills : (applicantSnapshot?.matchedSkills || userSkills.slice(0, 5)),
      resumeName: applicantSnapshot?.resumeName || resumeName || 'Resume_Candidate.pdf',
      education: applicantSnapshot?.education || education || userDoc?.education || 'Computer Science & Engineering',
      coverNote: applicantSnapshot?.coverNote || coverNote || '',
      portfolioLink: applicantSnapshot?.portfolioLink || portfolioLink || '',
    };

    // 3. Initialize timeline with initial 'SUBMITTED' stage
    const initialTimeline: ITimelineEntry[] = [
      {
        stage: 'SUBMITTED',
        timestamp: new Date(),
        recruiterNotes: 'Application received and verified by talent ingestion pipeline.',
        actionTakenBy: 'Recruiter Engine',
      },
    ];

    let finalStatus: ApplicationStatus = 'SUBMITTED';
    let stageIndex = 0;

    // 4. Automated State Machine Execution:
    // If resumeScore >= 75: Append immediate transition to 'IN_REVIEW' with simulated timeline entry
    // Else: Append note: 'Profile queued for secondary competency review.'
    if (calculatedScore >= 75) {
      finalStatus = 'IN_REVIEW';
      stageIndex = 1;
      initialTimeline.push({
        stage: 'IN_REVIEW',
        timestamp: new Date(Date.now() + 1000),
        recruiterNotes: 'Automated ATS screening passed. Profile routed to Technical Hiring Manager.',
        actionTakenBy: 'Recruiter Engine',
      });
    } else {
      initialTimeline[0].recruiterNotes += ' Profile queued for secondary competency review.';
    }

    const effectiveRole = String(role || title || 'Software Engineer').trim();
    const effectiveTitle = String(title || role || 'Software Engineer').trim();
    const validOpportunityType = ['JOB', 'INTERNSHIP', 'SCHOLARSHIP'].includes(opportunityType)
      ? opportunityType
      : (jobDoc?.type === 'Internship' ? 'INTERNSHIP' : 'JOB');

    const createdApplication = await Application.create({
      userId: new mongoose.Types.ObjectId(String(userId)),
      opportunityId: mongoose.isValidObjectId(opportunityId)
        ? new mongoose.Types.ObjectId(String(opportunityId))
        : String(opportunityId),
      company: String(company).trim(),
      role: effectiveRole,
      title: effectiveTitle,
      opportunityType: validOpportunityType,
      applicantSnapshot: resolvedSnapshot,
      status: finalStatus,
      timeline: initialTimeline,
      recruiterFeedback: {
        technicalRating: calculatedScore >= 90 ? 9 : (calculatedScore >= 80 ? 8 : 7),
        strengths: matchedSkills.slice(0, 4),
        growthAreas: requiredSkills.filter(r => !matchedSkills.includes(r)).slice(0, 3),
      },
      stageIndex,
      stages: ['Submitted', 'In Review', 'Technical Screening', 'Interview Scheduled', 'Final Decision'],
      atsScore: calculatedScore,
      jobDetails: jobDetails || jobDoc || {},
      appliedAt: new Date(),
    });

    const totalApplications = await Application.countDocuments({
      userId: new mongoose.Types.ObjectId(String(userId)),
    });

    logger.info(`[ApplicationTracker] Application created for user ${userId} to ${company} (${effectiveRole}) with status: ${finalStatus}. Total: ${totalApplications}`);

    res.status(201).json(
      sendSuccess(
        {
          application: createdApplication,
          totalApplications,
        },
        `Application officially submitted to ${company}! Auto-triaged to ${finalStatus === 'IN_REVIEW' ? 'Technical Review' : 'Competency Queue'}.`
      )
    );
  } catch (err: unknown) {
    logger.error('[ApplicationController] Error creating application:', err);
    res.status(500).json(sendError('Failed to record application in tracker.', 500));
  }
};

/**
 * GET /api/v1/applications/user-timeline
 * Returns all active and historical applications for the logged-in user with populated
 * job details, ordered by updatedAt descending.
 */
export const getUserTimeline = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?._id || req.query.userId;

    if (!userId) {
      res.status(401).json(sendError('Authentication required to view application timeline.', 401));
      return;
    }

    const applications = await Application.find({
      userId: new mongoose.Types.ObjectId(String(userId)),
    })
      .sort({ updatedAt: -1 })
      .lean();

    // Extract all opportunity IDs that are valid ObjectIds to batch populate Jobs
    const validJobObjectIds = applications
      .map((app: any) => app.opportunityId)
      .filter((id: any) => mongoose.isValidObjectId(id))
      .map((id: any) => new mongoose.Types.ObjectId(String(id)));

    const jobsMap = new Map<string, any>();
    if (validJobObjectIds.length > 0) {
      const jobs = await Job.find({ _id: { $in: validJobObjectIds } }).lean();
      jobs.forEach((j: any) => jobsMap.set(j._id.toString(), j));
    }

    // Normalize and format timeline response
    const formatted = applications.map((app: any) => {
      const oppIdStr = app.opportunityId?.toString() || '';
      const popJob = jobsMap.get(oppIdStr) || null;
      return {
        ...app,
        id: app._id.toString(),
        jobId: oppIdStr,
        jobDetails: popJob || app.jobDetails || {},
        stageIndex: STAGE_INDEX_MAP[app.status as ApplicationStatus] ?? app.stageIndex ?? 0,
        timeline: (app.timeline || []).sort(
          (a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ),
      };
    });

    res.status(200).json(
      sendSuccess(
        {
          applications: formatted,
          count: formatted.length,
        },
        'User application timeline retrieved successfully.'
      )
    );
  } catch (err: unknown) {
    logger.error('[ApplicationController] Error fetching user timeline:', err);
    res.status(500).json(sendError('Failed to fetch user application timeline.', 500));
  }
};

/**
 * PATCH /api/v1/applications/:id/status
 * Recruiter/Admin status override: transitions status and appends custom timeline event.
 */
export const updateApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, recruiterNotes, actionTakenBy, recruiterFeedback } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json(sendError('Invalid application ID format.', 400));
      return;
    }

    if (!status || !VALID_STATUSES.includes(status as ApplicationStatus)) {
      res.status(400).json(
        sendError(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`, 400)
      );
      return;
    }

    const application = await Application.findById(id);
    if (!application) {
      res.status(404).json(sendError('Application not found.', 404));
      return;
    }

    const newStatus = status as ApplicationStatus;
    application.status = newStatus;
    application.stageIndex = STAGE_INDEX_MAP[newStatus] ?? 0;

    // Default note messages per stage if not provided
    const defaultNotesMap: Record<ApplicationStatus, string> = {
      SUBMITTED: 'Application reset to submitted status.',
      IN_REVIEW: 'Candidate profile forwarded to Technical Hiring Manager.',
      TECHNICAL_SCREENING: 'Candidate passed preliminary screening. 45-minute live technical coding session scheduled.',
      INTERVIEW_SCHEDULED: 'Formal interview loop confirmed with Staff Engineers & Engineering Director.',
      OFFER_EXTENDED: 'Congratulations! Official employment offer letter generated and dispatched.',
      REJECTED: 'Candidate profile does not match current team requirements. Feedback provided.',
    };

    const newTimelineEntry: ITimelineEntry = {
      stage: newStatus,
      timestamp: new Date(),
      recruiterNotes: recruiterNotes || defaultNotesMap[newStatus],
      actionTakenBy: actionTakenBy || 'Recruiter Admin',
    };

    application.timeline.push(newTimelineEntry);

    if (recruiterFeedback) {
      application.recruiterFeedback = {
        technicalRating: recruiterFeedback.technicalRating ?? application.recruiterFeedback?.technicalRating,
        strengths: recruiterFeedback.strengths ?? application.recruiterFeedback?.strengths ?? [],
        growthAreas: recruiterFeedback.growthAreas ?? application.recruiterFeedback?.growthAreas ?? [],
      };
    }

    await application.save();

    logger.info(`[ApplicationTracker] Application ${id} status updated to ${newStatus} by ${newTimelineEntry.actionTakenBy}`);

    res.status(200).json(
      sendSuccess(
        {
          application,
          timeline: application.timeline,
        },
        `Application status successfully transitioned to ${newStatus}.`
      )
    );
  } catch (err: unknown) {
    logger.error('[ApplicationController] Error updating application status:', err);
    res.status(500).json(sendError('Failed to update application status.', 500));
  }
};

/**
 * GET /api/v1/applications/my-count
 * Returns live count of active applications for the authenticated user.
 */
export const getMyApplicationCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?._id || req.query.userId;

    if (!userId) {
      res.status(200).json(sendSuccess({ count: 0 }, 'No authenticated session.'));
      return;
    }

    const count = await Application.countDocuments({
      userId: new mongoose.Types.ObjectId(String(userId)),
    });

    res.status(200).json(
      sendSuccess(
        { count },
        'Active application count retrieved successfully.'
      )
    );
  } catch (err: unknown) {
    logger.error('[ApplicationController] Error fetching application count:', err);
    res.status(500).json(sendError('Failed to fetch application count.', 500));
  }
};

/**
 * GET /api/v1/applications/my-applications
 * Backward-compatible endpoint aliasing to user applications list.
 */
export const getMyApplications = async (req: Request, res: Response): Promise<void> => {
  return getUserTimeline(req, res);
};
