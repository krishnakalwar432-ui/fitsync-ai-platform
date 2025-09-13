"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Bot, Send, Mic, MicOff, Sparkles, Heart, Zap, Target,
  MessageSquare, Volume2, VolumeX, RefreshCw, BookOpen
} from "lucide-react"

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  type: 'text' | 'suggestion' | 'workout' | 'nutrition'
}

interface QuickAction {
  label: string
  action: string
  icon: React.ReactNode
  category: string
}

export default function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi! I'm your AI fitness coach. I'm here to help you with workouts, nutrition, motivation, and answer any fitness questions you have. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickActions: QuickAction[] = [
    {
      label: "Create Workout Plan",
      action: "I need a workout plan for strength training",
      icon: <Target className="h-4 w-4" />,
      category: "workout"
    },
    {
      label: "Nutrition Advice",
      action: "What should I eat for muscle gain?",
      icon: <Heart className="h-4 w-4" />,
      category: "nutrition"
    },
    {
      label: "Motivation Boost",
      action: "I need some motivation to work out",
      icon: <Zap className="h-4 w-4" />,
      category: "motivation"
    },
    {
      label: "Exercise Form",
      action: "How do I perform a proper squat?",
      icon: <BookOpen className="h-4 w-4" />,
      category: "education"
    }
  ]

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(content)
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
      
      if (voiceEnabled) {
        speakMessage(aiResponse.content)
      }
    }, 1500)
  }

  const generateAIResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase()
    
    let response = ""
    let type: Message['type'] = 'text'

    if (input.includes('workout') || input.includes('exercise')) {
      response = "Great! I'd love to help you with a workout plan. Based on your fitness level and goals, I recommend starting with compound movements like squats, deadlifts, and push-ups. Would you like me to create a personalized routine for you?"
      type = 'workout'
    } else if (input.includes('nutrition') || input.includes('diet') || input.includes('eat')) {
      response = "Nutrition is crucial for your fitness journey! For muscle gain, focus on getting 1.6-2.2g protein per kg of body weight, complex carbs for energy, and healthy fats. Would you like me to suggest some specific meal ideas?"
      type = 'nutrition'
    } else if (input.includes('motivation') || input.includes('tired') || input.includes('lazy')) {
      response = "I understand that motivation can be challenging! Remember, every small step counts. You don't have to be perfect - just be consistent. Even a 10-minute walk is better than nothing. What's one small thing you could do right now? 💪"
      type = 'text'
    } else if (input.includes('form') || input.includes('how to') || input.includes('proper')) {
      response = "Proper form is essential for both safety and effectiveness! For most exercises, focus on controlled movements, full range of motion, and engaging your core. Which specific exercise would you like me to break down for you?"
      type = 'text'
    } else if (input.includes('progress') || input.includes('results')) {
      response = "Progress takes time, but I can help you track it! Focus on strength gains, how you feel, energy levels, and measurements - not just the scale. Are you tracking your workouts and how would you like to measure your progress?"
      type = 'text'
    } else {
      response = "That's a great question! I'm here to help with all aspects of your fitness journey - workouts, nutrition, motivation, form tips, and more. Could you tell me more specifically what you'd like help with?"
      type = 'text'
    }

    return {
      id: Date.now().toString(),
      content: response,
      sender: 'ai',
      timestamp: new Date(),
      type
    }
  }

  const speakMessage = (text: string) => {
    if (!voiceEnabled || !window.speechSynthesis) return
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    window.speechSynthesis.speak(utterance)
  }

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in your browser')
      return
    }

    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
    }

    recognition.start()
  }

  const handleQuickAction = (action: string) => {
    sendMessage(action)
  }

  const clearChat = () => {
    setMessages([{
      id: "1",
      content: "Chat cleared! How can I help you with your fitness journey today?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 py-8 px-4 particles-bg">
      <div className="max-w-4xl mx-auto">
        <Card className="glass-card-hover h-[80vh] flex flex-col">
          <CardHeader className="border-b border-gray-700">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-3 text-neon-gradient">
                <div className="relative">
                  <Bot className="h-8 w-8" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                </div>
                <div>
                  <span className="text-2xl">AI Fitness Coach</span>
                  <div className="text-sm text-gray-400 font-normal">Always here to help</div>
                </div>
              </CardTitle>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={voiceEnabled ? "text-neon-cyan" : "text-gray-400"}
                >
                  {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={clearChat} className="text-gray-400">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Avatar className="w-8 h-8">
                    {message.sender === 'ai' ? (
                      <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    ) : (
                      <AvatarFallback className="bg-neon-purple/20 text-neon-purple">U</AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div className={`p-4 rounded-2xl ${
                    message.sender === 'user' 
                      ? 'bg-neon-cyan/20 border border-neon-cyan/30' 
                      : 'glass-card'
                  }`}>
                    <p className="text-gray-200">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {message.type !== 'text' && (
                        <Badge variant="outline" className="text-xs">
                          {message.type}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="glass-card p-4 rounded-2xl">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Quick Actions */}
          <div className="px-6 py-4 border-t border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action.action)}
                  className="glass-card text-xs h-auto py-2 px-3 hover:border-neon-cyan"
                >
                  <div className="flex items-center space-x-1">
                    {action.icon}
                    <span>{action.label}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-6 border-t border-gray-700">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
                  placeholder="Ask me anything about fitness, nutrition, or workouts..."
                  className="glass-card pr-12"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={startListening}
                  disabled={isListening}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
                    isListening ? 'text-red-400 animate-pulse' : 'text-gray-400'
                  }`}
                >
                  {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
              </div>
              <Button 
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
                className="btn-neon-primary"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-xs text-gray-400 mt-2 text-center">
              💡 Try asking: "Create a workout plan", "Nutrition tips", "Exercise form help"
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}