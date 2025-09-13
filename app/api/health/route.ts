import { NextResponse } from 'next/server'

// Health check endpoint for Railway and monitoring
export async function GET() {
  try {
    // Basic health checks
    const healthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: 'unknown',
        openai: 'unknown',
        nutrition: 'unknown',
        exercise: 'unknown'
      }
    }

    // Check API key configurations
    healthStatus.services.openai = process.env.OPENAI_API_KEY ? 'configured' : 'missing'
    healthStatus.services.nutrition = process.env.USDA_API_KEY ? 'configured' : 'missing'
    healthStatus.services.exercise = process.env.RAPIDAPI_KEY ? 'configured' : 'missing'
    
    // Check database connection if available
    if (process.env.DATABASE_URL) {
      try {
        // Simple database check would go here
        // For now, just check if URL is configured
        healthStatus.services.database = 'configured'
      } catch (error) {
        healthStatus.services.database = 'error'
      }
    } else {
      healthStatus.services.database = 'missing'
    }

    // Determine overall status
    const hasErrors = Object.values(healthStatus.services).includes('error')
    const hasMissingCritical = !process.env.OPENAI_API_KEY
    
    if (hasErrors) {
      healthStatus.status = 'error'
      return NextResponse.json(healthStatus, { status: 500 })
    } else if (hasMissingCritical) {
      healthStatus.status = 'degraded'
      return NextResponse.json(healthStatus, { status: 200 })
    }

    return NextResponse.json(healthStatus, { status: 200 })
    
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Also support HEAD requests for simple uptime checks
export async function HEAD() {
  return new Response(null, { status: 200 })
}