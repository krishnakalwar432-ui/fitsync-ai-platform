@echo off
REM FitSync AI - Complete Setup Script for Windows
REM This script sets up the entire FitSync AI platform with all features

echo ============================================
echo 🚀 Setting up FitSync AI Platform...
echo ============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo [SUCCESS] Node.js is installed

REM Check for package manager
pnpm --version >nul 2>&1
if %errorlevel% equ 0 (
    set PACKAGE_MANAGER=pnpm
    echo [SUCCESS] Using pnpm as package manager
) else (
    npm --version >nul 2>&1
    if %errorlevel% equ 0 (
        set PACKAGE_MANAGER=npm
        echo [SUCCESS] Using npm as package manager
    ) else (
        echo [ERROR] No package manager found. Please install npm or pnpm.
        pause
        exit /b 1
    )
)

REM Install dependencies
echo [INFO] Installing dependencies...
if \"%PACKAGE_MANAGER%\"==\"pnpm\" (
    pnpm install
) else (
    npm install
)

if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo [SUCCESS] Dependencies installed successfully

REM Setup environment file
echo [INFO] Setting up environment variables...

if not exist \".env.local\" (
    echo [WARNING] .env.local not found. Creating from template...
    
    REM Generate a simple NextAuth secret (Windows compatible)
    for /f \"delims=\" %%i in ('powershell -command \"[System.Web.Security.Membership]::GeneratePassword(32, 8)\"') do set NEXTAUTH_SECRET=%%i
    
    (
        echo # FitSync AI - Environment Configuration
        echo # ==============================================
        echo # AI SERVICES - OpenAI for intelligent responses
        echo # ==============================================
        echo OPENAI_API_KEY=your_openai_api_key_here
        echo.
        echo # ==============================================
        echo # NUTRITION APIS - Food and nutrition data
        echo # ==============================================
        echo # USDA FoodData Central API \\(FREE\\)
        echo USDA_API_KEY=your_usda_api_key_here
        echo.
        echo # Spoonacular API \\(Optional\\)
        echo SPOONACULAR_API_KEY=your_spoonacular_api_key_here
        echo.
        echo # ==============================================
        echo # EXERCISE APIS - Workout and exercise data
        echo # ==============================================
        echo # RapidAPI - ExerciseDB \\(Optional\\)
        echo RAPIDAPI_KEY=your_rapidapi_key_here
        echo.
        echo # ==============================================
        echo # AUTHENTICATION - NextAuth.js
        echo # ==============================================
        echo NEXTAUTH_SECRET=%NEXTAUTH_SECRET%
        echo NEXTAUTH_URL=http://localhost:3000
        echo.
        echo # ==============================================
        echo # DATABASE - PostgreSQL \\(Optional\\)
        echo # ==============================================
        echo DATABASE_URL=postgresql://username:password@localhost:5432/fitsync_ai
        echo.
        echo # ==============================================
        echo # ENVIRONMENT SETTINGS
        echo # ==============================================
        echo NODE_ENV=development
        echo NEXT_PUBLIC_APP_URL=http://localhost:3000
        echo NEXT_PUBLIC_API_URL=http://localhost:3000/api
    ) > .env.local
    
    echo [SUCCESS] Environment file created: .env.local
    echo [WARNING] Please update the API keys in .env.local file
) else (
    echo [SUCCESS] Environment file already exists
)

REM Setup database (optional)
echo [INFO] Checking database setup...

if exist \"prisma\\schema.prisma\" (
    echo [INFO] Prisma schema found. Setting up database...
    
    REM Generate Prisma client
    if \"%PACKAGE_MANAGER%\"==\"pnpm\" (
        pnpm prisma generate
    ) else (
        npx prisma generate
    )
    
    echo [SUCCESS] Database setup completed
    echo [INFO] Run 'npm run db:migrate' when your database is ready.
) else (
    echo [INFO] No Prisma schema found. Skipping database setup.
)

REM Display completion info
echo.
echo ============================================
echo 🎉 FitSync AI Platform Setup Complete!
echo ============================================
echo.
echo ✅ Next Steps:
echo.
echo 1. Configure API Keys:
echo    - Edit .env.local file
echo    - Add your OpenAI API key (required for AI features)
echo    - Add optional API keys for enhanced features
echo.
echo 2. Start Development Server:
if \"%PACKAGE_MANAGER%\"==\"pnpm\" (
    echo    pnpm dev
) else (
    echo    npm run dev
)
echo.
echo 3. Open in Browser:
echo    http://localhost:3000
echo.
echo 📚 Documentation:
echo    - API Setup: .\\QUICK_AI_SETUP.md
echo    - Railway Deployment: .\\RAILWAY_DEPLOYMENT.md
echo    - Project Overview: .\\README.md
echo.
echo 🚀 Features Available:
echo    ✅ AI-Powered Fitness Coach
echo    ✅ Real-time Workout Tracking
echo    ✅ Smart Nutrition Planning
echo    ✅ Social Community Features
echo    ✅ Progress Analytics
echo    ✅ User Profiles ^& Achievements
echo    ✅ PWA ^& Offline Support
echo    ✅ Mobile Responsive Design
echo.
echo Happy Coding! 💪
echo.
pause