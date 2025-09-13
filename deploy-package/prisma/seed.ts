import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const exercises = [
  {
    name: "Push-ups",
    description: "Classic bodyweight exercise for chest, shoulders, and triceps",
    instructions: "Start in plank position, lower body until chest nearly touches floor, push back up",
    category: "strength",
    muscleGroups: ["chest", "shoulders", "triceps"],
    equipment: ["none"],
    difficulty: "BEGINNER",
    caloriesPerMinute: 7
  },
  {
    name: "Squats",
    description: "Fundamental lower body exercise",
    instructions: "Stand with feet shoulder-width apart, lower hips back and down, return to standing",
    category: "strength",
    muscleGroups: ["legs", "glutes"],
    equipment: ["none"],
    difficulty: "BEGINNER",
    caloriesPerMinute: 8
  },
  {
    name: "Pull-ups",
    description: "Upper body pulling exercise",
    instructions: "Hang from bar with palms facing away, pull body up until chin clears bar",
    category: "strength",
    muscleGroups: ["back", "biceps"],
    equipment: ["pull_up_bar"],
    difficulty: "INTERMEDIATE",
    caloriesPerMinute: 10
  },
  {
    name: "Deadlifts",
    description: "Compound movement for posterior chain",
    instructions: "Stand with feet hip-width apart, hinge at hips to lower bar, return to standing",
    category: "strength",
    muscleGroups: ["back", "legs", "glutes"],
    equipment: ["barbell"],
    difficulty: "INTERMEDIATE",
    caloriesPerMinute: 12
  },
  {
    name: "Running",
    description: "Cardiovascular endurance exercise",
    instructions: "Maintain steady pace, focus on breathing and form",
    category: "cardio",
    muscleGroups: ["legs", "core"],
    equipment: ["none"],
    difficulty: "BEGINNER",
    caloriesPerMinute: 10
  },
  {
    name: "Burpees",
    description: "Full-body high-intensity exercise",
    instructions: "Start standing, drop to plank, do push-up, jump feet to hands, jump up",
    category: "cardio",
    muscleGroups: ["full_body"],
    equipment: ["none"],
    difficulty: "ADVANCED",
    caloriesPerMinute: 15
  },
  {
    name: "Plank",
    description: "Core stability exercise",
    instructions: "Hold plank position keeping body straight from head to heels",
    category: "core",
    muscleGroups: ["core", "shoulders"],
    equipment: ["none"],
    difficulty: "BEGINNER",
    caloriesPerMinute: 5
  },
  {
    name: "Bench Press",
    description: "Upper body pressing exercise",
    instructions: "Lie on bench, lower bar to chest, press back to start position",
    category: "strength",
    muscleGroups: ["chest", "shoulders", "triceps"],
    equipment: ["barbell", "bench"],
    difficulty: "INTERMEDIATE",
    caloriesPerMinute: 8
  },
  {
    name: "Bicycle Crunches",
    description: "Core exercise targeting obliques",
    instructions: "Lie on back, bring opposite elbow to knee in cycling motion",
    category: "core",
    muscleGroups: ["core"],
    equipment: ["none"],
    difficulty: "BEGINNER",
    caloriesPerMinute: 6
  },
  {
    name: "Mountain Climbers",
    description: "Dynamic core and cardio exercise",
    instructions: "Start in plank, alternately bring knees to chest quickly",
    category: "cardio",
    muscleGroups: ["core", "legs"],
    equipment: ["none"],
    difficulty: "INTERMEDIATE",
    caloriesPerMinute: 12
  }
]

const foods = [
  {
    name: "Chicken Breast",
    brand: "Generic",
    description: "Lean protein source",
    caloriesPer100g: 165,
    proteinPer100g: 31,
    carbsPer100g: 0,
    fatPer100g: 3.6,
    fiberPer100g: 0,
    category: "protein"
  },
  {
    name: "Brown Rice",
    description: "Whole grain carbohydrate",
    caloriesPer100g: 111,
    proteinPer100g: 2.6,
    carbsPer100g: 23,
    fatPer100g: 0.9,
    fiberPer100g: 1.8,
    category: "grain"
  },
  {
    name: "Broccoli",
    description: "Nutrient-dense vegetable",
    caloriesPer100g: 34,
    proteinPer100g: 2.8,
    carbsPer100g: 7,
    fatPer100g: 0.4,
    fiberPer100g: 2.6,
    category: "vegetable"
  },
  {
    name: "Banana",
    description: "Natural fruit with potassium",
    caloriesPer100g: 89,
    proteinPer100g: 1.1,
    carbsPer100g: 23,
    fatPer100g: 0.3,
    fiberPer100g: 2.6,
    sugarPer100g: 12,
    category: "fruit"
  },
  {
    name: "Oatmeal",
    description: "Whole grain breakfast option",
    caloriesPer100g: 389,
    proteinPer100g: 16.9,
    carbsPer100g: 66,
    fatPer100g: 6.9,
    fiberPer100g: 10.6,
    category: "grain"
  }
]

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.exercise.deleteMany()
  await prisma.food.deleteMany()

  // Seed exercises
  console.log('📚 Creating exercises...')
  for (const exercise of exercises) {
    await prisma.exercise.create({
      data: exercise
    })
  }

  // Seed foods
  console.log('🍎 Creating foods...')
  for (const food of foods) {
    await prisma.food.create({
      data: food
    })
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })