@echo off
REM 🚀 Render Deployment Setup Script for FitSync AI Backend
REM This script helps set up the database and verify deployment readiness

echo 🔧 FitSync AI Backend - Render Deployment Setup
echo ================================================

REM Check if we're in the backend directory
if not exist "package.json" (
    echo ❌ Error: Run this script from the backend directory
    exit /b 1
)

echo ✅ Verifying backend files...

REM Check critical files
if not exist "src\server.ts" (
    echo ❌ Missing src\server.ts
    exit /b 1
)

if not exist "prisma\schema.prisma" (
    echo ❌ Missing prisma\schema.prisma
    exit /b 1
)

if not exist "simple-server.js" (
    echo ❌ Missing simple-server.js
    exit /b 1
)

echo ✅ All required files present

REM Verify dependencies
echo 🔍 Checking dependencies...
npm run test
if %errorlevel% neq 0 (
    echo ❌ Import issues found
    exit /b 1
)
echo ✅ All imports working correctly

REM Check build process
echo 🏗️ Testing build process...
npm run build:full
if %errorlevel% neq 0 (
    echo ❌ Build failed
    exit /b 1
)
echo ✅ Build process successful

echo.
echo 🎉 Backend is ready for Render deployment!
echo.
echo 📋 Next steps:
echo 1. Create PostgreSQL database on Render
echo 2. Update DATABASE_URL environment variable
echo 3. Deploy using the configuration in RENDER_DEPLOYMENT_GUIDE.md
echo.
echo 🔗 Repository: https://github.com/krishnakalwar432-ui/fitsync-ai-platform.git
echo 📁 Root Directory: backend
echo 🏗️ Build Command: npm install ^&^& npm run build
echo ▶️ Start Command: npm start
echo 🏥 Health Check: /health