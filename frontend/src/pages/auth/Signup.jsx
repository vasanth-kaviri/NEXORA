import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowRight, ArrowLeft, ShieldCheck, Mail, Phone, RotateCw, CheckCircle2, MessageSquare } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import CountryCodePicker from '../../components/common/CountryCodePicker';
import IconInput from '../../components/common/IconInput';
import GoogleAuthButton from '../../components/common/GoogleAuthButton';
import { useCountryCodes } from '../../hooks/useCountryCodes';
import { validateEmail, validatePhone, validatePassword } from '../../utils/validators';
import authService from '../../services/authService';
import otpService from '../../services/otpService';
import { useToast } from '../../contexts/ToastContext';

/**
 * Signup Page
 * Clean, senior-level registration flow with:
 * 1. Explicit Auth Method Separation: 'Continue with Email' vs 'Continue with Phone'
 * 2. Dedicated Email Verification flow with simulated inbox activation link
 * 3. Dedicated Phone OTP verification flow with country codes and WhatsApp fallback
 * 4. Isolated state hooks preventing cross-contamination of validation errors
 * 5. Strict Verification Lock: accounts are verified before granting workspace access
 */
export default function Signup() {
  const navigate = useNavigate();
  const toast = useToast();

  // Step 1: Registration Form, Step 2: Verification Screen
  const [step, setStep] = useState(1);
  const [authMethod, setAuthMethod] = useState('email'); // 'email' | 'phone'

  // Isolated state for Email registration
  const [emailForm, setEmailForm] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [emailErrors, setEmailErrors] = useState({});

  // Isolated state for Phone registration
  const [phoneForm, setPhoneForm] = useState({
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [phoneErrors, setPhoneErrors] = useState({});

  // Verification step state
  const [registeredUserId, setRegisteredUserId] = useState(null);
  const [registeredContact, setRegisteredContact] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(45);
  const [phoneChannel, setPhoneChannel] = useState('sms'); // 'sms' | 'whatsapp'
  const otpInputRefs = useRef([]);

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

  // Countdown timer for resending code
  useEffect(() => {
    let timer;
    if (step === 2 && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  // Tab switcher: cleanly reset errors when switching tabs
  const handleSwitchAuthMethod = (method) => {
    setAuthMethod(method);
    setEmailErrors({});
    setPhoneErrors({});
    setOtpError('');
    setShowCountryMenu(false);
  };

  // ── STEP 1: VALIDATION & DISPATCH ──────────────────────────────────────────
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    // 1. Email format check
    const emailCheck = validateEmail(emailForm.email);
    if (!emailCheck.isValid) {
      errors.email = emailCheck.error;
    }

    // 2. Password check
    const pwdCheck = validatePassword(emailForm.password);
    if (!pwdCheck.isValid) {
      errors.password = pwdCheck.error || 'Password must be at least 6 characters.';
    }

    // 3. Confirm password check
    if (emailForm.password !== emailForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(errors).length > 0) {
      setEmailErrors(errors);
      return;
    }

    setEmailErrors({});
    setIsResending(true);

    try {
      // Strips confirmPassword, dispatches email registration to backend
      const res = await authService.signup({
        contact: emailForm.email.trim(),
        password: emailForm.password,
        contactType: 'email'
      });
      setIsResending(false);
      if (res.success) {
        setRegisteredUserId(res.data?.userId || null);
        setRegisteredContact(res.data?.email || emailForm.email.trim());
        setStep(2);
        setResendTimer(45);
        setOtpDigits(['', '', '', '', '', '']);
        setOtpError('');
        toast.info(res.message || `Activation code dispatched to ${emailForm.email.trim()}`);
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 150);
      } else {
        toast.error(res.error || 'Could not send activation instructions.');
      }
    } catch (err) {
      setIsResending(false);
      toast.error(err.message || 'Error requesting verification code.');
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    // 1. Phone number check
    const phoneCheck = validatePhone(phoneForm.phone, countryCode);
    if (!phoneCheck.isValid) {
      errors.phone = phoneCheck.error;
    }

    // 2. Password check
    const pwdCheck = validatePassword(phoneForm.password);
    if (!pwdCheck.isValid) {
      errors.password = pwdCheck.error || 'Password must be at least 6 characters.';
    }

    // 3. Confirm password check
    if (phoneForm.password !== phoneForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(errors).length > 0) {
      setPhoneErrors(errors);
      return;
    }

    setPhoneErrors({});
    setIsResending(true);

    try {
      // Strips confirmPassword, dispatches phone registration to backend
      const res = await authService.signup({
        contact: phoneForm.phone.trim(),
        password: phoneForm.password,
        contactType: 'phone',
        extraData: { countryCode, channel: phoneChannel }
      });
      setIsResending(false);
      if (res.success) {
        setRegisteredUserId(res.data?.userId || null);
        const fullCleanPhone = res.data?.phone || `${countryCode}${phoneForm.phone.trim().replace(/\D/g, '')}`;
        setRegisteredContact(fullCleanPhone);
        setStep(2);
        setResendTimer(45);
        setOtpDigits(['', '', '', '', '', '']);
        setOtpError('');
        toast.info(res.message || `Verification code dispatched to ${countryCode} ${phoneForm.phone}`);
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 150);
      } else {
        toast.error(res.error || 'Could not send verification code.');
      }
    } catch (err) {
      setIsResending(false);
      toast.error(err.message || 'Error requesting verification code.');
    }
  };

  // ── RESEND OTP / INSTRUCTIONS ─────────────────────────────────────────────
  const handleResendCode = async (channel = phoneChannel) => {
    if (isResending || resendTimer > 0) return;
    setIsResending(true);

    const contact = registeredContact || (authMethod === 'email' ? emailForm.email.trim() : `${countryCode}${phoneForm.phone.trim().replace(/\D/g, '')}`);
    try {
      const res = await authService.resendOtp({ contact, userId: registeredUserId, channel });
      setIsResending(false);

      if (res.success) {
        setResendTimer(45);
        setOtpDigits(['', '', '', '', '', '']);
        setOtpError('');
        toast.success(res.message || 'New verification code dispatched.');
        otpInputRefs.current[0]?.focus();
      } else {
        toast.error(res.message || res.error || 'Failed to resend code.');
      }
    } catch (err) {
      setIsResending(false);
      toast.error(err.message || 'Failed to resend code.');
    }
  };

  // ── STEP 2: VERIFICATION & ACCOUNT ACTIVATION ─────────────────────────────
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const entered = otpDigits.join('');
    if (entered.length < 6) {
      setOtpError('Please enter all 6 digits of your security code.');
      const firstEmpty = otpDigits.findIndex(d => !d);
      if (firstEmpty !== -1) otpInputRefs.current[firstEmpty]?.focus();
      return;
    }

    setIsVerifying(true);
    const isEmail = authMethod === 'email';
    const contact = registeredContact || (isEmail ? emailForm.email.trim() : `${countryCode}${phoneForm.phone.trim().replace(/\D/g, '')}`);

    try {
      const check = await authService.verifyOtp({ contact, userId: registeredUserId, otp: entered });
      setIsVerifying(false);

      if (!check.success) {
        setOtpError(check.error || 'Invalid verification code.');
        toast.error(check.error || 'Invalid verification code.');
        return;
      }

      toast.success('Account successfully verified! Welcome to NEXORA.');
      const cur = authService.getCurrentUser();
      if (!cur?.profileCompleted) {
        navigate('/complete-profile');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setIsVerifying(false);
      setOtpError(err.message || 'Verification failed.');
      toast.error(err.message || 'Verification failed.');
    }
  };

  // OTP Box keyboard handler
  const handleOtpChange = (index, e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    const newDigits = [...otpDigits];

    if (rawValue.length > 1) {
      const chars = rawValue.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newDigits[i] = chars[i] || '';
      }
      setOtpDigits(newDigits);
      const nextIdx = Math.min(chars.length, 5);
      otpInputRefs.current[nextIdx]?.focus();
    } else {
      newDigits[index] = rawValue;
      setOtpDigits(newDigits);
      if (rawValue && index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }
    }

    if (otpError) setOtpError('');
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (otpDigits[index]) {
        const newDigits = [...otpDigits];
        newDigits[index] = '';
        setOtpDigits(newDigits);
      } else if (index > 0) {
        e.preventDefault();
        const newDigits = [...otpDigits];
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
        otpInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData?.getData('text') || '';
    const digitsOnly = pastedText.replace(/[^0-9]/g, '').slice(0, 6);
    if (!digitsOnly) return;

    const newDigits = ['', '', '', '', '', ''];
    for (let i = 0; i < digitsOnly.length; i++) {
      newDigits[i] = digitsOnly[i];
    }
    setOtpDigits(newDigits);
    if (otpError) setOtpError('');
    const nextIdx = digitsOnly.length < 6 ? digitsOnly.length : 5;
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

          {/* Explicit Auth Method Separation: Two distinct tabs */}
          <div className="flex p-1 rounded-xl mb-5" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
            <button
              type="button"
              id="signup-tab-email"
              onClick={() => handleSwitchAuthMethod('email')}
              className="flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
              style={{
                background: authMethod === 'email' ? 'var(--minimal-indigo, #6366f1)' : 'transparent',
                color: authMethod === 'email' ? '#ffffff' : 'var(--text-muted)',
                boxShadow: authMethod === 'email' ? '0 2px 10px rgba(99, 102, 241, 0.35)' : 'none'
              }}
            >
              <Mail size={14} />
              <span>Continue with Email</span>
            </button>
            <button
              type="button"
              id="signup-tab-phone"
              onClick={() => handleSwitchAuthMethod('phone')}
              className="flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
              style={{
                background: authMethod === 'phone' ? 'var(--minimal-indigo, #6366f1)' : 'transparent',
                color: authMethod === 'phone' ? '#ffffff' : 'var(--text-muted)',
                boxShadow: authMethod === 'phone' ? '0 2px 10px rgba(99, 102, 241, 0.35)' : 'none'
              }}
            >
              <Phone size={14} />
              <span>Continue with Phone</span>
            </button>
          </div>

          {/* ── EMAIL REGISTRATION FORM ── */}
          {authMethod === 'email' && (
            <form onSubmit={handleEmailSubmit} className="w-full flex flex-col gap-4 animate-fade-in" noValidate>
              <div className="input-group mb-0">
                <label className="input-label mb-1.5 font-medium text-xs tracking-wide">
                  Email Address
                </label>
                <IconInput
                  icon={<Mail size={17} />}
                  type="email"
                  placeholder="name@company.com"
                  error={!!emailErrors.email}
                  value={emailForm.email}
                  onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                  required
                />
                {emailErrors.email && (
                  <span role="alert" className="text-secondary text-xs font-medium block mt-1.5">{emailErrors.email}</span>
                )}
              </div>

              <div className="input-group mb-0">
                <label className="input-label mb-1.5 font-medium text-xs tracking-wide">
                  Create Password
                </label>
                <IconInput
                  icon={<Lock size={17} />}
                  type="password"
                  showToggle
                  placeholder="Minimum 6 characters"
                  error={!!emailErrors.password}
                  value={emailForm.password}
                  onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                  required
                />
                {emailErrors.password && (
                  <span role="alert" className="text-secondary text-xs font-medium block mt-1.5">{emailErrors.password}</span>
                )}
              </div>

              <div className="input-group mb-1">
                <label className="input-label mb-1.5 font-medium text-xs tracking-wide">
                  Confirm Password
                </label>
                <IconInput
                  icon={<Lock size={17} />}
                  type="password"
                  showToggle
                  placeholder="Re-enter password"
                  error={!!emailErrors.confirmPassword}
                  value={emailForm.confirmPassword}
                  onChange={(e) => setEmailForm({ ...emailForm, confirmPassword: e.target.value })}
                  required
                />
                {emailErrors.confirmPassword && (
                  <span role="alert" className="text-secondary text-xs font-medium block mt-1.5">{emailErrors.confirmPassword}</span>
                )}
              </div>

              <button 
                type="submit" 
                id="signup-submit-email-btn"
                disabled={isResending}
                className="btn btn-primary w-full flex items-center justify-center gap-2 mt-2 cursor-pointer py-3"
                style={{ borderRadius: 'var(--radius-md)', fontSize: '0.94rem' }}
              >
                {isResending ? (
                  <>
                    <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <span>Preparing Verification...</span>
                  </>
                ) : (
                  <>
                    <span>Continue with Email</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ── PHONE REGISTRATION FORM ── */}
          {authMethod === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="w-full flex flex-col gap-4 animate-fade-in" noValidate>
              <div className="input-group mb-0">
                <label className="input-label mb-1.5 font-medium text-xs tracking-wide">
                  Phone Number
                </label>
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
                    error={!!phoneErrors.phone}
                  />
                  <input
                    type="tel"
                    maxLength={countryCodes.find(c => c.code === countryCode)?.maxLength || 15}
                    className="input-field flex-1 min-w-0"
                    style={{ flex: 1, minWidth: 0, borderColor: phoneErrors.phone ? 'var(--secondary)' : '' }}
                    placeholder="234 567 8900"
                    value={phoneForm.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setPhoneForm({ ...phoneForm, phone: val });
                    }}
                    required
                  />
                </div>
                {phoneErrors.phone && (
                  <span role="alert" className="text-secondary text-xs font-medium block mt-1.5">{phoneErrors.phone}</span>
                )}
              </div>

              <div className="input-group mb-0">
                <label className="input-label mb-1.5 font-medium text-xs tracking-wide">
                  Create Password
                </label>
                <IconInput
                  icon={<Lock size={17} />}
                  type="password"
                  showToggle
                  placeholder="Minimum 6 characters"
                  error={!!phoneErrors.password}
                  value={phoneForm.password}
                  onChange={(e) => setPhoneForm({ ...phoneForm, password: e.target.value })}
                  required
                />
                {phoneErrors.password && (
                  <span role="alert" className="text-secondary text-xs font-medium block mt-1.5">{phoneErrors.password}</span>
                )}
              </div>

              <div className="input-group mb-1">
                <label className="input-label mb-1.5 font-medium text-xs tracking-wide">
                  Confirm Password
                </label>
                <IconInput
                  icon={<Lock size={17} />}
                  type="password"
                  showToggle
                  placeholder="Re-enter password"
                  error={!!phoneErrors.confirmPassword}
                  value={phoneForm.confirmPassword}
                  onChange={(e) => setPhoneForm({ ...phoneForm, confirmPassword: e.target.value })}
                  required
                />
                {phoneErrors.confirmPassword && (
                  <span role="alert" className="text-secondary text-xs font-medium block mt-1.5">{phoneErrors.confirmPassword}</span>
                )}
              </div>

              <button 
                type="submit" 
                id="signup-submit-phone-btn"
                disabled={isResending}
                className="btn btn-primary w-full flex items-center justify-center gap-2 mt-2 cursor-pointer py-3"
                style={{ borderRadius: 'var(--radius-md)', fontSize: '0.94rem' }}
              >
                {isResending ? (
                  <>
                    <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <span>Dispatching OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Continue with Phone</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>
          )}

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

      {/* ── STEP 2: Dedicated Verification Screen ── */}
      {step === 2 && (
        <div className="w-full animate-fade-in text-center">
          {/* Subtle Security Badge */}
          <div 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4 mx-auto"
            style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--minimal-indigo)', border: '1px solid rgba(99, 102, 241, 0.2)' }}
          >
            <ShieldCheck size={13} />
            <span>{authMethod === 'email' ? 'Email Activation' : 'Two-Factor Authentication'}</span>
          </div>

          <h1 className="text-gradient text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Verify your {authMethod === 'email' ? 'Email Address' : 'Phone Number'}
          </h1>
          
          <p className="text-muted text-xs sm:text-sm max-w-sm mx-auto mb-4 leading-relaxed">
            {authMethod === 'email' 
              ? 'We have dispatched an activation link & 6-digit confirmation code to:'
              : 'We have dispatched a 6-digit one-time code to:'}
          </p>
          
          {/* Recipient pill with clean edit option */}
          <div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl mb-6 mx-auto" 
            style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}
          >
            <span className="font-mono text-xs sm:text-sm font-semibold text-main">
              {authMethod === 'email' ? emailForm.email : `${countryCode} ${phoneForm.phone}`}
            </span>
            <button 
              type="button" 
              onClick={() => setStep(1)}
              className="text-primary hover:underline text-xs font-semibold cursor-pointer ml-1"
            >
              Change
            </button>
          </div>

          {/* WhatsApp / SMS Channel selector for Phone */}
          {authMethod === 'phone' && (
            <div className="flex justify-center gap-2 mb-5">
              <button
                type="button"
                onClick={() => { setPhoneChannel('sms'); handleResendCode('sms'); }}
                className="text-[11px] font-medium px-3 py-1 rounded-lg border transition-all cursor-pointer"
                style={{
                  background: phoneChannel === 'sms' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  borderColor: phoneChannel === 'sms' ? 'var(--minimal-indigo)' : 'var(--border-color)',
                  color: phoneChannel === 'sms' ? 'var(--minimal-indigo)' : 'var(--text-muted)'
                }}
              >
                SMS Code
              </button>
              <button
                type="button"
                onClick={() => { setPhoneChannel('whatsapp'); handleResendCode('whatsapp'); }}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-3 py-1 rounded-lg border transition-all cursor-pointer"
                style={{
                  background: phoneChannel === 'whatsapp' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  borderColor: phoneChannel === 'whatsapp' ? 'var(--minimal-emerald)' : 'var(--border-color)',
                  color: phoneChannel === 'whatsapp' ? 'var(--minimal-emerald)' : 'var(--text-muted)'
                }}
              >
                <MessageSquare size={12} />
                <span>WhatsApp Fallback</span>
              </button>
            </div>
          )}

          {/* OTP Verification Input Form */}
          <form onSubmit={handleVerifyOTP} className="w-full flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 w-full max-w-[340px]">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  ref={(el) => (otpInputRefs.current[index] = el)}
                  id={`otp-box-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={otpDigits[index]}
                  onChange={(e) => handleOtpChange(index, e)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={handleOtpPaste}
                  autoFocus={index === 0}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-mono font-bold rounded-xl transition-all"
                  style={{
                    background: 'var(--input-bg)',
                    border: otpError ? '1.5px solid var(--secondary)' : (otpDigits[index] ? '1.5px solid var(--primary)' : '1px solid var(--border-color)'),
                    color: 'var(--text-main)',
                    boxShadow: otpDigits[index] ? '0 0 12px rgba(99, 102, 241, 0.2)' : 'none',
                    outline: 'none'
                  }}
                />
              ))}
            </div>

            {otpError && (
              <span role="alert" className="text-secondary text-xs font-medium block mb-4">
                {otpError}
              </span>
            )}

            <button
              type="submit"
              id="verify-otp-btn"
              disabled={isVerifying}
              className="btn btn-primary w-full flex items-center justify-center gap-2 py-3 cursor-pointer"
              style={{ borderRadius: 'var(--radius-md)', fontSize: '0.94rem' }}
            >
              {isVerifying ? (
                <>
                  <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  <span>Verifying &amp; Activating...</span>
                </>
              ) : (
                <>
                  <span>Verify &amp; Create Account</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Email Flow Simulated Link Shortcut */}
          {authMethod === 'email' && (
            <div className="mt-4 p-3 rounded-xl text-left" style={{ background: 'rgba(99, 102, 241, 0.06)', border: '1px dashed rgba(99, 102, 241, 0.25)' }}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted">Dev / Test: Click inbox link simulation</span>
                <button
                  type="button"
                  onClick={completeAccountCreationAndActivation}
                  className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline cursor-pointer"
                >
                  <CheckCircle2 size={13} />
                  <span>Simulate Link Click</span>
                </button>
              </div>
            </div>
          )}

          {/* Resend Actions */}
          <div className="mt-6 flex flex-col items-center gap-2">
            {resendTimer > 0 ? (
              <p className="text-muted text-xs">
                Resend available in <strong className="font-mono text-main">{resendTimer}s</strong>
              </p>
            ) : (
              <button
                type="button"
                onClick={() => handleResendCode(phoneChannel)}
                disabled={isResending}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                <RotateCw size={13} className={isResending ? 'animate-spin' : ''} />
                <span>Resend Verification Code</span>
              </button>
            )}
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
