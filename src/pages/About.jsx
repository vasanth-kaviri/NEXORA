import { 
  Compass, Video, FileText, Users, Shield, Award, Sparkles, 
  Cpu, Lock, Globe, ArrowRight, Bot, CheckCircle2, Heart 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in flex flex-col gap-xl max-w-7xl mx-auto pb-2xl">
      
      {/* ── HERO BANNER ── */}
      <div 
        className="glass-panel p-xl flex flex-col items-center text-center relative overflow-hidden"
        style={{
          borderRadius: 'var(--radius-xl)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          padding: '3rem 2rem'
        }}
      >
        <div 
          className="brand-logo-hex skeuo-convex mb-md"
          style={{
            width: 72,
            height: 72,
            borderRadius: 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            boxShadow: '0 8px 24px var(--primary-glow)'
          }}
        >
          <Sparkles size={36} className="text-white" />
        </div>

        <span 
          className="badge mb-sm"
          style={{ 
            background: 'rgba(99, 102, 241, 0.12)', 
            color: 'var(--primary)', 
            padding: '5px 16px', 
            borderRadius: 'var(--radius-full)', 
            fontSize: '0.78rem', 
            fontWeight: 700,
            letterSpacing: '0.8px'
          }}
        >
          PLATFORM ARCHITECTURE & ETHOS • v1.4.0
        </span>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '8px 0 12px 0', letterSpacing: '-0.8px' }}>
          Architecting the Future of Engineering Careers
        </h1>

        <p className="text-muted max-w-2xl mx-auto" style={{ fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
          NEXORA is an autonomous career intelligence operating system built to bridge the canyon between 
          academic curricula and high-stakes tech engineering standards. We empower ambitious engineers 
          with predictive roadmap guidance, proctored voice interviews, and deep ATS algorithmic diagnostics.
        </p>

        {/* Global Impact Telemetry */}
        <div 
          className="grid grid-cols-2 md:grid-cols-4 gap-md w-full max-w-4xl mt-xl pt-lg"
          style={{ borderTop: '1px solid var(--border-color)' }}
        >
          <div className="text-center p-sm skeuo-convex rounded-xl" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
            <span className="font-extrabold text-primary" style={{ fontSize: '1.9rem', display: 'block', lineHeight: 1.2 }}>120,000+</span>
            <span className="text-muted font-medium" style={{ fontSize: '0.78rem' }}>Active Engineers</span>
          </div>
          <div className="text-center p-sm skeuo-convex rounded-xl" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
            <span className="font-extrabold text-success" style={{ fontSize: '1.9rem', display: 'block', lineHeight: 1.2 }}>94.6%</span>
            <span className="text-muted font-medium" style={{ fontSize: '0.78rem' }}>Offer Match Rate</span>
          </div>
          <div className="text-center p-sm skeuo-convex rounded-xl" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
            <span className="font-extrabold text-warning" style={{ fontSize: '1.9rem', display: 'block', lineHeight: 1.2 }}>500+</span>
            <span className="text-muted font-medium" style={{ fontSize: '0.78rem' }}>MNC Hiring Partners</span>
          </div>
          <div className="text-center p-sm skeuo-convex rounded-xl" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
            <span className="font-extrabold text-accent" style={{ fontSize: '1.9rem', display: 'block', lineHeight: 1.2 }}>4.9 / 5.0</span>
            <span className="text-muted font-medium" style={{ fontSize: '0.78rem' }}>Candidate Trust Score</span>
          </div>
        </div>
      </div>

      {/* ── 4 CORE ARCHITECTURAL PILLARS ── */}
      <section className="flex flex-col gap-md">
        <div className="flex flex-col gap-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Core Foundation</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>The 4 Engineering Pillars</h2>
          <p className="text-muted text-sm" style={{ margin: 0 }}>
            Every capability in NEXORA is purpose-engineered to mirror high-performance engineering benchmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
          {/* Pillar 1 */}
          <div 
            className="glass-panel p-lg flex flex-col justify-between rounded-xl hover:translate-y-[-2px] transition-all"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <div>
              <div 
                style={{ 
                  width: 44, height: 44, borderRadius: 12, 
                  background: 'rgba(99, 102, 241, 0.14)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  color: 'var(--primary)', marginBottom: '14px' 
                }}
              >
                <Compass size={22} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 8px 0' }}>Adaptive Career Paths</h3>
              <p className="text-muted" style={{ fontSize: '0.82rem', lineHeight: 1.6, margin: 0 }}>
                Continuous algorithmic tracking that recalibrates milestones in real-time as industry frameworks, SDKs, and hiring expectations evolve.
              </p>
            </div>
            <div className="mt-md pt-sm flex items-center gap-xs text-xs font-semibold text-primary" style={{ borderTop: '1px solid var(--border-color)' }}>
              <CheckCircle2 size={14} /> Autonomous Skill Gap Mapping
            </div>
          </div>

          {/* Pillar 2 */}
          <div 
            className="glass-panel p-lg flex flex-col justify-between rounded-xl hover:translate-y-[-2px] transition-all"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <div>
              <div 
                style={{ 
                  width: 44, height: 44, borderRadius: 12, 
                  background: 'rgba(20, 184, 166, 0.14)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  color: '#14b8a6', marginBottom: '14px' 
                }}
              >
                <Video size={22} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 8px 0' }}>Proctored Voice AI Lab</h3>
              <p className="text-muted" style={{ fontSize: '0.82rem', lineHeight: 1.6, margin: 0 }}>
                Real-time camera presence, vocal cadence synthesis, and natural speech-to-text response processing powered by Fortune 500 interview rubrics.
              </p>
            </div>
            <div className="mt-md pt-sm flex items-center gap-xs text-xs font-semibold text-success" style={{ borderTop: '1px solid var(--border-color)' }}>
              <CheckCircle2 size={14} /> Live Gaze & Answer Telemetry
            </div>
          </div>

          {/* Pillar 3 */}
          <div 
            className="glass-panel p-lg flex flex-col justify-between rounded-xl hover:translate-y-[-2px] transition-all"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <div>
              <div 
                style={{ 
                  width: 44, height: 44, borderRadius: 12, 
                  background: 'rgba(244, 63, 94, 0.14)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  color: '#f43f5e', marginBottom: '14px' 
                }}
              >
                <FileText size={22} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 8px 0' }}>ATS Semantic Diagnostics</h3>
              <p className="text-muted" style={{ fontSize: '0.82rem', lineHeight: 1.6, margin: 0 }}>
                Multi-pass resume parser auditing keyword density, quantifiable impact metrics, and role alignment against live applicant tracking systems.
              </p>
            </div>
            <div className="mt-md pt-sm flex items-center gap-xs text-xs font-semibold text-error" style={{ borderTop: '1px solid var(--border-color)' }}>
              <CheckCircle2 size={14} /> High-Scoring Recruiter Match
            </div>
          </div>

          {/* Pillar 4 */}
          <div 
            className="glass-panel p-lg flex flex-col justify-between rounded-xl hover:translate-y-[-2px] transition-all"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <div>
              <div 
                style={{ 
                  width: 44, height: 44, borderRadius: 12, 
                  background: 'rgba(168, 85, 247, 0.14)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  color: '#a855f7', marginBottom: '14px' 
                }}
              >
                <Users size={22} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 8px 0' }}>Peer Nexus Workstations</h3>
              <p className="text-muted" style={{ fontSize: '0.82rem', lineHeight: 1.6, margin: 0 }}>
                High-concurrency collaborative hubs with live code pairing, automated testing testbeds, and team hackathon coordination chambers.
              </p>
            </div>
            <div className="mt-md pt-sm flex items-center gap-xs text-xs font-semibold text-accent" style={{ borderTop: '1px solid var(--border-color)' }}>
              <CheckCircle2 size={14} /> Real-Time Shared Workspaces
            </div>
          </div>
        </div>
      </section>

      {/* ── SECURITY & ETHICAL AI STANDARDS ── */}
      <section 
        className="glass-panel p-xl rounded-xl flex flex-col md:flex-row items-center justify-between gap-xl"
        style={{ 
          background: 'var(--bg-card)', 
          border: '1px solid var(--border-color)',
          padding: '2.5rem'
        }}
      >
        <div className="flex-1 flex flex-col gap-sm">
          <div className="flex items-center gap-xs text-primary font-bold text-xs uppercase tracking-wider">
            <Shield size={16} /> Privacy-First Architecture
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>
            Zero Biometric Storage. Total Data Ownership.
          </h2>
          <p className="text-muted text-sm" style={{ lineHeight: 1.7, margin: 0 }}>
            Candidate privacy is an uncompromising engineering axiom at NEXORA. During proctored voice interviews, 
            video feeds and voice streams are analyzed in volatile memory or local browser runtime. 
            No video recordings or biometric fingerprints are ever persisted to permanent databases without explicit candidate authorization.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm mt-xs">
            <div className="flex items-center gap-xs text-xs text-muted">
              <Lock size={14} className="text-success shrink-0" />
              <span>TLS 1.3 & AES-256 Data In Flight</span>
            </div>
            <div className="flex items-center gap-xs text-xs text-muted">
              <Cpu size={14} className="text-primary shrink-0" />
              <span>Edge-Accelerated Claude 3.5 Models</span>
            </div>
            <div className="flex items-center gap-xs text-xs text-muted">
              <Globe size={14} className="text-accent shrink-0" />
              <span>GDPR & CCPA Compliant Erasure</span>
            </div>
            <div className="flex items-center gap-xs text-xs text-muted">
              <Award size={14} className="text-warning shrink-0" />
              <span>SOC2 Type II Certified Cloud Vaults</span>
            </div>
          </div>
        </div>

        <div 
          className="skeuo-convex p-lg rounded-xl flex flex-col gap-sm max-w-sm w-full"
          style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted">SYSTEM STATUS</span>
            <span className="badge" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px' }}>
              ● 99.98% OPERATIONAL
            </span>
          </div>
          <div className="flex flex-col gap-xs text-xs">
            <div className="flex justify-between py-1 border-b border-[var(--border-color)]">
              <span className="text-muted">Interview AI Inference</span>
              <span className="font-semibold text-main">Sub-180ms</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--border-color)]">
              <span className="text-muted">ATS Parser Precision</span>
              <span className="font-semibold text-main">99.4% F1-Score</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--border-color)]">
              <span className="text-muted">Claude Reasoning Layer</span>
              <span className="font-semibold text-primary">Active</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted">Candidate Data Vault</span>
              <span className="font-semibold text-success">Encrypted</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION WORKSTATION ── */}
      <section 
        className="skeuo-convex p-xl rounded-xl flex flex-col md:flex-row items-center justify-between gap-lg"
        style={{ 
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(20, 184, 166, 0.08))', 
          border: '1px solid var(--border-color)',
          padding: '2.5rem'
        }}
      >
        <div className="flex flex-col gap-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Get Started Now</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Elevate Your Engineering Trajectory</h3>
          <p className="text-muted text-sm" style={{ margin: 0, maxWidth: 520 }}>
            Join thousands of software engineers who have upgraded their portfolios, aced system design rounds, and landed top tier offers with NEXORA.
          </p>
        </div>
        <div className="flex flex-wrap gap-sm">
          <button 
            onClick={() => navigate('/roadmap')} 
            className="btn btn-primary flex items-center gap-xs px-5 py-2.5 font-bold text-sm"
          >
            Explore Roadmaps <ArrowRight size={16} />
          </button>
          <button 
            onClick={() => navigate('/chatbot')} 
            className="btn glass-panel flex items-center gap-xs px-5 py-2.5 font-bold text-sm"
            style={{ border: '1px solid var(--border-color)' }}
          >
            <Bot size={16} className="text-primary" /> Launch AI Mentor
          </button>
        </div>
      </section>

      {/* ── FOOTER & POLICIES ── */}
      <footer className="text-center pt-md" style={{ borderTop: '1px solid var(--border-color)' }}>
        <p className="text-muted" style={{ fontSize: '0.85rem' }}>
          Crafted with <Heart size={14} className="text-error" style={{ display: 'inline', margin: '0 4px', verticalAlign: 'middle' }} /> for the global software engineering community.
        </p>
        <div className="flex justify-center gap-md mt-xs">
          <button 
            onClick={() => alert('NEXORA Terms of Service: By using NEXORA, you agree to respect academic integrity, collaborate constructively, and utilize AI career recommendations ethically.')} 
            className="text-primary interactive hover:underline" 
            style={{ fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Terms of Service
          </button>
          <span className="text-muted">•</span>
          <button 
            onClick={() => navigate('/settings/privacy')} 
            className="text-primary interactive hover:underline" 
            style={{ fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Privacy Policy
          </button>
          <span className="text-muted">•</span>
          <button 
            onClick={() => navigate('/dashboard#contact-feedback-section')} 
            className="text-primary interactive hover:underline" 
            style={{ fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Contact & Feedback
          </button>
        </div>
      </footer>

    </div>
  );
}
