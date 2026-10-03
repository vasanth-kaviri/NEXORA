import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldAlert, Clock } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import CountryCodePicker from '../../components/common/CountryCodePicker';
import IconInput from '../../components/common/IconInput';
import GoogleAuthButton from '../../components/common/GoogleAuthButton';
import { useCountryCodes } from '../../hooks/useCountryCodes';
import authService from '../../services/authService';
import securityService from '../../services/securityService';
import apiClient from '../../services/apiClient';
import db from '../../services/db';
import { validateEmail, validatePhone } from '../../utils/validators';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';

// ── Custom Validation ────────────────────────────────────────────────────────
function validateLoginForm(formData, contactType) {
  const errors = {};
  const clean = (formData.contact || '').trim();

  if (!clean) {
    errors.contact =
      contactType === 'email'
        ? 'Email address or phone number is required.'
        : 'Phone number is required.';
  } else {
    const hasAt = clean.includes('@');
    if (hasAt) {
      const res = validateEmail(clean);
      if (!res.isValid) errors.contact = res.error;
    } else {
      const res = validatePhone(clean);
      if (!res.isValid) errors.contact = res.error;
    }
  }

  if (!formData.password) {
    errors.password = 'Password is required.';
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  return errors;
}

export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const { refreshUser, setUser, setIsAuthenticated, setAuthUser } = useAuth();
  const [formData, setFormData] = useState({ contact: '', password: '' });
  const [contactType, setContactType] = useState('email');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  const {
    countryCode,
    setCountryCode,
    showCountryMenu,
    setShowCountryMenu,
    searchCountry,
    setSearchCountry,
    filteredCountries,
    countryCodes,
  } = useCountryCodes();

  // Active Lockout Countdown Ticker
  useEffect(() => {
    let timer;
    if (lockoutSeconds > 0) {
      timer = setInterval(() => {
        setLockoutSeconds(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  // Check rate limit on contact blur or change
  const checkCurrentRateLimit = (targetContact) => {
    if (!targetContact) return;
    const status = securityService.checkLoginRateLimit(targetContact);
    if (status.isLocked) {
      setLockoutSeconds(status.remainingSeconds);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Checkpoint 1: Frontend State Throttling & Click Debounce
    if (!securityService.canExecuteAction('login_submit', 1500)) {
      return;
    }

    // Check active lockout
    if (lockoutSeconds > 0) {
      toast.error(`Security lock active. Please wait ${lockoutSeconds}s before attempting again.`);
      return;
    }

    // Validation
    const validationErrors = validateLoginForm(formData, contactType);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    // Check rate limit before dispatch
    const initialRateCheck = securityService.checkLoginRateLimit(formData.contact);
    if (initialRateCheck.isLocked) {
      setLockoutSeconds(initialRateCheck.remainingSeconds);
      setErrors({ general: `Account temporarily locked due to excessive failed attempts. Please wait ${initialRateCheck.remainingSeconds}s.` });
      return;
    }

    setIsLoading(true);

    try {
      const rawInput = formData.contact.trim();
      const hasAt = rawInput.includes('@');
      const isPhone = contactType === 'phone' || (!hasAt && /^\+?[0-9\s\-()]{7,15}$/.test(rawInput));
      const cleanCode = (countryCode || '+91').trim();
      const formattedCode = cleanCode.startsWith('+') ? cleanCode : `+${cleanCode}`;

      let contactPayload = rawInput;
      if (isPhone && !hasAt) {
        const sanitized = rawInput.replace(/[\s\-\(\)]/g, '');
        const pureDigits = sanitized.replace(/\D/g, '').slice(-10);
        contactPayload = sanitized.startsWith('+') ? sanitized : `${formattedCode}${pureDigits}`;
      }

      const res = await authService.login(contactPayload, formData.password, {
        countryCode: (isPhone && !hasAt) ? formattedCode : undefined,
        phone: (isPhone && !hasAt) ? contactPayload : undefined
      });

      if (!res || !res.success) {
        setIsLoading(false);
        // Record failed attempt & enforce progressive lockout
        const rateStatus = securityService.recordFailedLogin(contactPayload);
        const errMsg = securityService.sanitizeAuthError(res?.error || 'Invalid credentials.', 'login');

        if (rateStatus.isLocked) {
          setLockoutSeconds(rateStatus.remainingSeconds);
          setErrors({ general: `Too many failed login attempts. Security lock active: please wait ${rateStatus.remainingSeconds}s before trying again.` });
          toast.error('Account temporarily locked due to excessive failed attempts.');
        } else {
          setErrors({ 
            general: `${errMsg} (${rateStatus.attemptsLeft} attempt${rateStatus.attemptsLeft === 1 ? '' : 's'} remaining)` 
          });
          toast.error(errMsg);
        }
        return;
      }

      // Successful Authentication: Reset Rate Limit
      securityService.resetLoginRateLimit(contactPayload);

      const authenticatedUser = res.user || authService.getCurrentUser();
      const accessToken = res.accessToken || res.data?.accessToken;
      const refreshToken = res.refreshToken || res.data?.refreshToken;

      // Synchronously commit to localStorage and apiClient
      if (accessToken) {
        apiClient.setActiveBearerToken(accessToken);
        try {
          localStorage.setItem('nexora_token', accessToken);
        } catch {
          // Ignored
        }
      }

      if (refreshToken) {
        try {
          localStorage.setItem('nexora_refresh_token', refreshToken);
        } catch {
          // Ignored
        }
      }

      if (authenticatedUser) {
        const sessionData = {
          token: accessToken,
          accessToken,
          user: authenticatedUser,
          id: authenticatedUser.id || authenticatedUser._id,
          email: authenticatedUser.email,
          phone: authenticatedUser.phone,
          role: authenticatedUser.role,
          isVerified: authenticatedUser.isVerified,
          profileCompleted: authenticatedUser.profileCompleted
        };
        try {
          localStorage.setItem('nexora_user', JSON.stringify(authenticatedUser));
          localStorage.setItem('nexora_session', JSON.stringify(sessionData));
        } catch {
          // Ignored
        }
        db.setCurrentUser(authenticatedUser);
      }

      // Synchronously update AuthContext state
      if (typeof setAuthUser === 'function') {
        setAuthUser(authenticatedUser, accessToken);
      } else {
        if (typeof setUser === 'function') setUser(authenticatedUser);
        if (typeof setIsAuthenticated === 'function') setIsAuthenticated(true);
      }

      window.dispatchEvent(new Event('user_session_changed'));

      setIsLoading(false);
      toast.success('Successfully authenticated! Welcome back.');

      // Checkpoint 2: Verification Lock
      if (authenticatedUser && authenticatedUser.isVerified === false) {
        navigate('/verify-account', { replace: true });
        return;
      }

      // Navigate directly to dashboard with replace: true
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('[HANDLE_LOGIN_ERROR]:', err);
      setIsLoading(false);
      const errMsg = err?.message || 'Authentication error. Please try again.';
      setErrors({ general: errMsg });
      toast.error(errMsg);
    }
  };

  return (
    <AuthLayout
      headline="Welcome Back to NEXORA."
      subtext="Your calibrated workstation for systems architecture, daily engineering sprints, and FAANG career trajectory."
      badgeText="NEXORA CAREER PLATFORM"
      badgeSub="· Verified Trajectory"
      maxWidth="440px"
    >
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-gradient text-3xl font-extrabold tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-muted text-sm leading-relaxed">
            Sign in to continue calibrating your engineering trajectory.
          </p>
        </div>

        {/* Checkpoint 1: Active Lockout Countdown Banner */}
        {lockoutSeconds > 0 && (
          <div 
            className="mb-5 p-4 rounded-xl flex items-start gap-3 animate-fade-in"
            style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
          >
            <ShieldAlert size={20} className="text-red-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="text-red-400 block font-semibold mb-1">
                Security Lock Active ({lockoutSeconds}s)
              </strong>
              <p className="text-muted leading-relaxed">
                Excessive failed attempts detected. Login actions are temporarily throttled to protect your account.
              </p>
            </div>
          </div>
        )}

        {/* Google Authentication */}
        <div className="mb-5">
          <GoogleAuthButton mode="signin" onSuccess={() => {
            const currentUser = authService.getCurrentUser();
            if (!currentUser?.profileCompleted) {
              navigate('/complete-profile');
            } else {
              navigate('/dashboard');
            }
          }} />
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-[1px]" style={{ background: 'var(--border-color)' }} />
          <span className="text-[11px] text-muted uppercase tracking-widest font-medium">or continue with</span>
          <div className="flex-1 h-[1px]" style={{ background: 'var(--border-color)' }} />
        </div>

        {/* Contact Type Toggle */}
        <div className="flex p-1 rounded-xl mb-5" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
          <button
            type="button"
            onClick={() => { setContactType('email'); setFormData({ ...formData, contact: '' }); setErrors({}); setLockoutSeconds(0); }}
            className="flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer"
            style={{
              background: contactType === 'email' ? 'var(--minimal-indigo, #6366f1)' : 'transparent',
              color: contactType === 'email' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: contactType === 'email' ? '0 2px 10px rgba(99, 102, 241, 0.35)' : 'none'
            }}
          >
            Email Address
          </button>
          <button
            type="button"
            onClick={() => { setContactType('phone'); setFormData({ ...formData, contact: '' }); setErrors({}); setShowCountryMenu(false); setLockoutSeconds(0); }}
            className="flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer"
            style={{
              background: contactType === 'phone' ? 'var(--minimal-indigo, #6366f1)' : 'transparent',
              color: contactType === 'phone' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: contactType === 'phone' ? '0 2px 10px rgba(99, 102, 241, 0.35)' : 'none'
            }}
          >
            Phone Number
          </button>
        </div>

        <form onSubmit={handleLogin} noValidate className="w-full flex flex-col gap-4">
          {/* Contact Input */}
          <div className="input-group mb-0">
            <label className="input-label mb-1.5 font-medium text-xs tracking-wide">
              {contactType === 'email' ? 'Email Address' : 'Phone Number'}
            </label>

            {contactType === 'email' ? (
              <IconInput
                icon={<Mail size={17} />}
                type="email"
                placeholder="name@company.com"
                value={formData.contact}
                error={!!errors.contact}
                onChange={(e) => {
                  setFormData({ ...formData, contact: e.target.value });
                  checkCurrentRateLimit(e.target.value);
                }}
                disabled={lockoutSeconds > 0}
              />
            ) : (
              <div className="flex w-full gap-2">
                <CountryCodePicker
                  countryCode={countryCode}
                  setCountryCode={setCountryCode}
                  showCountryMenu={showCountryMenu}
                  setShowCountryMenu={setShowCountryMenu}
                  searchCountry={searchCountry}
                  setSearchCountry={setSearchCountry}
                  filteredCountries={filteredCountries}
                  countryCodes={countryCodes}
                />
                <input
                  type="tel"
                  maxLength={countryCodes.find(c => c.code === countryCode)?.maxLength || 15}
                  className="input-field flex-1 min-w-0"
                  style={{ flex: 1, minWidth: 0, borderColor: errors.contact ? 'var(--secondary)' : '' }}
                  placeholder="234 567 8900"
                  value={formData.contact}
                  disabled={lockoutSeconds > 0}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({ ...formData, contact: val });
                    checkCurrentRateLimit(val);
                  }}
                />
              </div>
            )}

            {errors.contact && (
              <span role="alert" className="text-secondary text-xs font-medium block mt-1.5">
                {errors.contact}
              </span>
            )}
          </div>

          {/* Password Input */}
          <div className="input-group mb-1">
            <div className="flex justify-between items-center mb-1.5">
              <label className="input-label mb-0 font-medium text-xs tracking-wide">Password</label>
              <Link
                to="/forgot-password"
                className="text-xs text-muted hover:text-primary transition-colors font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <IconInput
              icon={<Lock size={17} />}
              type="password"
              showToggle
              placeholder="Enter your account password"
              value={formData.password}
              error={!!errors.password}
              disabled={lockoutSeconds > 0}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {errors.password && (
              <span role="alert" className="text-secondary text-xs font-medium block mt-1.5">
                {errors.password}
              </span>
            )}
            {errors.general && (
              <span role="alert" className="text-secondary text-xs font-medium block mt-2">
                {errors.general}
              </span>
            )}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            id="login-submit-btn"
            disabled={isLoading || lockoutSeconds > 0}
            className="btn btn-primary w-full flex items-center justify-center gap-2 mt-2 cursor-pointer"
            style={{ 
              padding: '13px', 
              fontSize: '0.94rem', 
              borderRadius: 'var(--radius-md)',
              opacity: lockoutSeconds > 0 ? 0.6 : 1
            }}
          >
            {lockoutSeconds > 0 ? (
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>Locked ({lockoutSeconds}s)</span>
              </div>
            ) : isLoading ? (
              <>
                <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
          <p className="text-muted text-xs sm:text-sm">
            Don't have an account?{' '}
            <span
              onClick={() => navigate('/signup')}
              className="text-primary font-semibold cursor-pointer hover:underline"
            >
              Create an account
            </span>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
