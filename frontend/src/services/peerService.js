import apiClient from './apiClient';

const peerService = {
  /**
   * List all active collaborative study rooms
   */
  async listRooms() {
    try {
      const response = await apiClient.get('/api/v1/peers/rooms');
      const resData = response.data?.data || response.data;
      if (response.success && resData) {
        return resData.rooms || (Array.isArray(resData) ? resData : []);
      }
    } catch (err) {
      console.warn('[peerService] Failed to fetch rooms from backend:', err?.message || err);
    }
    return [];
  },

  /**
   * List live registered peer students from MongoDB Atlas
   */
  async listPeers(params = {}) {
    try {
      const response = await apiClient.get('/api/v1/peers/users', { params });
      const resData = response.data?.data || response.data;
      if (response.success && resData) {
        return resData.peers || (Array.isArray(resData) ? resData : []);
      }
    } catch (err) {
      console.warn('[peerService] Failed to fetch peers from backend:', err?.message || err);
    }
    return [];
  },

  /**
   * Create a new study room
   */
  async createRoom(payload) {
    try {
      const response = await apiClient.post('/api/v1/peers/rooms', payload);
      const resData = response.data?.data || response.data;
      if (response.success && resData) {
        return resData.room || resData;
      }
    } catch (err) {
      console.warn('[peerService] Failed to create room:', err?.message || err);
      throw err;
    }
  },

  /**
   * Join an active study room
   */
  async joinRoom(roomId) {
    try {
      const response = await apiClient.post(`/api/v1/peers/rooms/${roomId}/join`);
      const resData = response.data?.data || response.data;
      if (response.success && resData) {
        return resData.room || resData;
      }
    } catch (err) {
      console.warn('[peerService] Failed to join room:', err?.message || err);
    }
  },

  /**
   * Leave a study room
   */
  async leaveRoom(roomId) {
    try {
      const response = await apiClient.post(`/api/v1/peers/rooms/${roomId}/leave`);
      const resData = response.data?.data || response.data;
      if (response.success && resData) {
        return resData.room || resData;
      }
    } catch (err) {
      console.warn('[peerService] Failed to leave room:', err?.message || err);
    }
  },

  /**
   * Send a message to the room's live chat
   */
  async sendMessage(roomId, text) {
    try {
      const response = await apiClient.post(`/api/v1/peers/rooms/${roomId}/messages`, { text });
      const resData = response.data?.data || response.data;
      if (response.success && resData) {
        return resData.message || resData;
      }
    } catch (err) {
      console.warn('[peerService] Failed to send message:', err?.message || err);
    }
  },
};

export default peerService;
