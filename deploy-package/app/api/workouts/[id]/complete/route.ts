import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const completeWorkoutSchema = z.object({
  duration: z.number().optional(),
  caloriesBurned: z.number().optional(),
  notes: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
})

// POST /api/workouts/[id]/complete - Mark workout as completed
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = completeWorkoutSchema.parse(body)

    // Verify workout exists and user has access
    const workout = await prisma.workout.findFirst({
      where: {
        id: params.id,
        OR: [
          { userId: session.user.id },
          { isPublic: true }
        ]
      }
    })

    if (!workout) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 })
    }

    const completedWorkout = await prisma.completedWorkout.create({
      data: {
        userId: session.user.id,
        workoutId: params.id,
        ...data
      },
      include: {
        workout: {
          select: {
            name: true,
            category: true,
            difficulty: true
          }
        }
      }
    })

    return NextResponse.json(completedWorkout)
  } catch (error) {
    console.error('Complete workout error:', error)
    
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