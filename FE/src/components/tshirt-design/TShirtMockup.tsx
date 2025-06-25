'use client';

import React from 'react';

interface TShirtMockupProps {
  color: string;
  view: 'front' | 'back' | 'folded' | 'hanging';
  children?: React.ReactNode;
  className?: string;
}

export default function TShirtMockup({ color, view, children, className = '' }: TShirtMockupProps) {
  const getContainerStyle = () => {
    switch (view) {
      case 'folded':
        return {
          transform: 'perspective(1200px) rotateX(25deg) rotateY(-20deg) scale(0.85)',
          transformStyle: 'preserve-3d' as const,
        };
      case 'hanging':
        return {
          transform: 'perspective(1000px) rotateY(12deg) scale(0.9)',
          transformStyle: 'preserve-3d' as const,
        };
      default:
        return {};
    }
  };

  const getTShirtPath = () => {
    switch (view) {
      case 'folded':
        return 'M50 10 L150 10 L160 25 L180 25 L185 35 L190 35 L190 45 L180 45 L180 200 L20 200 L20 45 L10 45 L10 35 L15 35 L20 25 L40 25 Z';
      case 'hanging':
        return 'M60 5 L140 5 L150 20 L170 20 L175 30 L185 30 L185 40 L175 40 L175 210 L25 210 L25 40 L15 40 L15 30 L25 30 L30 20 L50 20 Z';
      default:
        return 'M60 8 L140 8 L148 22 L168 22 L173 32 L183 32 L183 42 L173 42 L173 220 L27 220 L27 42 L17 42 L17 32 L27 32 L32 22 L52 22 Z';
    }
  };

  const getShadowFilter = () => {
    switch (view) {
      case 'folded':
        return 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))';
      case 'hanging':
        return 'drop-shadow(0 25px 50px rgba(0,0,0,0.3))';
      default:
        return 'drop-shadow(0 10px 25px rgba(0,0,0,0.2))';
    }
  };

  return (
    <div className={`relative ${className}`} style={getContainerStyle()}>
      {/* SVG T-shirt */}
      <svg
        width="200"
        height="240"
        viewBox="0 0 200 240"
        className="w-full h-full"
        style={{ filter: getShadowFilter() }}
      >
        <defs>
          {/* Gradient for fabric texture */}
          <pattern id={`fabric-${view}`} patternUnits="userSpaceOnUse" width="4" height="4">
            <rect width="4" height="4" fill={color} />
            <circle cx="2" cy="2" r="0.5" fill="rgba(0,0,0,0.05)" />
          </pattern>

          {/* Lighting gradient */}
          <linearGradient id={`lighting-${view}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="30%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="70%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
          </linearGradient>

          {/* Shadow gradient */}
          <linearGradient id={`shadow-${view}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="60%" stopColor="rgba(0,0,0,0.05)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
          </linearGradient>
        </defs>

        {/* Main T-shirt shape */}
        <path
          d={getTShirtPath()}
          fill={`url(#fabric-${view})`}
          stroke={`${color}dd`}
          strokeWidth="1"
        />

        {/* Lighting overlay */}
        <path
          d={getTShirtPath()}
          fill={`url(#lighting-${view})`}
        />

        {/* Shadow overlay */}
        <path
          d={getTShirtPath()}
          fill={`url(#shadow-${view})`}
        />

        {/* Collar detail */}
        <ellipse
          cx="100"
          cy="15"
          rx="20"
          ry="8"
          fill="none"
          stroke={`${color}aa`}
          strokeWidth="1"
          opacity="0.6"
        />

        {/* Seam lines */}
        {view === 'front' && (
          <>
            {/* Side seams */}
            <line x1="27" y1="42" x2="27" y2="220" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
            <line x1="173" y1="42" x2="173" y2="220" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />

            {/* Shoulder seams */}
            <line x1="52" y1="22" x2="32" y2="32" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
            <line x1="148" y1="22" x2="168" y2="32" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
          </>
        )}
      </svg>

      {/* Design content overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative overflow-hidden"
          style={{
            width: '120px',
            height: '140px',
            marginTop: view === 'folded' ? '20px' : '40px',
            transform: view === 'folded' ? 'perspective(600px) rotateX(15deg)' :
                      view === 'hanging' ? 'perspective(600px) rotateY(8deg)' :
                      'none',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
