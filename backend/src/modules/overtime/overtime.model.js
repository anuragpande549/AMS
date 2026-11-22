import mongoose from 'mongoose';
import { OT_STATUS } from '../../constants/index.js';

const overtimeSchema = new mongoose.Schema(
  {
    attendanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attendance',
      required: true,
      index: true
    },
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
      type: String, // YYYY-MM-DD
      required: true,
      index: true
    },
    requestedHours: {
      type: Number,
      required: [true, 'Requested overtime hours is required'],
      min: [0.5, 'Minimum overtime request is 0.5 hours'],
      max: [12, 'Maximum overtime request cannot exceed 12 hours']
    },
    reason: {
      type: String,
      required: [true, 'Reason for overtime is required'],
      trim: true,
      minlength: 5,
      maxlength: 300
    },
    status: {
      type: String,
      enum: Object.values(OT_STATUS),
      default: OT_STATUS.PENDING,
      index: true
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    reviewRemarks: {
      type: String,
      trim: true,
      default: ''
    },
    reviewedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const Overtime = mongoose.model('Overtime', overtimeSchema);
