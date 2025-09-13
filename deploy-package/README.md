# AI Fitness Platform - Full-Stack Application

A comprehensive AI-powered fitness platform built with Next.js 15, featuring personalized workout plans, nutrition guidance, progress tracking, and AI coaching.

## 🚀 Features

### Frontend Features
- **Responsive Design**: Modern UI built with Tailwind CSS and Radix UI components
- **Dark/Light Theme**: Integrated theme switching capability
- **Interactive Components**: 
  - Hero section with call-to-action
  - Workout library and guides
  - Calorie calculator
  - Nutrition planner
  - Progress dashboard with charts
  - Trainer profiles

### Backend Features
- **Authentication System**: 
  - Email/password authentication
  - Google OAuth integration
  - Secure session management with NextAuth.js
- **Database Management**:
  - PostgreSQL database with Prisma ORM
  - Comprehensive schema for users, workouts, nutrition, and progress
  - Automated migrations and type safety
- **RESTful API**:
  - User management endpoints
  - Workout creation and tracking
  - Nutrition plan management
  - Progress logging
  - Exercise library

### AI Integration
- **AI Chat Assistant**: Real-time fitness coaching powered by OpenAI
- **Personalized Recommendations**: 
  - Custom workout plan generation
  - Nutrition plan creation based on user goals
  - Topic-specific advice (workout, nutrition, general)
- **Context-Aware Responses**: AI considers user profile, goals, and history

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Radix UI
- **State Management**: React hooks + Context API
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts for data visualization

### Backend
- **Runtime**: Node.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **API**: Next.js API Routes
- **Validation**: Zod schemas

### AI & External Services
- **AI Provider**: OpenAI GPT-3.5-turbo
- **Image Storage**: (Ready for integration)
- **Email**: (Ready for integration)

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- OpenAI API key (optional, for AI features)
- Google OAuth credentials (optional, for social login)

## 🚀 Getting Started

### 1. Clone and Install Dependencies

```bash
git clone <your-repo>
cd ai-fitness-platform
npm install --legacy-peer-deps
```

### 2. Environment Setup

Copy the `.env` file and update with your credentials:

```bash
# Database
DATABASE_URL=\"postgresql://username:password@localhost:5432/ai_fitness_platform?schema=public\"

# NextAuth.js
NEXTAUTH_SECRET=\"your-secret-key-here-change-this-in-production\"
NEXTAUTH_URL=\"http://localhost:3000\"

# Google OAuth (optional)
GOOGLE_CLIENT_ID=\"your-google-client-id\"
GOOGLE_CLIENT_SECRET=\"your-google-client-secret\"

# OpenAI API
OPENAI_API_KEY=\"your-openai-api-key-here\"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed initial data (exercises, foods)
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## 📊 Database Schema

The application includes comprehensive models:

- **User Management**: Users, Accounts, Sessions
- **Fitness**: Exercises, Workouts, WorkoutExercises, CompletedWorkouts
- **Nutrition**: Foods, NutritionPlans, Meals, MealFoods
- **Progress**: ProgressLogs with measurements and photos
- **AI**: AIChat for conversation history

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `GET/POST /api/auth/[...nextauth]` - NextAuth endpoints

### Workouts
- `GET /api/workouts` - List user workouts
- `POST /api/workouts` - Create workout
- `POST /api/workouts/[id]/complete` - Complete workout

### Exercises
- `GET /api/exercises` - List exercises
- `POST /api/exercises` - Create exercise

### Nutrition
- `GET /api/nutrition/plans` - List nutrition plans
- `POST /api/nutrition/plans` - Create nutrition plan

### Progress
- `GET /api/progress` - Get progress logs
- `POST /api/progress` - Create progress entry

### AI Features
- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/workout-plan` - Generate workout plan
- `POST /api/ai/nutrition-plan` - Generate nutrition plan

## 🎯 Key Features Implementation

### 1. Authentication Flow
- Secure registration with bcrypt password hashing
- JWT-based sessions with NextAuth.js
- Protected routes and API endpoints
- Social login with Google (configurable)

### 2. Personalized AI Coaching
- Context-aware responses based on user profile
- Topic-specific expertise (workout, nutrition, general)
- Chat history persistence
- Real-time streaming responses

### 3. Workout Management
- Exercise library with difficulty levels
- Custom workout creation
- Progress tracking and completion logs
- Performance analytics

### 4. Nutrition Tracking
- Comprehensive food database
- Macro and calorie tracking
- Meal planning with AI suggestions
- Dietary restriction support

### 5. Progress Visualization
- Body measurement tracking
- Photo progress documentation
- Chart-based analytics
- Goal setting and achievement tracking

## 🔧 Development Commands

```bash
# Development
npm run dev                 # Start development server
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # Run ESLint

# Database
npm run db:generate        # Generate Prisma client
npm run db:migrate         # Run migrations
npm run db:seed           # Seed database
npm run db:studio         # Open Prisma Studio
```

## 🚀 Deployment Options

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Docker
```bash
# Build and run with Docker
docker build -t ai-fitness-platform .
docker run -p 3000:3000 ai-fitness-platform
```

### Manual Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Run `npm run build`
4. Start with `npm run start`

## 📈 Scaling Considerations

- **Database**: Consider connection pooling for high traffic
- **AI Costs**: Monitor OpenAI API usage and implement rate limiting
- **File Storage**: Integrate with AWS S3 or similar for user uploads
- **Caching**: Add Redis for session and API response caching
- **CDN**: Use CDN for static assets and images

## 🔐 Security Features

- Password hashing with bcrypt
- CSRF protection via NextAuth.js
- SQL injection prevention via Prisma
- Input validation with Zod schemas
- Environment variable protection
- Secure session management

## 📱 Mobile Responsiveness

- Fully responsive design with Tailwind CSS
- Mobile-first approach
- Touch-friendly interface
- Progressive Web App ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Open an issue on GitHub
- Contact the development team

---

**Built with ❤️ using modern web technologies**