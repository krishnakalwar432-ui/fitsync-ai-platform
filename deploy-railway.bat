@echo off
echo.
echo ============================================
echo   🚀 FitSync AI - Railway Deployment
echo ============================================
echo.

echo [INFO] Setting up Railway project...
echo.

echo Creating new Railway project...
railway init --name "FitSync-AI-Enhanced"

echo.
echo [INFO] Adding PostgreSQL database...
railway add --service postgresql

echo.
echo [INFO] Adding Redis cache...
railway add --service redis

echo.
echo [INFO] Setting core environment variables...
railway variables set NODE_ENV=production
railway variables set NEXT_TELEMETRY_DISABLED=1
railway variables set LOG_LEVEL=info

echo.
echo [WARNING] Please set these variables in Railway dashboard:
echo - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
echo - OPENAI_API_KEY
echo - USDA_API_KEY (optional)
echo - SPOONACULAR_API_KEY (optional)

echo.
echo [INFO] Deploying application...
railway up

echo.
echo [SUCCESS] Deployment initiated!
echo Check Railway dashboard for deployment status.
echo.

pause