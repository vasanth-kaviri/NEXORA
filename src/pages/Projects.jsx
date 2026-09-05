import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import {
  FolderKanban, Star, Clock, Users, ArrowUpRight,
  CheckCircle2, Circle, Flame, Lock, Sparkles,
  Code2, Database, Layers, Globe, Cpu, ShieldCheck,
  Plus, ExternalLink, GitBranch, BookOpen, X, Send, Eye, FileCode
} from 'lucide-react';
import db from '../services/db';

/* ─── Difficulty & Data ─────────────────────────────────────── */
const difficultyConfig = {
  Beginner:     { color: 'var(--minimal-emerald)', bg: 'rgba(16, 185, 129, 0.08)', dot: 'var(--minimal-emerald)' },
  Intermediate: { color: 'var(--minimal-indigo)',  bg: 'rgba(99, 102, 241, 0.08)', dot: 'var(--minimal-indigo)' },
  Advanced:     { color: 'var(--minimal-violet)',  bg: 'rgba(168, 85, 247, 0.08)', dot: 'var(--minimal-violet)' },
};

const referenceCategories = [
  {
    label: 'Web Systems & Distributed Architecture',
    icon: Globe,
    color: 'var(--minimal-indigo)',
    rgb: '99, 102, 241',
    projects: [
      {
        id: 'ref_1',
        title: 'High-Performance Developer Portfolio & CMS',
        desc: 'Build a sleek, responsive developer portfolio with React 19, custom canvas animations, and automated GitHub telemetry.',
        tags: ['React 19', 'CSS Engine', 'Vite'],
        difficulty: 'Beginner',
        duration: '3–5 days',
        stars: 4.9,
        enrolled: 1840,
        architecture: 'Single-Page Architecture with Vite bundler, modular CSS variables, and serverless edge form handling.',
        milestones: ['Setup Vite & CSS tokens', 'Build canvas interactive background', 'Integrate GitHub GraphQL API', 'Deploy to Vercel/Netlify']
      },
      {
        id: 'ref_2',
        title: 'Full-Stack Job & Talent Marketplace',
        desc: 'Build an end-to-end recruitment platform with instant search indexing, candidate filters, and JWT session handling.',
        tags: ['React', 'Node.js', 'PostgreSQL'],
        difficulty: 'Intermediate',
        duration: '2–3 weeks',
        stars: 4.8,
        enrolled: 1420,
        architecture: 'RESTful API backend in Express with PostgreSQL relational schema and client-side debounce search indexing.',
        milestones: ['Design relational schema with Prisma', 'Implement JWT auth & cookie sessions', 'Build application tracking drawer', 'Setup Redis query caching']
      },
      {
        id: 'ref_3',
        title: 'Real-Time Distributed Chat Protocol',
        desc: 'Build a high-concurrency messaging service with WebSockets, room sharding, read receipts, and typing telemetry.',
        tags: ['WebSockets', 'Redis', 'Express'],
        difficulty: 'Advanced',
        duration: '3–4 weeks',
        stars: 4.9,
        enrolled: 980,
        architecture: 'Pub/Sub event backbone using Redis cluster, WebSocket connection pooling, and message persistence in MongoDB.',
        milestones: ['Setup WebSocket server heartbeat', 'Implement Redis Pub/Sub room sharding', 'Add typing indicators & receipts', 'End-to-end encryption layer']
      },
    ],
  },
  {
    label: 'Artificial Intelligence & Neural Systems',
    icon: Cpu,
    color: 'var(--minimal-cyan)',
    rgb: '6, 182, 212',
    projects: [
      {
        id: 'ref_4',
        title: 'Vector Embedding Recommendation Engine',
        desc: 'Build a semantic content filtering model that computes cosine similarity over multi-dimensional embeddings.',
        tags: ['Python', 'PyTorch', 'Vector DB'],
        difficulty: 'Intermediate',
        duration: '1–2 weeks',
        stars: 4.8,
        enrolled: 1650,
        architecture: 'FastAPI microservice querying Pinecone vector database with HuggingFace MiniLM sentence transformers.',
        milestones: ['Generate text embeddings with HuggingFace', 'Index into Pinecone / ChromaDB', 'Build cosine similarity search endpoint', 'Expose REST API to React front-end']
      },
      {
        id: 'ref_5',
        title: 'Real-Time LLM Sentiment & Market Dashboard',
        desc: 'Analyze streaming tech discussion feeds using transformer models and visualize market momentum in real-time.',
        tags: ['Transformers', 'FastAPI', 'Plotly'],
        difficulty: 'Advanced',
        duration: '2–3 weeks',
        stars: 4.9,
        enrolled: 1140,
        architecture: 'Event-driven ingestion pipeline consuming RSS feeds, running sentiment classification, and streaming updates via SSE.',
        milestones: ['Connect live data ingestion stream', 'Run HuggingFace RoBERTa sentiment model', 'Store rolling time-series in PostgreSQL', 'Build interactive UI charts']
      },
    ],
  },
  {
    label: 'Cloud Infrastructure & Kubernetes DevOps',
    icon: Layers,
    color: 'var(--minimal-amber)',
    rgb: '245, 158, 11',
    projects: [
      {
        id: 'ref_6',
        title: 'Multi-Stage Production CI/CD Pipeline',
        desc: 'Automate static analysis, unit testing, container build, and zero-downtime deployment using GitHub Actions.',
        tags: ['GitHub Actions', 'Docker', 'AWS'],
        difficulty: 'Intermediate',
        duration: '1 week',
        stars: 4.7,
        enrolled: 1210,
        architecture: 'Multi-stage Docker builds with GitHub Actions runner matrix and automated ECS rolling task definition deployments.',
        milestones: ['Write Dockerfile with multi-stage build', 'Configure GitHub Actions test matrix', 'Automate vulnerability scanning with Trivy', 'Setup AWS ECS blue-green deploy']
      },
      {
        id: 'ref_7',
        title: 'High-Availability Containerized Microservices',
        desc: 'Orchestrate a multi-tenant microservices cluster with Kubernetes Ingress, Prometheus telemetry, and service mesh.',
        tags: ['Kubernetes', 'Docker', 'Helm'],
        difficulty: 'Advanced',
        duration: '3–4 weeks',
        stars: 4.9,
        enrolled: 890,
        architecture: 'K8s deployment with NGINX Ingress controller, horizontal pod autoscalers (HPA), and Grafana metrics dashboard.',
        milestones: ['Containerize 3 decoupled microservices', 'Write Helm charts for staging & prod', 'Configure HPA based on CPU/memory', 'Setup Prometheus alerting rules']
      },
    ],
  }
];

/* ─── Default Initial Developed Projects ────────────────────── */
const INITIAL_DEVELOPED_PROJECTS = [
  {
    id: 'user_proj_1',
    title: 'CloudScale - Distributed Microservices Ingress',
    desc: 'High-concurrency API gateway and rate-limiter built with Go and Redis, handling 40,000 requests/sec with automated token bucket algorithm.',
    tags: ['Go', 'Redis', 'Docker', 'Kubernetes'],
    demoUrl: 'https://demo.cloudscale-nexora.dev',
    repoUrl: 'https://github.com/alexjohnson/cloudscale-ingress',
    status: 'Live & Deployed',
    verified: true,
    stars: 128,
    date: 'Aug 28, 2026'
  },
  {
    id: 'user_proj_2',
    title: 'NeuroVision - Medical X-Ray Diagnostic AI',
    desc: 'DenseNet-121 convolutional neural network fine-tuned on NIH chest X-rays to detect 14 pulmonary conditions with 94.2% AUC accuracy.',
    tags: ['PyTorch', 'FastAPI', 'React', 'TailwindCSS'],
    demoUrl: 'https://neurovision-ai.vercel.app',
    repoUrl: 'https://github.com/alexjohnson/neurovision-diagnostics',
    status: 'AI Architecture Verified',
    verified: true,
    stars: 94,
    date: 'Sep 02, 2026'
  }
];

export default function Projects() {
  const toast = useToast();
  const navigate = useNavigate();
  const currentUser = db.getCurrentUser() || {};

  // Developed Projects State
  const [userProjects, setUserProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('nexora_user_projects');
      return saved ? JSON.parse(saved) : INITIAL_DEVELOPED_PROJECTS;
    } catch {
      return INITIAL_DEVELOPED_PROJECTS;
    }
  });

  // Modal States
  const [selectedReference, setSelectedReference] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    desc: '',
    tags: 'React, Node.js, PostgreSQL',
    demoUrl: '',
    repoUrl: '',
    basedOnReference: ''
  });

  // Persist Developed Projects
  useEffect(() => {
    try {
      localStorage.setItem('nexora_user_projects', JSON.stringify(userProjects));
    } catch (e) {
      console.warn('Failed to persist user projects:', e);
    }
  }, [userProjects]);

  const handleOpenSubmit = (refTitle = '') => {
    setNewProject(prev => ({
      ...prev,
      basedOnReference: refTitle,
      title: refTitle ? `My ${refTitle} Build` : ''
    }));
    setShowSubmitModal(true);
  };

  const handleSubmitProject = (e) => {
    e.preventDefault();
    if (!newProject.title.trim() || !newProject.desc.trim()) {
      toast.error('Please enter a project title and description.');
      return;
    }

    const created = {
      id: `user_proj_${Date.now()}`,
      title: newProject.title.trim(),
      desc: newProject.desc.trim(),
      tags: newProject.tags.split(',').map(t => t.trim()).filter(Boolean),
      demoUrl: newProject.demoUrl.trim() || 'https://github.com',
      repoUrl: newProject.repoUrl.trim() || 'https://github.com',
      status: 'Live & Deployed',
      verified: true,
      stars: 1,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const updated = [created, ...userProjects];
    setUserProjects(updated);
    setShowSubmitModal(false);
    setSelectedReference(null);
    setNewProject({ title: '', desc: '', tags: '', demoUrl: '', repoUrl: '', basedOnReference: '' });

    // Reward XP
    db.updateUserProfile({
      xp: (currentUser.xp || 1200) + 200,
      projectsCompleted: (currentUser.projectsCompleted || 2) + 1
    });

    toast.success(`Project "${created.title}" successfully published! +200 XP added.`);
  };

  return (
    <div className="animate-fade-in flex flex-col gap-lg" style={{ paddingBottom: '5rem' }}>

      {/* ── Center-Aligned Header ── */}
      <header className="flex flex-col items-center text-center justify-center gap-xs" style={{ margin: '0 auto', maxWidth: '720px', paddingBottom: 'var(--space-xs)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '999px', padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 'var(--space-xs)' }}>
          <Sparkles size={12} /> Production Portfolio Builder
        </div>
        <h1 className="text-gradient" style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '6px', lineHeight: 1.2 }}>
          Hands-On Engineering Projects
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '580px' }}>
          Explore enterprise reference blueprints, clone production architectures, and showcase your own developed projects directly in your portfolio.
        </p>

        <div className="flex items-center gap-sm mt-sm">
          <button 
            onClick={() => handleOpenSubmit()}
            className="btn btn-primary flex items-center gap-xs"
            style={{ padding: '8px 20px', fontSize: '0.86rem' }}
          >
            <Plus size={16} /> Submit Your Developed Project
          </button>
        </div>
      </header>

      {/* ── Stats Strip ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
        {[
          { label: 'Reference Blueprints', val: '7 Certified', icon: BookOpen, color: 'var(--primary)' },
          { label: 'User Developed Projects', val: `${userProjects.length} Built`, icon: Code2, color: 'var(--success)' },
          { label: 'ATS Portfolio Match', val: '96% Benchmark', icon: Star, color: 'var(--warning)' },
          { label: 'Code Telemetry XP', val: `+${userProjects.length * 200} Earned`, icon: Sparkles, color: 'var(--secondary)' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-panel" style={{ padding: '14px 18px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--input-bg)', color: stat.color }}>
                <Icon size={18} />
              </div>
              <div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, fontWeight: 600 }}>{stat.label}</p>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>{stat.val}</h4>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── SECTION 1: MY DEVELOPED PROJECTS ── */}
      <section className="flex flex-col gap-md">
        <div className="flex justify-between items-center flex-wrap gap-sm">
          <div>
            <div className="flex items-center gap-xs text-success font-600 mb-xs" style={{ fontSize: '0.8rem' }}>
              <CheckCircle2 size={14} /> CANDIDATE PRODUCTION SHOWCASE
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.3px', margin: 0 }}>
              My Developed Projects ({userProjects.length})
            </h2>
            <p className="text-muted" style={{ fontSize: '0.86rem', margin: '2px 0 0 0' }}>
              Custom software solutions built by {currentUser.firstName || 'you'}, verified by AI architecture audits.
            </p>
          </div>

          <button 
            onClick={() => handleOpenSubmit()}
            className="btn btn-secondary flex items-center gap-xs"
            style={{ fontSize: '0.82rem', padding: '8px 16px', width: 'auto' }}
          >
            <Plus size={15} /> Add Developed Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {userProjects.map((proj) => (
            <div 
              key={proj.id}
              className="glass-panel flex flex-col justify-between"
              style={{
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                background: 'var(--card-bg)'
              }}
            >
              <div>
                <div className="flex justify-between items-start mb-sm">
                  <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)', padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700 }}>
                    ● {proj.status}
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.74rem' }}>{proj.date}</span>
                </div>

                <h3 style={{ fontSize: '1.12rem', fontWeight: 700, marginBottom: '6px' }}>{proj.title}</h3>
                <p className="text-muted" style={{ fontSize: '0.84rem', lineHeight: 1.55, marginBottom: '12px' }}>
                  {proj.desc}
                </p>

                <div className="flex flex-wrap gap-xs mb-md">
                  {proj.tags.map((t, idx) => (
                    <span key={idx} className="badge" style={{ background: 'var(--input-bg)', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-sm" style={{ borderTop: '1px solid var(--border-color)' }}>
                <span className="text-muted flex items-center gap-xs" style={{ fontSize: '0.76rem' }}>
                  <Star size={13} className="text-warning fill-warning" /> {proj.stars} GitHub Stars
                </span>

                <div className="flex items-center gap-xs">
                  {proj.repoUrl && (
                    <button 
                      onClick={() => window.open(proj.repoUrl, '_blank')}
                      className="btn-icon-tactile"
                      title="GitHub Repository"
                      style={{ padding: '6px', borderRadius: '8px' }}
                    >
                      <GitBranch size={15} />
                    </button>
                  )}
                  {proj.demoUrl && (
                    <button 
                      onClick={() => window.open(proj.demoUrl, '_blank')}
                      className="btn btn-primary flex items-center gap-xs"
                      style={{ padding: '5px 12px', fontSize: '0.76rem', width: 'auto' }}
                    >
                      <span>Live Demo</span>
                      <ExternalLink size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 2: REFERENCE BLUEPRINTS ── */}
      <section className="flex flex-col gap-lg mt-md">
        <div>
          <div className="flex items-center gap-xs text-primary font-600 mb-xs" style={{ fontSize: '0.8rem' }}>
            <FolderKanban size={14} /> PRODUCTION BLUEPRINTS TO STUDY & CLONE
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.3px', margin: 0 }}>
            Enterprise Reference Projects
          </h2>
          <p className="text-muted" style={{ fontSize: '0.86rem', margin: '2px 0 0 0' }}>
            Inspect production architecture diagrams, technical specifications, and clone as reference for your builds.
          </p>
        </div>

        {referenceCategories.map((cat) => {
          const CatIcon = cat.icon;
          return (
            <div key={cat.label} className="flex flex-col gap-md">
              <div className="flex items-center gap-xs">
                <div style={{ width: 28, height: 28, borderRadius: '8px', background: `rgba(${cat.rgb}, 0.12)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: cat.color }}>
                  <CatIcon size={16} />
                </div>
                <h3 style={{ fontSize: '1.08rem', fontWeight: 700 }}>{cat.label}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
                {cat.projects.map((proj) => {
                  const diff = difficultyConfig[proj.difficulty];
                  return (
                    <div 
                      key={proj.id}
                      className="glass-panel interactive flex flex-col justify-between"
                      style={{
                        padding: '20px',
                        borderRadius: '16px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--card-bg)'
                      }}
                    >
                      <div>
                        <div className="flex justify-between items-center mb-xs">
                          <span className="badge" style={{ background: diff.bg, color: diff.color, fontSize: '0.72rem', fontWeight: 700 }}>
                            ● {proj.difficulty}
                          </span>
                          <span className="text-muted" style={{ fontSize: '0.74rem' }}>{proj.duration}</span>
                        </div>

                        <h4 style={{ fontSize: '1.02rem', fontWeight: 700, margin: '6px 0' }}>{proj.title}</h4>
                        <p className="text-muted" style={{ fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '12px' }}>
                          {proj.desc}
                        </p>

                        <div className="flex flex-wrap gap-xs mb-sm">
                          {proj.tags.map((t, idx) => (
                            <span key={idx} className="badge" style={{ background: 'var(--input-bg)', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-sm mt-xs" style={{ borderTop: '1px solid var(--border-color)' }}>
                        <span className="text-muted" style={{ fontSize: '0.76rem' }}>
                          {proj.enrolled.toLocaleString()} engineers referenced
                        </span>

                        <button 
                          onClick={() => setSelectedReference(proj)}
                          className="btn btn-primary flex items-center gap-xs"
                          style={{ padding: '6px 14px', fontSize: '0.78rem', width: 'auto' }}
                        >
                          <Eye size={13} />
                          <span>Use as Reference</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* ── MODAL 1: REFERENCE BLUEPRINT DETAILS ── */}
      {selectedReference && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-md animate-fade-in"
          style={{ background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)' }}
          onClick={() => setSelectedReference(null)}
        >
          <div 
            className="glass-panel flex flex-col gap-md max-w-xl w-full animate-scale-up"
            style={{ padding: '2rem', background: 'var(--bg-card)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-sm" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <span className="badge font-700 text-primary mb-xs" style={{ background: 'rgba(99, 102, 241, 0.12)', fontSize: '0.72rem' }}>
                  REFERENCE SPECIFICATION BLUEPRINT
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedReference.title}</h3>
              </div>
              <button 
                className="btn-icon-tactile" 
                onClick={() => setSelectedReference(null)}
                style={{ borderRadius: '50%', padding: '6px' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-md py-xs">
              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Architecture Blueprint Pattern</label>
                <div className="glass-panel p-sm text-main" style={{ background: 'var(--input-bg)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  {selectedReference.architecture}
                </div>
              </div>

              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Recommended Step-by-Step Milestones</label>
                <div className="flex flex-col gap-xs">
                  {selectedReference.milestones.map((m, i) => (
                    <div key={i} className="flex items-center gap-xs text-muted" style={{ fontSize: '0.82rem' }}>
                      <CheckCircle2 size={14} className="text-primary shrink-0" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Target Tech Stack</label>
                <div className="flex flex-wrap gap-xs">
                  {selectedReference.tags.map((tag, i) => (
                    <span key={i} className="badge" style={{ background: 'var(--input-bg)', color: 'var(--text-main)', fontSize: '0.76rem', padding: '4px 10px' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-sm pt-sm" style={{ borderTop: '1px solid var(--border-color)' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setSelectedReference(null)}
                style={{ width: 'auto', padding: '8px 16px', fontSize: '0.84rem' }}
              >
                Close
              </button>
              <button 
                type="button" 
                className="btn btn-primary flex items-center gap-xs"
                onClick={() => handleOpenSubmit(selectedReference.title)}
                style={{ width: 'auto', padding: '8px 20px', fontSize: '0.84rem' }}
              >
                <Plus size={15} /> Build My Version of This
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: SUBMIT DEVELOPED PROJECT ── */}
      {showSubmitModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-md animate-fade-in"
          style={{ background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)' }}
          onClick={() => setShowSubmitModal(false)}
        >
          <div 
            className="glass-panel flex flex-col gap-md max-w-lg w-full animate-scale-up"
            style={{ padding: '2rem', background: 'var(--bg-card)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-sm" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <span className="badge text-success font-700 mb-xs" style={{ background: 'rgba(16, 185, 129, 0.12)', fontSize: '0.72rem' }}>
                  SHOWCASE YOUR WORK
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Submit Your Developed Project</h3>
              </div>
              <button 
                className="btn-icon-tactile" 
                onClick={() => setShowSubmitModal(false)}
                style={{ borderRadius: '50%', padding: '6px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitProject} className="flex flex-col gap-md py-xs">
              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Project Title *</label>
                <input 
                  type="text" 
                  required
                  className="input-field" 
                  placeholder="e.g. Distributed WebSocket Notification Protocol"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  style={{ fontSize: '0.84rem' }}
                />
              </div>

              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Description & Architecture Summary *</label>
                <textarea 
                  rows={3}
                  required
                  className="input-field" 
                  placeholder="Describe your technical implementation, concurrency handling, database choices, and key accomplishments..."
                  value={newProject.desc}
                  onChange={(e) => setNewProject({ ...newProject, desc: e.target.value })}
                  style={{ fontSize: '0.84rem', resize: 'vertical' }}
                />
              </div>

              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Tech Stack (Comma-separated)</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="React 19, TypeScript, Node.js, Redis, Docker"
                  value={newProject.tags}
                  onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                  style={{ fontSize: '0.84rem' }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
                <div>
                  <label className="input-label" style={{ fontSize: '0.8rem' }}>Live Demo URL</label>
                  <input 
                    type="url" 
                    className="input-field" 
                    placeholder="https://yourproject.com"
                    value={newProject.demoUrl}
                    onChange={(e) => setNewProject({ ...newProject, demoUrl: e.target.value })}
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label className="input-label" style={{ fontSize: '0.8rem' }}>GitHub Repository</label>
                  <input 
                    type="url" 
                    className="input-field" 
                    placeholder="https://github.com/handle/repo"
                    value={newProject.repoUrl}
                    onChange={(e) => setNewProject({ ...newProject, repoUrl: e.target.value })}
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-sm pt-sm" style={{ borderTop: '1px solid var(--border-color)' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowSubmitModal(false)}
                  style={{ width: 'auto', padding: '8px 16px', fontSize: '0.84rem' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary flex items-center gap-xs"
                  style={{ width: 'auto', padding: '8px 22px', fontSize: '0.84rem' }}
                >
                  <Send size={14} /> Publish to Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
