import React from 'react';
import { Spinner } from './Spinner.jsx';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[#1E293B] text-white hover:bg-[#334155] focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 border border-[#1E293B]';
      case 'secondary':
        return 'bg-white text-[#1E293B] hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] shadow-sm';
      case 'destructive':
        return 'bg-[#EF4444] text-white hover:bg-[#DC2626] focus:ring-2 focus:ring-[#EF4444] focus:ring-offset-2';
      case 'punchIn':
        return 'bg-[#10B981] text-white hover:bg-[#059669] shadow-sm focus:ring-2 focus:ring-[#10B981] focus:ring-offset-2 font-semibold h-12 text-base';
      case 'punchOut':
        return 'bg-[#EF4444] text-white hover:bg-[#DC2626] shadow-sm focus:ring-2 focus:ring-[#EF4444] focus:ring-offset-2 font-semibold h-12 text-base';
      case 'ghost':
        return 'bg-transparent text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9]';
      default:
        return 'bg-[#1E293B] text-white hover:bg-[#334155]';
    }
  };

  const getSizeStyles = () => {
    if (variant === 'punchIn' || variant === 'punchOut') return 'px-6 py-3';
    switch (size) {
      case 'sm':
        return 'px-2.5 py-1.5 text-xs';
      case 'lg':
        return 'px-5 py-2.5 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded font-medium transition-colors duration-150 outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Spinner size="sm" color={variant === 'secondary' || variant === 'ghost' ? 'dark' : 'white'} />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
};
