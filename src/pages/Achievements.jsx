import { Award, Zap, Star } from 'lucide-react';

export default function Achievements() {
  const badges = [
    { title: 'Fast Learner', description: 'Completed 5 courses in a week.', icon: <Zap size={32} className="text-warning" /> },
    { title: 'Top Performer', description: 'Scored 90%+ in 3 mock interviews.', icon: <Star size={32} className="text-primary" /> },
    { title: 'Explorer', description: 'Started your first personalized roadmap.', icon: <Award size={32} className="text-success" /> }
  ];

  return (
    <div className="animate-fade-in flex flex-col gap-lg">
      <header className="mb-md">
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Achievements</h1>
        <p className="text-muted">Your badges and milestones.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-md)' }}>
        {badges.map((badge, i) => (
          <div key={i} className={`glass-panel interactive text-center delay-${(i+1)*100}`} style={{ padding: 'var(--space-lg) var(--space-md)' }}>
            <div style={{ padding: '16px', background: 'var(--input-bg)', borderRadius: '50%', display: 'inline-flex', marginBottom: 'var(--space-sm)' }}>
              {badge.icon}
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '4px' }}>{badge.title}</h3>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>{badge.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
