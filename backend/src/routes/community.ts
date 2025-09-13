import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Get community posts
router.get('/posts', asyncHandler(async (req, res) => {
  const { limit = 20, offset = 0 } = req.query;
  
  const posts = await prisma.communityPost.findMany({
    where: { isPublic: true },
    include: {
      user: {
        select: { id: true, name: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: Number(limit),
    skip: Number(offset)
  });
  
  res.json({ posts });
}));

// Create community post
router.post('/posts', authenticateToken, asyncHandler(async (req: any, res) => {
  const { title, content, category, tags } = req.body;
  
  const post = await prisma.communityPost.create({
    data: {
      userId: req.user.userId,
      title,
      content,
      category,
      tags: tags || []
    },
    include: {
      user: {
        select: { id: true, name: true }
      }
    }
  });
  
  res.status(201).json({ post });
}));

export default router;