// Enhanced Bull Queue Configuration for FitSync AI
// Background job processing for AI tasks, notifications, and analytics

import Bull from 'bull'
import { redis } from '../config/redis'
import { Logger } from '../config/logger'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Queue configurations
const queueConfig = {
  redis: {
    port: parseInt(process.env.REDIS_PORT || '6379'),
    host: process.env.REDIS_HOST || 'localhost',
    password: process.env.REDIS_PASSWORD,
  },
  defaultJobOptions: {
    removeOnComplete: 100, // Keep last 100 completed jobs
    removeOnFail: 50,      // Keep last 50 failed jobs
    attempts: 3,           // Retry failed jobs 3 times
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
}

// Create queues
export const aiQueue = new Bull('AI Jobs', queueConfig)
export const emailQueue = new Bull('Email Jobs', queueConfig)
export const analyticsQueue = new Bull('Analytics Jobs', queueConfig)
export const notificationQueue = new Bull('Notification Jobs', queueConfig)
export const workoutQueue = new Bull('Workout Jobs', queueConfig)

// Job Types
export interface AIJobData {
  type: 'generate-workout' | 'generate-nutrition' | 'chat-response' | 'analyze-progress'
  userId: string
  data: any
  priority?: number
}

export interface EmailJobData {
  type: 'welcome' | 'workout-reminder' | 'progress-report' | 'newsletter'
  userId: string
  email: string
  data: any
}

export interface AnalyticsJobData {
  type: 'user-analytics' | 'workout-analytics' | 'nutrition-analytics' | 'ai-usage'
  userId?: string
  data: any
  timeframe: 'daily' | 'weekly' | 'monthly'
}

export interface NotificationJobData {
  type: 'push' | 'in-app' | 'sms'
  userId: string
  title: string
  message: string
  data?: any
}

export interface WorkoutJobData {
  type: 'complete-workout' | 'calculate-calories' | 'update-progress' | 'generate-recommendations'
  userId: string
  workoutId?: string
  data: any
}

// AI Job Processors
aiQueue.process('generate-workout', 5, async (job) => {
  const { userId, data } = job.data as AIJobData
  
  try {
    Logger.info(`Processing AI workout generation for user ${userId}`)
    
    const { preferences, fitnessLevel, goals, equipment, duration } = data
    
    // Create AI prompt for workout generation
    const prompt = `
    Create a personalized ${duration}-minute ${preferences.type} workout for:
    - Fitness Level: ${fitnessLevel}
    - Primary Goals: ${goals.join(', ')}
    - Available Equipment: ${equipment.join(', ')}
    - Preferences: ${JSON.stringify(preferences)}
    
    Return a structured JSON workout plan with exercises, sets, reps, rest periods, and progression notes.
    Include proper warm-up and cool-down exercises.
    `
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a certified personal trainer creating detailed, safe, and effective workout plans."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7
    })
    
    const workoutPlan = completion.choices[0]?.message?.content
    
    if (!workoutPlan) {
      throw new Error('Failed to generate workout plan')
    }
    
    // Parse and validate the AI response
    let parsedWorkout
    try {
      parsedWorkout = JSON.parse(workoutPlan)
    } catch {
      // If JSON parsing fails, create structured response
      parsedWorkout = {
        name: `${preferences.type} Workout`,
        duration,
        difficulty: fitnessLevel,
        description: workoutPlan,
        exercises: [], // Would need to parse from text
        estimatedCalories: duration * 8, // Rough estimate
        aiGenerated: true
      }
    }
    
    // Save workout to database
    const { prisma } = await import('../../../lib/prisma')
    const savedWorkout = await prisma.workout.create({
      data: {
        userId,
        name: parsedWorkout.name || `AI Generated ${preferences.type} Workout`,
        description: parsedWorkout.description,
        duration: parsedWorkout.duration || duration,
        difficulty: fitnessLevel.toUpperCase(),
        category: preferences.type || 'strength',
        isPublic: false,
      }
    })
    
    // Queue notification
    await notificationQueue.add('in-app', {
      userId,
      title: 'Your Workout is Ready! 💪',
      message: `We've created a personalized ${duration}-minute workout just for you.`,
      data: { workoutId: savedWorkout.id, type: 'workout-generated' }
    })
    
    Logger.logAiOperation('Workout Generation', completion.usage?.total_tokens, undefined)
    
    return {
      success: true,
      workoutId: savedWorkout.id,
      workout: parsedWorkout,
      tokensUsed: completion.usage?.total_tokens
    }
    
  } catch (error) {
    Logger.logAiOperation('Workout Generation', undefined, undefined, error as Error)
    throw error
  }
})

aiQueue.process('generate-nutrition', 3, async (job) => {
  const { userId, data } = job.data as AIJobData
  
  try {
    Logger.info(`Processing AI nutrition plan generation for user ${userId}`)
    
    const { goals, dietaryRestrictions, preferences, dailyCalories, activityLevel } = data
    
    const prompt = `
    Create a personalized daily nutrition plan for:
    - Daily Calorie Target: ${dailyCalories}
    - Activity Level: ${activityLevel}
    - Goals: ${goals.join(', ')}
    - Dietary Restrictions: ${dietaryRestrictions.join(', ') || 'None'}
    - Preferences: ${JSON.stringify(preferences)}
    
    Return a structured JSON meal plan with breakfast, lunch, dinner, and snacks.
    Include macro breakdown, portion sizes, and meal timing recommendations.
    `
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a registered dietitian creating balanced, healthy meal plans."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1200,
      temperature: 0.7
    })
    
    const nutritionPlan = completion.choices[0]?.message?.content
    
    if (!nutritionPlan) {
      throw new Error('Failed to generate nutrition plan')
    }
    
    // Save to database and queue notification
    const { prisma } = await import('../../../lib/prisma')
    const savedPlan = await prisma.nutritionPlan.create({
      data: {
        userId,
        name: 'AI Generated Nutrition Plan',
        description: 'Personalized meal plan created by AI',
        startDate: new Date(),
        dailyCalories,
        macroTargets: {
          protein: Math.round(dailyCalories * 0.3 / 4),
          carbs: Math.round(dailyCalories * 0.4 / 4),
          fat: Math.round(dailyCalories * 0.3 / 9)
        },
        isActive: true
      }
    })
    
    await notificationQueue.add('in-app', {
      userId,
      title: 'Nutrition Plan Ready! 🥗',
      message: `Your personalized meal plan with ${dailyCalories} daily calories is ready.`,
      data: { nutritionPlanId: savedPlan.id, type: 'nutrition-generated' }
    })
    
    Logger.logAiOperation('Nutrition Generation', completion.usage?.total_tokens, undefined)
    
    return {
      success: true,
      nutritionPlanId: savedPlan.id,
      plan: nutritionPlan,
      tokensUsed: completion.usage?.total_tokens
    }
    
  } catch (error) {
    Logger.logAiOperation('Nutrition Generation', undefined, undefined, error as Error)
    throw error
  }
})

// Analytics Job Processors
analyticsQueue.process('user-analytics', 10, async (job) => {
  const { userId, timeframe } = job.data as AnalyticsJobData
  
  try {
    Logger.info(`Processing user analytics for ${userId} (${timeframe})`)
    
    const { prisma } = await import('../../../lib/prisma')
    
    // Calculate date range
    const now = new Date()
    let startDate: Date
    
    switch (timeframe) {
      case 'daily':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'monthly':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
    }
    
    // Gather analytics data
    const [completedWorkouts, progressLogs, aiChats] = await Promise.all([
      prisma.completedWorkout.findMany({
        where: {
          userId,
          completedAt: { gte: startDate }
        },
        include: { workout: true }
      }),
      prisma.progressLog.findMany({
        where: {
          userId,
          date: { gte: startDate }
        }
      }),
      prisma.aIChat.findMany({
        where: {
          userId,
          createdAt: { gte: startDate }
        }
      })
    ])
    
    // Calculate analytics
    const analytics = {
      timeframe,
      period: { start: startDate, end: now },
      workouts: {
        total: completedWorkouts.length,
        totalDuration: completedWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0),
        totalCalories: completedWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0),
        averageRating: completedWorkouts.length > 0 
          ? completedWorkouts.reduce((sum, w) => sum + (w.rating || 0), 0) / completedWorkouts.length 
          : 0
      },
      progress: {
        logsCount: progressLogs.length,
        weightChange: progressLogs.length >= 2 
          ? (progressLogs[0].weight || 0) - (progressLogs[progressLogs.length - 1].weight || 0)
          : 0
      },
      aiUsage: {
        totalChats: aiChats.length,
        totalMessages: aiChats.reduce((sum, chat) => {
          const messages = Array.isArray(chat.messages) ? chat.messages : []
          return sum + messages.length
        }, 0)
      }
    }
    
    // Store analytics in Redis for quick access
    await redis.setex(
      `analytics:${userId}:${timeframe}`,
      timeframe === 'daily' ? 3600 : timeframe === 'weekly' ? 86400 : 604800,
      JSON.stringify(analytics)
    )
    
    Logger.logPerformance('User Analytics Calculation', 0, { userId, timeframe })
    
    return analytics
    
  } catch (error) {
    Logger.error('Analytics calculation failed', error)
    throw error
  }
})

// Email Job Processors
emailQueue.process('welcome', 5, async (job) => {
  const { userId, email, data } = job.data as EmailJobData
  
  try {
    Logger.info(`Sending welcome email to ${email}`)
    
    // TODO: Implement actual email sending
    // For now, just log the action
    const emailContent = {
      to: email,
      subject: 'Welcome to FitSync AI! 🚀',
      template: 'welcome',
      data: {
        name: data.name,
        userId
      }
    }
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    Logger.info(`Welcome email sent successfully to ${email}`)
    
    return { success: true, emailId: `email_${Date.now()}` }
    
  } catch (error) {
    Logger.error('Welcome email failed', error)
    throw error
  }
})

// Notification Job Processors
notificationQueue.process('in-app', 10, async (job) => {
  const { userId, title, message, data } = job.data as NotificationJobData
  
  try {
    Logger.info(`Creating in-app notification for user ${userId}`)
    
    // Store notification in Redis for real-time delivery
    const notification = {
      id: `notif_${Date.now()}`,
      userId,
      title,
      message,
      data,
      type: 'in-app',
      read: false,
      createdAt: new Date().toISOString()
    }
    
    await redis.lpush(`notifications:${userId}`, JSON.stringify(notification))
    await redis.ltrim(`notifications:${userId}`, 0, 99) // Keep last 100 notifications
    
    // Publish to real-time channel if user is online
    await redis.publish(`user:${userId}:notifications`, JSON.stringify(notification))
    
    Logger.info(`In-app notification created for user ${userId}`)
    
    return { success: true, notificationId: notification.id }
    
  } catch (error) {
    Logger.error('In-app notification failed', error)
    throw error
  }
})

// Queue Event Handlers
const setupQueueEvents = (queue: Bull.Queue, queueName: string) => {
  queue.on('completed', (job) => {
    Logger.info(`${queueName} job completed`, {
      jobId: job.id,
      jobType: job.name,
      duration: Date.now() - job.timestamp
    })
  })
  
  queue.on('failed', (job, err) => {
    Logger.error(`${queueName} job failed`, {
      jobId: job.id,
      jobType: job.name,
      error: err.message,
      attempts: job.attemptsMade,
      data: job.data
    })
  })
  
  queue.on('stalled', (job) => {
    Logger.warn(`${queueName} job stalled`, {
      jobId: job.id,
      jobType: job.name
    })
  })
}

// Setup events for all queues
setupQueueEvents(aiQueue, 'AI')
setupQueueEvents(emailQueue, 'Email')
setupQueueEvents(analyticsQueue, 'Analytics')
setupQueueEvents(notificationQueue, 'Notification')
setupQueueEvents(workoutQueue, 'Workout')

// Queue management utilities
export class QueueManager {
  static async getQueueStats() {
    const queues = [
      { name: 'AI', queue: aiQueue },
      { name: 'Email', queue: emailQueue },
      { name: 'Analytics', queue: analyticsQueue },
      { name: 'Notification', queue: notificationQueue },
      { name: 'Workout', queue: workoutQueue }
    ]
    
    const stats = await Promise.all(
      queues.map(async ({ name, queue }) => {
        const [waiting, active, completed, failed] = await Promise.all([
          queue.getWaiting(),
          queue.getActive(),
          queue.getCompleted(),
          queue.getFailed()
        ])
        
        return {
          name,
          waiting: waiting.length,
          active: active.length,
          completed: completed.length,
          failed: failed.length
        }
      })
    )
    
    return stats
  }
  
  static async clearAllQueues() {
    const queues = [aiQueue, emailQueue, analyticsQueue, notificationQueue, workoutQueue]
    await Promise.all(queues.map(queue => queue.clean(0, 'completed')))
    await Promise.all(queues.map(queue => queue.clean(0, 'failed')))
    Logger.info('All queues cleared')
  }
  
  static async pauseAllQueues() {
    const queues = [aiQueue, emailQueue, analyticsQueue, notificationQueue, workoutQueue]
    await Promise.all(queues.map(queue => queue.pause()))
    Logger.info('All queues paused')
  }
  
  static async resumeAllQueues() {
    const queues = [aiQueue, emailQueue, analyticsQueue, notificationQueue, workoutQueue]
    await Promise.all(queues.map(queue => queue.resume()))
    Logger.info('All queues resumed')
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  Logger.info('Shutting down queues gracefully...')
  await aiQueue.close()
  await emailQueue.close()
  await analyticsQueue.close()
  await notificationQueue.close()
  await workoutQueue.close()
})