import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Calculate BMR using Mifflin-St Jeor Equation
function calculateBMR(weight: number, height: number, age: number, gender: string): number {
  if (gender === 'MALE') {
    return 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161
  }
}

// Calculate TDEE based on activity level
function calculateTDEE(bmr: number, activityLevel: string): number {
  const multipliers = {
    SEDENTARY: 1.2,
    LIGHTLY_ACTIVE: 1.375,
    MODERATELY_ACTIVE: 1.55,
    VERY_ACTIVE: 1.725,
    EXTRA_ACTIVE: 1.9
  }
  return bmr * (multipliers[activityLevel as keyof typeof multipliers] || 1.2)
}

// POST /api/ai/nutrition-plan - Generate personalized nutrition plan
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate caloric needs
    let dailyCalories = 2000 // default
    if (user.weight && user.height && user.age && user.gender && user.activityLevel) {
      const bmr = calculateBMR(user.weight, user.height, user.age, user.gender)
      const tdee = calculateTDEE(bmr, user.activityLevel)
      
      // Adjust based on goals
      if (user.fitnessGoals?.includes('weight_loss')) {
        dailyCalories = Math.round(tdee * 0.8) // 20% deficit
      } else if (user.fitnessGoals?.includes('muscle_gain')) {
        dailyCalories = Math.round(tdee * 1.1) // 10% surplus
      } else {
        dailyCalories = Math.round(tdee) // maintenance
      }
    }

    const systemPrompt = `You are a certified nutritionist creating a personalized meal plan.

User Profile:
- Age: ${user.age || 'Unknown'}
- Gender: ${user.gender || 'Unknown'}
- Weight: ${user.weight || 'Unknown'} kg
- Height: ${user.height || 'Unknown'} cm
- Activity Level: ${user.activityLevel || 'Unknown'}
- Fitness Goals: ${user.fitnessGoals?.join(', ') || 'General health'}
- Dietary Restrictions: ${user.dietaryRestrictions?.join(', ') || 'None'}
- Daily Calorie Target: ${dailyCalories}

Create a balanced nutrition plan with macro distribution. Return JSON:
{
  "name": "Personalized Nutrition Plan",
  "dailyCalories": ${dailyCalories},
  "macroTargets": {
    "protein": 150,
    "carbs": 200,
    "fat": 80
  },
  "mealPlan": {
    "breakfast": [
      {
        "food": "Oatmeal with berries",
        "quantity": "1 cup",
        "calories": 300,
        "protein": 10,
        "carbs": 50,
        "fat": 5
      }
    ],
    "lunch": [...],
    "dinner": [...],
    "snacks": [...]
  },
  "guidelines": [
    "Drink 8-10 glasses of water daily",
    "Eat every 3-4 hours"
  ]
}`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Create my personalized nutrition plan" }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from AI')
    }

    try {
      const nutritionPlan = JSON.parse(response)
      return NextResponse.json(nutritionPlan)
    } catch (parseError) {
      // If JSON parsing fails, return a structured response
      return NextResponse.json({
        name: "AI Generated Nutrition Plan",
        dailyCalories,
        macroTargets: {
          protein: Math.round(dailyCalories * 0.25 / 4), // 25% protein
          carbs: Math.round(dailyCalories * 0.45 / 4),   // 45% carbs
          fat: Math.round(dailyCalories * 0.30 / 9)      // 30% fat
        },
        description: response,
        mealPlan: {}
      })
    }

  } catch (error) {
    console.error('AI Nutrition Plan error:', error)
    return NextResponse.json(
      { error: 'Failed to generate nutrition plan' },
      { status: 500 }
    )
  }
}