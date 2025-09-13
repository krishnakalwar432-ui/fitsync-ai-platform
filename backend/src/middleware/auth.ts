import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Verify JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret'
    ) as any;

    // Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Add user info to request
    req.user = {
      userId: user.id,
      email: user.email
    };

    next();
  } catch (error) {
    logger.error('Token verification failed:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    return res.status(500).json({ error: 'Authentication error' });
  }
};

// Optional authentication - doesn't fail if no token provided
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'fallback-secret'
      ) as any;

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true }
      });

      if (user) {
        req.user = {
          userId: user.id,
          email: user.email
        };
      }
    }

    next();
  } catch (error) {
    // Don't fail on optional auth errors, just continue without user
    next();
  }
};

// Check if user has required subscription level
export const requireSubscription = (requiredPlan: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const subscription = await prisma.subscription.findUnique({
        where: { userId: req.user.userId },
        select: { plan: true, status: true }
      });

      if (!subscription || subscription.status !== 'ACTIVE') {
        return res.status(403).json({ 
          error: 'Active subscription required',
          requiredPlan 
        });
      }

      // Check subscription level (FREE < PREMIUM < PROFESSIONAL)
      const planLevels = {
        'FREE': 0,
        'PREMIUM': 1,
        'PROFESSIONAL': 2
      };

      const userLevel = planLevels[subscription.plan as keyof typeof planLevels] || 0;
      const requiredLevel = planLevels[requiredPlan as keyof typeof planLevels] || 0;

      if (userLevel < requiredLevel) {
        return res.status(403).json({ 
          error: 'Higher subscription level required',
          currentPlan: subscription.plan,
          requiredPlan 
        });
      }

      next();
    } catch (error) {
      logger.error('Subscription check failed:', error);
      return res.status(500).json({ error: 'Subscription verification error' });
    }
  };
};