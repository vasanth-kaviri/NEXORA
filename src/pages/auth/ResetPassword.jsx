import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, ArrowRight, ShieldCheck, AlertTriangle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import IconInput from '../../components/common/IconInput';
import authService from '../../services/authService';
import securityService from '../../services/securityService';
import { validatePassword } from '../../utils/validators';
import { useToast } from '../../contexts/ToastContext';

/**
 * ResetPassword Page
 * Enforces Checkpoint 5 (Password Reset Security).
 * Validates single-use cryptographic tokens with strict 15-minute expiration timers.
 */
export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();

  const token = searchParams.get('token') || '';
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate token via useMemo
  const tokenStatus = useMemo(() => {
    if (!token) {
      return {
        checked: true,
        valid: false,
        email: '',
        error: 'No recovery token provided. Please request a new password reset link.'
      };
    }

    const check = securityService.verifyPasswordResetToken(token);
    return {
      checked: true,
      valid: check.valid,
      email: check.email || '',
      error: check.error || ''
    };
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password strength check
    const pwdCheck = validatePassword(formData.password);
    if (!pwdCheck.isValid) {
      setErrors({ password: pwdCheck.error || 'Password must be at least 6 characters.' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match.' });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const res = authService.resetPasswordWithToken(token, formData.password);
      setIsSubmitting(false);

      if (res.success) {
        toast.success('Password updated successfully! Please sign in with your new credentials.');
        navigate('/login', { replace: true });
      } else {
        setErrors({ general: res.error || 'Could not reset password. Token may have expired.' });
        toast.error(res.error || 'Failed to update password.');
      }
    } catch {
      setIsSubmitting(false);
      setErrors({ general: 'Security gateway error. Please try again.' });
    }
  };

  const topLeftAction = (
    <button 
      onClick={() => navigate('/login')} 
      className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-main transition-colors cursor-pointer"
    >
      <ArrowLeft size={15} className="text-primary" />
      <span>Back to login</span>
    </button>
  );

  return (
    <AuthLayout
      headline="Secure Account Restoration."
      subtext="Calibrated credentials safeguard your system architecture blueprints and interview intelligence."
      badgeText="SECURITY PROTOCOL"
      badgeSub="· Single-Use Token"
      topLeftAction={topLeftAction}
      maxWidth="440px"
    >
      <div className="w-full">
        {/* Token Invalid / Expired State */}
        {tokenStatus.checked && !tokenStatus.valid && (
          <div className="text-center animate-fade-in p-6 rounded-2xl" style={{ background: 'var(--input-bg)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
            <div 
              style={{ 
                width: 52, 
                height: 52, 
                borderRadius: '50%', 
                background: 'rgba(239, 68, 68, 0.12)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 16px auto', 
                border: '1px solid rgba(239, 68, 68, 0.3)' 
              }}
            >
              <AlertTriangle size={26} className="text-red-400" />
            </div>

            <h2 className="text-lg font-bold text-main mb-2">Invalid or Expired Link</h2>
            <p className="text-muted text-xs sm:text-sm leading-relaxed mb-6">
              {tokenStatus.error || 'This password reset link is invalid or has already been used. Security links expire after 15 minutes.'}
            </p>

            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="btn btn-primary w-full py-3 text-xs sm:text-sm font-semibold cursor-pointer"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              Request New Recovery Link
            </button>
          </div>
        )}

        {/* Valid Token: Render Form */}
        {tokenStatus.checked && tokenStatus.valid && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <div 
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--minimal-emerald)', border: '1px solid rgba(16, 185, 129, 0.25)' }}
              >
                <ShieldCheck size={13} />
                <span>Single-Use Token Validated</span>
              </div>

              <h1 className="text-gradient text-3xl font-extrabold tracking-tight mb-2">
                Set New Password
              </h1>
              <p className="text-muted text-sm leading-relaxed">
                Create a strong password for <strong className="text-main font-mono">{tokenStatus.email}</strong>.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
              <div className="input-group mb-0">
                <label className="input-label mb-1.5 font-medium text-xs tracking-wide">New Password</label>
                <IconInput
                  icon={<Lock size={17} />}
                  type="password"
                  showToggle
                  placeholder="Enter at least 6 characters"
                  value={formData.password}
                  error={!!errors.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                {errors.password && (
                  <span role="alert" className="text-secondary text-xs font-medium block mt-1.5">{errors.password}</span>
                )}
              </div>

              <div className="input-group mb-1">
                <label className="input-label mb-1.5 font-medium text-xs tracking-wide">Confirm New Password</label>
                <IconInput
                  icon={<Lock size={17} />}
                  type="password"
                  showToggle
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  error={!!errors.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
                {errors.confirmPassword && (
                  <span role="alert" className="text-secondary text-xs font-medium block mt-1.5">{errors.confirmPassword}</span>
                )}
                {errors.general && (
                  <span role="alert" className="text-secondary text-xs font-medium block mt-2">{errors.general}</span>
                )}
              </div>

              {/* Password Guidelines Pill */}
              <div className="p-3 rounded-xl text-xs text-muted leading-relaxed" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
                <div className="flex items-center gap-1.5 mb-1 text-main font-semibold">
                  <CheckCircle2 size={13} className="text-minimal-emerald" />
                  <span>Security Requirements:</span>
                </div>
                <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
                  <li>Minimum 6 characters (8+ recommended)</li>
                  <li>Single-use token will be burned immediately upon saving</li>
                  <li>Active sessions across other devices will be revoked</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full flex items-center justify-center gap-2 mt-2 py-3 cursor-pointer"
                style={{ borderRadius: 'var(--radius-md)', fontSize: '0.94rem' }}
              >
                {isSubmitting ? (
                  <>
                    <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Update Password &amp; Sign In</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        <div className="text-center mt-6 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
          <p className="text-muted text-xs sm:text-sm">
            Remember your credentials?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
