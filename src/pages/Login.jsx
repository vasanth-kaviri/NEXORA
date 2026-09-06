import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import CountryCodePicker from '../components/CountryCodePicker';
import IconInput from '../components/IconInput';
import GoogleAuthButton from '../components/GoogleAuthButton';
import { useCountryCodes } from '../hooks/useCountryCodes';
import db from '../services/db';
import { firebaseAuth } from '../services/firebaseAuth';
import { useToast } from '../contexts/ToastContext';

// ── Branded Custom Validation ────────────────────────────────────────────────
function validateLoginForm(formData, contactType) {
  const errors = {};

  if (!formData.contact.trim()) {
    errors.contact =
      contactType === 'email'
        ? 'Email address is required.'
        : 'Phone number is required.';
  } else if (contactType === 'email' && !formData.contact.includes('@')) {
    errors.contact = 'Please enter a valid email address (e.g. you@example.com).';
  } else if (contactType === 'phone' && formData.contact.length < 7) {
    errors.contact = 'Please enter a valid phone number.';
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
  const [formData, setFormData] = useState({ contact: '', password: '' });
  const [contactType, setContactType] = useState('email');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  const handleLogin = async (e) => {
    e.preventDefault();

    // Run branded custom validation first
    const validationErrors = validateLoginForm(formData, contactType);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    setIsLoading(true);
    try {
      if (contactType === 'email') {
        await firebaseAuth.loginWithEmail(formData.contact, formData.password);
      } else {
        db.login(formData.contact, formData.password);
      }

      setTimeout(() => {
        setIsLoading(false);
        const currentUser = db.getCurrentUser();
        toast.success('Successfully authenticated! Welcome back.');
        if (!currentUser?.profileCompleted) {
          navigate('/complete-profile');
        } else {
          navigate('/dashboard');
        }
      }, 600);
    } catch {
      setIsLoading(false);
      toast.error('Login failed. Please check your credentials and try again.');
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

        {/* Google Authentication */}
        <div className="mb-5">
          <GoogleAuthButton mode="signin" onSuccess={() => {
            const currentUser = db.getCurrentUser();
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

        {/* Contact Type Segmented Pill Toggle */}
        <div className="flex p-1 rounded-xl mb-5" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
          <button
            type="button"
            onClick={() => { setContactType('email'); setFormData({ ...formData, contact: '' }); setErrors({}); }}
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
            onClick={() => { setContactType('phone'); setFormData({ ...formData, contact: '' }); setErrors({}); setShowCountryMenu(false); }}
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
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
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
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({ ...formData, contact: val });
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
              <span
                onClick={() => navigate('/forgot-password')}
                className="text-xs text-muted hover:text-primary transition-colors cursor-pointer font-medium"
              >
                Forgot password?
              </span>
            </div>
            <IconInput
              icon={<Lock size={17} />}
              type="password"
              showToggle
              placeholder="Enter your account password"
              value={formData.password}
              error={!!errors.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {errors.password && (
              <span role="alert" className="text-secondary text-xs font-medium block mt-1.5">
                {errors.password}
              </span>
            )}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            id="login-submit-btn"
            disabled={isLoading}
            className="btn btn-primary w-full flex items-center justify-center gap-2 mt-2 cursor-pointer"
            style={{ padding: '13px', fontSize: '0.94rem', borderRadius: 'var(--radius-md)' }}
          >
            {isLoading ? (
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
