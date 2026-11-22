import React from 'react';

export const Badge = ({ variant = 'default', children, showDot = true, className = '' }) => {
  const getStyles = () => {
    switch (variant.toLowerCase()) {
      case 'completed':
      case 'valid':
      case 'present':
      case 'approved':
        return {
          container: 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]',
          dot: 'bg-[#10B981]'
        };
      case 'pending':
      case 'pending ot':
        return {
          container: 'bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]',
          dot: 'bg-[#F59E0B]'
        };
      case 'incomplete':
      case 'invalid':
      case 'rejected':
      case 'absent':
        return {
          container: 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]',
          dot: 'bg-[#EF4444]'
        };
      case 'telemetry':
      case 'geofence':
      case 'info':
        return {
          container: 'bg-[#F0F9FF] text-[#075985] border border-[#BAE6FD]',
          dot: 'bg-[#0EA5E9]'
        };
      case 'admin':
        return {
          container: 'bg-[#1E293B] text-white border border-[#0F172A]',
          dot: 'bg-white'
        };
      case 'manager':
        return {
          container: 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]',
          dot: 'bg-[#3B82F6]'
        };
      case 'employee':
        return {
          container: 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]',
          dot: 'bg-[#64748B]'
        };
      default:
        return {
          container: 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]',
          dot: 'bg-[#94A3B8]'
        };
    }
  };

  const style = getStyles();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider uppercase ${style.container} ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />}
      <span>{children}</span>
    </span>
  );
};
