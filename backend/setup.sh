#!/bin/bash

# FitSync AI Backend Setup Script

echo "🚀 Setting up FitSync AI Backend..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp .env.example .env
    echo "✅ Please update .env file with your configuration"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Check database connection and run migrations
echo "🗄️  Setting up database..."
npx prisma db push

# Create logs directory
echo "📝 Creating logs directory..."
mkdir -p logs

# Build the project
echo "🔨 Building project..."
npm run build

echo "✅ Backend setup complete!"
echo "🔥 Start the server with: npm run dev"
echo "📊 Health check will be available at: http://localhost:8000/health"