import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, ShieldCheck, CheckCircle, Sparkles, KeyRound } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import CountryCodePicker from '../components/CountryCodePicker';
import IconInput from '../components/IconInput';
import GoogleAuthButton from '../components/GoogleAuthButton';
import { useCountryCodes } from '../hooks/useCountryCodes';
import { validateSignupStep1 } from '../utils/validators';
import db from '../services/db';
import { firebaseAuth } from '../services/firebaseAuth';
import { useToast } from '../contexts/ToastContext';

export default function Signup() {
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    contact: '',
    password: '',
    confirmPassword: ''
  });
  const [demoOtp] = useState(() => Math.floor(1000 + Math.random() * 9000).toString());
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
      toast.info(`Verification code sent. Use code: ${demoOtp}`);
    } else {
      setErrors(newErrors);
    }
  };

  const completeAccountCreation = async () => {
    setIsVerifying(true);
    // Connect to Firebase Auth & local DB
    if (contactType === 'email') {
      await firebaseAuth.signupWithEmail(formData.contact, formData.password);
    } else {
      db.signup(formData, contactType);
    }
    
    setTimeout(() => {
      setIsVerifying(false);
      toast.success('Account successfully verified & created! +150 XP awarded.');
      navigate('/dashboard');
    }, 600);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otp.length >= 4) {
      completeAccountCreation();
    } else {
      setErrors({ otp: 'Please enter a valid 4-digit code.' });
    }
  };

  return (
    <AuthLayout
      headline="Engineered for High-Growth Tech Careers."
      subtext="Join over 14,850+ engineers calibrating production systems, AI pipelines, and FAANG technical interviews."
    >
      {step === 1 && (
        <>
          <h1 className="text-gradient" style={{ fontSize: '2.1rem', fontWeight: 800, marginBottom: '6px', letterSpacing: '-0.5px' }}>
            Create Account
          </h1>
          <p className="text-muted" style={{ marginBottom: '20px', fontSize: '0.9rem' }}>
            Join NEXORA and calibrate your technical trajectory.
          </p>

          {/* Google Sign up with Real Firebase + Custom Account support */}
          <div style={{ marginBottom: '18px' }}>
            <GoogleAuthButton mode="signup" onSuccess={() => navigate('/dashboard')} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>or register with email</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          </div>

          <form onSubmit={handleStep1Submit} className="glass-panel w-full max-w-full overflow-hidden" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>

            {/* Contact Input Toggle */}
            <div className="input-group">
              <div className="flex justify-between items-center mb-1">
                <label className="input-label mb-0" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Contact Details</label>
                <div className="flex gap-2">
                  <span
                    onClick={() => { setContactType('email'); setFormData({ ...formData, contact: '' }); setErrors({}); }}
                    style={{ fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600, color: contactType === 'email' ? 'var(--minimal-indigo)' : 'var(--text-muted)' }}
                  >
                    Email
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>|</span>
                  <span
                    onClick={() => { setContactType('phone'); setFormData({ ...formData, contact: '' }); setErrors({}); setShowCountryMenu(false); }}
                    style={{ fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600, color: contactType === 'phone' ? 'var(--minimal-indigo)' : 'var(--text-muted)' }}
                  >
                    Phone
                  </span>
                </div>
              </div>

              {contactType === 'email' ? (
                <IconInput
                  icon={<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
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
            <div className="input-group mb-3">
              <label className="input-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Password</label>
              <IconInput
                icon={<Lock size={18} />}
                type="password"
                placeholder="At least 6 characters"
                error={!!errors.password}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              {errors.password && <span className="text-secondary" style={{ fontSize: '0.8rem' }}>{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="input-group mb-5">
              <label className="input-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Confirm Password</label>
              <IconInput
                icon={<Lock size={18} />}
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

            <button 
              type="submit" 
              className="btn btn-primary w-full flex items-center justify-center gap-2"
              style={{ padding: '12px', fontSize: '0.92rem', borderRadius: 'var(--radius-md)' }}
            >
              <span>Continue</span>
              <ArrowRight size={17} />
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-muted" style={{ fontSize: '0.88rem' }}>
              Already have an account?{' '}
              <span
                onClick={() => navigate('/login')}
                className="text-primary font-semibold interactive cursor-pointer"
              >
                Log in
              </span>
            </p>
          </div>
        </>
      )}

      {step === 2 && (
        <div className="animate-fade-in flex flex-col justify-center items-center text-center">
          <div style={{ background: 'rgba(99, 102, 241, 0.12)', padding: '16px', borderRadius: '50%', marginBottom: '16px' }}>
            <ShieldCheck size={38} className="text-minimal-indigo" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '6px', letterSpacing: '-0.5px' }}>
            Verify your {contactType}
          </h2>
          <p className="text-muted" style={{ marginBottom: '16px', fontSize: '0.88rem', lineHeight: 1.5 }}>
            We've sent a 4-digit code to <br />
            <strong className="text-main">{formData.contact}</strong>
          </p>

          {/* Prominently Displayed Verification Code (Frictionless) */}
          <div 
            className="minimal-badge mb-5" 
            style={{ 
              padding: '8px 16px', 
              color: 'var(--minimal-indigo)', 
              background: 'rgba(99, 102, 241, 0.1)', 
              borderColor: 'rgba(99, 102, 241, 0.3)',
              fontSize: '0.84rem'
            }}
          >
            <span>Verification Code:</span>
            <strong className="font-mono text-main ml-1" style={{ letterSpacing: '2px', fontSize: '1rem' }}>{demoOtp}</strong>
            <button 
              type="button" 
              onClick={() => setOtp(demoOtp)}
              className="text-minimal-indigo underline font-bold cursor-pointer" 
              style={{ marginLeft: 10, fontSize: '0.78rem' }}
            >
              Auto-Fill
            </button>
          </div>

          {!isVerifying ? (
            <form onSubmit={handleVerifyOTP} className="w-full">
              <div className="input-group mb-4 text-left">
                <label className="input-label text-center" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Enter 4-Digit Code</label>
                <input
                  type="text"
                  className="input-field text-center font-mono"
                  style={{ fontSize: '1.5rem', letterSpacing: '0.6rem', fontWeight: 700, borderRadius: 'var(--radius-md)' }}
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
                  <span className="text-secondary text-center block mt-1" style={{ fontSize: '0.8rem' }}>{errors.otp}</span>
                )}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full flex items-center justify-center gap-2 mb-2"
                style={{ padding: '12px', fontSize: '0.92rem', borderRadius: 'var(--radius-md)' }}
              >
                <span>Verify &amp; Create Account</span>
                <CheckCircle size={18} />
              </button>

              <button
                type="button"
                onClick={completeAccountCreation}
                className="btn btn-secondary w-full mb-2"
                style={{ fontSize: '0.84rem', padding: '9px' }}
              >
                Instant Access (Skip Verification)
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn w-full text-muted hover:text-main"
                style={{ fontSize: '0.82rem', padding: '6px' }}
              >
                Go back
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center mt-4 animate-fade-in">
              <div style={{ width: 44, height: 44, border: '3px solid var(--border-color)', borderTopColor: 'var(--minimal-indigo)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <h3 className="mt-3 font-semibold text-minimal-indigo" style={{ fontSize: '1.05rem' }}>Securing your account...</h3>
              <p className="text-muted text-center mt-1" style={{ fontSize: '0.82rem' }}>Provisioning your personalized curriculum workstation.</p>
            </div>
          )}
        </div>
      )}
    </AuthLayout>
  );
}
