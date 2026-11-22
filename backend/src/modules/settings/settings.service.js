import { Settings } from './settings.model.js';
import { env } from '../../config/env.js';

export class SettingsService {
  /**
   * Retrieves active office geofence settings, seeding from env if not yet created in DB
   */
  static async getOfficeSettings() {
    let settings = await Settings.findOne({ key: 'office_geofence' })
      .populate('updatedBy', 'name email role')
      .lean();

    if (!settings) {
      // Seed default settings from environment variables
      const created = await Settings.create({
        key: 'office_geofence',
        officeName: 'Corporate Headquarters',
        latitude: Number(env.OFFICE_LATITUDE) || 28.6139,
        longitude: Number(env.OFFICE_LONGITUDE) || 77.2090,
        radiusMeters: Number(env.GEOFENCE_RADIUS_METERS) || 500
      });
      settings = created.toObject();
    }

    return settings;
  }

  /**
   * Updates office geofence latitude, longitude, and radius (Admin only)
   */
  static async updateOfficeSettings(adminUser, { officeName, latitude, longitude, radiusMeters }) {
    const updated = await Settings.findOneAndUpdate(
      { key: 'office_geofence' },
      {
        $set: {
          officeName: officeName?.trim() || 'Corporate Headquarters',
          latitude: Number(latitude),
          longitude: Number(longitude),
          radiusMeters: Number(radiusMeters),
          updatedBy: adminUser._id
        }
      },
      { new: true, upsert: true }
    )
      .populate('updatedBy', 'name email role')
      .lean();

    return updated;
  }
}
