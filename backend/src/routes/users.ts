import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { userValidation } from '../middleware/validation';
import { logger } from '../utils/logger';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Get current user profile
router.get('/profile', authenticateToken, asyncHandler(async (req: any, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    include: {
      profile: true,
      subscription: true,
      goals: {
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      },
      workoutPlans: {
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          exercises: {
            include: {
              exercise: true
            }
          }
        }
      },
      mealPlans: {
        take: 5,
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
}));

// Update user profile
router.put('/profile', authenticateToken, userValidation.updateProfile, asyncHandler(async (req: any, res) => {
  const { name, height, weight, fitnessLevel, goals, activityLevel, dietaryRestrictions } = req.body;

  const updatedUser = await prisma.user.update({
    where: { id: req.user.userId },
    data: {
      ...(name && { name }),
      ...(fitnessLevel && { fitnessLevel }),
      ...(goals && { goals }),
      profile: {
        update: {
          ...(height && { height }),
          ...(weight && { weight }),
          ...(activityLevel && { activityLevel }),
          ...(dietaryRestrictions && { dietaryRestrictions })
        }
      }
    },
    include: {
      profile: true
    }
  });

  const { password, ...userWithoutPassword } = updatedUser;
  
  logger.info(`User profile updated: ${req.user.userId}`);
  res.json(userWithoutPassword);
}));

// Get user statistics
router.get('/stats', authenticateToken, asyncHandler(async (req: any, res) => {
  const userId = req.user.userId;

  // Get basic stats
  const [
    totalWorkouts,
    totalWorkoutTime,
    currentStreak,
    completedGoals,
    averageWorkoutRating
  ] = await Promise.all([
    prisma.workoutSession.count({
      where: { userId, status: 'COMPLETED' }
    }),
    prisma.workoutSession.aggregate({
      where: { userId, status: 'COMPLETED' },
      _sum: { actualDuration: true }
    }),
    // Calculate current streak (simplified)
    prisma.workoutSession.count({
      where: {
        userId,
        status: 'COMPLETED',
        completedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      }
    }),
    prisma.goal.count({
      where: { userId, status: 'COMPLETED' }
    }),
    prisma.workoutSession.aggregate({
      where: { userId, status: 'COMPLETED', rating: { not: null } },
      _avg: { rating: true }
    })
  ]);

  // Get weekly progress
  const weeklyProgress = await prisma.workoutSession.groupBy({
    by: ['completedAt'],
    where: {
      userId,
      status: 'COMPLETED',
      completedAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
      }
    },
    _count: true,
    orderBy: { completedAt: 'asc' }
  });

  res.json({
    totalWorkouts,
    totalWorkoutTime: totalWorkoutTime._sum.actualDuration || 0,
    currentStreak,
    completedGoals,
    averageWorkoutRating: averageWorkoutRating._avg.rating || 0,
    weeklyProgress: weeklyProgress.map(item => ({
      date: item.completedAt,
      workouts: item._count
    }))
  });
}));

// Get user achievements
router.get('/achievements', authenticateToken, asyncHandler(async (req: any, res) => {
  const userId = req.user.userId;

  // Get user's workout and goal completion data
  const [workoutCount, goalCount, streakDays] = await Promise.all([
    prisma.workoutSession.count({
      where: { userId, status: 'COMPLETED' }
    }),
    prisma.goal.count({
      where: { userId, status: 'COMPLETED' }
    }),
    // Simplified streak calculation
    7 // This would be calculated based on consecutive workout days
  ]);

  // Define achievements
  const achievements = [
    {
      id: 'first-workout',
      title: 'First Steps',
      description: 'Complete your first workout',
      icon: '🏃‍♂️',
      unlocked: workoutCount >= 1,
      progress: Math.min(workoutCount, 1),
      target: 1
    },
    {
      id: 'workout-streak-7',
      title: 'Week Warrior',
      description: 'Maintain a 7-day workout streak',
      icon: '🔥',
      unlocked: streakDays >= 7,
      progress: Math.min(streakDays, 7),
      target: 7
    },
    {
      id: 'goal-achiever',
      title: 'Goal Crusher',
      description: 'Complete 5 fitness goals',
      icon: '🎯',
      unlocked: goalCount >= 5,
      progress: Math.min(goalCount, 5),
      target: 5
    },
    {
      id: 'workout-master',
      title: 'Fitness Master',
      description: 'Complete 100 workouts',
      icon: '💪',
      unlocked: workoutCount >= 100,
      progress: Math.min(workoutCount, 100),
      target: 100
    }
  ];

  res.json({ achievements });
}));

// Delete user account
router.delete('/account', authenticateToken, asyncHandler(async (req: any, res) => {
  const userId = req.user.userId;

  // In a real implementation, you might want to soft delete or anonymize data
  await prisma.user.delete({
    where: { id: userId }
  });

  logger.info(`User account deleted: ${userId}`);
  res.json({ message: 'Account deleted successfully' });
}));

export default router;