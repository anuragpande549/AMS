import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Download, Calendar, Filter, FileSpreadsheet, Printer } from 'lucide-react';
import { DataTable } from '../../../components/common/DataTable.jsx';
import { Badge } from '../../../components/common/Badge.jsx';
import { Button } from '../../../components/common/Button.jsx';
import { useGetDailyReportQuery, useLazyGetExportDataQuery } from '../reportsApi.js';
import { formatDate, formatDateTime } from '../../../utils/formatTime.js';
import { downloadCsv } from '../../../utils/exportCsv.js';

export const ReportsPage = () => {
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('all');

  const { data: reportRes, isLoading } = useGetDailyReportQuery({
    page,
    limit: 10,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    status: status === 'all' ? undefined : status
  });

  const [triggerExport, { isFetching: isExporting }] = useLazyGetExportDataQuery();

  const records = reportRes?.data?.records || [];
  const pagination = reportRes?.data?.pagination;

  const handleExportCsv = async () => {
    try {
      const res = await triggerExport({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        status: status === 'all' ? undefined : status
      }).unwrap();

      if (res?.data && res.data.length) {
        downloadCsv(res.data, `AMS_Attendance_Report_${new Date().toISOString().split('T')[0]}.csv`);
        toast.success(`Exported ${res.data.length} records to CSV!`);
      } else {
        toast.error('No matching records found for export');
      }
    } catch (err) {
      toast.error('Failed to export data');
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
      header: 'Employee Name',
      render: (r) => (
        <div>
          <span className="font-semibold text-xs text-[#1E293B] block">{r.userId?.name || 'Unknown'}</span>
          <span className="text-[11px] text-[#64748B]">{r.userId?.email}</span>
        </div>
      )
    },
    {
      header: 'Punch In',
      cellClassName: 'font-mono text-xs tabular-nums',
      render: (r) => formatDateTime(r.punchIn?.time)
    },
    {
      header: 'Punch Out',
      cellClassName: 'font-mono text-xs tabular-nums',
      render: (r) => formatDateTime(r.punchOut?.time)
    },
    {
      header: 'Total Hours',
      cellClassName: 'font-mono text-xs tabular-nums font-semibold',
      render: (r) => `${r.totalHours || 0} hrs`
    },
    {
      header: 'Shift Status',
      render: (r) => <Badge variant={r.shiftStatus}>{r.shiftStatus}</Badge>
    },
    {
      header: 'Validation',
      render: (r) => <Badge variant={r.validationStatus}>{r.validationStatus}</Badge>
    },
    {
      header: 'Overtime',
      render: (r) => (
        <span className="text-xs font-mono tabular-nums">
          {r.overtimeHours ? `+${r.overtimeHours}h` : '0h'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E293B] tracking-tight">
            Daily Attendance & Audit Reports
          </h1>
          <p className="text-xs text-[#64748B]">
            Comprehensive shift analytics, timestamps, geofence audit compliance, and export tools
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="md"
            icon={Printer}
            className="w-full sm:w-auto justify-center"
            onClick={() => window.print()}
            title="Print or Save Report as PDF"
          >
            Export PDF
          </Button>
          <Button
            variant="secondary"
            size="md"
            icon={Download}
            className="w-full sm:w-auto justify-center"
            isLoading={isExporting}
            onClick={handleExportCsv}
            title="Export CSV spreadsheet for Excel"
          >
            Export CSV / Excel
          </Button>
        </div>
      </div>

      {/* Date & Status Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 border border-[#E2E8F0] rounded-lg shadow-xs flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 text-xs">
        <div className="flex items-center justify-between sm:justify-start gap-2">
          <span className="text-[#64748B] font-semibold uppercase tracking-wider text-[11px] shrink-0">From:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setPage(1);
            }}
            className="p-1.5 border border-[#E2E8F0] rounded text-xs bg-white text-[#1E293B] w-full sm:w-auto"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-2">
          <span className="text-[#64748B] font-semibold uppercase tracking-wider text-[11px] shrink-0">To:</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPage(1);
            }}
            className="p-1.5 border border-[#E2E8F0] rounded text-xs bg-white text-[#1E293B] w-full sm:w-auto"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-2">
          <span className="text-[#64748B] font-semibold uppercase tracking-wider text-[11px] shrink-0">Shift Status:</span>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="p-1.5 border border-[#E2E8F0] rounded text-xs bg-white text-[#1E293B] w-full sm:w-auto"
          >
            <option value="all">All Shifts</option>
            <option value="Completed">Completed (&gt;= 8h)</option>
            <option value="Incomplete">Incomplete (&lt; 8h)</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {(startDate || endDate || status !== 'all') && (
          <button
            onClick={() => {
              setStartDate('');
              setEndDate('');
              setStatus('all');
              setPage(1);
            }}
            className="text-xs text-[#EF4444] hover:underline self-end sm:self-auto cursor-pointer font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={records}
        isLoading={isLoading}
        emptyMessage="No attendance records match the specified filters."
        pagination={pagination}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
};
