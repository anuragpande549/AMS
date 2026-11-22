import { z } from 'zod';
import { ALL_ROLES } from '../../constants/index.js';

export const userSchemas = {
  createUser: {
    body: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters').max(50),
      email: z.string().email('Please provide a valid email address'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      role: z.enum(ALL_ROLES, {
        errorMap: () => ({ message: 'Invalid role provided' })
      }),
      department: z.string().optional().default('Operations'),
      managerId: z.string().optional().nullable()
    })
  },
  updateRole: {
    body: z.object({
      role: z.enum(ALL_ROLES, {
        errorMap: () => ({ message: 'Invalid role provided' })
      })
    })
  },
  assignManager: {
    body: z.object({
      managerId: z.string().min(1, 'Manager ID is required')
    })
  },
  paginationQuery: {
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      role: z.string().optional(),
      approvalStatus: z.string().optional(),
      search: z.string().optional()
    })
  }
};
