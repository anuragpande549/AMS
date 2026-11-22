import React, { useState, useEffect } from 'react';
import { Clock, MapPin, CheckCircle, AlertCircle, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Button } from '../../../components/common/Button.jsx';
import { Badge } from '../../../components/common/Badge.jsx';
import { PunchModal } from './PunchModal.jsx';
import { formatDateTime, formatDurationHours, formatDistance } from '../../../utils/formatTime.js';

export const TodayPunchCard = ({ todayData, isLoading, refetch }) => {
  const [modalType, setModalType] = useState(null); // 'in' | 'out' | null
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hasPunchedIn = Boolean(todayData?.hasPunchedIn);
  const hasPunchedOut = Boolean(todayData?.hasPunchedOut);
  const record = todayData?.record;

  return (
    <>
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 shadow-[0_1px_3px_0_rgba(15,23,42,0.05)]">
        {/* Top Header: Title and Digital Tabular Clock */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#E2E8F0] gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
              <h2 className="text-base font-semibold text-[#1E293B]">Today's Shift Operational Status</h2>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Standard shift compliance duration: 8.0 hours
            </p>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#1E293B] tabular-nums tracking-tight">
              {currentTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
              })}
            </div>
            <span className="text-[11px] uppercase tracking-wider text-[#64748B] font-semibold">
              {currentTime.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>

        {/* Two Column Punch Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
          {/* Punch-In Status Panel */}
          <div className={`p-4 rounded-lg border transition-all ${hasPunchedIn ? 'bg-[#F8FAFC] border-[#E2E8F0]' : 'bg-[#F1F5F9]/50 border-dashed border-[#CBD5E1]'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#ECFDF5] text-[#065F46] flex items-center justify-center">
                  <ArrowDownLeft className="w-4 h-4 text-[#10B981]" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Punch-In Event
                </span>
              </div>
              {hasPunchedIn ? (
                <Badge variant="present">Punched In</Badge>
              ) : (
                <Badge variant="incomplete">Not Punched</Badge>
              )}
            </div>

            {hasPunchedIn ? (
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#64748B]">Punch In Time:</span>
                  <span className="text-sm font-semibold font-mono tabular-nums text-[#1E293B]">
                    {formatDateTime(record?.punchIn?.time)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#64748B]">Geofence Status:</span>
                  {record?.punchIn?.isWithinGeofence ? (
                    <Badge variant="completed" showDot={false}>Within Office ({formatDistance(record?.punchIn?.distanceMeters)})</Badge>
                  ) : (
                    <Badge variant="incomplete" showDot={false}>Outside Office ({formatDistance(record?.punchIn?.distanceMeters)})</Badge>
                  )}
                </div>

                {record?.punchIn?.selfieUrl && (
                  <div className="pt-2 flex items-center gap-3">
                    <img
                      src={record.punchIn.selfieUrl}
                      alt="Punch in verified selfie"
                      className="w-10 h-10 rounded border border-[#E2E8F0] object-cover"
                    />
                    <div className="text-[11px] text-[#64748B]">
                      <span className="font-medium text-[#1E293B]">Live Selfie Verified</span>
                      <p>Lat: {record.punchIn.location.latitude.toFixed(4)}, Lon: {record.punchIn.location.longitude.toFixed(4)}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#64748B] py-3">
                No punch-in recorded yet for today. Capture live photo & location to begin shift.
              </p>
            )}
          </div>

          {/* Punch-Out Status Panel */}
          <div className={`p-4 rounded-lg border transition-all ${hasPunchedOut ? 'bg-[#F8FAFC] border-[#E2E8F0]' : 'bg-[#F1F5F9]/50 border-dashed border-[#CBD5E1]'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#FEF2F2] text-[#991B1B] flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 text-[#EF4444]" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Punch-Out Event
                </span>
              </div>
              {hasPunchedOut ? (
                <Badge variant={record?.shiftStatus === 'Completed' ? 'completed' : 'incomplete'}>
                  {record?.shiftStatus} ({formatDurationHours(record?.totalHours)})
                </Badge>
              ) : (
                <Badge variant="pending">Awaiting Checkout</Badge>
              )}
            </div>

            {hasPunchedOut ? (
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#64748B]">Punch Out Time:</span>
                  <span className="text-sm font-semibold font-mono tabular-nums text-[#1E293B]">
                    {formatDateTime(record?.punchOut?.time)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#64748B]">Total Working Hours:</span>
                  <span className="text-sm font-bold font-mono tabular-nums text-[#1E293B]">
                    {record?.totalHours} hrs
                  </span>
                </div>

                {record?.punchOut?.selfieUrl && (
                  <div className="pt-2 flex items-center gap-3">
                    <img
                      src={record.punchOut.selfieUrl}
                      alt="Punch out verified selfie"
                      className="w-10 h-10 rounded border border-[#E2E8F0] object-cover"
                    />
                    <div className="text-[11px] text-[#64748B]">
                      <span className="font-medium text-[#1E293B]">Punch Out Verified</span>
                      <p>Shift: {record?.shiftStatus}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#64748B] py-3">
                {hasPunchedIn
                  ? 'Active shift in progress. Punch out when completing your shift to compute total duration.'
                  : 'Punch in first to start shift tracking.'}
              </p>
            )}
          </div>
        </div>

        {/* Primary Action Button Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
          {!hasPunchedIn && (
            <Button
              type="button"
              variant="punchIn"
              className="w-full sm:w-auto"
              onClick={() => setModalType('in')}
            >
              Punch In (Start Shift)
            </Button>
          )}

          {hasPunchedIn && !hasPunchedOut && (
            <Button
              type="button"
              variant="punchOut"
              className="w-full sm:w-auto"
              onClick={() => setModalType('out')}
            >
              Punch Out (End Shift)
            </Button>
          )}

          {hasPunchedIn && hasPunchedOut && (
            <div className="flex items-center gap-2 text-xs font-semibold text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] px-4 py-2.5 rounded">
              <CheckCircle className="w-4 h-4 text-[#10B981]" />
              <span>Today's shift lifecycle is complete. Attendance submitted for audit.</span>
            </div>
          )}
        </div>
      </div>

      {/* Punch In / Out Camera & Location Modal */}
      {modalType && (
        <PunchModal
          isOpen={Boolean(modalType)}
          onClose={() => setModalType(null)}
          type={modalType}
        />
      )}
    </>
  );
};
