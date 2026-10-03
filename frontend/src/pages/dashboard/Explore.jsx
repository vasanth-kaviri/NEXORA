import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, Video, HelpCircle,
  GraduationCap, Users, BookOpen, ArrowUpRight,
  Sparkles, Globe, FolderKanban, Trophy, Compass, Bot,
} from 'lucide-react';

/* ─── Data ─────────────────────────────────────────────────── */
const sections = [
  {
    title: 'Career Preparation',
    description: 'AI-powered tools to get you interview-ready.',
    accentColor: '#f43f5e',
    accentRgb: '244, 63, 94',
    CategoryIcon: Compass,
    items: [
      {
        name: 'Career Roadmap',
        desc: 'Follow a step-by-step milestone path tailored to your dream job.',
        path: '/roadmap',
        icon: Compass,
        iconColor: '#f43f5e',
        iconBg: 'rgba(244, 63, 94, 0.12)',
        glowColor: '244, 63, 94',
      },
      {
        name: 'Resume AI',
        desc: 'Let our AI craft and optimize a recruiter-beating CV.',
        path: '/resume',
        icon: Briefcase,
        iconColor: '#10b981',
        iconBg: 'rgba(16, 185, 129, 0.12)',
        glowColor: '16, 185, 129',
      },
      {
        name: 'Mock Interviews',
        desc: 'Practice with a real-time AI recruiter and get smart feedback.',
        path: '/mock-interview',
        icon: Video,
        iconColor: '#f59e0b',
        iconBg: 'rgba(245, 158, 11, 0.12)',
        glowColor: '245, 158, 11',
      },
      {
        name: 'Projects',
        desc: 'Build hands-on projects to strengthen your portfolio.',
        path: '/projects',
        icon: FolderKanban,
        iconColor: '#6366f1',
        iconBg: 'rgba(99, 102, 241, 0.12)',
        glowColor: '99, 102, 241',
      },
    ],
  },
  {
    title: 'Opportunities',
    description: 'Discover jobs, scholarships, and top programs.',
    accentColor: '#6366f1',
    accentRgb: '99, 102, 241',
    CategoryIcon: Globe,
    items: [
      {
        name: 'Jobs & Internships',
        desc: 'Browse curated roles perfectly matched to your skill set.',
        path: '/jobs',
        icon: Briefcase,
        iconColor: '#06b6d4',
        iconBg: 'rgba(6, 182, 212, 0.12)',
        glowColor: '6, 182, 212',
      },
      {
        name: 'Scholarships',
        desc: 'Explore thousands of grants and financial aid options.',
        path: '/scholarships',
        icon: GraduationCap,
        iconColor: '#f59e0b',
        iconBg: 'rgba(245, 158, 11, 0.12)',
        glowColor: '245, 158, 11',
      },
      {
        name: 'Top Colleges',
        desc: 'Find the best programs aligned with your career goals.',
        path: '/colleges',
        icon: GraduationCap,
        iconColor: '#f43f5e',
        iconBg: 'rgba(244, 63, 94, 0.12)',
        glowColor: '244, 63, 94',
      },
      {
        name: 'Hackathons',
        desc: 'Discover and participate in upcoming coding hackathons.',
        path: '/hackathons',
        icon: Trophy,
        iconColor: '#10b981',
        iconBg: 'rgba(16, 185, 129, 0.12)',
        glowColor: '16, 185, 129',
      },
    ],
  },
  {
    title: 'Learning & Community',
    description: 'Grow your knowledge and build your network.',
    accentColor: '#10b981',
    accentRgb: '16, 185, 129',
    CategoryIcon: Sparkles,
    items: [
      {
        name: 'Learning Resources',
        desc: 'Curated articles, video courses, and step-by-step guides.',
        path: '/resources',
        icon: BookOpen,
        iconColor: '#6366f1',
        iconBg: 'rgba(99, 102, 241, 0.12)',
        glowColor: '99, 102, 241',
      },
      {
        name: 'Peer Learning',
        desc: 'Collaborate, share projects, and grow with fellow students.',
        path: '/peer-learning',
        icon: Users,
        iconColor: '#10b981',
        iconBg: 'rgba(16, 185, 129, 0.12)',
        glowColor: '16, 185, 129',
      },
      {
        name: 'Daily Quiz',
        desc: 'Sharpen your skills with bite-sized knowledge challenges.',
        path: '/quiz',
        icon: HelpCircle,
        iconColor: '#f59e0b',
        iconBg: 'rgba(245, 158, 11, 0.12)',
        glowColor: '245, 158, 11',
      },
      {
        name: 'AI Mentor',
        desc: 'Engage in 1-on-1 coaching, architectural reviews, and technical interview prep with AI.',
        path: '/chatbot',
        icon: Bot,
        iconColor: '#a855f7',
        iconBg: 'rgba(168, 85, 247, 0.12)',
        glowColor: '168, 85, 247',
      },
    ],
  },
];
import SectionFrame from '../../components/explore/SectionFrame';


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
      <header style={{ textAlign: 'center', padding: 'var(--space-xs) 0' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'rgba(99, 102, 241, 0.10)',
          border: '1px solid rgba(99, 102, 241, 0.22)',
          borderRadius: '999px', padding: '4px 14px',
          fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)',
          letterSpacing: '0.5px', textTransform: 'uppercase',
          marginBottom: 'var(--space-sm)',
        }}>
          <Sparkles size={11} /> Career Workspace
        </div>
        <h1
          className="text-gradient"
          style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.5px', margin: '0 0 6px', lineHeight: 1.15 }}
        >
          Explore NEXORA
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '400px', margin: '0 auto', lineHeight: 1.55 }}>
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
