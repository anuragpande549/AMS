import React, { useState, useEffect } from 'react';
import { MapPin, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { Spinner } from '../common/Spinner.jsx';

export const LocationFetcher = ({ onLocationAcquired }) => {
  const [coordinates, setCoordinates] = useState(null);
  const [status, setStatus] = useState('fetching'); // 'fetching' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchPosition = () => {
    setStatus('fetching');
    setErrorMsg(null);

    if (!navigator.geolocation) {
      setStatus('error');
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6)),
          accuracyMeters: Math.round(pos.coords.accuracy)
        };
        setCoordinates(coords);
        setStatus('success');
        onLocationAcquired(coords);
      },
      (err) => {
        setStatus('error');
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setErrorMsg('GPS location access denied. Please grant permission in browser settings.');
            break;
          case err.POSITION_UNAVAILABLE:
            setErrorMsg('GPS location information unavailable. Please check location services.');
            break;
          case err.TIMEOUT:
            setErrorMsg('GPS location acquisition timed out. Please retry.');
            break;
          default:
            setErrorMsg('Failed to acquire GPS location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  useEffect(() => {
    fetchPosition();
  }, []);

  return (
    <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded p-3 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#3B82F6]" />
          <span className="font-semibold text-[#1E293B] uppercase tracking-wider text-[11px]">
            GPS Telemetry Check
          </span>
        </div>

        {status === 'fetching' && (
          <div className="flex items-center gap-1.5 text-[#64748B]">
            <Spinner size="sm" color="cobalt" />
            <span>Acquiring Fix...</span>
          </div>
        )}

        {status === 'success' && coordinates && (
          <div className="flex items-center gap-1 text-[#065F46] font-medium">
            <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
            <span>GPS Acquired</span>
          </div>
        )}

        {status === 'error' && (
          <button
            onClick={fetchPosition}
            className="flex items-center gap-1 text-[#EF4444] hover:underline cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        )}
      </div>

      {status === 'success' && coordinates && (
        <div className="mt-2 grid grid-cols-2 gap-2 text-[#475569] font-mono text-[11px] tabular-nums bg-white p-2 rounded border border-[#E2E8F0]">
          <div>
            <span className="text-[#94A3B8] font-sans">Lat:</span> {coordinates.latitude}
          </div>
          <div>
            <span className="text-[#94A3B8] font-sans">Lon:</span> {coordinates.longitude}
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-1.5 flex items-start gap-1.5 text-[#991B1B]">
          <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444] shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
