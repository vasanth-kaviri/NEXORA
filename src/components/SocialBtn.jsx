import { useState } from 'react';

/**
 * SocialBtn
 *
 * A tactile skeuomorphic social media key button with physical 3D ledge and click depression.
 */
export default function SocialBtn({ href, label, hoverColor, path }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      className="tactile-press"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '38px',
        height: '38px',
        borderRadius: '11px',
        background: hovered ? `${hoverColor}18` : 'var(--skeuo-surface-grad)',
        border: `1px solid ${hovered ? hoverColor + '66' : 'var(--border-color)'}`,
        borderTop: `1px solid ${hovered ? hoverColor + 'aa' : 'var(--skeuo-highlight)'}`,
        borderBottom: `1px solid ${hovered ? hoverColor + '88' : 'var(--skeuo-shadow-rim)'}`,
        color: hovered ? hoverColor : 'var(--text-muted)',
        textDecoration: 'none',
        userSelect: 'none',
        transform: pressed ? 'translateY(2.5px) scale(0.96)' : (hovered ? 'translateY(-2px)' : 'translateY(0)'),
        boxShadow: pressed
          ? 'inset 0 2px 4px rgba(0, 0, 0, 0.35), 0 0.5px 0 var(--skeuo-btn-sec-lip)'
          : (hovered
              ? `inset 0 1px 0 var(--skeuo-highlight), 0 4.5px 0 ${hoverColor}55, 0 8px 16px ${hoverColor}22`
              : 'inset 0 1px 0 var(--skeuo-highlight), 0 3px 0 var(--skeuo-btn-sec-lip), 0 4px 8px rgba(0, 0, 0, 0.08)'),
        transition: 'transform 0.1s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.1s ease, color 0.15s ease, background 0.15s ease',
      }}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d={path} />
      </svg>
    </a>
  );
}
