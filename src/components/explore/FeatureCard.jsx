import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function FeatureCard({ item, onNavigate }) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  return (
    <div
      onClick={() => onNavigate(item.path)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="elite-card"
      style={{
        background: hovered
          ? `rgba(${item.glowColor}, 0.06)`
          : 'var(--skeuo-surface-card)',
        border: `1px solid ${hovered ? `rgba(${item.glowColor}, 0.45)` : 'var(--border-color)'}`,
        borderTop: `1px solid ${hovered ? `rgba(${item.glowColor}, 0.7)` : 'var(--skeuo-highlight)'}`,
        borderBottom: `1px solid ${hovered ? `rgba(${item.glowColor}, 0.5)` : 'var(--skeuo-shadow-rim)'}`,
        transform: hovered ? 'translateY(-4px) translateZ(0)' : 'translateY(0) translateZ(0)',
        boxShadow: hovered
          ? `inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 0 0 1px rgba(${item.glowColor}, 0.2), 0 12px 32px -4px rgba(${item.glowColor}, 0.22), 0 32px 56px -8px rgba(0,0,0,0.3)`
          : undefined,
        gap: '1rem',
        justifyContent: 'space-between',
      }}
    >
      {/* Shimmer bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, transparent, rgba(${item.glowColor}, 0.85), transparent)`,
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.28s ease',
        borderRadius: '20px 20px 0 0',
        pointerEvents: 'none',
      }} />

      {/* Top row: icon + arrow */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div
          className="skeuo-well"
          style={{
            width: 44, height: 44,
            borderRadius: '11px',
            background: item.iconBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            transition: 'transform 0.22s ease',
            transform: hovered ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          <Icon size={21} style={{ color: item.iconColor }} />
        </div>
        <div
          className="btn-icon-tactile"
          style={{ width: 28, height: 28, borderRadius: '8px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ArrowUpRight
            size={14}
            style={{
              color: hovered ? item.iconColor : 'var(--text-muted)',
              transition: 'color 0.22s ease, transform 0.22s ease',
              transform: hovered ? 'translate(1px, -1px)' : 'translate(0,0)',
            }}
          />
        </div>
      </div>

      {/* Text */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <h3 style={{
          fontSize: '0.95rem', fontWeight: 700,
          color: 'var(--text-main)',
          lineHeight: 1.3, margin: 0,
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',
        }}>
          {item.name}
        </h3>
        <p style={{
          fontSize: '0.81rem', color: 'var(--text-muted)',
          lineHeight: 1.55, margin: 0,
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
        }}>
          {item.desc}
        </p>
      </div>
    </div>
  );
}
