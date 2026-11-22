import { ReportService } from './report.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export class ReportController {
  static getAttendanceReport = asyncHandler(async (req, res) => {
    const { page, limit, startDate, endDate, department, status, userId } = req.query;
    const result = await ReportService.getAttendanceReport(req.user, {
      page,
      limit,
      startDate,
      endDate,
      department,
      status,
      userId
    });
    return res.status(200).json(new ApiResponse(200, result, 'Attendance report generated'));
  });

  static getExportData = asyncHandler(async (req, res) => {
    const { startDate, endDate, status, userId } = req.query;
    const rows = await ReportService.getExportRows(req.user, {
      startDate,
      endDate,
      status,
      userId
    });
    return res.status(200).json(new ApiResponse(200, rows, 'Export data retrieved successfully'));
  });
}
