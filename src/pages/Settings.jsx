import { Moon, Bell, Shield } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in flex flex-col gap-lg">
      <header className="mb-md">
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Settings</h1>
        <p className="text-muted">Manage your preferences.</p>
      </header>

      <div className="flex flex-col gap-md">
        <div className="glass-panel interactive flex items-center justify-between" style={{ padding: 'var(--space-md)' }}>
          <div className="flex items-center gap-sm">
            <Moon size={20} className="text-muted" />
            <span style={{ fontWeight: '500' }}>Dark Mode</span>
          </div>
          <button 
            className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ width: 'auto', padding: '6px 12px' }}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? 'On' : 'Off'}
          </button>
        </div>

        <div className="glass-panel interactive flex items-center justify-between" style={{ padding: 'var(--space-md)' }}>
          <div className="flex items-center gap-sm">
            <Bell size={20} className="text-muted" />
            <span style={{ fontWeight: '500' }}>Push Notifications</span>
          </div>
          <button 
            className="btn btn-primary" 
            style={{ width: 'auto', padding: '6px 12px' }}
            onClick={() => navigate('/settings/notifications')}
          >
            Manage
          </button>
        </div>

        <div className="glass-panel interactive flex items-center justify-between" style={{ padding: 'var(--space-md)' }}>
          <div className="flex items-center gap-sm">
            <Shield size={20} className="text-muted" />
            <span style={{ fontWeight: '500' }}>Privacy & Security</span>
          </div>
          <button 
            className="btn btn-secondary" 
            style={{ width: 'auto', padding: '6px 12px' }}
            onClick={() => navigate('/settings/privacy')}
          >
            Manage
          </button>
        </div>
      </div>
    </div>
  );
}
