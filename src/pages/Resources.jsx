import { useState, useEffect } from 'react';
import { 
  BookOpen, Video, ExternalLink, ArrowLeft, Search, Filter, 
  CheckCircle2, Sparkles, Clock, Layers, Star, Play, ChevronRight, Award
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import db from '../services/db';
import { getRoadmapForJob } from '../utils/roadmapData';
import { TOPIC_RESOURCES } from '../utils/resourceData';

export default function Resources() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = db.getCurrentUser() || {};
  const dreamJob = currentUser.dreamJob || 'Full-Stack Developer';

  // Load roadmap corresponding to user's dream job
  const roadmap = getRoadmapForJob(dreamJob);
  const coreSteps = roadmap.coreSteps || [];

  // Initial step: from location state or 'all'
  const initialTopic = location.state?.topic;
  const [selectedMilestone, setSelectedMilestone] = useState(initialTopic ? initialTopic.id : 'all');
  const [selectedType, setSelectedType] = useState('all'); // 'all', 'Course', 'Article', 'Project'
  const [searchQuery, setSearchQuery] = useState('');
  const [completedResourceIds, setCompletedResourceIds] = useState(() => {
    try {
      const saved = localStorage.getItem('nexora_completed_resources');
      return saved ? JSON.parse(saved) : ['fs_1_1'];
    } catch {
      return ['fs_1_1'];
    }
  });

  const handleToggleComplete = (resId, e) => {
    e.stopPropagation();
    let updated;
    if (completedResourceIds.includes(resId)) {
      updated = completedResourceIds.filter(id => id !== resId);
    } else {
      updated = [...completedResourceIds, resId];
      // Reward XP
      db.updateUserProfile({
        xp: (currentUser.xp || 1200) + 40
      });
    }
    setCompletedResourceIds(updated);
    try {
      localStorage.setItem('nexora_completed_resources', JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to save completed resources:', err);
    }
  };

  // Aggregate all resources across roadmap steps
  const allMilestoneResources = [];
  coreSteps.forEach(step => {
    const stepResources = TOPIC_RESOURCES[step.id] || [
      {
        id: `${step.id}_default_1`,
        title: `${step.title} Masterclass & Architecture`,
        type: 'Course',
        source: 'NEXORA Academy',
        description: `Comprehensive production walkthrough on ${step.skills?.join(', ') || 'core principles'}.`,
        content: 'video'
      },
      {
        id: `${step.id}_default_2`,
        title: `Production System Blueprint: ${step.title}`,
        type: 'Article',
        source: 'Engineering Digest',
        description: `In-depth technical specification and real-world trade-off analysis.`,
        content: 'article'
      },
      {
        id: `${step.id}_default_3`,
        title: `Interactive Lab: Implement ${step.title}`,
        type: 'Project',
        source: 'GitHub Labs',
        description: `Hands-on coding repository with automated test cases and benchmarks.`,
        content: 'external'
      }
    ];

    stepResources.forEach(res => {
      allMilestoneResources.push({
        ...res,
        stepId: step.id,
        stepTitle: step.title,
        estimatedTime: step.estimatedTime
      });
    });
  });

  // Filter logic
  const filteredResources = allMilestoneResources.filter(res => {
    // Milestone filter
    if (selectedMilestone !== 'all' && res.stepId !== selectedMilestone) {
      return false;
    }

    // Type filter
    if (selectedType !== 'all' && res.type !== selectedType) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = 
        res.title.toLowerCase().includes(q) ||
        res.description?.toLowerCase().includes(q) ||
        res.stepTitle?.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const renderIcon = (type) => {
    if (type === 'Course') return <Video size={18} className="text-primary" />;
    if (type === 'Article') return <BookOpen size={18} className="text-accent" />;
    return <ExternalLink size={18} className="text-secondary" />;
  };

  return (
    <div className="animate-fade-in flex flex-col gap-lg" style={{ paddingBottom: '5rem' }}>

      {/* ── Top Header ── */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
        <div>
          {initialTopic && (
            <button
              onClick={() => navigate('/roadmap')}
              className="flex items-center gap-xs btn-icon-tactile mb-xs text-muted"
              style={{ fontSize: '0.82rem', padding: '5px 12px', borderRadius: 'var(--radius-full)' }}
            >
              <ArrowLeft size={16} /> Back to Personalized Roadmap
            </button>
          )}
          <div className="flex items-center gap-xs text-primary font-600 mb-xs" style={{ fontSize: '0.82rem' }}>
            <Sparkles size={14} /> DYNAMIC ROADMAP-ALIGNED CURRICULUM
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.3px', margin: '2px 0' }}>
            Learning Resources for {dreamJob}
          </h1>
          <p className="text-muted" style={{ fontSize: '0.9rem', margin: 0 }}>
            Curated specifically for your active milestone trajectory. Master concepts, study architecture specs, and complete labs.
          </p>
        </div>

        <div className="flex items-center gap-sm">
          <div className="glass-panel" style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={16} className="text-success" />
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
              {completedResourceIds.length} / {allMilestoneResources.length} Completed
            </span>
          </div>
        </div>
      </header>

      {/* ── Active Roadmap Milestones Selector ── */}
      <div className="flex flex-col gap-xs">
        <span className="text-muted font-600" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Filter by Active Roadmap Milestone
        </span>
        <div className="flex gap-xs overflow-x-auto w-full pb-xs">
          <button
            onClick={() => setSelectedMilestone('all')}
            className="skeuo-pill shrink-0"
            style={{
              padding: '6px 14px',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: selectedMilestone === 'all' ? 'var(--primary)' : 'var(--card-bg)',
              color: selectedMilestone === 'all' ? '#fff' : 'var(--text-muted)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer'
            }}
          >
            All Milestones ({allMilestoneResources.length})
          </button>
          {coreSteps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setSelectedMilestone(step.id)}
              className="skeuo-pill shrink-0"
              style={{
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 600,
                background: selectedMilestone === step.id ? 'var(--primary)' : 'var(--card-bg)',
                color: selectedMilestone === step.id ? '#fff' : 'var(--text-muted)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer'
              }}
            >
              Step {idx + 1}: {step.title.length > 25 ? `${step.title.substring(0, 25)}...` : step.title}
            </button>
          ))}
        </div>
      </div>

      {/* ── Search & Resource Type Filter ── */}
      <div className="flex flex-col md:flex-row gap-md items-center justify-between">
        <div style={{ position: 'relative', width: '100%', maxWidth: '440px' }}>
          <Search size={18} className="text-muted" style={{ position: 'absolute', top: 12, left: 14 }} />
          <input 
            type="text" 
            className="input-field w-full"
            placeholder="Search resources by title, topic, or source..."
            style={{ paddingLeft: '2.6rem', fontSize: '0.88rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-xs overflow-x-auto w-full md:w-auto pb-xs">
          {[
            { key: 'all', label: 'All Types' },
            { key: 'Course', label: 'Video Masterclasses' },
            { key: 'Article', label: 'Architecture Docs' },
            { key: 'Project', label: 'Coding Labs' }
          ].map(type => (
            <button
              key={type.key}
              onClick={() => setSelectedType(type.key)}
              className="skeuo-pill"
              style={{
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 600,
                background: selectedType === type.key ? 'var(--primary)' : 'var(--card-bg)',
                color: selectedType === type.key ? '#fff' : 'var(--text-muted)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer'
              }}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Resources List ── */}
      <div className="flex flex-col gap-md">
        {filteredResources.length === 0 ? (
          <div className="glass-panel p-xl text-center flex flex-col items-center justify-center gap-sm">
            <BookOpen size={36} className="text-muted" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>No Resources Found</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Try clearing your search query or selecting "All Milestones".</p>
          </div>
        ) : (
          filteredResources.map((res, index) => {
            const isCompleted = completedResourceIds.includes(res.id);
            return (
              <div 
                key={res.id || index} 
                className="glass-panel interactive flex flex-col sm:flex-row items-start sm:items-center justify-between gap-md" 
                style={{ 
                  padding: '18px 24px', 
                  borderRadius: '16px',
                  background: isCompleted ? 'rgba(16, 185, 129, 0.04)' : 'var(--card-bg)',
                  border: isCompleted ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
                  cursor: 'pointer'
                }}
                onClick={() => navigate(`/resource/${res.id}`, { state: { resource: res } })}
              >
                <div className="flex items-start gap-md flex-1">
                  <div 
                    style={{ 
                      width: 44, 
                      height: 44, 
                      borderRadius: '12px', 
                      background: 'var(--input-bg)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {renderIcon(res.type)}
                  </div>

                  <div className="flex flex-col gap-xs">
                    <div className="flex items-center gap-xs flex-wrap">
                      <span className="badge" style={{ background: 'var(--input-bg)', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 600 }}>
                        {res.type} • {res.source}
                      </span>
                      {res.stepTitle && (
                        <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 600 }}>
                          {res.stepTitle}
                        </span>
                      )}
                      {isCompleted && (
                        <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 700 }}>
                          Completed ✓
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '2px 0' }}>{res.title}</h3>
                    <p className="text-muted" style={{ fontSize: '0.84rem', lineHeight: 1.5, margin: 0 }}>
                      {res.description}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-xs sm:self-center shrink-0">
                  <button 
                    className={`skeuo-pill ${isCompleted ? 'active' : ''}`}
                    onClick={(e) => handleToggleComplete(res.id, e)}
                    style={{ padding: '6px 14px', fontSize: '0.78rem', cursor: 'pointer' }}
                  >
                    {isCompleted ? <><CheckCircle2 size={13} className="text-success inline mr-1" /> Done</> : 'Mark Complete'}
                  </button>

                  <button 
                    className="btn btn-primary flex items-center gap-xs" 
                    style={{ padding: '6px 16px', fontSize: '0.8rem', width: 'auto' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/resource/${res.id}`, { state: { resource: res } });
                    }}
                  >
                    <Play size={12} />
                    <span>Start</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
