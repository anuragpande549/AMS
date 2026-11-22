import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthController } from './auth.controller.js';
import { authSchemas } from './auth.validation.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';

const router = Router();

// Rate limiting for auth endpoints (prevent brute-force attacks)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    statusCode: 429,
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  }
});

router.post('/register', authLimiter, validate(authSchemas.register), AuthController.register);
router.post('/login', authLimiter, validate(authSchemas.login), AuthController.login);
router.get('/me', verifyJWT, AuthController.getMe);

export default router;
