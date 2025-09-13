#!/bin/bash

# FitSync AI - Complete Setup Script
# This script sets up the entire FitSync AI platform with all features

set -e  # Exit on any error

echo \"🚀 Setting up FitSync AI Platform...\"
echo \"=====================================\"

# Colors for output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[0;33m'
BLUE='\\033[0;34m'
NC='\\033[0m' # No Color

print_status() {
    echo -e \"${BLUE}[INFO]${NC} $1\"
}

print_success() {
    echo -e \"${GREEN}[SUCCESS]${NC} $1\"
}

print_warning() {
    echo -e \"${YELLOW}[WARNING]${NC} $1\"
}

print_error() {
    echo -e \"${RED}[ERROR]${NC} $1\"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error \"Node.js is not installed. Please install Node.js 18+ first.\"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ \"$NODE_VERSION\" -lt 18 ]; then
        print_error \"Node.js version 18+ is required. Current version: $(node -v)\"
        exit 1
    fi
    
    print_success \"Node.js $(node -v) is installed\"
}

# Check if npm/pnpm is available
check_package_manager() {
    if command -v pnpm &> /dev/null; then
        PACKAGE_MANAGER=\"pnpm\"
        print_success \"Using pnpm as package manager\"
    elif command -v npm &> /dev/null; then
        PACKAGE_MANAGER=\"npm\"
        print_success \"Using npm as package manager\"
    else
        print_error \"No package manager found. Please install npm or pnpm.\"
        exit 1
    fi
}

# Install dependencies
install_dependencies() {
    print_status \"Installing dependencies...\"
    
    if [ \"$PACKAGE_MANAGER\" = \"pnpm\" ]; then
        pnpm install
    else
        npm install
    fi
    
    print_success \"Dependencies installed successfully\"
}

# Setup environment file
setup_environment() {
    print_status \"Setting up environment variables...\"
    
    if [ ! -f \".env.local\" ]; then
        print_warning \".env.local not found. Creating from template...\"
        
        # Generate NextAuth secret
        NEXTAUTH_SECRET=$(openssl rand -base64 32 2>/dev/null || node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\")
        
        cat > .env.local << EOF
# FitSync AI - Environment Configuration
# ==============================================
# AI SERVICES - OpenAI for intelligent responses
# ==============================================
OPENAI_API_KEY=your_openai_api_key_here

# ==============================================
# NUTRITION APIS - Food and nutrition data
# ==============================================
# USDA FoodData Central API (FREE)
USDA_API_KEY=your_usda_api_key_here

# Spoonacular API (Optional)
SPOONACULAR_API_KEY=your_spoonacular_api_key_here

# ==============================================
# EXERCISE APIS - Workout and exercise data
# ==============================================
# RapidAPI - ExerciseDB (Optional)
RAPIDAPI_KEY=your_rapidapi_key_here

# ==============================================
# AUTHENTICATION - NextAuth.js
# ==============================================
NEXTAUTH_SECRET=$NEXTAUTH_SECRET
NEXTAUTH_URL=http://localhost:3000

# ==============================================
# DATABASE - PostgreSQL (Optional)
# ==============================================
DATABASE_URL=postgresql://username:password@localhost:5432/fitsync_ai

# ==============================================
# ENVIRONMENT SETTINGS
# ==============================================
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
EOF
        
        print_success \"Environment file created: .env.local\"
        print_warning \"Please update the API keys in .env.local file\"
    else
        print_success \"Environment file already exists\"
    fi
}

# Setup database (optional)
setup_database() {
    print_status \"Checking database setup...\"
    
    if [ -f \"prisma/schema.prisma\" ]; then
        print_status \"Prisma schema found. Setting up database...\"
        
        # Generate Prisma client
        if [ \"$PACKAGE_MANAGER\" = \"pnpm\" ]; then
            pnpm prisma generate
        else
            npx prisma generate
        fi
        
        # Check if database is accessible
        if [ \"$NODE_ENV\" != \"production\" ]; then
            print_warning \"Database migrations skipped in development.\"
            print_status \"Run 'npm run db:migrate' when your database is ready.\"
        fi
        
        print_success \"Database setup completed\"
    else
        print_status \"No Prisma schema found. Skipping database setup.\"
    fi
}

# Build the application
build_application() {
    print_status \"Building the application...\"
    
    if [ \"$PACKAGE_MANAGER\" = \"pnpm\" ]; then
        pnpm build
    else
        npm run build
    fi
    
    print_success \"Application built successfully\"
}

# Display setup completion info
show_completion_info() {
    echo \"\"
    echo \"🎉 FitSync AI Platform Setup Complete!\"
    echo \"======================================\"
    echo \"\"
    echo -e \"${GREEN}✅ Next Steps:${NC}\"
    echo \"\"
    echo \"1. Configure API Keys:\"
    echo \"   - Edit .env.local file\"
    echo \"   - Add your OpenAI API key (required for AI features)\"
    echo \"   - Add optional API keys for enhanced features\"
    echo \"\"
    echo \"2. Start Development Server:\"
    if [ \"$PACKAGE_MANAGER\" = \"pnpm\" ]; then
        echo \"   pnpm dev\"
    else
        echo \"   npm run dev\"
    fi
    echo \"\"
    echo \"3. Open in Browser:\"
    echo \"   http://localhost:3000\"
    echo \"\"
    echo -e \"${BLUE}📚 Documentation:${NC}\"
    echo \"   - API Setup: ./QUICK_AI_SETUP.md\"
    echo \"   - Railway Deployment: ./RAILWAY_DEPLOYMENT.md\"
    echo \"   - Project Overview: ./README.md\"
    echo \"\"
    echo -e \"${YELLOW}🚀 Features Available:${NC}\"
    echo \"   ✅ AI-Powered Fitness Coach\"
    echo \"   ✅ Real-time Workout Tracking\"
    echo \"   ✅ Smart Nutrition Planning\"
    echo \"   ✅ Social Community Features\"
    echo \"   ✅ Progress Analytics\"
    echo \"   ✅ User Profiles & Achievements\"
    echo \"   ✅ PWA & Offline Support\"
    echo \"   ✅ Mobile Responsive Design\"
    echo \"\"
    echo -e \"${GREEN}Happy Coding! 💪${NC}\"
}

# Main setup flow
main() {
    print_status \"Starting FitSync AI Platform Setup\"
    
    check_node
    check_package_manager
    install_dependencies
    setup_environment
    setup_database
    
    # Only build in production or if explicitly requested
    if [ \"$NODE_ENV\" = \"production\" ] || [ \"$1\" = \"--build\" ]; then
        build_application
    fi
    
    show_completion_info
}

# Handle command line arguments
if [ \"$1\" = \"--help\" ] || [ \"$1\" = \"-h\" ]; then
    echo \"FitSync AI Setup Script\"
    echo \"\"
    echo \"Usage: ./setup.sh [options]\"
    echo \"\"
    echo \"Options:\"
    echo \"  --build    Force build the application\"
    echo \"  --help     Show this help message\"
    echo \"\"
    exit 0
fi

# Run main setup
main \"$@\"