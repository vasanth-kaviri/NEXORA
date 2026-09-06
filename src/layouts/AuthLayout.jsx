/**
 * AuthLayout
 *
 * Executive-grade split-screen layout for Login, Signup, OTP Verification, CompleteProfile, and ForgotPassword.
 * Designed to top-tier SaaS standards (Linear / Vercel):
 * - Clean, spacious left column with generous breathing room.
 * - Minimalist, elegant right-hand brand showcase with subtle glowing gradients and vector trajectory telemetry.
 * - Eliminated noisy terminal dots, fake server logs, and cluttered badges.
 */
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { NexoraIcon } from '../components/brand/NexoraLogo';

export default function AuthLayout({
  children,
  headline = "Architect Your Engineering Trajectory.",
  subtext = "Calibrated roadmaps, autonomous mock interviews, and deep systems engineering benchmarks.",
  badgeText = "NEXORA CAREER PLATFORM",
  badgeSub = "· Verified Curriculum",
  topLeftAction = null,
  maxWidth = '460px',
  customShowcase = null,
}) {
  return (
    <div 
      className="min-h-screen w-full relative flex flex-col justify-between items-center overflow-x-hidden selection:bg-primary selection:text-white" 
      style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}
    >
      {/* ── Ambient Mesh Grid & Atmospheric Glows ── */}
      <div 
        className="absolute inset-0 tech-grid-bg opacity-15 pointer-events-none" 
        style={{ maskImage: 'radial-gradient(ellipse at 50% 50%, black 35%, transparent 80%)' }}
      />
      <div 
        className="absolute pointer-events-none"
        style={{ 
          top: '-8%', 
          right: '8%', 
          width: 580, 
          height: 580, 
          borderRadius: '50%', 
          background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
          opacity: 0.65,
          filter: 'blur(30px)'
        }} 
      />
      <div 
        className="absolute pointer-events-none"
        style={{ 
          bottom: '-10%', 
          left: '5%', 
          width: 520, 
          height: 520, 
          borderRadius: '50%', 
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
          opacity: 0.75,
          filter: 'blur(40px)'
        }} 
      />

      {/* ── Top Navigation Header ── */}
      <header 
        className="w-full relative z-20 flex items-center justify-between" 
        style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 28px 12px 28px' }}
      >
        <div className="flex items-center gap-3">
          {topLeftAction ? (
            topLeftAction
          ) : (
            <Link 
              to="/" 
              className="flex items-center gap-2.5 cursor-pointer select-none group transition-opacity hover:opacity-90"
              title="Return to NEXORA Home"
            >
              <NexoraIcon size={34} withGlow interactive />
              <span className="font-extrabold text-base tracking-tight text-gradient">NEXORA</span>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-muted hidden sm:inline font-medium">
            Need assistance?{' '}
            <a href="mailto:support@nexora.ai" className="text-primary hover:underline font-semibold">
              support@nexora.ai
            </a>
          </span>
          <span className="minimal-badge hidden md:inline-flex" style={{ fontSize: '0.68rem', padding: '3px 10px' }}>
            ● Production Ready
          </span>
        </div>
      </header>

      {/* ── Main Auth Studio (Unified Master Deck) ── */}
      <main 
        className="w-full flex-1 flex items-center justify-center relative z-10" 
        style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px 32px 24px' }}
      >
        <div 
          className="w-full rounded-3xl overflow-hidden grid lg:grid-cols-12 relative shadow-2xl"
          style={{ 
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 24px 70px -12px rgba(0, 0, 0, 0.32), 0 0 0 1px var(--border-color)'
          }}
        >
          {/* ── LEFT PANE: Form Viewport ── */}
          <div 
            className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center w-full relative z-10"
            style={{ padding: 'clamp(32px, 5vw, 56px)' }}
          >
            <div 
              className="animate-fade-in w-full mx-auto"
              style={{ maxWidth }}
            >
              {children}
            </div>
          </div>

          {/* ── RIGHT PANE: Minimalist Linear-Grade Brand Showcase ── */}
          <div 
            className="hidden lg:flex lg:col-span-6 xl:col-span-5 flex-col justify-center relative z-10"
            style={{ 
              padding: 'clamp(32px, 5vw, 56px)',
              borderLeft: '1px solid var(--border-color)',
              background: 'linear-gradient(160deg, rgba(24, 24, 27, 0.6) 0%, rgba(12, 12, 16, 0.92) 100%)',
              color: '#f4f4f5'
            }}
          >
            <div className="w-full max-w-[440px] mx-auto">
              {customShowcase ? (
                customShowcase
              ) : (
                <div className="flex flex-col animate-fade-in text-left">
                  {/* Subtle Brand Tag */}
                  <div className="flex items-center gap-2 mb-4">
                    <span 
                      className="minimal-badge" 
                      style={{ 
                        color: '#a5b4fc', 
                        background: 'rgba(99, 102, 241, 0.12)', 
                        borderColor: 'rgba(99, 102, 241, 0.28)', 
                        padding: '3px 10px' 
                      }}
                    >
                      <Sparkles size={12} className="text-indigo-400" />
                      <span>{badgeText}</span>
                    </span>
                    <span style={{ color: 'rgba(244, 244, 245, 0.5)', fontSize: '0.75rem' }}>{badgeSub}</span>
                  </div>

                  {/* Headline */}
                  <h2 
                    style={{ 
                      fontSize: '1.95rem', 
                      fontWeight: 800, 
                      lineHeight: 1.28, 
                      letterSpacing: '-0.6px', 
                      marginBottom: '14px',
                      background: 'linear-gradient(135deg, #ffffff 40%, #a5b4fc 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {headline}
                  </h2>
                  <p style={{ color: 'rgba(244, 244, 245, 0.72)', fontSize: '0.92rem', lineHeight: 1.65, marginBottom: '28px' }}>
                    {subtext}
                  </p>

                  {/* Clean Vector Trajectory Visualization Card */}
                  <div 
                    className="rounded-2xl p-5 mb-5 flex flex-col justify-between" 
                    style={{ 
                      background: 'radial-gradient(ellipse at top left, rgba(99, 102, 241, 0.15) 0%, rgba(18, 18, 22, 0.75) 80%)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-2" style={{ color: 'rgba(244, 244, 245, 0.6)' }}>
                      <span style={{ letterSpacing: '0.6px' }}>VELOCITY TELEMETRY</span>
                      <span className="flex items-center gap-1.5 font-semibold" style={{ color: '#38bdf8' }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        CALIBRATED
                      </span>
                    </div>

                    <div className="my-3 py-1">
                      <svg viewBox="0 0 360 100" className="w-full h-auto overflow-visible" fill="none">
                        <defs>
                          <linearGradient id="curveGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                            <stop offset="60%" stopColor="#818cf8" stopOpacity="0.85" />
                            <stop offset="100%" stopColor="#38bdf8" stopOpacity="1" />
                          </linearGradient>
                          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <line x1="0" y1="80" x2="360" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                        <line x1="0" y1="45" x2="360" y2="45" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                        <path d="M 0 88 Q 130 84 210 44 T 360 10 L 360 100 L 0 100 Z" fill="url(#areaGradient)" />
                        <path d="M 0 88 Q 130 84 210 44 T 360 10" stroke="url(#curveGradient)" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="360" cy="10" r="4.5" fill="#38bdf8" />
                        <circle cx="210" cy="44" r="3.5" fill="#818cf8" />
                      </svg>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2.5" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', color: 'rgba(244, 244, 245, 0.6)' }}>
                      <span>Core Curriculum</span>
                      <span className="text-right font-semibold" style={{ color: '#ffffff' }}>Senior &amp; Staff Trajectory</span>
                    </div>
                  </div>

                  {/* Understated Authentic Testimonial Quote */}
                  <div 
                    className="p-4 rounded-xl text-left" 
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.03)', 
                      border: '1px solid rgba(255, 255, 255, 0.08)' 
                    }}
                  >
                    <p className="text-xs leading-relaxed mb-3 italic" style={{ color: 'rgba(244, 244, 245, 0.7)' }}>
                      "NEXORA replaces scattered tutorials with calibrated production systems engineering. The fastest path from code to impact."
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          AC
                        </div>
                        <div>
                          <p className="text-xs font-semibold m-0 leading-tight" style={{ color: '#ffffff' }}>Alex Chen</p>
                          <p className="text-[11px] m-0" style={{ color: 'rgba(244, 244, 245, 0.5)' }}>Distributed Systems Engineer</p>
                        </div>
                      </div>
                      <span className="minimal-badge text-[10px]" style={{ color: '#34d399', background: 'rgba(16, 185, 129, 0.12)', borderColor: 'rgba(16, 185, 129, 0.28)' }}>
                        94.6% Offer Rate
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
        style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 28px 24px 28px' }}
      >
        <span>© 2026 NEXORA Systems Inc. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <Link to="/settings/privacy" className="hover:text-main transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-main transition-colors">Terms of Service</Link>
          <span>•</span>
          <Link to="/about" className="hover:text-main transition-colors">Platform Architecture</Link>
        </div>
      </footer>
    </div>
  );
}
