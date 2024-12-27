import winston from 'winston';
import 'winston-daily-rotate-file';
import fs from 'fs';
import path from 'path';

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...rest }) => {
      return JSON.stringify({
        timestamp,
        level,
        message,
        ...rest
      }, null, 2);
    })
  ),
  transports: [
    // Rotating Error Log
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '1d', // Keep logs for 1 day
      maxSize: '20m', // Rotate if size exceeds 20MB
      zippedArchive: false
    }),
    // Rotating Combined Log
    new winston.transports.DailyRotateFile({
      filename: path.join(logsDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '1d', // Keep logs for 1 day
      maxSize: '20m', // Rotate if size exceeds 20MB
      zippedArchive: false
    })
  ],
});

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message, ...rest }) => {
        const meta = Object.keys(rest).length ? JSON.stringify(rest, null, 2) : '';
        return `${timestamp} ${level}: ${message} ${meta}`;
      })
    ),
  }));
}

export default logger;