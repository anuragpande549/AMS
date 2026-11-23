import React, { useState } from 'react';
import { Modal } from '../../../components/common/Modal.jsx';
import { Button } from '../../../components/common/Button.jsx';

export const RemarksModal = ({
  isOpen,
  onClose,
  title = 'Add Validation Remarks',
  subtitle = 'Provide mandatory feedback or notes for audit history',
  confirmLabel = 'Confirm',
  confirmVariant = 'primary',
  onConfirm,
  isLoading = false
}) => {
  const [remarks, setRemarks] = useState('');

  const handleConfirm = () => {
    onConfirm(remarks);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} subtitle={subtitle} maxWidth="max-w-md">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">
            Audit Remarks / Notes
          </label>
          <textarea
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="e.g. Validated face matches employee badge; GPS inside main entrance."
            className="w-full text-xs p-2.5 rounded border border-[#E2E8F0] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none"
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-[#E2E8F0]">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={isLoading} className="w-full sm:w-auto justify-center">
            Cancel
          </Button>
          <Button
            variant={confirmVariant}
            size="sm"
            isLoading={isLoading}
            onClick={handleConfirm}
            className="w-full sm:w-auto justify-center"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
