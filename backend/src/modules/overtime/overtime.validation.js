import { z } from 'zod';
import { OT_STATUS } from '../../constants/index.js';

export const overtimeSchemas = {
  createRequest: {
    body: z.object({
      attendanceId: z.string().min(1, 'Attendance record ID is required'),
      requestedHours: z.coerce.number().min(0.5, 'Minimum OT is 0.5 hours').max(12, 'Maximum OT is 12 hours'),
      reason: z.string().min(5, 'Reason must be at least 5 characters').max(300)
    })
  },
  reviewRequest: {
    body: z.object({
      status: z.enum([OT_STATUS.APPROVED, OT_STATUS.REJECTED], {
        errorMap: () => ({ message: 'Status must be Approved or Rejected' })
      }),
      reviewRemarks: z.string().max(300).optional().default('')
    })
  },
  query: {
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      status: z.string().optional()
    })
  }
};
