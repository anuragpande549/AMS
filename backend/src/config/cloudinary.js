import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';
import { logger } from './logger.js';

const isCloudinaryConfigured = Boolean(
  env.CLOUDINARY_CLOUD_NAME &&
  env.CLOUDINARY_API_KEY &&
  env.CLOUDINARY_API_SECRET &&
  env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name'
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true
  });
  logger.info('Cloudinary configured successfully for live selfie storage');
} else {
  logger.warn('Cloudinary credentials not provided or using placeholders. Selfies will be stored as base64 data URIs.');
}

/**
 * Uploads an image buffer directly to Cloudinary or falls back to data URI if Cloudinary is not yet configured.
 * @param {Buffer} buffer - Image file buffer
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export const uploadBufferToCloudinary = async (buffer, folder = 'attendance_selfies') => {
  if (!buffer) {
    throw new Error('No image buffer provided for upload');
  }

  if (!isCloudinaryConfigured) {
    // Graceful offline/local development fallback so system operates before user enters cloud keys
    const base64 = buffer.toString('base64');
    const dataUri = `data:image/jpeg;base64,${base64}`;
    return {
      url: dataUri,
      publicId: `local_${Date.now()}`
    };
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        format: 'jpg',
        transformation: [{ quality: 'auto:good' }, { fetch_format: 'auto' }]
      },
      (error, result) => {
        if (error) {
          logger.error('Cloudinary upload stream failed:', error);
          return reject(error);
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    );

    uploadStream.end(buffer);
  });
};
