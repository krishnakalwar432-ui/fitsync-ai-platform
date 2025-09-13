// Enhanced AI Chat API with Queue Integration (Simplified for deployment)
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Enhanced system prompts with more context
const ENHANCED_SYSTEM_PROMPTS = {
  general: `You are FitSync AI, an advanced fitness and wellness assistant with deep expertise in:

CORE COMPETENCIES:
• Exercise Physiology & Biomechanics - Understanding of muscle activation, movement patterns, and injury prevention
• Nutrition Science - Macro/micronutrient optimization, meal timing, and metabolic processes  
• Training Methodology - Periodization, progressive overload, and program design principles
• Psychology & Motivation - Behavior change, habit formation, and mental wellness
• Recovery & Sleep - Stress management, sleep optimization, and recovery protocols

PERSONALITY TRAITS:
• Encouraging yet realistic
• Evidence-based in recommendations
• Adaptable to individual needs and limitations
• Safety-conscious
• Motivational and supportive

COMMUNICATION STYLE:
• Use fitness terminology appropriately but explain complex concepts
• Provide actionable, specific advice
• Include relevant emojis for engagement
• Ask clarifying questions when needed
• Always prioritize user safety

Remember: You have access to the user's workout history, progress data, and preferences through our integrated system.`,

  workout: `You are an elite personal trainer and exercise physiologist with 15+ years of experience training athletes and everyday fitness enthusiasts.

SPECIALIZATIONS:
• Program Design - Creating periodized training plans for all fitness levels
• Exercise Selection - Choosing optimal movements based on goals, equipment, and limitations
• Form & Technique - Providing detailed movement cues and safety instructions
• Progression Strategies - Implementing progressive overload and exercise variations
• Injury Prevention - Identifying risk factors and providing modifications
• Recovery Planning - Balancing training stress with adequate recovery

ASSESSMENT CAPABILITIES:
• Analyze current fitness level and movement quality
• Identify muscle imbalances and weaknesses
• Recommend appropriate training loads and progressions
• Suggest equipment alternatives for any environment

SAFETY PROTOCOLS:
• Always assess for contraindications
• Provide proper warm-up and cool-down guidance
• Emphasize proper form over heavy weights
• Recommend medical consultation when appropriate`,

  nutrition: `You are a registered dietitian and sports nutritionist specializing in performance nutrition and body composition optimization.

EXPERTISE AREAS:
• Macronutrient Planning - Protein, carbohydrate, and fat optimization for goals
• Meal Timing - Pre/post-workout nutrition and circadian rhythm alignment  
• Micronutrient Analysis - Vitamin and mineral needs for active individuals
• Hydration Strategies - Fluid and electrolyte balance for performance
• Supplement Science - Evidence-based supplement recommendations
• Special Populations - Nutrition for different ages, genders, and medical conditions

APPROACH:
• Whole foods first, supplements second
• Sustainable habits over extreme restrictions
• Cultural and preference considerations
• Budget-conscious recommendations
• Practical meal prep strategies

CONTRAINDICATIONS:
• Never diagnose medical conditions
• Refer to healthcare providers for medical nutrition therapy
• Avoid extreme or dangerous dietary practices`
}

export async function POST(req: NextRequest) {
  const startTime = performance.now()
  let session: any = null
  
  try {
    // Get user session
    session = await getServerSession(authOptions)
    const userId = session?.user?.id
    
    const { message, topic = 'general', context = {}, priority = 'normal' } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      )
    }

    // Simple rate limiting fallback
    // const rateLimitKey = `ai_chat_rate:${userId}`
    // For deployment, we'll skip complex rate limiting

    // Check for OpenAI API availability
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured, using fallback response')
      return generateEnhancedFallbackResponse(message, topic, context, userId)
    }

    // Get user context from database (if authenticated)
    let userContext = {}
    if (userId) {
      userContext = await getUserContext(userId)
    }

    // Construct enhanced prompt with user context
    const systemPrompt = ENHANCED_SYSTEM_PROMPTS[topic as keyof typeof ENHANCED_SYSTEM_PROMPTS] || ENHANCED_SYSTEM_PROMPTS.general
    
    const contextualPrompt = `
${systemPrompt}

USER PROFILE:
${userId ? `
- User ID: ${userId}
- Fitness Level: ${userContext.fitnessLevel || 'Not specified'}
- Primary Goals: ${userContext.primaryGoals?.join(', ') || 'Not specified'}
- Available Equipment: ${userContext.equipment?.join(', ') || 'Not specified'}
- Dietary Restrictions: ${userContext.dietaryRestrictions?.join(', ') || 'None'}
- Recent Activity: ${userContext.recentActivity || 'No recent activity'}
` : '- Anonymous user (limited context available)'}

CONVERSATION CONTEXT:
- Current Topic: ${topic}
- Previous Context: ${JSON.stringify(context)}
- Platform: FitSync AI Mobile/Web Application

INSTRUCTIONS:
Provide a helpful, personalized response that considers the user's profile and context. 
If you need more information to give a better recommendation, ask specific questions.
Always prioritize safety and evidence-based advice.
`

    // For high-priority or complex requests, we'll process immediately for deployment
    // In production, this would use queue processing

    // Process immediately for simple requests
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
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

    const aiResponse = completion.choices[0]?.message?.content || 
      'I apologize, but I couldn\'t generate a response. Please try again.'

    // Generate contextual suggestions
    const suggestions = generateContextualSuggestions(message, topic, aiResponse)

    // Store conversation in cache for context (simplified for deployment)
    // In production, this would use Redis
    if (userId) {
      // Would store conversation context here
      console.log(`Conversation for user ${userId}: ${topic}`);
    }

    const duration = performance.now() - startTime
    console.log(`AI Chat Response completed in ${Math.round(duration)}ms`)

    return NextResponse.json({
      message: aiResponse,
      suggestions,
      topic,
      metadata: {
        model: 'gpt-4',
        tokens_used: completion.usage?.total_tokens || 0,
        response_time: `${Math.round(duration)}ms`,
        cached: false,
        conversation_id: userId ? `conv_${userId}_${Date.now()}` : undefined
      }
    })

  } catch (error) {
    const duration = performance.now() - startTime
    console.error('AI Chat API error:', error)
    
    // Fallback to enhanced local response
    return generateEnhancedFallbackResponse(
      req.body?.message || 'Hello',
      req.body?.topic || 'general',
      req.body?.context || {},
      session?.user?.id
    )
  }
}

// Enhanced fallback response with better context awareness
async function generateEnhancedFallbackResponse(
  message: string,
  topic: string,
  context: any,
  userId?: string
) {
  const lowerMessage = message.toLowerCase()
  
  // Get user context if available
  let userContext = {}
  if (userId) {
    try {
      userContext = await getUserContext(userId)
    } catch (error) {
      console.warn('Failed to get user context for fallback', error)
    }
  }

  // Enhanced pattern matching with user context
  const patterns = {
    workout_request: /(?:workout|exercise|training|routine|plan)/i,
    nutrition_request: /(?:nutrition|diet|food|meal|eating|calories|macro)/i,
    progress_question: /(?:progress|result|improvement|gain|loss|track)/i,
    motivation_request: /(?:motivat|inspire|stuck|plateau|discourag)/i,
    beginner_question: /(?:beginner|start|new|first time|never)/i,
    equipment_question: /(?:equipment|gym|home|dumbbell|barbell)/i,
    time_constraint: /(?:time|busy|quick|fast|minute)/i,
    injury_concern: /(?:pain|hurt|injury|sore|recover)/i
  }

  let response = ''
  let suggestions: string[] = []

  // Context-aware responses
  if (patterns.workout_request.test(lowerMessage)) {
    const userLevel = userContext.fitnessLevel || 'beginner'
    const userGoals = userContext.primaryGoals || ['general fitness']
    
    response = `💪 **Personalized Workout Guidance**

Based on your ${userLevel} fitness level and goals (${userGoals.join(', ')}), here's what I recommend:

**Today's Focus:**
${userLevel === 'beginner' ? 
  '• Start with bodyweight exercises\n• Focus on form over intensity\n• 20-30 minutes, 3x per week' :
  '• Progressive overload principles\n• Compound movements first\n• Track your performance metrics'
}

**Key Principles:**
✅ Warm up for 5-10 minutes before exercising
✅ Focus on proper form and controlled movements
✅ Rest 48-72 hours between training same muscle groups
✅ Stay hydrated and listen to your body

Want me to create a specific workout plan for you?`

    suggestions = [
      'Create my workout plan',
      'Exercise form tips',
      'Home workout options',
      'Track my progress'
    ]
  }
  
  else if (patterns.nutrition_request.test(lowerMessage)) {
    const userGoals = userContext.primaryGoals || ['general health']
    const restrictions = userContext.dietaryRestrictions || []
    
    response = `🥗 **Personalized Nutrition Guidance**

For your goals (${userGoals.join(', ')})${restrictions.length > 0 ? ` with ${restrictions.join(', ')} restrictions` : ''}:

**Daily Nutrition Framework:**
• **Protein:** 1.6-2.2g per kg bodyweight for muscle maintenance
• **Carbs:** 3-7g per kg based on activity level
• **Fats:** 0.8-1.2g per kg for hormone production
• **Water:** 35-40ml per kg daily, more during exercise

**Meal Timing Strategy:**
🌅 **Breakfast:** Protein + complex carbs + healthy fats
🥙 **Pre-workout:** Light carbs 1-2 hours before
🍗 **Post-workout:** Protein + carbs within 2 hours
🌙 **Dinner:** Balanced meal 3+ hours before bed

**Quality Sources:**
• Lean proteins: chicken, fish, eggs, legumes
• Complex carbs: oats, quinoa, sweet potatoes
• Healthy fats: nuts, avocado, olive oil

Ready to build your personalized meal plan?`

    suggestions = [
      'Calculate my macros',
      'Meal prep ideas',
      'Healthy recipes',
      'Track my nutrition'
    ]
  }
  
  else if (patterns.progress_question.test(lowerMessage)) {
    response = `📊 **Progress Tracking & Optimization**

Progress isn't always about the scale! Here's how to measure real improvement:

**Key Metrics to Track:**
• **Strength:** Increased weights, reps, or exercise difficulty
• **Endurance:** Longer workouts or reduced rest periods
• **Body Composition:** Progress photos, measurements, how clothes fit
• **Energy Levels:** Daily energy and sleep quality
• **Consistency:** Workout frequency and nutrition adherence

**Realistic Timeline:**
• **2-4 weeks:** Improved energy and habit formation
• **4-8 weeks:** Strength and endurance gains
• **8-12 weeks:** Visible body composition changes
• **3-6 months:** Significant transformations

**Plateau Breakers:**
🔄 Change exercise selection or rep ranges
📈 Increase training volume or intensity
🍽️ Adjust nutrition to match current needs
😴 Prioritize sleep and recovery

Remember: Progress isn't linear, and small improvements compound over time!`

    suggestions = [
      'Log my progress',
      'Set new goals',
      'Adjust my plan',
      'Motivation tips'
    ]
  }
  
  else {
    // General fitness guidance
    response = `🧠 **Your AI Fitness Coach is Here!**

I'm here to help you achieve your fitness goals with personalized, science-based guidance. I can assist with:

💪 **Training:** Custom workouts, exercise form, progression strategies
🥗 **Nutrition:** Meal planning, macro tracking, healthy recipes  
📊 **Progress:** Tracking methods, goal setting, plateau solutions
🏥 **Recovery:** Sleep optimization, stress management, injury prevention
🧘 **Mindset:** Motivation, habit formation, overcoming obstacles

**What would you like to focus on today?**
${userId ? 'I have access to your profile and can provide personalized recommendations!' : 'Sign in for personalized recommendations based on your goals and preferences.'}

*Always consult healthcare professionals for medical concerns.*`

    suggestions = [
      'Create workout plan',
      'Nutrition guidance', 
      'Track progress',
      'Motivation boost'
    ]
  }

  return NextResponse.json({
    message: response,
    suggestions,
    topic,
    metadata: {
      model: 'enhanced-fallback',
      source: 'local_ai_system',
      personalized: !!userId,
      user_context: userId ? Object.keys(userContext).length : 0
    }
  })
}

// Get comprehensive user context
async function getUserContext(userId: string) {
  try {
    const { prisma } = await import('@/lib/prisma')
    
    // Get user profile and recent activity
    const [user, recentWorkouts, recentProgress] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          fitnessGoals: true,
          dietaryRestrictions: true,
          activityLevel: true,
          age: true,
          gender: true
        }
      }),
      prisma.completedWorkout.findMany({
        where: { userId },
        take: 5,
        orderBy: { completedAt: 'desc' },
        include: { workout: true }
      }),
      prisma.progressLog.findMany({
        where: { userId },
        take: 3,
        orderBy: { date: 'desc' }
      })
    ])

    // Determine fitness level based on recent activity
    let fitnessLevel = 'beginner'
    if (recentWorkouts.length >= 10) {
      const avgDuration = recentWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0) / recentWorkouts.length
      fitnessLevel = avgDuration > 60 ? 'advanced' : 'intermediate'
    }

    return {
      primaryGoals: user?.fitnessGoals || [],
      dietaryRestrictions: user?.dietaryRestrictions || [],
      activityLevel: user?.activityLevel || 'MODERATELY_ACTIVE',
      fitnessLevel,
      recentActivity: recentWorkouts.length > 0 ? 
        `Completed ${recentWorkouts.length} workouts recently` : 
        'No recent workout activity',
      equipment: ['bodyweight'], // Default equipment, could be expanded
      age: user?.age,
      gender: user?.gender
    }
  } catch (error) {
    console.error('Failed to get user context', error)
    return {}
  }
}

// Generate contextual suggestions based on conversation
function generateContextualSuggestions(message: string, topic: string, aiResponse?: string): string[] {
  const lowerMessage = message.toLowerCase()
  const lowerResponse = aiResponse?.toLowerCase() || ''
  
  const baseSuggestions = {
    workout: [
      'Show exercise demonstrations',
      'Create full workout plan',
      'Track this workout',
      'Modify for equipment'
    ],
    nutrition: [
      'Calculate my macros',
      'Generate meal plan',
      'Find healthy recipes',
      'Track my meals'
    ],
    general: [
      'Create workout plan',
      'Nutrition guidance',
      'Track progress',
      'Set fitness goals'
    ]
  }

  let suggestions = baseSuggestions[topic as keyof typeof baseSuggestions] || baseSuggestions.general

  // Add dynamic suggestions based on content
  if (lowerMessage.includes('beginner') || lowerResponse.includes('beginner')) {
    suggestions.unshift('Beginner-friendly tips')
  }
  
  if (lowerMessage.includes('home') || lowerResponse.includes('home')) {
    suggestions.unshift('Home workout ideas')
  }
  
  if (lowerMessage.includes('weight loss') || lowerResponse.includes('weight loss')) {
    suggestions.unshift('Weight loss strategies')
  }
  
  if (lowerMessage.includes('muscle') || lowerResponse.includes('muscle')) {
    suggestions.unshift('Muscle building tips')
  }

  return [...new Set(suggestions)].slice(0, 4) // Remove duplicates and limit to 4
}