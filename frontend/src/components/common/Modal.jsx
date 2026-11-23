import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-lg' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 overscroll-contain">
      {/* Backdrop with touch dismiss */}
      <div
        className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Container */}
      <div
        className={`relative w-full ${maxWidth} bg-white border border-[#E2E8F0] rounded-xl sm:rounded-lg shadow-[0_20px_25px_-5px_rgba(15,23,42,0.1),0_8px_10px_-6px_rgba(15,23,42,0.04)] overflow-hidden z-10 flex flex-col max-h-[94vh] sm:max-h-[90vh] my-auto`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] shrink-0">
          <div className="pr-2 min-w-0">
            <h3 id="modal-title" className="text-sm sm:text-base font-semibold text-[#1E293B] truncate">
              {title}
            </h3>
            {subtitle && <p className="text-[11px] sm:text-xs text-[#64748B] mt-0.5 line-clamp-2">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 sm:p-1 min-w-[36px] min-h-[36px] rounded-md text-[#64748B] hover:text-[#1E293B] hover:bg-[#E2E8F0] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 overflow-y-auto overscroll-y-contain flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};
