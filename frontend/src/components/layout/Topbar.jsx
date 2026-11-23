import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, ShieldCheck, Settings } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Badge } from '../common/Badge.jsx';
import { ROLES } from '../../constants/index.js';

export const Topbar = ({ onOpenMobileSidebar, onOpenGeofenceModal, title = 'Attendance Management' }) => {
  const { role } = useSelector((state) => state.auth);
  const isAdmin = String(role || '').toLowerCase() === ROLES.ADMIN.toLowerCase();

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-3.5 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_2px_0_rgba(15,23,42,0.03)]">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="p-2 -ml-1 rounded border border-[#E2E8F0] text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] active:bg-[#E2E8F0] transition-colors lg:hidden shrink-0 touch-manipulation cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h2 className="text-sm sm:text-base font-semibold text-[#1E293B] tracking-tight truncate max-w-[150px] xs:max-w-[210px] sm:max-w-none">
            {title}
          </h2>
          <span className="hidden sm:inline text-[11px] text-[#64748B]">Audited Shift Telemetry System</span>
        </div>
      </div>

      {/* Right: Security & Role status pill */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {isAdmin ? (
          <Link
            to="/settings"
            className="flex items-center gap-1.5 text-xs text-[#065F46] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] px-2 sm:px-2.5 py-1 rounded transition-colors cursor-pointer shrink-0"
            title="Configure Default Office Coordinates & Geofence Radius"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
            <span className="hidden sm:inline font-semibold text-[11px] uppercase tracking-wider">Geofence Config</span>
            <span className="sm:hidden font-semibold text-[10px] uppercase tracking-wider">Geofence</span>
            <span className="hidden sm:inline text-[10px] text-[#059669] underline font-normal">Edit</span>
          </Link>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-1 rounded shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="font-semibold text-[11px] uppercase tracking-wider">Geofence Active</span>
          </div>
        )}

        <div className="shrink-0">
          <Badge variant={role} showDot={true}>
            {role}
          </Badge>
        </div>
      </div>
    </header>
  );
};
