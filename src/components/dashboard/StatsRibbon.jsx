import { Target, TrendingUp, Flame, Trophy } from 'lucide-react';

export default function StatsRibbon({ user, completedCount, totalTasks, taskPercent }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="glass-panel skeuo-convex interactive flex items-center gap-3" style={{ padding: '16px 18px', borderRadius: 'var(--radius-lg)' }}>
        <div className="skeuo-well" style={{ padding: '10px', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
          <Target size={20} />
        </div>
        <div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0, fontWeight: 600 }}>Career Match</p>
          <p className="tabular-numbers font-bold text-main" style={{ fontSize: '1.25rem', margin: '2px 0 0 0' }}>{user.careerMatch}%</p>
        </div>
      </div>

      <div className="glass-panel skeuo-convex interactive flex items-center gap-3" style={{ padding: '16px 18px', borderRadius: 'var(--radius-lg)' }}>
        <div className="skeuo-well" style={{ padding: '10px', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
          <TrendingUp size={20} />
        </div>
        <div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0, fontWeight: 600 }}>Sprint Progress</p>
          <p className="tabular-numbers font-bold text-main" style={{ fontSize: '1.25rem', margin: '2px 0 0 0' }}>
            {completedCount}/{totalTasks} ({taskPercent}%)
          </p>
        </div>
      </div>

      <div className="glass-panel skeuo-convex interactive flex items-center gap-3" style={{ padding: '16px 18px', borderRadius: 'var(--radius-lg)' }}>
        <div className="skeuo-well" style={{ padding: '10px', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
          <Flame size={20} />
        </div>
        <div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0, fontWeight: 600 }}>Daily Streak</p>
          <p className="tabular-numbers font-bold text-main" style={{ fontSize: '1.25rem', margin: '2px 0 0 0' }}>{user.streak} {user.streak === 1 ? 'Day' : 'Days'} 🔥</p>
        </div>
      </div>

      <div className="glass-panel skeuo-convex interactive flex items-center gap-3" style={{ padding: '16px 18px', borderRadius: 'var(--radius-lg)' }}>
        <div className="skeuo-well" style={{ padding: '10px', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
          <Trophy size={20} />
        </div>
        <div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0, fontWeight: 600 }}>Mastery Rank</p>
          <p className="tabular-numbers font-bold text-main" style={{ fontSize: '1.25rem', margin: '2px 0 0 0' }}>
            {user.tier ? `${user.tier.toUpperCase()} TIER` : `Tier Level ${user.level || 1}`}
          </p>
        </div>
      </div>
    </div>
  );
}
