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
export default function AuthLayout({
  children,
  headline,
  subtext,
  gradientDirection = '135deg, #020617 0%, #0f172a 50%, #1e1b4b 100%',
  blobRight = 'radial-gradient(circle at 70% 30%, rgba(99, 102, 241, 0.45) 0%, transparent 50%)',
  blobLeft  = 'radial-gradient(circle at 20% 80%, rgba(244, 63, 94, 0.4) 0%, transparent 50%)',
}) {
  return (
    <div className="grid lg:grid-cols-2 min-h-screen w-full">
      {/* Left Column — Form */}
      <div className="flex flex-col justify-center w-full" style={{ padding: 'var(--space-lg) var(--space-xl)' }}>
        <div
          className="animate-fade-in flex flex-col justify-center mx-auto"
          style={{ width: '100%', maxWidth: '400px' }}
        >
          {children}
        </div>
      </div>

      {/* Right Column — Visual */}
      <div
        className="hidden lg:flex relative overflow-hidden items-center justify-center p-2xl w-full h-full"
        style={{ background: `linear-gradient(${gradientDirection})` }}
      >
        <div className="relative z-10 text-center" style={{ maxWidth: '400px' }}>
          <h2
            style={{ fontSize: '3rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem', lineHeight: 1.1 }}
          >
            {headline}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.6 }}>
            {subtext}
          </p>
        </div>

        {/* Decorative blobs */}
        <div
          className="absolute top-0 right-0 w-full h-full opacity-30"
          style={{ background: blobRight }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-full opacity-20"
          style={{ background: blobLeft }}
        />
      </div>
    </div>
  );
}
