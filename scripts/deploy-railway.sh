#!/bin/bash

# FitSync AI - Railway Deployment Script
# Enhanced backend deployment with production optimizations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "  🚀 FitSync AI - Enhanced Backend Deployment to Railway"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${NC}"
}

# Check dependencies
check_dependencies() {
    print_status "Checking dependencies..."
    
    # Check if Railway CLI is installed
    if ! command -v railway &> /dev/null; then
        print_error "Railway CLI not found. Installing..."
        npm install -g @railway/cli
    fi
    
    # Check if logged in to Railway
    if ! railway whoami &> /dev/null; then
        print_warning "Not logged in to Railway. Please log in:"
        railway login
    fi
    
    print_success "Dependencies checked"
}

# Environment setup
setup_environment() {
    print_status "Setting up environment variables..."
    
    # Core environment variables
    local env_vars=(
        "NODE_ENV=production"
        "NEXT_TELEMETRY_DISABLED=1"
        "LOG_LEVEL=info"
    )
    
    # Set core variables
    for var in "${env_vars[@]}"; do
        IFS='=' read -r key value <<< "$var"
        railway variables set "$key=$value"
        print_status "Set $key"
    done
    
    # Check for required API keys
    local required_keys=(
        "NEXTAUTH_SECRET"
        "DATABASE_URL"
        "OPENAI_API_KEY"
    )
    
    print_warning "Please ensure these environment variables are set in Railway dashboard:"
    for key in "${required_keys[@]}"; do
        echo "  - $key"
    done
    
    print_success "Environment setup completed"
}

# Database setup
setup_database() {
    print_status "Setting up database..."
    
    # Check if PostgreSQL plugin is added
    print_status "Adding PostgreSQL plugin to Railway project..."
    railway add postgresql || print_warning "PostgreSQL may already be added"
    
    # Run database migrations
    print_status "Running database migrations..."
    railway run npm run db:migrate || print_warning "Migration may have failed - check logs"
    
    # Seed database
    print_status "Seeding database with initial data..."
    railway run npm run db:seed || print_warning "Seeding may have failed - check logs"
    
    print_success "Database setup completed"
}

# Redis setup
setup_redis() {
    print_status "Setting up Redis..."
    
    # Add Redis plugin
    print_status "Adding Redis plugin to Railway project..."
    railway add redis || print_warning "Redis may already be added"
    
    print_success "Redis setup completed"
}

# Build optimization
optimize_build() {
    print_status "Optimizing build configuration..."
    
    # Update next.config.mjs for Railway
    cat > next.config.mjs << 'EOL'
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['prisma', 'bull'],
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    unoptimized: process.env.NODE_ENV === 'production'
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  output: 'standalone',
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('bull')
    }
    return config
  },
  env: {
    NEXT_PUBLIC_APP_URL: process.env.RAILWAY_STATIC_URL || process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_API_URL: (process.env.RAILWAY_STATIC_URL || process.env.NEXTAUTH_URL) + '/api'
  }
}

export default nextConfig
EOL
    
    # Update package.json scripts for Railway
    cat > scripts/railway-build.js << 'EOL'
#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')

console.log('🔨 Building FitSync AI for Railway...')

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...')
  execSync('npx prisma generate', { stdio: 'inherit' })
  
  // Build Next.js application
  console.log('🏗️ Building Next.js application...')
  execSync('npm run build', { stdio: 'inherit' })
  
  // Create production package.json
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  const prodPackageJson = {
    name: packageJson.name,
    version: packageJson.version,
    scripts: {
      start: 'next start',
      'db:migrate': 'prisma migrate deploy',
      'db:seed': 'npx tsx prisma/seed.ts'
    },
    dependencies: packageJson.dependencies
  }
  
  fs.writeFileSync('dist/package.json', JSON.stringify(prodPackageJson, null, 2))
  
  console.log('✅ Build completed successfully!')
  
} catch (error) {
  console.error('❌ Build failed:', error.message)
  process.exit(1)
}
EOL
    
    chmod +x scripts/railway-build.js
    
    print_success "Build optimization completed"
}

# Health check setup
setup_health_checks() {
    print_status "Setting up health checks..."
    
    # Create health check endpoint documentation
    cat > HEALTH_CHECKS.md << 'EOL'
# Health Check Endpoints

## Application Health
- **URL**: `/health`
- **Method**: GET
- **Response**: JSON with service status

## API Documentation
- **URL**: `/api-docs`
- **Method**: GET
- **Description**: Swagger/OpenAPI documentation

## Metrics
- **URL**: `/metrics`
- **Method**: GET
- **Description**: Application metrics for monitoring

## Queue Status
- **URL**: `/api/admin/queues` (Admin only)
- **Method**: GET
- **Description**: Background job queue status

## Railway Health Check
Railway will automatically monitor your application using the `/health` endpoint.
EOL
    
    print_success "Health checks documented"
}

# Performance monitoring setup
setup_monitoring() {
    print_status "Setting up performance monitoring..."
    
    # Create monitoring configuration
    mkdir -p monitoring
    
    cat > monitoring/railway-monitoring.js << 'EOL'
// Railway Performance Monitoring Configuration
const { performance } = require('perf_hooks')

class RailwayMonitoring {
  static logMetrics() {
    const metrics = {
      timestamp: new Date().toISOString(),
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      cpu: process.cpuUsage(),
      version: process.version
    }
    
    console.log('RAILWAY_METRICS:', JSON.stringify(metrics))
  }
  
  static startPeriodicLogging() {
    // Log metrics every 5 minutes
    setInterval(() => {
      this.logMetrics()
    }, 5 * 60 * 1000)
  }
}

module.exports = RailwayMonitoring
EOL
    
    print_success "Monitoring setup completed"
}

# Deploy to Railway
deploy_application() {
    print_status "Deploying to Railway..."
    
    # Link to Railway project (if not already linked)
    if [ ! -f ".railway/project.json" ]; then
        print_status "Linking to Railway project..."
        railway link
    fi
    
    # Deploy the application
    print_status "Starting deployment..."
    railway up
    
    # Wait for deployment to complete
    print_status "Waiting for deployment to be ready..."
    sleep 10
    
    # Get the deployment URL
    RAILWAY_URL=$(railway status --json | jq -r '.deployments[0].url' 2>/dev/null || echo "")
    
    if [ -n "$RAILWAY_URL" ]; then
        print_success "Application deployed successfully!"
        print_success "URL: $RAILWAY_URL"
        print_status "Health check: $RAILWAY_URL/health"
        print_status "API docs: $RAILWAY_URL/api-docs"
    else
        print_warning "Deployment completed but URL not found. Check Railway dashboard."
    fi
}

# Post-deployment verification
verify_deployment() {
    print_status "Verifying deployment..."
    
    # Get Railway URL
    RAILWAY_URL=$(railway status --json | jq -r '.deployments[0].url' 2>/dev/null || echo "")
    
    if [ -n "$RAILWAY_URL" ]; then
        # Test health endpoint
        print_status "Testing health endpoint..."
        if curl -f "$RAILWAY_URL/health" > /dev/null 2>&1; then
            print_success "Health check passed"
        else
            print_error "Health check failed"
        fi
        
        # Test API endpoint
        print_status "Testing API endpoint..."
        if curl -f "$RAILWAY_URL/api/health" > /dev/null 2>&1; then
            print_success "API health check passed"
        else
            print_warning "API health check failed - may need time to start"
        fi
    else
        print_warning "Could not get Railway URL for verification"
    fi
}

# Main deployment process
main() {
    print_header
    
    print_status "Starting enhanced Railway deployment..."
    
    check_dependencies
    setup_environment
    optimize_build
    setup_health_checks
    setup_monitoring
    setup_database
    setup_redis
    deploy_application
    verify_deployment
    
    print_success "🎉 Enhanced FitSync AI backend deployed to Railway!"
    echo ""
    print_status "Next steps:"
    echo "1. Configure your custom domain in Railway dashboard"
    echo "2. Set up monitoring alerts"
    echo "3. Configure CDN for static assets"
    echo "4. Set up backup strategies"
    echo ""
    print_status "Dashboard: https://railway.app/dashboard"
    print_status "Logs: railway logs"
    print_status "Status: railway status"
}

# Run deployment
main "$@"