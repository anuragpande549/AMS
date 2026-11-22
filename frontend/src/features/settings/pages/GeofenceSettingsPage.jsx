import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  MapPin,
  Navigation,
  ShieldCheck,
  RefreshCw,
  Building2,
  Clock,
  RotateCcw,
  Save,
  CheckCircle2
} from 'lucide-react';
import { useGetOfficeSettingsQuery, useUpdateOfficeSettingsMutation } from '../settingsApi.js';
import { GeofenceSimulatorCard } from '../components/GeofenceSimulatorCard.jsx';
import { Button } from '../../../components/common/Button.jsx';
import { Spinner } from '../../../components/common/Spinner.jsx';
import { StatCard } from '../../../components/common/StatCard.jsx';
import { formatDate } from '../../../utils/formatTime.js';

export const GeofenceSettingsPage = () => {
  const { data: settingsRes, isLoading: isFetching, refetch } = useGetOfficeSettingsQuery();
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

  const handleResetDefaults = () => {
    setOfficeName('Corporate Headquarters');
    setLatitude('28.613900');
    setLongitude('77.209000');
    setRadiusMeters('500');
    toast.success('Reset form to standard headquarters coordinates (New Delhi HQ)');
  };

  const handleSave = async (e) => {
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

      toast.success('Default office geofence coordinates updated and deployed!');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'Failed to update geofence coordinates');
    }
  };

  const activeSettings = settingsRes?.data;
  const updatedBy = activeSettings?.updatedBy;

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Spinner size="lg" color="cobalt" />
        <span className="text-xs text-[#64748B]">Loading office geofence telemetry...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E293B] tracking-tight">
            Office Geofence & Location Settings
          </h1>
          <p className="text-xs text-[#64748B]">
            Configure default office latitude, longitude, and adherence radius for punch-in validation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>Geofence Enforced</span>
          </span>
        </div>
      </div>

      {/* KPI Cards: Current Active Values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Facility"
          value={activeSettings?.officeName || 'Corporate HQ'}
          subtext="Configured Primary Site"
          icon={Building2}
          variant="default"
        />
        <StatCard
          title="Office Latitude"
          value={activeSettings?.latitude !== undefined ? Number(activeSettings.latitude).toFixed(6) : '28.613900'}
          subtext="WGS-84 Decimal Coordinate"
          icon={MapPin}
          variant="primary"
        />
        <StatCard
          title="Office Longitude"
          value={activeSettings?.longitude !== undefined ? Number(activeSettings.longitude).toFixed(6) : '77.209000'}
          subtext="WGS-84 Decimal Coordinate"
          icon={MapPin}
          variant="primary"
        />
        <StatCard
          title="Geofence Radius"
          value={`${activeSettings?.radiusMeters || 500} m`}
          subtext="Adherence Perimeter"
          icon={ShieldCheck}
          variant="success"
        />
      </div>

      {/* Main Content Grid: Edit Form on Left, Simulator on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Edit Form (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-lg p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-5">
            <div>
              <h2 className="text-sm font-bold text-[#1E293B]">Edit Default Coordinates</h2>
              <p className="text-xs text-[#64748B]">
                Changes take effect immediately across all employee punch-ins
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1 text-[11px] text-[#64748B] hover:text-[#1E293B] cursor-pointer"
              title="Reset to New Delhi Headquarters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                Office Facility / Site Name
              </label>
              <input
                type="text"
                required
                value={officeName}
                onChange={(e) => setOfficeName(e.target.value)}
                placeholder="e.g. Corporate Headquarters"
                className="w-full text-xs p-2.5 rounded border border-[#E2E8F0] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none"
              />
            </div>

            {/* Quick Auto-Detect GPS Button */}
            <div className="flex items-center justify-between p-3 bg-[#F0F9FF] border border-[#BAE6FD] rounded text-xs">
              <div className="flex items-center gap-2 text-[#0369A1]">
                <Navigation className="w-4 h-4 text-[#0EA5E9]" />
                <div>
                  <span className="font-semibold text-xs block">Need your current location?</span>
                  <span className="text-[11px] text-[#0284C7]">Acquires GPS fix from your device browser</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#BAE6FD] text-[#0369A1] hover:bg-[#F0F9FF] rounded font-semibold text-xs shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isLocating ? <Spinner size="sm" color="cobalt" /> : <RefreshCw className="w-3.5 h-3.5" />}
                <span>{isLocating ? 'Acquiring Fix...' : 'Use My Current GPS'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                  Default Office Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="28.613900"
                  className="w-full text-xs p-2.5 rounded border border-[#E2E8F0] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] font-mono tabular-nums outline-none"
                />
                <span className="text-[10px] text-[#94A3B8]">Valid range: -90.0 to 90.0</span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                  Default Office Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="77.209000"
                  className="w-full text-xs p-2.5 rounded border border-[#E2E8F0] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] font-mono tabular-nums outline-none"
                />
                <span className="text-[10px] text-[#94A3B8]">Valid range: -180.0 to 180.0</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Geofence Radius (meters)
                </label>
                {/* Radius presets */}
                <div className="flex items-center gap-1">
                  {[100, 250, 500, 1000, 2000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setRadiusMeters(preset.toString())}
                      className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                        radiusMeters === preset.toString()
                          ? 'bg-[#1E293B] text-white border-[#1E293B]'
                          : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:text-[#1E293B]'
                      }`}
                    >
                      {preset >= 1000 ? `${preset / 1000}km` : `${preset}m`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min="10"
                  max="50000"
                  required
                  value={radiusMeters}
                  onChange={(e) => setRadiusMeters(e.target.value)}
                  placeholder="500"
                  className="w-full text-xs p-2.5 rounded border border-[#E2E8F0] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] font-mono tabular-nums outline-none"
                />
                <span className="absolute right-3 top-2.5 text-xs text-[#94A3B8]">meters</span>
              </div>
              <p className="text-[11px] text-[#64748B] mt-1">
                Staff punching in beyond this perimeter will be flagged as "Outside Geofence" for manager audit.
              </p>
            </div>

            {/* Audit Metadata */}
            {updatedBy && (
              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-xs text-[#64748B] flex items-center justify-between">
                <span>
                  Last modified by <strong className="text-[#1E293B]">{updatedBy.name}</strong> ({updatedBy.role})
                </span>
                <span className="font-mono text-[11px] text-[#94A3B8]">
                  {formatDate(activeSettings?.updatedAt)}
                </span>
              </div>
            )}

            <div className="pt-3 border-t border-[#E2E8F0] flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isUpdating}
                icon={Save}
              >
                Save Default Coordinates
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Simulator & Policy Info (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <GeofenceSimulatorCard
            officeLat={latitude || activeSettings?.latitude}
            officeLon={longitude || activeSettings?.longitude}
            radiusMeters={radiusMeters || activeSettings?.radiusMeters}
          />

          {/* Audit Verification Guidelines Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-xs text-xs space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#1E293B] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>Shift Geofencing Compliance</span>
            </h3>
            <p className="text-[#64748B] leading-relaxed">
              When an employee records their shift punch-in, the system runs the <strong>Haversine Great-Circle Distance</strong> formula between their live GPS telemetry and the default coordinates configured above.
            </p>
            <ul className="space-y-1.5 text-[#475569] text-[11px] pl-3 list-disc">
              <li>Distance ≤ {radiusMeters || 500}m: Audit flag marked <strong>Within Geofence</strong>.</li>
              <li>Distance &gt; {radiusMeters || 500}m: Audit flag marked <strong>Outside Geofence</strong>.</li>
              <li>Managers can inspect the exact distance in the Validation Queue before approving attendance records.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
