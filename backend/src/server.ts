import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import workoutRoutes from './routes/workouts';
import nutritionRoutes from './routes/nutrition';
import aiRoutes from './routes/ai';
import analyticsRoutes from './routes/analytics';
import subscriptionRoutes from './routes/subscriptions';
import communityRoutes from './routes/community';
import uploadRoutes from './routes/uploads';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

dotenv.config();

// Initialize Express app
const app = express();
const server = createServer(app);

// Initialize Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Initialize Prisma
const prisma = new PrismaClient();

// Initialize Redis
const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Connect to Redis
redis.connect().catch(console.error);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());
app.use(limiter);
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://fitsync-ai.vercel.app', // Your Vercel deployment
    'https://*.vercel.app' // Allow all Vercel preview deployments
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/uploads', uploadRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  socket.on('join-workout-room', (workoutId) => {
    socket.join(`workout-${workoutId}`);
    logger.info(`User ${socket.id} joined workout room: ${workoutId}`);
  });

  socket.on('workout-update', (data) => {
    socket.to(`workout-${data.workoutId}`).emit('workout-progress', data);
  });

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: 'The requested API endpoint does not exist'
  });
});

const PORT = process.env.PORT || 8000;

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  await redis.disconnect();
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

server.listen(PORT, () => {
  logger.info(`🚀 FitSync AI Backend Server running on port ${PORT}`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`📊 Health check: http://localhost:${PORT}/health`);
});

export { app, io, prisma, redis };