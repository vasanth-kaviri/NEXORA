import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { Application } from '../models/application.model';
import { Interview } from '../models/interview.model';
import { Assessment } from '../models/assessment.model';
import { Roadmap } from '../models/roadmap.model';
import { sendSuccess, sendError } from '../utils/appResponse';
import { logger } from '../utils/logger';

// --- Get All Enrolled Students (with search & filtering) ----------------------
export const getStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, track } = req.query;
    const query: any = { role: 'student' };

    if (track && track !== 'all') {
      query.dreamJob = new RegExp(String(track), 'i');
    }

    if (search) {
      query.$or = [
        { name: new RegExp(String(search), 'i') },
        { email: new RegExp(String(search), 'i') },
        { firstName: new RegExp(String(search), 'i') },
        { lastName: new RegExp(String(search), 'i') },
        { dreamJob: new RegExp(String(search), 'i') },
      ];
    }

    const students = await User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(
      sendSuccess(
        {
          students,
          count: students.length,
        },
        'Students fetched successfully.'
      )
    );
  } catch (err: any) {
    logger.error('[AdminController] Error fetching students:', err?.message || err);
    res.status(500).json(sendError('Failed to fetch students.', 500));
  }
};

// --- Update Student Record ----------------------------------------------------
export const updateStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const student = await User.findByIdAndUpdate(id, updates, { new: true }).select('-passwordHash');
    if (!student) {
      res.status(404).json(sendError('Student not found.', 404));
      return;
    }

    res.status(200).json(sendSuccess({ student }, 'Student record updated successfully.'));
  } catch (err: any) {
    logger.error('[AdminController] Error updating student:', err?.message || err);
    res.status(500).json(sendError('Failed to update student.', 500));
  }
};

// --- Delete Student Record ----------------------------------------------------
export const deleteStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const student = await User.findByIdAndDelete(id);
    if (!student) {
      res.status(404).json(sendError('Student not found.', 404));
      return;
    }

    res.status(200).json(sendSuccess({ id }, 'Student deleted successfully.'));
  } catch (err: any) {
    logger.error('[AdminController] Error deleting student:', err?.message || err);
    res.status(500).json(sendError('Failed to delete student.', 500));
  }
};

// --- Aggregated Platform Telemetry & Metrics ----------------------------------
export const getPlatformStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [totalStudents, totalApplications, totalInterviews, totalAssessments, totalRoadmaps] =
      await Promise.all([
        User.countDocuments({ role: 'student' }),
        Application.countDocuments(),
        Interview.countDocuments(),
        Assessment.countDocuments(),
        Roadmap.countDocuments(),
      ]);

    res.status(200).json(
      sendSuccess(
        {
          totalStudents,
          totalApplications,
          totalInterviews,
          totalAssessments,
          totalRoadmaps,
        },
        'Platform stats retrieved.'
      )
    );
  } catch (err: any) {
    logger.error('[AdminController] Error fetching stats:', err?.message || err);
    res.status(500).json(sendError('Failed to fetch platform telemetry.', 500));
  }
};
