// Enhanced Winston Logger Configuration for FitSync AI
import winston from 'winston'
import path from 'path'

// Custom log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

// Custom colors for log levels
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
}

winston.addColors(logColors)

// Custom format for development
const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
)

// Custom format for production
const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
)

// Define which transports to use based on environment
const transports = []

// Console transport (always enabled)
transports.push(
  new winston.transports.Console({
    format: process.env.NODE_ENV === 'production' ? productionFormat : developmentFormat,
  })
)

// File transports for production
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
  // Error log file
  transports.push(
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      format: productionFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  )

  // Combined log file
  transports.push(
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      format: productionFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  )

  // HTTP requests log
  transports.push(
    new winston.transports.File({
      filename: path.join('logs', 'http.log'),
      level: 'http',
      format: productionFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 3,
    })
  )
}

// Create the logger instance
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  levels: logLevels,
  format: productionFormat,
  transports,
  // Don't exit on handled exceptions
  exitOnError: false,
})

// Enhanced logging methods with context
export class Logger {
  static info(message: string, meta?: any) {
    logger.info(message, meta)
  }

  static error(message: string, error?: Error | any) {
    if (error instanceof Error) {
      logger.error(message, {
        error: error.message,
        stack: error.stack,
        ...error
      })
    } else {
      logger.error(message, error)
    }
  }

  static warn(message: string, meta?: any) {
    logger.warn(message, meta)
  }

  static debug(message: string, meta?: any) {
    logger.debug(message, meta)
  }

  static http(message: string, meta?: any) {
    logger.http(message, meta)
  }

  // Request logging helper
  static logRequest(req: any, res: any, duration?: number) {
    const logData = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      duration: duration ? `${duration}ms` : undefined,
      userId: req.user?.id,
      requestId: req.requestId,
    }

    if (res.statusCode >= 400) {
      logger.warn('HTTP Request Error', logData)
    } else {
      logger.http('HTTP Request', logData)
    }
  }

  // API error logging
  static logApiError(endpoint: string, error: Error, context?: any) {
    logger.error(`API Error: ${endpoint}`, {
      error: error.message,
      stack: error.stack,
      endpoint,
      context,
      timestamp: new Date().toISOString(),
    })
  }

  // Database operation logging
  static logDbOperation(operation: string, table: string, duration?: number, error?: Error) {
    const logData = {
      operation,
      table,
      duration: duration ? `${duration}ms` : undefined,
      timestamp: new Date().toISOString(),
    }

    if (error) {
      logger.error(`Database Error: ${operation} on ${table}`, {
        ...logData,
        error: error.message,
        stack: error.stack,
      })
    } else {
      logger.debug(`Database Operation: ${operation} on ${table}`, logData)
    }
  }

  // AI operation logging
  static logAiOperation(operation: string, tokens?: number, cost?: number, error?: Error) {
    const logData = {
      operation,
      tokens,
      cost,
      timestamp: new Date().toISOString(),
    }

    if (error) {
      logger.error(`AI Operation Error: ${operation}`, {
        ...logData,
        error: error.message,
        stack: error.stack,
      })
    } else {
      logger.info(`AI Operation: ${operation}`, logData)
    }
  }

  // Security event logging
  static logSecurityEvent(event: string, details: any) {
    logger.warn(`Security Event: ${event}`, {
      event,
      details,
      timestamp: new Date().toISOString(),
      severity: 'security',
    })
  }

  // Performance monitoring
  static logPerformance(operation: string, duration: number, metadata?: any) {
    const logData = {
      operation,
      duration: `${duration}ms`,
      metadata,
      timestamp: new Date().toISOString(),
    }

    if (duration > 5000) { // Slow operation (>5s)
      logger.warn(`Slow Operation: ${operation}`, logData)
    } else if (duration > 1000) { // Medium operation (>1s)
      logger.info(`Performance: ${operation}`, logData)
    } else {
      logger.debug(`Performance: ${operation}`, logData)
    }
  }
}

// Stream for Morgan HTTP logging
export const httpLogStream = {
  write: (message: string) => {
    logger.http(message.trim())
  },
}

export default logger