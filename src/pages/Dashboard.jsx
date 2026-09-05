import { 
  Target, CheckCircle2, Circle, Sparkles, Compass, 
  Video, FileText, Bot, Flame, Trophy, TrendingUp,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import SocialBtn from '../components/SocialBtn';
import GlobalSearch from '../components/GlobalSearch';
import db from '../services/db';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ 
    firstName: 'Alex', 
    lastName: 'Johnson', 
    dreamJob: 'Machine Learning Engineer',
    level: 5,
    streak: 7,
    careerMatch: 94
  });
  const [dailyTasks, setDailyTasks] = useState([]);

  // Time of day greeting
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

  useEffect(() => {
    const job = (user.dreamJob || '').toLowerCase();
    let tasks = [];
    
    if (job.includes('data') || job.includes('machine learning') || job.includes('ai')) {
      tasks = [
        { id: 1, title: 'Complete PyTorch Neural Architecture Module', description: 'Train CNN & Transformer layers on benchmark datasets.', completed: true },
        { id: 2, title: 'Review Model Evaluation & Latency Optimization', description: 'Understand precision, recall, and quantization.', completed: false },
        { id: 3, title: 'Practice Advanced SQL Query Tuning', description: 'Enhance big data indexing and partition strategies.', completed: false }
      ];
    } else if (job.includes('full stack')) {
      tasks = [
        { id: 1, title: 'Build React + Node.js API Service', description: 'Create resilient full-stack microservices from scratch.', completed: true },
        { id: 2, title: 'Design PostgreSQL Relational Schema', description: 'Plan indexing, foreign keys, and migration pipelines.', completed: false },
        { id: 3, title: 'Deploy Containerized App to Cloud', description: 'Implement Docker containerization and CI/CD workflow.', completed: false }
      ];
    } else if (job.includes('front') || job.includes('web')) {
      tasks = [
        { id: 1, title: 'Build Accessible Component Library', description: 'Develop reusable WCAG compliant frontend primitives.', completed: true },
        { id: 2, title: 'Master CSS Subgrid & Fluid Typography', description: 'Create responsive, high-performance UI systems.', completed: false },
        { id: 3, title: 'Optimize Core Web Vitals (LCP/CLS)', description: 'Improve performance score above 95 on Lighthouse.', completed: false }
      ];
    } else if (job.includes('back') || job.includes('cloud') || job.includes('devops')) {
      tasks = [
        { id: 1, title: 'Design RESTful & gRPC Schemas', description: 'Structure scalable and type-safe backend services.', completed: true },
        { id: 2, title: 'Configure Terraform AWS Infrastructure', description: 'Automate cloud provisioning with Infrastructure as Code.', completed: false },
        { id: 3, title: 'Setup Kubernetes Cluster Ingress', description: 'Manage container orchestration and load balancing.', completed: false }
      ];
    } else if (job.includes('design') || job.includes('ui')) {
      tasks = [
        { id: 1, title: 'Create High-Fidelity Figma Prototype', description: 'Design accessible design system with interactive components.', completed: true },
        { id: 2, title: 'Conduct User Usability Testing', description: 'Gather qualitative feedback to validate navigation paths.', completed: false },
        { id: 3, title: 'Audit Color Contrast & Micro-interactions', description: 'Ensure seamless dark/light mode accessibility.', completed: false }
      ];
    } else if (job.includes('game')) {
      tasks = [
        { id: 1, title: 'Complete Unity Physics Simulation', description: 'Master rigidbodies, collisions, and character controllers.', completed: true },
        { id: 2, title: 'Write C# Player Mechanics & State Machine', description: 'Program clean decoupled player controller classes.', completed: false },
        { id: 3, title: 'Bake Lighting & Shader Graph Materials', description: 'Optimize graphics rendering pipeline for target FPS.', completed: false }
      ];
    } else if (job.includes('blockchain')) {
      tasks = [
        { id: 1, title: 'Write Secure ERC-20 Solidity Contract', description: 'Implement reentrancy guards and access control.', completed: true },
        { id: 2, title: 'Integrate Ethers.js Wallet Provider', description: 'Connect web client to Ethereum testnet nodes.', completed: false },
        { id: 3, title: 'Perform Gas Optimization Audit', description: 'Minimize bytecode and storage slot usage in smart contracts.', completed: false }
      ];
    } else if (job.includes('security')) {
      tasks = [
        { id: 1, title: 'Conduct Network Vulnerability Scan', description: 'Analyze open ports, SSL certificates, and firewall policies.', completed: true },
        { id: 2, title: 'Practice OWASP Top 10 Mitigation', description: 'Remediate SQL injection and CSRF vulnerabilities.', completed: false },
        { id: 3, title: 'Setup SIEM Log Monitoring & Alerts', description: 'Configure automated intrusion detection rules.', completed: false }
      ];
    } else if (job.includes('business') || job.includes('analytics')) {
      tasks = [
        { id: 1, title: 'Build Interactive Tableau Executive Dashboard', description: 'Transform raw product event logs into actionable KPIs.', completed: true },
        { id: 2, title: 'Run Cohort Retention Analysis in SQL', description: 'Compute rolling 30-day user engagement churn.', completed: false },
        { id: 3, title: 'Draft Product Growth Requirements Document', description: 'Define North Star metric and A/B test specifications.', completed: false }
      ];
    } else if (job.includes('qa') || job.includes('quality')) {
      tasks = [
        { id: 1, title: 'Write Playwright E2E Test Suite', description: 'Automate cross-browser user journey verification.', completed: true },
        { id: 2, title: 'Integrate Tests into GitHub Actions CI', description: 'Trigger regression suites on every pull request.', completed: false },
        { id: 3, title: 'Document API Load Testing Results', description: 'Simulate concurrent user requests with k6.', completed: false }
      ];
    } else if (job.includes('mobile')) {
      tasks = [
        { id: 1, title: 'Initialize React Native Expo Architecture', description: 'Setup navigation stacks, offline storage, and theme hooks.', completed: true },
        { id: 2, title: 'Implement Biometric & Push Notifications', description: 'Secure device credentials and engage active users.', completed: false },
        { id: 3, title: 'Profile Frame Rate & Memory Leaks', description: 'Ensure smooth 60fps animations across devices.', completed: false }
      ];
    } else {
      tasks = [
        { id: 1, title: 'Complete Core Aptitude & Logic Assessment', description: 'Evaluate foundational problem-solving abilities.', completed: true },
        { id: 2, title: `Research Top Industry Expectations for ${user.dreamJob}`, description: 'Identify target companies and high-leverage competencies.', completed: false },
        { id: 3, title: 'Optimize Technical Resume for ATS Parsers', description: 'Highlight measurable project achievements and key tech stack.', completed: false }
      ];
    }
    
    // Merge with saved progress
    const savedProgress = JSON.parse(localStorage.getItem('nexora_task_progress') || '{}');
    const mergedTasks = tasks.map(task => ({
      ...task,
      completed: savedProgress[task.id] !== undefined ? savedProgress[task.id] : task.completed
    }));
    
    localStorage.setItem('nexora_current_tasks', JSON.stringify(mergedTasks));
    setDailyTasks(mergedTasks);
  }, [user.dreamJob]);

  const completedCount = dailyTasks.filter(t => t.completed).length;
  const taskPercent = Math.round((completedCount / Math.max(dailyTasks.length, 1)) * 100);

  // Quick Action cards data
  const quickActions = [
    {
      title: 'Career Roadmap',
      desc: 'Dynamic track & subsets',
      icon: <Compass size={20} className="text-primary" />,
      path: '/roadmap',
      badge: 'Updated'
    },
    {
      title: 'Mock Interview',
      desc: 'AI behavioral & coding',
      icon: <Video size={20} style={{ color: '#14b8a6' }} />,
      path: '/mock-interview',
      badge: 'Practice'
    },
    {
      title: 'Resume Analyzer',
      desc: 'ATS score & keyword audit',
      icon: <FileText size={20} style={{ color: '#f43f5e' }} />,
      path: '/resume',
      badge: 'Audit'
    },
    {
      title: 'AI Career Mentor',
      desc: 'Guidance & solutions',
      icon: <Bot size={20} className="text-primary" />,
      path: '/chatbot',
      badge: '24/7 AI'
    }
  ];

  return (
    <div className="animate-fade-in flex flex-col gap-md" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* ── Compact Header ── */}
      <header className="flex justify-between items-center" style={{ paddingBottom: '4px' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: '800', letterSpacing: '-0.3px', margin: 0 }}>
            {getGreeting()}, {user.firstName} 👋
          </h1>
          <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '2px' }}>
            Target Career: <strong className="text-primary">{user.dreamJob}</strong>
          </p>
        </div>
        <div className="flex items-center gap-sm">
          <div 
            onClick={() => navigate('/chatbot')} 
            className="interactive flex items-center justify-center" 
            style={{ 
              width: 38, 
              height: 38, 
              borderRadius: '50%', 
              background: 'var(--bg-card-glass)', 
              border: '1px solid var(--border-color)', 
              cursor: 'pointer' 
            }}
            title="Open AI Mentor"
          >
            <Bot size={19} className="text-primary" />
          </div>
          <div 
            onClick={() => navigate('/profile')}
            style={{ 
              width: 38, 
              height: 38, 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
              cursor: 'pointer',
              boxShadow: '0 2px 10px var(--primary-glow)'
            }}
            className="flex items-center justify-center text-white font-bold interactive"
            title="View Profile"
          >
            {user.firstName.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <GlobalSearch />

      {/* ── Stats Ribbon (Space-efficient, High Impact) ── */}
      <div 
        className="grid grid-cols-2 sm:grid-cols-4 gap-sm animate-fade-in"
        style={{ marginTop: '2px' }}
      >
        <div 
          className="glass-panel interactive"
          style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: 'var(--radius-md)' }}
        >
          <div className="skeuo-well" style={{ padding: '7px', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={18} />
          </div>
          <div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>Career Match</p>
            <p style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>{user.careerMatch}%</p>
          </div>
        </div>

        <div 
          className="glass-panel interactive"
          style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: 'var(--radius-md)' }}
        >
          <div className="skeuo-well" style={{ padding: '7px', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={18} />
          </div>
          <div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>Tasks Done</p>
            <p style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>{completedCount}/{dailyTasks.length} ({taskPercent}%)</p>
          </div>
        </div>

        <div 
          className="glass-panel interactive"
          style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: 'var(--radius-md)' }}
        >
          <div className="skeuo-well" style={{ padding: '7px', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flame size={18} />
          </div>
          <div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>Daily Streak</p>
            <p style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>{user.streak} Days 🔥</p>
          </div>
        </div>

        <div 
          className="glass-panel interactive"
          style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: 'var(--radius-md)' }}
        >
          <div className="skeuo-well" style={{ padding: '7px', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trophy size={18} />
          </div>
          <div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>Current Tier</p>
            <p style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Level {user.level}</p>
          </div>
        </div>
      </div>

      {/* ── AI Career Match Card (Dynamic for User's Dream Job) ── */}
      <section 
        className="glass-panel interactive delay-100 animate-fade-in" 
        style={{ 
          padding: 'var(--space-md) var(--space-lg)', 
          position: 'relative', 
          overflow: 'hidden', 
          cursor: 'pointer',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)'
        }}
        onClick={() => navigate('/roadmap')}
      >
        <div style={{ position: 'absolute', top: -15, right: -15, opacity: 0.08 }}>
          <Target size={110} />
        </div>
        
        <div className="flex justify-between items-start flex-wrap gap-sm">
          <div>
            <div className="flex items-center gap-xs mb-xs">
              <Sparkles className="text-primary" size={16} />
              <span style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--primary)' }}>
                Target Match Analysis
              </span>
            </div>
            <h2 className="text-gradient" style={{ fontSize: '1.35rem', fontWeight: '800', margin: '2px 0 6px 0' }}>
              {user.dreamJob}
            </h2>
            <p className="text-muted" style={{ fontSize: '0.86rem', maxWidth: '620px', lineHeight: 1.45, margin: 0 }}>
              Based on your verified skills and recent assessments, your trajectory has an optimal <strong>{user.careerMatch}% alignment</strong>. 
              Explore your personalized milestones and elective subset modules.
            </p>
          </div>

          <div style={{ alignSelf: 'center' }}>
            <button 
              className="btn btn-primary" 
              style={{ padding: '7px 16px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
              onClick={(e) => { e.stopPropagation(); navigate('/roadmap'); }}
            >
              Open Roadmap <ArrowRight size={14} />
            </button>
          </div>
        </div>
        
        <div className="flex gap-xs flex-wrap" style={{ marginTop: '10px' }}>
          <span style={{ fontSize: '0.72rem', padding: '3px 10px', background: 'var(--input-bg)', borderRadius: 'var(--radius-full)', fontWeight: 500 }}>Core Architecture</span>
          <span style={{ fontSize: '0.72rem', padding: '3px 10px', background: 'var(--input-bg)', borderRadius: 'var(--radius-full)', fontWeight: 500 }}>Hands-on Projects</span>
          <span style={{ fontSize: '0.72rem', padding: '3px 10px', background: 'rgba(20, 184, 166, 0.15)', color: 'var(--accent)', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>Specialization Subset Active</span>
        </div>
      </section>

      {/* ── Quick Actions Grid (2x2) ── */}
      <section className="delay-100 animate-fade-in">
        <div className="flex justify-between items-center mb-xs">
          <h2 style={{ fontSize: '0.98rem', fontWeight: '700', margin: 0 }}>Career Accelerators</h2>
          <span className="text-muted" style={{ fontSize: '0.75rem' }}>Direct shortcuts</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-sm">
          {quickActions.map((action) => (
            <div
              key={action.title}
              onClick={() => navigate(action.path)}
              className="glass-panel interactive"
              style={{
                padding: '12px 14px',
                cursor: 'pointer',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '85px'
              }}
            >
              <div className="flex justify-between items-start">
                <div style={{ padding: '6px', background: 'var(--input-bg)', borderRadius: 'var(--radius-sm)' }}>
                  {action.icon}
                </div>
                <span style={{ fontSize: '0.65rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '2px 6px', borderRadius: '999px', fontWeight: 600 }}>
                  {action.badge}
                </span>
              </div>
              <div style={{ marginTop: '8px' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: '700', margin: 0, color: 'var(--text-main)' }}>{action.title}</p>
                <p className="text-muted" style={{ fontSize: '0.72rem', margin: '2px 0 0 0', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{action.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Daily Tasks ── */}
      <section className="delay-200 animate-fade-in">
        <div className="flex justify-between items-center mb-xs">
          <h2 style={{ fontSize: '0.98rem', fontWeight: '700', margin: 0 }}>Daily Action Items</h2>
          
          <div className="flex items-center gap-sm">
            <div className="flex items-center gap-xs" title="Completion">
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                {taskPercent}%
              </span>
              <div className="skeuo-progress-track" style={{ width: '70px', height: '7px' }}>
                <div className="skeuo-progress-bar" style={{ width: `${taskPercent}%` }} />
              </div>
            </div>

            <button 
              className="skeuo-pill text-primary" 
              style={{ fontSize: '0.75rem', padding: '3px 12px' }}
              onClick={() => navigate('/progress')}
            >
              Progress
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-xs">
          {dailyTasks.map((task) => (
            <div 
              key={task.id} 
              className="glass-panel flex items-center justify-between" 
              style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)' }}
            >
              <div className="flex items-center gap-sm" style={{ flex: 1, paddingRight: 'var(--space-sm)' }}>
                {task.completed ? (
                  <CheckCircle2 className="text-success" size={18} style={{ flexShrink: 0 }} />
                ) : (
                  <Circle className="text-muted" size={18} style={{ flexShrink: 0 }} />
                )}
                <div>
                  <span style={{ 
                    textDecoration: task.completed ? 'line-through' : 'none', 
                    color: task.completed ? 'var(--text-muted)' : 'var(--text-main)', 
                    fontSize: '0.86rem', 
                    fontWeight: 600,
                    display: 'block',
                    lineHeight: '1.2' 
                  }}>
                    {task.title}
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.74rem', display: 'block', marginTop: '2px' }}>
                    {task.description}
                  </span>
                </div>
              </div>
              
              <div style={{ flexShrink: 0, display: 'flex', gap: '6px' }}>
                <button 
                  className="skeuo-pill" 
                  style={{ padding: '4px 12px', fontSize: '0.72rem' }}
                  onClick={() => navigate(`/task/${task.id}`)}
                >
                  Preview
                </button>

                {task.completed ? (
                  <div className="skeuo-well" style={{ padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--success)', display: 'inline-block' }}>
                    Done
                  </div>
                ) : (
                  <button 
                    className="skeuo-pill active" 
                    style={{ padding: '4px 12px', fontSize: '0.72rem' }}
                    onClick={() => navigate(`/task/${task.id}`)}
                  >
                    Resume
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Redesigned Compact Modern Footer ── */}
      <footer 
        style={{ 
          marginTop: 'var(--space-md)', 
          paddingTop: 'var(--space-sm)', 
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="text-gradient" style={{ fontSize: '1.1rem', fontWeight: '900', letterSpacing: '-0.5px' }}>NEXORA</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>· AI Career Platform</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {[
              { label: 'Twitter', href: 'https://twitter.com', hoverColor: '#1DA1F2', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
              { label: 'LinkedIn', href: 'https://linkedin.com', hoverColor: '#0A66C2', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
              { label: 'GitHub', href: 'https://github.com', hoverColor: '#6366f1', path: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12' },
            ].map(({ label, href, hoverColor, path }) => (
              <SocialBtn key={label} href={href} label={label} hoverColor={hoverColor} path={path} />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <a href="mailto:support@nexora.ai" style={{ textDecoration: 'none', color: 'inherit' }}>support@nexora.ai</a>
            <span>·</span>
            <button 
              onClick={() => navigate('/settings/privacy')} 
              style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'inherit', cursor: 'pointer', textDecoration: 'none' }}
              onMouseEnter={(e) => { e.target.style.textDecoration = 'underline'; }}
              onMouseLeave={(e) => { e.target.style.textDecoration = 'none'; }}
            >
              Privacy
            </button>
            <span>·</span>
            <button 
              onClick={() => navigate('/about')} 
              style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'inherit', cursor: 'pointer', textDecoration: 'none' }}
              onMouseEnter={(e) => { e.target.style.textDecoration = 'underline'; }}
              onMouseLeave={(e) => { e.target.style.textDecoration = 'none'; }}
            >
              Terms
            </button>
          </div>
          <span>© {new Date().getFullYear()} NEXORA Inc. Made with ❤️</span>
        </div>
      </footer>

    </div>
  );
}
