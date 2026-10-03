import { 
  Check, Clock, Lock, Sparkles, BookOpen, 
  ArrowRight, Compass, CheckCircle2, ChevronRight,
  ExternalLink, Code2, Play, Award, Zap, RotateCcw,
  Layers, CheckSquare, Bookmark, HelpCircle, Shield,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { getRoadmapForJob, ROADMAP_DOMAINS } from '../../utils/roadmapData';
import { getResourcesForStep } from '../../utils/resourceData';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import db from '../../services/db';
import realtimeDb from '../../services/realtimeDb';
import apiClient from '../../services/apiClient';

// Fallback helper to resolve active domain from user profile or saved course
function getActiveRoadmapDomain(targetRole, domain) {
  const user = db.getCurrentUser();
  const effectiveRole = targetRole || user?.targetRole || user?.dreamJob;
  const effectiveDomain = domain || user?.domain;

  if (effectiveRole) {
    const matched = getRoadmapForJob(effectiveRole);
    if (matched && matched.id !== 'default_adaptive') return matched;
  }
  if (effectiveDomain) {
    const matched = getRoadmapForJob(effectiveDomain);
    if (matched && matched.id !== 'default_adaptive') return matched;
  }
  const savedCourseId = localStorage.getItem('nexora_active_course');
  if (savedCourseId && ROADMAP_DOMAINS[savedCourseId]) {
    return ROADMAP_DOMAINS[savedCourseId];
  }
  return getRoadmapForJob(effectiveRole || effectiveDomain || 'Mobile App Developer');
}

export default function Roadmap() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user: authUser } = useAuth();

  const [activeTab, setActiveTab] = useState('core'); // 'core' | 'subset'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED' | 'LOCKED'
  const [currentUser, setCurrentUser] = useState(() => db.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);

  // Live DAG Roadmap State from MongoDB backend
  const [roadmapData, setRoadmapData] = useState(() => {
    try {
      const cached = localStorage.getItem('nexora_active_roadmap');
      if (cached) return JSON.parse(cached);
    } catch {
      // fallback
    }
    const defaultDomain = getActiveRoadmapDomain();
    return {
      id: defaultDomain.id,
      title: defaultDomain.title,
      role: defaultDomain.title,
      domain: defaultDomain.category || 'Mobile App Development',
      category: defaultDomain.category || 'Mobile App Development',
      description: defaultDomain.description,
      progressPercentage: 0,
      totalMilestones: defaultDomain.coreSteps?.length || 5,
      completedMilestones: 0,
      phases: [
        {
          phaseId: 'p1',
          phaseTitle: 'Phase 1: Core Architecture & Foundations',
          order: 1,
          milestones: (defaultDomain.coreSteps || []).map((step, idx) => ({
            milestoneId: step.id,
            title: step.title,
            description: step.description,
            estimatedHours: 25,
            skills: step.skills || [],
            resources: (step.resources || []).map(r => ({ title: r.title || 'Docs', url: r.url || '#', type: 'DOCS' })),
            status: idx === 0 ? 'AVAILABLE' : 'LOCKED',
          }))
        }
      ],
      coreSteps: defaultDomain.coreSteps || []
    };
  });

  const [selectedMilestone, setSelectedMilestone] = useState(null);

  // Synchronize roadmap data from GET /api/v1/roadmap
  const fetchLiveRoadmap = async () => {
    setIsLoading(true);
    const activeRole = authUser?.targetRole || currentUser?.targetRole || authUser?.dreamJob || currentUser?.dreamJob || '';
    const activeDomain = authUser?.domain || currentUser?.domain || '';

    try {
      const queryParams = activeRole ? `?role=${encodeURIComponent(activeRole)}&domain=${encodeURIComponent(activeDomain)}` : '';
      const res = await apiClient.get(`/api/v1/roadmap${queryParams}`);
      const serverRoadmap = res.data?.data?.roadmap || res.data?.roadmap;
      if (res.success && serverRoadmap) {
        setRoadmapData(serverRoadmap);
        localStorage.setItem('nexora_active_roadmap', JSON.stringify(serverRoadmap));

        // Select first available or in-progress milestone by default if none selected
        if (!selectedMilestone && serverRoadmap.phases?.length > 0) {
          const firstPhase = serverRoadmap.phases[0];
          const defaultStep = firstPhase.milestones?.find(m => m.status === 'IN_PROGRESS' || m.status === 'AVAILABLE') || firstPhase.milestones?.[0];
          setSelectedMilestone(defaultStep || null);
        }
      }
    } catch (err) {
      console.warn('[Roadmap] Remote DAG roadmap fetch notice:', err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveRoadmap();
  }, [authUser?.targetRole, authUser?.domain, currentUser?.targetRole, currentUser?.domain]);

  // Synchronize across windows/tabs
  useEffect(() => {
    const handleSync = () => {
      const user = db.getCurrentUser();
      setCurrentUser(user);
      fetchLiveRoadmap();
    };

    window.addEventListener('user_session_changed', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('user_session_changed', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Collect flat list of all milestones across phases
  const allMilestones = useMemo(() => {
    if (!roadmapData?.phases) return [];
    const list = [];
    roadmapData.phases.forEach(phase => {
      phase.milestones.forEach(m => {
        list.push({ ...m, phaseTitle: phase.phaseTitle, phaseOrder: phase.order });
      });
    });
    return list;
  }, [roadmapData]);

  // Keep selected milestone reference up to date
  useEffect(() => {
    if (!selectedMilestone && allMilestones.length > 0) {
      const active = allMilestones.find(m => m.status === 'IN_PROGRESS') || allMilestones.find(m => m.status === 'AVAILABLE') || allMilestones[0];
      setSelectedMilestone(active);
    } else if (selectedMilestone && allMilestones.length > 0) {
      const updated = allMilestones.find(m => m.milestoneId === selectedMilestone.milestoneId);
      if (updated) {
        setSelectedMilestone(updated);
      }
    }
  }, [allMilestones]);

  // Curated learning resources for currently selected milestone
  const currentResources = useMemo(() => {
    if (!selectedMilestone) return [];
    if (selectedMilestone.resources && selectedMilestone.resources.length > 0) {
      return selectedMilestone.resources.map((r, i) => ({
        id: `res_${selectedMilestone.milestoneId}_${i}`,
        title: r.title,
        url: r.url,
        type: r.type,
        duration: '45m',
        source: 'NEXORA Curriculum'
      }));
    }
    // Fallback to resource catalog
    return getResourcesForStep({
      id: selectedMilestone.milestoneId,
      title: selectedMilestone.title,
      skills: selectedMilestone.skills || []
    });
  }, [selectedMilestone]);

  // Handle Track Changing from dropdown
  const handleJobChange = (domainKey) => {
    const domain = ROADMAP_DOMAINS[domainKey];
    if (domain) {
      localStorage.setItem('nexora_active_course', domain.id);
      db.updateUserProfile({
        dreamJob: domain.title,
        selectedTrack: domain.id,
        targetRole: domain.title
      });
      window.dispatchEvent(new Event('user_session_changed'));
      toast.info(`Calibrating roadmap for ${domain.title}...`);
    }
  };

  // Optimistic Milestone Action Handler (Start Milestone / Mark Complete)
  const handleMilestoneAction = async (milestone, targetStatus, e) => {
    if (e) e.stopPropagation();

    if (milestone.status === 'LOCKED') {
      toast.info('This milestone is locked. Complete the prerequisite milestones to unlock.');
      return;
    }

    const previousRoadmap = JSON.parse(JSON.stringify(roadmapData));

    // Determine target state
    let nextStatus = targetStatus;
    if (!nextStatus) {
      if (milestone.status === 'AVAILABLE') nextStatus = 'IN_PROGRESS';
      else if (milestone.status === 'IN_PROGRESS') nextStatus = 'COMPLETED';
      else if (milestone.status === 'COMPLETED') nextStatus = 'IN_PROGRESS';
    }

    // 1. Optimistic local update
    setRoadmapData((prev) => {
      if (!prev || !prev.phases) return prev;

      let nextPhaseToUnlock = -1;
      let nextMilestoneToUnlock = -1;

      const updatedPhases = prev.phases.map((phase, pIdx) => {
        const milestones = phase.milestones.map((m, mIdx) => {
          if (m.milestoneId === milestone.milestoneId) {
            if (nextStatus === 'COMPLETED') {
              if (mIdx + 1 < phase.milestones.length) {
                nextPhaseToUnlock = pIdx;
                nextMilestoneToUnlock = mIdx + 1;
              } else {
                nextPhaseToUnlock = pIdx + 1;
                nextMilestoneToUnlock = 0;
              }
            }
            return {
              ...m,
              status: nextStatus,
              completedAt: nextStatus === 'COMPLETED' ? new Date().toISOString() : undefined
            };
          }
          return m;
        });
        return { ...phase, milestones };
      });

      // Promote next milestone to AVAILABLE if unlocked
      if (nextStatus === 'COMPLETED' && nextPhaseToUnlock !== -1 && nextPhaseToUnlock < updatedPhases.length) {
        const targetPhase = updatedPhases[nextPhaseToUnlock];
        if (targetPhase && nextMilestoneToUnlock < targetPhase.milestones.length) {
          const nextTarget = targetPhase.milestones[nextMilestoneToUnlock];
          if (nextTarget.status === 'LOCKED') {
            nextTarget.status = 'AVAILABLE';
          }
        }
      }

      // Recompute metrics
      let completedCount = 0;
      let totalCount = 0;
      updatedPhases.forEach(p => p.milestones.forEach(m => {
        totalCount += 1;
        if (m.status === 'COMPLETED') completedCount += 1;
      }));

      const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      return {
        ...prev,
        phases: updatedPhases,
        completedMilestones: completedCount,
        totalMilestones: totalCount,
        progressPercentage
      };
    });

    if (nextStatus === 'COMPLETED') {
      toast.success('Milestone completed! +50 XP awarded');
    } else if (nextStatus === 'IN_PROGRESS') {
      toast.info(`Milestone started: ${milestone.title}`);
    }

    // 2. Dispatch PATCH /api/v1/roadmap/milestones/:milestoneId
    try {
      const res = await apiClient.patch(`/api/v1/roadmap/milestones/${milestone.milestoneId}`, {
        status: nextStatus
      });

      const canonical = res.data?.data?.roadmap || res.data?.roadmap;
      if (res.success && canonical) {
        setRoadmapData(canonical);
        localStorage.setItem('nexora_active_roadmap', JSON.stringify(canonical));
        window.dispatchEvent(new Event('user_session_changed'));
      }
    } catch (err) {
      console.error('[Roadmap] Milestone update failed:', err);
      // Rollback to prior snapshot
      setRoadmapData(previousRoadmap);
      toast.error('Failed to update milestone progress. Rolling back.');
    }
  };

  // Metrics computation
  const totalMilestonesCount = roadmapData.totalMilestones || allMilestones.length || 1;
  const completedMilestonesCount = roadmapData.completedMilestones || allMilestones.filter(m => m.status === 'COMPLETED').length;
  const inProgressMilestonesCount = allMilestones.filter(m => m.status === 'IN_PROGRESS').length;
  const availableMilestonesCount = allMilestones.filter(m => m.status === 'AVAILABLE').length;
  const progressPercent = typeof roadmapData.progressPercentage === 'number' 
    ? roadmapData.progressPercentage 
    : Math.round((completedMilestonesCount / Math.max(totalMilestonesCount, 1)) * 100);

  // Filtered milestones
  const filteredMilestones = useMemo(() => {
    if (filterStatus === 'all') return allMilestones;
    return allMilestones.filter(m => m.status === filterStatus);
  }, [allMilestones, filterStatus]);

  const activeRoleDisplay = authUser?.targetRole || currentUser?.targetRole || roadmapData.role || roadmapData.title || 'Mobile App Developer';
  const activeDomainDisplay = authUser?.domain || currentUser?.domain || roadmapData.domain || roadmapData.category || 'Mobile App Development';

  return (
    <div className="workstation-container animate-fade-in flex flex-col gap-6" style={{ minHeight: '100vh', padding: '24px 20px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      
      {/* ── Top Header & Domain Switcher Banner ── */}
      <header className="glass-panel p-6 sm:p-7 rounded-3xl border border-border flex flex-col gap-5">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400">
                <Compass size={14} /> Interactive Career Roadmap
              </span>
              <span className="badge text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 inline-flex items-center gap-1">
                <Sparkles size={11} className="text-indigo-400" />
                Calibrated for: {activeRoleDisplay} · {activeDomainDisplay}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-main m-0 leading-tight">
              {roadmapData.title || activeRoleDisplay}
            </h1>
            <p className="text-muted text-sm mt-1.5 max-w-3xl leading-relaxed m-0">
              {roadmapData.description || `High-precision DAG curriculum with verified learning checkpoints designed for ${activeRoleDisplay}.`}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap w-full lg:w-auto">
            {/* Domain Selector Dropdown */}
            <div className="flex items-center gap-2 flex-1 sm:flex-initial">
              <span className="text-xs font-semibold text-muted hidden sm:inline">Track:</span>
              <select 
                value={roadmapData.id} 
                onChange={(e) => handleJobChange(e.target.value)}
                className="bg-card text-main border border-border hover:border-border-hover px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer outline-none transition-all shadow-sm flex-1 sm:flex-initial"
              >
                {Object.keys(ROADMAP_DOMAINS).map((key) => (
                  <option key={key} value={key} className="bg-card text-main">
                    {ROADMAP_DOMAINS[key].title}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="flex p-1 rounded-xl border border-border/80" style={{ background: 'var(--input-bg)' }}>
              <button 
                type="button"
                onClick={() => setActiveTab('core')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={{
                  backgroundColor: activeTab === 'core' ? '#4f46e5' : 'transparent',
                  color: activeTab === 'core' ? '#ffffff' : 'var(--text-muted)',
                  boxShadow: activeTab === 'core' ? '0 2px 8px rgba(79, 70, 229, 0.25)' : 'none'
                }}
              >
                DAG Curriculum ({totalMilestonesCount})
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Velocity & Milestone Progress Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-border/70">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="flex-1 bg-input h-2.5 rounded-full overflow-hidden border border-border/50">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-bold font-mono text-indigo-400 flex-shrink-0">
              {progressPercent}% Completed
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted font-medium flex-wrap">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {completedMilestonesCount} Cleared
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              {inProgressMilestonesCount} In Progress
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              {availableMilestonesCount} Available
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-muted/40" />
              {totalMilestonesCount - completedMilestonesCount - inProgressMilestonesCount - availableMilestonesCount} Locked
            </span>
          </div>
        </div>
      </header>

      {/* ── Main Dual-Rail Workstation Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ── LEFT PANE: Connected Interactive Milestone Timeline (5 Columns on Desktop) ── */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Timeline Filter / Header Bar */}
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted m-0">
                DAG Learning Sequence
              </h3>
              <p className="text-[11px] text-muted m-0 mt-0.5">
                {roadmapData.phases?.length || 1} Phases · {totalMilestonesCount} Milestones
              </p>
            </div>

            {/* Quick Filter Pill Selector */}
            <div className="flex bg-input p-0.5 rounded-lg border border-border/60 text-[11px]">
              {[
                { key: 'all', label: 'All' },
                { key: 'IN_PROGRESS', label: 'Active' },
                { key: 'AVAILABLE', label: 'Unlocked' },
                { key: 'COMPLETED', label: 'Done' }
              ].map(f => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilterStatus(f.key)}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    filterStatus === f.key 
                      ? 'bg-card text-main shadow-xs' 
                      : 'text-muted hover:text-main'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Connected Vertical Timeline Stem Container */}
          <div className="relative pl-6 sm:pl-7 flex flex-col gap-4 pt-2">
            
            {/* Continuous Vertical Timeline Connecting Line */}
            <div className="absolute left-[17px] sm:left-[21px] top-4 bottom-6 w-[2px] bg-gradient-to-b from-indigo-500/60 via-border to-border/40 pointer-events-none" />

            {/* Render Phases or Filtered Milestones */}
            {(roadmapData.phases || []).map((phase, pIdx) => {
              const phaseMilestones = phase.milestones.filter(m => {
                if (filterStatus === 'all') return true;
                return m.status === filterStatus;
              });

              if (phaseMilestones.length === 0) return null;

              return (
                <div key={phase.phaseId} className="flex flex-col gap-3">
                  {/* Phase Section Label */}
                  <div className="flex items-center gap-2 py-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                      Phase {phase.order || pIdx + 1}
                    </span>
                    <span className="text-xs font-bold text-main truncate">
                      {phase.phaseTitle}
                    </span>
                  </div>

                  {phaseMilestones.map((milestone) => {
                    const status = milestone.status;
                    const isSelected = selectedMilestone?.milestoneId === milestone.milestoneId;
                    const isCompleted = status === 'COMPLETED';
                    const isInProgress = status === 'IN_PROGRESS';
                    const isAvailable = status === 'AVAILABLE';
                    const isLocked = status === 'LOCKED';

                    return (
                      <div 
                        key={milestone.milestoneId}
                        onClick={() => setSelectedMilestone(milestone)}
                        className={`relative group rounded-2xl p-4.5 sm:p-5 transition-all cursor-pointer border ${
                          isSelected 
                            ? 'bg-gradient-to-r from-indigo-500/10 via-card to-card border-indigo-500/60 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30' 
                            : isCompleted
                              ? 'bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/30'
                              : isInProgress
                                ? 'bg-cyan-500/5 hover:bg-cyan-500/10 border-cyan-400/50 ring-1 ring-cyan-400/30 shadow-md shadow-cyan-500/10'
                                : isAvailable
                                  ? 'bg-card/90 hover:bg-card border-indigo-500/40 shadow-xs'
                                  : 'bg-card/40 opacity-60 border-border/40 hover:opacity-80'
                        }`}
                      >
                        {/* Timeline Node Icon Anchor */}
                        <button
                          type="button"
                          onClick={(e) => handleMilestoneAction(milestone, undefined, e)}
                          disabled={isLocked}
                          className={`absolute -left-[31px] sm:-left-[35px] top-6 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all z-10 border ${
                            isCompleted 
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-md shadow-emerald-500/20 hover:scale-110' 
                              : isInProgress 
                                ? 'bg-cyan-600 text-white border-cyan-300 ring-4 ring-cyan-500/20 shadow-md shadow-cyan-500/30 hover:scale-110 animate-pulse' 
                                : isAvailable
                                  ? 'bg-indigo-600 text-white border-indigo-400 hover:scale-110 shadow-sm shadow-indigo-500/20'
                                  : 'bg-input text-muted/50 border-border cursor-not-allowed'
                          }`}
                          title={`Status: ${status} (Click to toggle)`}
                        >
                          {isCompleted && <Check size={14} strokeWidth={3} />}
                          {isInProgress && <Clock size={14} strokeWidth={2.5} />}
                          {isAvailable && <Zap size={13} strokeWidth={2.5} />}
                          {isLocked && <Lock size={13} strokeWidth={2} />}
                        </button>

                        {/* Milestone Card Body */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              {/* Status Tag Pill */}
                              <span className={`text-[10px] font-bold font-mono tracking-wider uppercase px-2 py-0.5 rounded-md ${
                                isCompleted 
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                                  : isInProgress 
                                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' 
                                    : isAvailable
                                      ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                                      : 'bg-input text-muted/60 border border-border/50'
                              }`}>
                                {status}
                              </span>

                              {isInProgress && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                                  Current Focus
                                </span>
                              )}

                              <span className="text-xs text-muted font-mono ml-auto">
                                {milestone.estimatedHours ? `${milestone.estimatedHours} Hours` : '20 Hours'}
                              </span>
                            </div>

                            <h4 className={`text-sm sm:text-base font-bold m-0 leading-snug group-hover:text-indigo-300 transition-colors ${
                              isSelected ? 'text-indigo-400' : isCompleted ? 'text-emerald-300' : 'text-main'
                            }`}>
                              {milestone.title}
                            </h4>

                            <p className="text-muted text-xs leading-relaxed m-0 mt-1 line-clamp-2">
                              {milestone.description}
                            </p>

                            {/* Competency Chips */}
                            {milestone.skills && milestone.skills.length > 0 && (
                              <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                                {milestone.skills.slice(0, 3).map((skill) => (
                                  <span 
                                    key={skill}
                                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-input text-muted border border-border/40"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {milestone.skills.length > 3 && (
                                  <span className="text-[10px] text-muted">
                                    +{milestone.skills.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Card Inline Action Button */}
                            <div className="mt-3 flex items-center gap-2">
                              {isAvailable && (
                                <button
                                  type="button"
                                  onClick={(e) => handleMilestoneAction(milestone, 'IN_PROGRESS', e)}
                                  className="text-[11px] font-bold px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 shadow-sm transition-all"
                                >
                                  <Play size={11} />
                                  <span>Start Milestone</span>
                                </button>
                              )}
                              {isInProgress && (
                                <button
                                  type="button"
                                  onClick={(e) => handleMilestoneAction(milestone, 'COMPLETED', e)}
                                  className="text-[11px] font-bold px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 shadow-sm transition-all"
                                >
                                  <Check size={11} strokeWidth={3} />
                                  <span>Mark Completed (+50 XP)</span>
                                </button>
                              )}
                              {isLocked && (
                                <span className="text-[10px] font-mono text-muted/60 flex items-center gap-1">
                                  <Lock size={10} /> Locked by prerequisite
                                </span>
                              )}
                              {isCompleted && (
                                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 size={11} /> Cleared
                                </span>
                              )}
                            </div>
                          </div>

                          <ChevronRight 
                            size={18} 
                            className={`flex-shrink-0 transition-transform ${
                              isSelected ? 'text-indigo-400 translate-x-0.5' : 'text-muted/40 group-hover:text-muted'
                            }`} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT PANE: Inspection & Milestone Laboratory (7 Columns on Desktop) ── */}
        <aside className="lg:col-span-7 flex flex-col gap-6 sticky top-6">
          {selectedMilestone ? (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/20 shadow-xl shadow-black/10 bg-gradient-to-b from-card via-card to-card/95 flex flex-col gap-6">
              
              {/* Header: Milestone Metadata & Quick Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-border">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="badge text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                      Milestone Laboratory
                    </span>
                    <span className={`text-[10px] font-bold font-mono tracking-wider uppercase px-2 py-0.5 rounded-md ${
                      selectedMilestone.status === 'COMPLETED'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : selectedMilestone.status === 'IN_PROGRESS'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                          : selectedMilestone.status === 'AVAILABLE'
                            ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                            : 'bg-input text-muted/60 border border-border/50'
                    }`}>
                      {selectedMilestone.status}
                    </span>
                    <span className="text-xs text-muted font-mono">
                      Estimated: {selectedMilestone.estimatedHours ? `${selectedMilestone.estimatedHours} Hours` : '20 Hours'}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-extrabold text-main m-0 leading-tight">
                    {selectedMilestone.title}
                  </h2>
                  <p className="text-sm text-muted leading-relaxed m-0 mt-2">
                    {selectedMilestone.description}
                  </p>
                </div>

                {/* Milestone Toggle Action Button */}
                <div className="flex-shrink-0">
                  {selectedMilestone.status === 'AVAILABLE' && (
                    <button
                      type="button"
                      onClick={() => handleMilestoneAction(selectedMilestone, 'IN_PROGRESS')}
                      className="btn-primary flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
                    >
                      <Play size={15} />
                      <span>Start Milestone</span>
                    </button>
                  )}

                  {selectedMilestone.status === 'IN_PROGRESS' && (
                    <button
                      type="button"
                      onClick={() => handleMilestoneAction(selectedMilestone, 'COMPLETED')}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all"
                    >
                      <CheckCircle2 size={16} />
                      <span>Mark as Completed (+50 XP)</span>
                    </button>
                  )}

                  {selectedMilestone.status === 'COMPLETED' && (
                    <button
                      type="button"
                      onClick={() => handleMilestoneAction(selectedMilestone, 'IN_PROGRESS')}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 shadow-sm transition-all"
                    >
                      <CheckCircle2 size={16} className="text-emerald-400" />
                      <span>Completed (Click to Reset)</span>
                    </button>
                  )}

                  {selectedMilestone.status === 'LOCKED' && (
                    <button
                      type="button"
                      disabled
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-input text-muted/50 border border-border cursor-not-allowed"
                    >
                      <Lock size={15} />
                      <span>Prerequisite Locked</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Required Technical Competencies */}
              {selectedMilestone.skills && selectedMilestone.skills.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                      <Award size={14} className="text-indigo-400" />
                      Required Technical Competencies
                    </span>
                    <span className="text-[11px] text-muted font-mono">
                      {selectedMilestone.skills.length} Evaluated Skills
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedMilestone.skills.map((skill) => (
                      <span 
                        key={skill} 
                        className="text-xs font-semibold px-3 py-1 rounded-lg bg-input text-main border border-border/80 shadow-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Real-Time Verified Learning Resources */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-indigo-400" />
                    <h3 className="text-sm font-bold text-main m-0">
                      Curated Learning Checkpoints ({currentResources.length})
                    </h3>
                  </div>
                  <span className="text-xs text-muted font-semibold">Tier-1 Curricula</span>
                </div>

                {currentResources.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {currentResources.map((res) => (
                      <div 
                        key={res.id}
                        onClick={() => {
                          if (res.url && res.url !== '#') {
                            window.open(res.url, '_blank', 'noopener,noreferrer');
                          } else {
                            navigate(`/resource/${res.id}`, { state: { resource: res } });
                          }
                        }}
                        className="p-4 rounded-2xl bg-input/50 hover:bg-input border border-border/70 hover:border-indigo-500/40 transition-all cursor-pointer flex flex-col justify-between gap-3 group shadow-xs"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="badge text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                              {res.type || 'Course'}
                            </span>
                            <span className="text-[11px] font-mono text-muted">
                              {res.duration || '45m'}
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-main m-0 group-hover:text-indigo-300 transition-colors leading-snug line-clamp-2">
                            {res.title}
                          </h4>
                          <p className="text-muted text-[11px] leading-relaxed m-0 mt-1 line-clamp-2">
                            {res.description || 'Verified documentation and code examples from official development guides.'}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[11px]">
                          <span className="text-muted font-medium">{res.source || 'NEXORA Lab'}</span>
                          <span className="text-indigo-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            <span>Open</span>
                            <ExternalLink size={11} />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-input/30 border border-border/40 text-center">
                    <p className="text-xs text-muted m-0">Curriculum materials are dynamically pulled from the NEXORA resource index.</p>
                  </div>
                )}
              </div>

              {/* Milestone Practical Challenge Lab */}
              <div className="p-5 rounded-2xl bg-input/60 border border-indigo-500/30 flex flex-col gap-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 size={16} className="text-indigo-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-main m-0">
                      Phase Challenge: {selectedMilestone.title}
                    </h3>
                  </div>
                  <span className="badge text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    +50 XP Telemetry
                  </span>
                </div>

                <p className="text-xs text-muted leading-relaxed m-0">
                  Implement a complete working feature branch testing your understanding of <strong>{selectedMilestone.skills?.slice(0, 3).join(', ') || selectedMilestone.title}</strong>. Ensure code passes unit tests and adheres to clean architecture patterns.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/projects')}
                    className="btn btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5"
                  >
                    <Play size={12} />
                    <span>Launch Sandbox Environment</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/chatbot')}
                    className="text-xs font-semibold text-muted hover:text-indigo-300 transition-colors flex items-center gap-1"
                  >
                    <HelpCircle size={13} />
                    <span>Ask AI Mentor for Code Scaffold</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-panel p-10 rounded-3xl border border-border text-center flex flex-col items-center justify-center gap-3">
              <Compass size={40} className="text-muted/40 animate-spin" />
              <h3 className="text-base font-bold text-main m-0">Hydrating DAG Workspace...</h3>
              <p className="text-xs text-muted m-0">Select any milestone from the curriculum progression to inspect resources.</p>
            </div>
          )}
        </aside>

      </div>
    </div>
  );
}
