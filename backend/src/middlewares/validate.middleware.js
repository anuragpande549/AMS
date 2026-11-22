import { ApiError } from '../utils/ApiError.js';

/**
 * Zod request validation middleware
 * Validates body, query, and/or params against Zod schemas
 */
export const validate = (schema) => (req, _res, next) => {
  try {
    if (schema.body) {
      req.body = schema.body.parse(req.body);
    }
    if (schema.query) {
      req.query = schema.query.parse(req.query);
    }
    if (schema.params) {
      req.params = schema.params.parse(req.params);
    }
    next();
  } catch (error) {
    if (error.errors) {
      const details = error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message
      }));
      return next(new ApiError(400, 'Request validation failed', details));
    }
    return next(error);
  }
};
