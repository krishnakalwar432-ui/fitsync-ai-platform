"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Brain, Target, TrendingUp, Zap, Calendar, Clock, Award,
  Play, Heart, Activity, Sparkles, RefreshCw, CheckCircle
} from "lucide-react"

interface Recommendation {
  id: string
  type: 'workout' | 'nutrition' | 'recovery' | 'motivation'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  reason: string
  action: string
  estimatedTime: number
  difficulty: 'easy' | 'medium' | 'hard'
  benefits: string[]
  category: string
}

export default function SmartRecommendations() {
  const [activeTab, setActiveTab] = useState("today")
  const [userProfile] = useState({
    fitnessLevel: 'intermediate',
    goals: ['strength', 'endurance'],
    preferences: ['morning', 'home_workouts'],
    recentActivities: ['strength_training', 'cardio'],
    recovery: 85,
    motivation: 'high'
  })

  const [recommendations] = useState<Recommendation[]>([
    {
      id: "1",
      type: "workout",
      title: "Upper Body Strength Circuit",
      description: "Perfect for your current fitness level and recovery state. Focus on compound movements.",
      priority: "high",
      reason: "Based on your recent lower body focus and 85% recovery score",
      action: "Start 45-min workout",
      estimatedTime: 45,
      difficulty: "medium",
      benefits: ["Muscle Building", "Strength Gains", "Balanced Training"],
      category: "Strength"
    },
    {
      id: "2", 
      type: "nutrition",
      title: "Post-Workout Protein Meal",
      description: "Optimize muscle recovery with this balanced meal plan within 30 minutes.",
      priority: "high",
      reason: "Recent workout detected, protein window optimization",
      action: "View meal plan",
      estimatedTime: 15,
      difficulty: "easy",
      benefits: ["Muscle Recovery", "Energy Replenishment", "Nutrition Goals"],
      category: "Nutrition"
    },
    {
      id: "3",
      type: "recovery",
      title: "Active Recovery Yoga Session", 
      description: "Light stretching and mobility work to enhance tomorrow's performance.",
      priority: "medium",
      reason: "Scheduled rest day with focus on flexibility improvement",
      action: "Start 20-min session",
      estimatedTime: 20,
      difficulty: "easy",
      benefits: ["Flexibility", "Stress Relief", "Better Sleep"],
      category: "Recovery"
    },
    {
      id: "4",
      type: "motivation",
      title: "Weekly Challenge: Plank Hold",
      description: "Join 2,847 others in this week's community challenge. Beat your personal best!",
      priority: "medium",
      reason: "High motivation level and community engagement preference",
      action: "Join challenge",
      estimatedTime: 5,
      difficulty: "medium",
      benefits: ["Core Strength", "Community", "Achievement"],
      category: "Challenge"
    }
  ])

  const [weeklyPlan] = useState([
    { day: "Monday", focus: "Upper Body Strength", intensity: "High", duration: 45, completed: true },
    { day: "Tuesday", focus: "HIIT Cardio", intensity: "Medium", duration: 30, completed: true },
    { day: "Wednesday", focus: "Lower Body Power", intensity: "High", duration: 50, completed: false },
    { day: "Thursday", focus: "Active Recovery", intensity: "Low", duration: 20, completed: false },
    { day: "Friday", focus: "Full Body Circuit", intensity: "Medium", duration: 40, completed: false },
    { day: "Saturday", focus: "Outdoor Activity", intensity: "Variable", duration: 60, completed: false },
    { day: "Sunday", focus: "Rest & Mobility", intensity: "Low", duration: 15, completed: false }
  ])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-500/10 text-red-400'
      case 'medium': return 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
      case 'low': return 'border-blue-500 bg-blue-500/10 text-blue-400'
      default: return 'border-gray-500 bg-gray-500/10 text-gray-400'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'workout': return <Target className="h-5 w-5" />
      case 'nutrition': return <Heart className="h-5 w-5" />
      case 'recovery': return <Activity className="h-5 w-5" />
      case 'motivation': return <Award className="h-5 w-5" />
      default: return <Sparkles className="h-5 w-5" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'hard': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 py-8 px-4 particles-bg">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-neon-gradient mb-4">Smart Recommendations</h1>
          <p className="text-gray-300 text-lg">AI-powered adaptive suggestions based on your progress and preferences</p>
        </div>

        {/* AI Insight Banner */}
        <Card className="glass-card-hover border-neon-cyan/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-neon-cyan/20 border border-neon-cyan/50">
                <Brain className="h-8 w-8 text-neon-cyan" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-neon-cyan mb-2">AI Analysis Complete</h3>
                <p className="text-gray-300">
                  Based on your {userProfile.fitnessLevel} fitness level, recent activities, and {userProfile.recovery}% recovery score, 
                  I've identified 4 personalized recommendations to optimize your fitness journey.
                </p>
              </div>
              <Button className="btn-neon-primary">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 glass-card">
            <TabsTrigger value="today" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Today's Recommendations</span>
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Weekly Plan</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>AI Insights</span>
            </TabsTrigger>
          </TabsList>

          {/* Today's Recommendations */}
          <TabsContent value="today" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((rec) => (
                <Card key={rec.id} className="glass-card-hover">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getPriorityColor(rec.priority)} border`}>
                          {getTypeIcon(rec.type)}
                        </div>
                        <div>
                          <CardTitle className="text-neon-cyan">{rec.title}</CardTitle>
                          <Badge variant="outline" className="mt-1">
                            {rec.category}
                          </Badge>
                        </div>
                      </div>
                      <Badge className={getPriorityColor(rec.priority)}>
                        {rec.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300">{rec.description}</p>
                    
                    <div className="bg-glass-secondary p-3 rounded-lg border border-neon-purple/30">
                      <p className="text-sm text-neon-purple">
                        <Brain className="h-4 w-4 inline mr-1" />
                        Why this matters: {rec.reason}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{rec.estimatedTime} min</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Zap className={`h-4 w-4 ${getDifficultyColor(rec.difficulty)}`} />
                        <span className={getDifficultyColor(rec.difficulty)}>{rec.difficulty}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Benefits:</h4>
                      <div className="flex flex-wrap gap-2">
                        {rec.benefits.map((benefit, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full btn-neon-primary">
                      <Play className="h-4 w-4 mr-2" />
                      {rec.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Weekly Plan */}
          <TabsContent value="weekly" className="space-y-6">
            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle className="text-neon-purple">Adaptive Weekly Schedule</CardTitle>
                <CardDescription>Your personalized plan adjusts based on progress and recovery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyPlan.map((day, index) => (
                    <div key={day.day} className={`p-4 rounded-xl border transition-all duration-300 hover-lift ${
                      day.completed 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : index === 2 
                          ? 'bg-neon-cyan/10 border-neon-cyan/30 ring-2 ring-neon-cyan/20' 
                          : 'glass-card border-gray-600'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                            day.completed 
                              ? 'bg-green-500 text-black'
                              : index === 2
                                ? 'bg-neon-cyan text-black'
                                : 'bg-gray-600 text-white'
                          }`}>
                            {day.completed ? <CheckCircle className="h-6 w-6" /> : day.day.slice(0, 3)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-neon-cyan">{day.day}</h3>
                            <p className="text-sm text-gray-400">{day.focus}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-500">{day.duration} min</span>
                              <span className={`text-xs ${
                                day.intensity === 'High' ? 'text-red-400' :
                                day.intensity === 'Medium' ? 'text-yellow-400' :
                                'text-green-400'
                              }`}>
                                {day.intensity} Intensity
                              </span>
                            </div>
                          </div>
                        </div>
                        {index === 2 && (
                          <Button className="btn-neon-primary">
                            Start Today
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Insights */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card-hover">
                <CardHeader>
                  <CardTitle className="text-neon-green">Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Strength Progress</span>
                        <span className="text-neon-green">+15% this month</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Consistency Score</span>
                        <span className="text-neon-cyan">87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Recovery Quality</span>
                        <span className="text-neon-purple">Excellent</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card-hover">
                <CardHeader>
                  <CardTitle className="text-neon-orange">AI Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 glass-card rounded-lg">
                      <TrendingUp className="h-5 w-5 text-neon-green mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Increase workout intensity</p>
                        <p className="text-xs text-gray-400">Your recovery is excellent - time to challenge yourself</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 glass-card rounded-lg">
                      <Heart className="h-5 w-5 text-neon-red mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Focus on nutrition timing</p>
                        <p className="text-xs text-gray-400">Optimize pre and post-workout meals for better results</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 glass-card rounded-lg">
                      <Activity className="h-5 w-5 text-neon-purple mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Add flexibility training</p>
                        <p className="text-xs text-gray-400">10 minutes daily could improve performance by 8%</p>
                      </div>
                    </div>
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