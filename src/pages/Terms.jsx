import { useNavigate, Link } from 'react-router-dom';
import { Shield, FileText, CheckCircle2, ArrowLeft, ArrowRight, Lock, Scale, AlertCircle, Sparkles } from 'lucide-react';
import { NexoraIcon } from '../components/brand/NexoraLogo';

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in flex flex-col gap-xl max-w-5xl mx-auto pb-2xl px-4 sm:px-6">
      
      {/* ── Top Navigation / Breadcrumb ── */}
      <div className="pt-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-main transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>
        <span className="text-xs font-mono text-muted">
          LEGAL SPECIFICATION · REVISION 2026.1
        </span>
      </div>

      {/* ── Header Banner ── */}
      <div 
        className="glass-panel p-8 sm:p-12 flex flex-col items-center text-center relative overflow-hidden"
        style={{
          borderRadius: 'var(--radius-xl)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
        }}
      >
        <div className="flex items-center justify-center mb-4">
          <NexoraIcon size={56} withGlow />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-3" style={{ background: 'rgba(99, 102, 241, 0.12)', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
          <Scale size={13} />
          <span>NEXORA Legal Governance</span>
        </div>

        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '6px 0 12px 0', letterSpacing: '-0.8px' }}>
          Terms of Service
        </h1>

        <p className="text-muted max-w-2xl mx-auto" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
          Please review the operating terms, ethical guidelines, and platform conditions governing your use of NEXORA Career Intelligence Systems.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-muted">
          <span>Effective Date: January 1, 2026</span>
          <span>•</span>
          <span>Last Updated: September 2026</span>
          <span>•</span>
          <span>Global Jurisdiction</span>
        </div>
      </div>

      {/* ── Terms Content Sections ── */}
      <div className="flex flex-col gap-6">

        {/* Section 1 */}
        <div className="glass-panel p-6 sm:p-8" style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)' }}>
              <CheckCircle2 size={18} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>1. Acceptance of Terms</h2>
          </div>
          <p className="text-muted text-sm leading-relaxed mb-3">
            By accessing or creating an account on the NEXORA platform ("Service"), you certify that you are at least 16 years of age and agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, you must not access or utilize the Service.
          </p>
          <p className="text-muted text-sm leading-relaxed">
            Your continued engagement with NEXORA roadmaps, code sandboxes, mock interview simulations, or resume diagnostics constitutes binding acceptance of any future updates or modifications to these Terms.
          </p>
        </div>

        {/* Section 2 */}
        <div className="glass-panel p-6 sm:p-8" style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
              <Shield size={18} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>2. AI Mentorship & Algorithmic Trajectory Advice</h2>
          </div>
          <p className="text-muted text-sm leading-relaxed mb-3">
            NEXORA utilizes state-of-the-art neural heuristics and machine learning algorithms to generate customized curriculum milestones, skill gap assessments, and interview coaching telemetry.
          </p>
          <p className="text-muted text-sm leading-relaxed">
            While our models are calibrated against current industry standards and technical benchmarks, AI recommendations are designed as supportive career enhancement tools. NEXORA does not guarantee specific employment offers, compensation packages, or academic admissions.
          </p>
        </div>

        {/* Section 3 */}
        <div className="glass-panel p-6 sm:p-8" style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)' }}>
              <Lock size={18} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>3. Account Security & Session Integrity</h2>
          </div>
          <p className="text-muted text-sm leading-relaxed mb-3">
            You are responsible for maintaining the confidentiality of your credentials, one-time security passcodes (OTP), and two-factor authentication credentials. You agree to immediately notify NEXORA of any unauthorized access or breach of security.
          </p>
          <p className="text-muted text-sm leading-relaxed">
            Sharing accounts across multiple candidates or orchestrating automated reverse-engineering of interview question banks is strictly prohibited and subject to immediate account termination.
          </p>
        </div>

        {/* Section 4 */}
        <div className="glass-panel p-6 sm:p-8" style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--secondary)' }}>
              <AlertCircle size={18} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>4. Academic Integrity & Fair Sandbox Usage</h2>
          </div>
          <p className="text-muted text-sm leading-relaxed mb-3">
            Engineering workstations and cloud code execution sandboxes are provided solely for curriculum mastery, skill verification, and technical interview preparation.
          </p>
          <p className="text-muted text-sm leading-relaxed">
            Users agree not to deploy malicious payloads, crypto-mining routines, denial-of-service tests, or scraping bots targeting NEXORA or peer infrastructure.
          </p>
        </div>

        {/* Section 5 */}
        <div className="glass-panel p-6 sm:p-8" style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)' }}>
              <FileText size={18} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>5. Intellectual Property & Candidate Data</h2>
          </div>
          <p className="text-muted text-sm leading-relaxed mb-3">
            Candidates retain full ownership of the original code, essays, and resume materials authored within NEXORA. All platform designs, interactive curricula, proprietary scoring metrics, and algorithms remain the exclusive intellectual property of NEXORA Systems Inc.
          </p>
          <p className="text-muted text-sm leading-relaxed">
            For details regarding candidate data retention, anonymized model training, and privacy rights, please refer to our <Link to="/settings/privacy" className="text-primary hover:underline font-semibold">Privacy Policy</Link>.
          </p>
        </div>

      </div>

      {/* ── Footer Action ── */}
      <div 
        className="glass-panel p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2" 
        style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', background: 'var(--input-bg)' }}
      >
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 4px 0' }}>Ready to calibrate your trajectory?</h3>
          <p className="text-muted text-xs sm:text-sm m-0">Return to your workstation or launch your free career trajectory audit.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link to="/signup" className="btn btn-secondary text-xs sm:text-sm px-4 py-2 flex-1 sm:flex-none text-center">
            Sign Up
          </Link>
          <Link to="/dashboard" className="btn btn-primary text-xs sm:text-sm px-4 py-2 flex-1 sm:flex-none flex items-center justify-center gap-2">
            <span>Workspace</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

    </div>
  );
}
