import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { nutritionValidation } from '../middleware/validation';
import { logger } from '../utils/logger';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Search foods
router.get('/search', asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Search query required' });
  }
  
  const foods = await prisma.food.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { brand: { contains: q, mode: 'insensitive' } },
        { category: { contains: q, mode: 'insensitive' } }
      ]
    },
    take: 20,
    orderBy: { name: 'asc' }
  });
  
  res.json({ foods });
}));

// Get user's meal plans
router.get('/meal-plans', authenticateToken, asyncHandler(async (req: any, res) => {
  const mealPlans = await prisma.mealPlan.findMany({
    where: { userId: req.user.userId },
    include: {
      meals: {
        include: {
          foods: {
            include: {
              food: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  res.json({ mealPlans });
}));

// Create meal plan
router.post('/meal-plans', authenticateToken, nutritionValidation.createMealPlan, asyncHandler(async (req: any, res) => {
  const { name, description, targetCalories, meals } = req.body;
  
  const mealPlan = await prisma.mealPlan.create({
    data: {
      userId: req.user.userId,
      name,
      description,
      targetCalories,
      startDate: new Date(),
      meals: {
        create: meals.map((meal: any) => ({
          name: meal.name,
          type: meal.type,
          targetTime: meal.targetTime,
          foods: {
            create: meal.foods.map((food: any) => ({
              foodId: food.foodId,
              quantity: food.quantity
            }))
          }
        }))
      }
    },
    include: {
      meals: {
        include: {
          foods: {
            include: {
              food: true
            }
          }
        }
      }
    }
  });
  
  logger.info(`Meal plan created: ${mealPlan.id} by user: ${req.user.userId}`);
  res.status(201).json({ mealPlan });
}));

// Log food entry
router.post('/logs', authenticateToken, asyncHandler(async (req: any, res) => {
  const { foodId, mealType, quantity, date } = req.body;
  
  const logDate = date ? new Date(date) : new Date();
  logDate.setHours(0, 0, 0, 0); // Normalize to start of day
  
  // Get or create nutrition log for the date
  let nutritionLog = await prisma.nutritionLog.findUnique({
    where: {
      userId_date: {
        userId: req.user.userId,
        date: logDate
      }
    }
  });
  
  if (!nutritionLog) {
    nutritionLog = await prisma.nutritionLog.create({
      data: {
        userId: req.user.userId,
        date: logDate
      }
    });
  }
  
  // Create the food entry
  const entry = await prisma.nutritionLogEntry.create({
    data: {
      nutritionLogId: nutritionLog.id,
      foodId,
      mealType,
      quantity,
      timestamp: new Date()
    },
    include: {
      food: true
    }
  });
  
  logger.info(`Food logged: ${foodId} by user: ${req.user.userId}`);
  res.status(201).json({ entry });
}));

// Get nutrition logs
router.get('/logs', authenticateToken, asyncHandler(async (req: any, res) => {
  const { date } = req.query;
  
  let whereClause: any = { userId: req.user.userId };
  
  if (date) {
    const logDate = new Date(date as string);
    logDate.setHours(0, 0, 0, 0);
    whereClause.date = logDate;
  }
  
  const logs = await prisma.nutritionLog.findMany({
    where: whereClause,
    include: {
      entries: {
        include: {
          food: true
        },
        orderBy: { timestamp: 'asc' }
      }
    },
    orderBy: { date: 'desc' },
    take: date ? 1 : 30 // Get specific date or last 30 days
  });
  
  res.json({ logs });
}));

export default router;