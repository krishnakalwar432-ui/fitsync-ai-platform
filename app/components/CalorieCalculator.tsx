"use client"

import { useState, useRef, useEffect } from "react"
import { Calculator, Target, TrendingUp, Activity, Plus, Minus, Search, Utensils, Coffee, Clock } from "lucide-react"

interface FoodItem {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  servingSize: string
  category: string
}

interface LoggedFood extends FoodItem {
  quantity: number
  meal: "breakfast" | "lunch" | "dinner" | "snacks"
  timestamp: Date
}

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
  const [activeTab, setActiveTab] = useState<"calculator" | "tracker">("calculator")
  const [foodSearch, setFoodSearch] = useState("")
  const [searchResults, setSearchResults] = useState<FoodItem[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [loggedFoods, setLoggedFoods] = useState<LoggedFood[]>([])
  const [selectedMeal, setSelectedMeal] = useState<"breakfast" | "lunch" | "dinner" | "snacks">("breakfast")
  const [todayStats, setTodayStats] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  })
  const searchInputRef = useRef<HTMLInputElement>(null)

  const activityLevels = {
    sedentary: { label: "Sedentary (little/no exercise)", multiplier: 1.2 },
    light: { label: "Light activity (light exercise 1-3 days/week)", multiplier: 1.375 },
    moderate: { label: "Moderate activity (moderate exercise 3-5 days/week)", multiplier: 1.55 },
    active: { label: "Very active (hard exercise 6-7 days/week)", multiplier: 1.725 },
    extra: { label: "Extra active (very hard exercise, physical job)", multiplier: 1.9 },
  }

  const foodDatabase: FoodItem[] = [
    { id: "1", name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: "100g", category: "protein" },
    { id: "2", name: "Brown Rice", calories: 111, protein: 2.6, carbs: 22, fat: 0.9, servingSize: "100g", category: "carbs" },
    { id: "3", name: "Broccoli", calories: 34, protein: 2.8, carbs: 7, fat: 0.4, servingSize: "100g", category: "vegetables" },
    { id: "4", name: "Salmon", calories: 208, protein: 25, carbs: 0, fat: 12, servingSize: "100g", category: "protein" },
    { id: "5", name: "Sweet Potato", calories: 86, protein: 1.6, carbs: 20, fat: 0.1, servingSize: "100g", category: "carbs" },
    { id: "6", name: "Avocado", calories: 160, protein: 2, carbs: 9, fat: 15, servingSize: "100g", category: "fats" },
    { id: "7", name: "Greek Yogurt", calories: 59, protein: 10, carbs: 3.6, fat: 0.4, servingSize: "100g", category: "protein" },
    { id: "8", name: "Banana", calories: 89, protein: 1.1, carbs: 23, fat: 0.3, servingSize: "100g", category: "fruits" },
    { id: "9", name: "Almonds", calories: 579, protein: 21, carbs: 22, fat: 50, servingSize: "100g", category: "fats" },
    { id: "10", name: "Oatmeal", calories: 389, protein: 17, carbs: 66, fat: 7, servingSize: "100g", category: "carbs" },
  ]

  const goals = {
    lose2: { label: "Lose 2 lbs/week", adjustment: -1000 },
    lose1: { label: "Lose 1 lb/week", adjustment: -500 },
    lose0_5: { label: "Lose 0.5 lb/week", adjustment: -250 },
    maintain: { label: "Maintain weight", adjustment: 0 },
    gain0_5: { label: "Gain 0.5 lb/week", adjustment: 250 },
    gain1: { label: "Gain 1 lb/week", adjustment: 500 },
  }

  // Update today's stats when logged foods change
  useEffect(() => {
    const today = new Date().toDateString()
    const todayFoods = loggedFoods.filter(food => food.timestamp.toDateString() === today)
    
    const stats = todayFoods.reduce((acc, food) => {
      const multiplier = food.quantity / 100
      return {
        calories: acc.calories + (food.calories * multiplier),
        protein: acc.protein + (food.protein * multiplier),
        carbs: acc.carbs + (food.carbs * multiplier),
        fat: acc.fat + (food.fat * multiplier)
      }
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 })
    
    setTodayStats({
      calories: Math.round(stats.calories),
      protein: Math.round(stats.protein * 10) / 10,
      carbs: Math.round(stats.carbs * 10) / 10,
      fat: Math.round(stats.fat * 10) / 10
    })
  }, [loggedFoods])

  // Search for foods
  useEffect(() => {
    if (foodSearch.length > 2) {
      const filtered = foodDatabase.filter(food => 
        food.name.toLowerCase().includes(foodSearch.toLowerCase())
      )
      setSearchResults(filtered.slice(0, 8))
      setShowSearchResults(true)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }, [foodSearch])

  const calculateCalories = () => {
    const { age, gender, height, weight, activityLevel, goal } = formData

    if (!age || !height || !weight) {
      alert("Please fill in all required fields")
      return
    }

    let bmr
    if (gender === "male") {
      bmr = 10 * Number.parseFloat(weight) + 6.25 * Number.parseFloat(height) - 5 * Number.parseFloat(age) + 5
    } else {
      bmr = 10 * Number.parseFloat(weight) + 6.25 * Number.parseFloat(height) - 5 * Number.parseFloat(age) - 161
    }

    const tdee = bmr * activityLevels[activityLevel as keyof typeof activityLevels].multiplier
    const targetCalories = tdee + goals[goal as keyof typeof goals].adjustment

    const protein = Math.round((targetCalories * 0.25) / 4)
    const carbs = Math.round((targetCalories * 0.45) / 4)
    const fat = Math.round((targetCalories * 0.3) / 9)

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      protein,
      carbs,
      fat,
      weeklyWeightChange: goals[goal as keyof typeof goals].adjustment / 500,
    })
  }

  const addFoodToLog = (food: FoodItem, quantity: number = 100) => {
    const loggedFood: LoggedFood = {
      ...food,
      quantity,
      meal: selectedMeal,
      timestamp: new Date()
    }
    setLoggedFoods(prev => [...prev, loggedFood])
    setFoodSearch("")
    setShowSearchResults(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Nutrition Center
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Calculate your daily calorie needs and track your nutrition with our intelligent food database
          </p>
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-2 border border-gray-700">
              <button
                onClick={() => setActiveTab("calculator")}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === "calculator"
                    ? "bg-cyan-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                <Calculator className="h-4 w-4 mr-2 inline" />
                Calorie Calculator
              </button>
              <button
                onClick={() => setActiveTab("tracker")}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === "tracker"
                    ? "bg-purple-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                <Activity className="h-4 w-4 mr-2 inline" />
                Food Tracker
              </button>
            </div>
          </div>
        </div>

        {activeTab === "calculator" ? (
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
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                    <h3 className="text-2xl font-bold text-purple-400 mb-6 flex items-center">
                      <TrendingUp className="mr-2 h-6 w-6" />
                      Your Results
                    </h3>

                    <div className="bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-lg p-6 text-center mb-6">
                      <p className="text-gray-300 mb-2">Daily Calorie Target</p>
                      <p className="text-4xl font-bold text-white">{results.targetCalories}</p>
                      <p className="text-sm text-gray-400">calories per day</p>
                    </div>

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
                </>
              ) : (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-700 text-center">
                  <Calculator className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-400 mb-2">Ready to Calculate</h3>
                  <p className="text-gray-500">
                    Fill in your information to see your personalized calorie and macro targets
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Food Tracker Tab */
          <div className="text-center py-12">
            <Activity className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">Food Tracker Coming Soon</h3>
            <p className="text-gray-500">
              Advanced food tracking with autocomplete search and macro breakdown
            </p>
          </div>
        )}
      </div>
    </div>
  )
}