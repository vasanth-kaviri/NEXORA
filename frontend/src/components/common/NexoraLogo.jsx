import React, { useId } from 'react';

/**
 * NexoraIcon - Handcrafted Vector Emblem
 * Concept 02: The Infinite Trajectory (Dual Chiral Facets & Ascending Vector Beam)
 *
 * Features:
 * - Obsidian glass tile backing with subtle ambient border
 * - Dual chiral ribbon facets forming an architectural 'N' monogram
 * - Razor-cut negative space dynamic separation
 * - Cyan-to-indigo ascending growth beam symbolizing forward career momentum
 */
export function NexoraIcon({ 
  size = 38, 
  className = '', 
  withGlow = false,
  interactive = false,
  style = {} 
}) {
  const uniqueId = useId().replace(/:/g, '');
  const gradId = `nexora-grad-${uniqueId}`;
  const accentId = `nexora-accent-${uniqueId}`;
  const tileId = `nexora-tile-${uniqueId}`;
  const glowId = `nexora-glow-${uniqueId}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`nexora-brand-icon ${interactive ? 'transition-transform duration-300 hover:scale-105' : ''} ${className}`}
      style={{
        flexShrink: 0,
        display: 'inline-block',
        verticalAlign: 'middle',
        filter: withGlow ? 'drop-shadow(0 4px 12px rgba(99, 102, 241, 0.35))' : 'none',
        ...style
      }}
      aria-label="NEXORA Emblem"
    >
      <defs>
        {/* Core Electric Indigo/Violet Trajectory Gradient */}
        <linearGradient id={gradId} x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="55%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>

        {/* Hyper-Speed Cyan to Indigo Growth Beam */}
        <linearGradient id={accentId} x1="16" y1="36" x2="34" y2="12" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>

        {/* Deep Obsidian Tile Substrate */}
        <linearGradient id={tileId} x1="24" y1="0" x2="24" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#18181D" />
          <stop offset="100%" stopColor="#09090C" />
        </linearGradient>

        {/* Ambient Subtle Underglow */}
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#4F46E5" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Obsidian Tactile Base Plate */}
      <rect 
        x="2" 
        y="2" 
        width="44" 
        height="44" 
        rx="12" 
        fill={`url(#${tileId})`} 
        stroke="rgba(255, 255, 255, 0.12)" 
        strokeWidth="1.2" 
      />

      {/* Subtle Specular Top Highlight */}
      <rect 
        x="2.5" 
        y="2.5" 
        width="43" 
        height="20" 
        rx="11" 
        fill="none" 
        stroke="rgba(255, 255, 255, 0.06)" 
        strokeWidth="0.8" 
      />

      {/* Left Carrier Pillar */}
      <path 
        d="M13 35V17C13 14.7909 14.7909 13 17 13H18.5C20.7091 13 22.5 14.7909 22.5 17V26.5L16.5 35H13Z" 
        fill={`url(#${gradId})`} 
      />

      {/* Ascending Quantum Vector Ribbon */}
      <path 
        d="M17.5 35L30.5 17C31.5 15.5 33.2 14.8 35 15.5L35 31C35 33.2091 33.2091 35 31 35H29C27.5 35 26.2 34.2 25.5 33L17.5 35Z" 
        fill={`url(#${gradId})`} 
        opacity="0.95" 
      />

      {/* Precision Negative Space Separator */}
      <path 
        d="M16 13L32 35" 
        stroke="#09090C" 
        strokeWidth="2.8" 
        strokeLinecap="round" 
      />

      {/* Ascending Growth Trajectory Beam */}
      <path 
        d="M18 34L32 14" 
        stroke={`url(#${accentId})`} 
        strokeWidth="2.4" 
        strokeLinecap="round" 
        style={{ filter: `url(#${glowId})` }}
      />
    </svg>
  );
}

/**
 * NexoraLogo - Full Brand Lockup (Icon + Clean Typographic Signature)
 */
export default function NexoraLogo({
  size = 38,
  showText = true,
  badge = 'PRO EDITION',
  orientation = 'horizontal', // 'horizontal' | 'vertical'
  className = '',
  onClick = null,
  withGlow = false
}) {
  const isVertical = orientation === 'vertical';

  return (
    <div 
      className={`nexora-logo-lockup flex ${isVertical ? 'flex-col items-center text-center gap-2' : 'items-center gap-3'} select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <NexoraIcon size={size} withGlow={withGlow} interactive={Boolean(onClick)} />
      
      {showText && (
        <div className={`brand-info flex flex-col justify-center ${isVertical ? 'items-center' : ''}`}>
          <span className="brand-title font-extrabold tracking-tight text-gradient leading-none">
            NEXORA
          </span>
          {badge && (
            <span className="brand-badge text-[0.62rem] font-bold tracking-wider text-primary mt-0.5">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
