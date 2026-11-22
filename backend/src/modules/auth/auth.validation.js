import { z } from 'zod';
import { ALL_ROLES } from '../../constants/index.js';

export const authSchemas = {
  register: {
    body: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters').max(50),
      email: z.string().email('Please provide a valid email address'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      role: z.enum(ALL_ROLES).optional(),
      department: z.string().optional(),
      managerId: z.string().optional()
    })
  },
  login: {
    body: z.object({
      email: z.string().email('Please provide a valid email address'),
      password: z.string().min(1, 'Password is required')
    })
  }
};
