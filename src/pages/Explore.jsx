import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target, Briefcase, Video, HelpCircle,
  GraduationCap, Users, BookOpen, ArrowUpRight,
  Sparkles, TrendingUp, Globe, FolderKanban, Trophy, Compass,
} from 'lucide-react';

/* ─── Data ─────────────────────────────────────────────────── */
const sections = [
  {
    title: 'Career Preparation',
    description: 'AI-powered tools to get you interview-ready.',
    accentColor: 'var(--secondary)',        // cyan/pink
    accentRgb: '244, 63, 94',
    CategoryIcon: Compass,
    items: [
      {
        name: 'Career Roadmap',
        desc: 'Follow a step-by-step milestone path tailored to your dream job.',
        path: '/roadmap',
        icon: Compass,
        iconColor: 'var(--secondary)',
        iconBg: 'rgba(244, 63, 94, 0.12)',
        glowColor: '244, 63, 94',
      },
      {
        name: 'Resume AI',
        desc: 'Let our AI craft and optimize a recruiter-beating CV.',
        path: '/resume',
        icon: Briefcase,
        iconColor: 'var(--success)',
        iconBg: 'rgba(16, 185, 129, 0.12)',
        glowColor: '16, 185, 129',
      },
      {
        name: 'Mock Interviews',
        desc: 'Practice with a real-time AI recruiter and get smart feedback.',
        path: '/mock-interview',
        icon: Video,
        iconColor: 'var(--warning)',
        iconBg: 'rgba(245, 158, 11, 0.12)',
        glowColor: '245, 158, 11',
      },
      {
        name: 'Projects',
        desc: 'Build hands-on projects to strengthen your portfolio.',
        path: '/projects',
        icon: FolderKanban,
        iconColor: 'var(--primary)',
        iconBg: 'rgba(99, 102, 241, 0.12)',
        glowColor: '99, 102, 241',
      },
    ],
  },
  {
    title: 'Opportunities',
    description: 'Discover jobs, scholarships, and top programs.',
    accentColor: 'var(--primary)',
    accentRgb: '99, 102, 241',
    CategoryIcon: Globe,
    items: [
      {
        name: 'Jobs & Internships',
        desc: 'Browse curated roles perfectly matched to your skill set.',
        path: '/jobs',
        icon: Briefcase,
        iconColor: 'var(--secondary)',
        iconBg: 'rgba(6, 182, 212, 0.12)',
        glowColor: '6, 182, 212',
      },
      {
        name: 'Scholarships',
        desc: 'Explore thousands of grants and financial aid options.',
        path: '/scholarships',
        icon: GraduationCap,
        iconColor: 'var(--warning)',
        iconBg: 'rgba(245, 158, 11, 0.12)',
        glowColor: '245, 158, 11',
      },
      {
        name: 'Top Colleges',
        desc: 'Find the best programs aligned with your career goals.',
        path: '/colleges',
        icon: GraduationCap,
        iconColor: 'var(--accent)',
        iconBg: 'rgba(244, 63, 94, 0.12)',
        glowColor: '244, 63, 94',
      },
      {
        name: 'Hackathons',
        desc: 'Discover and participate in upcoming coding hackathons.',
        path: '/hackathons',
        icon: Trophy,
        iconColor: 'var(--success)',
        iconBg: 'rgba(16, 185, 129, 0.12)',
        glowColor: '16, 185, 129',
      },
    ],
  },
  {
    title: 'Learning & Community',
    description: 'Grow your knowledge and build your network.',
    accentColor: 'var(--success)',
    accentRgb: '16, 185, 129',
    CategoryIcon: Sparkles,
    items: [
      {
        name: 'Learning Resources',
        desc: 'Curated articles, video courses, and step-by-step guides.',
        path: '/resources',
        icon: BookOpen,
        iconColor: 'var(--primary)',
        iconBg: 'rgba(99, 102, 241, 0.12)',
        glowColor: '99, 102, 241',
      },
      {
        name: 'Peer Learning',
        desc: 'Collaborate, share projects, and grow with fellow students.',
        path: '/peer-learning',
        icon: Users,
        iconColor: 'var(--success)',
        iconBg: 'rgba(16, 185, 129, 0.12)',
        glowColor: '16, 185, 129',
      },
      {
        name: 'Daily Quiz',
        desc: 'Sharpen your skills with bite-sized knowledge challenges.',
        path: '/quiz',
        icon: HelpCircle,
        iconColor: 'var(--primary)',
        iconBg: 'rgba(99, 102, 241, 0.12)',
        glowColor: '99, 102, 241',
      },
    ],
  },
];

/* ─── Feature Card ──────────────────────────────────────────── */
function FeatureCard({ item, onNavigate }) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  return (
    <div
      onClick={() => onNavigate(item.path)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer',
        background: hovered
          ? `rgba(${item.glowColor}, 0.06)`
          : 'var(--bg-card-glass)',
        border: `1px solid ${hovered ? `rgba(${item.glowColor}, 0.45)` : 'var(--border-color)'}`,
        borderRadius: '14px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        transition: 'all 0.25s cubic-bezier(0.34, 1.28, 0.64, 1)',
        transform: hovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
        boxShadow: hovered
          ? `0 16px 40px rgba(${item.glowColor}, 0.18), 0 2px 8px rgba(0,0,0,0.2)`
          : '0 2px 8px rgba(0,0,0,0.12)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle shimmer line at top on hover */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '2px',
        background: `linear-gradient(90deg, transparent, rgba(${item.glowColor}, 0.8), transparent)`,
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.3s ease',
        borderRadius: '14px 14px 0 0',
      }} />

      {/* Top row: icon + arrow */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: '10px',
          background: item.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'transform 0.25s ease',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
        }}>
          <Icon size={22} style={{ color: item.iconColor }} />
        </div>
        <div style={{
          width: 28, height: 28,
          borderRadius: '8px',
          background: hovered ? `rgba(${item.glowColor}, 0.12)` : 'var(--bg-main)',
          border: `1px solid ${hovered ? `rgba(${item.glowColor}, 0.3)` : 'var(--border-color)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.25s ease',
        }}>
          <ArrowUpRight
            size={14}
            style={{
              color: hovered ? item.iconColor : 'var(--text-muted)',
              transition: 'color 0.25s ease',
              transform: hovered ? 'translate(1px, -1px)' : 'translate(0,0)',
            }}
          />
        </div>
      </div>

      {/* Text */}
      <div>
        <h3 style={{
          fontSize: '0.97rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          marginBottom: '5px',
          lineHeight: 1.3,
        }}>
          {item.name}
        </h3>
        <p style={{
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
          lineHeight: 1.55,
        }}>
          {item.desc}
        </p>
      </div>
    </div>
  );
}

/* ─── Section Frame ─────────────────────────────────────────── */
function SectionFrame({ section, onNavigate, animDelay }) {
  const { CategoryIcon } = section;

  return (
    <section
      className="animate-fade-in"
      style={{
        animationDelay: `${animDelay}ms`,
        background: 'var(--bg-card-glass)',
        border: '1px solid var(--border-color)',
        borderRadius: '20px',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Faint gradient accent in the corner */}
      <div style={{
        position: 'absolute',
        top: -40, right: -40,
        width: 160, height: 160,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${section.accentRgb}, 0.08) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Frame Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: 36, height: 36,
          borderRadius: '10px',
          background: `rgba(${section.accentRgb}, 0.12)`,
          border: `1px solid rgba(${section.accentRgb}, 0.2)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <CategoryIcon size={18} style={{ color: section.accentColor }} />
        </div>
        <div>
          <h2 style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            marginBottom: '2px',
            letterSpacing: '-0.2px',
          }}>
            {section.title}
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            {section.description}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{
        height: '1px',
        background: `linear-gradient(90deg, rgba(${section.accentRgb}, 0.3), var(--border-color) 60%, transparent)`,
      }} />

      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '14px',
      }}>
        {section.items.map((item, i) => (
          <FeatureCard key={i} item={item} onNavigate={onNavigate} />
        ))}
      </div>
    </section>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function Explore() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    if (path === '/resources') {
      try {
        const saved = localStorage.getItem('nexora_roadmap');
        if (saved) {
          const steps = JSON.parse(saved);
          const currentTopic = steps.find(s => s.status === 'in-progress');
          if (currentTopic) {
            navigate(path, { state: { topic: currentTopic } });
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    navigate(path);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>

      {/* Page Header */}
      <header style={{ textAlign: 'center', padding: 'var(--space-xs) 0 var(--space-xs)' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '999px',
          padding: '3px 12px',
          fontSize: '0.72rem',
          fontWeight: 700,
          color: 'var(--primary)',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          marginBottom: 'var(--space-xs)',
        }}>
          <Sparkles size={12} /> Career Workspace
        </div>
        <h1
          className="text-gradient"
          style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '4px', lineHeight: 1.15 }}
        >
          Explore NEXORA
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto', lineHeight: 1.5 }}>
          Everything you need to prepare, discover, and grow — all in one place.
        </p>
      </header>

      {/* Section Frames */}
      {sections.map((section, idx) => (
        <SectionFrame
          key={idx}
          section={section}
          onNavigate={handleNavigate}
          animDelay={(idx + 1) * 100}
        />
      ))}

    </div>
  );
}
