# 🚀 Complete Railway Deployment Guide

## Step-by-Step Backend Deployment

### 1. Login to Railway Dashboard
1. Go to https://railway.com
2. Click "Dashboard" 
3. Select project: **fitsync-ai-backend**

### 2. Add Backend Service
1. Click "+ New" button
2. Select "Empty Service"
3. Name it: `backend-api`
4. Click "Create"

### 3. Connect GitHub Repository
1. In the `backend-api` service, click "Settings"
2. Click "Connect Repo"
3. Select your GitHub repository
4. Set **Root Directory** to: `backend`
5. Click "Connect"

### 4. Configure Environment Variables
Go to service settings and add these variables:

```bash
NODE_ENV=production
PORT=8000
FRONTEND_URL=https://your-app.vercel.app
JWT_SECRET=your-super-secure-jwt-secret-key-32-chars-minimum
BCRYPT_ROUNDS=12
OPENAI_API_KEY=your-openai-key-here
STRIPE_SECRET_KEY=your-stripe-key-here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
LOG_LEVEL=info
```

### 5. Configure Database URLs
Railway will automatically provide these:
- `DATABASE_URL` (from PostgreSQL service)
- `REDIS_URL` (from Redis service)

These appear automatically in your environment variables.

### 6. Set Build Command
In service settings:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### 7. Deploy
1. Click "Deploy Now"
2. Monitor the deployment logs
3. Wait for successful deployment

### 8. Get Backend URL
After deployment:
1. Go to service settings
2. Copy the **Public Domain** URL
3. It will look like: `https://backend-api-production-xxxx.up.railway.app`

### 9. Update Frontend Environment
Update your frontend `.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://your-railway-backend.up.railway.app
NEXT_PUBLIC_WS_URL=wss://your-railway-backend.up.railway.app
```

### 10. Deploy Frontend to Vercel
```bash
# In root directory
vercel --prod
```

## 🎯 Quick Commands Summary

```bash
# Backend deployment (Railway)
cd backend
railway login
railway link [select: fitsync-ai-backend]
railway up

# Frontend deployment (Vercel)
cd ..
vercel --prod
```

## 🔍 Verification Steps

1. **Backend Health Check**: `GET https://your-backend.railway.app/health`
2. **Database Connection**: Check Railway dashboard for active connections
3. **Frontend API Connection**: Test login/register from frontend
4. **WebSocket Connection**: Test real-time features

## 🛠 Troubleshooting

### Build Errors
- Check Node.js version (should be 18+)
- Verify all dependencies are in package.json
- Check build logs in Railway dashboard

### Database Errors
- Ensure DATABASE_URL is properly set
- Run `npx prisma db push` after first deployment
- Check PostgreSQL service status

### CORS Errors
- Update FRONTEND_URL environment variable
- Verify CORS_ORIGIN matches your Vercel domain

## 🎉 Success Indicators

✅ Railway backend service shows "Active" status
✅ Database connections are healthy
✅ Frontend can make API calls successfully
✅ Real-time features (WebSocket) work
✅ User registration/login functions properly

Your FitSync AI platform is now deployed separately with optimal performance! 🚀