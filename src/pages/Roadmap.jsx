import { 
  Check, Clock, Lock, Sparkles, BookOpen, 
  ArrowRight, Compass, CheckCircle2, ChevronRight,
  ExternalLink, Code2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getRoadmapForJob, ROADMAP_DOMAINS } from '../utils/roadmapData';
import { getResourcesForStep } from '../utils/resourceData';
import { useToast } from '../contexts/ToastContext';
import db from '../services/db';
import realtimeDb from '../services/realtimeDb';

// Helper to resolve active domain from user's calibrated dreamJob first, then saved course
function getActiveRoadmapDomain() {
  const user = db.getCurrentUser();
  if (user?.dreamJob) {
    const domain = getRoadmapForJob(user.dreamJob);
    if (domain) return domain;
  }
  const savedCourseId = localStorage.getItem('nexora_active_course');
  if (savedCourseId && ROADMAP_DOMAINS[savedCourseId]) {
    return ROADMAP_DOMAINS[savedCourseId];
  }
  return getRoadmapForJob('Full Stack Engineer');
}

export default function Roadmap() {
  const navigate = useNavigate();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('core'); // 'core' | 'subset'
  const [currentUser, setCurrentUser] = useState(() => db.getCurrentUser());
  const [roadmapData, setRoadmapData] = useState(() => getActiveRoadmapDomain());

  const [stepStates, setStepStates] = useState(() => {
    try {
      const domain = getActiveRoadmapDomain();
      const saved = JSON.parse(localStorage.getItem(`nexora_roadmap_prog_${domain.id}`) || '{}');
      return saved;
    } catch {
      return {};
    }
  });

  const [selectedStep, setSelectedStep] = useState(() => {
    const domain = getActiveRoadmapDomain();
    return domain.coreSteps?.[0] || null;
  });

  const [stepResources, setStepResources] = useState(() => {
    const domain = getActiveRoadmapDomain();
    const firstStep = domain.coreSteps?.[0];
    return firstStep ? getResourcesForStep(firstStep) : [];
  });

  // Synchronize roadmap whenever user changes dreamJob in CompleteProfile or Profile
  useEffect(() => {
    const handleSync = () => {
      const user = db.getCurrentUser();
      setCurrentUser(user);
      const activeDomain = getActiveRoadmapDomain();
      if (activeDomain && (activeDomain.id !== roadmapData?.id || activeDomain.title !== roadmapData?.title)) {
        setRoadmapData(activeDomain);
        try {
          const savedProgress = JSON.parse(localStorage.getItem(`nexora_roadmap_prog_${activeDomain.id}`) || '{}');
          setStepStates(savedProgress);
        } catch {
          setStepStates({});
        }
        const firstStep = activeDomain.coreSteps?.[0] || null;
        setSelectedStep(firstStep);
        setStepResources(firstStep ? getResourcesForStep(firstStep) : []);
        setActiveTab('core');
      }
    };

    window.addEventListener('user_session_changed', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('user_session_changed', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [roadmapData?.id, roadmapData?.title]);

  // Subscribe to Firebase Realtime Database for roadmap milestones
  useEffect(() => {
    const user = db.getCurrentUser();
    const uid = user?.id || user?.uid;
    if (!uid || !roadmapData?.id) return;

    const unsubscribe = realtimeDb.subscribeToRoadmap(uid, roadmapData.id, (remoteSteps) => {
      if (remoteSteps && Object.keys(remoteSteps).length > 0) {
        setStepStates(prev => ({ ...prev, ...remoteSteps }));
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [roadmapData?.id]);

  const handleJobChange = (domainKey) => {
    const domain = ROADMAP_DOMAINS[domainKey];
    if (domain) {
      setRoadmapData(domain);
      try {
        const savedProgress = JSON.parse(localStorage.getItem(`nexora_roadmap_prog_${domain.id}`) || '{}');
        setStepStates(savedProgress);
      } catch {
        setStepStates({});
      }
      const firstStep = domain.coreSteps?.[0] || null;
      setSelectedStep(firstStep);
      setStepResources(getResourcesForStep(firstStep));

      // Persist active course across the platform and notify subscribers
      localStorage.setItem('nexora_active_course', domain.id);
      db.updateUserProfile({
        dreamJob: domain.title,
        selectedTrack: domain.id
      });
      window.dispatchEvent(new Event('user_session_changed'));

      toast.info(`Switched trajectory to ${domain.title}`);
    }
  };

  const handleSelectStep = (step) => {
    setSelectedStep(step);
    setStepResources(getResourcesForStep(step));
  };

  const getStepStatus = (stepId) => {
    if (stepStates[stepId]) return stepStates[stepId];
    // Default: first step in-progress, rest locked
    if (roadmapData?.coreSteps?.[0]?.id === stepId) return 'in-progress';
    return 'locked';
  };

  const toggleStepStatus = (stepId, e) => {
    if (e) e.stopPropagation();
    const currentStatus = getStepStatus(stepId);
    let nextStatus = 'in-progress';
    if (currentStatus === 'in-progress') {
      nextStatus = 'completed';
      toast.success('Milestone completed! +50 XP awarded');
    } else if (currentStatus === 'completed') {
      nextStatus = 'locked';
      toast.info('Milestone reset');
    } else if (currentStatus === 'locked') {
      nextStatus = 'in-progress';
      toast.info('Milestone marked in progress');
    }

    const newStates = { ...stepStates, [stepId]: nextStatus };
    setStepStates(newStates);
    if (roadmapData) {
      localStorage.setItem(`nexora_roadmap_prog_${roadmapData.id}`, JSON.stringify(newStates));
      window.dispatchEvent(new Event('user_session_changed'));
    }

    // Persist to Firebase Realtime Database
    const user = db.getCurrentUser();
    const uid = user?.id || user?.uid;
    if (uid && roadmapData?.id) {
      realtimeDb.setRoadmapStep(uid, roadmapData.id, stepId, nextStatus);
    }
  };

  if (!roadmapData) return null;

  const activeSteps = activeTab === 'core' 
    ? (roadmapData.coreSteps || []) 
    : (roadmapData.subset?.steps || roadmapData.subsets || []);

  // Compute completion percent
  const completedStepsCount = activeSteps.filter(s => getStepStatus(s.id) === 'completed').length;
  const trackPercent = Math.round((completedStepsCount / Math.max(activeSteps.length, 1)) * 100);

  return (
    <div className="workstation-container animate-fade-in flex flex-col gap-md">
      
      {/* ── Top Header & Domain Switcher ── */}
      <header className="glass-panel skeuo-convex" style={{ padding: '18px 24px', borderRadius: 'var(--radius-lg)' }}>
        <div className="flex justify-between items-center flex-wrap gap-md">
          <div>
            <div className="flex items-center gap-xs mb-xs flex-wrap">
              <Compass size={18} className="text-primary" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--primary)' }}>
                DYNAMIC CAREER WORKSTATION
              </span>
              {currentUser?.dreamJob && (
                <span className="minimal-badge" style={{ fontSize: '0.72rem', color: 'var(--minimal-indigo)', borderColor: 'rgba(99, 102, 241, 0.25)' }}>
                  <Sparkles size={11} className="text-minimal-indigo" />
                  <span>Calibrated for: {currentUser.dreamJob}</span>
                </span>
              )}
            </div>
            <h1 style={{ fontSize: '1.55rem', fontWeight: 800, margin: '2px 0', letterSpacing: '-0.4px' }}>
              {roadmapData.title} Track
            </h1>
            <p className="text-muted" style={{ fontSize: '0.86rem', margin: 0 }}>
              {roadmapData.description}
            </p>
          </div>

          <div className="flex items-center gap-sm flex-wrap">
            {/* Domain Selector */}
            <div className="flex items-center gap-xs">
              <span className="text-muted hidden sm:inline" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Switch Track:</span>
              <select 
                value={roadmapData.id} 
                onChange={(e) => handleJobChange(e.target.value)}
                className="skeuo-convex"
                style={{ 
                  background: 'var(--bg-card)', 
                  color: 'var(--text-main)', 
                  border: '1px solid var(--border-color)', 
                  padding: '7px 12px', 
                  borderRadius: 'var(--radius-md)', 
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {Object.keys(ROADMAP_DOMAINS).map((key) => (
                  <option key={key} value={key}>
                    {ROADMAP_DOMAINS[key].title}
                  </option>
                ))}
              </select>
            </div>

            {/* Core vs Subset Toggle */}
            <div className="flex skeuo-well p-xs rounded-full">
              <button 
                onClick={() => {
                  setActiveTab('core');
                  const firstStep = roadmapData.coreSteps?.[0];
                  setSelectedStep(firstStep);
                  setStepResources(getResourcesForStep(firstStep));
                }}
                className={`btn-tactile ${activeTab === 'core' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '5px 14px', fontSize: '0.78rem', borderRadius: 'var(--radius-full)' }}
              >
                Core Steps ({roadmapData.coreSteps?.length || 0})
              </button>
              <button 
                onClick={() => {
                  setActiveTab('subset');
                  const subsetSteps = roadmapData.subset?.steps || roadmapData.subsets || [];
                  const firstSubset = subsetSteps[0] || null;
                  setSelectedStep(firstSubset);
                  setStepResources(firstSubset ? getResourcesForStep(firstSubset) : []);
                }}
                className={`btn-tactile ${activeTab === 'subset' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '5px 14px', fontSize: '0.78rem', borderRadius: 'var(--radius-full)' }}
              >
                Electives ({roadmapData.subset?.steps?.length || roadmapData.subsets?.length || 0})
              </button>
            </div>
          </div>
        </div>

        {/* Track Completion Bar */}
        <div className="flex items-center gap-sm mt-md pt-sm" style={{ borderTop: '1px solid var(--border-color)' }}>
          <div className="flex-1 skeuo-well" style={{ height: '8px', borderRadius: '9999px', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${trackPercent}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                borderRadius: '9999px',
                transition: 'width 0.3s ease'
              }} 
            />
          </div>
          <span className="tabular-numbers text-primary font-bold" style={{ fontSize: '0.85rem' }}>
            {completedStepsCount}/{activeSteps.length} Milestones ({trackPercent}%)
          </span>
        </div>
      </header>

      {/* ── Dual-Pane Responsive Workstation (Eliminates All Wasted Gutter Space) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md" style={{ alignItems: 'start' }}>
        
        {/* ── LEFT PANE: Milestone Journey Tree (5 Columns on Desktop) ── */}
        <div className="lg:col-span-5 flex flex-col gap-sm">
          <div className="flex justify-between items-center px-xs">
            <span className="text-muted" style={{ fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.5px' }}>
              CURRICULUM MILESTONES
            </span>
            <span className="text-muted" style={{ fontSize: '0.74rem' }}>
              Click node to inspect deep dive
            </span>
          </div>

          <div className="flex flex-col gap-sm">
            {activeSteps.map((step, index) => {
              const status = getStepStatus(step.id);
              const isSelected = selectedStep?.id === step.id;

              return (
                <div 
                  key={step.id}
                  onClick={() => handleSelectStep(step)}
                  className={`skeuo-convex interactive transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
                  style={{ 
                    padding: '14px 16px', 
                    borderRadius: 'var(--radius-md)', 
                    background: isSelected ? 'var(--bg-card)' : 'var(--skeuo-surface-grad)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 0 16px var(--primary-glow)' : 'var(--skeuo-bevel-light)'
                  }}
                >
                  <div className="flex items-start gap-sm">
                    {/* Node status toggle icon */}
                    <button
                      onClick={(e) => toggleStepStatus(step.id, e)}
                      className="skeuo-well"
                      style={{ 
                        width: 32, 
                        height: 32, 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        border: 'none',
                        cursor: 'pointer',
                        flexShrink: 0,
                        color: status === 'completed' ? 'var(--success)' : status === 'in-progress' ? 'var(--primary)' : 'var(--text-muted)'
                      }}
                      title={`Status: ${status} (click to toggle)`}
                    >
                      {status === 'completed' && <Check size={16} />}
                      {status === 'in-progress' && <Clock size={16} />}
                      {status === 'locked' && <Lock size={15} />}
                    </button>

                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                          Step 0{index + 1}
                        </span>
                        <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                          {step.duration || '2-3 weeks'}
                        </span>
                      </div>
                      <h4 style={{ margin: '2px 0', fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {step.title}
                      </h4>
                      <p className="text-muted" style={{ margin: 0, fontSize: '0.78rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {step.description}
                      </p>
                    </div>

                    <ChevronRight size={16} className={`text-muted ${isSelected ? 'text-primary' : ''}`} style={{ alignSelf: 'center' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT PANE: Milestone Deep-Dive Workstation (7 Columns on Desktop) ── */}
        <div className="lg:col-span-7 flex flex-col gap-md">
          {selectedStep ? (
            <div className="glass-panel skeuo-convex flex flex-col gap-md" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
              
              {/* Header */}
              <div className="flex justify-between items-start flex-wrap gap-sm">
                <div>
                  <div className="flex items-center gap-xs mb-xs">
                    <span className="badge" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 700 }}>
                      INSPECTION WORKSTATION
                    </span>
                    <span className="text-muted" style={{ fontSize: '0.78rem' }}>•</span>
                    <span className="text-muted" style={{ fontSize: '0.78rem', fontWeight: 600 }}>Estimated: {selectedStep.duration || '2-3 weeks'}</span>
                  </div>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '2px 0 6px 0', letterSpacing: '-0.3px' }}>
                    {selectedStep.title}
                  </h2>
                  <p className="text-muted" style={{ fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>
                    {selectedStep.description}
                  </p>
                </div>

                {/* State Toggle Button */}
                <button
                  onClick={() => toggleStepStatus(selectedStep.id)}
                  className={`btn ${getStepStatus(selectedStep.id) === 'completed' ? 'btn-secondary' : 'btn-primary'} flex items-center gap-xs`}
                  style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                >
                  <CheckCircle2 size={16} className={getStepStatus(selectedStep.id) === 'completed' ? 'text-success' : ''} />
                  <span>
                    {getStepStatus(selectedStep.id) === 'completed' ? 'Completed (+50 XP)' : 'Mark as Completed'}
                  </span>
                </button>
              </div>

              {/* Skills / Key Deliverables Pill Row */}
              {selectedStep.skills && (
                <div>
                  <h5 style={{ margin: '0 0 8px 0', fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Required Technical Competencies
                  </h5>
                  <div className="flex flex-wrap gap-xs">
                    {selectedStep.skills.map((skill, i) => (
                      <span 
                        key={i} 
                        className="badge font-bold" 
                        style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.74rem', background: 'var(--input-bg)' }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Real-Time Learning Resources for Selected Milestone */}
              <div>
                <div className="flex justify-between items-center mb-sm">
                  <div className="flex items-center gap-xs">
                    <BookOpen size={16} className="text-primary" />
                    <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 800 }}>
                      Real-Time Verified Learning Resources ({stepResources.length})
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
                  {stepResources.map((res) => (
                    <div 
                      key={res.id}
                      onClick={() => navigate(`/resource/${res.id}`, { state: { resource: res } })}
                      className="skeuo-convex interactive flex flex-col justify-between"
                      style={{ 
                        padding: '14px', 
                        borderRadius: 'var(--radius-md)', 
                        background: 'var(--bg-card)', 
                        border: '1px solid var(--border-color)',
                        cursor: 'pointer' 
                      }}
                    >
                      <div>
                        <div className="flex justify-between items-center mb-xs">
                          <span className="badge" style={{ fontSize: '0.66rem', fontWeight: 700, background: 'var(--primary-glow)', color: 'var(--primary)' }}>
                            {res.type}
                          </span>
                          <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                            {res.duration}
                          </span>
                        </div>
                        <h5 style={{ margin: '0 0 4px 0', fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>
                          {res.title}
                        </h5>
                        <p className="text-muted" style={{ margin: 0, fontSize: '0.75rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {res.description}
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-xs mt-sm" style={{ borderTop: '1px solid var(--border-color)' }}>
                        <span className="text-muted" style={{ fontSize: '0.72rem', fontWeight: 600 }}>{res.source}</span>
                        <span className="text-primary flex items-center gap-xs" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                          Launch <ExternalLink size={12} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestone Practical Challenge & Interview Concept */}
              <div className="skeuo-well" style={{ padding: '16px', borderRadius: 'var(--radius-md)' }}>
                <div className="flex justify-between items-center mb-xs">
                  <div className="flex items-center gap-xs">
                    <Code2 size={16} className="text-primary" />
                    <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>Milestone Practical Challenge</span>
                  </div>
                  <span className="badge text-success font-bold" style={{ fontSize: '0.68rem' }}>Production Ready</span>
                </div>
                <p className="text-muted" style={{ fontSize: '0.78rem', margin: '4px 0 10px 0', lineHeight: 1.45 }}>
                  Deliverable: Build, test, and benchmark a working production module for <strong>{selectedStep.title}</strong> adhering to industry best practices.
                </p>
                <div className="flex justify-between items-center pt-xs" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <span className="text-muted" style={{ fontSize: '0.74rem' }}>
                    💡 <em>Interview Concept: Architecture tradeoffs & latency optimization</em>
                  </span>
                  {stepResources.length > 0 && (
                    <button
                      onClick={() => navigate(`/resource/${stepResources[0].id}`, { state: { resource: stepResources[0] } })}
                      className="btn btn-secondary flex items-center gap-xs"
                      style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                    >
                      <span>Open Lab Studio</span>
                      <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              </div>

              {/* Quick AI Mentor Assist Button */}
              <div className="flex justify-between items-center pt-sm" style={{ borderTop: '1px solid var(--border-color)' }}>
                <span className="text-muted" style={{ fontSize: '0.82rem' }}>
                  Stuck on this milestone?
                </span>
                <button 
                  onClick={() => navigate('/chatbot')}
                  className="btn btn-secondary flex items-center gap-xs"
                  style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                >
                  <Sparkles size={14} className="text-primary" />
                  <span>Ask AI Mentor About {selectedStep.title.split(' ')[0]}</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="glass-panel flex items-center justify-center p-xl text-center" style={{ minHeight: '380px', borderRadius: 'var(--radius-lg)' }}>
              <p className="text-muted">Select any milestone from the left tree to inspect learning resources.</p>
            </div>
          )}
        </div>

      </div>

  </div>
);
}
