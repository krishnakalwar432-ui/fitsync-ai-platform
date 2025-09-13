"use client"

import { useState } from "react"
import { Apple, Target, TrendingUp, Plus, Utensils, Calculator } from "lucide-react"

export default function NutritionPlanner() {
  const [selectedDiet, setSelectedDiet] = useState("")
  const [dailyCalories, setDailyCalories] = useState(2000)
  const [generatedMeals, setGeneratedMeals] = useState<any[]>([])

  const dietTypes = [
    { id: "balanced", label: "Balanced Diet", description: "Well-rounded nutrition for general health" },
    { id: "keto", label: "Ketogenic", description: "High fat, low carb for weight loss" },
    { id: "vegan", label: "Vegan", description: "Plant-based nutrition" },
    { id: "paleo", label: "Paleo", description: "Whole foods, no processed ingredients" },
    { id: "mediterranean", label: "Mediterranean", description: "Heart-healthy with olive oil and fish" },
    { id: "high-protein", label: "High Protein", description: "Muscle building and recovery focused" },
  ]

  const mockMeals = {
    breakfast: [
      { name: "Avocado Toast with Eggs", calories: 420, protein: 18, carbs: 32, fat: 24 },
      { name: "Greek Yogurt Parfait", calories: 280, protein: 20, carbs: 35, fat: 8 },
      { name: "Protein Smoothie Bowl", calories: 350, protein: 25, carbs: 40, fat: 12 },
    ],
    lunch: [
      { name: "Grilled Chicken Salad", calories: 380, protein: 35, carbs: 15, fat: 18 },
      { name: "Quinoa Buddha Bowl", calories: 450, protein: 16, carbs: 65, fat: 14 },
      { name: "Salmon with Sweet Potato", calories: 520, protein: 40, carbs: 35, fat: 22 },
    ],
    dinner: [
      { name: "Lean Beef Stir Fry", calories: 480, protein: 38, carbs: 28, fat: 20 },
      { name: "Baked Cod with Vegetables", calories: 320, protein: 32, carbs: 20, fat: 12 },
      { name: "Turkey Meatballs with Zucchini Noodles", calories: 360, protein: 30, carbs: 18, fat: 16 },
    ],
    snacks: [
      { name: "Mixed Nuts", calories: 180, protein: 6, carbs: 6, fat: 16 },
      { name: "Apple with Almond Butter", calories: 220, protein: 8, carbs: 25, fat: 12 },
      { name: "Protein Bar", calories: 200, protein: 20, carbs: 15, fat: 8 },
    ],
  }

  const generateMealPlan = () => {
    if (!selectedDiet) return

    // Mock AI meal generation
    const breakfast = mockMeals.breakfast[Math.floor(Math.random() * mockMeals.breakfast.length)]
    const lunch = mockMeals.lunch[Math.floor(Math.random() * mockMeals.lunch.length)]
    const dinner = mockMeals.dinner[Math.floor(Math.random() * mockMeals.dinner.length)]
    const snack = mockMeals.snacks[Math.floor(Math.random() * mockMeals.snacks.length)]

    setGeneratedMeals([
      { ...breakfast, type: "Breakfast", time: "8:00 AM" },
      { ...lunch, type: "Lunch", time: "12:30 PM" },
      { ...dinner, type: "Dinner", time: "7:00 PM" },
      { ...snack, type: "Snack", time: "3:00 PM" },
    ])
  }

  const totalNutrition = generatedMeals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  )

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            AI Nutrition Planner
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Get personalized meal plans tailored to your dietary preferences and fitness goals
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Meal Plan Generator */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
                <Calculator className="mr-2 h-5 w-5" />
                Meal Plan Generator
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Diet Type</label>
                  <div className="space-y-2">
                    {dietTypes.map((diet) => (
                      <button
                        key={diet.id}
                        onClick={() => setSelectedDiet(diet.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                          selectedDiet === diet.id
                            ? "border-cyan-500 bg-cyan-500/20 text-cyan-400"
                            : "border-gray-600 bg-gray-700/30 text-gray-300 hover:border-gray-500"
                        }`}
                      >
                        <div className="font-medium">{diet.label}</div>
                        <div className="text-xs text-gray-400 mt-1">{diet.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Daily Calorie Target: {dailyCalories}
                  </label>
                  <input
                    type="range"
                    min="1200"
                    max="3500"
                    step="50"
                    value={dailyCalories}
                    onChange={(e) => setDailyCalories(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1200</span>
                    <span>3500</span>
                  </div>
                </div>

                <button
                  onClick={generateMealPlan}
                  disabled={!selectedDiet}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center"
                >
                  <Target className="mr-2 h-5 w-5" />
                  Generate AI Meal Plan
                </button>
              </div>
            </div>

            {/* Nutrition Summary */}
            {generatedMeals.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Daily Nutrition
                </h3>

                <div className="space-y-4">
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Calories</span>
                      <span className="text-2xl font-bold text-cyan-400">{totalNutrition.calories}</span>
                    </div>
                    <div className="bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-cyan-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((totalNutrition.calories / dailyCalories) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {Math.round((totalNutrition.calories / dailyCalories) * 100)}% of daily goal
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                      <p className="text-purple-400 font-bold text-lg">{totalNutrition.protein}g</p>
                      <p className="text-xs text-gray-400">Protein</p>
                    </div>
                    <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                      <p className="text-green-400 font-bold text-lg">{totalNutrition.carbs}g</p>
                      <p className="text-xs text-gray-400">Carbs</p>
                    </div>
                    <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                      <p className="text-yellow-400 font-bold text-lg">{totalNutrition.fat}g</p>
                      <p className="text-xs text-gray-400">Fat</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Generated Meal Plan */}
          <div className="lg:col-span-2">
            {generatedMeals.length === 0 ? (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-700 text-center">
                <Apple className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-400 mb-2">No Meal Plan Generated</h3>
                <p className="text-gray-500">Select your diet type and generate your personalized AI meal plan</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
                    <Utensils className="mr-2 h-5 w-5" />
                    Today's Meal Plan
                  </h3>

                  <div className="grid gap-4">
                    {generatedMeals.map((meal, index) => (
                      <div
                        key={index}
                        className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/50 transition-colors duration-200"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-white text-lg">{meal.name}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded">{meal.type}</span>
                              <span>{meal.time}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-cyan-400 font-bold text-lg">{meal.calories} cal</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <p className="text-purple-400 font-semibold">{meal.protein}g</p>
                            <p className="text-gray-400">Protein</p>
                          </div>
                          <div className="text-center">
                            <p className="text-green-400 font-semibold">{meal.carbs}g</p>
                            <p className="text-gray-400">Carbs</p>
                          </div>
                          <div className="text-center">
                            <p className="text-yellow-400 font-semibold">{meal.fat}g</p>
                            <p className="text-gray-400">Fat</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Meal Suggestions */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center">
                    <Plus className="mr-2 h-5 w-5" />
                    Alternative Meal Options
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    {mockMeals.breakfast.slice(0, 2).map((meal, index) => (
                      <div
                        key={index}
                        className="bg-gray-700/20 rounded-lg p-4 border border-gray-600 hover:border-cyan-500/50 transition-colors duration-200"
                      >
                        <h4 className="font-semibold text-white mb-2">{meal.name}</h4>
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>{meal.calories} cal</span>
                          <span>
                            P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
