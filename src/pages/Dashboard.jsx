import { 
  Target, CheckCircle2, Circle, Sparkles, Compass, 
  Video, FileText, Bot, Flame, Trophy, TrendingUp,
  ArrowRight, BookOpen, Clock, ExternalLink, Users, Calendar, Award, Code2, Zap,
  Info, Star, MessageSquare, Send, Mail, MapPin, Globe, ShieldCheck, Check
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalSearch from '../components/GlobalSearch';
import db from '../services/db';
import { useToast } from '../contexts/ToastContext';
import { getRoadmapForJob } from '../utils/roadmapData';
import { getResourcesForStep } from '../utils/resourceData';

export default function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();

  const [user, setUser] = useState({ 
    firstName: 'Alex', 
    lastName: 'Johnson', 
    dreamJob: 'Machine Learning Engineer',
    level: 5,
    streak: 7,
    careerMatch: 94
  });
  const [dailyTasks, setDailyTasks] = useState([]);
  const [liveResources, setLiveResources] = useState([]);

  // Feedback Form State
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackCategory, setFeedbackCategory] = useState('Platform Architecture');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const scrollToAbout = () => {
    const el = document.getElementById('about-nexora-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      toast.error('Please write a short note before submitting feedback.');
      return;
    }
    const stored = JSON.parse(localStorage.getItem('nexora_feedback_list') || '[]');
    const newEntry = {
      id: `fb-${Date.now()}`,
      userName: `${user.firstName} ${user.lastName}`,
      rating: feedbackRating,
      category: feedbackCategory,
      text: feedbackText,
      timestamp: new Date().toISOString()
    };
    stored.push(newEntry);
    localStorage.setItem('nexora_feedback_list', JSON.stringify(stored));
    setFeedbackSubmitted(true);
    setFeedbackText('');
    toast.success('Thank you! Your feedback has been transmitted to the NEXORA Core Team.');
  };

  // Dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const loadUserData = () => {
    const currentUser = db.getCurrentUser();
    if (currentUser) {
      setUser({
        firstName: currentUser.firstName || 'Alex',
        lastName: currentUser.lastName || '',
        dreamJob: currentUser.dreamJob || 'Machine Learning Engineer',
        level: currentUser.level || 5,
        streak: currentUser.streak || 7,
        careerMatch: currentUser.careerMatch || 94
      });
    }
  };

  useEffect(() => {
    loadUserData();
    window.addEventListener('user_session_changed', loadUserData);
    return () => window.removeEventListener('user_session_changed', loadUserData);
  }, []);

  // Sync daily tasks and real-time learning stream to target dream job
  useEffect(() => {
    const job = (user.dreamJob || '').toLowerCase();
    let tasks = [];
    
    if (job.includes('data') || job.includes('machine learning') || job.includes('ai')) {
      tasks = [
        { id: 1, title: 'Complete PyTorch Neural Architecture Module', description: 'Train CNN & Transformer layers on benchmark datasets.', completed: true, xp: 50 },
        { id: 2, title: 'Review Model Evaluation & Latency Optimization', description: 'Understand precision, recall, and quantization.', completed: false, xp: 40 },
        { id: 3, title: 'Practice Advanced SQL Query Tuning', description: 'Enhance big data indexing and partition strategies.', completed: false, xp: 35 }
      ];
    } else if (job.includes('full stack')) {
      tasks = [
        { id: 1, title: 'Build React 19 + Node.js API Service', description: 'Create resilient full-stack microservices from scratch.', completed: true, xp: 50 },
        { id: 2, title: 'Design PostgreSQL Relational Schema', description: 'Plan indexing, foreign keys, and migration pipelines.', completed: false, xp: 40 },
        { id: 3, title: 'Deploy Containerized App with Docker', description: 'Implement containerization and CI/CD workflow.', completed: false, xp: 45 }
      ];
    } else {
      tasks = [
        { id: 1, title: 'Complete Core Aptitude & Logic Assessment', description: 'Evaluate foundational problem-solving abilities.', completed: true, xp: 40 },
        { id: 2, title: `Research Top Industry Expectations for ${user.dreamJob}`, description: 'Identify target companies and high-leverage competencies.', completed: false, xp: 30 },
        { id: 3, title: 'Optimize Technical Resume for ATS Parsers', description: 'Highlight measurable project achievements and key tech stack.', completed: false, xp: 50 }
      ];
    }
    
    const savedProgress = JSON.parse(localStorage.getItem('nexora_task_progress') || '{}');
    const mergedTasks = tasks.map(task => ({
      ...task,
      completed: savedProgress[task.id] !== undefined ? savedProgress[task.id] : task.completed
    }));
    
    setDailyTasks(mergedTasks);

    // Fetch dynamic live learning resources for target role
    try {
      const domain = getRoadmapForJob(user.dreamJob);
      const firstStep = domain.coreSteps?.[0] || { id: 'ds_1', title: 'Foundations' };
      const resources = getResourcesForStep(firstStep);
      setLiveResources(resources.slice(0, 4));
    } catch {
      setLiveResources([]);
    }
  }, [user.dreamJob]);

  const toggleTask = (taskId, e) => {
    e.stopPropagation();
    const updated = dailyTasks.map(task => {
      if (task.id === taskId) {
        const nextState = !task.completed;
        if (nextState) toast.success(`Objective completed! +${task.xp} XP added`);
        return { ...task, completed: nextState };
      }
      return task;
    });
    setDailyTasks(updated);

    const progressMap = JSON.parse(localStorage.getItem('nexora_task_progress') || '{}');
    progressMap[taskId] = !progressMap[taskId];
    localStorage.setItem('nexora_task_progress', JSON.stringify(progressMap));
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
      title: 'AI Career Copilot',
      desc: '24/7 technical guidance',
      icon: Bot,
      color: '#a855f7',
      path: '/chatbot',
      badge: 'Online'
    }
  ];

  return (
    <div className="workstation-container animate-fade-in flex flex-col gap-md">
      
      {/* ── Global Search & Quick About Jump Bar ── */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-sm">
        <div className="flex-1">
          <GlobalSearch />
        </div>
        <button
          onClick={scrollToAbout}
          className="btn btn-secondary flex items-center justify-center gap-xs"
          style={{ padding: '9px 18px', fontSize: '0.8rem', borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap' }}
          title="Jump down to About NEXORA & Platform Overview"
        >
          <Info size={15} className="text-primary" />
          <span>About NEXORA ↓</span>
        </button>
      </div>

      {/* ── Compact Top Ribbon (Stats) ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-sm">
        <div className="glass-panel skeuo-convex interactive flex items-center gap-sm" style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
          <div className="skeuo-well" style={{ padding: '8px', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={18} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, fontWeight: 600 }}>Career Match</p>
            <p className="tabular-numbers font-bold text-main" style={{ fontSize: '1.15rem', margin: 0 }}>{user.careerMatch}%</p>
          </div>
        </div>

        <div className="glass-panel skeuo-convex interactive flex items-center gap-sm" style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
          <div className="skeuo-well" style={{ padding: '8px', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={18} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, fontWeight: 600 }}>Sprint Progress</p>
            <p className="tabular-numbers font-bold text-main" style={{ fontSize: '1.15rem', margin: 0 }}>
              {completedCount}/{dailyTasks.length} ({taskPercent}%)
            </p>
          </div>
        </div>

        <div className="glass-panel skeuo-convex interactive flex items-center gap-sm" style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
          <div className="skeuo-well" style={{ padding: '8px', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flame size={18} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, fontWeight: 600 }}>Daily Streak</p>
            <p className="tabular-numbers font-bold text-main" style={{ fontSize: '1.15rem', margin: 0 }}>{user.streak} Days 🔥</p>
          </div>
        </div>

        <div className="glass-panel skeuo-convex interactive flex items-center gap-sm" style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
          <div className="skeuo-well" style={{ padding: '8px', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trophy size={18} />
          </div>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, fontWeight: 600 }}>Mastery Rank</p>
            <p className="tabular-numbers font-bold text-main" style={{ fontSize: '1.15rem', margin: 0 }}>Tier Level {user.level}</p>
          </div>
        </div>
      </div>

      {/* ── 12-Column Responsive Workspace Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md" style={{ alignItems: 'start' }}>
        
        {/* ── LEFT/MAIN WORKSPACE (8 Columns) ── */}
        <div className="lg:col-span-8 flex flex-col gap-md">
          
          {/* Target Trajectory Hero */}
          <div 
            className="glass-panel skeuo-convex interactive"
            style={{ 
              padding: '20px 24px', 
              borderRadius: 'var(--radius-lg)', 
              position: 'relative', 
              overflow: 'hidden',
              cursor: 'pointer',
              border: '1px solid var(--border-color)'
            }}
            onClick={() => navigate('/roadmap')}
          >
            <div style={{ position: 'absolute', top: -15, right: -15, opacity: 0.07 }}>
              <Target size={130} />
            </div>

            <div className="flex justify-between items-start flex-wrap gap-sm relative z-10">
              <div>
                <div className="flex items-center gap-xs mb-xs">
                  <Sparkles size={15} className="text-primary" />
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--primary)' }}>
                    ACTIVE CAREER TRAJECTORY
                  </span>
                </div>
                <h2 className="text-gradient" style={{ fontSize: '1.45rem', fontWeight: 800, margin: '2px 0 6px 0' }}>
                  {user.dreamJob}
                </h2>
                <p className="text-muted" style={{ fontSize: '0.88rem', maxWidth: '640px', lineHeight: 1.5, margin: 0 }}>
                  Optimal alignment computed at <strong>{user.careerMatch}%</strong>. Complete your active sprint tasks below to accelerate interview readiness.
                </p>
              </div>

              <button 
                className="btn btn-primary flex items-center gap-xs" 
                style={{ fontSize: '0.82rem', padding: '8px 18px', alignSelf: 'center' }}
              >
                <span>View Full Roadmap</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Interactive Sprint Objectives */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
            <div className="flex justify-between items-center mb-sm">
              <div className="flex items-center gap-xs">
                <Zap size={18} className="text-warning" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>Daily Sprint Objectives</h3>
              </div>
              <span className="badge text-primary" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                {completedCount} of {dailyTasks.length} Completed
              </span>
            </div>

            <div className="flex flex-col gap-xs">
              {dailyTasks.map((task) => (
                <div 
                  key={task.id}
                  onClick={(e) => toggleTask(task.id, e)}
                  className={`interactive flex items-start gap-sm p-sm rounded-md transition-all ${task.completed ? 'opacity-70' : ''}`}
                  style={{ 
                    background: task.completed ? 'var(--input-bg)' : 'var(--bg-card)', 
                    border: '1px solid var(--border-color)',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ marginTop: '2px' }}>
                    {task.completed ? (
                      <CheckCircle2 size={20} className="text-success" />
                    ) : (
                      <Circle size={20} className="text-muted" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p style={{ 
                      margin: 0, 
                      fontSize: '0.9rem', 
                      fontWeight: 700, 
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: 'var(--text-main)'
                    }}>
                      {task.title}
                    </p>
                    <p className="text-muted" style={{ margin: '2px 0 0 0', fontSize: '0.78rem', lineHeight: 1.4 }}>
                      {task.description}
                    </p>
                  </div>
                  <span className="badge text-warning font-bold" style={{ fontSize: '0.72rem' }}>
                    +{task.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Real-Time Learning Stream (Space-filling & High Value) ── */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
            <div className="flex justify-between items-center mb-sm">
              <div className="flex items-center gap-xs">
                <BookOpen size={18} className="text-primary" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>Real-Time Learning Stream</h3>
              </div>
              <button 
                onClick={() => navigate('/resources')}
                className="text-primary flex items-center gap-xs"
                style={{ fontSize: '0.8rem', fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                Browse All <ArrowRight size={13} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
              {liveResources.map((res) => (
                <div 
                  key={res.id}
                  onClick={() => navigate(`/resource/${res.id}`, { state: { resource: res } })}
                  className="skeuo-convex interactive flex flex-col justify-between gap-xs"
                  style={{ 
                    padding: '14px', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card)',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <div className="flex justify-between items-center mb-xs">
                      <span className="badge" style={{ fontSize: '0.68rem', fontWeight: 700, background: 'var(--primary-glow)', color: 'var(--primary)' }}>
                        {res.type}
                      </span>
                      <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                        {res.duration}
                      </span>
                    </div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>
                      {res.title}
                    </h4>
                    <p className="text-muted" style={{ margin: 0, fontSize: '0.76rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {res.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-xs" style={{ borderTop: '1px solid var(--border-color)', marginTop: '8px' }}>
                    <span className="text-muted" style={{ fontSize: '0.74rem', fontWeight: 600 }}>{res.source}</span>
                    <span className="text-primary flex items-center gap-xs" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                      Study <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Launchpad Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-sm">
            {quickLaunchers.map((ql) => {
              const Icon = ql.icon;
              return (
                <div 
                  key={ql.path}
                  onClick={() => navigate(ql.path)}
                  className="glass-panel skeuo-convex interactive flex flex-col justify-between"
                  style={{ padding: '14px', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                >
                  <div className="flex justify-between items-start mb-sm">
                    <div className="skeuo-well" style={{ padding: '8px', color: ql.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={18} />
                    </div>
                    <span className="badge" style={{ fontSize: '0.65rem', fontWeight: 700, background: 'var(--input-bg)' }}>
                      {ql.badge}
                    </span>
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 2px 0', fontSize: '0.88rem', fontWeight: 700 }}>{ql.title}</h4>
                    <p className="text-muted" style={{ margin: 0, fontSize: '0.74rem' }}>{ql.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* ── RIGHT TELEMETRY RAIL (4 Columns) ── */}
        <div className="lg:col-span-4 flex flex-col gap-md">
          
          {/* Skill Mastery Breakdown */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
            <div className="flex items-center gap-xs mb-sm">
              <Award size={18} className="text-primary" />
              <h3 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 800 }}>Skill Competency Radar</h3>
            </div>
            
            <div className="flex flex-col gap-sm">
              {[
                { name: 'Core Architecture & Logic', score: 92, color: 'var(--primary)' },
                { name: 'Data Structures & Algorithms', score: 85, color: '#14b8a6' },
                { name: 'Frameworks & Production APIs', score: 78, color: '#f43f5e' },
                { name: 'Cloud, Docker & CI/CD', score: 68, color: '#f59e0b' }
              ].map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between items-center mb-xs">
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{skill.name}</span>
                    <span className="tabular-numbers font-bold" style={{ fontSize: '0.8rem', color: skill.color }}>{skill.score}%</span>
                  </div>
                  <div className="skeuo-well" style={{ height: '7px', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${skill.score}%`, 
                        height: '100%', 
                        background: skill.color, 
                        borderRadius: '9999px',
                        boxShadow: `0 0 8px ${skill.color}`
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Hackathon Opportunities */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
            <div className="flex justify-between items-center mb-sm">
              <div className="flex items-center gap-xs">
                <Trophy size={18} className="text-warning" />
                <h3 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 800 }}>Hackathon Radar</h3>
              </div>
              <button 
                onClick={() => navigate('/hackathons')}
                className="text-primary"
                style={{ fontSize: '0.76rem', fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                View All
              </button>
            </div>

            <div className="flex flex-col gap-sm">
              <div 
                className="skeuo-convex interactive p-sm rounded-md"
                style={{ padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', cursor: 'pointer' }}
                onClick={() => navigate('/hackathons')}
              >
                <div className="flex justify-between items-center mb-xs">
                  <span className="badge text-success font-bold" style={{ fontSize: '0.65rem' }}>Open Registration</span>
                  <span className="text-muted" style={{ fontSize: '0.72rem' }}>3 Days Left</span>
                </div>
                <h5 style={{ margin: '0 0 2px 0', fontSize: '0.86rem', fontWeight: 700 }}>AI Global Hackathon 2026</h5>
                <p className="text-muted" style={{ margin: 0, fontSize: '0.75rem' }}>$40,000 Prize Pool · Remote · Teams of 2-4</p>
              </div>

              <div 
                className="skeuo-convex interactive p-sm rounded-md"
                style={{ padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', cursor: 'pointer' }}
                onClick={() => navigate('/hackathons')}
              >
                <div className="flex justify-between items-center mb-xs">
                  <span className="badge text-primary font-bold" style={{ fontSize: '0.65rem' }}>Featured</span>
                  <span className="text-muted" style={{ fontSize: '0.72rem' }}>Next Week</span>
                </div>
                <h5 style={{ margin: '0 0 2px 0', fontSize: '0.86rem', fontWeight: 700 }}>Web3 & Cloud Scalability Cup</h5>
                <p className="text-muted" style={{ margin: 0, fontSize: '0.75rem' }}>Hosted by Google Cloud & Polygon</p>
              </div>
            </div>
          </div>

          {/* Community Velocity / Activity Stream */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
            <div className="flex items-center gap-xs mb-sm">
              <Users size={18} className="text-accent" />
              <h3 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 800 }}>Community Pulse</h3>
            </div>

            <div className="flex flex-col gap-xs">
              {[
                { user: 'Sarah K.', action: 'completed PyTorch Transformer Lab', time: '12m ago', icon: '🚀' },
                { user: 'Liam M.', action: 'scored 91% on Fullstack ATS Resume', time: '45m ago', icon: '📄' },
                { user: 'Dev Team Delta', action: 'joined AI Global Hackathon', time: '2h ago', icon: '🏆' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-xs" style={{ fontSize: '0.78rem', padding: '6px 0' }}>
                  <span>{item.icon}</span>
                  <div className="flex-1">
                    <strong className="text-main">{item.user}</strong> <span className="text-muted">{item.action}</span>
                  </div>
                  <span className="text-muted" style={{ fontSize: '0.7rem' }}>{item.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ── ABOUT NEXORA, CORE PILLARS, FEEDBACK & SOCIAL SECTION ── */}
      <section 
        id="about-nexora-section" 
        className="glass-panel mt-xl p-lg flex flex-col gap-xl animate-fade-in"
        style={{ 
          padding: '2.5rem', 
          borderRadius: 'var(--radius-xl)', 
          background: 'linear-gradient(180deg, rgba(24, 24, 27, 0.6) 0%, rgba(9, 9, 11, 0.95) 100%)',
          border: '1px solid var(--border-color)',
          marginTop: '3rem'
        }}
      >
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto gap-xs">
          <span 
            className="badge" 
            style={{ 
              background: 'rgba(99, 102, 241, 0.15)', 
              color: 'var(--primary)', 
              padding: '4px 12px', 
              borderRadius: 'var(--radius-full)', 
              fontSize: '0.74rem', 
              fontWeight: 700,
              letterSpacing: '0.5px'
            }}
          >
            CAREER INTELLIGENCE OPERATING SYSTEM
          </span>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '8px 0 6px 0', letterSpacing: '-0.5px' }}>
            About NEXORA
          </h2>
          <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
            NEXORA is an AI-orchestrated engineering accelerator engineered to transform aspiring technologists into top 1% global software talent. We bridge academic theory with Fortune 500 production standards through adaptive career roadmaps, real-time proctored mock interviews, ATS resume diagnostics, and collaborative virtual workspaces.
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
          <div className="glass-panel p-md flex flex-col gap-xs" style={{ background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <Compass size={20} />
            </div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '6px 0 2px 0' }}>Adaptive Career Paths</h4>
            <p className="text-muted" style={{ fontSize: '0.78rem', margin: 0, lineHeight: 1.5 }}>
              Dynamic milestones continuously synchronizing with user goals and emerging enterprise frameworks.
            </p>
          </div>

          <div className="glass-panel p-md flex flex-col gap-xs" style={{ background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(20, 184, 166, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#14b8a6' }}>
              <Video size={20} />
            </div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '6px 0 2px 0' }}>Proctored Voice AI Lab</h4>
            <p className="text-muted" style={{ fontSize: '0.78rem', margin: 0, lineHeight: 1.5 }}>
              MNC technical and STAR interviews featuring live voice answering, eye-contact tracking, and instant feedback.
            </p>
          </div>

          <div className="glass-panel p-md flex flex-col gap-xs" style={{ background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f43f5e' }}>
              <FileText size={20} />
            </div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '6px 0 2px 0' }}>ATS Semantic Diagnostics</h4>
            <p className="text-muted" style={{ fontSize: '0.78rem', margin: 0, lineHeight: 1.5 }}>
              Multi-channel resume scoring against live recruiter algorithms to guarantee interview shortlist velocity.
            </p>
          </div>

          <div className="glass-panel p-md flex flex-col gap-xs" style={{ background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7' }}>
              <Users size={20} />
            </div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '6px 0 2px 0' }}>Peer Nexus Workstations</h4>
            <p className="text-muted" style={{ fontSize: '0.78rem', margin: 0, lineHeight: 1.5 }}>
              Collaborative coding IDEs, test runners, and real-time voice channels to solve engineering challenges together.
            </p>
          </div>
        </div>

        {/* Platform Telemetry Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-sm pt-sm" style={{ borderTop: '1px solid var(--border-color)' }}>
          <div className="text-center p-sm">
            <span className="font-extrabold text-primary" style={{ fontSize: '1.6rem', display: 'block' }}>120,000+</span>
            <span className="text-muted" style={{ fontSize: '0.76rem' }}>Active Engineers</span>
          </div>
          <div className="text-center p-sm">
            <span className="font-extrabold text-success" style={{ fontSize: '1.6rem', display: 'block' }}>94.6%</span>
            <span className="text-muted" style={{ fontSize: '0.76rem' }}>Placement Match</span>
          </div>
          <div className="text-center p-sm">
            <span className="font-extrabold text-warning" style={{ fontSize: '1.6rem', display: 'block' }}>500+</span>
            <span className="text-muted" style={{ fontSize: '0.76rem' }}>MNC Partners</span>
          </div>
          <div className="text-center p-sm">
            <span className="font-extrabold text-accent" style={{ fontSize: '1.6rem', display: 'block' }}>4.9 / 5.0</span>
            <span className="text-muted" style={{ fontSize: '0.76rem' }}>Candidate Satisfaction</span>
          </div>
        </div>

        {/* 2-Column: Contact Information & Interactive Candidate Feedback Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg pt-md" style={{ borderTop: '1px solid var(--border-color)' }}>
          {/* LEFT 5 COLS: Contact & Global Operations */}
          <div className="lg:col-span-5 flex flex-col gap-md">
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 6px 0' }}>Get in Touch with NEXORA</h3>
              <p className="text-muted" style={{ fontSize: '0.8rem', margin: 0, lineHeight: 1.5 }}>
                Have questions about enterprise partnerships, career tracks, or technical integrations? Our engineering operations team is on call.
              </p>
            </div>

            <div className="flex flex-col gap-sm">
              <div className="flex items-center gap-sm p-sm rounded-lg" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
                <Mail size={16} className="text-primary" />
                <div>
                  <span className="text-muted block" style={{ fontSize: '0.7rem' }}>Engineering & Operations:</span>
                  <a href="mailto:support@nexora.ai" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', textDecoration: 'none' }}>
                    support@nexora.ai
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-sm p-sm rounded-lg" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
                <Globe size={16} className="text-minimal-cyan" />
                <div>
                  <span className="text-muted block" style={{ fontSize: '0.7rem' }}>Enterprise Inquiries:</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>enterprise@nexora.ai</span>
                </div>
              </div>

              <div className="flex items-center gap-sm p-sm rounded-lg" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
                <MapPin size={16} className="text-minimal-amber" />
                <div>
                  <span className="text-muted block" style={{ fontSize: '0.7rem' }}>Global Innovation Hubs:</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Silicon Valley, CA • Bengaluru, India</span>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div>
              <span className="text-muted block mb-xs" style={{ fontSize: '0.74rem', fontWeight: 600 }}>CONNECT WITH OUR COMMUNITY:</span>
              <div className="flex items-center gap-xs">
                {/* GitHub */}
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-icon-tactile"
                  title="GitHub Community"
                  style={{ padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>

                {/* LinkedIn */}
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-icon-tactile"
                  title="LinkedIn"
                  style={{ padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>

                {/* X / Twitter */}
                <a 
                  href="https://x.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-icon-tactile"
                  title="X (Twitter)"
                  style={{ padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>

                {/* Discord */}
                <a 
                  href="https://discord.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-icon-tactile"
                  title="Discord Community"
                  style={{ padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                </a>

                {/* YouTube */}
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-icon-tactile"
                  title="YouTube"
                  style={{ padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT 7 COLS: Interactive Candidate Feedback Form */}
          <div className="lg:col-span-7 glass-panel p-md" style={{ borderRadius: 'var(--radius-lg)', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-xs mb-xs">
              <MessageSquare size={17} className="text-primary" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Candidate Experience &amp; Feedback</h3>
            </div>
            <p className="text-muted mb-md" style={{ fontSize: '0.78rem', lineHeight: 1.5 }}>
              Your critique directly guides weekly enhancements to our AI engines, question banks, and learning algorithms.
            </p>

            {feedbackSubmitted ? (
              <div className="p-lg text-center flex flex-col items-center gap-xs animate-scale-in" style={{ background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Check size={22} />
                </div>
                <h4 style={{ margin: '4px 0 0 0', fontSize: '1rem', fontWeight: 700 }}>Feedback Transmitted!</h4>
                <p className="text-muted" style={{ margin: 0, fontSize: '0.78rem' }}>
                  Thank you for helping us polish NEXORA. We review all candidate submissions.
                </p>
                <button
                  type="button"
                  onClick={() => setFeedbackSubmitted(false)}
                  className="btn btn-secondary mt-xs"
                  style={{ padding: '6px 14px', fontSize: '0.76rem' }}
                >
                  Submit Another Note
                </button>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-sm">
                {/* 5-Star Rating Selector */}
                <div>
                  <label className="input-label" style={{ fontSize: '0.76rem', marginBottom: '4px' }}>
                    Platform Experience Rating:
                  </label>
                  <div className="flex items-center gap-xs">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackRating(star)}
                        className="btn-icon-tactile"
                        style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer' }}
                        title={`${star} Stars`}
                      >
                        <Star 
                          size={20} 
                          fill={star <= feedbackRating ? '#f59e0b' : 'transparent'} 
                          color={star <= feedbackRating ? '#f59e0b' : 'var(--text-muted)'} 
                        />
                      </button>
                    ))}
                    <span className="text-muted" style={{ fontSize: '0.74rem', marginLeft: '6px' }}>
                      ({feedbackRating} / 5 Stars)
                    </span>
                  </div>
                </div>

                {/* Category Dropdown */}
                <div className="input-group mb-0">
                  <label className="input-label" style={{ fontSize: '0.76rem' }}>Feedback Category</label>
                  <select 
                    className="input-field"
                    value={feedbackCategory}
                    onChange={e => setFeedbackCategory(e.target.value)}
                    style={{ fontSize: '0.82rem' }}
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
                  <label className="input-label" style={{ fontSize: '0.76rem' }}>Your Critique or Suggestion</label>
                  <textarea 
                    rows={3}
                    className="input-field"
                    value={feedbackText}
                    onChange={e => setFeedbackText(e.target.value)}
                    placeholder="Tell us what you liked or what features we should enhance..."
                    style={{ fontSize: '0.82rem', resize: 'vertical', lineHeight: 1.5 }}
                  />
                </div>

                <div className="flex justify-end pt-xs">
                  <button 
                    type="submit"
                    className="btn btn-primary flex items-center gap-xs"
                    style={{ padding: '8px 20px', fontSize: '0.82rem', width: 'auto' }}
                  >
                    <Send size={14} /> Submit Feedback
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-md gap-xs" style={{ borderTop: '1px solid var(--border-color)', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
          <span>© 2026 NEXORA Career Intelligence Systems. All rights reserved.</span>
          <div className="flex items-center gap-md">
            <span className="cursor-pointer hover:text-main" onClick={() => navigate('/privacy')}>Privacy Policy</span>
            <span>•</span>
            <span className="cursor-pointer hover:text-main" onClick={() => navigate('/terms')}>Terms of Service</span>
            <span>•</span>
            <span className="cursor-pointer hover:text-main" onClick={() => navigate('/help')}>Knowledge Base</span>
          </div>
        </div>
      </section>

    </div>
  );
}
