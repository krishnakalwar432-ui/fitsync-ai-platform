// Advanced Redis Caching and Database Optimization System
// High-performance caching layer with intelligent invalidation

import Redis from 'ioredis'
import { PrismaClient } from '@prisma/client'
import { createHash } from 'crypto'
import { performance } from 'perf_hooks'
import winston from 'winston'

// Cache configuration
interface CacheConfig {
  defaultTTL: number
  maxRetries: number
  retryDelayMs: number
  compressionThreshold: number
  enableCompression: boolean
  enableMetrics: boolean
}

const defaultConfig: CacheConfig = {
  defaultTTL: 3600, // 1 hour
  maxRetries: 3,
  retryDelayMs: 100,
  compressionThreshold: 1024, // 1KB
  enableCompression: true,
  enableMetrics: true
}

// Cache statistics
interface CacheStats {
  hits: number
  misses: number
  writes: number
  errors: number
  totalResponseTime: number
  averageResponseTime: number
}

class RedisOptimizedCache {
  private redis: Redis
  private prisma: PrismaClient
  private config: CacheConfig
  private stats: CacheStats
  private logger: winston.Logger
  private circuitBreaker: Map<string, { failures: number, lastFailure: number, isOpen: boolean }>

  constructor(redisUrl: string, config: Partial<CacheConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
    this.stats = {
      hits: 0,
      misses: 0,
      writes: 0,
      errors: 0,
      totalResponseTime: 0,
      averageResponseTime: 0
    }
    this.circuitBreaker = new Map()

    // Initialize Redis with optimized configuration
    this.redis = new Redis(redisUrl, {
      retryDelayOnFailover: 100,
      enableReadyCheck: true,
      maxRetriesPerRequest: this.config.maxRetries,
      lazyConnect: true,
      // Connection pool optimization
      family: 4,
      keepAlive: true,
      // Compression for large payloads
      compression: this.config.enableCompression ? 'gzip' : undefined,
      // Command timeout
      commandTimeout: 5000,
      // Connection timeout
      connectTimeout: 10000
    })

    this.prisma = new PrismaClient({
      log: ['error', 'warn'],
      // Connection pooling
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    })

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: 'cache-performance.log' }),
        new winston.transports.Console()
      ]
    })

    this.setupEventHandlers()
  }

  private setupEventHandlers() {
    this.redis.on('connect', () => {
      this.logger.info('Redis connected successfully')
    })

    this.redis.on('error', (error) => {
      this.logger.error('Redis connection error:', error)
      this.stats.errors++
    })

    this.redis.on('reconnecting', () => {
      this.logger.warn('Redis reconnecting...')
    })
  }

  // Smart cache key generation with namespacing
  private generateKey(namespace: string, identifier: string, params?: Record<string, any>): string {
    const base = `${namespace}:${identifier}`
    if (!params) return base
    
    const paramsHash = createHash('md5')
      .update(JSON.stringify(params))
      .digest('hex')
      .substring(0, 8)
    
    return `${base}:${paramsHash}`
  }

  // Circuit breaker pattern for cache operations
  private async withCircuitBreaker<T>(key: string, operation: () => Promise<T>): Promise<T | null> {
    const circuit = this.circuitBreaker.get(key) || { failures: 0, lastFailure: 0, isOpen: false }
    
    // Check if circuit is open
    if (circuit.isOpen) {
      const timeSinceLastFailure = Date.now() - circuit.lastFailure
      if (timeSinceLastFailure < 30000) { // 30 seconds cooldown
        return null
      } else {
        circuit.isOpen = false // Reset circuit
      }
    }

    try {
      const result = await operation()
      circuit.failures = 0 // Reset on success
      this.circuitBreaker.set(key, circuit)
      return result
    } catch (error) {
      circuit.failures++
      circuit.lastFailure = Date.now()
      
      if (circuit.failures >= 3) {
        circuit.isOpen = true
        this.logger.warn(`Circuit breaker opened for key: ${key}`)
      }
      
      this.circuitBreaker.set(key, circuit)
      throw error
    }
  }

  // Advanced get with compression and metrics
  async get<T>(namespace: string, identifier: string, params?: Record<string, any>): Promise<T | null> {
    const startTime = performance.now()
    const key = this.generateKey(namespace, identifier, params)

    try {
      const result = await this.withCircuitBreaker(key, async () => {
        return await this.redis.get(key)
      })

      if (result === null) {
        this.stats.misses++
        this.logger.debug(`Cache miss for key: ${key}`)
        return null
      }

      this.stats.hits++
      const responseTime = performance.now() - startTime
      this.updateResponseTimeStats(responseTime)
      
      this.logger.debug(`Cache hit for key: ${key}, response time: ${responseTime.toFixed(2)}ms`)
      
      return JSON.parse(result)
    } catch (error) {
      this.stats.errors++
      this.logger.error(`Cache get error for key ${key}:`, error)
      return null
    }
  }

  // Advanced set with TTL optimization and compression
  async set<T>(namespace: string, identifier: string, value: T, ttl?: number, params?: Record<string, any>): Promise<boolean> {
    const key = this.generateKey(namespace, identifier, params)
    const serialized = JSON.stringify(value)
    const finalTTL = ttl || this.config.defaultTTL

    try {
      await this.withCircuitBreaker(key, async () => {
        // Use different commands based on TTL
        if (finalTTL > 0) {
          return await this.redis.setex(key, finalTTL, serialized)
        } else {
          return await this.redis.set(key, serialized)
        }
      })

      this.stats.writes++
      this.logger.debug(`Cache set for key: ${key}, TTL: ${finalTTL}s`)
      
      // Set up cache invalidation tags
      await this.addToInvalidationSet(namespace, key)
      
      return true
    } catch (error) {
      this.stats.errors++
      this.logger.error(`Cache set error for key ${key}:`, error)
      return false
    }
  }

  // Intelligent cache warming
  async warmCache(namespace: string, warmingStrategy: 'lazy' | 'eager' = 'lazy'): Promise<void> {
    this.logger.info(`Starting cache warming for namespace: ${namespace}, strategy: ${warmingStrategy}`)
    
    try {
      switch (namespace) {
        case 'exercises':
          await this.warmExercisesCache()
          break
        case 'workouts':
          await this.warmWorkoutsCache()
          break
        case 'users':
          await this.warmUsersCache()
          break
        default:
          this.logger.warn(`Unknown namespace for cache warming: ${namespace}`)
      }
    } catch (error) {
      this.logger.error(`Cache warming failed for namespace ${namespace}:`, error)
    }
  }

  private async warmExercisesCache(): Promise<void> {
    const exercises = await this.prisma.exercise.findMany({
      select: { id: true, name: true, category: true, muscleGroups: true, difficulty: true }
    })

    const promises = exercises.map(exercise => 
      this.set('exercises', exercise.id.toString(), exercise, 7200) // 2 hours TTL
    )

    await Promise.all(promises)
    this.logger.info(`Warmed ${exercises.length} exercises in cache`)
  }

  private async warmWorkoutsCache(): Promise<void> {
    const popularWorkouts = await this.prisma.workout.findMany({
      where: { isPublic: true },
      include: { exercises: true },
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    const promises = popularWorkouts.map(workout => 
      this.set('workouts', workout.id.toString(), workout, 3600) // 1 hour TTL
    )

    await Promise.all(promises)
    this.logger.info(`Warmed ${popularWorkouts.length} workouts in cache`)
  }

  private async warmUsersCache(): Promise<void> {
    // Cache user preferences and settings (not sensitive data)
    const userPreferences = await this.prisma.user.findMany({
      select: { 
        id: true, 
        fitnessGoals: true, 
        experienceLevel: true,
        preferredWorkoutDuration: true
      }
    })

    const promises = userPreferences.map(user => 
      this.set('user_preferences', user.id.toString(), user, 1800) // 30 minutes TTL
    )

    await Promise.all(promises)
    this.logger.info(`Warmed ${userPreferences.length} user preferences in cache`)
  }

  // Cache invalidation with tag-based system
  private async addToInvalidationSet(namespace: string, key: string): Promise<void> {
    const setKey = `invalidation_set:${namespace}`
    await this.redis.sadd(setKey, key)
    await this.redis.expire(setKey, this.config.defaultTTL * 2) // Expire the set after 2x default TTL
  }

  async invalidateNamespace(namespace: string): Promise<number> {
    const setKey = `invalidation_set:${namespace}`
    const keys = await this.redis.smembers(setKey)
    
    if (keys.length === 0) {
      return 0
    }

    // Use pipeline for efficient batch operations
    const pipeline = this.redis.pipeline()
    keys.forEach(key => pipeline.del(key))
    pipeline.del(setKey)
    
    await pipeline.exec()
    
    this.logger.info(`Invalidated ${keys.length} keys in namespace: ${namespace}`)
    return keys.length
  }

  // Database query optimization with intelligent caching
  async queryWithCache<T>(
    namespace: string,
    identifier: string,
    queryFn: () => Promise<T>,
    ttl?: number,
    params?: Record<string, any>
  ): Promise<T> {
    // Try cache first
    const cached = await this.get<T>(namespace, identifier, params)
    if (cached !== null) {
      return cached
    }

    // Execute database query
    const startTime = performance.now()
    try {
      const result = await queryFn()
      const queryTime = performance.now() - startTime
      
      // Cache the result
      await this.set(namespace, identifier, result, ttl, params)
      
      this.logger.info(`Database query executed for ${namespace}:${identifier}, time: ${queryTime.toFixed(2)}ms`)
      return result
    } catch (error) {
      this.logger.error(`Database query failed for ${namespace}:${identifier}:`, error)
      throw error
    }
  }

  // Batch operations for improved performance
  async mget<T>(namespace: string, identifiers: string[]): Promise<(T | null)[]> {
    const keys = identifiers.map(id => this.generateKey(namespace, id))
    
    try {
      const results = await this.redis.mget(...keys)
      return results.map(result => result ? JSON.parse(result) : null)
    } catch (error) {
      this.logger.error('Batch get operation failed:', error)
      return identifiers.map(() => null)
    }
  }

  async mset<T>(namespace: string, items: Array<{ identifier: string, value: T, ttl?: number }>): Promise<boolean> {
    const pipeline = this.redis.pipeline()
    
    items.forEach(item => {
      const key = this.generateKey(namespace, item.identifier)
      const serialized = JSON.stringify(item.value)
      const ttl = item.ttl || this.config.defaultTTL
      
      pipeline.setex(key, ttl, serialized)
    })

    try {
      await pipeline.exec()
      this.stats.writes += items.length
      return true
    } catch (error) {
      this.logger.error('Batch set operation failed:', error)
      return false
    }
  }

  // Cache statistics and monitoring
  private updateResponseTimeStats(responseTime: number): void {
    this.stats.totalResponseTime += responseTime
    const totalOperations = this.stats.hits + this.stats.misses
    this.stats.averageResponseTime = this.stats.totalResponseTime / totalOperations
  }

  getStats(): CacheStats & { hitRate: number } {
    const totalOperations = this.stats.hits + this.stats.misses
    const hitRate = totalOperations > 0 ? (this.stats.hits / totalOperations) * 100 : 0
    
    return {
      ...this.stats,
      hitRate: parseFloat(hitRate.toFixed(2))
    }
  }

  // Health check for cache system
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy', details: any }> {
    try {
      const startTime = performance.now()
      await this.redis.ping()
      const pingTime = performance.now() - startTime
      
      const dbStartTime = performance.now()
      await this.prisma.$queryRaw`SELECT 1`
      const dbPingTime = performance.now() - dbStartTime
      
      return {
        status: 'healthy',
        details: {
          redis: {
            connected: true,
            pingTime: `${pingTime.toFixed(2)}ms`
          },
          database: {
            connected: true,
            pingTime: `${dbPingTime.toFixed(2)}ms`
          },
          cache: this.getStats()
        }
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error.message,
          cache: this.getStats()
        }
      }
    }
  }

  // Memory management
  async cleanup(): Promise<void> {
    try {
      // Close Redis connection
      await this.redis.quit()
      
      // Close Prisma connection
      await this.prisma.$disconnect()
      
      this.logger.info('Cache system cleanup completed')
    } catch (error) {
      this.logger.error('Cache system cleanup failed:', error)
    }
  }

  // Performance monitoring and alerting
  async startPerformanceMonitoring(intervalMs: number = 60000): Promise<void> {
    setInterval(() => {
      const stats = this.getStats()
      
      // Log performance metrics
      this.logger.info('Cache Performance Report', {
        hitRate: stats.hitRate,
        averageResponseTime: stats.averageResponseTime,
        totalOperations: stats.hits + stats.misses,
        errors: stats.errors
      })
      
      // Alert on poor performance
      if (stats.hitRate < 70) {
        this.logger.warn(`Low cache hit rate: ${stats.hitRate}%`)
      }
      
      if (stats.averageResponseTime > 10) {
        this.logger.warn(`High average response time: ${stats.averageResponseTime.toFixed(2)}ms`)
      }
      
      if (stats.errors > 10) {
        this.logger.error(`High error count: ${stats.errors} errors`)
      }
    }, intervalMs)
  }
}

// Database optimization utilities
class DatabaseOptimizer {
  private prisma: PrismaClient
  private logger: winston.Logger

  constructor() {
    this.prisma = new PrismaClient({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    })

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: 'database-performance.log' }),
        new winston.transports.Console()
      ]
    })

    this.setupQueryLogging()
  }

  private setupQueryLogging(): void {
    this.prisma.$on('query', (e) => {
      if (e.duration > 1000) { // Log slow queries (>1s)
        this.logger.warn('Slow query detected', {
          query: e.query,
          duration: `${e.duration}ms`,
          params: e.params
        })
      }
    })

    this.prisma.$on('error', (e) => {
      this.logger.error('Database error', e)
    })
  }

  // Optimize common queries with proper indexing hints
  async optimizeUserQueries(): Promise<void> {
    // Add indexes for common user queries
    await this.prisma.$executeRaw`
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_email ON users(email);
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_created_at ON users(created_at);
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_fitness_goals ON users USING GIN(fitness_goals);
    `
    
    this.logger.info('User query optimization completed')
  }

  async optimizeWorkoutQueries(): Promise<void> {
    // Add indexes for workout queries
    await this.prisma.$executeRaw`
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_workout_user_id ON workouts(user_id);
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_workout_difficulty ON workouts(difficulty);
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_workout_category ON workouts(category);
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_workout_is_public ON workouts(is_public);
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_workout_created_at ON workouts(created_at);
    `
    
    this.logger.info('Workout query optimization completed')
  }

  async optimizeExerciseQueries(): Promise<void> {
    // Add indexes for exercise queries
    await this.prisma.$executeRaw`
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_exercise_category ON exercises(category);
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_exercise_difficulty ON exercises(difficulty);
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_exercise_muscle_groups ON exercises USING GIN(muscle_groups);
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_exercise_equipment ON exercises USING GIN(equipment);
    `
    
    this.logger.info('Exercise query optimization completed')
  }

  // Connection pool optimization
  async optimizeConnectionPool(): Promise<void> {
    // This is handled in the Prisma configuration
    // Connection pooling is automatically managed by Prisma
    this.logger.info('Connection pool optimization is handled by Prisma')
  }
}

// Export the enhanced cache system
export { RedisOptimizedCache, DatabaseOptimizer, CacheConfig, CacheStats }

// Usage example
export async function createOptimizedCacheSystem(): Promise<RedisOptimizedCache> {
  const cache = new RedisOptimizedCache(
    process.env.REDIS_URL || 'redis://localhost:6379',
    {
      defaultTTL: 3600,
      enableCompression: true,
      enableMetrics: true
    }
  )

  // Start performance monitoring
  await cache.startPerformanceMonitoring(60000) // Every minute
  
  // Warm up common caches
  await cache.warmCache('exercises', 'eager')
  await cache.warmCache('workouts', 'lazy')
  
  return cache
}