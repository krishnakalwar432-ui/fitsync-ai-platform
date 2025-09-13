"use client"

import { useState, useEffect, useRef } from "react"
import { 
  Play, 
  Pause, 
  Square,
  RotateCcw,
  Timer,
  Zap,
  TrendingUp,
  Target,
  Activity,
  Heart,
  Flame,
  Clock,
  Dumbbell,
  Plus,
  Minus,
  Check,
  X,
  BarChart3,
  Calendar,
  Medal,
  Save,
  Share2,
  Camera,
  Volume2,
  VolumeX
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Exercise {
  id: string
  name: string
  sets: number
  reps: number
  weight?: number
  duration?: number
  restTime: number
  completed: boolean
  personalRecord?: boolean
  targetMuscle: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  caloriesPerRep?: number
}

interface WorkoutSession {
  id: string
  name: string
  exercises: Exercise[]
  totalDuration: number
  estimatedCalories: number
  difficulty: string
  category: string
  startTime?: Date
  endTime?: Date
}

interface WorkoutStats {
  currentSet: number
  currentRep: number
  totalSets: number
  completedSets: number
  totalReps: number
  completedReps: number
  caloriesBurned: number
  averageHeartRate?: number
  peakHeartRate?: number
  restTimeRemaining: number
  workoutProgress: number
}

export default function WorkoutTracker() {
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutSession | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [time, setTime] = useState(0)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [workoutStats, setWorkoutStats] = useState<WorkoutStats>({
    currentSet: 1,
    currentRep: 0,
    totalSets: 0,
    completedSets: 0,
    totalReps: 0,
    completedReps: 0,
    caloriesBurned: 0,
    restTimeRemaining: 0,
    workoutProgress: 0
  })
  const [restTimer, setRestTimer] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [exerciseNotes, setExerciseNotes] = useState<Record<string, string>>({})
  const [heartRate, setHeartRate] = useState(120)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [selectedWorkout, setSelectedWorkout] = useState<string>("")

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const restIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Sample workout templates
  const workoutTemplates: WorkoutSession[] = [
    {
      id: "upper_body_strength",
      name: "Upper Body Strength",
      category: "Strength Training",
      difficulty: "Intermediate",
      totalDuration: 45,
      estimatedCalories: 350,
      exercises: [
        {
          id: "pushups",
          name: "Push-ups",
          sets: 3,
          reps: 12,
          restTime: 60,
          completed: false,
          targetMuscle: "Chest",
          difficulty: "beginner",
          caloriesPerRep: 0.5
        },
        {
          id: "pullups",
          name: "Pull-ups",
          sets: 3,
          reps: 8,
          restTime: 90,
          completed: false,
          targetMuscle: "Back",
          difficulty: "intermediate",
          caloriesPerRep: 0.8
        },
        {
          id: "shoulder_press",
          name: "Shoulder Press",
          sets: 3,
          reps: 10,
          weight: 20,
          restTime: 75,
          completed: false,
          targetMuscle: "Shoulders",
          difficulty: "intermediate",
          caloriesPerRep: 0.6
        },
        {
          id: "bicep_curls",
          name: "Bicep Curls",
          sets: 3,
          reps: 15,
          weight: 10,
          restTime: 45,
          completed: false,
          targetMuscle: "Arms",
          difficulty: "beginner",
          caloriesPerRep: 0.3
        }
      ]
    },
    {
      id: "cardio_hiit",
      name: "HIIT Cardio Blast",
      category: "Cardio",
      difficulty: "Advanced",
      totalDuration: 20,
      estimatedCalories: 280,
      exercises: [
        {
          id: "burpees",
          name: "Burpees",
          sets: 4,
          reps: 10,
          restTime: 30,
          completed: false,
          targetMuscle: "Full Body",
          difficulty: "advanced",
          caloriesPerRep: 1.2
        },
        {
          id: "mountain_climbers",
          name: "Mountain Climbers",
          sets: 4,
          reps: 20,
          restTime: 30,
          completed: false,
          targetMuscle: "Core",
          difficulty: "intermediate",
          caloriesPerRep: 0.4
        },
        {
          id: "jump_squats",
          name: "Jump Squats",
          sets: 4,
          reps: 15,
          restTime: 45,
          completed: false,
          targetMuscle: "Legs",
          difficulty: "intermediate",
          caloriesPerRep: 0.7
        }
      ]
    }
  ]

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTime(time => time + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, isPaused])

  useEffect(() => {
    if (isResting && restTimer > 0) {
      restIntervalRef.current = setInterval(() => {
        setRestTimer(timer => {
          if (timer <= 1) {
            setIsResting(false)
            if (soundEnabled) {
              // Play sound notification
              const audio = new Audio('/sounds/rest-complete.mp3')
              audio.play().catch(() => {}) // Graceful failure
            }
            return 0
          }
          return timer - 1
        })
      }, 1000)
    } else {
      if (restIntervalRef.current) {
        clearInterval(restIntervalRef.current)
      }
    }

    return () => {
      if (restIntervalRef.current) {
        clearInterval(restIntervalRef.current)
      }
    }
  }, [isResting, restTimer, soundEnabled])

  // Simulate heart rate updates
  useEffect(() => {
    if (isActive && !isPaused && !isResting) {
      const heartRateInterval = setInterval(() => {
        setHeartRate(prev => {
          const variation = Math.random() * 20 - 10
          return Math.max(100, Math.min(180, prev + variation))
        })
      }, 5000)

      return () => clearInterval(heartRateInterval)
    }
  }, [isActive, isPaused, isResting])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startWorkout = (workout: WorkoutSession) => {
    setCurrentWorkout({
      ...workout,
      startTime: new Date()
    })
    setIsActive(true)
    setIsPaused(false)
    setTime(0)
    setCurrentExerciseIndex(0)
    
    // Calculate total stats
    const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets, 0)
    const totalReps = workout.exercises.reduce((sum, ex) => sum + (ex.sets * ex.reps), 0)
    
    setWorkoutStats({
      currentSet: 1,
      currentRep: 0,
      totalSets,
      completedSets: 0,
      totalReps,
      completedReps: 0,
      caloriesBurned: 0,
      restTimeRemaining: 0,
      workoutProgress: 0
    })
  }

  const pauseWorkout = () => {
    setIsPaused(!isPaused)
  }

  const stopWorkout = () => {
    if (currentWorkout) {
      setCurrentWorkout({
        ...currentWorkout,
        endTime: new Date()
      })
    }
    setIsActive(false)
    setIsPaused(false)
    setIsResting(false)
    setTime(0)
    setRestTimer(0)
  }

  const completeSet = () => {
    if (!currentWorkout) return

    const currentExercise = currentWorkout.exercises[currentExerciseIndex]
    const calories = (currentExercise.caloriesPerRep || 0.5) * currentExercise.reps
    
    setWorkoutStats(prev => ({
      ...prev,
      completedSets: prev.completedSets + 1,
      completedReps: prev.completedReps + currentExercise.reps,
      caloriesBurned: prev.caloriesBurned + calories,
      currentSet: prev.currentSet + 1,
      workoutProgress: ((prev.completedSets + 1) / prev.totalSets) * 100
    }))

    // Start rest timer
    setRestTimer(currentExercise.restTime)
    setIsResting(true)
  }

  const skipRest = () => {
    setIsResting(false)
    setRestTimer(0)
  }

  const nextExercise = () => {
    if (currentExerciseIndex < (currentWorkout?.exercises.length || 0) - 1) {
      setCurrentExerciseIndex(prev => prev + 1)
      setWorkoutStats(prev => ({ ...prev, currentSet: 1 }))
    } else {
      // Workout complete
      stopWorkout()
    }
  }

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1)
      setWorkoutStats(prev => ({ ...prev, currentSet: 1 }))
    }
  }

  const updateExerciseWeight = (exerciseId: string, newWeight: number) => {
    if (!currentWorkout) return
    
    setCurrentWorkout({
      ...currentWorkout,
      exercises: currentWorkout.exercises.map(ex =>
        ex.id === exerciseId ? { ...ex, weight: newWeight } : ex
      )
    })
  }

  const updateExerciseReps = (exerciseId: string, newReps: number) => {
    if (!currentWorkout) return
    
    setCurrentWorkout({
      ...currentWorkout,
      exercises: currentWorkout.exercises.map(ex =>
        ex.id === exerciseId ? { ...ex, reps: newReps } : ex
      )
    })
  }

  if (!currentWorkout) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Dumbbell className="h-6 w-6" />
              <span>Select a Workout</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workoutTemplates.map((workout) => (
                <Card key={workout.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{workout.name}</h3>
                        <Badge variant="outline">{workout.difficulty}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                          <p className="text-muted-foreground">Duration</p>
                          <p className="font-medium">{workout.totalDuration} min</p>
                        </div>
                        <div className="text-center">
                          <Flame className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                          <p className="text-muted-foreground">Calories</p>
                          <p className="font-medium">{workout.estimatedCalories}</p>
                        </div>
                        <div className="text-center">
                          <Activity className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                          <p className="text-muted-foreground">Exercises</p>
                          <p className="font-medium">{workout.exercises.length}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Exercises:</p>
                        <div className="flex flex-wrap gap-1">
                          {workout.exercises.slice(0, 3).map((exercise) => (
                            <Badge key={exercise.id} variant="secondary" className="text-xs">
                              {exercise.name}
                            </Badge>
                          ))}
                          {workout.exercises.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{workout.exercises.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={() => startWorkout(workout)}
                        className="w-full"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Workout
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentExercise = currentWorkout.exercises[currentExerciseIndex]

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Workout Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{currentWorkout.name}</h1>
              <p className="text-muted-foreground">
                Exercise {currentExerciseIndex + 1} of {currentWorkout.exercises.length}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={pauseWorkout}
                variant="outline"
                size="sm"
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
              <Button
                onClick={stopWorkout}
                variant="destructive"
                size="sm"
              >
                <Square className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setSoundEnabled(!soundEnabled)}
                variant="outline"
                size="sm"
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Workout Progress</span>
              <span>{Math.round(workoutStats.workoutProgress)}%</span>
            </div>
            <Progress value={workoutStats.workoutProgress} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Exercise Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Exercise */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{currentExercise.name}</span>
                <Badge variant="outline">{currentExercise.targetMuscle}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Exercise Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Sets</p>
                  <p className="text-2xl font-bold">{workoutStats.currentSet}/{currentExercise.sets}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Reps</p>
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      onClick={() => updateExerciseReps(currentExercise.id, Math.max(1, currentExercise.reps - 1))}
                      variant="outline"
                      size="sm"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-2xl font-bold">{currentExercise.reps}</span>
                    <Button
                      onClick={() => updateExerciseReps(currentExercise.id, currentExercise.reps + 1)}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {currentExercise.weight && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Weight (kg)</p>
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        onClick={() => updateExerciseWeight(currentExercise.id, Math.max(0, currentExercise.weight! - 2.5))}
                        variant="outline"
                        size="sm"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-2xl font-bold">{currentExercise.weight}</span>
                      <Button
                        onClick={() => updateExerciseWeight(currentExercise.id, currentExercise.weight! + 2.5)}
                        variant="outline"
                        size="sm"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Rest</p>
                  <p className="text-2xl font-bold">{currentExercise.restTime}s</p>
                </div>
              </div>

              {/* Rest Timer */}
              {isResting && (
                <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <CardContent className="pt-6 text-center">
                    <Timer className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm text-muted-foreground mb-2">Rest Time</p>
                    <p className="text-3xl font-bold text-blue-600">{formatTime(restTimer)}</p>
                    <Button
                      onClick={skipRest}
                      variant="outline"
                      size="sm"
                      className="mt-4"
                    >
                      Skip Rest
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button
                  onClick={completeSet}
                  disabled={isResting}
                  className="flex-1"
                  size="lg"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Complete Set
                </Button>
                {workoutStats.currentSet >= currentExercise.sets && (
                  <Button
                    onClick={nextExercise}
                    variant="outline"
                    size="lg"
                  >
                    Next Exercise
                  </Button>
                )}
              </div>

              {/* Exercise Navigation */}
              <div className="flex justify-between">
                <Button
                  onClick={previousExercise}
                  disabled={currentExerciseIndex === 0}
                  variant="outline"
                >
                  Previous
                </Button>
                <Button
                  onClick={nextExercise}
                  disabled={currentExerciseIndex === currentWorkout.exercises.length - 1}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Exercise Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Exercise Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Add notes about this exercise..."
                  value={exerciseNotes[currentExercise.id] || ""}
                  onChange={(e) => setExerciseNotes({
                    ...exerciseNotes,
                    [currentExercise.id]: e.target.value
                  })}
                />
                <div className="text-sm text-muted-foreground">
                  <p><strong>Tips:</strong> Focus on proper form and controlled movements.</p>
                  <p><strong>Breathing:</strong> Exhale during the exertion phase, inhale during the relaxation phase.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Panel */}
        <div className="space-y-6">
          {/* Timer */}
          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">Workout Time</p>
              <p className="text-3xl font-bold">{formatTime(time)}</p>
            </CardContent>
          </Card>

          {/* Heart Rate */}
          <Card>
            <CardContent className="pt-6 text-center">
              <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <p className="text-sm text-muted-foreground">Heart Rate</p>
              <p className="text-3xl font-bold">{Math.round(heartRate)} bpm</p>
              <div className="mt-2">
                <Progress 
                  value={(heartRate / 180) * 100} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Calories */}
          <Card>
            <CardContent className="pt-6 text-center">
              <Flame className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <p className="text-sm text-muted-foreground">Calories Burned</p>
              <p className="text-3xl font-bold">{Math.round(workoutStats.caloriesBurned)}</p>
            </CardContent>
          </Card>

          {/* Workout Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Session Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Completed Sets</span>
                <span className="font-bold">{workoutStats.completedSets}/{workoutStats.totalSets}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed Reps</span>
                <span className="font-bold">{workoutStats.completedReps}/{workoutStats.totalReps}</span>
              </div>
              <div className="flex justify-between">
                <span>Average HR</span>
                <span className="font-bold">{Math.round(heartRate)} bpm</span>
              </div>
              <div className="flex justify-between">
                <span>Peak HR</span>
                <span className="font-bold">{Math.round(heartRate + 15)} bpm</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Progress
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                Share Workout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}