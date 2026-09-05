import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, Share2, LogOut, Award, Edit2, Save, X, Menu, Bell, Shield, HelpCircle, Info, Globe, ChevronRight } from 'lucide-react';

export default function Profile() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [user, setUser] = useState({
    firstName: 'Alex',
    lastName: 'Johnson',
    dreamJob: 'Machine Learning Engineer',
    email: 'alex.j@example.com',
    phone: '+1 234 567 8900',
    education: 'B.S. Computer Science',
    domain: 'Artificial Intelligence',
    password: '••••••••'
  });

  const [editForm, setEditForm] = useState(user);

  useEffect(() => {
    const savedUser = localStorage.getItem('nexora_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(prev => ({
          ...prev,
          firstName: parsed.firstName || prev.firstName,
          lastName: parsed.lastName || prev.lastName,
          dreamJob: parsed.dreamJob || prev.dreamJob,
          email: parsed.email || prev.email,
          phone: parsed.phone || prev.phone,
          education: parsed.education || prev.education,
          domain: parsed.domain || prev.domain
        }));
        setEditForm(prev => ({
          ...prev,
          firstName: parsed.firstName || prev.firstName,
          lastName: parsed.lastName || prev.lastName,
          dreamJob: parsed.dreamJob || prev.dreamJob,
          email: parsed.email || prev.email,
          phone: parsed.phone || prev.phone,
          education: parsed.education || prev.education,
          domain: parsed.domain || prev.domain
        }));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My NEXORA Profile',
          text: `Check out my NEXORA career profile! I am aspiring to be a ${user.dreamJob} in ${user.domain}.`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      alert('Native sharing is not supported on this browser. Try copying the link!');
    }
  };

  const handleSave = () => {
    setUser(editForm);
    localStorage.setItem('nexora_user', JSON.stringify({
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      dreamJob: editForm.dreamJob,
      email: editForm.email,
      phone: editForm.phone,
      education: editForm.education,
      domain: editForm.domain
    }));
    setIsEditing(false);
  };

  return (
    <div className="animate-fade-in flex flex-col gap-lg" style={{ position: 'relative' }}>
      
      {/* Top Right Settings Menu Button */}
      <div 
        onClick={() => setIsSettingsOpen(true)}
        className="interactive"
        style={{ position: 'absolute', top: 0, right: 0, padding: 'var(--space-sm)', cursor: 'pointer', zIndex: 10 }}
      >
        <Menu size={28} className="text-primary" />
      </div>

      <header className="flex flex-col items-center justify-center mb-sm" style={{ marginTop: 'var(--space-md)' }}>
        <div 
          style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', marginBottom: 'var(--space-md)' }}
          className="flex items-center justify-center text-white font-bold text-3xl shadow-lg"
        >
          {user.firstName.charAt(0).toUpperCase()}
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', textAlign: 'center' }}>{user.firstName} {user.lastName}</h1>
        <p className="text-muted text-center">{user.dreamJob}</p>
        
        <div className="flex gap-sm mt-md">
          <button 
            className="btn btn-primary" 
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? <><Save size={16}/> Save</> : <><Edit2 size={16}/> Edit Profile</>}
          </button>
          
          {isEditing && (
            <button 
              className="btn btn-secondary" 
              style={{ padding: '8px 16px', fontSize: '0.9rem' }}
              onClick={() => { setIsEditing(false); setEditForm(user); }}
            >
              <X size={16}/> Cancel
            </button>
          )}

          {!isEditing && (
            <button 
              className="btn btn-secondary" 
              style={{ padding: '8px 16px', fontSize: '0.9rem' }}
              onClick={handleShare}
            >
              <Share2 size={16}/> Share
            </button>
          )}
        </div>
      </header>

      <div className="glass-panel" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-md)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: 'var(--space-md)' }}>
          {isEditing ? 'Edit Information' : 'Personal Information'}
        </h2>
        
        <div className="flex flex-col gap-md">
          <div className="input-group mb-0">
            <label className="input-label" style={{ fontSize: '0.8rem' }}>First Name</label>
            {isEditing ? (
              <input type="text" className="input-field" value={editForm.firstName} onChange={e => setEditForm({...editForm, firstName: e.target.value})} />
            ) : (
              <p style={{ fontWeight: '500' }}>{user.firstName}</p>
            )}
          </div>

          <div className="input-group mb-0">
            <label className="input-label" style={{ fontSize: '0.8rem' }}>Last Name</label>
            {isEditing ? (
              <input type="text" className="input-field" value={editForm.lastName} onChange={e => setEditForm({...editForm, lastName: e.target.value})} />
            ) : (
              <p style={{ fontWeight: '500' }}>{user.lastName}</p>
            )}
          </div>
          
          <div className="input-group mb-0">
            <label className="input-label" style={{ fontSize: '0.8rem' }}>Email</label>
            {isEditing ? (
              <input type="email" className="input-field" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} />
            ) : (
              <p style={{ fontWeight: '500' }}>{user.email}</p>
            )}
          </div>

          <div className="input-group mb-0">
            <label className="input-label" style={{ fontSize: '0.8rem' }}>Phone Number</label>
            {isEditing ? (
              <input type="tel" className="input-field" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
            ) : (
              <p style={{ fontWeight: '500' }}>{user.phone}</p>
            )}
          </div>

          <div className="input-group mb-0">
            <label className="input-label" style={{ fontSize: '0.8rem' }}>Education</label>
            {isEditing ? (
              <input type="text" className="input-field" value={editForm.education} onChange={e => setEditForm({...editForm, education: e.target.value})} />
            ) : (
              <p style={{ fontWeight: '500' }}>{user.education}</p>
            )}
          </div>

          <div className="input-group mb-0">
            <label className="input-label" style={{ fontSize: '0.8rem' }}>Domain</label>
            {isEditing ? (
              <input type="text" className="input-field" value={editForm.domain} onChange={e => setEditForm({...editForm, domain: e.target.value})} />
            ) : (
              <p style={{ fontWeight: '500' }}>{user.domain}</p>
            )}
          </div>

          <div className="input-group mb-0">
            <label className="input-label" style={{ fontSize: '0.8rem' }}>Password</label>
            {isEditing ? (
              <input type="password" className="input-field" value={editForm.password} onChange={e => setEditForm({...editForm, password: e.target.value})} />
            ) : (
              <p style={{ fontWeight: '500' }}>{user.password}</p>
            )}
          </div>
        </div>
      </div>

      {/* Settings Modal Slide-Up */}
      {isSettingsOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 999,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div className="glass-panel" style={{
            margin: '0', borderRadius: '24px 24px 0 0', padding: 'var(--space-xl) var(--space-lg)',
            background: 'var(--bg-main)', borderTop: '1px solid var(--border-color)',
            animation: 'slideUp 0.3s ease-out'
          }}>
            <div className="flex justify-between items-center mb-lg">
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Settings</h2>
              <X size={24} className="interactive text-muted" style={{ cursor: 'pointer' }} onClick={() => setIsSettingsOpen(false)} />
            </div>

            <div className="flex flex-col gap-sm">
              
              <div className="flex items-center justify-between interactive" style={{ padding: 'var(--space-md) 0', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}>
                <div className="flex items-center gap-md">
                  {theme === 'dark' ? <Moon size={20} className="text-primary" /> : <Sun size={20} className="text-warning" />}
                  <span style={{ fontWeight: '500' }}>Dark Mode</span>
                </div>
                <div 
                  onClick={toggleTheme}
                  style={{ width: 50, height: 28, borderRadius: 14, background: theme === 'dark' ? 'var(--primary)' : 'var(--input-bg)', position: 'relative', transition: 'all 0.3s ease' }}
                >
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'white', position: 'absolute', top: 2, left: theme === 'dark' ? 24 : 2, transition: 'all 0.3s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                </div>
              </div>

              <div className="flex items-center justify-between interactive" style={{ padding: 'var(--space-md) 0', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }} onClick={() => navigate('/settings/notifications')}>
                <div className="flex items-center gap-md">
                  <Bell size={20} className="text-primary" />
                  <span style={{ fontWeight: '500' }}>Notifications</span>
                </div>
                <ChevronRight size={20} className="text-muted" />
              </div>

              <div className="flex items-center justify-between interactive" style={{ padding: 'var(--space-md) 0', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }} onClick={() => navigate('/settings/privacy')}>
                <div className="flex items-center gap-md">
                  <Shield size={20} className="text-primary" />
                  <span style={{ fontWeight: '500' }}>Privacy & Security</span>
                </div>
                <ChevronRight size={20} className="text-muted" />
              </div>

              <div className="flex items-center justify-between interactive" style={{ padding: 'var(--space-md) 0', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }} onClick={() => navigate('/settings/language')}>
                <div className="flex items-center gap-md">
                  <Globe size={20} className="text-primary" />
                  <span style={{ fontWeight: '500' }}>Language</span>
                </div>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>English <ChevronRight size={16} style={{ display: 'inline' }}/></span>
              </div>

              <div className="flex items-center justify-between interactive" style={{ padding: 'var(--space-md) 0', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }} onClick={() => navigate('/help')}>
                <div className="flex items-center gap-md">
                  <HelpCircle size={20} className="text-primary" />
                  <span style={{ fontWeight: '500' }}>Help & Support</span>
                </div>
                <ChevronRight size={20} className="text-muted" />
              </div>

              <div className="flex items-center justify-between interactive" style={{ padding: 'var(--space-md) 0', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }} onClick={() => navigate('/about')}>
                <div className="flex items-center gap-md">
                  <Info size={20} className="text-primary" />
                  <span style={{ fontWeight: '500' }}>About NEXORA</span>
                </div>
                <ChevronRight size={20} className="text-muted" />
              </div>

              <div 
                onClick={handleLogout}
                className="flex items-center gap-md text-error interactive mt-sm" 
                style={{ padding: 'var(--space-md) 0', cursor: 'pointer' }}
              >
                <LogOut size={20} />
                <span style={{ fontWeight: '500' }}>Logout</span>
              </div>

            </div>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
