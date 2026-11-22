import React from 'react';

export const Spinner = ({ size = 'md', color = 'primary', className = '' }) => {
  const getSize = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4 border-2';
      case 'lg':
        return 'w-8 h-8 border-3';
      default:
        return 'w-5 h-5 border-2';
    }
  };

  const getColor = () => {
    switch (color) {
      case 'white':
        return 'border-white/30 border-t-white';
      case 'dark':
        return 'border-[#1E293B]/20 border-t-[#1E293B]';
      case 'cobalt':
        return 'border-[#3B82F6]/30 border-t-[#3B82F6]';
      default:
        return 'border-[#1E293B]/30 border-t-[#1E293B]';
    }
  };

  return (
    <div
      className={`rounded-full animate-spin ${getSize()} ${getColor()} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};
