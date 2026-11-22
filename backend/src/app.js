import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { httpLogger } from './middlewares/httpLogger.js';
import { errorHandler } from './middlewares/error.middleware.js';

// Route imports
import authRouter from './modules/auth/auth.routes.js';
import userRouter from './modules/users/user.routes.js';
import attendanceRouter from './modules/attendance/attendance.routes.js';
import overtimeRouter from './modules/overtime/overtime.routes.js';
import reportRouter from './modules/reports/report.routes.js';
import settingsRouter from './modules/settings/settings.routes.js';

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: [env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Payload size limiting
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request logging through Winston
app.use(httpLogger);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Mount modular API v1 routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/attendance', attendanceRouter);
app.use('/api/v1/overtime', overtimeRouter);
app.use('/api/v1/reports', reportRouter);
app.use('/api/v1/settings', settingsRouter);

// 404 handler for unknown routes
app.use('*', (req, res) => {
  res.status(404).json({
    statusCode: 404,
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;
