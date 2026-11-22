/**
 * Format timestamp into standard local display format
 */
export const formatDateTime = (isoString) => {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  } catch {
    return '—';
  }
};

/**
 * Format ISO date string into readable YYYY-MM-DD or Month Day, Year
 */
export const formatDate = (isoString) => {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return isoString;
  }
};

/**
 * Format hours to display (e.g. 8.25 -> 8h 15m)
 */
export const formatDurationHours = (decimalHours) => {
  if (decimalHours === null || decimalHours === undefined || isNaN(decimalHours)) return '0h 00m';
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
};

/**
 * Format GPS distance in meters
 */
export const formatDistance = (meters) => {
  if (meters === null || meters === undefined) return 'N/A';
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(2)}km`;
};
