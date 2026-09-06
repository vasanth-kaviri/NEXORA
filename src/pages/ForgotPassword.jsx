import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2, RefreshCw, KeyRound } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import IconInput from '../components/IconInput';
import { useToast } from '../contexts/ToastContext';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSent(true);
      toast.success(`Password reset link dispatched to ${email}`);
    }, 800);
  };

  const topLeftAction = (
    <button 
      onClick={() => navigate('/login')} 
      id="back-to-login-btn"
      className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-main transition-colors cursor-pointer"
      title="Return to Login"
    >
      <ArrowLeft size={15} className="text-primary" />
      <span>Back to login</span>
    </button>
  );

  return (
    <AuthLayout
      headline="Account Security &amp; Access."
      subtext="Regain access to your calibrated roadmaps, code sandboxes, and interview telemetry."
      badgeText="SECURITY PROTOCOL"
      badgeSub="· Encrypted Recovery"
      topLeftAction={topLeftAction}
      maxWidth="440px"
    >
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-gradient text-3xl font-extrabold tracking-tight mb-2">
            Reset Password
          </h1>
          <p className="text-muted text-sm leading-relaxed">
            Enter your registered email and we'll dispatch a secure, single-use restoration link.
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleReset} className="w-full flex flex-col gap-4">
            <div className="input-group mb-0">
              <label className="input-label mb-1.5 font-medium text-xs tracking-wide">Account Email</label>
              <IconInput
                icon={<Mail size={17} />}
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-muted text-[11px] mt-1.5">
                The recovery link will remain valid for 15 minutes.
              </p>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn btn-primary w-full flex items-center justify-center gap-2 mt-2 cursor-pointer"
              style={{ padding: '13px', fontSize: '0.94rem', borderRadius: 'var(--radius-md)' }}
            >
              {isLoading ? (
                <>
                  <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  <span>Dispatching Link...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Send Recovery Link</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="p-6 text-center animate-fade-in w-full rounded-2xl" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
            <div 
              style={{ 
                width: 52, 
                height: 52, 
                borderRadius: '50%', 
                background: 'rgba(16, 185, 129, 0.12)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 16px auto', 
                border: '1px solid rgba(16, 185, 129, 0.25)' 
              }}
            >
              <CheckCircle2 size={26} className="text-minimal-emerald" />
            </div>
            <h3 className="text-lg font-bold text-main mb-2">Check your email</h3>
            <p className="text-muted text-xs sm:text-sm leading-relaxed mb-6">
              We've dispatched password restoration instructions to <strong className="text-main font-mono">{email}</strong>. Please check your inbox and spam folders.
            </p>

            <div className="flex flex-col gap-2.5">
              <button 
                type="button" 
                onClick={() => { setSent(false); }}
                className="btn btn-secondary w-full flex items-center justify-center gap-2 cursor-pointer"
                style={{ fontSize: '0.86rem', padding: '10px' }}
              >
                <RefreshCw size={14} />
                <span>Resend Link</span>
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/login')}
                className="btn w-full text-muted hover:text-main cursor-pointer"
                style={{ fontSize: '0.86rem', padding: '8px' }}
              >
                Return to login
              </button>
            </div>
          </div>
        )}

        <div className="text-center mt-6 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
          <p className="text-muted text-xs sm:text-sm">
            Remembered your password?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
