import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'office_geofence'
    },
    officeName: {
      type: String,
      required: true,
      trim: true,
      default: 'Corporate Headquarters'
    },
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180
    },
    radiusMeters: {
      type: Number,
      required: true,
      min: 10,
      max: 50000,
      default: 500
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const Settings = mongoose.model('Settings', settingsSchema);
