import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

const storage = multer.memoryStorage();

const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
const maxFileSize = 5 * 1024 * 1024; // 5MB limit

const fileFilter = (_req, file, cb) => {
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Invalid file format. Only JPEG, PNG, and WebP live selfies are allowed.'));
  }
};

export const uploadSelfie = multer({
  storage,
  limits: { fileSize: maxFileSize },
  fileFilter
}).single('selfie');
