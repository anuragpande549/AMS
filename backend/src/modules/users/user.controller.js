import { UserService } from './user.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export class UserController {
  static getAllUsers = asyncHandler(async (req, res) => {
    const { page, limit, role, approvalStatus, search } = req.query;
    const result = await UserService.getAllUsers({ page, limit, role, approvalStatus, search });
    return res.status(200).json(new ApiResponse(200, result, 'Users retrieved successfully'));
  });

  static createUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, department, managerId } = req.body;
    const newUser = await UserService.createUserByAdmin({
      name,
      email,
      password,
      role,
      department,
      managerId
    });
    return res.status(201).json(new ApiResponse(201, newUser, 'Employee account created and approved successfully'));
  });

  static approveUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updated = await UserService.approveUser(id);
    return res.status(200).json(new ApiResponse(200, updated, 'User account approved and activated'));
  });

  static rejectUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updated = await UserService.rejectUser(id);
    return res.status(200).json(new ApiResponse(200, updated, 'User account registration rejected'));
  });

  static getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await UserService.getUserById(id);
    return res.status(200).json(new ApiResponse(200, user, 'User details retrieved successfully'));
  });

  static updateUserRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    const updated = await UserService.updateUserRole(id, role);
    return res.status(200).json(new ApiResponse(200, updated, `User role updated to ${role} successfully`));
  });

  static assignManager = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { managerId } = req.body;
    const updated = await UserService.assignManager(id, managerId);
    return res.status(200).json(new ApiResponse(200, updated, 'Supervisor assigned successfully'));
  });

  static getManagers = asyncHandler(async (_req, res) => {
    const managers = await UserService.getManagersList();
    return res.status(200).json(new ApiResponse(200, managers, 'Managers list retrieved successfully'));
  });

  static getTeamMembers = asyncHandler(async (req, res) => {
    const managerId = req.user._id;
    const team = await UserService.getTeamMembers(managerId);
    return res.status(200).json(new ApiResponse(200, team, 'Team members retrieved successfully'));
  });
}
