// Enhanced API Gateway with Advanced Rate Limiting and Authentication
// Production-ready gateway with security, monitoring, and performance optimization

import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'
import compression from 'compression'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { createProxyMiddleware } from 'http-proxy-middleware'
import Redis from 'ioredis'
import winston from 'winston'
import { RedisOptimizedCache } from './redis-cache-optimizer'
import { performance } from 'perf_hooks'
import { RateLimiterRedis } from 'rate-limiter-flexible'

const app = express()
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')
const cache = new RedisOptimizedCache(process.env.REDIS_URL || 'redis://localhost:6379')

// Enhanced logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/gateway-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/gateway-access.log' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ]
})

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [\"'self'\"],
      styleSrc: [\"'self'\", \"'unsafe-inline'\", \"https://fonts.googleapis.com\"],
      fontSrc: [\"'self'\", \"https://fonts.gstatic.com\"],
      imgSrc: [\"'self'\", \"data:\", \"https:\"],
      connectSrc: [\"'self'\", \"https://api.openai.com\", \"wss:\"]
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }
}))

// CORS with dynamic origin validation
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}))

// Advanced rate limiting with Redis
const rateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'rl_gateway',
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
  blockDuration: 60, // Block for 60 seconds if exceeded
})

const authLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'rl_auth',
  points: 5, // 5 attempts
  duration: 900, // Per 15 minutes
  blockDuration: 1800, // Block for 30 minutes
})

// Compression
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false
    return compression.filter(req, res)
  }
}))

// Request parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request ID and metrics middleware
app.use((req, res, next) => {
  const requestId = Math.random().toString(36).substring(7)
  const startTime = performance.now()
  
  req.requestId = requestId
  req.startTime = startTime
  
  res.setHeader('X-Request-ID', requestId)
  
  logger.info(`[${requestId}] ${req.method} ${req.url}`, {
    requestId,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  })
  
  res.on('finish', () => {
    const duration = performance.now() - startTime
    logger.info(`[${requestId}] Response ${res.statusCode} - ${duration.toFixed(2)}ms`)
  })
  
  next()
})

// Rate limiting middleware
app.use(async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip)
    next()
  } catch (rejRes) {
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.round(rejRes.msBeforeNext / 1000) || 1
    })
  }
})

// JWT Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    req.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' })
  }
}

// Health check with comprehensive diagnostics
app.get('/health', async (req, res) => {
  try {
    const healthCheck = await cache.healthCheck()
    const stats = cache.getStats()
    
    res.json({
      status: healthCheck.status,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cache: stats,
      services: healthCheck.details
    })
  } catch (error) {
    logger.error('Health check failed', error)
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    })
  }
})

// Authentication endpoints
app.post('/auth/login', async (req, res) => {
  try {
    await authLimiter.consume(req.ip)
    
    const { email, password } = req.body
    
    // Validate credentials (implement your user validation)
    const user = await validateUser(email, password)
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )
    
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
  } catch (rejRes) {
    res.status(429).json({ error: 'Too many login attempts' })
  }
})

// Microservice proxy configuration
const services = {
  ai: {
    target: process.env.AI_SERVICE_URL || 'http://localhost:8082',
    pathRewrite: { '^/api/ai': '/api' }
  },
  workout: {
    target: process.env.WORKOUT_SERVICE_URL || 'http://localhost:8083',
    pathRewrite: { '^/api/workout': '/api' }
  },
  nutrition: {
    target: process.env.NUTRITION_SERVICE_URL || 'http://localhost:8084',
    pathRewrite: { '^/api/nutrition': '/api' }
  }
}

// Create proxies for each service
Object.entries(services).forEach(([name, config]) => {
  app.use(`/api/${name}`, authenticateToken, createProxyMiddleware({
    ...config,
    changeOrigin: true,
    onError: (err, req, res) => {
      logger.error(`Proxy error for ${name} service:`, err)
      res.status(502).json({ error: 'Service temporarily unavailable' })
    },
    onProxyReq: (proxyReq, req) => {
      proxyReq.setHeader('X-User-ID', req.user.userId)
      proxyReq.setHeader('X-Request-ID', req.requestId)
    }
  }))
})

// Error handling
app.use((error, req, res, next) => {
  logger.error(`[${req.requestId}] Error:`, error)
  
  res.status(error.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
    requestId: req.requestId
  })
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully')
  await cache.cleanup()
  await redis.quit()
  process.exit(0)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  logger.info(`🚀 Enhanced API Gateway running on port ${PORT}`)
})

export default app