import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Modal } from '../../../components/common/Modal.jsx';
import { Button } from '../../../components/common/Button.jsx';
import { LiveCameraCapture } from '../../../components/media/LiveCameraCapture.jsx';
import { LocationFetcher } from '../../../components/media/LocationFetcher.jsx';
import { usePunchInMutation, usePunchOutMutation } from '../attendanceApi.js';

export const PunchModal = ({ isOpen, onClose, type = 'in' }) => {
  const [coordinates, setCoordinates] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);

  const [punchIn, { isLoading: isPunchingIn }] = usePunchInMutation();
  const [punchOut, { isLoading: isPunchingOut }] = usePunchOutMutation();

  const isSubmitting = isPunchingIn || isPunchingOut;
  const isPunchIn = type === 'in';

  const handleCapture = (file) => {
    setSelfieFile(file);
  };

  const handleClear = () => {
    setSelfieFile(null);
  };

  const handleLocationAcquired = (coords) => {
    setCoordinates(coords);
  };

  const handleSubmit = async () => {
    if (!coordinates) {
      toast.error('Waiting for GPS coordinates. Please allow location access.');
      return;
    }

    if (!selfieFile) {
      toast.error('Please capture a live webcam selfie to verify attendance.');
      return;
    }

    const formData = new FormData();
    formData.append('latitude', coordinates.latitude.toString());
    formData.append('longitude', coordinates.longitude.toString());
    formData.append('selfie', selfieFile);

    try {
      if (isPunchIn) {
        const res = await punchIn(formData).unwrap();
        toast.success(res.message || 'Punched in successfully!');
      } else {
        const res = await punchOut(formData).unwrap();
        toast.success(res.message || 'Punched out successfully!');
      }
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'Failed to submit punch record.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isPunchIn ? 'Shift Attendance: Punch In' : 'Shift Attendance: Punch Out'}
      subtitle="WebRTC live facial verification and GPS geofence auditing"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* GPS Location Fetcher */}
        <LocationFetcher onLocationAcquired={handleLocationAcquired} />

        {/* Live Camera Capture (NO FILE INPUT) */}
        <div className="pt-2">
          <LiveCameraCapture
            onCapture={handleCapture}
            onClear={handleClear}
            isCaptured={Boolean(selfieFile)}
          />
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-4 border-t border-[#E2E8F0]">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto justify-center"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant={isPunchIn ? 'punchIn' : 'punchOut'}
            size="md"
            isLoading={isSubmitting}
            disabled={!selfieFile || !coordinates}
            onClick={handleSubmit}
            className="w-full sm:w-auto justify-center"
          >
            {isPunchIn ? 'Confirm Punch In' : 'Confirm Punch Out'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
