# 🚀 FitSync AI - Enhanced Node.js Backend

## 🎯 Overview

This enhanced backend transforms your FitSync AI platform into a production-ready, enterprise-grade application with:

- **Express.js API Gateway** with comprehensive middleware
- **Redis Caching & Session Management** for blazing-fast performance
- **Bull Queue System** for background AI processing
- **Winston Logging** with structured error tracking
- **Advanced Security** with rate limiting, CORS, and helmet
- **Health Monitoring** with metrics and performance tracking
- **Railway Deployment** optimized for scalability

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │────│  Express.js API  │────│   PostgreSQL    │
│   (Frontend)    │    │    Gateway      │    │   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │              ┌─────────────────┐               │
         └──────────────│   Redis Cache   │───────────────┘
                        │  & Job Queue    │
                        └─────────────────┘
                                 │
                        ┌─────────────────┐
                        │  Background     │
                        │   Workers       │
                        │ (AI, Analytics) │
                        └─────────────────┘
```

## 🔧 Key Components

### 1. **API Gateway** (`lib/enhanced-backend/api-gateway.ts`)
- **Security**: Helmet, CORS, rate limiting
- **Performance**: Compression, caching middleware
- **Monitoring**: Request logging, metrics collection
- **Documentation**: Swagger/OpenAPI integration

### 2. **Redis Services** (`lib/enhanced-backend/config/redis.ts`)
- **Caching**: Multi-level caching with TTL
- **Sessions**: Secure session management
- **Rate Limiting**: Distributed rate limiting
- **Pub/Sub**: Real-time notifications

### 3. **Queue System** (`lib/enhanced-backend/services/queue-manager.ts`)
- **AI Processing**: Workout & nutrition generation
- **Email Notifications**: Welcome emails, reminders
- **Analytics**: Background data processing
- **Real-time Notifications**: In-app notifications

### 4. **Logging System** (`lib/enhanced-backend/config/logger.ts`)
- **Structured Logging**: JSON format for production
- **Error Tracking**: Comprehensive error capture
- **Performance Monitoring**: Request timing & metrics
- **Security Events**: Auth failures, rate limiting

## 🚀 Quick Start

### Development Setup

1. **Install Dependencies**
```bash
npm install --legacy-peer-deps
```

2. **Start Services**
```bash
# Start Redis and PostgreSQL
docker-compose up -d postgres redis

# Start the application
npm run dev
```

3. **Access Services**
- App: http://localhost:3000
- API Docs: http://localhost:3000/api-docs
- Health: http://localhost:3000/health

### Production Deployment (Railway)

1. **Deploy to Railway**
```bash
npm run railway:deploy
```

2. **Monitor Deployment**
```bash
railway logs
railway status
```

## 📊 Monitoring & Health Checks

### Health Endpoints
- **Application Health**: `/health`
- **API Documentation**: `/api-docs`
- **Metrics**: `/metrics`
- **Queue Status**: `/api/admin/queues` (Admin only)

### Log Monitoring
```bash
# View logs locally
npm run logs:view

# View Railway logs
railway logs
```

### Performance Metrics
The system automatically tracks:
- Request response times
- Database query performance
- AI operation costs
- Cache hit rates
- Queue processing times

## 🔐 Security Features

### Authentication & Authorization
- JWT token validation
- Session management via Redis
- Rate limiting per user/IP
- CORS protection

### Rate Limiting
- **Auth Endpoints**: 5 requests/15 minutes
- **AI Endpoints**: 20 requests/minute per user
- **General API**: 1000 requests/15 minutes
- **Upload Endpoints**: 10 requests/minute

### Input Validation
- Request body validation with express-validator
- SQL injection prevention
- XSS protection via helmet
- File upload restrictions

## 📈 Scaling & Performance

### Caching Strategy
```typescript
// Multi-level caching
1. Memory Cache (fastest)
2. Redis Cache (fast)
3. Database (slowest)
```

### Background Processing
```typescript
// Queue priorities
- High Priority: Critical AI requests
- Normal Priority: Workout generation
- Low Priority: Analytics processing
```

### Database Optimization
- Connection pooling
- Query optimization
- Index recommendations
- Read replicas support

## 🎛️ Configuration

### Environment Variables

**Required:**
```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
NEXTAUTH_SECRET=your-secret
OPENAI_API_KEY=sk-...
```

**Optional:**
```env
USDA_API_KEY=nutrition-api-key
SPOONACULAR_API_KEY=meal-api-key
SENTRY_DSN=error-tracking
```

### Feature Flags
```env
FEATURE_AI_CHAT=true
FEATURE_SOCIAL_LOGIN=true
FEATURE_PUSH_NOTIFICATIONS=false
```

## 🔧 Development Tools

### Docker Development
```bash
# Start all services
npm run docker:dev

# View service status
docker-compose ps

# View logs
docker-compose logs -f app
```

### Database Management
```bash
# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

### Queue Management
```bash
# Start queue workers
npm run queue:start

# View queue dashboard (in Docker)
# http://localhost:8082
```

## 📊 API Endpoints

### Enhanced AI Chat
```typescript
POST /api/ai/enhanced-chat
{
  "message": "Create a workout plan",
  "topic": "workout",
  "context": { "fitnessLevel": "intermediate" },
  "priority": "high"
}
```

### Queue Status
```typescript
GET /api/admin/queues
Response: {
  "AI": { "waiting": 2, "active": 1, "completed": 45 },
  "Email": { "waiting": 0, "active": 0, "completed": 12 }
}
```

### User Analytics
```typescript
GET /api/analytics/user
Response: {
  "workouts": { "total": 15, "totalCalories": 1200 },
  "progress": { "weightChange": -2.5 },
  "aiUsage": { "totalChats": 45 }
}
```

## 🚨 Error Handling

### Error Types
- **ValidationError**: Invalid input data
- **AuthenticationError**: Invalid credentials
- **RateLimitError**: Too many requests
- **AIServiceError**: OpenAI API issues
- **DatabaseError**: Connection/query issues

### Error Response Format
```json
{
  "error": "User-friendly error message",
  "type": "error_type",
  "requestId": "req_123456",
  "timestamp": "2024-01-15T10:30:00Z",
  "details": { "additional": "info" }
}
```

## 🔄 Background Jobs

### AI Processing Queue
- **Workout Generation**: Personalized workout plans
- **Nutrition Planning**: Custom meal plans
- **Progress Analysis**: AI-powered insights

### Notification Queue
- **Welcome Emails**: New user onboarding
- **Workout Reminders**: Smart notifications
- **Progress Reports**: Weekly summaries

### Analytics Queue
- **User Analytics**: Performance tracking
- **Usage Metrics**: Feature adoption
- **Cost Analysis**: AI token usage

## 🎯 Production Optimizations

### Performance
- Response compression
- Static asset caching
- Database connection pooling
- Redis clustering support

### Security
- Helmet security headers
- CSRF protection
- SQL injection prevention
- Rate limiting by user/IP

### Monitoring
- Health check endpoints
- Performance metrics
- Error tracking
- Queue monitoring

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Redis connection verified
- [ ] API keys validated
- [ ] SSL certificates ready

### Post-Deployment
- [ ] Health checks passing
- [ ] Database seeded
- [ ] Queue workers running
- [ ] Monitoring alerts configured
- [ ] Performance baselines established

## 📚 Additional Resources

- **API Documentation**: Available at `/api-docs`
- **Health Monitoring**: Available at `/health`
- **Queue Dashboard**: Available in development mode
- **Error Tracking**: Integrated with Sentry
- **Performance Metrics**: Available at `/metrics`

## 🆘 Troubleshooting

### Common Issues

**Redis Connection Failed**
```bash
# Check Redis status
docker-compose ps redis
railway logs | grep redis
```

**Database Migration Failed**
```bash
# Reset database
npm run db:migrate:reset
npm run db:seed
```

**AI API Quota Exceeded**
```bash
# Check usage
railway logs | grep "AI Operation"
# Monitor costs in OpenAI dashboard
```

**Queue Jobs Stuck**
```bash
# Clear failed jobs
railway run node -e "require('./lib/enhanced-backend/services/queue-manager').QueueManager.clearAllQueues()"
```

---

## 🎉 Success!

Your FitSync AI platform now has an enterprise-grade backend that can:
- Handle thousands of concurrent users
- Process AI requests efficiently
- Scale horizontally with demand
- Monitor performance in real-time
- Provide comprehensive error tracking

Ready to deploy? Run `npm run railway:deploy` and watch your platform come to life! 🚀