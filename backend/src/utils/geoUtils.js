/**
 * Geolocation & Haversine Distance Calculation Utilities
 */

const EARTH_RADIUS_METERS = 6371000;

/**
 * Converts degrees to radians
 */
const toRadians = (degrees) => (degrees * Math.PI) / 180;

/**
 * Calculates great-circle distance between two GPS coordinates in meters
 * using the Haversine formula
 */
export const calculateDistanceMeters = (lat1, lon1, lat2, lon2) => {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_METERS * c;

  return Number(distance.toFixed(2));
};

/**
 * Validates whether user coordinates are within office geofence radius
 */
export const isWithinOfficeGeofence = (
  userLat,
  userLon,
  officeLat,
  officeLon,
  radiusMeters
) => {
  if (
    typeof userLat !== 'number' ||
    typeof userLon !== 'number' ||
    typeof officeLat !== 'number' ||
    typeof officeLon !== 'number'
  ) {
    return { isWithin: false, distanceMeters: null };
  }

  const distanceMeters = calculateDistanceMeters(
    userLat,
    userLon,
    officeLat,
    officeLon
  );

  return {
    isWithin: distanceMeters <= radiusMeters,
    distanceMeters
  };
};
