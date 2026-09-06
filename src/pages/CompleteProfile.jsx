import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Book, Briefcase, GraduationCap, ArrowRight, ArrowLeft, Sparkles, CheckCircle2, Target, Cpu } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import IconInput from '../components/IconInput';
import db from '../services/db';
import { useToast } from '../contexts/ToastContext';
import { getRoadmapForJob } from '../utils/roadmapData';

const domains = [
  'Artificial Intelligence', 'Web Development', 'Cloud Computing', 'Cybersecurity',
  'Data Science', 'UI/UX Design', 'Mobile App Development', 'Game Development',
  'Blockchain', 'Digital Marketing', 'Business Analytics',
];

const featuredDomains = [
  'Artificial Intelligence', 'Web Development', 'Cloud Computing',
  'Cybersecurity', 'Data Science', 'Mobile App Development'
];

const jobs = [
  'Machine Learning Engineer', 'Frontend Developer', 'Backend Developer',
  'Full Stack Engineer', 'DevOps Engineer', 'Cloud Architect',
  'Security Analyst', 'Data Scientist', 'Business Analyst',
  'Product Designer', 'Game Developer', 'Blockchain Engineer',
  'QA Engineer', 'Mobile App Developer',
];

const educationLevels = [
  'B.Tech / B.E. Computer Science',
  'B.S. / B.Sc Information Technology',
  'Master of Science (M.S. / M.Tech)',
  'Self-Taught Software Engineer',
  'Coding Bootcamp Graduate',
  'High School / Associate Degree',
  'Other Engineering Discipline'
];

export default function CompleteProfile() {
  const navigate = useNavigate();
  const toast = useToast();
  const [stage, setStage] = useState(1);
  const [formData, setFormData] = useState(() => {
    const cur = db.getCurrentUser() || {};
    return {
      firstName: cur.firstName || '',
      lastName: cur.lastName || '',
      email: cur.email || '',
      phone: cur.phone || '',
      education: cur.education || 'B.Tech / B.E. Computer Science',
      domain: cur.domain || 'Web Development',
      dreamJob: cur.dreamJob || 'Full Stack Engineer'
    };
  });

  const matchedRoadmap = useMemo(() => {
    return getRoadmapForJob(formData.dreamJob || 'Full Stack Engineer');
  }, [formData.dreamJob]);

  const handleStage1Continue = (e) => {
    e.preventDefault();
    if (!formData.firstName.trim()) {
      toast.error('Please enter your first name.');
      return;
    }
    if (!formData.lastName.trim()) {
      toast.error('Please enter your last name.');
      return;
    }
    setStage(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const matchedDomain = getRoadmapForJob(formData.dreamJob);
    const trackId = matchedDomain?.id || 'fullstack';

    // Persist active roadmap course for all workstations
    localStorage.setItem('nexora_active_course', trackId);

    db.updateUserProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      education: formData.education,
      domain: formData.domain,
      dreamJob: formData.dreamJob,
      selectedTrack: trackId,
      profileCompleted: true
    });

    // Notify all workstation listeners
    window.dispatchEvent(new Event('user_session_changed'));

    toast.success(`Profile calibrated! Assigned ${matchedDomain?.title || formData.dreamJob} roadmap.`);
    navigate('/dashboard');
  };

  // Executive right-hand showcase
  const profileShowcase = (
    <div className="flex flex-col animate-fade-in w-full text-left" style={{ color: '#f4f4f5' }}>
      <div className="flex items-center gap-2 mb-4">
        <span 
          className="minimal-badge" 
          style={{ 
            color: '#a5b4fc', 
            background: 'rgba(99, 102, 241, 0.12)', 
            borderColor: 'rgba(99, 102, 241, 0.28)', 
            padding: '3px 10px' 
          }}
        >
          <Sparkles size={12} className="text-indigo-400" />
          <span>CAREER TRAJECTORY PREVIEW</span>
        </span>
        <span style={{ color: 'rgba(244, 244, 245, 0.5)', fontSize: '0.75rem' }}>· Step {stage} of 2</span>
      </div>

      <h2 
        style={{ 
          fontSize: '1.95rem', 
          fontWeight: 800, 
          lineHeight: 1.28, 
          letterSpacing: '-0.6px', 
          marginBottom: '12px',
          background: 'linear-gradient(135deg, #ffffff 40%, #a5b4fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        Precision Engineering Blueprint.
      </h2>
      <p style={{ color: 'rgba(244, 244, 245, 0.72)', fontSize: '0.92rem', lineHeight: 1.65, marginBottom: '24px' }}>
        NEXORA synthesizes your technical focus into autonomous daily coding sprints, system design challenges, and voice interview telemetry.
      </p>

      {/* Trajectory Preview Card */}
      <div 
        className="rounded-2xl p-5 mb-5" 
        style={{ 
          background: 'radial-gradient(ellipse at top left, rgba(99, 102, 241, 0.15) 0%, rgba(18, 18, 22, 0.75) 80%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)'
        }}
      >
        <div className="flex items-center justify-between text-xs font-mono mb-3" style={{ color: 'rgba(244, 244, 245, 0.6)' }}>
          <span>CALIBRATED TRACK</span>
          <span className="minimal-badge text-[10px]" style={{ color: '#34d399', background: 'rgba(16, 185, 129, 0.12)', borderColor: 'rgba(16, 185, 129, 0.28)' }}>
            OPTIMAL MATCH
          </span>
        </div>

        <div className="p-3.5 rounded-xl mb-3.5" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div className="flex items-center gap-2 mb-1">
            <Target size={15} className="text-indigo-400" />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(244, 244, 245, 0.6)' }}>Target Role</span>
          </div>
          <p className="font-extrabold text-base m-0" style={{ color: '#ffffff' }}>
            {formData.dreamJob || 'Full Stack Engineer'}
          </p>
          <p className="text-xs m-0 mt-0.5" style={{ color: 'rgba(244, 244, 245, 0.65)' }}>
            Focus: {formData.domain || 'Software Engineering'}
          </p>
        </div>

        {/* Milestone Steps */}
        <div className="flex flex-col gap-2">
          {(matchedRoadmap.coreSteps || []).slice(0, 3).map((step, idx) => (
            <div 
              key={step.id || idx}
              className="flex items-center justify-between p-2.5 px-3 rounded-lg"
              style={{ background: idx === 0 ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className={idx === 0 ? "text-indigo-400" : "text-zinc-500"} />
                <span className="text-xs font-semibold" style={{ color: '#ffffff' }}>
                  {step.title}
                </span>
              </div>
              <span className="font-mono text-[11px]" style={{ color: 'rgba(244, 244, 245, 0.55)' }}>Sprint {idx + 1}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs px-1" style={{ color: 'rgba(244, 244, 245, 0.5)' }}>
        <span>Instant Sandbox Provisioning</span>
        <span>Confidential Candidate Data</span>
      </div>
    </div>
  );

  return (
    <AuthLayout
      headline="Personalize Your Career Trajectory."
      subtext="Calibrate your domain focus and target career goals to unlock tailored curriculum roadmaps and AI mock interviews."
      badgeText="EXECUTIVE ONBOARDING"
      badgeSub={`· Stage ${stage} of 2`}
      maxWidth="500px"
      customShowcase={profileShowcase}
    >
      <div className="w-full">
        
        {/* Step Progress Stepper */}
        <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-2">
            <span 
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
              style={{
                background: stage === 1 ? 'var(--minimal-indigo, #6366f1)' : 'rgba(99, 102, 241, 0.25)',
                color: '#ffffff'
              }}
            >
              1
            </span>
            <span className={`text-xs font-semibold ${stage === 1 ? 'text-main' : 'text-muted'}`}>
              Identity &amp; Background
            </span>
          </div>

          <div className="flex-1 h-[1px]" style={{ background: 'var(--border-color)' }} />

          <div className="flex items-center gap-2">
            <span 
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
              style={{
                background: stage === 2 ? 'var(--minimal-indigo, #6366f1)' : 'rgba(255, 255, 255, 0.08)',
                color: stage === 2 ? '#ffffff' : 'var(--text-muted)'
              }}
            >
              2
            </span>
            <span className={`text-xs font-semibold ${stage === 2 ? 'text-main' : 'text-muted'}`}>
              Career Trajectory
            </span>
          </div>
        </div>

        {/* ── STAGE 1: Candidate Identity & Education ── */}
        {stage === 1 && (
          <form onSubmit={handleStage1Continue} className="w-full flex flex-col gap-4 animate-fade-in">
            <div className="mb-2">
              <h1 className="text-gradient text-3xl font-extrabold tracking-tight mb-2">
                Candidate Profile
              </h1>
              <p className="text-muted text-sm leading-relaxed">
                Enter your identity details to calibrate your personalized workspace.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="input-group mb-0">
                <label className="input-label mb-1.5 font-medium text-xs tracking-wide">First Name</label>
                <IconInput
                  icon={<User size={17} />}
                  type="text"
                  placeholder="Rachel"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>

              {/* Last Name */}
              <div className="input-group mb-0">
                <label className="input-label mb-1.5 font-medium text-xs tracking-wide">Last Name</label>
                <IconInput
                  icon={<User size={17} />}
                  type="text"
                  placeholder="Foster"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Highest Education */}
            <div className="input-group mb-2">
              <label className="input-label mb-1.5 font-medium text-xs tracking-wide">Academic Foundation / Education</label>
              <div style={{ position: 'relative' }}>
                <GraduationCap size={17} className="text-muted" style={{ position: 'absolute', top: 14, left: 14 }} />
                <select
                  id="profile-education-select"
                  className="input-field cursor-pointer"
                  style={{ paddingLeft: '2.75rem', width: '100%', appearance: 'none', borderRadius: 'var(--radius-md)' }}
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                >
                  {educationLevels.map((lvl, i) => (
                    <option key={i} value={lvl}>{lvl}</option>
                  ))}
                </select>
                <div style={{ position: 'absolute', top: 16, right: 14, pointerEvents: 'none' }}>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full flex items-center justify-center gap-2 mt-3 cursor-pointer"
              style={{ padding: '13px', fontSize: '0.94rem', borderRadius: 'var(--radius-md)' }}
            >
              <span>Continue to Career Trajectory</span>
              <ArrowRight size={17} />
            </button>
          </form>
        )}

        {/* ── STAGE 2: Domain Focus & Target Role ── */}
        {stage === 2 && (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 animate-fade-in">
            <div className="mb-1">
              <h1 className="text-gradient text-3xl font-extrabold tracking-tight mb-2">
                Career Calibration
              </h1>
              <p className="text-muted text-sm leading-relaxed">
                Select your primary specialization and target career role.
              </p>
            </div>

            {/* Quick-Select Domain Chips */}
            <div>
              <label className="input-label mb-2 block font-medium text-xs tracking-wide">Primary Domain Focus</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2.5">
                {featuredDomains.map((dom) => (
                  <button
                    key={dom}
                    type="button"
                    onClick={() => setFormData({ ...formData, domain: dom })}
                    className="p-2.5 px-3 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer truncate"
                    style={{
                      background: formData.domain === dom ? 'rgba(99, 102, 241, 0.15)' : 'var(--input-bg)',
                      border: formData.domain === dom ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                      color: formData.domain === dom ? 'var(--primary)' : 'var(--text-muted)',
                      boxShadow: formData.domain === dom ? '0 0 12px rgba(99, 102, 241, 0.2)' : 'none'
                    }}
                  >
                    {dom}
                  </button>
                ))}
              </div>

              {/* All Domains Dropdown */}
              <div style={{ position: 'relative' }}>
                <Book size={17} className="text-muted" style={{ position: 'absolute', top: 14, left: 14 }} />
                <select
                  id="profile-domain-select"
                  className="input-field cursor-pointer"
                  style={{ paddingLeft: '2.75rem', width: '100%', appearance: 'none', borderRadius: 'var(--radius-md)' }}
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  required
                >
                  {domains.map((d, i) => <option key={i} value={d}>{d}</option>)}
                </select>
                <div style={{ position: 'absolute', top: 16, right: 14, pointerEvents: 'none' }}>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Target Dream Job */}
            <div>
              <label className="input-label mb-2 block font-medium text-xs tracking-wide">Target Role / Career Objective</label>
              <div style={{ position: 'relative' }}>
                <Briefcase size={17} className="text-muted" style={{ position: 'absolute', top: 14, left: 14 }} />
                <select
                  id="profile-dreamjob-select"
                  className="input-field cursor-pointer"
                  style={{ paddingLeft: '2.75rem', width: '100%', appearance: 'none', borderRadius: 'var(--radius-md)' }}
                  value={formData.dreamJob}
                  onChange={(e) => setFormData({ ...formData, dreamJob: e.target.value })}
                  required
                >
                  {jobs.map((j, i) => <option key={i} value={j}>{j}</option>)}
                </select>
                <div style={{ position: 'absolute', top: 16, right: 14, pointerEvents: 'none' }}>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center gap-3 mt-2 w-full">
              <button
                type="button"
                onClick={() => setStage(1)}
                className="btn btn-secondary flex items-center justify-center gap-1.5 cursor-pointer"
                style={{ width: 'auto', flexShrink: 0, padding: '13px 22px', borderRadius: 'var(--radius-md)' }}
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>

              <button 
                type="submit" 
                id="complete-profile-submit-btn"
                className="btn btn-primary flex-1 flex items-center justify-center gap-2 cursor-pointer"
                style={{ width: 'auto', minWidth: 0, padding: '13px 20px', fontSize: '0.94rem', borderRadius: 'var(--radius-md)' }}
              >
                <span>Calibrate &amp; Launch</span>
                <ArrowRight size={17} />
              </button>
            </div>
          </form>
        )}

      </div>
    </AuthLayout>
  );
}
