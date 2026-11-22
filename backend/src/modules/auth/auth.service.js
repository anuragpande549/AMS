import { User } from '../users/user.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { ROLES, APPROVAL_STATUS } from '../../constants/index.js';

export class AuthService {
  static async registerUser({ name, email, password, role = ROLES.EMPLOYEE, department = 'Operations', managerId = null }) {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      throw new ApiError(409, 'User with this email already exists');
    }

    // New self-registered accounts are set to Pending approval and inactive until Admin reviews
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      department: department?.trim() || 'Operations',
      managerId: managerId || null,
      approvalStatus: APPROVAL_STATUS.PENDING,
      isActive: false
    });

    const createdUser = await User.findById(user._id)
      .select('-password')
      .populate('managerId', 'name email role')
      .lean();

    return {
      user: createdUser,
      isPendingApproval: true,
      message: 'Account registered successfully! Your account is pending Administrator approval before you can log in.'
    };
  }

  static async loginUser({ email, password }) {
    // Select password explicitly since user.model.js has select: false
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      // Uniform error message prevents email enumeration
      throw new ApiError(401, 'Invalid email or password');
    }

    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Check Approval Status
    if (user.approvalStatus === APPROVAL_STATUS.PENDING) {
      throw new ApiError(
        403,
        'Your registration is pending Administrator approval. You will be able to log in once an administrator approves your account.'
      );
    }

    if (user.approvalStatus === APPROVAL_STATUS.REJECTED) {
      throw new ApiError(
        403,
        'Your registration was rejected by an administrator. Please contact your system administrator.'
      );
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Account is deactivated. Please contact your administrator.');
    }

    const token = user.generateAccessToken();
    const safeUser = await User.findById(user._id)
      .select('-password')
      .populate('managerId', 'name email role')
      .lean();

    return { user: safeUser, token };
  }

  static async getCurrentUser(userId) {
    const user = await User.findById(userId)
      .select('-password')
      .populate('managerId', 'name email role')
      .lean();

    if (!user) {
      throw new ApiError(404, 'User session not found');
    }
    return user;
  }
}
