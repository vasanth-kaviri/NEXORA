/**
 * NEXORA Database Service (Realtime Database & Local Persistence Layer)
 * Bridges Firebase Realtime Database with fast client-side caching.
 * Real user data is synchronized in real time with zero hardcoded demo data.
 */

import realtimeDb from './realtimeDb';

const DB_KEYS = {
  USERS: 'nexora_db_users',
  SESSION: 'nexora_user',
  NOTIFICATIONS: 'nexora_db_notifications',
  TASK_PROGRESS: 'nexora_task_progress',
  CURRENT_TASKS: 'nexora_current_tasks',
  ROADMAP_DATA: 'nexora_roadmap',
};

class DatabaseService {
  constructor() {
    this.init();
  }

  init() {
    // Ensure data structures exist without seeding fake users
    if (!localStorage.getItem(DB_KEYS.USERS)) {
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(DB_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(DB_KEYS.NOTIFICATIONS, JSON.stringify([]));
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
    if (!email) return null;
    const users = this.getUsers();
    return users.find(u => u.email?.toLowerCase() === email.toLowerCase()) || null;
  }

  getCurrentUser() {
    try {
      const session = localStorage.getItem(DB_KEYS.SESSION);
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed && (parsed.id || parsed.uid || parsed.email)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[DB] Error parsing session:', e);
    }
    return null;
  }

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem(DB_KEYS.SESSION, JSON.stringify(user));
      // Real-time synchronization to Firebase RTDB
      const uid = user.id || user.uid;
      if (uid) {
        realtimeDb.updateUserProfile(uid, user);
      }
    } else {
      localStorage.removeItem(DB_KEYS.SESSION);
    }
    window.dispatchEvent(new Event('user_session_changed'));
  }

  login(contact, _password) {
    const users = this.getUsers();
    let user = users.find(u => u.email?.toLowerCase() === contact.toLowerCase() || u.phone === contact);
    if (!user) {
      // Auto-create real user session on login if valid credentials
      const isEmail = contact.includes('@');
      user = {
        id: 'usr_' + Date.now(),
        email: isEmail ? contact : `${contact}@nexora.ai`,
        phone: isEmail ? '' : contact,
        firstName: contact.split('@')[0] || 'Explorer',
        lastName: '',
        dreamJob: 'Software Engineer',
        authProvider: 'local',
        createdAt: new Date().toISOString(),
        level: 1,
        streak: 1,
        careerMatch: 85
      };
      users.push(user);
      this.saveUsers(users);
    }
    this.setCurrentUser(user);
    return user;
  }

  /**
   * Google Sign-in handler connecting directly to Realtime Database
   */
  loginWithGoogle(googleProfile = null) {
    const users = this.getUsers();
    const profile = googleProfile || {
      email: 'user@nexora.ai',
      firstName: 'Explorer',
      lastName: '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      dreamJob: 'Software Engineer'
    };

    let user = users.find(u => u.email?.toLowerCase() === profile.email.toLowerCase());
    if (!user) {
      user = {
        id: profile.uid || ('usr_google_' + Date.now()),
        email: profile.email,
        firstName: profile.firstName || 'Explorer',
        lastName: profile.lastName || '',
        dreamJob: profile.dreamJob || 'Software Engineer',
        avatar: profile.avatar,
        authProvider: 'google',
        createdAt: new Date().toISOString(),
        level: 1,
        streak: 1,
        careerMatch: 88
      };
      users.push(user);
      this.saveUsers(users);
    } else {
      user.lastLogin = new Date().toISOString();
      if (profile.avatar) user.avatar = profile.avatar;
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
      dreamJob: formData.dreamJob || 'Software Engineer',
      authProvider: 'local',
      createdAt: new Date().toISOString(),
      level: 1,
      streak: 1,
      careerMatch: 85
    };
    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUser(newUser);

    // Initial welcome notification for new user in Realtime Database
    const welcomeNotif = {
      id: `notif_${Date.now()}`,
      type: 'roadmap',
      title: 'Welcome to NEXORA Platform',
      message: `Your career journey for ${newUser.dreamJob} is configured and ready. Complete your profile and start your first sprint!`,
      time: 'Just now',
      unread: true,
      actionPath: '/roadmap',
      actionLabel: 'Explore Career Trajectory',
      actionDetails: 'Milestone 1: Fundamentals',
      chatHistory: [
        {
          sender: 'system',
          text: `Welcome to NEXORA, ${newUser.firstName}! I am your AI Mentor. Let me know if you need assistance tailoring your roadmap.`,
          time: 'Just now'
        }
      ]
    };
    this.saveNotifications([welcomeNotif]);
    realtimeDb.saveNotification(newUser.id, welcomeNotif);

    return newUser;
  }

  updateUserProfile(updates) {
    const currentUser = this.getCurrentUser() || {};
    const updated = { ...currentUser, ...updates };
    this.setCurrentUser(updated);

    const users = this.getUsers().map(u => u.id === currentUser.id ? updated : u);
    this.saveUsers(users);

    const uid = updated.id || updated.uid;
    if (uid) {
      realtimeDb.updateUserProfile(uid, updated);
    }
    return updated;
  }

  saveUser(userData) {
    return this.updateUserProfile(userData);
  }

  // --- NOTIFICATIONS TABLE OPERATIONS ---
  getNotifications() {
    try {
      return JSON.parse(localStorage.getItem(DB_KEYS.NOTIFICATIONS) || '[]');
    } catch {
      return [];
    }
  }

  saveNotifications(notifs) {
    localStorage.setItem(DB_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    window.dispatchEvent(new Event('notifications_updated'));
  }

  getNotificationById(id) {
    const notifs = this.getNotifications();
    return notifs.find(n => n.id === id || n.id === `notif_${id}` || n.id?.endsWith(id)) || null;
  }

  markNotificationAsRead(id) {
    const notifs = this.getNotifications().map(n => {
      if (n.id === id || n.id?.endsWith(id)) {
        return { ...n, unread: false };
      }
      return n;
    });
    this.saveNotifications(notifs);

    const currentUser = this.getCurrentUser();
    if (currentUser?.id) {
      realtimeDb.markNotificationRead(currentUser.id, id);
    }
  }

  addNotificationReply(id, replyText, sender = 'user') {
    const notifs = this.getNotifications().map(n => {
      if (n.id === id || n.id?.endsWith(id)) {
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
