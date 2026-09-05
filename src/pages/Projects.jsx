import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban, Star, Clock, Users, ArrowUpRight,
  CheckCircle2, Circle, Flame, Lock, Sparkles,
  Code2, Database, Layers, Globe, Cpu, ShieldCheck,
} from 'lucide-react';

/* ─── Data ─────────────────────────────────────────────────── */
const difficultyConfig = {
  Beginner:     { color: 'var(--success)',  bg: 'rgba(16, 185, 129, 0.1)',  dot: '#10b981' },
  Intermediate: { color: 'var(--warning)',  bg: 'rgba(245, 158, 11, 0.1)',  dot: '#f59e0b' },
  Advanced:     { color: 'var(--accent)',   bg: 'rgba(244, 63, 94, 0.1)',  dot: '#f43f5e' },
};

const categories = [
  {
    label: 'Web Development',
    icon: Globe,
    color: 'var(--primary)',
    rgb: '99, 102, 241',
    projects: [
      {
        title: 'Personal Portfolio Website',
        desc: 'Build a sleek, responsive portfolio with React, animations, and a contact form to showcase your work to recruiters.',
        tags: ['React', 'CSS', 'Vite'],
        difficulty: 'Beginner',
        duration: '3–5 days',
        stars: 4.8,
        enrolled: 1240,
        locked: false,
      },
      {
        title: 'Full-Stack Job Board',
        desc: 'Create a complete job listing platform with search, filters, user auth, and a REST API backend.',
        tags: ['React', 'Node.js', 'MongoDB'],
        difficulty: 'Intermediate',
        duration: '2–3 weeks',
        stars: 4.6,
        enrolled: 874,
        locked: false,
      },
      {
        title: 'Real-Time Chat App',
        desc: 'Build a WhatsApp-style chat with WebSockets, rooms, read receipts, and typing indicators.',
        tags: ['React', 'Socket.io', 'Express'],
        difficulty: 'Advanced',
        duration: '3–4 weeks',
        stars: 4.9,
        enrolled: 512,
        locked: true,
      },
    ],
  },
  {
    label: 'Data Science & AI',
    icon: Cpu,
    color: 'var(--secondary)',
    rgb: '6, 182, 212',
    projects: [
      {
        title: 'Movie Recommendation Engine',
        desc: 'Build a collaborative filtering model that suggests movies based on user rating history using Python and Pandas.',
        tags: ['Python', 'Pandas', 'Scikit-learn'],
        difficulty: 'Intermediate',
        duration: '1–2 weeks',
        stars: 4.7,
        enrolled: 1087,
        locked: false,
      },
      {
        title: 'Sentiment Analysis Dashboard',
        desc: 'Analyze Twitter/Reddit sentiment in real-time using NLP models and visualize trends with interactive charts.',
        tags: ['Python', 'NLTK', 'Plotly'],
        difficulty: 'Advanced',
        duration: '2–3 weeks',
        stars: 4.8,
        enrolled: 634,
        locked: true,
      },
    ],
  },
  {
    label: 'Cloud & DevOps',
    icon: Layers,
    color: 'var(--warning)',
    rgb: '245, 158, 11',
    projects: [
      {
        title: 'CI/CD Pipeline with GitHub Actions',
        desc: 'Automate testing, building, and deploying a Node.js app to AWS EC2 using GitHub Actions workflows.',
        tags: ['GitHub Actions', 'AWS', 'Docker'],
        difficulty: 'Intermediate',
        duration: '1 week',
        stars: 4.5,
        enrolled: 723,
        locked: false,
      },
      {
        title: 'Containerized Microservices',
        desc: 'Design and deploy a microservices architecture using Docker Compose and Kubernetes on a cloud provider.',
        tags: ['Docker', 'Kubernetes', 'GCP'],
        difficulty: 'Advanced',
        duration: '3–4 weeks',
        stars: 4.9,
        enrolled: 389,
        locked: true,
      },
    ],
  },
];

/* ─── Project Card ──────────────────────────────────────────── */
function ProjectCard({ project, accentRgb, delay }) {
  const [hovered, setHovered] = useState(false);
  const diff = difficultyConfig[project.difficulty];

  return (
    <div
      className={`skeuo-card tactile-press animate-fade-in delay-${delay}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `rgba(${accentRgb}, 0.07)` : 'var(--skeuo-surface-card)',
        border: `1px solid ${hovered ? `rgba(${accentRgb}, 0.5)` : 'var(--border-color)'}`,
        borderTop: `1px solid ${hovered ? `rgba(${accentRgb}, 0.8)` : 'var(--skeuo-highlight)'}`,
        borderBottom: `1px solid ${hovered ? `rgba(${accentRgb}, 0.6)` : 'var(--skeuo-shadow-rim)'}`,
        borderRadius: '14px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        transition: 'transform 0.16s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.16s ease',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered
          ? `inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 4.5px 0 rgba(${accentRgb}, 0.4), 0 14px 28px rgba(${accentRgb}, 0.18)`
          : 'inset 0 1px 0 var(--skeuo-highlight-subtle), 0 3px 0 var(--skeuo-btn-sec-lip), 0 4px 10px rgba(0,0,0,0.08)',
        position: 'relative',
        overflow: 'hidden',
        opacity: project.locked ? 0.75 : 1,
      }}
    >
      {/* Top shimmer line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, transparent, rgba(${accentRgb}, 0.8), transparent)`,
        opacity: hovered && !project.locked ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }} />

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3, flex: 1 }}>
          {project.title}
        </h3>
        {project.locked ? (
          <div className="skeuo-well" style={{ display: 'flex', alignItems: 'center', gap: '4px', borderRadius: '6px', padding: '4px 8px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', flexShrink: 0 }}>
            <Lock size={11} /> Pro
          </div>
        ) : (
          <div className="btn-icon-tactile" style={{ width: 28, height: 28, padding: 0, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ArrowUpRight size={14} style={{ color: `rgb(${accentRgb})`, transform: hovered ? 'translate(1px,-1px)' : 'none', transition: 'transform 0.2s ease' }} />
          </div>
        )}
      </div>

      {/* Description */}
      <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
        {project.desc}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {project.tags.map(tag => (
          <span key={tag} style={{ fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px', background: `rgba(${accentRgb}, 0.1)`, color: `rgb(${accentRgb})`, borderRadius: '999px', border: `1px solid rgba(${accentRgb}, 0.2)` }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Footer row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Difficulty badge */}
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.73rem', fontWeight: 700, color: diff.color, background: diff.bg, padding: '3px 9px', borderRadius: '999px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: diff.dot }} />
            {project.difficulty}
          </span>
          {/* Duration */}
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Clock size={12} /> {project.duration}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', color: 'var(--warning)', fontWeight: 600 }}>
            <Star size={12} fill="currentColor" /> {project.stars}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Users size={12} /> {project.enrolled.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Category Section ──────────────────────────────────────── */
function CategorySection({ cat, sectionDelay }) {
  const CatIcon = cat.icon;

  return (
    <section
      className="glass-panel animate-fade-in"
      style={{
        animationDelay: `${sectionDelay}ms`,
        borderRadius: '20px',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Corner glow */}
      <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: `radial-gradient(circle, rgba(${cat.rgb}, 0.08) 0%, transparent 70%)`, pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: 36, height: 36, borderRadius: '10px', background: `rgba(${cat.rgb}, 0.12)`, border: `1px solid rgba(${cat.rgb}, 0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <CatIcon size={18} style={{ color: cat.color }} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '2px' }}>{cat.label}</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cat.projects.length} projects available</p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: `linear-gradient(90deg, rgba(${cat.rgb}, 0.3), var(--border-color) 60%, transparent)` }} />

      {/* Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
        {cat.projects.map((p, i) => (
          <ProjectCard key={i} project={p} accentRgb={cat.rgb} delay={(i + 1) * 100} />
        ))}
      </div>
    </section>
  );
}

/* ─── Stats Bar ─────────────────────────────────────────────── */
function StatsBar() {
  const stats = [
    { icon: FolderKanban, label: 'Projects', value: '18+', color: 'var(--primary)' },
    { icon: Users,        label: 'Students', value: '5.4k', color: 'var(--success)' },
    { icon: Flame,        label: 'Streak Days', value: '12', color: 'var(--warning)' },
    { icon: CheckCircle2, label: 'Completed', value: '0', color: 'var(--secondary)' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
      {stats.map(s => {
        const S = s.icon;
        return (
          <div key={s.label} className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', borderRadius: '14px', textAlign: 'center' }}>
            <S size={20} style={{ color: s.color }} />
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>{s.value}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function Projects() {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>

      {/* Header */}
      <header style={{ paddingBottom: 'var(--space-xs)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '999px', padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 'var(--space-sm)' }}>
          <Sparkles size={12} /> Portfolio Builder
        </div>
        <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '6px', lineHeight: 1.2 }}>
          Hands-On Projects
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '500px' }}>
          Build real-world projects guided by AI mentors. Earn certificates and add them directly to your portfolio.
        </p>
      </header>

      {/* Stats */}
      <StatsBar />

      {/* Pro Banner */}
      <div className="glass-panel interactive" style={{ padding: 'var(--space-md) var(--space-lg)', background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(236,72,153,0.07))', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '16px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', cursor: 'pointer', boxSizing: 'border-box', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 250px' }}>
          <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldCheck size={20} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '2px' }}>Unlock All Projects with NEXORA Pro</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Get access to advanced projects, AI code reviews, and completion certificates.</p>
          </div>
        </div>
        <button className="btn btn-primary" style={{ padding: '8px 18px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
          Upgrade · ₹299
        </button>
      </div>

      {/* Category Sections */}
      {categories.map((cat, idx) => (
        <CategorySection key={idx} cat={cat} sectionDelay={(idx + 1) * 120} />
      ))}

    </div>
  );
}
