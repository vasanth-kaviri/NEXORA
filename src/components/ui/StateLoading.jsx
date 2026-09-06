import React from 'react';

export default function StateLoading({ type = 'cards', count = 3, message = 'Loading live data...' }) {
  if (type === 'hero') {
    return (
      <div className="glass-panel skeuo-convex flex flex-col gap-md p-lg" style={{ borderRadius: 'var(--radius-xl)' }}>
        <div className="flex items-center justify-between">
          <div className="skeleton-box" style={{ width: '180px', height: '24px' }} />
          <div className="skeleton-box" style={{ width: '90px', height: '24px', borderRadius: 'var(--radius-full)' }} />
        </div>
        <div className="skeleton-box" style={{ width: '60%', height: '36px' }} />
        <div className="skeleton-box" style={{ width: '85%', height: '18px' }} />
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-sm pt-sm">
          {[1, 2, 3, 4].map(idx => (
            <div key={idx} className="skeuo-well p-sm flex flex-col gap-xs rounded-lg">
              <div className="skeleton-box" style={{ width: '50px', height: '12px' }} />
              <div className="skeleton-box" style={{ width: '70px', height: '22px' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'radar' || type === 'competency') {
    return (
      <div className="glass-panel p-lg flex flex-col gap-md" style={{ borderRadius: 'var(--radius-xl)' }}>
        <div className="flex items-center justify-between">
          <div className="skeleton-box" style={{ width: '160px', height: '22px' }} />
          <div className="skeleton-box" style={{ width: '60px', height: '22px', borderRadius: 'var(--radius-full)' }} />
        </div>
        <div className="flex flex-col gap-sm py-sm">
          {[1, 2, 3, 4].map(idx => (
            <div key={idx} className="flex flex-col gap-xs">
              <div className="flex justify-between">
                <div className="skeleton-box" style={{ width: '45%', height: '14px' }} />
                <div className="skeleton-box" style={{ width: '35px', height: '14px' }} />
              </div>
              <div className="skeleton-box" style={{ width: '100%', height: '8px', borderRadius: 'var(--radius-full)' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="flex flex-col gap-sm">
        {Array.from({ length: count }).map((_, idx) => (
          <div 
            key={idx} 
            className="glass-panel p-md flex items-center justify-between gap-md" 
            style={{ borderRadius: 'var(--radius-lg)' }}
          >
            <div className="flex items-center gap-sm flex-1">
              <div className="skeleton-box" style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
              <div className="flex flex-col gap-xs flex-1">
                <div className="skeleton-box" style={{ width: '65%', height: '16px' }} />
                <div className="skeleton-box" style={{ width: '40%', height: '12px' }} />
              </div>
            </div>
            <div className="skeleton-box" style={{ width: '80px', height: '28px', borderRadius: 'var(--radius-full)' }} />
          </div>
        ))}
      </div>
    );
  }

  // Default 'cards' grid layout
  return (
    <div className="flex flex-col gap-md">
      {message && (
        <div className="flex items-center gap-xs text-muted" style={{ fontSize: '0.84rem' }}>
          <div className="skeleton-box" style={{ width: '12px', height: '12px', borderRadius: 'var(--radius-full)' }} />
          <span>{message}</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
        {Array.from({ length: count }).map((_, idx) => (
          <div 
            key={idx} 
            className="glass-panel p-lg flex flex-col gap-md" 
            style={{ borderRadius: 'var(--radius-xl)' }}
          >
            <div className="flex items-center justify-between">
              <div className="skeleton-box" style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)' }} />
              <div className="skeleton-box" style={{ width: '70px', height: '22px', borderRadius: 'var(--radius-full)' }} />
            </div>
            <div className="flex flex-col gap-xs">
              <div className="skeleton-box" style={{ width: '80%', height: '20px' }} />
              <div className="skeleton-box" style={{ width: '50%', height: '14px' }} />
            </div>
            <div className="skeleton-box" style={{ width: '100%', height: '40px', borderRadius: 'var(--radius-sm)' }} />
            <div className="flex items-center justify-between pt-xs">
              <div className="skeleton-box" style={{ width: '90px', height: '16px' }} />
              <div className="skeleton-box" style={{ width: '100px', height: '32px', borderRadius: 'var(--radius-md)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
