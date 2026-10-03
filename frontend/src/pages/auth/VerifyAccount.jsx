import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, ArrowRight, RotateCw, LogOut, CheckCircle2, MessageSquare } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import authService from '../../services/authService';
import { useToast } from '../../contexts/ToastContext';

/**
 * VerifyAccount Page
 * Enforces Checkpoint 2 (Signup & Verification Lock).
 * Unverified accounts are strictly restricted here until email/phone OTP verification is completed.
 */
export default function VerifyAccount() {
  const navigate = useNavigate();
  const toast = useToast();
  const currentUser = authService.getCurrentUser();

  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(45);
  const [error, setError] = useState('');
  const [channel, setChannel] = useState('sms'); // 'sms' | 'whatsapp' for phone
  const otpInputRefs = useRef([]);

  const [debugCode, setDebugCode] = useState(() => {
    try {
      return sessionStorage.getItem('nexora_active_debug_otp') || '';
    } catch {
      return '';
    }
  });

  const handleAutoFill = (codeToFill = debugCode || '123456') => {
    const chars = String(codeToFill).trim().slice(0, 6).split('');
    const newDigits = ['', '', '', '', '', ''];
    chars.forEach((c, i) => { newDigits[i] = c; });
    setOtpDigits(newDigits);
    otpInputRefs.current[5]?.focus();
    toast.success('Verification code auto-filled.');
  };

  const isEmail = Boolean(currentUser?.email && !currentUser?.email.includes('@phone.nexora.ai'));
  const contactDisplay = isEmail 
    ? currentUser?.email 
    : (currentUser?.phone || currentUser?.email?.replace('@phone.nexora.ai', '') || 'your registered contact');

  // If already verified, immediately redirect to dashboard
  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { replace: true });
    } else if (currentUser.isVerified) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  // Resend Countdown
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleOtpChange = (index, e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const newDigits = [...otpDigits];

    if (raw.length > 1) {
      const chars = raw.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newDigits[i] = chars[i] || '';
      }
      setOtpDigits(newDigits);
      const nextIdx = Math.min(chars.length, 5);
      otpInputRefs.current[nextIdx]?.focus();
    } else {
      newDigits[index] = raw;
      setOtpDigits(newDigits);
      if (raw && index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }
    }
    if (error) setError('');
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
    const pasted = e.clipboardData?.getData('text') || '';
    const digits = pasted.replace(/[^0-9]/g, '').slice(0, 6);
    if (!digits) return;

    const newDigits = ['', '', '', '', '', ''];
    for (let i = 0; i < digits.length; i++) {
      newDigits[i] = digits[i];
    }
    setOtpDigits(newDigits);
    const nextIdx = digits.length < 6 ? digits.length : 5;
    otpInputRefs.current[nextIdx]?.focus();
  };

  const completeActivation = () => {
    const res = authService.verifyUserAccount(currentUser.id || currentUser.email);
    if (res.success) {
      toast.success('Account verified and workspace unlocked! Welcome to NEXORA.');
      if (!currentUser.profileCompleted) {
        navigate('/complete-profile');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError('Activation failed. Please try again or contact security support.');
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    const entered = otpDigits.join('');
    if (entered.length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      const firstEmpty = otpDigits.findIndex(d => !d);
      if (firstEmpty !== -1) otpInputRefs.current[firstEmpty]?.focus();
      return;
    }

    setIsVerifying(true);
    try {
      const check = await authService.verifyOtp({
        contact: contactDisplay,
        userId: currentUser?.id || currentUser?._id,
        otp: entered
      });
      setIsVerifying(false);
      if (check.success) {
        toast.success('Account verified and workspace unlocked! Welcome to NEXORA.');
        const updated = authService.getCurrentUser();
        if (!updated?.profileCompleted) {
          navigate('/complete-profile');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(check.error || check.message || 'Invalid verification code. Please try again.');
        toast.error(check.error || check.message || 'Invalid verification code.');
      }
    } catch (err) {
      setIsVerifying(false);
      setError(err.message || 'Verification service unavailable. Please try again.');
    }
  };

  const handleResend = async (targetChannel = channel) => {
    if (resendTimer > 0 || isResending) return;
    setIsResending(true);
    try {
      const res = await authService.resendOtp({
        contact: contactDisplay,
        userId: currentUser?.id || currentUser?._id,
        channel: targetChannel
      });
      setIsResending(false);
      if (res.success) {
        setResendTimer(45);
        setOtpDigits(['', '', '', '', '', '']);
        const freshCode = res.data?.debugOtp || sessionStorage.getItem('nexora_active_debug_otp') || '';
        if (freshCode) setDebugCode(freshCode);
        toast.success(res.message || 'New verification code dispatched.');
        otpInputRefs.current[0]?.focus();
      } else {
        toast.error(res.message || res.error || 'Failed to dispatch code.');
      }
    } catch {
      setIsResending(false);
      toast.error('Could not request verification code.');
    }
  };

  const handleSignOut = async () => {
    await authService.logout();
    navigate('/login');
  };

  return (
    <AuthLayout
      headline="Account Verification Lock."
      subtext="To safeguard workspace telemetry and system architecture sandboxes, all accounts require active verification before workspace activation."
      badgeText="SECURITY PROTOCOL"
      badgeSub="· Access Restricted"
      maxWidth="460px"
    >
      <div className="w-full text-center">
        {/* Verification Shield Badge */}
        <div 
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4 mx-auto"
          style={{ background: 'rgba(99, 102, 241, 0.12)', color: 'var(--minimal-indigo)', border: '1px solid rgba(99, 102, 241, 0.25)' }}
        >
          <ShieldCheck size={14} />
          <span>Verification Required</span>
        </div>

        <h1 className="text-gradient text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          Verify your {isEmail ? 'Email Address' : 'Phone Number'}
        </h1>

        <p className="text-muted text-xs sm:text-sm max-w-sm mx-auto mb-4 leading-relaxed">
          {isEmail 
            ? 'We have dispatched a secure 6-digit confirmation code to your registered email:'
            : 'We have dispatched a secure 6-digit one-time code to your registered phone:'}
        </p>

        {/* Contact Pill */}
        <div 
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl mb-4 mx-auto"
          style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}
        >
          {isEmail ? <Mail size={15} className="text-primary" /> : <Phone size={15} className="text-primary" />}
          <span className="font-mono text-xs sm:text-sm font-semibold text-main">{contactDisplay}</span>
        </div>

        {/* Real-Time Carrier Dispatched Passcode Card with 1-Click Auto-Fill */}
        {debugCode && (
          <div 
            className="mb-5 p-3.5 rounded-xl flex items-center justify-between gap-3 text-left animate-fade-in mx-auto max-w-[380px]"
            style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.35)' }}
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={22} className="text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-emerald-300">
                  Carrier Code: <span className="font-mono text-base tracking-widest font-extrabold text-white ml-1">{debugCode}</span>
                </div>
                <p className="text-[11px] text-muted m-0">Dispatched via secure gateway (Valid for 10 min)</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleAutoFill(debugCode)}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-all border border-emerald-500/40 cursor-pointer shrink-0"
            >
              Auto-Fill
            </button>
          </div>
        )}

        {/* Fallback channel selector for phone */}
        {!isEmail && (
          <div className="flex justify-center gap-2 mb-5">
            <button
              type="button"
              onClick={() => { setChannel('sms'); handleResend('sms'); }}
              className="text-[11px] font-medium px-3 py-1 rounded-lg border transition-all cursor-pointer"
              style={{
                background: channel === 'sms' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                borderColor: channel === 'sms' ? 'var(--minimal-indigo)' : 'var(--border-color)',
                color: channel === 'sms' ? 'var(--minimal-indigo)' : 'var(--text-muted)'
              }}
            >
              SMS Code
            </button>
            <button
              type="button"
              onClick={() => { setChannel('whatsapp'); handleResend('whatsapp'); }}
              className="inline-flex items-center gap-1 text-[11px] font-medium px-3 py-1 rounded-lg border transition-all cursor-pointer"
              style={{
                background: channel === 'whatsapp' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                borderColor: channel === 'whatsapp' ? 'var(--minimal-emerald)' : 'var(--border-color)',
                color: channel === 'whatsapp' ? 'var(--minimal-emerald)' : 'var(--text-muted)'
              }}
            >
              <MessageSquare size={12} />
              <span>WhatsApp Fallback</span>
            </button>
          </div>
        )}

        {/* OTP Input Form */}
        <form onSubmit={handleVerifySubmit} className="w-full flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-5 w-full max-w-[340px]">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                ref={(el) => (otpInputRefs.current[index] = el)}
                id={`verify-box-${index}`}
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
                  border: error ? '1.5px solid var(--secondary)' : (otpDigits[index] ? '1.5px solid var(--primary)' : '1px solid var(--border-color)'),
                  color: 'var(--text-main)',
                  boxShadow: otpDigits[index] ? '0 0 12px rgba(99, 102, 241, 0.2)' : 'none',
                  outline: 'none'
                }}
              />
            ))}
          </div>

          {error && (
            <span role="alert" className="text-secondary text-xs font-medium block mb-4">
              {error}
            </span>
          )}

          <button
            type="submit"
            id="verify-submit-btn"
            disabled={isVerifying}
            className="btn btn-primary w-full flex items-center justify-center gap-2 py-3 cursor-pointer"
            style={{ borderRadius: 'var(--radius-md)', fontSize: '0.94rem' }}
          >
            {isVerifying ? (
              <>
                <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <span>Activating Account...</span>
              </>
            ) : (
              <>
                <span>Confirm &amp; Unlock Workspace</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        {/* Demo Activation Shortcut for testing email links */}
        {isEmail && (
          <div className="mt-4 p-3 rounded-xl text-left" style={{ background: 'rgba(99, 102, 241, 0.06)', border: '1px dashed rgba(99, 102, 241, 0.25)' }}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted">Dev / Test: Click inbox link simulation</span>
              <button
                type="button"
                onClick={completeActivation}
                className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline cursor-pointer"
              >
                <CheckCircle2 size={13} />
                <span>Simulate Link Click</span>
              </button>
            </div>
          </div>
        )}

        {/* Resend Actions */}
        <div className="mt-6 flex flex-col items-center gap-3">
          {resendTimer > 0 ? (
            <p className="text-muted text-xs">
              Resend available in <strong className="font-mono text-main">{resendTimer}s</strong>
            </p>
          ) : (
            <button
              type="button"
              onClick={() => handleResend(channel)}
              disabled={isResending}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              <RotateCw size={13} className={isResending ? 'animate-spin' : ''} />
              <span>Resend Verification Code</span>
            </button>
          )}

          <div className="w-full pt-4 mt-2" style={{ borderTop: '1px solid var(--border-color)' }}>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-main cursor-pointer transition-colors"
            >
              <LogOut size={13} />
              <span>Sign out &amp; register with another account</span>
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
