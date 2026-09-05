/**
 * NEXORA Local Database Service (Client-Side Persistent DB)
 * Provides a structured relational-like data layer backed by localStorage and session state.
 * Supports Users, Sessions, Notifications, Roadmaps, and Tasks.
 */

import realtimeDb from './realtimeDb';

const DB_KEYS = {
  USERS: 'nexora_db_users',
  SESSION: 'nexora_user',
  NOTIFICATIONS: 'nexora_db_notifications',
  TASK_PROGRESS: 'nexora_task_progress',
  CURRENT_TASKS: 'nexora_current_tasks',
  ROADMAP_DATA: 'nexora_roadmap',
  ROADMAP_SUBSET: 'nexora_roadmap_subset',
};

// Seed default users
const SEED_USERS = [
  {
    id: 'usr_alex_01',
    email: 'alex.johnson@example.com',
    firstName: 'Alex',
    lastName: 'Johnson',
    dreamJob: 'Machine Learning Engineer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    authProvider: 'local',
    createdAt: '2026-01-15T10:00:00Z',
    level: 5,
    streak: 7,
    careerMatch: 94
  },
  {
    id: 'usr_google_demo',
    email: 'alex.developer.nexora@gmail.com',
    firstName: 'Alex',
    lastName: 'J.',
    dreamJob: 'Full Stack Developer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    authProvider: 'google',
    createdAt: '2026-02-01T08:30:00Z',
    level: 4,
    streak: 5,
    careerMatch: 91
  }
];

// Seed default notifications with specific redirect targets
const SEED_NOTIFICATIONS = [
  {
    id: 'notif_resume_01',
    type: 'resume',
    title: 'Resume ATS Analysis Complete',
    message: 'Your resume has been reviewed by NEXORA AI with an ATS match score of 78%. We detected 3 missing high-impact technical keywords and suggest quantifiable achievements in your experience section.',
    time: '2 hours ago',
    unread: true,
    actionPath: '/resume',
    actionLabel: 'Open Resume Analyzer',
    actionDetails: 'ATS Score: 78% · 3 Keyword recommendations ready',
    chatHistory: [
      {
        sender: 'system',
        text: 'Hello Alex! I have completed your automated ATS Resume Audit for the Machine Learning Engineer role.',
        time: '2 hours ago'
      },
      {
        sender: 'system',
        text: 'Summary: Your resume scores 78/100. We recommend adding quantitative metrics (e.g. "% reduction in model latency") and clarifying PyTorch production deployment.',
        time: '2 hours ago'
      }
    ]
  },
  {
    id: 'notif_interview_02',
    type: 'reminder',
    title: 'Mock Technical Interview Scheduled',
    message: 'Your AI Mock Technical Interview on "Data Structures, System Design & ML Algorithms" is scheduled. Test your audio/video and join when ready.',
    time: '1 day ago',
    unread: true,
    actionPath: '/mock-interview',
    actionLabel: 'Enter Mock Interview Room',
    actionDetails: 'Session: Technical Round 1 · Duration: 45 min',
    chatHistory: [
      {
        sender: 'system',
        text: 'Reminder: Your practice interview session is ready. You will be evaluated on problem-solving, code clarity, and edge case handling.',
        time: '1 day ago'
      }
    ]
  },
  {
    id: 'notif_achievement_03',
    type: 'achievement',
    title: 'Milestone Unlocked: Level 5 Explorer!',
    message: 'Congratulations! You achieved a 7-day task completion streak and completed 10 core career objectives. Claim your new badge and bonus skill points.',
    time: '2 days ago',
    unread: false,
    actionPath: '/achievements',
    actionLabel: 'Claim Badge & Rewards',
    actionDetails: 'Badge: Consistency Champion · +150 Career XP',
    chatHistory: [
      {
        sender: 'system',
        text: 'Outstanding dedication! You maintained a 7-day learning streak across your roadmap milestones.',
        time: '2 days ago'
      }
    ]
  },
  {
    id: 'notif_roadmap_04',
    type: 'roadmap',
    title: 'New Roadmap Module Unlocked',
    message: 'Based on your latest quiz score, "Neural Networks & Deep Learning Architectures" is now accessible in your personalized career roadmap.',
    time: '3 days ago',
    unread: false,
    actionPath: '/roadmap',
    actionLabel: 'View Roadmap Track',
    actionDetails: 'Module 4: Deep Learning · Estimated time: 3 weeks',
    chatHistory: [
      {
        sender: 'system',
        text: 'Your progress in Module 3 has unlocked the Deep Learning specialization path!',
        time: '3 days ago'
      }
    ]
  }
];

class DatabaseService {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(DB_KEYS.USERS)) {
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(SEED_USERS));
    }
    if (!localStorage.getItem(DB_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(DB_KEYS.NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
    }
    if (!localStorage.getItem(DB_KEYS.SESSION)) {
      localStorage.setItem(DB_KEYS.SESSION, JSON.stringify(SEED_USERS[0]));
    }
  }

  // --- USER TABLE OPERATIONS ---
  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
    } catch {
      return [];
    }
  }

  saveUsers(users) {
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
  }

  getUserByEmail(email) {
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  getCurrentUser() {
    try {
      const session = localStorage.getItem(DB_KEYS.SESSION);
      if (session) return JSON.parse(session);
    } catch (e) {
      console.error(e);
    }
    return SEED_USERS[0];
  }

  setCurrentUser(user) {
    localStorage.setItem(DB_KEYS.SESSION, JSON.stringify(user));
    window.dispatchEvent(new Event('user_session_changed'));
  }

  login(contact, password) {
    const users = this.getUsers();
    let user = users.find(u => u.email.toLowerCase() === contact.toLowerCase() || u.phone === contact);
    if (!user) {
      // Auto-register mock user for convenience if not found
      user = {
        id: 'usr_' + Date.now(),
        email: contact.includes('@') ? contact : `${contact}@nexora.ai`,
        phone: contact.includes('@') ? '' : contact,
        firstName: contact.split('@')[0] || 'Explorer',
        lastName: '',
        dreamJob: 'Machine Learning Engineer',
        authProvider: 'local',
        createdAt: new Date().toISOString(),
        level: 1,
        streak: 1,
        careerMatch: 90
      };
      users.push(user);
      this.saveUsers(users);
    }
    this.setCurrentUser(user);
    return user;
  }

  /**
   * Authentic Google Sign-in handler connecting directly to the Database
   * Saves or syncs Google profile in the users database table and initiates session
   */
  loginWithGoogle(googleProfile = null) {
    const users = this.getUsers();
    const profile = googleProfile || {
      email: 'alex.nexora.google@gmail.com',
      firstName: 'Alex',
      lastName: 'Johnson',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      dreamJob: 'Machine Learning Engineer'
    };

    let user = users.find(u => u.email.toLowerCase() === profile.email.toLowerCase());
    if (!user) {
      user = {
        id: 'usr_google_' + Date.now(),
        email: profile.email,
        firstName: profile.firstName || 'Google',
        lastName: profile.lastName || 'User',
        dreamJob: profile.dreamJob || 'Software Engineer',
        avatar: profile.avatar,
        authProvider: 'google',
        createdAt: new Date().toISOString(),
        level: 3,
        streak: 4,
        careerMatch: 92
      };
      users.push(user);
      this.saveUsers(users);
    } else {
      // update last login
      user.lastLogin = new Date().toISOString();
      this.saveUsers(users);
    }

    this.setCurrentUser(user);
    return user;
  }

  signup(formData, contactType) {
    const users = this.getUsers();
    const email = contactType === 'email' ? formData.contact : `${formData.contact}@phone.nexora.ai`;
    const newUser = {
      id: 'usr_' + Date.now(),
      email,
      phone: contactType === 'phone' ? formData.contact : '',
      firstName: email.split('@')[0] || 'Explorer',
      lastName: '',
      dreamJob: 'Software Developer',
      authProvider: 'local',
      createdAt: new Date().toISOString(),
      level: 1,
      streak: 1,
      careerMatch: 85
    };
    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUser(newUser);
    return newUser;
  }

  updateUserProfile(updates) {
    const currentUser = this.getCurrentUser();
    const updated = { ...currentUser, ...updates };
    this.setCurrentUser(updated);

    const users = this.getUsers().map(u => u.id === currentUser.id ? updated : u);
    this.saveUsers(users);
    return updated;
  }

  // --- NOTIFICATIONS TABLE OPERATIONS ---
  getNotifications() {
    try {
      return JSON.parse(localStorage.getItem(DB_KEYS.NOTIFICATIONS) || '[]');
    } catch {
      return SEED_NOTIFICATIONS;
    }
  }

  saveNotifications(notifs) {
    localStorage.setItem(DB_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    window.dispatchEvent(new Event('notifications_updated'));
  }

  getNotificationById(id) {
    const notifs = this.getNotifications();
    return notifs.find(n => n.id === id || n.id === `notif_${id}` || n.id.endsWith(id)) || null;
  }

  markNotificationAsRead(id) {
    const notifs = this.getNotifications().map(n => {
      if (n.id === id || n.id.endsWith(id)) {
        return { ...n, unread: false };
      }
      return n;
    });
    this.saveNotifications(notifs);
  }

  addNotificationReply(id, replyText, sender = 'user') {
    const notifs = this.getNotifications().map(n => {
      if (n.id === id || n.id.endsWith(id)) {
        const history = n.chatHistory || [];
        return {
          ...n,
          chatHistory: [
            ...history,
            {
              sender,
              text: replyText,
              time: 'Just now'
            }
          ]
        };
      }
      return n;
    });
    this.saveNotifications(notifs);

    // Sync to Firebase Realtime Database
    const currentUser = this.getCurrentUser();
    if (currentUser?.id) {
      realtimeDb.appendNotificationChat(currentUser.id, id, replyText, sender);
    }
  }

  addChatToNotification(id, replyText, sender = 'user') {
    return this.addNotificationReply(id, replyText, sender);
  }
}

export const db = new DatabaseService();
export default db;
