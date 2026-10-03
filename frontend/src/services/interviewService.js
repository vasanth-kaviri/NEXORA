import apiClient from './apiClient';
import db from './db';

const interviewService = {
  /**
   * Save and persist a completed mock interview scorecard and proctoring session
   */
  async completeInterview(payload) {
    try {
      const response = await apiClient.post('/interviews/complete', payload);
      if (response.data && response.data.success) {
        // Also update local cache for instant UI continuity
        const currentUser = db.getCurrentUser() || {};
        const xpEarned = Math.round((payload.overallScore || 85) * 2);
        db.updateUserProfile({
          xp: (currentUser.xp || 1200) + xpEarned,
          interviewScore: payload.overallScore,
        });
        return response.data.data;
      }
    } catch (err) {
      console.warn('[interviewService] Backend interview submit fallback:', err?.message || err);
      // Offline fallback
      const currentUser = db.getCurrentUser() || {};
      const xpEarned = Math.round((payload.overallScore || 85) * 2);
      db.updateUserProfile({
        xp: (currentUser.xp || 1200) + xpEarned,
        interviewScore: payload.overallScore,
      });
      return { interview: payload, xpEarned };
    }
  },

  /**
   * Get student's interview history
   */
  async getMyInterviews() {
    try {
      const response = await apiClient.get('/interviews/my-history');
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('[interviewService] Failed to fetch interview history:', err?.message || err);
    }
    return { interviews: [], totalCompleted: 0, bestScore: 0 };
  },

  /**
   * Get latest interview scorecard
   */
  async getLatestInterview() {
    try {
      const response = await apiClient.get('/interviews/latest');
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('[interviewService] Failed to fetch latest interview:', err?.message || err);
    }
    return { interview: null };
  },
};

export default interviewService;
