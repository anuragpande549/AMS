import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Spinner } from './Spinner.jsx';

export const DataTable = ({
  columns,
  data = [],
  isLoading = false,
  emptyMessage = 'No records found',
  pagination,
  onPageChange
}) => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden shadow-[0_1px_3px_0_rgba(15,23,42,0.05)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#64748B] select-none ${col.className || ''}`}
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
                    <td key={colIdx} className={`px-4 py-3 ${col.cellClassName || ''}`}>
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
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] text-xs text-[#64748B]">
          <div>
            Showing Page <span className="font-semibold text-[#1E293B] tabular-nums">{pagination.page}</span> of{' '}
            <span className="font-semibold text-[#1E293B] tabular-nums">{pagination.totalPages}</span> ({pagination.total} records)
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1 rounded border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-1 rounded border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
