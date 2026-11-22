import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Navigation, CheckCircle2, AlertTriangle, RefreshCw, Compass } from 'lucide-react';
import { calculateDistanceMeters } from '../../../utils/geoDistance.js';
import { Spinner } from '../../../components/common/Spinner.jsx';

export const GeofenceSimulatorCard = ({ officeLat, officeLon, radiusMeters }) => {
  const [testLat, setTestLat] = useState('');
  const [testLon, setTestLon] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setTestLat(pos.coords.latitude.toFixed(6));
        setTestLon(pos.coords.longitude.toFixed(6));
        setIsDetecting(false);
        toast.success('Live GPS coordinates captured for geofence simulation');
      },
      (err) => {
        setIsDetecting(false);
        toast.error(`Unable to retrieve GPS: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const distance = calculateDistanceMeters(officeLat, officeLon, testLat, testLon);
  const isInside = distance !== null && distance <= Number(radiusMeters);

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#3B82F6]" />
          <div>
            <h3 className="text-sm font-bold text-[#1E293B]">Live Geofence Simulator</h3>
            <p className="text-[11px] text-[#64748B]">
              Test whether any GPS coordinates fall within the configured office perimeter
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDetectGPS}
          disabled={isDetecting}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F0F9FF] border border-[#BAE6FD] text-[#0369A1] hover:bg-[#E0F2FE] rounded text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
        >
          {isDetecting ? <Spinner size="sm" color="cobalt" /> : <Navigation className="w-3.5 h-3.5" />}
          <span>{isDetecting ? 'Locating...' : 'Test My Live GPS'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#64748B] mb-1">
            Test Latitude
          </label>
          <input
            type="number"
            step="any"
            value={testLat}
            onChange={(e) => setTestLat(e.target.value)}
            placeholder="e.g. 28.613900"
            className="w-full text-xs p-2.5 rounded border border-[#E2E8F0] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] font-mono tabular-nums outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#64748B] mb-1">
            Test Longitude
          </label>
          <input
            type="number"
            step="any"
            value={testLon}
            onChange={(e) => setTestLon(e.target.value)}
            placeholder="e.g. 77.209000"
            className="w-full text-xs p-2.5 rounded border border-[#E2E8F0] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] font-mono tabular-nums outline-none"
          />
        </div>
      </div>

      {/* Result Output */}
      {distance !== null ? (
        <div
          className={`p-3.5 rounded border ${
            isInside
              ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
              : 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {isInside ? (
              <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wide">
                  {isInside ? 'Within Office Geofence' : 'Outside Office Geofence'}
                </span>
                <span className="font-mono text-xs font-bold tabular-nums">
                  {distance.toLocaleString()} meters away
                </span>
              </div>
              <p className="text-[11px] mt-1 leading-relaxed opacity-90">
                {isInside
                  ? `Coordinates are within the allowed ${radiusMeters}m perimeter. Employee shift punch-in will be audited as compliant.`
                  : `Coordinates exceed the allowed ${radiusMeters}m perimeter by ${(distance - radiusMeters).toLocaleString()}m. Shift punch-in will be flagged for supervisor verification.`}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-center text-xs text-[#64748B]">
          Enter test latitude and longitude or click "Test My Live GPS" to verify compliance.
        </div>
      )}
    </div>
  );
};
