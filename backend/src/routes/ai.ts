import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { aiValidation } from '../middleware/validation';
import { logger } from '../utils/logger';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// AI Chat endpoint
router.post('/chat', authenticateToken, aiValidation.chatMessage, asyncHandler(async (req: any, res) => {
  const { message, context } = req.body;
  
  try {
    // Create or get chat session
    let session = await prisma.aIChatSession.findFirst({
      where: { 
        userId: req.user.userId,
        updatedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
    
    if (!session) {
      session = await prisma.aIChatSession.create({
        data: {
          userId: req.user.userId,
          title: message.substring(0, 50) + '...'
        }
      });
    }
    
    // Save user message
    await prisma.aIChatMessage.create({
      data: {
        sessionId: session.id,
        role: 'USER',
        content: message
      }
    });
    
    // Generate AI response (simplified for demo)
    const aiResponse = generateAIResponse(message, context);
    
    // Save AI response
    await prisma.aIChatMessage.create({
      data: {
        sessionId: session.id,
        role: 'ASSISTANT',
        content: aiResponse
      }
    });
    
    // Update session timestamp
    await prisma.aIChatSession.update({
      where: { id: session.id },
      data: { updatedAt: new Date() }
    });
    
    logger.info(`AI chat message processed for user: ${req.user.userId}`);
    res.json({ 
      response: aiResponse,
      sessionId: session.id 
    });
    
  } catch (error) {
    logger.error('AI chat error:', error);
    res.status(500).json({ error: 'AI service temporarily unavailable' });
  }
}));

// Get AI recommendations
router.get('/recommendations', authenticateToken, asyncHandler(async (req: any, res) => {
  const userId = req.user.userId;
  
  // Get user profile and recent activity
  const [user, recentWorkouts, recentNutrition] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { 
        profile: true,
        goals: { where: { isActive: true } }
      }
    }),
    prisma.workoutSession.findMany({
      where: { 
        userId,
        status: 'COMPLETED',
        completedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      orderBy: { completedAt: 'desc' },
      take: 10
    }),
    prisma.nutritionLog.findMany({
      where: {
        userId,
        date: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      include: { entries: true },
      take: 7
    })
  ]);
  
  // Generate personalized recommendations
  const recommendations = generateRecommendations(user, recentWorkouts, recentNutrition);
  
  res.json({ recommendations });
}));

// Form analysis endpoint
router.post('/form-analysis', authenticateToken, asyncHandler(async (req: any, res) => {
  const { videoData, exerciseType } = req.body;
  
  // Simulate form analysis (in production, would use computer vision)
  const analysis = {
    overall_score: Math.floor(Math.random() * 40) + 60, // 60-100
    feedback: [
      'Keep your core engaged throughout the movement',
      'Maintain neutral spine alignment',
      'Control the tempo - slower on the eccentric phase'
    ],
    corrections: [
      'Slightly bend your knees for better stability',
      'Keep your shoulders back and down'
    ],
    risk_level: 'low',
    confidence: 0.85
  };
  
  logger.info(`Form analysis performed for user: ${req.user.userId}, exercise: ${exerciseType}`);
  res.json({ analysis });
}));

// Voice command processing
router.post('/voice', authenticateToken, asyncHandler(async (req: any, res) => {
  const { command, audioData } = req.body;
  
  // Simulate voice processing
  const response = processVoiceCommand(command);
  
  logger.info(`Voice command processed for user: ${req.user.userId}: ${command}`);
  res.json({ response });
}));

// Helper functions
function generateAIResponse(message: string, context?: any): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('workout') || lowerMessage.includes('exercise')) {
    return "Based on your fitness level and goals, I recommend starting with a balanced routine that includes strength training 3 times per week and cardio 2-3 times per week. Focus on compound movements like squats, deadlifts, and push-ups to build a strong foundation.";
  }
  
  if (lowerMessage.includes('nutrition') || lowerMessage.includes('diet') || lowerMessage.includes('food')) {
    return "For optimal results, focus on whole foods with a balanced macro profile. Aim for 1.6-2.2g protein per kg of body weight, complex carbohydrates around your workouts, and healthy fats for hormone production. Stay hydrated with at least 2-3 liters of water daily.";
  }
  
  if (lowerMessage.includes('motivation') || lowerMessage.includes('help')) {
    return "Remember, consistency beats perfection! Every small step counts towards your goals. Focus on progress, not perfection. You've got this! What specific area would you like to work on today?";
  }
  
  return "I'm here to help with your fitness journey! Ask me about workouts, nutrition, form tips, or motivation. What would you like to know?";
}

function generateRecommendations(user: any, workouts: any[], nutrition: any[]) {
  const recommendations = [];
  
  // Workout recommendations
  const lastWorkout = workouts[0];
  if (!lastWorkout || (Date.now() - new Date(lastWorkout.completedAt).getTime()) > 2 * 24 * 60 * 60 * 1000) {
    recommendations.push({
      type: 'workout',
      priority: 'high',
      title: 'Time for Your Next Workout',
      description: "It's been a while since your last session. Let's get moving!",
      action: 'Start a workout'
    });
  }
  
  // Nutrition recommendations
  if (nutrition.length < 3) {
    recommendations.push({
      type: 'nutrition',
      priority: 'medium',
      title: 'Track Your Nutrition',
      description: 'Logging your meals helps optimize your results.',
      action: 'Log today\'s meals'
    });
  }
  
  // Goal-based recommendations
  if (user?.goals?.length > 0) {
    recommendations.push({
      type: 'goal',
      priority: 'medium',
      title: 'Goal Progress Check',
      description: 'Review and update your fitness goals.',
      action: 'Check progress'
    });
  }
  
  return recommendations;
}

function processVoiceCommand(command: string): string {
  const lowerCommand = command.toLowerCase();
  
  if (lowerCommand.includes('start workout')) {
    return "Starting your workout session. Let's warm up first!";
  }
  
  if (lowerCommand.includes('count rep')) {
    return "Rep counted! Keep going, you're doing great!";
  }
  
  if (lowerCommand.includes('how am i doing')) {
    return "You're crushing it! Great form and consistent effort.";
  }
  
  return "Command received. How can I assist you with your workout?";
}

export default router;