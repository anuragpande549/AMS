import { Router } from 'express';
import { SettingsController } from './settings.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { settingsSchemas } from './settings.validation.js';
import { ROLES } from '../../constants/index.js';

const router = Router();

router.use(verifyJWT);

// All authenticated users can read the active office coordinates
router.get('/office', SettingsController.getOfficeSettings);

// Admin only: Edit default office coordinates and radius
router.put(
  '/office',
  authorizeRoles(ROLES.ADMIN),
  validate(settingsSchemas.updateGeofence),
  SettingsController.updateOfficeSettings
);

export default router;
