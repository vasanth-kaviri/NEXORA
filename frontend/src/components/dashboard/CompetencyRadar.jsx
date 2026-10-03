import { Award, Sparkles } from 'lucide-react';

export default function CompetencyRadar({ user, activeCompetencies, boostPercent }) {
  return (
    <div className="glass-panel" style={{ padding: '22px', borderRadius: 'var(--radius-xl)' }}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Award size={18} className="text-primary" />
          <h3 style={{ margin: 0, fontSize: '1.04rem', fontWeight: 800 }}>Competency Radar</h3>
        </div>
        <span className="minimal-badge font-mono text-[10px]" style={{ color: 'var(--primary)' }}>
          {user.selectedTrack ? user.selectedTrack.toUpperCase() : 'TRACK SYNC'}
        </span>
      </div>
      
      <div className="flex flex-col gap-3">
        {activeCompetencies.map((skill) => (
          <div key={skill.name}>
            <div className="flex justify-between items-center mb-1">
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{skill.name}</span>
              <span className="tabular-numbers font-bold font-mono" style={{ fontSize: '0.8rem', color: skill.color }}>{skill.score}%</span>
            </div>
            <div className="skeuo-well" style={{ height: '7px', borderRadius: '9999px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${skill.score}%`, 
                  height: '100%', 
                  background: skill.color, 
                  borderRadius: '9999px',
                  boxShadow: `0 0 8px ${skill.color}`,
                  transition: 'width 0.4s ease'
                }} 
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-2.5 flex items-center justify-between text-muted" style={{ borderTop: '1px solid var(--border-color)', fontSize: '0.72rem' }}>
        <span className="flex items-center gap-1">
          <Sparkles size={12} className="text-primary" />
          <span>{user.dreamJob}</span>
        </span>
        <span className="font-semibold text-primary font-mono">
          +{boostPercent}% Activity Boost
        </span>
      </div>
    </div>
  );
}
