"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Mic, MicOff, Volume2, VolumeX, Play, Pause, MessageSquare,
  Zap, Heart, Timer, Brain, Activity, Award, Target, Settings, 
  Headphones, User, Clock, TrendingUp, Calendar, Sparkles
} from "lucide-react"

interface VoiceCommand {
  command: string
  description: string
  category: 'workout' | 'navigation' | 'info' | 'control'
  action: () => void
}

interface VoiceSession {
  id: string
  timestamp: Date
  command: string
  response: string
  success: boolean
}

interface WorkoutState {
  isActive: boolean
  exercise: string
  reps: number
  sets: number
  duration: number
  heartRate: number
}

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [volume, setVolume] = useState([80])
  const [activeTab, setActiveTab] = useState("assistant")
  const [confidence, setConfidence] = useState(0)
  
  const [workoutState, setWorkoutState] = useState<WorkoutState>({
    isActive: false,
    exercise: 'Push-ups',
    reps: 0,
    sets: 0,
    duration: 0,
    heartRate: 120
  })

  const [voiceHistory, setVoiceHistory] = useState<VoiceSession[]>([
    {
      id: "1",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      command: "Start upper body workout",
      response: "Starting your upper body strength routine. Let's begin with push-ups!",
      success: true
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 3 * 60 * 1000),
      command: "Count rep",
      response: "That's rep number 10! You're doing great!",
      success: true
    }
  ])

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  const voiceCommands: VoiceCommand[] = [
    // Workout Control
    { command: "start workout", description: "Begin your scheduled workout", category: "workout", action: () => startWorkout() },
    { command: "pause workout", description: "Pause current workout session", category: "workout", action: () => pauseWorkout() },
    { command: "count rep", description: "Count a repetition", category: "workout", action: () => countRep() },
    { command: "next exercise", description: "Move to next exercise", category: "workout", action: () => nextExercise() },
    { command: "finish workout", description: "Complete current workout", category: "workout", action: () => finishWorkout() },
    
    // Information
    { command: "how am I doing", description: "Get performance summary", category: "info", action: () => getPerformanceSummary() },
    { command: "what's my heart rate", description: "Current heart rate reading", category: "info", action: () => getHeartRate() },
    { command: "time remaining", description: "Remaining workout time", category: "info", action: () => getTimeRemaining() },
    { command: "motivate me", description: "Get motivational message", category: "info", action: () => motivateUser() },
    
    // Navigation
    { command: "go to dashboard", description: "Navigate to main dashboard", category: "navigation", action: () => navigate('dashboard') },
    { command: "show analytics", description: "Open analytics dashboard", category: "navigation", action: () => navigate('analytics') },
    { command: "open nutrition", description: "Navigate to nutrition tracking", category: "navigation", action: () => navigate('nutrition') },
    
    // Control
    { command: "increase volume", description: "Make voice feedback louder", category: "control", action: () => adjustVolume(10) },
    { command: "decrease volume", description: "Make voice feedback quieter", category: "control", action: () => adjustVolume(-10) },
    { command: "stop listening", description: "Turn off voice recognition", category: "control", action: () => stopListening() }
  ]

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize Speech Recognition
      if ('webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.webkitSpeechRecognition
        recognitionRef.current = new SpeechRecognition()
        
        if (recognitionRef.current) {
          recognitionRef.current.continuous = true
          recognitionRef.current.interimResults = true
          recognitionRef.current.lang = 'en-US'
          
          recognitionRef.current.onresult = (event) => {
            const result = event.results[event.results.length - 1]
            if (result.isFinal) {
              const command = result[0].transcript.toLowerCase().trim()
              setConfidence(result[0].confidence * 100)
              processVoiceCommand(command)
            }
          }
          
          recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error:', event.error)
            setIsListening(false)
          }
          
          recognitionRef.current.onend = () => {
            if (isListening) {
              recognitionRef.current?.start() // Restart if still listening
            }
          }
        }
      }

      // Initialize Speech Synthesis
      if ('speechSynthesis' in window) {
        synthRef.current = window.speechSynthesis
      }
    }
  }, [isListening])

  const processVoiceCommand = useCallback((command: string) => {
    const matchedCommand = voiceCommands.find(cmd => 
      command.includes(cmd.command) || 
      cmd.command.split(' ').every(word => command.includes(word))
    )
    
    if (matchedCommand) {
      matchedCommand.action()
      const response = generateResponse(matchedCommand.command)
      
      // Add to history
      const newSession: VoiceSession = {
        id: Date.now().toString(),
        timestamp: new Date(),
        command: command,
        response: response,
        success: true
      }
      setVoiceHistory(prev => [...prev.slice(-9), newSession])
      
      if (voiceEnabled) {
        speak(response)
      }
    } else {
      const errorResponse = "I didn't understand that command. Try saying 'help' for available commands."
      speak(errorResponse)
      
      const errorSession: VoiceSession = {
        id: Date.now().toString(),
        timestamp: new Date(),
        command: command,
        response: errorResponse,
        success: false
      }
      setVoiceHistory(prev => [...prev.slice(-9), errorSession])
    }
  }, [voiceCommands, voiceEnabled])

  const speak = useCallback((text: string) => {
    if (!voiceEnabled || !synthRef.current) return
    
    // Cancel any ongoing speech
    synthRef.current.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.volume = volume[0] / 100
    utterance.rate = 0.9
    utterance.pitch = 1.0
    
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    
    synthRef.current.speak(utterance)
  }, [voiceEnabled, volume])

  const generateResponse = (command: string): string => {
    const responses: Record<string, string[]> = {
      "start workout": [
        "Let's crush this workout! Starting your session now.",
        "Time to get stronger! Your workout is beginning.",
        "Ready to sweat? Let's make it happen!"
      ],
      "count rep": [
        `Great rep! That's number ${workoutState.reps + 1}. Keep it up!`,
        `Perfect form! Rep ${workoutState.reps + 1} completed.`,
        `Excellent! That's ${workoutState.reps + 1} down. You're on fire!`
      ],
      "how am I doing": [
        `You've completed ${workoutState.reps} reps in ${workoutState.sets} sets. Your heart rate is ${workoutState.heartRate} BPM. Outstanding work!`,
        `Performance is looking great! ${workoutState.reps} reps completed with excellent form.`,
        `You're killing it! Heart rate at ${workoutState.heartRate}, perfect training zone.`
      ],
      "motivate me": [
        "You're stronger than you think! Every rep counts!",
        "Champions are made in moments like this. Keep pushing!",
        "Your only limit is you. Break through it!",
        "Pain is temporary, but results are forever!"
      ]
    }
    
    const commandResponses = responses[command]
    if (commandResponses) {
      return commandResponses[Math.floor(Math.random() * commandResponses.length)]
    }
    
    return "Command executed successfully!"
  }

  // Voice command actions
  const startWorkout = () => {
    setWorkoutState(prev => ({ ...prev, isActive: true, duration: 0 }))
  }

  const pauseWorkout = () => {
    setWorkoutState(prev => ({ ...prev, isActive: false }))
  }

  const countRep = () => {
    setWorkoutState(prev => ({ ...prev, reps: prev.reps + 1 }))
  }

  const nextExercise = () => {
    const exercises = ['Push-ups', 'Squats', 'Lunges', 'Plank', 'Burpees']
    const currentIndex = exercises.indexOf(workoutState.exercise)
    const nextIndex = (currentIndex + 1) % exercises.length
    setWorkoutState(prev => ({ 
      ...prev, 
      exercise: exercises[nextIndex],
      reps: 0,
      sets: prev.sets + 1
    }))
  }

  const finishWorkout = () => {
    setWorkoutState(prev => ({ ...prev, isActive: false }))
  }

  const getPerformanceSummary = () => {
    // Performance summary logic
  }

  const getHeartRate = () => {
    // Heart rate reading logic
  }

  const getTimeRemaining = () => {
    // Time calculation logic
  }

  const motivateUser = () => {
    // Motivation logic
  }

  const navigate = (section: string) => {
    // Navigation logic - would integrate with main app routing
    console.log(`Navigating to ${section}`)
  }

  const adjustVolume = (change: number) => {
    setVolume(prev => [Math.max(0, Math.min(100, prev[0] + change))])
  }

  const stopListening = () => {
    setIsListening(false)
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'workout': return <Activity className="h-4 w-4" />
      case 'navigation': return <Target className="h-4 w-4" />
      case 'info': return <Brain className="h-4 w-4" />
      case 'control': return <Settings className="h-4 w-4" />
      default: return <Sparkles className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'workout': return 'text-neon-cyan'
      case 'navigation': return 'text-neon-purple'
      case 'info': return 'text-neon-green'
      case 'control': return 'text-neon-orange'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 py-8 px-4 particles-bg">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-neon-gradient mb-4">Voice Assistant</h1>
          <p className="text-gray-300 text-lg">Hands-free fitness coaching with AI-powered voice control</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass-card">
            <TabsTrigger value="assistant">Voice Control</TabsTrigger>
            <TabsTrigger value="commands">Commands</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Voice Control Tab */}
          <TabsContent value="assistant" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Voice Interface */}
              <Card className="glass-card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-neon-cyan">
                    <Headphones className="h-6 w-6" />
                    <span>Voice Interface</span>
                  </CardTitle>
                  <CardDescription>Control your workout with voice commands</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Voice Status */}
                  <div className="text-center">
                    <div className={`relative mx-auto w-32 h-32 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                      isListening 
                        ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-2 border-red-500 animate-pulse' 
                        : 'bg-gradient-to-r from-gray-700/20 to-gray-600/20 border-2 border-gray-600'
                    }`}>
                      {isListening ? (
                        <Mic className="h-12 w-12 text-red-400" />
                      ) : (
                        <MicOff className="h-12 w-12 text-gray-400" />
                      )}
                      
                      {isListening && (
                        <div className="absolute inset-0 rounded-full border-4 border-red-500/50 animate-ping" />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className={`text-lg font-semibold ${isListening ? 'text-red-400' : 'text-gray-400'}`}>
                        {isListening ? 'Listening...' : 'Voice Inactive'}
                      </h3>
                      {confidence > 0 && (
                        <div className="space-y-1">
                          <div className="text-sm text-gray-400">Confidence: {Math.round(confidence)}%</div>
                          <Progress value={confidence} className="h-2" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Voice Controls */}
                  <div className="space-y-4">
                    <Button 
                      onClick={toggleListening}
                      className={`w-full py-3 ${isListening ? 'btn-neon-danger' : 'btn-neon-primary'}`}
                      size="lg"
                    >
                      {isListening ? (
                        <>
                          <MicOff className="h-5 w-5 mr-2" />
                          Stop Listening
                        </>
                      ) : (
                        <>
                          <Mic className="h-5 w-5 mr-2" />
                          Start Listening
                        </>
                      )}
                    </Button>

                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="glass-card">
                        <Volume2 className="h-4 w-4 mr-2" />
                        Test Voice
                      </Button>
                      <Button variant="outline" className="glass-card">
                        <Settings className="h-4 w-4 mr-2" />
                        Calibrate
                      </Button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-neon-purple">Quick Voice Commands</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {['Start workout', 'Count rep', 'How am I doing', 'Motivate me'].map((command) => (
                        <Button 
                          key={command}
                          variant="outline" 
                          size="sm" 
                          className="glass-card text-left justify-start"
                          onClick={() => processVoiceCommand(command.toLowerCase())}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          "{command}"
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Workout Status */}
              <Card className="glass-card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-neon-green">
                    <Activity className="h-6 w-6" />
                    <span>Workout Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Current Exercise */}
                    <div className="text-center p-6 glass-card rounded-xl">
                      <div className="text-2xl font-bold text-neon-cyan mb-2">{workoutState.exercise}</div>
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                        workoutState.isActive 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${workoutState.isActive ? 'bg-green-400' : 'bg-gray-400'}`} />
                        {workoutState.isActive ? 'Active' : 'Paused'}
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 glass-card rounded-xl">
                        <div className="text-2xl font-bold text-neon-purple">{workoutState.reps}</div>
                        <div className="text-sm text-gray-400">Reps</div>
                      </div>
                      <div className="text-center p-4 glass-card rounded-xl">
                        <div className="text-2xl font-bold text-neon-orange">{workoutState.sets}</div>
                        <div className="text-sm text-gray-400">Sets</div>
                      </div>
                      <div className="text-center p-4 glass-card rounded-xl">
                        <div className="text-2xl font-bold text-neon-red">{workoutState.heartRate}</div>
                        <div className="text-sm text-gray-400">HR (BPM)</div>
                      </div>
                      <div className="text-center p-4 glass-card rounded-xl">
                        <div className="text-2xl font-bold text-neon-green">
                          {Math.floor(workoutState.duration / 60)}:{(workoutState.duration % 60).toString().padStart(2, '0')}
                        </div>
                        <div className="text-sm text-gray-400">Duration</div>
                      </div>
                    </div>

                    {/* Voice Feedback Status */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Voice Feedback</Label>
                        <Switch checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
                      </div>
                      <div>
                        <Label>Voice Volume: {volume[0]}%</Label>
                        <Slider value={volume} onValueChange={setVolume} max={100} className="mt-2" />
                      </div>
                      {isSpeaking && (
                        <div className="flex items-center space-x-2 text-neon-cyan">
                          <Volume2 className="h-4 w-4 animate-pulse" />
                          <span className="text-sm">Speaking...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Commands Tab */}
          <TabsContent value="commands" className="space-y-6">
            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle className="text-neon-purple">Available Voice Commands</CardTitle>
                <CardDescription>Say any of these commands to control your workout</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['workout', 'info', 'navigation', 'control'].map((category) => (
                    <div key={category} className="space-y-3">
                      <h3 className={`font-semibold capitalize ${getCategoryColor(category)}`}>
                        {category} Commands
                      </h3>
                      <div className="space-y-2">
                        {voiceCommands.filter(cmd => cmd.category === category).map((cmd) => (
                          <div key={cmd.command} className="glass-card p-3 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className={getCategoryColor(cmd.category)}>
                                {getCategoryIcon(cmd.category)}
                              </div>
                              <div>
                                <div className="font-medium text-neon-cyan">"{cmd.command}"</div>
                                <div className="text-sm text-gray-400">{cmd.description}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle className="text-neon-orange">Voice Command History</CardTitle>
                <CardDescription>Recent voice interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {voiceHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3 opacity-50" />
                      <p className="text-gray-400">No voice commands yet</p>
                    </div>
                  ) : (
                    voiceHistory.slice().reverse().map((session) => (
                      <div key={session.id} className={`p-4 rounded-lg glass-card border-l-4 ${
                        session.success ? 'border-green-500' : 'border-red-500'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge className={session.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                              {session.success ? 'Success' : 'Failed'}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              {session.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium text-neon-cyan">Command: </span>
                            <span className="text-sm text-gray-300">"{session.command}"</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-neon-purple">Response: </span>
                            <span className="text-sm text-gray-300">{session.response}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card-hover">
                <CardHeader>
                  <CardTitle className="text-neon-red">Voice Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Voice Recognition</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Voice Feedback</Label>
                    <Switch checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Continuous Listening</Label>
                    <Switch defaultChecked />
                  </div>
                  <div>
                    <Label>Speech Rate</Label>
                    <Slider defaultValue={[90]} max={150} min={50} className="mt-2" />
                  </div>
                  <div>
                    <Label>Sensitivity</Label>
                    <Slider defaultValue={[75]} max={100} className="mt-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card-hover">
                <CardHeader>
                  <CardTitle className="text-neon-yellow">Language & Accessibility</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Language: English (US)</Label>
                    <Button variant="outline" size="sm" className="glass-card">Change</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>High Contrast Mode</Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Large Text</Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Reduce Motion</Label>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}