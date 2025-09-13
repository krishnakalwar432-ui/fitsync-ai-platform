# 🚀 FitSync AI - Quick Setup Guide

Your AI fitness assistant is ready to go! Follow these steps to activate real AI functionality.

## 🎯 Step 1: Get Your OpenAI API Key (Required)

1. **Go to OpenAI Platform**: https://platform.openai.com/api-keys
2. **Sign up or log in** to your OpenAI account
3. **Create a new API key**:
   - Click "Create new secret key"
   - Give it a name like "FitSync AI"
   - Copy the key (it starts with `sk-`)
4. **Add billing**: You'll need to add a payment method, but usage is very affordable

## 🔧 Step 2: Configure Your API Key

1. **Open your `.env.local` file** (already created for you)
2. **Replace `your_openai_api_key_here` with your actual API key**:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```
3. **Generate a NextAuth secret**:
   ```bash
   # Run this in your terminal to generate a random secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
4. **Add the secret to `.env.local`**:
   ```
   NEXTAUTH_SECRET=your-generated-secret-here
   ```

## 🏃‍♂️ Step 3: Test Your AI

1. **Start your development server**:
   ```bash
   npm run dev
   ```
2. **Open http://localhost:3000**
3. **Click the chat bubble** (bottom right corner)
4. **Test with a message like**: "Create a beginner workout plan"

## ✅ Expected Results

**With OpenAI API Key Configured:**
- 🤖 Intelligent, personalized responses
- 💪 Custom workout plans based on your goals
- 🥗 Detailed nutrition advice
- 📊 Context-aware conversation memory

**Without API Key:**
- 📚 Fallback to local knowledge base
- ⚠️ Message indicating API configuration needed

## 💰 Cost Breakdown

**OpenAI API Pricing:**
- ~$0.002 per 1K tokens (very affordable)
- Average conversation: 5-10 cents
- Monthly personal use: $5-15 typically

**FREE Upgrade Options:**
- **USDA Food API**: FREE nutrition database (300K+ foods)
- **ExerciseDB**: FREE exercise database (1300+ exercises)

## 🎮 Optional: Add More APIs for Enhanced Features

### USDA Food API (FREE - Recommended)
1. Get key: https://fdc.nal.usda.gov/api-guide.html
2. Add to `.env.local`: `USDA_API_KEY=your_key`
3. **Result**: Search 300,000+ foods with detailed nutrition

### ExerciseDB API (FREE tier available)
1. Get key: https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb
2. Add to `.env.local`: `RAPIDAPI_KEY=your_key`
3. **Result**: 1300+ exercises with GIFs and instructions

## 🔍 Testing Each Feature

### Test AI Chat:
```
"Create a workout plan for building muscle"
"What should I eat before working out?"
"I'm a beginner, where do I start?"
```

### Test Nutrition Search (with USDA API):
- Go to Nutrition Center
- Search "chicken breast" or "quinoa"

### Test Workout Generation:
- Ask AI: "Generate a 30-minute home workout"
- Try different goals: weight loss, muscle gain, strength

## 🛠 Troubleshooting

**"API key not working"**
- ✅ Verify key is correctly copied (no extra spaces)
- ✅ Restart development server (`Ctrl+C`, then `npm run dev`)
- ✅ Check OpenAI account has billing set up

**"Still getting fallback responses"**
- ✅ Check console for error messages
- ✅ Verify `.env.local` file exists in project root
- ✅ Make sure you didn't commit the file with your real keys

**Rate limits or costs too high**
- ✅ Set usage limits in OpenAI dashboard
- ✅ Consider caching for production deployment

## 🚀 You're All Set!

Your AI fitness assistant now has real intelligence and can:
- 🧠 **Understand context** and remember your fitness goals
- 💪 **Generate personalized workouts** based on your level and equipment  
- 🥗 **Provide nutrition advice** tailored to your dietary needs
- 📊 **Track your progress** and adapt recommendations
- 🎯 **Answer complex fitness questions** with evidence-based advice

**Ready to experience AI-powered fitness coaching!** 🤖💪

---

Need help? Check the console in your browser (F12) for detailed error messages.