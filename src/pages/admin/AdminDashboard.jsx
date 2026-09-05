import { Users, BookOpen, Activity, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Students', value: '1,248', icon: <Users size={24} className="text-primary" />, trend: '+12%' },
    { label: 'Active Roadmaps', value: '892', icon: <Activity size={24} className="text-accent" />, trend: '+5%' },
    { label: 'Resources Accessed', value: '4,103', icon: <BookOpen size={24} className="text-warning" />, trend: '+22%' },
    { label: 'Platform Growth', value: '28%', icon: <TrendingUp size={24} className="text-success" />, trend: '+4%' },
  ];

  return (
    <div className="animate-fade-in flex flex-col gap-lg">
      <header className="mb-lg">
        <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Admin Dashboard</h1>
        <p className="text-muted">Platform overview and quick stats.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-lg)' }}>
        {stats.map((stat, i) => (
          <div key={i} className={`glass-panel interactive delay-${(i + 1) * 100}`} style={{ padding: 'var(--space-lg)' }}>
            <div className="flex justify-between items-start mb-md">
              <div style={{ padding: '12px', background: 'var(--input-bg)', borderRadius: '12px' }}>
                {stat.icon}
              </div>
              <span className="text-success" style={{ fontSize: '0.85rem', fontWeight: '600' }}>{stat.trend}</span>
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>{stat.value}</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-lg mt-lg">
        <div className="glass-panel flex-1 delay-300" style={{ padding: 'var(--space-lg)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: 'var(--space-md)' }}>Recent Activity</h2>
          <div className="flex flex-col gap-sm">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex justify-between py-sm" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <span className="text-muted">New student registered: user_{i}20</span>
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>Just now</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
