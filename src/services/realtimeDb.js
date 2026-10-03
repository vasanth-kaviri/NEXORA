/**
 * NEXORA Realtime Database Service Layer (DECOMMISSIONED)
 * Firebase Realtime Database has been decommissioned in favor of MongoDB REST APIs.
 * All methods are safe no-ops returning empty teardown functions () => {} or resolved promises.
 */

const noOpUnsub = () => {};

export const realtimeDb = {
  _ok() { return false; },

  subscribeToUserProfile(_userId, _callback) {
    return noOpUnsub;
  },

  async updateUserProfile(_userId, _updates) {
    return Promise.resolve();
  },

  subscribeToRoadmap(_userId, _domainId, _callback) {
    return noOpUnsub;
  },

  async setRoadmapStep(_userId, _domainId, _stepId, _status) {
    return Promise.resolve();
  },

  subscribeToTasks(_userId, _callback) {
    return noOpUnsub;
  },

  async setTaskProgress(_userId, _taskId, _completed) {
    return Promise.resolve();
  },

  subscribeToNotifications(_userId, callback) {
    if (typeof callback === 'function') callback([]);
    return noOpUnsub;
  },

  async saveNotification(_userId, _notification) {
    return Promise.resolve();
  },

  async markNotificationRead(_userId, _notifId) {
    return Promise.resolve();
  },

  async appendNotificationChat(_userId, _notifId, _text, _sender) {
    return Promise.resolve();
  },

  subscribeToSavedJobs(_userId, callback) {
    if (typeof callback === 'function') callback({});
    return noOpUnsub;
  },

  async toggleSavedJob(_userId, _jobId, _isSaved) {
    return Promise.resolve();
  },

  subscribeToSavedScholarships(_userId, callback) {
    if (typeof callback === 'function') callback({});
    return noOpUnsub;
  },

  async toggleSavedScholarship(_userId, _scholarshipId, _isSaved) {
    return Promise.resolve();
  },

  async saveInterviewResult(_userId, _sessionData) {
    return Promise.resolve();
  },

  async saveResumeResult(_userId, _analysisData) {
    return Promise.resolve();
  },

  async submitFeedback(_feedbackData) {
    return Promise.resolve();
  }
};

export default realtimeDb;
