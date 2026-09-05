/**
 * IconInput
 *
 * A styled input field with an icon absolutely positioned on the left.
 * Accepts any valid <input> props via spread, plus:
 *  - icon      (ReactNode) — the icon element to render
 *  - error     (boolean)   — highlights border in error state
 *  - wrapperStyle (object) — extra styles for the outer wrapper div
 */
export default function IconInput({ icon, error = false, wrapperStyle = {}, style = {}, className = '', ...inputProps }) {
  return (
    <div style={{ position: 'relative', ...wrapperStyle }}>
      {/* Icon */}
      <span
        className="text-muted"
        style={{ position: 'absolute', top: 14, left: 14, display: 'flex', alignItems: 'center', pointerEvents: 'none' }}
      >
        {icon}
      </span>

      {/* Input */}
      <input
        className={`input-field ${className}`}
        style={{
          paddingLeft: '2.75rem',
          width: '100%',
          borderColor: error ? 'var(--secondary)' : '',
          ...style,
        }}
        {...inputProps}
      />
    </div>
  );
}
