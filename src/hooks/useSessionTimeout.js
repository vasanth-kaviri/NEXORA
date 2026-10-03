import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import securityService from '../services/securityService';
import { useToast } from '../contexts/ToastContext';

// Default idle timeout: 30 minutes
const DEFAULT_IDLE_TIMEOUT_MS = 30 * 60 * 1000;
// Warning before logout: 1 minute prior
const WARNING_BEFORE_LOGOUT_MS = 60 * 1000;

/**
 * useSessionTimeout Hook
 * Listens for user inactivity, token expiration, and cross-tab session invalidation.
 * Automatically logs out idle users and prevents lingering on protected routes.
 * 
 * @param {object} options
 * @param {number} [options.timeoutMs=1800000] - Inactivity duration in ms (default 30m)
 * @param {boolean} [options.enabled=true] - Whether the listener is active
 * @param {string} [options.redirectPath='/login'] - Redirect destination upon expiration
 */
export function useSessionTimeout({
  timeoutMs = DEFAULT_IDLE_TIMEOUT_MS,
  enabled = true,
  redirectPath = '/login'
} = {}) {
  const navigate = useNavigate();
  const toast = useToast();
  const lastActivityRef = useRef(Date.now());
  const warningShownRef = useRef(false);

  const handleLogout = useCallback((reason = 'inactivity') => {
    securityService.logSecurityEvent('SESSION_TERMINATED', { reason });
    authService.logout();

    if (reason === 'inactivity') {
      toast.info('Session expired due to inactivity. Please sign in again to continue.');
    } else if (reason === 'token_expired') {
      toast.info('Your session token has expired. Please authenticate again.');
    } else if (reason === 'cross_tab_logout') {
      toast.info('You were signed out from another browser window.');
    }

    navigate(redirectPath, { replace: true });
  }, [navigate, toast, redirectPath]);

  const recordActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (warningShownRef.current) {
      warningShownRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // ── 1. CROSS-TAB STORAGE SYNCHRONIZATION ──────────────────────────────────
    const handleStorageChange = (e) => {
      // If user session was cleared in another tab
      if (e.key === 'nexora_session' && !e.newValue) {
        handleLogout('cross_tab_logout');
      }
      if (e.key === 'nexora_admin_session' && !e.newValue && window.location.pathname.startsWith('/admin')) {
        handleLogout('cross_tab_logout');
      }
    };

    // Unauthorized API response event listener
    const handleUnauthorizedEvent = () => {
      handleLogout('token_expired');
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth_unauthorized', handleUnauthorizedEvent);

    // ── 2. USER ACTIVITY LISTENERS ───────────────────────────────────────────
    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    // Throttled activity updater
    let throttleTimeout = null;
    const onUserAction = () => {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          recordActivity();
          throttleTimeout = null;
        }, 1000);
      }
    };

    activityEvents.forEach(evt => {
      window.addEventListener(evt, onUserAction, { passive: true });
    });

    // ── 3. INTERVAL TICKER (Checks Idle & Token Expiry every 15s) ─────────────
    const ticker = setInterval(() => {
      const now = Date.now();
      const currentUser = authService.getCurrentUser();

      // If no active user session, nothing to time out
      if (!currentUser) {
        return;
      }

      // Check token explicit expiration timestamp if present
      if (currentUser.tokenExpiresAt && now > currentUser.tokenExpiresAt) {
        handleLogout('token_expired');
        return;
      }

      const idleDuration = now - lastActivityRef.current;

      // 1 minute warning toast
      if (idleDuration >= (timeoutMs - WARNING_BEFORE_LOGOUT_MS) && !warningShownRef.current) {
        warningShownRef.current = true;
        toast.info('Security Notice: Your session will expire in 1 minute due to inactivity.');
      }

      // Final Idle Expiration
      if (idleDuration >= timeoutMs) {
        handleLogout('inactivity');
      }
    }, 15000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth_unauthorized', handleUnauthorizedEvent);
      activityEvents.forEach(evt => {
        window.removeEventListener(evt, onUserAction);
      });
      clearInterval(ticker);
      if (throttleTimeout) clearTimeout(throttleTimeout);
    };
  }, [enabled, timeoutMs, recordActivity, handleLogout]);

  return {
    recordActivity,
    resetTimer: recordActivity
  };
}

export default useSessionTimeout;
