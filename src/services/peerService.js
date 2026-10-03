import apiClient from './apiClient';

const peerService = {
  /**
   * List all active collaborative study rooms
   */
  async listRooms() {
    try {
      const response = await apiClient.get('/peers/rooms');
      if (response.data && response.data.success) {
        return response.data.data.rooms || [];
      }
    } catch (err) {
      console.warn('[peerService] Failed to fetch rooms from backend:', err?.message || err);
    }
    return [];
  },

  /**
   * Create a new study room
   */
  async createRoom(payload) {
    try {
      const response = await apiClient.post('/peers/rooms', payload);
      if (response.data && response.data.success) {
        return response.data.data.room;
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
      const response = await apiClient.post(`/peers/rooms/${roomId}/join`);
      if (response.data && response.data.success) {
        return response.data.data.room;
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
      const response = await apiClient.post(`/peers/rooms/${roomId}/leave`);
      if (response.data && response.data.success) {
        return response.data.data.room;
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
      const response = await apiClient.post(`/peers/rooms/${roomId}/messages`, { text });
      if (response.data && response.data.success) {
        return response.data.data.message;
      }
    } catch (err) {
      console.warn('[peerService] Failed to send message:', err?.message || err);
    }
  },
};

export default peerService;
