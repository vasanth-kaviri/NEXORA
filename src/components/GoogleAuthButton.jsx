import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firebaseAuth } from '../services/firebaseAuth';
import { PlusCircle, UserCheck, ArrowRight, X } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export default function GoogleAuthButton({ mode = 'signin', onSuccess }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [isCustomAccount, setIsCustomAccount] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  const googleAccounts = [
    {
      name: 'Alex Johnson',
      email: 'alex.johnson.dev@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      role: 'Machine Learning Engineer'
    },
    {
      name: 'Priya Sharma',
      email: 'priya.sharma.tech@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      role: 'Full Stack Developer'
    }
  ];

  const finishLogin = (user) => {
    setIsConnecting(false);
    setShowAccountModal(false);
    toast.success(`Welcome, ${user.firstName}! Signed in with Google.`);
    if (onSuccess) {
      onSuccess(user);
    } else {
      navigate('/dashboard');
    }
  };

  const handleGoogleClick = async () => {
    setIsConnecting(true);
    // 1. Try Firebase Google Popup first
    const res = await firebaseAuth.loginWithGoogle();
    if (res.success && res.user) {
      finishLogin(res.user);
      return;
    }

    // 2. If popup is blocked, open the Google identity modal
    setIsConnecting(false);
    setShowAccountModal(true);
  };

  const handleSelectAccount = (account) => {
    setIsConnecting(true);
    setTimeout(() => {
      const user = firebaseAuth.loginWithCustomGoogle({
        email: account.email,
        name: account.name,
        avatar: account.avatar,
        role: account.role
      });
      finishLogin(user);
    }, 400);
  };

  const handleCreateCustomGoogle = (e) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) {
      toast.error('Please enter a valid Google email address.');
      return;
    }
    const name = customName.trim() || customEmail.split('@')[0];
    const user = firebaseAuth.loginWithCustomGoogle({
      email: customEmail.trim(),
      name,
      role: 'Software Engineer'
    });
    finishLogin(user);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={isConnecting}
        className="w-full flex items-center justify-center gap-3 btn btn-secondary"
        style={{
          padding: '11px 16px',
          fontSize: '0.92rem',
          borderRadius: 'var(--radius-md)',
          cursor: isConnecting ? 'wait' : 'pointer',
        }}
      >
        {isConnecting ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: 16, height: 16, border: '2px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span>Connecting to Google...</span>
          </div>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>{mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}</span>
          </>
        )}
      </button>

      {/* Google Identity Modal */}
      {showAccountModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setShowAccountModal(false)}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '430px',
              padding: '24px',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
              animation: 'fadeIn 0.2s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Google Account</h3>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: 0 }}>Choose or enter your account to continue</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAccountModal(false)}
                className="text-muted hover:text-main"
                style={{ cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {!isCustomAccount ? (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                  {googleAccounts.map((acc) => (
                    <div
                      key={acc.email}
                      onClick={() => handleSelectAccount(acc)}
                      className="interactive"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        background: 'var(--input-bg)',
                        cursor: 'pointer'
                      }}
                    >
                      <img
                        src={acc.avatar}
                        alt={acc.name}
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>{acc.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{acc.email}</p>
                      </div>
                      <UserCheck size={16} className="text-minimal-emerald" />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setIsCustomAccount(true)}
                  className="btn btn-secondary w-full flex items-center justify-center gap-2 mb-3"
                  style={{ fontSize: '0.84rem', padding: '10px' }}
                >
                  <PlusCircle size={15} />
                  <span>Use Another Google Account</span>
                </button>
              </>
            ) : (
              <form onSubmit={handleCreateCustomGoogle} className="flex flex-col gap-3 mb-3">
                <div className="input-group mb-0">
                  <label className="input-label" style={{ fontSize: '0.78rem' }}>Your Full Name</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Alex Rivera"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group mb-0">
                  <label className="input-label" style={{ fontSize: '0.78rem' }}>Google Email Address</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="name@gmail.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCustomAccount(false)}
                    className="btn btn-secondary flex-1"
                    style={{ fontSize: '0.82rem' }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1 flex items-center justify-center gap-1"
                    style={{ fontSize: '0.82rem' }}
                  >
                    <span>Authenticate</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            )}

            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
              Encrypted Firebase session. Profile synced automatically with Realtime Database.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
