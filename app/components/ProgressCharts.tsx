"use client"

import { useState, useEffect } from "react"
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  Award, 
  Activity, 
  Flame, 
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Users,
  Trophy,
  Zap,
  Camera,
  Scale,
  Ruler
} from "lucide-react"
import GoalTracker from "./GoalTracker"

interface ProgressData {
  date: string
  weight: number
  bodyFat?: number
  muscle?: number
  workouts: number
  calories: number
  steps?: number
}

interface WorkoutStats {
  totalWorkouts: number
  totalMinutes: number
  averageIntensity: number
  streakDays: number
  favoriteExercise: string
  improvementRate: number
}

interface NutritionStats {
  avgCalories: number
  avgProtein: number
  avgCarbs: number
  avgFats: number
  waterIntake: number
  mealsLogged: number
}

export default function ProgressCharts() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "3months" | "year">("month")
  const [activeChart, setActiveChart] = useState<"weight" | "workout" | "nutrition" | "overall" | "goals" | "photos">("overall")
  const [activeTab, setActiveTab] = useState<"analytics" | "goals" | "photos">("analytics")
  
  // Mock data - in real app, this would come from API
  const [progressData] = useState<ProgressData[]>([
    { date: "2024-01-01", weight: 75.5, bodyFat: 15.2, muscle: 63.5, workouts: 4, calories: 2100, steps: 8500 },
    { date: "2024-01-08", weight: 75.2, bodyFat: 15.0, muscle: 63.8, workouts: 5, calories: 2150, steps: 9200 },
    { date: "2024-01-15", weight: 74.8, bodyFat: 14.8, muscle: 64.1, workouts: 4, calories: 2200, steps: 8800 },
    { date: "2024-01-22", weight: 74.5, bodyFat: 14.5, muscle: 64.5, workouts: 6, calories: 2250, steps: 9500 },
    { date: "2024-01-29", weight: 74.2, bodyFat: 14.2, muscle: 64.8, workouts: 5, calories: 2180, steps: 9100 },
  ])

  const [workoutStats] = useState<WorkoutStats>({
    totalWorkouts: 24,
    totalMinutes: 1080,
    averageIntensity: 7.5,
    streakDays: 12,
    favoriteExercise: "Deadlifts",
    improvementRate: 15.3
  })

  const [nutritionStats] = useState<NutritionStats>({
    avgCalories: 2196,
    avgProtein: 140,
    avgCarbs: 220,
    avgFats: 85,
    waterIntake: 2.8,
    mealsLogged: 84
  })

  const getCurrentStreak = () => {
    return workoutStats.streakDays
  }

  const getWeightProgress = () => {
    if (progressData.length < 2) return 0
    const latest = progressData[progressData.length - 1].weight
    const earliest = progressData[0].weight
    return Number((latest - earliest).toFixed(1))
  }

  const getWorkoutFrequency = () => {
    const totalWorkouts = progressData.reduce((sum, day) => sum + day.workouts, 0)
    return Number((totalWorkouts / progressData.length).toFixed(1))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neon-gradient animate-slideUp">
            Progress Analytics
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Track your fitness journey with comprehensive analytics and insights powered by AI
          </p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 text-center hover-lift">
            <div className="flex items-center justify-center mb-3">
              <Flame className="h-8 w-8 text-orange-400 animate-neon-pulse" />
            </div>
            <div className="text-3xl font-bold text-neon-gradient mb-1">{getCurrentStreak()}</div>
            <div className="text-sm text-gray-400">Day Streak</div>
            <div className="text-xs text-green-400 mt-1">+2 this week</div>
          </div>

          <div className="glass-card p-6 text-center hover-lift">
            <div className="flex items-center justify-center mb-3">
              <Target className="h-8 w-8 text-cyan-400 animate-neon-pulse" />
            </div>
            <div className="text-3xl font-bold text-neon-gradient mb-1">{getWeightProgress()}</div>
            <div className="text-sm text-gray-400">Weight Change (kg)</div>
            <div className="text-xs text-green-400 mt-1">On track</div>
          </div>

          <div className="glass-card p-6 text-center hover-lift">
            <div className="flex items-center justify-center mb-3">
              <Activity className="h-8 w-8 text-purple-400 animate-neon-pulse" />
            </div>
            <div className="text-3xl font-bold text-neon-gradient mb-1">{workoutStats.totalWorkouts}</div>
            <div className="text-sm text-gray-400">Total Workouts</div>
            <div className="text-xs text-green-400 mt-1">{getWorkoutFrequency()}/week avg</div>
          </div>

          <div className="glass-card p-6 text-center hover-lift">
            <div className="flex items-center justify-center mb-3">
              <Trophy className="h-8 w-8 text-yellow-400 animate-neon-pulse" />
            </div>
            <div className="text-3xl font-bold text-neon-gradient mb-1">{workoutStats.improvementRate}%</div>
            <div className="text-sm text-gray-400">Improvement</div>
            <div className="text-xs text-green-400 mt-1">Above average</div>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="glass-card p-2 flex space-x-2">
            {[
              { key: "analytics", label: "Analytics", icon: BarChart3 },
              { key: "goals", label: "Goals", icon: Target },
              { key: "photos", label: "Progress Photos", icon: Camera }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.key
                      ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-neon"
                      : "text-gray-400 hover:text-neon-cyan hover:bg-gray-800/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "analytics" && (
          <>
            {/* Time Range Selector for Analytics */}
            <div className="flex justify-center mb-8">
              <div className="glass-card p-2 flex space-x-2">
                {[
                  { key: "week", label: "7 Days" },
                  { key: "month", label: "30 Days" },
                  { key: "3months", label: "3 Months" },
                  { key: "year", label: "1 Year" }
                ].map((range) => (
                  <button
                    key={range.key}
                    onClick={() => setTimeRange(range.key as any)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      timeRange === range.key
                        ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-neon"
                        : "text-gray-400 hover:text-neon-cyan hover:bg-gray-800/50"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Type Selector */}
            <div className="flex justify-center mb-8">
              <div className="glass-card p-2 flex flex-wrap gap-2">
                {[
                  { key: "overall", label: "Overview", icon: BarChart3 },
                  { key: "weight", label: "Body Metrics", icon: TrendingUp },
                  { key: "workout", label: "Workouts", icon: Activity },
                  { key: "nutrition", label: "Nutrition", icon: PieChart }
                ].map((chart) => {
                  const Icon = chart.icon
                  return (
                    <button
                      key={chart.key}
                      onClick={() => setActiveChart(chart.key as any)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        activeChart === chart.key
                          ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-neon-cyan border border-neon"
                          : "text-gray-400 hover:text-neon-cyan hover:bg-gray-800/50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{chart.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Main Charts Area */}
            <div className="grid lg:grid-cols-3 gap-8 mb-8">
              {/* Primary Chart */}
              <div className="lg:col-span-2">
                <div className="glass-card p-6">
                  <h3 className="text-xl font-bold text-neon-cyan mb-4 flex items-center">
                    <LineChart className="h-5 w-5 mr-2" />
                    {activeChart === "overall" && "Progress Overview"}
                    {activeChart === "weight" && "Body Composition"}
                    {activeChart === "workout" && "Workout Performance"}
                    {activeChart === "nutrition" && "Nutrition Trends"}
                  </h3>
                  
                  {/* Mock Chart Area */}
                  <div className="h-80 bg-gray-800/30 rounded-lg flex items-center justify-center border border-gray-700/50">
                    <div className="text-center">
                      <div className="animate-pulse mb-4">
                        <div className="grid grid-cols-7 gap-2 mb-4">
                          {Array.from({ length: 7 }, (_, i) => (
                            <div
                              key={i}
                              className="bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t"
                              style={{ height: `${Math.random() * 100 + 20}px` }}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm">
                        📊 Interactive charts will be implemented with Chart.js or Recharts
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        Showing {timeRange} data for {activeChart} metrics
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side Stats */}
              <div className="space-y-6">
                {/* Workout Stats */}
                <div className="glass-card p-6">
                  <h4 className="text-lg font-semibold text-purple-400 mb-4 flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    Workout Stats
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Total Time</span>
                      <span className="text-neon-cyan font-semibold">{Math.floor(workoutStats.totalMinutes / 60)}h {workoutStats.totalMinutes % 60}m</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Avg Intensity</span>
                      <span className="text-neon-cyan font-semibold">{workoutStats.averageIntensity}/10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Favorite Exercise</span>
                      <span className="text-purple-400 font-semibold">{workoutStats.favoriteExercise}</span>
                    </div>
                    <div className="bg-gray-700/30 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Weekly Goal Progress</span>
                        <span className="text-sm text-green-400">85%</span>
                      </div>
                      <div className="bg-gray-600 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 rounded-full" style={{width: "85%"}} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nutrition Overview */}
                <div className="glass-card p-6">
                  <h4 className="text-lg font-semibold text-green-400 mb-4 flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Nutrition Overview
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-gray-700/30 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-300">Protein</span>
                        <span className="text-sm text-purple-400">{nutritionStats.avgProtein}g</span>
                      </div>
                      <div className="bg-gray-600 rounded-full h-1.5">
                        <div className="bg-purple-400 h-1.5 rounded-full" style={{width: "75%"}} />
                      </div>
                    </div>
                    <div className="bg-gray-700/30 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-300">Carbs</span>
                        <span className="text-sm text-green-400">{nutritionStats.avgCarbs}g</span>
                      </div>
                      <div className="bg-gray-600 rounded-full h-1.5">
                        <div className="bg-green-400 h-1.5 rounded-full" style={{width: "65%"}} />
                      </div>
                    </div>
                    <div className="bg-gray-700/30 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-300">Fats</span>
                        <span className="text-sm text-yellow-400">{nutritionStats.avgFats}g</span>
                      </div>
                      <div className="bg-gray-600 rounded-full h-1.5">
                        <div className="bg-yellow-400 h-1.5 rounded-full" style={{width: "60%"}} />
                      </div>
                    </div>
                    <div className="text-center pt-2">
                      <span className="text-xs text-gray-400">💧 {nutritionStats.waterIntake}L water/day</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements & Goals */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Recent Achievements */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Recent Achievements
                </h3>
                <div className="space-y-4">
                  {[
                    { title: "12-Day Streak", description: "Consistent workout schedule", date: "Today", color: "text-green-400" },
                    { title: "PR Deadlift", description: "Hit new personal record: 140kg", date: "2 days ago", color: "text-purple-400" },
                    { title: "Nutrition Goal", description: "Met protein target 7 days in a row", date: "3 days ago", color: "text-cyan-400" },
                    { title: "Weight Milestone", description: "Lost 2kg this month", date: "1 week ago", color: "text-pink-400" }
                  ].map((achievement, index) => (
                    <div key={index} className="bg-gray-800/30 rounded-lg p-4 border-l-4 border-neon hover:bg-gray-700/30 transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`font-semibold ${achievement.color}`}>{achievement.title}</h4>
                          <p className="text-gray-300 text-sm">{achievement.description}</p>
                        </div>
                        <div className="text-right">
                          <Trophy className={`h-5 w-5 ${achievement.color} mb-1`} />
                          <p className="text-xs text-gray-400">{achievement.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Goals & Targets */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Current Goals
                </h3>
                <div className="space-y-4">
                  {[
                    { goal: "Lose 5kg", current: 2.3, target: 5, unit: "kg", color: "from-green-400 to-cyan-400" },
                    { goal: "Workout 5x/week", current: 4, target: 5, unit: "days", color: "from-purple-400 to-pink-400" },
                    { goal: "10,000 steps daily", current: 8500, target: 10000, unit: "steps", color: "from-yellow-400 to-orange-400" },
                    { goal: "140g protein daily", current: 135, target: 140, unit: "g", color: "from-cyan-400 to-purple-400" }
                  ].map((goal, index) => (
                    <div key={index} className="bg-gray-800/30 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-white">{goal.goal}</span>
                        <span className="text-sm text-gray-400">{goal.current}/{goal.target} {goal.unit}</span>
                      </div>
                      <div className="bg-gray-600 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r ${goal.color} h-2 rounded-full transition-all duration-500`}
                          style={{width: `${Math.min((goal.current / goal.target) * 100, 100)}%`}}
                        />
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {Math.round((goal.current / goal.target) * 100)}% complete
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-neon-gradient mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                AI-Powered Insights
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-500/30">
                  <h4 className="font-semibold text-cyan-400 mb-2">💪 Strength Progress</h4>
                  <p className="text-gray-300 text-sm">
                    Your deadlift has improved by 15% this month. Consider increasing volume for bench press to maintain balanced development.
                  </p>
                </div>
                <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                  <h4 className="font-semibold text-purple-400 mb-2">🍎 Nutrition Optimization</h4>
                  <p className="text-gray-300 text-sm">
                    Great protein intake! Try adding more complex carbs post-workout to enhance recovery and performance.
                  </p>
                </div>
                <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                  <h4 className="font-semibold text-green-400 mb-2">📈 Goal Prediction</h4>
                  <p className="text-gray-300 text-sm">
                    At your current pace, you'll reach your weight goal in 8 weeks. Maintaining consistency is key to success.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Goals Tab */}
        {activeTab === "goals" && (
          <GoalTracker />
        )}

        {/* Progress Photos Tab */}
        {activeTab === "photos" && (
          <div className="space-y-8">
            {/* Progress Photos Section */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-neon-cyan mb-4 flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Progress Photos
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                {/* Before Photo */}
                <div className="text-center">
                  <div className="bg-gray-800/50 rounded-lg p-6 mb-3 border-2 border-dashed border-gray-600 hover:border-cyan-500/50 transition-colors">
                    <Camera className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">Before Photo</p>
                    <p className="text-xs text-gray-500">Jan 1, 2024</p>
                  </div>
                  <button className="button-neon-secondary text-sm px-4 py-2">
                    Upload Photo
                  </button>
                </div>
                
                {/* Current Photo */}
                <div className="text-center">
                  <div className="bg-gray-800/50 rounded-lg p-6 mb-3 border-2 border-dashed border-gray-600 hover:border-purple-500/50 transition-colors">
                    <Camera className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">Current Photo</p>
                    <p className="text-xs text-gray-500">Today</p>
                  </div>
                  <button className="button-neon-secondary text-sm px-4 py-2">
                    Upload Photo
                  </button>
                </div>
                
                {/* Goal Photo */}
                <div className="text-center">
                  <div className="bg-gray-800/50 rounded-lg p-6 mb-3 border-2 border-dashed border-gray-600 hover:border-green-500/50 transition-colors">
                    <Camera className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">Goal Photo</p>
                    <p className="text-xs text-gray-500">Reference</p>
                  </div>
                  <button className="button-neon-secondary text-sm px-4 py-2">
                    Upload Photo
                  </button>
                </div>
              </div>
              
              <div className="text-center text-gray-400 text-sm">
                📸 Upload progress photos to track your visual transformation journey
              </div>
            </div>

            {/* Body Measurements */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center">
                <Ruler className="h-5 w-5 mr-2" />
                Body Measurements
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Weight", value: "74.2", unit: "kg", change: "-1.3", trend: "down" },
                  { label: "Body Fat", value: "14.2", unit: "%", change: "-1.0", trend: "down" },
                  { label: "Muscle Mass", value: "64.8", unit: "kg", change: "+1.3", trend: "up" },
                  { label: "Waist", value: "84", unit: "cm", change: "-2", trend: "down" },
                  { label: "Chest", value: "102", unit: "cm", change: "+1", trend: "up" },
                  { label: "Arms", value: "36", unit: "cm", change: "+0.5", trend: "up" },
                  { label: "Thighs", value: "58", unit: "cm", change: "+1", trend: "up" },
                  { label: "BMI", value: "22.1", unit: "", change: "-0.4", trend: "down" }
                ].map((measurement, index) => (
                  <div key={index} className="bg-gray-800/30 rounded-lg p-4 text-center">
                    <h4 className="font-medium text-gray-300 mb-2">{measurement.label}</h4>
                    <div className="text-2xl font-bold text-neon-cyan mb-1">
                      {measurement.value}{measurement.unit}
                    </div>
                    <div className={`text-sm flex items-center justify-center ${
                      measurement.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      <span className="mr-1">
                        {measurement.trend === 'up' ? '↗' : '↘'}
                      </span>
                      {measurement.change}{measurement.unit}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <button className="button-neon-primary">
                  <Scale className="h-4 w-4 mr-2" />
                  Log New Measurements
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}