import apiClient from './apiClient';

export const videoService = {
  /**
   * Retrieves overall catalog overview and video counts across all 12 domains
   */
  async getCatalogOverview() {
    try {
      const res = await apiClient.get('/api/v1/videos/catalog/overview');
      return res.data?.data || res.data || { totalVideos: 0, domainCounts: {}, featuredVideos: [] };
    } catch (err) {
      console.warn('[videoService] getCatalogOverview failed:', err.message);
      return { totalVideos: 0, domainCounts: {}, featuredVideos: [] };
    }
  },

  /**
   * Retrieves all video masterclasses for a specific engineering domain
   */
  async getVideosByDomain(domainId) {
    try {
      const res = await apiClient.get(`/api/v1/videos/domain/${encodeURIComponent(domainId)}`);
      return res.data?.data?.videos || res.data?.videos || [];
    } catch (err) {
      console.warn(`[videoService] getVideosByDomain(${domainId}) failed:`, err.message);
      return [];
    }
  },

  /**
   * Retrieves details for a single video masterclass
   */
  async getVideoDetails(videoId) {
    try {
      const res = await apiClient.get(`/api/v1/videos/${encodeURIComponent(videoId)}`);
      return res.data?.data?.video || res.data?.video || null;
    } catch (err) {
      console.warn(`[videoService] getVideoDetails(${videoId}) failed:`, err.message);
      return null;
    }
  },

  /**
   * Retrieves the authenticated user's watch progress for a video
   */
  async getUserVideoProgress(videoId) {
    try {
      const res = await apiClient.get(`/api/v1/videos/${encodeURIComponent(videoId)}/progress`);
      return res.data?.data?.progress || res.data?.progress || null;
    } catch (err) {
      return null;
    }
  },

  /**
   * Autosaves student playback timestamp and updates watch percentage
   */
  async updateUserVideoProgress(videoId, data) {
    try {
      const res = await apiClient.patch(`/api/v1/videos/${encodeURIComponent(videoId)}/progress`, data);
      return res.data?.data || res.data || null;
    } catch (err) {
      console.warn(`[videoService] updateUserVideoProgress failed:`, err.message);
      return null;
    }
  },

  /**
   * Saves a timestamped student note
   */
  async addVideoNote(videoId, data) {
    try {
      const res = await apiClient.post(`/api/v1/videos/${encodeURIComponent(videoId)}/notes`, data);
      return res.data?.data?.note || res.data?.note || null;
    } catch (err) {
      console.warn(`[videoService] addVideoNote failed:`, err.message);
      return null;
    }
  },
};

export default videoService;
