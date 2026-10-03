import FeatureCard from './FeatureCard';

export default function SectionFrame({ section, onNavigate, animDelay }) {
  const { CategoryIcon } = section;

  return (
    <section
      className="elite-frame animate-fade-in"
      style={{ animationDelay: `${animDelay}ms` }}
    >
      {/* Ambient corner glow */}
      <div style={{
        position: 'absolute', top: -50, right: -50,
        width: 180, height: 180, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${section.accentRgb}, 0.10) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Frame Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: 38, height: 38, borderRadius: '11px',
          background: `rgba(${section.accentRgb}, 0.12)`,
          border: `1px solid rgba(${section.accentRgb}, 0.22)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <CategoryIcon size={18} style={{ color: section.accentColor }} />
        </div>
        <div>
          <h2 style={{
            fontSize: '1.05rem', fontWeight: 700,
            color: 'var(--text-main)', margin: 0, letterSpacing: '-0.2px',
          }}>
            {section.title}
          </h2>
          <p style={{ fontSize: '0.79rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: 0 }}>
            {section.description}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{
        height: '1px',
        background: `linear-gradient(90deg, rgba(${section.accentRgb}, 0.35), var(--border-color) 60%, transparent)`,
        flexShrink: 0,
      }} />

      {/* Cards Grid — always 4 items, responsive columns */}
      <div className="elite-grid-4">
        {section.items.map((item, i) => (
          <FeatureCard key={i} item={item} onNavigate={onNavigate} />
        ))}
      </div>
    </section>
  );
}
