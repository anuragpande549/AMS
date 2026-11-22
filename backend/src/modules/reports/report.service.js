import { Attendance } from '../attendance/attendance.model.js';
import { ROLES, MAX_PAGE_LIMIT, DEFAULT_PAGE_LIMIT } from '../../constants/index.js';

export class ReportService {
  static async getAttendanceReport(currentUser, { page = 1, limit = DEFAULT_PAGE_LIMIT, startDate, endDate, department, status, userId }) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(MAX_PAGE_LIMIT, Math.max(1, Number(limit) || DEFAULT_PAGE_LIMIT));
    const skip = (safePage - 1) * safeLimit;

    const filter = {};

    // Role-Scoped Access Control
    if (currentUser.role === ROLES.EMPLOYEE) {
      filter.userId = currentUser._id;
    } else if (currentUser.role === ROLES.MANAGER) {
      filter.managerId = currentUser._id;
      if (userId) filter.userId = userId;
    } else if (currentUser.role === ROLES.ADMIN) {
      if (userId) filter.userId = userId;
    }

    if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      filter.date = { $gte: startDate };
    } else if (endDate) {
      filter.date = { $lte: endDate };
    }

    if (status && status !== 'all') {
      filter.shiftStatus = status;
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

  static async getExportRows(currentUser, { startDate, endDate, status, userId }) {
    const filter = {};

    if (currentUser.role === ROLES.EMPLOYEE) {
      filter.userId = currentUser._id;
    } else if (currentUser.role === ROLES.MANAGER) {
      filter.managerId = currentUser._id;
      if (userId) filter.userId = userId;
    } else if (currentUser.role === ROLES.ADMIN) {
      if (userId) filter.userId = userId;
    }

    if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate };
    }

    if (status && status !== 'all') {
      filter.shiftStatus = status;
    }

    const records = await Attendance.find(filter)
      .populate('userId', 'name email department')
      .populate('managerId', 'name email')
      .populate('validatedBy', 'name email')
      .sort({ date: -1 })
      .lean();

    return records.map((r) => ({
      Date: r.date,
      EmployeeName: r.userId?.name || 'Unknown',
      Email: r.userId?.email || '',
      Department: r.userId?.department || '',
      PunchInTime: r.punchIn?.time ? new Date(r.punchIn.time).toISOString() : 'N/A',
      PunchInLocation: r.punchIn?.location ? `${r.punchIn.location.latitude}, ${r.punchIn.location.longitude}` : 'N/A',
      PunchInGeofence: r.punchIn?.isWithinGeofence ? 'Within Office' : 'Outside Office',
      PunchOutTime: r.punchOut?.time ? new Date(r.punchOut.time).toISOString() : 'N/A',
      PunchOutLocation: r.punchOut?.location ? `${r.punchOut.location.latitude}, ${r.punchOut.location.longitude}` : 'N/A',
      TotalHours: r.totalHours || 0,
      ShiftStatus: r.shiftStatus,
      ValidationStatus: r.validationStatus,
      ValidationRemarks: r.validationRemarks || '',
      OvertimeHours: r.overtimeHours || 0,
      OvertimeStatus: r.overtimeStatus || 'None',
      SelfiePunchInUrl: r.punchIn?.selfieUrl || '',
      SelfiePunchOutUrl: r.punchOut?.selfieUrl || ''
    }));
  }
}
