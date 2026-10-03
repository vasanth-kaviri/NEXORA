/**
 * IconInput
 *
 * A styled input field with an icon absolutely positioned on the left.
 * Accepts any valid <input> props via spread, plus:
 *  - icon           (ReactNode) — the icon element to render
 *  - error          (boolean)   — highlights border in error state
 *  - wrapperStyle   (object)    — extra styles for the outer wrapper div
 *  - showToggle     (boolean)   — enables the show/hide password eye icon
 *
 * When showToggle=true the component manages its own internal visibility
 * state. The caller simply passes type="password" as usual; the component
 * overrides the type attribute automatically.
 */
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function IconInput({
  icon,
  error = false,
  wrapperStyle = {},
  style = {},
  className = '',
  showToggle = false,
  ...inputProps
}) {
  const [visible, setVisible] = useState(false);

  // If toggle is enabled, override the type attribute
  const resolvedType = showToggle
    ? visible ? 'text' : 'password'
    : inputProps.type;

  return (
    <div style={{ position: 'relative', ...wrapperStyle }}>
      {/* Left Icon */}
      <span
        className="text-muted"
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        {icon}
      </span>

      {/* Input */}
      <input
        {...inputProps}
        type={resolvedType}
        className={`input-field ${className}`}
        style={{
          paddingLeft: '2.75rem',
          paddingRight: showToggle ? '2.75rem' : undefined,
          width: '100%',
          borderColor: error ? 'var(--secondary)' : '',
          ...style,
        }}
      />

      {/* Right Eye Toggle */}
      {showToggle && (
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          tabIndex={-1}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            height: '100%',
            width: '2.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            transition: 'color 0.15s',
            padding: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      )}
    </div>
  );
}
