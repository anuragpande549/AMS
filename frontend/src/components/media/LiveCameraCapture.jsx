import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, CheckCircle, VideoOff, SwitchCamera, Info } from 'lucide-react';
import { Button } from '../common/Button.jsx';

export const LiveCameraCapture = ({ onCapture, onClear, isCaptured }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');

  // Fully stop all video stream tracks and release hardware
  const stopStream = useCallback(() => {
    // 1. Disconnect and pause HTML video element
    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch {
        // Ignore
      }
      if (videoRef.current.srcObject) {
        try {
          const stream = videoRef.current.srcObject;
          if (stream && stream.getTracks) {
            stream.getTracks().forEach((track) => {
              track.stop();
              track.enabled = false;
            });
          }
        } catch {
          // Ignore
        }
        videoRef.current.srcObject = null;
      }
    }

    // 2. Stop stream reference tracks
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
          track.enabled = false;
        });
      } catch {
        // Ignore
      }
      streamRef.current = null;
    }

    setIsStreaming(false);
  }, []);

  // Enumerate available video input devices (webcams)
  const enumerateCameras = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter((d) => d.kind === 'videoinput');
      setVideoDevices(videoInputs);
    } catch {
      // Ignore
    }
  }, []);

  // Start live camera stream
  const startStream = useCallback(async (deviceIdToUse) => {
    setError(null);
    setIsInitializing(true);
    stopStream();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }

      // Build video constraints
      const videoConstraints = deviceIdToUse
        ? { deviceId: { exact: deviceIdToUse } }
        : {
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 }
          };

      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: false
        });
      } catch (firstErr) {
        // Fallback to basic video constraint if ideal resolution fails
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {});
        };
      }

      setIsStreaming(true);
      await enumerateCameras();
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera permission denied. Please allow camera access in your browser address bar.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No camera device detected. Please connect a webcam.');
      } else {
        setError(err.message || 'Unable to access camera.');
      }
      setIsStreaming(false);
    } finally {
      setIsInitializing(false);
    }
  }, [stopStream, enumerateCameras]);

  // Handle device change from dropdown
  const handleDeviceChange = (e) => {
    const newDeviceId = e.target.value;
    setSelectedDeviceId(newDeviceId);
    startStream(newDeviceId);
  };

  // Mount effect: start stream; unmount effect: stop stream completely
  useEffect(() => {
    if (!previewUrl) {
      startStream(selectedDeviceId);
    }
    return () => {
      stopStream();
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [selectedDeviceId, previewUrl, startStream, stopStream]);

  // Capture frame to canvas and export to Blob
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    // Mirror image for natural selfie capture
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError('Failed to capture image frame. Please try again.');
          return;
        }

        const file = new File([blob], `selfie_${Date.now()}.jpg`, { type: 'image/jpeg' });
        const localUrl = URL.createObjectURL(blob);

        // Turn OFF camera immediately upon photo capture
        stopStream();

        setPreviewUrl(localUrl);
        onCapture(file);
      },
      'image/jpeg',
      0.85
    );
  };

  // Retake photo
  const retakePhoto = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    onClear();
    startStream(selectedDeviceId);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Camera Device Switcher (if multiple cameras exist) */}
      {videoDevices.length > 1 && !previewUrl && (
        <div className="w-full max-w-sm mb-2 flex items-center gap-2">
          <SwitchCamera className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
          <select
            value={selectedDeviceId}
            onChange={handleDeviceChange}
            className="w-full text-xs p-1.5 rounded border border-[#E2E8F0] bg-white text-[#1E293B] focus:border-[#3B82F6] outline-none"
          >
            {videoDevices.map((d, i) => (
              <option key={d.deviceId || i} value={d.deviceId}>
                {d.label || `Camera ${i + 1}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Camera Viewport Container */}
      <div className="relative w-full aspect-4/3 max-w-sm bg-[#0F172A] rounded-lg overflow-hidden border border-[#E2E8F0] shadow-inner flex items-center justify-center">
        {previewUrl ? (
          /* Captured photo preview (Camera is OFF) */
          <div className="relative w-full h-full">
            <img
              src={previewUrl}
              alt="Captured live attendance selfie"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Camera Off • Frame Verified</span>
            </div>
          </div>
        ) : error ? (
          /* Error State */
          <div className="flex flex-col items-center text-center p-6 text-white max-w-xs">
            <VideoOff className="w-10 h-10 text-[#EF4444] mb-2" />
            <span className="text-xs font-medium text-rose-200 mb-3">{error}</span>
            <Button variant="secondary" size="sm" onClick={() => startStream(selectedDeviceId)}>
              Retry Camera Access
            </Button>
          </div>
        ) : (
          /* Live Camera Stream */
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="w-full h-full object-cover scale-x-[-1]"
            />
            {isStreaming && (
              <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-[#0F172A]/70 text-white text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span>LIVE FEED</span>
              </div>
            )}
            {isInitializing && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0F172A]/80 text-white text-xs">
                Initializing camera sensor...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Physical Camera Privacy Notice */}
      {!previewUrl && (
        <div className="mt-2 w-full max-w-sm flex items-start gap-1.5 text-[11px] text-[#64748B] bg-[#F1F5F9] p-2 rounded border border-[#E2E8F0]">
          <Info className="w-3.5 h-3.5 text-[#3B82F6] shrink-0 mt-0.5" />
          <span>
            If the box shows a crossed-out camera icon, slide open your laptop's physical webcam shutter or press your keyboard privacy key (Fn + F8/F10).
          </span>
        </div>
      )}

      {/* Action Controls */}
      <div className="mt-3 flex items-center gap-3">
        {previewUrl ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={retakePhoto}
          >
            Retake Live Selfie
          </Button>
        ) : (
          <Button
            type="button"
            variant="primary"
            size="md"
            icon={Camera}
            disabled={!isStreaming}
            onClick={capturePhoto}
          >
            Capture Live Selfie
          </Button>
        )}
      </div>
      <p className="mt-1 text-[11px] text-[#64748B]">
        {previewUrl
          ? 'Live photo verified. Camera sensor turned off.'
          : 'Live facial capture required for audit compliance.'}
      </p>
    </div>
  );
};
