import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const workoutSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  duration: z.number().optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  category: z.string(),
  isPublic: z.boolean().default(false),
  exercises: z.array(z.object({
    exerciseId: z.string(),
    sets: z.number().optional(),
    reps: z.number().optional(),
    weight: z.number().optional(),
    duration: z.number().optional(),
    distance: z.number().optional(),
    restTime: z.number().optional(),
    order: z.number(),
    notes: z.string().optional(),
  })).optional()
})

// GET /api/workouts - Get user's workouts
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const isPublic = searchParams.get('public')

    const workouts = await prisma.workout.findMany({
      where: {
        OR: [
          { userId: session.user.id },
          { isPublic: true }
        ],
        ...(category && { category }),
        ...(difficulty && { difficulty: difficulty as any }),
        ...(isPublic && { isPublic: isPublic === 'true' })
      },
      include: {
        user: {
          select: { name: true, image: true }
        },
        workoutExercises: {
          include: {
            exercise: true
          },
          orderBy: { order: 'asc' }
        },
        _count: {
          select: { completedWorkouts: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(workouts)
  } catch (error) {
    console.error('Get workouts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/workouts - Create new workout
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { exercises, ...workoutData } = workoutSchema.parse(body)

    const workout = await prisma.workout.create({
      data: {
        ...workoutData,
        userId: session.user.id,
        workoutExercises: {
          create: exercises?.map(exercise => ({
            exerciseId: exercise.exerciseId,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
            duration: exercise.duration,
            distance: exercise.distance,
            restTime: exercise.restTime,
            order: exercise.order,
            notes: exercise.notes,
          })) || []
        }
      },
      include: {
        workoutExercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(workout)
  } catch (error) {
    console.error('Create workout error:', error)
    
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