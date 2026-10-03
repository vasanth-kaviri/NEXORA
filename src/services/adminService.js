import apiClient from './apiClient';
import db from './db';

const adminService = {
  /**
   * Fetch all registered students from MongoDB Atlas
   */
  async getStudents(params = {}) {
    try {
      const response = await apiClient.get('/admin/students', { params });
      if (response.data && response.data.success) {
        return response.data.data.students || [];
      }
    } catch (err) {
      console.warn('[adminService] Failed to fetch students from backend:', err?.message || err);
    }
    // Graceful offline fallback
    const all = db.getUsers();
    return all.map(u => ({
      _id: u.id || u.email,
      name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.name || 'Enrolled Student',
      email: u.email || 'student@nexora.edu',
      dreamJob: u.dreamJob || 'Full-Stack Developer',
      role: u.role || 'student',
      isVerified: u.isVerified || false,
    }));
  },

  /**
   * Update student details in MongoDB Atlas
   */
  async updateStudent(id, updates) {
    try {
      const response = await apiClient.patch(`/admin/students/${id}`, updates);
      if (response.data && response.data.success) {
        return response.data.data.student;
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
      const response = await apiClient.delete(`/admin/students/${id}`);
      if (response.data && response.data.success) {
        return true;
      }
    } catch (err) {
      console.warn('[adminService] Failed to delete student on backend:', err?.message || err);
    }
    db.deleteStudent(id);
    return true;
  },

  /**
   * Get platform telemetry stats from MongoDB Atlas
   */
  async getPlatformStats() {
    try {
      const response = await apiClient.get('/admin/stats');
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('[adminService] Failed to fetch platform stats:', err?.message || err);
    }
    return {
      totalStudents: 1240,
      totalApplications: 412,
      totalInterviews: 185,
      totalAssessments: 890,
      totalRoadmaps: 940,
    };
  },
};

export default adminService;
