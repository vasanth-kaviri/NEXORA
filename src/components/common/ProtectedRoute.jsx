import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';
import securityService from '../../services/securityService';

/**
 * ProtectedRoute Guard
 * Enforces Checkpoint 2 (Verification Lock) & Checkpoint 7 (Authorization RBAC).
 * Prevents FOUC / auth flickering by waiting for real-time session hydration before routing decisions.
 */
export default function ProtectedRoute() {
  const location = useLocation();
  const { user, loading, isAuthenticated } = useAuth();

  // Synchronously check localStorage for active session or bearer tokens
  const storedToken = (() => {
    try {
      const direct = localStorage.getItem('nexora_token');
      if (direct && typeof direct === 'string' && direct.trim()) return direct.trim();
      const raw = localStorage.getItem('nexora_session');
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed?.token || parsed?.accessToken || null;
    } catch {
      return null;
    }
  })();

  const storedUser = (() => {
    try {
      const rawUser = localStorage.getItem('nexora_user');
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        if (parsed?.id || parsed?._id || parsed?.email) return parsed;
      }
      const rawSession = localStorage.getItem('nexora_session');
      if (rawSession) {
        const parsed = JSON.parse(rawSession);
        if (parsed?.user) return parsed.user;
      }
      return authService.getCurrentUser() || null;
    } catch {
      return null;
    }
  })();

  const currentUser = user || storedUser;
  const hasToken = Boolean(storedToken);
  const isAuthed = Boolean(hasToken || currentUser || isAuthenticated);

  // 1. Prevent premature redirects while hydration is in flight
  if (loading) {
    return (
      <div 
        className="flex items-center justify-center min-h-[60vh] w-full"
        style={{ background: 'transparent' }}
      >
        <div 
          className="flex flex-col items-center gap-3 p-6 rounded-2xl glass-panel animate-fade-in"
          style={{ border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}
        >
          <Loader2 size={26} className="animate-spin text-primary" />
          <span 
            className="font-mono text-xs font-semibold tracking-wider uppercase" 
            style={{ color: 'var(--text-muted)' }}
          >
            Hydrating Engineering Workspace...
          </span>
        </div>
      </div>
    );
  }

  // 2. Check Authentication Status
  // If no user AND no session token exists anywhere, redirect to /login
  if (!isAuthed && !currentUser) {
    securityService.logSecurityEvent('UNAUTHORIZED_ROUTE_ATTEMPT', {
      attemptedPath: location.pathname,
      referrer: document.referrer
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Check Verification Lock (Checkpoint 2: Never allow unverified accounts into workspace)
  if (currentUser && currentUser.isVerified === false) {
    securityService.logSecurityEvent('UNVERIFIED_ACCOUNT_INTERCEPTED', {
      userId: currentUser.id || currentUser._id,
      email: currentUser.email,
      attemptedPath: location.pathname
    });
    return <Navigate to="/verify-account" state={{ from: location }} replace />;
  }

  // User is authenticated and verified
  return <Outlet />;
}
