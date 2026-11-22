import mongoose from 'mongoose';
import { User } from './user.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { ROLES, APPROVAL_STATUS, MAX_PAGE_LIMIT, DEFAULT_PAGE_LIMIT } from '../../constants/index.js';

export class UserService {
  static async getAllUsers({ page = 1, limit = DEFAULT_PAGE_LIMIT, role, approvalStatus, search }) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(MAX_PAGE_LIMIT, Math.max(1, Number(limit) || DEFAULT_PAGE_LIMIT));
    const skip = (safePage - 1) * safeLimit;

    const filter = {};
    if (role && role !== 'all') {
      filter.role = role;
    }
    if (approvalStatus && approvalStatus !== 'all') {
      filter.approvalStatus = approvalStatus;
    }
    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { department: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const [users, total, pendingCount, approvedCount, rejectedCount] = await Promise.all([
      User.find(filter)
        .populate('managerId', 'name email role')
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean(),
      User.countDocuments(filter),
      User.countDocuments({ approvalStatus: APPROVAL_STATUS.PENDING }),
      User.countDocuments({ approvalStatus: APPROVAL_STATUS.APPROVED }),
      User.countDocuments({ approvalStatus: APPROVAL_STATUS.REJECTED })
    ]);

    return {
      users,
      counts: {
        total,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount
      },
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit)
      }
    };
  }

  static async createUserByAdmin({ name, email, password, role = ROLES.EMPLOYEE, department = 'Operations', managerId = null }) {
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      throw new ApiError(409, 'User with this email already exists');
    }

    // Accounts created directly by Admin are instantly Approved and Active
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      department: department?.trim() || 'Operations',
      managerId: managerId || null,
      approvalStatus: APPROVAL_STATUS.APPROVED,
      isActive: true
    });

    return User.findById(user._id)
      .populate('managerId', 'name email role')
      .select('-password')
      .lean();
  }

  static async approveUser(userId) {
    if (!mongoose.isValidObjectId(userId)) {
      throw new ApiError(400, 'Invalid User ID format');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    user.approvalStatus = APPROVAL_STATUS.APPROVED;
    user.isActive = true;
    await user.save();

    return User.findById(userId)
      .populate('managerId', 'name email role')
      .select('-password')
      .lean();
  }

  static async rejectUser(userId) {
    if (!mongoose.isValidObjectId(userId)) {
      throw new ApiError(400, 'Invalid User ID format');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    user.approvalStatus = APPROVAL_STATUS.REJECTED;
    user.isActive = false;
    await user.save();

    return User.findById(userId)
      .populate('managerId', 'name email role')
      .select('-password')
      .lean();
  }

  static async getUserById(userId) {
    if (!mongoose.isValidObjectId(userId)) {
      throw new ApiError(400, 'Invalid User ID format');
    }

    const user = await User.findById(userId).populate('managerId', 'name email role').select('-password').lean();
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }

  static async updateUserRole(userId, newRole) {
    if (!mongoose.isValidObjectId(userId)) {
      throw new ApiError(400, 'Invalid User ID format');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    user.role = newRole;
    await user.save();

    return User.findById(userId).populate('managerId', 'name email role').select('-password').lean();
  }

  static async assignManager(employeeId, managerId) {
    if (!mongoose.isValidObjectId(employeeId) || !mongoose.isValidObjectId(managerId)) {
      throw new ApiError(400, 'Invalid ID format for employee or manager');
    }

    if (employeeId === managerId) {
      throw new ApiError(400, 'An employee cannot be their own manager');
    }

    const [employee, manager] = await Promise.all([
      User.findById(employeeId),
      User.findById(managerId)
    ]);

    if (!employee) throw new ApiError(404, 'Employee not found');
    if (!manager) throw new ApiError(404, 'Manager not found');

    if (manager.role !== ROLES.MANAGER && manager.role !== ROLES.ADMIN) {
      throw new ApiError(400, 'Assigned supervisor must have Manager or Admin role');
    }

    employee.managerId = managerId;
    await employee.save();

    return User.findById(employeeId).populate('managerId', 'name email role').select('-password').lean();
  }

  static async getManagersList() {
    return User.find({
      role: { $in: [ROLES.MANAGER, ROLES.ADMIN] },
      approvalStatus: APPROVAL_STATUS.APPROVED,
      isActive: true
    })
      .select('name email role department')
      .sort({ name: 1 })
      .lean();
  }

  static async getTeamMembers(managerId) {
    if (!mongoose.isValidObjectId(managerId)) {
      throw new ApiError(400, 'Invalid Manager ID format');
    }
    return User.find({
      managerId,
      approvalStatus: APPROVAL_STATUS.APPROVED,
      isActive: true
    })
      .select('name email role department')
      .sort({ name: 1 })
      .lean();
  }
}
