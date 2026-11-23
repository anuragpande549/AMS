import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Clock, CheckCircle, AlertTriangle, Calendar, PlusCircle, Eye, Bell } from 'lucide-react';
import { StatCard } from '../../../components/common/StatCard.jsx';
import { DataTable } from '../../../components/common/DataTable.jsx';
import { Badge } from '../../../components/common/Badge.jsx';
import { Button } from '../../../components/common/Button.jsx';
import { TodayPunchCard } from '../components/TodayPunchCard.jsx';
import { RequestOvertimeModal } from '../../overtime/components/RequestOvertimeModal.jsx';
import { SelfiePreviewModal } from '../../validation/components/SelfiePreviewModal.jsx';
import { useGetTodayStatusQuery, useGetMyHistoryQuery, useGetKPIsQuery } from '../attendanceApi.js';
import { formatDateTime, formatDate, formatDurationHours } from '../../../utils/formatTime.js';
import { ROLES } from '../../../constants/index.js';

export const EmployeeDashboard = () => {
  const { user, role } = useSelector((state) => state.auth);
  const [page, setPage] = useState(1);
  const [selectedRecordForOT, setSelectedRecordForOT] = useState(null);
  const [selfieModalData, setSelfieModalData] = useState(null);

  const { data: todayRes, isLoading: isTodayLoading, refetch: refetchToday } = useGetTodayStatusQuery();
  const { data: historyRes, isLoading: isHistoryLoading } = useGetMyHistoryQuery({ page, limit: 10 });
  const { data: kpiRes, isLoading: isKpiLoading } = useGetKPIsQuery();

  const todayData = todayRes?.data;
  const historyData = historyRes?.data?.records || [];
  const pagination = historyRes?.data?.pagination;
  const kpis = kpiRes?.data;

  const historyColumns = [
    {
      header: 'Shift Date',
      accessor: 'date',
      cellClassName: 'font-mono text-xs tabular-nums text-[#1E293B]',
      render: (r) => formatDate(r.date)
    },
    {
      header: 'Punch In',
      cellClassName: 'font-mono text-xs tabular-nums',
      render: (r) => (
        <div className="flex items-center gap-2">
          <span>{formatDateTime(r.punchIn?.time)}</span>
          {r.punchIn?.selfieUrl && (
            <button
              onClick={() => setSelfieModalData({ record: r, type: 'in' })}
              className="text-[#64748B] hover:text-[#3B82F6]"
              title="Inspect Punch In Photo"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )
    },
    {
      header: 'Punch Out',
      cellClassName: 'font-mono text-xs tabular-nums',
      render: (r) => (
        <div className="flex items-center gap-2">
          <span>{formatDateTime(r.punchOut?.time)}</span>
          {r.punchOut?.selfieUrl && (
            <button
              onClick={() => setSelfieModalData({ record: r, type: 'out' })}
              className="text-[#64748B] hover:text-[#3B82F6]"
              title="Inspect Punch Out Photo"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )
    },
    {
      header: 'Duration',
      cellClassName: 'font-mono text-xs tabular-nums font-semibold',
      render: (r) => `${r.totalHours || 0} hrs`
    },
    {
      header: 'Shift Status',
      render: (r) => <Badge variant={r.shiftStatus}>{r.shiftStatus}</Badge>
    },
    {
      header: 'Audit Validation',
      render: (r) => <Badge variant={r.validationStatus}>{r.validationStatus}</Badge>
    },
    {
      header: 'Overtime',
      render: (r) => {
        if (r.overtimeStatus === 'Approved') {
          return <Badge variant="approved">Approved (+{r.overtimeHours}h)</Badge>;
        }
        if (r.overtimeStatus === 'Pending') {
          return <Badge variant="pending">Pending Review</Badge>;
        }
        if (r.overtimeStatus === 'Rejected') {
          return <Badge variant="rejected">Rejected</Badge>;
        }
        return (
          <Button
            variant="ghost"
            size="sm"
            className="text-[11px] h-7 px-2"
            icon={PlusCircle}
            onClick={() => setSelectedRecordForOT(r)}
          >
            Claim OT
          </Button>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E293B] tracking-tight">
            Welcome, {user?.name || 'Employee'}
          </h1>
          <p className="text-xs text-[#64748B]">
            {user?.department} • Audited daily shift attendance dashboard
          </p>
        </div>
      </div>

      {/* Real-Time Operational Notification Alerts */}
      <div className="space-y-2.5">
        {/* Missed Punch In Alert for Employees */}
        {role === ROLES.EMPLOYEE && !todayData?.hasPunchedIn && !isTodayLoading && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] rounded-lg text-xs shadow-2xs gap-2.5">
            <div className="flex items-start sm:items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <strong className="font-semibold uppercase tracking-wider text-[11px]">Missed Punch Alert:</strong>
                <span className="ml-1.5 text-xs">
                  You have not clocked in for today's shift yet. Shift hours will remain uncounted until you punch in with live camera verification.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Overtime Approval / Rejection Notification Alert */}
        {role === ROLES.EMPLOYEE &&
          historyData.some((r) => r.overtimeStatus === 'Approved' || r.overtimeStatus === 'Rejected') && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] rounded-lg text-xs shadow-2xs gap-2.5">
              <div className="flex items-start sm:items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <strong className="font-semibold uppercase tracking-wider text-[11px]">Overtime Status Alert:</strong>
                  <span className="ml-1.5 text-xs">
                    Your recent overtime request for{' '}
                    {formatDate(
                      historyData.find((r) => r.overtimeStatus === 'Approved' || r.overtimeStatus === 'Rejected')?.date
                    )}{' '}
                    has been reviewed and marked as{' '}
                    <strong className="uppercase">
                      {historyData.find((r) => r.overtimeStatus === 'Approved' || r.overtimeStatus === 'Rejected')?.overtimeStatus}
                    </strong>
                    .
                  </span>
                </div>
              </div>
              <Link to="/overtime" className="font-semibold text-xs text-[#065F46] underline hover:text-[#047857] shrink-0 self-start sm:self-auto">
                View Overtime &rarr;
              </Link>
            </div>
          )}

        {/* Manager/Admin Pending Review Alert */}
        {(role === ROLES.MANAGER || role === ROLES.ADMIN) && (kpis?.metrics?.pendingValidations || 0) > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] rounded-lg text-xs shadow-2xs gap-2.5">
            <div className="flex items-start sm:items-center gap-2.5">
              <Bell className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <strong className="font-semibold uppercase tracking-wider text-[11px]">Supervisor Action Alert:</strong>
                <span className="ml-1.5 text-xs">
                  There are <strong>{kpis.metrics.pendingValidations}</strong> shift attendance records awaiting verification in the queue.
                </span>
              </div>
            </div>
            <Link to="/validation" className="font-semibold text-xs text-[#1D4ED8] underline hover:text-[#1E40AF] shrink-0 self-start sm:self-auto">
              Review Queue &rarr;
            </Link>
          </div>
        )}
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {role === ROLES.EMPLOYEE ? (
          <>
            <StatCard
              title="Monthly Hours"
              value={`${kpis?.metrics?.monthlyHours || 0}h`}
              subtitle="Logged across recent shifts"
              icon={Clock}
            />
            <StatCard
              title="Completed Shifts"
              value={kpis?.metrics?.completedShifts || 0}
              subtitle="Full 8h+ standard shifts"
              icon={CheckCircle}
            />
            <StatCard
              title="Valid Records"
              value={kpis?.metrics?.validAttendances || 0}
              subtitle="Supervisor photo verified"
              icon={CheckCircle}
            />
            <StatCard
              title="Today's Shift"
              value={todayData?.hasPunchedOut ? 'Completed' : todayData?.hasPunchedIn ? 'Active' : 'Pending'}
              subtitle={todayData?.hasPunchedIn ? 'Checked in' : 'Awaiting punch in'}
              icon={Calendar}
            />
          </>
        ) : (
          <>
            <StatCard
              title="Present Today"
              value={kpis?.metrics?.totalPresentToday || 0}
              subtitle="Staff actively checked in"
              icon={Clock}
            />
            <StatCard
              title="Completed Shifts"
              value={kpis?.metrics?.completedShiftsToday || 0}
              subtitle="Full shifts finished today"
              icon={CheckCircle}
            />
            <StatCard
              title="Incomplete Shifts"
              value={kpis?.metrics?.incompleteShiftsToday || 0}
              subtitle="< 8 hours shift duration"
              icon={AlertTriangle}
            />
            <StatCard
              title="Pending Validations"
              value={kpis?.metrics?.pendingValidations || 0}
              subtitle="Awaiting supervisor sign-off"
              icon={Calendar}
            />
          </>
        )}
      </div>

      {/* Live Punch Operational Center */}
      <TodayPunchCard
        todayData={todayData}
        isLoading={isTodayLoading}
        refetch={refetchToday}
      />

      {/* Recent Attendance History Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#64748B]">
              My Recent Shift Audit Trail
            </h3>
            <p className="text-xs text-[#64748B]">
              Historical records of your daily timestamps, durations, and supervisor reviews.
            </p>
          </div>
        </div>

        <DataTable
          columns={historyColumns}
          data={historyData}
          isLoading={isHistoryLoading}
          emptyMessage="No attendance records logged yet. Use the Punch In button above to begin tracking."
          pagination={pagination}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>

      {/* Overtime Request Modal */}
      {selectedRecordForOT && (
        <RequestOvertimeModal
          isOpen={Boolean(selectedRecordForOT)}
          onClose={() => setSelectedRecordForOT(null)}
          attendanceRecord={selectedRecordForOT}
        />
      )}

      {/* Selfie Inspector Modal */}
      {selfieModalData && (
        <SelfiePreviewModal
          isOpen={Boolean(selfieModalData)}
          onClose={() => setSelfieModalData(null)}
          attendance={selfieModalData.record}
          type={selfieModalData.type}
        />
      )}
    </div>
  );
};
