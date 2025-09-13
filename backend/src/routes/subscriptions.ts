import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Get subscription plans
router.get('/plans', asyncHandler(async (req, res) => {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      interval: 'month',
      features: [
        'Basic workout tracking',
        'Limited exercise library',
        'Community access'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 9.99,
      interval: 'month',
      features: [
        'Unlimited workouts',
        'AI coaching',
        'Nutrition tracking',
        'Advanced analytics',
        'Priority support'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 19.99,
      interval: 'month',
      features: [
        'Everything in Premium',
        'Personal trainer access',
        'Custom meal plans',
        'Video form analysis',
        'API access'
      ]
    }
  ];
  
  res.json({ plans });
}));

// Get current subscription
router.get('/current', authenticateToken, asyncHandler(async (req: any, res) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId: req.user.userId }
  });
  
  res.json({ subscription });
}));

export default router;