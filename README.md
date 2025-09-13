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
```

```
# 🤖 FitSync AI - Complete Fitness & Wellness Platform\n\n<div align=\"center\">\n  <h1>🏋️‍♂️ FitSync AI</h1>\n  <p><strong>Next-Generation AI-Powered Fitness Platform</strong></p>\n  \n  <p>\n    <img src=\"https://img.shields.io/badge/Next.js-15.2.4-black\" alt=\"Next.js\" />\n    <img src=\"https://img.shields.io/badge/React-19-blue\" alt=\"React\" />\n    <img src=\"https://img.shields.io/badge/TypeScript-5-blue\" alt=\"TypeScript\" />\n    <img src=\"https://img.shields.io/badge/AI-OpenAI_GPT--4-green\" alt=\"OpenAI\" />\n    <img src=\"https://img.shields.io/badge/PWA-Enabled-purple\" alt=\"PWA\" />\n  </p>\n</div>\n\n## 🌟 Overview\n\nFitSync AI is a comprehensive, AI-powered fitness and wellness platform that provides personalized workout plans, nutrition guidance, and social community features. Built with cutting-edge technology, it offers real-time AI coaching, progress tracking, and an immersive user experience.\n\n## ✨ Key Features\n\n### 🤖 **AI-Powered Coaching**\n- **GPT-4 Integration**: Intelligent conversation with contextual fitness advice\n- **Personalized Recommendations**: Custom workout and nutrition plans\n- **Real-time Guidance**: Instant form corrections and exercise modifications\n- **Smart Progress Analysis**: AI-driven insights and goal optimization\n\n### 🏋️‍♂️ **Advanced Workout System**\n- **Real-time Tracking**: Live workout timer with rep counter and rest periods\n- **1300+ Exercises**: Comprehensive database with GIFs and instructions\n- **Custom Workout Generator**: AI creates workouts based on equipment and goals\n- **Progress Analytics**: Detailed charts and performance metrics\n- **Achievement System**: Unlock badges and celebrate milestones\n\n### 🥗 **Smart Nutrition Planning**\n- **300,000+ Food Database**: USDA integration for accurate nutrition data\n- **AI Meal Planning**: Personalized meal plans with macro tracking\n- **Recipe Integration**: Spoonacular API for detailed cooking instructions\n- **Allergy & Preference Support**: Customized plans for dietary restrictions\n- **Calorie Calculator**: Advanced TDEE and macro calculations\n\n### 👥 **Social Community**\n- **Social Feed**: Share workouts, achievements, and motivate others\n- **Fitness Challenges**: Join community challenges and competitions\n- **Groups & Forums**: Connect with like-minded fitness enthusiasts\n- **Leaderboards**: Compete with friends and global community\n- **Progress Sharing**: Celebrate achievements with visual progress posts\n\n### 📱 **Progressive Web App (PWA)**\n- **Offline Support**: Access workouts and nutrition data without internet\n- **Mobile Optimized**: Native app-like experience on all devices\n- **Push Notifications**: Workout reminders and motivation messages\n- **Installation**: Add to home screen for quick access\n- **Background Sync**: Sync data when connection is restored\n\n### 👤 **User Management**\n- **Profile System**: Comprehensive user profiles with achievements\n- **Goal Tracking**: Set and monitor fitness objectives\n- **Authentication**: Secure login with NextAuth.js\n- **Data Privacy**: GDPR compliant with user data control\n\n## 🛠 Technology Stack\n\n### **Frontend**\n- **Next.js 15.2.4** - React framework with App Router\n- **React 19** - Latest React features and optimizations\n- **TypeScript 5** - Type-safe development\n- **Tailwind CSS** - Utility-first styling with custom design system\n- **Radix UI** - Accessible component library\n- **Recharts** - Data visualization for progress tracking\n\n### **Backend & APIs**\n- **Next.js API Routes** - Serverless API endpoints\n- **OpenAI GPT-4** - Advanced AI conversation and recommendations\n- **USDA FoodData Central** - 300K+ food nutrition database (FREE)\n- **Spoonacular API** - Recipe and meal planning integration\n- **ExerciseDB (RapidAPI)** - 1300+ exercises with instructions\n\n### **Database & Authentication**\n- **Prisma ORM** - Type-safe database access\n- **PostgreSQL** - Robust relational database\n- **NextAuth.js** - Secure authentication system\n- **Redis** - Session management and caching (optional)\n\n### **Infrastructure**\n- **Railway** - Production deployment platform\n- **Vercel** - Alternative deployment option\n- **Service Worker** - PWA offline functionality\n- **IndexedDB** - Client-side data storage\n\n## 🚀 Quick Start\n\n### **Option 1: Automated Setup (Recommended)**\n\n**Windows:**\n```bash\n# Download and run setup script\n.\\setup.bat\n```\n\n**macOS/Linux:**\n```bash\n# Download and run setup script\nchmod +x setup.sh\n./setup.sh\n```\n\n### **Option 2: Manual Setup**\n\n1. **Clone & Install**\n   ```bash\n   git clone https://github.com/your-username/fitsync-ai.git\n   cd fitsync-ai\n   npm install  # or pnpm install\n   ```\n\n2. **Environment Setup**\n   ```bash\n   cp .env.example .env.local\n   # Edit .env.local with your API keys\n   ```\n\n3. **Start Development**\n   ```bash\n   npm run dev\n   ```\n\n4. **Open Application**\n   ```\n   http://localhost:3000\n   ```\n\n## 🔑 API Configuration\n\n### **Essential APIs**\n\n| Service | Purpose | Cost | Required |\n|---------|---------|------|-----------|\n| **OpenAI** | AI Chat & Recommendations | ~$5-15/month | ✅ Yes |\n| **USDA FoodData** | Nutrition Database | FREE | 🟡 Recommended |\n\n### **Enhanced Features**\n\n| Service | Purpose | Cost | Required |\n|---------|---------|------|-----------|\n| **Spoonacular** | Recipes & Meal Planning | 150 free/day | ⚪ Optional |\n| **ExerciseDB** | Exercise Database | Free tier | ⚪ Optional |\n\n### **Setup Instructions**\n\n1. **OpenAI API** (Required for AI features)\n   - Visit: [OpenAI Platform](https://platform.openai.com/api-keys)\n   - Create API key and add to `.env.local`\n   - Add billing method (pay-per-use, very affordable)\n\n2. **USDA API** (FREE - Highly Recommended)\n   - Visit: [USDA FDC](https://fdc.nal.usda.gov/api-guide.html)\n   - Get free API key (no rate limits)\n   - Access 300,000+ foods with detailed nutrition\n\n📖 **Detailed Setup Guide**: [QUICK_AI_SETUP.md](./QUICK_AI_SETUP.md)\n\n## 🏗 Project Structure\n\n```\nfitsync-ai/\n├── app/                          # Next.js App Router\n│   ├── components/               # React Components\n│   │   ├── AIChat.tsx           # AI Chatbot Interface\n│   │   ├── WorkoutTracker.tsx   # Real-time Workout Tracking\n│   │   ├── SocialHub.tsx        # Community Features\n│   │   ├── UserProfile.tsx      # User Management\n│   │   └── NutritionPlanner.tsx # Meal Planning\n│   ├── api/                     # API Routes\n│   │   ├── ai/chat/            # OpenAI Integration\n│   │   ├── nutrition/          # Nutrition APIs\n│   │   ├── workout/            # Exercise APIs\n│   │   └── health/             # Health Check\n│   └── globals.css             # Global Styles\n├── public/                      # Static Assets\n│   ├── manifest.json           # PWA Configuration\n│   ├── sw.js                   # Service Worker\n│   └── pwa/                    # PWA Icons\n├── prisma/                     # Database Schema\n├── docs/                       # Documentation\n│   ├── QUICK_AI_SETUP.md      # API Setup Guide\n│   └── RAILWAY_DEPLOYMENT.md  # Deployment Guide\n└── setup.sh / setup.bat       # Automated Setup Scripts\n```\n\n## 🎯 Features Deep Dive\n\n### **AI Fitness Coach**\n- **Contextual Conversations**: Remembers your fitness level, goals, and history\n- **Real-time Recommendations**: Adapts advice based on your progress\n- **Evidence-based Guidance**: Responses backed by fitness science\n- **Motivational Support**: Encouraging and personalized coaching style\n\n### **Workout Tracking**\n- **Live Timer**: Real-time workout timer with set/rep tracking\n- **Rest Periods**: Automatic rest timers with customizable durations\n- **Heart Rate Simulation**: Visual heart rate monitoring\n- **Progress Photos**: Take and track transformation photos\n- **Workout History**: Complete log of all training sessions\n\n### **Nutrition Intelligence**\n- **Macro Calculator**: TDEE calculation with activity level adjustment\n- **Food Search**: Instant search through 300K+ foods\n- **Meal Planning**: AI generates complete meal plans\n- **Recipe Integration**: Detailed cooking instructions and ingredients\n- **Progress Tracking**: Visual macro and calorie tracking\n\n### **Social Features**\n- **Activity Feed**: See what friends are accomplishing\n- **Challenge System**: Join or create fitness challenges\n- **Achievement Sharing**: Celebrate milestones with the community\n- **Group Workouts**: Find and join local fitness groups\n- **Motivation Network**: Support and encourage others\n\n### **Progressive Web App**\n- **Offline Mode**: Full functionality without internet\n- **Native Feel**: App-like experience on mobile devices\n- **Push Notifications**: Workout reminders and achievements\n- **Background Sync**: Data syncs when connection returns\n- **Installation**: Add to home screen for easy access\n\n## 🚀 Deployment\n\n### **Railway Deployment** (Recommended)\n\n1. **Quick Deploy**\n   ```bash\n   npm install -g @railway/cli\n   railway login\n   railway init\n   railway up\n   ```\n\n2. **Environment Variables**\n   - Configure all API keys in Railway dashboard\n   - Database URL automatically configured\n   - NEXTAUTH_URL set to deployment URL\n\n📖 **Complete Guide**: [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)\n\n### **Alternative Platforms**\n- **Vercel**: One-click deployment with GitHub integration\n- **Netlify**: JAMstack deployment with serverless functions\n- **Docker**: Containerized deployment for any platform\n\n## 📊 Performance & Scalability\n\n### **Optimization Features**\n- **Server-Side Rendering**: Fast initial page loads\n- **Image Optimization**: Automatic image compression and lazy loading\n- **Code Splitting**: Only load necessary JavaScript\n- **API Caching**: Intelligent caching of API responses\n- **Database Optimization**: Efficient queries with Prisma\n\n### **Monitoring & Analytics**\n- **Health Check Endpoint**: `/api/health` for uptime monitoring\n- **Error Tracking**: Built-in error logging and reporting\n- **Performance Metrics**: Real-time application performance data\n- **User Analytics**: Privacy-respecting usage insights\n\n## 🔒 Security & Privacy\n\n### **Security Measures**\n- **Authentication**: Secure JWT-based authentication\n- **API Rate Limiting**: Prevents abuse and ensures fair usage\n- **Data Encryption**: All sensitive data encrypted in transit and at rest\n- **CORS Protection**: Proper CORS configuration for API security\n- **Environment Isolation**: Secure environment variable management\n\n### **Privacy Compliance**\n- **GDPR Ready**: User data control and deletion capabilities\n- **Local Data Storage**: Sensitive data stored locally when possible\n- **Transparent Logging**: Clear logs of what data is collected\n- **User Consent**: Explicit consent for data collection and usage\n\n## 🤝 Contributing\n\n### **Development Setup**\n\n1. **Fork & Clone**\n   ```bash\n   git clone https://github.com/your-username/fitsync-ai.git\n   cd fitsync-ai\n   npm install\n   ```\n\n2. **Create Feature Branch**\n   ```bash\n   git checkout -b feature/amazing-feature\n   ```\n\n3. **Run Development Server**\n   ```bash\n   npm run dev\n   ```\n\n4. **Run Tests** (when available)\n   ```bash\n   npm run test\n   ```\n\n### **Contribution Guidelines**\n- Follow TypeScript best practices\n- Maintain responsive design principles\n- Add proper error handling\n- Update documentation for new features\n- Test thoroughly across devices\n\n## 📝 Documentation\n\n- **[API Setup Guide](./QUICK_AI_SETUP.md)** - Complete API configuration\n- **[Deployment Guide](./RAILWAY_DEPLOYMENT.md)** - Production deployment\n- **[Component Documentation](./docs/components.md)** - Component API reference\n- **[API Reference](./docs/api.md)** - Backend API documentation\n\n## 🐛 Troubleshooting\n\n### **Common Issues**\n\n**API Keys Not Working**\n- Verify keys are correctly copied to `.env.local`\n- Restart development server after adding keys\n- Check API quotas and billing status\n\n**Build Failures**\n- Clear `.next` folder and rebuild\n- Update Node.js to version 18+\n- Check for TypeScript errors\n\n**PWA Not Installing**\n- Use HTTPS in production\n- Verify manifest.json is accessible\n- Check service worker registration\n\n### **Getting Help**\n- **GitHub Issues**: Report bugs and request features\n- **Discussions**: Ask questions and share ideas\n- **Documentation**: Check guides and API reference\n- **Community**: Join our Discord server (coming soon)\n\n## 📈 Roadmap\n\n### **Phase 1 (Current)** ✅\n- ✅ AI-powered fitness coaching\n- ✅ Real-time workout tracking\n- ✅ Smart nutrition planning\n- ✅ Social community features\n- ✅ PWA with offline support\n\n### **Phase 2 (Coming Soon)** 🚧\n- 🔄 Wearable device integration (Apple Watch, Fitbit)\n- 🔄 Advanced analytics and insights\n- 🔄 Video workout streaming\n- 🔄 Trainer marketplace\n- 🔄 Premium subscription features\n\n### **Phase 3 (Future)** 🔮\n- 🔮 AR workout guidance\n- 🔮 AI form checking with camera\n- 🔮 Genetic-based recommendations\n- 🔮 Mental health integration\n- 🔮 Global fitness competitions\n\n## 📄 License\n\nThis project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.\n\n## 🙏 Acknowledgments\n\n- **OpenAI** - For providing GPT-4 API for intelligent conversations\n- **USDA** - For the comprehensive free nutrition database\n- **Radix UI** - For accessible and beautiful UI components\n- **Vercel** - For Next.js framework and deployment platform\n- **Railway** - For simple and powerful deployment infrastructure\n\n## 💪 Transform Your Fitness Journey\n\n<div align=\"center\">\n  <p><strong>Ready to revolutionize your fitness experience?</strong></p>\n  <p>Get started today and join thousands of users achieving their fitness goals with AI-powered guidance!</p>\n  \n  <p>\n    <a href=\"#-quick-start\">🚀 Get Started</a> •\n    <a href=\"./QUICK_AI_SETUP.md\">⚙️ Setup Guide</a> •\n    <a href=\"./RAILWAY_DEPLOYMENT.md\">🚂 Deploy</a>\n  </p>\n  \n  <p><em>\"The future of fitness is here. Make it personal. Make it intelligent. Make it yours.\"</em></p>\n</div>\n\n---\n\n<div align=\"center\">\n  <p>Made with ❤️ by the FitSync AI Team</p>\n  <p>⭐ Star this repo if you found it helpful!</p>\n</div>