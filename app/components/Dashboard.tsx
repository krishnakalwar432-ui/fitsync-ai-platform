"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Target, Zap, Calendar, Award, Activity, Clock, Flame, Sparkles, BarChart3 } from "lucide-react"
import MotivationalQuotes from "./MotivationalQuotes"

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [workoutTimer, setWorkoutTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      if (isTimerRunning) {
        setWorkoutTimer((prev) => prev + 1)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [isTimerRunning])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning)
  }

  const resetTimer = () => {
    setWorkoutTimer(0)
    setIsTimerRunning(false)
  }

  // Mock data for dashboard
  const stats = {
    weeklyWorkouts: 4,
    totalCalories: 1250,
    avgWorkoutTime: 35,
    currentStreak: 7,
    weeklyGoal: 5,
    monthlyProgress: 78,
  }

  const recentWorkouts = [
    { name: "HIIT Cardio", date: "2024-01-15", duration: "25 min", calories: 320 },
    { name: "Upper Body Strength", date: "2024-01-14", duration: "45 min", calories: 280 },
    { name: "Yoga Flow", date: "2024-01-13", duration: "30 min", calories: 150 },
    { name: "Leg Day Power", date: "2024-01-12", duration: "40 min", calories: 400 },
  ]

  const aiInsights = [
    "🎯 You're 80% towards your weekly goal! One more workout to go!",
    "🔥 Your consistency has improved by 25% this month. Keep it up!",
    "💪 Consider adding more strength training to balance your cardio focus.",
    "⏰ Your optimal workout time appears to be between 2-4 PM based on performance data.",
  ]

  return (
    <div className="min-h-screen bg-gray-900 py-8 particles-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-neon-gradient animate-gradient hover-glow relative">
            <span className="relative z-10">Your Dashboard</span>
            <Sparkles className="absolute -top-2 -right-8 h-8 w-8 text-neon-pink animate-pulse" />
          </h1>
          <p className="text-xl text-gray-400 mb-6 max-w-2xl mx-auto">Track your progress and stay motivated with AI-powered insights</p>
          
          {/* Daily Motivation */}
          <MotivationalQuotes 
            variant="banner" 
            autoRotate={true} 
            rotationInterval={8000}
            className="max-w-2xl mx-auto"
          />
        </div>

        {/* Enhanced 3D Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="card-3d glass-card bg-gradient-to-br from-neon-cyan/20 to-neon-cyan/10 backdrop-blur-3xl rounded-xl p-6 border border-neon-cyan/30 hover:shadow-neon-cyan hover-lift-3d group relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-8 w-8 text-neon-cyan group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
              <span className="text-3xl font-bold text-neon-cyan group-hover:scale-110 transition-transform duration-300">{stats.weeklyWorkouts}</span>
            </div>
            <p className="text-sm text-gray-300 font-medium">Workouts This Week</p>
            <div className="mt-3 bg-gray-700/50 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-neon-cyan to-neon-purple h-2 rounded-full transition-all duration-1000 animate-gradient-shift"
                style={{ width: `${(stats.weeklyWorkouts / stats.weeklyGoal) * 100}%` }}
              ></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/0 via-neon-cyan/5 to-neon-cyan/0 group-hover:from-neon-cyan/10 group-hover:via-neon-cyan/15 group-hover:to-neon-cyan/10 rounded-xl transition-all duration-500" />
          </div>

          <div className="card-3d glass-card bg-gradient-to-br from-neon-purple/20 to-neon-purple/10 backdrop-blur-3xl rounded-xl p-6 border border-neon-purple/30 hover:shadow-neon-purple hover-lift-3d group relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <Flame className="h-8 w-8 text-neon-purple group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
              <span className="text-3xl font-bold text-neon-purple group-hover:scale-110 transition-transform duration-300">{stats.totalCalories}</span>
            </div>
            <p className="text-sm text-gray-300 font-medium">Calories Burned</p>
            <p className="text-xs text-neon-purple mt-1 font-semibold">This Week</p>
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/0 via-neon-purple/5 to-neon-purple/0 group-hover:from-neon-purple/10 group-hover:via-neon-purple/15 group-hover:to-neon-purple/10 rounded-xl transition-all duration-500" />
          </div>

          <div className="card-3d glass-card bg-gradient-to-br from-neon-green/20 to-neon-green/10 backdrop-blur-3xl rounded-xl p-6 border border-neon-green/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] hover-lift-3d group relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-8 w-8 text-neon-green group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
              <span className="text-3xl font-bold text-neon-green group-hover:scale-110 transition-transform duration-300">{stats.avgWorkoutTime}</span>
            </div>
            <p className="text-sm text-gray-300 font-medium">Avg Workout Time</p>
            <p className="text-xs text-neon-green mt-1 font-semibold">Minutes</p>
            <div className="absolute inset-0 bg-gradient-to-r from-neon-green/0 via-neon-green/5 to-neon-green/0 group-hover:from-neon-green/10 group-hover:via-neon-green/15 group-hover:to-neon-green/10 rounded-xl transition-all duration-500" />
          </div>

          <div className="card-3d glass-card bg-gradient-to-br from-neon-orange/20 to-neon-orange/10 backdrop-blur-3xl rounded-xl p-6 border border-neon-orange/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] hover-lift-3d group relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <Award className="h-8 w-8 text-neon-orange group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
              <span className="text-3xl font-bold text-neon-orange group-hover:scale-110 transition-transform duration-300">{stats.currentStreak}</span>
            </div>
            <p className="text-sm text-gray-300 font-medium">Day Streak</p>
            <p className="text-xs text-neon-orange mt-1 font-semibold animate-pulse">Personal Best!</p>
            <div className="absolute inset-0 bg-gradient-to-r from-neon-orange/0 via-neon-orange/5 to-neon-orange/0 group-hover:from-neon-orange/10 group-hover:via-neon-orange/15 group-hover:to-neon-orange/10 rounded-xl transition-all duration-500" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Enhanced 3D Workout Timer */}
          <div className="lg:col-span-1">
            <div className="card-3d glass-card bg-glass-primary backdrop-blur-3xl rounded-2xl p-6 border border-neon-cyan/30 mb-6 hover:shadow-neon-cyan hover-lift-3d group relative overflow-hidden">
              <h3 className="text-xl font-bold text-neon-cyan mb-4 flex items-center group-hover:scale-105 transition-transform duration-300">
                <Activity className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                Workout Timer
              </h3>

              <div className="text-center">
                <div className="text-6xl font-mono font-bold text-neon-gradient mb-6 hover-glow cursor-default">
                  {formatTime(workoutTimer)}
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={toggleTimer}
                    className={`flex-1 font-bold py-3 px-4 rounded-lg transition-all duration-300 hover-lift transform-gpu ${
                      isTimerRunning
                        ? "bg-gradient-to-r from-neon-red to-red-600 hover:from-neon-red/80 hover:to-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                        : "bg-gradient-to-r from-neon-green to-green-600 hover:from-neon-green/80 hover:to-green-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                    }`}
                  >
                    {isTimerRunning ? "Pause" : "Start"}
                  </button>
                  <button
                    onClick={resetTimer}
                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 hover-lift border border-gray-500/30 hover:border-gray-400/50"
                  >
                    Reset
                  </button>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/0 via-neon-cyan/5 to-neon-cyan/0 group-hover:from-neon-cyan/10 group-hover:via-neon-cyan/15 group-hover:to-neon-cyan/10 rounded-2xl transition-all duration-500" />
            </div>

            {/* Enhanced AI Insights */}
            <div className="card-3d glass-card bg-glass-primary backdrop-blur-3xl rounded-2xl p-6 border border-neon-purple/30 hover:shadow-neon-purple hover-lift-3d group relative overflow-hidden">
              <h3 className="text-xl font-bold text-neon-purple mb-4 flex items-center group-hover:scale-105 transition-transform duration-300">
                <Zap className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                AI Insights
              </h3>

              <div className="space-y-3">
                {aiInsights.map((insight, index) => (
                  <div 
                    key={index} 
                    className="glass-card bg-glass-secondary rounded-lg p-3 text-sm text-gray-300 hover:bg-neon-purple/10 transition-all duration-300 hover-lift cursor-pointer border border-neon-purple/20 hover:border-neon-purple/40"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {insight}
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/0 via-neon-purple/5 to-neon-purple/0 group-hover:from-neon-purple/10 group-hover:via-neon-purple/15 group-hover:to-neon-purple/10 rounded-2xl transition-all duration-500" />
            </div>
          </div>

          {/* Enhanced Progress Chart & Recent Workouts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enhanced Progress Chart */}
            <div className="card-3d glass-card bg-glass-primary backdrop-blur-3xl rounded-2xl p-6 border border-neon-cyan/30 hover:shadow-neon-cyan hover-lift-3d group relative overflow-hidden">
              <h3 className="text-xl font-bold text-neon-cyan mb-4 flex items-center group-hover:scale-105 transition-transform duration-300">
                <TrendingUp className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                Monthly Progress
                <BarChart3 className="ml-auto h-5 w-5 text-neon-purple opacity-60" />
              </h3>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-300 font-medium">Goal Achievement</span>
                  <span className="text-neon-cyan font-bold text-xl">{stats.monthlyProgress}%</span>
                </div>
                <div className="bg-gray-700/50 rounded-full h-4 overflow-hidden relative">
                  <div
                    className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink h-4 rounded-full transition-all duration-1000 animate-gradient-shift relative"
                    style={{ width: `${stats.monthlyProgress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                </div>
              </div>

              {/* Enhanced Mock Chart */}
              <div className="h-48 bg-glass-secondary/30 rounded-lg flex items-end justify-center p-4 border border-neon-cyan/20">
                <div className="flex items-end space-x-3 h-full w-full justify-center">
                  {[65, 78, 82, 75, 88, 92, 85].map((height, index) => (
                    <div key={index} className="flex flex-col items-center group cursor-pointer">
                      <div
                        className="bg-gradient-to-t from-neon-cyan via-neon-purple to-neon-pink rounded-t-lg transition-all duration-500 hover:scale-110 hover:shadow-neon-cyan min-w-[20px] relative overflow-hidden"
                        style={{ height: `${height}%`, animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <span className="text-xs text-gray-400 mt-1 group-hover:text-neon-cyan transition-colors duration-300">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Recent Workouts */}
            <div className="card-3d glass-card bg-glass-primary backdrop-blur-3xl rounded-2xl p-6 border border-neon-purple/30 hover:shadow-neon-purple hover-lift-3d group relative overflow-hidden">
              <h3 className="text-xl font-bold text-neon-purple mb-4 flex items-center group-hover:scale-105 transition-transform duration-300">
                <Target className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                Recent Workouts
              </h3>

              <div className="space-y-3">
                {recentWorkouts.map((workout, index) => (
                  <div
                    key={index}
                    className="glass-card bg-glass-secondary/50 rounded-lg p-4 hover:bg-neon-purple/10 transition-all duration-300 hover-lift cursor-pointer border border-neon-purple/20 hover:border-neon-purple/40 group/workout relative overflow-hidden"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white group-hover/workout:text-neon-purple transition-colors duration-300">
                        {workout.name}
                      </h4>
                      <span className="text-xs text-gray-400 group-hover/workout:text-neon-purple transition-colors duration-300">
                        {workout.date}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300 group-hover/workout:text-neon-cyan transition-colors duration-300">
                        Duration: {workout.duration}
                      </span>
                      <span className="text-neon-orange font-semibold">
                        {workout.calories} cal
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/0 via-neon-purple/5 to-neon-purple/0 group-hover/workout:from-neon-purple/10 group-hover/workout:via-neon-purple/15 group-hover/workout:to-neon-purple/10 rounded-lg transition-all duration-500" />
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/0 via-neon-purple/5 to-neon-purple/0 group-hover:from-neon-purple/10 group-hover:via-neon-purple/15 group-hover:to-neon-purple/10 rounded-2xl transition-all duration-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
