// Enhanced Express.js API Gateway for FitSync AI
// Production-ready API gateway with comprehensive middleware stack

import express, { Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import compression from 'compression'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { performance } from 'perf_hooks'
import swaggerUi from 'swagger-ui-express'
import { body, validationResult } from 'express-validator'

// Import our configurations
import { redis, RedisService } from '../config/redis'
import { logger, Logger, httpLogStream } from '../config/logger'

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      requestId?: string
      startTime?: number
      user?: { id: string; email: string; role: string }
    }
  }
}

// Create Express app
const app = express()

// Trust proxy (important for production deployments)
app.set('trust proxy', 1)

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://api.openai.com", "https://api.spoonacular.com", "wss:"],
      scriptSrc: ["'self'", "'unsafe-eval'"], // unsafe-eval needed for Next.js
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for better compatibility
}))

// CORS configuration
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allowed?: boolean) => void) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true)
    
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'https://localhost:3000',
      'https://yourdomain.com',
      'https://www.yourdomain.com'
    ]
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'), false)
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'X-Request-ID',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['X-Total-Count', 'X-Rate-Limit-Remaining', 'X-Rate-Limit-Reset']
}

app.use(cors(corsOptions))

// Compression middleware
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false
    }
    return compression.filter(req, res)
  },
  level: 6,
  threshold: 1024, // Only compress if > 1KB
}))

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    // Store raw body for webhook verification if needed
    (req as any).rawBody = buf
  }
}))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request ID and timing middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  req.requestId = Math.random().toString(36).substring(2, 15)
  req.startTime = performance.now()
  
  // Add request ID to response headers
  res.setHeader('X-Request-ID', req.requestId)
  
  next()
})

// Enhanced rate limiting with Redis
const createRateLimiter = (windowMs: number, max: number, keyGenerator?: (req: Request) => string) => {
  return rateLimit({
    windowMs,
    max,
    keyGenerator: keyGenerator || ((req: Request) => req.ip),
    store: {
      incr: async (key: string) => {
        const result = await RedisService.checkRateLimit(
          `rate_limit:${key}`,
          max,
          Math.floor(windowMs / 1000)
        )
        return {
          totalHits: max - result.remaining + 1,
          totalTime: windowMs,
          resetTime: new Date(result.resetTime)
        }
      },
      decrement: async (key: string) => {
        // Implement if needed
      },
      resetKey: async (key: string) => {
        await redis.del(`rate_limit:${key}`)
      }
    },
    message: {
      error: 'Too many requests, please try again later.',
      type: 'rate_limit_exceeded'
    },
    standardHeaders: true,
    legacyHeaders: false,
    onLimitReached: (req, res, options) => {
      Logger.logSecurityEvent('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.path,
        method: req.method
      })
    }
  })
}

// Different rate limits for different endpoints
app.use('/api/auth/login', createRateLimiter(15 * 60 * 1000, 5)) // 5 attempts per 15 minutes
app.use('/api/auth/register', createRateLimiter(60 * 60 * 1000, 3)) // 3 registrations per hour
app.use('/api/ai', createRateLimiter(60 * 1000, 20, (req) => req.user?.id || req.ip)) // 20 AI requests per minute per user
app.use('/api/upload', createRateLimiter(60 * 1000, 10)) // 10 uploads per minute
app.use('/api', createRateLimiter(15 * 60 * 1000, 1000)) // 1000 requests per 15 minutes

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send
  
  res.send = function(body) {
    const duration = req.startTime ? performance.now() - req.startTime : 0
    
    Logger.logRequest(req, res, Math.round(duration))
    
    // Log slow requests
    if (duration > 1000) {
      Logger.logPerformance(`Slow API Request: ${req.method} ${req.path}`, duration, {
        query: req.query,
        params: req.params,
        userAgent: req.get('User-Agent'),
        ip: req.ip
      })
    }
    
    return originalSend.call(this, body)
  }
  
  next()
})

// API Documentation with Swagger
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'FitSync AI API',
    version: '2.0.0',
    description: 'Enhanced API for FitSync AI fitness platform with real-time features',
  },
  servers: [
    {
      url: process.env.API_URL || 'http://localhost:3000/api',
      description: 'API Server'
    }
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Health check endpoint',
        responses: {
          '200': {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    timestamp: { type: 'string' },
                    services: { type: 'object' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'FitSync AI API Documentation'
}))

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
  try {
    const startTime = performance.now()
    
    // Check all services
    const checks = await Promise.allSettled([
      // Database check
      import('../../../lib/prisma').then(({ prisma }) => 
        prisma.$queryRaw`SELECT 1`.then(() => ({ database: 'connected' }))
      ),
      // Redis check
      RedisService.healthCheck().then(healthy => ({ 
        redis: healthy ? 'connected' : 'disconnected' 
      })),
      // External API checks (optional)
      fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
      }).then(() => ({ openai: 'available' })).catch(() => ({ openai: 'unavailable' }))
    ])
    
    const duration = performance.now() - startTime
    const services: any = { api_gateway: 'healthy' }
    
    checks.forEach((check, index) => {
      if (check.status === 'fulfilled') {
        Object.assign(services, check.value)
      } else {
        const serviceNames = ['database', 'redis', 'openai']
        services[serviceNames[index]] = 'error'
      }
    })
    
    const allHealthy = Object.values(services).every(status => 
      status === 'healthy' || status === 'connected' || status === 'available'
    )
    
    const response = {
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '2.0.0',
      uptime: process.uptime(),
      response_time: `${Math.round(duration)}ms`,
      services,
      environment: process.env.NODE_ENV || 'development'
    }
    
    res.status(allHealthy ? 200 : 503).json(response)
    
    Logger.logPerformance('Health Check', duration, services)
    
  } catch (error) {
    Logger.error('Health check failed', error)
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Metrics endpoint (for monitoring)
app.get('/metrics', async (req: Request, res: Response) => {
  try {
    // Basic metrics (can be enhanced with prometheus-client)
    const metrics = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      environment: process.env.NODE_ENV,
      node_version: process.version
    }
    
    res.json(metrics)
  } catch (error) {
    Logger.error('Metrics endpoint error', error)
    res.status(500).json({ error: 'Failed to retrieve metrics' })
  }
})

// Enhanced caching middleware for GET requests
const cacheMiddleware = (ttl: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') return next()
    
    const cacheKey = `api_cache:${req.originalUrl}`
    
    try {
      const cached = await RedisService.getCache(cacheKey)
      if (cached) {
        res.setHeader('X-Cache', 'HIT')
        res.setHeader('X-Cache-TTL', ttl.toString())
        return res.json(cached)
      }
    } catch (error) {
      Logger.warn('Cache read error', error)
    }
    
    // Store original res.json
    const originalJson = res.json
    res.json = function(body) {
      // Cache successful responses
      if (res.statusCode === 200 && body) {
        RedisService.setCache(cacheKey, body, ttl).catch(err =>
          Logger.warn('Cache write error', err)
        )
      }
      res.setHeader('X-Cache', 'MISS')
      return originalJson.call(this, body)
    }
    
    next()
  }
}

// Input validation middleware
export const validateInput = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)))
    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      Logger.logSecurityEvent('Input validation failed', {
        errors: errors.array(),
        body: req.body,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      })
      
      return res.status(400).json({
        error: 'Invalid input',
        details: errors.array(),
        type: 'validation_error'
      })
    }
    
    next()
  }
}

// JWT Authentication middleware (placeholder - implement with your auth system)
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required', type: 'auth_required' })
    }
    
    // TODO: Implement JWT verification
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    // req.user = decoded as any
    
    next()
  } catch (error) {
    Logger.logSecurityEvent('Authentication failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: req.ip,
      userAgent: req.get('User-Agent')
    })
    
    res.status(403).json({ error: 'Invalid token', type: 'auth_invalid' })
  }
}

// Enhanced error handling middleware
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const duration = req.startTime ? performance.now() - req.startTime : 0
  
  Logger.logApiError(req.path, error, {
    method: req.method,
    query: req.query,
    params: req.params,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    requestId: req.requestId,
    duration: `${Math.round(duration)}ms`
  })
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV !== 'production'
  
  res.status(error.status || 500).json({
    error: isDevelopment ? error.message : 'Internal server error',
    type: error.type || 'server_error',
    requestId: req.requestId,
    timestamp: new Date().toISOString(),
    ...(isDevelopment && { stack: error.stack })
  })
})

// 404 handler
app.use('*', (req: Request, res: Response) => {
  Logger.logSecurityEvent('404 Not Found', {
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  })
  
  res.status(404).json({
    error: 'Endpoint not found',
    type: 'not_found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  })
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  Logger.info('SIGTERM received, shutting down gracefully')
  
  // Close Redis connection
  await redis.quit()
  
  // Additional cleanup here
  
  process.exit(0)
})

process.on('SIGINT', async () => {
  Logger.info('SIGINT received, shutting down gracefully')
  
  // Close Redis connection
  await redis.quit()
  
  process.exit(0)
})

const PORT = process.env.PORT || 3001

// Start server
app.listen(PORT, () => {
  Logger.info(`🚀 Enhanced FitSync AI API Gateway running on port ${PORT}`)
  Logger.info(`📚 API Documentation available at http://localhost:${PORT}/api-docs`)
  Logger.info(`🔍 Health check available at http://localhost:${PORT}/health`)
})

export { app, cacheMiddleware, validateInput, authenticateToken }
export default app