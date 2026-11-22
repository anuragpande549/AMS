import React from 'react';
import { Modal } from '../../../components/common/Modal.jsx';
import { Badge } from '../../../components/common/Badge.jsx';
import { formatDateTime, formatDistance } from '../../../utils/formatTime.js';
import { MapPin, ShieldCheck, AlertCircle } from 'lucide-react';

export const SelfiePreviewModal = ({ isOpen, onClose, attendance, type = 'in' }) => {
  if (!attendance) return null;

  const event = type === 'in' ? attendance.punchIn : attendance.punchOut;
  const isPunchIn = type === 'in';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Live Selfie Verification — ${isPunchIn ? 'Punch In' : 'Punch Out'}`}
      subtitle={`Employee: ${attendance.userId?.name || 'Unknown'} (${attendance.userId?.department || 'Operations'})`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* High-Resolution Selfie Display */}
        <div className="relative aspect-4/3 w-full bg-[#0F172A] rounded-lg overflow-hidden border border-[#E2E8F0]">
          {event?.selfieUrl ? (
            <img
              src={event.selfieUrl}
              alt="Live captured attendance selfie"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-[#94A3B8]">
              No selfie image captured
            </div>
          )}
          <div className="absolute top-2 left-2">
            {event?.isWithinGeofence ? (
              <Badge variant="completed">Within Geofence</Badge>
            ) : (
              <Badge variant="incomplete">Outside Geofence</Badge>
            )}
          </div>
        </div>

        {/* Telemetry metadata */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded p-3 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-[#64748B]">Captured Timestamp:</span>
            <span className="font-semibold font-mono tabular-nums text-[#1E293B]">
              {formatDateTime(event?.time)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">GPS Coordinates:</span>
            <span className="font-mono tabular-nums text-[#1E293B]">
              {event?.location?.latitude?.toFixed(5)}, {event?.location?.longitude?.toFixed(5)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Distance From Office:</span>
            <span className="font-semibold font-mono tabular-nums text-[#1E293B]">
              {formatDistance(event?.distanceMeters)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Attendance Shift Status:</span>
            <span className="font-semibold text-[#1E293B]">{attendance.shiftStatus}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
