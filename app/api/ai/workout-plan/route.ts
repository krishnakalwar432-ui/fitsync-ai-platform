import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// POST /api/ai/workout-plan - Generate personalized workout plan
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        progressLogs: {
          orderBy: { date: 'desc' },
          take: 1
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get available exercises
    const exercises = await prisma.exercise.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        muscleGroups: true,
        equipment: true,
        difficulty: true
      }
    })

    const systemPrompt = `You are a professional fitness trainer creating a personalized workout plan.

User Profile:
- Age: ${user.age || 'Unknown'}
- Gender: ${user.gender || 'Unknown'}
- Activity Level: ${user.activityLevel || 'Unknown'}
- Fitness Goals: ${user.fitnessGoals?.join(', ') || 'General fitness'}
- Current Weight: ${user.weight || 'Unknown'} kg
- Height: ${user.height || 'Unknown'} cm

Available Exercises:
${exercises.map(e => `- ${e.name} (${e.category}, ${e.difficulty})`).join('\n')}

Create a weekly workout plan (3-4 days) with specific exercises, sets, reps, and rest periods. 
Return a JSON object with this structure:
{
  "name": "Personalized Workout Plan",
  "description": "Brief description",
  "workouts": [
    {
      "day": "Monday",
      "name": "Upper Body Strength",
      "exercises": [
        {
          "exerciseName": "Push-ups",
          "sets": 3,
          "reps": 12,
          "restTime": 60,
          "notes": "Focus on form"
        }
      ]
    }
  ]
}`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Create my personalized workout plan" }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from AI')
    }

    try {
      const workoutPlan = JSON.parse(response)
      return NextResponse.json(workoutPlan)
    } catch (parseError) {
      // If JSON parsing fails, return the raw response
      return NextResponse.json({
        name: "AI Generated Workout Plan",
        description: response,
        workouts: []
      })
    }

  } catch (error) {
    console.error('AI Workout Plan error:', error)
    return NextResponse.json(
      { error: 'Failed to generate workout plan' },
      { status: 500 }
    )
  }
}