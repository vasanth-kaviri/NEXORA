import { ref, onValue, set, update, push, remove } from 'firebase/database';
import { rtdb } from './firebase';

/**
 * NEXORA Firebase Realtime Database Service Layer
 * Synchronizes user trajectory, tasks, roadmap progress, notifications,
 * saved jobs, interview evaluations, and feedback in real time.
 */

export const realtimeDb = {
  // ==========================================
  // USER PROFILE
  // ==========================================
  subscribeToUserProfile(userId, callback) {
    if (!userId) return () => {};
    try {
      const userRef = ref(rtdb, `users/${userId}/profile`);
      return onValue(userRef, (snapshot) => {
        callback(snapshot.val());
      }, (error) => {
        console.warn('[Firebase RTDB] Profile listener notice:', error.message);
      });
    } catch (e) {
      console.warn('[Firebase RTDB] Error subscribing to profile:', e.message);
      return () => {};
    }
  },

  async updateUserProfile(userId, updates) {
    if (!userId || !updates) return;
    try {
      const userRef = ref(rtdb, `users/${userId}/profile`);
      await update(userRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('[Firebase RTDB] Error updating profile:', e.message);
    }
  },

  // ==========================================
  // ROADMAP MILESTONES
  // ==========================================
  subscribeToRoadmap(userId, domainId, callback) {
    if (!userId || !domainId) return () => {};
    try {
      const roadmapRef = ref(rtdb, `users/${userId}/roadmap/${domainId}`);
      return onValue(roadmapRef, (snapshot) => {
        callback(snapshot.val() || {});
      }, (error) => {
        console.warn('[Firebase RTDB] Roadmap listener notice:', error.message);
      });
    } catch (e) {
      console.warn('[Firebase RTDB] Error subscribing to roadmap:', e.message);
      return () => {};
    }
  },

  async setRoadmapStep(userId, domainId, stepId, status) {
    if (!userId || !domainId || !stepId) return;
    try {
      const stepRef = ref(rtdb, `users/${userId}/roadmap/${domainId}/${stepId}`);
      await set(stepRef, status);
    } catch (e) {
      console.warn('[Firebase RTDB] Error updating roadmap step:', e.message);
    }
  },

  // ==========================================
  // DAILY SPRINT TASKS
  // ==========================================
  subscribeToTasks(userId, callback) {
    if (!userId) return () => {};
    try {
      const tasksRef = ref(rtdb, `users/${userId}/tasks`);
      return onValue(tasksRef, (snapshot) => {
        callback(snapshot.val() || {});
      }, (error) => {
        console.warn('[Firebase RTDB] Tasks listener notice:', error.message);
      });
    } catch (e) {
      console.warn('[Firebase RTDB] Error subscribing to tasks:', e.message);
      return () => {};
    }
  },

  async setTaskProgress(userId, taskId, completed) {
    if (!userId || !taskId) return;
    try {
      const taskRef = ref(rtdb, `users/${userId}/tasks/${taskId}`);
      await set(taskRef, completed);
    } catch (e) {
      console.warn('[Firebase RTDB] Error saving task progress:', e.message);
    }
  },

  // ==========================================
  // NOTIFICATIONS & AI MENTOR CHAT
  // ==========================================
  subscribeToNotifications(userId, callback) {
    if (!userId) return () => {};
    try {
      const notifsRef = ref(rtdb, `users/${userId}/notifications`);
      return onValue(notifsRef, (snapshot) => {
        const val = snapshot.val();
        if (!val) {
          callback([]);
          return;
        }
        // Handle both object maps and arrays from RTDB
        const list = Array.isArray(val) 
          ? val.filter(Boolean) 
          : Object.keys(val).map(key => ({ ...val[key], id: val[key].id || key }));
        callback(list);
      }, (error) => {
        console.warn('[Firebase RTDB] Notifications listener notice:', error.message);
      });
    } catch (e) {
      console.warn('[Firebase RTDB] Error subscribing to notifications:', e.message);
      return () => {};
    }
  },

  async saveNotification(userId, notification) {
    if (!userId || !notification?.id) return;
    try {
      const notifRef = ref(rtdb, `users/${userId}/notifications/${notification.id}`);
      await set(notifRef, notification);
    } catch (e) {
      console.warn('[Firebase RTDB] Error saving notification:', e.message);
    }
  },

  async markNotificationRead(userId, notifId) {
    if (!userId || !notifId) return;
    try {
      const notifRef = ref(rtdb, `users/${userId}/notifications/${notifId}/unread`);
      await set(notifRef, false);
    } catch (e) {
      console.warn('[Firebase RTDB] Error marking notification read:', e.message);
    }
  },

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
  },

  // ==========================================
  // SAVED JOBS & SCHOLARSHIPS
  // ==========================================
  subscribeToSavedJobs(userId, callback) {
    if (!userId) return () => {};
    try {
      const jobsRef = ref(rtdb, `users/${userId}/savedJobs`);
      return onValue(jobsRef, (snapshot) => {
        callback(snapshot.val() || {});
      }, (error) => {
        console.warn('[Firebase RTDB] Saved jobs listener notice:', error.message);
      });
    } catch (e) {
      console.warn('[Firebase RTDB] Error subscribing to saved jobs:', e.message);
      return () => {};
    }
  },

  async toggleSavedJob(userId, jobId, isSaved) {
    if (!userId || !jobId) return;
    try {
      const jobRef = ref(rtdb, `users/${userId}/savedJobs/${jobId}`);
      if (isSaved) {
        await set(jobRef, { savedAt: new Date().toISOString() });
      } else {
        await remove(jobRef);
      }
    } catch (e) {
      console.warn('[Firebase RTDB] Error toggling saved job:', e.message);
    }
  },

  subscribeToSavedScholarships(userId, callback) {
    if (!userId) return () => {};
    try {
      const schRef = ref(rtdb, `users/${userId}/savedScholarships`);
      return onValue(schRef, (snapshot) => {
        callback(snapshot.val() || {});
      }, (error) => {
        console.warn('[Firebase RTDB] Saved scholarships listener notice:', error.message);
      });
    } catch (e) {
      console.warn('[Firebase RTDB] Error subscribing to saved scholarships:', e.message);
      return () => {};
    }
  },

  async toggleSavedScholarship(userId, scholarshipId, isSaved) {
    if (!userId || !scholarshipId) return;
    try {
      const schRef = ref(rtdb, `users/${userId}/savedScholarships/${scholarshipId}`);
      if (isSaved) {
        await set(schRef, { savedAt: new Date().toISOString() });
      } else {
        await remove(schRef);
      }
    } catch (e) {
      console.warn('[Firebase RTDB] Error toggling saved scholarship:', e.message);
    }
  },

  // ==========================================
  // MOCK INTERVIEW & RESUME ANALYSES
  // ==========================================
  async saveInterviewResult(userId, sessionData) {
    if (!userId || !sessionData) return;
    try {
      const interviewRef = ref(rtdb, `users/${userId}/interviews`);
      await push(interviewRef, {
        ...sessionData,
        timestamp: Date.now(),
        date: new Date().toISOString()
      });
    } catch (e) {
      console.warn('[Firebase RTDB] Error saving interview result:', e.message);
    }
  },

  async saveResumeResult(userId, analysisData) {
    if (!userId || !analysisData) return;
    try {
      const resumeRef = ref(rtdb, `users/${userId}/resumes`);
      await push(resumeRef, {
        ...analysisData,
        timestamp: Date.now(),
        date: new Date().toISOString()
      });
    } catch (e) {
      console.warn('[Firebase RTDB] Error saving resume analysis:', e.message);
    }
  },

  // ==========================================
  // GLOBAL PLATFORM FEEDBACK
  // ==========================================
  async submitFeedback(feedbackData) {
    if (!feedbackData) return;
    try {
      const feedbackRef = ref(rtdb, 'feedback');
      await push(feedbackRef, {
        ...feedbackData,
        submittedAt: new Date().toISOString(),
        timestamp: Date.now()
      });
    } catch (e) {
      console.warn('[Firebase RTDB] Error submitting feedback:', e.message);
    }
  }
};

export default realtimeDb;
