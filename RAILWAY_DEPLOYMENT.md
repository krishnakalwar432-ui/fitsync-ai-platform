# FitSync AI - Railway Deployment Guide

## 🚂 Quick Railway Deployment

### Prerequisites
1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Code must be in a Git repository
3. **API Keys**: Have your OpenAI and other API keys ready

### 🚀 Deployment Steps

#### Method 1: Railway CLI (Recommended)

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Initialize Project**:
   ```bash
   railway init
   ```

4. **Deploy**:
   ```bash
   railway up
   ```

#### Method 2: GitHub Integration

1. **Connect Repository**:
   - Go to [Railway Dashboard](https://railway.app/dashboard)
   - Click \"New Project\"
   - Select \"Deploy from GitHub repo\"
   - Choose your FitSync AI repository

2. **Configure Build**:
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Root Directory: `/`

### 🔧 Environment Variables Setup

Add these environment variables in Railway dashboard:

#### Essential Variables:
```bash
NODE_ENV=production
NEXTAUTH_URL=${{RAILWAY_STATIC_URL}}
NEXTAUTH_SECRET=your_nextauth_secret_here
DATABASE_URL=${{DATABASE_URL}}
```

#### AI & API Keys:
```bash
OPENAI_API_KEY=your_openai_key
USDA_API_KEY=your_usda_key
SPOONACULAR_API_KEY=your_spoonacular_key
RAPIDAPI_KEY=your_rapidapi_key
```

#### OAuth (Optional):
```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 🗄️ Database Setup

#### Option 1: Railway PostgreSQL

1. **Add PostgreSQL Service**:
   ```bash
   railway add postgresql
   ```

2. **Run Migrations**:
   ```bash
   railway run npm run db:migrate
   ```

3. **Seed Database**:
   ```bash
   railway run npm run db:seed
   ```

#### Option 2: External Database

Connect to external PostgreSQL (Supabase, Neon, etc.):
```bash
DATABASE_URL=postgresql://user:password@host:port/database
```

### 🚀 Production Optimizations

#### Build Optimizations
Add to `next.config.mjs`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['prisma']
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com']
  },
  // Enable compression
  compress: true,
  // Enable SWC minification
  swcMinify: true,
  // Output standalone for Railway
  output: 'standalone'
}

export default nextConfig
```

#### Environment-specific Settings
```bash
# Production settings
NEXT_PUBLIC_APP_URL=${{RAILWAY_STATIC_URL}}
NEXT_PUBLIC_API_URL=${{RAILWAY_STATIC_URL}}/api

# Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
SENTRY_DSN=your_sentry_dsn
```

### 🔍 Health Check Endpoint

Create `app/api/health/route.ts`:
```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  })
}
```

### 📊 Monitoring & Logging

#### Built-in Railway Metrics
- CPU usage
- Memory usage
- Network I/O
- Deployment logs

#### External Monitoring (Optional)
```bash
# Sentry for error tracking
SENTRY_DSN=your_sentry_dsn

# LogRocket for user sessions
LOGROCKET_APP_ID=your_logrocket_id
```

### 🎯 Performance Tips

1. **Enable Caching**:
   ```bash
   # Redis for caching
   railway add redis
   REDIS_URL=${{REDIS_URL}}
   ```

2. **CDN Configuration**:
   ```javascript
   // next.config.mjs
   images: {
     loader: 'cloudinary', // or 'imgix'
     path: 'https://your-cdn.com/'
   }
   ```

3. **Database Connection Pooling**:
   ```bash
   DATABASE_URL=\"postgresql://user:pass@host:port/db?pgbouncer=true&connection_limit=10\"
   ```

### 🔒 Security Considerations

1. **HTTPS Enforcement**:
   ```javascript
   // middleware.ts
   if (process.env.NODE_ENV === 'production' && !req.url.startsWith('https:')) {
     return NextResponse.redirect(`https://${req.headers.host}${req.url}`)
   }
   ```

2. **Rate Limiting**:
   ```bash
   # Environment variables
   RATE_LIMIT_WINDOW=900000  # 15 minutes
   RATE_LIMIT_MAX=100        # max requests per window
   ```

3. **CORS Configuration**:
   ```javascript
   // For API routes
   const allowedOrigins = [
     process.env.NEXTAUTH_URL,
     'https://fitsync-ai.up.railway.app'
   ]
   ```

### 🚨 Troubleshooting

#### Common Issues:

**Build Failures**:
```bash
# Check build logs
railway logs --deployment

# Force rebuild
railway up --detach
```

**Environment Variable Issues**:
```bash
# List current variables
railway variables

# Set variable
railway variables set VARIABLE_NAME=value
```

**Database Connection Issues**:
```bash
# Check database status
railway status

# Connect to database
railway connect postgresql
```

**Memory Issues**:
- Upgrade to higher Railway plan
- Optimize bundle size with `npm run analyze`
- Enable compression and caching

### 📈 Scaling

#### Vertical Scaling
- Upgrade Railway plan for more CPU/Memory
- Use Railway Pro for custom resource allocation

#### Horizontal Scaling
- Railway automatically handles load balancing
- Consider Redis for session storage
- Use external CDN for static assets

### 💰 Cost Optimization

1. **Resource Monitoring**:
   - Check Railway usage dashboard
   - Set up billing alerts
   - Optimize unused services

2. **Database Optimization**:
   - Use connection pooling
   - Implement query caching
   - Regular database maintenance

3. **API Usage**:
   - Cache API responses
   - Implement rate limiting
   - Monitor API costs (OpenAI, etc.)

### 🎉 Post-Deployment

1. **Test All Features**:
   - AI Chat functionality
   - Database connections
   - API integrations
   - User authentication

2. **Set Up Monitoring**:
   - Error tracking
   - Performance monitoring
   - User analytics

3. **Configure Custom Domain** (Optional):
   ```bash
   railway domain add your-domain.com
   ```

### 📞 Support

- **Railway Discord**: Active community support
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **GitHub Issues**: Report platform-specific issues

---

**Your FitSync AI platform is now ready for production! 🚀**

Access your deployed app at: `https://fitsync-ai.up.railway.app`