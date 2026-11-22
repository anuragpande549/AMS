import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

let isConnecting = false;

export const connectDB = async () => {
  // If connection is already open (readyState 1), reuse it
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If a connection attempt is currently in progress, wait for it
  if (isConnecting) {
    while (isConnecting && mongoose.connection.readyState !== 1) {
      await new Promise((r) => setTimeout(r, 100));
    }
    return mongoose.connection;
  }

  try {
    isConnecting = true;
    const conn = await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn.connection;
  } catch (error) {
    logger.error(`MongoDB Initial Connection Error: ${error.message}`);
    // Only exit in standalone node servers, never in serverless functions (e.g. Vercel)
    if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME && env.NODE_ENV === 'production') {
      process.exit(1);
    }
    throw error;
  } finally {
    isConnecting = false;
  }
};

export const closeDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed gracefully');
  }
};
