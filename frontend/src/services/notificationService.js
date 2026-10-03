import apiClient from './apiClient';
import db from './db';

/**
 * Multi-channel Notification Service for NEXORA.
 * Synchronizes with MongoDB Atlas notification collection and maintains instant local UI reactivity.
 */
export const notificationService = {
  /**
   * Fetch active notifications from MongoDB Atlas backend
   */
  async getMyNotifications() {
    try {
      const response = await apiClient.get('/api/v1/notifications');
      const resData = response.data?.data || response.data;
      if (response.success && resData) {
        const notifs = resData.notifications || (Array.isArray(resData) ? resData : []);
        localStorage.setItem('nexora_notifications', JSON.stringify(notifs));
        return notifs;
      }
    } catch (err) {
      console.warn('[notificationService] Backend fetch fallback to local:', err?.message || err);
    }
    try {
      const raw = localStorage.getItem('nexora_notifications');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  /**
   * Dispatches an in-app student alert
   */
  async pushInAppNotification({ title, message, type = 'info', link = null }) {
    const notif = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title,
      message,
      type,
      link,
      read: false,
      timestamp: new Date().toISOString(),
    };

    const existing = db.getNotifications ? db.getNotifications() : [];
    const updated = [notif, ...existing];
    try {
      localStorage.setItem('nexora_notifications', JSON.stringify(updated));
      window.dispatchEvent(new Event('nexora_notifications_updated'));
    } catch (e) {
      console.warn('Could not persist notification locally:', e);
    }

    return { success: true, notification: notif };
  },

  /**
   * Marks a specific notification as read
   */
  async markAsRead(id) {
    try {
      apiClient.patch(`/api/v1/notifications/${id}/read`).catch(() => {});
      const raw = localStorage.getItem('nexora_notifications');
      if (raw) {
        const list = JSON.parse(raw);
        const next = list.map((n) => (n._id === id || n.id === id ? { ...n, read: true } : n));
        localStorage.setItem('nexora_notifications', JSON.stringify(next));
        window.dispatchEvent(new Event('nexora_notifications_updated'));
      }
    } catch (e) {
      console.error(e);
    }
  },

  /**
   * Marks all notifications as read
   */
  async clearAll() {
    try {
      apiClient.patch('/api/v1/notifications/mark-all-read').catch(() => {});
      localStorage.setItem('nexora_notifications', JSON.stringify([]));
      window.dispatchEvent(new Event('nexora_notifications_updated'));
    } catch (e) {
      console.error(e);
    }
  },
};

export default notificationService;
