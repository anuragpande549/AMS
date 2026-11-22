import { ApiError } from '../utils/ApiError.js';

/**
 * Role-Based Access Control Middleware Guard
 * @param  {...string} roles Allowed roles
 */
export const authorizeRoles = (...roles) => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required before checking role permissions'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access forbidden: Role '${req.user.role}' is not authorized to access this resource`
        )
      );
    }

    next();
  };
};
