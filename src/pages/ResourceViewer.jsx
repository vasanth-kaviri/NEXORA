import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { PlayCircle, CheckCircle2, FileText, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function ResourceViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [completed, setCompleted] = useState(false);

  // Hardcoded mock resource data based on the ID for demonstration
  const getResourceDetails = (resourceId) => {
    const defaultResource = {
      title: 'Machine Learning A-Z',
      type: 'Course',
      source: 'Udemy',
      description: 'Master Machine Learning with Python & R. Learn to build accurate predictive models, evaluate their performance, and deploy them into production.',
      content: 'video'
    };

    if (resourceId === '1') {
      return {
        title: 'Intro to Data Visualization with D3',
        type: 'Article',
        source: 'Towards Data Science',
        description: 'A comprehensive guide to building interactive and responsive data visualizations using D3.js and modern web standards.',
        content: 'article'
      };
    } else if (resourceId === '2') {
      return {
        title: 'Build a Recommendation Engine',
        type: 'Project',
        source: 'Kaggle',
        description: 'Apply collaborative filtering and matrix factorization techniques to build a movie recommendation engine from scratch using the MovieLens dataset.',
        content: 'external'
      };
    }
    
    return defaultResource;
  };

  const resource = location.state?.resource || getResourceDetails(id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReading, setIsReading] = useState(false);

  return (
    <div className="animate-fade-in flex flex-col gap-lg">
      <header className="mb-md">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-xs)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {resource.type}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>•</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            {resource.source}
          </span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: 'var(--space-xs)', lineHeight: 1.2 }}>{resource.title}</h1>
        <p className="text-muted" style={{ fontSize: '0.95rem' }}>{resource.description}</p>
      </header>

      <div className="glass-panel" style={{ padding: 'var(--space-md)', overflow: 'hidden' }}>
        {resource.content === 'video' && (
          isPlaying ? (
            <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/KNAWp2cw6jA?autoplay=1" 
                title="Video lesson" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div 
              style={{ width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 'var(--space-sm)', cursor: 'pointer' }}
              onClick={() => setIsPlaying(true)}
            >
              <PlayCircle size={64} className="text-primary interactive" style={{ filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))' }} />
              <span style={{ color: 'white', fontWeight: 600 }}>Start Video Lesson</span>
            </div>
          )
        )}
        
        {resource.content === 'article' && (
          isReading ? (
            <div className="animate-fade-in" style={{ padding: 'var(--space-lg)', background: 'var(--bg-card-glass)', borderRadius: 'var(--radius-md)', lineHeight: '1.8' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Introduction to {resource.title}</h2>
              <p style={{ marginBottom: 'var(--space-md)' }}>This is a comprehensive guide to understanding the core concepts of this topic. When working in data science, mastering these fundamentals is crucial for building robust applications and models.</p>
              <p style={{ marginBottom: 'var(--space-md)' }}>The first step is setting up your environment. Ensure you have the right tools installed. For Python development, environments like Jupyter or VS Code are highly recommended.</p>
              <p style={{ marginBottom: 'var(--space-md)' }}>As we dive deeper, you'll see how these structures interact to create highly optimized predictive engines. Always refer to the official documentation when you get stuck!</p>
              <div style={{ padding: 'var(--space-md)', background: 'rgba(16, 185, 129, 0.1)', borderLeft: '4px solid var(--success)', borderRadius: '4px' }}>
                <strong>Key Takeaway:</strong> Practice makes perfect. Don't just read—apply this to a small project immediately.
              </div>
            </div>
          ) : (
            <div 
              style={{ padding: 'var(--space-lg)', background: 'var(--bg-card-glass)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
              onClick={() => setIsReading(true)}
              className="interactive"
            >
              <FileText size={48} className="text-accent mb-md" style={{ opacity: 0.8 }} />
              <div style={{ width: '100%', height: '12px', background: 'var(--border-color)', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-sm)' }} />
              <div style={{ width: '90%', height: '12px', background: 'var(--border-color)', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-sm)' }} />
              <div style={{ width: '95%', height: '12px', background: 'var(--border-color)', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-lg)' }} />
              <p className="text-primary text-center" style={{ marginTop: 'var(--space-lg)', fontWeight: 600, fontSize: '0.9rem' }}>Click to read full article</p>
            </div>
          )
        )}

        {resource.content === 'external' && (
          <div style={{ padding: 'var(--space-xl)', background: 'var(--bg-card-glass)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 'var(--space-md)', textAlign: 'center' }}>
            <ExternalLink size={48} className="text-secondary" />
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 'var(--space-xs)' }}>External Project</h3>
              <p className="text-muted" style={{ fontSize: '0.9rem', maxWidth: '300px', margin: '0 auto' }}>This project is hosted on {resource.source}. You will be redirected to their platform to complete it.</p>
            </div>
            <button 
              className="btn-primary interactive" 
              style={{ padding: '10px 24px', borderRadius: 'var(--radius-full)', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}
              onClick={() => window.open('https://github.com/topics/machine-learning', '_blank')}
            >
              Open in {resource.source} <ExternalLink size={16} />
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop: 'var(--space-md)' }}>
        <button 
          onClick={() => {
            setCompleted(true);
            
            // Advance roadmap in localStorage
            try {
              const savedRoadmap = localStorage.getItem('nexora_roadmap');
              if (savedRoadmap) {
                const steps = JSON.parse(savedRoadmap);
                
                // Find the in-progress step
                const inProgressIdx = steps.findIndex(s => s.status === 'in-progress');
                if (inProgressIdx !== -1) {
                  steps[inProgressIdx].status = 'completed';
                  
                  // Unlock the next step if exists
                  if (inProgressIdx + 1 < steps.length) {
                    steps[inProgressIdx + 1].status = 'in-progress';
                  }
                  
                  localStorage.setItem('nexora_roadmap', JSON.stringify(steps));
                  
                  // Dispatch custom event to tell Roadmap to update
                  window.dispatchEvent(new Event('roadmap_updated'));
                }
              }
            } catch (e) {
              console.error(e);
            }

            setTimeout(() => navigate(-1), 1000); // Go back after 1 second
          }}
          className="interactive"
          style={{ 
            width: '100%', 
            padding: 'var(--space-md)', 
            borderRadius: 'var(--radius-md)', 
            background: completed ? 'rgba(16, 185, 129, 0.1)' : 'var(--primary)', 
            color: completed ? 'var(--success)' : 'white',
            border: completed ? '1px solid rgba(16, 185, 129, 0.3)' : 'none',
            fontWeight: 600, 
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-sm)',
            transition: 'all 0.3s ease'
          }}
        >
          {completed ? (
            <>
              <CheckCircle2 size={20} /> Resource Completed!
            </>
          ) : (
            'Mark as Completed'
          )}
        </button>
      </div>

    </div>
  );
}
