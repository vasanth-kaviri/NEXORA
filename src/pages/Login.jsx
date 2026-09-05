import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Zap } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import CountryCodePicker from '../components/CountryCodePicker';
import IconInput from '../components/IconInput';
import GoogleAuthButton from '../components/GoogleAuthButton';
import { useCountryCodes } from '../hooks/useCountryCodes';
import db from '../services/db';
import { firebaseAuth } from '../services/firebaseAuth';
import { useToast } from '../contexts/ToastContext';

export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({ contact: '', password: '' });
  const [contactType, setContactType] = useState('email');
  const [isLoading, setIsLoading] = useState(false);

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
    if (!formData.contact) {
      toast.error('Please enter your email or phone number.');
      return;
    }
    if (!formData.password) {
      toast.error('Please enter your password.');
      return;
    }

    setIsLoading(true);
    // Connect to Firebase Auth & local DB
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
  };

  const handleQuickDemoFill = () => {
    setContactType('email');
    setFormData({
      contact: 'alex.johnson.dev@gmail.com',
      password: 'password123'
    });
    toast.info('Filled demo credentials (Alex Johnson). Click "Log in".');
  };

  return (
    <AuthLayout
      headline="Welcome Back to NEXORA."
      subtext="Your calibrated workstation for hands-on systems architecture, daily coding sprints, and FAANG career readiness."
    >
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-gradient" style={{ fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>
          Welcome Back
        </h1>
        <button
          type="button"
          onClick={handleQuickDemoFill}
          className="minimal-badge cursor-pointer"
          style={{ color: 'var(--minimal-indigo)', fontSize: '0.74rem', padding: '4px 10px' }}
          title="1-click fill with student test credentials"
        >
          <Zap size={12} />
          <span>Demo Fill</span>
        </button>
      </div>
      <p className="text-muted" style={{ marginBottom: '20px', fontSize: '0.9rem' }}>
        Log in to continue your technical trajectory with NEXORA.
      </p>

      {/* Google Authentication with Real Firebase + Custom Account support */}
      <div style={{ marginBottom: '18px' }}>
        <GoogleAuthButton mode="signin" onSuccess={() => {
          const currentUser = db.getCurrentUser();
          if (!currentUser?.profileCompleted) {
            navigate('/complete-profile');
          } else {
            navigate('/dashboard');
          }
        }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>or log in with credentials</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
      </div>

      <form onSubmit={handleLogin} className="glass-panel w-full max-w-full overflow-hidden" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>

        {/* Contact Input Toggle */}
        <div className="input-group">
          <div className="flex justify-between items-center mb-1">
            <label className="input-label mb-0" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Contact Details</label>
            <div className="flex gap-2">
              <span
                onClick={() => { setContactType('email'); setFormData({ ...formData, contact: '' }); }}
                style={{ fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600, color: contactType === 'email' ? 'var(--minimal-indigo)' : 'var(--text-muted)' }}
              >
                Email
              </span>
              <span style={{ color: 'var(--text-muted)' }}>|</span>
              <span
                onClick={() => { setContactType('phone'); setFormData({ ...formData, contact: '' }); setShowCountryMenu(false); }}
                style={{ fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600, color: contactType === 'phone' ? 'var(--minimal-indigo)' : 'var(--text-muted)' }}
              >
                Phone
              </span>
            </div>
          </div>

          {contactType === 'email' ? (
            <IconInput
              icon={<Mail size={18} />}
              type="email"
              placeholder="student@example.com"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              required
            />
          ) : (
            <div className="flex w-full gap-2" style={{ width: '100%' }}>
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
                style={{ flex: 1, minWidth: 0 }}
                placeholder="234 567 8900"
                value={formData.contact}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setFormData({ ...formData, contact: val });
                }}
                required
              />
            </div>
          )}
        </div>

        {/* Password */}
        <div className="input-group mb-2">
          <div className="flex justify-between items-center mb-1">
            <label className="input-label mb-0" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Password</label>
            <span
              onClick={() => navigate('/forgot-password')}
              className="text-primary interactive"
              style={{ fontSize: '0.76rem', cursor: 'pointer', fontWeight: 600 }}
            >
              Forgot password?
            </span>
          </div>
          <IconInput
            icon={<Lock size={18} />}
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="btn btn-primary w-full flex items-center justify-center gap-2 mt-4"
          style={{ padding: '12px', fontSize: '0.92rem', borderRadius: 'var(--radius-md)' }}
        >
          {isLoading ? (
            <>
              <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Log in</span>
              <ArrowRight size={17} />
            </>
          )}
        </button>
      </form>

      <div className="text-center mt-4">
        <p className="text-muted" style={{ fontSize: '0.88rem' }}>
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="text-primary font-semibold interactive cursor-pointer"
          >
            Create account
          </span>
        </p>
      </div>
    </AuthLayout>
  );
}
