import { OvertimeService } from './overtime.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export class OvertimeController {
  static createRequest = asyncHandler(async (req, res) => {
    const { attendanceId, requestedHours, reason } = req.body;
    const result = await OvertimeService.requestOvertime(req.user, {
      attendanceId,
      requestedHours: Number(requestedHours),
      reason
    });
    return res.status(201).json(new ApiResponse(201, result, 'Overtime request submitted successfully'));
  });

  static reviewRequest = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, reviewRemarks } = req.body;
    const result = await OvertimeService.reviewOvertime(id, req.user, {
      status,
      reviewRemarks
    });
    return res.status(200).json(new ApiResponse(200, result, `Overtime request ${status.toLowerCase()} successfully`));
  });

  static getRequests = asyncHandler(async (req, res) => {
    const { page, limit, status } = req.query;
    const result = await OvertimeService.getOvertimeRequests(req.user, {
      page,
      limit,
      status
    });
    return res.status(200).json(new ApiResponse(200, result, 'Overtime requests retrieved'));
  });
}
