import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/exercises - Get all exercises
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const muscleGroup = searchParams.get('muscleGroup')
    const equipment = searchParams.get('equipment')

    const exercises = await prisma.exercise.findMany({
      where: {
        ...(category && { category }),
        ...(difficulty && { difficulty: difficulty as any }),
        ...(muscleGroup && { muscleGroups: { has: muscleGroup } }),
        ...(equipment && { equipment: { has: equipment } })
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(exercises)
  } catch (error) {
    console.error('Get exercises error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/exercises - Create new exercise (admin only for now)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    const exercise = await prisma.exercise.create({
      data: body
    })

    return NextResponse.json(exercise)
  } catch (error) {
    console.error('Create exercise error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}