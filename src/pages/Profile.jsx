import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { 
  Moon, Sun, Share2, LogOut, Award, Edit2, Save, X, Menu, 
  Bell, Shield, HelpCircle, Info, Globe, ChevronRight, CheckCircle2,
  Sparkles, Flame, Target, Trophy, Code2, ExternalLink, KeyRound
} from 'lucide-react';
import db from '../services/db';

export default function Profile() {
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [user, setUser] = useState(() => {
    const current = db.getCurrentUser() || {};
    return {
      firstName: current.firstName || 'Alex',
      lastName: current.lastName || 'Johnson',
      dreamJob: current.dreamJob || 'AI & Machine Learning Engineer',
      email: current.email || 'alex.johnson.dev@gmail.com',
      phone: current.phone || '+1 234 567 8900',
      education: current.education || 'B.S. Computer Science',
      domain: current.domain || 'Artificial Intelligence & Distributed Systems',
      level: current.level || 5,
      streak: current.streak || 4,
      careerMatch: current.careerMatch || 94,
    };
  });

  const [editForm, setEditForm] = useState(user);

  useEffect(() => {
    const handleSession = () => {
      const current = db.getCurrentUser();
      if (current) {
        setUser(prev => ({
          ...prev,
          firstName: current.firstName || prev.firstName,
          lastName: current.lastName || prev.lastName,
          dreamJob: current.dreamJob || prev.dreamJob,
          email: current.email || prev.email,
        }));
      }
    };
    window.addEventListener('user_session_changed', handleSession);
    return () => window.removeEventListener('user_session_changed', handleSession);
  }, []);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + '/profile');
      toast.success('Public portfolio link copied to clipboard!');
    } else {
      toast.info('NEXORA Profile: ' + user.firstName + ' ' + user.lastName);
    }
  };

  const handleSave = () => {
    const updated = db.updateUserProfile({
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      dreamJob: editForm.dreamJob,
      phone: editForm.phone,
      education: editForm.education,
      domain: editForm.domain
    });
    setUser(prev => ({ ...prev, ...updated }));
    setIsEditing(false);
    toast.success('Profile information successfully saved!');
  };

  return (
    <div className="animate-fade-in flex flex-col gap-6" style={{ position: 'relative', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      
      {/* Top Right Settings Menu Button */}
      <div 
        onClick={() => setIsSettingsOpen(true)}
        className="interactive btn-icon-tactile"
        style={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer', zIndex: 10, width: 40, height: 40, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Menu size={22} className="text-main" />
      </div>

      {/* Header Profile Summary */}
      <header className="flex flex-col items-center justify-center pt-2">
        <div 
          style={{ width: 84, height: 84, borderRadius: '50%', background: 'linear-gradient(135deg, var(--minimal-indigo), var(--minimal-cyan))', marginBottom: '14px', border: '3px solid var(--border-color)' }}
          className="flex items-center justify-center text-white font-extrabold text-3xl shadow-xl"
        >
          {user.firstName.charAt(0).toUpperCase()}
        </div>
        <div className="flex items-center gap-2">
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0, letterSpacing: '-0.3px' }}>
            {user.firstName} {user.lastName}
          </h1>
          <span className="minimal-badge" style={{ color: 'var(--minimal-emerald)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
            Lvl {user.level} Pro
          </span>
        </div>
        <p className="text-muted text-center mt-1" style={{ fontSize: '0.92rem' }}>{user.dreamJob}</p>
        
        <div className="flex gap-2 mt-4">
          <button 
            className="btn btn-primary flex items-center gap-2" 
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? <><Save size={15}/> Save Changes</> : <><Edit2 size={15}/> Edit Profile</>}
          </button>
          
          {isEditing && (
            <button 
              className="btn btn-secondary" 
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              onClick={() => { setIsEditing(false); setEditForm(user); }}
            >
              <X size={15}/> Cancel
            </button>
          )}

          {!isEditing && (
            <button 
              className="btn btn-secondary flex items-center gap-2" 
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              onClick={handleShare}
            >
              <Share2 size={15}/> Share Portfolio
            </button>
          )}
        </div>
      </header>

      {/* 2-Column High-Density Mastery Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── LEFT COLUMN: Personal Info & Connected Accounts (5 cols) ── */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {/* Personal Information */}
          <div className="glass-panel" style={{ padding: '22px', borderRadius: 'var(--radius-lg)' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                {isEditing ? 'Edit Information' : 'Personal Information'}
              </h2>
              <span className="text-muted" style={{ fontSize: '0.74rem' }}>Private Details</span>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="input-group mb-0">
                  <label className="input-label" style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>First Name</label>
                  {isEditing ? (
                    <input type="text" className="input-field" value={editForm.firstName} onChange={e => setEditForm({...editForm, firstName: e.target.value})} />
                  ) : (
                    <p style={{ fontWeight: 600, fontSize: '0.88rem', margin: '2px 0' }}>{user.firstName}</p>
                  )}
                </div>

                <div className="input-group mb-0">
                  <label className="input-label" style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Last Name</label>
                  {isEditing ? (
                    <input type="text" className="input-field" value={editForm.lastName} onChange={e => setEditForm({...editForm, lastName: e.target.value})} />
                  ) : (
                    <p style={{ fontWeight: 600, fontSize: '0.88rem', margin: '2px 0' }}>{user.lastName}</p>
                  )}
                </div>
              </div>
              
              <div className="input-group mb-0">
                <label className="input-label" style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Email Address</label>
                <p style={{ fontWeight: 600, fontSize: '0.88rem', margin: '2px 0', color: 'var(--text-main)' }}>{user.email}</p>
              </div>

              <div className="input-group mb-0">
                <label className="input-label" style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Phone Number</label>
                {isEditing ? (
                  <input type="tel" className="input-field" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
                ) : (
                  <p style={{ fontWeight: 600, fontSize: '0.88rem', margin: '2px 0' }}>{user.phone}</p>
                )}
              </div>

              <div className="input-group mb-0">
                <label className="input-label" style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Education</label>
                {isEditing ? (
                  <input type="text" className="input-field" value={editForm.education} onChange={e => setEditForm({...editForm, education: e.target.value})} />
                ) : (
                  <p style={{ fontWeight: 600, fontSize: '0.88rem', margin: '2px 0' }}>{user.education}</p>
                )}
              </div>

              <div className="input-group mb-0">
                <label className="input-label" style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Technical Focus</label>
                {isEditing ? (
                  <input type="text" className="input-field" value={editForm.domain} onChange={e => setEditForm({...editForm, domain: e.target.value})} />
                ) : (
                  <p style={{ fontWeight: 600, fontSize: '0.88rem', margin: '2px 0' }}>{user.domain}</p>
                )}
              </div>
            </div>
          </div>

          {/* Connected Developer Accounts */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px' }}>Connected Ecosystems</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-2 px-3 rounded-lg" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-minimal-indigo" />
                  <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>Google Identity</span>
                </div>
                <span className="minimal-badge" style={{ color: 'var(--minimal-emerald)', fontSize: '0.7rem' }}>
                  <CheckCircle2 size={12} /> Synced
                </span>
              </div>

              <div className="flex items-center justify-between p-2 px-3 rounded-lg" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
                <div className="flex items-center gap-2">
                  <Code2 size={16} className="text-main" />
                  <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>GitHub</span>
                </div>
                <span className="minimal-badge" style={{ color: 'var(--minimal-emerald)', fontSize: '0.7rem' }}>
                  <CheckCircle2 size={12} /> Connected
                </span>
              </div>

              <div className="flex items-center justify-between p-2 px-3 rounded-lg" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
                <div className="flex items-center gap-2">
                  <ExternalLink size={16} className="text-minimal-cyan" />
                  <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>LinkedIn</span>
                </div>
                <button 
                  onClick={() => toast.info('LinkedIn OAuth verified for profile telemetry.')}
                  className="text-minimal-indigo text-xs font-bold underline cursor-pointer"
                >
                  Sync Profile
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN: Career Mastery, Telemetry & Badges (7 cols) ── */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          
          {/* Career Readiness Radar Card */}
          <div className="glass-panel skeuo-convex" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="minimal-badge" style={{ color: 'var(--minimal-indigo)', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
                  <Target size={12} /> ATS TELEMETRY
                </span>
                <span className="text-muted" style={{ fontSize: '0.78rem' }}>Tier-1 Calibration</span>
              </div>
              <span className="tabular-numbers font-extrabold text-minimal-emerald" style={{ fontSize: '1.25rem' }}>
                {user.careerMatch}% Match
              </span>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 6px 0' }}>
              Career Readiness &amp; Core Competency Index
            </h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
              Benchmark calculations based on completed architecture sprints, GitHub repo commits, and FAANG algorithmic challenges.
            </p>

            {/* Radar Skill Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
              {[
                { label: 'System Design', score: '95%', color: 'var(--minimal-indigo)' },
                { label: 'Distributed APIs', score: '92%', color: 'var(--minimal-cyan)' },
                { label: 'Cloud & Kubernetes', score: '88%', color: 'var(--minimal-amber)' }
              ].map((s, idx) => (
                <div key={idx} className="p-3 rounded-lg" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{s.label}</span>
                  <p className="font-mono font-bold text-main mt-1" style={{ fontSize: '1.1rem', margin: '2px 0 0 0', color: s.color }}>{s.score}</p>
                </div>
              ))}
            </div>

            {/* Activity Streak Matrix */}
            <div className="grid grid-cols-3 gap-3 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-minimal-amber mb-1">
                  <Flame size={16} />
                  <span className="font-extrabold text-main" style={{ fontSize: '1.1rem' }}>{user.streak} Days</span>
                </div>
                <span className="text-muted" style={{ fontSize: '0.72rem' }}>Active Streak</span>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-minimal-indigo mb-1">
                  <Trophy size={16} />
                  <span className="font-extrabold text-main" style={{ fontSize: '1.1rem' }}>450 XP</span>
                </div>
                <span className="text-muted" style={{ fontSize: '0.72rem' }}>Total Earned</span>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-minimal-emerald mb-1">
                  <CheckCircle2 size={16} />
                  <span className="font-extrabold text-main" style={{ fontSize: '1.1rem' }}>3 / 3</span>
                </div>
                <span className="text-muted" style={{ fontSize: '0.72rem' }}>Weekly Sprints</span>
              </div>
            </div>
          </div>

          {/* Mastery Achievements & Certifications */}
          <div className="glass-panel" style={{ padding: '22px', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px' }}>
              Mastery Badges &amp; Engineering Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'Level 5 System Architect', desc: 'Authored 3 high-throughput microservices', color: 'var(--minimal-indigo)', tag: 'GOLD' },
                { title: 'Neural Vector Specialist', desc: 'Built vector similarity embedding pipeline', color: 'var(--minimal-cyan)', tag: 'SILVER' },
                { title: 'Cloud CI/CD Deployer', desc: 'Automated multi-stage zero-downtime workflows', color: 'var(--minimal-amber)', tag: 'BRONZE' },
                { title: 'OWASP Security Sentinel', desc: 'Audited API endpoints against CVE standards', color: 'var(--minimal-emerald)', tag: 'SPECIALIST' }
              ].map((badge, idx) => (
                <div 
                  key={idx} 
                  className="p-3 rounded-lg flex items-start gap-3 transition-transform hover:scale-[1.01]"
                  style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: '8px', background: 'var(--bg-card)', border: `1px solid ${badge.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Award size={18} style={{ color: badge.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex justify-between items-center">
                      <p style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{badge.title}</p>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, color: badge.color }}>{badge.tag}</span>
                    </div>
                    <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '2px 0 0 0', lineHeight: 1.3 }}>{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Settings Modal Slide-Up */}
      {isSettingsOpen && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', zIndex: 999,
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setIsSettingsOpen(false)}
        >
          <div 
            className="glass-panel" 
            style={{
              margin: '0', borderRadius: '24px 24px 0 0', padding: '24px',
              background: 'var(--bg-main)', borderTop: '1px solid var(--border-color)',
              animation: 'slideUp 0.3s ease-out', maxWidth: '600px', width: '100%', alignSelf: 'center'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Preferences &amp; System Settings</h2>
              <X size={20} className="interactive text-muted cursor-pointer hover:text-main" onClick={() => setIsSettingsOpen(false)} />
            </div>

            <div className="flex flex-col gap-2">
              
              {/* Working Theme Switcher Row (Fixed Click Handling) */}
              <div 
                onClick={toggleTheme}
                className="flex items-center justify-between interactive p-3 rounded-lg" 
                style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', cursor: 'pointer' }}
              >
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? <Moon size={20} className="text-minimal-indigo" /> : <Sun size={20} className="text-minimal-amber" />}
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)', display: 'block' }}>
                      {theme === 'dark' ? 'Dark Mode (Obsidian)' : 'Light Mode (Paper)'}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Click anywhere to switch system palette
                    </span>
                  </div>
                </div>
                
                {/* Physical Toggle Pill */}
                <div 
                  style={{ 
                    width: 48, height: 26, borderRadius: 13, 
                    background: theme === 'dark' ? 'var(--minimal-indigo)' : 'rgba(0,0,0,0.15)', 
                    position: 'relative', transition: 'all 0.3s ease',
                    border: '1px solid var(--border-color)', pointerEvents: 'none'
                  }}
                >
                  <div 
                    style={{ 
                      width: 20, height: 20, borderRadius: '50%', 
                      background: 'white', position: 'absolute', top: 2, 
                      left: theme === 'dark' ? 24 : 2, 
                      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', 
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3)' 
                    }} 
                  />
                </div>
              </div>

              <div 
                className="flex items-center justify-between interactive p-3 rounded-lg" 
                style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', cursor: 'pointer' }} 
                onClick={() => { setIsSettingsOpen(false); navigate('/notifications'); }}
              >
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-minimal-cyan" />
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Notifications &amp; Alerts</span>
                </div>
                <ChevronRight size={18} className="text-muted" />
              </div>

              <div 
                className="flex items-center justify-between interactive p-3 rounded-lg" 
                style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', cursor: 'pointer' }} 
                onClick={() => { setIsSettingsOpen(false); navigate('/settings/privacy'); }}
              >
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-minimal-emerald" />
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Privacy &amp; Security</span>
                </div>
                <ChevronRight size={18} className="text-muted" />
              </div>

              <div 
                className="flex items-center justify-between interactive p-3 rounded-lg" 
                style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', cursor: 'pointer' }} 
                onClick={() => { setIsSettingsOpen(false); navigate('/help'); }}
              >
                <div className="flex items-center gap-3">
                  <HelpCircle size={20} className="text-minimal-amber" />
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Help &amp; Documentation</span>
                </div>
                <ChevronRight size={18} className="text-muted" />
              </div>

              <div 
                className="flex items-center justify-between interactive p-3 rounded-lg mt-2 text-danger" 
                style={{ border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.06)', cursor: 'pointer' }} 
                onClick={() => {
                  db.setCurrentUser(null);
                  localStorage.removeItem('nexora_session');
                  setIsSettingsOpen(false);
                  toast.info('Logged out of session.');
                  navigate('/login');
                }}
              >
                <div className="flex items-center gap-3 text-danger">
                  <LogOut size={20} style={{ color: '#ef4444' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ef4444' }}>Sign Out</span>
                </div>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>End session</span>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
