"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Apple, Plus, Search, Camera, Utensils, TrendingUp, Target, 
  Calendar, Clock, Zap, Heart, Brain, ChefHat, Scale, Droplets,
  BarChart3, PieChart, Award, AlertCircle, CheckCircle, Sparkles
} from "lucide-react"

interface NutritionFacts {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
  sodium: number
  vitamins: Record<string, number>
}

interface FoodItem {
  id: string
  name: string
  serving: string
  nutrition: NutritionFacts
  category: string
  imageUrl?: string
}

interface MealPlan {
  id: string
  name: string
  date: Date
  meals: {
    breakfast: FoodItem[]
    lunch: FoodItem[]
    dinner: FoodItem[]
    snacks: FoodItem[]
  }
  totalNutrition: NutritionFacts
  fitnessGoal: string
}

interface UserNutritionGoals {
  calories: number
  protein: number
  carbs: number
  fat: number
  water: number
  goal: 'weight-loss' | 'muscle-gain' | 'maintenance' | 'endurance'
}

export default function NutritionAnalysis() {
  const [activeTab, setActiveTab] = useState("tracker")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMeal, setSelectedMeal] = useState("breakfast")
  const [dailyLog, setDailyLog] = useState<FoodItem[]>([])
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [nutritionGoals, setNutritionGoals] = useState<UserNutritionGoals>({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67,
    water: 8,
    goal: 'maintenance'
  })

  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  const [currentNutrition, setCurrentNutrition] = useState<NutritionFacts>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    vitamins: {}
  })

  // Sample food database (would be replaced with API calls)
  const foodDatabase: FoodItem[] = [
    {
      id: "1",
      name: "Greek Yogurt",
      serving: "1 cup (245g)",
      category: "dairy",
      nutrition: { calories: 130, protein: 23, carbs: 9, fat: 0, fiber: 0, sugar: 9, sodium: 75, vitamins: {} }
    },
    {
      id: "2", 
      name: "Banana",
      serving: "1 medium (118g)",
      category: "fruit",
      nutrition: { calories: 105, protein: 1, carbs: 27, fat: 0, fiber: 3, sugar: 14, sodium: 1, vitamins: {} }
    },
    {
      id: "3",
      name: "Chicken Breast",
      serving: "100g",
      category: "protein",
      nutrition: { calories: 165, protein: 31, carbs: 0, fat: 4, fiber: 0, sugar: 0, sodium: 74, vitamins: {} }
    },
    {
      id: "4",
      name: "Brown Rice",
      serving: "1 cup cooked (195g)",
      category: "grains",
      nutrition: { calories: 216, protein: 5, carbs: 45, fat: 2, fiber: 4, sugar: 1, sodium: 10, vitamins: {} }
    }
  ]

  // Calculate daily nutrition totals
  useEffect(() => {
    const total = dailyLog.reduce((acc, food) => ({
      calories: acc.calories + food.nutrition.calories,
      protein: acc.protein + food.nutrition.protein,
      carbs: acc.carbs + food.nutrition.carbs,
      fat: acc.fat + food.nutrition.fat,
      fiber: acc.fiber + food.nutrition.fiber,
      sugar: acc.sugar + food.nutrition.sugar,
      sodium: acc.sodium + food.nutrition.sodium,
      vitamins: acc.vitamins
    }), {
      calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0, vitamins: {}
    })
    setCurrentNutrition(total)
  }, [dailyLog])

  // Add food to daily log
  const addFoodToLog = (food: FoodItem) => {
    setDailyLog(prev => [...prev, { ...food, id: Date.now().toString() }])
  }

  // Generate AI meal plan
  const generateAIMealPlan = async () => {
    setIsGeneratingPlan(true)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const aiMealPlan: MealPlan = {
      id: Date.now().toString(),
      name: `${nutritionGoals.goal.replace('-', ' ')} Plan`,
      date: new Date(),
      fitnessGoal: nutritionGoals.goal,
      meals: {
        breakfast: [foodDatabase[0], foodDatabase[1]], // Greek yogurt + banana
        lunch: [foodDatabase[2], foodDatabase[3]], // Chicken + rice
        dinner: [foodDatabase[2]], // Chicken
        snacks: [foodDatabase[1]] // Banana
      },
      totalNutrition: {
        calories: 1800,
        protein: 140,
        carbs: 200,
        fat: 60,
        fiber: 25,
        sugar: 45,
        sodium: 1200,
        vitamins: {}
      }
    }
    
    setMealPlans(prev => [aiMealPlan, ...prev])
    setIsGeneratingPlan(false)
  }

  // Filtered food results
  const filteredFoods = foodDatabase.filter(food => 
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 py-8 px-4 particles-bg">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-neon-gradient mb-4">
            AI Nutrition Coach
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Smart meal planning and nutrition tracking powered by advanced AI analysis
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass-card">
            <TabsTrigger value="tracker" className="flex items-center space-x-2">
              <Apple className="h-4 w-4" />
              <span>Food Tracker</span>
            </TabsTrigger>
            <TabsTrigger value="planner" className="flex items-center space-x-2">
              <ChefHat className="h-4 w-4" />
              <span>Meal Planner</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Goals</span>
            </TabsTrigger>
          </TabsList>

          {/* Food Tracker Tab */}
          <TabsContent value="tracker" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Food Search & Add */}
              <Card className="glass-card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-neon-cyan">
                    <Search className="h-6 w-6" />
                    <span>Food Search</span>
                  </CardTitle>
                  <CardDescription>Search and add foods to your daily log</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search foods..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 glass-card"
                    />
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {filteredFoods.map((food) => (
                      <div key={food.id} className="glass-card p-4 rounded-lg hover-lift">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-neon-cyan">{food.name}</h3>
                            <p className="text-sm text-gray-400">{food.serving}</p>
                            <div className="flex space-x-4 mt-2 text-xs">
                              <span>{food.nutrition.calories} cal</span>
                              <span>{food.nutrition.protein}g protein</span>
                              <span>{food.nutrition.carbs}g carbs</span>
                            </div>
                          </div>
                          <Button 
                            onClick={() => addFoodToLog(food)}
                            size="sm"
                            className="btn-neon-primary"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" className="glass-card flex-1">
                      <Camera className="h-4 w-4 mr-2" />
                      Scan Food
                    </Button>
                    <Button variant="outline" className="glass-card flex-1">
                      <Plus className="h-4 w-4 mr-2" />
                      Custom Food
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Daily Nutrition Summary */}
              <Card className="glass-card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-neon-green">
                    <PieChart className="h-6 w-6" />
                    <span>Today's Nutrition</span>
                  </CardTitle>
                  <CardDescription>Your daily nutrition progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Calories */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Calories</span>
                        <span className="text-neon-cyan">
                          {currentNutrition.calories} / {nutritionGoals.calories}
                        </span>
                      </div>
                      <Progress value={(currentNutrition.calories / nutritionGoals.calories) * 100} className="h-3" />
                    </div>

                    {/* Macros */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 glass-card rounded-xl">
                        <div className="text-lg font-bold text-neon-purple">{currentNutrition.protein}g</div>
                        <div className="text-xs text-gray-400">Protein</div>
                        <Progress value={(currentNutrition.protein / nutritionGoals.protein) * 100} className="h-1 mt-2" />
                      </div>
                      <div className="text-center p-3 glass-card rounded-xl">
                        <div className="text-lg font-bold text-neon-pink">{currentNutrition.carbs}g</div>
                        <div className="text-xs text-gray-400">Carbs</div>
                        <Progress value={(currentNutrition.carbs / nutritionGoals.carbs) * 100} className="h-1 mt-2" />
                      </div>
                      <div className="text-center p-3 glass-card rounded-xl">
                        <div className="text-lg font-bold text-neon-orange">{currentNutrition.fat}g</div>
                        <div className="text-xs text-gray-400">Fat</div>
                        <Progress value={(currentNutrition.fat / nutritionGoals.fat) * 100} className="h-1 mt-2" />
                      </div>
                    </div>

                    {/* Additional nutrients */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Fiber:</span>
                        <span>{currentNutrition.fiber}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sugar:</span>
                        <span>{currentNutrition.sugar}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sodium:</span>
                        <span>{currentNutrition.sodium}mg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Water:</span>
                        <span>{nutritionGoals.water} cups</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Log */}
            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-neon-purple">
                  <Utensils className="h-6 w-6" />
                  <span>Today's Food Log</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dailyLog.length === 0 ? (
                  <div className="text-center py-8">
                    <Apple className="h-16 w-16 text-gray-400 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">No foods logged today</h3>
                    <p className="text-gray-400">Start by searching and adding foods above</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dailyLog.map((food, index) => (
                      <div key={index} className="flex justify-between items-center p-3 glass-card rounded-lg">
                        <div>
                          <h4 className="font-medium text-neon-cyan">{food.name}</h4>
                          <p className="text-sm text-gray-400">{food.serving}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{food.nutrition.calories} cal</div>
                          <div className="text-xs text-gray-400">
                            P: {food.nutrition.protein}g | C: {food.nutrition.carbs}g | F: {food.nutrition.fat}g
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Meal Planner Tab */}
          <TabsContent value="planner" className="space-y-6">
            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-neon-pink">
                  <Brain className="h-6 w-6" />
                  <span>AI Meal Planning</span>
                </CardTitle>
                <CardDescription>Generate personalized meal plans based on your goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <Button 
                    onClick={generateAIMealPlan}
                    disabled={isGeneratingPlan}
                    className="btn-neon-primary px-8 py-3"
                  >
                    {isGeneratingPlan ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Generating Plan...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate AI Meal Plan
                      </>
                    )}
                  </Button>
                </div>

                {mealPlans.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neon-cyan">Your Meal Plans</h3>
                    {mealPlans.map((plan) => (
                      <div key={plan.id} className="glass-card p-6 rounded-xl">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-xl font-bold text-neon-gradient">{plan.name}</h4>
                            <p className="text-gray-400">Generated: {plan.date.toLocaleDateString()}</p>
                          </div>
                          <Badge className="bg-neon-cyan/20 text-neon-cyan border-neon-cyan">
                            {plan.totalNutrition.calories} calories
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          {Object.entries(plan.meals).map(([mealType, foods]) => (
                            <div key={mealType} className="glass-card p-4 rounded-lg">
                              <h5 className="font-semibold text-neon-purple capitalize mb-3">{mealType}</h5>
                              <div className="space-y-2">
                                {foods.map((food, index) => (
                                  <div key={index} className="text-sm">
                                    <div className="font-medium text-gray-200">{food.name}</div>
                                    <div className="text-gray-400">{food.nutrition.calories} cal</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 grid grid-cols-4 gap-4 text-center text-sm">
                          <div>
                            <div className="font-bold text-neon-cyan">{plan.totalNutrition.calories}</div>
                            <div className="text-gray-400">Calories</div>
                          </div>
                          <div>
                            <div className="font-bold text-neon-purple">{plan.totalNutrition.protein}g</div>
                            <div className="text-gray-400">Protein</div>
                          </div>
                          <div>
                            <div className="font-bold text-neon-pink">{plan.totalNutrition.carbs}g</div>
                            <div className="text-gray-400">Carbs</div>
                          </div>
                          <div>
                            <div className="font-bold text-neon-orange">{plan.totalNutrition.fat}g</div>
                            <div className="text-gray-400">Fat</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-neon-green">
                    <TrendingUp className="h-6 w-6" />
                    <span>Nutrition Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 glass-card rounded-xl">
                      <div className="text-3xl font-bold text-neon-cyan mb-2">
                        {Math.round((currentNutrition.calories / nutritionGoals.calories) * 100)}%
                      </div>
                      <div className="text-gray-400">Daily Calorie Goal</div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Consistency Score</span>
                        <span className="text-neon-purple font-bold">85%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Weekly Average</span>
                        <span className="text-neon-green font-bold">1,950 cal</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Protein Target</span>
                        <span className="text-neon-orange font-bold">92%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-neon-purple">
                    <Award className="h-6 w-6" />
                    <span>Achievements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 glass-card rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-sm">7-day logging streak</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 glass-card rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-sm">Protein goal achieved</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 glass-card rounded-lg">
                      <AlertCircle className="h-5 w-5 text-yellow-400" />
                      <span className="text-sm">Hydration goal pending</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-neon-orange">
                  <Target className="h-6 w-6" />
                  <span>Nutrition Goals</span>
                </CardTitle>
                <CardDescription>Customize your daily nutrition targets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Fitness Goal</Label>
                      <Select value={nutritionGoals.goal} onValueChange={(value: any) => 
                        setNutritionGoals(prev => ({ ...prev, goal: value }))
                      }>
                        <SelectTrigger className="glass-card">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weight-loss">Weight Loss</SelectItem>
                          <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="endurance">Endurance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Daily Calories: {nutritionGoals.calories}</Label>
                      <Input 
                        type="number" 
                        value={nutritionGoals.calories}
                        onChange={(e) => setNutritionGoals(prev => ({ ...prev, calories: parseInt(e.target.value) }))}
                        className="glass-card mt-2"
                      />
                    </div>

                    <div>
                      <Label>Protein (g): {nutritionGoals.protein}</Label>
                      <Input 
                        type="number" 
                        value={nutritionGoals.protein}
                        onChange={(e) => setNutritionGoals(prev => ({ ...prev, protein: parseInt(e.target.value) }))}
                        className="glass-card mt-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Carbohydrates (g): {nutritionGoals.carbs}</Label>
                      <Input 
                        type="number" 
                        value={nutritionGoals.carbs}
                        onChange={(e) => setNutritionGoals(prev => ({ ...prev, carbs: parseInt(e.target.value) }))}
                        className="glass-card mt-2"
                      />
                    </div>

                    <div>
                      <Label>Fat (g): {nutritionGoals.fat}</Label>
                      <Input 
                        type="number" 
                        value={nutritionGoals.fat}
                        onChange={(e) => setNutritionGoals(prev => ({ ...prev, fat: parseInt(e.target.value) }))}
                        className="glass-card mt-2"
                      />
                    </div>

                    <div>
                      <Label>Water (cups): {nutritionGoals.water}</Label>
                      <Input 
                        type="number" 
                        value={nutritionGoals.water}
                        onChange={(e) => setNutritionGoals(prev => ({ ...prev, water: parseInt(e.target.value) }))}
                        className="glass-card mt-2"
                      />
                    </div>
                  </div>
                </div>

                <Button className="btn-neon-primary w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save Goals
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}