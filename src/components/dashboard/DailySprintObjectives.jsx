import { Zap, CheckCircle2, Circle } from 'lucide-react';

export default function DailySprintObjectives({ dailyTasks, completedCount, onToggleTask }) {
  return (
    <div className="glass-panel" style={{ padding: '22px 24px', borderRadius: 'var(--radius-xl)' }}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-warning" />
          <h3 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 800 }}>Daily Sprint Objectives</h3>
        </div>
        <span className="minimal-badge text-primary" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
          {completedCount} of {dailyTasks.length} Completed
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {dailyTasks.map((task) => (
          <div 
            key={task.id}
            onClick={(e) => onToggleTask(task.id, e)}
            className={`interactive flex items-start gap-3 rounded-xl transition-all ${task.completed ? 'opacity-70' : ''}`}
            style={{ 
              background: task.completed ? 'var(--input-bg)' : 'var(--bg-card)', 
              border: '1px solid var(--border-color)',
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer'
            }}
          >
            <div style={{ marginTop: '2px' }}>
              {task.completed ? (
                <CheckCircle2 size={20} className="text-success" />
              ) : (
                <Circle size={20} className="text-muted" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ 
                margin: 0, 
                fontSize: '0.9rem', 
                fontWeight: 700, 
                textDecoration: task.completed ? 'line-through' : 'none',
                color: 'var(--text-main)'
              }}>
                {task.title}
              </p>
              <p className="text-muted" style={{ margin: '3px 0 0 0', fontSize: '0.78rem', lineHeight: 1.45 }}>
                {task.description}
              </p>
            </div>
            <span className="minimal-badge text-warning font-bold self-center" style={{ fontSize: '0.72rem', flexShrink: 0 }}>
              +{task.xp} XP
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
