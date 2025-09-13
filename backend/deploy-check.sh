#!/bin/bash

# 🚀 Render Deployment Setup Script for FitSync AI Backend
# This script helps set up the database and verify deployment readiness

echo "🔧 FitSync AI Backend - Render Deployment Setup"
echo "================================================"

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the backend directory"
    exit 1
fi

echo "✅ Verifying backend files..."

# Check critical files
if [ ! -f "src/server.ts" ]; then
    echo "❌ Missing src/server.ts"
    exit 1
fi

if [ ! -f "prisma/schema.prisma" ]; then
    echo "❌ Missing prisma/schema.prisma"
    exit 1
fi

if [ ! -f "simple-server.js" ]; then
    echo "❌ Missing simple-server.js"
    exit 1
fi

echo "✅ All required files present"

# Verify dependencies
echo "🔍 Checking dependencies..."
if command -v npm &> /dev/null; then
    npm run test
    if [ $? -eq 0 ]; then
        echo "✅ All imports working correctly"
    else
        echo "❌ Import issues found"
        exit 1
    fi
else
    echo "❌ npm not found"
    exit 1
fi

# Check build process
echo "🏗️ Testing build process..."
npm run build:full
if [ $? -eq 0 ]; then
    echo "✅ Build process successful"
else
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "🎉 Backend is ready for Render deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Create PostgreSQL database on Render"
echo "2. Update DATABASE_URL environment variable"
echo "3. Deploy using the configuration in RENDER_DEPLOYMENT_GUIDE.md"
echo ""
echo "🔗 Repository: https://github.com/krishnakalwar432-ui/fitsync-ai-platform.git"
echo "📁 Root Directory: backend"
echo "🏗️ Build Command: npm install && npm run build"
echo "▶️ Start Command: npm start"
echo "🏥 Health Check: /health"