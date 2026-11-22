import { AuthService } from './auth.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export class AuthController {
  static register = asyncHandler(async (req, res) => {
    const { name, email, password, role, department, managerId } = req.body;
    const result = await AuthService.registerUser({
      name,
      email,
      password,
      role,
      department,
      managerId
    });
    return res.status(201).json(new ApiResponse(201, result, 'User registered successfully'));
  });

  static login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await AuthService.loginUser({ email, password });
    return res.status(200).json(new ApiResponse(200, result, 'Login successful'));
  });

  static getMe = asyncHandler(async (req, res) => {
    const user = await AuthService.getCurrentUser(req.user._id);
    return res.status(200).json(new ApiResponse(200, user, 'Current user profile retrieved'));
  });
}
