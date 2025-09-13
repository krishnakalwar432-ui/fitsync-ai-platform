#!/bin/bash

# FitSync AI - Backend Setup Script
# Choose and deploy your preferred backend architecture

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "  🚀 FitSync AI - Professional Backend Setup"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${NC}"
}

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Backend options
show_backend_options() {
    echo -e "${PURPLE}Available Backend Architectures:${NC}"
    echo ""
    echo -e "${GREEN}1. Enhanced Node.js Stack (Recommended)${NC}"
    echo "   ✅ Express.js API Gateway + Redis + Background Jobs"
    echo "   ✅ Production-ready with monitoring and caching"
    echo "   ✅ Easy to maintain, fast development"
    echo ""
    echo -e "${YELLOW}2. Python FastAPI Backend${NC}"
    echo "   🐍 High-performance async Python"
    echo "   🤖 Built-in ML capabilities with scikit-learn"
    echo "   📊 Advanced analytics and data processing"
    echo ""
    echo -e "${BLUE}3. Golang High-Performance Backend${NC}"
    echo "   ⚡ Ultra-fast, concurrent processing"
    echo "   🏗️ Built-in WebSocket support"
    echo "   💪 Excellent for high-load scenarios"
    echo ""
    echo -e "${PURPLE}4. Microservices Architecture${NC}"
    echo "   🔗 Scalable service-oriented architecture"
    echo "   🐳 Docker containerized services"
    echo "   📈 Independent scaling and deployment"
    echo ""
    echo -e "${GREEN}5. Keep Current Next.js + Enhancements${NC}"
    echo "   🔧 Enhance existing setup with production features"
    echo "   📦 Add Redis, monitoring, and optimization"
    echo "   🚀 Gradual upgrade path"
    echo ""
}

# Enhanced Node.js setup
setup_enhanced_nodejs() {
    print_status "Setting up Enhanced Node.js Backend..."
    
    # Install additional dependencies
    print_status "Installing backend dependencies..."
    npm install --save \
        express \
        helmet \
        cors \
        express-rate-limit \
        compression \
        http-proxy-middleware \
        ioredis \
        winston \
        bull \
        @sentry/node \
        prometheus-client \
        swagger-ui-express \
        express-validator
    
    # Install dev dependencies
    npm install --save-dev \
        @types/express \
        @types/cors \
        @types/compression \
        nodemon \
        ts-node
    
    # Create backend directory structure
    mkdir -p backend/{middleware,services,controllers,utils,config}
    mkdir -p logs
    
    # Copy API gateway file
    print_status "Setting up API Gateway..."
    
    # Create package.json for backend
    cat > backend/package.json << EOL
{
  "name": "fitsync-ai-backend",
  "version": "2.0.0",
  "description": "Enhanced Node.js backend for FitSync AI",
  "main": "api-gateway.js",
  "scripts": {
    "start": "node dist/api-gateway.js",
    "dev": "nodemon --exec ts-node api-gateway.ts",
    "build": "tsc",
    "test": "jest",
    "lint": "eslint . --ext .ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^7.1.5",
    "compression": "^1.7.4",
    "ioredis": "^5.3.2",
    "winston": "^3.11.0",
    "bull": "^4.12.0"
  }
}
EOL
    
    # Create Docker setup
    cat > backend/Dockerfile << 'EOL'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
EOL
    
    # Create docker-compose for development
    cat > docker-compose.dev.yml << 'EOL'
version: '3.8'

services:
  api-gateway:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - REDIS_URL=redis://redis:6379
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/fitsync_ai
    depends_on:
      - redis
      - postgres
    volumes:
      - ./backend:/app
      - /app/node_modules
    command: npm run dev

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=fitsync_ai
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
EOL
    
    print_success "Enhanced Node.js backend setup completed!"
    print_status "Start with: cd backend && npm run dev"
}

# Python FastAPI setup
setup_python_fastapi() {
    print_status "Setting up Python FastAPI Backend..."
    
    # Create Python environment
    python3 -m venv backend-python
    source backend-python/bin/activate
    
    # Create requirements.txt
    cat > backend-python/requirements.txt << 'EOL'
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
asyncpg==0.29.0
redis==5.0.1
pydantic[email]==2.5.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
openai==1.3.5
scikit-learn==1.3.2
numpy==1.24.3
pandas==2.1.3
aiofiles==23.2.1
pytest==7.4.3
pytest-asyncio==0.21.1
python-dotenv==1.0.0
EOL
    
    # Install dependencies
    pip install -r backend-python/requirements.txt
    
    # Create Python backend structure
    mkdir -p backend-python/{app,tests,models,services,api,core}
    
    # Create Dockerfile for Python
    cat > backend-python/Dockerfile << 'EOL'
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
EOL
    
    print_success "Python FastAPI backend setup completed!"
    print_status "Start with: cd backend-python && uvicorn main:app --reload"
}

# Golang setup
setup_golang_backend() {
    print_status "Setting up Golang Backend..."
    
    # Create Go module
    mkdir -p backend-go
    cd backend-go
    
    go mod init fitsync-ai-backend
    
    # Install dependencies
    go get github.com/gin-gonic/gin
    go get gorm.io/gorm
    go get gorm.io/driver/postgres
    go get github.com/redis/go-redis/v9
    go get github.com/golang-jwt/jwt/v5
    go get golang.org/x/crypto/bcrypt
    go get github.com/gorilla/websocket
    
    # Create Go backend structure
    mkdir -p {handlers,models,middleware,services,config,utils}
    
    # Create Dockerfile for Go
    cat > Dockerfile << 'EOL'
FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/

COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]
EOL
    
    cd ..
    print_success "Golang backend setup completed!"
    print_status "Start with: cd backend-go && go run main.go"
}

# Microservices setup
setup_microservices() {
    print_status "Setting up Microservices Architecture..."
    
    # Create microservices structure
    mkdir -p backend/microservices/{api-gateway,services,nginx,monitoring}
    mkdir -p backend/microservices/services/{auth-service,user-service,workout-service,ai-service,nutrition-service,analytics-service}
    
    # Setup each service
    print_status "Setting up individual services..."
    
    # Create service templates
    for service in auth-service user-service workout-service nutrition-service analytics-service; do
        mkdir -p backend/microservices/services/$service/{src,tests,config}
        
        cat > backend/microservices/services/$service/package.json << EOL
{
  "name": "fitsync-$service",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5"
  }
}
EOL
        
        cat > backend/microservices/services/$service/Dockerfile << 'EOL'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
EOL
    done
    
    # Create monitoring configuration
    cat > backend/microservices/monitoring/prometheus.yml << 'EOL'
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'api-gateway'
    static_configs:
      - targets: ['api-gateway:3000']
  
  - job_name: 'auth-service'
    static_configs:
      - targets: ['auth-service:3001']
  
  - job_name: 'user-service'
    static_configs:
      - targets: ['user-service:3002']
EOL
    
    # Create nginx configuration
    cat > backend/microservices/nginx/nginx.conf << 'EOL'
events {
    worker_connections 1024;
}

http {
    upstream api_gateway {
        server api-gateway:3000;
    }

    server {
        listen 80;
        
        location / {
            proxy_pass http://api_gateway;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
EOL
    
    print_success "Microservices architecture setup completed!"
    print_status "Start with: cd backend/microservices && docker-compose up"
}

# Enhance existing setup
enhance_existing_setup() {
    print_status "Enhancing existing Next.js setup..."
    
    # Add production dependencies
    npm install --save \
        ioredis \
        bull \
        winston \
        express-rate-limit \
        helmet \
        compression \
        @sentry/nextjs
    
    # Create enhanced API middleware
    mkdir -p lib/{middleware,cache,queue,monitoring}
    
    # Create Redis configuration
    cat > lib/redis.ts << 'EOL'
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

export default redis
EOL
    
    # Create rate limiting middleware
    cat > lib/middleware/rateLimiting.ts << 'EOL'
import rateLimit from 'express-rate-limit'
import redis from '../redis'

export const createRateLimiter = (windowMs: number, max: number) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
  })
}
EOL
    
    # Create monitoring configuration
    cat > lib/monitoring/logger.ts << 'EOL'
import winston from 'winston'

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console()
  ]
})
EOL
    
    print_success "Existing setup enhanced with production features!"
}

# Main setup function
main() {
    print_header
    
    show_backend_options
    
    echo ""
    read -p "Choose your backend architecture (1-5): " choice
    echo ""
    
    case $choice in
        1)
            setup_enhanced_nodejs
            ;;
        2)
            setup_python_fastapi
            ;;
        3)
            setup_golang_backend
            ;;
        4)
            setup_microservices
            ;;
        5)
            enhance_existing_setup
            ;;
        *)
            print_error "Invalid choice. Please run the script again."
            exit 1
            ;;
    esac
    
    echo ""
    print_success "Backend setup completed! 🎉"
    echo ""
    print_status "Next steps:"
    echo "1. Configure environment variables"
    echo "2. Set up your database"
    echo "3. Configure Redis/caching"
    echo "4. Set up monitoring (optional)"
    echo "5. Deploy to production"
    echo ""
    print_warning "Don't forget to update your API keys and database URLs!"
}

# Run main function
main "$@"