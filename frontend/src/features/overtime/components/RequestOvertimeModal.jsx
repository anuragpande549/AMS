import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Modal } from '../../../components/common/Modal.jsx';
import { Button } from '../../../components/common/Button.jsx';
import { useRequestOvertimeMutation } from '../overtimeApi.js';

export const RequestOvertimeModal = ({ isOpen, onClose, attendanceRecord }) => {
  const [hours, setHours] = useState('1.5');
  const [reason, setReason] = useState('');
  const [requestOvertime, { isLoading }] = useRequestOvertimeMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!attendanceRecord?._id) return;

    if (!reason.trim() || reason.trim().length < 5) {
      toast.error('Please enter a descriptive reason (at least 5 characters).');
      return;
    }

    try {
      const res = await requestOvertime({
        attendanceId: attendanceRecord._id,
        requestedHours: Number(hours),
        reason: reason.trim()
      }).unwrap();

      toast.success(res.message || 'Overtime request submitted for manager approval!');
      setReason('');
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'Failed to submit overtime request');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Overtime (OT) Approval"
      subtitle={`Shift Date: ${attendanceRecord?.date || 'Today'} (Logged: ${attendanceRecord?.totalHours || 0} hrs)`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">
            Requested Overtime Hours
          </label>
          <select
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="w-full text-xs p-2.5 rounded border border-[#E2E8F0] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 bg-white text-[#1E293B]"
          >
            <option value="0.5">0.5 hour (30 minutes)</option>
            <option value="1.0">1.0 hour</option>
            <option value="1.5">1.5 hours</option>
            <option value="2.0">2.0 hours</option>
            <option value="2.5">2.5 hours</option>
            <option value="3.0">3.0 hours</option>
            <option value="4.0">4.0 hours</option>
            <option value="5.0">5.0 hours</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">
            Business Reason / Task Description
          </label>
          <textarea
            rows={3}
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Critical deployment release and end-of-shift operational support handover."
            className="w-full text-xs p-2.5 rounded border border-[#E2E8F0] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
          <Button type="button" variant="secondary" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
            Submit OT Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};
