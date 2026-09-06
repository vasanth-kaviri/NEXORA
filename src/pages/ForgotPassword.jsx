import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2, RefreshCw, ShieldCheck, KeyRound, Lock, Clock } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
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
    }, 900);
  };

  const topLeftAction = (
    <button 
      onClick={() => navigate('/login')} 
      id="back-to-login-btn"
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-muted hover:text-main transition-all cursor-pointer font-semibold text-xs sm:text-sm select-none" 
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
      title="Return to Login"
    >
      <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1 text-primary" />
      <span>Back to login</span>
    </button>
  );

  const recoveryShowcase = (
    <div className="flex flex-col animate-fade-in w-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="minimal-badge" style={{ color: 'var(--minimal-indigo)', borderColor: 'rgba(99, 102, 241, 0.25)' }}>
          <ShieldCheck size={12} className="text-minimal-indigo" />
          <span>VAULT RECOVERY SUITE</span>
        </span>
        <span className="text-muted" style={{ fontSize: '0.75rem' }}>· Zero-Knowledge Reset</span>
      </div>

      <h2 
        className="text-gradient"
        style={{ fontSize: '2.15rem', fontWeight: 800, lineHeight: 1.22, letterSpacing: '-0.5px', marginBottom: '12px' }}
      >
        Encrypted Account Restoration.
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '26px' }}>
        Generate a single-use, time-delimited cryptographic token to safely regain access to your roadmaps, code sandboxes, and interview records.
      </p>

      {/* Recovery Security Protocol Terminal Card */}
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
              nexora://vault/security-auth
            </span>
          </div>
          <span className="minimal-badge font-mono" style={{ fontSize: '0.68rem', color: 'var(--minimal-emerald)' }}>
            ● ACTIVE GUARD
          </span>
        </div>

        <div className="flex flex-col gap-2.5 mb-4">
          {[
            { icon: <Lock size={15} className="text-minimal-indigo" />, title: '256-bit Ephemeral Token', detail: 'Valid for 15 minutes only' },
            { icon: <KeyRound size={15} className="text-minimal-emerald" />, title: 'Multi-Session Invalidation', detail: 'Revokes compromised access' },
            { icon: <Clock size={15} className="text-minimal-purple" />, title: 'Rapid Recovery Dispatch', detail: 'Average delivery: 1.2s' },
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <div>
                  <p style={{ fontSize: '0.84rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>{item.title}</p>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0 }}>{item.detail}</p>
                </div>
              </div>
              <span className="text-muted font-mono text-xs">ENFORCED</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 text-xs text-muted" style={{ borderTop: '1px solid var(--border-color)' }}>
          <span>NEXORA Identity Authority</span>
          <span className="font-mono">FIPS-140-3 Compliant</span>
        </div>
      </div>
    </div>
  );

  return (
    <AuthLayout
      headline="Account Recovery Protocol."
      subtext="Enter your registered email to receive immediate encrypted password restoration instructions."
      badgeText="SECURITY PROTOCOL"
      badgeSub="· Encrypted Recovery"
      topLeftAction={topLeftAction}
      maxWidth="480px"
      customShowcase={recoveryShowcase}
    >
      <div className="w-full">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--minimal-indigo)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <KeyRound size={13} />
            <span>Account Security</span>
          </div>
          <h1 className="text-gradient" style={{ fontSize: '2.1rem', fontWeight: 800, marginBottom: '6px', letterSpacing: '-0.5px' }}>
            Reset Password
          </h1>
          <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
            Enter your verified email and we'll dispatch a secure, single-use restoration link.
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleReset} className="w-full">
            <div className="input-group mb-5">
              <label className="input-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} className="text-muted" style={{ position: 'absolute', top: 13, left: 14 }} />
                <input 
                  type="email" 
                  className="input-field" 
                  style={{ paddingLeft: '2.6rem', width: '100%', borderRadius: 'var(--radius-md)' }}
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '6px' }}>
                The recovery link will be valid for 15 minutes after dispatch.
              </p>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn btn-primary w-full flex items-center justify-center gap-2"
              style={{ padding: '12px', fontSize: '0.92rem', borderRadius: 'var(--radius-md)' }}
            >
              {isLoading ? (
                <>
                  <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  <span>Sending Recovery Link...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Send Reset Link</span>
                </>
              )}
            </button>

            <div className="mt-5 pt-4 flex items-center justify-between text-xs text-muted" style={{ borderTop: '1px solid var(--border-color)' }}>
              <span>🔒 256-bit AES Token</span>
              <span>⚡ Dispatched in seconds</span>
            </div>
          </form>
        ) : (
          <div className="glass-panel text-center animate-fade-in w-full" style={{ padding: '36px 26px', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
              <CheckCircle2 size={30} className="text-minimal-emerald" />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '8px' }}>Check your email</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.55, marginBottom: '24px' }}>
              We've dispatched password restoration instructions to <strong className="text-main">{email}</strong>. Please check your inbox and spam filters.
            </p>

            <div className="flex flex-col gap-2.5">
              <button 
                type="button" 
                onClick={() => { setSent(false); }}
                className="btn btn-secondary w-full flex items-center justify-center gap-2"
                style={{ fontSize: '0.86rem', padding: '10px' }}
              >
                <RefreshCw size={14} />
                <span>Resend Link</span>
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/login')}
                className="btn w-full text-muted hover:text-main"
                style={{ fontSize: '0.86rem', padding: '8px' }}
              >
                Return to login
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}

