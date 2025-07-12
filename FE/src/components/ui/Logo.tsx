'use client';

import Image from 'next/image';
import { useState } from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  priority?: boolean;
  showText?: boolean;
  textClassName?: string;
}

export default function Logo({ 
  size = 'md', 
  className = '',
  priority = false,
  showText = true,
  textClassName = ''
}: LogoProps) {
  const [imageError, setImageError] = useState(false);

  const sizeMap = {
    xs: { width: 20, height: 20 },
    sm: { width: 28, height: 28 },
    md: { width: 36, height: 36 },
    lg: { width: 48, height: 48 },
    xl: { width: 64, height: 64 },
    hero: { width: 80, height: 80 }
  };

  const textSizeMap = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
    hero: 'text-3xl'
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const { width, height } = sizeMap[size];

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`relative flex-shrink-0`} style={{ width, height }}>
        {!imageError ? (
          <Image
            src="/assets/logos/logo_moc.png"
            alt="DecalStudio Logo"
            width={width}
            height={height}
            className="object-contain"
            priority={priority}
            onError={handleImageError}
          />
        ) : (
          // Fallback logo nếu image không load được
          <div className={`w-full h-full bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center`}>
            <svg className={`${size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-4 h-4' : size === 'hero' ? 'w-16 h-16' : 'w-6 h-6'} text-white`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
            </svg>
          </div>
        )}
      </div>
      
      {showText && (
        <span className={`font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent ${textSizeMap[size]} ${textClassName}`}>
          DecalStudio
        </span>
      )}
    </div>
  );
}

// Specialized logo components
export function HeaderLogo() {
  return (
    <Logo
      size="sm"
      priority={true}
      className="group-hover:scale-105 transition-transform duration-200"
    />
  );
}

export function HeroLogo() {
  return (
    <Logo
      size="xl"
      priority={true}
      showText={false}
      className="drop-shadow-2xl"
    />
  );
}

export function FooterLogo() {
  return (
    <Logo 
      size="sm" 
      showText={true}
      textClassName="text-gray-300"
    />
  );
}
