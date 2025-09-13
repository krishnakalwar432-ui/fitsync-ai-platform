"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { MessageCircle, Send, X, Bot, User, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
  actionButtons?: {
    text: string
    action: string
    data?: any
  }[]
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm your AI fitness assistant powered by advanced fitness knowledge. I can help you with:\n\n🏋️ **Workout Plans** - Custom routines based on your goals\n🥗 **Nutrition Advice** - Meal plans and macro guidance\n📊 **Progress Tracking** - Analysis and recommendations\n🧘 **Form & Technique** - Exercise guidance and safety tips\n\nWhat fitness goal can I help you achieve today?",
      timestamp: new Date(),
      suggestions: [
        "Create a beginner workout plan",
        "Help me lose weight",
        "Build muscle mass",
        "Improve flexibility"
      ]
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<'workout' | 'nutrition' | 'general'>('general')
  const [userContext, setUserContext] = useState({
    lastWorkout: null as string | null,
    fitnessLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    primaryGoal: null as string | null,
    conversationHistory: [] as string[]
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()

  // Enhanced fitness knowledge base
  const fitnessKnowledge = {
    workoutPlans: {
      beginner: {
        weightLoss: "Start with 3 days/week combining cardio and basic strength training. Focus on bodyweight exercises like squats, push-ups, and planks. Add 20-30 minutes of walking or light cardio.",
        muscleGain: "Begin with full-body workouts 3x/week. Master basic movements: squats, deadlifts, bench press, rows. Start with bodyweight or light weights, focus on form over weight.",
        general: "Mix of cardio and strength training. 2-3 strength sessions, 2 cardio sessions per week. Focus on compound movements and gradual progression."
      },
      intermediate: {
        weightLoss: "4-5 days/week with HIIT, strength training, and steady-state cardio. Incorporate supersets and circuit training. Track calories and maintain a slight deficit.",
        muscleGain: "4-day split routine focusing on progressive overload. Push/pull/legs split or upper/lower split. Increase protein intake to 1.6-2.2g per kg bodyweight.",
        general: "Varied training split with periodization. Include strength, cardio, and mobility work. 4-5 training days with strategic rest."
      },
      advanced: {
        weightLoss: "Periodized training with advanced techniques. Body recomposition focus. Combination of strength, HIIT, and metabolic conditioning. Precise nutrition tracking.",
        muscleGain: "Advanced split routines with specialization phases. Use advanced techniques like drop sets, rest-pause. Precise macro tracking and meal timing.",
        general: "Sophisticated programming with periodization. Sport-specific or goal-specific training phases. Advanced recovery protocols."
      }
    },
    nutrition: {
      macros: {
        weightLoss: "Protein: 25-30%, Carbs: 30-40%, Fats: 25-35%. Maintain caloric deficit of 300-500 calories. Focus on whole foods and adequate protein.",
        muscleGain: "Protein: 25-30%, Carbs: 40-50%, Fats: 20-30%. Slight caloric surplus of 200-500 calories. Time carbs around workouts.",
        maintenance: "Protein: 20-25%, Carbs: 45-55%, Fats: 25-30%. Eat at maintenance calories. Focus on nutrient density and consistency."
      },
      supplements: {
        basic: "Whey protein, creatine monohydrate, multivitamin, omega-3 fatty acids. These cover most basic needs.",
        advanced: "Add pre-workout, BCAAs for fasted training, vitamin D, magnesium, zinc. Consider timing and individual needs."
      }
    },
    exercises: {
      compound: ["Squat", "Deadlift", "Bench Press", "Overhead Press", "Pull-ups", "Rows"],
      beginner: ["Bodyweight Squats", "Push-ups", "Planks", "Walking", "Modified Pull-ups"],
      cardio: ["Walking", "Jogging", "Cycling", "Swimming", "HIIT", "Jump Rope"]
    },
    commonQuestions: {
      "how much protein": "Aim for 1.6-2.2g per kg of bodyweight for muscle building, or 1.2-1.6g for general fitness. Spread throughout the day.",
      "how often workout": "Beginners: 3-4 days/week, Intermediate: 4-5 days/week, Advanced: 5-6 days/week. Include rest days for recovery.",
      "cardio or weights": "Both! Combine strength training with cardio. Strength training builds muscle and boosts metabolism, cardio improves heart health.",
      "lose belly fat": "You can't spot reduce fat. Focus on overall weight loss through caloric deficit, strength training, and cardio. Abs are made in the kitchen!",
      "gain muscle": "Progressive overload in strength training, adequate protein, sufficient calories, and proper rest. Consistency is key!",
      "best time workout": "The best time is when you can be consistent. Morning may boost metabolism, evening may improve performance. Choose what fits your schedule."
    }
  }

  const generateSmartResponse = (message: string, topic: string) => {
    const lowerMessage = message.toLowerCase()
    
    // Check for common fitness questions
    for (const [key, answer] of Object.entries(fitnessKnowledge.commonQuestions)) {
      if (lowerMessage.includes(key)) {
        return {
          content: `🤓 **${key.charAt(0).toUpperCase() + key.slice(1)}**\n\n${answer}\n\nWould you like me to create a personalized plan based on this information?`,
          suggestions: ["Create workout plan", "Nutrition guidance", "More details", "Something else"]
        }
      }
    }

    // Topic-specific responses
    if (topic === 'workout') {
      if (lowerMessage.includes('beginner') || lowerMessage.includes('start')) {
        return {
          content: "🎆 **Perfect! Let's start your fitness journey!**\n\nAs a beginner, I recommend:\n\n💪 **Frequency**: 3-4 days per week\n⏰ **Duration**: 30-45 minutes\n🎯 **Focus**: Basic compound movements\n\nShould I create a specific beginner workout plan for you?",
          suggestions: ["Yes, create plan", "Weight loss focus", "Muscle building", "Home workouts"],
          actionButtons: [{
            text: "Start Beginner Plan",
            action: "create_workout",
            data: { level: 'beginner', goal: 'general' }
          }]
        }
      }
      
      if (lowerMessage.includes('weight loss') || lowerMessage.includes('lose weight')) {
        return {
          content: "🔥 **Weight Loss Strategy**\n\nHere's your comprehensive approach:\n\n🏋️ **Exercise**: Combine strength training + cardio\n🥗 **Nutrition**: Moderate caloric deficit (300-500 cal)\n📊 **Tracking**: Monitor progress weekly\n\nThe key is consistency over perfection!",
          suggestions: ["Create weight loss plan", "Nutrition advice", "How much cardio?", "Track progress"],
          actionButtons: [{
            text: "Get Weight Loss Plan",
            action: "create_workout",
            data: { goal: 'weightLoss' }
          }]
        }
      }
    }

    if (topic === 'nutrition') {
      if (lowerMessage.includes('protein') || lowerMessage.includes('macro')) {
        return {
          content: "🥩 **Nutrition Guidance**\n\nHere are your macro targets:\n\n💪 **Protein**: 1.6-2.2g per kg bodyweight\n🍞 **Carbs**: 45-65% of calories (active days)\n🥑 **Fats**: 20-35% of calories\n\nWant me to calculate your specific needs?",
          suggestions: ["Calculate my macros", "Meal plan ideas", "Best protein sources", "Supplement advice"]
        }
      }
    }

    // Default contextual response
    const responses = [
      "🤔 That's a great question! Based on current fitness science and best practices, here's what I recommend...",
      "💫 Excellent! Let me help you with that. Here's a personalized approach...",
      "🔥 I love your motivation! Here's how we can tackle this together..."
    ]
    
    return {
      content: `${responses[Math.floor(Math.random() * responses.length)]}\n\nTo give you the most accurate advice, could you tell me more about your current fitness level and specific goals?`,
      suggestions: ["I'm a beginner", "Intermediate level", "Advanced athlete", "Just starting out"]
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return
    
    if (!session) {
      // Add a message prompting to sign in
      const promptMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Please sign in to access the AI fitness assistant and get personalized recommendations.",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, promptMessage])
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    
    // Update conversation history for context
    setUserContext(prev => ({
      ...prev,
      conversationHistory: [...prev.conversationHistory, inputMessage].slice(-5) // Keep last 5 messages
    }))
    
    const currentMessage = inputMessage
    setInputMessage("")
    setIsLoading(true)

    try {
      // Call real OpenAI API first
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMessage,
          topic: selectedTopic,
          context: userContext
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
          suggestions: data.suggestions || ["Tell me more", "Create a plan", "Something else"]
        }

        setMessages(prev => [...prev, aiMessage])
      } else {
        throw new Error('API request failed')
      }
    } catch (error) {
      console.error('Error calling AI API:', error)
      
      // Fallback to enhanced smart response
      const smartResponse = generateSmartResponse(currentMessage, selectedTopic)
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: smartResponse.content + "\n\n*Note: Using local AI knowledge base. For advanced AI responses, ensure OpenAI API is configured.*",
        timestamp: new Date(),
        suggestions: smartResponse.suggestions,
        actionButtons: smartResponse.actionButtons
      }
      
      setMessages(prev => [...prev, aiMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

  const handleActionButton = async (action: string, data?: any) => {
    setIsLoading(true)
    
    try {
      switch (action) {
        case 'create_workout':
          // Call real workout API
          const workoutResponse = await fetch('/api/workout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'generate_workout',
              data: {
                goal: data?.goal || 'general',
                level: data?.level || userContext.fitnessLevel,
                duration: 45,
                equipment: ['bodyweight'],
                workoutType: 'full_body'
              }
            })
          })
          
          if (workoutResponse.ok) {
            const workoutData = await workoutResponse.json()
            const workout = workoutData.workout
            
            const workoutMessage = `🎉 **AI-Generated Workout Plan Created!**\n\n**${workout.name}**\n\n` +
              `📊 **Details:**\n` +
              `• Duration: ${workout.estimatedDuration} minutes\n` +
              `• Level: ${workout.level}\n` +
              `• Goal: ${workout.goal}\n\n` +
              `🏋️ **Main Exercises:**\n` +
              workout.structure.mainWorkout.exercises.map((ex: any, i: number) => 
                `${i + 1}. **${ex.name}** - ${ex.sets} sets × ${ex.reps}\n   Target: ${ex.muscle} | Rest: ${ex.rest}`
              ).join('\n') +
              `\n\n💡 **Tips:**\n` +
              workout.tips.map((tip: string) => `• ${tip}`).join('\n') +
              `\n\nWould you like me to show exercise demonstrations or modify this plan?`
            
            const workoutResponseMessage: Message = {
              id: Date.now().toString(),
              role: 'assistant',
              content: workoutMessage,
              timestamp: new Date(),
              suggestions: ["Show exercise demos", "Modify difficulty", "Add nutrition plan", "Track this workout"]
            }
            
            setMessages(prev => [...prev, workoutResponseMessage])
          } else {
            throw new Error('Failed to generate workout')
          }
          break
          
        case 'get_exercise_details':
          const exerciseResponse = await fetch('/api/workout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'get_exercise_details',
              data: { exerciseId: data?.exerciseId }
            })
          })
          
          if (exerciseResponse.ok) {
            const exerciseData = await exerciseResponse.json()
            const exercise = exerciseData.exercise
            
            const exerciseMessage = `🏋️ **${exercise.name} - Exercise Guide**\n\n` +
              `🎯 **Target Muscle:** ${exercise.target}\n` +
              `💪 **Body Part:** ${exercise.bodyPart}\n` +
              `🛠️ **Equipment:** ${exercise.equipment}\n\n` +
              `📝 **Instructions:**\n` +
              exercise.instructions.map((inst: string, i: number) => `${i + 1}. ${inst}`).join('\n') +
              (exercise.tips ? `\n\n💡 **Pro Tips:**\n${exercise.tips.map((tip: string) => `• ${tip}`).join('\n')}` : '') +
              (exercise.commonMistakes ? `\n\n⚠️ **Avoid These Mistakes:**\n${exercise.commonMistakes.map((mistake: string) => `• ${mistake}`).join('\n')}` : '')
            
            const exerciseResponseMessage: Message = {
              id: Date.now().toString(),
              role: 'assistant',
              content: exerciseMessage,
              timestamp: new Date(),
              suggestions: ["Show variations", "Find similar exercises", "Add to workout", "Form check"]
            }
            
            setMessages(prev => [...prev, exerciseResponseMessage])
          }
          break
          
        case 'generate_meal_plan':
          const nutritionResponse = await fetch('/api/nutrition', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'generate_meal_plan',
              data: {
                dietType: data?.dietType || 'balanced',
                calories: data?.calories || 2000,
                days: 1,
                allergies: [],
                preferences: []
              }
            })
          })
          
          if (nutritionResponse.ok) {
            const nutritionData = await nutritionResponse.json()
            const mealPlan = nutritionData.mealPlan
            
            const mealMessage = `🍽️ **AI-Generated Meal Plan**\n\n` +
              `📊 **Plan Details:**\n` +
              `• Total Calories: ${mealPlan.totalCalories}\n` +
              `• Diet Type: ${mealPlan.dietType}\n\n` +
              `🍽️ **Today's Meals:**\n` +
              mealPlan.meals.map((meal: any) => 
                `**${meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}** (${meal.targetCalories} cal)\n` +
                `Protein: ${meal.targetProtein}g | Carbs: ${meal.targetCarbs}g | Fat: ${meal.targetFat}g\n` +
                `Suggestions: ${meal.suggestions.slice(0, 2).join(', ')}`
              ).join('\n\n') +
              `\n\n💡 **Recommendations:**\n` +
              nutritionData.mealPlan.recommendations?.map((rec: string) => `• ${rec}`).join('\n')
            
            const mealResponseMessage: Message = {
              id: Date.now().toString(),
              role: 'assistant',
              content: mealMessage,
              timestamp: new Date(),
              suggestions: ["Recipe details", "Weekly plan", "Grocery list", "Macro calculator"]
            }
            
            setMessages(prev => [...prev, mealResponseMessage])
          }
          break
          
        default:
          // Fallback to basic response
          const fallbackMessage = `🤖 **Action: ${action}**\n\nI'm processing your request with the available data. The AI system is working to provide you with personalized fitness guidance.`
          
          const fallbackResponse: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: fallbackMessage,
            timestamp: new Date(),
            suggestions: ["Try again", "Ask something else", "Get help", "Contact support"]
          }
          
          setMessages(prev => [...prev, fallbackResponse])
      }
    } catch (error) {
      console.error('Action button error:', error)
      
      // Enhanced error handling with helpful message
      const errorMessage = `⚠️ **Action Processing Issue**\n\nI encountered an issue processing your request. This might be due to API configuration or connectivity.\n\n**What I can still help with:**\n• General fitness advice\n• Exercise recommendations\n• Nutrition guidance\n• Workout planning tips\n\nWould you like to try a different approach?`
      
      const errorResponse: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date(),
        suggestions: ["Ask general question", "Basic workout plan", "Nutrition tips", "Exercise form"]
      }
      
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const quickQuestions = [
    { text: "Create a beginner workout plan", topic: "workout" as const },
    { text: "Help me lose weight effectively", topic: "nutrition" as const },
    { text: "Build muscle and strength", topic: "workout" as const },
    { text: "Improve my running performance", topic: "general" as const },
    { text: "What should I eat pre/post workout?", topic: "nutrition" as const },
    { text: "How much protein do I need?", topic: "nutrition" as const },
    { text: "Best exercises for beginners", topic: "workout" as const },
    { text: "How to prevent workout injuries", topic: "general" as const },
  ]

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[600px] shadow-2xl z-40 flex flex-col">
          {/* Chat Header */}
          <CardHeader className="bg-primary/10 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-primary p-2 rounded-full">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold">AI Fitness Assistant</h3>
                  <p className="text-xs text-muted-foreground">Powered by AI • Ready to help</p>
                </div>
              </div>
              {session && (
                <Badge variant="secondary" className="text-xs">
                  Personalized
                </Badge>
              )}
            </div>
            
            {/* Topic Selection */}
            <div className="flex space-x-2 mt-3">
              {(['general', 'workout', 'nutrition'] as const).map((topic) => (
                <Button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  variant={selectedTopic === topic ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                >
                  {topic.charAt(0).toUpperCase() + topic.slice(1)}
                </Button>
              ))}
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-start space-x-2 max-w-[85%] ${
                    message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <div
                    className={`p-2 rounded-full ${
                      message.role === "user" ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="h-4 w-4 text-primary-foreground" />
                    ) : (
                      <Bot className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === "user" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    
                    {/* Action Buttons */}
                    {message.actionButtons && message.role === "assistant" && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.actionButtons.map((button, index) => (
                          <Button
                            key={index}
                            onClick={() => handleActionButton(button.action, button.data)}
                            size="sm"
                            className="text-xs"
                          >
                            {button.text}
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    {/* Suggestions */}
                    {message.suggestions && message.role === "assistant" && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            variant="outline"
                            size="sm"
                            className="text-xs h-6"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className="bg-muted p-2 rounded-full">
                    <Bot className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Enhanced Quick Questions */}
            {messages.length === 1 && !isLoading && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground text-center font-medium">🚀 Popular fitness questions:</p>
                <div className="grid grid-cols-1 gap-2">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      onClick={() => {
                        setSelectedTopic(question.topic)
                        setInputMessage(question.text)
                        handleSendMessage()
                      }}
                      variant="ghost"
                      size="sm"
                      className="justify-start text-left h-auto p-3 text-xs border border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5"
                    >
                      <span className="mr-2">
                        {question.topic === 'workout' ? '🏋️' : 
                         question.topic === 'nutrition' ? '🥗' : '🧠'}
                      </span>
                      {question.text}
                    </Button>
                  ))}
                </div>
                
                <div className="text-center mt-4">
                  <p className="text-xs text-muted-foreground">
                    💪 Powered by advanced fitness science & personalized AI
                  </p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={session ? "Ask me anything about fitness..." : "Sign in to chat with AI"}
                disabled={isLoading || !session}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading || !session}
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            {!session && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Sign in to get personalized AI recommendations
              </p>
            )}
          </div>
        </Card>
      )}
    </>
  )
}
