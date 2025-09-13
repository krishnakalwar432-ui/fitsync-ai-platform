import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Fitness-specific system prompts for different contexts
const SYSTEM_PROMPTS = {
  general: `You are FitSync AI, an expert fitness and wellness assistant. You have comprehensive knowledge of:
- Exercise physiology and biomechanics
- Nutrition science and macro/micronutrients
- Training methodologies and periodization
- Injury prevention and recovery
- Mental health and motivation
- Equipment usage and form correction

Provide evidence-based, personalized advice. Always prioritize safety and recommend consulting healthcare professionals for medical concerns. Keep responses concise but informative, using emojis appropriately for engagement.`,

  workout: `You are a certified personal trainer and exercise physiologist with 15+ years of experience. You specialize in:
- Creating personalized workout programs for all fitness levels
- Exercise selection and progression principles
- Proper form and technique instruction
- Training periodization and program design
- Injury prevention and modification strategies
- Equipment alternatives for home/gym workouts

Always assess the user's fitness level, goals, available equipment, and time constraints before making recommendations. Emphasize progressive overload and proper form.`,

  nutrition: `You are a registered dietitian and sports nutritionist specializing in fitness and performance nutrition. Your expertise includes:
- Macro and micronutrient planning
- Meal timing and pre/post-workout nutrition
- Dietary supplements and their efficacy
- Weight management strategies
- Special dietary needs (vegetarian, keto, etc.)
- Hydration and electrolyte balance

Provide evidence-based nutritional guidance that aligns with the user's fitness goals, dietary preferences, and lifestyle. Always emphasize whole foods and sustainable practices.`
}

// Enhanced fitness knowledge base for context
const FITNESS_CONTEXT = {
  exerciseDatabase: [
    'Squat', 'Deadlift', 'Bench Press', 'Pull-up', 'Push-up', 'Plank', 'Burpee',
    'Overhead Press', 'Row', 'Lunge', 'Hip Thrust', 'Dip', 'Curl', 'Extension'
  ],
  nutritionFacts: {
    protein: '1.6-2.2g per kg bodyweight for muscle building',
    carbs: '3-7g per kg bodyweight depending on activity level',
    fats: '0.8-1.2g per kg bodyweight for hormone production',
    water: '35-40ml per kg bodyweight daily, more with exercise'
  },
  commonGoals: ['weight loss', 'muscle gain', 'strength', 'endurance', 'flexibility', 'general fitness'],
  fitnessLevels: ['beginner', 'intermediate', 'advanced'],
  equipmentTypes: ['bodyweight', 'dumbbells', 'barbell', 'resistance bands', 'gym machines', 'home gym']
}

export async function POST(req: NextRequest) {
  try {
    const { message, topic = 'general', context = {} } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured, using fallback response')
      return generateFallbackResponse(message, topic, context)
    }

    // Construct context-aware prompt
    const systemPrompt = SYSTEM_PROMPTS[topic as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.general
    
    const contextualPrompt = `
${systemPrompt}

Current conversation context:
- Topic focus: ${topic}
- User fitness level: ${context.fitnessLevel || 'not specified'}
- Primary goal: ${context.primaryGoal || 'not specified'}
- Previous topics: ${context.conversationHistory?.join(', ') || 'none'}

Available fitness data for reference:
- Common exercises: ${FITNESS_CONTEXT.exerciseDatabase.join(', ')}
- Nutrition guidelines: Protein ${FITNESS_CONTEXT.nutritionFacts.protein}, Carbs ${FITNESS_CONTEXT.nutritionFacts.carbs}
- User goals typically include: ${FITNESS_CONTEXT.commonGoals.join(', ')}

Respond to the user's question with actionable, personalized advice. Include specific exercise suggestions, rep ranges, or nutritional targets when relevant.
`

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // Use GPT-4 for better fitness knowledge
      messages: [
        {
          role: "system",
          content: contextualPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 800,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    })

    const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response. Please try again.'

    // Generate contextual suggestions based on the response
    const suggestions = generateSuggestions(message, topic, aiResponse)

    return NextResponse.json({
      message: aiResponse,
      suggestions,
      topic,
      model: 'gpt-4',
      tokens_used: completion.usage?.total_tokens || 0
    })

  } catch (error) {
    console.error('OpenAI API error:', error)
    
    // Fallback to local knowledge base
    return generateFallbackResponse(message, topic, context)
  }
}

function generateFallbackResponse(message: string, topic: string, context: any) {
  const lowerMessage = message.toLowerCase()
  
  // Enhanced pattern matching for fitness topics
  const patterns = {
    workout_beginner: /beginner|start|new to|just started|first time/i,
    weight_loss: /lose weight|weight loss|burn fat|cut|cutting/i,
    muscle_gain: /build muscle|gain muscle|bulk|bulking|mass/i,
    nutrition: /eat|food|diet|nutrition|macro|protein|carb/i,
    exercise_form: /form|technique|how to do|proper way/i,
    equipment: /equipment|gym|home workout|no equipment/i,
    injury: /pain|hurt|injury|sore|recover/i
  }

  let response = ''
  let suggestions: string[] = []

  // Pattern-based responses
  if (patterns.workout_beginner.test(lowerMessage)) {
    response = `🌟 **Welcome to your fitness journey!**

As a beginner, here's your roadmap:

**Week 1-2: Foundation**
• 3 full-body workouts per week
• Focus on bodyweight exercises: squats, push-ups, planks
• 20-30 minutes per session
• Rest 1 day between workouts

**Key Principles:**
✅ Form over weight - master the movement first
✅ Progressive overload - gradually increase difficulty
✅ Consistency beats intensity
✅ Listen to your body

Start with these basics and we'll build from there! 💪`

    suggestions = ['Create my workout plan', 'Nutrition for beginners', 'Home vs gym workouts', 'How to track progress']
  }
  
  else if (patterns.weight_loss.test(lowerMessage)) {
    response = `🔥 **Effective Weight Loss Strategy**

**The Golden Formula: Caloric Deficit + Strength Training + Cardio**

**Training Plan:**
• 3-4 strength training sessions/week
• 2-3 cardio sessions (mix HIIT and steady-state)
• Focus on compound movements (squats, deadlifts, rows)

**Nutrition Approach:**
• Moderate deficit: 300-500 calories below maintenance
• High protein: 1.6-2.2g per kg bodyweight
• Whole foods 80% of the time
• Stay hydrated: 2.5-3L water daily

**Timeline:** Expect 0.5-1kg loss per week with consistency! 📊`

    suggestions = ['Calculate my calories', 'Best fat-burning exercises', 'Meal prep ideas', 'Track my progress']
  }
  
  else if (patterns.muscle_gain.test(lowerMessage)) {
    response = `💪 **Muscle Building Blueprint**

**Training Fundamentals:**
• 4-5 training sessions per week
• Focus on compound movements
• Progressive overload every 1-2 weeks
• 6-12 reps for hypertrophy
• 48-72 hours rest between muscle groups

**Nutrition for Growth:**
• Slight caloric surplus: 200-500 calories above maintenance
• Protein: 1.8-2.2g per kg bodyweight
• Carbs around workouts for energy
• Quality sleep: 7-9 hours for recovery

**Key Exercises:** Squats, deadlifts, bench press, rows, overhead press

Patience and consistency are your best tools! 🚀`

    suggestions = ['Design muscle building plan', 'Protein requirements', 'Best muscle-building foods', 'Recovery tips']
  }
  
  else if (patterns.nutrition.test(lowerMessage)) {
    response = `🥗 **Nutrition Essentials**

**Macro Breakdown (general guidelines):**
• **Protein:** 1.6-2.2g per kg bodyweight
• **Carbs:** 3-7g per kg (adjust based on activity)
• **Fats:** 0.8-1.2g per kg bodyweight

**Meal Timing:**
• Pre-workout: Carbs + moderate protein (1-2 hours before)
• Post-workout: Protein + carbs (within 2 hours)
• Throughout day: Spread protein across all meals

**Quality Sources:**
• Protein: Lean meats, fish, eggs, dairy, legumes
• Carbs: Oats, rice, fruits, vegetables
• Fats: Nuts, olive oil, avocado, fatty fish

Remember: Consistency > perfection! 🎯`

    suggestions = ['Calculate my macros', 'Meal prep strategies', 'Supplement advice', 'Healthy recipes']
  }
  
  else {
    // General fitness advice
    response = `🧠 **Personalized Fitness Guidance**

I'm here to help with all aspects of your fitness journey! Based on current sports science and evidence-based practices, I can assist with:

💪 **Training:** Workout design, exercise selection, progression
🥗 **Nutrition:** Macro planning, meal timing, supplements  
📊 **Progress:** Tracking methods, goal setting, adjustments
🏥 **Recovery:** Sleep, stress management, injury prevention

What specific area would you like to focus on today? The more details you share about your goals and current situation, the better I can tailor my advice! 

*Always consult healthcare professionals for medical concerns.*`

    suggestions = ['Create workout plan', 'Nutrition guidance', 'Set fitness goals', 'Beginner advice']
  }

  return NextResponse.json({
    message: response,
    suggestions,
    topic,
    model: 'fallback',
    source: 'local_knowledge_base'
  })
}

function generateSuggestions(message: string, topic: string, aiResponse: string): string[] {
  const lowerMessage = message.toLowerCase()
  const lowerResponse = aiResponse.toLowerCase()
  
  // Context-aware suggestions based on message content and AI response
  const suggestionMap: { [key: string]: string[] } = {
    workout: [
      'Show me specific exercises',
      'Create full workout plan', 
      'Modify for home/gym',
      'Track my progress'
    ],
    nutrition: [
      'Calculate my macros',
      'Meal prep ideas',
      'Supplement recommendations',
      'Recipe suggestions'
    ],
    general: [
      'More details please',
      'Create action plan',
      'Set specific goals',
      'Track progress'
    ]
  }

  // Add dynamic suggestions based on content
  const dynamicSuggestions: string[] = []
  
  if (lowerMessage.includes('beginner')) {
    dynamicSuggestions.push('Beginner-friendly modifications')
  }
  if (lowerMessage.includes('home')) {
    dynamicSuggestions.push('Equipment-free alternatives')
  }
  if (lowerResponse.includes('protein')) {
    dynamicSuggestions.push('Best protein sources')
  }
  if (lowerResponse.includes('workout') || lowerResponse.includes('exercise')) {
    dynamicSuggestions.push('Show exercise demonstrations')
  }

  // Combine base suggestions with dynamic ones
  const baseSuggestions = suggestionMap[topic] || suggestionMap.general
  return [...new Set([...dynamicSuggestions.slice(0, 2), ...baseSuggestions.slice(0, 3)])]
}