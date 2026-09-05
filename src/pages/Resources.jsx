import { BookOpen, Video, ExternalLink, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getResourcesForStep } from '../utils/resourceData';

export default function Resources() {
  const navigate = useNavigate();
  const location = useLocation();
  const topic = location.state?.topic;

  const resources = getResourcesForStep(topic);
  const pageTitle = topic ? `${topic.title} Resources` : 'Learning Resources';
  const pageSubtitle = topic ? 'Curated specifically for this roadmap milestone.' : 'Curated to fill your skill gaps.';

  const renderIcon = (type) => {
    if (type === 'Course') return <Video size={20} className="text-primary" />;
    if (type === 'Article') return <BookOpen size={20} className="text-accent" />;
    return <ExternalLink size={20} className="text-secondary" />;
  };

  return (
    <div className="animate-fade-in flex flex-col gap-lg">
      <header className="mb-md">
        {topic && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-xs interactive mb-xs text-muted"
            style={{ fontSize: '0.85rem', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <ArrowLeft size={16} /> Back to Roadmap
          </button>
        )}
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{pageTitle}</h1>
        <p className="text-muted">{pageSubtitle}</p>
      </header>

      <div className="flex flex-col gap-md">
        {resources.map((res, index) => {
          return (
            <div 
              key={res.id || index} 
              className={`glass-panel interactive delay-${(index + 1) * 100} flex items-center justify-between`} 
              style={{ padding: 'var(--space-md)', cursor: 'pointer' }}
              onClick={() => navigate(`/resource/${res.id}`, { state: { resource: res } })}
            >
              <div className="flex items-center gap-md">
                <div style={{ padding: '10px', background: 'var(--input-bg)', borderRadius: '50%' }}>
                  {renderIcon(res.type)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>{res.title}</h3>
                  <p className="text-muted" style={{ fontSize: '0.8rem' }}>{res.type} • {res.source}</p>
                </div>
              </div>
              <button 
                className="text-primary interactive" 
                style={{ fontWeight: '600', padding: '8px 12px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/resource/${res.id}`, { state: { resource: res } });
                }}
              >
                Start
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
