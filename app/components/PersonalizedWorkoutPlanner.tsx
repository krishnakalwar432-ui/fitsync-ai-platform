"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Target, 
  Clock, 
  TrendingUp, 
  Zap, 
  Dumbbell, 
  Heart, 
  Calendar,
  Star,
  Play,
  Pause,
  SkipForward,
  RefreshCw,
  Brain,
  Activity,
  Award,
  Users,
  Sparkles
} from "lucide-react"

interface WorkoutExercise {
  id: string
  name: string
  type: 'strength' | 'cardio' | 'flexibility' | 'balance'
  duration: number
  sets?: number
  reps?: number
  weight?: number
  restTime: number
  calories: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  muscleGroups: string[]
  equipment: string[]
  instructions: string[]
  tips: string[]
}

interface WorkoutPlan {
  id: string
  name: string
  description: string
  duration: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  goal: string
  exercises: WorkoutExercise[]
  estimatedCalories: number
  createdAt: Date
  aiScore: number
}

interface UserPreferences {
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced'
  primaryGoals: string[]
  availableTime: number
  preferredDays: string[]
  equipment: string[]
  injuries: string[]
  preferredIntensity: number
}

export default function PersonalizedWorkoutPlanner() {
  const [activeTab, setActiveTab] = useState("preferences")
  const [preferences, setPreferences] = useState<UserPreferences>({
    fitnessLevel: 'beginner',
    primaryGoals: [],
    availableTime: 30,
    preferredDays: [],
    equipment: [],
    injuries: [],
    preferredIntensity: 5
  })
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([])
  const [currentPlan, setCurrentPlan] = useState<WorkoutPlan | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [workoutHistory, setWorkoutHistory] = useState([])

  const fitnessGoals = [
    "Weight Loss", "Muscle Building", "Strength", "Endurance", 
    "Flexibility", "General Fitness", "Athletic Performance", "Rehabilitation"
  ]

  const availableEquipment = [
    "None (Bodyweight)", "Dumbbells", "Barbells", "Resistance Bands", 
    "Kettlebells", "Pull-up Bar", "Yoga Mat", "Treadmill", "Bike"
  ]

  const weekDays = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ]

  // AI Workout Generation
  const generateAIWorkoutPlan = async () => {
    setIsGenerating(true)
    
    try {
      // Simulate AI processing with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const aiGeneratedPlan: WorkoutPlan = {
        id: Date.now().toString(),
        name: `AI Custom ${preferences.primaryGoals[0] || 'Fitness'} Plan`,
        description: `Personalized workout tailored to your ${preferences.fitnessLevel} level focusing on ${preferences.primaryGoals.join(', ').toLowerCase()}`,
        duration: preferences.availableTime,
        difficulty: preferences.fitnessLevel,
        goal: preferences.primaryGoals[0] || 'General Fitness',
        exercises: generateExercises(),
        estimatedCalories: Math.floor(preferences.availableTime * (preferences.preferredIntensity + 5)),
        createdAt: new Date(),
        aiScore: Math.floor(Math.random() * 20) + 80 // AI confidence score
      }
      
      setWorkoutPlans(prev => [aiGeneratedPlan, ...prev])
      setCurrentPlan(aiGeneratedPlan)
      setActiveTab("workout")
    } catch (error) {
      console.error('Error generating workout plan:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateExercises = (): WorkoutExercise[] => {
    const baseExercises = [
      {
        name: "Push-ups",
        type: 'strength' as const,
        muscleGroups: ["Chest", "Triceps", "Shoulders"],
        equipment: ["None (Bodyweight)"],
        instructions: ["Start in plank position", "Lower body to ground", "Push back up"],
        tips: ["Keep core tight", "Full range of motion"]
      },
      {
        name: "Squats",
        type: 'strength' as const,
        muscleGroups: ["Quadriceps", "Glutes", "Hamstrings"],
        equipment: ["None (Bodyweight)"],
        instructions: ["Stand with feet shoulder-width apart", "Lower into squat", "Return to standing"],
        tips: ["Keep knees behind toes", "Chest up, core engaged"]
      },
      {
        name: "Mountain Climbers",
        type: 'cardio' as const,
        muscleGroups: ["Core", "Shoulders", "Legs"],
        equipment: ["None (Bodyweight)"],
        instructions: ["Start in plank", "Alternate bringing knees to chest", "Keep fast pace"],
        tips: ["Maintain plank position", "Breathe steadily"]
      }
    ]

    return baseExercises.map((exercise, index) => ({
      id: `ex-${index}`,
      ...exercise,
      duration: Math.floor(preferences.availableTime / baseExercises.length),
      sets: preferences.fitnessLevel === 'beginner' ? 2 : preferences.fitnessLevel === 'intermediate' ? 3 : 4,
      reps: preferences.fitnessLevel === 'beginner' ? 8 : preferences.fitnessLevel === 'intermediate' ? 12 : 15,
      restTime: preferences.fitnessLevel === 'beginner' ? 90 : 60,
      calories: Math.floor(Math.random() * 50) + 30,
      difficulty: preferences.fitnessLevel
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 py-8 px-4 particles-bg">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-neon-gradient mb-4 animate-fadeIn">
            AI Workout Planner
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Get personalized workout routines generated by AI, tailored to your fitness level, goals, and preferences
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass-card">
            <TabsTrigger value="preferences" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="generate" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>Generate AI Plan</span>
            </TabsTrigger>
            <TabsTrigger value="workout" className="flex items-center space-x-2">
              <Dumbbell className="h-4 w-4" />
              <span>Workout Plan</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>History</span>
            </TabsTrigger>
          </TabsList>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-neon-cyan">
                  <Target className="h-6 w-6" />
                  <span>Fitness Assessment</span>
                </CardTitle>
                <CardDescription>Tell us about your fitness journey to create your perfect workout plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Current Fitness Level</Label>
                    <Select value={preferences.fitnessLevel} onValueChange={(value: any) => 
                      setPreferences(prev => ({ ...prev, fitnessLevel: value }))
                    }>
                      <SelectTrigger className="glass-card">
                        <SelectValue placeholder="Select fitness level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Available Time (minutes)</Label>
                    <div className="px-4">
                      <Slider
                        value={[preferences.availableTime]}
                        onValueChange={(value) => setPreferences(prev => ({ ...prev, availableTime: value[0] }))}
                        max={120}
                        min={15}
                        step={15}
                        className="slider"
                      />
                      <div className="flex justify-between text-sm text-gray-400 mt-2">
                        <span>15 min</span>
                        <span>{preferences.availableTime} min</span>
                        <span>120 min</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Primary Fitness Goals</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {fitnessGoals.map((goal) => (
                      <Button
                        key={goal}
                        variant={preferences.primaryGoals.includes(goal) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setPreferences(prev => ({
                            ...prev,
                            primaryGoals: prev.primaryGoals.includes(goal)
                              ? prev.primaryGoals.filter(g => g !== goal)
                              : [...prev.primaryGoals, goal]
                          }))
                        }}
                        className={`${preferences.primaryGoals.includes(goal) 
                          ? 'btn-neon-primary' 
                          : 'glass-card hover:border-neon-cyan'
                        } transition-all duration-300`}
                      >
                        {goal}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Available Equipment</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableEquipment.map((equipment) => (
                      <Button
                        key={equipment}
                        variant={preferences.equipment.includes(equipment) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setPreferences(prev => ({
                            ...prev,
                            equipment: prev.equipment.includes(equipment)
                              ? prev.equipment.filter(e => e !== equipment)
                              : [...prev.equipment, equipment]
                          }))
                        }}
                        className={`${preferences.equipment.includes(equipment) 
                          ? 'btn-neon-primary' 
                          : 'glass-card hover:border-neon-cyan'
                        } transition-all duration-300 text-xs`}
                      >
                        {equipment}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Preferred Intensity Level</Label>
                  <div className="px-4">
                    <Slider
                      value={[preferences.preferredIntensity]}
                      onValueChange={(value) => setPreferences(prev => ({ ...prev, preferredIntensity: value[0] }))}
                      max={10}
                      min={1}
                      step={1}
                      className="slider"
                    />
                    <div className="flex justify-between text-sm text-gray-400 mt-2">
                      <span>Low (1)</span>
                      <span>Level {preferences.preferredIntensity}</span>
                      <span>High (10)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Generate AI Plan Tab */}
          <TabsContent value="generate" className="space-y-6">
            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-neon-purple">
                  <Brain className="h-6 w-6" />
                  <span>AI Workout Generation</span>
                </CardTitle>
                <CardDescription>Our AI will create a personalized workout plan based on your preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-neon-cyan/10 via-neon-purple/10 to-neon-pink/10 rounded-xl p-6 border border-neon-cyan/30">
                  <h3 className="text-lg font-semibold text-neon-cyan mb-4">Your Profile Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <p><span className="text-gray-400">Fitness Level:</span> <Badge variant="secondary">{preferences.fitnessLevel}</Badge></p>
                      <p><span className="text-gray-400">Available Time:</span> {preferences.availableTime} minutes</p>
                      <p><span className="text-gray-400">Intensity:</span> Level {preferences.preferredIntensity}/10</p>
                    </div>
                    <div className="space-y-2">
                      <p><span className="text-gray-400">Goals:</span> {preferences.primaryGoals.join(', ') || 'None selected'}</p>
                      <p><span className="text-gray-400">Equipment:</span> {preferences.equipment.length} items</p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    onClick={generateAIWorkoutPlan}
                    disabled={isGenerating || preferences.primaryGoals.length === 0}
                    className="btn-neon-primary text-lg px-8 py-4 hover-lift"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        Generating AI Plan...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Generate AI Workout Plan
                      </>
                    )}
                  </Button>
                  {preferences.primaryGoals.length === 0 && (
                    <p className="text-sm text-gray-400 mt-2">Please select at least one fitness goal</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workout Plan Tab */}
          <TabsContent value="workout" className="space-y-6">
            {currentPlan ? (
              <div className="space-y-6">
                <Card className="glass-card-hover">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl text-neon-gradient">{currentPlan.name}</CardTitle>
                        <CardDescription className="mt-2">{currentPlan.description}</CardDescription>
                      </div>
                      <Badge className="bg-neon-cyan/20 text-neon-cyan border-neon-cyan">
                        AI Score: {currentPlan.aiScore}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="flex items-center space-x-2 text-center p-4 glass-card rounded-xl">
                        <Clock className="h-5 w-5 text-neon-cyan" />
                        <div>
                          <p className="text-sm text-gray-400">Duration</p>
                          <p className="font-semibold">{currentPlan.duration} min</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-center p-4 glass-card rounded-xl">
                        <Zap className="h-5 w-5 text-neon-purple" />
                        <div>
                          <p className="text-sm text-gray-400">Calories</p>
                          <p className="font-semibold">{currentPlan.estimatedCalories}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-center p-4 glass-card rounded-xl">
                        <TrendingUp className="h-5 w-5 text-neon-pink" />
                        <div>
                          <p className="text-sm text-gray-400">Difficulty</p>
                          <p className="font-semibold capitalize">{currentPlan.difficulty}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-center p-4 glass-card rounded-xl">
                        <Dumbbell className="h-5 w-5 text-neon-green" />
                        <div>
                          <p className="text-sm text-gray-400">Exercises</p>
                          <p className="font-semibold">{currentPlan.exercises.length}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {currentPlan.exercises.map((exercise, index) => (
                        <div key={exercise.id} className="glass-card-hover p-6 rounded-xl">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-neon-cyan">{exercise.name}</h3>
                              <p className="text-sm text-gray-400 capitalize">{exercise.type} • {exercise.difficulty}</p>
                            </div>
                            <Badge variant="outline" className="border-neon-purple text-neon-purple">
                              {exercise.sets}x{exercise.reps}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="text-sm">
                              <span className="text-gray-400">Muscle Groups:</span>
                              <p>{exercise.muscleGroups.join(', ')}</p>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-400">Equipment:</span>
                              <p>{exercise.equipment.join(', ')}</p>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-400">Rest Time:</span>
                              <p>{exercise.restTime}s</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <details className="text-sm">
                              <summary className="cursor-pointer text-neon-cyan hover:text-neon-purple transition-colors">
                                Instructions & Tips
                              </summary>
                              <div className="mt-2 space-y-2 pl-4">
                                <div>
                                  <span className="text-gray-400">Instructions:</span>
                                  <ul className="list-disc list-inside mt-1 space-y-1">
                                    {exercise.instructions.map((instruction, i) => (
                                      <li key={i}>{instruction}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <span className="text-gray-400">Tips:</span>
                                  <ul className="list-disc list-inside mt-1 space-y-1">
                                    {exercise.tips.map((tip, i) => (
                                      <li key={i}>{tip}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </details>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center space-x-4 mt-8">
                      <Button className="btn-neon-primary px-6">
                        <Play className="h-4 w-4 mr-2" />
                        Start Workout
                      </Button>
                      <Button variant="outline" className="glass-card hover:border-neon-cyan">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="glass-card text-center p-12">
                <Brain className="h-16 w-16 text-neon-purple mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No Workout Plan Generated</h3>
                <p className="text-gray-400 mb-6">Set your preferences and generate an AI workout plan to get started</p>
                <Button onClick={() => setActiveTab("preferences")} className="btn-neon-primary">
                  Set Preferences
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-neon-green">
                  <Calendar className="h-6 w-6" />
                  <span>Workout History</span>
                </CardTitle>
                <CardDescription>Track your progress and review past workout plans</CardDescription>
              </CardHeader>
              <CardContent>
                {workoutPlans.length > 0 ? (
                  <div className="space-y-4">
                    {workoutPlans.map((plan) => (
                      <div key={plan.id} className="glass-card p-4 rounded-xl hover-lift">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-neon-cyan">{plan.name}</h3>
                            <p className="text-sm text-gray-400">{plan.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Created: {plan.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-neon-cyan/20 text-neon-cyan border-neon-cyan mb-2">
                              {plan.duration} min
                            </Badge>
                            <p className="text-sm text-gray-400">{plan.estimatedCalories} cal</p>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setCurrentPlan(plan)}
                            className="glass-card hover:border-neon-cyan"
                          >
                            View Plan
                          </Button>
                          <Button 
                            size="sm" 
                            className="btn-neon-primary"
                            onClick={() => {
                              setCurrentPlan(plan)
                              setActiveTab("workout")
                            }}
                          >
                            Start Workout
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">No Workout History</h3>
                    <p className="text-gray-400">Your completed workouts will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}