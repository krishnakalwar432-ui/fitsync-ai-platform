"use client"

import { useState } from "react"
import { Target, Zap, TrendingUp, ArrowRight } from "lucide-react"

interface HeroProps {
  setActiveSection: (section: string) => void
}

export default function Hero({ setActiveSection }: HeroProps) {
  const [userGoal, setUserGoal] = useState("")
  const [fitnessLevel, setFitnessLevel] = useState("")
  const [generatedPlan, setGeneratedPlan] = useState<any>(null)

  const workoutPlans = {
    "weight-loss": {
      beginner: {
        name: "Fat Burning Starter",
        duration: "4 weeks",
        frequency: "3-4 days/week",
        exercises: [
          { name: "Walking/Light Jogging", sets: "1", reps: "20-30 min", muscle: "Cardio" },
          { name: "Bodyweight Squats", sets: "2", reps: "8-12", muscle: "Legs" },
          { name: "Push-ups (Modified)", sets: "2", reps: "5-10", muscle: "Chest" },
          { name: "Plank", sets: "2", reps: "15-30 sec", muscle: "Core" },
          { name: "Glute Bridges", sets: "2", reps: "10-15", muscle: "Glutes" },
        ],
      },
      intermediate: {
        name: "Fat Burning Accelerator",
        duration: "6 weeks",
        frequency: "4-5 days/week",
        exercises: [
          { name: "HIIT Cardio", sets: "1", reps: "20-25 min", muscle: "Cardio" },
          { name: "Goblet Squats", sets: "3", reps: "12-15", muscle: "Legs" },
          { name: "Push-ups", sets: "3", reps: "10-15", muscle: "Chest" },
          { name: "Mountain Climbers", sets: "3", reps: "30 sec", muscle: "Core" },
          { name: "Burpees", sets: "3", reps: "8-12", muscle: "Full Body" },
          { name: "Dumbbell Rows", sets: "3", reps: "10-12", muscle: "Back" },
        ],
      },
      advanced: {
        name: "Fat Burning Elite",
        duration: "8 weeks",
        frequency: "5-6 days/week",
        exercises: [
          { name: "Sprint Intervals", sets: "1", reps: "25-30 min", muscle: "Cardio" },
          { name: "Barbell Squats", sets: "4", reps: "8-12", muscle: "Legs" },
          { name: "Deadlifts", sets: "4", reps: "6-8", muscle: "Full Body" },
          { name: "Pull-ups", sets: "3", reps: "8-12", muscle: "Back" },
          { name: "Dips", sets: "3", reps: "10-15", muscle: "Triceps" },
          { name: "Plank to Push-up", sets: "3", reps: "10-12", muscle: "Core" },
        ],
      },
    },
    "muscle-gain": {
      beginner: {
        name: "Muscle Building Foundation",
        duration: "6 weeks",
        frequency: "3-4 days/week",
        exercises: [
          { name: "Bodyweight Squats", sets: "3", reps: "10-15", muscle: "Legs" },
          { name: "Push-ups", sets: "3", reps: "8-12", muscle: "Chest" },
          { name: "Assisted Pull-ups", sets: "3", reps: "5-8", muscle: "Back" },
          { name: "Dumbbell Shoulder Press", sets: "3", reps: "8-12", muscle: "Shoulders" },
          { name: "Plank", sets: "3", reps: "30-45 sec", muscle: "Core" },
          { name: "Glute Bridges", sets: "3", reps: "12-15", muscle: "Glutes" },
        ],
      },
      intermediate: {
        name: "Muscle Building Accelerator",
        duration: "8 weeks",
        frequency: "4-5 days/week",
        exercises: [
          { name: "Barbell Squats", sets: "4", reps: "8-10", muscle: "Legs" },
          { name: "Bench Press", sets: "4", reps: "8-10", muscle: "Chest" },
          { name: "Bent-over Rows", sets: "4", reps: "8-10", muscle: "Back" },
          { name: "Overhead Press", sets: "3", reps: "8-10", muscle: "Shoulders" },
          { name: "Romanian Deadlifts", sets: "3", reps: "10-12", muscle: "Hamstrings" },
          { name: "Dumbbell Curls", sets: "3", reps: "10-12", muscle: "Biceps" },
        ],
      },
      advanced: {
        name: "Muscle Building Elite",
        duration: "12 weeks",
        frequency: "5-6 days/week",
        exercises: [
          { name: "Deadlifts", sets: "5", reps: "5-6", muscle: "Full Body" },
          { name: "Barbell Squats", sets: "5", reps: "5-6", muscle: "Legs" },
          { name: "Bench Press", sets: "5", reps: "5-6", muscle: "Chest" },
          { name: "Pull-ups (Weighted)", sets: "4", reps: "6-8", muscle: "Back" },
          { name: "Overhead Press", sets: "4", reps: "6-8", muscle: "Shoulders" },
          { name: "Barbell Rows", sets: "4", reps: "6-8", muscle: "Back" },
        ],
      },
    },
    strength: {
      beginner: {
        name: "Strength Foundation",
        duration: "8 weeks",
        frequency: "3 days/week",
        exercises: [
          { name: "Goblet Squats", sets: "3", reps: "8-10", muscle: "Legs" },
          { name: "Push-ups", sets: "3", reps: "8-10", muscle: "Chest" },
          { name: "Inverted Rows", sets: "3", reps: "8-10", muscle: "Back" },
          { name: "Overhead Press", sets: "3", reps: "8-10", muscle: "Shoulders" },
          { name: "Plank", sets: "3", reps: "30-60 sec", muscle: "Core" },
        ],
      },
      intermediate: {
        name: "Strength Builder",
        duration: "10 weeks",
        frequency: "4 days/week",
        exercises: [
          { name: "Barbell Squats", sets: "4", reps: "5-6", muscle: "Legs" },
          { name: "Bench Press", sets: "4", reps: "5-6", muscle: "Chest" },
          { name: "Deadlifts", sets: "3", reps: "5", muscle: "Full Body" },
          { name: "Overhead Press", sets: "4", reps: "5-6", muscle: "Shoulders" },
          { name: "Barbell Rows", sets: "4", reps: "5-6", muscle: "Back" },
        ],
      },
      advanced: {
        name: "Powerlifting Protocol",
        duration: "12 weeks",
        frequency: "4-5 days/week",
        exercises: [
          { name: "Deadlifts", sets: "5", reps: "3-5", muscle: "Full Body" },
          { name: "Barbell Squats", sets: "5", reps: "3-5", muscle: "Legs" },
          { name: "Bench Press", sets: "5", reps: "3-5", muscle: "Chest" },
          { name: "Overhead Press", sets: "4", reps: "3-5", muscle: "Shoulders" },
          { name: "Barbell Rows", sets: "4", reps: "5-6", muscle: "Back" },
        ],
      },
    },
    endurance: {
      beginner: {
        name: "Endurance Foundation",
        duration: "6 weeks",
        frequency: "4-5 days/week",
        exercises: [
          { name: "Walking", sets: "1", reps: "30-45 min", muscle: "Cardio" },
          { name: "Bodyweight Squats", sets: "2", reps: "15-20", muscle: "Legs" },
          { name: "Push-ups", sets: "2", reps: "10-15", muscle: "Chest" },
          { name: "Plank", sets: "2", reps: "30-45 sec", muscle: "Core" },
          { name: "Step-ups", sets: "2", reps: "10-15 each leg", muscle: "Legs" },
        ],
      },
      intermediate: {
        name: "Endurance Builder",
        duration: "8 weeks",
        frequency: "5 days/week",
        exercises: [
          { name: "Jogging", sets: "1", reps: "30-45 min", muscle: "Cardio" },
          { name: "Circuit Training", sets: "3", reps: "45 sec each", muscle: "Full Body" },
          { name: "Jump Squats", sets: "3", reps: "15-20", muscle: "Legs" },
          { name: "Burpees", sets: "3", reps: "10-15", muscle: "Full Body" },
          { name: "Mountain Climbers", sets: "3", reps: "30-45 sec", muscle: "Core" },
        ],
      },
      advanced: {
        name: "Endurance Elite",
        duration: "10 weeks",
        frequency: "6 days/week",
        exercises: [
          { name: "Running", sets: "1", reps: "45-60 min", muscle: "Cardio" },
          { name: "HIIT Circuit", sets: "4", reps: "60 sec each", muscle: "Full Body" },
          { name: "Plyometric Squats", sets: "4", reps: "20-25", muscle: "Legs" },
          { name: "Advanced Burpees", sets: "4", reps: "15-20", muscle: "Full Body" },
          { name: "Tabata Protocol", sets: "8", reps: "20 sec on/10 sec off", muscle: "Full Body" },
        ],
      },
    },
  }

  const handleGetStarted = () => {
    if (userGoal && fitnessLevel) {
      const plan =
        workoutPlans[userGoal as keyof typeof workoutPlans]?.[
          fitnessLevel as keyof (typeof workoutPlans)[keyof typeof workoutPlans]
        ]

      if (plan) {
        setGeneratedPlan(plan)
        // Scroll to the generated plan
        setTimeout(() => {
          document.getElementById("generated-plan")?.scrollIntoView({ behavior: "smooth" })
        }, 100)
      }
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background Simulation */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920&text=Fitness+Background')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
            Transform Your Body
          </h1>
          <h2 className="text-2xl md:text-4xl font-semibold mb-4 text-gray-200">With Professional Fitness Guidance</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Master your fitness journey with comprehensive workout guides, detailed exercise instructions, and
            professional training programs designed for all skill levels.
          </p>
        </div>

        {/* AI Workout Generator */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
          <h3 className="text-2xl font-bold mb-6 text-cyan-400 flex items-center justify-center">
            <Zap className="mr-2 h-6 w-6" />
            AI Smart Workout Generator
          </h3>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Your Goal</label>
              <select
                value={userGoal}
                onChange={(e) => setUserGoal(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Select your goal</option>
                <option value="weight-loss">Weight Loss</option>
                <option value="muscle-gain">Muscle Gain</option>
                <option value="endurance">Build Endurance</option>
                <option value="strength">Increase Strength</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Fitness Level</label>
              <select
                value={fitnessLevel}
                onChange={(e) => setFitnessLevel(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Select your level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGetStarted}
            disabled={!userGoal || !fitnessLevel}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg shadow-cyan-500/25 flex items-center mx-auto"
          >
            <Target className="mr-2 h-5 w-5" />
            Generate My AI Workout Plan
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>

        {/* Generated Workout Plan */}
        {generatedPlan && (
          <div
            id="generated-plan"
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-green-500/20 shadow-2xl shadow-green-500/10"
          >
            <h3 className="text-2xl font-bold mb-6 text-green-400 flex items-center justify-center">
              <Target className="mr-2 h-6 w-6" />
              Your Personalized Workout Plan
            </h3>

            <div className="bg-gray-700/50 rounded-xl p-6 mb-6">
              <h4 className="text-xl font-bold text-cyan-400 mb-2">{generatedPlan.name}</h4>
              <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                <p>
                  <span className="text-purple-400 font-semibold">Duration:</span> {generatedPlan.duration}
                </p>
                <p>
                  <span className="text-purple-400 font-semibold">Frequency:</span> {generatedPlan.frequency}
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <h5 className="text-lg font-semibold text-cyan-400 mb-4">Your Exercises:</h5>
              {generatedPlan.exercises.map((exercise: any, index: number) => (
                <div key={index} className="bg-gray-700/30 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="bg-cyan-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div>
                      <h6 className="font-semibold text-white">{exercise.name}</h6>
                      <p className="text-sm text-gray-400">{exercise.muscle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-cyan-400 font-semibold">{exercise.sets} sets</p>
                    <p className="text-sm text-gray-400">{exercise.reps}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setActiveSection("workouts")}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
              >
                View Exercise Details
              </button>
              <button
                onClick={() => setActiveSection("dashboard")}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Track Progress
              </button>
            </div>
          </div>
        )}

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 hover:transform hover:scale-105">
            <Target className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-cyan-400">Smart Workouts</h3>
            <p className="text-gray-400">
              AI-generated personalized workout plans that adapt to your progress and goals.
            </p>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105">
            <TrendingUp className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-purple-400">Progress Analytics</h3>
            <p className="text-gray-400">
              Real-time insights and adjustments based on your workout data and performance.
            </p>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 hover:transform hover:scale-105">
            <Zap className="h-12 w-12 text-pink-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-pink-400">Nutrition AI</h3>
            <p className="text-gray-400">
              Custom meal plans generated based on your dietary preferences and fitness goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
