import { 
  Target, CheckCircle2, Circle, Sparkles, Compass, 
  Video, FileText, Bot, Flame, Trophy, TrendingUp,
  ArrowRight, BookOpen, Clock, ExternalLink, Users, Calendar, Award, Code2, Zap
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
      
      {/* ── Global Search Launcher ── */}
      <GlobalSearch />

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

    </div>
  );
}
