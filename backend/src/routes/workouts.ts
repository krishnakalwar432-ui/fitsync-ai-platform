import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { workoutValidation } from '../middleware/validation';
import { logger } from '../utils/logger';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Get all exercises
router.get('/exercises', asyncHandler(async (req, res) => {
  const exercises = await prisma.exercise.findMany({
    orderBy: { name: 'asc' }
  });
  
  res.json({ exercises });
}));

// Get user's workout plans
router.get('/plans', authenticateToken, asyncHandler(async (req: any, res) => {
  const plans = await prisma.workoutPlan.findMany({
    where: { userId: req.user.userId },
    include: {
      exercises: {
        include: {
          exercise: true
        },
        orderBy: { order: 'asc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  res.json({ plans });
}));

// Create workout plan
router.post('/plans', authenticateToken, workoutValidation.createWorkout, asyncHandler(async (req: any, res) => {
  const { name, description, difficulty, duration, exercises, tags } = req.body;
  
  const plan = await prisma.workoutPlan.create({
    data: {
      userId: req.user.userId,
      name,
      description,
      difficulty,
      duration,
      tags: tags || [],
      exercises: {
        create: exercises.map((exercise: any, index: number) => ({
          exerciseId: exercise.exerciseId,
          order: index + 1,
          sets: exercise.sets,
          reps: exercise.reps,
          duration: exercise.duration,
          weight: exercise.weight,
          restTime: exercise.restTime,
          notes: exercise.notes
        }))
      }
    },
    include: {
      exercises: {
        include: {
          exercise: true
        },
        orderBy: { order: 'asc' }
      }
    }
  });
  
  logger.info(`Workout plan created: ${plan.id} by user: ${req.user.userId}`);
  res.status(201).json({ plan });
}));

// Start workout session
router.post('/sessions/start', authenticateToken, asyncHandler(async (req: any, res) => {
  const { planId } = req.body;
  
  let workoutPlan = null;
  if (planId) {
    workoutPlan = await prisma.workoutPlan.findFirst({
      where: {
        id: planId,
        userId: req.user.userId
      },
      include: {
        exercises: {
          include: {
            exercise: true
          },
          orderBy: { order: 'asc' }
        }
      }
    });
    
    if (!workoutPlan) {
      return res.status(404).json({ error: 'Workout plan not found' });
    }
  }
  
  const session = await prisma.workoutSession.create({
    data: {
      userId: req.user.userId,
      workoutPlanId: planId || null,
      name: workoutPlan?.name || 'Custom Workout',
      plannedDuration: workoutPlan?.duration || 30,
      status: 'IN_PROGRESS'
    }
  });
  
  logger.info(`Workout session started: ${session.id} by user: ${req.user.userId}`);
  res.status(201).json({ session });
}));

// Complete workout session
router.post('/sessions/:sessionId/complete', authenticateToken, asyncHandler(async (req: any, res) => {
  const { sessionId } = req.params;
  const { actualDuration, exercises, rating, notes, caloriesBurned } = req.body;
  
  const session = await prisma.workoutSession.findFirst({
    where: {
      id: sessionId,
      userId: req.user.userId
    }
  });
  
  if (!session) {
    return res.status(404).json({ error: 'Workout session not found' });
  }
  
  const updatedSession = await prisma.workoutSession.update({
    where: { id: sessionId },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
      actualDuration,
      rating,
      notes,
      caloriesBurned
    }
  });
  
  // Save exercise data if provided
  if (exercises && exercises.length > 0) {
    await prisma.sessionExercise.createMany({
      data: exercises.map((exercise: any, index: number) => ({
        sessionId: sessionId,
        exerciseId: exercise.exerciseId,
        order: index + 1,
        sets: exercise.sets || [],
        notes: exercise.notes
      }))
    });
  }
  
  logger.info(`Workout session completed: ${sessionId} by user: ${req.user.userId}`);
  res.json({ session: updatedSession });
}));

export default router;