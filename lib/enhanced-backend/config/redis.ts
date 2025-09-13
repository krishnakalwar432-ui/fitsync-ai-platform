// Enhanced Redis Configuration for FitSync AI
import Redis from 'ioredis'
import { logger } from './logger'

interface RedisConfig {
  host: string
  port: number
  password?: string
  db: number
  retryDelayOnFailover: number
  maxRetriesPerRequest: number
  lazyConnect: boolean
  keepAlive: number
}

const redisConfig: RedisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keepAlive: 30000
}

// Create Redis client with retry logic
export const redis = new Redis({
  ...redisConfig,
  reconnectOnError: (err: Error) => {
    const targetError = 'READONLY'
    return err.message.includes(targetError)
  },
  retryDelayOnFailover: 100,
  enableOfflineQueue: false
})

// Redis event handlers
redis.on('connect', () => {
  logger.info('✅ Redis connected successfully')
})

redis.on('ready', () => {
  logger.info('🚀 Redis ready for operations')
})

redis.on('error', (err: Error) => {
  logger.error('❌ Redis connection error:', err)
})

redis.on('close', () => {
  logger.warn('⚠️ Redis connection closed')
})

redis.on('reconnecting', () => {
  logger.info('🔄 Redis reconnecting...')
})

// Redis utility functions
export class RedisService {
  // Cache with TTL
  static async setCache(key: string, value: any, ttl: number = 300): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value)
      await redis.setex(key, ttl, serializedValue)
      logger.debug(`Cache set: ${key} (TTL: ${ttl}s)`)
    } catch (error) {
      logger.error('Cache set error:', error)
    }
  }

  // Get cached data
  static async getCache<T>(key: string): Promise<T | null> {
    try {
      const cachedValue = await redis.get(key)
      if (cachedValue) {
        logger.debug(`Cache hit: ${key}`)
        return JSON.parse(cachedValue) as T
      }
      logger.debug(`Cache miss: ${key}`)
      return null
    } catch (error) {
      logger.error('Cache get error:', error)
      return null
    }
  }

  // Delete cache
  static async deleteCache(key: string): Promise<void> {
    try {
      await redis.del(key)
      logger.debug(`Cache deleted: ${key}`)
    } catch (error) {
      logger.error('Cache delete error:', error)
    }
  }

  // Cache with pattern deletion
  static async deleteCachePattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(...keys)
        logger.debug(`Cache pattern deleted: ${pattern} (${keys.length} keys)`)
      }
    } catch (error) {
      logger.error('Cache pattern delete error:', error)
    }
  }

  // Rate limiting
  static async checkRateLimit(key: string, limit: number, window: number): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    try {
      const current = await redis.incr(key)
      
      if (current === 1) {
        await redis.expire(key, window)
      }
      
      const ttl = await redis.ttl(key)
      const resetTime = Date.now() + (ttl * 1000)
      
      return {
        allowed: current <= limit,
        remaining: Math.max(0, limit - current),
        resetTime
      }
    } catch (error) {
      logger.error('Rate limit check error:', error)
      return { allowed: true, remaining: limit, resetTime: Date.now() + window * 1000 }
    }
  }

  // Session management
  static async setSession(sessionId: string, sessionData: any, ttl: number = 86400): Promise<void> {
    try {
      const key = `session:${sessionId}`
      await redis.setex(key, ttl, JSON.stringify(sessionData))
      logger.debug(`Session set: ${sessionId}`)
    } catch (error) {
      logger.error('Session set error:', error)
    }
  }

  static async getSession<T>(sessionId: string): Promise<T | null> {
    try {
      const key = `session:${sessionId}`
      const sessionData = await redis.get(key)
      return sessionData ? JSON.parse(sessionData) as T : null
    } catch (error) {
      logger.error('Session get error:', error)
      return null
    }
  }

  static async deleteSession(sessionId: string): Promise<void> {
    try {
      const key = `session:${sessionId}`
      await redis.del(key)
      logger.debug(`Session deleted: ${sessionId}`)
    } catch (error) {
      logger.error('Session delete error:', error)
    }
  }

  // Pub/Sub for real-time features
  static async publish(channel: string, message: any): Promise<void> {
    try {
      await redis.publish(channel, JSON.stringify(message))
      logger.debug(`Message published to ${channel}`)
    } catch (error) {
      logger.error('Publish error:', error)
    }
  }

  static async subscribe(channel: string, callback: (message: any) => void): Promise<void> {
    try {
      const subscriber = new Redis(redisConfig)
      subscriber.subscribe(channel)
      subscriber.on('message', (receivedChannel, message) => {
        if (receivedChannel === channel) {
          callback(JSON.parse(message))
        }
      })
      logger.info(`Subscribed to channel: ${channel}`)
    } catch (error) {
      logger.error('Subscribe error:', error)
    }
  }

  // Health check
  static async healthCheck(): Promise<boolean> {
    try {
      const result = await redis.ping()
      return result === 'PONG'
    } catch (error) {
      logger.error('Redis health check failed:', error)
      return false
    }
  }

  // Analytics helpers
  static async incrementCounter(key: string, value: number = 1): Promise<number> {
    try {
      return await redis.incrby(key, value)
    } catch (error) {
      logger.error('Counter increment error:', error)
      return 0
    }
  }

  static async addToList(key: string, value: any, maxLength?: number): Promise<void> {
    try {
      await redis.lpush(key, JSON.stringify(value))
      if (maxLength) {
        await redis.ltrim(key, 0, maxLength - 1)
      }
    } catch (error) {
      logger.error('List add error:', error)
    }
  }

  static async getList<T>(key: string, start: number = 0, end: number = -1): Promise<T[]> {
    try {
      const list = await redis.lrange(key, start, end)
      return list.map(item => JSON.parse(item) as T)
    } catch (error) {
      logger.error('List get error:', error)
      return []
    }
  }
}

export default redis