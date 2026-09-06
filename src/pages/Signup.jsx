import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, Sparkles, KeyRound, Clock, ShieldAlert, Cpu } from 'lucide-react';
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
  const [demoOtp, setDemoOtp] = useState(() => Math.floor(1000 + Math.random() * 9000).toString());
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errors, setErrors] = useState({});
  const [contactType, setContactType] = useState('email');
  const [resendTimer, setResendTimer] = useState(45);

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

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (step === 2 && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  const handleStep1Submit = (e) => {
    e.preventDefault();
    const newErrors = validateSignupStep1(formData, contactType);
    if (Object.keys(newErrors).length === 0) {
      setErrors({});
      setStep(2);
      setResendTimer(45);
      toast.info(`Verification code sent. Use code: ${demoOtp}`);
    } else {
      setErrors(newErrors);
    }
  };

  const handleResendOtp = () => {
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    setDemoOtp(newCode);
    setResendTimer(45);
    setOtp('');
    toast.success(`New verification code sent: ${newCode}`);
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
      toast.success('Account successfully registered! Please sign in to verify your session.');
      navigate('/login');
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

  const topLeftAction = step === 2 ? (
    <button 
      onClick={() => setStep(1)} 
      id="back-to-signup-btn"
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-muted hover:text-main transition-all cursor-pointer font-semibold text-xs sm:text-sm select-none" 
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
      title="Return to Registration Details"
    >
      <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1 text-primary" />
      <span>Back to registration</span>
    </button>
  ) : null;

  // Dedicated 2FA Security Telemetry Showcase for Step 2
  const verificationShowcase = (
    <div className="flex flex-col animate-fade-in w-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="minimal-badge" style={{ color: 'var(--minimal-indigo)', borderColor: 'rgba(99, 102, 241, 0.25)' }}>
          <ShieldCheck size={12} className="text-minimal-indigo" />
          <span>2FA SECURITY PROTOCOL</span>
        </span>
        <span className="text-muted" style={{ fontSize: '0.75rem' }}>· Hardware Enclave Verification</span>
      </div>

      <h2 
        className="text-gradient"
        style={{ fontSize: '2.15rem', fontWeight: 800, lineHeight: 1.22, letterSpacing: '-0.5px', marginBottom: '12px' }}
      >
        Two-Factor Identity Verification.
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '26px' }}>
        Multi-layer cryptographic challenge to authenticate your developer workstation and secure your roadmap telemetry.
      </p>

      {/* Security Telemetry Station Card */}
      <div 
        className="glass-panel skeuo-convex" 
        style={{ 
          borderRadius: '18px', 
          padding: '22px', 
          background: 'var(--skeuo-surface-card)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 18px 45px rgba(0, 0, 0, 0.22)'
        }}
      >
        <div className="flex justify-between items-center pb-3 mb-3.5" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-2">
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
            <span className="text-muted font-mono" style={{ fontSize: '0.74rem', marginLeft: '6px' }}>
              nexora://identity-security/session-gate
            </span>
          </div>
          <span className="minimal-badge font-mono" style={{ fontSize: '0.68rem', color: 'var(--minimal-emerald)' }}>
            ● CHALLENGE DISPATCHED
          </span>
        </div>

        {/* Security Checks List */}
        <div className="flex flex-col gap-2.5 mb-4">
          <div className="flex items-center justify-between p-2.5 px-3 rounded-lg" style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-minimal-emerald" />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Hardware TLS 1.3 Channel
              </span>
            </div>
            <span className="font-mono text-minimal-emerald" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
              ESTABLISHED
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 px-3 rounded-lg" style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-minimal-emerald" />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Target Recipient Handshake
              </span>
            </div>
            <span className="font-mono text-muted truncate max-w-[140px]" style={{ fontSize: '0.72rem' }}>
              {formData.contact || 'Verified'}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 px-3 rounded-lg" style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
            <div className="flex items-center gap-2">
              <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid var(--minimal-indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--minimal-indigo)' }} />
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                4-Digit TOTP Passcode Authorization
              </span>
            </div>
            <span className="font-mono text-minimal-indigo animate-pulse" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
              WAITING INPUT
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 px-3 rounded-lg" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-2">
              <Cpu size={15} className="text-muted" />
              <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                Engineering Workstation Sandbox
              </span>
            </div>
            <span className="font-mono text-muted" style={{ fontSize: '0.72rem' }}>
              QUEUED
            </span>
          </div>
        </div>

        {/* Security Summary Badge */}
        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-2 text-xs text-muted">
            <ShieldCheck size={14} className="text-minimal-indigo" />
            <span>Zero-Knowledge Proof Verification</span>
          </div>
          <span className="minimal-badge" style={{ fontSize: '0.68rem', color: 'var(--minimal-indigo)' }}>
            256-Bit E2EE
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <AuthLayout
      headline={step === 2 ? "Two-Factor Identity Verification." : "Engineered for High-Growth Tech Careers."}
      subtext={step === 2 ? "Multi-layer cryptographic challenge to authenticate your developer workstation and secure your roadmap telemetry." : "Join over 14,850+ engineers calibrating production systems, AI pipelines, and FAANG technical interviews."}
      badgeText={step === 2 ? "2FA SECURITY PROTOCOL" : "NEXORA CAREER PLATFORM"}
      badgeSub={step === 2 ? "· Hardware Enclave" : "· Verified Curriculum"}
      topLeftAction={topLeftAction}
      maxWidth={step === 2 ? "500px" : "480px"}
      customShowcase={step === 2 ? verificationShowcase : null}
    >
      {step === 1 && (
        <div className="w-full">
          <h1 className="text-gradient" style={{ fontSize: '2.1rem', fontWeight: 800, marginBottom: '6px', letterSpacing: '-0.5px' }}>
            Create Account
          </h1>
          <p className="text-muted" style={{ marginBottom: '20px', fontSize: '0.9rem' }}>
            Join NEXORA and calibrate your technical trajectory.
          </p>

          {/* Google Sign up */}
          <div style={{ marginBottom: '18px' }}>
            <GoogleAuthButton mode="signup" onSuccess={() => {
              toast.success('Google account verified! Proceeding to Complete Profile.');
              navigate('/complete-profile');
            }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>or register with email</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          </div>

          <form onSubmit={handleStep1Submit} className="w-full">

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

            <div className="mt-4 pt-3 flex items-center justify-between text-xs text-muted" style={{ borderTop: '1px solid var(--border-color)' }}>
              <span>⚡ Instant Access</span>
              <span>🔒 256-bit Encrypted</span>
              <span>🎓 Verified Paths</span>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-muted" style={{ fontSize: '0.88rem' }}>
              Already have an account?{' '}
              <span
                onClick={() => navigate('/login')}
                className="text-primary font-semibold interactive cursor-pointer hover:underline"
              >
                Log in
              </span>
            </p>
          </div>
        </div>
      )}

      {/* ── STEP 2: Dedicated High-Tech 2FA Security Station ── */}
      {step === 2 && (
        <div className="w-full animate-fade-in">
          <div>
            {/* Step Progress Bar Header */}
            <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div className="flex items-center gap-2">
                <span className="minimal-badge" style={{ fontSize: '0.72rem', color: 'var(--minimal-indigo)', padding: '3px 8px' }}>
                  STEP 2 OF 2
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Identity Challenge
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div style={{ width: 20, height: 4, borderRadius: 2, background: 'var(--minimal-emerald)' }} title="Step 1 Complete" />
                <div style={{ width: 20, height: 4, borderRadius: 2, background: 'var(--minimal-indigo)' }} title="Step 2 Active" />
              </div>
            </div>

            {/* Icon and Heading */}
            <div className="text-center mb-5">
              <div 
                className="mx-auto flex items-center justify-center mb-3"
                style={{ 
                  width: 52, 
                  height: 52, 
                  borderRadius: '50%', 
                  background: 'rgba(99, 102, 241, 0.12)', 
                  border: '1px solid rgba(99, 102, 241, 0.28)',
                  boxShadow: '0 0 20px rgba(99, 102, 241, 0.18)'
                }}
              >
                <ShieldCheck size={26} className="text-minimal-indigo" />
              </div>
              
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '4px', letterSpacing: '-0.5px' }}>
                Verify your {contactType === 'email' ? 'Email' : 'Phone'}
              </h2>
              
              <p className="text-muted" style={{ fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                We've dispatched a 4-digit security code to:
              </p>
              
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-lg flex-wrap justify-center" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
                <strong className="text-main font-mono text-xs sm:text-sm">{formData.contact}</strong>
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="text-primary hover:underline text-xs font-semibold cursor-pointer"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* 1-Click Passcode Helper */}
            <div 
              className="flex items-center justify-between p-2.5 px-3.5 rounded-xl mb-5" 
              style={{ 
                background: 'var(--input-bg)', 
                border: '1px solid var(--border-color)'
              }}
            >
              <div className="flex items-center gap-2">
                <KeyRound size={15} className="text-primary" />
                <span className="text-xs text-muted">Test Passcode:</span>
                <span className="font-mono font-bold tracking-widest text-sm text-main">{demoOtp}</span>
              </div>
              <button 
                type="button" 
                onClick={() => setOtp(demoOtp)}
                className="px-3 py-1 rounded-lg text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-95 cursor-pointer" 
                style={{ background: 'var(--primary)' }}
              >
                Use Code
              </button>
            </div>

            {!isVerifying ? (
              <form onSubmit={handleVerifyOTP} className="w-full">
                <div className="mb-5 text-center">
                  <label className="block mb-2 text-xs font-semibold text-muted uppercase tracking-wider">
                    Enter 4-Digit Security Code
                  </label>
                  
                  {/* High-Contrast Segmented Code Input */}
                  <div className="relative max-w-[280px] mx-auto">
                    <input
                      type="text"
                      className="input-field text-center font-mono"
                      autoComplete="one-time-code"
                      style={{ 
                        fontSize: '1.8rem', 
                        letterSpacing: '0.75rem', 
                        fontWeight: 700, 
                        borderRadius: 'var(--radius-md)',
                        padding: '12px 14px',
                        background: 'var(--input-bg)',
                        border: errors.otp ? '1px solid var(--secondary)' : '1px solid var(--border-color)',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)'
                      }}
                      placeholder="••••"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setOtp(val);
                        if (errors.otp) setErrors({});
                      }}
                      required
                    />
                  </div>
                  
                  {errors.otp && (
                    <span className="text-secondary text-center block mt-1.5" style={{ fontSize: '0.8rem' }}>
                      {errors.otp}
                    </span>
                  )}
                </div>

                {/* Primary Action Button */}
                <button 
                  type="submit" 
                  id="verify-code-btn"
                  className="btn btn-primary w-full flex items-center justify-center gap-2 mb-2.5"
                  style={{ padding: '12px', fontSize: '0.92rem', borderRadius: 'var(--radius-md)' }}
                >
                  <ShieldCheck size={18} />
                  <span>Verify &amp; Create Account</span>
                </button>

                {/* Quick Instant Access Button */}
                <button
                  type="button"
                  onClick={completeAccountCreation}
                  className="btn btn-secondary w-full mb-3"
                  style={{ fontSize: '0.84rem', padding: '9px' }}
                >
                  Instant Access (Skip Verification)
                </button>

                {/* Resend Code Countdown & Trigger */}
                <div className="flex items-center justify-center gap-1.5 text-xs text-muted pt-2" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <Clock size={13} />
                  {resendTimer > 0 ? (
                    <span>Resend code in <strong className="text-main font-mono">{resendTimer}s</strong></span>
                  ) : (
                    <button 
                      type="button" 
                      onClick={handleResendOtp}
                      className="text-primary hover:underline font-semibold cursor-pointer"
                    >
                      Resend code now
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 animate-fade-in text-center">
                <div style={{ width: 44, height: 44, border: '3px solid var(--border-color)', borderTopColor: 'var(--minimal-indigo)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <h3 className="mt-3.5 font-bold text-minimal-indigo" style={{ fontSize: '1.05rem' }}>Securing your account...</h3>
                <p className="text-muted text-center mt-1" style={{ fontSize: '0.84rem' }}>
                  Provisioning your personalized curriculum workstation &amp; sandboxes.
                </p>
              </div>
            )}
          </div>

          {/* Verification Page Trust Strip */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-muted text-center">
            <span>🔒 End-to-End Encrypted</span>
            <span className="hidden sm:inline">•</span>
            <span>⚡ Instant Workspace Activation</span>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
