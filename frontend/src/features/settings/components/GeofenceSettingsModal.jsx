import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { MapPin, Navigation, ShieldCheck, RefreshCw } from 'lucide-react';
import { Modal } from '../../../components/common/Modal.jsx';
import { Button } from '../../../components/common/Button.jsx';
import { Spinner } from '../../../components/common/Spinner.jsx';
import { useGetOfficeSettingsQuery, useUpdateOfficeSettingsMutation } from '../settingsApi.js';
import { formatDate } from '../../../utils/formatTime.js';

export const GeofenceSettingsModal = ({ isOpen, onClose }) => {
  const { data: settingsRes, isLoading: isFetching } = useGetOfficeSettingsQuery(undefined, {
    skip: !isOpen
  });
  const [updateSettings, { isLoading: isUpdating }] = useUpdateOfficeSettingsMutation();

  const [officeName, setOfficeName] = useState('Corporate Headquarters');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radiusMeters, setRadiusMeters] = useState('500');
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (settingsRes?.data) {
      setOfficeName(settingsRes.data.officeName || 'Corporate Headquarters');
      setLatitude(settingsRes.data.latitude?.toString() || '');
      setLongitude(settingsRes.data.longitude?.toString() || '');
      setRadiusMeters(settingsRes.data.radiusMeters?.toString() || '500');
    }
  }, [settingsRes]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
        setIsLocating(false);
        toast.success('Current GPS coordinates detected and filled!');
      },
      (err) => {
        setIsLocating(false);
        toast.error(`Unable to retrieve GPS: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const latNum = parseFloat(latitude);
    const lonNum = parseFloat(longitude);
    const radNum = parseInt(radiusMeters, 10);

    if (isNaN(latNum) || latNum < -90 || latNum > 90) {
      toast.error('Latitude must be a valid number between -90 and 90.');
      return;
    }
    if (isNaN(lonNum) || lonNum < -180 || lonNum > 180) {
      toast.error('Longitude must be a valid number between -180 and 180.');
      return;
    }
    if (isNaN(radNum) || radNum < 10 || radNum > 50000) {
      toast.error('Geofence radius must be between 10 and 50,000 meters.');
      return;
    }

    try {
      await updateSettings({
        officeName: officeName.trim(),
        latitude: latNum,
        longitude: lonNum,
        radiusMeters: radNum
      }).unwrap();

      toast.success('Default office geofence coordinates updated successfully!');
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'Failed to update geofence coordinates');
    }
  };

  const updatedBy = settingsRes?.data?.updatedBy;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Office Geofence & Location Settings"
      subtitle="Configure default office coordinates and adherence radius for punch-in validation"
      maxWidth="max-w-md"
    >
      {isFetching ? (
        <div className="py-8 flex flex-col items-center justify-center gap-2">
          <Spinner size="md" color="cobalt" />
          <span className="text-xs text-[#64748B]">Loading active geofence...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
              Office Facility Name
            </label>
            <input
              type="text"
              required
              value={officeName}
              onChange={(e) => setOfficeName(e.target.value)}
              placeholder="e.g. Corporate Headquarters"
              className="w-full text-xs p-2.5 rounded border border-[#E2E8F0] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none"
            />
          </div>

          {/* Quick GPS Auto-fill button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-[#F0F9FF] border border-[#BAE6FD] rounded text-xs gap-2">
            <div className="flex items-center gap-2 text-[#075985]">
              <Navigation className="w-4 h-4 text-[#0EA5E9] shrink-0" />
              <span className="font-medium text-[11px]">Auto-detect coordinates:</span>
            </div>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="flex items-center justify-center gap-1 px-2.5 py-1 bg-white border border-[#BAE6FD] text-[#075985] hover:bg-[#F0F9FF] rounded font-semibold text-[11px] shadow-2xs transition-colors cursor-pointer disabled:opacity-50 w-full sm:w-auto"
            >
              {isLocating ? <Spinner size="sm" color="cobalt" /> : <RefreshCw className="w-3 h-3" />}
              <span>{isLocating ? 'Acquiring Fix...' : 'Use My Current GPS'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                Office Latitude
              </label>
              <input
                type="number"
                step="any"
                required
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="28.6139"
                className="w-full text-xs p-2.5 rounded border border-[#E2E8F0] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 font-mono tabular-nums outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                Office Longitude
              </label>
              <input
                type="number"
                step="any"
                required
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="77.2090"
                className="w-full text-xs p-2.5 rounded border border-[#E2E8F0] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 font-mono tabular-nums outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
              Geofence Radius (meters)
            </label>
            <div className="relative">
              <input
                type="number"
                min="10"
                max="50000"
                required
                value={radiusMeters}
                onChange={(e) => setRadiusMeters(e.target.value)}
                placeholder="500"
                className="w-full text-xs p-2.5 rounded border border-[#E2E8F0] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 font-mono tabular-nums outline-none"
              />
              <span className="absolute right-3 top-2.5 text-xs text-[#94A3B8]">meters</span>
            </div>
            <p className="text-[10px] text-[#64748B] mt-1">
              Employees punching in within this radius are flagged as "Within Geofence".
            </p>
          </div>

          {updatedBy && (
            <div className="text-[11px] text-[#64748B] pt-1">
              Last modified by <span className="font-semibold text-[#1E293B]">{updatedBy.name}</span> on{' '}
              {formatDate(settingsRes?.data?.updatedAt)}.
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isUpdating}>
              Save Geofence Coordinates
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
