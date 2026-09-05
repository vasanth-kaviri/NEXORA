import { useState } from 'react';

/**
 * SocialBtn
 *
 * An animated social media icon button.
 * Previously a local function inside Dashboard.jsx; extracted for reuse.
 *
 * Props:
 *  - href       (string) — destination URL
 *  - label      (string) — aria-label
 *  - hoverColor (string) — brand color shown on hover
 *  - path       (string) — SVG path data for the icon
 */
export default function SocialBtn({ href, label, hoverColor, path }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        background: hovered ? `${hoverColor}18` : 'transparent',
        border: `1px solid ${hovered ? hoverColor + '55' : 'var(--border-color)'}`,
        color: hovered ? hoverColor : 'var(--text-muted)',
        transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
        textDecoration: 'none',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
    >
      <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
        <path d={path} />
      </svg>
    </a>
  );
}
