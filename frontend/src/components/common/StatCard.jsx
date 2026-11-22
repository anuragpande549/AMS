import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, badgeText, badgeVariant = 'info', className = '' }) => {
  return (
    <div className={`bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.05)] ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">{title}</span>
        {Icon && (
          <div className="w-8 h-8 rounded bg-[#F1F5F9] flex items-center justify-center text-[#64748B]">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl lg:text-3xl font-bold tracking-tight text-[#1E293B] tabular-nums">
          {value}
        </span>
        {badgeText && (
          <span className="text-xs font-medium text-[#64748B]">{badgeText}</span>
        )}
      </div>
      {subtitle && (
        <p className="mt-1 text-xs text-[#64748B] line-clamp-1">{subtitle}</p>
      )}
    </div>
  );
};
