import fs from 'fs';
import path from 'path';
import winston from 'winston';

const logDir = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const sanitizeLog = winston.format((info) => {
  if (typeof info.message === 'object' && info.message !== null) {
    const clone = { ...info.message };
    if ('password' in clone) clone.password = '[REDACTED]';
    if ('token' in clone) clone.token = '[REDACTED]';
    if ('buffer' in clone) clone.buffer = '[BUFFER_OMITTED]';
    info.message = clone;
  }
  return info;
});

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    sanitizeLog(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, stack }) => {
          return `${timestamp} [${level}]: ${stack || (typeof message === 'object' ? JSON.stringify(message, null, 2) : message)}`;
        })
      )
    })
  );
}
