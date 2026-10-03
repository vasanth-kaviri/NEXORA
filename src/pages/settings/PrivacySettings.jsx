import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import db from '../../services/db';
import { useToast } from '../../contexts/ToastContext';

export default function PrivacySettings() {
  const navigate = useNavigate();
  const toast = useToast();

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('nexora_privacy_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      publicProfile: false,
      dataSharing: true,
      twoFactor: false
    };
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggle = (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    try {
      localStorage.setItem('nexora_privacy_settings', JSON.stringify(updated));
    } catch {}
    toast.success('Privacy preference updated.');
  };

  const handleConfirmDelete = () => {
    const user = db.getCurrentUser();
    if (user?.id) {
      db.deleteUser(user.id);
    } else if (user?.email) {
      db.deleteUser(user.email);
    }
    toast.success('Your account and session have been deleted.');
    navigate('/login');
  };

  return (
    <div className="animate-fade-in flex flex-col gap-lg">
      <header className="mb-md">
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Privacy & Security</h1>
        <p className="text-muted">Manage your data and account security.</p>
      </header>

      <div className="glass-panel" style={{ padding: '0 var(--space-md)' }}>
        
        <div className="flex items-center justify-between" style={{ padding: 'var(--space-md) 0', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <span style={{ fontWeight: '600', display: 'block' }}>Public Profile Visibility</span>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Allow recruiters to find you</span>
          </div>
          <div onClick={() => toggle('publicProfile')} style={{ width: 44, height: 24, borderRadius: 12, background: settings.publicProfile ? 'var(--primary)' : 'var(--input-bg)', position: 'relative', cursor: 'pointer', transition: 'all 0.3s ease' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute', top: 2, left: settings.publicProfile ? 22 : 2, transition: 'all 0.3s ease' }} />
          </div>
        </div>

        <div className="flex items-center justify-between" style={{ padding: 'var(--space-md) 0', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <span style={{ fontWeight: '600', display: 'block' }}>Data Sharing for AI Analysis</span>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Improve mentor suggestions</span>
          </div>
          <div onClick={() => toggle('dataSharing')} style={{ width: 44, height: 24, borderRadius: 12, background: settings.dataSharing ? 'var(--primary)' : 'var(--input-bg)', position: 'relative', cursor: 'pointer', transition: 'all 0.3s ease' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute', top: 2, left: settings.dataSharing ? 22 : 2, transition: 'all 0.3s ease' }} />
          </div>
        </div>

        <div className="flex items-center justify-between" style={{ padding: 'var(--space-md) 0', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <span style={{ fontWeight: '600', display: 'block' }}>Two-Factor Authentication</span>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Secure your account</span>
          </div>
          <div onClick={() => toggle('twoFactor')} style={{ width: 44, height: 24, borderRadius: 12, background: settings.twoFactor ? 'var(--primary)' : 'var(--input-bg)', position: 'relative', cursor: 'pointer', transition: 'all 0.3s ease' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute', top: 2, left: settings.twoFactor ? 22 : 2, transition: 'all 0.3s ease' }} />
          </div>
        </div>

        <div className="flex flex-col gap-sm" style={{ padding: 'var(--space-md) 0' }}>
          <span style={{ fontWeight: '600', display: 'block', color: 'var(--error)' }}>Danger Zone</span>
          <button 
            type="button"
            className="btn btn-secondary text-error" 
            style={{ borderColor: 'var(--error)', width: '100%', cursor: 'pointer' }} 
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Account
          </button>
        </div>

      </div>

      {/* Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md animate-fade-in" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
          <div className="glass-panel w-full max-w-md p-lg flex flex-col gap-md" style={{ background: 'var(--bg-main)', border: '1px solid var(--error)', borderRadius: 'var(--radius-lg)' }}>
            <div className="flex items-center gap-sm text-error">
              <AlertTriangle size={24} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Permanently Delete Account?</h3>
            </div>
            <p className="text-muted text-sm leading-relaxed m-0">
              This action cannot be undone. All your engineering progress, ATS resume analyses, mock interview scores, and personalized roadmap telemetry will be permanently wiped.
            </p>
            <div className="flex justify-end gap-sm mt-sm">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                style={{ background: 'var(--error)', borderColor: 'var(--error)' }}
                onClick={handleConfirmDelete}
              >
                Yes, Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
