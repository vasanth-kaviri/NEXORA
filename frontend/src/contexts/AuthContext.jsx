import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '../services/apiClient';
import db from '../services/db';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Edge Case 1: Initial loading defaults to true to prevent FOUC / auth flickering
  const [loading, setLoading] = useState(true);

  // Synchronously initialize user from storage
  const [user, setUser] = useState(() => {
    try {
      const rawUser = localStorage.getItem('nexora_user');
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        if (parsed?.id || parsed?._id || parsed?.email) return parsed;
      }
      const raw = localStorage.getItem('nexora_session');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.user) return parsed.user;
      }
      return db.getCurrentUser() || null;
    } catch {
      return null;
    }
  });

  // Synchronously initialize auth flag from active tokens
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const token = localStorage.getItem('nexora_token') || apiClient.getActiveBearerToken();
      if (token) return true;
      const raw = localStorage.getItem('nexora_session');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.token || parsed?.accessToken) return true;
      }
      return false;
    } catch {
      return false;
    }
  });

  // Strict single-flight and once-per-session guard references
  const isHydratingRef = useRef(false);
  const hasHydratedRef = useRef(false);

  /**
   * Synchronously sets authenticated user and token in state and storage.
   * Marks session as hydrated to prevent redundant network fetches.
   */
  const setAuthUser = useCallback((userData, token) => {
    if (token) {
      apiClient.setActiveBearerToken(token);
      try {
        localStorage.setItem('nexora_token', token);
      } catch {
        // Ignored
      }
    }

    if (!userData) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      hasHydratedRef.current = false;
      return;
    }

    const normalized = {
      ...userData,
      id: userData.id || userData._id,
      targetRole: userData.targetRole || userData.dreamJob || 'Developer',
      dreamJob: userData.targetRole || userData.dreamJob || 'Developer',
      domain: userData.domain || 'Engineering',
      firstName: userData.firstName || (userData.name ? userData.name.split(' ')[0] : 'Explorer'),
      lastName: userData.lastName || (userData.name ? userData.name.split(' ').slice(1).join(' ') : '')
    };

    setUser(normalized);
    setIsAuthenticated(true);
    setLoading(false);
    hasHydratedRef.current = true; // Mark as hydrated so no duplicate fetch occurs
    db.setCurrentUser(normalized, false); // Pass emitEvent = false to prevent loop ping-pong

    try {
      localStorage.setItem('nexora_user', JSON.stringify(normalized));
      const rawSession = localStorage.getItem('nexora_session');
      const currentSession = rawSession ? JSON.parse(rawSession) : {};
      localStorage.setItem(
        'nexora_session',
        JSON.stringify({
          ...currentSession,
          token: token || currentSession.token,
          accessToken: token || currentSession.accessToken,
          user: normalized,
          profileCompleted: normalized.profileCompleted,
          isVerified: normalized.isVerified
        })
      );
    } catch {
      // Ignored
    }
  }, []);

  /**
   * Hydrates real-time user state from MongoDB via GET /api/v1/users/me.
   * Guarded against in-flight duplicates, unauthenticated executions, and multiple runs.
   * Runs strictly ONCE per session or page load unless force = true.
   */
  const hydrateSession = useCallback(async (force = false) => {
    // 1. Guard against concurrent in-flight requests
    if (isHydratingRef.current) {
      return null;
    }

    // 2. Guard against repeated executions if already hydrated (unless explicitly forced)
    if (hasHydratedRef.current && !force) {
      setLoading(false);
      return user;
    }

    // 3. Guard against unauthenticated requests: strictly verify 'nexora_token' in localStorage
    const token = (() => {
      try {
        const directToken = localStorage.getItem('nexora_token');
        if (directToken && typeof directToken === 'string' && directToken.trim()) return directToken.trim();
        return null;
      } catch {
        return null;
      }
    })();

    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      hasHydratedRef.current = true;
      return null;
    }

    // 4. Dispatch single-flight fetch
    isHydratingRef.current = true;
    try {
      const res = await apiClient.get('/api/v1/users/me');

      if (res.success && res.data) {
        const rawUser = res.data?.data || res.data?.user || res.data;
        const normalized = {
          ...rawUser,
          id: rawUser.id || rawUser._id,
          targetRole: rawUser.targetRole || rawUser.dreamJob || 'Developer',
          dreamJob: rawUser.targetRole || rawUser.dreamJob || 'Developer',
          domain: rawUser.domain || 'Engineering',
          firstName: rawUser.firstName || (rawUser.name ? rawUser.name.split(' ')[0] : 'Explorer'),
          lastName: rawUser.lastName || (rawUser.name ? rawUser.name.split(' ').slice(1).join(' ') : '')
        };

        setUser(normalized);
        setIsAuthenticated(true);
        db.setCurrentUser(normalized, false); // Do NOT emit user_session_changed to prevent loop

        try {
          localStorage.setItem('nexora_user', JSON.stringify(normalized));
        } catch {
          // Ignored
        }

        return normalized;
      } else {
        // Guard against premature session wipes: only invalidate if refresh token is absent
        const hasRefresh = (() => {
          try {
            return Boolean(localStorage.getItem('nexora_refresh_token'));
          } catch {
            return false;
          }
        })();

        if ((res.status === 401 || res.status === 403) && !hasRefresh) {
          apiClient.setActiveBearerToken(null);
          try {
            localStorage.removeItem('nexora_token');
            localStorage.removeItem('nexora_refresh_token');
            localStorage.removeItem('nexora_user');
          } catch {
            // Ignored
          }
          db.setCurrentUser(null, false);
          setUser(null);
          setIsAuthenticated(false);
        }
        return null;
      }
    } catch (err) {
      console.warn('[AuthContext] Session hydration error:', err?.message);
      return null;
    } finally {
      isHydratingRef.current = false;
      hasHydratedRef.current = true;
      setLoading(false);
    }
  }, []);

  /**
   * Updates user preferences in MongoDB via PUT /api/v1/users/me
   */
  const updateUserProfile = useCallback(async (preferences = {}) => {
    try {
      const res = await apiClient.put('/api/v1/users/me', preferences);
      if (res.success && res.data) {
        const rawUser = res.data?.data || res.data?.user || res.data;
        let updatedUser = null;
        setUser(prev => {
          updatedUser = {
            ...prev,
            ...rawUser,
            id: rawUser.id || rawUser._id || prev?.id,
            targetRole: rawUser.targetRole || rawUser.dreamJob || prev?.targetRole || 'Developer',
            dreamJob: rawUser.targetRole || rawUser.dreamJob || prev?.dreamJob || 'Developer',
            domain: rawUser.domain || prev?.domain || 'Engineering'
          };
          return updatedUser;
        });

        setIsAuthenticated(true);

        if (updatedUser) {
          db.setCurrentUser(updatedUser, false);
          try {
            localStorage.setItem('nexora_user', JSON.stringify(updatedUser));
            const rawSession = localStorage.getItem('nexora_session');
            const currentSession = rawSession ? JSON.parse(rawSession) : {};
            localStorage.setItem(
              'nexora_session',
              JSON.stringify({
                ...currentSession,
                user: updatedUser,
                profileCompleted: updatedUser.profileCompleted
              })
            );
          } catch {
            // Ignored
          }
        }

        return { success: true, user: updatedUser };
      }
      return { success: false, error: res.error || 'Failed to update preferences.' };
    } catch (err) {
      return { success: false, error: err?.message || 'Network error updating profile.' };
    }
  }, []);

  /**
   * Log out and purge all active session data
   */
  const logout = useCallback(async () => {
    try {
      await apiClient.post('/api/v1/auth/logout', {});
    } catch {
      // Ignored
    }
    apiClient.setActiveBearerToken(null);
    try {
      localStorage.removeItem('nexora_token');
      localStorage.removeItem('nexora_refresh_token');
      localStorage.removeItem('nexora_user');
      localStorage.removeItem('nexora_session');
    } catch {
      // Ignored
    }
    hasHydratedRef.current = false;
    isHydratingRef.current = false;
    db.setCurrentUser(null, false);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // 1. Initial application mount: calls GET /api/v1/users/me strictly ONCE per session/page load
  useEffect(() => {
    hydrateSession();
  }, []); // Strictly empty dependency array

  // 2. Cross-component session synchronization (reads local storage only, NEVER makes HTTP calls)
  useEffect(() => {
    const handleSessionChange = () => {
      try {
        const rawUser = localStorage.getItem('nexora_user');
        if (rawUser) {
          const parsed = JSON.parse(rawUser);
          if (parsed && (parsed.id || parsed._id || parsed.email || parsed.phone || parsed.targetRole)) {
            setUser(parsed);
            setIsAuthenticated(true);
            return;
          }
        }
        const raw = localStorage.getItem('nexora_session');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.user) {
            setUser(parsed.user);
            setIsAuthenticated(true);
            return;
          }
        }
        const current = db.getCurrentUser();
        if (current) {
          setUser(current);
          setIsAuthenticated(true);
        } else {
          const token = localStorage.getItem('nexora_token') || apiClient.getActiveBearerToken();
          if (!token) {
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch {
        // Ignored
      }
    };

    window.addEventListener('user_session_changed', handleSessionChange);
    return () => {
      window.removeEventListener('user_session_changed', handleSessionChange);
    };
  }, []); // Strictly empty dependency array

  const refreshUser = useCallback((force = true) => {
    return hydrateSession(force);
  }, [hydrateSession]);

  const value = {
    user,
    setUser,
    loading,
    setLoading,
    isAuthenticated: Boolean(isAuthenticated || user),
    setIsAuthenticated,
    setAuthUser,
    refreshUser,
    updateUserProfile,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
