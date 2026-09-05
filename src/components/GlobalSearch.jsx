import { useState } from 'react';
import { Search, BookOpen, Briefcase, Bot, Video, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  // Mocked global data across the app
  const allResults = [
    { id: 1, type: 'resource', title: 'Complete Python Pandas Module', url: '/resources', icon: <BookOpen size={16} /> },
    { id: 2, type: 'resource', title: 'Intro to Machine Learning PDF', url: '/resources', icon: <BookOpen size={16} /> },
    { id: 3, type: 'project', title: 'Build React + Node.js App', url: '/modules', icon: <Briefcase size={16} /> },
    { id: 4, type: 'project', title: 'E-commerce API with Express', url: '/modules', icon: <Briefcase size={16} /> },
    { id: 5, type: 'domain', title: 'Data Science Path', url: '/roadmap', icon: <Bot size={16} /> },
    { id: 6, type: 'domain', title: 'Full Stack Web Development', url: '/roadmap', icon: <Bot size={16} /> },
    { id: 7, type: 'interview', title: 'Frontend Developer Mock Interview', url: '/mock-interview', icon: <Video size={16} /> },
    { id: 8, type: 'interview', title: 'Data Structures & Algorithms', url: '/mock-interview', icon: <Video size={16} /> },
    { id: 9, type: 'job', title: 'Junior Data Scientist at Google', url: '/jobs', icon: <Briefcase size={16} /> },
    { id: 10, type: 'job', title: 'React Frontend Developer', url: '/jobs', icon: <Briefcase size={16} /> },
  ];

  const filteredResults = query.length > 0 
    ? allResults.filter(item => item.title.toLowerCase().includes(query.toLowerCase()) || item.type.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div style={{ position: 'relative', width: '100%', marginBottom: 'var(--space-lg)', zIndex: 50 }}>
      <div 
        className={`glass-panel interactive`}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--space-sm)', 
          padding: 'var(--space-sm) var(--space-md)', 
          borderRadius: 'var(--radius-full)',
          border: isFocused ? '1px solid var(--primary)' : '1px solid var(--border-color)',
          transition: 'all 0.3s ease'
        }}
      >
        <Search size={20} className="text-muted" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search resources, projects, domains, jobs..." 
          style={{ 
            flex: 1, 
            background: 'transparent', 
            border: 'none', 
            outline: 'none', 
            fontSize: '0.95rem', 
            color: 'var(--text-main)', 
            padding: 'var(--space-xs) 0',
            width: '100%'
          }}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isFocused && query.length > 0 && (
        <div className="glass-panel animate-fade-in" style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 'var(--space-sm)', borderRadius: 'var(--radius-md)', maxHeight: '300px', overflowY: 'auto' }}>
          {filteredResults.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredResults.map(result => (
                <div 
                  key={result.id} 
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent input blur
                    navigate(result.url);
                  }}
                  className="interactive"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: 'var(--space-md)', 
                    cursor: 'pointer', 
                    borderBottom: '1px solid var(--border-color)' 
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    <div style={{ color: 'var(--primary)', padding: 'var(--space-xs)', borderRadius: 'var(--radius-sm)', background: 'rgba(99, 102, 241, 0.1)' }}>
                      {result.icon}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>{result.title}</h4>
                      <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.05em' }}>{result.type}</span>
                    </div>
                  </div>
                  <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: 'var(--space-lg)', textAlign: 'center', color: 'var(--text-muted)' }}>
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
