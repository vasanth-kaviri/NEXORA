import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import {
  Trophy, Calendar, Clock, Users, MapPin,
  ArrowUpRight, Sparkles, Flame, Zap, Globe,
  Lock, Star, CheckCircle2, ExternalLink, Code2,
} from 'lucide-react';

/* ─── Data ─────────────────────────────────────────────────── */
const statusConfig = {
  'Registering': { color: 'var(--success)',  bg: 'rgba(16, 185, 129, 0.1)',  dot: '#10b981' },
  'Upcoming':    { color: 'var(--primary)',  bg: 'rgba(99, 102, 241, 0.1)',  dot: '#6366f1' },
  'Ongoing':     { color: 'var(--warning)',  bg: 'rgba(245, 158, 11, 0.1)',  dot: '#f59e0b', pulse: true },
  'Ended':       { color: 'var(--text-muted)', bg: 'var(--input-bg)', dot: '#6b7280' },
};

const hackathons = [
  {
    name: 'NEXORA Build Challenge 2026',
    host: 'NEXORA',
    theme: 'AI for Social Good',
    desc: 'Build an AI-powered solution addressing a real-world social problem. Top 3 teams get internship fast-tracks at our partner companies.',
    prize: '₹1,00,000',
    deadline: 'Sep 20, 2026',
    duration: '48 hours',
    participants: 1280,
    maxTeam: 4,
    location: 'Online',
    tags: ['AI/ML', 'Social Impact', 'Open Source'],
    status: 'Registering',
    featured: true,
    glowRgb: '99, 102, 241',
  },
  {
    name: 'DevSprint India 2026',
    host: 'DevCommunity India',
    theme: 'FinTech Innovation',
    desc: 'Create a next-gen financial technology solution — from UPI improvements to wealth management apps. Cash prizes + mentorship from industry leaders.',
    prize: '₹75,000',
    deadline: 'Oct 05, 2026',
    duration: '36 hours',
    participants: 843,
    maxTeam: 3,
    location: 'Online',
    tags: ['FinTech', 'React', 'Backend'],
    status: 'Registering',
    featured: false,
    glowRgb: '6, 182, 212',
  },
  {
    name: 'HackMIT 2026',
    host: 'MIT',
    theme: 'Open Theme',
    desc: 'One of the most prestigious student hackathons in the world. Build anything innovative in 24 hours with access to thousands of dollars in APIs and tools.',
    prize: '$10,000',
    deadline: 'Oct 18, 2026',
    duration: '24 hours',
    participants: 3200,
    maxTeam: 4,
    location: 'Cambridge, MA',
    tags: ['Open Theme', 'Hardware', 'Software'],
    status: 'Upcoming',
    featured: false,
    glowRgb: '245, 158, 11',
  },
  {
    name: 'Smart India Hackathon 2026',
    host: 'Govt. of India',
    theme: 'National Challenges',
    desc: 'Largest national hackathon by the Government of India. Solve real problem statements from government ministries and PSUs. Biggest prize pool in India.',
    prize: '₹5,00,000',
    deadline: 'Nov 01, 2026',
    duration: '36 hours',
    participants: 15000,
    maxTeam: 6,
    location: 'Pan India',
    tags: ['GovTech', 'Healthcare', 'Agriculture', 'Education'],
    status: 'Upcoming',
    featured: false,
    glowRgb: '236, 72, 153',
  },
  {
    name: 'WebDev Sprint #12',
    host: 'TechHunt Community',
    theme: 'Progressive Web Apps',
    desc: 'Build a blazing-fast Progressive Web App over the weekend. Focus on performance, offline-first design, and delightful UX.',
    prize: '₹20,000',
    deadline: 'Sep 10, 2026',
    duration: '24 hours',
    participants: 420,
    maxTeam: 2,
    location: 'Online',
    tags: ['PWA', 'Web Performance', 'JavaScript'],
    status: 'Ongoing',
    featured: false,
    glowRgb: '16, 185, 129',
  },
  {
    name: 'AI Image Hack 2025',
    host: 'Google Developers',
    theme: 'Generative AI',
    desc: 'An AI image generation hackathon that explored creative applications of diffusion models. Winners showcased at Google I/O.',
    prize: '$5,000',
    deadline: 'Ended',
    duration: '48 hours',
    participants: 2100,
    maxTeam: 4,
    location: 'Online',
    tags: ['Generative AI', 'Python', 'Stable Diffusion'],
    status: 'Ended',
    featured: false,
    glowRgb: '107, 114, 128',
  },
];

/* ─── Hackathon Card ─────────────────────────────────────────── */
function HackathonCard({ hack, delay }) {
  const toast = useToast();
  const [hovered, setHovered] = useState(false);
  const [registered, setRegistered] = useState(false);
  const status = statusConfig[hack.status];
  const isEnded = hack.status === 'Ended';

  const handleRegister = (e) => {
    e.stopPropagation();
    if (registered) {
      toast.info(`Already registered for "${hack.name}". Check Alerts for room invite.`);
      return;
    }
    setRegistered(true);
    toast.success(`Successfully registered for "${hack.name}"! +150 XP awarded.`);
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
          <Star size={11} fill="currentColor" /> Featured
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
            data-action="register-hackathon"
            className="btn-icon-tactile hackathon-register-btn"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              padding: '6px 16px', 
              borderRadius: 'var(--radius-full)', 
              color: registered ? 'var(--success)' : `rgb(${hack.glowRgb})`, 
              fontSize: '0.8rem', 
              fontWeight: 700 
            }}
          >
            {registered ? (
              <><CheckCircle2 size={14} className="text-success" /> Registered</>
            ) : hack.status === 'Ongoing' ? (
              <><Zap size={13} /> Join Now</>
            ) : (
              <><ExternalLink size={13} /> Register</>
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
    { icon: Trophy,       label: 'Hackathons',  value: '6',    color: 'var(--warning)' },
    { icon: Flame,        label: 'Live Now',    value: '1',    color: 'var(--accent)' },
    { icon: Users,        label: 'Participants',value: '22k+', color: 'var(--primary)' },
    { icon: CheckCircle2, label: 'Prize Pool',  value: '₹7L+', color: 'var(--success)' },
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

/* ─── Filter Tabs ────────────────────────────────────────────── */
const FILTERS = ['All', 'Registering', 'Upcoming', 'Ongoing', 'Ended'];

/* ─── Page ──────────────────────────────────────────────────── */
export default function Hackathons() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? hackathons
    : hackathons.filter(h => h.status === activeFilter);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>

      {/* Header */}
      <header style={{ paddingBottom: 'var(--space-xs)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '999px', padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 'var(--space-sm)' }}>
          <Trophy size={12} /> Compete & Win
        </div>
        <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '6px', lineHeight: 1.2 }}>
          Hackathons
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '520px' }}>
          Compete in the world's best coding challenges, win prizes, and get noticed by top recruiters.
        </p>
      </header>

      {/* Stats */}
      <StatsBar />

      {/* Filter tabs (Skeuomorphic Sunken Track + Rocker Tabs) */}
      <div className="skeuo-tab-track flex-wrap" style={{ alignSelf: 'flex-start' }}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`skeuo-tab-btn flex items-center gap-xs ${activeFilter === f ? 'active' : ''}`}
          >
            <span>{f}</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.75 }}>
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

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--text-muted)' }}>
          <Trophy size={40} style={{ opacity: 0.3, margin: '0 auto var(--space-md)' }} />
          <p>No hackathons in this category right now.</p>
        </div>
      )}

    </div>
  );
}
