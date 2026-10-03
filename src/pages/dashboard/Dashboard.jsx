import {
  Target, CheckCircle2, Circle, Sparkles, Compass,
  Video, FileText, Bot, Flame, Trophy, TrendingUp,
  ArrowRight, BookOpen, Users, Award, Zap,
  Star, MessageSquare, Send, Check, X, Info, Lock,
  LayoutDashboard, ExternalLink, ShieldCheck, ChevronRight
} from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalSearch from '../../components/dashboard/GlobalSearch';
import SocialTicker from '../../components/common/SocialTicker';
import StatsRibbon from '../../components/dashboard/StatsRibbon';
import CompetencyRadar from '../../components/dashboard/CompetencyRadar';
import DailySprintObjectives from '../../components/dashboard/DailySprintObjectives';
import db from '../../services/db';
import apiClient from '../../services/apiClient';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { getRoadmapForJob } from '../../utils/roadmapData';
import { getResourcesForStep } from '../../utils/resourceData';

const TRACK_COMPETENCIES = {
  'data': [
    { key: 'math', name: 'Applied Statistics & Probability', base: 80, color: 'var(--primary)' },
    { key: 'ml', name: 'PyTorch, Deep Learning & Transformers', base: 75, color: '#14b8a6' },
    { key: 'pipeline', name: 'Feature Engineering & ETL Pipelines', base: 72, color: '#f43f5e' },
    { key: 'mlops', name: 'MLOps Ingress & Model Serving', base: 66, color: '#f59e0b' }
  ],
  'fullstack': [
    { key: 'arch', name: 'Full-Stack Architecture & State', base: 78, color: 'var(--primary)' },
    { key: 'api', name: 'REST/GraphQL & Microservices', base: 74, color: '#14b8a6' },
    { key: 'db', name: 'PostgreSQL & Database Design', base: 70, color: '#f43f5e' },
    { key: 'devops', name: 'Docker & CI/CD Deployment', base: 65, color: '#f59e0b' }
  ],
  'frontend': [
    { key: 'react', name: 'Component Systems & React 19', base: 82, color: 'var(--primary)' },
    { key: 'css', name: 'CSS Architecture & Glassmorphism', base: 85, color: '#14b8a6' },
    { key: 'perf', name: 'Core Web Vitals & Bundle Tuning', base: 70, color: '#f43f5e' },
    { key: 'test', name: 'Accessibility (a11y) & Testing', base: 68, color: '#f59e0b' }
  ],
  'backend': [
    { key: 'k8s', name: 'Distributed Systems & Go/Node', base: 76, color: 'var(--primary)' },
    { key: 'cicd', name: 'Database Clusters & Caching', base: 80, color: '#14b8a6' },
    { key: 'iac', name: 'Cloud Infra & Terraform', base: 68, color: '#f43f5e' },
    { key: 'mon', name: 'Observability, SRE & Chaos', base: 65, color: '#f59e0b' }
  ],
  'design': [
    { key: 'figma', name: 'Visual Hierarchy & Figma Design', base: 84, color: 'var(--primary)' },
    { key: 'ux', name: 'User Research & Journey Mapping', base: 76, color: '#14b8a6' },
    { key: 'tokens', name: 'Design Systems & Token Sync', base: 72, color: '#f43f5e' },
    { key: 'proto', name: 'Micro-Interactions & Prototyping', base: 70, color: '#f59e0b' }
  ],
  'game': [
    { key: 'engine', name: 'Unity 6 & C# Engine Architecture', base: 80, color: 'var(--primary)' },
    { key: 'fsm', name: 'Player Mechanics & State Machines', base: 74, color: '#14b8a6' },
    { key: 'ai', name: 'NavMesh & Enemy Behavior Trees', base: 68, color: '#f43f5e' },
    { key: 'shaders', name: 'Shader Graphs & Visual Effects', base: 64, color: '#f59e0b' }
  ],
  'blockchain': [
    { key: 'sol', name: 'Solidity & EVM Architecture', base: 76, color: 'var(--primary)' },
    { key: 'dapp', name: 'Wagmi & Viem dApp Integration', base: 72, color: '#14b8a6' },
    { key: 'audit', name: 'Smart Contract Security Auditing', base: 70, color: '#f43f5e' },
    { key: 'l2', name: 'Layer 2 Rollups & Multi-Chain', base: 66, color: '#f59e0b' }
  ],
  'security': [
    { key: 'net', name: 'Network Defense & Protocol Analysis', base: 78, color: 'var(--primary)' },
    { key: 'crypto', name: 'Linux Privilege Escalation', base: 75, color: '#14b8a6' },
    { key: 'pen', name: 'Web App Pentesting & OWASP Top 10', base: 72, color: '#f43f5e' },
    { key: 'siem', name: 'Incident Response & SOC SIEM', base: 68, color: '#f59e0b' }
  ],
  'analytics': [
    { key: 'sql', name: 'Advanced SQL & Dimensional Schemas', base: 82, color: 'var(--primary)' },
    { key: 'bi', name: 'Tableau & Power BI Dashboards', base: 78, color: '#14b8a6' },
    { key: 'funnel', name: 'Cohort Retention & Funnel Testing', base: 72, color: '#f43f5e' },
    { key: 'stats', name: 'Statistical Forecasting & dbt', base: 67, color: '#f59e0b' }
  ],
  'qa': [
    { key: 'cases', name: 'Test Matrix & Jira Defect Tracking', base: 82, color: 'var(--primary)' },
    { key: 'api', name: 'API Testing & Postman Automation', base: 78, color: '#14b8a6' },
    { key: 'e2e', name: 'Playwright & E2E Browser Automation', base: 72, color: '#f43f5e' },
    { key: 'load', name: 'Performance & k6 Load Profiling', base: 68, color: '#f59e0b' }
  ],
  'mobile': [
    { key: 'reactnative', name: 'React Native & Cross-Platform UI', base: 78, color: 'var(--primary)' },
    { key: 'native', name: 'Device Hardware & Biometrics', base: 70, color: '#14b8a6' },
    { key: 'offline', name: 'Offline SQLite & Realtime Sync', base: 74, color: '#f43f5e' },
    { key: 'deploy', name: 'Reanimated 3 & App Store Release', base: 65, color: '#f59e0b' }
  ],
  'marketing': [
    { key: 'seo', name: 'Technical SEO & Programmatic Pages', base: 80, color: 'var(--primary)' },
    { key: 'ads', name: 'Performance Marketing & Meta CAPI', base: 75, color: '#14b8a6' },
    { key: 'auto', name: 'Lifecycle Marketing Automation', base: 72, color: '#f43f5e' },
    { key: 'cro', name: 'Landing Page CRO & Viral Loops', base: 68, color: '#f59e0b' }
  ]
};

TRACK_COMPETENCIES['full-stack'] = TRACK_COMPETENCIES['fullstack'];
TRACK_COMPETENCIES['data-science'] = TRACK_COMPETENCIES['data'];
TRACK_COMPETENCIES['cloud-devops'] = TRACK_COMPETENCIES['backend'];
TRACK_COMPETENCIES['cybersecurity'] = TRACK_COMPETENCIES['security'];

const TRACK_HACKATHONS = {
  'data': [
    { name: 'HackMIT 2026 (AI Track)', host: 'Massachusetts Institute of Technology', deadline: 'Oct 18, 2026', prize: '$25,000+ USD', badge: 'Frontier AI' },
    { name: 'Google Solution Challenge 2026', host: 'Google Developer Student Clubs', deadline: 'Dec 15, 2026', prize: '$12,000 USD + Mentorship', badge: 'Social Impact' }
  ],
  'fullstack': [
    { name: 'Smart India Hackathon 2026', host: 'Ministry of Education & AICTE', deadline: 'Nov 01, 2026', prize: '₹1,00,000 / Problem Statement', badge: 'National Challenge' },
    { name: 'Major League Hacking Global Sprint', host: 'Major League Hacking', deadline: 'Oct 05, 2026', prize: 'Swag Bundles + Grants', badge: 'Global Event' }
  ],
  'frontend': [
    { name: 'React India Design Hack 2026', host: 'React Community & Meta', deadline: 'Oct 22, 2026', prize: '₹5,00,000 + Dev Swag', badge: 'Design & UX' },
    { name: 'Unstop National Tech Championship', host: 'Unstop & Tech Giants', deadline: 'Nov 28, 2026', prize: '₹10,00,000 + PPIs', badge: 'Hiring Fast-Track' }
  ],
  'backend': [
    { name: 'AWS Cloud Innovators Cup 2026', host: 'Amazon Web Services', deadline: 'Nov 10, 2026', prize: '$30,000 AWS Credits', badge: 'Cloud Native' },
    { name: 'Kubernetes Community Day Hack', host: 'CNCF Community', deadline: 'Nov 25, 2026', prize: '$15,000 + Certifications', badge: 'DevOps' }
  ],
  'design': [
    { name: 'Figma Community Design Jam 2026', host: 'Figma Global', deadline: 'Nov 12, 2026', prize: '$10,000 + Config Passes', badge: 'Product Design' },
    { name: 'Global UX Redesign Sprint', host: 'Interaction Design Foundation', deadline: 'Dec 02, 2026', prize: 'Design Fellowships', badge: 'UX Research' }
  ],
  'game': [
    { name: 'Global Game Jam 2026', host: 'Global Game Jam Inc.', deadline: 'Oct 28, 2026', prize: '$20,000 + Steam Showcase', badge: 'Game Engine' }
  ],
  'blockchain': [
    { name: 'ETHGlobal Istanbul 2026', host: 'ETHGlobal Core', deadline: 'Nov 14, 2026', prize: '$125,000 in Bounties', badge: 'Web3 Infra' }
  ],
  'security': [
    { name: 'DEF CON CTF Open Quals 2026', host: 'DEF CON Communications', deadline: 'Nov 02, 2026', prize: 'Black Badges + Bounty', badge: 'Capture The Flag' }
  ],
  'analytics': [
    { name: 'Kaggle Global Data Cup 2026', host: 'Kaggle & Alphabet', deadline: 'Oct 30, 2026', prize: '$50,000 USD', badge: 'Machine Learning' }
  ],
  'qa': [
    { name: 'Ministry of Testing TestBash Hack', host: 'Ministry of Testing UK', deadline: 'Dec 08, 2026', prize: '£5,000 + Pro Licenses', badge: 'Automation' }
  ],
  'mobile': [
    { name: 'Apple Swift Student Challenge', host: 'Apple Inc.', deadline: 'Dec 01, 2026', prize: 'WWDC26 Travel Grant', badge: 'iOS Ecosystem' }
  ],
  'marketing': [
    { name: 'Product Hunt Maker Sprint 2026', host: 'Product Hunt Global', deadline: 'Nov 18, 2026', prize: '$15,000 Launch Grant', badge: 'Growth Marketing' }
  ]
};

TRACK_HACKATHONS['full-stack'] = TRACK_HACKATHONS['fullstack'];
TRACK_HACKATHONS['data-science'] = TRACK_HACKATHONS['data'];
TRACK_HACKATHONS['cloud-devops'] = TRACK_HACKATHONS['backend'];
TRACK_HACKATHONS['cybersecurity'] = TRACK_HACKATHONS['security'];

export default function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user: authUser, loading: authLoading, refreshUser } = useAuth();

  // Active Modular Tab ('overview' | 'learning' | 'community')
  const [activeTab, setActiveTab] = useState('overview');

  // Modals for consolidated bulky sections
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Learning Stream filter state
  const [learningFilter, setLearningFilter] = useState('All');

  const [user, setUser] = useState(() => {
    const cur = authUser || db.getCurrentUser();
    const role = cur?.targetRole || cur?.dreamJob || 'Developer';
    const domain = cur?.domain || 'Engineering';
    const matched = getRoadmapForJob(role || domain);
    return {
      id: cur?.id || null,
      firstName: cur?.firstName || (cur?.name ? cur.name.split(' ')[0] : 'Explorer'),
      lastName: cur?.lastName || (cur?.name ? cur.name.split(' ').slice(1).join(' ') : ''),
      name: cur?.name || '',
      domain: domain,
      targetRole: role,
      dreamJob: role,
      selectedTrack: cur?.track || cur?.selectedTrack || matched.id,
      tier: cur?.tier || 'free',
      profileCompleted: Boolean(cur?.profileCompleted),
      level: cur?.level || 1,
      streak: cur?.streak || 1,
      careerMatch: cur?.careerMatch || 88
    };
  });

  // Re-sync with real-time MongoDB profile when authUser is updated
  useEffect(() => {
    if (authUser) {
      const targetRole = authUser.targetRole || authUser.dreamJob || 'Developer';
      const domain = authUser.domain || 'Engineering';
      const matched = getRoadmapForJob(targetRole || domain);
      setUser(prev => ({
        ...prev,
        ...authUser,
        id: authUser.id || authUser._id || prev.id,
        firstName: authUser.firstName || (authUser.name ? authUser.name.split(' ')[0] : prev.firstName),
        lastName: authUser.lastName || (authUser.name ? authUser.name.split(' ').slice(1).join(' ') : prev.lastName),
        name: authUser.name || prev.name,
        domain: domain,
        targetRole: targetRole,
        dreamJob: targetRole,
        selectedTrack: authUser.track || authUser.selectedTrack || matched.id,
        tier: authUser.tier || prev.tier || 'free',
        profileCompleted: Boolean(authUser.profileCompleted)
      }));
    }
  }, [authUser]);

  // Live dynamic data fetching from GET /api/v1/users/me on mount
  useEffect(() => {
    let isMounted = true;
    const fetchFreshUser = async () => {
      try {
        const res = await apiClient.get('/api/v1/users/me');
        if (res.success && res.data && isMounted) {
          const raw = res.data?.data || res.data?.user || res.data;
          const role = raw.targetRole || raw.dreamJob || 'Developer';
          const domain = raw.domain || 'Engineering';
          const matched = getRoadmapForJob(role || domain);
          setUser(prev => ({
            ...prev,
            ...raw,
            id: raw.id || raw._id || prev.id,
            name: raw.name || prev.name,
            firstName: raw.firstName || (raw.name ? raw.name.split(' ')[0] : prev.firstName),
            lastName: raw.lastName || (raw.name ? raw.name.split(' ').slice(1).join(' ') : prev.lastName),
            targetRole: role,
            dreamJob: role,
            domain: domain,
            selectedTrack: raw.track || raw.selectedTrack || matched.id
          }));
        }
      } catch (err) {
        console.warn('[Dashboard] Live me fetch notice:', err?.message);
      }
    };

    fetchFreshUser();
    refreshUser(true);
    return () => { isMounted = false; };
  }, [refreshUser]);

  // Dynamic roadmap curriculum derived directly from user's targetRole/dreamJob/domain
  const activeRoadmap = useMemo(() => {
    return getRoadmapForJob(user.targetRole || user.dreamJob || user.domain || 'Developer');
  }, [user.targetRole, user.dreamJob, user.domain]);

  // Live DAG Roadmap from MongoDB backend
  const [liveRoadmap, setLiveRoadmap] = useState(() => {
    try {
      const cached = localStorage.getItem('nexora_active_roadmap');
      if (cached) return JSON.parse(cached);
    } catch {}
    return null;
  });

  const fetchLiveRoadmap = async () => {
    try {
      const role = user.targetRole || user.dreamJob;
      const domain = user.domain;
      const query = role ? `?role=${encodeURIComponent(role)}&domain=${encodeURIComponent(domain || '')}` : '';
      const res = await apiClient.get(`/api/v1/roadmap${query}`);
      const rawRoadmap = res.data?.data?.roadmap || res.data?.roadmap;
      if (res.success && rawRoadmap) {
        setLiveRoadmap(rawRoadmap);
        localStorage.setItem('nexora_active_roadmap', JSON.stringify(rawRoadmap));
      }
    } catch (err) {
      console.warn('[Dashboard] Live roadmap fetch notice:', err?.message);
    }
  };

  useEffect(() => {
    fetchLiveRoadmap();
  }, [user.targetRole, user.domain]);

  // Flatten all DAG milestones across phases
  const allDagMilestones = useMemo(() => {
    if (liveRoadmap?.phases?.length > 0) {
      const list = [];
      liveRoadmap.phases.forEach((phase) => {
        phase.milestones.forEach((m) => {
          list.push({ ...m, phaseTitle: phase.phaseTitle, phaseOrder: phase.order });
        });
      });
      return list;
    }
    return (activeRoadmap.coreSteps || []).map((s, idx) => ({
      milestoneId: s.id,
      title: s.title,
      description: s.description,
      skills: s.skills || [],
      status: idx === 0 ? 'AVAILABLE' : 'LOCKED',
      estimatedHours: 25,
      phaseTitle: 'Phase 1: Core Architecture'
    }));
  }, [liveRoadmap, activeRoadmap]);

  // Active DAG phase (the phase containing currently IN_PROGRESS or first AVAILABLE milestone)
  const activeDagPhase = useMemo(() => {
    if (liveRoadmap?.phases?.length > 0) {
      return (
        liveRoadmap.phases.find((p) =>
          p.milestones.some((m) => m.status === 'IN_PROGRESS' || m.status === 'AVAILABLE')
        ) || liveRoadmap.phases[0]
      );
    }
    return {
      phaseTitle: 'Phase 1: Core Architecture & Foundations',
      order: 1
    };
  }, [liveRoadmap]);

  // Next pending or active milestone
  const nextPendingMilestone = useMemo(() => {
    return (
      allDagMilestones.find((m) => m.status === 'IN_PROGRESS') ||
      allDagMilestones.find((m) => m.status === 'AVAILABLE') ||
      allDagMilestones[0]
    );
  }, [allDagMilestones]);

  // Real-time progress metrics
  const roadmapProgressPercent = typeof liveRoadmap?.progressPercentage === 'number'
    ? liveRoadmap.progressPercentage
    : (allDagMilestones.length > 0 ? Math.round((allDagMilestones.filter(m => m.status === 'COMPLETED').length / allDagMilestones.length) * 100) : 0);

  const completedDagCount = liveRoadmap?.completedMilestones ?? allDagMilestones.filter((m) => m.status === 'COMPLETED').length;
  const totalDagCount = liveRoadmap?.totalMilestones || allDagMilestones.length || 5;

  // Base tasks calculated directly from active roadmap milestones
  const baseTasks = useMemo(() => {
    const steps = allDagMilestones.length >= 3 ? allDagMilestones : (activeRoadmap.coreSteps || []);
    if (steps.length >= 3) {
      return [
        {
          id: 1,
          title: `Milestone 1 Sprint: ${steps[0]?.title}`,
          description: steps[0]?.description || `Master core ${steps[0]?.skills?.join(', ')} competencies.`,
          completed: steps[0]?.status === 'COMPLETED',
          xp: 50
        },
        {
          id: 2,
          title: `Milestone 2 Sprint: ${steps[1]?.title}`,
          description: steps[1]?.description || `Practice ${steps[1]?.skills?.join(', ')} patterns and code exercises.`,
          completed: steps[1]?.status === 'COMPLETED',
          xp: 45
        },
        {
          id: 3,
          title: `Milestone 3 Sprint: ${steps[2]?.title}`,
          description: steps[2]?.description || `Build real-world production ${steps[2]?.skills?.join(', ')} deliverables.`,
          completed: steps[2]?.status === 'COMPLETED',
          xp: 40
        }
      ];
    }
    const roleTitle = user.targetRole || user.dreamJob || 'Developer';
    return [
      { id: 1, title: `Complete Aptitude Sprint for ${roleTitle}`, description: 'Core problem solving and architectural foundations.', completed: false, xp: 50 },
      { id: 2, title: `Research Top Industry Expectations for ${roleTitle}`, description: 'Identify target companies and high-leverage competencies.', completed: false, xp: 40 },
      { id: 3, title: 'Optimize Technical Resume for ATS Parsers', description: 'Highlight measurable project achievements.', completed: false, xp: 35 }
    ];
  }, [allDagMilestones, activeRoadmap, user.targetRole, user.dreamJob]);

  // Local task completion state
  const [taskProgress, setTaskProgress] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('nexora_task_progress') || '{}');
    } catch {
      return {};
    }
  });

  // Derived dailyTasks dynamically combining current baseTasks with taskProgress
  const dailyTasks = useMemo(() => {
    return baseTasks.map(t => ({
      ...t,
      completed: !!taskProgress[t.id] || t.completed
    }));
  }, [baseTasks, taskProgress]);

  // Registered hackathons from localStorage
  const [registeredHackathons, setRegisteredHackathons] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('nexora_registered_hackathons') || '[]');
    } catch {
      return [];
    }
  });

  // Track roadmap milestone completions
  const [completedMilestonesCount, setCompletedMilestonesCount] = useState(() => {
    return completedDagCount;
  });

  useEffect(() => {
    setCompletedMilestonesCount(completedDagCount);
  }, [completedDagCount]);

  const refreshActivityData = () => {
    try {
      fetchLiveRoadmap();
      const savedHacks = JSON.parse(localStorage.getItem('nexora_registered_hackathons') || '[]');
      setRegisteredHackathons(savedHacks);
    } catch (e) {
      console.warn('Error refreshing activity data:', e);
    }
  };

  // Feedback Form State
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackCategory, setFeedbackCategory] = useState('Platform Architecture');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Dynamic greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Listen to hash for deep-linking (e.g. /dashboard#contact-feedback-section from About page)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#contact-feedback-section' || hash === '#feedback') {
        setActiveTab('community');
        setTimeout(() => {
          const el = document.getElementById('contact-feedback-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Listen to session changes and realtime profile updates from Firebase RTDB
  useEffect(() => {
    const handleSession = () => {
      const currentUser = db.getCurrentUser();
      if (currentUser) {
        const raw = currentUser.data || currentUser.user || currentUser;
        const role = raw.targetRole || raw.dreamJob || 'Developer';
        const domain = raw.domain || 'Engineering';
        const matched = getRoadmapForJob(role || domain);
        setUser(prev => ({
          ...prev,
          ...raw,
          id: raw.id || raw._id || prev.id,
          name: raw.name || prev.name,
          firstName: raw.firstName || (raw.name ? raw.name.split(' ')[0] : prev.firstName),
          lastName: raw.lastName || (raw.name ? raw.name.split(' ').slice(1).join(' ') : prev.lastName),
          domain: domain,
          targetRole: role,
          dreamJob: role,
          selectedTrack: raw.track || raw.selectedTrack || matched.id,
          level: raw.level || prev.level || 1,
          streak: raw.streak || prev.streak || 1,
          careerMatch: raw.careerMatch || prev.careerMatch || 88
        }));
      }
      refreshActivityData();
    };

    window.addEventListener('user_session_changed', handleSession);

    return () => {
      window.removeEventListener('user_session_changed', handleSession);
    };
  }, []);

  // Live learning resources derived from user target dream job
  const liveResources = useMemo(() => {
    try {
      const firstStep = activeRoadmap.coreSteps?.[0] || { id: 'step_1', title: 'Foundations' };
      const secondStep = activeRoadmap.coreSteps?.[1];
      const res1 = getResourcesForStep(firstStep);
      const res2 = secondStep ? getResourcesForStep(secondStep) : [];
      const combined = [...res1, ...res2];
      // Deduplicate by id
      const seen = new Set();
      return combined.filter(r => {
        if (seen.has(r.id)) return false;
        seen.add(r.id);
        return true;
      });
    } catch {
      return [];
    }
  }, [activeRoadmap]);

  const filteredResources = useMemo(() => {
    if (learningFilter === 'All') return liveResources;
    return liveResources.filter(r => r.type?.toLowerCase() === learningFilter.toLowerCase());
  }, [liveResources, learningFilter]);

  const completedTasksCount = useMemo(() => {
    return dailyTasks.filter(t => t.completed).length;
  }, [dailyTasks]);

  const activeCompetencies = useMemo(() => {
    const trackKey = activeRoadmap.id || user.selectedTrack || 'fullstack';
    const compList = TRACK_COMPETENCIES[trackKey] || TRACK_COMPETENCIES['fullstack'] || TRACK_COMPETENCIES['full-stack'];
    
    // Dynamic points boost from user actions (milestone toggles + sprint tasks completed)
    const boost = (completedMilestonesCount * 4) + (completedTasksCount * 3);

    return compList.map((skill, index) => {
      const weightedBoost = boost + (index === 0 ? 3 : index === 1 ? 2 : 1);
      const score = Math.min(98, skill.base + weightedBoost);
      return {
        ...skill,
        score
      };
    });
  }, [activeRoadmap, user.selectedTrack, completedMilestonesCount, completedTasksCount]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      toast.error('Please write a short note before submitting feedback.');
      return;
    }
    const newEntry = {
      id: `fb-${Date.now()}`,
      userName: `${user.firstName} ${user.lastName}`.trim() || 'Explorer',
      rating: feedbackRating,
      category: feedbackCategory,
      text: feedbackText,
      timestamp: new Date().toISOString()
    };

    // Save to local cache
    try {
      const stored = JSON.parse(localStorage.getItem('nexora_feedback_list') || '[]');
      stored.push(newEntry);
      localStorage.setItem('nexora_feedback_list', JSON.stringify(stored));
    } catch (err) {
      console.warn('Feedback local storage notice:', err);
    }

    setFeedbackSubmitted(true);
    setFeedbackText('');
    toast.success('Thank you! Your feedback has been transmitted to the NEXORA Core Team in real time.');
  };

  const toggleTask = (taskId, e) => {
    e.stopPropagation();
    const nextState = !taskProgress[taskId];
    const taskObj = dailyTasks.find(t => t.id === taskId);
    if (nextState) toast.success(`Objective completed! +${taskObj?.xp || 45} XP added`);

    const updatedMap = { ...taskProgress, [taskId]: nextState };
    setTaskProgress(updatedMap);

    // Local optimistic cache
    try {
      localStorage.setItem('nexora_task_progress', JSON.stringify(updatedMap));
    } catch (err) {
      console.warn('Local task cache notice:', err);
    }
  };

  const completedCount = dailyTasks.filter(t => t.completed).length;
  const taskPercent = Math.round((completedCount / Math.max(dailyTasks.length, 1)) * 100);

  // Quick Action Launchers
  const quickLaunchers = [
    {
      title: 'Interactive Roadmap',
      desc: 'Dynamic track & subsets',
      icon: Compass,
      color: 'var(--primary)',
      path: '/roadmap',
      badge: 'Active Track'
    },
    {
      title: 'Mock Interview Lab',
      desc: 'AI coding & system design',
      icon: Video,
      color: '#14b8a6',
      path: '/mock-interview',
      badge: 'Practice'
    },
    {
      title: 'Resume ATS Studio',
      desc: 'Instant keyword audit & score',
      icon: FileText,
      color: '#f43f5e',
      path: '/resume',
      badge: 'Audit Ready'
    },
    {
      title: 'NEXORA AI Mentor',
      desc: '24/7 technical guidance',
      icon: Bot,
      color: '#a855f7',
      path: '/chatbot',
      badge: 'Online'
    }
  ];

  return (
    <div className="workstation-container animate-fade-in flex flex-col gap-6" style={{ paddingBottom: '3rem' }}>
      
      {/* ── Global Search Command Bar ── */}
      <div className="w-full">
        <GlobalSearch />
      </div>

      {/* ── Executive Segmented Tab Navigation & Actions ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-1">
        
        {/* Responsive Segmented Tabs Bar */}
        <div 
          className="flex items-center p-1 rounded-xl overflow-x-auto custom-scroll"
          style={{ 
            background: 'var(--input-bg)', 
            border: '1px solid var(--border-color)',
            scrollbarWidth: 'none'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer"
            style={{
              background: activeTab === 'overview' ? 'var(--minimal-indigo, #6366f1)' : 'transparent',
              color: activeTab === 'overview' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: activeTab === 'overview' ? '0 2px 10px rgba(99, 102, 241, 0.35)' : 'none'
            }}
          >
            <LayoutDashboard size={14} />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('learning')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer"
            style={{
              background: activeTab === 'learning' ? 'var(--minimal-indigo, #6366f1)' : 'transparent',
              color: activeTab === 'learning' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: activeTab === 'learning' ? '0 2px 10px rgba(99, 102, 241, 0.35)' : 'none'
            }}
          >
            <BookOpen size={14} />
            <span>Learning Stream</span>
            <span 
              className="px-1.5 py-0.2 rounded-full text-[10px]" 
              style={{ 
                background: activeTab === 'learning' ? 'rgba(255, 255, 255, 0.2)' : 'var(--border-color)',
                color: activeTab === 'learning' ? '#ffffff' : 'var(--text-muted)'
              }}
            >
              {liveResources.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('community')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer"
            style={{
              background: activeTab === 'community' ? 'var(--minimal-indigo, #6366f1)' : 'transparent',
              color: activeTab === 'community' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: activeTab === 'community' ? '0 2px 10px rgba(99, 102, 241, 0.35)' : 'none'
            }}
          >
            <Users size={14} />
            <span>Community &amp; Feedback</span>
          </button>
        </div>

        {/* Executive Quick Actions */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={() => setShowAboutModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-muted hover:text-main transition-colors cursor-pointer"
            style={{ border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}
            title="View NEXORA Core Architecture & Pillars"
          >
            <Info size={13} className="text-primary" />
            <span className="hidden xs:inline">Platform Specs</span>
          </button>

          <button
            type="button"
            onClick={() => setShowFeedbackModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-primary transition-all cursor-pointer"
            style={{ 
              background: 'rgba(99, 102, 241, 0.08)', 
              border: '1px solid rgba(99, 102, 241, 0.25)' 
            }}
            title="Send transmission to NEXORA engineering core"
          >
            <MessageSquare size={13} />
            <span>Feedback</span>
          </button>
        </div>
      </div>

      {/* ── TAB 1: OVERVIEW (Daily Command Center) ── */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          
          {/* ── Compact Top Ribbon (Stats) ── */}
          <StatsRibbon 
            user={user} 
            completedCount={completedCount} 
            totalTasks={dailyTasks.length} 
            taskPercent={taskPercent} 
          />

          {/* ── 12-Column Responsive Workspace Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" style={{ alignItems: 'start' }}>
            
            {/* ── LEFT/MAIN WORKSPACE (8 Columns) ── */}
            <div className="lg:col-span-8 flex flex-col gap-6">

              {/* Target Trajectory Hero with Roadmap Progression */}
              <div 
                className="glass-panel skeuo-convex interactive"
                style={{ 
                  padding: '24px 28px', 
                  borderRadius: 'var(--radius-xl)', 
                  position: 'relative', 
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid var(--border-color)'
                }}
                onClick={() => navigate('/roadmap')}
              >
                <div style={{ position: 'absolute', top: -15, right: -15, opacity: 0.05, pointerEvents: 'none' }}>
                  <Compass size={160} />
                </div>

                <div className="flex justify-between items-start flex-wrap gap-4 relative z-10">
                  <div className="flex-1" style={{ minWidth: '280px' }}>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <Sparkles size={14} className="text-primary" />
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--primary)' }}>
                        {greeting}, {user.firstName || user.name || 'Explorer'} · DYNAMIC CAREER TRAJECTORY
                      </span>
                      <span className="minimal-badge font-mono text-[10px]" style={{ padding: '2px 8px' }}>
                        ● {(user.domain || activeRoadmap.category || 'Engineering').toUpperCase()}
                      </span>
                    </div>
                    
                    <h2 className="text-gradient" style={{ fontSize: '1.55rem', fontWeight: 800, margin: '4px 0 6px 0', letterSpacing: '-0.3px' }}>
                      {activeRoadmap.title}
                    </h2>
                    
                    <p className="text-muted" style={{ fontSize: '0.88rem', maxWidth: '680px', lineHeight: 1.5, margin: '0 0 18px 0' }}>
                      Target Role: <strong className="text-primary">{user.targetRole || user.dreamJob || 'Developer'}</strong>. {activeRoadmap.description}
                    </p>

                    {/* Live Active Phase & Pending Milestone Banner */}
                    <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-input/50 border border-border/80 my-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                          Active Phase
                        </span>
                        <span className="text-xs font-bold text-main truncate max-w-sm">
                          {activeDagPhase.phaseTitle}
                        </span>
                      </div>
                      {nextPendingMilestone && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-muted font-medium">Pending:</span>
                          <span className="font-bold text-primary truncate max-w-xs">
                            {nextPendingMilestone.title}
                          </span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                            nextPendingMilestone.status === 'IN_PROGRESS' 
                              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-400/30' 
                              : nextPendingMilestone.status === 'AVAILABLE'
                                ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                                : nextPendingMilestone.status === 'COMPLETED'
                                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                  : 'bg-input text-muted border-border/50'
                          }`}>
                            {nextPendingMilestone.status}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Dynamic Velocity & Telemetry Bar */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 bg-input h-2 rounded-full overflow-hidden border border-border/50">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
                          style={{ width: `${roadmapProgressPercent}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold font-mono text-primary flex-shrink-0">
                        {roadmapProgressPercent}% Telemetry ({completedDagCount}/{totalDagCount} Cleared)
                      </span>
                    </div>

                    {/* 5-Step Visual Roadmap Progression Strip */}
                    <div className="pt-2" style={{ borderTop: '1px solid var(--border-color)' }}>
                      <div className="flex justify-between items-center mb-2.5">
                        <div className="flex items-center gap-1.5">
                          <Compass size={14} className="text-primary" />
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-main)' }}>
                            Roadmap Progression Nodes
                          </span>
                        </div>
                        <span className="text-primary font-mono" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                          {completedDagCount} of {totalDagCount} Cleared
                        </span>
                      </div>

                      {/* Horizontal Milestone Nodes */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {allDagMilestones.slice(0, 5).map((step, idx) => {
                          const isCompleted = step.status === 'COMPLETED';
                          const isInProgress = step.status === 'IN_PROGRESS';
                          const isAvailable = step.status === 'AVAILABLE';
                          const isLocked = step.status === 'LOCKED';

                          return (
                            <div 
                              key={step.milestoneId || step.id} 
                              className="p-2.5 rounded-xl flex flex-col justify-between transition-all"
                              style={{ 
                                background: isCompleted 
                                  ? 'rgba(16, 185, 129, 0.08)' 
                                  : isInProgress 
                                    ? 'rgba(6, 182, 212, 0.12)' 
                                    : isAvailable 
                                      ? 'rgba(99, 102, 241, 0.10)' 
                                      : 'var(--input-bg)',
                                border: `1px solid ${
                                  isCompleted 
                                    ? 'rgba(16, 185, 129, 0.3)' 
                                    : isInProgress 
                                      ? 'rgba(6, 182, 212, 0.5)' 
                                      : isAvailable 
                                        ? 'rgba(99, 102, 241, 0.4)' 
                                        : 'var(--border-color)'
                                }`
                              }}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span style={{ 
                                  fontSize: '0.65rem', 
                                  fontWeight: 700, 
                                  color: isCompleted ? 'var(--success)' : isInProgress ? '#06b6d4' : isAvailable ? 'var(--primary)' : 'var(--text-muted)' 
                                }}>
                                  STEP {idx + 1}
                                </span>
                                {isCompleted ? (
                                  <CheckCircle2 size={13} className="text-success" />
                                ) : isInProgress ? (
                                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#06b6d4', display: 'inline-block' }} className="animate-pulse" />
                                ) : isAvailable ? (
                                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--primary)', display: 'inline-block' }} />
                                ) : (
                                  <Lock size={11} className="text-muted/50" />
                                )}
                              </div>
                              <p 
                                className="truncate" 
                                title={step.title}
                                style={{ 
                                  fontSize: '0.74rem', 
                                  fontWeight: 600, 
                                  margin: 0, 
                                  color: isCompleted ? 'var(--text-main)' : isInProgress ? '#06b6d4' : isAvailable ? 'var(--text-main)' : 'var(--text-muted)',
                                  lineHeight: 1.3
                                }}
                              >
                                {step.title}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2" style={{ alignSelf: 'flex-start' }}>
                    <button 
                      onClick={() => navigate('/roadmap')}
                      className="btn btn-primary flex items-center gap-1.5 shadow-lg shadow-indigo-500/20" 
                      style={{ fontSize: '0.84rem', padding: '10px 18px', width: 'auto', whiteSpace: 'nowrap' }}
                    >
                      <span>Continue Learning</span>
                      <ArrowRight size={15} />
                    </button>
                    <span className="text-muted text-xs font-mono hidden sm:inline">
                      Assigned for {user.targetRole || user.dreamJob || 'Developer'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Daily Sprint Objectives */}
              <DailySprintObjectives 
                dailyTasks={dailyTasks} 
                completedCount={completedCount} 
                onToggleTask={toggleTask} 
              />

              {/* Quick Launchpad Workstations */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {quickLaunchers.map((ql) => {
                  const Icon = ql.icon;
                  return (
                    <div
                      key={ql.path}
                      onClick={() => navigate(ql.path)}
                      className="glass-panel skeuo-convex interactive flex flex-col justify-between"
                      style={{ padding: '16px', borderRadius: 'var(--radius-lg)', cursor: 'pointer' }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="skeuo-well" style={{ padding: '8px', color: ql.color, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                          <Icon size={18} />
                        </div>
                        <span className="minimal-badge font-mono text-[10px]" style={{ padding: '2px 6px' }}>
                          {ql.badge}
                        </span>
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 2px 0', fontSize: '0.88rem', fontWeight: 700 }}>{ql.title}</h4>
                        <p className="text-muted" style={{ margin: 0, fontSize: '0.74rem', lineHeight: 1.3 }}>{ql.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* ── RIGHT TELEMETRY RAIL (4 Columns) ── */}
            <div className="lg:col-span-4 flex flex-col gap-6">

              {/* Dynamic Skill Competency Radar */}
              <CompetencyRadar 
                user={user} 
                activeCompetencies={activeCompetencies} 
                boostPercent={Math.min(28, (completedMilestonesCount * 4) + (completedTasksCount * 3))} 
              />

              {/* Hackathon Radar */}
              <div className="glass-panel" style={{ padding: '22px', borderRadius: 'var(--radius-xl)' }}>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <Trophy size={18} className="text-warning" />
                    <h3 style={{ margin: 0, fontSize: '1.04rem', fontWeight: 800 }}>Hackathon Radar</h3>
                  </div>
                  <button 
                    onClick={() => navigate('/hackathons')}
                    className="text-primary font-semibold hover:underline cursor-pointer"
                    style={{ fontSize: '0.76rem', background: 'transparent', border: 'none' }}
                  >
                    {registeredHackathons.length > 0 ? `Active (${registeredHackathons.length})` : 'Explore All'}
                  </button>
                </div>

                <div className="flex flex-col gap-2.5">
                  {registeredHackathons.length > 0 ? (
                    registeredHackathons.slice(0, 2).map((hack, idx) => (
                      <div 
                        key={idx}
                        className="skeuo-convex interactive p-3 rounded-xl"
                        style={{ border: '1px solid var(--border-color)', cursor: 'pointer' }}
                        onClick={() => navigate('/hackathons')}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="minimal-badge text-[10px] text-success font-bold" style={{ padding: '2px 6px' }}>
                            ✓ Registered &amp; Active
                          </span>
                          <span className="text-muted text-[11px]">Due {hack.deadline}</span>
                        </div>
                        <h5 style={{ margin: '0 0 2px 0', fontSize: '0.86rem', fontWeight: 700 }}>{hack.name}</h5>
                        <p className="text-muted" style={{ margin: 0, fontSize: '0.74rem' }}>{hack.prize} · Host: {hack.host}</p>
                      </div>
                    ))
                  ) : (
                    (() => {
                      const activeTrack = activeRoadmap.id || user.selectedTrack || 'fullstack';
                      const curated = TRACK_HACKATHONS[activeTrack] || TRACK_HACKATHONS['fullstack'] || TRACK_HACKATHONS['full-stack'];
                      return curated.map((hack, idx) => (
                        <div 
                          key={idx}
                          className="skeuo-convex interactive p-3 rounded-xl"
                          style={{ border: '1px solid var(--border-color)', cursor: 'pointer' }}
                          onClick={() => navigate('/hackathons')}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="minimal-badge text-primary text-[10px] font-bold" style={{ padding: '2px 6px' }}>{hack.badge}</span>
                            <span className="text-muted text-[11px]">Due {hack.deadline}</span>
                          </div>
                          <h5 style={{ margin: '0 0 2px 0', fontSize: '0.86rem', fontWeight: 700 }}>{hack.name}</h5>
                          <p className="text-muted" style={{ margin: 0, fontSize: '0.74rem' }}>{hack.prize} · {hack.host}</p>
                        </div>
                      ));
                    })()
                  )}
                </div>
              </div>

              {/* Community Pulse Snippet */}
              <div className="glass-panel" style={{ padding: '22px', borderRadius: 'var(--radius-xl)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-accent" />
                    <h3 style={{ margin: 0, fontSize: '1.04rem', fontWeight: 800 }}>Community Pulse</h3>
                  </div>
                  <button 
                    onClick={() => setActiveTab('community')} 
                    className="text-primary hover:underline text-xs font-semibold cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {[
                    { user: 'Sarah K.', action: 'completed PyTorch Transformer Lab', time: '12m ago', icon: '🚀' },
                    { user: 'Liam M.', action: 'scored 91% on Fullstack ATS Resume', time: '45m ago', icon: '📄' },
                    { user: 'Dev Team Delta', action: 'joined AI Global Hackathon', time: '2h ago', icon: '🏆' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 py-1.5" style={{ fontSize: '0.78rem', borderBottom: idx < 2 ? '1px solid var(--border-color)' : 'none' }}>
                      <span>{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <strong className="text-main truncate block">{item.user}</strong>
                        <span className="text-muted truncate block text-xs">{item.action}</span>
                      </div>
                      <span className="text-muted text-[10px] flex-shrink-0 font-mono">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ── TAB 2: LEARNING STREAM (Dedicated Technical Study Studio) ── */}
      {activeTab === 'learning' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          
          {/* Track Context & Header Banner */}
          <div 
            className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            style={{ background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--input-bg) 100%)', border: '1px solid var(--border-color)' }}
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="minimal-badge text-[10px]" style={{ color: 'var(--minimal-indigo)', background: 'rgba(99, 102, 241, 0.1)' }}>
                  CURRICULUM STREAM
                </span>
                <span className="text-muted text-xs font-mono">
                  Track: {user.targetRole || user.dreamJob || 'Developer'} · Domain: {user.domain || 'Engineering'}
                </span>
              </div>
              <h2 className="text-gradient text-2xl font-extrabold m-0">
                {activeRoadmap.title} Learning Modules
              </h2>
              <p className="text-muted text-sm mt-1 mb-0 max-w-xl">
                Curated technical deep dives, system design blueprints, and production-tested engineering labs.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/resources')}
                className="btn btn-primary flex items-center gap-1.5 cursor-pointer"
                style={{ width: 'auto', padding: '10px 18px', fontSize: '0.84rem' }}
              >
                <BookOpen size={15} />
                <span>Full Catalog</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scroll" style={{ scrollbarWidth: 'none' }}>
            {['All', 'Course', 'Project', 'Article', 'Video'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setLearningFilter(cat)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                style={{
                  background: learningFilter === cat ? 'var(--minimal-indigo, #6366f1)' : 'var(--input-bg)',
                  color: learningFilter === cat ? '#ffffff' : 'var(--text-muted)',
                  border: `1px solid ${learningFilter === cat ? 'rgba(99, 102, 241, 0.4)' : 'var(--border-color)'}`
                }}
              >
                {cat === 'All' ? 'All Formats' : cat + 's'}
              </button>
            ))}
          </div>

          {/* Expanded Learning Resource Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((res) => (
              <div 
                key={res.id}
                onClick={() => navigate(`/resource/${res.id}`, { state: { resource: res } })}
                className="glass-panel skeuo-convex interactive flex flex-col justify-between p-5 rounded-2xl"
                style={{ 
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="minimal-badge text-[10px] font-bold" style={{ background: 'var(--primary-glow)', color: 'var(--primary)' }}>
                      {res.type}
                    </span>
                    <span className="text-muted text-xs font-mono">
                      {res.duration}
                    </span>
                  </div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.35 }}>
                    {res.title}
                  </h4>
                  <p className="text-muted" style={{ margin: 0, fontSize: '0.8rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {res.description}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-3 mt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <span className="text-muted text-xs font-semibold">{res.source}</span>
                  <span className="text-primary flex items-center gap-1 text-xs font-bold">
                    Start Learning <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ── TAB 3: COMMUNITY & FEEDBACK (Ecosystem & Transmissions) ── */}
      {activeTab === 'community' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          
          {/* Continuous Floating Social Media Ticker */}
          <div className="glass-panel p-4 rounded-2xl" style={{ border: '1px solid var(--border-color)' }}>
            <SocialTicker 
              title="LIVE SOCIAL ECOSYSTEM & COMMUNITY" 
              subtitle="Follow live codebase commits, system design discussions, tutorials, and community events."
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" style={{ alignItems: 'start' }}>
            
            {/* Left 6 Cols: Community Velocity & Hackathons */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              
              {/* Community Pulse Stream */}
              <div className="glass-panel p-6 rounded-2xl" style={{ border: '1px solid var(--border-color)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <Users size={18} className="text-accent" />
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Peer Velocity &amp; Activity</h3>
                </div>

                <div className="flex flex-col gap-3">
                  {[
                    { user: 'Sarah K.', action: 'completed PyTorch Transformer Lab', time: '12m ago', icon: '🚀', tag: 'AI Track' },
                    { user: 'Liam M.', action: 'scored 91% on Fullstack ATS Resume', time: '45m ago', icon: '📄', tag: 'Resume Studio' },
                    { user: 'Dev Team Delta', action: 'joined AI Global Hackathon', time: '2h ago', icon: '🏆', tag: 'Competitions' },
                    { user: 'Marcus Vance', action: 'passed FAANG System Design Mock', time: '3h ago', icon: '🎯', tag: 'Mock Lab' },
                    { user: 'Amina Nour', action: 'unlocked Senior Distributed Systems Tier', time: '5h ago', icon: '⭐', tag: 'Milestone' }
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 rounded-xl flex items-center justify-between gap-3"
                      style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                        <div className="min-w-0">
                          <p className="m-0 text-xs sm:text-sm font-bold text-main truncate">
                            {item.user} <span className="font-normal text-muted">{item.action}</span>
                          </p>
                          <span className="minimal-badge text-[10px] mt-1" style={{ padding: '1px 6px' }}>
                            {item.tag}
                          </span>
                        </div>
                      </div>
                      <span className="text-muted text-xs font-mono flex-shrink-0">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Hackathons */}
              <div className="glass-panel p-6 rounded-2xl" style={{ border: '1px solid var(--border-color)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy size={18} className="text-warning" />
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>National &amp; Global Hackathons</h3>
                  </div>
                  <button 
                    onClick={() => navigate('/hackathons')}
                    className="text-primary hover:underline text-xs font-semibold cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {(TRACK_HACKATHONS[activeRoadmap.id] || TRACK_HACKATHONS['fullstack']).map((hack, idx) => (
                    <div 
                      key={idx}
                      onClick={() => navigate('/hackathons')}
                      className="p-3.5 rounded-xl interactive flex flex-col justify-between"
                      style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', cursor: 'pointer' }}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="minimal-badge text-primary text-[10px] font-bold">{hack.badge}</span>
                        <span className="text-muted text-xs font-mono">Due {hack.deadline}</span>
                      </div>
                      <h4 style={{ margin: '4px 0 2px 0', fontSize: '0.92rem', fontWeight: 700 }}>{hack.name}</h4>
                      <p className="text-muted" style={{ margin: 0, fontSize: '0.78rem' }}>{hack.prize} · Host: {hack.host}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right 6 Cols: Candidate Feedback Station */}
            <div className="lg:col-span-6">
              
              <div 
                id="contact-feedback-section" 
                className="glass-panel p-6 rounded-2xl" 
                style={{ border: '1px solid var(--border-color)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare size={18} className="text-primary" />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Candidate Feedback Desk</h3>
                </div>
                <p className="text-muted text-xs sm:text-sm mb-5 leading-relaxed">
                  Your critique directly guides weekly enhancements to our AI engines, question banks, and learning algorithms.
                </p>

                {feedbackSubmitted ? (
                  <div className="p-8 text-center flex flex-col items-center gap-2 rounded-xl animate-fade-in" style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <Check size={24} />
                    </div>
                    <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: 700 }}>Feedback Transmitted!</h4>
                    <p className="text-muted text-xs sm:text-sm" style={{ margin: 0 }}>
                      Thank you for helping us polish NEXORA. We review all candidate submissions.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFeedbackSubmitted(false)}
                      className="btn btn-secondary mt-3 cursor-pointer"
                      style={{ padding: '8px 18px', fontSize: '0.82rem', width: 'auto' }}
                    >
                      Submit Another Note
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-4">
                    {/* 5-Star Rating Selector */}
                    <div>
                      <label className="input-label text-xs font-semibold block mb-1.5">
                        Platform Experience Rating:
                      </label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFeedbackRating(star)}
                            className="p-1.5 cursor-pointer transition-transform hover:scale-110"
                            title={`${star} Stars`}
                          >
                            <Star
                              size={22}
                              fill={star <= feedbackRating ? '#f59e0b' : 'transparent'}
                              color={star <= feedbackRating ? '#f59e0b' : 'var(--text-muted)'}
                            />
                          </button>
                        ))}
                        <span className="text-muted text-xs ml-2 font-mono">
                          ({feedbackRating} / 5 Stars)
                        </span>
                      </div>
                    </div>

                    {/* Category Dropdown */}
                    <div className="input-group mb-0">
                      <label className="input-label text-xs font-semibold">Feedback Category</label>
                      <select
                        className="input-field"
                        value={feedbackCategory}
                        onChange={e => setFeedbackCategory(e.target.value)}
                        style={{ fontSize: '0.86rem' }}
                      >
                        <option value="Platform Architecture">Platform Architecture &amp; UI</option>
                        <option value="AI Mock Interview">AI Mock Interview &amp; Voice Engine</option>
                        <option value="ATS Resume Analyzer">ATS Resume Analyzer &amp; Diagnostics</option>
                        <option value="Roadmaps & Learning">Career Roadmaps &amp; Learning Stream</option>
                        <option value="Peer Nexus Workstation">Peer Nexus Virtual Workstation</option>
                        <option value="Feature Request">New Feature Recommendation</option>
                      </select>
                    </div>

                    {/* Feedback Message */}
                    <div className="input-group mb-0">
                      <label className="input-label text-xs font-semibold">Your Critique or Suggestion</label>
                      <textarea
                        rows={4}
                        className="input-field"
                        value={feedbackText}
                        onChange={e => setFeedbackText(e.target.value)}
                        placeholder="Tell us what you liked or what features we should enhance..."
                        style={{ fontSize: '0.86rem', resize: 'vertical', lineHeight: 1.5 }}
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="btn btn-primary flex items-center gap-1.5 cursor-pointer"
                        style={{ padding: '10px 22px', fontSize: '0.86rem', width: 'auto' }}
                      >
                        <Send size={15} />
                        <span>Submit Feedback</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ── Low-Profile Executive Footer ── */}
      <footer 
        className="mt-6 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted"
        style={{ borderTop: '1px solid var(--border-color)' }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono">NEXORA Engine v2.6 · RTDB Connected</span>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-center">
          <button 
            type="button" 
            onClick={() => setShowAboutModal(true)}
            className="hover:text-main transition-colors cursor-pointer"
          >
            Platform Specs
          </button>
          <span>•</span>
          <button 
            type="button" 
            onClick={() => navigate('/settings/privacy')}
            className="hover:text-main transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <span>•</span>
          <button 
            type="button" 
            onClick={() => navigate('/terms')}
            className="hover:text-main transition-colors cursor-pointer"
          >
            Terms of Service
          </button>
          <span>•</span>
          <span className="text-muted">© 2026 NEXORA Systems Inc.</span>
        </div>
      </footer>

      {/* ── MODAL: Platform Specs / About NEXORA ── */}
      {showAboutModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.72)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setShowAboutModal(false)}
        >
          <div
            className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl animate-fade-in"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="minimal-badge text-[10px]" style={{ color: 'var(--minimal-indigo)', background: 'rgba(99, 102, 241, 0.1)' }}>
                  SYSTEM ARCHITECTURE
                </span>
                <span className="text-muted text-xs">Platform Specifications</span>
              </div>
              <button 
                onClick={() => setShowAboutModal(false)}
                className="text-muted hover:text-main cursor-pointer p-1"
                title="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <h2 className="text-gradient text-2xl sm:text-3xl font-extrabold mb-2">
              About NEXORA Platform
            </h2>
            <p className="text-muted text-xs sm:text-sm leading-relaxed mb-6">
              NEXORA is an AI-orchestrated career accelerator engineered to transform aspiring engineers into top 1% global talent through calibrated roadmaps, proctored mock interviews, and ATS resume telemetry.
            </p>

            {/* 4 Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="p-4 rounded-xl" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
                <div className="flex items-center gap-2 mb-1.5 text-primary font-bold text-sm">
                  <Compass size={16} />
                  <span>Adaptive Career Paths</span>
                </div>
                <p className="text-muted text-xs m-0 leading-relaxed">
                  Dynamic milestones continually calibrated against Fortune 500 engineering benchmarks and active job markets.
                </p>
              </div>

              <div className="p-4 rounded-xl" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
                <div className="flex items-center gap-2 mb-1.5 text-teal-400 font-bold text-sm">
                  <Video size={16} />
                  <span>Proctored Voice AI Lab</span>
                </div>
                <p className="text-muted text-xs m-0 leading-relaxed">
                  Autonomous coding and STAR interview simulations with live voice answering and gaze telemetry.
                </p>
              </div>

              <div className="p-4 rounded-xl" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
                <div className="flex items-center gap-2 mb-1.5 text-rose-400 font-bold text-sm">
                  <FileText size={16} />
                  <span>ATS Semantic Diagnostics</span>
                </div>
                <p className="text-muted text-xs m-0 leading-relaxed">
                  Real-time keyword matching and recruiter parse score optimization for enterprise hiring filters.
                </p>
              </div>

              <div className="p-4 rounded-xl" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
                <div className="flex items-center gap-2 mb-1.5 text-purple-400 font-bold text-sm">
                  <Users size={16} />
                  <span>Peer Nexus Workstations</span>
                </div>
                <p className="text-muted text-xs m-0 leading-relaxed">
                  Collaborative code playgrounds, shared test runners, and real-time community challenges.
                </p>
              </div>
            </div>

            {/* Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-xl mb-6 text-center" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
              <div>
                <span className="font-extrabold text-primary text-lg block">120,000+</span>
                <span className="text-muted text-[11px]">Active Engineers</span>
              </div>
              <div>
                <span className="font-extrabold text-success text-lg block">94.6%</span>
                <span className="text-muted text-[11px]">Placement Match</span>
              </div>
              <div>
                <span className="font-extrabold text-warning text-lg block">500+</span>
                <span className="text-muted text-[11px]">MNC Partners</span>
              </div>
              <div>
                <span className="font-extrabold text-accent text-lg block">4.9 / 5.0</span>
                <span className="text-muted text-[11px]">Satisfaction</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => { setShowAboutModal(false); navigate('/about'); }}
                className="btn btn-secondary cursor-pointer"
                style={{ width: 'auto', padding: '10px 18px', fontSize: '0.84rem' }}
              >
                <span>Full About Page</span>
                <ExternalLink size={14} />
              </button>
              <button 
                type="button" 
                onClick={() => setShowAboutModal(false)}
                className="btn btn-primary cursor-pointer"
                style={{ width: 'auto', padding: '10px 20px', fontSize: '0.84rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Quick Feedback Transmission ── */}
      {showFeedbackModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.72)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setShowFeedbackModal(false)}
        >
          <div
            className="glass-panel w-full max-w-lg p-6 sm:p-7 rounded-3xl animate-fade-in"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-primary" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Send Platform Feedback</h3>
              </div>
              <button 
                onClick={() => setShowFeedbackModal(false)}
                className="text-muted hover:text-main cursor-pointer p-1"
                title="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-muted text-xs sm:text-sm mb-4 leading-relaxed">
              Your feedback is transmitted directly to the engineering team in real time.
            </p>

            <form onSubmit={async (e) => {
              await handleFeedbackSubmit(e);
              setShowFeedbackModal(false);
            }} className="flex flex-col gap-3.5">
              <div>
                <label className="input-label text-xs font-semibold block mb-1">
                  Rating:
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        size={20}
                        fill={star <= feedbackRating ? '#f59e0b' : 'transparent'}
                        color={star <= feedbackRating ? '#f59e0b' : 'var(--text-muted)'}
                      />
                    </button>
                  ))}
                  <span className="text-muted text-xs ml-2 font-mono">
                    ({feedbackRating} / 5 Stars)
                  </span>
                </div>
              </div>

              <div className="input-group mb-0">
                <label className="input-label text-xs font-semibold">Category</label>
                <select
                  className="input-field"
                  value={feedbackCategory}
                  onChange={e => setFeedbackCategory(e.target.value)}
                  style={{ fontSize: '0.84rem' }}
                >
                  <option value="Platform Architecture">Platform Architecture &amp; UI</option>
                  <option value="AI Mock Interview">AI Mock Interview &amp; Voice Engine</option>
                  <option value="ATS Resume Analyzer">ATS Resume Analyzer &amp; Diagnostics</option>
                  <option value="Roadmaps & Learning">Career Roadmaps &amp; Learning Stream</option>
                  <option value="Peer Nexus Workstation">Peer Nexus Virtual Workstation</option>
                  <option value="Feature Request">New Feature Recommendation</option>
                </select>
              </div>

              <div className="input-group mb-0">
                <label className="input-label text-xs font-semibold">Your Note</label>
                <textarea
                  rows={3}
                  className="input-field"
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  placeholder="What can we improve in your experience?"
                  style={{ fontSize: '0.84rem', resize: 'vertical' }}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="btn btn-secondary cursor-pointer"
                  style={{ width: 'auto', padding: '9px 16px', fontSize: '0.82rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex items-center gap-1.5 cursor-pointer"
                  style={{ width: 'auto', padding: '9px 18px', fontSize: '0.82rem' }}
                >
                  <Send size={14} />
                  <span>Transmit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
