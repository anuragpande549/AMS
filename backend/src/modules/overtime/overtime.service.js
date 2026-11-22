import mongoose from 'mongoose';
import { Overtime } from './overtime.model.js';
import { Attendance } from '../attendance/attendance.model.js';
import { User } from '../users/user.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { ROLES, OT_STATUS, MAX_PAGE_LIMIT, DEFAULT_PAGE_LIMIT } from '../../constants/index.js';

export class OvertimeService {
  static async requestOvertime(currentUser, { attendanceId, requestedHours, reason }) {
    if (!mongoose.isValidObjectId(attendanceId)) {
      throw new ApiError(400, 'Invalid attendance ID format');
    }

    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
      throw new ApiError(404, 'Attendance record not found');
    }

    // Verify ownership: employee can only request OT for their own attendance record
    if (attendance.userId.toString() !== currentUser._id.toString()) {
      throw new ApiError(403, 'You can only request overtime for your own attendance record');
    }

    // Check if an existing overtime request for this attendance record is pending
    const existing = await Overtime.findOne({ attendanceId, status: OT_STATUS.PENDING });
    if (existing) {
      throw new ApiError(409, 'An overtime request for this shift is already pending approval');
    }

    const user = await User.findById(currentUser._id).select('managerId').lean();

    const overtime = await Overtime.create({
      attendanceId,
      userId: currentUser._id,
      managerId: user?.managerId || null,
      date: attendance.date,
      requestedHours,
      reason: reason.trim(),
      status: OT_STATUS.PENDING
    });

    // Sync status into attendance document
    attendance.overtimeStatus = OT_STATUS.PENDING;
    await attendance.save();

    return Overtime.findById(overtime._id)
      .populate('userId', 'name email department')
      .populate('attendanceId')
      .lean();
  }

  static async reviewOvertime(reviewId, reviewerUser, { status, reviewRemarks = '' }) {
    if (!mongoose.isValidObjectId(reviewId)) {
      throw new ApiError(400, 'Invalid overtime request ID format');
    }

    const overtime = await Overtime.findById(reviewId);
    if (!overtime) {
      throw new ApiError(404, 'Overtime request not found');
    }

    if (overtime.status !== OT_STATUS.PENDING) {
      throw new ApiError(400, `Overtime request has already been ${overtime.status.toLowerCase()}`);
    }

    // Prevent IDOR: Manager can only approve OT for their own team
    if (reviewerUser.role === ROLES.MANAGER) {
      const employee = await User.findById(overtime.userId).select('managerId').lean();
      const isTeamMember =
        (overtime.managerId && overtime.managerId.toString() === reviewerUser._id.toString()) ||
        (employee?.managerId && employee.managerId.toString() === reviewerUser._id.toString());

      if (!isTeamMember) {
        throw new ApiError(403, 'Forbidden: You can only review overtime requests for your own direct reports.');
      }
    }

    // Update Overtime and sync with linked Attendance record atomically
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      overtime.status = status;
      overtime.reviewedBy = reviewerUser._id;
      overtime.reviewRemarks = reviewRemarks?.trim() || '';
      overtime.reviewedAt = new Date();
      await overtime.save({ session });

      const attendance = await Attendance.findById(overtime.attendanceId).session(session);
      if (attendance) {
        attendance.overtimeStatus = status;
        if (status === OT_STATUS.APPROVED) {
          attendance.overtimeHours = overtime.requestedHours;
        } else {
          attendance.overtimeHours = 0;
        }
        await attendance.save({ session });
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new ApiError(500, `Failed to update overtime status: ${error.message}`);
    } finally {
      session.endSession();
    }

    return Overtime.findById(reviewId)
      .populate('userId', 'name email department')
      .populate('reviewedBy', 'name email role')
      .populate('attendanceId')
      .lean();
  }

  static async getOvertimeRequests(currentUser, { page = 1, limit = DEFAULT_PAGE_LIMIT, status }) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(MAX_PAGE_LIMIT, Math.max(1, Number(limit) || DEFAULT_PAGE_LIMIT));
    const skip = (safePage - 1) * safeLimit;

    const filter = {};

    if (currentUser.role === ROLES.EMPLOYEE) {
      filter.userId = currentUser._id;
    } else if (currentUser.role === ROLES.MANAGER) {
      filter.managerId = currentUser._id;
    }
    // Admin has no managerId filter (views all)

    if (status && status !== 'all') {
      filter.status = status;
    }

    const [requests, total] = await Promise.all([
      Overtime.find(filter)
        .populate('userId', 'name email department')
        .populate('reviewedBy', 'name email role')
        .populate('attendanceId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean(),
      Overtime.countDocuments(filter)
    ]);

    return {
      requests,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit)
      }
    };
  }
}
