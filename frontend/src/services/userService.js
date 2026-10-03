import db from './db';
import apiClient from './apiClient';

/**
 * User Service & Profile Persistence Architecture.
 * Standardizes student profile schemas, onboarding answers, and MongoDB/API sync.
 * Completely decoupled from Firebase Realtime Database to prevent unhandled promise hangs.
 */

export const userService = {
  /**
   * Constructs standardized profile payload conforming to schema requirements
   */
  buildProfilePayload(raw = {}) {
    return {
      uid: raw.uid || raw.id || `user_${Date.now()}`,
      userId: raw.userId || raw.id || raw._id || raw.uid,
      email: raw.email ? raw.email.toLowerCase().trim() : '',
      phone: raw.phone || '',
      firstName: raw.firstName ? raw.firstName.trim() : 'Explorer',
      lastName: raw.lastName ? raw.lastName.trim() : '',
      avatar: raw.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${raw.email || 'student'}`,
      college: raw.college ? raw.college.trim() : '',
      degree: raw.degree ? raw.degree.trim() : '',
      education: raw.education || '',
      domain: raw.domain || '',
      dreamJob: raw.dreamJob ? raw.dreamJob.trim() : 'Software Engineer',
      selectedTrack: raw.selectedTrack || raw.track || 'fullstack',
      track: raw.track || raw.selectedTrack || 'fullstack',
      profileCompleted: true,
      graduationYear: raw.graduationYear ? Number(raw.graduationYear) : new Date().getFullYear() + 2,
      skills: Array.isArray(raw.skills) ? raw.skills : (raw.skills ? [raw.skills] : ['JavaScript', 'React']),
      socials: {
        github: raw.socials?.github || raw.github || '',
        linkedin: raw.socials?.linkedin || raw.linkedin || '',
        portfolio: raw.socials?.portfolio || raw.portfolio || ''
      },
      settings: {
        theme: raw.settings?.theme || 'dark',
        notificationsEmail: raw.settings?.notificationsEmail ?? true,
        notificationsSms: raw.settings?.notificationsSms ?? false,
        notificationsWhatsApp: raw.settings?.notificationsWhatsApp ?? true,
        profileVisibility: raw.settings?.profileVisibility || 'public'
      },
      stats: {
        points: raw.stats?.points ?? 120,
        streakDays: raw.stats?.streakDays ?? 1,
        completedRoadmapNodes: raw.stats?.completedRoadmapNodes ?? 0,
        interviewsCompleted: raw.stats?.interviewsCompleted ?? 0
      },
      updatedAt: new Date().toISOString()
    };
  },

  /**
   * Constructs standardized onboarding state payload
   */
  buildOnboardingPayload(answers = {}) {
    return {
      track: answers.track || 'software-engineering',
      currentStage: answers.currentStage || 'college-student',
      weeklyHours: answers.weeklyHours ? Number(answers.weeklyHours) : 10,
      goals: Array.isArray(answers.goals) ? answers.goals : [],
      preferredLearningStyle: answers.preferredLearningStyle || 'hands-on',
      completedAt: new Date().toISOString()
    };
  },

  /**
   * Updates student profile: directly persists to backend MongoDB API and updates local auth state.
   * Completely decoupled from Firebase Realtime Database.
   */
  async updateProfile(profileData) {
    let currentSession = null;
    try {
      const raw = localStorage.getItem('nexora_session');
      if (raw) currentSession = JSON.parse(raw);
    } catch {
      // Ignored
    }

    const localUser = db.getCurrentUser() || {};
    const sessionUser = currentSession?.user || {};
    const currentUser = { ...localUser, ...sessionUser };

    const userId = profileData.userId || profileData.id || profileData._id || currentUser._id || currentUser.id || currentSession?.id || currentSession?.userId;
    const email = profileData.email || currentUser.email || currentSession?.email || '';
    const phone = profileData.phone || currentUser.phone || currentSession?.phone || '';

    const merged = {
      ...currentUser,
      ...profileData,
      id: userId || currentUser.id,
      _id: userId || currentUser._id,
      email: email || currentUser.email,
      phone: phone || currentUser.phone,
      profileCompleted: true,
      updatedAt: new Date().toISOString()
    };

    // 1. Dispatch directly to standardized backend endpoint /api/v1/users/me
    try {
      const apiPayload = {
        ...profileData,
        targetRole: profileData.dreamJob || profileData.targetRole,
        dreamJob: profileData.dreamJob || profileData.targetRole,
        domain: profileData.domain,
        education: profileData.education,
        profileCompleted: true,
        userId,
        email,
        phone
      };
      // Primary standard endpoint: /api/v1/users/me
      const apiRes = await apiClient.put('/api/v1/users/me', apiPayload);
      if (!apiRes.success && apiRes.status === 404) {
        await apiClient.put('/api/v1/users/profile', apiPayload);
      }
    } catch (apiErr) {
      console.warn('[userService] Backend profile sync note (persisted locally):', apiErr?.message);
    }

    // 2. Persist to local database & session storage
    const saved = db.updateUserProfile(merged);

    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        user: { ...(currentSession.user || {}), ...merged, profileCompleted: true },
        profileCompleted: true
      };
      localStorage.setItem('nexora_session', JSON.stringify(updatedSession));
    }

    // 3. Notify all workstation listeners
    window.dispatchEvent(new Event('user_session_changed'));

    return { success: true, user: saved || merged };
  },

  /**
   * Persists user settings across devices
   */
  async saveSettings(settingsData) {
    const currentUser = this.getCurrentProfile() || {};
    const updatedSettings = { ...(currentUser.settings || {}), ...settingsData };
    return this.updateProfile({ settings: updatedSettings });
  },

  /**
   * Retrieves active profile
   */
  getCurrentProfile() {
    try {
      const raw = localStorage.getItem('nexora_session');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.user) return parsed.user;
      }
    } catch {
      // Fall through to db
    }
    return db.getCurrentUser();
  }
};

export default userService;
