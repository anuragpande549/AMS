/**
 * Centralized Domain Constants
 * Strictly follows AGENTS.md Zero Magic Values rule
 */

export const ROLES = Object.freeze({
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee'
});

export const ALL_ROLES = Object.values(ROLES);

export const APPROVAL_STATUS = Object.freeze({
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
});

export const STANDARD_SHIFT_HOURS = 8;

export const SHIFT_STATUS = Object.freeze({
  COMPLETED: 'Completed',
  INCOMPLETE: 'Incomplete',
  PENDING: 'Pending'
});

export const VALIDATION_STATUS = Object.freeze({
  PENDING: 'Pending',
  VALID: 'Valid',
  INVALID: 'Invalid'
});

export const OT_STATUS = Object.freeze({
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
});

export const ATTENDANCE_STATUS = Object.freeze({
  PRESENT: 'Present',
  ABSENT: 'Absent',
  HALF_DAY: 'Half-Day'
});

export const MAX_PAGE_LIMIT = 100;
export const DEFAULT_PAGE_LIMIT = 10;
