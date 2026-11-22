import { z } from 'zod';

export const settingsSchemas = {
  updateGeofence: {
    body: z.object({
      officeName: z.string().min(2, 'Office name must be at least 2 characters').max(100).optional(),
      latitude: z.coerce.number().min(-90).max(90, 'Latitude must be between -90 and 90'),
      longitude: z.coerce.number().min(-180).max(180, 'Longitude must be between -180 and 180'),
      radiusMeters: z.coerce.number().min(10, 'Radius must be at least 10 meters').max(50000, 'Radius cannot exceed 50,000 meters')
    })
  }
};
