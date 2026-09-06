import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, CheckCircle2, Sparkles, 
  ExternalLink, Layers, ShieldAlert, Zap, X 
} from 'lucide-react';
import db from '../services/db';

export default function SkillGap() {
  const navigate = useNavigate();
  const currentUser = db.getCurrentUser() || {};

  const roles = [
    'Full-Stack Developer',
    'AI & Data Scientist',
    'Cloud & DevOps Engineer',
    'Cybersecurity Analyst',
    'UI/UX Product Designer'
  ];

  const [selectedRole, setSelectedRole] = useState(currentUser.dreamJob || 'Full-Stack Developer');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSkillModal, setActiveSkillModal] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const skillDataByRole = {
    'Full-Stack Developer': [
      { 
        name: 'TypeScript & Modern React', 
        current: 85, 
        required: 90, 
        status: 'good',
        category: 'Frontend',
        gap: '5%',
        resource: { title: 'Advanced React Patterns & TypeScript Concurrency', type: 'Course', duration: '4h 30m', link: '/resources' }
      },
      { 
        name: 'Node.js & Microservices Architecture', 
        current: 68, 
        required: 85, 
        status: 'gap',
        category: 'Backend',
        gap: '17%',
        resource: { title: 'Distributed Systems & Event-Driven Node.js', type: 'Lab Project', duration: '6h', link: '/projects' }
      },
      { 
        name: 'PostgreSQL Indexing & Optimization', 
        current: 60, 
        required: 80, 
        status: 'gap',
        category: 'Database',
        gap: '20%',
        resource: { title: 'High-Performance SQL & Query Planner Tuning', type: 'Interactive Guide', duration: '3h', link: '/resources' }
      },
      { 
        name: 'Docker & Kubernetes Orchestration', 
        current: 35, 
        required: 75, 
        status: 'critical',
        category: 'DevOps',
        gap: '40%',
        resource: { title: 'Production Containerization & K8s Pod Architecture', type: 'Hands-on Lab', duration: '8h', link: '/projects' }
      },
      { 
        name: 'System Design & High Availability', 
        current: 50, 
        required: 85, 
        status: 'critical',
        category: 'Architecture',
        gap: '35%',
        resource: { title: 'Scalable Systems: Caching, Sharding & Load Balancing', type: 'Masterclass', duration: '5h', link: '/resources' }
      },
      { 
        name: 'Git Version Control & CI/CD', 
        current: 92, 
        required: 80, 
        status: 'excellent',
        category: 'Tools',
        gap: '0%',
        resource: { title: 'Enterprise GitHub Actions Automation', type: 'Article', duration: '1h', link: '/resources' }
      }
    ],
    'AI & Data Scientist': [
      { 
        name: 'Python & Scientific Computing (NumPy/Pandas)', 
        current: 90, 
        required: 90, 
        status: 'excellent',
        category: 'Core',
        gap: '0%',
        resource: { title: 'Vectorized Operations & High-Throughput Pandas', type: 'Course', duration: '3h', link: '/resources' }
      },
      { 
        name: 'Machine Learning Pipelines (Scikit-Learn)', 
        current: 72, 
        required: 85, 
        status: 'gap',
        category: 'ML',
        gap: '13%',
        resource: { title: 'End-to-End Feature Engineering & Validation', type: 'Lab Project', duration: '5h', link: '/projects' }
      },
      { 
        name: 'Deep Learning & Neural Networks (PyTorch)', 
        current: 40, 
        required: 80, 
        status: 'critical',
        category: 'Deep Learning',
        gap: '40%',
        resource: { title: 'PyTorch Architecture & GPU Model Training', type: 'Masterclass', duration: '10h', link: '/resources' }
      },
      { 
        name: 'MLOps & Model Serving (Docker/FastAPI)', 
        current: 30, 
        required: 75, 
        status: 'critical',
        category: 'Deployment',
        gap: '45%',
        resource: { title: 'Serving Models with Low-Latency REST APIs', type: 'Hands-on Lab', duration: '6h', link: '/projects' }
      },
      { 
        name: 'SQL & BigQuery Data Warehousing', 
        current: 82, 
        required: 80, 
        status: 'excellent',
        category: 'Data',
        gap: '0%',
        resource: { title: 'BigQuery Partitioning & Analytical Window Functions', type: 'Guide', duration: '2h', link: '/resources' }
      },
      { 
        name: 'Statistical Hypothesis Testing & A/B Experiments', 
        current: 65, 
        required: 85, 
        status: 'gap',
        category: 'Statistics',
        gap: '20%',
        resource: { title: 'Rigorous A/B Testing & Sample Power Calculation', type: 'Course', duration: '4h', link: '/resources' }
      }
    ],
    'Cloud & DevOps Engineer': [
      { 
        name: 'Linux Shell & Systems Administration', 
        current: 85, 
        required: 85, 
        status: 'excellent',
        category: 'OS',
        gap: '0%',
        resource: { title: 'Linux Kernel Tuning & Systemd Daemons', type: 'Guide', duration: '3h', link: '/resources' }
      },
      { 
        name: 'Infrastructure as Code (Terraform)', 
        current: 55, 
        required: 85, 
        status: 'critical',
        category: 'IaC',
        gap: '30%',
        resource: { title: 'Multi-Cloud Terraform State Management', type: 'Hands-on Lab', duration: '7h', link: '/projects' }
      },
      { 
        name: 'Kubernetes Cluster Administration', 
        current: 45, 
        required: 80, 
        status: 'critical',
        category: 'Containers',
        gap: '35%',
        resource: { title: 'K8s Ingress, Helm & Zero-Downtime Rollouts', type: 'Course', duration: '9h', link: '/resources' }
      },
      { 
        name: 'CI/CD Automation Pipelines', 
        current: 78, 
        required: 85, 
        status: 'gap',
        category: 'Automation',
        gap: '7%',
        resource: { title: 'Secure Enterprise GitHub Actions & ArgoCD', type: 'Lab Project', duration: '4h', link: '/projects' }
      }
    ],
    'Cybersecurity Analyst': [
      { 
        name: 'Network Protocols & Packet Analysis (Wireshark)', 
        current: 82, 
        required: 85, 
        status: 'good',
        category: 'Networking',
        gap: '3%',
        resource: { title: 'Deep Packet Inspection & Anomalous Traffic Detection', type: 'Guide', duration: '3h', link: '/resources' }
      },
      { 
        name: 'Vulnerability Assessment & Penetration Testing', 
        current: 48, 
        required: 85, 
        status: 'critical',
        category: 'Offensive Security',
        gap: '37%',
        resource: { title: 'OWASP Top 10 Exploits & Remediation Strategies', type: 'Hands-on Lab', duration: '8h', link: '/projects' }
      },
      { 
        name: 'SIEM & Threat Intelligence (Splunk/ELK)', 
        current: 50, 
        required: 80, 
        status: 'critical',
        category: 'SOC',
        gap: '30%',
        resource: { title: 'Configuring SIEM Dashboards & Correlation Rules', type: 'Course', duration: '6h', link: '/resources' }
      }
    ],
    'UI/UX Product Designer': [
      { 
        name: 'Figma Auto-Layout & Design Systems', 
        current: 90, 
        required: 85, 
        status: 'excellent',
        category: 'UI',
        gap: '0%',
        resource: { title: 'Enterprise Tokenized Design Systems in Figma', type: 'Masterclass', duration: '4h', link: '/resources' }
      },
      { 
        name: 'User Research & Usability Benchmarking', 
        current: 62, 
        required: 80, 
        status: 'gap',
        category: 'UX',
        gap: '18%',
        resource: { title: 'Quantitative UX Metrics & Heatmap Analysis', type: 'Course', duration: '3h', link: '/resources' }
      },
      { 
        name: 'WCAG 2.1 Accessibility & Design Tokens', 
        current: 40, 
        required: 80, 
        status: 'critical',
        category: 'a11y',
        gap: '40%',
        resource: { title: 'Inclusive UI & Color Contrast Engineering', type: 'Hands-on Lab', duration: '4h', link: '/projects' }
      }
    ]
  };

  const currentSkills = skillDataByRole[selectedRole] || skillDataByRole['Full-Stack Developer'];

  const filteredSkills = currentSkills.filter(s => {
    if (activeFilter === 'critical') return s.status === 'critical';
    if (activeFilter === 'gap') return s.status === 'gap';
    if (activeFilter === 'good') return s.status === 'good' || s.status === 'excellent';
    return true;
  });

  // Calculate Readiness Index
  const totalRequired = currentSkills.reduce((acc, s) => acc + s.required, 0);
  const totalCurrent = currentSkills.reduce((acc, s) => acc + s.current, 0);
  const readinessScore = Math.round((totalCurrent / totalRequired) * 100);
  const criticalCount = currentSkills.filter(s => s.status === 'critical').length;

  const handleBridgeGap = (skill) => {
    setActiveSkillModal(skill);
  };

  const handleAddToRoadmap = (skill) => {
    triggerToast(`Added "${skill.name}" accelerated module to your active roadmap!`);
    setActiveSkillModal(null);
  };

  return (
    <div className="animate-fade-in flex flex-col gap-lg" style={{ paddingBottom: '5rem' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          className="glass-panel animate-slide-up"
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            background: 'rgba(16, 185, 129, 0.95)',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 600,
            fontSize: '0.85rem'
          }}
        >
          <Sparkles size={16} /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
        <div>
          <div className="flex items-center gap-xs text-secondary font-600 mb-xs" style={{ fontSize: '0.82rem', letterSpacing: '0.05em' }}>
            <TrendingUp size={15} /> REAL-TIME CAREER TELEMETRY
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
            Skill Gap & Industry Readiness Matrix
          </h1>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            Dynamic comparative benchmarks against Fortune 500 candidate requirements.
          </p>
        </div>

        {/* Dynamic Role Switcher */}
        <div className="flex items-center gap-sm glass-panel" style={{ padding: '6px 14px', borderRadius: 'var(--radius-full)' }}>
          <Layers size={16} className="text-primary" />
          <span className="text-muted" style={{ fontSize: '0.82rem' }}>Role Track:</span>
          <select 
            className="input-field" 
            style={{ background: 'transparent', border: 'none', fontWeight: 600, fontSize: '0.86rem', padding: '2px 6px', cursor: 'pointer' }}
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            {roles.map((r, i) => (
              <option key={i} value={r} style={{ background: 'var(--bg-card)' }}>{r}</option>
            ))}
          </select>
        </div>
      </header>

      {/* High-Impact Telemetry Overview Banner */}
      <div 
        className="glass-panel flex flex-col md:flex-row justify-between items-start md:items-center gap-lg"
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(6, 182, 212, 0.05))',
          border: '1px solid rgba(99, 102, 241, 0.25)'
        }}
      >
        <div className="flex flex-col gap-xs">
          <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600, width: 'fit-content' }}>
            MNC Hiring Benchmark: {selectedRole}
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            {readinessScore}% Overall Career Readiness
          </h2>
          <p className="text-muted" style={{ fontSize: '0.88rem', maxWidth: '560px' }}>
            You possess strong foundational strengths. Closing the <strong>{criticalCount} critical skill gaps</strong> below will elevate you into the top 10% candidate pool.
          </p>
        </div>

        {/* Readiness Dial */}
        <div className="flex items-center gap-lg">
          <div 
            style={{
              width: 95,
              height: 95,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)'
            }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{readinessScore}%</div>
            <div style={{ fontSize: '0.65rem', opacity: 0.85, fontWeight: 600 }}>MATCH</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-xs overflow-x-auto pb-xs">
        {[
          { key: 'all', label: `All Skills (${currentSkills.length})` },
          { key: 'critical', label: `Critical Gaps (${criticalCount})` },
          { key: 'gap', label: 'Moderate Gaps' },
          { key: 'good', label: 'Proficient & Mastered' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className="skeuo-pill"
            style={{
              padding: '6px 16px',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: activeFilter === tab.key ? 'var(--primary)' : 'var(--card-bg)',
              color: activeFilter === tab.key ? '#fff' : 'var(--text-muted)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Skills Benchmark Matrix */}
      <div className="flex flex-col gap-md">
        {filteredSkills.map((skill, index) => {
          const isCritical = skill.status === 'critical';
          const isGap = skill.status === 'gap';

          return (
            <div 
              key={index}
              className="glass-panel interactive flex flex-col gap-md"
              style={{
                padding: '1.25rem 1.5rem',
                borderLeft: `4px solid ${isCritical ? 'var(--secondary)' : isGap ? 'var(--warning)' : 'var(--success)'}`
              }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-sm">
                <div className="flex items-center gap-sm">
                  {isCritical && <ShieldAlert size={20} className="text-secondary shrink-0" />}
                  {isGap && <TrendingUp size={20} className="text-warning shrink-0" />}
                  {!isCritical && !isGap && <CheckCircle2 size={20} className="text-success shrink-0" />}
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{skill.name}</h3>
                    <span className="text-muted" style={{ fontSize: '0.78rem' }}>Category: {skill.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-md">
                  <div className="text-right">
                    <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                      <span style={{ color: isCritical ? 'var(--secondary)' : isGap ? 'var(--warning)' : 'var(--success)' }}>
                        {skill.current}%
                      </span>
                      <span className="text-muted"> / {skill.required}% Target</span>
                    </div>
                    <span className="text-muted" style={{ fontSize: '0.74rem' }}>
                      {isCritical ? `Deficit: -${skill.gap}` : isGap ? `Gap: -${skill.gap}` : 'Target Achieved ✓'}
                    </span>
                  </div>

                  {(isCritical || isGap) && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleBridgeGap(skill)}
                      style={{ width: 'auto', padding: '6px 14px', fontSize: '0.8rem' }}
                    >
                      <Zap size={14} /> Bridge Gap
                    </button>
                  )}
                </div>
              </div>

              {/* High-Precision Comparative Dual Progress Bar */}
              <div style={{ position: 'relative', width: '100%', height: 10, background: 'var(--input-bg)', borderRadius: 5, overflow: 'hidden' }}>
                {/* Target Requirement Marker */}
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: `${skill.required}%`,
                    background: 'rgba(255,255,255,0.08)',
                    borderRight: '2px dashed var(--text-muted)'
                  }}
                  title={`Target: ${skill.required}%`}
                />

                {/* User Current Level Bar */}
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: `${skill.current}%`,
                    background: isCritical 
                      ? 'linear-gradient(90deg, #f43f5e, #e11d48)' 
                      : isGap 
                        ? 'linear-gradient(90deg, #f59e0b, #d97706)' 
                        : 'linear-gradient(90deg, #10b981, #059669)',
                    borderRadius: 5,
                    transition: 'width 0.5s ease'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive "Bridge Gap" Resource Modal */}
      {activeSkillModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-md animate-fade-in"
          style={{ background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)' }}
          onClick={() => setActiveSkillModal(null)}
        >
          <div 
            className="glass-panel flex flex-col gap-md max-w-lg w-full animate-scale-up"
            style={{ padding: '2rem', background: 'var(--bg-card)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-sm" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <span className="text-secondary font-600" style={{ fontSize: '0.78rem' }}>RECOMMENDED ACTION PLAN</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Bridge Skill Gap: {activeSkillModal.name}</h3>
              </div>
              <button 
                className="btn-icon-tactile" 
                onClick={() => setActiveSkillModal(null)}
                style={{ borderRadius: '50%', padding: '6px' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-sm py-xs">
              <div className="flex justify-between items-center text-muted" style={{ fontSize: '0.84rem' }}>
                <span>Current Mastery: <strong>{activeSkillModal.current}%</strong></span>
                <span>MNC Target: <strong>{activeSkillModal.required}%</strong></span>
              </div>

              {/* Recommended Resource Card */}
              <div className="glass-panel p-md flex flex-col gap-xs mt-xs" style={{ background: 'var(--input-bg)' }}>
                <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', width: 'fit-content', fontSize: '0.75rem', fontWeight: 600 }}>
                  {activeSkillModal.resource.type} • {activeSkillModal.resource.duration}
                </span>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginTop: '4px' }}>
                  {activeSkillModal.resource.title}
                </h4>
                <p className="text-muted" style={{ fontSize: '0.82rem' }}>
                  Specifically designed to close your {activeSkillModal.gap} deficit and align with {selectedRole} interview requirements.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-sm pt-sm">
              <button 
                className="btn btn-secondary"
                onClick={() => navigate(activeSkillModal.resource.link)}
                style={{ width: 'auto', padding: '8px 16px', fontSize: '0.84rem' }}
              >
                <ExternalLink size={15} /> View Resource
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => handleAddToRoadmap(activeSkillModal)}
                style={{ width: 'auto', padding: '8px 18px', fontSize: '0.84rem' }}
              >
                <Sparkles size={15} /> Add to My Roadmap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
