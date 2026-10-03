import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, ArrowRight, Clock, ShieldAlert } from 'lucide-react';
import db from '../../services/db';
import securityService from '../../services/securityService';
import { useToast } from '../../contexts/ToastContext';

/**
 * AdminLogin Page
 * Enforces Checkpoint 1 (Rate Limiting) & Checkpoint 7 (RBAC Gateway).
 */
export default function AdminLogin() {
  const navigate = useNavigate();
  const toast = useToast();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  useEffect(() => {
    const status = securityService.checkLoginRateLimit('admin_root');
    if (status.isLocked) {
      setLockoutSeconds(status.remainingSeconds);
    }
  }, []);

  useEffect(() => {
    let timer;
    if (lockoutSeconds > 0) {
      timer = setInterval(() => {
        setLockoutSeconds(prev => {
          if (prev <= 1) return 0;
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!securityService.canExecuteAction('admin_login', 1500)) return;

    if (lockoutSeconds > 0) {
      toast.error(`Admin console locked. Please wait ${lockoutSeconds}s.`);
      return;
    }

    const rateStatus = securityService.checkLoginRateLimit('admin_root');
    if (rateStatus.isLocked) {
      setLockoutSeconds(rateStatus.remainingSeconds);
      setError(`Administrator console locked due to excessive failed attempts. Please wait ${rateStatus.remainingSeconds}s.`);
      return;
    }

    const ok = db.verifyAdminPasskey(password.trim());
    if (ok) {
      securityService.resetLoginRateLimit('admin_root');
      securityService.logSecurityEvent('ADMIN_LOGIN_SUCCESS');
      setError('');
      toast.success('Admin clearance verified. Access granted.');
      navigate('/admin/dashboard');
    } else {
      const failStatus = securityService.recordFailedLogin('admin_root');
      const sanitized = securityService.sanitizeAuthError(null, 'admin');

      if (failStatus.isLocked) {
        setLockoutSeconds(failStatus.remainingSeconds);
        setError(`Portal restricted due to excessive failed attempts. Try again in ${failStatus.remainingSeconds}s.`);
        toast.error('Portal access restricted.');
      } else {
        setError(`${sanitized} (${failStatus.attemptsLeft} attempt${failStatus.attemptsLeft === 1 ? '' : 's'} remaining)`);
        toast.error('Access Denied');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-md" style={{ minHeight: '100vh', width: '100%', backgroundColor: 'var(--bg-main)' }}>
      <div className="glass-panel animate-fade-in flex flex-col items-center" style={{ padding: 'var(--space-xl)', maxWidth: 420, width: '100%' }}>
        <Shield size={64} className="text-secondary mb-md" />
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: 'var(--space-xs)' }}>Admin Portal</h1>
        <p className="text-muted text-xs text-center mb-lg">Restricted management console for authorized engineering leads.</p>

        {lockoutSeconds > 0 && (
          <div 
            className="mb-4 p-3 rounded-xl flex items-center gap-2.5 w-full animate-fade-in"
            style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
          >
            <ShieldAlert size={18} className="text-red-400 shrink-0" />
            <span className="text-xs text-red-400 font-semibold">
              Security Lockout Active ({lockoutSeconds}s)
            </span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <div className="input-group mb-md">
            <label className="input-label font-medium text-xs">Admin Passkey</label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} className="text-muted" style={{ position: 'absolute', top: 14, left: 14 }} />
              <input 
                type="password" 
                className="input-field" 
                style={{ paddingLeft: '2.75rem', width: '100%' }}
                placeholder="Enter passkey (admin2026)"
                value={password}
                disabled={lockoutSeconds > 0}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                required
              />
            </div>
            {error && (
              <span role="alert" className="text-secondary text-xs font-medium block mt-1.5">
                {error}
              </span>
            )}
          </div>

          <button 
            type="submit" 
            disabled={lockoutSeconds > 0}
            className="btn btn-primary w-full flex items-center justify-center gap-2 cursor-pointer" 
            style={{ 
              background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
              opacity: lockoutSeconds > 0 ? 0.6 : 1
            }}
          >
            {lockoutSeconds > 0 ? (
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>Console Locked ({lockoutSeconds}s)</span>
              </div>
            ) : (
              <>
                <span>Enter Portal</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
