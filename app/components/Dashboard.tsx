"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Target, Zap, Calendar, Award, Activity, Clock, Flame } from "lucide-react"

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
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Your Dashboard
          </h1>
          <p className="text-xl text-gray-400">Track your progress and stay motivated with AI-powered insights</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-8 w-8 text-cyan-400" />
              <span className="text-2xl font-bold text-cyan-400">{stats.weeklyWorkouts}</span>
            </div>
            <p className="text-sm text-gray-300">Workouts This Week</p>
            <div className="mt-2 bg-gray-700 rounded-full h-2">
              <div
                className="bg-cyan-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(stats.weeklyWorkouts / stats.weeklyGoal) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-2">
              <Flame className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold text-purple-400">{stats.totalCalories}</span>
            </div>
            <p className="text-sm text-gray-300">Calories Burned</p>
            <p className="text-xs text-purple-400 mt-1">This Week</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-8 w-8 text-green-400" />
              <span className="text-2xl font-bold text-green-400">{stats.avgWorkoutTime}</span>
            </div>
            <p className="text-sm text-gray-300">Avg Workout Time</p>
            <p className="text-xs text-green-400 mt-1">Minutes</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
            <div className="flex items-center justify-between mb-2">
              <Award className="h-8 w-8 text-yellow-400" />
              <span className="text-2xl font-bold text-yellow-400">{stats.currentStreak}</span>
            </div>
            <p className="text-sm text-gray-300">Day Streak</p>
            <p className="text-xs text-yellow-400 mt-1">Personal Best!</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Workout Timer */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Workout Timer
              </h3>

              <div className="text-center">
                <div className="text-6xl font-mono font-bold text-white mb-6">{formatTime(workoutTimer)}</div>

                <div className="flex space-x-4">
                  <button
                    onClick={toggleTimer}
                    className={`flex-1 font-bold py-3 px-4 rounded-lg transition-all duration-300 ${
                      isTimerRunning
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    {isTimerRunning ? "Pause" : "Start"}
                  </button>
                  <button
                    onClick={resetTimer}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                AI Insights
              </h3>

              <div className="space-y-3">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="bg-gray-700/30 rounded-lg p-3 text-sm text-gray-300">
                    {insight}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Chart & Recent Workouts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Chart */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Monthly Progress
              </h3>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Goal Achievement</span>
                  <span className="text-cyan-400 font-bold">{stats.monthlyProgress}%</span>
                </div>
                <div className="bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-purple-500 h-4 rounded-full transition-all duration-1000"
                    style={{ width: `${stats.monthlyProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Mock Chart */}
              <div className="h-48 bg-gray-700/30 rounded-lg flex items-end justify-center p-4">
                <div className="flex items-end space-x-2 h-full">
                  {[65, 78, 82, 75, 88, 92, 85].map((height, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t w-8 transition-all duration-500 hover:opacity-80"
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Workouts */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Recent Workouts
              </h3>

              <div className="space-y-3">
                {recentWorkouts.map((workout, index) => (
                  <div key={index} className="bg-gray-700/30 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white">{workout.name}</h4>
                      <p className="text-sm text-gray-400">{workout.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-cyan-400 font-semibold">{workout.duration}</p>
                      <p className="text-sm text-gray-400">{workout.calories} cal</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
