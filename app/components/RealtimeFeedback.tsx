"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Mic, MicOff, Volume2, VolumeX, Play, Pause, MessageSquare,
  Zap, Heart, Timer, Brain, Activity, Award, Target, Settings, Headphones
} from "lucide-react"

interface FeedbackMessage {
  id: string
  type: 'motivation' | 'correction' | 'achievement' | 'warning'
  message: string
  timestamp: Date
  shouldSpeak: boolean
}

interface WorkoutSession {
  exercise: string
  reps: number
  formScore: number
  heartRate: number
  calories: number
  duration: number
}

export default function RealtimeFeedback() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [volume, setVolume] = useState([80])
  
  const [session, setSession] = useState<WorkoutSession>({
    exercise: 'Push-ups',
    reps: 0,
    formScore: 85,
    heartRate: 120,
    calories: 45,
    duration: 0
  })

  const [feedbackMessages, setFeedbackMessages] = useState<FeedbackMessage[]>([])
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const voiceCommands = [
    { command: "start workout", action: () => startWorkout() },
    { command: "count rep", action: () => countRep() },
    { command: "motivate me", action: () => provideMotivation() },
    { command: "how am I doing", action: () => provideSummary() }
  ]

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = false
        
        recognitionRef.current.onresult = (event) => {
          const command = event.results[event.results.length - 1][0].transcript.toLowerCase()
          processVoiceCommand(command)
        }
        
        recognitionRef.current.onerror = () => setIsListening(false)
      }
    }
  }, [])

  const processVoiceCommand = useCallback((command: string) => {
    const matchedCommand = voiceCommands.find(cmd => command.includes(cmd.command))
    if (matchedCommand) {
      matchedCommand.action()
      addFeedbackMessage({
        type: 'achievement',
        message: `Command: "${matchedCommand.command}" executed`,
        shouldSpeak: false
      })
    }
  }, [])

  const speak = useCallback((text: string) => {
    if (!voiceEnabled) return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.volume = volume[0] / 100
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    speechSynthesis.speak(utterance)
  }, [voiceEnabled, volume])

  const addFeedbackMessage = useCallback((message: Omit<FeedbackMessage, 'id' | 'timestamp'>) => {
    const newMessage: FeedbackMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    }
    setFeedbackMessages(prev => [...prev.slice(-9), newMessage])
    if (message.shouldSpeak) speak(message.message)
  }, [speak])

  const startWorkout = () => {
    setSession(prev => ({ ...prev, duration: 1 }))
    addFeedbackMessage({
      type: 'motivation',
      message: "Let's crush this workout! You've got this!",
      shouldSpeak: true
    })
  }

  const countRep = () => {
    setSession(prev => ({ ...prev, reps: prev.reps + 1 }))
    if (session.reps % 5 === 4) {
      addFeedbackMessage({
        type: 'motivation',
        message: "Great work! Keep it up!",
        shouldSpeak: true
      })
    }
  }

  const provideMotivation = () => {
    const messages = [
      "You're stronger than you think!",
      "Push through the challenge!",
      "Every rep counts!"
    ]
    addFeedbackMessage({
      type: 'motivation',
      message: messages[Math.floor(Math.random() * messages.length)],
      shouldSpeak: true
    })
  }

  const provideSummary = () => {
    addFeedbackMessage({
      type: 'achievement',
      message: `${session.reps} reps completed with ${session.formScore}% form score!`,
      shouldSpeak: true
    })
  }

  const toggleListening = () => {
    if (!recognitionRef.current) return
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 py-8 px-4 particles-bg">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-neon-gradient mb-4">AI Voice Coach</h1>
          <p className="text-gray-300 text-lg">Real-time feedback with voice control</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Voice Control */}
          <Card className="glass-card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-neon-cyan">
                <Headphones className="h-6 w-6" />
                <span>Voice Control</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Voice Status */}
              <div className="flex items-center justify-between p-4 glass-card rounded-xl">
                <div className="flex items-center space-x-2">
                  {isListening ? (
                    <>
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <Mic className="h-5 w-5 text-red-400" />
                      <span className="text-red-400">Listening...</span>
                    </>
                  ) : (
                    <>
                      <MicOff className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-400">Voice Off</span>
                    </>
                  )}
                </div>
                <Button onClick={toggleListening} className="btn-neon-primary">
                  {isListening ? 'Stop' : 'Start'} Listening
                </Button>
              </div>

              {/* Voice Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Voice Feedback</Label>
                  <Switch checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
                </div>
                <div>
                  <Label>Volume: {volume[0]}%</Label>
                  <Slider value={volume} onValueChange={setVolume} max={100} className="mt-2" />
                </div>
              </div>

              {/* Commands */}
              <div className="space-y-2">
                <h3 className="font-semibold text-neon-purple">Voice Commands</h3>
                {voiceCommands.map((cmd, i) => (
                  <div key={i} className="glass-card p-3 rounded-lg text-sm">
                    <span className="text-neon-cyan">"{cmd.command}"</span>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={startWorkout} className="btn-neon-primary">
                  <Play className="h-4 w-4 mr-2" />Start
                </Button>
                <Button onClick={countRep} variant="outline" className="glass-card">
                  <Target className="h-4 w-4 mr-2" />Count Rep
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Live Metrics */}
          <Card className="glass-card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-neon-green">
                <Activity className="h-6 w-6" />
                <span>Live Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 glass-card rounded-xl">
                  <div className="text-3xl font-bold text-neon-cyan">{session.reps}</div>
                  <div className="text-sm text-gray-400">Reps</div>
                </div>
                <div className="text-center p-4 glass-card rounded-xl">
                  <div className="text-3xl font-bold text-neon-purple">{session.formScore}%</div>
                  <div className="text-sm text-gray-400">Form Score</div>
                </div>
                <div className="text-center p-4 glass-card rounded-xl">
                  <div className="text-3xl font-bold text-neon-pink">{session.heartRate}</div>
                  <div className="text-sm text-gray-400">Heart Rate</div>
                </div>
                <div className="text-center p-4 glass-card rounded-xl">
                  <div className="text-3xl font-bold text-neon-green">{session.calories}</div>
                  <div className="text-sm text-gray-400">Calories</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Form Quality</span>
                    <span className={session.formScore > 85 ? 'text-green-400' : 'text-yellow-400'}>
                      {session.formScore > 85 ? 'Excellent' : 'Good'}
                    </span>
                  </div>
                  <Progress value={session.formScore} className="h-3" />
                </div>

                <div className="text-center p-4 bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 rounded-xl">
                  <div className="text-2xl font-bold text-neon-gradient">
                    {Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-400">Duration</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Stream */}
        <Card className="glass-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-neon-orange">
              <Brain className="h-6 w-6" />
              <span>AI Feedback Stream</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {feedbackMessages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3 opacity-50" />
                  <p className="text-gray-400">Start workout to receive AI feedback</p>
                </div>
              ) : (
                feedbackMessages.slice().reverse().map((message) => (
                  <div key={message.id} className={`p-3 rounded-lg glass-card ${
                    message.type === 'motivation' ? 'border-l-4 border-neon-cyan' :
                    message.type === 'achievement' ? 'border-l-4 border-neon-green' :
                    'border-l-4 border-neon-purple'
                  }`}>
                    <div className="flex items-start space-x-2">
                      {message.type === 'motivation' && <Zap className="h-4 w-4 text-neon-cyan mt-1" />}
                      {message.type === 'achievement' && <Award className="h-4 w-4 text-neon-green mt-1" />}
                      <div>
                        <p className="text-gray-200 text-sm">{message.message}</p>
                        <span className="text-xs text-gray-400">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}