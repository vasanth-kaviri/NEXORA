import { useState } from 'react';

export default function PrivacySettings() {
  const [settings, setSettings] = useState({
    publicProfile: false,
    dataSharing: true,
    twoFactor: false
  });

  const toggle = (key) => setSettings({ ...settings, [key]: !settings[key] });

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
          <button className="btn btn-secondary text-error" style={{ borderColor: 'var(--error)', width: '100%' }} onClick={() => alert('Are you sure you want to delete your account? This action cannot be undone.')}>
            Delete Account
          </button>
        </div>

      </div>
    </div>
  );
}
