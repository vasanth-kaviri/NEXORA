import apiClient from './apiClient';
import db from './db';

const assessmentService = {
  /**
   * Submit a quiz or assessment and persist to MongoDB Atlas
   */
  async submitAssessment(payload) {
    try {
      const response = await apiClient.post('/assessments/submit', payload);
      if (response.data && response.data.success) {
        // Also update local cache for instant UI continuity
        const currentUser = db.getCurrentUser() || {};
        const score = payload.correctAnswers * 15;
        db.updateUserProfile({
          xp: (currentUser.xp || 1200) + score,
          quizScore: payload.percentage,
        });
        return response.data.data;
      }
    } catch (err) {
      console.warn('[assessmentService] Backend submit fallback to local:', err?.message || err);
      // Offline fallback
      const currentUser = db.getCurrentUser() || {};
      const score = payload.correctAnswers * 15;
      db.updateUserProfile({
        xp: (currentUser.xp || 1200) + score,
        quizScore: payload.percentage,
      });
      return { assessment: payload, xpAwarded: score, passed: payload.percentage >= 60 };
    }
  },

  /**
   * Get student's historical assessments and quizzes
   */
  async getMyAssessments(type) {
    try {
      const response = await apiClient.get('/assessments/my-history', {
        params: type ? { type } : {},
      });
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('[assessmentService] Failed to fetch assessment history:', err?.message || err);
    }
    return { assessments: [], totalSubmissions: 0, averageScore: 0 };
  },

  /**
   * Get dynamic skill gap analysis vector
   */
  async getSkillGapAnalysis() {
    try {
      const response = await apiClient.get('/assessments/skill-gap');
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('[assessmentService] Failed to fetch skill gap analysis:', err?.message || err);
    }
    return {
      skillVector: {
        frontend: 80,
        backend: 68,
        database: 62,
        systemDesign: 55,
        devops: 60,
        security: 65,
        overallScore: 70,
      },
      latestSubmission: null,
    };
  },
};

export default assessmentService;
