import fs from 'fs';
import path from 'path';
import winston from 'winston';

const isServerless = Boolean(
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.NETLIFY ||
  process.env.RENDER
);

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

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.printf(({ level, message, timestamp, stack }) => {
      return `${timestamp || new Date().toISOString()} [${level}]: ${
        stack || (typeof message === 'object' ? JSON.stringify(message, null, 2) : message)
      }`;
    })
  )
});

const transports = [consoleTransport];

// In non-serverless persistent environments, enable local file logging
if (!isServerless) {
  try {
    const logDir = path.resolve(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    transports.push(
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
    );
  } catch (err) {
    // Read-only filesystem fallback (safe in serverless)
  }
}

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    sanitizeLog(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports
});
