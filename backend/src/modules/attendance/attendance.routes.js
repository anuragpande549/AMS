import { Router } from 'express';
import { AttendanceController } from './attendance.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';
import { uploadSelfie } from '../../middlewares/upload.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { attendanceSchemas } from './attendance.validation.js';
import { ROLES } from '../../constants/index.js';

const router = Router();

// All attendance routes require JWT authentication
router.use(verifyJWT);

// Employee/Any: Today punch status
router.get('/today', AttendanceController.getTodayStatus);

// Employee: Own attendance history
router.get(
  '/my-history',
  validate(attendanceSchemas.historyQuery),
  AttendanceController.getEmployeeHistory
);

// Employee/Any: Punch-in (live selfie upload + GPS coordinates)
router.post(
  '/punch-in',
  uploadSelfie,
  validate(attendanceSchemas.punch),
  AttendanceController.punchIn
);

// Employee/Any: Punch-out (live selfie upload + GPS coordinates)
router.post(
  '/punch-out',
  uploadSelfie,
  validate(attendanceSchemas.punch),
  AttendanceController.punchOut
);

// Manager / Admin: Attendance validation queue
router.get(
  '/validation-queue',
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  AttendanceController.getValidationQueue
);

// Manager / Admin: Validate attendance (Valid / Invalid + Remarks)
router.patch(
  '/:id/validate',
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  validate(attendanceSchemas.validateAttendance),
  AttendanceController.validateAttendance
);

// Dashboard KPI metric summary
router.get('/kpis', AttendanceController.getDashboardKPIs);

export default router;
