import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'
import { z } from 'zod'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const chatRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  topic: z.enum(['workout', 'nutrition', 'general']).optional()
})

// POST /api/ai/chat - Chat with AI fitness assistant
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { message, topic } = chatRequestSchema.parse(body)

    // Get user profile for personalized recommendations
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        progressLogs: {
          orderBy: { date: 'desc' },
          take: 3
        },
        workouts: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        nutritionPlans: {
          where: { isActive: true },
          take: 1
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Build context for AI
    const userContext = {
      age: user.age,
      gender: user.gender,
      height: user.height,
      weight: user.weight,
      activityLevel: user.activityLevel,
      fitnessGoals: user.fitnessGoals,
      dietaryRestrictions: user.dietaryRestrictions,
      recentWorkouts: user.workouts.map(w => ({ name: w.name, category: w.category })),
      latestProgress: user.progressLogs[0],
      activeNutritionPlan: user.nutritionPlans[0]
    }

    const systemPrompt = `You are a professional AI fitness and nutrition coach. You provide personalized advice based on user data.

User Profile:
${JSON.stringify(userContext, null, 2)}

Guidelines:
1. Provide evidence-based fitness and nutrition advice
2. Consider the user's profile, goals, and restrictions
3. Be encouraging and motivational
4. If topic is 'workout', focus on exercise recommendations
5. If topic is 'nutrition', focus on meal planning and dietary advice
6. Always prioritize safety and recommend consulting professionals for medical concerns
7. Keep responses concise but informative (max 300 words)`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const aiResponse = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response."

    // Save chat history
    await prisma.aIChat.create({
      data: {
        userId: session.user.id,
        messages: [
          { role: "user", content: message },
          { role: "assistant", content: aiResponse }
        ],
        topic: topic || 'general'
      }
    })

    return NextResponse.json({
      message: aiResponse,
      topic: topic || 'general'
    })

  } catch (error) {
    console.error('AI Chat error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}