import apiClient from './apiClient';

const catalogService = {
  /**
   * Get learning resources from MongoDB Atlas
   */
  async getResources(params = {}) {
    try {
      const response = await apiClient.get('/resources', { params });
      if (response.data && response.data.success) {
        return response.data.data.resources || [];
      }
    } catch (err) {
      console.warn('[catalogService] Failed to fetch resources:', err?.message || err);
    }
    return [];
  },

  /**
   * Get hackathons from MongoDB Atlas
   */
  async getHackathons(params = {}) {
    try {
      const response = await apiClient.get('/hackathons', { params });
      if (response.data && response.data.success) {
        return response.data.data.hackathons || [];
      }
    } catch (err) {
      console.warn('[catalogService] Failed to fetch hackathons:', err?.message || err);
    }
    return [];
  },

  /**
   * Get scholarships from MongoDB Atlas
   */
  async getScholarships(params = {}) {
    try {
      const response = await apiClient.get('/scholarships', { params });
      if (response.data && response.data.success) {
        return response.data.data.scholarships || [];
      }
    } catch (err) {
      console.warn('[catalogService] Failed to fetch scholarships:', err?.message || err);
    }
    return [];
  },
};

export default catalogService;
