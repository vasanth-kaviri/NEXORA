import { AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';

export default function SkillGap() {
  const skills = [
    { name: 'Python Programming', current: 85, required: 90, status: 'good' },
    { name: 'Data Visualization', current: 60, required: 80, status: 'gap' },
    { name: 'Machine Learning', current: 30, required: 85, status: 'critical' },
    { name: 'SQL & Databases', current: 90, required: 70, status: 'excellent' }
  ];

  return (
    <div className="animate-fade-in flex flex-col gap-lg">
      <header className="mb-md">
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Skill Gap Analysis</h1>
        <p className="text-muted">Compare your skills against the Data Scientist role.</p>
      </header>

      <div className="flex flex-col gap-md">
        {skills.map((skill, index) => (
          <div key={index} className={`glass-panel interactive delay-${(index + 1) * 100}`} style={{ padding: 'var(--space-md)' }}>
            <div className="flex justify-between items-center mb-sm">
              <div className="flex items-center gap-sm">
                {skill.status === 'critical' && <AlertTriangle size={18} className="text-secondary" />}
                {skill.status === 'gap' && <TrendingUp size={18} className="text-warning" />}
                {(skill.status === 'good' || skill.status === 'excellent') && <CheckCircle size={18} className="text-success" />}
                <span style={{ fontWeight: '600' }}>{skill.name}</span>
              </div>
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>{skill.current}% / {skill.required}%</span>
            </div>
            
            <div style={{ width: '100%', height: 8, background: 'var(--input-bg)', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
              <div style={{ 
                position: 'absolute', top: 0, left: 0, bottom: 0, 
                width: `${skill.required}%`, 
                background: 'rgba(255,255,255,0.1)',
                borderRight: '2px dashed var(--text-muted)'
              }} />
              <div style={{ 
                position: 'absolute', top: 0, left: 0, bottom: 0, 
                width: `${skill.current}%`, 
                background: skill.status === 'critical' ? 'var(--secondary)' : skill.status === 'gap' ? 'var(--warning)' : 'var(--success)'
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
