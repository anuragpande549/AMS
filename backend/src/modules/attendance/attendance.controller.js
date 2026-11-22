import { AttendanceService } from './attendance.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export class AttendanceController {
  static punchIn = asyncHandler(async (req, res) => {
    const { latitude, longitude } = req.body;
    const selfieBuffer = req.file?.buffer;

    const result = await AttendanceService.punchIn({
      userId: req.user._id,
      userRole: req.user.role,
      latitude: Number(latitude),
      longitude: Number(longitude),
      selfieBuffer
    });

    return res.status(200).json(new ApiResponse(200, result, 'Punch-in recorded successfully'));
  });

  static punchOut = asyncHandler(async (req, res) => {
    const { latitude, longitude } = req.body;
    const selfieBuffer = req.file?.buffer;

    const result = await AttendanceService.punchOut({
      userId: req.user._id,
      latitude: Number(latitude),
      longitude: Number(longitude),
      selfieBuffer
    });

    return res.status(200).json(new ApiResponse(200, result, 'Punch-out recorded successfully'));
  });

  static getTodayStatus = asyncHandler(async (req, res) => {
    const result = await AttendanceService.getTodayStatus(req.user._id);
    return res.status(200).json(new ApiResponse(200, result, 'Today attendance status retrieved'));
  });

  static getEmployeeHistory = asyncHandler(async (req, res) => {
    const { page, limit, startDate, endDate, shiftStatus } = req.query;
    const result = await AttendanceService.getEmployeeAttendanceHistory(req.user._id, {
      page,
      limit,
      startDate,
      endDate,
      shiftStatus
    });
    return res.status(200).json(new ApiResponse(200, result, 'Attendance history retrieved'));
  });

  static getValidationQueue = asyncHandler(async (req, res) => {
    const { page, limit, status, date } = req.query;
    const result = await AttendanceService.getValidationQueue(req.user, {
      page,
      limit,
      status,
      date
    });
    return res.status(200).json(new ApiResponse(200, result, 'Validation queue retrieved'));
  });

  static validateAttendance = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { validationStatus, remarks } = req.body;
    const result = await AttendanceService.validateAttendanceRecord(
      id,
      req.user,
      validationStatus,
      remarks
    );
    return res.status(200).json(new ApiResponse(200, result, `Attendance marked as ${validationStatus}`));
  });

  static getDashboardKPIs = asyncHandler(async (req, res) => {
    const result = await AttendanceService.getDashboardKPIs(req.user);
    return res.status(200).json(new ApiResponse(200, result, 'Dashboard metrics retrieved'));
  });
}
