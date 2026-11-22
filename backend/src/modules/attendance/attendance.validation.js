import { z } from 'zod';
import { VALIDATION_STATUS } from '../../constants/index.js';

export const attendanceSchemas = {
  punch: {
    body: z.object({
      latitude: z.coerce.number().min(-90).max(90, 'Latitude must be between -90 and 90'),
      longitude: z.coerce.number().min(-180).max(180, 'Longitude must be between -180 and 180')
    })
  },
  validateAttendance: {
    body: z.object({
      validationStatus: z.enum([VALIDATION_STATUS.VALID, VALIDATION_STATUS.INVALID], {
        errorMap: () => ({ message: 'Status must be Valid or Invalid' })
      }),
      remarks: z.string().max(300, 'Remarks cannot exceed 300 characters').optional().default('')
    })
  },
  historyQuery: {
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format must be YYYY-MM-DD').optional(),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format must be YYYY-MM-DD').optional(),
      validationStatus: z.string().optional(),
      shiftStatus: z.string().optional(),
      userId: z.string().optional()
    })
  }
};
