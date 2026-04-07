import React from 'react';
import { Heart } from 'lucide-react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', showText = true, size = 'md' }) => {
  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 24
  };

  const containerSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const subtitleSizes = {
    sm: 'text-[6px]',
    md: 'text-[8px]',
    lg: 'text-[10px]'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${containerSizes[size]} rounded-full bg-gradient-to-br from-[#D81BFF] to-[#F8C1FF] flex items-center justify-center shadow-lg shadow-[#D81BFF]/30`}>
        <Heart size={iconSizes[size]} className="text-[#0F0A1F]" fill="#0F0A1F" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`${titleSizes[size]} font-sans font-bold text-white leading-none tracking-tight`}>
            EvoluaEla
          </span>
          <span className={`${subtitleSizes[size]} font-bold uppercase tracking-[0.5em] text-[#D81BFF] mt-1.5`}>
            LUXURY WELLNESS
          </span>
        </div>
      )}
    </div>
  );
};
