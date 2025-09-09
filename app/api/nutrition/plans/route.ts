import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const nutritionPlanSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().transform(str => new Date(str)).optional(),
  dailyCalories: z.number().min(800).max(5000),
  macroTargets: z.object({
    protein: z.number(),
    carbs: z.number(),
    fat: z.number()
  })
})

// GET /api/nutrition/plans - Get user's nutrition plans
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const nutritionPlans = await prisma.nutritionPlan.findMany({
      where: { userId: session.user.id },
      include: {
        meals: {
          include: {
            mealFoods: {
              include: { food: true }
            }
          },
          orderBy: { date: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(nutritionPlans)
  } catch (error) {
    console.error('Get nutrition plans error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/nutrition/plans - Create new nutrition plan
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = nutritionPlanSchema.parse(body)

    const nutritionPlan = await prisma.nutritionPlan.create({
      data: {
        ...data,
        userId: session.user.id
      }
    })

    return NextResponse.json(nutritionPlan)
  } catch (error) {
    console.error('Create nutrition plan error:', error)
    
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