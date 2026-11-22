import { SettingsService } from './settings.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export class SettingsController {
  static getOfficeSettings = asyncHandler(async (_req, res) => {
    const settings = await SettingsService.getOfficeSettings();
    return res.status(200).json(new ApiResponse(200, settings, 'Office geofence settings retrieved'));
  });

  static updateOfficeSettings = asyncHandler(async (req, res) => {
    const { officeName, latitude, longitude, radiusMeters } = req.body;
    const updated = await SettingsService.updateOfficeSettings(req.user, {
      officeName,
      latitude,
      longitude,
      radiusMeters
    });
    return res.status(200).json(new ApiResponse(200, updated, 'Office geofence settings updated successfully'));
  });
}
