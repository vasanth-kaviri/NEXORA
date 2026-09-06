import React from 'react';
import { FolderKanban, ArrowRight } from 'lucide-react';

export default function StateEmpty({
  icon: Icon = FolderKanban,
  title = 'No records found',
  description = 'There are currently no items to display in this view. Check back later or create a new entry.',
  actionLabel = 'Get Started',
  onAction,
  secondaryLabel,
  onSecondaryAction
}) {
  return (
    <div 
      className="glass-panel skeuo-convex flex flex-col items-center justify-center text-center p-xl gap-md animate-fade-in"
      style={{
        borderRadius: 'var(--radius-xl)',
        border: '1px dashed var(--border-subtle)',
        minHeight: '260px'
      }}
    >
      <div 
        className="skeuo-well flex items-center justify-center text-muted"
        style={{
          width: '64px',
          height: '64px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--bg-main)',
          color: 'var(--primary)'
        }}
      >
        <Icon size={28} />
      </div>

      <div className="flex flex-col gap-xs max-w-md">
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
          {title}
        </h3>
        <p className="text-muted" style={{ fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>
          {description}
        </p>
      </div>

      {(onAction || onSecondaryAction) && (
        <div className="flex items-center gap-sm mt-xs flex-wrap justify-center">
          {onAction && (
            <button
              onClick={onAction}
              className="btn-tactile btn-primary flex items-center gap-xs"
              style={{ padding: '8px 18px', fontSize: '0.84rem' }}
            >
              <span>{actionLabel}</span>
              <ArrowRight size={14} />
            </button>
          )}
          {onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className="btn-tactile btn-ghost"
              style={{ padding: '8px 16px', fontSize: '0.84rem' }}
            >
              {secondaryLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
