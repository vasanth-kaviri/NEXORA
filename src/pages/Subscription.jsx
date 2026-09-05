import { Check, Sparkles, Shield, Zap, X, Star, Bot, FolderKanban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Subscription() {
  const navigate = useNavigate();

  const handlePayment = () => {
    alert('Payment Gateway Integration Pending (Backend Phase)');
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        minHeight: '100vh',
        padding: 'var(--space-xl) var(--space-lg) var(--space-2xl)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background tint */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background:
            'radial-gradient(ellipse at 20% 0%, rgba(139,92,246,0.07) 0%, transparent 60%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Close button */}
      <button
        onClick={() => navigate(-1)}
        className="interactive flex items-center justify-center"
        style={{
          position: 'absolute',
          top: 'var(--space-lg)',
          right: 'var(--space-lg)',
          background: 'var(--bg-card-glass)',
          border: '1px solid var(--border-color)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          zIndex: 10,
        }}
        aria-label="Close"
      >
        <X size={18} />
      </button>

      {/* Page content wrapper */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '860px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-xl)',
        }}
      >

        {/* Header */}
        <div className="text-center" style={{ maxWidth: '560px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.25)',
              borderRadius: '999px',
              padding: '5px 14px',
              fontSize: '0.8rem',
              fontWeight: '600',
              color: 'var(--primary)',
              marginBottom: 'var(--space-md)',
              letterSpacing: '0.3px',
            }}
          >
            <Sparkles size={13} /> Plans & Pricing
          </div>

          <h1
            style={{
              fontSize: '2.2rem',
              fontWeight: '800',
              letterSpacing: '-0.5px',
              marginBottom: 'var(--space-sm)',
              color: 'var(--text-main)',
              lineHeight: '1.2',
            }}
          >
            Choose the plan that{' '}
            <span className="text-gradient">works for you</span>
          </h1>

          <p
            className="text-muted"
            style={{ fontSize: '1rem', lineHeight: '1.65' }}
          >
            Unlock AI-powered tools and real-world projects to become
            industry-ready, faster.
          </p>
        </div>

        {/* Cards row */}
        <div className="sub-cards-row">

          {/* ── Free Plan ── */}
          <div
            className="glass-panel sub-card"
            style={{ border: '1px solid var(--border-color)' }}
          >
            {/* Plan header */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <p
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: 'var(--text-muted)',
                  marginBottom: '6px',
                }}
              >
                Basic
              </p>
              <h2
                style={{
                  fontSize: '1.6rem',
                  fontWeight: '800',
                  color: 'var(--text-main)',
                  lineHeight: 1,
                }}
              >
                Free
              </h2>
              <p
                className="text-muted"
                style={{ fontSize: '0.88rem', marginTop: '8px', lineHeight: '1.5' }}
              >
                Everything you need to get started on your career journey.
              </p>
            </div>

            {/* CTA */}
            <button
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.95rem',
                fontWeight: '600',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                background: 'transparent',
                color: 'var(--text-muted)',
                cursor: 'default',
                marginBottom: 'var(--space-xl)',
              }}
              disabled
            >
              Current Plan
            </button>

            {/* Features */}
            <div>
              <p
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: 'var(--text-muted)',
                  marginBottom: 'var(--space-md)',
                }}
              >
                What's included
              </p>
              <div className="sub-features-list">
                {[
                  'Personalised Career Roadmap',
                  'Basic Skill Gap Assessments',
                  'Free Learning Resources',
                  'Community Forums & Support',
                ].map((f) => (
                  <div key={f} className="flex items-start gap-sm">
                    <Check
                      size={16}
                      className="text-muted"
                      style={{ marginTop: '3px', flexShrink: 0 }}
                    />
                    <span
                      className="text-muted"
                      style={{ fontSize: '0.92rem', lineHeight: '1.4' }}
                    >
                      {f}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Pro Plan ── */}
          <div
            className="glass-panel sub-card"
            style={{ border: '1px solid var(--border-color)' }}
          >
            {/* Badge — inside card, in flow, no absolute */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(139,92,246,0.1)',
                border: '1px solid rgba(139,92,246,0.25)',
                borderRadius: '999px',
                padding: '4px 12px',
                fontSize: '0.72rem',
                fontWeight: '700',
                color: 'var(--primary)',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                marginBottom: '10px',
                width: 'fit-content',
              }}
            >
              <Star size={12} fill="currentColor" /> Most Popular
            </div>

            {/* Plan header */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <p
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: 'var(--primary)',
                  marginBottom: '6px',
                }}
              >
                NEXORA Pro
              </p>
              <div className="flex items-end gap-xs">
                <h2
                  style={{
                    fontSize: '1.6rem',
                    fontWeight: '800',
                    color: 'var(--text-main)',
                    lineHeight: 1,
                  }}
                >
                  ₹299
                </h2>
                <span
                  className="text-muted"
                  style={{ fontSize: '0.85rem', fontWeight: '500', marginBottom: '3px' }}
                >
                  / one-time
                </span>
              </div>
              <p
                className="text-muted"
                style={{ fontSize: '0.88rem', marginTop: '8px', lineHeight: '1.5' }}
              >
                For serious job seekers who want to stand out from the crowd.
              </p>
            </div>

            {/* CTA */}
            <button
              className="btn btn-primary interactive"
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '0.95rem',
                fontWeight: '700',
                borderRadius: '10px',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                marginBottom: 'var(--space-xl)',
              }}
              onClick={handlePayment}
            >
              <Zap size={17} /> Upgrade to Pro
            </button>

            {/* Divider */}
            <div
              style={{
                height: '1px',
                background: 'var(--border-color)',
                marginBottom: 'var(--space-lg)',
              }}
            />

            {/* Pro features */}
            <div>
              <p
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: 'var(--text-muted)',
                  marginBottom: 'var(--space-md)',
                }}
              >
                Everything in Basic, plus
              </p>
              <div className="sub-features-list">

                <div className="flex items-start gap-sm">
                  <div
                    style={{
                      background: 'rgba(139,92,246,0.12)',
                      borderRadius: '8px',
                      padding: '6px',
                      flexShrink: 0,
                      marginTop: '1px',
                    }}
                  >
                    <Bot size={15} className="text-primary" />
                  </div>
                  <div>
                    <span
                      style={{
                        fontWeight: '600',
                        fontSize: '0.92rem',
                        display: 'block',
                        color: 'var(--text-main)',
                        marginBottom: '2px',
                      }}
                    >
                      AI Mock Interviews
                    </span>
                    <span
                      className="text-muted"
                      style={{ fontSize: '0.84rem', lineHeight: '1.4', display: 'block' }}
                    >
                      Real-time analysis, smart questions &amp; detailed feedback.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-sm">
                  <div
                    style={{
                      background: 'rgba(16,185,129,0.12)',
                      borderRadius: '8px',
                      padding: '6px',
                      flexShrink: 0,
                      marginTop: '1px',
                    }}
                  >
                    <FolderKanban size={15} className="text-success" />
                  </div>
                  <div>
                    <span
                      style={{
                        fontWeight: '600',
                        fontSize: '0.92rem',
                        display: 'block',
                        color: 'var(--text-main)',
                        marginBottom: '2px',
                      }}
                    >
                      Real-world Projects
                    </span>
                    <span
                      className="text-muted"
                      style={{ fontSize: '0.84rem', lineHeight: '1.4', display: 'block' }}
                    >
                      Build a standout portfolio with premium guided projects.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-sm">
                  <div
                    style={{
                      background: 'rgba(245,158,11,0.12)',
                      borderRadius: '8px',
                      padding: '6px',
                      flexShrink: 0,
                      marginTop: '1px',
                    }}
                  >
                    <Star size={15} className="text-warning" />
                  </div>
                  <div>
                    <span
                      style={{
                        fontWeight: '600',
                        fontSize: '0.92rem',
                        display: 'block',
                        color: 'var(--text-main)',
                        marginBottom: '2px',
                      }}
                    >
                      Stand Out to Recruiters
                    </span>
                    <span
                      className="text-muted"
                      style={{ fontSize: '0.84rem', lineHeight: '1.4', display: 'block' }}
                    >
                      Priority visibility in our growing employer network.
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Trust footer */}
        <div
          className="flex items-center justify-center gap-sm text-muted"
          style={{ fontSize: '0.82rem', flexWrap: 'wrap', textAlign: 'center' }}
        >
          <Shield size={13} />
          <span>256-bit SSL encryption &nbsp;·&nbsp; One-time payment &nbsp;·&nbsp; No hidden charges</span>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .sub-cards-row {
          display: flex;
          flex-direction: row;
          gap: 20px;
          width: 100%;
          align-items: stretch;
        }
        .sub-card {
          flex: 1;
          padding: 28px 26px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
        }
        .sub-features-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        @media (max-width: 640px) {
          .sub-cards-row {
            flex-direction: column;
          }
        }
      `}} />

    </div>
  );
}
