import mongoose from 'mongoose';
import { SHIFT_STATUS, VALIDATION_STATUS, OT_STATUS } from '../../constants/index.js';

const punchEventSchema = new mongoose.Schema(
  {
    time: {
      type: Date,
      required: true
    },
    location: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    },
    selfieUrl: {
      type: String,
      required: true
    },
    selfiePublicId: {
      type: String,
      default: ''
    },
    distanceMeters: {
      type: Number,
      default: null
    },
    isWithinGeofence: {
      type: Boolean,
      default: false
    }
  },
  { _id: false }
);

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    date: {
      type: String, // Format: YYYY-MM-DD (UTC date string)
      required: true,
      index: true
    },
    punchIn: {
      type: punchEventSchema,
      default: null
    },
    punchOut: {
      type: punchEventSchema,
      default: null
    },
    totalHours: {
      type: Number,
      default: 0
    },
    shiftStatus: {
      type: String,
      enum: Object.values(SHIFT_STATUS),
      default: SHIFT_STATUS.PENDING,
      index: true
    },
    validationStatus: {
      type: String,
      enum: Object.values(VALIDATION_STATUS),
      default: VALIDATION_STATUS.PENDING,
      index: true
    },
    validatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    validationRemarks: {
      type: String,
      trim: true,
      default: ''
    },
    validatedAt: {
      type: Date,
      default: null
    },
    overtimeStatus: {
      type: String,
      enum: [...Object.values(OT_STATUS), 'None'],
      default: 'None'
    },
    overtimeHours: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index prevents duplicate daily punch-in race conditions
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model('Attendance', attendanceSchema);
