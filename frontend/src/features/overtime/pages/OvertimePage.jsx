import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import { DataTable } from '../../../components/common/DataTable.jsx';
import { Badge } from '../../../components/common/Badge.jsx';
import { Button } from '../../../components/common/Button.jsx';
import { RemarksModal } from '../../validation/components/RemarksModal.jsx';
import { useGetOvertimeRequestsQuery, useReviewOvertimeMutation } from '../overtimeApi.js';
import { formatDate, formatDateTime } from '../../../utils/formatTime.js';
import { ROLES, OT_STATUS } from '../../../constants/index.js';

export const OvertimePage = () => {
  const { role } = useSelector((state) => state.auth);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [reviewModalData, setReviewModalData] = useState(null); // { id, newStatus }

  const { data: otRes, isLoading } = useGetOvertimeRequestsQuery({
    page,
    limit: 10,
    status: statusFilter
  });

  const [reviewOvertime, { isLoading: isReviewing }] = useReviewOvertimeMutation();

  const requests = otRes?.data?.requests || [];
  const pagination = otRes?.data?.pagination;

  const handleReviewConfirm = async (remarks) => {
    if (!reviewModalData) return;
    try {
      const res = await reviewOvertime({
        id: reviewModalData.id,
        status: reviewModalData.newStatus,
        reviewRemarks: remarks
      }).unwrap();

      toast.success(res.message || `Overtime request ${reviewModalData.newStatus.toLowerCase()} successfully`);
      setReviewModalData(null);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'Failed to review overtime request');
    }
  };

  const columns = [
    {
      header: 'Shift Date',
      accessor: 'date',
      cellClassName: 'font-mono text-xs tabular-nums',
      render: (r) => formatDate(r.date)
    },
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
      header: 'Requested OT',
      cellClassName: 'font-mono text-xs tabular-nums font-semibold',
      render: (r) => `+${r.requestedHours} hrs`
    },
    {
      header: 'Reason',
      render: (r) => (
        <span className="text-xs text-[#475569] max-w-xs block truncate" title={r.reason}>
          {r.reason}
        </span>
      )
    },
    {
      header: 'Status',
      render: (r) => <Badge variant={r.status}>{r.status}</Badge>
    },
    {
      header: 'Review Notes',
      render: (r) => (
        <div className="text-xs">
          {r.reviewedBy ? (
            <div>
              <span className="text-[#64748B] text-[10px]">By {r.reviewedBy.name}</span>
              {r.reviewRemarks && <p className="italic text-[#1E293B] text-[11px]">"{r.reviewRemarks}"</p>}
            </div>
          ) : (
            <span className="text-[#94A3B8] text-[11px]">Awaiting supervisor review</span>
          )}
        </div>
      )
    }
  ];

  // If Manager or Admin, append action buttons
  if (role === ROLES.MANAGER || role === ROLES.ADMIN) {
    columns.push({
      header: 'Manager Decision',
      cellClassName: 'text-right',
      render: (r) => {
        if (r.status !== 'Pending') {
          return <span className="text-[11px] text-[#64748B]">Decision Recorded</span>;
        }
        return (
          <div className="flex items-center justify-end gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="text-[11px] h-7 px-2 text-[#065F46] hover:bg-[#ECFDF5] border border-[#A7F3D0]"
              icon={CheckCircle}
              onClick={() => setReviewModalData({ id: r._id, newStatus: OT_STATUS.APPROVED })}
            >
              Approve
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-[11px] h-7 px-2 text-[#991B1B] hover:bg-[#FEF2F2] border border-[#FECACA]"
              icon={XCircle}
              onClick={() => setReviewModalData({ id: r._id, newStatus: OT_STATUS.REJECTED })}
            >
              Reject
            </Button>
          </div>
        );
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E293B] tracking-tight">
            Overtime (OT) Workflow
          </h1>
          <p className="text-xs text-[#64748B]">
            {role === ROLES.EMPLOYEE
              ? 'Track submitted overtime requests and supervisor approvals'
              : 'Audit and approve/reject team overtime requests with remarks'}
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center bg-white p-1 border border-[#E2E8F0] rounded-lg">
          {['Pending', 'Approved', 'Rejected', 'all'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer capitalize ${
                statusFilter === status
                  ? 'bg-[#1E293B] text-white'
                  : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9]'
              }`}
            >
              {status === 'all' ? 'All Requests' : status}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={requests}
        isLoading={isLoading}
        emptyMessage={`No ${statusFilter.toLowerCase()} overtime requests found.`}
        pagination={pagination}
        onPageChange={(newPage) => setPage(newPage)}
      />

      {reviewModalData && (
        <RemarksModal
          isOpen={Boolean(reviewModalData)}
          onClose={() => setReviewModalData(null)}
          title={`${reviewModalData.newStatus} Overtime Request`}
          subtitle="Add audit remarks and confirmation for this overtime decision"
          confirmLabel={`Confirm ${reviewModalData.newStatus}`}
          confirmVariant={reviewModalData.newStatus === OT_STATUS.APPROVED ? 'primary' : 'destructive'}
          isLoading={isReviewing}
          onConfirm={handleReviewConfirm}
        />
      )}
    </div>
  );
};
