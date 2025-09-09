# 🚀 Deployment Guide - AI Fitness Platform

## Quick Deploy Options

### 🌟 Option 1: Vercel (Recommended - Easiest)

#### Step 1: Prepare for Deployment
```bash
# Build and test locally first
npm run build
npm run start
```

#### Step 2: Deploy to Vercel
1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variables** in Vercel Dashboard:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
   - `NEXTAUTH_URL` - Your deployment URL (e.g., `https://your-app.vercel.app`)
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` (optional)

#### Step 3: Database Setup
You'll need a PostgreSQL database. Options:

**A. Vercel Postgres** (Easiest):
```bash
vercel storage create postgres
```

**B. External Services**:
- [Neon](https://neon.tech) - Free tier available
- [Supabase](https://supabase.com) - Free tier available
- [Railway](https://railway.app) - PostgreSQL included

#### Step 4: Run Migrations
```bash
# After setting up database
vercel env pull .env.local
npx prisma migrate deploy
npx prisma db seed
```

---

### 🚂 Option 2: Railway (Database Included)

#### Step 1: Deploy to Railway
1. Go to [Railway.app](https://railway.app)
2. Click "Deploy from GitHub repo"
3. Connect your repository
4. Railway will auto-detect Next.js

#### Step 2: Add PostgreSQL
1. In Railway dashboard, click "+ New Service"
2. Select "PostgreSQL"
3. Railway will automatically set `DATABASE_URL`

#### Step 3: Set Environment Variables
Add in Railway dashboard:
- `NEXTAUTH_SECRET` - Generate secure string
- `NEXTAUTH_URL` - Your Railway deployment URL
- `OPENAI_API_KEY` - Your OpenAI key
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` (optional)

#### Step 4: Deploy and Migrate
Railway will auto-deploy. Then run migrations:
```bash
railway run npx prisma migrate deploy
railway run npx prisma db seed
```

---

### 🐳 Option 3: Docker Deployment

#### Step 1: Build Docker Image
```bash
docker build -t ai-fitness-platform .
```

#### Step 2: Run with Environment Variables
```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="your-postgres-url" \
  -e NEXTAUTH_SECRET="your-secret" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  -e OPENAI_API_KEY="your-openai-key" \
  ai-fitness-platform
```

#### For Production (AWS ECS, Google Cloud Run, etc.):
1. Push image to container registry
2. Deploy to your preferred container service
3. Set environment variables in service configuration
4. Ensure database connectivity

---

### ☁️ Option 4: Traditional VPS/Server

#### Step 1: Server Setup
```bash
# Install Node.js 18+, PostgreSQL, and PM2
sudo apt update
sudo apt install nodejs npm postgresql
npm install -g pm2
```

#### Step 2: Deploy Code
```bash
git clone your-repository
cd ai-fitness-platform
npm install --legacy-peer-deps
npm run build
```

#### Step 3: Environment Configuration
```bash
# Copy and configure environment
cp .env.production .env.local
# Edit .env.local with your production values
```

#### Step 4: Database Setup
```bash
# Setup PostgreSQL database
sudo -u postgres psql
CREATE DATABASE ai_fitness_platform;
CREATE USER your_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ai_fitness_platform TO your_user;

# Run migrations
npx prisma migrate deploy
npx prisma db seed
```

#### Step 5: Start Application
```bash
pm2 start npm --name "ai-fitness-platform" -- start
pm2 startup
pm2 save
```

---

## 🔧 Pre-Deployment Checklist

### Essential Requirements:
- [ ] PostgreSQL database URL
- [ ] NextAuth secret key (32+ character random string)
- [ ] OpenAI API key (for AI features)
- [ ] Production domain/URL configured

### Optional but Recommended:
- [ ] Google OAuth credentials
- [ ] Error monitoring (Sentry)
- [ ] Analytics (Google Analytics)
- [ ] CDN for static assets

---

## 🌍 Environment Variables Reference

### Required:
```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
NEXTAUTH_SECRET="32-char-random-string"
NEXTAUTH_URL="https://your-domain.com"
```

### AI Features:
```env
OPENAI_API_KEY="sk-your-openai-key"
```

### Social Login (Optional):
```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

---

## 🔍 Troubleshooting Common Issues

### Build Errors:
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install --legacy-peer-deps
npm run build
```

### Database Connection Issues:
```bash
# Test database connection
npx prisma db pull
```

### NextAuth Issues:
- Ensure `NEXTAUTH_SECRET` is set and secure
- Verify `NEXTAUTH_URL` matches your deployment URL
- Check callback URLs in OAuth providers

---

## 📊 Post-Deployment Steps

1. **Test Core Functionality**:
   - User registration/login
   - AI chat functionality
   - Workout creation
   - Progress tracking

2. **Monitor Performance**:
   - Database query performance
   - API response times
   - Error rates

3. **Security Checks**:
   - HTTPS enabled
   - Environment variables secure
   - Database access restricted

4. **Backup Strategy**:
   - Database backups
   - Code repository backups
   - Environment variable backups

---

## 🚀 Quick Deploy Commands

### Vercel:
```bash
npm install -g vercel
vercel login
vercel
```

### Railway:
```bash
npm install -g @railway/cli
railway login
railway link
railway up
```

### Docker:
```bash
docker build -t ai-fitness-platform .
docker run -p 3000:3000 ai-fitness-platform
```

---

Choose the deployment option that best fits your needs and infrastructure preferences!