import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2, RefreshCw } from 'lucide-react';
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

  return (
    <AuthLayout
      headline="Account Recovery Protocol."
      subtext="Enter your registered email to receive immediate encrypted password restoration instructions."
    >
      <button 
        onClick={() => navigate('/login')} 
        className="flex items-center gap-2 text-muted hover:text-main transition-colors mb-6" 
        style={{ width: 'fit-content', fontSize: '0.88rem', fontWeight: 600 }}
      >
        <ArrowLeft size={16} />
        <span>Back to login</span>
      </button>

      <h1 className="text-gradient" style={{ fontSize: '2.1rem', fontWeight: 800, marginBottom: '6px', letterSpacing: '-0.5px' }}>
        Reset Password
      </h1>
      <p className="text-muted" style={{ marginBottom: '24px', fontSize: '0.9rem', lineHeight: 1.5 }}>
        Enter your verified email and we'll send you a secure link to reset your account password.
      </p>

      {!sent ? (
        <form onSubmit={handleReset} className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
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
        </form>
      ) : (
        <div className="glass-panel text-center animate-fade-in" style={{ padding: '32px 24px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
            <CheckCircle2 size={28} className="text-minimal-emerald" />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>Check your email</h3>
          <p className="text-muted" style={{ fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '24px' }}>
            We've sent a password reset link to <strong className="text-main">{email}</strong>. Please check your inbox and spam folder.
          </p>

          <div className="flex flex-col gap-2">
            <button 
              type="button" 
              onClick={() => { setSent(false); }}
              className="btn btn-secondary w-full flex items-center justify-center gap-2"
              style={{ fontSize: '0.85rem' }}
            >
              <RefreshCw size={14} />
              <span>Resend Link</span>
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/login')}
              className="btn w-full"
              style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}
            >
              Return to login
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
