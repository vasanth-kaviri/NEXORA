import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import CountryCodePicker from '../components/CountryCodePicker';
import IconInput from '../components/IconInput';
import GoogleAuthButton from '../components/GoogleAuthButton';
import { useCountryCodes } from '../hooks/useCountryCodes';
import { validateSignupStep1 } from '../utils/validators';
import db from '../services/db';

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    contact: '',
    password: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errors, setErrors] = useState({});
  const [contactType, setContactType] = useState('email');

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

  const handleStep1Submit = (e) => {
    e.preventDefault();
    const newErrors = validateSignupStep1(formData, contactType);
    if (Object.keys(newErrors).length === 0) {
      setErrors({});
      setStep(2);
    } else {
      setErrors(newErrors);
    }
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otp.length >= 4) {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        // Persist new user in client-side Database
        db.signup(formData, contactType);
        navigate('/dashboard');
      }, 1200);
    } else {
      setErrors({ otp: 'Please enter a valid OTP code.' });
    }
  };

  return (
    <AuthLayout
      headline="Start Your Journey."
      subtext="Create your account to unlock personalized roadmaps and AI-driven mock interviews."
      gradientDirection="135deg, #1e1b4b 0%, #0f172a 50%, #020617 100%"
      blobRight="radial-gradient(circle at 30% 70%, rgba(244, 63, 94, 0.4) 0%, transparent 50%)"
      blobLeft="radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.45) 0%, transparent 50%)"
    >
      {step === 1 && (
        <>
          <h1 className="text-gradient" style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: 'var(--space-xs)' }}>
            Create Account
          </h1>
          <p className="text-muted" style={{ marginBottom: 'var(--space-md)', fontSize: '0.9rem' }}>
            Join NEXORA and start your career journey.
          </p>

          {/* Google Sign up with Database Persistence */}
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <GoogleAuthButton mode="signup" onSuccess={() => navigate('/dashboard')} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-md)' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>or continue with</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          </div>

          <form onSubmit={handleStep1Submit} className="glass-panel w-full max-w-full overflow-hidden" style={{ padding: 'var(--space-md)' }}>

            {/* Contact Input Toggle */}
            <div className="input-group">
              <div className="flex justify-between items-center mb-xs">
                <label className="input-label mb-0">Contact Details</label>
                <div className="flex gap-sm">
                  <span
                    onClick={() => { setContactType('email'); setFormData({ ...formData, contact: '' }); setErrors({}); }}
                    style={{ fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600, color: contactType === 'email' ? 'var(--primary)' : 'var(--text-muted)' }}
                  >
                    Email
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>|</span>
                  <span
                    onClick={() => { setContactType('phone'); setFormData({ ...formData, contact: '' }); setErrors({}); setShowCountryMenu(false); }}
                    style={{ fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600, color: contactType === 'phone' ? 'var(--primary)' : 'var(--text-muted)' }}
                  >
                    Phone
                  </span>
                </div>
              </div>

              {contactType === 'email' ? (
                <IconInput
                  icon={<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
                  type="email"
                  placeholder="student@example.com"
                  error={!!errors.contact}
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
                    error={!!errors.contact}
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
                    required
                  />
                </div>
              )}
              {errors.contact && (
                <span className="text-secondary" style={{ fontSize: '0.8rem', marginTop: '4px' }}>{errors.contact}</span>
              )}
            </div>

            {/* Password */}
            <div className="input-group mb-md">
              <label className="input-label">Password</label>
              <IconInput
                icon={<Lock size={20} />}
                type="password"
                placeholder="Create a strong password"
                error={!!errors.password}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              {errors.password && <span className="text-secondary" style={{ fontSize: '0.8rem' }}>{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="input-group mb-xl">
              <label className="input-label">Confirm Password</label>
              <IconInput
                icon={<Lock size={20} />}
                type="password"
                placeholder="Repeat your password"
                error={!!errors.confirmPassword}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
              {errors.confirmPassword && (
                <span className="text-secondary" style={{ fontSize: '0.8rem' }}>{errors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Continue <ArrowRight size={20} />
            </button>
          </form>

          <div className="text-center mt-md">
            <p className="text-muted">
              Already have an account?{' '}
              <span
                onClick={() => navigate('/login')}
                className="text-primary interactive"
                style={{ fontWeight: '600', cursor: 'pointer' }}
              >
                Log in
              </span>
            </p>
          </div>
        </>
      )}

      {step === 2 && (
        <div className="animate-fade-in flex flex-col justify-center items-center text-center">
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '20px', borderRadius: '50%', marginBottom: 'var(--space-lg)' }}>
            <ShieldCheck size={48} className="text-primary" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: 'var(--space-xs)' }}>
            Verify your {contactType}
          </h2>
          <p className="text-muted" style={{ marginBottom: 'var(--space-xl)' }}>
            We've sent a 4-digit code to <br />
            <strong className="text-main">{formData.contact}</strong>
          </p>

          {!isVerifying ? (
            <form onSubmit={handleVerifyOTP} className="w-full">
              <div className="input-group mb-xl text-left">
                <label className="input-label text-center">Enter Verification Code</label>
                <input
                  type="text"
                  className="input-field text-center"
                  style={{ fontSize: '1.5rem', letterSpacing: '0.5rem', fontWeight: '600', borderColor: errors.otp ? 'var(--secondary)' : '' }}
                  placeholder="0000"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setOtp(val);
                  }}
                  required
                />
                {errors.otp && (
                  <span className="text-secondary text-center" style={{ fontSize: '0.8rem' }}>{errors.otp}</span>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-full">
                Verify &amp; Create Account <CheckCircle size={20} />
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn w-full mt-sm"
                style={{ background: 'transparent', color: 'var(--text-muted)' }}
              >
                Go back
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center mt-lg animate-fade-in">
              <div style={{ width: 60, height: 60, border: '4px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              <h3 className="mt-md font-600 text-primary" style={{ fontSize: '1.2rem' }}>Verifying OTP...</h3>
              <p className="text-muted text-center mt-xs">Securing your account.</p>
            </div>
          )}
        </div>
      )}
    </AuthLayout>
  );
}
