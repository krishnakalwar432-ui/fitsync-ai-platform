"use client"

import { useState } from "react"
import { Calculator, Target, TrendingUp, Activity } from "lucide-react"

export default function CalorieCalculator() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "male",
    height: "",
    weight: "",
    activityLevel: "sedentary",
    goal: "maintain",
  })
  const [results, setResults] = useState<any>(null)

  const activityLevels = {
    sedentary: { label: "Sedentary (little/no exercise)", multiplier: 1.2 },
    light: { label: "Light activity (light exercise 1-3 days/week)", multiplier: 1.375 },
    moderate: { label: "Moderate activity (moderate exercise 3-5 days/week)", multiplier: 1.55 },
    active: { label: "Very active (hard exercise 6-7 days/week)", multiplier: 1.725 },
    extra: { label: "Extra active (very hard exercise, physical job)", multiplier: 1.9 },
  }

  const goals = {
    lose2: { label: "Lose 2 lbs/week", adjustment: -1000 },
    lose1: { label: "Lose 1 lb/week", adjustment: -500 },
    lose0_5: { label: "Lose 0.5 lb/week", adjustment: -250 },
    maintain: { label: "Maintain weight", adjustment: 0 },
    gain0_5: { label: "Gain 0.5 lb/week", adjustment: 250 },
    gain1: { label: "Gain 1 lb/week", adjustment: 500 },
  }

  const calculateCalories = () => {
    const { age, gender, height, weight, activityLevel, goal } = formData

    if (!age || !height || !weight) {
      alert("Please fill in all required fields")
      return
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr
    if (gender === "male") {
      bmr = 10 * Number.parseFloat(weight) + 6.25 * Number.parseFloat(height) - 5 * Number.parseFloat(age) + 5
    } else {
      bmr = 10 * Number.parseFloat(weight) + 6.25 * Number.parseFloat(height) - 5 * Number.parseFloat(age) - 161
    }

    // Calculate TDEE (Total Daily Energy Expenditure)
    const tdee = bmr * activityLevels[activityLevel as keyof typeof activityLevels].multiplier

    // Adjust for goal
    const targetCalories = tdee + goals[goal as keyof typeof goals].adjustment

    // Calculate macronutrient breakdown
    const protein = Math.round((targetCalories * 0.25) / 4) // 25% protein
    const carbs = Math.round((targetCalories * 0.45) / 4) // 45% carbs
    const fat = Math.round((targetCalories * 0.3) / 9) // 30% fat

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      protein,
      carbs,
      fat,
      weeklyWeightChange: goals[goal as keyof typeof goals].adjustment / 500, // 1 lb = 3500 calories, so 500 cal/day = 1 lb/week
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Calorie Calculator
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Calculate your daily calorie needs and macronutrient breakdown based on your goals
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center">
              <Calculator className="mr-2 h-6 w-6" />
              Personal Information
            </h2>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Age *</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Enter your age"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Height (cm) *</label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange("height", e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Enter height in cm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Weight (kg) *</label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Enter weight in kg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Activity Level</label>
                <select
                  value={formData.activityLevel}
                  onChange={(e) => handleInputChange("activityLevel", e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  {Object.entries(activityLevels).map(([key, level]) => (
                    <option key={key} value={key}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Goal</label>
                <select
                  value={formData.goal}
                  onChange={(e) => handleInputChange("goal", e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  {Object.entries(goals).map(([key, goal]) => (
                    <option key={key} value={key}>
                      {goal.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={calculateCalories}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center"
              >
                <Target className="mr-2 h-5 w-5" />
                Calculate My Calories
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results ? (
              <>
                {/* Calorie Results */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                  <h3 className="text-2xl font-bold text-purple-400 mb-6 flex items-center">
                    <TrendingUp className="mr-2 h-6 w-6" />
                    Your Results
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-sm mb-1">BMR</p>
                      <p className="text-2xl font-bold text-cyan-400">{results.bmr}</p>
                      <p className="text-xs text-gray-500">calories/day</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-sm mb-1">TDEE</p>
                      <p className="text-2xl font-bold text-green-400">{results.tdee}</p>
                      <p className="text-xs text-gray-500">calories/day</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-lg p-6 text-center mb-6">
                    <p className="text-gray-300 mb-2">Daily Calorie Target</p>
                    <p className="text-4xl font-bold text-white">{results.targetCalories}</p>
                    <p className="text-sm text-gray-400">calories per day</p>
                  </div>

                  <div className="text-center">
                    <p className="text-gray-300">
                      Expected weight change:
                      <span
                        className={`font-bold ml-2 ${results.weeklyWeightChange > 0 ? "text-green-400" : results.weeklyWeightChange < 0 ? "text-red-400" : "text-yellow-400"}`}
                      >
                        {results.weeklyWeightChange > 0 ? "+" : ""}
                        {results.weeklyWeightChange} lbs/week
                      </span>
                    </p>
                  </div>
                </div>

                {/* Macronutrient Breakdown */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                  <h3 className="text-2xl font-bold text-green-400 mb-6 flex items-center">
                    <Activity className="mr-2 h-6 w-6" />
                    Macronutrient Breakdown
                  </h3>

                  <div className="space-y-4">
                    <div className="bg-purple-500/20 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-purple-400 font-semibold">Protein (25%)</span>
                        <span className="text-white font-bold">{results.protein}g</span>
                      </div>
                      <div className="bg-gray-700 rounded-full h-2">
                        <div className="bg-purple-400 h-2 rounded-full" style={{ width: "25%" }}></div>
                      </div>
                    </div>

                    <div className="bg-green-500/20 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-green-400 font-semibold">Carbohydrates (45%)</span>
                        <span className="text-white font-bold">{results.carbs}g</span>
                      </div>
                      <div className="bg-gray-700 rounded-full h-2">
                        <div className="bg-green-400 h-2 rounded-full" style={{ width: "45%" }}></div>
                      </div>
                    </div>

                    <div className="bg-yellow-500/20 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-yellow-400 font-semibold">Fat (30%)</span>
                        <span className="text-white font-bold">{results.fat}g</span>
                      </div>
                      <div className="bg-gray-700 rounded-full h-2">
                        <div className="bg-yellow-400 h-2 rounded-full" style={{ width: "30%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                  <h3 className="text-xl font-bold text-cyan-400 mb-4">💡 Tips for Success</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Track your food intake to stay within your calorie target</li>
                    <li>• Weigh yourself weekly at the same time of day</li>
                    <li>• Adjust calories if you're not seeing expected results after 2-3 weeks</li>
                    <li>• Stay hydrated and get adequate sleep</li>
                    <li>• Focus on whole, nutrient-dense foods</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-700 text-center">
                <Calculator className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-400 mb-2">Ready to Calculate</h3>
                <p className="text-gray-500">
                  Fill in your information and click calculate to see your personalized calorie and macro targets
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
