import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleReset = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="flex flex-col" style={{ height: '100%', padding: 'var(--space-xl) var(--space-lg)' }}>
      <div className="animate-fade-in flex flex-col justify-center" style={{ flex: 1 }}>
        <button onClick={() => navigate('/login')} className="flex items-center gap-xs text-muted mb-xl" style={{ width: 'fit-content' }}>
          <ArrowLeft size={20} /> Back to login
        </button>
        
        <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: 'var(--space-xs)' }}>
          Reset Password
        </h1>
        <p className="text-muted" style={{ marginBottom: 'var(--space-xl)' }}>
          Enter your email and we'll send you a link to reset your password.
        </p>

        {!sent ? (
          <form onSubmit={handleReset} className="glass-panel" style={{ padding: 'var(--space-lg)' }}>
            <div className="input-group mb-lg">
              <label className="input-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={20} className="text-muted" style={{ position: 'absolute', top: 14, left: 14 }} />
                <input 
                  type="email" 
                  className="input-field" 
                  style={{ paddingLeft: '2.75rem', width: '100%' }}
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="glass-panel text-center" style={{ padding: 'var(--space-xl)' }}>
            <Send size={48} className="text-primary mx-auto mb-md" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: 'var(--space-xs)' }}>Check your email</h3>
            <p className="text-muted">We've sent a password reset link to <strong>{email}</strong>.</p>
          </div>
        )}
      </div>
    </div>
  );
}
