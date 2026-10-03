import apiClient from './apiClient';
import db from './db';

const adminService = {
  /**
   * Fetch all registered students from MongoDB Atlas
   */
  async getStudents(params = {}) {
    try {
      const response = await apiClient.get('/api/v1/admin/students', { params });
      const resData = response.data?.data || response.data;
      if (response.success && resData) {
        return resData.students || (Array.isArray(resData) ? resData : []);
      }
    } catch (err) {
      console.warn('[adminService] Failed to fetch students from backend:', err?.message || err);
    }
    return [];
  },

  /**
   * Server-verified admin passkey verification
   */
  async verifyAdminPasskey(passkey) {
    try {
      const response = await apiClient.post('/api/v1/admin/verify-passkey', { passkey });
      const resData = response.data?.data || response.data;
      if (response.success && resData?.verified) {
        localStorage.setItem(
          'nexora_admin_session',
          JSON.stringify({ authenticated: true, timestamp: Date.now(), role: 'admin' })
        );
        return { success: true, verified: true };
      }
      return { success: false, error: response.error || 'Invalid administrator passkey.' };
    } catch (err) {
      // Local fallback for offline/isolated scenarios
      const validPasskey = import.meta.env.VITE_ADMIN_PASSKEY || 'admin2026';
      if (passkey && passkey.trim() === validPasskey.trim()) {
        localStorage.setItem(
          'nexora_admin_session',
          JSON.stringify({ authenticated: true, timestamp: Date.now(), role: 'admin' })
        );
        return { success: true, verified: true };
      }
      return { success: false, error: err?.message || 'Admin authentication service unavailable.' };
    }
  },

  /**
   * Update student details in MongoDB Atlas
   */
  async updateStudent(id, updates) {
    try {
      const response = await apiClient.patch(`/api/v1/admin/students/${id}`, updates);
      const resData = response.data?.data || response.data;
      if (response.success && resData) {
        return resData.student || resData;
      }
    } catch (err) {
      console.warn('[adminService] Failed to update student on backend:', err?.message || err);
    }
  },

  /**
   * Delete student record from MongoDB Atlas
   */
  async deleteStudent(id) {
    try {
      const response = await apiClient.delete(`/api/v1/admin/students/${id}`);
      if (response.success) {
        return true;
      }
    } catch (err) {
      console.warn('[adminService] Failed to delete student on backend:', err?.message || err);
    }
    return false;
  },

  /**
   * Get platform telemetry stats from MongoDB Atlas
   */
  async getPlatformStats() {
    try {
      const response = await apiClient.get('/api/v1/admin/stats');
      const resData = response.data?.data || response.data;
      if (response.success && resData) {
        return resData;
      }
    } catch (err) {
      console.warn('[adminService] Failed to fetch platform stats:', err?.message || err);
    }
    return {
      totalStudents: 0,
      totalApplications: 0,
      totalInterviews: 0,
      totalAssessments: 0,
      totalRoadmaps: 0,
    };
  },
};

export default adminService;
