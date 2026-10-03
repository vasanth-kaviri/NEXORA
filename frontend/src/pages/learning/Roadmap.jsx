import { 
  Check, Clock, Lock, Sparkles, BookOpen, 
  ArrowRight, Compass, CheckCircle2, ChevronRight,
  ExternalLink, Code2, Play, Award, Zap, RotateCcw,
  Layers, CheckSquare, Bookmark, HelpCircle, Shield,
  AlertCircle, X, Copy, CheckCheck, RefreshCw, FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { getRoadmapForJob, ROADMAP_DOMAINS } from '../../utils/roadmapData';
import { getResourcesForStep } from '../../utils/resourceData';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import db from '../../services/db';
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

// Simple Markdown Paragraph & Inline Code/Bold Renderer
function renderSimpleMarkdown(text) {
  if (!text) return null;
  const paragraphs = text.split('\n\n');
  return paragraphs.map((para, pIdx) => {
    const parts = para.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return (
      <p key={pIdx} className="text-sm text-muted leading-relaxed m-0 mb-3 last:mb-0">
        {parts.map((part, idx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={idx} className="font-semibold text-main">
                {part.slice(2, -2)}
              </strong>
            );
          }
          if (part.startsWith('`') && part.endsWith('`')) {
            return (
              <code key={idx} className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono text-xs border border-indigo-500/20">
                {part.slice(1, -1)}
              </code>
            );
          }
          return part;
        })}
      </p>
    );
  });
}

// Tokenizer & Syntax Highlighter for Code Snippets
function renderSyntaxLine(line, language) {
  if (!line) return <span>&nbsp;</span>;

  // Comment line
  if (line.trim().startsWith('//') || line.trim().startsWith('#')) {
    return <span className="text-slate-500 italic">{line}</span>;
  }

  // Regex token splitter
  const tokenRegex = /(\/\/.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:import|export|from|as|default|function|return|const|let|var|if|else|switch|case|break|try|catch|finally|throw|new|class|extends|implements|interface|type|public|private|protected|async|await|while|for|of|in)\b|\b(?:Promise|Array|Record|Map|Set|String|Number|Boolean|Object|any|void|string|number|boolean|true|false|null|undefined|React|useState|useEffect|useMemo|useCallback|useRef|Stack|CameraView|SQLite|Zustand|create|persist)\b|\b\d+\b|[{}()[\].,;:+\-*/=<>!&|^?%]+)/g;

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: line.substring(lastIndex, match.index), type: 'plain' });
    }
    const token = match[0];
    let type = 'plain';

    if (token.startsWith('//')) {
      type = 'comment';
    } else if (token.startsWith('"') || token.startsWith("'") || token.startsWith('`')) {
      type = 'string';
    } else if (/^\b(?:import|export|from|as|default|function|return|const|let|var|if|else|switch|case|break|try|catch|finally|throw|new|class|extends|implements|interface|type|public|private|protected|async|await|while|for|of|in)\b$/.test(token)) {
      type = 'keyword';
    } else if (/^\b(?:Promise|Array|Record|Map|Set|String|Number|Boolean|Object|any|void|string|number|boolean|true|false|null|undefined|React|useState|useEffect|useMemo|useCallback|useRef|Stack|CameraView|SQLite|Zustand|create|persist)\b$/.test(token)) {
      type = 'type';
    } else if (/^\d+$/.test(token)) {
      type = 'number';
    } else if (/^[{}()[\].,;:+\-*/=<>!&|^?%]+$/.test(token)) {
      type = 'punctuation';
    }

    parts.push({ text: token, type });
    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < line.length) {
    parts.push({ text: line.substring(lastIndex), type: 'plain' });
  }

  return parts.map((p, i) => {
    switch (p.type) {
      case 'comment':
        return <span key={i} className="text-slate-500 italic">{p.text}</span>;
      case 'string':
        return <span key={i} className="text-emerald-400">{p.text}</span>;
      case 'keyword':
        return <span key={i} className="text-purple-400 font-semibold">{p.text}</span>;
      case 'type':
        return <span key={i} className="text-cyan-300 font-medium">{p.text}</span>;
      case 'number':
        return <span key={i} className="text-amber-300">{p.text}</span>;
      case 'punctuation':
        return <span key={i} className="text-indigo-300/80">{p.text}</span>;
      default:
        return <span key={i} className="text-slate-200">{p.text}</span>;
    }
  });
}

function SyntaxCodeBlock({ codeSnippet }) {
  const [copied, setCopied] = useState(false);
  const code = codeSnippet?.code || '';
  const language = codeSnippet?.language || 'typescript';
  const title = codeSnippet?.title || 'Production Implementation Snippet';

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className="rounded-2xl border border-indigo-500/25 bg-slate-950/90 overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-indigo-500/20">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex gap-1.5 flex-shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-xs font-mono font-bold text-slate-200 truncate">
            {title}
          </span>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 font-extrabold border border-indigo-500/30 flex-shrink-0">
            {language}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer shadow-sm ml-2 flex-shrink-0"
          title="Copy code snippet"
        >
          {copied ? (
            <>
              <CheckCheck size={13} className="text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={13} className="text-slate-400" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      <div className="p-4 font-mono text-xs overflow-x-auto leading-relaxed text-slate-200 max-h-[380px] overflow-y-auto">
        <pre className="m-0">
          <code>
            {lines.map((line, idx) => (
              <div key={idx} className="table-row">
                <span className="table-cell pr-4 text-slate-600 select-none text-right font-mono text-[11px] w-8">
                  {idx + 1}
                </span>
                <span className="table-cell whitespace-pre">
                  {renderSyntaxLine(line, language)}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

export default function Roadmap() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user: authUser } = useAuth();

  const [activeTab, setActiveTab] = useState('core'); // 'core'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED' | 'LOCKED'
  const [currentUser, setCurrentUser] = useState(() => db.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState('concept'); // 'concept' | 'resources' | 'quiz'

  // Quiz interactive state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

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

  // Keyboard shortcut listener: ESC to close drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen]);

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

  // Keep selected milestone reference up to date without losing drawer state
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

  // Open drawer for a milestone
  const openMilestoneDrawer = (milestone, tab = 'concept') => {
    if (milestone.status === 'LOCKED') {
      toast.info('This milestone is locked. Complete the prerequisite milestones to unlock.');
      return;
    }
    setSelectedMilestone(milestone);
    setDrawerTab(tab);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setIsDrawerOpen(true);
  };

  // Curated learning resources for currently selected milestone
  const currentResources = useMemo(() => {
    if (!selectedMilestone) return [];
    if (selectedMilestone.resources && selectedMilestone.resources.length > 0) {
      return selectedMilestone.resources.map((r, i) => ({
        id: `res_${selectedMilestone.milestoneId}_${i}`,
        title: r.title,
        url: r.url,
        type: r.type || 'DOCS',
        duration: '45m',
        source: 'Verified Curriculum'
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
  // Keeps drawer open, updates state in-place, and unlocks next sequential milestone
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

    // Update selectedMilestone locally to stay in sync inside drawer
    setSelectedMilestone(prev => {
      if (!prev || prev.milestoneId !== milestone.milestoneId) return prev;
      return {
        ...prev,
        status: nextStatus,
        completedAt: nextStatus === 'COMPLETED' ? new Date().toISOString() : undefined
      };
    });

    if (nextStatus === 'COMPLETED') {
      toast.success('Milestone completed! +50 XP awarded');
    } else if (nextStatus === 'IN_PROGRESS') {
      toast.info(`Milestone active: ${milestone.title}`);
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

        // Refresh selected milestone with canonical server data
        for (const p of canonical.phases) {
          const match = p.milestones.find(m => m.milestoneId === milestone.milestoneId);
          if (match) {
            setSelectedMilestone({ ...match, phaseTitle: p.phaseTitle, phaseOrder: p.order });
            break;
          }
        }
      }
    } catch (err) {
      console.error('[Roadmap] Milestone update failed:', err);
      // Rollback to prior snapshot
      setRoadmapData(previousRoadmap);
      toast.error('Failed to update milestone progress. Rolling back.');
    }
  };

  // Assessment Quiz Submission Handler
  const handleQuizSubmit = (quizList) => {
    if (!quizList || quizList.length === 0) return;

    let score = 0;
    quizList.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        score += 1;
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);

    if (score === quizList.length) {
      toast.success(`Assessment Cleared! ${score}/${quizList.length} Correct. Badge Unlocked!`);
    } else {
      toast.info(`Score: ${score}/${quizList.length}. Review the explanations and retry.`);
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

  // Resolved Quiz List for Drawer
  const activeQuiz = useMemo(() => {
    if (selectedMilestone?.quiz && selectedMilestone.quiz.length > 0) {
      return selectedMilestone.quiz;
    }
    // Dynamic Fallback 3-Question Knowledge Check if not pre-seeded
    return [
      {
        question: `What is the primary architectural principle governing ${selectedMilestone?.title || 'this milestone'}?`,
        options: [
          'Strict separation of concerns and deterministic unidirectional data flow',
          'Writing all application code inside a single global script',
          'Disabling automated compilation and type checks',
          'Deploying without version control',
        ],
        correctIndex: 0,
      },
      {
        question: `How does mastering ${selectedMilestone?.skills?.[0] || 'core competencies'} improve production reliability?`,
        options: [
          'Ensures reproducible builds, prevents race conditions, and eliminates memory leaks',
          'Guarantees 100% internet bandwidth on client devices',
          'Eliminates the need for any unit or integration tests',
          'Bypasses operating system hardware security constraints',
        ],
        correctIndex: 0,
      },
      {
        question: `Which industry-standard metric evaluates execution quality in ${selectedMilestone?.title || 'engineering workflows'}?`,
        options: [
          '99.9% crash-free sessions and sub-second interaction latencies',
          'Maximum number of third-party external dependencies',
          'Frequency of emergency hotfixes deployed directly to master',
          'Total lines of unminified code generated',
        ],
        correctIndex: 0,
      },
    ];
  }, [selectedMilestone]);

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
                        onClick={() => openMilestoneDrawer(milestone)}
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

                            {/* Card Inline Action Buttons */}
                            <div className="mt-3.5 flex items-center gap-2 flex-wrap">
                              {!isLocked && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openMilestoneDrawer(milestone);
                                  }}
                                  className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 shadow-xs transition-all"
                                >
                                  <BookOpen size={12} className="text-indigo-400" />
                                  <span>Learn & Execute</span>
                                </button>
                              )}

                              {isAvailable && (
                                <button
                                  type="button"
                                  onClick={(e) => handleMilestoneAction(milestone, 'IN_PROGRESS', e)}
                                  className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 shadow-sm transition-all"
                                >
                                  <Play size={11} />
                                  <span>Start</span>
                                </button>
                              )}

                              {isInProgress && (
                                <button
                                  type="button"
                                  onClick={(e) => handleMilestoneAction(milestone, 'COMPLETED', e)}
                                  className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 shadow-sm transition-all"
                                >
                                  <Check size={11} strokeWidth={3} />
                                  <span>Mark Completed (+50 XP)</span>
                                </button>
                              )}

                              {isCompleted && (
                                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 size={11} /> Cleared
                                </span>
                              )}

                              {isLocked && (
                                <span className="text-[10px] font-mono text-muted/60 flex items-center gap-1">
                                  <Lock size={10} /> Locked by prerequisite
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
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                  <button
                    type="button"
                    onClick={() => openMilestoneDrawer(selectedMilestone)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 border border-indigo-500/30 transition-all shadow-sm"
                  >
                    <BookOpen size={15} className="text-indigo-400" />
                    <span>Open Drawer</span>
                  </button>

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
                      <span>Mark Completed (+50 XP)</span>
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
                  <button
                    type="button"
                    onClick={() => openMilestoneDrawer(selectedMilestone, 'resources')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                  >
                    View All in Drawer →
                  </button>
                </div>

                {currentResources.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {currentResources.slice(0, 4).map((res) => (
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
                          <span className="text-muted font-medium">{res.source || 'NEXORA Curriculum'}</span>
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

              {/* Milestone Practical Challenge Lab Card */}
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
                  {selectedMilestone.taskPrompt || `Implement a complete working feature branch testing your understanding of ${selectedMilestone.skills?.slice(0, 3).join(', ') || selectedMilestone.title}. Ensure code passes unit tests and adheres to clean architecture patterns.`}
                </p>

                <div className="flex items-center gap-3 pt-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => openMilestoneDrawer(selectedMilestone, 'concept')}
                    className="btn btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5"
                  >
                    <BookOpen size={12} />
                    <span>Open Learning & Execution Drawer</span>
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

      {/* ── IN-PLATFORM LEARNING & EXECUTION DRAWER (Slide-Over from Right) ── */}
      {/* 1. Glassmorphic Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* 2. Slide-Over Drawer Container */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-card border-l border-indigo-500/30 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
        style={{
          backgroundColor: 'var(--bg-card)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {selectedMilestone && (
          <div className="flex flex-col h-full overflow-hidden">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-border flex flex-col gap-4 bg-gradient-to-b from-card via-card to-card/95">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="badge text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={11} /> Learning & Execution Drawer
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
                  <span className="text-xs text-muted font-mono flex items-center gap-1">
                    <Clock size={12} />
                    {selectedMilestone.estimatedHours ? `${selectedMilestone.estimatedHours} Hours` : '20 Hours'}
                  </span>
                </div>

                {/* Dismiss Drawer Button */}
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-xl bg-input text-muted hover:text-main hover:bg-input/80 transition-colors cursor-pointer"
                  title="Close Drawer (Esc)"
                >
                  <X size={18} />
                </button>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-main m-0 leading-tight">
                  {selectedMilestone.title}
                </h2>
                <p className="text-xs sm:text-sm text-muted leading-relaxed m-0 mt-1.5">
                  {selectedMilestone.description}
                </p>
              </div>

              {/* 'Mark Completed' Toggle Button in Drawer Header */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted">
                  <Award size={14} className="text-indigo-400" />
                  <span>Completion Status</span>
                </div>

                <div className="flex items-center gap-2">
                  {selectedMilestone.status === 'COMPLETED' ? (
                    <button
                      type="button"
                      onClick={() => handleMilestoneAction(selectedMilestone, 'IN_PROGRESS')}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/25 transition-all shadow-sm cursor-pointer"
                    >
                      <CheckCircle2 size={15} className="text-emerald-400" />
                      <span>Completed (Click to Reset)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleMilestoneAction(selectedMilestone, 'COMPLETED')}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
                    >
                      <Check size={14} strokeWidth={3} />
                      <span>Mark Completed (+50 XP)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Navigation Tabs Bar */}
              <div className="flex p-1 rounded-xl bg-input border border-border/80 gap-1">
                {[
                  { id: 'concept', label: 'Concept & Snippets', icon: Code2 },
                  { id: 'resources', label: `Curated Resources (${currentResources.length})`, icon: BookOpen },
                  { id: 'quiz', label: `Mini Assessment (${activeQuiz.length})`, icon: CheckSquare },
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = drawerTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setDrawerTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                          : 'text-muted hover:text-main'
                      }`}
                    >
                      <Icon size={14} />
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drawer Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              
              {/* ── TAB 1: Concept & Snippets ── */}
              {drawerTab === 'concept' && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  
                  {/* Conceptual Overview */}
                  <div className="p-5 rounded-2xl bg-input/40 border border-indigo-500/20 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-indigo-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-main m-0">
                        Conceptual Overview & Architecture
                      </h3>
                    </div>
                    <div>
                      {selectedMilestone.summary ? (
                        renderSimpleMarkdown(selectedMilestone.summary)
                      ) : (
                        <p className="text-sm text-muted leading-relaxed m-0">
                          {selectedMilestone.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Key Topics to Master */}
                  {selectedMilestone.keyTopics && selectedMilestone.keyTopics.length > 0 && (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                          <CheckCircle2 size={14} className="text-indigo-400" />
                          Key Topics & Production Standards
                        </span>
                        <span className="text-[11px] text-muted font-mono">
                          {selectedMilestone.keyTopics.length} Focus Areas
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-2.5">
                        {selectedMilestone.keyTopics.map((topic, tIdx) => (
                          <div 
                            key={tIdx}
                            className="p-3.5 rounded-xl bg-input/50 border border-border/80 flex items-start gap-3 shadow-xs"
                          >
                            <span className="w-5 h-5 rounded-md bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">
                              {tIdx + 1}
                            </span>
                            <span className="text-xs font-medium text-main leading-relaxed">
                              {topic}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Practical Code Snippet with Syntax Highlighting and 1-Click Copy */}
                  {selectedMilestone.codeSnippet && selectedMilestone.codeSnippet.code ? (
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                          <Code2 size={14} className="text-indigo-400" />
                          Production Implementation Snippet
                        </span>
                      </div>
                      <SyntaxCodeBlock codeSnippet={selectedMilestone.codeSnippet} />
                    </div>
                  ) : null}

                  {/* Practical Mini-Project Prompt */}
                  {selectedMilestone.taskPrompt && (
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-input/40 to-transparent border border-indigo-500/30 flex flex-col gap-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap size={16} className="text-indigo-400" />
                          <h4 className="text-xs font-bold uppercase tracking-wider text-main m-0">
                            Practical Mini-Project Challenge
                          </h4>
                        </div>
                        <span className="badge text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          +50 XP Telemetry
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-muted leading-relaxed m-0">
                        {selectedMilestone.taskPrompt}
                      </p>

                      <div className="flex items-center gap-3 pt-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => navigate('/projects')}
                          className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5"
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
                  )}

                </div>
              )}

              {/* ── TAB 2: Curated Resources ── */}
              {drawerTab === 'resources' && (
                <div className="flex flex-col gap-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted m-0">
                        Curated Learning Resources ({currentResources.length})
                      </h3>
                      <p className="text-[11px] text-muted m-0 mt-0.5">
                        Direct references to official documentation and verified engineering guides.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {currentResources.map((res, rIdx) => {
                      const badgeColor = 
                        res.type === 'VIDEO' ? 'bg-purple-500/10 text-purple-400 border-purple-500/25' :
                        res.type === 'ARTICLE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' :
                        res.type === 'PROJECT' ? 'bg-amber-500/10 text-amber-400 border-amber-500/25' :
                        'bg-indigo-500/10 text-indigo-400 border-indigo-500/25';

                      return (
                        <div
                          key={res.id || rIdx}
                          onClick={() => {
                            if (res.url && res.url !== '#') {
                              window.open(res.url, '_blank', 'noopener,noreferrer');
                            }
                          }}
                          className="p-4 rounded-2xl bg-input/50 hover:bg-input border border-border/80 hover:border-indigo-500/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-xs"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <span className={`badge text-[10px] font-bold border ${badgeColor}`}>
                                {res.type || 'DOCS'}
                              </span>
                              <span className="text-[11px] font-mono text-muted">
                                {res.duration || '45m'}
                              </span>
                              <span className="text-[11px] text-muted font-medium ml-auto sm:ml-0">
                                {res.source || 'Official Documentation'}
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-main m-0 group-hover:text-indigo-300 transition-colors leading-snug">
                              {res.title}
                            </h4>

                            <p className="text-xs text-muted leading-relaxed m-0 mt-1 line-clamp-2">
                              {res.description || 'Verified production guide and documentation with code samples.'}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 flex-shrink-0 group-hover:translate-x-0.5 transition-transform">
                            <span>Open Resource</span>
                            <ExternalLink size={13} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── TAB 3: Mini Assessment ── */}
              {drawerTab === 'quiz' && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  
                  {/* Assessment Intro Header */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-card to-card border border-indigo-500/25 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckSquare size={16} className="text-indigo-400" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-main m-0">
                          Milestone Knowledge Verification
                        </h3>
                      </div>
                      <span className="badge text-[10px] font-mono bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                        {activeQuiz.length} Questions
                      </span>
                    </div>
                    <p className="text-xs text-muted leading-relaxed m-0">
                      Answer the 3 knowledge-check questions below to verify mastery of {selectedMilestone.title} and unlock your milestone badge.
                    </p>
                  </div>

                  {/* Quiz Score Banner (if submitted) */}
                  {quizSubmitted && (
                    <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                      quizScore === activeQuiz.length
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    }`}>
                      <div className="flex items-center gap-3">
                        {quizScore === activeQuiz.length ? (
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                            <CheckCircle2 size={22} />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                            <AlertCircle size={22} />
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-bold m-0 leading-tight">
                            {quizScore === activeQuiz.length
                              ? 'Assessment Cleared! 100% Score'
                              : `Assessment Score: ${quizScore}/${activeQuiz.length}`}
                          </h4>
                          <p className="text-xs opacity-90 m-0 mt-0.5">
                            {quizScore === activeQuiz.length
                              ? 'All knowledge checks validated. Milestone badge unlocked!'
                              : 'Review incorrect answers highlighted in red and retry.'}
                          </p>
                        </div>
                      </div>

                      {quizScore === activeQuiz.length && selectedMilestone.status !== 'COMPLETED' && (
                        <button
                          type="button"
                          onClick={() => handleMilestoneAction(selectedMilestone, 'COMPLETED')}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                        >
                          <Award size={14} />
                          <span>Claim Badge (+50 XP)</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* 3 Questions List */}
                  <div className="flex flex-col gap-6">
                    {activeQuiz.map((q, qIdx) => {
                      const selectedOption = quizAnswers[qIdx];
                      const isAnswered = selectedOption !== undefined;

                      return (
                        <div 
                          key={qIdx}
                          className="p-5 rounded-2xl bg-input/40 border border-border/80 flex flex-col gap-3.5 shadow-xs"
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xs font-bold font-mono flex-shrink-0 mt-0.5">
                              {qIdx + 1}
                            </span>
                            <h4 className="text-sm font-bold text-main m-0 leading-snug">
                              {q.question}
                            </h4>
                          </div>

                          {/* Options */}
                          <div className="grid grid-cols-1 gap-2 pl-8">
                            {q.options.map((option, optIdx) => {
                              const isSelected = selectedOption === optIdx;
                              const isCorrect = q.correctIndex === optIdx;

                              let cardStyles = 'bg-input/70 hover:bg-input border-border/80 text-muted';
                              if (quizSubmitted) {
                                if (isCorrect) {
                                  cardStyles = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 font-semibold';
                                } else if (isSelected && !isCorrect) {
                                  cardStyles = 'bg-rose-500/15 border-rose-500/50 text-rose-300 line-through';
                                }
                              } else if (isSelected) {
                                cardStyles = 'bg-indigo-600/15 border-indigo-500/60 text-indigo-300 font-semibold ring-1 ring-indigo-500/30';
                              }

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  disabled={quizSubmitted}
                                  onClick={() => {
                                    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
                                  }}
                                  className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${cardStyles}`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <span className="w-5 h-5 rounded-md bg-input border border-border flex items-center justify-center text-[10px] font-mono font-bold text-muted flex-shrink-0">
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    <span className="leading-relaxed">{option}</span>
                                  </div>

                                  {quizSubmitted && isCorrect && (
                                    <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                                  )}
                                  {quizSubmitted && isSelected && !isCorrect && (
                                    <X size={16} className="text-rose-400 flex-shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quiz Action Buttons */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    {quizSubmitted ? (
                      <button
                        type="button"
                        onClick={() => {
                          setQuizAnswers({});
                          setQuizSubmitted(false);
                          setQuizScore(null);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-input text-main hover:bg-input/80 border border-border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
                      >
                        <RefreshCw size={13} />
                        <span>Retry Knowledge Check</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleQuizSubmit(activeQuiz)}
                        disabled={Object.keys(quizAnswers).length < activeQuiz.length}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                          Object.keys(quizAnswers).length >= activeQuiz.length
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 cursor-pointer'
                            : 'bg-input text-muted/50 border border-border cursor-not-allowed'
                        }`}
                      >
                        <CheckSquare size={14} />
                        <span>Submit Assessment ({Object.keys(quizAnswers).length}/{activeQuiz.length} answered)</span>
                      </button>
                    )}

                    {selectedMilestone.status !== 'COMPLETED' && (
                      <button
                        type="button"
                        onClick={() => handleMilestoneAction(selectedMilestone, 'COMPLETED')}
                        className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Check size={13} />
                        <span>Skip to Mark Completed</span>
                      </button>
                    )}
                  </div>

                </div>
              )}

            </div>
          </div>
        )}
      </div>

    </div>
  );
}
