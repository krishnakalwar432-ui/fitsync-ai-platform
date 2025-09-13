import { NextRequest, NextResponse } from 'next/server'

// Exercise and workout API for real fitness data
export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json()

    switch (action) {
      case 'search_exercises':
        return await searchExercises(data)
      case 'get_exercise_details':
        return await getExerciseDetails(data.exerciseId)
      case 'generate_workout':
        return await generateWorkout(data)
      case 'analyze_workout':
        return await analyzeWorkout(data.exercises)
      case 'get_muscle_groups':
        return await getMuscleGroups()
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Workout API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function searchExercises(searchData: any) {
  const { muscle, equipment, difficulty, type, limit = 10 } = searchData

  try {
    // Try ExerciseDB API (RapidAPI) if available
    if (process.env.RAPIDAPI_KEY) {
      let url = 'https://exercisedb.p.rapidapi.com/exercises'
      
      if (muscle) {
        url = `https://exercisedb.p.rapidapi.com/exercises/target/${muscle}`
      } else if (equipment) {
        url = `https://exercisedb.p.rapidapi.com/exercises/equipment/${equipment}`
      }

      const response = await fetch(url, {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      })

      if (response.ok) {
        const exercises = await response.json()
        const formattedExercises = exercises.slice(0, limit).map((exercise: any) => ({
          id: exercise.id,
          name: exercise.name,
          target: exercise.target,
          bodyPart: exercise.bodyPart,
          equipment: exercise.equipment,
          gifUrl: exercise.gifUrl,
          instructions: exercise.instructions || [],
          secondaryMuscles: exercise.secondaryMuscles || [],
          source: 'ExerciseDB'
        }))

        return NextResponse.json({ 
          exercises: formattedExercises, 
          source: 'ExerciseDB',
          total: exercises.length 
        })
      }
    }

    // Fallback to local exercise database
    return searchLocalExercises(searchData)

  } catch (error) {
    console.error('Exercise search error:', error)
    return searchLocalExercises(searchData)
  }
}

async function getExerciseDetails(exerciseId: string) {
  try {
    // Try ExerciseDB API for detailed exercise information
    if (process.env.RAPIDAPI_KEY) {
      const response = await fetch(`https://exercisedb.p.rapidapi.com/exercises/exercise/${exerciseId}`, {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      })

      if (response.ok) {
        const exercise = await response.json()
        return NextResponse.json({
          exercise: {
            id: exercise.id,
            name: exercise.name,
            target: exercise.target,
            bodyPart: exercise.bodyPart,
            equipment: exercise.equipment,
            gifUrl: exercise.gifUrl,
            instructions: exercise.instructions || [],
            secondaryMuscles: exercise.secondaryMuscles || [],
            tips: generateExerciseTips(exercise),
            commonMistakes: generateCommonMistakes(exercise),
            variations: generateVariations(exercise),
            source: 'ExerciseDB'
          }
        })
      }
    }

    // Fallback to local exercise details
    return getLocalExerciseDetails(exerciseId)

  } catch (error) {
    console.error('Exercise details error:', error)
    return getLocalExerciseDetails(exerciseId)
  }
}

async function generateWorkout(workoutData: any) {
  const { 
    goal = 'general', 
    level = 'beginner', 
    duration = 45, 
    equipment = [], 
    targetMuscles = [],
    workoutType = 'full_body'
  } = workoutData

  try {
    // AI-powered workout generation based on parameters
    const workout = await generateSmartWorkout({
      goal,
      level,
      duration,
      equipment,
      targetMuscles,
      workoutType
    })

    return NextResponse.json({
      workout,
      metadata: {
        generated: new Date().toISOString(),
        parameters: workoutData,
        estimatedCalories: calculateEstimatedCalories(workout, level, duration),
        difficulty: calculateWorkoutDifficulty(workout.structure.mainWorkout.exercises, level)
      },
      source: 'ai_generated'
    })

  } catch (error) {
    console.error('Workout generation error:', error)
    return generateBasicWorkout(workoutData)
  }
}

async function analyzeWorkout(exercises: any[]) {
  const analysis = {
    muscleGroupBalance: analyzeMuscleGroupBalance(exercises),
    intensityDistribution: analyzeIntensityDistribution(exercises),
    recommendedModifications: generateWorkoutRecommendations(exercises),
    estimatedDuration: calculateWorkoutDuration(exercises),
    difficultyRating: calculateWorkoutDifficulty(exercises, 'intermediate'),
    recoveryTime: calculateRecoveryTime(exercises)
  }

  return NextResponse.json(analysis)
}

async function getMuscleGroups() {
  const muscleGroups = {
    primary: [
      { id: 'chest', name: 'Chest', exercises_count: 45 },
      { id: 'back', name: 'Back', exercises_count: 52 },
      { id: 'shoulders', name: 'Shoulders', exercises_count: 38 },
      { id: 'arms', name: 'Arms', exercises_count: 67 },
      { id: 'legs', name: 'Legs', exercises_count: 73 },
      { id: 'core', name: 'Core', exercises_count: 41 },
      { id: 'glutes', name: 'Glutes', exercises_count: 29 }
    ],
    secondary: [
      { id: 'biceps', name: 'Biceps', parent: 'arms' },
      { id: 'triceps', name: 'Triceps', parent: 'arms' },
      { id: 'quadriceps', name: 'Quadriceps', parent: 'legs' },
      { id: 'hamstrings', name: 'Hamstrings', parent: 'legs' },
      { id: 'calves', name: 'Calves', parent: 'legs' },
      { id: 'lats', name: 'Latissimus Dorsi', parent: 'back' },
      { id: 'traps', name: 'Trapezius', parent: 'back' },
      { id: 'delts', name: 'Deltoids', parent: 'shoulders' }
    ]
  }

  return NextResponse.json(muscleGroups)
}

// Local fallback functions
function searchLocalExercises(searchData: any) {
  const { muscle, equipment, difficulty, limit = 10 } = searchData

  const localExerciseDatabase = [
    {
      id: 'squat_001',
      name: 'Bodyweight Squat',
      target: 'quadriceps',
      bodyPart: 'legs',
      equipment: 'body weight',
      difficulty: 'beginner',
      instructions: [
        'Stand with feet shoulder-width apart',
        'Lower your body by bending knees and hips',
        'Keep chest up and back straight',
        'Lower until thighs are parallel to floor',
        'Push through heels to return to start'
      ],
      gifUrl: '/exercises/squat.gif'
    },
    {
      id: 'pushup_001',
      name: 'Push-up',
      target: 'pectorals',
      bodyPart: 'chest',
      equipment: 'body weight',
      difficulty: 'beginner',
      instructions: [
        'Start in plank position with hands under shoulders',
        'Lower chest toward ground keeping body straight',
        'Push back up to starting position',
        'Keep core engaged throughout movement'
      ],
      gifUrl: '/exercises/pushup.gif'
    },
    {
      id: 'deadlift_001',
      name: 'Deadlift',
      target: 'glutes',
      bodyPart: 'legs',
      equipment: 'barbell',
      difficulty: 'intermediate',
      instructions: [
        'Stand with feet hip-width apart, bar over mid-foot',
        'Bend at hips and knees to grab bar',
        'Keep back neutral, chest up',
        'Drive through heels to lift bar',
        'Extend hips and knees simultaneously'
      ],
      gifUrl: '/exercises/deadlift.gif'
    },
    {
      id: 'plank_001',
      name: 'Plank',
      target: 'abs',
      bodyPart: 'core',
      equipment: 'body weight',
      difficulty: 'beginner',
      instructions: [
        'Start in push-up position',
        'Rest on forearms instead of hands',
        'Keep body in straight line from head to heels',
        'Engage core and hold position',
        'Breathe normally while maintaining form'
      ],
      gifUrl: '/exercises/plank.gif'
    },
    {
      id: 'pullup_001',
      name: 'Pull-up',
      target: 'lats',
      bodyPart: 'back',
      equipment: 'pull-up bar',
      difficulty: 'advanced',
      instructions: [
        'Hang from pull-up bar with arms extended',
        'Use overhand grip, hands shoulder-width apart',
        'Pull body up until chin clears bar',
        'Lower with control to starting position',
        'Keep core engaged throughout movement'
      ],
      gifUrl: '/exercises/pullup.gif'
    },
    // Add more exercises...
  ]

  let filtered = localExerciseDatabase

  if (muscle) {
    filtered = filtered.filter(ex => ex.target.includes(muscle) || ex.bodyPart.includes(muscle))
  }
  if (equipment) {
    filtered = filtered.filter(ex => ex.equipment.includes(equipment))
  }
  if (difficulty) {
    filtered = filtered.filter(ex => ex.difficulty === difficulty)
  }

  return NextResponse.json({
    exercises: filtered.slice(0, limit),
    source: 'local',
    total: filtered.length,
    note: 'Using local exercise database. Configure RapidAPI key for extended database.'
  })
}

function getLocalExerciseDetails(exerciseId: string) {
  // Extended exercise details with tips and variations
  const exerciseDetails: { [key: string]: any } = {
    'squat_001': {
      id: 'squat_001',
      name: 'Bodyweight Squat',
      target: 'quadriceps',
      bodyPart: 'legs',
      equipment: 'body weight',
      instructions: [
        'Stand with feet shoulder-width apart',
        'Lower your body by bending knees and hips',
        'Keep chest up and back straight',
        'Lower until thighs are parallel to floor',
        'Push through heels to return to start'
      ],
      tips: [
        'Keep weight evenly distributed on both feet',
        'Imagine sitting back into a chair',
        'Keep knees aligned with toes',
        'Engage core throughout movement'
      ],
      commonMistakes: [
        'Knees caving inward',
        'Leaning too far forward',
        'Not going deep enough',
        'Rising onto toes'
      ],
      variations: [
        'Goblet Squat (with weight)',
        'Jump Squat (explosive)',
        'Bulgarian Split Squat',
        'Sumo Squat (wide stance)'
      ],
      sets: {
        beginner: '2-3 sets of 8-12 reps',
        intermediate: '3-4 sets of 12-20 reps',
        advanced: '4-5 sets of 20+ reps or add weight'
      }
    }
    // Add more detailed exercise data...
  }

  const exercise = exerciseDetails[exerciseId]
  if (exercise) {
    return NextResponse.json({ exercise, source: 'local' })
  } else {
    return NextResponse.json({
      error: 'Exercise not found in local database',
      suggestion: 'Try searching for exercises first'
    }, { status: 404 })
  }
}

function generateSmartWorkout(params: any) {
  const { goal, level, duration, equipment, targetMuscles, workoutType } = params

  // Workout templates based on goals and level
  const workoutTemplates = {
    beginner: {
      full_body: {
        warmup: 5,
        main_exercises: 4,
        sets_per_exercise: 3,
        reps_range: '8-12',
        rest_between_sets: 60,
        cooldown: 5
      },
      upper_body: {
        warmup: 5,
        main_exercises: 5,
        sets_per_exercise: 3,
        reps_range: '8-12',
        rest_between_sets: 60,
        cooldown: 5
      }
    },
    intermediate: {
      full_body: {
        warmup: 5,
        main_exercises: 6,
        sets_per_exercise: 4,
        reps_range: '8-15',
        rest_between_sets: 75,
        cooldown: 5
      }
    },
    advanced: {
      full_body: {
        warmup: 10,
        main_exercises: 8,
        sets_per_exercise: 4,
        reps_range: '6-20',
        rest_between_sets: 90,
        cooldown: 10
      }
    }
  }

  const template = (workoutTemplates as any)[level]?.[workoutType] || 
                   workoutTemplates.beginner.full_body

  // Select exercises based on parameters
  const exercises = selectExercisesForWorkout(params, template)

  return {
    name: `${level.charAt(0).toUpperCase() + level.slice(1)} ${workoutType.replace('_', ' ')} Workout`,
    goal,
    level,
    estimatedDuration: duration,
    structure: {
      warmup: {
        duration: template.warmup,
        exercises: ['Dynamic stretching', 'Light cardio', 'Joint mobility']
      },
      mainWorkout: {
        exercises,
        totalSets: exercises.length * template.sets_per_exercise,
        restBetweenSets: template.rest_between_sets
      },
      cooldown: {
        duration: template.cooldown,
        exercises: ['Static stretching', 'Deep breathing', 'Foam rolling']
      }
    },
    tips: [
      'Focus on proper form over heavy weight',
      'Adjust weight/reps based on your capability',
      'Stay hydrated throughout the workout',
      'Listen to your body and rest when needed'
    ]
  }
}

function selectExercisesForWorkout(params: any, template: any) {
  // Smart exercise selection algorithm
  const { goal, equipment, targetMuscles } = params
  
  const exercisePool = [
    { name: 'Bodyweight Squat', muscle: 'legs', equipment: 'bodyweight', compound: true },
    { name: 'Push-up', muscle: 'chest', equipment: 'bodyweight', compound: true },
    { name: 'Plank', muscle: 'core', equipment: 'bodyweight', compound: false },
    { name: 'Lunges', muscle: 'legs', equipment: 'bodyweight', compound: true },
    { name: 'Pike Push-up', muscle: 'shoulders', equipment: 'bodyweight', compound: true },
    { name: 'Glute Bridge', muscle: 'glutes', equipment: 'bodyweight', compound: false }
  ]

  // Filter by available equipment
  let availableExercises = exercisePool.filter(ex => 
    equipment.length === 0 || 
    equipment.includes(ex.equipment) || 
    ex.equipment === 'bodyweight'
  )

  // Prioritize compound movements for beginners
  if (params.level === 'beginner') {
    availableExercises = availableExercises.filter(ex => ex.compound)
  }

  // Select exercises ensuring muscle group balance
  const selectedExercises = []
  const muscleGroupsCovered = new Set()

  for (let i = 0; i < template.main_exercises && i < availableExercises.length; i++) {
    const exercise = availableExercises[i]
    selectedExercises.push({
      name: exercise.name,
      muscle: exercise.muscle,
      sets: template.sets_per_exercise,
      reps: template.reps_range,
      rest: `${template.rest_between_sets}s`,
      notes: generateExerciseNotes(exercise, params.level)
    })
    muscleGroupsCovered.add(exercise.muscle)
  }

  return selectedExercises
}

function generateExerciseNotes(exercise: any, level: string) {
  const notes = {
    beginner: 'Focus on form. Start with easier variation if needed.',
    intermediate: 'Maintain steady tempo. Challenge yourself with good form.',
    advanced: 'Consider adding resistance or increasing difficulty.'
  }
  return notes[level as keyof typeof notes] || notes.beginner
}

function generateBasicWorkout(workoutData: any) {
  const basicWorkout = {
    name: 'Basic Full Body Workout',
    exercises: [
      { name: 'Bodyweight Squat', sets: 3, reps: '10-15', muscle: 'legs' },
      { name: 'Push-up', sets: 3, reps: '8-12', muscle: 'chest' },
      { name: 'Plank', sets: 3, reps: '30-60s', muscle: 'core' },
      { name: 'Lunges', sets: 3, reps: '10 each leg', muscle: 'legs' }
    ],
    duration: 30,
    level: workoutData.level || 'beginner'
  }

  return NextResponse.json({
    workout: basicWorkout,
    source: 'basic_template',
    note: 'Using basic workout template. Full AI generation unavailable.'
  })
}

function analyzeMuscleGroupBalance(exercises: any[]) {
  const muscleGroups: { [key: string]: number } = {}
  
  exercises.forEach(exercise => {
    const muscle = exercise.muscle || exercise.target || exercise.bodyPart
    muscleGroups[muscle] = (muscleGroups[muscle] || 0) + 1
  })

  const totalExercises = exercises.length
  const balance = Object.entries(muscleGroups).map(([muscle, count]) => ({
    muscle,
    count,
    percentage: Math.round((count / totalExercises) * 100)
  }))

  return {
    distribution: balance,
    isBalanced: balance.every(group => group.percentage >= 15 && group.percentage <= 40),
    recommendations: generateBalanceRecommendations(balance)
  }
}

function analyzeIntensityDistribution(exercises: any[]) {
  // Analyze workout intensity based on exercise types
  const intensityLevels = {
    low: 0,
    moderate: 0,
    high: 0
  }

  exercises.forEach(exercise => {
    const name = exercise.name?.toLowerCase() || ''
    if (name.includes('plank') || name.includes('stretch')) {
      intensityLevels.low++
    } else if (name.includes('jump') || name.includes('sprint')) {
      intensityLevels.high++
    } else {
      intensityLevels.moderate++
    }
  })

  return intensityLevels
}

function generateWorkoutRecommendations(exercises: any[]) {
  const recommendations = []
  
  if (exercises.length < 4) {
    recommendations.push('Consider adding more exercises for a complete workout')
  }
  
  if (exercises.length > 8) {
    recommendations.push('This might be too many exercises for one session')
  }

  const muscleGroups = new Set(exercises.map(ex => ex.muscle || ex.target))
  if (muscleGroups.size < 3) {
    recommendations.push('Add exercises for more muscle groups for better balance')
  }

  return recommendations
}

function calculateWorkoutDuration(exercises: any[]) {
  // Estimate duration based on exercises, sets, and rest periods
  const avgExerciseTime = 45 // seconds per set
  const avgRestTime = 60 // seconds between sets
  const warmupCooldown = 10 // minutes

  const totalSets = exercises.reduce((total, ex) => total + (ex.sets || 3), 0)
  const workoutTime = (totalSets * avgExerciseTime + (totalSets - 1) * avgRestTime) / 60

  return Math.round(workoutTime + warmupCooldown)
}

function calculateEstimatedCalories(workout: any, level: string, duration: number) {
  const baseCaloriesPerMinute = {
    beginner: 6,
    intermediate: 8,
    advanced: 10
  }

  const rate = baseCaloriesPerMinute[level as keyof typeof baseCaloriesPerMinute] || 6
  return Math.round(duration * rate)
}

function calculateWorkoutDifficulty(exercises: any[], level: string) {
  // Simple difficulty calculation
  const difficultyMap = {
    beginner: 3,
    intermediate: 6,
    advanced: 9
  }

  return difficultyMap[level as keyof typeof difficultyMap] || 5
}

function calculateRecoveryTime(exercises: any[]) {
  const intensityScore = exercises.length * 2 // Simple calculation
  
  if (intensityScore < 10) return '24 hours'
  if (intensityScore < 20) return '48 hours'
  return '72 hours'
}

function generateBalanceRecommendations(balance: any[]) {
  const recommendations = []
  
  const underrepresented = balance.filter(group => group.percentage < 15)
  const overrepresented = balance.filter(group => group.percentage > 40)

  if (underrepresented.length > 0) {
    recommendations.push(`Add more exercises for: ${underrepresented.map(g => g.muscle).join(', ')}`)
  }

  if (overrepresented.length > 0) {
    recommendations.push(`Reduce exercises for: ${overrepresented.map(g => g.muscle).join(', ')}`)
  }

  return recommendations
}

function generateExerciseTips(exercise: any) {
  return [
    'Focus on controlled movements',
    'Maintain proper breathing throughout',
    'Start with lighter weight/easier variation',
    'Stop if you feel pain (not muscle fatigue)'
  ]
}

function generateCommonMistakes(exercise: any) {
  return [
    'Using too much weight too soon',
    'Sacrificing form for speed',
    'Holding breath during movement',
    'Not warming up properly'
  ]
}

function generateVariations(exercise: any) {
  return [
    'Beginner modification',
    'Advanced progression',
    'Equipment alternative',
    'Single-arm/leg variation'
  ]
}