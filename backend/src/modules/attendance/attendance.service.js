import mongoose from 'mongoose';
import { Attendance } from './attendance.model.js';
import { User } from '../users/user.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { uploadBufferToCloudinary } from '../../config/cloudinary.js';
import { isWithinOfficeGeofence } from '../../utils/geoUtils.js';
import { SettingsService } from '../settings/settings.service.js';
import { env } from '../../config/env.js';
import {
  ROLES,
  STANDARD_SHIFT_HOURS,
  SHIFT_STATUS,
  VALIDATION_STATUS,
  MAX_PAGE_LIMIT,
  DEFAULT_PAGE_LIMIT
} from '../../constants/index.js';

const getUtcDateString = (date = new Date()) => {
  return date.toISOString().split('T')[0];
};

export class AttendanceService {
  static async punchIn({ userId, userRole, latitude, longitude, selfieBuffer }) {
    if (!selfieBuffer) {
      throw new ApiError(400, 'Live camera selfie is required for punch-in');
    }

    const today = getUtcDateString();
    const existing = await Attendance.findOne({ userId, date: today });

    if (existing && existing.punchIn?.time) {
      throw new ApiError(409, 'You have already punched in for today');
    }

    const user = await User.findById(userId).select('managerId').lean();
    if (!user) throw new ApiError(404, 'User account not found');

    const officeSettings = await SettingsService.getOfficeSettings();
    const geofence = isWithinOfficeGeofence(
      latitude,
      longitude,
      officeSettings?.latitude ?? env.OFFICE_LATITUDE,
      officeSettings?.longitude ?? env.OFFICE_LONGITUDE,
      officeSettings?.radiusMeters ?? env.GEOFENCE_RADIUS_METERS
    );

    const { url, publicId } = await uploadBufferToCloudinary(selfieBuffer, 'attendance/punch_in');

    const punchInEvent = {
      time: new Date(),
      location: { latitude, longitude },
      selfieUrl: url,
      selfiePublicId: publicId,
      distanceMeters: geofence.distanceMeters,
      isWithinGeofence: geofence.isWithin
    };

    let attendance;
    if (existing) {
      existing.punchIn = punchInEvent;
      existing.managerId = user.managerId;
      existing.shiftStatus = SHIFT_STATUS.PENDING;
      existing.validationStatus = VALIDATION_STATUS.PENDING;
      attendance = await existing.save();
    } else {
      attendance = await Attendance.create({
        userId,
        managerId: user.managerId,
        date: today,
        punchIn: punchInEvent,
        shiftStatus: SHIFT_STATUS.PENDING,
        validationStatus: VALIDATION_STATUS.PENDING
      });
    }

    return Attendance.findById(attendance._id)
      .populate('userId', 'name email department')
      .populate('managerId', 'name email')
      .lean();
  }

  static async punchOut({ userId, latitude, longitude, selfieBuffer }) {
    if (!selfieBuffer) {
      throw new ApiError(400, 'Live camera selfie is required for punch-out');
    }

    const today = getUtcDateString();
    const attendance = await Attendance.findOne({ userId, date: today });

    if (!attendance || !attendance.punchIn?.time) {
      throw new ApiError(400, 'You must punch in first before punching out');
    }

    if (attendance.punchOut?.time) {
      throw new ApiError(400, 'You have already punched out for today');
    }

    const officeSettings = await SettingsService.getOfficeSettings();
    const geofence = isWithinOfficeGeofence(
      latitude,
      longitude,
      officeSettings?.latitude ?? env.OFFICE_LATITUDE,
      officeSettings?.longitude ?? env.OFFICE_LONGITUDE,
      officeSettings?.radiusMeters ?? env.GEOFENCE_RADIUS_METERS
    );

    const { url, publicId } = await uploadBufferToCloudinary(selfieBuffer, 'attendance/punch_out');

    const punchOutTime = new Date();
    const punchInTime = new Date(attendance.punchIn.time);
    const durationHours = Number(((punchOutTime.getTime() - punchInTime.getTime()) / 3600000).toFixed(2));

    attendance.punchOut = {
      time: punchOutTime,
      location: { latitude, longitude },
      selfieUrl: url,
      selfiePublicId: publicId,
      distanceMeters: geofence.distanceMeters,
      isWithinGeofence: geofence.isWithin
    };

    attendance.totalHours = durationHours;
    attendance.shiftStatus =
      durationHours >= STANDARD_SHIFT_HOURS ? SHIFT_STATUS.COMPLETED : SHIFT_STATUS.INCOMPLETE;

    await attendance.save();

    return Attendance.findById(attendance._id)
      .populate('userId', 'name email department')
      .populate('managerId', 'name email')
      .lean();
  }

  static async getTodayStatus(userId) {
    const today = getUtcDateString();
    const attendance = await Attendance.findOne({ userId, date: today })
      .populate('userId', 'name email department')
      .lean();

    return {
      date: today,
      hasPunchedIn: Boolean(attendance?.punchIn?.time),
      hasPunchedOut: Boolean(attendance?.punchOut?.time),
      record: attendance || null
    };
  }

  static async getEmployeeAttendanceHistory(userId, { page = 1, limit = DEFAULT_PAGE_LIMIT, startDate, endDate, shiftStatus }) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(MAX_PAGE_LIMIT, Math.max(1, Number(limit) || DEFAULT_PAGE_LIMIT));
    const skip = (safePage - 1) * safeLimit;

    const filter = { userId };
    if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      filter.date = { $gte: startDate };
    } else if (endDate) {
      filter.date = { $lte: endDate };
    }

    if (shiftStatus && shiftStatus !== 'all') {
      filter.shiftStatus = shiftStatus;
    }

    const [records, total] = await Promise.all([
      Attendance.find(filter)
        .populate('validatedBy', 'name email role')
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean(),
      Attendance.countDocuments(filter)
    ]);

    return {
      records,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit)
      }
    };
  }

  static async getValidationQueue(currentUser, { page = 1, limit = DEFAULT_PAGE_LIMIT, status, date }) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(MAX_PAGE_LIMIT, Math.max(1, Number(limit) || DEFAULT_PAGE_LIMIT));
    const skip = (safePage - 1) * safeLimit;

    const filter = {};

    if (currentUser.role === ROLES.MANAGER) {
      // Prevent IDOR: Manager can only view their own team's attendance
      filter.managerId = currentUser._id;
    }

    if (status && status !== 'all') {
      filter.validationStatus = status;
    } else if (!status) {
      // Default to Pending validation
      filter.validationStatus = VALIDATION_STATUS.PENDING;
    }

    if (date) {
      filter.date = date;
    }

    const [records, total] = await Promise.all([
      Attendance.find(filter)
        .populate('userId', 'name email department')
        .populate('managerId', 'name email')
        .populate('validatedBy', 'name email')
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean(),
      Attendance.countDocuments(filter)
    ]);

    return {
      records,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit)
      }
    };
  }

  static async validateAttendanceRecord(attendanceId, reviewerUser, validationStatus, remarks = '') {
    if (!mongoose.isValidObjectId(attendanceId)) {
      throw new ApiError(400, 'Invalid attendance record ID format');
    }

    const attendance = await Attendance.findById(attendanceId).populate('userId', 'managerId');
    if (!attendance) {
      throw new ApiError(404, 'Attendance record not found');
    }

    // Prevent IDOR: Manager can only validate their own team's records
    if (reviewerUser.role === ROLES.MANAGER) {
      const isTeamRecord =
        (attendance.managerId && attendance.managerId.toString() === reviewerUser._id.toString()) ||
        (attendance.userId?.managerId && attendance.userId.managerId.toString() === reviewerUser._id.toString());

      if (!isTeamRecord) {
        throw new ApiError(403, 'Forbidden: You are only authorized to validate attendance for members of your own team.');
      }
    }

    attendance.validationStatus = validationStatus;
    attendance.validationRemarks = remarks?.trim() || '';
    attendance.validatedBy = reviewerUser._id;
    attendance.validatedAt = new Date();

    await attendance.save();

    return Attendance.findById(attendanceId)
      .populate('userId', 'name email department')
      .populate('validatedBy', 'name email role')
      .lean();
  }

  static async getDashboardKPIs(user) {
    const today = getUtcDateString();

    if (user.role === ROLES.EMPLOYEE) {
      const [todayRecord, recentRecords] = await Promise.all([
        Attendance.findOne({ userId: user._id, date: today }).lean(),
        Attendance.find({ userId: user._id }).sort({ date: -1 }).limit(30).lean()
      ]);

      const totalHoursMonth = recentRecords.reduce((acc, r) => acc + (r.totalHours || 0), 0);
      const completedShifts = recentRecords.filter((r) => r.shiftStatus === SHIFT_STATUS.COMPLETED).length;
      const validAttendances = recentRecords.filter((r) => r.validationStatus === VALIDATION_STATUS.VALID).length;

      return {
        role: ROLES.EMPLOYEE,
        todayStatus: {
          punchedIn: Boolean(todayRecord?.punchIn?.time),
          punchedOut: Boolean(todayRecord?.punchOut?.time),
          shiftStatus: todayRecord?.shiftStatus || 'Not Punched',
          validationStatus: todayRecord?.validationStatus || 'None'
        },
        metrics: {
          monthlyHours: Number(totalHoursMonth.toFixed(1)),
          completedShifts,
          validAttendances,
          totalLoggedShifts: recentRecords.length
        }
      };
    }

    // For Manager or Admin
    const filter = {};
    if (user.role === ROLES.MANAGER) {
      filter.managerId = user._id;
    }

    const [todayRecords, pendingValidationCount] = await Promise.all([
      Attendance.find({ ...filter, date: today }).lean(),
      Attendance.countDocuments({ ...filter, validationStatus: VALIDATION_STATUS.PENDING })
    ]);

    const punchedInToday = todayRecords.filter((r) => r.punchIn?.time).length;
    const completedToday = todayRecords.filter((r) => r.shiftStatus === SHIFT_STATUS.COMPLETED).length;
    const incompleteToday = todayRecords.filter((r) => r.shiftStatus === SHIFT_STATUS.INCOMPLETE).length;

    return {
      role: user.role,
      metrics: {
        totalPresentToday: punchedInToday,
        completedShiftsToday: completedToday,
        incompleteShiftsToday: incompleteToday,
        pendingValidations: pendingValidationCount
      }
    };
  }
}
