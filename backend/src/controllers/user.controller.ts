import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User, IUser } from '../models/user.model';
import { sendSuccess, sendError } from '../utils/appResponse';
import { logger } from '../utils/logger';

/**
 * Transforms MongoDB user document into standardized safe JSend payload
 */
export const formatSafeUser = (user: IUser) => ({
  id: user._id.toString(),
  contact: user.email || user.phone || '',
  name: user.name || '',
  firstName: user.firstName || '',
  lastName: user.lastName || '',
  email: user.email || '',
  phone: user.phone || '',
  role: user.role || 'student',
  domain: user.domain || '',
  targetRole: user.targetRole || user.dreamJob || '',
  dreamJob: user.dreamJob || user.targetRole || '',
  bio: user.bio || '',
  avatar: user.avatar || '',
  education: user.education || '',
  track: user.track || '',
  skills: user.skills || [],
  atsScore: user.atsScore ?? null,
  extractedProjects: user.extractedProjects || [],
  experiences: user.experiences || [],
  certifications: user.certifications || [],
  xp: user.xp ?? 0,
  level: user.level ?? 1,
  streak: user.streak ?? 0,
  interviewScore: user.interviewScore ?? 0,
  quizScore: user.quizScore ?? 0,
  careerMatch: user.careerMatch ?? 0,
  completedNodes: user.completedNodes || [],
  inProgressNodes: user.inProgressNodes || [],
  isVerified: Boolean(user.isVerified),
  tier: user.tier || 'free',
  profileCompleted: Boolean(user.profileCompleted),
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

/**
 * GET /api/v1/users/me
 * Retrieves real-time safe profile for the authenticated user
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json(sendError('Authentication required.', 401));
      return;
    }

    const user = await User.findById(userId);
    if (!user || !user.isActive) {
      res.status(404).json(sendError('Account not found or deactivated.', 404));
      return;
    }

    res.status(200).json(sendSuccess(formatSafeUser(user), 'User profile retrieved successfully.'));
  } catch (err: unknown) {
    logger.error('Error fetching current user profile (getMe):', err);
    res.status(500).json(sendError('Failed to fetch user profile.', 500));
  }
};

/**
 * PUT /api/v1/users/me
 * Updates profile preferences (domain, targetRole, bio, profileCompleted, experiences, certs) for authenticated user
 */
export const updateMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.body.userId || req.body.id || req.body._id;
    const {
      domain,
      targetRole,
      dreamJob,
      bio,
      avatar,
      profileCompleted,
      education,
      firstName,
      lastName,
      name,
      track,
      selectedTrack,
      email,
      phone,
      skills,
      experiences,
      certifications,
      xp,
      level,
      streak,
      interviewScore,
      quizScore,
      careerMatch,
      atsScore,
      completedNodes,
      inProgressNodes,
    } = req.body;

    if (!userId && !email && !phone) {
      res.status(401).json(sendError('Authentication required.', 401));
      return;
    }

    const updateFields: Record<string, any> = {};

    if (domain !== undefined) updateFields.domain = domain;

    if (targetRole !== undefined) {
      updateFields.targetRole = targetRole;
      updateFields.dreamJob = targetRole;
    } else if (dreamJob !== undefined) {
      updateFields.dreamJob = dreamJob;
      updateFields.targetRole = dreamJob;
    }

    if (bio !== undefined) updateFields.bio = bio;
    if (avatar !== undefined) updateFields.avatar = avatar;
    if (education !== undefined) updateFields.education = education;
    if (firstName !== undefined) updateFields.firstName = firstName;
    if (lastName !== undefined) updateFields.lastName = lastName;

    if (name !== undefined) {
      updateFields.name = name;
    } else if (firstName || lastName) {
      const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
      if (fullName) updateFields.name = fullName;
    }

    if (track || selectedTrack) {
      updateFields.track = track || selectedTrack;
    }

    if (skills !== undefined) updateFields.skills = skills;
    if (experiences !== undefined) updateFields.experiences = experiences;
    if (certifications !== undefined) updateFields.certifications = certifications;

    if (xp !== undefined) updateFields.xp = Number(xp);
    if (level !== undefined) updateFields.level = Number(level);
    if (streak !== undefined) updateFields.streak = Number(streak);
    if (interviewScore !== undefined) updateFields.interviewScore = Number(interviewScore);
    if (quizScore !== undefined) updateFields.quizScore = Number(quizScore);
    if (careerMatch !== undefined) updateFields.careerMatch = Number(careerMatch);
    if (atsScore !== undefined) updateFields.atsScore = Number(atsScore);
    if (completedNodes !== undefined) updateFields.completedNodes = completedNodes;
    if (inProgressNodes !== undefined) updateFields.inProgressNodes = inProgressNodes;

    // Explicitly enforce profileCompleted: true when submitting onboarding/calibration
    if (profileCompleted !== undefined) {
      updateFields.profileCompleted = Boolean(profileCompleted);
    }

    let updatedUser = null;

    if (userId && mongoose.isValidObjectId(userId)) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateFields },
        { new: true, runValidators: false }
      );
    } else if (email) {
      updatedUser = await User.findOneAndUpdate(
        { email: String(email).toLowerCase().trim() },
        { $set: updateFields },
        { new: true, runValidators: false }
      );
    } else if (phone) {
      const rawDigits = String(phone).replace(/\D/g, '');
      const cleanPhone = rawDigits.length >= 10 ? rawDigits.slice(-10) : rawDigits;
      updatedUser = await User.findOneAndUpdate(
        { $or: [{ phone: cleanPhone }, { phone: String(phone).trim() }] },
        { $set: updateFields },
        { new: true, runValidators: false }
      );
    }

    if (!updatedUser) {
      res.status(404).json(sendError('Account not found.', 404));
      return;
    }

    logger.info(`Profile preferences updated in MongoDB Atlas for user ${updatedUser._id} (domain: ${updatedUser.domain}, targetRole: ${updatedUser.targetRole}, profileCompleted: ${updatedUser.profileCompleted})`);
    res.status(200).json(sendSuccess(formatSafeUser(updatedUser), 'Profile updated successfully.'));
  } catch (err: unknown) {
    logger.error('Error updating user profile (updateMe):', err);
    res.status(500).json(sendError('Failed to update profile.', 500));
  }
};

/**
 * Legacy / Calibration Endpoint: PUT /api/v1/users/profile
 * Updates or calibrates user profile (domain, dreamJob, education, name, track)
 * Supports both Bearer JWT authentication and fallback identifier matching.
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.body.userId || req.body.uid || req.body.id;
    const {
      firstName,
      lastName,
      name,
      domain,
      dreamJob,
      targetRole,
      bio,
      education,
      track,
      selectedTrack,
      college,
      degree,
      graduationYear,
      skills,
      goals,
      email,
      phone,
      profileCompleted,
      xp,
      level,
      streak,
      interviewScore,
      quizScore,
      careerMatch,
      atsScore,
      completedNodes,
      inProgressNodes,
    } = req.body;

    let user = null;

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      user = await User.findById(userId);
    }

    if (!user && email) {
      user = await User.findOne({ email: String(email).toLowerCase().trim() });
    }

    if (!user && phone) {
      const cleanPhone = String(phone).replace(/[\s\-]/g, '');
      const digitsOnly = cleanPhone.replace(/\D/g, '');
      user = await User.findOne({
        $or: [
          { phone: cleanPhone },
          { phone: `+${cleanPhone.replace(/^\+/, '')}` },
          ...(digitsOnly.length >= 10 ? [{ phone: new RegExp(`${digitsOnly.slice(-10)}$`) }] : [])
        ]
      });
    }

    if (!user) {
      res.status(404).json(sendError('No registered account was found to update.', 404));
      return;
    }

    const updateData: Record<string, any> = {};
    if (firstName !== undefined) updateData.firstName = firstName.trim();
    if (lastName !== undefined) updateData.lastName = lastName.trim();

    if (name) {
      updateData.name = name.trim();
    } else if (firstName || lastName) {
      const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
      if (fullName) updateData.name = fullName;
    }

    if (domain !== undefined) updateData.domain = domain;
    if (targetRole !== undefined) updateData.targetRole = targetRole;
    if (dreamJob !== undefined) {
      updateData.dreamJob = dreamJob;
      if (!updateData.targetRole) updateData.targetRole = dreamJob;
    }
    if (bio !== undefined) updateData.bio = bio;
    if (education !== undefined) updateData.education = education;
    if (track || selectedTrack) updateData.track = track || selectedTrack;
    if (college !== undefined) updateData.college = college;
    if (graduationYear !== undefined) updateData.graduationYear = Number(graduationYear);
    if (skills !== undefined) updateData.skills = Array.isArray(skills) ? skills : [skills];
    if (goals !== undefined) updateData.goals = Array.isArray(goals) ? goals : [goals];
    if (xp !== undefined) updateData.xp = Number(xp);
    if (level !== undefined) updateData.level = Number(level);
    if (streak !== undefined) updateData.streak = Number(streak);
    if (interviewScore !== undefined) updateData.interviewScore = Number(interviewScore);
    if (quizScore !== undefined) updateData.quizScore = Number(quizScore);
    if (careerMatch !== undefined) updateData.careerMatch = Number(careerMatch);
    if (atsScore !== undefined) updateData.atsScore = Number(atsScore);
    if (completedNodes !== undefined) updateData.completedNodes = completedNodes;
    if (inProgressNodes !== undefined) updateData.inProgressNodes = inProgressNodes;
    updateData.profileCompleted = profileCompleted !== undefined ? Boolean(profileCompleted) : true;

    const savedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updateData },
      { new: true, runValidators: false }
    );

    logger.info(`Profile calibrated successfully for user: ${user._id} (${user.email || user.phone})`);
    res.status(200).json(sendSuccess(formatSafeUser(savedUser || user), 'Profile calibrated successfully.'));
  } catch (err: unknown) {
    logger.error('Error updating user profile:', err);
    res.status(500).json(sendError('Failed to update profile.', 500));
  }
};

/**
 * Legacy / Profile Endpoint: GET /api/v1/users/profile
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  return getMe(req, res);
};

/**
 * POST /api/v1/users/sync-resume-data
 * Synchronizes parsed resume skills, extracted projects, and ATS score into user profile
 */
export const syncResumeData = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?._id || req.body.userId || req.body.id || req.body._id;
    const { skills, extractedProjects, atsScore } = req.body;

    if (!userId) {
      res.status(401).json(sendError('Authentication required.', 401));
      return;
    }

    const updateOps: Record<string, any> = {
      $set: {
        profileCompleted: true,
      }
    };

    if (typeof atsScore === 'number') {
      updateOps.$set.atsScore = atsScore;
    }

    if (Array.isArray(extractedProjects) && extractedProjects.length > 0) {
      updateOps.$set.extractedProjects = extractedProjects;
    }

    // Process skills array to avoid duplicate tags using $addToSet
    if (Array.isArray(skills) && skills.length > 0) {
      const sanitizedSkills = skills
        .map((s: any) => (typeof s === 'string' ? s.trim() : (s?.name ? String(s.name).trim() : '')))
        .filter(Boolean);

      if (sanitizedSkills.length > 0) {
        updateOps.$addToSet = {
          skills: { $each: sanitizedSkills }
        };
      }
    }

    let updatedUser = null;
    if (mongoose.isValidObjectId(userId)) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        updateOps,
        { new: true, runValidators: false }
      );
    } else if (req.body.email) {
      updatedUser = await User.findOneAndUpdate(
        { email: String(req.body.email).toLowerCase().trim() },
        updateOps,
        { new: true, runValidators: false }
      );
    } else if (req.body.phone) {
      const rawDigits = String(req.body.phone).replace(/\D/g, '');
      const cleanPhone = rawDigits.length >= 10 ? rawDigits.slice(-10) : rawDigits;
      updatedUser = await User.findOneAndUpdate(
        { $or: [{ phone: cleanPhone }, { phone: String(req.body.phone).trim() }] },
        updateOps,
        { new: true, runValidators: false }
      );
    }

    if (!updatedUser) {
      res.status(404).json(sendError('User account not found.', 404));
      return;
    }

    logger.info(`Resume data synced to MongoDB Atlas for user ${updatedUser._id} (ATS score: ${updatedUser.atsScore}, skills: ${updatedUser.skills?.length})`);
    res.status(200).json(sendSuccess(formatSafeUser(updatedUser), 'Profile successfully synced with resume skills and projects.'));
  } catch (err: unknown) {
    logger.error('Error syncing resume data to user profile:', err);
    res.status(500).json(sendError('Failed to synchronize resume data to profile.', 500));
  }
};

