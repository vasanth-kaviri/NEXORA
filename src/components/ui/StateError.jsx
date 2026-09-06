import React from 'react';
import { AlertTriangle, RefreshCw, ServerCrash } from 'lucide-react';

export default function StateError({
  title = 'Service Gateway Unavailable',
  message = 'Unable to establish secure handshake with the cloud service. Please check your connection or retry.',
  errorCode = 'ERR_BACKEND_UNREACHABLE',
  onRetry,
  compact = false
}) {
  if (compact) {
    return (
      <div 
        className="glass-panel flex items-center justify-between p-md gap-md animate-fade-in"
        style={{
          borderLeft: '4px solid #ef4444',
          borderRadius: 'var(--radius-md)'
        }}
      >
        <div className="flex items-center gap-sm">
          <AlertTriangle size={20} className="text-rose-500 flex-shrink-0" />
          <div className="flex flex-col">
            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {title}
            </span>
            <span className="text-muted" style={{ fontSize: '0.78rem' }}>
              {message}
            </span>
          </div>
        </div>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="btn-tactile btn-ghost flex items-center gap-xs"
            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
          >
            <RefreshCw size={13} />
            <span>Retry</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div 
      className="glass-panel flex flex-col items-center justify-center text-center p-xl gap-md animate-fade-in"
      style={{
        borderRadius: 'var(--radius-xl)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        background: 'rgba(239, 68, 68, 0.03)',
        minHeight: '260px'
      }}
    >
      <div 
        className="skeuo-well flex items-center justify-center"
        style={{
          width: '64px',
          height: '64px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444'
        }}
      >
        <ServerCrash size={30} />
      </div>

      <div className="flex flex-col gap-xs max-w-md">
        <div className="flex items-center justify-center gap-xs">
          <span 
            className="font-mono"
            style={{ 
              fontSize: '0.68rem', 
              padding: '2px 8px', 
              borderRadius: 'var(--radius-full)', 
              background: 'rgba(239, 68, 68, 0.15)', 
              color: '#ef4444',
              fontWeight: 700 
            }}
          >
            {errorCode}
          </span>
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '4px 0 0 0' }}>
          {title}
        </h3>
        <p className="text-muted" style={{ fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>
          {message}
        </p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-tactile flex items-center gap-xs mt-xs"
          style={{ 
            padding: '9px 20px', 
            fontSize: '0.84rem',
            background: '#ef4444',
            color: '#ffffff',
            boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)'
          }}
        >
          <RefreshCw size={14} />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
}
