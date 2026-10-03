import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, ArrowLeft, Sparkles, Check, CheckCircle2,
  Code2, Cpu, Cloud, Shield, Smartphone,
  DollarSign, Clock, Users, GraduationCap, Briefcase, 
  Target, Award, Zap, Compass
} from 'lucide-react';
import { NexoraIcon } from '../../components/common/NexoraLogo';
import userService from '../../services/userService';

const careerTracks = [
  {
    id: 'ai',
    title: 'AI & Machine Learning Engineer',
    desc: 'Deep neural networks, LLM fine-tuning, RAG pipelines, and production MLOps.',
    icon: Cpu,
    salary: '$125,000 – $185,000',
    weeks: '16 Weeks',
    skills: ['PyTorch', 'Transformers', 'FastAPI', 'Vector DBs'],
    demand: 'Very High (98%)',
    milestones: [
      { step: '01', title: 'Foundational Systems & Python Runtimes', time: 'Weeks 1-3' },
      { step: '02', title: 'Statistical Modeling & Data Pipelines', time: 'Weeks 4-7' },
      { step: '03', title: 'Deep Neural Networks & Transformers', time: 'Weeks 8-12' },
      { step: '04', title: 'Production MLOps & Triton Serving', time: 'Weeks 13-16' }
    ]
  },
  {
    id: 'fullstack',
    title: 'Full-Stack Software Engineer',
    desc: 'High-performance React 19 web apps, Node.js APIs, and scalable SQL architectures.',
    icon: Code2,
    salary: '$105,000 – $160,000',
    weeks: '14 Weeks',
    skills: ['React 19', 'TypeScript', 'Node.js', 'PostgreSQL'],
    demand: 'High (95%)',
    milestones: [
      { step: '01', title: 'Modern React 19 & State Architecture', time: 'Weeks 1-3' },
      { step: '02', title: 'REST & GraphQL Microservices in Node', time: 'Weeks 4-7' },
      { step: '03', title: 'Database Optimization & Relational SQL', time: 'Weeks 8-10' },
      { step: '04', title: 'Full-Stack Deployment & CI/CD Pipeline', time: 'Weeks 11-14' }
    ]
  },
  {
    id: 'devops',
    title: 'Cloud & DevOps Architect',
    desc: 'Kubernetes orchestration, Terraform infrastructure as code, and automated CI/CD.',
    icon: Cloud,
    salary: '$115,000 – $170,000',
    weeks: '15 Weeks',
    skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform'],
    demand: 'High (94%)',
    milestones: [
      { step: '01', title: 'Linux Internals & Containerization', time: 'Weeks 1-3' },
      { step: '02', title: 'Multi-Cloud Architecture & AWS Ingress', time: 'Weeks 4-7' },
      { step: '03', title: 'Kubernetes Cluster Management & Helm', time: 'Weeks 8-11' },
      { step: '04', title: 'Infrastructure as Code via Terraform', time: 'Weeks 12-15' }
    ]
  },
  {
    id: 'cyber',
    title: 'Cybersecurity Analyst',
    desc: 'Network vulnerability assessment, threat intelligence, SIEM, and OWASP defense.',
    icon: Shield,
    salary: '$100,000 – $155,000',
    weeks: '16 Weeks',
    skills: ['Wireshark', 'Linux Hardening', 'OWASP Top 10', 'SIEM'],
    demand: 'Very High (96%)',
    milestones: [
      { step: '01', title: 'Network Security Fundamentals & Protocols', time: 'Weeks 1-3' },
      { step: '02', title: 'Threat Intelligence & Vulnerability Audits', time: 'Weeks 4-7' },
      { step: '03', title: 'SOC Operations & SIEM Telemetry Logs', time: 'Weeks 8-11' },
      { step: '04', title: 'Ethical Hacking & Incident Response', time: 'Weeks 12-16' }
    ]
  },
  {
    id: 'mobile',
    title: 'Mobile Systems Engineer',
    desc: 'Cross-platform React Native architectures, mobile UX performance, and offline sync.',
    icon: Smartphone,
    salary: '$105,000 – $150,000',
    weeks: '14 Weeks',
    skills: ['React Native', 'Expo', 'Mobile Security', 'Animation'],
    demand: 'Moderate (90%)',
    milestones: [
      { step: '01', title: 'Mobile UI Patterns & Gesture Engines', time: 'Weeks 1-3' },
      { step: '02', title: 'Offline-First Storage & Realtime Sync', time: 'Weeks 4-7' },
      { step: '03', title: 'Native Device APIs & Bridge Runtimes', time: 'Weeks 8-10' },
      { step: '04', title: 'App Store Optimization & Security Audit', time: 'Weeks 11-14' }
    ]
  }
];

const experienceTiers = [
  {
    id: 'beginner',
    title: 'Early Career / Student',
    desc: 'Foundational programming knowledge looking to bridge academic concepts with real-world industry projects.',
    icon: GraduationCap,
    level: 'Foundational'
  },
  {
    id: 'junior',
    title: 'Junior Professional (1–2 Yrs)',
    desc: 'Working engineer seeking rapid skill acceleration to achieve high-bar Tier-1 and senior benchmarks.',
    icon: Briefcase,
    level: 'Accelerated'
  },
  {
    id: 'pivot',
    title: 'Career Transitioner',
    desc: 'Experienced professional from adjacent engineering or quantitative disciplines transitioning into specialized tech.',
    icon: Zap,
    level: 'Specialized'
  }
];

const careerGoals = [
  {
    id: 'offer',
    title: 'Land Tier-1 Tech Offer',
    desc: 'Target FAANG & top enterprise engineering roles with calibrated ATS resumes and algorithmic prep.',
    icon: Award,
    badge: 'Top Priority'
  },
  {
    id: 'mastery',
    title: 'Master Systems Architecture',
    desc: 'Develop deep expertise in high-concurrency architectures, microservices, and distributed cloud runtimes.',
    icon: Target,
    badge: 'Deep Tech'
  },
  {
    id: 'interview',
    title: 'Ace Technical Interviews',
    desc: 'Proctored live voice AI mock interviews, behavioral rounds, and system design benchmark testing.',
    icon: Sparkles,
    badge: 'Interview Lab'
  }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTrack, setSelectedTrack] = useState(careerTracks[0]);
  const [experienceLevel, setExperienceLevel] = useState(experienceTiers[0].title);
  const [primaryGoal, setPrimaryGoal] = useState(careerGoals[0].title);

  const handleStart = () => {
    const onboardingPayload = userService.buildOnboardingPayload({
      track: selectedTrack.id,
      currentStage: experienceLevel,
      goals: [primaryGoal],
      dreamJob: selectedTrack.title
    });
    sessionStorage.setItem('nexora_onboarding_data', JSON.stringify(onboardingPayload));
    const currentUser = userService.getCurrentProfile() || {};
    userService.updateProfile({
      ...currentUser,
      dreamJob: selectedTrack.title,
      selectedTrack: selectedTrack.id,
      experienceLevel,
      primaryGoal,
      careerMatch: 94
    });
    localStorage.setItem('nexora_active_course', selectedTrack.id);
    navigate('/signup');
  };

  const steps = [
    { num: 1, title: 'Target Discipline', subtitle: 'Select Track' },
    { num: 2, title: 'Experience & Goals', subtitle: 'Calibrate Level' },
    { num: 3, title: 'Executive Blueprint', subtitle: 'Verify Roadmap' }
  ];

  return (
    <div className="workstation-container animate-fade-in flex flex-col gap-6" style={{ minHeight: '100vh', padding: '24px 20px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      
      {/* ── Top Navigation Bar ── */}
      <header className="flex justify-between items-center pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div className="flex items-center gap-3">
          <NexoraIcon size={32} withGlow />
          <div>
            <span className="font-bold text-gradient" style={{ fontSize: '1.15rem', letterSpacing: '-0.3px' }}>NEXORA</span>
            <span className="text-muted ml-2 text-xs font-semibold uppercase tracking-wider hidden sm:inline">Orientation Lab</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-muted font-medium hidden sm:inline">Already have an account?</span>
          <button 
            onClick={() => navigate('/login')} 
            className="btn btn-secondary text-xs font-semibold px-4 py-2"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* ── Progressive Stepper Progress Ribbon ── */}
      <nav aria-label="Orientation Steps" className="glass-panel p-4 sm:p-5 rounded-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-6 flex-1 max-w-2xl">
          {steps.map((s, idx) => {
            const isCurrent = currentStep === s.num;
            const isCompleted = currentStep > s.num;
            return (
              <div 
                key={s.num} 
                onClick={() => isCompleted && setCurrentStep(s.num)}
                className={`flex items-center gap-3 flex-1 transition-all ${isCompleted ? 'cursor-pointer hover:opacity-90' : ''}`}
              >
                <div 
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-all flex-shrink-0 ${
                    isCompleted 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm' 
                      : isCurrent 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-500/30' 
                        : 'bg-card text-muted border border-border'
                  }`}
                >
                  {isCompleted ? <Check size={16} strokeWidth={2.5} /> : `0${s.num}`}
                </div>
                <div className="hidden md:block">
                  <p className={`text-xs font-bold leading-none mb-1 ${isCurrent ? 'text-main' : isCompleted ? 'text-muted' : 'text-muted/60'}`}>
                    {s.title}
                  </p>
                  <p className="text-[11px] text-muted/70 leading-none">
                    {s.subtitle}
                  </p>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`hidden sm:block flex-1 h-[2px] rounded-full mx-2 transition-all ${isCompleted ? 'bg-emerald-500/50' : 'bg-border'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Indicator Pill */}
        <div className="flex items-center gap-2">
          <span className="badge font-mono text-[11px] font-bold px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            STEP {currentStep} OF 3
          </span>
        </div>
      </nav>

      {/* ── Main Dual-Rail Workstation ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ── LEFT PANE: Progressive Step Wizard Content (7 Columns on Desktop) ── */}
        <main className="lg:col-span-7 flex flex-col gap-6">
          
          {/* STEP 1: Select Target Discipline */}
          {currentStep === 1 && (
            <div className="animate-fade-in flex flex-col gap-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-indigo-400">
                    <Compass size={14} /> Career Architecture
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-main m-0 leading-tight">
                  Choose Your Target Discipline
                </h1>
                <p className="text-muted text-sm mt-1.5 leading-relaxed">
                  Select the engineering specialization you want to master. NEXORA calibrates your live roadmap, coding benchmarks, and interview telemetry to match tier-1 requirements.
                </p>
              </div>

              {/* Discipline Cards Grid */}
              <div className="flex flex-col gap-3.5 pt-1">
                {careerTracks.map((track) => {
                  const Icon = track.icon;
                  const isSelected = selectedTrack.id === track.id;
                  return (
                    <div
                      key={track.id}
                      onClick={() => setSelectedTrack(track)}
                      className={`relative group rounded-2xl p-5 sm:p-6 transition-all cursor-pointer border ${
                        isSelected 
                          ? 'bg-gradient-to-r from-indigo-500/10 via-card to-card border-indigo-500/60 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30' 
                          : 'bg-card/70 hover:bg-card border-border hover:border-border-hover'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div 
                            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                              isSelected 
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' 
                                : 'bg-input text-muted group-hover:text-indigo-400'
                            }`}
                          >
                            <Icon size={24} />
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="text-base font-bold text-main m-0 group-hover:text-indigo-300 transition-colors">
                                {track.title}
                              </h3>
                              <span className="badge text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {track.demand}
                              </span>
                            </div>
                            <p className="text-muted text-xs sm:text-sm leading-relaxed m-0 pr-2">
                              {track.desc}
                            </p>

                            {/* Skills Pills */}
                            <div className="flex items-center gap-1.5 flex-wrap mt-3">
                              {track.skills.map((skill) => (
                                <span 
                                  key={skill}
                                  className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-input text-muted border border-border/50"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Radio Selection Indicator */}
                        <div className="pt-1 flex-shrink-0">
                          <div 
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected 
                                ? 'border-indigo-500 bg-indigo-600' 
                                : 'border-border group-hover:border-border-hover'
                            }`}
                          >
                            {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Wizard Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-xs text-muted">
                  Selected: <strong className="text-main">{selectedTrack.title}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="btn btn-primary flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
                >
                  <span>Continue to Experience</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Experience Tier & Primary Objective */}
          {currentStep === 2 && (
            <div className="animate-fade-in flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-indigo-400">
                    <Target size={14} /> Background Calibration
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-main m-0 leading-tight">
                  Your Experience & Target Goal
                </h1>
                <p className="text-muted text-sm mt-1.5 leading-relaxed">
                  Help NEXORA benchmark your current foundation. We customize problem set difficulties and timeline projections accordingly.
                </p>
              </div>

              {/* Experience Tier Selector */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted block mb-3">
                  Current Experience Tier
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {experienceTiers.map((tier) => {
                    const Icon = tier.icon;
                    const isSelected = experienceLevel === tier.title;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => setExperienceLevel(tier.title)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                          isSelected 
                            ? 'bg-gradient-to-b from-indigo-500/15 to-card border-indigo-500/60 ring-1 ring-indigo-500/30 shadow-md' 
                            : 'bg-card/70 hover:bg-card border-border hover:border-border-hover'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-indigo-600 text-white' : 'bg-input text-muted'}`}>
                            <Icon size={20} />
                          </div>
                          <span className={`text-[11px] font-bold uppercase tracking-wider ${isSelected ? 'text-indigo-400' : 'text-muted'}`}>
                            {tier.level}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-main m-0 mb-1">
                            {tier.title}
                          </h4>
                          <p className="text-xs text-muted m-0 leading-relaxed">
                            {tier.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Primary Objective Selector */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted block mb-3">
                  Primary Career Objective
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {careerGoals.map((goal) => {
                    const Icon = goal.icon;
                    const isSelected = primaryGoal === goal.title;
                    return (
                      <div
                        key={goal.id}
                        onClick={() => setPrimaryGoal(goal.title)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                          isSelected 
                            ? 'bg-gradient-to-b from-indigo-500/15 to-card border-indigo-500/60 ring-1 ring-indigo-500/30 shadow-md' 
                            : 'bg-card/70 hover:bg-card border-border hover:border-border-hover'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-indigo-600 text-white' : 'bg-input text-muted'}`}>
                            <Icon size={20} />
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isSelected ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-input text-muted border-border'}`}>
                            {goal.badge}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-main m-0 mb-1">
                            {goal.title}
                          </h4>
                          <p className="text-xs text-muted m-0 leading-relaxed">
                            {goal.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Wizard Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="btn btn-secondary flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Tracks</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="btn btn-primary flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
                >
                  <span>Review Blueprint</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Executive Blueprint & Trajectory Confirmation */}
          {currentStep === 3 && (
            <div className="animate-fade-in flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-emerald-400">
                    <CheckCircle2 size={14} /> Calibration Complete
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-main m-0 leading-tight">
                  Your Calibrated Engineering Blueprint
                </h1>
                <p className="text-muted text-sm mt-1.5 leading-relaxed">
                  Review your personalized execution track. Upon account creation, your interactive roadmap, mock interviews, and ATS resume scoring will be activated.
                </p>
              </div>

              {/* Executive Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-panel p-4.5 rounded-2xl border border-border">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-1">
                    Target Role
                  </span>
                  <p className="text-base font-bold text-main m-0 leading-snug">
                    {selectedTrack.title}
                  </p>
                  <span className="badge text-[11px] mt-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                    {selectedTrack.demand}
                  </span>
                </div>

                <div className="glass-panel p-4.5 rounded-2xl border border-border">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-1">
                    Experience Tier
                  </span>
                  <p className="text-base font-bold text-main m-0 leading-snug">
                    {experienceLevel}
                  </p>
                  <span className="badge text-[11px] mt-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    Personalized Path
                  </span>
                </div>

                <div className="glass-panel p-4.5 rounded-2xl border border-border">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-1">
                    Primary Goal
                  </span>
                  <p className="text-base font-bold text-main m-0 leading-snug">
                    {primaryGoal}
                  </p>
                  <span className="badge text-[11px] mt-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold">
                    Active Sprint
                  </span>
                </div>
              </div>

              {/* Milestones Sequence Card */}
              <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Compass size={18} className="text-indigo-400" />
                    <h3 className="text-sm font-bold text-main m-0">
                      Curriculum Milestones ({selectedTrack.weeks})
                    </h3>
                  </div>
                  <span className="text-xs text-muted font-mono">4 Core Phases</span>
                </div>

                <div className="flex flex-col gap-3">
                  {selectedTrack.milestones.map((m, idx) => (
                    <div 
                      key={m.step}
                      className="p-3.5 rounded-xl bg-input/60 border border-border/50 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center text-xs font-bold font-mono flex-shrink-0">
                          {m.step}
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-main m-0 leading-tight">
                            {m.title}
                          </p>
                          <span className="text-[11px] text-muted">Phase 0{idx + 1} Execution</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-medium text-muted flex-shrink-0">
                        {m.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Launch Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="btn btn-secondary flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl w-full sm:w-auto"
                >
                  <ArrowLeft size={14} />
                  <span>Adjust Preferences</span>
                </button>
                <button
                  type="button"
                  onClick={handleStart}
                  className="btn btn-primary flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold rounded-xl shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/40 w-full sm:w-auto"
                >
                  <span>Initialize Career Trajectory</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

        </main>

        {/* ── RIGHT PANE: Elite Executive Telemetry Preview Panel (5 Columns on Desktop) ── */}
        <aside className="lg:col-span-5 flex flex-col gap-5 sticky top-6">
          <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-indigo-500/20 shadow-xl shadow-black/10 bg-gradient-to-b from-card via-card to-card/90 relative overflow-hidden">
            
            {/* Ambient subtle glow */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Live Telemetry Beacon Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/80">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400">
                  AI Calibration Engine Active
                </span>
              </div>
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                94% Match
              </span>
            </div>

            {/* Track Hero Banner */}
            <div className="pt-5 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                  <selectedTrack.icon size={22} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-main m-0 leading-snug">
                    {selectedTrack.title}
                  </h3>
                  <span className="text-xs text-muted">Tier-1 Hiring Track</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted leading-relaxed m-0 mt-2">
                {selectedTrack.desc}
              </p>
            </div>

            {/* Metrics Matrix */}
            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="p-3.5 rounded-xl bg-input/60 border border-border/60">
                <div className="flex items-center gap-1.5 text-muted mb-1">
                  <DollarSign size={14} className="text-emerald-400" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Comp Band</span>
                </div>
                <p className="text-sm sm:text-base font-bold font-mono text-main m-0">
                  {selectedTrack.salary.split('–')[0]}
                </p>
                <span className="text-[10px] text-muted">Base + Equity</span>
              </div>

              <div className="p-3.5 rounded-xl bg-input/60 border border-border/60">
                <div className="flex items-center gap-1.5 text-muted mb-1">
                  <Clock size={14} className="text-indigo-400" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Velocity</span>
                </div>
                <p className="text-sm sm:text-base font-bold font-mono text-main m-0">
                  {selectedTrack.weeks}
                </p>
                <span className="text-[10px] text-muted">To Job-Ready</span>
              </div>
            </div>

            {/* Key Competencies Chip Cloud */}
            <div className="mb-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-2">
                Target Competency Matrix
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedTrack.skills.map((skill) => (
                  <span 
                    key={skill}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-input text-main border border-border/70"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Calibrated Milestone Preview (Timeline Style) */}
            <div className="mb-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-3">
                Calibrated Milestone Progression
              </span>
              <div className="relative pl-5 border-l-2 border-indigo-500/20 flex flex-col gap-3.5">
                {selectedTrack.milestones.map((m, idx) => (
                  <div key={m.step} className="relative">
                    {/* Timeline Node Dot */}
                    <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-card border-2 border-indigo-500" />
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-main m-0 leading-tight">
                        {m.title}
                      </p>
                      <span className="text-[10px] font-mono text-muted flex-shrink-0">
                        {m.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Executive Social Proof Footer */}
            <div className="flex items-center gap-2.5 pt-4 border-t border-border/80">
              <Users size={16} className="text-indigo-400 flex-shrink-0" />
              <p className="text-xs text-muted m-0 leading-normal">
                Joined by <strong className="text-main font-semibold">14,850+ engineers</strong> at Google, Stripe, Meta, and high-growth startups.
              </p>
            </div>

          </div>
        </aside>

      </div>

    </div>
  );
}
