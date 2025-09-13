import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Get dashboard analytics
router.get('/dashboard', authenticateToken, asyncHandler(async (req: any, res) => {
  const userId = req.user.userId;
  
  const [
    totalWorkouts,
    totalWorkoutTime,
    averageRating,
    weeklyProgress,
    goalProgress
  ] = await Promise.all([
    prisma.workoutSession.count({
      where: { userId, status: 'COMPLETED' }
    }),
    prisma.workoutSession.aggregate({
      where: { userId, status: 'COMPLETED' },
      _sum: { actualDuration: true }
    }),
    prisma.workoutSession.aggregate({
      where: { userId, status: 'COMPLETED', rating: { not: null } },
      _avg: { rating: true }
    }),
    prisma.workoutSession.groupBy({
      by: ['completedAt'],
      where: {
        userId,
        status: 'COMPLETED',
        completedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      _count: true
    }),
    prisma.goal.findMany({
      where: { userId, isActive: true },
      select: {
        id: true,
        title: true,
        currentValue: true,
        targetValue: true,
        unit: true
      }
    })
  ]);
  
  const analytics = {
    totalWorkouts,
    totalWorkoutTime: totalWorkoutTime._sum.actualDuration || 0,
    averageRating: averageRating._avg.rating || 0,
    weeklyWorkouts: weeklyProgress.length,
    goalProgress: goalProgress.map(goal => ({
      ...goal,
      progress: Math.min((goal.currentValue / goal.targetValue) * 100, 100)
    }))
  };
  
  res.json({ analytics });
}));

export default router;