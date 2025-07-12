'use client';

import Image from 'next/image';
import { ReactNode } from 'react';

interface BackgroundImageProps {
  src: string;
  alt?: string;
  className?: string;
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  children?: ReactNode;
  priority?: boolean;
  quality?: number;
}

export default function BackgroundImage({
  src,
  alt = 'Background',
  className = '',
  overlay = false,
  overlayColor = 'bg-black',
  overlayOpacity = 30,
  children,
  priority = false,
  quality = 90
}: BackgroundImageProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-center"
          priority={priority}
          quality={quality}
          sizes="100vw"
        />
      </div>
      
      {/* Overlay */}
      {overlay && (
        <div className={`absolute inset-0 ${overlayColor}/${overlayOpacity}`} />
      )}
      
      {/* Content */}
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}

// Specialized background components
export function HeroBackground({ children }: { children?: ReactNode }) {
  return (
    <BackgroundImage
      src="/assets/backgrounds/background_white.png"
      alt="Hero Background"
      className="min-h-screen"
      overlay={true}
      overlayColor="bg-white"
      overlayOpacity={60}
      priority={true}
      quality={90}
    >
      {children}
    </BackgroundImage>
  );
}

export function PatternWebBackground({ children }: { children?: ReactNode }) {
  return (
    <div className="min-h-screen relative" style={{backgroundColor: '#fcf8ef'}}>
      {/* Pattern Web Background */}
      <div className="absolute inset-0">
        <Image
          src="/assets/backgrounds/pattern_web.png"
          alt="Pattern Web Background"
          fill
          className="object-cover object-center opacity-20"
          priority={true}
          quality={90}
          sizes="100vw"
        />
      </div>

      {/* Content */}
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}

export function SectionBackground({ 
  children, 
  className = '',
  darkOverlay = false 
}: { 
  children?: ReactNode;
  className?: string;
  darkOverlay?: boolean;
}) {
  return (
    <BackgroundImage
      src="/assets/backgrounds/background_white.png"
      alt="Section Background"
      className={`py-20 ${className}`}
      overlay={true}
      overlayColor={darkOverlay ? "bg-black" : "bg-white"}
      overlayOpacity={darkOverlay ? 50 : 70}
      quality={85}
    >
      {children}
    </BackgroundImage>
  );
}
