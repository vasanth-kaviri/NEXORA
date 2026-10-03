import apiClient from './apiClient';
import db from './db';

const interviewService = {
  /**
   * Save and persist a completed mock interview scorecard and proctoring session
   */
  async completeInterview(payload) {
    try {
      const response = await apiClient.post('/api/v1/interviews/complete', payload);
      const resData = response.data?.data || response.data;
      if (response.success || resData?.success) {
        // Also update local cache for instant UI continuity
        const currentUser = db.getCurrentUser() || {};
        const xpEarned = Math.round((payload.overallScore || 85) * 2);
        db.updateUserProfile({
          xp: (currentUser.xp || 1200) + xpEarned,
          interviewScore: payload.overallScore,
        });
        return resData?.interview || resData;
      }
    } catch (err) {
      console.warn('[interviewService] Backend interview submit notice:', err?.message || err);
      // Continuity fallback
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
      const response = await apiClient.get('/api/v1/interviews/my-history');
      const resData = response.data?.data || response.data;
      if (response.success && resData) {
        return resData;
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
      const response = await apiClient.get('/api/v1/interviews/latest');
      const resData = response.data?.data || response.data;
      if (response.success && resData) {
        return resData;
      }
    } catch (err) {
      console.warn('[interviewService] Failed to fetch latest interview:', err?.message || err);
    }
    return { interview: null };
  },
};

export default interviewService;
