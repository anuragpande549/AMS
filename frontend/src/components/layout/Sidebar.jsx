import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Clock,
  CheckSquare,
  FileText,
  Users,
  Calendar,
  LogOut,
  Building2,
  MapPin,
  X
} from 'lucide-react';
import { logout } from '../../features/auth/authSlice.js';
import { Badge } from '../common/Badge.jsx';
import { ROLES } from '../../constants/index.js';

export const Sidebar = ({ isMobileOpen, onCloseMobile, onOpenGeofenceModal }) => {
  const { user, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 min-h-[44px] rounded text-xs font-medium transition-colors ${
      isActive
        ? 'bg-[#3B82F6] text-white shadow-xs'
        : 'text-[#94A3B8] hover:text-white hover:bg-[#334155]'
    }`;

  const isAdmin = String(role || '').toLowerCase() === ROLES.ADMIN.toLowerCase();
  const isManagerOrAdmin = isAdmin || String(role || '').toLowerCase() === ROLES.MANAGER.toLowerCase();

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-[#0F172A]/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-[#1E293B] border-r border-[#334155] z-50 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#334155]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded bg-[#3B82F6] flex items-center justify-center text-white shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-white tracking-tight truncate">AMS ENTERPRISE</h1>
              <p className="text-[10px] text-[#94A3B8] font-mono tracking-wider uppercase truncate">Workforce Audit</p>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 -mr-1 rounded-md text-[#94A3B8] hover:text-white hover:bg-[#334155] transition-colors cursor-pointer"
            aria-label="Close navigation sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
            Workforce Portal
          </div>

          {/* Employee & Shared Main Dashboard */}
          <NavLink to="/" end className={navItemClass} onClick={onCloseMobile}>
            <Clock className="w-4 h-4 shrink-0" />
            <span>Attendance Clock</span>
          </NavLink>

          {/* Manager & Admin: Attendance Validation Queue */}
          {isManagerOrAdmin && (
            <NavLink to="/validation" className={navItemClass} onClick={onCloseMobile}>
              <CheckSquare className="w-4 h-4 shrink-0" />
              <span>Validation Queue</span>
            </NavLink>
          )}

          {/* Overtime Workflow */}
          <NavLink to="/overtime" className={navItemClass} onClick={onCloseMobile}>
            <Calendar className="w-4 h-4 shrink-0" />
            <span>Overtime (OT)</span>
          </NavLink>

          {/* Reports */}
          <NavLink to="/reports" className={navItemClass} onClick={onCloseMobile}>
            <FileText className="w-4 h-4 shrink-0" />
            <span>Daily Reports</span>
          </NavLink>

          {/* Admin: Employee Directory & Geofence Coordinates */}
          {isAdmin && (
            <>
              <div className="pt-4 px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
                Administration
              </div>
              <NavLink to="/users" className={navItemClass} onClick={onCloseMobile}>
                <Users className="w-4 h-4 shrink-0" />
                <span>Employee Directory</span>
              </NavLink>

              <NavLink to="/settings" className={navItemClass} onClick={onCloseMobile}>
                <MapPin className="w-4 h-4 shrink-0 text-[#0EA5E9]" />
                <span>Office & Geofence</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* User Profile & Logout Footer */}
        <div className="p-4 border-t border-[#334155] bg-[#0F172A]/40">
          <div className="flex items-center justify-between mb-2 gap-2">
            <div className="truncate pr-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Authorized User'}</p>
              <p className="text-[10px] text-[#94A3B8] truncate">{user?.email}</p>
            </div>
            <div className="shrink-0">
              <Badge variant={role} showDot={false}>
                {role}
              </Badge>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full mt-2 flex items-center justify-center gap-2 min-h-[40px] py-1.5 px-3 rounded text-xs font-medium text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
