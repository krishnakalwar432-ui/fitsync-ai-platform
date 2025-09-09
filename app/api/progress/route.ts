import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const progressLogSchema = z.object({
  weight: z.number().optional(),
  bodyFat: z.number().optional(),
  muscle: z.number().optional(),
  notes: z.string().optional(),
  photos: z.array(z.string()).optional(),
  measurements: z.record(z.number()).optional()
})

// GET /api/progress - Get user's progress logs
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const progressLogs = await prisma.progressLog.findMany({
      where: {
        userId: session.user.id,
        ...(startDate && endDate && {
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        })
      },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json(progressLogs)
  } catch (error) {
    console.error('Get progress error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/progress - Create new progress log
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = progressLogSchema.parse(body)

    const progressLog = await prisma.progressLog.create({
      data: {
        ...data,
        userId: session.user.id
      }
    })

    return NextResponse.json(progressLog)
  } catch (error) {
    console.error('Create progress log error:', error)
    
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