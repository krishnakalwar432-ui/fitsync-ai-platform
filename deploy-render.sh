#!/bin/bash

# 🚀 FitSync AI Complete Render + Vercel Deployment Script
echo "🎯 Starting FitSync AI Full Deployment..."

# Step 1: Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the ai-fitness-platform root directory"
    exit 1
fi

echo "✅ Found package.json - in correct directory"

# Step 2: Create GitHub repository (you'll need to do this manually)
echo "📝 Please create GitHub repository manually:"
echo "   1. Go to: https://github.com/new"
echo "   2. Repository name: fitsync-ai-platform"
echo "   3. Make it PUBLIC (required for free tier)"
echo "   4. Don't initialize with README"
echo ""
read -p "✅ Press ENTER after creating the GitHub repository..."

# Step 3: Get GitHub username
read -p "🔗 Enter your GitHub username: " GITHUB_USERNAME

# Step 4: Push to GitHub
echo "📤 Pushing code to GitHub..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/$GITHUB_USERNAME/fitsync-ai-platform.git
git branch -M main
git push -u origin main

echo "✅ Code pushed to GitHub successfully!"

# Step 5: Instructions for Render deployment
echo ""
echo "🎯 Next: Deploy Backend to Render"
echo "======================================"
echo "1. Go to: https://dashboard.render.com/new/web"
echo "2. Connect GitHub and select: $GITHUB_USERNAME/fitsync-ai-platform"
echo "3. Configuration:"
echo "   - Name: fitsync-ai-backend"
echo "   - Root Directory: backend"
echo "   - Build Command: npm install --legacy-peer-deps && npm run build"
echo "   - Start Command: npm start"
echo "   - Plan: Free"
echo ""
echo "4. Add PostgreSQL Database:"
echo "   - Go to: https://dashboard.render.com/new/database"
echo "   - Name: fitsync-ai-db"
echo "   - Plan: Free"
echo ""
echo "5. Environment Variables:"
echo "   NODE_ENV=production"
echo "   PORT=10000"
echo "   FRONTEND_URL=https://ai-fitness-platform-dn6v1yomv-krishnas-projects-8872b996.vercel.app"
echo "   JWT_SECRET=fitsync-ai-super-secure-jwt-secret-key-2024-render-production"
echo "   BCRYPT_ROUNDS=12"
echo "   DATABASE_URL=[AUTO-PROVIDED-BY-RENDER]"
echo ""
echo "6. Update Frontend:"
echo "   - Go to Vercel dashboard"
echo "   - Add environment variable: NEXT_PUBLIC_API_URL=https://fitsync-ai-backend.onrender.com"
echo "   - Redeploy frontend"
echo ""
echo "🎉 Your fullstack FitSync AI will be live at:"
echo "   Frontend: https://ai-fitness-platform-dn6v1yomv-krishnas-projects-8872b996.vercel.app"
echo "   Backend: https://fitsync-ai-backend.onrender.com"
echo ""
echo "✨ Total deployment time: ~10 minutes"