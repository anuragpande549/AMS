import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Topbar } from './Topbar.jsx';
import { GeofenceSettingsModal } from '../../features/settings/components/GeofenceSettingsModal.jsx';

export const DashboardLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isGeofenceModalOpen, setIsGeofenceModalOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Attendance Command Center';
      case '/validation':
        return 'Attendance Validation Queue';
      case '/overtime':
        return 'Overtime (OT) Review & Management';
      case '/users':
        return 'Employee Directory & Roles';
      case '/settings':
        return 'Office Geofence & Location Settings';
      case '/reports':
        return 'Daily Attendance & Audit Reports';
      default:
        return 'Workforce Management';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        onOpenGeofenceModal={() => setIsGeofenceModalOpen(true)}
      />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Topbar
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
          onOpenGeofenceModal={() => setIsGeofenceModalOpen(true)}
          title={getPageTitle()}
        />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Admin Geofence Settings Modal */}
      <GeofenceSettingsModal
        isOpen={isGeofenceModalOpen}
        onClose={() => setIsGeofenceModalOpen(false)}
      />
    </div>
  );
};
