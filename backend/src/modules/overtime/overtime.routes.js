import { Router } from 'express';
import { OvertimeController } from './overtime.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { overtimeSchemas } from './overtime.validation.js';
import { ROLES } from '../../constants/index.js';

const router = Router();

// All overtime routes require authentication
router.use(verifyJWT);

// View overtime requests (scoped by role automatically in service)
router.get('/', validate(overtimeSchemas.query), OvertimeController.getRequests);

// Employee/Any: Submit overtime request
router.post(
  '/request',
  validate(overtimeSchemas.createRequest),
  OvertimeController.createRequest
);

// Manager / Admin: Review overtime request (Approve / Reject)
router.patch(
  '/:id/review',
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  validate(overtimeSchemas.reviewRequest),
  OvertimeController.reviewRequest
);

export default router;
