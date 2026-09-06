import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowRight, ArrowLeft, ShieldCheck, Mail, Clock, RotateCw } from 'lucide-react';
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
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const otpInputRefs = useRef([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errors, setErrors] = useState({});
  const [contactType, setContactType] = useState('email');
  const [resendTimer, setResendTimer] = useState(35);

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
      setResendTimer(35);
      setOtpDigits(['', '', '', '']);
      setOtp('');
      toast.info(`Verification code sent. Use code: ${demoOtp}`);
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    } else {
      setErrors(newErrors);
    }
  };

  const handleResendOtp = () => {
    if (isResending || resendTimer > 0) return;
    setIsResending(true);
    setTimeout(() => {
      const newCode = Math.floor(1000 + Math.random() * 9000).toString();
      setDemoOtp(newCode);
      setResendTimer(35);
      setOtpDigits(['', '', '', '']);
      setOtp('');
      setIsResending(false);
      toast.success(`New verification code dispatched: ${newCode}`);
      otpInputRefs.current[0]?.focus();
    }, 500);
  };

  const completeAccountCreation = async () => {
    setIsVerifying(true);
    
    // Register authenticated session in local DB immediately
    try {
      db.signup(formData, contactType);
    } catch (err) {
      console.error('Error establishing local session:', err);
    }
    
    // Broadcast authenticated session to workstation
    window.dispatchEvent(new Event('user_session_changed'));

    // Asynchronously synchronize with Firebase Auth if email
    if (contactType === 'email') {
      try {
        firebaseAuth.signupWithEmail(formData.contact, formData.password).catch(() => {});
      } catch {
        // Handled locally
      }
    }

    setTimeout(() => {
      setIsVerifying(false);
      toast.success('Account successfully verified! Welcome to NEXORA.');
      const cur = db.getCurrentUser();
      if (!cur?.profileCompleted) {
        navigate('/complete-profile');
      } else {
        navigate('/dashboard');
      }
    }, 400);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    const entered = otpDigits.join('');
    if (entered.length === 4) {
      completeAccountCreation();
    } else {
      setErrors({ otp: 'Please enter all 4 digits of your security code.' });
      const firstEmpty = otpDigits.findIndex(d => !d);
      if (firstEmpty !== -1) {
        otpInputRefs.current[firstEmpty]?.focus();
      }
    }
  };

  const handleOtpChange = (index, e) => {
    const rawValue = e.target.value;
    const cleaned = rawValue.replace(/[^0-9]/g, '');
    const newDigits = [...otpDigits];

    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, 4).split('');
      for (let i = 0; i < 4; i++) {
        newDigits[i] = chars[i] || '';
      }
      setOtpDigits(newDigits);
      setOtp(newDigits.join(''));
      const nextIdx = Math.min(chars.length, 3);
      otpInputRefs.current[nextIdx]?.focus();
    } else {
      newDigits[index] = cleaned;
      setOtpDigits(newDigits);
      setOtp(newDigits.join(''));

      if (cleaned && index < 3) {
        otpInputRefs.current[index + 1]?.focus();
      }
    }

    if (errors.otp) {
      setErrors(prev => ({ ...prev, otp: '' }));
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (otpDigits[index]) {
        const newDigits = [...otpDigits];
        newDigits[index] = '';
        setOtpDigits(newDigits);
        setOtp(newDigits.join(''));
      } else if (index > 0) {
        e.preventDefault();
        const newDigits = [...otpDigits];
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
        setOtp(newDigits.join(''));
        otpInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      e.preventDefault();
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedText = clipboardData?.getData('text') || '';
    const digitsOnly = pastedText.replace(/[^0-9]/g, '').slice(0, 4);
    if (!digitsOnly) return;

    const newDigits = ['', '', '', ''];
    for (let i = 0; i < digitsOnly.length; i++) {
      newDigits[i] = digitsOnly[i];
    }
    setOtpDigits(newDigits);
    setOtp(digitsOnly);
    if (errors.otp) {
      setErrors(prev => ({ ...prev, otp: '' }));
    }

    const nextIdx = digitsOnly.length < 4 ? digitsOnly.length : 3;
    otpInputRefs.current[nextIdx]?.focus();
  };

  const topLeftAction = step === 2 ? (
    <button 
      onClick={() => setStep(1)} 
      id="back-to-signup-btn"
      className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-main transition-colors cursor-pointer"
      title="Return to Registration Details"
    >
      <ArrowLeft size={15} className="text-primary" />
      <span>Back to registration</span>
    </button>
  ) : null;

  return (
    <AuthLayout
      headline="Calibrate Your Engineering Trajectory."
      subtext="Join over 14,850+ ambitious engineers mastering production systems, AI pipelines, and FAANG interviews."
      badgeText="NEXORA CAREER PLATFORM"
      badgeSub="· Verified Trajectory"
      topLeftAction={topLeftAction}
      maxWidth={step === 2 ? "440px" : "460px"}
    >
      {/* ── STEP 1: Registration Form ── */}
      {step === 1 && (
        <div className="w-full">
          <div className="mb-6">
            <h1 className="text-gradient text-3xl font-extrabold tracking-tight mb-2">
              Create an Account
            </h1>
            <p className="text-muted text-sm leading-relaxed">
              Join NEXORA to engineer and calibrate your technical trajectory.
            </p>
          </div>

          {/* Google Sign up */}
          <div className="mb-5">
            <GoogleAuthButton mode="signup" onSuccess={() => {
              toast.success('Google account verified! Proceeding to Complete Profile.');
              navigate('/complete-profile');
            }} />
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-[1px]" style={{ background: 'var(--border-color)' }} />
            <span className="text-[11px] text-muted uppercase tracking-widest font-medium">or register with</span>
            <div className="flex-1 h-[1px]" style={{ background: 'var(--border-color)' }} />
          </div>

          {/* Contact Type Toggle */}
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

          <form onSubmit={handleStep1Submit} className="w-full flex flex-col gap-4">
            {/* Contact Details */}
            <div className="input-group mb-0">
              <label className="input-label mb-1.5 font-medium text-xs tracking-wide">
                {contactType === 'email' ? 'Email Address' : 'Phone Number'}
              </label>

              {contactType === 'email' ? (
                <IconInput
                  icon={<Mail size={17} />}
                  type="email"
                  placeholder="name@company.com"
                  error={!!errors.contact}
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  required
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
                <span className="text-secondary text-xs font-medium block mt-1.5">{errors.contact}</span>
              )}
            </div>

            {/* Password */}
            <div className="input-group mb-0">
              <label className="input-label mb-1.5 font-medium text-xs tracking-wide">Create Password</label>
              <IconInput
                icon={<Lock size={17} />}
                type="password"
                showToggle
                placeholder="At least 6 characters"
                error={!!errors.password}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              {errors.password && <span className="text-secondary text-xs font-medium block mt-1.5">{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="input-group mb-1">
              <label className="input-label mb-1.5 font-medium text-xs tracking-wide">Confirm Password</label>
              <IconInput
                icon={<Lock size={17} />}
                type="password"
                showToggle
                placeholder="Repeat your password"
                error={!!errors.confirmPassword}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
              {errors.confirmPassword && (
                <span className="text-secondary text-xs font-medium block mt-1.5">{errors.confirmPassword}</span>
              )}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full flex items-center justify-center gap-2 mt-2 cursor-pointer"
              style={{ padding: '13px', fontSize: '0.94rem', borderRadius: 'var(--radius-md)' }}
            >
              <span>Continue to verification</span>
              <ArrowRight size={17} />
            </button>
          </form>

          <div className="text-center mt-6 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
            <p className="text-muted text-xs sm:text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* ── STEP 2: Dedicated Clean Verification Screen ── */}
      {step === 2 && (
        <div className="w-full animate-fade-in text-center">
          {/* Subtle 2FA Badge */}
          <div 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4 mx-auto"
            style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--minimal-indigo)', border: '1px solid rgba(99, 102, 241, 0.2)' }}
          >
            <ShieldCheck size={13} />
            <span>Two-Factor Authentication</span>
          </div>

          <h1 className="text-gradient text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Verify your {contactType === 'email' ? 'Email' : 'Phone'}
          </h1>
          
          <p className="text-muted text-xs sm:text-sm max-w-sm mx-auto mb-4 leading-relaxed">
            We've dispatched a 4-digit verification code to:
          </p>
          
          {/* Recipient pill with clean edit option */}
          <div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl mb-6 mx-auto" 
            style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}
          >
            <span className="font-mono text-xs sm:text-sm font-semibold text-main">{formData.contact}</span>
            <button 
              type="button" 
              onClick={() => setStep(1)}
              className="text-primary hover:underline text-xs font-semibold cursor-pointer ml-1"
            >
              Change
            </button>
          </div>

          {!isVerifying ? (
            <form onSubmit={handleVerifyOTP} className="w-full flex flex-col items-center">
              {/* Centered 4-Box Segmented Code Input */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    id={`otp-box-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    maxLength={index === 0 ? 4 : 1}
                    value={otpDigits[index]}
                    onChange={(e) => handleOtpChange(index, e)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    className="text-center font-mono font-bold text-main transition-all duration-200"
                    style={{
                      width: '58px',
                      height: '66px',
                      fontSize: '1.85rem',
                      borderRadius: '14px',
                      background: otpDigits[index] ? 'rgba(99, 102, 241, 0.08)' : 'var(--input-bg)',
                      border: errors.otp 
                        ? '1.5px solid var(--secondary)' 
                        : otpDigits[index] 
                          ? '1.5px solid var(--primary)' 
                          : '1px solid var(--border-color)',
                      boxShadow: otpDigits[index] ? '0 0 16px rgba(99, 102, 241, 0.2)' : 'none',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary)';
                      e.target.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.25), 0 0 20px rgba(99, 102, 241, 0.25)';
                      e.target.select();
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.otp 
                        ? 'var(--secondary)' 
                        : otpDigits[index] 
                          ? 'var(--primary)' 
                          : 'var(--border-color)';
                      e.target.style.boxShadow = otpDigits[index] ? '0 0 16px rgba(99, 102, 241, 0.2)' : 'none';
                    }}
                  />
                ))}
              </div>
              
              {errors.otp && (
                <span role="alert" className="text-secondary text-xs font-medium block mb-4">
                  {errors.otp}
                </span>
              )}

              {/* Primary Verification Button */}
              <button 
                type="submit" 
                id="verify-code-btn"
                className="btn btn-primary w-full flex items-center justify-center gap-2 mb-5 cursor-pointer"
                style={{ padding: '13px', fontSize: '0.94rem', borderRadius: 'var(--radius-md)' }}
              >
                <ShieldCheck size={18} />
                <span>Verify &amp; Create Account</span>
              </button>

              {/* Clean Resend Countdown / Trigger */}
              <div className="flex items-center justify-center text-xs text-muted min-h-[36px]">
                {resendTimer > 0 ? (
                  <div className="inline-flex items-center gap-1.5 text-muted">
                    <Clock size={13} />
                    <span>Didn't receive code? Resend in <strong className="text-main font-mono">{resendTimer}s</strong></span>
                  </div>
                ) : (
                  <button 
                    type="button" 
                    id="resend-otp-btn"
                    onClick={handleResendOtp}
                    disabled={isResending}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-primary hover:bg-primary/10 transition-all cursor-pointer"
                    style={{ border: '1px solid rgba(99, 102, 241, 0.3)', background: 'rgba(99, 102, 241, 0.06)' }}
                  >
                    {isResending ? (
                      <>
                        <div className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        <span>Dispatching new OTP...</span>
                      </>
                    ) : (
                      <>
                        <RotateCw size={13} />
                        <span>Resend verification code</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 animate-fade-in text-center">
              <div style={{ width: 44, height: 44, border: '3px solid var(--border-color)', borderTopColor: 'var(--minimal-indigo)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <h3 className="mt-4 font-bold text-minimal-indigo" style={{ fontSize: '1.05rem' }}>Verifying your credentials...</h3>
              <p className="text-muted text-center mt-1" style={{ fontSize: '0.84rem' }}>
                Setting up your personalized engineering workstation.
              </p>
            </div>
          )}
        </div>
      )}
    </AuthLayout>
  );
}
