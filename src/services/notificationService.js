import db from './db';

/**
 * Multi-channel Notification Service for NEXORA.
 * Prepares webhook payloads for Twilio SMS, WhatsApp Business Cloud API, and in-app realtime pushes.
 */

export const notificationService = {
  /**
   * Dispatches an in-app student alert
   */
  async pushInAppNotification({ title, message, type = 'info', link = null }) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const notif = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title,
      message,
      type, // 'info' | 'success' | 'warning' | 'achievement' | 'alert'
      link,
      read: false,
      timestamp: new Date().toISOString()
    };

    // Store in localStorage db notifications list
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
   * Simulates WhatsApp Business API notification (Twilio / Meta Graph webhook ready)
   */
  async sendWhatsAppAlert(phone, templateKey, params = {}) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    if (import.meta.env.DEV) {
      console.log(`📲 [WhatsApp Cloud API Mock] Message sent to ${phone}: Template [${templateKey}]`, params);
    }
    return { success: true, messageId: `wamid_${Date.now()}` };
  },

  /**
   * Simulates transactional email dispatch (SendGrid / Resend webhook ready)
   */
  async sendEmailAlert(email, subject, templateKey, data = {}) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    if (import.meta.env.DEV) {
      console.log(`📧 [Transactional Email Mock] Sent to ${email}: Subject: "${subject}"`, data);
    }
    return { success: true, messageId: `msg_${Date.now()}` };
  },

  /**
   * Marks a specific notification as read
   */
  markAsRead(id) {
    try {
      const raw = localStorage.getItem('nexora_notifications');
      if (raw) {
        const list = JSON.parse(raw);
        const next = list.map((n) => (n.id === id ? { ...n, read: true } : n));
        localStorage.setItem('nexora_notifications', JSON.stringify(next));
        window.dispatchEvent(new Event('nexora_notifications_updated'));
      }
    } catch (e) {
      console.error(e);
    }
  },

  /**
   * Clears all notifications
   */
  clearAll() {
    try {
      localStorage.setItem('nexora_notifications', JSON.stringify([]));
      window.dispatchEvent(new Event('nexora_notifications_updated'));
    } catch (e) {
      console.error(e);
    }
  }
};

export default notificationService;
