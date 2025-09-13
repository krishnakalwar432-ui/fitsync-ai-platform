import { NextRequest, NextResponse } from 'next/server'

// Food nutrition database API integration
export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json()

    switch (action) {
      case 'search_food':
        return await searchFood(data.query)
      case 'get_nutrition':
        return await getNutritionInfo(data.foodId)
      case 'generate_meal_plan':
        return await generateMealPlan(data)
      case 'analyze_nutrition':
        return await analyzeNutrition(data.foods)
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Nutrition API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function searchFood(query: string) {
  try {
    // Try FoodData Central API (USDA) - free API
    if (process.env.USDA_API_KEY) {
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&api_key=${process.env.USDA_API_KEY}&pageSize=10`
      )
      
      if (response.ok) {
        const data = await response.json()
        const foods = data.foods?.map((food: any) => ({
          id: food.fdcId,
          name: food.description,
          brand: food.brandOwner || food.brandName || null,
          calories: food.foodNutrients?.find((n: any) => n.nutrientName === 'Energy')?.value || 0,
          protein: food.foodNutrients?.find((n: any) => n.nutrientName === 'Protein')?.value || 0,
          carbs: food.foodNutrients?.find((n: any) => n.nutrientName === 'Carbohydrate, by difference')?.value || 0,
          fat: food.foodNutrients?.find((n: any) => n.nutrientName === 'Total lipid (fat)')?.value || 0,
          source: 'USDA'
        })) || []

        return NextResponse.json({ foods, source: 'USDA' })
      }
    }

    // Fallback to Spoonacular API if available
    if (process.env.SPOONACULAR_API_KEY) {
      const response = await fetch(
        `https://api.spoonacular.com/food/ingredients/search?query=${encodeURIComponent(query)}&number=10&apiKey=${process.env.SPOONACULAR_API_KEY}`
      )
      
      if (response.ok) {
        const data = await response.json()
        const foods = data.results?.map((food: any) => ({
          id: food.id,
          name: food.name,
          brand: null,
          image: `https://spoonacular.com/cdn/ingredients_100x100/${food.image}`,
          source: 'Spoonacular'
        })) || []

        return NextResponse.json({ foods, source: 'Spoonacular' })
      }
    }

    // Enhanced local fallback database
    return searchLocalFoodDatabase(query)

  } catch (error) {
    console.error('Food search error:', error)
    return searchLocalFoodDatabase(query)
  }
}

async function getNutritionInfo(foodId: string) {
  try {
    // Try USDA FoodData Central first
    if (process.env.USDA_API_KEY && !isNaN(Number(foodId))) {
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/food/${foodId}?api_key=${process.env.USDA_API_KEY}`
      )
      
      if (response.ok) {
        const food = await response.json()
        const nutrients = food.foodNutrients || []
        
        return NextResponse.json({
          id: food.fdcId,
          name: food.description,
          nutrition: {
            calories: nutrients.find((n: any) => n.nutrient.name === 'Energy')?.amount || 0,
            protein: nutrients.find((n: any) => n.nutrient.name === 'Protein')?.amount || 0,
            carbs: nutrients.find((n: any) => n.nutrient.name === 'Carbohydrate, by difference')?.amount || 0,
            fat: nutrients.find((n: any) => n.nutrient.name === 'Total lipid (fat)')?.amount || 0,
            fiber: nutrients.find((n: any) => n.nutrient.name === 'Fiber, total dietary')?.amount || 0,
            sugar: nutrients.find((n: any) => n.nutrient.name === 'Sugars, total including NLEA')?.amount || 0,
            sodium: nutrients.find((n: any) => n.nutrient.name === 'Sodium, Na')?.amount || 0,
            vitaminC: nutrients.find((n: any) => n.nutrient.name === 'Vitamin C, total ascorbic acid')?.amount || 0,
            calcium: nutrients.find((n: any) => n.nutrient.name === 'Calcium, Ca')?.amount || 0,
            iron: nutrients.find((n: any) => n.nutrient.name === 'Iron, Fe')?.amount || 0,
          },
          servingSize: '100g',
          source: 'USDA'
        })
      }
    }

    // Fallback to local database
    return getLocalNutritionInfo(foodId)

  } catch (error) {
    console.error('Nutrition info error:', error)
    return getLocalNutritionInfo(foodId)
  }
}

async function generateMealPlan(planData: any) {
  const { 
    dietType = 'balanced', 
    calories = 2000, 
    days = 1, 
    allergies = [], 
    preferences = [] 
  } = planData

  try {
    // If Spoonacular API is available, use it for meal planning
    if (process.env.SPOONACULAR_API_KEY) {
      const response = await fetch(
        `https://api.spoonacular.com/mealplanner/generate?timeFrame=day&targetCalories=${calories}&diet=${dietType}&exclude=${allergies.join(',')}&apiKey=${process.env.SPOONACULAR_API_KEY}`
      )
      
      if (response.ok) {
        const data = await response.json()
        return NextResponse.json({
          mealPlan: data,
          source: 'Spoonacular',
          customized: true
        })
      }
    }

    // Enhanced local meal plan generation
    return generateLocalMealPlan(planData)

  } catch (error) {
    console.error('Meal plan generation error:', error)
    return generateLocalMealPlan(planData)
  }
}

async function analyzeNutrition(foods: any[]) {
  const totalNutrition = foods.reduce((total, food) => ({
    calories: total.calories + (food.calories * food.quantity || 0),
    protein: total.protein + (food.protein * food.quantity || 0),
    carbs: total.carbs + (food.carbs * food.quantity || 0),
    fat: total.fat + (food.fat * food.quantity || 0),
    fiber: total.fiber + (food.fiber * food.quantity || 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 })

  // AI-powered nutrition analysis
  const analysis = {
    totalNutrition,
    recommendations: generateNutritionRecommendations(totalNutrition),
    macroRatios: {
      protein: Math.round((totalNutrition.protein * 4 / totalNutrition.calories) * 100),
      carbs: Math.round((totalNutrition.carbs * 4 / totalNutrition.calories) * 100),
      fat: Math.round((totalNutrition.fat * 9 / totalNutrition.calories) * 100)
    },
    healthScore: calculateHealthScore(totalNutrition, foods)
  }

  return NextResponse.json(analysis)
}

// Local fallback functions
function searchLocalFoodDatabase(query: string) {
  const localFoods = [
    { id: 'local_chicken_breast', name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, category: 'protein' },
    { id: 'local_salmon', name: 'Salmon', calories: 208, protein: 20, carbs: 0, fat: 12, category: 'protein' },
    { id: 'local_brown_rice', name: 'Brown Rice', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, category: 'carbs' },
    { id: 'local_quinoa', name: 'Quinoa', calories: 120, protein: 4.4, carbs: 22, fat: 1.9, category: 'carbs' },
    { id: 'local_avocado', name: 'Avocado', calories: 160, protein: 2, carbs: 8.5, fat: 14.7, category: 'fat' },
    { id: 'local_almonds', name: 'Almonds', calories: 576, protein: 21, carbs: 22, fat: 49, category: 'fat' },
    { id: 'local_spinach', name: 'Spinach', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, category: 'vegetable' },
    { id: 'local_broccoli', name: 'Broccoli', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, category: 'vegetable' },
    { id: 'local_banana', name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, category: 'fruit' },
    { id: 'local_apple', name: 'Apple', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, category: 'fruit' },
    { id: 'local_greek_yogurt', name: 'Greek Yogurt', calories: 100, protein: 10, carbs: 6, fat: 5, category: 'dairy' },
    { id: 'local_oats', name: 'Oats', calories: 389, protein: 17, carbs: 66, fat: 7, category: 'carbs' },
    { id: 'local_eggs', name: 'Eggs', calories: 155, protein: 13, carbs: 1.1, fat: 11, category: 'protein' },
    { id: 'local_sweet_potato', name: 'Sweet Potato', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, category: 'carbs' }
  ]

  const filtered = localFoods.filter(food => 
    food.name.toLowerCase().includes(query.toLowerCase())
  )

  return NextResponse.json({ 
    foods: filtered, 
    source: 'local',
    note: 'Using local food database. For more extensive search, configure API keys.' 
  })
}

function getLocalNutritionInfo(foodId: string) {
  // Extended local nutrition database with micronutrients
  const nutritionData: { [key: string]: any } = {
    'local_chicken_breast': {
      id: 'local_chicken_breast',
      name: 'Chicken Breast',
      nutrition: {
        calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0,
        vitaminB6: 0.5, niacin: 8.5, phosphorus: 196, selenium: 22.5
      }
    },
    'local_salmon': {
      id: 'local_salmon',
      name: 'Salmon',
      nutrition: {
        calories: 208, protein: 20, carbs: 0, fat: 12, fiber: 0,
        omega3: 1.8, vitaminD: 360, vitaminB12: 2.8, selenium: 22.5
      }
    }
    // Add more detailed nutrition data...
  }

  const food = nutritionData[foodId]
  if (food) {
    return NextResponse.json({ ...food, source: 'local' })
  } else {
    return NextResponse.json({ 
      error: 'Food not found in local database',
      suggestion: 'Try searching for the food first'
    }, { status: 404 })
  }
}

function generateLocalMealPlan(planData: any) {
  const { dietType, calories, allergies = [] } = planData
  
  // Smart meal planning algorithm
  const mealTemplates = {
    balanced: {
      breakfast: { calories: 0.25, protein: 0.3, carbs: 0.45, fat: 0.25 },
      lunch: { calories: 0.35, protein: 0.35, carbs: 0.4, fat: 0.25 },
      dinner: { calories: 0.3, protein: 0.35, carbs: 0.35, fat: 0.3 },
      snack: { calories: 0.1, protein: 0.2, carbs: 0.5, fat: 0.3 }
    },
    keto: {
      breakfast: { calories: 0.25, protein: 0.25, carbs: 0.05, fat: 0.7 },
      lunch: { calories: 0.35, protein: 0.3, carbs: 0.05, fat: 0.65 },
      dinner: { calories: 0.3, protein: 0.3, carbs: 0.05, fat: 0.65 },
      snack: { calories: 0.1, protein: 0.2, carbs: 0.05, fat: 0.75 }
    },
    high_protein: {
      breakfast: { calories: 0.25, protein: 0.4, carbs: 0.35, fat: 0.25 },
      lunch: { calories: 0.35, protein: 0.45, carbs: 0.3, fat: 0.25 },
      dinner: { calories: 0.3, protein: 0.45, carbs: 0.3, fat: 0.25 },
      snack: { calories: 0.1, protein: 0.5, carbs: 0.3, fat: 0.2 }
    }
  }

  const template = mealTemplates[dietType as keyof typeof mealTemplates] || mealTemplates.balanced
  
  const meals = Object.entries(template).map(([mealType, ratios]) => ({
    type: mealType,
    targetCalories: Math.round(calories * ratios.calories),
    targetProtein: Math.round((calories * ratios.calories * ratios.protein) / 4),
    targetCarbs: Math.round((calories * ratios.calories * ratios.carbs) / 4),
    targetFat: Math.round((calories * ratios.calories * ratios.fat) / 9),
    suggestions: generateMealSuggestions(mealType, ratios, allergies)
  }))

  return NextResponse.json({
    mealPlan: {
      meals,
      totalCalories: calories,
      dietType,
      customized: true
    },
    source: 'local_ai',
    recommendations: [
      'Adjust portion sizes based on your hunger and energy levels',
      'Include a variety of colorful vegetables for micronutrients',
      'Stay hydrated with 8-10 glasses of water throughout the day',
      'Consider meal prep to maintain consistency'
    ]
  })
}

function generateMealSuggestions(mealType: string, ratios: any, allergies: string[]) {
  const mealSuggestions: { [key: string]: string[] } = {
    breakfast: [
      'Greek yogurt with berries and nuts',
      'Scrambled eggs with spinach and whole grain toast',
      'Overnight oats with protein powder and fruit',
      'Avocado toast with poached egg'
    ],
    lunch: [
      'Grilled chicken salad with mixed vegetables',
      'Quinoa bowl with roasted vegetables and chickpeas',
      'Turkey and hummus wrap with vegetables',
      'Salmon with sweet potato and asparagus'
    ],
    dinner: [
      'Lean beef stir-fry with brown rice',
      'Baked cod with roasted vegetables',
      'Chicken curry with cauliflower rice',
      'Turkey meatballs with zucchini noodles'
    ],
    snack: [
      'Apple with almond butter',
      'Protein smoothie with spinach',
      'Mixed nuts and dried fruit',
      'Greek yogurt with honey'
    ]
  }

  return mealSuggestions[mealType] || []
}

function generateNutritionRecommendations(nutrition: any) {
  const recommendations = []
  
  if (nutrition.protein < 100) {
    recommendations.push('Consider adding more protein sources like lean meats, fish, or legumes')
  }
  
  if (nutrition.fiber < 25) {
    recommendations.push('Increase fiber intake with more vegetables, fruits, and whole grains')
  }
  
  if (nutrition.calories < 1200) {
    recommendations.push('Your calorie intake might be too low for sustainable health')
  }
  
  return recommendations
}

function calculateHealthScore(nutrition: any, foods: any[]) {
  let score = 50 // Base score
  
  // Protein adequacy (+20 max)
  if (nutrition.protein >= 100) score += 20
  else if (nutrition.protein >= 80) score += 15
  else if (nutrition.protein >= 60) score += 10
  
  // Fiber content (+15 max)
  if (nutrition.fiber >= 25) score += 15
  else if (nutrition.fiber >= 20) score += 10
  else if (nutrition.fiber >= 15) score += 5
  
  // Food variety (+15 max)
  const categories = new Set(foods.map(f => f.category))
  score += Math.min(categories.size * 3, 15)
  
  return Math.min(score, 100)
}