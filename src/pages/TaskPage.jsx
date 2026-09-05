import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CheckCircle2, ArrowLeft, PlayCircle, BookOpen } from 'lucide-react';

export default function TaskPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    // Read current tasks from local storage
    const currentTasks = JSON.parse(localStorage.getItem('nexora_current_tasks') || '[]');
    const foundTask = currentTasks.find(t => t.id.toString() === taskId);
    
    if (foundTask) {
      setTask(foundTask);
    } else {
      // Fallback if not found
      setTask({ id: taskId, title: 'Unknown Task', completed: false });
    }
  }, [taskId]);

  const toggleTaskCompletion = (status) => {
    const savedProgress = JSON.parse(localStorage.getItem('nexora_task_progress') || '{}');
    savedProgress[taskId] = status;
    localStorage.setItem('nexora_task_progress', JSON.stringify(savedProgress));
    
    setTask(prev => ({ ...prev, completed: status }));
    
    // Auto navigate back to dashboard after completing
    if (status) {
      setTimeout(() => navigate('/dashboard'), 800);
    } else {
      navigate('/dashboard');
    }
  };

  if (!task) return null;

  return (
    <div className="animate-fade-in flex flex-col gap-lg" style={{ minHeight: '80vh', justifyContent: 'center' }}>
      
      <div className="glass-panel" style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
        
        <div style={{ display: 'inline-flex', padding: 'var(--space-md)', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', marginBottom: 'var(--space-md)' }}>
          <BookOpen size={48} className="text-primary" />
        </div>
        
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: 'var(--space-sm)' }}>
          {task.title}
        </h1>
        
        <p className="text-muted" style={{ marginBottom: 'var(--space-xl)' }}>
          Complete this task to progress towards your career goal! 
          Take your time and learn the concepts thoroughly.
        </p>

        <div className="flex flex-col gap-md" style={{ maxWidth: '400px', margin: '0 auto' }}>
          {task.completed ? (
            <div className="glass-panel" style={{ padding: 'var(--space-md)', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-sm)' }}>
              <CheckCircle2 size={24} />
              <span style={{ fontWeight: 600 }}>Task Completed!</span>
            </div>
          ) : (
            <>
              <button 
                className="btn btn-primary"
                onClick={() => toggleTaskCompletion(true)}
              >
                <CheckCircle2 size={20} />
                Mark as Completed
              </button>
              
              <button 
                className="btn btn-secondary"
                onClick={() => toggleTaskCompletion(false)}
              >
                <PlayCircle size={20} />
                Resume Later
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
