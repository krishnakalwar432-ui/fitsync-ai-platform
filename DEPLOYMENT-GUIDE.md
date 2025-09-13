# 🚀 FitSync AI - Separate Frontend & Backend Deployment Guide

This guide will help you deploy the frontend and backend separately for optimal performance and scalability.

## 📁 **Project Structure**

```
ai-fitness-platform/
├── 🎨 Frontend (Next.js App)        → Deploy to Vercel
│   ├── app/                         → 3D UI Components
│   ├── components/                  → shadcn/ui Components
│   ├── lib/                        → API Client & Utils
│   └── package.json
├── 🔧 Backend (Node.js API)         → Deploy to Railway
│   ├── src/                        → Express.js Server
│   ├── prisma/                     → Database Schema
│   ├── package.json
│   └── railway.toml
└── README.md
```

## 🎯 **Step 1: Backend Deployment (Railway)**

### 1.1 Prepare Railway Project
```bash
# Navigate to backend directory
cd backend

# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your existing Railway project (from memory: FitSync-AI-Enhanced)
railway link
```

### 1.2 Configure Environment Variables in Railway
Go to your Railway dashboard and set these environment variables:

```bash
# Required Variables
NODE_ENV=production
DATABASE_URL=<PROVIDED_BY_RAILWAY_POSTGRESQL>
REDIS_URL=<PROVIDED_BY_RAILWAY_REDIS>
JWT_SECRET=<GENERATE_STRONG_SECRET>
FRONTEND_URL=https://your-app.vercel.app

# Optional Variables
OPENAI_API_KEY=<YOUR_OPENAI_KEY>
STRIPE_SECRET_KEY=<YOUR_STRIPE_KEY>
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=<YOUR_EMAIL>
EMAIL_PASS=<YOUR_APP_PASSWORD>
```

### 1.3 Deploy Backend
```bash
# Build and deploy
npm run build

# Deploy to Railway
railway up

# Or for automatic deployment, push to your connected Git repo
```

### 1.4 Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Seed database (optional)
npx prisma db seed
```

## 🎨 **Step 2: Frontend Deployment (Vercel)**

### 2.1 Configure Environment Variables
Update `.env.local` with your Railway backend URL:

```bash
# Update these after backend deployment
NEXT_PUBLIC_API_URL=https://your-railway-backend.railway.app
NEXT_PUBLIC_WS_URL=wss://your-railway-backend.railway.app

# Keep existing variables
NEXT_PUBLIC_APP_NAME="FitSync AI"
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_ENABLE_3D_ANIMATIONS=true
```

### 2.2 Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from frontend root directory
vercel

# For production deployment
vercel --prod
```

### 2.3 Configure Vercel Environment Variables
In Vercel dashboard, add these environment variables:

```bash
NEXT_PUBLIC_API_URL=https://your-railway-backend.railway.app
NEXT_PUBLIC_WS_URL=wss://your-railway-backend.railway.app
NEXT_PUBLIC_DEMO_MODE=false
```

## 🔧 **Step 3: Connect Frontend to Backend**

### 3.1 Update API Configuration
The frontend is already configured to use the separate backend through:
- `lib/api-config.ts` - API endpoints and configuration
- `lib/api-client.ts` - HTTP client with authentication

### 3.2 Test Connection
After deployment, test these endpoints:
- `GET /health` - Backend health check
- `POST /api/auth/register` - User registration
- `GET /api/users/profile` - User profile (requires auth)

## 🌐 **Step 4: Domain Configuration (Optional)**

### 4.1 Custom Domains
- **Frontend**: Configure custom domain in Vercel (e.g., `app.fitsync.ai`)
- **Backend**: Configure custom domain in Railway (e.g., `api.fitsync.ai`)

### 4.2 Update CORS Settings
Update backend CORS configuration:
```javascript
// In backend/src/server.ts
app.use(cors({
  origin: [
    'https://your-custom-domain.com',
    'https://your-app.vercel.app'
  ]
}));
```

## 🔄 **Step 5: CI/CD Setup (Optional)**

### 5.1 Backend Auto-Deployment
Railway automatically deploys when you push to the connected Git branch.

### 5.2 Frontend Auto-Deployment
Vercel automatically deploys when you push to the connected Git branch.

## 📊 **Benefits of This Separation**

### ✅ **Frontend Benefits**
- **Optimized Performance**: Vercel's CDN and Edge Functions
- **Perfect 3D UI**: No server-side rendering conflicts
- **Fast Builds**: Frontend-only builds are much faster
- **Auto-Scaling**: Serverless functions scale automatically

### ✅ **Backend Benefits**
- **Dedicated Resources**: Railway provides dedicated server resources
- **Database Optimization**: Direct database connections
- **Real-time Features**: WebSocket support for live updates
- **API Rate Limiting**: Proper API management
- **Background Jobs**: Queue processing with Redis

## 🛠 **Development Workflow**

### Local Development
```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Start Frontend
cd ../
npm run dev
```

### Production Monitoring
- **Frontend**: Monitor in Vercel dashboard
- **Backend**: Monitor in Railway dashboard
- **Database**: Monitor PostgreSQL metrics in Railway
- **Cache**: Monitor Redis metrics in Railway

## 🔐 **Security Considerations**

1. **Environment Variables**: Never commit secrets to Git
2. **CORS Configuration**: Restrict to your domains only
3. **Rate Limiting**: Configured in backend for API protection
4. **JWT Tokens**: Secure authentication between frontend/backend
5. **HTTPS**: Both deployments use HTTPS by default

## 🚀 **Next Steps**

1. Deploy backend to Railway ✅
2. Deploy frontend to Vercel ✅
3. Configure environment variables ✅
4. Test all features ✅
5. Set up monitoring ✅
6. Configure custom domains (optional)
7. Set up CI/CD pipelines (optional)

Your FitSync AI platform is now ready for production with a modern, scalable architecture that preserves your stunning 3D UI while providing robust backend services! 🎯