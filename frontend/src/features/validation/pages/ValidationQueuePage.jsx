import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Eye, ShieldCheck, Filter } from 'lucide-react';
import { DataTable } from '../../../components/common/DataTable.jsx';
import { Badge } from '../../../components/common/Badge.jsx';
import { Button } from '../../../components/common/Button.jsx';
import { SelfiePreviewModal } from '../components/SelfiePreviewModal.jsx';
import { RemarksModal } from '../components/RemarksModal.jsx';
import { useGetValidationQueueQuery, useValidateAttendanceMutation } from '../../attendance/attendanceApi.js';
import { formatDateTime, formatDate, formatDistance } from '../../../utils/formatTime.js';
import { VALIDATION_STATUS } from '../../../constants/index.js';

export const ValidationQueuePage = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [selfieModalData, setSelfieModalData] = useState(null);
  const [actionModalData, setActionModalData] = useState(null); // { id, newStatus }

  const { data: queueRes, isLoading, refetch } = useGetValidationQueueQuery({
    page,
    limit: 10,
    status: statusFilter
  });

  const [validateAttendance, { isLoading: isUpdating }] = useValidateAttendanceMutation();

  const records = queueRes?.data?.records || [];
  const pagination = queueRes?.data?.pagination;

  const handleConfirmValidation = async (remarks) => {
    if (!actionModalData) return;
    try {
      const res = await validateAttendance({
        id: actionModalData.id,
        validationStatus: actionModalData.newStatus,
        remarks
      }).unwrap();

      toast.success(res.message || `Attendance marked as ${actionModalData.newStatus}`);
      setActionModalData(null);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'Failed to update validation status');
    }
  };

  const columns = [
    {
      header: 'Employee',
      render: (r) => (
        <div>
          <span className="font-semibold text-xs text-[#1E293B] block">{r.userId?.name || 'Unknown'}</span>
          <span className="text-[11px] text-[#64748B]">{r.userId?.department || 'Operations'}</span>
        </div>
      )
    },
    {
      header: 'Shift Date',
      accessor: 'date',
      cellClassName: 'font-mono text-xs tabular-nums',
      render: (r) => formatDate(r.date)
    },
    {
      header: 'Punch In & Selfie',
      render: (r) => (
        <div className="flex items-center gap-2">
          {r.punchIn?.selfieUrl ? (
            <button
              onClick={() => setSelfieModalData({ record: r, type: 'in' })}
              className="relative group cursor-pointer"
              title="Click to expand selfie"
            >
              <img
                src={r.punchIn.selfieUrl}
                alt="Punch in selfie"
                className="w-8 h-8 rounded border border-[#E2E8F0] object-cover hover:ring-2 hover:ring-[#3B82F6]"
              />
              <div className="absolute inset-0 bg-black/30 rounded opacity-0 group-hover:opacity-100 flex items-center justify-center text-white">
                <Eye className="w-3.5 h-3.5" />
              </div>
            </button>
          ) : (
            <span className="text-xs text-[#94A3B8]">No selfie</span>
          )}
          <div className="text-xs">
            <span className="font-mono tabular-nums block">{formatDateTime(r.punchIn?.time)}</span>
            <span className="text-[10px] text-[#64748B]">
              {r.punchIn?.isWithinGeofence ? '✓ Geofence Verified' : '⚠ Outside Geofence'}
            </span>
          </div>
        </div>
      )
    },
    {
      header: 'Punch Out & Selfie',
      render: (r) => (
        <div className="flex items-center gap-2">
          {r.punchOut?.selfieUrl ? (
            <button
              onClick={() => setSelfieModalData({ record: r, type: 'out' })}
              className="relative group cursor-pointer"
              title="Click to expand selfie"
            >
              <img
                src={r.punchOut.selfieUrl}
                alt="Punch out selfie"
                className="w-8 h-8 rounded border border-[#E2E8F0] object-cover hover:ring-2 hover:ring-[#3B82F6]"
              />
              <div className="absolute inset-0 bg-black/30 rounded opacity-0 group-hover:opacity-100 flex items-center justify-center text-white">
                <Eye className="w-3.5 h-3.5" />
              </div>
            </button>
          ) : (
            <span className="text-xs text-[#94A3B8]">Not punched out</span>
          )}
          <div className="text-xs">
            <span className="font-mono tabular-nums block">{formatDateTime(r.punchOut?.time)}</span>
            <span className="text-[10px] text-[#64748B]">{r.totalHours ? `${r.totalHours} hrs` : '—'}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Validation Status',
      render: (r) => (
        <div className="space-y-0.5">
          <Badge variant={r.validationStatus}>{r.validationStatus}</Badge>
          {r.validationRemarks && (
            <p className="text-[10px] text-[#64748B] italic max-w-xs truncate" title={r.validationRemarks}>
              "{r.validationRemarks}"
            </p>
          )}
        </div>
      )
    },
    {
      header: 'Supervisor Review',
      cellClassName: 'text-right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="text-[11px] h-7 px-2 text-[#065F46] hover:bg-[#ECFDF5] border border-[#A7F3D0]"
            icon={CheckCircle}
            onClick={() => setActionModalData({ id: r._id, newStatus: VALIDATION_STATUS.VALID })}
          >
            Valid
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-[11px] h-7 px-2 text-[#991B1B] hover:bg-[#FEF2F2] border border-[#FECACA]"
            icon={XCircle}
            onClick={() => setActionModalData({ id: r._id, newStatus: VALIDATION_STATUS.INVALID })}
          >
            Invalid
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E293B] tracking-tight">
            Attendance Validation Queue
          </h1>
          <p className="text-xs text-[#64748B]">
            Audit employee live selfies, GPS coordinates, and mark validity
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center bg-white p-1 border border-[#E2E8F0] rounded-lg overflow-x-auto w-full sm:w-auto shrink-0">
          {['Pending', 'Valid', 'Invalid', 'all'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer capitalize shrink-0 whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-[#1E293B] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9]'
              }`}
            >
              {status === 'all' ? 'All Records' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Validation Table */}
      <DataTable
        columns={columns}
        data={records}
        isLoading={isLoading}
        emptyMessage={`No ${statusFilter.toLowerCase()} attendance records found in validation queue.`}
        pagination={pagination}
        onPageChange={(newPage) => setPage(newPage)}
      />

      {/* Inspection Modal for High-Res Live Selfie */}
      {selfieModalData && (
        <SelfiePreviewModal
          isOpen={Boolean(selfieModalData)}
          onClose={() => setSelfieModalData(null)}
          attendance={selfieModalData.record}
          type={selfieModalData.type}
        />
      )}

      {/* Remarks Confirmation Modal */}
      {actionModalData && (
        <RemarksModal
          isOpen={Boolean(actionModalData)}
          onClose={() => setActionModalData(null)}
          title={`Mark Record as ${actionModalData.newStatus}`}
          subtitle="Add mandatory compliance remarks to log this audit decision"
          confirmLabel={`Confirm ${actionModalData.newStatus}`}
          confirmVariant={actionModalData.newStatus === VALIDATION_STATUS.VALID ? 'primary' : 'destructive'}
          isLoading={isUpdating}
          onConfirm={handleConfirmValidation}
        />
      )}
    </div>
  );
};
