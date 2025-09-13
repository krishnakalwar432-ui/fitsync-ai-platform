# 🤖 FitSync AI - Real AI Integration Guide

Your FitSync AI platform now supports **real AI capabilities** using multiple APIs. This guide will help you set up and configure the AI services.

## 🚀 Quick Start

### 1. **Essential Setup (Minimum for AI functionality)**
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local and add your OpenAI API key
OPENAI_API_KEY=your_openai_api_key_here
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 2. **Install Dependencies**
```bash
npm install openai
# or
pnpm add openai
```

### 3. **Start Development Server**
```bash
npm run dev
```

## 🔑 API Keys Setup

### **OpenAI API (Required for AI Chat)**
- **Purpose**: Powers the AI fitness assistant with intelligent responses
- **Get API Key**: [OpenAI Platform](https://platform.openai.com/api-keys)
- **Cost**: ~$0.002 per 1K tokens (very affordable for personal use)
- **Setup**: Add `OPENAI_API_KEY=your_key` to `.env.local`

### **USDA FoodData Central (Recommended - FREE)**
- **Purpose**: Comprehensive nutrition data for 300,000+ foods
- **Get API Key**: [USDA FDC](https://fdc.nal.usda.gov/api-guide.html)
- **Cost**: Completely FREE, no rate limits
- **Setup**: Add `USDA_API_KEY=your_key` to `.env.local`

### **Spoonacular API (Optional)**
- **Purpose**: Meal planning, recipes, advanced nutrition features
- **Get API Key**: [Spoonacular](https://spoonacular.com/food-api)
- **Cost**: 150 free requests/day, then $0.002 per request
- **Setup**: Add `SPOONACULAR_API_KEY=your_key` to `.env.local`

### **RapidAPI - ExerciseDB (Optional)**
- **Purpose**: 1300+ exercises with GIFs and detailed instructions
- **Get API Key**: [RapidAPI ExerciseDB](https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb)
- **Cost**: Free tier available, check current limits
- **Setup**: Add `RAPIDAPI_KEY=your_key` to `.env.local`

## 🎯 Feature Matrix

| Feature | Without APIs | With OpenAI | + USDA API | + All APIs |
|---------|-------------|-------------|------------|-----------|
| **AI Chat** | Basic responses | ✅ Smart AI | ✅ Smart AI | ✅ Smart AI |
| **Workout Plans** | Templates | ✅ Personalized | ✅ Personalized | ✅ Advanced |
| **Nutrition Search** | Local DB (~20 foods) | Local DB | ✅ 300K+ foods | ✅ 300K+ foods |
| **Meal Planning** | Basic templates | ✅ AI-generated | ✅ Nutrition-aware | ✅ Recipe integration |
| **Exercise Database** | Local (~50 exercises) | Local | Local | ✅ 1300+ exercises |
| **Recipe Details** | None | Basic | Basic | ✅ Full recipes |

## 🧠 AI Capabilities

### **What the AI Can Do:**

1. **Intelligent Fitness Coaching**
   - Personalized workout recommendations
   - Form correction and exercise modifications
   - Progressive training plans
   - Injury prevention advice

2. **Smart Nutrition Guidance**
   - Macro calculation and meal planning
   - Food database search and nutrition analysis
   - Dietary restriction accommodations
   - Supplement recommendations

3. **Contextual Conversations**
   - Remembers your fitness level and goals
   - Adapts responses based on conversation history
   - Provides evidence-based fitness advice
   - Motivational support and goal tracking

4. **Real-time Workout Generation**
   - Creates workouts based on available equipment
   - Adjusts difficulty for your fitness level
   - Balances muscle groups automatically
   - Estimates calories and recovery time

## 📋 Testing Your Setup

### **1. Test AI Chat**
- Open the chat widget (bottom right)
- Ask: \"Create a beginner workout plan\"
- With OpenAI: You'll get detailed, personalized responses
- Without: You'll get template-based responses with a note

### **2. Test Nutrition Search**
- Go to Nutrition Center
- Search for \"chicken breast\"
- With USDA API: Detailed nutrition data
- Without: Limited local database

### **3. Test Workout Generation**
- Ask AI: \"Generate a 30-minute home workout\"
- With APIs: Detailed exercise list with instructions
- Without: Basic template workout

## 🛠 Troubleshooting

### **Common Issues:**

**\"API key not working\"**
- Verify key is correctly copied to `.env.local`
- Restart development server after adding keys
- Check API key has sufficient credits/quota

**\"Fallback responses only\"**
- Normal behavior when APIs aren't configured
- Add API keys for enhanced functionality
- Check console for specific error messages

**\"Rate limit exceeded\"**
- Each API has different rate limits
- Implement caching for production use
- Consider upgrading to paid tiers for heavy usage

### **Debug Mode:**
```bash
# Enable detailed logging
DEBUG=fitsync:* npm run dev
```

## 💰 Cost Analysis

### **Recommended Setup for Personal Use:**
- **OpenAI API**: ~$5-10/month for active use
- **USDA API**: FREE
- **Total**: Under $10/month for full AI functionality

### **For Production/Heavy Use:**
- Consider implementing Redis caching
- Monitor API usage and set billing alerts
- Use environment-specific rate limiting

## 🚀 Deployment Notes

### **Environment Variables for Production:**
```bash
# Production environment
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com

# All API keys (same as development)
OPENAI_API_KEY=your_production_key
USDA_API_KEY=your_usda_key
# ... other keys
```

### **Railway/Vercel Deployment:**
1. Add environment variables in your deployment platform
2. Ensure all API keys are properly configured
3. Test functionality after deployment

## 📚 API Documentation

- **OpenAI**: [OpenAI API Docs](https://platform.openai.com/docs)
- **USDA FoodData**: [FDC API Guide](https://fdc.nal.usda.gov/api-guide.html)
- **Spoonacular**: [Spoonacular Docs](https://spoonacular.com/food-api/docs)
- **ExerciseDB**: [RapidAPI Docs](https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb)

## 🎉 What's Next?

Your AI assistant is now capable of:
- ✅ Intelligent conversations about fitness
- ✅ Personalized workout generation
- ✅ Advanced nutrition search and planning
- ✅ Evidence-based fitness recommendations
- ✅ Contextual learning from your preferences

**Ready to experience real AI-powered fitness coaching!** 🤖💪

---

*For support or questions about the AI integration, check the console logs for detailed error messages or refer to the individual API documentation.*