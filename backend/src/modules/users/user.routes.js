import { Router } from 'express';
import { UserController } from './user.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { userSchemas } from './user.validation.js';
import { ROLES } from '../../constants/index.js';

const router = Router();

// All user routes require authentication
router.use(verifyJWT);

// Manager / Admin: Get list of eligible managers & supervisors
router.get('/managers', authorizeRoles(ROLES.ADMIN, ROLES.MANAGER), UserController.getManagers);

// Manager: Get team members reporting to current manager
router.get('/team', authorizeRoles(ROLES.MANAGER, ROLES.ADMIN), UserController.getTeamMembers);

// Admin: View all users (paginated + search + approvalStatus filter)
router.get(
  '/',
  authorizeRoles(ROLES.ADMIN),
  validate(userSchemas.paginationQuery),
  UserController.getAllUsers
);

// Admin: Create new employee account directly
router.post(
  '/',
  authorizeRoles(ROLES.ADMIN),
  validate(userSchemas.createUser),
  UserController.createUser
);

// Admin: Approve user account
router.patch(
  '/:id/approve',
  authorizeRoles(ROLES.ADMIN),
  UserController.approveUser
);

// Admin: Reject user account
router.patch(
  '/:id/reject',
  authorizeRoles(ROLES.ADMIN),
  UserController.rejectUser
);

// Admin: View specific user
router.get('/:id', authorizeRoles(ROLES.ADMIN, ROLES.MANAGER), UserController.getUserById);

// Admin: Update user role
router.patch(
  '/:id/role',
  authorizeRoles(ROLES.ADMIN),
  validate(userSchemas.updateRole),
  UserController.updateUserRole
);

// Admin: Assign manager to employee
router.patch(
  '/:id/assign-manager',
  authorizeRoles(ROLES.ADMIN),
  validate(userSchemas.assignManager),
  UserController.assignManager
);

export default router;
