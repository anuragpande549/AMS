import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    logger.info('Mongoose is already connected');
    return;
  }

  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });

    isConnected = conn.connection.readyState === 1;
    logger.info(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting reconnection...');
      isConnected = false;
    });
  } catch (error) {
    logger.error(`MongoDB Initial Connection Error: ${error.message}`);
    // Do not crash hard immediately in dev so user has time to configure MONGO_URI
    if (env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

export const closeDB = async () => {
  if (isConnected) {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed gracefully');
    isConnected = false;
  }
};
