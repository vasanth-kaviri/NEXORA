import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import db from '../services/db';

export default function GoogleAuthButton({ mode = 'signin', onSuccess }) {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);

  // Quick selectable mock accounts from database or create new
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

  const handleSelectAccount = (account) => {
    setIsConnecting(true);
    setShowAccountModal(false);

    setTimeout(() => {
      // Connect to db and store user in Database
      const user = db.loginWithGoogle({
        email: account.email,
        firstName: account.name.split(' ')[0],
        lastName: account.name.split(' ')[1] || '',
        avatar: account.avatar,
        dreamJob: account.role
      });

      setIsConnecting(false);
      if (onSuccess) {
        onSuccess(user);
      } else {
        navigate('/dashboard');
      }
    }, 800);
  };

  const handleInstantGoogle = () => {
    // Open Google Account Picker dialog
    setShowAccountModal(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleInstantGoogle}
        disabled={isConnecting}
        className="w-full flex items-center justify-center gap-3 interactive"
        style={{
          padding: '11px 16px',
          background: 'var(--input-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-full)',
          color: 'var(--text-main)',
          fontSize: '0.92rem',
          fontWeight: '600',
          cursor: isConnecting ? 'wait' : 'pointer',
          transition: 'all 0.25s ease',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--primary)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-color)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {isConnecting ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: 16, height: 16, border: '2px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span>Connecting to Google Database...</span>
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

      {/* Realistic Google Identity Modal */}
      {showAccountModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(6px)',
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
              maxWidth: '420px',
              padding: '24px',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              animation: 'fadeIn 0.25s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)' }}>Sign in with Google</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Choose an account to continue to NEXORA</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {googleAccounts.map((acc) => (
                <div
                  key={acc.email}
                  onClick={() => handleSelectAccount(acc)}
                  className="interactive"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
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
                    <p style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>{acc.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{acc.email}</p>
                  </div>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '999px', fontWeight: 600 }}>
                    {acc.role.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>

            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
              To continue, Google will share your name, email address, and profile picture with NEXORA. Saved directly in database.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
