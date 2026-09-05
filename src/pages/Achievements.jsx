import { useState } from 'react';
import { 
  Award, Zap, Star, ShieldCheck, Trophy, Sparkles, Flame, CheckCircle2, Lock 
} from 'lucide-react';
import db from '../services/db';

export default function Achievements() {
  const currentUser = db.getCurrentUser() || {};
  const currentXp = currentUser.xp || 1200;
  const currentStreak = currentUser.streak || 5;
  const tasksDone = currentUser.tasksCompleted || 4;
  const interviewsDone = currentUser.interviewsCompleted || 1;

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

  return (
    <div className="animate-fade-in flex flex-col gap-lg" style={{ paddingBottom: '5rem' }}>
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
        <div>
          <div className="flex items-center gap-xs text-primary font-600 mb-xs" style={{ fontSize: '0.82rem' }}>
            <Trophy size={15} /> VERIFIED TALENT CREDENTIALS
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
            Milestones & Skill Badges
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
            className="glass-panel interactive flex flex-col justify-between" 
            style={{ 
              padding: '1.5rem', 
              opacity: badge.unlocked ? 1 : 0.65,
              border: badge.unlocked ? '1px solid var(--border-color)' : '1px dashed var(--border-color)'
            }}
          >
            <div>
              <div className="flex justify-between items-start mb-sm">
                <div 
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
                    background: badge.unlocked ? 'var(--success)' : 'var(--primary)' 
                  }} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
