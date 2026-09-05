import { 
  Check, Clock, Lock, Sparkles, Layers, BookOpen, 
  ArrowRight, Compass, CheckCircle2, ChevronRight, Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getRoadmapForJob, ROADMAP_DOMAINS } from '../utils/roadmapData';
import db from '../services/db';

export default function Roadmap() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({ firstName: 'Alex', dreamJob: 'Machine Learning Engineer' });
  const [activeTab, setActiveTab] = useState('core'); // 'core' | 'subset'
  const [roadmapData, setRoadmapData] = useState(null);
  const [stepStates, setStepStates] = useState({});

  useEffect(() => {
    const user = db.getCurrentUser();
    setCurrentUser(user);
    const domain = getRoadmapForJob(user.dreamJob);
    setRoadmapData(domain);

    // Load saved step progress from localStorage
    try {
      const savedProgress = JSON.parse(localStorage.getItem(`nexora_roadmap_prog_${domain.id}`) || '{}');
      setStepStates(savedProgress);
    } catch {
      setStepStates({});
    }
  }, []);

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
    }
  };

  const toggleStepStatus = (stepId, e) => {
    e.stopPropagation();
    const currentStatus = stepStates[stepId] || getInitialStatus(stepId);
    let nextStatus = 'in-progress';
    if (currentStatus === 'in-progress') nextStatus = 'completed';
    else if (currentStatus === 'completed') nextStatus = 'locked';
    else if (currentStatus === 'locked') nextStatus = 'in-progress';

    const newStates = { ...stepStates, [stepId]: nextStatus };
    setStepStates(newStates);
    if (roadmapData) {
      localStorage.setItem(`nexora_roadmap_prog_${roadmapData.id}`, JSON.stringify(newStates));
    }
  };

  const getInitialStatus = (stepId) => {
    if (!roadmapData) return 'locked';
    const allSteps = [...roadmapData.coreSteps, ...(roadmapData.subset?.steps || [])];
    const found = allSteps.find(s => s.id === stepId);
    return found ? found.status : 'locked';
  };

  const getEffectiveStatus = (stepId) => {
    return stepStates[stepId] !== undefined ? stepStates[stepId] : getInitialStatus(stepId);
  };

  if (!roadmapData) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '50vh' }}>
        <p className="text-muted">Loading your personalized roadmap...</p>
      </div>
    );
  }

  const currentList = activeTab === 'core' ? roadmapData.coreSteps : (roadmapData.subset?.steps || []);
  const completedCount = currentList.filter(s => getEffectiveStatus(s.id) === 'completed').length;
  const progressPercent = Math.round((completedCount / Math.max(currentList.length, 1)) * 100);

  return (
    <div className="animate-fade-in flex flex-col gap-md" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* ── Roadmap Header ── */}
      <header className="glass-panel" style={{ padding: 'var(--space-md) var(--space-lg)', borderRadius: 'var(--radius-lg)' }}>
        <div className="flex justify-between items-start flex-wrap gap-sm">
          <div>
            <div className="flex items-center gap-xs mb-xs">
              <Compass className="text-primary" size={18} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--primary)' }}>
                Personalized Career Path · {roadmapData.category}
              </span>
            </div>
            <h1 className="text-gradient" style={{ fontSize: '1.6rem', fontWeight: '800', margin: '2px 0 6px 0' }}>
              {roadmapData.title}
            </h1>
            <p className="text-muted" style={{ fontSize: '0.88rem', maxWidth: '680px', lineHeight: 1.45, margin: 0 }}>
              {roadmapData.description}
            </p>
          </div>

          {/* Quick Domain Selector Dropdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignSelf: 'center' }}>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Explore Other Tracks</label>
            <select
              value={roadmapData.id}
              onChange={(e) => handleJobChange(e.target.value)}
              className="input-field"
              style={{ padding: '6px 12px', fontSize: '0.82rem', borderRadius: 'var(--radius-full)', background: 'var(--input-bg)' }}
            >
              {Object.entries(ROADMAP_DOMAINS).map(([key, domain]) => (
                <option key={key} value={key}>
                  {domain.category || domain.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Overall Track Progress Bar */}
        <div style={{ marginTop: 'var(--space-md)', paddingTop: 'var(--space-sm)', borderTop: '1px solid var(--border-color)' }}>
          <div className="flex justify-between items-center mb-xs">
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {activeTab === 'core' ? 'Core Milestones Completed' : 'Specialization Subset Progress'}
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
              {completedCount} of {currentList.length} Modules ({progressPercent}%)
            </span>
          </div>
          <div className="skeuo-progress-track" style={{ height: '9px' }}>
            <div 
              className="skeuo-progress-bar"
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
        </div>
      </header>

      {/* ── Subsets & Track Switcher Tabs (Skeuomorphic Sunken Track + Rocker) ── */}
      <div className="skeuo-tab-track flex-wrap" style={{ marginTop: '2px', alignSelf: 'flex-start' }}>
        <button
          onClick={() => setActiveTab('core')}
          className={`skeuo-tab-btn flex items-center gap-xs ${activeTab === 'core' ? 'active' : ''}`}
        >
          <Layers size={16} />
          <span>Core Career Track ({roadmapData.coreSteps.length} Milestones)</span>
        </button>

        {roadmapData.subset && (
          <button
            onClick={() => setActiveTab('subset')}
            className={`skeuo-tab-btn flex items-center gap-xs ${activeTab === 'subset' ? 'active' : ''}`}
          >
            <Sparkles size={16} />
            <span>{roadmapData.subset.title}</span>
            <span style={{ fontSize: '0.68rem', background: 'var(--secondary)', color: 'white', padding: '1px 6px', borderRadius: '999px', fontWeight: 700 }}>
              Subset
            </span>
          </button>
        )}
      </div>

      {/* Subset Overview Banner (if subset active) */}
      {activeTab === 'subset' && roadmapData.subset && (
        <div 
          className="glass-panel animate-fade-in"
          style={{ 
            padding: '12px 16px', 
            borderRadius: 'var(--radius-md)', 
            background: 'rgba(244, 63, 94, 0.06)', 
            border: '1px solid rgba(244, 63, 94, 0.2)' 
          }}
        >
          <p style={{ fontSize: '0.84rem', margin: 0, color: 'var(--text-main)', lineHeight: 1.45 }}>
            <strong className="text-secondary">Specialization Track:</strong> {roadmapData.subset.description}
          </p>
        </div>
      )}

      {/* ── Interactive Timeline ── */}
      <div className="roadmap-timeline flex flex-col relative" style={{ marginTop: '4px' }}>
        <div style={{ 
          position: 'absolute', 
          left: '23px', 
          top: '25px', 
          bottom: '25px', 
          width: '2px', 
          background: 'var(--border-color)',
          zIndex: 0
        }} />

        {currentList.map((step, index) => {
          const status = getEffectiveStatus(step.id);
          return (
            <div 
              key={step.id} 
              className="flex gap-md relative animate-fade-in" 
              style={{ marginBottom: 'var(--space-md)', zIndex: 1, animationDelay: `${index * 80}ms` }}
            >
              {/* Timeline status indicator node */}
              <div 
                className="flex-shrink-0 flex items-center justify-center cursor-pointer" 
                style={{ width: 48 }}
                onClick={(e) => toggleStepStatus(step.id, e)}
                title="Click to change status (Locked -> In Progress -> Completed)"
              >
                {status === 'completed' && (
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)' }}>
                    <Check size={17} color="white" strokeWidth={3} />
                  </div>
                )}
                {status === 'in-progress' && (
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px var(--primary-glow)' }}>
                    <Clock size={17} color="white" />
                  </div>
                )}
                {status === 'locked' && (
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--input-bg)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Lock size={16} className="text-muted" />
                  </div>
                )}
              </div>

              {/* Step Card */}
              <div 
                className={`glass-panel interactive flex-1 ${status === 'locked' ? 'opacity-70' : ''}`} 
                style={{ 
                  padding: 'var(--space-md)', 
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  border: status === 'in-progress' ? '1px solid var(--primary)' : '1px solid var(--border-color)'
                }}
                onClick={() => {
                  navigate('/resources', { state: { topic: step } });
                }}
              >
                <div className="flex justify-between items-start flex-wrap gap-xs mb-xs">
                  <div className="flex items-center gap-sm">
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      STEP {index + 1}
                    </span>
                    <span style={{ fontSize: '0.72rem', padding: '1px 8px', borderRadius: '999px', background: 'var(--input-bg)', color: 'var(--text-muted)' }}>
                      ⏱️ {step.estimatedTime}
                    </span>
                    {status === 'completed' && (
                      <span style={{ fontSize: '0.68rem', padding: '1px 7px', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', fontWeight: 700 }}>
                        Completed
                      </span>
                    )}
                    {status === 'in-progress' && (
                      <span style={{ fontSize: '0.68rem', padding: '1px 7px', borderRadius: '999px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', fontWeight: 700 }}>
                        Active
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => toggleStepStatus(step.id, e)}
                    className="skeuo-pill"
                    style={{
                      fontSize: '0.72rem',
                      padding: '3px 10px',
                    }}
                    title="Toggle completion status"
                  >
                    Mark {status === 'completed' ? 'Incomplete' : 'Complete'}
                  </button>
                </div>

                <h3 style={{ 
                  fontSize: '1.02rem', 
                  fontWeight: '700', 
                  margin: '2px 0 4px 0', 
                  color: status === 'in-progress' ? 'var(--primary)' : 'inherit' 
                }}>
                  {step.title}
                </h3>
                
                <p className="text-muted" style={{ fontSize: '0.84rem', margin: '0 0 8px 0', lineHeight: 1.45 }}>
                  {step.description}
                </p>

                {/* Skills tags & Resource action */}
                <div className="flex justify-between items-center flex-wrap gap-xs">
                  <div className="flex gap-xs flex-wrap">
                    {step.skills.map((skill) => (
                      <span
                        key={skill}
                        className="skeuo-well"
                        style={{
                          fontSize: '0.7rem',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--text-main)',
                          fontWeight: 500
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div 
                    className="flex items-center gap-xs btn-icon-tactile text-primary" 
                    style={{ fontSize: '0.78rem', fontWeight: 700, padding: '5px 12px', borderRadius: 'var(--radius-full)' }}
                  >
                    <span>Explore Learning Materials</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
