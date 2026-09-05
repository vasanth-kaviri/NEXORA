import { BarChart, PieChart, Activity } from 'lucide-react';

export default function Progress() {
  return (
    <div className="animate-fade-in flex flex-col gap-lg">
      <header className="mb-md">
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Progress Dashboard</h1>
        <p className="text-muted">Track your learning journey.</p>
      </header>

      <div className="flex flex-col gap-md">
        <div className="glass-panel" style={{ padding: 'var(--space-md)' }}>
          <div className="flex items-center gap-sm mb-sm">
            <Activity className="text-primary" size={20} />
            <h3 style={{ fontWeight: '600' }}>Weekly Activity</h3>
          </div>
          <div style={{ height: 150, background: 'var(--input-bg)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '10px' }}>
            {/* Mock Chart Bars */}
            {[40, 70, 45, 90, 60, 30, 80].map((h, i) => (
              <div key={i} style={{ width: '8%', height: `${h}%`, background: 'var(--primary)', borderRadius: '4px' }} />
            ))}
          </div>
        </div>

        <div className="flex gap-md">
          <div className="glass-panel flex-1 text-center" style={{ padding: 'var(--space-md)' }}>
            <PieChart className="mx-auto text-secondary mb-sm" size={32} />
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>12</div>
            <div className="text-muted" style={{ fontSize: '0.8rem' }}>Modules Completed</div>
          </div>
          <div className="glass-panel flex-1 text-center" style={{ padding: 'var(--space-md)' }}>
            <BarChart className="mx-auto text-accent mb-sm" size={32} />
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>45h</div>
            <div className="text-muted" style={{ fontSize: '0.8rem' }}>Time Spent</div>
          </div>
        </div>
      </div>
    </div>
  );
}
