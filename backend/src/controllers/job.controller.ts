import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Job } from '../models/job.model';
import { User } from '../models/user.model';
import { sendSuccess, sendError } from '../utils/appResponse';
import { logger } from '../utils/logger';

/**
 * Normalizes user skill tokens for fuzzy/substring matching
 */
const normalizeSkillToken = (token: any): string => {
  if (!token) return '';
  if (typeof token === 'string') return token.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (typeof token === 'object' && token.name) return String(token.name).toLowerCase().replace(/[^a-z0-9]/g, '');
  return '';
};

/**
 * GET /api/v1/jobs
 * Discovers real-world industry jobs with dynamic query filtering and personalized skill-overlap match scoring.
 */
export const getJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { domain, role, type, remoteOnly, search } = req.query;

    const filter: Record<string, any> = {};

    // Domain filter
    if (domain && typeof domain === 'string' && domain.toLowerCase() !== 'all') {
      filter.domain = { $regex: new RegExp(domain.trim(), 'i') };
    }

    // Role filter
    if (role && typeof role === 'string' && role.toLowerCase() !== 'all') {
      filter.role = { $regex: new RegExp(role.trim(), 'i') };
    }

    // Type filter (Full-Time vs Internship)
    if (type && typeof type === 'string' && type.toLowerCase() !== 'all') {
      if (type.toLowerCase() === 'internship') {
        filter.type = 'Internship';
      } else if (type.toLowerCase() === 'full-time' || type.toLowerCase() === 'fulltime') {
        filter.type = 'Full-Time';
      }
    }

    // Remote only filter
    if (remoteOnly === 'true' || remoteOnly === '1') {
      filter.remote = true;
    }

    // Keyword search filter across title, company, domain, and skills
    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { company: { $regex: q, $options: 'i' } },
        { domain: { $regex: q, $options: 'i' } },
        { role: { $regex: q, $options: 'i' } },
        { requiredSkills: { $elemMatch: { $regex: q, $options: 'i' } } },
      ];
    }

    const rawJobs = await Job.find(filter).lean();

    // ── DYNAMIC MATCH SCORE ENGINE ──
    // If user is authenticated, calculate real-time match based on skill overlaps
    let userSkillTokens: Set<string> = new Set();
    const userId = req.user?.id || req.user?._id;

    if (req.user?.skills && Array.isArray(req.user.skills)) {
      userSkillTokens = new Set(req.user.skills.map(normalizeSkillToken).filter(Boolean));
    } else if (userId && mongoose.isValidObjectId(userId)) {
      const user = await User.findById(userId).select('skills targetRole domain').lean();
      if (user?.skills && Array.isArray(user.skills)) {
        userSkillTokens = new Set(user.skills.map(normalizeSkillToken).filter(Boolean));
      }
    }

    const scoredJobs = rawJobs.map((job: any) => {
      let computedMatch = 85;

      if (userSkillTokens.size > 0 && Array.isArray(job.requiredSkills) && job.requiredSkills.length > 0) {
        const requiredTokens = job.requiredSkills.map(normalizeSkillToken).filter(Boolean);
        const matchCount = requiredTokens.filter((token: string) => userSkillTokens.has(token)).length;
        const ratio = matchCount / requiredTokens.length;

        // Baseline 68% + dynamic proportional boost up to 30%
        computedMatch = Math.round(68 + ratio * 30);

        if (matchCount >= 4) {
          computedMatch = Math.max(computedMatch, 96);
        } else if (matchCount >= 3) {
          computedMatch = Math.max(computedMatch, 92);
        } else if (matchCount >= 2) {
          computedMatch = Math.max(computedMatch, 88);
        } else if (matchCount >= 1) {
          computedMatch = Math.max(computedMatch, 82);
        }
      } else {
        // Deterministic realistic baseline for unauthenticated / non-calibrated users
        const hash = (job.title + job.company).split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
        computedMatch = 80 + (hash % 17); // 80% to 96%
      }

      return {
        ...job,
        id: job._id.toString(),
        match: Math.min(Math.max(computedMatch, 60), 99),
      };
    });

    // Sort by highest match score first, then by nearest deadline
    scoredJobs.sort((a, b) => {
      if (b.match !== a.match) {
        return b.match - a.match;
      }
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });

    res.status(200).json(
      sendSuccess(
        {
          jobs: scoredJobs,
          total: scoredJobs.length,
          filtersApplied: { domain, role, type, remoteOnly, search },
        },
        'Industry jobs retrieved and scored successfully.'
      )
    );
  } catch (err: unknown) {
    logger.error('[JobController] Error retrieving jobs:', err);
    res.status(500).json(sendError('Failed to fetch job opportunities.', 500));
  }
};

/**
 * GET /api/v1/jobs/:id
 * Retrieves a single job by ID with dynamic match score.
 */
export const getJobById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json(sendError('Invalid job ID format.', 400));
      return;
    }

    const job = await Job.findById(id).lean();
    if (!job) {
      res.status(404).json(sendError('Job opportunity not found.', 404));
      return;
    }

    let computedMatch = 88;
    const userId = req.user?.id || req.user?._id;
    if (userId && mongoose.isValidObjectId(userId)) {
      const user = await User.findById(userId).select('skills').lean();
      if (user?.skills && Array.isArray(user.skills) && Array.isArray(job.requiredSkills)) {
        const userSkillTokens = new Set(user.skills.map(normalizeSkillToken).filter(Boolean));
        const requiredTokens = job.requiredSkills.map(normalizeSkillToken).filter(Boolean);
        const matchCount = requiredTokens.filter((token: string) => userSkillTokens.has(token)).length;
        computedMatch = Math.round(70 + (matchCount / requiredTokens.length) * 28);
      }
    }

    res.status(200).json(
      sendSuccess(
        {
          job: {
            ...job,
            id: job._id.toString(),
            match: computedMatch,
          },
        },
        'Job details retrieved successfully.'
      )
    );
  } catch (err: unknown) {
    logger.error('[JobController] Error fetching job by ID:', err);
    res.status(500).json(sendError('Failed to fetch job details.', 500));
  }
};
