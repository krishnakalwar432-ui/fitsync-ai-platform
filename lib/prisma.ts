import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create a mock Prisma client for demo mode if no DATABASE_URL is provided
let prismaClient: PrismaClient | null = null

try {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL !== 'postgresql://placeholder:placeholder@placeholder:5432/placeholder') {
    prismaClient = globalForPrisma.prisma ?? new PrismaClient()
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClient
  }
} catch (error) {
  console.log('Running in demo mode without database connection')
  prismaClient = null
}

// Export a proxy that handles missing database gracefully
export const prisma = prismaClient as any