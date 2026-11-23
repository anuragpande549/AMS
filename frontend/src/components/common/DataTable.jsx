import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, LayoutGrid, Table as TableIcon } from 'lucide-react';
import { Spinner } from './Spinner.jsx';

export const DataTable = ({
  columns,
  data = [],
  isLoading = false,
  emptyMessage = 'No records found',
  pagination,
  onPageChange
}) => {
  // Mobile view mode: 'cards' or 'table' (defaults to cards on mobile for best touch UX)
  const [mobileView, setMobileView] = useState('cards');

  // Helper to separate actions from data columns for card footer
  const actionColumn = columns.find(
    (col) =>
      col.header === 'Actions' ||
      col.header === 'Action' ||
      col.header.toLowerCase().includes('review') ||
      col.header.toLowerCase().includes('decision') ||
      col.header.toLowerCase().includes('action')
  );
  const nonActionColumns = columns.filter(
    (col) => col !== actionColumn
  );

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden shadow-[0_1px_3px_0_rgba(15,23,42,0.05)]">
      {/* Mobile View Toggle Bar (Only visible on screens < 768px) */}
      <div className="md:hidden flex items-center justify-between px-3.5 py-2 bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
          {data.length} {data.length === 1 ? 'record' : 'records'} found
        </span>
        <div className="flex items-center gap-1 bg-white border border-[#E2E8F0] rounded p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => setMobileView('cards')}
            className={`p-1 rounded flex items-center gap-1 text-[11px] font-medium transition-colors ${
              mobileView === 'cards'
                ? 'bg-[#1E293B] text-white'
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
            title="Card View (Mobile Optimized)"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileView('table')}
            className={`p-1 rounded flex items-center gap-1 text-[11px] font-medium transition-colors ${
              mobileView === 'table'
                ? 'bg-[#1E293B] text-white'
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
            title="Scrollable Table View"
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* 1. Mobile Cards View (< 768px and mobileView === 'cards') */}
      {mobileView === 'cards' && (
        <div className="block md:hidden divide-y divide-[#F1F5F9]">
          {isLoading ? (
            <div className="px-4 py-12 text-center text-[#64748B]">
              <div className="flex flex-col items-center justify-center gap-2">
                <Spinner size="md" color="cobalt" />
                <span className="text-xs">Loading operational telemetry...</span>
              </div>
            </div>
          ) : data.length === 0 ? (
            <div className="px-4 py-10 text-center text-[#64748B]">
              <p className="text-xs font-medium">{emptyMessage}</p>
            </div>
          ) : (
            data.map((row, rowIdx) => {
              // Primary header is the first column
              const primaryCol = nonActionColumns[0];
              // Status column (if any) to put at top-right
              const statusCol = nonActionColumns.find((c) =>
                ['shift status', 'status', 'account status', 'validation', 'validation status', 'audit validation', 'role'].includes(
                  c.header?.toLowerCase()
                )
              );
              // Remaining columns for key-value grid
              const detailColumns = nonActionColumns.filter(
                (c) => c !== primaryCol && c !== statusCol
              );

              return (
                <div
                  key={row._id || rowIdx}
                  className="p-3.5 sm:p-4 bg-white hover:bg-[#F8FAFC] transition-colors space-y-2.5"
                >
                  {/* Card Header: Primary Label on left, Status Badge on right */}
                  <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#F1F5F9]">
                    <div className="flex-1 min-w-0">
                      {primaryCol && (
                        <div className="text-xs text-[#1E293B]">
                          {primaryCol.render ? primaryCol.render(row) : row[primaryCol.accessor]}
                        </div>
                      )}
                    </div>
                    {statusCol && (
                      <div className="shrink-0">
                        {statusCol.render ? statusCol.render(row) : row[statusCol.accessor]}
                      </div>
                    )}
                  </div>

                  {/* Card Details: 2-Column Responsive Metadata Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {detailColumns.map((col, cIdx) => (
                      <div key={cIdx} className="space-y-0.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] block truncate">
                          {col.header}
                        </span>
                        <div className="text-[#1E293B] text-xs">
                          {col.render ? col.render(row) : row[col.accessor] || '—'}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Card Footer: Actions */}
                  {actionColumn && (
                    <div className="pt-2.5 border-t border-[#F1F5F9] flex items-center justify-end gap-2">
                      {actionColumn.render ? actionColumn.render(row) : row[actionColumn.accessor]}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 2. Desktop & Tablet Table View (or mobile if user toggles 'table') */}
      <div className={`${mobileView === 'cards' ? 'hidden md:block' : 'block'} overflow-x-auto scroll-smooth overscroll-x-contain`}>
        <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-3.5 sm:px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#64748B] select-none whitespace-nowrap ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] text-sm text-[#1E293B]">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-[#64748B]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Spinner size="md" color="cobalt" />
                    <span className="text-xs">Loading operational telemetry...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-[#64748B]">
                  <p className="text-sm font-medium">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={row._id || rowIdx}
                  className="hover:bg-[#F8FAFC] transition-colors h-12"
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`px-3.5 sm:px-4 py-3 ${col.cellClassName || ''}`}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] text-xs text-[#64748B]">
          <div className="text-center sm:text-left">
            Showing Page <span className="font-semibold text-[#1E293B] tabular-nums">{pagination.page}</span> of{' '}
            <span className="font-semibold text-[#1E293B] tabular-nums">{pagination.totalPages}</span> ({pagination.total} records)
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-2.5 py-1 min-h-[32px] rounded border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden xs:inline">Prev</span>
            </button>
            <span className="px-2 font-mono font-semibold text-[#1E293B]">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-2.5 py-1 min-h-[32px] rounded border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              aria-label="Next Page"
            >
              <span className="hidden xs:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
