import { Request, Response } from 'express';
import { Roadmap, IRoadmap, MilestoneStatus } from '../models/roadmap.model';
import { sendSuccess, sendError } from '../utils/appResponse';
import { logger } from '../utils/logger';
import {
  SEED_ROADMAPS,
  resolveSeedForRole,
  ISeedMilestone,
  ISeedPhase,
  ISeedRoadmap,
} from '../services/roadmapSeed.service';

export {
  SEED_ROADMAPS,
  resolveSeedForRole,
  ISeedMilestone,
  ISeedPhase,
  ISeedRoadmap,
};

// --- Helper Functions ---------------------------------------------------------

/**
 * Helper to build legacy coreSteps array for backward compatibility with existing views
 */
function buildLegacyCoreSteps(phases: any[]) {
  const steps: any[] = [];
  phases.forEach((phase) => {
    phase.milestones.forEach((m: any) => {
      let legacyStatus: 'completed' | 'in-progress' | 'locked' = 'locked';
      if (m.status === 'COMPLETED') legacyStatus = 'completed';
      else if (m.status === 'IN_PROGRESS' || m.status === 'AVAILABLE') legacyStatus = 'in-progress';

      steps.push({
        id: m.milestoneId,
        title: m.title,
        description: m.description,
        estimatedTime: `${m.estimatedHours || 20} Hours`,
        skills: m.skills || [],
        status: legacyStatus,
        rawStatus: m.status,
      });
    });
  });
  return steps;
}

// --- Controller Handlers ------------------------------------------------------

/**
 * GET /api/v1/roadmap
 * Returns the active user's roadmap from MongoDB.
 * If none exists, seeds from deterministic catalog, initializes Milestone 1 as AVAILABLE,
 * and saves to MongoDB.
 * Automatically backfills educational fields (summary, keyTopics, codeSnippet, quiz, taskPrompt)
 * into existing documents created under earlier schemas.
 */
export const getRoadmap = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const queryRole = (req.query.role as string) || '';
    const queryDomain = (req.query.domain as string) || '';

    const effectiveRole = user?.targetRole || user?.dreamJob || queryRole || 'Mobile App Developer';
    const effectiveDomain = user?.domain || queryDomain || 'Mobile App Development';

    // If authenticated user exists, query MongoDB
    if (user?._id) {
      let roadmap = await Roadmap.findOne({
        userId: user._id,
        role: effectiveRole,
      });

      // If roadmap does not exist for this exact role, check if user has any existing roadmap
      if (!roadmap) {
        roadmap = await Roadmap.findOne({ userId: user._id });
      }

      // If roadmap still does not exist, seed a new one
      if (!roadmap) {
        const seed = resolveSeedForRole(effectiveRole, effectiveDomain);

        // Count total milestones and set first milestone to AVAILABLE
        let totalMilestones = 0;
        const initializedPhases = seed.phases.map((phase, pIdx) => {
          const milestones = phase.milestones.map((m, mIdx) => {
            totalMilestones += 1;
            const status: MilestoneStatus = pIdx === 0 && mIdx === 0 ? 'AVAILABLE' : 'LOCKED';
            return {
              ...m,
              status,
              completedAt: undefined,
            };
          });
          return {
            ...phase,
            milestones,
          };
        });

        roadmap = new Roadmap({
          userId: user._id,
          role: seed.role,
          domain: seed.domain,
          progressPercentage: 0,
          totalMilestones,
          completedMilestones: 0,
          phases: initializedPhases,
        });

        await roadmap.save();
        logger.info(`[RoadmapController] Seeded new DAG roadmap for user ${user._id} (${seed.role})`);
      } else {
        // Dynamic backfill of educational fields for roadmaps created prior to schema update
        const seed = resolveSeedForRole(roadmap.role, roadmap.domain);
        const seedMilestoneMap = new Map<string, ISeedMilestone>();
        seed.phases.forEach((p) => {
          p.milestones.forEach((m) => {
            seedMilestoneMap.set(m.milestoneId, m);
          });
        });

        let needsSave = false;
        roadmap.phases.forEach((phase) => {
          phase.milestones.forEach((m: any) => {
            const seedM = seedMilestoneMap.get(m.milestoneId);
            if (seedM) {
              if (!m.summary && seedM.summary) {
                m.summary = seedM.summary;
                needsSave = true;
              }
              if ((!m.keyTopics || m.keyTopics.length === 0) && seedM.keyTopics) {
                m.keyTopics = seedM.keyTopics;
                needsSave = true;
              }
              if (!m.codeSnippet && seedM.codeSnippet) {
                m.codeSnippet = seedM.codeSnippet;
                needsSave = true;
              }
              if ((!m.quiz || m.quiz.length === 0) && seedM.quiz) {
                m.quiz = seedM.quiz;
                needsSave = true;
              }
              if (!m.taskPrompt && seedM.taskPrompt) {
                m.taskPrompt = seedM.taskPrompt;
                needsSave = true;
              }
              if ((!m.resources || m.resources.length === 0) && seedM.resources) {
                m.resources = seedM.resources;
                needsSave = true;
              }
            }
          });
        });

        if (needsSave) {
          roadmap.markModified('phases');
          await roadmap.save();
          logger.info(`[RoadmapController] Backfilled educational drawer fields for user ${user._id} roadmap (${roadmap.role})`);
        }
      }

      // Build compatibility wrapper
      const legacyCoreSteps = buildLegacyCoreSteps(roadmap.phases);
      const responseData = {
        _id: roadmap._id,
        id: roadmap.role.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
        title: roadmap.role,
        role: roadmap.role,
        domain: roadmap.domain,
        category: roadmap.domain,
        description: `Career progression track tailored for ${roadmap.role}.`,
        progressPercentage: roadmap.progressPercentage,
        totalMilestones: roadmap.totalMilestones,
        completedMilestones: roadmap.completedMilestones,
        phases: roadmap.phases,
        coreSteps: legacyCoreSteps,
      };

      res.status(200).json(sendSuccess({ roadmap: responseData }, 'Roadmap retrieved successfully.'));
      return;
    }

    // Guest / Unauthenticated Fallback: Return seed template without persisting
    const seed = resolveSeedForRole(effectiveRole, effectiveDomain);
    let totalMilestones = 0;
    const initializedPhases = seed.phases.map((phase, pIdx) => {
      const milestones = phase.milestones.map((m, mIdx) => {
        totalMilestones += 1;
        const status: MilestoneStatus = pIdx === 0 && mIdx === 0 ? 'AVAILABLE' : 'LOCKED';
        return {
          ...m,
          status,
          completedAt: undefined,
        };
      });
      return {
        ...phase,
        milestones,
      };
    });

    const responseData = {
      id: seed.role.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
      title: seed.role,
      role: seed.role,
      domain: seed.domain,
      category: seed.domain,
      description: seed.description,
      progressPercentage: 0,
      totalMilestones,
      completedMilestones: 0,
      phases: initializedPhases,
      coreSteps: buildLegacyCoreSteps(initializedPhases),
    };

    res.status(200).json(sendSuccess({ roadmap: responseData }, 'Roadmap seed retrieved successfully.'));
  } catch (err) {
    logger.error('Error in getRoadmap:', err);
    res.status(500).json(sendError('Failed to retrieve roadmap.', 500));
  }
};

/**
 * PATCH /api/v1/roadmap/milestones/:milestoneId
 * Updates the status of a milestone ('IN_PROGRESS' or 'COMPLETED').
 * If 'COMPLETED', automatically unlocks the next sequential milestone in the DAG from 'LOCKED' to 'AVAILABLE'.
 * Recalculates 'progressPercentage' atomically and returns the updated state.
 */
export const updateMilestoneProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user?._id) {
      res.status(401).json(sendError('Authentication required to update milestones.', 401));
      return;
    }

    const { milestoneId } = req.params;
    const { status } = req.body;

    if (!milestoneId) {
      res.status(400).json(sendError('Milestone ID is required.', 400));
      return;
    }

    const validStatuses: MilestoneStatus[] = ['LOCKED', 'AVAILABLE', 'IN_PROGRESS', 'COMPLETED'];
    if (status && !validStatuses.includes(status)) {
      res.status(400).json(sendError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400));
      return;
    }

    // Find user's active roadmap
    let roadmap = await Roadmap.findOne({ userId: user._id });
    if (!roadmap) {
      res.status(404).json(sendError('Roadmap not found for current user.', 404));
      return;
    }

    // Locate milestone in DAG
    let targetPhaseIdx = -1;
    let targetMilestoneIdx = -1;

    for (let p = 0; p < roadmap.phases.length; p++) {
      const mIdx = roadmap.phases[p].milestones.findIndex((m) => m.milestoneId === milestoneId);
      if (mIdx !== -1) {
        targetPhaseIdx = p;
        targetMilestoneIdx = mIdx;
        break;
      }
    }

    if (targetPhaseIdx === -1 || targetMilestoneIdx === -1) {
      res.status(404).json(sendError(`Milestone '${milestoneId}' not found in roadmap.`, 404));
      return;
    }

    const targetMilestone = roadmap.phases[targetPhaseIdx].milestones[targetMilestoneIdx];
    const previousStatus = targetMilestone.status;
    const newStatus: MilestoneStatus = status || (previousStatus === 'AVAILABLE' ? 'IN_PROGRESS' : 'COMPLETED');

    // Update the target milestone
    targetMilestone.status = newStatus;
    if (newStatus === 'COMPLETED') {
      targetMilestone.completedAt = new Date();

      // Sequential DAG Unlock: Promote the immediate next milestone from LOCKED to AVAILABLE
      let nextPhaseIdx = targetPhaseIdx;
      let nextMilestoneIdx = targetMilestoneIdx + 1;

      if (nextMilestoneIdx >= roadmap.phases[targetPhaseIdx].milestones.length) {
        nextPhaseIdx = targetPhaseIdx + 1;
        nextMilestoneIdx = 0;
      }

      if (
        nextPhaseIdx < roadmap.phases.length &&
        nextMilestoneIdx < roadmap.phases[nextPhaseIdx].milestones.length
      ) {
        const nextMilestone = roadmap.phases[nextPhaseIdx].milestones[nextMilestoneIdx];
        if (nextMilestone.status === 'LOCKED') {
          nextMilestone.status = 'AVAILABLE';
          logger.info(
            `[RoadmapController] Unlocked milestone '${nextMilestone.milestoneId}' (${nextMilestone.title}) to AVAILABLE`,
          );
        }
      }
    } else {
      targetMilestone.completedAt = undefined;
    }

    // Atomic recalculation of completedMilestones and progressPercentage
    let totalCount = 0;
    let completedCount = 0;

    for (const phase of roadmap.phases) {
      for (const m of phase.milestones) {
        totalCount += 1;
        if (m.status === 'COMPLETED') {
          completedCount += 1;
        }
      }
    }

    roadmap.totalMilestones = totalCount;
    roadmap.completedMilestones = completedCount;
    roadmap.progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // Mark Mongoose modified fields for nested arrays
    roadmap.markModified('phases');
    await roadmap.save();

    logger.info(
      `[RoadmapController] Updated milestone '${milestoneId}' to '${newStatus}'. Progress: ${roadmap.progressPercentage}% (${completedCount}/${totalCount})`,
    );

    const legacyCoreSteps = buildLegacyCoreSteps(roadmap.phases);
    const responseData = {
      _id: roadmap._id,
      id: roadmap.role.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
      title: roadmap.role,
      role: roadmap.role,
      domain: roadmap.domain,
      category: roadmap.domain,
      description: `Career progression track tailored for ${roadmap.role}.`,
      progressPercentage: roadmap.progressPercentage,
      totalMilestones: roadmap.totalMilestones,
      completedMilestones: roadmap.completedMilestones,
      phases: roadmap.phases,
      coreSteps: legacyCoreSteps,
    };

    res.status(200).json(sendSuccess({ roadmap: responseData }, 'Milestone progress updated successfully.'));
  } catch (err) {
    logger.error('Error in updateMilestoneProgress:', err);
    res.status(500).json(sendError('Failed to update milestone progress.', 500));
  }
};
