import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { RoleRoute } from './RoleRoute.jsx';
import { DashboardLayout } from '../components/layout/DashboardLayout.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { ROLES } from '../constants/index.js';

// Lazy-loaded pages following strict AGENTS.md route splitting requirement
const LoginPage = lazy(() =>
  import('../features/auth/pages/LoginPage.jsx').then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import('../features/auth/pages/RegisterPage.jsx').then((m) => ({ default: m.RegisterPage }))
);
const EmployeeDashboard = lazy(() =>
  import('../features/attendance/pages/EmployeeDashboard.jsx').then((m) => ({
    default: m.EmployeeDashboard
  }))
);
const ValidationQueuePage = lazy(() =>
  import('../features/validation/pages/ValidationQueuePage.jsx').then((m) => ({
    default: m.ValidationQueuePage
  }))
);
const OvertimePage = lazy(() =>
  import('../features/overtime/pages/OvertimePage.jsx').then((m) => ({ default: m.OvertimePage }))
);
const EmployeeDirectoryPage = lazy(() =>
  import('../features/users/pages/EmployeeDirectoryPage.jsx').then((m) => ({
    default: m.EmployeeDirectoryPage
  }))
);
const ReportsPage = lazy(() =>
  import('../features/reports/pages/ReportsPage.jsx').then((m) => ({ default: m.ReportsPage }))
);
const GeofenceSettingsPage = lazy(() =>
  import('../features/settings/pages/GeofenceSettingsPage.jsx').then((m) => ({
    default: m.GeofenceSettingsPage
  }))
);

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-3">
      <Spinner size="lg" color="cobalt" />
      <span className="text-xs text-[#64748B] font-medium">Loading telemetry view...</span>
    </div>
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Authenticated Dashboard Shell */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {/* Core Attendance Clock */}
            <Route path="/" element={<EmployeeDashboard />} />

            {/* Overtime Workflow (All Roles) */}
            <Route path="/overtime" element={<OvertimePage />} />

            {/* Daily Attendance Reports (All Roles) */}
            <Route path="/reports" element={<ReportsPage />} />

            {/* Manager & Admin Only: Validation Queue */}
            <Route element={<RoleRoute allowedRoles={[ROLES.MANAGER, ROLES.ADMIN]} />}>
              <Route path="/validation" element={<ValidationQueuePage />} />
            </Route>

            {/* Admin Only: Employee Directory & Geofence Settings */}
            <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
              <Route path="/users" element={<EmployeeDirectoryPage />} />
              <Route path="/settings" element={<GeofenceSettingsPage />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
