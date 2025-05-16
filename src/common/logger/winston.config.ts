import * as winston from 'winston';
import DailyRotateFile = require('winston-daily-rotate-file');

const { combine, timestamp, errors, json, colorize, simple } = winston.format;

const logFormat = combine(
    timestamp(),
    errors({ stack: true }),
    json(),
);

export const winstonConfig = {
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: combine(colorize({ all: true }), simple()),
        }),
        new DailyRotateFile({
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'info',
            format: logFormat,
        }),
    ],
};


