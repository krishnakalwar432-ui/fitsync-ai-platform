"use client"

import { useState } from "react"
import { 
  Apple, 
  Target, 
  TrendingUp, 
  Plus, 
  Utensils, 
  Calculator,
  Calendar,
  Clock,
  ChefHat,
  ShoppingCart,
  Bookmark,
  Star,
  Users,
  Book,
  Timer,
  AlertCircle,
  CheckCircle,
  Trash2,
  Edit3,
  Save,
  X,
  Filter,
  Search,
  Heart,
  MapPin,
  Zap
} from "lucide-react"

interface Meal {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  type: string
  time: string
  prepTime?: number
  cookTime?: number
  servings?: number
  difficulty?: "Easy" | "Medium" | "Hard"
  ingredients?: string[]
  instructions?: string[]
  tags?: string[]
  image?: string
  rating?: number
  reviews?: number
}

interface WeeklyPlan {
  [key: string]: Meal[]
}

export default function NutritionPlanner() {
  const [selectedDiet, setSelectedDiet] = useState("")
  const [dailyCalories, setDailyCalories] = useState(2000)
  const [generatedMeals, setGeneratedMeals] = useState<Meal[]>([])
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "recipes" | "grocery">("daily")
  const [selectedDay, setSelectedDay] = useState("monday")
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>({})
  const [favorites, setFavorites] = useState<string[]>([])
  const [allergies, setAllergies] = useState<string[]>([])
  const [fitnessGoal, setFitnessGoal] = useState("")
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
  const [groceryList, setGroceryList] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const dietTypes = [
    { id: "balanced", label: "Balanced Diet", description: "Well-rounded nutrition for general health", macros: { protein: 25, carbs: 45, fat: 30 } },
    { id: "keto", label: "Ketogenic", description: "High fat, low carb for weight loss", macros: { protein: 20, carbs: 5, fat: 75 } },
    { id: "vegan", label: "Vegan", description: "Plant-based nutrition", macros: { protein: 15, carbs: 55, fat: 30 } },
    { id: "paleo", label: "Paleo", description: "Whole foods, no processed ingredients", macros: { protein: 30, carbs: 35, fat: 35 } },
    { id: "mediterranean", label: "Mediterranean", description: "Heart-healthy with olive oil and fish", macros: { protein: 20, carbs: 40, fat: 40 } },
    { id: "high-protein", label: "High Protein", description: "Muscle building and recovery focused", macros: { protein: 40, carbs: 30, fat: 30 } },
  ]

  const fitnessGoals = [
    { id: "weight-loss", label: "Weight Loss", description: "Lose weight and reduce body fat" },
    { id: "muscle-gain", label: "Muscle Gain", description: "Build lean muscle mass" },
    { id: "maintenance", label: "Maintenance", description: "Maintain current weight and health" },
    { id: "endurance", label: "Endurance", description: "Improve athletic performance" },
    { id: "strength", label: "Strength", description: "Increase power and strength" }
  ]

  const commonAllergies = [
    "Nuts", "Dairy", "Gluten", "Shellfish", "Eggs", "Soy", "Fish", "Sesame"
  ]

  const weekDays = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" }
  ]

  const enhancedMockMeals = {
    breakfast: [
      { 
        id: "b1", name: "Avocado Toast with Eggs", calories: 420, protein: 18, carbs: 32, fat: 24, fiber: 8,
        prepTime: 10, cookTime: 5, servings: 1, difficulty: "Easy" as const,
        ingredients: ["2 eggs", "1 slice whole grain bread", "1/2 avocado", "Salt", "Pepper", "Olive oil"],
        instructions: ["Toast bread", "Fry eggs", "Mash avocado with salt and pepper", "Assemble and serve"],
        tags: ["High Protein", "Healthy Fats", "Quick"], rating: 4.5, reviews: 234
      },
      { 
        id: "b2", name: "Greek Yogurt Parfait", calories: 280, protein: 20, carbs: 35, fat: 8, fiber: 6,
        prepTime: 5, cookTime: 0, servings: 1, difficulty: "Easy" as const,
        ingredients: ["1 cup Greek yogurt", "1/4 cup granola", "1/2 cup berries", "1 tbsp honey"],
        instructions: ["Layer yogurt in bowl", "Add granola", "Top with berries", "Drizzle honey"],
        tags: ["High Protein", "Probiotics", "No Cook"], rating: 4.7, reviews: 456
      },
      { 
        id: "b3", name: "Protein Smoothie Bowl", calories: 350, protein: 25, carbs: 40, fat: 12, fiber: 10,
        prepTime: 10, cookTime: 0, servings: 1, difficulty: "Easy" as const,
        ingredients: ["1 scoop protein powder", "1 banana", "1/2 cup spinach", "1/4 cup oats", "Almond milk"],
        instructions: ["Blend all ingredients", "Pour into bowl", "Add toppings"],
        tags: ["High Protein", "Antioxidants", "Post-Workout"], rating: 4.3, reviews: 189
      }
    ],
    lunch: [
      { 
        id: "l1", name: "Grilled Chicken Salad", calories: 380, protein: 35, carbs: 15, fat: 18, fiber: 8,
        prepTime: 15, cookTime: 10, servings: 1, difficulty: "Medium" as const,
        ingredients: ["150g chicken breast", "Mixed greens", "Cherry tomatoes", "Cucumber", "Olive oil", "Lemon"],
        instructions: ["Season and grill chicken", "Prepare vegetables", "Make dressing", "Assemble salad"],
        tags: ["High Protein", "Low Carb", "Gluten Free"], rating: 4.6, reviews: 312
      },
      { 
        id: "l2", name: "Quinoa Buddha Bowl", calories: 450, protein: 16, carbs: 65, fat: 14, fiber: 12,
        prepTime: 20, cookTime: 15, servings: 1, difficulty: "Medium" as const,
        ingredients: ["1 cup quinoa", "Roasted vegetables", "Chickpeas", "Tahini", "Lemon juice"],
        instructions: ["Cook quinoa", "Roast vegetables", "Prepare tahini dressing", "Assemble bowl"],
        tags: ["Vegetarian", "High Fiber", "Complete Protein"], rating: 4.4, reviews: 278
      },
      { 
        id: "l3", name: "Salmon with Sweet Potato", calories: 520, protein: 40, carbs: 35, fat: 22, fiber: 6,
        prepTime: 10, cookTime: 25, servings: 1, difficulty: "Medium" as const,
        ingredients: ["150g salmon fillet", "1 medium sweet potato", "Asparagus", "Olive oil", "Herbs"],
        instructions: ["Bake sweet potato", "Season salmon", "Grill salmon and asparagus", "Serve together"],
        tags: ["Omega-3", "High Protein", "Complex Carbs"], rating: 4.8, reviews: 567
      }
    ],
    dinner: [
      { 
        id: "d1", name: "Lean Beef Stir Fry", calories: 480, protein: 38, carbs: 28, fat: 20, fiber: 6,
        prepTime: 15, cookTime: 15, servings: 1, difficulty: "Medium" as const,
        ingredients: ["150g lean beef", "Mixed vegetables", "Brown rice", "Soy sauce", "Ginger", "Garlic"],
        instructions: ["Marinate beef", "Cook rice", "Stir fry beef", "Add vegetables", "Serve over rice"],
        tags: ["High Protein", "Iron Rich", "Quick Cook"], rating: 4.5, reviews: 423
      },
      { 
        id: "d2", name: "Baked Cod with Vegetables", calories: 320, protein: 32, carbs: 20, fat: 12, fiber: 8,
        prepTime: 10, cookTime: 20, servings: 1, difficulty: "Easy" as const,
        ingredients: ["150g cod fillet", "Broccoli", "Carrots", "Olive oil", "Herbs", "Lemon"],
        instructions: ["Preheat oven", "Season cod", "Prepare vegetables", "Bake together"],
        tags: ["Low Calorie", "High Protein", "Heart Healthy"], rating: 4.2, reviews: 156
      },
      { 
        id: "d3", name: "Turkey Meatballs with Zucchini Noodles", calories: 360, protein: 30, carbs: 18, fat: 16, fiber: 7,
        prepTime: 20, cookTime: 20, servings: 1, difficulty: "Medium" as const,
        ingredients: ["Ground turkey", "Zucchini", "Egg", "Breadcrumbs", "Marinara sauce", "Italian herbs"],
        instructions: ["Make meatballs", "Spiralize zucchini", "Bake meatballs", "Sauté zoodles", "Combine and serve"],
        tags: ["Low Carb", "High Protein", "Keto Friendly"], rating: 4.6, reviews: 298
      }
    ],
    snacks: [
      { 
        id: "s1", name: "Mixed Nuts", calories: 180, protein: 6, carbs: 6, fat: 16, fiber: 3,
        prepTime: 0, cookTime: 0, servings: 1, difficulty: "Easy" as const,
        ingredients: ["Almonds", "Walnuts", "Cashews", "Pistachios"],
        instructions: ["Mix nuts", "Portion into serving size"],
        tags: ["Healthy Fats", "Portable", "No Prep"], rating: 4.1, reviews: 89
      },
      { 
        id: "s2", name: "Apple with Almond Butter", calories: 220, protein: 8, carbs: 25, fat: 12, fiber: 6,
        prepTime: 2, cookTime: 0, servings: 1, difficulty: "Easy" as const,
        ingredients: ["1 medium apple", "2 tbsp almond butter"],
        instructions: ["Slice apple", "Serve with almond butter"],
        tags: ["High Fiber", "Natural Sugars", "Quick"], rating: 4.4, reviews: 167
      },
      { 
        id: "s3", name: "Protein Bar", calories: 200, protein: 20, carbs: 15, fat: 8, fiber: 5,
        prepTime: 0, cookTime: 0, servings: 1, difficulty: "Easy" as const,
        ingredients: ["Protein bar"],
        instructions: ["Unwrap and enjoy"],
        tags: ["High Protein", "Convenient", "Post-Workout"], rating: 3.9, reviews: 234
      }
    ]
  }

  const generateMealPlan = async () => {
    if (!selectedDiet) return

    try {
      // Call real nutrition API
      const response = await fetch('/api/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_meal_plan',
          data: {
            dietType: selectedDiet,
            calories: dailyCalories,
            days: 1,
            allergies,
            preferences: [fitnessGoal]
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        const mealPlan = data.mealPlan
        
        // Convert API response to component format
        const meals: Meal[] = mealPlan.meals.map((meal: any, index: number) => ({
          id: `meal_${Date.now()}_${index}`,
          name: meal.suggestions[0] || `${meal.type} Meal`,
          calories: meal.targetCalories,
          protein: meal.targetProtein,
          carbs: meal.targetCarbs,
          fat: meal.targetFat,
          fiber: Math.round(meal.targetCarbs * 0.1), // Estimate
          type: meal.type.charAt(0).toUpperCase() + meal.type.slice(1),
          time: meal.type === 'breakfast' ? '8:00 AM' :
                meal.type === 'lunch' ? '12:30 PM' :
                meal.type === 'dinner' ? '7:00 PM' : '3:00 PM',
          prepTime: 15,
          cookTime: 20,
          servings: 1,
          difficulty: "Medium" as const,
          ingredients: ["AI-generated ingredients based on your preferences"],
          instructions: ["Follow AI-generated cooking instructions"],
          tags: [selectedDiet, fitnessGoal].filter(Boolean),
          rating: 4.5,
          reviews: 100
        }))
        
        setGeneratedMeals(meals)
        
        // Generate comprehensive grocery list
        const ingredients = meals.flatMap(meal => meal.ingredients || [])
        setGroceryList([...new Set(ingredients)])
      } else {
        throw new Error('API request failed')
      }
    } catch (error) {
      console.error('Meal plan generation error:', error)
      
      // Fallback to enhanced local generation
      const breakfast = enhancedMockMeals.breakfast[Math.floor(Math.random() * enhancedMockMeals.breakfast.length)]
      const lunch = enhancedMockMeals.lunch[Math.floor(Math.random() * enhancedMockMeals.lunch.length)]
      const dinner = enhancedMockMeals.dinner[Math.floor(Math.random() * enhancedMockMeals.dinner.length)]
      const snack = enhancedMockMeals.snacks[Math.floor(Math.random() * enhancedMockMeals.snacks.length)]

      const meals: Meal[] = [
        { ...breakfast, type: "Breakfast", time: "8:00 AM" },
        { ...lunch, type: "Lunch", time: "12:30 PM" },
        { ...dinner, type: "Dinner", time: "7:00 PM" },
        { ...snack, type: "Snack", time: "3:00 PM" },
      ]

      setGeneratedMeals(meals)
      
      // Auto-generate grocery list
      const ingredients = meals.flatMap(meal => meal.ingredients || [])
      const uniqueIngredients = [...new Set(ingredients)]
      setGroceryList(uniqueIngredients)
    }
  }

  const generateWeeklyPlan = () => {
    if (!selectedDiet) return

    const newWeeklyPlan: WeeklyPlan = {}
    weekDays.forEach(day => {
      const breakfast = enhancedMockMeals.breakfast[Math.floor(Math.random() * enhancedMockMeals.breakfast.length)]
      const lunch = enhancedMockMeals.lunch[Math.floor(Math.random() * enhancedMockMeals.lunch.length)]
      const dinner = enhancedMockMeals.dinner[Math.floor(Math.random() * enhancedMockMeals.dinner.length)]
      const snack = enhancedMockMeals.snacks[Math.floor(Math.random() * enhancedMockMeals.snacks.length)]

      newWeeklyPlan[day.key] = [
        { ...breakfast, type: "Breakfast", time: "8:00 AM" },
        { ...lunch, type: "Lunch", time: "12:30 PM" },
        { ...dinner, type: "Dinner", time: "7:00 PM" },
        { ...snack, type: "Snack", time: "3:00 PM" },
      ]
    })

    setWeeklyPlan(newWeeklyPlan)
    
    // Generate comprehensive grocery list for the week
    const allIngredients = Object.values(newWeeklyPlan)
      .flat()
      .flatMap(meal => meal.ingredients || [])
    const uniqueIngredients = [...new Set(allIngredients)]
    setGroceryList(uniqueIngredients)
  }

  const toggleFavorite = (mealId: string) => {
    setFavorites(prev => 
      prev.includes(mealId) 
        ? prev.filter(id => id !== mealId)
        : [...prev, mealId]
    )
  }

  const toggleAllergy = (allergy: string) => {
    setAllergies(prev => 
      prev.includes(allergy)
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    )
  }

  const addToGroceryList = (ingredient: string) => {
    if (!groceryList.includes(ingredient)) {
      setGroceryList(prev => [...prev, ingredient])
    }
  }

  const removeFromGroceryList = (ingredient: string) => {
    setGroceryList(prev => prev.filter(item => item !== ingredient))
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neon-gradient animate-slideUp">
            FitSync AI Nutrition Planner
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Get personalized meal plans with AI-powered recommendations, complete recipes, and smart grocery lists
          </p>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="glass-card p-2 flex space-x-2">
            {[
              { key: "daily", label: "Daily Plan", icon: Calendar },
              { key: "weekly", label: "Weekly Plan", icon: Clock },
              { key: "recipes", label: "Recipe Library", icon: Book },
              { key: "grocery", label: "Grocery List", icon: ShoppingCart }
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

        {/* Daily Plan Tab */}
        {activeTab === "daily" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Enhanced Meal Plan Generator */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-neon-cyan mb-4 flex items-center">
                  <Calculator className="mr-2 h-5 w-5" />
                  AI Meal Generator
                </h3>

                <div className="space-y-6">
                  {/* Diet Type Selection */}
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
                          <div className="text-xs text-cyan-400 mt-1">
                            P: {diet.macros.protein}% | C: {diet.macros.carbs}% | F: {diet.macros.fat}%
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fitness Goal */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Fitness Goal</label>
                    <select
                      value={fitnessGoal}
                      onChange={(e) => setFitnessGoal(e.target.value)}
                      className="w-full input-neon"
                    >
                      <option value="">Select goal...</option>
                      {fitnessGoals.map((goal) => (
                        <option key={goal.id} value={goal.id}>{goal.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Allergies & Restrictions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Allergies & Restrictions</label>
                    <div className="flex flex-wrap gap-2">
                      {commonAllergies.map((allergy) => (
                        <button
                          key={allergy}
                          onClick={() => toggleAllergy(allergy)}
                          className={`px-3 py-1 rounded-full text-xs transition-all duration-200 ${
                            allergies.includes(allergy)
                              ? "bg-red-500/20 text-red-400 border border-red-500/50"
                              : "bg-gray-700/50 text-gray-300 border border-gray-600 hover:border-gray-500"
                          }`}
                        >
                          {allergy}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Calorie Target */}
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
                    className="w-full btn-neon-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Generate AI Meal Plan
                  </button>
                </div>
              </div>

              {/* Nutrition Summary */}
              {generatedMeals.length > 0 && (
                <div className="glass-card p-6">
                  <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Daily Nutrition Summary
                  </h3>

                  <div className="space-y-4">
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">Calories</span>
                        <span className="text-2xl font-bold text-cyan-400">{totalNutrition.calories}</span>
                      </div>
                      <div className="bg-gray-600 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-cyan-400 to-purple-500 h-3 rounded-full transition-all duration-500"
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

                    {/* Macro Chart */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Macro Distribution</h4>
                      <div className="grid grid-cols-3 gap-2 h-20">
                        <div className="bg-purple-500 rounded" style={{ height: `${(totalNutrition.protein * 4 / totalNutrition.calories) * 100}%` }}></div>
                        <div className="bg-green-500 rounded" style={{ height: `${(totalNutrition.carbs * 4 / totalNutrition.calories) * 100}%` }}></div>
                        <div className="bg-yellow-500 rounded" style={{ height: `${(totalNutrition.fat * 9 / totalNutrition.calories) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Generated Meal Plan */}
            <div className="lg:col-span-2">
              {generatedMeals.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <ChefHat className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-400 mb-2">No Meal Plan Generated</h3>
                  <p className="text-gray-500">Configure your preferences and generate your personalized AI meal plan</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="glass-card p-6">
                    <h3 className="text-xl font-bold text-neon-cyan mb-4 flex items-center">
                      <Utensils className="mr-2 h-5 w-5" />
                      Today's Meal Plan
                    </h3>

                    <div className="grid gap-4">
                      {generatedMeals.map((meal, index) => (
                        <div
                          key={index}
                          className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/50 transition-all duration-200 cursor-pointer"
                          onClick={() => setSelectedMeal(meal)}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-white text-lg">{meal.name}</h4>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleFavorite(meal.id)
                                  }}
                                  className={`p-1 rounded transition-colors ${
                                    favorites.includes(meal.id)
                                      ? "text-red-400"
                                      : "text-gray-400 hover:text-red-400"
                                  }`}
                                >
                                  <Heart className={`h-4 w-4 ${
                                    favorites.includes(meal.id) ? "fill-current" : ""
                                  }`} />
                                </button>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                                <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded">{meal.type}</span>
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {meal.time}
                                </span>
                                <span className="flex items-center">
                                  <Timer className="h-3 w-3 mr-1" />
                                  {meal.prepTime}min prep
                                </span>
                                {meal.rating && (
                                  <span className="flex items-center">
                                    <Star className="h-3 w-3 mr-1 text-yellow-400 fill-current" />
                                    {meal.rating}
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-1 mb-3">
                                {meal.tags?.slice(0, 3).map((tag, tagIndex) => (
                                  <span
                                    key={tagIndex}
                                    className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-1 rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <p className="text-cyan-400 font-bold text-lg">{meal.calories} cal</p>
                              <p className="text-xs text-gray-400">per serving</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-4 text-sm">
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
                            <div className="text-center">
                              <p className="text-blue-400 font-semibold">{meal.fiber || 0}g</p>
                              <p className="text-gray-400">Fiber</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div className="glass-card p-6">
                    <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center">
                      <Zap className="mr-2 h-5 w-5" />
                      AI Nutrition Insights
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                        <h4 className="font-semibold text-green-400 mb-2">🎯 Goal Alignment</h4>
                        <p className="text-gray-300 text-sm">
                          Your meal plan is well-aligned with your {fitnessGoal || 'selected'} goals. The protein content supports muscle recovery and growth.
                        </p>
                      </div>
                      <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-500/30">
                        <h4 className="font-semibold text-cyan-400 mb-2">💡 Optimization Tip</h4>
                        <p className="text-gray-300 text-sm">
                          Consider adding more fiber-rich vegetables to improve digestive health and increase satiety throughout the day.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Meal Recipe Modal */}
        {selectedMeal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-neon-cyan">{selectedMeal.name}</h3>
                  <button
                    onClick={() => setSelectedMeal(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-purple-400 mb-4">Ingredients</h4>
                    <ul className="space-y-2 mb-6">
                      {selectedMeal.ingredients?.map((ingredient, index) => (
                        <li key={index} className="flex items-center text-gray-300">
                          <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                          {ingredient}
                        </li>
                      ))}
                    </ul>

                    <h4 className="text-lg font-semibold text-cyan-400 mb-4">Instructions</h4>
                    <ol className="space-y-3">
                      {selectedMeal.instructions?.map((instruction, index) => (
                        <li key={index} className="flex items-start text-gray-300">
                          <span className="bg-cyan-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            {index + 1}
                          </span>
                          {instruction}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-green-400 mb-4">Nutrition Information</h4>
                    <div className="bg-gray-700/30 rounded-lg p-4 mb-6">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center">
                          <p className="text-cyan-400 font-bold text-2xl">{selectedMeal.calories}</p>
                          <p className="text-gray-400">Calories</p>
                        </div>
                        <div className="text-center">
                          <p className="text-purple-400 font-bold text-xl">{selectedMeal.protein}g</p>
                          <p className="text-gray-400">Protein</p>
                        </div>
                        <div className="text-center">
                          <p className="text-green-400 font-bold text-xl">{selectedMeal.carbs}g</p>
                          <p className="text-gray-400">Carbs</p>
                        </div>
                        <div className="text-center">
                          <p className="text-yellow-400 font-bold text-xl">{selectedMeal.fat}g</p>
                          <p className="text-gray-400">Fat</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Prep Time:</span>
                        <span className="text-cyan-400">{selectedMeal.prepTime} min</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Cook Time:</span>
                        <span className="text-cyan-400">{selectedMeal.cookTime} min</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Servings:</span>
                        <span className="text-cyan-400">{selectedMeal.servings}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Difficulty:</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          selectedMeal.difficulty === "Easy" ? "bg-green-500/20 text-green-400" :
                          selectedMeal.difficulty === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-red-500/20 text-red-400"
                        }`}>
                          {selectedMeal.difficulty}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        onClick={() => {
                          selectedMeal.ingredients?.forEach(ingredient => addToGroceryList(ingredient))
                          alert('Ingredients added to grocery list!')
                        }}
                        className="w-full btn-neon-primary flex items-center justify-center"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Grocery List
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
