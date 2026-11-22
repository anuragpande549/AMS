import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../modules/users/user.model.js';

export const verifyJWT = asyncHandler(async (req, _res, next) => {
  const authHeader = req.header('Authorization') || req.header('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Unauthorized request. Bearer token missing.');
  }

  const token = authHeader.replace('Bearer ', '').trim();

  try {
    const decodedToken = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decodedToken._id).select('-password');

    if (!user) {
      throw new ApiError(401, 'Invalid Access Token: User no longer exists');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Account is deactivated. Please contact administrator.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Session token expired. Please log in again.');
    }
    throw new ApiError(401, 'Invalid session token.');
  }
});
