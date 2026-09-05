import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  PlayCircle, CheckCircle2, FileText, ExternalLink, 
  ArrowLeft, Code2, BookOpen, Terminal, Sparkles, Copy, Check
} from 'lucide-react';
import { useState } from 'react';
import { getResourceById } from '../utils/resourceData';
import { useToast } from '../contexts/ToastContext';

export default function ResourceViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('content'); // 'content' | 'sandbox' | 'docs'
  const [completed, setCompleted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Dynamic resource fetch with full fallback resilience
  const resource = location.state?.resource || getResourceById(id);

  const [isPlaying, setIsPlaying] = useState(false);

  const codeSandboxSnippet = `// Hands-On Code Sandbox: ${resource.title}
// Execute this sample in your Node / Browser environment

import { useState, useEffect } from 'react';

export default function Solution() {
  const [status, setStatus] = useState('Active');
  
  useEffect(() => {
    console.log("NEXORA Interactive Lab Initialized for ${resource.title}");
  }, []);

  return {
    module: "${resource.title}",
    source: "${resource.source}",
    status: status
  };
}`;

  const copyCode = () => {
    navigator.clipboard.writeText(codeSandboxSnippet);
    setCopied(true);
    toast.success('Code snippet copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMarkComplete = () => {
    setCompleted(true);
    toast.success(`Completed "${resource.title}"! +50 XP awarded`);
  };

  return (
    <div className="workstation-container animate-fade-in flex flex-col gap-md" style={{ paddingBottom: '40px' }}>
      
      {/* ── Top Bar ── */}
      <div className="flex justify-between items-center flex-wrap gap-sm">
        <button 
          onClick={() => navigate(-1)} 
          className="btn-back-tactile"
        >
          <ArrowLeft size={16} /> Back to Roadmap
        </button>

        <div className="flex items-center gap-xs">
          <button
            onClick={() => window.open(resource.url, '_blank')}
            className="btn btn-secondary flex items-center gap-xs"
            style={{ fontSize: '0.82rem', padding: '6px 14px' }}
          >
            <ExternalLink size={15} />
            <span>Open Verified Source ({resource.source})</span>
          </button>

          <button
            onClick={handleMarkComplete}
            disabled={completed}
            className={`btn ${completed ? 'btn-secondary' : 'btn-primary'} flex items-center gap-xs`}
            style={{ fontSize: '0.82rem', padding: '6px 14px' }}
          >
            <CheckCircle2 size={16} className={completed ? 'text-success' : ''} />
            <span>{completed ? 'Completed (+50 XP)' : 'Mark as Completed'}</span>
          </button>
        </div>
      </div>

      {/* ── Resource Header Hero ── */}
      <header className="glass-panel skeuo-convex" style={{ padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)' }}>
        <div className="flex items-center gap-xs mb-xs">
          <span className="badge" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', fontWeight: 700, padding: '3px 9px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem' }}>
            {resource.type}
          </span>
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>•</span>
          <span className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 600 }}>{resource.source}</span>
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>•</span>
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>{resource.duration || '25 min study'}</span>
        </div>

        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '6px 0 8px 0', letterSpacing: '-0.4px' }}>
          {resource.title}
        </h1>
        <p className="text-muted" style={{ fontSize: '0.92rem', maxWidth: '850px', lineHeight: 1.55, margin: 0 }}>
          {resource.description}
        </p>

        {/* Workstation Tabs */}
        <div className="flex gap-xs" style={{ marginTop: '16px' }}>
          <button 
            onClick={() => setActiveTab('content')}
            className={`tab-pill ${activeTab === 'content' ? 'active' : ''}`}
          >
            <BookOpen size={15} /> Lesson Content
          </button>
          <button 
            onClick={() => setActiveTab('sandbox')}
            className={`tab-pill ${activeTab === 'sandbox' ? 'active' : ''}`}
          >
            <Code2 size={15} /> Interactive Sandbox
          </button>
          <button 
            onClick={() => setActiveTab('docs')}
            className={`tab-pill ${activeTab === 'docs' ? 'active' : ''}`}
          >
            <ExternalLink size={15} /> Live Documentation Hub
          </button>
        </div>
      </header>

      {/* ── Main Interactive Viewer Body ── */}
      <div className="glass-panel" style={{ padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', minHeight: '420px' }}>
        {activeTab === 'content' && (
          <div>
            {resource.content === 'video' ? (
              isPlaying ? (
                <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube-nocookie.com/embed/KNAWp2cw6jA?autoplay=1" 
                    title="Video lesson" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div 
                  style={{ width: '100%', minHeight: '380px', background: 'var(--skeuo-surface-grad)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '14px', cursor: 'pointer' }}
                  onClick={() => setIsPlaying(true)}
                  className="interactive"
                >
                  <div className="skeuo-convex" style={{ width: 72, height: 72, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PlayCircle size={44} className="text-primary" />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Launch Interactive Video Masterclass</span>
                  <span className="text-muted" style={{ fontSize: '0.82rem' }}>Hosted via verified tech curriculum · Click to play</span>
                </div>
              )
            ) : (
              <div className="animate-fade-in" style={{ lineHeight: '1.75' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>
                  Curriculum Overview: {resource.title}
                </h2>
                <p className="text-muted" style={{ marginBottom: '16px' }}>
                  In this module, you will master the foundational architectural patterns and production workflows associated with <strong>{resource.title}</strong>. When engineering modern software systems, applying these principles directly influences latency, scalability, and code maintainability.
                </p>

                <div className="skeuo-well" style={{ padding: '16px', borderRadius: 'var(--radius-md)', margin: '20px 0' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 700 }}>
                    💡 Core Competencies & Deliverables
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                    <li>Understand internal data structures and lifecycle implications.</li>
                    <li>Benchmark execution speed and identify bottlenecks in production code.</li>
                    <li>Implement defensive error handling and automated unit tests.</li>
                  </ul>
                </div>

                <div className="flex justify-between items-center flex-wrap gap-sm" style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                  <span className="text-muted" style={{ fontSize: '0.84rem' }}>
                    Verified Source: <strong className="text-main">{resource.source}</strong>
                  </span>
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn btn-secondary flex items-center gap-xs"
                    style={{ fontSize: '0.82rem' }}
                  >
                    Read Full Documentation on {resource.source} <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'sandbox' && (
          <div className="animate-fade-in flex flex-col gap-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-xs">
                <Terminal size={17} className="text-primary" />
                <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>Interactive Starter Template</span>
              </div>
              <button 
                onClick={copyCode}
                className="btn btn-secondary flex items-center gap-xs"
                style={{ fontSize: '0.78rem', padding: '5px 12px' }}
              >
                {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy Snippet'}</span>
              </button>
            </div>

            <pre 
              className="skeuo-well custom-scroll" 
              style={{ 
                padding: '16px', 
                borderRadius: 'var(--radius-md)', 
                fontFamily: 'monospace', 
                fontSize: '0.85rem', 
                lineHeight: 1.6, 
                overflowX: 'auto',
                margin: 0,
                color: 'var(--text-main)'
              }}
            >
              {codeSandboxSnippet}
            </pre>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="animate-fade-in flex flex-col items-center justify-center text-center" style={{ padding: '40px 20px', gap: '14px' }}>
            <div className="skeuo-convex" style={{ width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ExternalLink size={30} className="text-primary" />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
              Live Authoritative Documentation
            </h3>
            <p className="text-muted" style={{ maxWidth: '480px', fontSize: '0.88rem', margin: 0 }}>
              Explore the official documentation, API guides, and community examples for {resource.title} directly at {resource.source}.
            </p>
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noreferrer"
              className="btn btn-primary flex items-center gap-xs"
              style={{ padding: '10px 22px', fontSize: '0.88rem', marginTop: '8px' }}
            >
              Launch {resource.source} Documentation <ExternalLink size={16} />
            </a>
          </div>
        )}
      </div>

    </div>
  );
}
