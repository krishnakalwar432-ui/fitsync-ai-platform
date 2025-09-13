# ✅ Quick Render Deployment Checklist

## Copy These Exact Settings Into Render:

### 🔧 Service Configuration
```
Service Name: fitsync-ai-backend
Environment: Node
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm start
Node Version: 18.x
Health Check Path: /health
Auto-Deploy: Yes
Branch: main
```

### 🔧 Repository Settings
```
GitHub Repository: krishnakalwar432-ui/fitsync-ai-platform
Branch: main
```

### 🔧 Environment Variables (Add These One by One)
```
DATABASE_URL=postgresql://username:password@hostname:5432/database
JWT_SECRET=fitsync-super-secure-jwt-secret-key-2024-production
NODE_ENV=production
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000
```

### 🔧 Expected Success Indicators
```
✅ Build logs show: "Express import successful"
✅ Build logs show: "✅ All imports working correctly"
✅ Server starts with: "🚀 FitSync AI Backend Server running"
✅ Health check at: https://your-app.onrender.com/health
```

## 🚨 Important Notes:
1. **Create PostgreSQL database first**, then use its URL for DATABASE_URL
2. **Root Directory MUST be `backend`**
3. **Service Type MUST be "Web Service" (not Static Site)**
4. **Your backend will be available at**: `https://fitsync-ai-backend-xxxx.onrender.com`

---
## 🔗 After Deployment Success:
Update FRONTEND_URL and ALLOWED_ORIGINS with your actual Vercel frontend URL.