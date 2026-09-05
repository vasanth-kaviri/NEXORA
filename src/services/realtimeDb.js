import { ref, onValue, set, update, push } from 'firebase/database';
import { rtdb } from './firebase';

/**
 * NEXORA Firebase Realtime Database Service Layer
 * Synchronizes user trajectory, tasks, roadmap progress, and notifications in real time.
 */

export const realtimeDb = {
  /**
   * Listen to real-time roadmap step states for a user
   */
  subscribeToRoadmap(userId, domainId, callback) {
    if (!userId || !domainId) return () => {};
    try {
      const roadmapRef = ref(rtdb, `users/${userId}/roadmap/${domainId}`);
      const unsubscribe = onValue(roadmapRef, (snapshot) => {
        const val = snapshot.val() || {};
        callback(val);
      }, (error) => {
        console.warn('[Firebase RTDB] Roadmap listener offline fallback:', error.message);
      });
      return unsubscribe;
    } catch (e) {
      console.warn('[Firebase RTDB] Error subscribing to roadmap:', e.message);
      return () => {};
    }
  },

  /**
   * Update a milestone step status in real time
   */
  async setRoadmapStep(userId, domainId, stepId, status) {
    if (!userId || !domainId || !stepId) return;
    try {
      const stepRef = ref(rtdb, `users/${userId}/roadmap/${domainId}/${stepId}`);
      await set(stepRef, status);
    } catch (e) {
      console.warn('[Firebase RTDB] Error updating roadmap step:', e.message);
    }
  },

  /**
   * Listen to daily sprint tasks in real time
   */
  subscribeToTasks(userId, callback) {
    if (!userId) return () => {};
    try {
      const tasksRef = ref(rtdb, `users/${userId}/tasks`);
      const unsubscribe = onValue(tasksRef, (snapshot) => {
        const val = snapshot.val() || {};
        callback(val);
      }, (error) => {
        console.warn('[Firebase RTDB] Tasks listener offline fallback:', error.message);
      });
      return unsubscribe;
    } catch (e) {
      console.warn('[Firebase RTDB] Error subscribing to tasks:', e.message);
      return () => {};
    }
  },

  /**
   * Toggle a task completion state in real time
   */
  async setTaskProgress(userId, taskId, completed) {
    if (!userId || !taskId) return;
    try {
      const taskRef = ref(rtdb, `users/${userId}/tasks/${taskId}`);
      await set(taskRef, completed);
    } catch (e) {
      console.warn('[Firebase RTDB] Error saving task progress:', e.message);
    }
  },

  /**
   * Listen to real-time notification alerts
   */
  subscribeToNotifications(userId, callback) {
    if (!userId) return () => {};
    try {
      const notifsRef = ref(rtdb, `users/${userId}/notifications`);
      const unsubscribe = onValue(notifsRef, (snapshot) => {
        const val = snapshot.val() || [];
        callback(val);
      }, (error) => {
        console.warn('[Firebase RTDB] Notifications listener offline fallback:', error.message);
      });
      return unsubscribe;
    } catch (e) {
      console.warn('[Firebase RTDB] Error subscribing to notifications:', e.message);
      return () => {};
    }
  },

  /**
   * Append a chat message to an alert resolution thread
   */
  async appendNotificationChat(userId, notifId, text, sender = 'user') {
    if (!userId || !notifId || !text) return;
    try {
      const chatRef = ref(rtdb, `users/${userId}/notifications/${notifId}/chatHistory`);
      await push(chatRef, {
        sender,
        text,
        time: 'Just now',
        timestamp: Date.now()
      });
    } catch (e) {
      console.warn('[Firebase RTDB] Error appending chat to notification:', e.message);
    }
  }
};

export default realtimeDb;
