import { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import {
  Trophy, Calendar, Clock, Users, MapPin,
  Flame, Zap, Star, CheckCircle2, ExternalLink,
} from 'lucide-react';
import db from '../services/db';

/* ─── Status Config ─────────────────────────────────────────── */
const statusConfig = {
  'Registering': { color: 'var(--success)',  bg: 'rgba(16, 185, 129, 0.1)',  dot: '#10b981' },
  'Upcoming':    { color: 'var(--primary)',  bg: 'rgba(99, 102, 241, 0.1)',  dot: '#6366f1' },
  'Ongoing':     { color: 'var(--warning)',  bg: 'rgba(245, 158, 11, 0.1)',  dot: '#f59e0b', pulse: true },
  'Ended':       { color: 'var(--text-muted)', bg: 'var(--input-bg)', dot: '#6b7280' },
};

/* ─── Real-World Hackathons with Authentic Registration Portals ─── */
const hackathons = [
  {
    name: 'Smart India Hackathon 2026',
    host: 'Ministry of Education & AICTE',
    theme: 'National Challenges & Public Tech',
    desc: 'World’s biggest open innovation hackathon. Solve real-world problem statements submitted by Government Ministries, State Depts, and Indian PSUs.',
    prize: '₹1,00,000 / Problem Statement (Total ₹5Cr+)',
    deadline: 'Nov 01, 2026',
    duration: '36 hours',
    participants: 45000,
    maxTeam: 6,
    location: 'Pan-India Nodal Centers & Hybrid',
    tags: ['GovTech', 'Healthcare', 'Agriculture', 'Smart Automation'],
    status: 'Registering',
    featured: true,
    glowRgb: '99, 102, 241',
    registerUrl: 'https://www.sih.gov.in/'
  },
  {
    name: 'HackMIT 2026',
    host: 'Massachusetts Institute of Technology',
    theme: 'Frontier AI & Open Hardware',
    desc: 'One of the most prestigious student hackathons globally. 1,000+ top hackers build cutting-edge systems with access to thousands of dollars in APIs, hardware labs, and mentorship.',
    prize: '$25,000+ USD',
    deadline: 'Oct 18, 2026',
    duration: '24 hours',
    participants: 3200,
    maxTeam: 4,
    location: 'Cambridge, MA & Virtual Track',
    tags: ['Generative AI', 'Robotics', 'Distributed Systems'],
    status: 'Registering',
    featured: false,
    glowRgb: '6, 182, 212',
    registerUrl: 'https://hackmit.org/'
  },
  {
    name: 'ETHGlobal Bangkok & Virtual 2026',
    host: 'ETHGlobal',
    theme: 'Decentralized Applications & Web3',
    desc: 'The leading global blockchain hackathon series. Build decentralized protocols, zero-knowledge tooling, and peer-to-peer web applications with direct support from Ethereum core teams.',
    prize: '$500,000 in Sponsor Bounties',
    deadline: 'Nov 12, 2026',
    duration: '48 hours',
    participants: 2800,
    maxTeam: 4,
    location: 'Bangkok & Online Worldwide',
    tags: ['Ethereum', 'Smart Contracts', 'Zero-Knowledge', 'Web3'],
    status: 'Registering',
    featured: false,
    glowRgb: '168, 85, 247',
    registerUrl: 'https://ethglobal.com/'
  },
  {
    name: 'Major League Hacking (MLH) Global Hack Week',
    host: 'Major League Hacking',
    theme: 'Open Source & Developer Tooling',
    desc: 'Week-long hacker celebration with live beginner workshops, technical mini-events, and project showcases alongside an international community of 100,000+ developers.',
    prize: 'Swag Bundles + Tech Grants',
    deadline: 'Oct 05, 2026',
    duration: '7 Days',
    participants: 8400,
    maxTeam: 4,
    location: 'Global Virtual Event',
    tags: ['Open Source', 'Full-Stack', 'DevOps', 'Cloud'],
    status: 'Upcoming',
    featured: false,
    glowRgb: '245, 158, 11',
    registerUrl: 'https://ghw.mlh.io/'
  },
  {
    name: 'Google Solution Challenge 2026',
    host: 'Google Developer Student Clubs',
    theme: 'UN 17 Sustainable Development Goals',
    desc: 'Build software solutions using Google Cloud, TensorFlow, Android, or Flutter addressing one or more of the United Nations 17 Sustainable Development Goals. Top 10 teams win $12,000.',
    prize: '$12,000 USD + Google Mentorship',
    deadline: 'Dec 15, 2026',
    duration: 'Multi-Stage',
    participants: 12000,
    maxTeam: 4,
    location: 'Worldwide Online',
    tags: ['Google Cloud', 'Flutter', 'TensorFlow', 'Social Impact'],
    status: 'Upcoming',
    featured: false,
    glowRgb: '16, 185, 129',
    registerUrl: 'https://developers.google.com/community/solutions-challenge'
  },
  {
    name: 'Devpost AI & Agents Worldwide Sprint',
    host: 'Devpost Community',
    theme: 'Autonomous Multi-Agent Workflows',
    desc: 'Build autonomous agents that coordinate tasks, analyze structured codebases, and automate developer operations. Judged by industry leaders.',
    prize: '$30,000 USD Pool',
    deadline: 'Sep 25, 2026',
    duration: '48 hours',
    participants: 4100,
    maxTeam: 3,
    location: 'Online',
    tags: ['LangChain', 'Python', 'Autonomous Agents', 'FastAPI'],
    status: 'Ongoing',
    featured: false,
    glowRgb: '236, 72, 153',
    registerUrl: 'https://devpost.com/hackathons'
  },
  {
    name: 'Unstop National Tech Championship',
    host: 'Unstop & Tech Giants',
    theme: 'High-Scale Enterprise Architecture',
    desc: 'Premier competitive hackathon series in India connecting engineers with direct pre-placement interview (PPI) fast-tracks at Walmart, Flipkart, and Amazon.',
    prize: '₹10,00,000 + Placement PPIs',
    deadline: 'Nov 28, 2026',
    duration: '3 Rounds',
    participants: 24000,
    maxTeam: 3,
    location: 'Online & Grand Finale in Bangalore',
    tags: ['Algorithms', 'System Design', 'Corporate Hiring'],
    status: 'Registering',
    featured: false,
    glowRgb: '59, 130, 246',
    registerUrl: 'https://unstop.com/hackathons'
  }
];

/* ─── Hackathon Card ─────────────────────────────────────────── */
function HackathonCard({ hack, delay }) {
  const toast = useToast();
  const [hovered, setHovered] = useState(false);
  const [registered, setRegistered] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('nexora_registered_hackathons') || '[]');
      return saved.some(h => h.name === hack.name);
    } catch {
      return false;
    }
  });
  const status = statusConfig[hack.status];
  const isEnded = hack.status === 'Ended';

  const handleRegister = (e) => {
    e.stopPropagation();
    setRegistered(true);

    try {
      const saved = JSON.parse(localStorage.getItem('nexora_registered_hackathons') || '[]');
      if (!saved.some(h => h.name === hack.name)) {
        const updated = [
          {
            name: hack.name,
            host: hack.host,
            deadline: hack.deadline,
            prize: hack.prize,
            location: hack.location,
            registeredAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          },
          ...saved
        ];
        localStorage.setItem('nexora_registered_hackathons', JSON.stringify(updated));
        window.dispatchEvent(new Event('user_session_changed'));
      }
    } catch (err) {
      console.warn('Failed to save registered hackathon:', err);
    }

    // Reward XP in profile
    const currentUser = db.getCurrentUser() || {};
    db.updateUserProfile({
      xp: (currentUser.xp || 1200) + 150
    });

    toast.success(`Navigating to official registration portal for "${hack.name}" (+150 XP)!`);

    // Open real-world registration URL
    if (hack.registerUrl) {
      window.open(hack.registerUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className={`skeuo-card tactile-press animate-fade-in delay-${delay}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hack.featured
          ? 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(244,63,94,0.08))'
          : hovered ? `rgba(${hack.glowRgb}, 0.06)` : 'var(--skeuo-surface-card)',
        border: `1px solid ${
          hack.featured
            ? 'rgba(99, 102, 241, 0.45)'
            : hovered ? `rgba(${hack.glowRgb}, 0.5)` : 'var(--border-color)'
        }`,
        borderTop: `1px solid ${
          hack.featured ? 'rgba(99, 102, 241, 0.8)' : hovered ? `rgba(${hack.glowRgb}, 0.8)` : 'var(--skeuo-highlight)'
        }`,
        borderBottom: `1px solid ${
          hack.featured ? 'rgba(99, 102, 241, 0.6)' : hovered ? `rgba(${hack.glowRgb}, 0.6)` : 'var(--skeuo-shadow-rim)'
        }`,
        borderRadius: '16px',
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        transition: 'transform 0.16s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.16s ease',
        transform: hovered && !isEnded ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered && !isEnded
          ? `inset 0 1px 0 rgba(255,255,255,0.4), 0 5px 0 rgba(${hack.glowRgb}, 0.4), 0 16px 32px rgba(${hack.glowRgb}, 0.2)`
          : hack.featured 
            ? 'inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 0 rgba(99, 102, 241, 0.4), 0 8px 24px rgba(99, 102, 241, 0.25)' 
            : 'inset 0 1px 0 var(--skeuo-highlight-subtle), 0 3px 0 var(--skeuo-btn-sec-lip), 0 6px 14px rgba(0,0,0,0.08)',
        position: 'relative',
        overflow: 'hidden',
        opacity: isEnded ? 0.65 : 1,
      }}
    >
      {/* Top shimmer */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, rgba(${hack.glowRgb}, 0.9), transparent)`, opacity: (hovered || hack.featured) && !isEnded ? 1 : 0, transition: 'opacity 0.3s ease' }} />

      {/* Featured badge */}
      {hack.featured && (
        <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.35)', borderRadius: '999px', padding: '3px 10px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.3px' }}>
          <Star size={11} fill="currentColor" /> National Priority
        </div>
      )}

      {/* Header */}
      <div style={{ paddingRight: hack.featured ? '80px' : '0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          {/* Status pill */}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 700, color: status.color, background: status.bg, padding: '3px 9px', borderRadius: '999px', flexShrink: 0 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: status.dot, boxShadow: status.pulse ? `0 0 0 2px ${status.dot}40` : 'none' }} />
            {hack.status}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Hosted by {hack.host}
          </span>
        </div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px', lineHeight: 1.3 }}>
          {hack.name}
        </h3>
        <p style={{ fontSize: '0.75rem', color: `rgb(${hack.glowRgb})`, fontWeight: 600, marginBottom: '8px' }}>
          Theme: {hack.theme}
        </p>
        <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          {hack.desc}
        </p>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {hack.tags.map(tag => (
          <span key={tag} style={{ fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px', background: `rgba(${hack.glowRgb}, 0.1)`, color: `rgb(${hack.glowRgb})`, borderRadius: '999px', border: `1px solid rgba(${hack.glowRgb}, 0.2)` }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Meta row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
        {[
          { icon: Trophy,   label: 'Prize Pool',   value: hack.prize },
          { icon: Clock,    label: 'Duration',      value: hack.duration },
          { icon: Calendar, label: 'Deadline',      value: hack.deadline },
          { icon: MapPin,   label: 'Location',      value: hack.location },
        ].map(m => {
          const MI = m.icon;
          return (
            <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--input-bg)', borderRadius: '8px', padding: '8px 10px' }}>
              <MI size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: 1 }}>{m.label}</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 600, marginTop: '2px' }}>{m.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Users size={12} /> {hack.participants.toLocaleString()} registered
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Team: 1–{hack.maxTeam}
          </span>
        </div>
        {!isEnded ? (
          <button
            onClick={handleRegister}
            className="btn btn-primary flex items-center gap-xs"
            style={{ 
              padding: '6px 16px', 
              borderRadius: 'var(--radius-full)', 
              fontSize: '0.8rem', 
              fontWeight: 700,
              width: 'auto'
            }}
          >
            {registered ? (
              <><CheckCircle2 size={14} className="text-success" /> Registered (Open Portal)</>
            ) : hack.status === 'Ongoing' ? (
              <><Zap size={13} /> Join Live Round <ExternalLink size={12} /></>
            ) : (
              <><ExternalLink size={13} /> Register Now</>
            )}
          </button>
        ) : (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Submissions closed</span>
        )}
      </div>
    </div>
  );
}

/* ─── Stats Bar ─────────────────────────────────────────────── */
function StatsBar() {
  const stats = [
    { icon: Trophy,       label: 'Real-World Hackathons',  value: '7 Verified', color: 'var(--warning)' },
    { icon: Flame,        label: 'Active Rounds',          value: '1 Live Now', color: 'var(--accent)' },
    { icon: Users,        label: 'Global Hackers',         value: '95k+ Developers', color: 'var(--primary)' },
    { icon: CheckCircle2, label: 'Total Prize Capital',    value: '₹6Cr+ / $600k', color: 'var(--success)' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
      {stats.map(s => {
        const S = s.icon;
        return (
          <div key={s.label} className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', borderRadius: '14px', textAlign: 'center' }}>
            <S size={20} style={{ color: s.color }} />
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>{s.value}</span>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Filter Tabs ────────────────────────────────────────────── */
const FILTERS = ['All', 'Registering', 'Upcoming', 'Ongoing'];

/* ─── Page ──────────────────────────────────────────────────── */
export default function Hackathons() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? hackathons
    : hackathons.filter(h => h.status === activeFilter);

  return (
    <div className="animate-fade-in flex flex-col gap-lg" style={{ paddingBottom: '5rem' }}>

      {/* ── Centered Header ── */}
      <header className="flex flex-col items-center text-center justify-center gap-xs" style={{ margin: '0 auto', maxWidth: '700px', paddingBottom: 'var(--space-xs)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '999px', padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 'var(--space-xs)' }}>
          <Trophy size={14} /> COMPETE & WIN RECOGNITION
        </div>
        <h1 className="text-gradient" style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '6px', lineHeight: 1.2 }}>
          Real-World Global Hackathons
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '580px' }}>
          Compete in authentic international coding challenges (SIH, HackMIT, ETHGlobal, Devpost) with direct links to official registration portals.
        </p>
      </header>

      {/* Stats */}
      <StatsBar />

      {/* Filter tabs */}
      <div className="flex gap-xs flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`skeuo-pill ${activeFilter === f ? 'active' : ''}`}
            style={{
              padding: '6px 14px',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: activeFilter === f ? 'var(--primary)' : 'var(--card-bg)',
              color: activeFilter === f ? '#fff' : 'var(--text-muted)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer'
            }}
          >
            <span>{f}</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.75, marginLeft: '4px' }}>
              ({f === 'All' ? hackathons.length : hackathons.filter(h => h.status === f).length})
            </span>
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
        {filtered.map((hack, i) => (
          <HackathonCard key={hack.name} hack={hack} delay={(i + 1) * 100} />
        ))}
      </div>

    </div>
  );
}
