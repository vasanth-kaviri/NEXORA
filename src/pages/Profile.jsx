import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { 
  Moon, Sun, Share2, LogOut, Award, Edit2, Save, X, Menu, 
  Bell, Shield, HelpCircle, Info, Globe, ChevronRight, CheckCircle2,
  Sparkles, Flame, Target, Trophy, Code2, ExternalLink,
  Camera, Upload, Plus, Trash2, Briefcase,
  RefreshCw, Cpu
} from 'lucide-react';
import db from '../services/db';
import realtimeDb from '../services/realtimeDb';
import { getRoadmapForJob } from '../utils/roadmapData';

export default function Profile() {
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  // Modals & Drawers
  const [isEditing, setIsEditing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarTab, setAvatarTab] = useState('camera'); // 'camera' | 'upload' | 'presets'
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  
  // Professional Experience, Skills & Certifications Modals
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  // Camera & Canvas Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const fileInputRef = useRef(null);

  // User State
  const [user, setUser] = useState(() => {
    const current = db.getCurrentUser() || {};
    return {
      id: current.id || current.uid || null,
      firstName: current.firstName || 'Explorer',
      lastName: current.lastName || '',
      dreamJob: current.dreamJob || 'Software Engineer',
      email: current.email || 'user@nexora.ai',
      phone: current.phone || '',
      education: current.education || 'Computer Science / Engineering',
      domain: current.domain || 'Software Development & Architecture',
      avatar: current.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${current.email || 'explorer'}`,
      level: current.level || 1,
      streak: current.streak || 1,
      careerMatch: current.careerMatch || 88,
    };
  });

  const [editForm, setEditForm] = useState(user);

  // Work Experience Data
  const [experiences, setExperiences] = useState(() => {
    const current = db.getCurrentUser() || {};
    return current.experiences || [
      {
        id: 'exp-1',
        role: 'Senior Full-Stack Engineer',
        company: 'CloudScale Technologies',
        duration: '2024 — Present',
        location: 'San Francisco, CA (Remote)',
        description: 'Architected distributed event-driven microservices handling 250k daily active sessions with 99.99% SLA uptime.'
      },
      {
        id: 'exp-2',
        role: 'Software Engineering Resident',
        company: 'InnovateX Labs',
        duration: '2023 — 2024',
        location: 'Austin, TX',
        description: 'Engineered high-throughput GraphQL APIs, optimized PostgreSQL query indexes reducing read latency by 45%.'
      }
    ];
  });

  // Skills Matrix Data
  const [skills, setSkills] = useState(() => {
    const current = db.getCurrentUser() || {};
    return current.skills || [
      { name: 'React.js & Next.js', category: 'Frontend', proficiency: 95, color: 'var(--minimal-indigo)' },
      { name: 'Node.js & TypeScript', category: 'Backend', proficiency: 92, color: 'var(--minimal-cyan)' },
      { name: 'Python & TensorFlow', category: 'AI / ML', proficiency: 88, color: 'var(--minimal-emerald)' },
      { name: 'Docker & Kubernetes', category: 'Cloud/DevOps', proficiency: 85, color: 'var(--minimal-amber)' },
      { name: 'PostgreSQL & Redis', category: 'Database', proficiency: 90, color: 'var(--minimal-indigo)' }
    ];
  });

  // Certifications Data
  const [certifications, setCertifications] = useState(() => {
    const current = db.getCurrentUser() || {};
    return current.certifications || [
      {
        id: 'cert-1',
        title: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        issueDate: 'Jan 2025',
        credentialId: 'AWS-984210-NX',
        color: 'var(--minimal-amber)'
      },
      {
        id: 'cert-2',
        title: 'TensorFlow Developer Certificate',
        issuer: 'Google Cloud Training',
        issueDate: 'Nov 2024',
        credentialId: 'GCP-TF-7721-AI',
        color: 'var(--minimal-emerald)'
      },
      {
        id: 'cert-3',
        title: 'Meta Front-End Professional Certificate',
        issuer: 'Meta Career Programs',
        issueDate: 'Aug 2024',
        credentialId: 'META-FE-1092-PRO',
        color: 'var(--minimal-cyan)'
      }
    ];
  });

  // New Item Forms
  const [newExp, setNewExp] = useState({ role: '', company: '', duration: '', location: '', description: '' });
  const [newSkill, setNewSkill] = useState({ name: '', category: 'Frontend', proficiency: 85 });
  const [newCert, setNewCert] = useState({ title: '', issuer: '', issueDate: '', credentialId: '' });

  // Preset Avatars
  const presetAvatars = [
    { label: 'Tech Lead', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
    { label: 'AI Architect', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' },
    { label: 'Cloud Engineer', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200' },
    { label: 'Systems Dev', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200' },
    { label: 'Cyber Specialist', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
    { label: 'Data Scientist', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
  ];

  // Stop camera helper
  const stopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      cameraStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // Start webcam for Live Camera Snapshot
  const startCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 480 }, height: { ideal: 480 }, facingMode: 'user' }
      });
      cameraStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err) {
      console.warn('Camera access error:', err);
      setCameraError('Webcam access was denied or is unavailable on this device.');
      setCameraActive(false);
    }
  };

  // Capture frame from webcam to canvas and save as Data URL
  const handleCaptureSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = 320;
    canvas.height = 320;
    
    // Draw mirrored square crop
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -320, 0, 320, 320);
    ctx.restore();
    
    const dataUrl = canvas.toDataURL('image/png');
    updateAvatar(dataUrl);
    stopCamera();
    setIsAvatarModalOpen(false);
    toast.success('Live camera snapshot captured as new profile picture!');
  };

  // Update Avatar in DB & state
  const updateAvatar = (avatarUrl) => {
    db.updateUserProfile({ avatar: avatarUrl });
    setUser(prev => ({ ...prev, avatar: avatarUrl }));
    setEditForm(prev => ({ ...prev, avatar: avatarUrl }));
  };

  // Handle local file upload
  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target.result;
      updateAvatar(result);
      setIsAvatarModalOpen(false);
      toast.success('Profile picture successfully updated from file!');
    };
    reader.readAsDataURL(file);
  };

  // Lifecycle cleanup
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // When switching tabs in avatar modal, manage camera asynchronously
  useEffect(() => {
    let timer;
    if (isAvatarModalOpen && avatarTab === 'camera') {
      timer = setTimeout(() => {
        startCamera();
      }, 50);
    } else {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
        cameraStreamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      timer = setTimeout(() => {
        setCameraActive(false);
      }, 0);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isAvatarModalOpen, avatarTab]);

  // Sync with DB session and Firebase Realtime Database
  useEffect(() => {
    const handleSession = () => {
      const current = db.getCurrentUser();
      if (current) {
        setUser(prev => ({
          ...prev,
          ...current
        }));
      }
    };
    window.addEventListener('user_session_changed', handleSession);

    const currentUser = db.getCurrentUser();
    const uid = currentUser?.id || currentUser?.uid;
    let unsubscribe = null;
    if (uid) {
      unsubscribe = realtimeDb.subscribeToUserProfile(uid, (remoteProfile) => {
        if (remoteProfile) {
          setUser(prev => ({ ...prev, ...remoteProfile }));
          if (remoteProfile.experiences) setExperiences(remoteProfile.experiences);
          if (remoteProfile.skills) setSkills(remoteProfile.skills);
          if (remoteProfile.certifications) setCertifications(remoteProfile.certifications);
        }
      });
    }

    return () => {
      window.removeEventListener('user_session_changed', handleSession);
      if (unsubscribe) unsubscribe();
    };
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
    const matchedRoadmap = getRoadmapForJob(editForm.dreamJob);
    const trackId = matchedRoadmap?.id || 'fullstack';
    localStorage.setItem('nexora_active_course', trackId);

    const updates = {
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      dreamJob: editForm.dreamJob,
      phone: editForm.phone,
      education: editForm.education,
      domain: editForm.domain,
      bio: editForm.bio,
      selectedTrack: trackId
    };
    const updated = db.updateUserProfile(updates);
    const uid = updated.id || updated.uid;
    if (uid) {
      realtimeDb.updateUserProfile(uid, updates);
    }
    setUser(updated);
    setIsEditing(false);
    window.dispatchEvent(new Event('user_session_changed'));
    toast.success('Profile details saved and synchronized in real time!');
  };

  // Add Work Experience
  const handleAddExperience = () => {
    if (!newExp.role || !newExp.company) {
      toast.error('Please provide at least a Role and Company name.');
      return;
    }
    const created = {
      id: `exp-${Date.now()}`,
      role: newExp.role,
      company: newExp.company,
      duration: newExp.duration || '2025 — Present',
      location: newExp.location || 'Remote',
      description: newExp.description || 'Contributed to high-impact technical initiatives and software deliverables.'
    };
    const updated = [created, ...experiences];
    setExperiences(updated);
    db.updateUserProfile({ experiences: updated });
    setIsExpModalOpen(false);
    setNewExp({ role: '', company: '', duration: '', location: '', description: '' });
    toast.success('Work experience entry added to profile!');
  };

  const handleDeleteExperience = (id) => {
    const updated = experiences.filter(exp => exp.id !== id);
    setExperiences(updated);
    db.updateUserProfile({ experiences: updated });
    toast.info('Experience entry removed.');
  };

  // Add Skill
  const handleAddSkill = () => {
    if (!newSkill.name) {
      toast.error('Please enter a skill name.');
      return;
    }
    const colorMap = {
      Frontend: 'var(--minimal-indigo)',
      Backend: 'var(--minimal-cyan)',
      'AI / ML': 'var(--minimal-emerald)',
      'Cloud/DevOps': 'var(--minimal-amber)',
      Database: 'var(--minimal-indigo)'
    };
    const created = {
      name: newSkill.name,
      category: newSkill.category,
      proficiency: Number(newSkill.proficiency) || 80,
      color: colorMap[newSkill.category] || 'var(--minimal-indigo)'
    };
    const updated = [...skills, created];
    setSkills(updated);
    db.updateUserProfile({ skills: updated });
    setIsSkillModalOpen(false);
    setNewSkill({ name: '', category: 'Frontend', proficiency: 85 });
    toast.success(`Skill "${created.name}" added to competency matrix!`);
  };

  const handleDeleteSkill = (name) => {
    const updated = skills.filter(s => s.name !== name);
    setSkills(updated);
    db.updateUserProfile({ skills: updated });
    toast.info(`Skill "${name}" removed.`);
  };

  // Add Certification
  const handleAddCertification = () => {
    if (!newCert.title || !newCert.issuer) {
      toast.error('Please provide certification title and issuing body.');
      return;
    }
    const created = {
      id: `cert-${Date.now()}`,
      title: newCert.title,
      issuer: newCert.issuer,
      issueDate: newCert.issueDate || '2025',
      credentialId: newCert.credentialId || `NX-${Math.floor(100000 + Math.random() * 900000)}`,
      color: 'var(--minimal-indigo)'
    };
    const updated = [created, ...certifications];
    setCertifications(updated);
    db.updateUserProfile({ certifications: updated });
    setIsCertModalOpen(false);
    setNewCert({ title: '', issuer: '', issueDate: '', credentialId: '' });
    toast.success('Engineering certification added to verified credentials!');
  };

  const handleDeleteCert = (id) => {
    const updated = certifications.filter(c => c.id !== id);
    setCertifications(updated);
    db.updateUserProfile({ certifications: updated });
    toast.info('Certification credential removed.');
  };

  return (
    <div className="animate-fade-in flex flex-col gap-6" style={{ position: 'relative', maxWidth: '1400px', margin: '0 auto', width: '100%', paddingBottom: '5rem' }}>
      
      {/* Hidden canvas for video snapshot */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Top Right Settings Menu Button */}
      <div 
        onClick={() => setIsSettingsOpen(true)}
        className="interactive btn-icon-tactile"
        style={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer', zIndex: 10, width: 42, height: 42, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        title="Settings & Preferences"
      >
        <Menu size={22} className="text-main" />
      </div>

      {/* Header Profile Summary with Live Camera Avatar */}
      <header className="flex flex-col items-center justify-center pt-2">
        {/* Interactive Avatar with Live Camera Badge */}
        <div 
          onClick={() => setIsAvatarModalOpen(true)}
          className="interactive"
          style={{ 
            position: 'relative', 
            width: 96, 
            height: 96, 
            borderRadius: '50%', 
            marginBottom: '14px', 
            cursor: 'pointer',
            padding: 3,
            background: 'linear-gradient(135deg, var(--minimal-indigo), var(--minimal-cyan))',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.25)'
          }}
          title="Click to Change Profile Picture (Live Camera / File / Presets)"
        >
          <div 
            style={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: '50%', 
              overflow: 'hidden',
              background: '#18181b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={`${user.firstName} ${user.lastName}`} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : (
              <span className="text-white font-extrabold text-3xl">
                {user.firstName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Camera Hover / Touch Badge */}
          <div 
            style={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'var(--primary)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
              border: '2px solid var(--bg-main)'
            }}
          >
            <Camera size={15} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, letterSpacing: '-0.3px' }}>
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
            <>
              <button 
                className="btn btn-secondary flex items-center gap-2" 
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                onClick={() => setIsAvatarModalOpen(true)}
              >
                <Camera size={15}/> Update Photo
              </button>
              <button 
                className="btn btn-secondary flex items-center gap-2" 
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                onClick={handleShare}
              >
                <Share2 size={15}/> Share Portfolio
              </button>
            </>
          )}
        </div>
      </header>

      {/* 2-Column High-Density Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── LEFT COLUMN: Personal Info, Work Experience & Connected Accounts (5 cols) ── */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {/* Personal Information Card */}
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

          {/* Work Experience Timeline */}
          <div className="glass-panel" style={{ padding: '22px', borderRadius: 'var(--radius-lg)' }}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Briefcase size={16} className="text-primary" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Work Experience</h3>
              </div>
              <button 
                onClick={() => setIsExpModalOpen(true)}
                className="btn btn-secondary flex items-center gap-xs"
                style={{ padding: '4px 10px', fontSize: '0.74rem' }}
              >
                <Plus size={13} /> Add Role
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {experiences.map(exp => (
                <div 
                  key={exp.id}
                  className="p-3 rounded-lg flex flex-col gap-1"
                  style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', position: 'relative' }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0 }}>{exp.role}</h4>
                      <span className="text-primary font-600" style={{ fontSize: '0.78rem' }}>{exp.company}</span>
                    </div>
                    <div className="flex items-center gap-xs">
                      <span className="text-muted" style={{ fontSize: '0.72rem' }}>{exp.duration}</span>
                      <button 
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="btn-icon-tactile text-muted hover:text-danger"
                        style={{ padding: '4px', background: 'transparent', border: 'none', cursor: 'pointer' }}
                        title="Delete Experience"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <span className="text-muted" style={{ fontSize: '0.72rem' }}>📍 {exp.location}</span>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                    {exp.description}
                  </p>
                </div>
              ))}
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

        {/* ── RIGHT COLUMN: Skills Matrix, Certifications & ATS Telemetry (7 cols) ── */}
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

          {/* Professional Skills Matrix with Proficiency Sliders */}
          <div className="glass-panel" style={{ padding: '22px', borderRadius: 'var(--radius-lg)' }}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Cpu size={16} className="text-minimal-cyan" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                  Technical Skills &amp; Proficiency Matrix
                </h3>
              </div>
              <button 
                onClick={() => setIsSkillModalOpen(true)}
                className="btn btn-secondary flex items-center gap-xs"
                style={{ padding: '4px 10px', fontSize: '0.74rem' }}
              >
                <Plus size={13} /> Add Skill
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {skills.map(s => (
                <div 
                  key={s.name}
                  className="p-3 rounded-lg flex flex-col gap-2"
                  style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: '0.86rem', fontWeight: 700 }}>{s.name}</span>
                      <span className="minimal-badge" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>{s.category}</span>
                    </div>
                    <div className="flex items-center gap-xs">
                      <span className="font-mono font-bold" style={{ fontSize: '0.82rem', color: s.color }}>{s.proficiency}%</span>
                      <button 
                        onClick={() => handleDeleteSkill(s.name)}
                        className="btn-icon-tactile text-muted hover:text-danger"
                        style={{ padding: '3px', background: 'transparent', border: 'none', cursor: 'pointer' }}
                        title="Remove Skill"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div style={{ width: '100%', height: 6, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 3, overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${s.proficiency}%`, 
                        height: '100%', 
                        background: s.color || 'var(--primary)',
                        borderRadius: 3,
                        transition: 'width 0.4s ease'
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mastery Achievements & Certifications */}
          <div className="glass-panel" style={{ padding: '22px', borderRadius: 'var(--radius-lg)' }}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Award size={16} className="text-minimal-amber" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                  Certifications &amp; Engineering Licenses
                </h3>
              </div>
              <button 
                onClick={() => setIsCertModalOpen(true)}
                className="btn btn-secondary flex items-center gap-xs"
                style={{ padding: '4px 10px', fontSize: '0.74rem' }}
              >
                <Plus size={13} /> Add Credential
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {certifications.map((cert) => (
                <div 
                  key={cert.id} 
                  className="p-3 rounded-lg flex items-start gap-3 transition-transform hover:scale-[1.01]"
                  style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', position: 'relative' }}
                >
                  <div style={{ width: 38, height: 38, borderRadius: '8px', background: 'var(--bg-card)', border: `1px solid ${cert.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Award size={18} style={{ color: cert.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex justify-between items-start">
                      <p style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, lineHeight: 1.3 }}>{cert.title}</p>
                      <button 
                        onClick={() => handleDeleteCert(cert.id)}
                        className="btn-icon-tactile text-muted hover:text-danger"
                        style={{ padding: '2px', background: 'transparent', border: 'none', cursor: 'pointer' }}
                        title="Remove Credential"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>{cert.issuer} • {cert.issueDate}</p>
                    <span className="font-mono text-muted" style={{ fontSize: '0.66rem' }}>ID: {cert.credentialId}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ── MODAL 1: Multi-Mode Avatar Upload & Live Camera Snapshot ── */}
      {isAvatarModalOpen && ReactDOM.createPortal(
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.75)', zIndex: 10000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px', backdropFilter: 'blur(6px)'
          }}
          onClick={() => { stopCamera(); setIsAvatarModalOpen(false); }}
        >
          <div 
            className="glass-panel animate-scale-in"
            style={{
              maxWidth: '520px', width: '100%', padding: '24px',
              borderRadius: 'var(--radius-xl)', background: 'var(--bg-card)',
              border: '1px solid var(--border-color)', position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-xs">
                <Camera size={18} className="text-primary" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Update Profile Photo</h3>
              </div>
              <button 
                onClick={() => { stopCamera(); setIsAvatarModalOpen(false); }}
                className="btn-icon-tactile"
                style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Mode Tabs */}
            <div className="flex gap-xs p-xs mb-md" style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-md)' }}>
              <button
                onClick={() => setAvatarTab('camera')}
                className={`btn flex-1 ${avatarTab === 'camera' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '8px', fontSize: '0.78rem' }}
              >
                <Camera size={14} /> Live Camera
              </button>
              <button
                onClick={() => setAvatarTab('upload')}
                className={`btn flex-1 ${avatarTab === 'upload' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '8px', fontSize: '0.78rem' }}
              >
                <Upload size={14} /> Upload File
              </button>
              <button
                onClick={() => setAvatarTab('presets')}
                className={`btn flex-1 ${avatarTab === 'presets' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '8px', fontSize: '0.78rem' }}
              >
                <Sparkles size={14} /> Presets
              </button>
            </div>

            {/* TAB 1: Live Camera Snapshot */}
            {avatarTab === 'camera' && (
              <div className="flex flex-col items-center gap-md text-center">
                <div 
                  style={{
                    width: 240,
                    height: 240,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid var(--primary)',
                    background: '#09090b',
                    position: 'relative',
                    boxShadow: '0 0 24px rgba(99, 102, 241, 0.35)'
                  }}
                >
                  <video 
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: 'scaleX(-1)'
                    }}
                  />
                  {!cameraActive && !cameraError && (
                    <div className="flex flex-col items-center justify-center h-full text-muted p-md">
                      <RefreshCw size={24} className="animate-spin mb-xs" />
                      <span style={{ fontSize: '0.78rem' }}>Initializing Camera Viewfinder...</span>
                    </div>
                  )}
                  {cameraError && (
                    <div className="flex flex-col items-center justify-center h-full text-danger p-md">
                      <Info size={24} className="mb-xs" />
                      <span style={{ fontSize: '0.75rem' }}>{cameraError}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-xs">
                  <button
                    onClick={handleCaptureSnapshot}
                    disabled={!cameraActive}
                    className="btn btn-primary flex items-center gap-xs"
                    style={{ padding: '10px 24px', fontSize: '0.86rem' }}
                  >
                    <Camera size={16} /> Capture Live Snapshot
                  </button>
                  <button
                    onClick={startCamera}
                    className="btn btn-secondary flex items-center gap-xs"
                    style={{ padding: '10px 16px', fontSize: '0.86rem' }}
                    title="Restart Camera"
                  >
                    <RefreshCw size={15} />
                  </button>
                </div>
                <span className="text-muted" style={{ fontSize: '0.74rem' }}>
                  Align your face in the circular reticle and click Capture.
                </span>
              </div>
            )}

            {/* TAB 2: File Upload */}
            {avatarTab === 'upload' && (
              <div className="flex flex-col items-center gap-md text-center py-md">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
                <div 
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="interactive p-lg flex flex-col items-center justify-center gap-sm"
                  style={{
                    width: '100%',
                    border: '2px dashed var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    cursor: 'pointer',
                    minHeight: 180
                  }}
                >
                  <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Upload size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0 }}>Click or Drag Image Here</h4>
                    <span className="text-muted" style={{ fontSize: '0.76rem' }}>Supports PNG, JPG, GIF, WebP (Max 5MB)</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Developer Presets */}
            {avatarTab === 'presets' && (
              <div className="grid grid-cols-3 gap-sm py-xs">
                {presetAvatars.map((preset, idx) => (
                  <div 
                    key={idx}
                    onClick={() => {
                      updateAvatar(preset.url);
                      setIsAvatarModalOpen(false);
                      toast.success(`Preset "${preset.label}" selected!`);
                    }}
                    className="interactive p-xs flex flex-col items-center gap-xs rounded-lg"
                    style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', cursor: 'pointer' }}
                  >
                    <img 
                      src={preset.url} 
                      alt={preset.label} 
                      style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} 
                    />
                    <span style={{ fontSize: '0.74rem', fontWeight: 600 }}>{preset.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* ── MODAL 2: Add Work Experience ── */}
      {isExpModalOpen && ReactDOM.createPortal(
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.75)', zIndex: 10000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px', backdropFilter: 'blur(6px)'
          }}
          onClick={() => setIsExpModalOpen(false)}
        >
          <div 
            className="glass-panel animate-scale-in"
            style={{
              maxWidth: '500px', width: '100%', padding: '24px',
              borderRadius: 'var(--radius-xl)', background: 'var(--bg-card)',
              border: '1px solid var(--border-color)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Add Work Experience</h3>
              <X size={18} className="cursor-pointer text-muted hover:text-main" onClick={() => setIsExpModalOpen(false)} />
            </div>

            <div className="flex flex-col gap-3">
              <div className="input-group mb-0">
                <label className="input-label" style={{ fontSize: '0.78rem' }}>Role Title *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Senior Backend Architect" 
                  value={newExp.role} 
                  onChange={e => setNewExp({...newExp, role: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="input-group mb-0">
                  <label className="input-label" style={{ fontSize: '0.78rem' }}>Company / Organization *</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. Google Cloud" 
                    value={newExp.company} 
                    onChange={e => setNewExp({...newExp, company: e.target.value})} 
                  />
                </div>
                <div className="input-group mb-0">
                  <label className="input-label" style={{ fontSize: '0.78rem' }}>Duration</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. 2024 — Present" 
                    value={newExp.duration} 
                    onChange={e => setNewExp({...newExp, duration: e.target.value})} 
                  />
                </div>
              </div>

              <div className="input-group mb-0">
                <label className="input-label" style={{ fontSize: '0.78rem' }}>Location</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Bengaluru, India (Hybrid)" 
                  value={newExp.location} 
                  onChange={e => setNewExp({...newExp, location: e.target.value})} 
                />
              </div>

              <div className="input-group mb-0">
                <label className="input-label" style={{ fontSize: '0.78rem' }}>Key Architectural Deliverables</label>
                <textarea 
                  rows={3} 
                  className="input-field" 
                  placeholder="Describe your technical contributions, latency optimizations, or system impacts..." 
                  value={newExp.description} 
                  onChange={e => setNewExp({...newExp, description: e.target.value})} 
                />
              </div>

              <div className="flex justify-end gap-xs mt-2">
                <button 
                  onClick={() => setIsExpModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddExperience}
                  className="btn btn-primary"
                  style={{ padding: '8px 20px', fontSize: '0.82rem' }}
                >
                  Save Experience
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── MODAL 3: Add Skill to Matrix ── */}
      {isSkillModalOpen && ReactDOM.createPortal(
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.75)', zIndex: 10000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px', backdropFilter: 'blur(6px)'
          }}
          onClick={() => setIsSkillModalOpen(false)}
        >
          <div 
            className="glass-panel animate-scale-in"
            style={{
              maxWidth: '460px', width: '100%', padding: '24px',
              borderRadius: 'var(--radius-xl)', background: 'var(--bg-card)',
              border: '1px solid var(--border-color)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Add Skill to Matrix</h3>
              <X size={18} className="cursor-pointer text-muted hover:text-main" onClick={() => setIsSkillModalOpen(false)} />
            </div>

            <div className="flex flex-col gap-3">
              <div className="input-group mb-0">
                <label className="input-label" style={{ fontSize: '0.78rem' }}>Skill Name *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. GraphQL, Rust, Kafka" 
                  value={newSkill.name} 
                  onChange={e => setNewSkill({...newSkill, name: e.target.value})} 
                />
              </div>

              <div className="input-group mb-0">
                <label className="input-label" style={{ fontSize: '0.78rem' }}>Category</label>
                <select 
                  className="input-field"
                  value={newSkill.category}
                  onChange={e => setNewSkill({...newSkill, category: e.target.value})}
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="AI / ML">AI / ML</option>
                  <option value="Cloud/DevOps">Cloud / DevOps</option>
                  <option value="Database">Database / Storage</option>
                </select>
              </div>

              <div className="input-group mb-0">
                <div className="flex justify-between items-center mb-1">
                  <label className="input-label" style={{ fontSize: '0.78rem', margin: 0 }}>Proficiency Level</label>
                  <span className="font-bold text-primary" style={{ fontSize: '0.84rem' }}>{newSkill.proficiency}%</span>
                </div>
                <input 
                  type="range" 
                  min="40" 
                  max="100" 
                  step="1"
                  value={newSkill.proficiency} 
                  onChange={e => setNewSkill({...newSkill, proficiency: e.target.value})} 
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>

              <div className="flex justify-end gap-xs mt-2">
                <button 
                  onClick={() => setIsSkillModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddSkill}
                  className="btn btn-primary"
                  style={{ padding: '8px 20px', fontSize: '0.82rem' }}
                >
                  Add Skill
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── MODAL 4: Add Certification ── */}
      {isCertModalOpen && ReactDOM.createPortal(
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.75)', zIndex: 10000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px', backdropFilter: 'blur(6px)'
          }}
          onClick={() => setIsCertModalOpen(false)}
        >
          <div 
            className="glass-panel animate-scale-in"
            style={{
              maxWidth: '480px', width: '100%', padding: '24px',
              borderRadius: 'var(--radius-xl)', background: 'var(--bg-card)',
              border: '1px solid var(--border-color)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Add Certification / License</h3>
              <X size={18} className="cursor-pointer text-muted hover:text-main" onClick={() => setIsCertModalOpen(false)} />
            </div>

            <div className="flex flex-col gap-3">
              <div className="input-group mb-0">
                <label className="input-label" style={{ fontSize: '0.78rem' }}>Certification Name *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Certified Kubernetes Administrator (CKA)" 
                  value={newCert.title} 
                  onChange={e => setNewCert({...newCert, title: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="input-group mb-0">
                  <label className="input-label" style={{ fontSize: '0.78rem' }}>Issuing Body *</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. Linux Foundation, AWS" 
                    value={newCert.issuer} 
                    onChange={e => setNewCert({...newCert, issuer: e.target.value})} 
                  />
                </div>
                <div className="input-group mb-0">
                  <label className="input-label" style={{ fontSize: '0.78rem' }}>Issue Date</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. Feb 2025" 
                    value={newCert.issueDate} 
                    onChange={e => setNewCert({...newCert, issueDate: e.target.value})} 
                  />
                </div>
              </div>

              <div className="input-group mb-0">
                <label className="input-label" style={{ fontSize: '0.78rem' }}>Credential ID / License Number</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. CKA-992140" 
                  value={newCert.credentialId} 
                  onChange={e => setNewCert({...newCert, credentialId: e.target.value})} 
                />
              </div>

              <div className="flex justify-end gap-xs mt-2">
                <button 
                  onClick={() => setIsCertModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddCertification}
                  className="btn btn-primary"
                  style={{ padding: '8px 20px', fontSize: '0.82rem' }}
                >
                  Save Credential
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

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
