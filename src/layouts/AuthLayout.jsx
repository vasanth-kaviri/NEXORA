/**
 * AuthLayout
 *
 * Cohesive split-screen workstation layout for Login, Signup, OTP Verification, CompleteProfile, and ForgotPassword.
 * - Bounded max-w-7xl centered container to eliminate vast empty voids on wide screens.
 * - Seamless ambient cosmic background and soft gradient divider to unify the frames.
 * - Left column: Form content with comfortable width (max-w-[480px] to max-w-[560px]), eliminating far-left hugging.
 * - Right column: Dynamic tech studio showcase with real-time telemetry and student benchmarks.
 * - Top-left action support for dedicated navigation anchors (e.g., "Back to login").
 */
import { Sparkles, CheckCircle2, Shield, Users, ArrowUpRight } from 'lucide-react';

export default function AuthLayout({
  children,
  headline = "Accelerate Your Career Trajectory.",
  subtext = "Calibrated roadmaps, interactive code sandboxes, and AI-driven FAANG mock interviews.",
  badgeText = "NEXORA CAREER PLATFORM",
  badgeSub = "· Verified Curriculum",
  topLeftAction = null,
  maxWidth = '480px',
  customShowcase = null,
}) {
  return (
    <div 
      className="min-h-screen w-full relative flex flex-col justify-between items-center overflow-x-hidden selection:bg-primary selection:text-white" 
      style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}
    >
      {/* ── Ambient Mesh Grid & Atmospheric Glows ── */}
      <div 
        className="absolute inset-0 tech-grid-bg opacity-20 pointer-events-none" 
        style={{ maskImage: 'radial-gradient(ellipse at 50% 50%, black 40%, transparent 85%)' }}
      />
      <div 
        className="absolute pointer-events-none"
        style={{ 
          top: '-10%', 
          right: '5%', 
          width: 520, 
          height: 520, 
          borderRadius: '50%', 
          background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
          opacity: 0.85
        }} 
      />
      <div 
        className="absolute pointer-events-none"
        style={{ 
          bottom: '-10%', 
          left: '5%', 
          width: 480, 
          height: 480, 
          borderRadius: '50%', 
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
          opacity: 0.9
        }} 
      />

      {/* ── Top Navigation / Anchor Header ── */}
      <header 
        className="w-full relative z-20 flex items-center justify-between" 
        style={{ maxWidth: '1160px', margin: '0 auto', padding: '24px 24px 12px 24px' }}
      >
        <div className="flex items-center gap-3">
          {topLeftAction ? (
            topLeftAction
          ) : (
            <a 
              href="/" 
              className="flex items-center gap-2.5 cursor-pointer select-none group"
              title="Return to NEXORA Home"
            >
              <div 
                className="brand-logo-hex skeuo-convex p-2 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}
              >
                <Sparkles size={16} className="text-primary" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-gradient">NEXORA</span>
            </a>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-muted hidden sm:inline font-medium">
            Need assistance?{' '}
            <a href="mailto:support@nexora.ai" className="text-primary hover:underline font-semibold">
              support@nexora.ai
            </a>
          </span>
          <span className="minimal-badge hidden md:inline-flex" style={{ fontSize: '0.68rem', padding: '3px 9px' }}>
            ● 99.98% Operational
          </span>
        </div>
      </header>

      {/* ── Main Auth Studio (Unified Master Workstation Deck) ── */}
      <main 
        className="w-full flex-1 flex items-center justify-center relative z-10" 
        style={{ maxWidth: '1160px', margin: '0 auto', padding: '16px 24px 32px 24px' }}
      >
        <div 
          className="w-full rounded-3xl overflow-hidden grid lg:grid-cols-12 relative shadow-2xl"
          style={{ 
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 24px 64px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px var(--border-color)'
          }}
        >
          {/* ── LEFT PANE: User Credentials & Interactive Console ── */}
          <div 
            className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center w-full relative z-10"
            style={{ padding: 'clamp(22px, 4.5vw, 48px)' }}
          >
            <div 
              className="animate-fade-in w-full mx-auto"
              style={{ maxWidth }}
            >
              {children}
            </div>
          </div>

          {/* ── RIGHT PANE: Dynamic Living Telemetry Showcase ── */}
          <div 
            className="hidden lg:flex lg:col-span-6 xl:col-span-5 flex-col justify-center relative z-10"
            style={{ 
              padding: 'clamp(24px, 4.5vw, 48px)',
              borderLeft: '1px solid var(--border-color)',
              background: 'linear-gradient(145deg, var(--input-bg) 0%, var(--bg-card) 100%)'
            }}
          >
            <div className="w-full max-w-[460px] mx-auto">
              {customShowcase ? (
                customShowcase
              ) : (
                <div className="flex flex-col animate-fade-in">
                  {/* Platform Verification Tag */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="minimal-badge" style={{ color: 'var(--minimal-indigo)', borderColor: 'rgba(99, 102, 241, 0.25)' }}>
                      <Sparkles size={12} className="text-minimal-indigo" />
                      <span>{badgeText}</span>
                    </span>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>{badgeSub}</span>
                  </div>

                  {/* Showcase Headline */}
                  <h2 
                    className="text-gradient"
                    style={{ fontSize: '1.95rem', fontWeight: 800, lineHeight: 1.25, letterSpacing: '-0.5px', marginBottom: '12px' }}
                  >
                    {headline}
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '24px' }}>
                    {subtext}
                  </p>

                  {/* Interactive Terminal Showcase Card */}
                  <div 
                    className="glass-panel skeuo-convex" 
                    style={{ 
                      borderRadius: '18px', 
                      padding: '20px', 
                      background: 'var(--skeuo-surface-card)',
                      border: '1px solid var(--border-color)',
                      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    {/* Terminal Window Header */}
                    <div className="flex justify-between items-center pb-3 mb-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <div className="flex items-center gap-2">
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                        <span className="text-muted font-mono" style={{ fontSize: '0.74rem', marginLeft: '6px' }}>
                          nexora://workstation-node/v2.5
                        </span>
                      </div>
                      <span className="minimal-badge font-mono" style={{ fontSize: '0.68rem', color: 'var(--minimal-emerald)' }}>
                        ● ONLINE
                      </span>
                    </div>

                    {/* Telemetry Row */}
                    <div className="flex justify-between items-center p-3 rounded-xl mb-3" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
                      <div>
                        <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                          Active Trajectory
                        </p>
                        <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', margin: '2px 0 0 0' }}>
                          Full-Stack &amp; AI Systems Engineer
                        </p>
                      </div>
                      <div className="text-right">
                        <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                          Target Band
                        </p>
                        <p className="tabular-numbers font-bold text-minimal-emerald" style={{ fontSize: '0.9rem', margin: '2px 0 0 0' }}>
                          $125k – $185k
                        </p>
                      </div>
                    </div>

                    {/* Milestone Trackers */}
                    <div className="flex flex-col gap-2 mb-3.5">
                      {[
                        { title: 'Core Systems & High-Concurrency APIs', xp: '+100 XP', done: true },
                        { title: 'Vector Embeddings & Neural Search RAG', xp: '+120 XP', done: true },
                        { title: 'FAANG Architecture & System Design Deep-Dive', xp: '+150 XP', done: false, active: true },
                      ].map((m, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center justify-between p-2 px-3 rounded-lg transition-all"
                          style={{ 
                            background: m.active ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                            border: m.active ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid transparent'
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {m.done ? (
                              <CheckCircle2 size={15} className="text-minimal-emerald" />
                            ) : (
                              <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid var(--minimal-indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--minimal-indigo)' }} />
                              </div>
                            )}
                            <span style={{ fontSize: '0.82rem', fontWeight: m.active ? 700 : 500, color: m.active ? 'var(--text-main)' : 'var(--text-muted)' }}>
                              {m.title}
                            </span>
                          </div>
                          <span className="font-mono" style={{ fontSize: '0.72rem', color: m.done ? 'var(--minimal-emerald)' : 'var(--text-muted)', fontWeight: 600 }}>
                            {m.xp}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Social Proof & Trust Strip */}
                    <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {[
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=60',
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=60',
                            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=60'
                          ].map((src, i) => (
                            <img 
                              key={i} 
                              src={src} 
                              alt="Engineer" 
                              style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid var(--bg-card)', objectFit: 'cover' }} 
                            />
                          ))}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Joined by <strong>14,850+ engineers</strong>
                        </span>
                      </div>
                      <span className="minimal-badge" style={{ fontSize: '0.68rem', color: 'var(--minimal-indigo)' }}>
                        94% Offer Rate
                      </span>
                    </div>

                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* ── Subdued Minimal Footer ── */}
      <footer 
        className="w-full relative z-20 flex flex-col sm:flex-row items-center justify-between text-muted text-xs gap-2" 
        style={{ maxWidth: '1160px', margin: '0 auto', padding: '16px 24px' }}
      >
        <span>© 2026 NEXORA Systems Inc. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <a href="/settings/privacy" className="hover:text-main transition-colors">Privacy Policy</a>
          <span>•</span>
          <span className="cursor-pointer hover:text-main transition-colors" onClick={() => alert('NEXORA Terms of Service')}>Terms of Service</span>
          <span>•</span>
          <a href="/about" className="hover:text-main transition-colors">Platform Architecture</a>
        </div>
      </footer>
    </div>
  );
}
