import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, Target, Rocket, ArrowRight, Sparkles, 
  Code2, Cpu, Cloud, Shield, Smartphone, CheckCircle2,
  DollarSign, Clock, Users, Award, Zap, ChevronRight
} from 'lucide-react';
import db from '../services/db';

const careerTracks = [
  {
    id: 'ai',
    title: 'AI & Machine Learning Engineer',
    desc: 'Deep neural networks, LLM fine-tuning, RAG, and production MLOps.',
    icon: Cpu,
    salary: '$125,000 – $185,000',
    weeks: '16 Weeks',
    skills: ['PyTorch', 'Transformers', 'FastAPI', 'Vector DBs'],
    demand: 'Very High (98%)'
  },
  {
    id: 'fullstack',
    title: 'Full-Stack Software Engineer',
    desc: 'High-performance React web apps, Node.js APIs, and SQL architectures.',
    icon: Code2,
    salary: '$105,000 – $160,000',
    weeks: '14 Weeks',
    skills: ['React 19', 'TypeScript', 'Node.js', 'PostgreSQL'],
    demand: 'High (95%)'
  },
  {
    id: 'devops',
    title: 'Cloud & DevOps Architect',
    desc: 'Kubernetes orchestration, Terraform infrastructure as code, CI/CD.',
    icon: Cloud,
    salary: '$115,000 – $170,000',
    weeks: '15 Weeks',
    skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform'],
    demand: 'High (94%)'
  },
  {
    id: 'cyber',
    title: 'Cybersecurity Analyst',
    desc: 'Network vulnerability assessment, threat intelligence, and OWASP defense.',
    icon: Shield,
    salary: '$100,000 – $155,000',
    weeks: '16 Weeks',
    skills: ['Wireshark', 'Linux Hardening', 'OWASP Top 10', 'SIEM'],
    demand: 'Very High (96%)'
  },
  {
    id: 'mobile',
    title: 'Mobile Systems Engineer',
    desc: 'Cross-platform React Native architectures, mobile UX, offline sync.',
    icon: Smartphone,
    salary: '$105,000 – $150,000',
    weeks: '14 Weeks',
    skills: ['React Native', 'Expo', 'Mobile Security', 'Animation'],
    demand: 'Moderate (90%)'
  }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [selectedTrack, setSelectedTrack] = useState(careerTracks[0]);
  const [experienceLevel, setExperienceLevel] = useState('Beginner / Student');
  const [primaryGoal, setPrimaryGoal] = useState('Land High-Paying Tech Offer');

  const handleStart = () => {
    // Persist user orientation preferences
    const currentUser = db.getCurrentUser() || {};
    db.saveUser({
      ...currentUser,
      dreamJob: selectedTrack.title,
      experienceLevel,
      primaryGoal,
      careerMatch: 94
    });
    navigate('/signup');
  };

  return (
    <div className="workstation-container animate-fade-in flex flex-col gap-md" style={{ minHeight: '100vh', padding: '16px 20px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      
      {/* ── Top Bar ── */}
      <div className="flex justify-between items-center py-xs" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div className="flex items-center gap-xs">
          <div className="brand-logo-hex skeuo-convex" style={{ width: 32, height: 32 }}>
            <Sparkles size={16} className="text-primary" />
          </div>
          <span className="font-bold text-gradient" style={{ fontSize: '1.1rem', letterSpacing: '-0.3px' }}>NEXORA PRO</span>
        </div>

        <div className="flex items-center gap-sm">
          <button 
            onClick={() => navigate('/login')} 
            className="text-muted text-sm font-semibold hover:text-main transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={handleStart} 
            className="btn btn-primary"
            style={{ padding: '6px 16px', fontSize: '0.82rem' }}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* ── High-Density Split-Screen Workstation ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg flex-1 items-start" style={{ marginTop: 'var(--space-sm)' }}>
        
        {/* ── LEFT PANE: Interactive Career Configurator (7 Columns on Desktop) ── */}
        <div className="lg:col-span-7 flex flex-col gap-md">
          <div>
            <div className="flex items-center gap-xs mb-xs">
              <span className="badge font-bold text-primary" style={{ background: 'var(--primary-glow)', fontSize: '0.72rem' }}>
                ORIENTATION WORKSTATION
              </span>
              <span className="text-muted" style={{ fontSize: '0.75rem' }}>• 3-Minute Setup</span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.5px', margin: '2px 0 6px 0', lineHeight: 1.2 }}>
              Configure Your Career Trajectory
            </h1>
            <p className="text-muted" style={{ fontSize: '0.92rem', margin: 0, lineHeight: 1.5 }}>
              Select your target technical discipline. NEXORA’s AI will calibrate your personalized curriculum, code challenges, and mock interviews.
            </p>
          </div>

          {/* Mobile Live Snapshot (Visible on mobile/tablet, hidden on desktop) */}
          <div className="lg:hidden p-3 rounded-xl skeuo-convex" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', margin: '4px 0' }}>
            <div className="flex justify-between items-center mb-1">
              <span className="minimal-badge" style={{ color: 'var(--minimal-indigo)', fontSize: '0.68rem' }}>
                <Sparkles size={11} /> LIVE PREVIEW
              </span>
              <span className="text-minimal-emerald font-bold" style={{ fontSize: '0.74rem' }}>
                94% Match Probability
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <div>
                <p className="font-bold text-main" style={{ fontSize: '0.88rem', margin: 0 }}>{selectedTrack.title}</p>
                <p className="text-muted" style={{ fontSize: '0.74rem', margin: 0 }}>{selectedTrack.weeks} Target · {selectedTrack.skills.slice(0, 2).join(', ')}</p>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-minimal-emerald" style={{ fontSize: '0.85rem' }}>{selectedTrack.salary.split('–')[0]}</span>
              </div>
            </div>
          </div>

          {/* Step 1: Career Track Selection */}
          <div>
            <div className="flex justify-between items-center mb-xs">
              <span className="text-muted font-bold" style={{ fontSize: '0.78rem', letterSpacing: '0.5px' }}>
                STEP 01 · SELECT TARGET DISCIPLINE
              </span>
              <span className="text-primary font-bold" style={{ fontSize: '0.76rem' }}>
                {selectedTrack.title}
              </span>
            </div>

            <div className="flex flex-col gap-xs">
              {careerTracks.map((track) => {
                const Icon = track.icon;
                const isSelected = selectedTrack.id === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => setSelectedTrack(track)}
                    className={`skeuo-convex interactive transition-all flex items-center justify-between p-sm rounded-md ${isSelected ? 'ring-2 ring-primary' : ''}`}
                    style={{
                      background: isSelected ? 'var(--bg-card)' : 'var(--skeuo-surface-grad)',
                      border: '1px solid var(--border-color)',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 0 14px var(--primary-glow)' : 'var(--skeuo-bevel-light)'
                    }}
                  >
                    <div className="flex items-center gap-sm">
                      <div className="skeuo-well" style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 2px 0', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {track.title}
                        </h4>
                        <p className="text-muted" style={{ margin: 0, fontSize: '0.76rem', lineHeight: 1.3 }}>
                          {track.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-sm">
                      <span className="badge text-success font-bold hidden sm:inline" style={{ fontSize: '0.7rem' }}>
                        {track.demand}
                      </span>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', border: isSelected ? '5px solid var(--primary)' : '2px solid var(--border-color)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Experience Tier */}
          <div>
            <span className="text-muted font-bold block mb-xs" style={{ fontSize: '0.78rem', letterSpacing: '0.5px' }}>
              STEP 02 · CURRENT EXPERIENCE TIER
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-xs">
              {['Beginner / Student', 'Junior (1-2 Yrs)', 'Career Transitioner'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setExperienceLevel(lvl)}
                  className={`tab-pill text-center ${experienceLevel === lvl ? 'active' : ''}`}
                  style={{ fontSize: '0.82rem', padding: '10px 12px', borderRadius: 'var(--radius-md)' }}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Primary Objective */}
          <div>
            <span className="text-muted font-bold block mb-xs" style={{ fontSize: '0.78rem', letterSpacing: '0.5px' }}>
              STEP 03 · PRIMARY CAREER OBJECTIVE
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-xs">
              {[
                'Land High-Paying Offer',
                'Master Architectures',
                'Ace FAANG Interviews'
              ].map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => setPrimaryGoal(goal)}
                  className={`tab-pill text-center ${primaryGoal === goal ? 'active' : ''}`}
                  style={{ fontSize: '0.82rem', padding: '10px 12px', borderRadius: 'var(--radius-md)' }}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Action CTA */}
          <div className="pt-sm">
            <button 
              onClick={handleStart} 
              className="btn btn-primary w-full flex items-center justify-center gap-xs"
              style={{ padding: '12px 24px', fontSize: '0.94rem', borderRadius: 'var(--radius-md)' }}
            >
              <span>Initialize Career Trajectory</span>
              <ArrowRight size={17} />
            </button>
            <p className="text-muted text-center" style={{ fontSize: '0.75rem', marginTop: '8px' }}>
              No credit card required · Free 14-day full platform access
            </p>
          </div>
        </div>

        {/* ── RIGHT PANE: Live Real-Time Telemetry Canvas (5 Columns on Desktop) ── */}
        <div className="lg:col-span-5 flex flex-col gap-md">
          <div className="glass-panel skeuo-convex" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
            
            <div className="flex justify-between items-center mb-sm">
              <span className="badge" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', fontWeight: 700, fontSize: '0.72rem' }}>
                LIVE TRAJECTORY PREVIEW
              </span>
              <span className="text-muted tabular-numbers" style={{ fontSize: '0.75rem' }}>
                94% Match Probability
              </span>
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.3px' }}>
              {selectedTrack.title}
            </h3>
            <p className="text-muted" style={{ fontSize: '0.84rem', margin: 0, lineHeight: 1.45 }}>
              Optimized for candidates targeting Tier-1 tech firms and high-growth venture-backed startups.
            </p>

            {/* Benchmarks Matrix */}
            <div className="grid grid-cols-2 gap-sm my-md">
              <div className="skeuo-well" style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)' }}>
                <div className="flex items-center gap-xs mb-xs text-muted">
                  <DollarSign size={14} className="text-success" />
                  <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>Market Comp Band</span>
                </div>
                <p className="tabular-numbers font-bold text-main" style={{ fontSize: '0.96rem', margin: 0 }}>
                  {selectedTrack.salary}
                </p>
              </div>

              <div className="skeuo-well" style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)' }}>
                <div className="flex items-center gap-xs mb-xs text-muted">
                  <Clock size={14} className="text-primary" />
                  <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>Estimated Timeline</span>
                </div>
                <p className="tabular-numbers font-bold text-main" style={{ fontSize: '0.96rem', margin: 0 }}>
                  {selectedTrack.weeks} Target
                </p>
              </div>
            </div>

            {/* Core Competencies Preview */}
            <div className="mb-md">
              <span className="text-muted font-bold block mb-xs" style={{ fontSize: '0.76rem', textTransform: 'uppercase' }}>
                Key Technical Competencies
              </span>
              <div className="flex flex-wrap gap-xs">
                {selectedTrack.skills.map((s, i) => (
                  <span 
                    key={i} 
                    className="badge font-bold" 
                    style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.74rem', background: 'var(--input-bg)' }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Initial Milestones Preview */}
            <div className="mb-md">
              <span className="text-muted font-bold block mb-xs" style={{ fontSize: '0.76rem', textTransform: 'uppercase' }}>
                Calibrated Milestone Roadmap
              </span>
              <div className="flex flex-col gap-xs">
                {[
                  { step: '01', title: 'Foundational Systems & Core Runtimes', time: 'Weeks 1-3' },
                  { step: '02', title: 'Production Architectures & Data Pipelines', time: 'Weeks 4-7' },
                  { step: '03', title: 'Distributed Microservices & Cloud Ingress', time: 'Weeks 8-11' },
                  { step: '04', title: 'ATS Resume Calibration & FAANG Mock Interviews', time: 'Weeks 12-14' }
                ].map((m) => (
                  <div key={m.step} className="skeuo-well flex items-center justify-between p-xs px-sm rounded-md" style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                    <div className="flex items-center gap-xs">
                      <span className="text-primary font-bold" style={{ fontSize: '0.75rem' }}>{m.step}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{m.title}</span>
                    </div>
                    <span className="text-muted" style={{ fontSize: '0.7rem' }}>{m.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Proof Footer */}
            <div className="flex items-center gap-xs pt-sm" style={{ borderTop: '1px solid var(--border-color)' }}>
              <Users size={16} className="text-accent" />
              <span className="text-muted" style={{ fontSize: '0.78rem' }}>
                Joined by <strong>14,850+ engineers</strong> building on NEXORA.
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
