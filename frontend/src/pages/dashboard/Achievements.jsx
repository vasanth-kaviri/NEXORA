import { useState } from 'react';
import { 
  Award, Zap, Star, ShieldCheck, Trophy, Sparkles, Flame, CheckCircle2, Lock, X, Share2, Download 
} from 'lucide-react';
import db from '../../services/db';
import { useToast } from '../../contexts/ToastContext';

export default function Achievements() {
  const toast = useToast();
  const currentUser = db.getCurrentUser() || {};
  const currentXp = currentUser.stats?.points || currentUser.xp || 100;
  const currentStreak = currentUser.stats?.streakDays || currentUser.streak || 1;
  const tasksDone = currentUser.stats?.completedRoadmapNodes || currentUser.tasksCompleted || 0;
  const interviewsDone = currentUser.stats?.interviewsCompleted || currentUser.interviewsCompleted || 0;

  const [selectedBadge, setSelectedBadge] = useState(null);

  const badges = [
    {
      id: 'badge_1',
      title: 'Roadmap Pioneer',
      category: 'Foundation',
      description: 'Initialized your first personalized career trajectory.',
      unlocked: true,
      progress: 100,
      icon: <Award size={28} className="text-primary" />
    },
    {
      id: 'badge_2',
      title: 'Fast Learner',
      category: 'Mastery',
      description: 'Completed 3 hands-on practical coding tasks.',
      unlocked: tasksDone >= 3,
      progress: Math.min(100, Math.round((tasksDone / 3) * 100)),
      icon: <Zap size={28} className="text-warning" />
    },
    {
      id: 'badge_3',
      title: 'Interview Ace',
      category: 'Career',
      description: 'Completed a full proctored MNC mock interview.',
      unlocked: interviewsDone >= 1,
      progress: Math.min(100, interviewsDone * 100),
      icon: <Star size={28} className="text-secondary" />
    },
    {
      id: 'badge_4',
      title: '7-Day Habit Streak',
      category: 'Consistency',
      description: 'Maintained active daily learning for 7 consecutive days.',
      unlocked: currentStreak >= 7,
      progress: Math.min(100, Math.round((currentStreak / 7) * 100)),
      icon: <Flame size={28} className="text-accent" />
    },
    {
      id: 'badge_5',
      title: 'XP Milestone: 1,500',
      category: 'XP Growth',
      description: 'Accumulated over 1,500 total skill experience points.',
      unlocked: currentXp >= 1500,
      progress: Math.min(100, Math.round((currentXp / 1500) * 100)),
      icon: <Trophy size={28} className="text-success" />
    },
    {
      id: 'badge_6',
      title: 'ATS Resume Master',
      category: 'Career',
      description: 'Scored 85%+ on the AI Resume ATS evaluation.',
      unlocked: true,
      progress: 100,
      icon: <ShieldCheck size={28} className="text-primary" />
    },
    {
      id: 'badge_7',
      title: 'Quiz Champion',
      category: 'Assessment',
      description: 'Answered 15 technical questions in a single session.',
      unlocked: true,
      progress: 100,
      icon: <CheckCircle2 size={28} className="text-warning" />
    },
    {
      id: 'badge_8',
      title: 'Cohort Collaborator',
      category: 'Community',
      description: 'Connected with a peer engineer in the Peer Nexus.',
      unlocked: true,
      progress: 100,
      icon: <Sparkles size={28} className="text-secondary" />
    }
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;

  const handleShareBadge = (badge) => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success(`Shareable verification link for "${badge.title}" copied to clipboard!`);
  };

  return (
    <div className="animate-fade-in flex flex-col gap-lg" style={{ paddingBottom: '5rem' }}>
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
        <div>
          <div className="flex items-center gap-xs text-primary font-600 mb-xs" style={{ fontSize: '0.82rem' }}>
            <Trophy size={15} /> VERIFIED TALENT CREDENTIALS
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
            Milestones &amp; Skill Badges
          </h1>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            Verifiable accomplishments earned through hands-on tasks, quizzes, and mock interviews.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '8px 18px', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.85rem' }}>
          <span className="text-success">{unlockedCount}</span> of {badges.length} Badges Unlocked
        </div>
      </header>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        {badges.map((badge) => (
          <div 
            key={badge.id} 
            onClick={() => setSelectedBadge(badge)}
            className="glass-panel interactive flex flex-col justify-between cursor-pointer group" 
            style={{ 
              padding: '1.5rem', 
              opacity: badge.unlocked ? 1 : 0.65,
              border: badge.unlocked ? '1px solid var(--border-color)' : '1px dashed var(--border-color)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            <div>
              <div className="flex justify-between items-start mb-sm">
                <div 
                  className="transition-transform group-hover:scale-110"
                  style={{ 
                    padding: '12px', 
                    background: 'var(--input-bg)', 
                    borderRadius: '12px', 
                    display: 'inline-flex'
                  }}
                >
                  {badge.icon}
                </div>

                {badge.unlocked ? (
                  <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', fontSize: '0.72rem', padding: '2px 8px' }}>
                    Unlocked ✓
                  </span>
                ) : (
                  <span className="badge" style={{ background: 'var(--input-bg)', color: 'var(--text-muted)', fontSize: '0.72rem', padding: '2px 8px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Lock size={11} /> Locked
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>{badge.title}</h3>
              <p className="text-muted" style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>{badge.description}</p>
            </div>

            <div className="mt-md pt-sm" style={{ borderTop: '1px solid var(--border-color)' }}>
              <div className="flex justify-between text-muted mb-xs" style={{ fontSize: '0.75rem' }}>
                <span>Progress</span>
                <span>{badge.progress}%</span>
              </div>
              <div style={{ width: '100%', height: 5, background: 'var(--input-bg)', borderRadius: 3, overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${badge.progress}%`, 
                    height: '100%', 
                    background: badge.unlocked ? 'var(--success)' : 'var(--primary)',
                    transition: 'width 0.4s ease'
                  }} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Verified Certificate Modal */}
      {selectedBadge && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={() => setSelectedBadge(null)}
        >
          <div 
            className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-indigo-500/30 shadow-2xl relative animate-scale-up"
            style={{ background: 'var(--bg-card)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 text-muted hover:text-main p-1.5 rounded-full cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div 
                className="p-5 rounded-2xl mb-4"
                style={{ 
                  background: selectedBadge.unlocked ? 'rgba(99, 102, 241, 0.15)' : 'var(--input-bg)',
                  border: '1px solid rgba(99, 102, 241, 0.3)'
                }}
              >
                {selectedBadge.icon}
              </div>

              <span className="badge text-xs font-semibold px-3 py-1 mb-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {selectedBadge.category.toUpperCase()} CREDENTIAL
              </span>

              <h2 className="text-2xl font-bold text-main mb-2">
                {selectedBadge.title}
              </h2>

              <p className="text-muted text-sm mb-6 leading-relaxed">
                {selectedBadge.description}
              </p>

              <div className="w-full p-4 rounded-xl bg-input/40 border border-border mb-6 text-left">
                <div className="flex justify-between text-xs text-muted mb-1">
                  <span>Status:</span>
                  <span className={selectedBadge.unlocked ? 'text-emerald-400 font-bold' : 'text-muted'}>
                    {selectedBadge.unlocked ? 'Verified & Authenticated' : 'In Progress'}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted">
                  <span>Recipient:</span>
                  <span className="font-semibold text-main">
                    {currentUser.firstName || 'Student'} {currentUser.lastName || ''}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => handleShareBadge(selectedBadge)}
                  className="btn btn-primary flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl cursor-pointer"
                >
                  <Share2 size={16} />
                  <span>Share Credential</span>
                </button>
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="btn btn-secondary py-2.5 px-4 rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
