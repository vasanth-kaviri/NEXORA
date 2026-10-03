import React from 'react';

/**
 * SkeletonCard Component
 * High-precision shimmer loading placeholder for async data loading states.
 */
export default function SkeletonCard({ count = 1, lines = 3, hasAvatar = false, className = '' }) {
  const cards = Array.from({ length: count });

  return (
    <>
      {cards.map((_, i) => (
        <div
          key={i}
          className={`glass-panel p-5 rounded-2xl border border-border flex flex-col justify-between ${className}`}
          style={{ minHeight: '160px' }}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              {hasAvatar && (
                <div className="skeleton-box w-10 h-10 rounded-xl flex-shrink-0 mr-3" />
              )}
              <div className="skeleton-box skeleton-title w-3/5" />
              <div className="skeleton-box w-14 h-6 rounded-full" />
            </div>

            {Array.from({ length: lines }).map((_, lineIdx) => (
              <div
                key={lineIdx}
                className="skeleton-box skeleton-text"
                style={{
                  width: lineIdx === lines - 1 ? '70%' : '100%',
                  opacity: 1 - lineIdx * 0.15
                }}
              />
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 mt-2 border-t border-border/60">
            <div className="skeleton-box w-20 h-4 rounded" />
            <div className="skeleton-box w-24 h-8 rounded-xl" />
          </div>
        </div>
      ))}
    </>
  );
}
