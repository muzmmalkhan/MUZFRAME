import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function BrandLogo({ size = 'md', className = '' }: BrandLogoProps) {
  const heightClass = {
    sm: 'h-11 sm:h-12',
    md: 'h-16 sm:h-20',
    lg: 'h-24 sm:h-28',
  }[size];

  return (
    <img
      src="/logo.png"
      alt="MuzFrame Studio Official Logo"
      width={1992}
      height={1552}
      decoding="async"
      className={`${heightClass} w-auto object-contain select-none shrink-0 ${className}`}
    />
  );
}
