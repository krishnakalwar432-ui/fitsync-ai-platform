// Enhanced Express.js API Gateway for FitSync AI
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import compression from 'compression'
import { createProxyMiddleware } from 'http-proxy-middleware'
import Redis from 'ioredis'
import winston from 'winston'
import { performance } from 'perf_hooks'

const app = express()
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
})

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.openai.com"]
    }
  }
}))

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Rate limiting
const createRateLimiter = (windowMs: number, max: number) => rateLimit({
  windowMs,
  max,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  })
})

// Different rate limits for different endpoints
app.use('/api/auth', createRateLimiter(15 * 60 * 1000, 5)) // 5 requests per 15 minutes
app.use('/api/ai', createRateLimiter(60 * 1000, 20)) // 20 requests per minute
app.use('/api', createRateLimiter(15 * 60 * 1000, 100)) // 100 requests per 15 minutes

// Compression
app.use(compression())

// Request parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logging and metrics
app.use((req, res, next) => {
  const start = performance.now()
  const requestId = Math.random().toString(36).substring(7)
  
  req.requestId = requestId
  req.startTime = start
  
  logger.info(`[${requestId}] ${req.method} ${req.url}`, {
    requestId,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  })
  
  res.on('finish', () => {
    const duration = performance.now() - start
    logger.info(`[${requestId}] Response ${res.statusCode}`, {
      requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration.toFixed(2)}ms`
    })
  })
  
  next()
})

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`
    
    // Check Redis connection
    await redis.ping()
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: 'connected',
        redis: 'connected',
        ai: process.env.OPENAI_API_KEY ? 'configured' : 'not configured'
      }
    })
  } catch (error) {
    logger.error('Health check failed', error)
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    })
  }
})

// API Routes with caching
app.use('/api/exercises', createCacheMiddleware(300), exerciseRoutes) // 5 min cache
app.use('/api/workouts', workoutRoutes)
app.use('/api/nutrition', nutritionRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/progress', progressRoutes)

// Cache middleware
function createCacheMiddleware(ttl: number) {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.method !== 'GET') return next()
    
    const cacheKey = `cache:${req.originalUrl}`
    
    try {
      const cached = await redis.get(cacheKey)
      if (cached) {
        logger.info(`Cache hit for ${req.originalUrl}`)
        return res.json(JSON.parse(cached))
      }
    } catch (error) {
      logger.warn('Cache read error', error)
    }
    
    // Store original res.json
    const originalJson = res.json
    res.json = function(body) {
      // Cache successful responses
      if (res.statusCode === 200) {
        redis.setex(cacheKey, ttl, JSON.stringify(body)).catch(err =>
          logger.warn('Cache write error', err)
        )
      }
      return originalJson.call(this, body)
    }
    
    next()
  }
}

// Background job processing
import Bull from 'bull'

const aiJobQueue = new Bull('AI jobs', process.env.REDIS_URL || 'redis://localhost:6379')
const emailQueue = new Bull('Email jobs', process.env.REDIS_URL || 'redis://localhost:6379')

// AI processing jobs
aiJobQueue.process('generate-workout-plan', async (job) => {
  const { userId, preferences } = job.data
  logger.info(`Processing workout plan for user ${userId}`)
  
  try {
    // AI workout generation logic
    const workoutPlan = await generateAIWorkoutPlan(preferences)
    
    // Save to database
    await saveWorkoutPlan(userId, workoutPlan)
    
    // Send notification
    await emailQueue.add('workout-plan-ready', {
      userId,
      workoutPlanId: workoutPlan.id
    })
    
    return { success: true, workoutPlanId: workoutPlan.id }
  } catch (error) {
    logger.error('Workout plan generation failed', error)
    throw error
  }
})

// Email notification jobs
emailQueue.process('workout-plan-ready', async (job) => {
  const { userId, workoutPlanId } = job.data
  // Send email notification
  await sendWorkoutPlanEmail(userId, workoutPlanId)
})

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(`[${req.requestId}] Error:`, {
    requestId: req.requestId,
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method
  })
  
  if (res.headersSent) {
    return next(error)
  }
  
  res.status(error.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message,
    requestId: req.requestId
  })
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully')
  
  await aiJobQueue.close()
  await emailQueue.close()
  await redis.quit()
  
  process.exit(0)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  logger.info(`🚀 API Gateway running on port ${PORT}`)
})

export default app