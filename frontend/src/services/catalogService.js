import apiClient from './apiClient';

const catalogService = {
  /**
   * Get learning resources from MongoDB Atlas
   */
  async getResources(params = {}) {
    try {
      const response = await apiClient.get('/api/v1/catalog/resources', { params });
      const resData = response.data?.data || response.data;
      if (response.success && resData) {
        return resData.resources || (Array.isArray(resData) ? resData : []);
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
      const response = await apiClient.get('/api/v1/catalog/hackathons', { params });
      const resData = response.data?.data || response.data;
      if (response.success && resData) {
        return resData.hackathons || (Array.isArray(resData) ? resData : []);
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
      const response = await apiClient.get('/api/v1/catalog/scholarships', { params });
      const resData = response.data?.data || response.data;
      if (response.success && resData) {
        return resData.scholarships || (Array.isArray(resData) ? resData : []);
      }
    } catch (err) {
      console.warn('[catalogService] Failed to fetch scholarships:', err?.message || err);
    }
    return [];
  },
};

export default catalogService;
