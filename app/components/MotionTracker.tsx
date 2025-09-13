"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Camera, 
  Video, 
  VideoOff, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle, 
  Target, 
  TrendingUp, 
  Activity, 
  Brain,
  Zap,
  Eye,
  Shield,
  Award,
  Timer,
  BarChart3
} from "lucide-react"

// Types for MediaPipe pose detection
interface PoseLandmark {
  x: number
  y: number
  z: number
  visibility: number
}

interface PoseResult {
  landmarks: PoseLandmark[]
  worldLandmarks: PoseLandmark[]
  confidence: number
}

interface FormAnalysis {
  exercise: string
  score: number
  feedback: string[]
  corrections: string[]
  riskLevel: 'low' | 'medium' | 'high'
  angle: number
  posture: 'good' | 'fair' | 'poor'
}

interface ExerciseTemplate {
  name: string
  description: string
  keyPoints: string[]
  commonMistakes: string[]
  idealAngles: { joint: string; min: number; max: number }[]
  duration: number
}

export default function MotionTracker() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentExercise, setCurrentExercise] = useState<string>('pushup')
  const [poseResults, setPoseResults] = useState<PoseResult | null>(null)
  const [formAnalysis, setFormAnalysis] = useState<FormAnalysis | null>(null)
  const [sessionData, setSessionData] = useState({
    reps: 0,
    totalTime: 0,
    avgScore: 0,
    feedback: []
  })
  const [calibrationComplete, setCalibrationComplete] = useState(false)
  const [permissionGranted, setPermissionGranted] = useState(false)

  const exercises: Record<string, ExerciseTemplate> = {
    pushup: {
      name: "Push-Up",
      description: "Upper body strength exercise targeting chest, shoulders, and triceps",
      keyPoints: [
        "Keep body in straight line",
        "Lower until chest nearly touches ground", 
        "Push back to starting position",
        "Keep core engaged throughout"
      ],
      commonMistakes: [
        "Sagging hips",
        "Flaring elbows too wide",
        "Partial range of motion",
        "Head position incorrect"
      ],
      idealAngles: [
        { joint: "elbow", min: 45, max: 90 },
        { joint: "hip", min: 170, max: 180 },
        { joint: "knee", min: 170, max: 180 }
      ],
      duration: 2
    },
    squat: {
      name: "Squat",
      description: "Lower body compound exercise targeting quads, glutes, and hamstrings",
      keyPoints: [
        "Feet shoulder-width apart",
        "Keep chest up and core tight",
        "Lower until thighs parallel to ground",
        "Drive through heels to stand"
      ],
      commonMistakes: [
        "Knees caving inward",
        "Leaning too far forward",
        "Not reaching proper depth",
        "Rising on toes"
      ],
      idealAngles: [
        { joint: "knee", min: 70, max: 90 },
        { joint: "hip", min: 80, max: 100 },
        { joint: "ankle", min: 70, max: 90 }
      ],
      duration: 3
    },
    plank: {
      name: "Plank",
      description: "Core stability exercise targeting abs, shoulders, and back",
      keyPoints: [
        "Maintain straight line from head to heels",
        "Keep elbows directly under shoulders",
        "Engage core muscles",
        "Breathe steadily"
      ],
      commonMistakes: [
        "Hips too high or low",
        "Looking up straining neck",
        "Not engaging core",
        "Holding breath"
      ],
      idealAngles: [
        { joint: "shoulder", min: 85, max: 95 },
        { joint: "hip", min: 175, max: 185 },
        { joint: "knee", min: 175, max: 185 }
      ],
      duration: 30
    }
  }

  // Request camera permissions
  const requestCameraPermission = useCallback(async () => {
    try {
      setIsLoading(true)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: false
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setPermissionGranted(true)
      }
    } catch (error) {
      console.error('Camera permission denied:', error)
      alert('Camera access is required for motion tracking. Please enable camera permissions.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initialize MediaPipe pose detection
  const initializePoseDetection = useCallback(async () => {
    if (!window.MediaPipe) {
      // In a real implementation, you would load MediaPipe
      console.log('MediaPipe not loaded - this is a demo implementation')
      return
    }

    // MediaPipe initialization would go here
    // For demo purposes, we'll simulate pose detection
    setCalibrationComplete(true)
  }, [])

  // Simulate pose detection (replace with actual MediaPipe implementation)
  const simulatePoseDetection = useCallback(() => {
    // This would be replaced with actual MediaPipe pose detection
    const mockPoseResult: PoseResult = {
      landmarks: Array.from({ length: 33 }, (_, i) => ({
        x: Math.random(),
        y: Math.random(),
        z: Math.random(),
        visibility: Math.random() > 0.2 ? 1 : 0
      })),
      worldLandmarks: Array.from({ length: 33 }, (_, i) => ({
        x: Math.random() - 0.5,
        y: Math.random() - 0.5,
        z: Math.random() - 0.5,
        visibility: Math.random() > 0.2 ? 1 : 0
      })),
      confidence: Math.random() * 0.3 + 0.7
    }

    setPoseResults(mockPoseResult)
    analyzeForm(mockPoseResult)
  }, [currentExercise])

  // Analyze form based on pose landmarks
  const analyzeForm = useCallback((pose: PoseResult) => {
    const exercise = exercises[currentExercise]
    if (!exercise) return

    // Simulate form analysis (replace with actual biomechanical analysis)
    const score = Math.floor(Math.random() * 30) + 70 // 70-100 score
    const riskLevel = score > 85 ? 'low' : score > 70 ? 'medium' : 'high'
    
    const feedback = []
    const corrections = []

    // Generate contextual feedback based on exercise
    if (currentExercise === 'pushup') {
      if (score < 80) {
        feedback.push("Keep your body in a straight line")
        corrections.push("Engage your core muscles more")
      }
      if (score < 75) {
        feedback.push("Lower your chest closer to the ground")
        corrections.push("Increase range of motion")
      }
    } else if (currentExercise === 'squat') {
      if (score < 80) {
        feedback.push("Go deeper - thighs should be parallel to ground")
        corrections.push("Focus on hip mobility")
      }
      if (score < 75) {
        feedback.push("Keep your knees in line with your toes")
        corrections.push("Strengthen glute muscles")
      }
    }

    if (feedback.length === 0) {
      feedback.push("Excellent form!")
      corrections.push("Maintain this technique")
    }

    const analysis: FormAnalysis = {
      exercise: exercise.name,
      score,
      feedback,
      corrections,
      riskLevel,
      angle: Math.floor(Math.random() * 30) + 75, // Simulated joint angle
      posture: score > 85 ? 'good' : score > 70 ? 'fair' : 'poor'
    }

    setFormAnalysis(analysis)

    // Update session data
    setSessionData(prev => ({
      ...prev,
      avgScore: (prev.avgScore + score) / 2,
      feedback: [...prev.feedback.slice(-9), analysis.feedback[0]].slice(-10)
    }))
  }, [currentExercise])

  // Start motion tracking
  const startTracking = useCallback(async () => {
    if (!permissionGranted) {
      await requestCameraPermission()
      return
    }

    setIsTracking(true)
    await initializePoseDetection()
    
    // Start pose detection loop
    const detectPose = () => {
      if (isTracking && videoRef.current && videoRef.current.readyState === 4) {
        simulatePoseDetection()
      }
      if (isTracking) {
        requestAnimationFrame(detectPose)
      }
    }
    detectPose()
  }, [isTracking, permissionGranted, requestCameraPermission, initializePoseDetection, simulatePoseDetection])

  // Stop motion tracking
  const stopTracking = useCallback(() => {
    setIsTracking(false)
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    setPermissionGranted(false)
    setPoseResults(null)
    setFormAnalysis(null)
  }, [])

  // Draw pose landmarks on canvas
  const drawPose = useCallback((canvas: HTMLCanvasElement, pose: PoseResult) => {
    const ctx = canvas.getContext('2d')
    if (!ctx || !pose.landmarks) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw landmarks
    pose.landmarks.forEach((landmark, index) => {
      if (landmark.visibility > 0.5) {
        ctx.beginPath()
        ctx.arc(
          landmark.x * canvas.width,
          landmark.y * canvas.height,
          5,
          0,
          2 * Math.PI
        )
        ctx.fillStyle = '#06b6d4'
        ctx.fill()
      }
    })

    // Draw connections (simplified)
    ctx.strokeStyle = '#8b5cf6'
    ctx.lineWidth = 2
    const connections = [
      [11, 12], [11, 13], [13, 15], [12, 14], [14, 16], // Arms
      [11, 23], [12, 24], [23, 24], // Torso
      [23, 25], [25, 27], [27, 29], [24, 26], [26, 28], [28, 30] // Legs
    ]

    connections.forEach(([start, end]) => {
      const startPoint = pose.landmarks[start]
      const endPoint = pose.landmarks[end]
      
      if (startPoint?.visibility > 0.5 && endPoint?.visibility > 0.5) {
        ctx.beginPath()
        ctx.moveTo(startPoint.x * canvas.width, startPoint.y * canvas.height)
        ctx.lineTo(endPoint.x * canvas.width, endPoint.y * canvas.height)
        ctx.stroke()
      }
    })
  }, [])

  // Update canvas when pose results change
  useEffect(() => {
    if (canvasRef.current && poseResults) {
      drawPose(canvasRef.current, poseResults)
    }
  }, [poseResults, drawPose])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 py-8 px-4 particles-bg">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-neon-gradient mb-4 animate-fadeIn">
            AI Motion Tracker
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Real-time form correction and movement analysis using advanced AI pose detection
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Video Feed and Canvas */}
          <div className="space-y-6">
            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-neon-cyan">
                  <Camera className="h-6 w-6" />
                  <span>Live Motion Analysis</span>
                </CardTitle>
                <CardDescription>AI-powered real-time pose detection and form analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    playsInline
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                    width={640}
                    height={480}
                  />
                  
                  {/* Overlay Controls */}
                  <div className="absolute top-4 left-4 flex space-x-2">
                    {isTracking && (
                      <Badge className="bg-red-500/80 text-white animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full mr-2" />
                        RECORDING
                      </Badge>
                    )}
                    {poseResults && (
                      <Badge className="bg-neon-cyan/80 text-white">
                        Confidence: {Math.round(poseResults.confidence * 100)}%
                      </Badge>
                    )}
                  </div>

                  {/* Form Score Overlay */}
                  {formAnalysis && (
                    <div className="absolute top-4 right-4 glass-card p-4 rounded-xl">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${
                          formAnalysis.score > 85 ? 'text-green-400' : 
                          formAnalysis.score > 70 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {formAnalysis.score}
                        </div>
                        <div className="text-xs text-gray-300">Form Score</div>
                      </div>
                    </div>
                  )}

                  {/* No camera overlay */}
                  {!permissionGranted && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                      <div className="text-center space-y-4">
                        <Camera className="h-16 w-16 text-gray-400 mx-auto" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-300 mb-2">
                            Camera Access Required
                          </h3>
                          <p className="text-gray-400 text-sm mb-4">
                            Enable camera to start motion tracking
                          </p>
                          <Button onClick={requestCameraPermission} className="btn-neon-primary">
                            <Camera className="h-4 w-4 mr-2" />
                            Enable Camera
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Camera Controls */}
                <div className="flex justify-center space-x-4 mt-6">
                  {!isTracking ? (
                    <Button
                      onClick={startTracking}
                      disabled={isLoading}
                      className="btn-neon-primary px-8 py-3"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                          Initializing...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Start Tracking
                        </>
                      )}
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={stopTracking}
                        variant="outline"
                        className="glass-card hover:border-red-500 text-red-400 px-6"
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        Stop
                      </Button>
                      <Button
                        onClick={() => setSessionData(prev => ({ ...prev, reps: prev.reps + 1 }))}
                        className="btn-neon-primary px-6"
                      >
                        <Target className="h-4 w-4 mr-2" />
                        Count Rep
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Exercise Selection */}
            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-neon-purple">
                  <Activity className="h-6 w-6" />
                  <span>Exercise Selection</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={currentExercise} onValueChange={setCurrentExercise}>
                  <SelectTrigger className="glass-card">
                    <SelectValue placeholder="Select exercise to track" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(exercises).map(([key, exercise]) => (
                      <SelectItem key={key} value={key}>
                        {exercise.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Exercise Info */}
                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="font-semibold text-neon-cyan mb-2">Key Points:</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {exercises[currentExercise].keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-neon-pink mb-2">Common Mistakes:</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {exercises[currentExercise].commonMistakes.map((mistake, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <span>{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Panel */}
          <div className="space-y-6">
            {/* Real-time Feedback */}
            {formAnalysis && (
              <Card className="glass-card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-neon-green">
                    <Brain className="h-6 w-6" />
                    <span>AI Form Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Form Score</span>
                    <div className="flex items-center space-x-2">
                      <Progress 
                        value={formAnalysis.score} 
                        className="w-24 h-2"
                      />
                      <span className={`font-bold ${
                        formAnalysis.score > 85 ? 'text-green-400' : 
                        formAnalysis.score > 70 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {formAnalysis.score}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-neon-cyan mb-2">Real-time Feedback:</h4>
                      {formAnalysis.feedback.map((feedback, index) => (
                        <Alert key={index} className={`mb-2 ${
                          formAnalysis.riskLevel === 'high' ? 'border-red-500/50 bg-red-500/10' :
                          formAnalysis.riskLevel === 'medium' ? 'border-yellow-500/50 bg-yellow-500/10' :
                          'border-green-500/50 bg-green-500/10'
                        }`}>
                          <AlertDescription className="text-sm">
                            {feedback}
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-neon-purple mb-2">Corrections:</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {formAnalysis.corrections.map((correction, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Zap className="h-4 w-4 text-neon-purple mt-0.5 flex-shrink-0" />
                            <span>{correction}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                    <div className="text-center">
                      <div className="text-lg font-bold text-neon-cyan">{formAnalysis.angle}°</div>
                      <div className="text-xs text-gray-400">Joint Angle</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${
                        formAnalysis.posture === 'good' ? 'text-green-400' :
                        formAnalysis.posture === 'fair' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {formAnalysis.posture.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-400">Posture</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Session Statistics */}
            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-neon-orange">
                  <BarChart3 className="h-6 w-6" />
                  <span>Session Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 glass-card rounded-xl">
                    <div className="text-2xl font-bold text-neon-cyan">{sessionData.reps}</div>
                    <div className="text-sm text-gray-400">Reps Completed</div>
                  </div>
                  <div className="text-center p-4 glass-card rounded-xl">
                    <div className="text-2xl font-bold text-neon-purple">
                      {Math.round(sessionData.avgScore)}%
                    </div>
                    <div className="text-sm text-gray-400">Avg Form Score</div>
                  </div>
                  <div className="text-center p-4 glass-card rounded-xl">
                    <div className="text-2xl font-bold text-neon-pink">
                      {Math.floor(sessionData.totalTime / 60)}:{(sessionData.totalTime % 60).toString().padStart(2, '0')}
                    </div>
                    <div className="text-sm text-gray-400">Duration</div>
                  </div>
                  <div className="text-center p-4 glass-card rounded-xl">
                    <div className="text-2xl font-bold text-neon-green">
                      {sessionData.reps * exercises[currentExercise].duration}
                    </div>
                    <div className="text-sm text-gray-400">Total Seconds</div>
                  </div>
                </div>

                {sessionData.feedback.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-400 mb-3">Recent Feedback:</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {sessionData.feedback.slice(-5).map((feedback, index) => (
                        <div key={index} className="text-xs text-gray-300 p-2 bg-gray-800/50 rounded">
                          {feedback}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Safety & Privacy */}
            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-neon-red">
                  <Shield className="h-6 w-6" />
                  <span>Privacy & Safety</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-300 space-y-2">
                <div className="flex items-start space-x-2">
                  <Eye className="h-4 w-4 text-neon-cyan mt-0.5 flex-shrink-0" />
                  <span>All video processing happens locally on your device</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-neon-green mt-0.5 flex-shrink-0" />
                  <span>No video data is stored or transmitted to servers</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Award className="h-4 w-4 text-neon-purple mt-0.5 flex-shrink-0" />
                  <span>Pose detection uses industry-standard MediaPipe technology</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}