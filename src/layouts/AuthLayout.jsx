/**
 * AuthLayout
 *
 * The split-screen layout shared by Login, Signup, and CompleteProfile.
 * Left column: form content (children)
 * Right column: decorative dark-gradient visual panel
 *
 * Props:
 *  - children   (ReactNode) — the form / left-column content
 *  - headline   (string)    — large heading text in the right panel
 *  - subtext    (string)    — supporting paragraph in the right panel
 *  - gradientDirection (string) — CSS gradient direction (default '135deg, #020617 0%, #1e1b4b 100%')
 *  - blobLeft   (string)    — radial gradient for the bottom-left decorative blob
 *  - blobRight  (string)    — radial gradient for the top-right decorative blob
 */
import { Sparkles, Terminal, CheckCircle2, Shield, Users, ArrowUpRight } from 'lucide-react';

export default function AuthLayout({
  children,
  headline = "Accelerate Your Career Trajectory.",
  subtext = "Calibrated roadmaps, interactive code sandboxes, and AI-driven FAANG mock interviews.",
}) {
  return (
    <div className="grid lg:grid-cols-12 min-h-screen w-full bg-main" style={{ background: 'var(--bg-main)' }}>
      {/* Left Column — Form (5 cols on large desktop, centered) */}
      <div 
        className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center w-full px-6 py-10 sm:px-12 sm:py-16"
        style={{ minHeight: '100vh' }}
      >
        <div
          className="animate-fade-in flex flex-col justify-center mx-auto w-full"
          style={{ maxWidth: '420px' }}
        >
          {children}
        </div>
      </div>

      {/* Right Column — Native Living Glass Studio Showcase (7 cols on desktop) */}
      <div
        className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative overflow-hidden items-center justify-center p-8 xl:p-14 w-full h-full"
        style={{ 
          background: 'var(--bg-card)', 
          borderLeft: '1px solid var(--border-color)',
          minHeight: '100vh'
        }}
      >
        {/* Subtle Tech Grid Pattern */}
        <div 
          className="absolute inset-0 tech-grid-bg opacity-30 pointer-events-none" 
          style={{ maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)' }}
        />

        {/* Ambient Subtle Accent Glow */}
        <div 
          className="absolute"
          style={{ 
            top: '20%', 
            right: '15%', 
            width: 400, 
            height: 400, 
            borderRadius: '50%', 
            background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} 
        />

        <div className="relative z-10 w-full" style={{ maxWidth: '520px' }}>
          {/* Platform Tag */}
          <div className="flex items-center gap-2 mb-4">
            <span className="minimal-badge" style={{ color: 'var(--minimal-indigo)', borderColor: 'rgba(99, 102, 241, 0.25)' }}>
              <Sparkles size={12} className="text-minimal-indigo" />
              <span>NEXORA CAREER PLATFORM</span>
            </span>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>· Verified Curriculum</span>
          </div>

          {/* Heading */}
          <h2 
            className="text-gradient"
            style={{ fontSize: '2.15rem', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.5px', marginBottom: '10px' }}
          >
            {headline}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '28px' }}>
            {subtext}
          </p>

          {/* Interactive Glass Terminal Card */}
          <div 
            className="glass-panel skeuo-convex" 
            style={{ 
              borderRadius: '16px', 
              padding: '20px', 
              background: 'var(--skeuo-surface-card)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 18px 40px rgba(0, 0, 0, 0.22)'
            }}
          >
            {/* Terminal Header */}
            <div className="flex justify-between items-center pb-3 mb-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div className="flex items-center gap-2">
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                <span className="text-muted font-mono" style={{ fontSize: '0.74rem', marginLeft: '6px' }}>
                  nexora://career-trajectory/v2.4
                </span>
              </div>
              <span className="minimal-badge font-mono" style={{ fontSize: '0.68rem', color: 'var(--minimal-emerald)' }}>
                ● ONLINE
              </span>
            </div>

            {/* Active Telemetry Row */}
            <div className="flex justify-between items-center p-3 rounded-lg mb-3" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
              <div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                  Active Trajectory
                </p>
                <p style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', margin: '2px 0 0 0' }}>
                  Full-Stack &amp; AI Systems Engineer
                </p>
              </div>
              <div className="text-right">
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                  Target Band
                </p>
                <p className="tabular-numbers font-bold text-minimal-emerald" style={{ fontSize: '0.92rem', margin: '2px 0 0 0' }}>
                  $125k – $185k
                </p>
              </div>
            </div>

            {/* Milestone Checkpoints */}
            <div className="flex flex-col gap-2 mb-4">
              {[
                { title: 'Core Systems & High-Concurrency APIs', xp: '+100 XP', done: true },
                { title: 'Vector Embeddings & Neural Search RAG', xp: '+120 XP', done: true },
                { title: 'FAANG Architecture & System Design Deep-Dive', xp: '+150 XP', done: false, active: true },
              ].map((m, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-2 px-3 rounded-md transition-all"
                  style={{ 
                    background: m.active ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                    border: m.active ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid transparent'
                  }}
                >
                  <div className="flex items-center gap-2">
                    {m.done ? (
                      <CheckCircle2 size={14} className="text-minimal-emerald" />
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

            {/* Alumni Social Proof */}
            <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=60',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=60',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=60'
                  ].map((src, i) => (
                    <img 
                      key={i} 
                      src={src} 
                      alt="Student" 
                      style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--bg-card)', objectFit: 'cover' }} 
                    />
                  ))}
                </div>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  Joined by <strong>14,850+ engineers</strong>
                </span>
              </div>
              <span className="minimal-badge" style={{ fontSize: '0.7rem', color: 'var(--minimal-indigo)' }}>
                94% Offer Rate
              </span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
