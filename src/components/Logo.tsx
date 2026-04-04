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
      <div className={`${containerSizes[size]} rounded-full bg-gradient-to-br from-[#E8B4BC] to-[#D4B996] flex items-center justify-center shadow-lg shadow-[#E8B4BC]/20`}>
        <Heart size={iconSizes[size]} className="text-black" fill="black" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`${titleSizes[size]} font-bold tracking-tighter text-white leading-none`}>
            EvoluaEla
          </span>
          <span className={`${subtitleSizes[size]} font-bold uppercase tracking-[0.3em] text-[#E8B4BC] mt-1`}>
            HIGH PERFORMANCE
          </span>
        </div>
      )}
    </div>
  );
};
