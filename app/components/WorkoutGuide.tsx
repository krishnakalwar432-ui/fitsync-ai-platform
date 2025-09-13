"use client"

import { useState, useEffect } from "react"
import { Search, Clock, BookOpen, Heart, Printer, Play, Pause, RotateCcw, Filter, Grid, List, TrendingUp, Plus, Minus } from "lucide-react"

interface Exercise {
  id: number
  name: string
  primaryMuscle: string
  muscleGroup: string
  equipment: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  instructions: string[]
  sets: {
    beginner: string
    intermediate: string
    advanced: string
  }
  commonMistakes: string[]
  gifUrl: string
  gifAlt: string
  bodyPart: string
  tags: string[]
}

interface WorkoutLogEntry {
  id: number
  exercise: string
  sets: string
  reps: string
  weight: string
  date: string
}

export default function WorkoutGuide() {
  const [exercises] = useState<Exercise[]>([
    // Upper Body - Chest
    {
      id: 1,
      name: "Barbell Bench Press",
      primaryMuscle: "Chest",
      muscleGroup: "Upper Body",
      equipment: "Barbell",
      difficulty: "Intermediate",
      bodyPart: "Chest",
      tags: ["compound", "strength", "mass"],
      instructions: [
        "Lie flat on bench with eyes under the barbell",
        "Grip bar slightly wider than shoulder-width",
        "Unrack the bar and position it over your chest",
        "Lower bar to chest with control, touching lightly",
        "Press bar up explosively, keeping elbows at 45-degree angle",
        "Lock out arms at the top and repeat",
      ],
      sets: {
        beginner: "3 sets of 8-10 reps",
        intermediate: "4 sets of 6-8 reps",
        advanced: "5 sets of 4-6 reps",
      },
      commonMistakes: [
        "Bouncing the bar off the chest",
        "Flaring elbows too wide (90 degrees)",
        "Arching back excessively",
        "Not maintaining tight core",
      ],
      gifUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      gifAlt:
        "Barbell bench press - athlete lying on bench pressing barbell upward from chest level, elbows at 45-degree angle, feet planted firmly on ground, maintaining slight arch in lower back, full range of motion from chest to lockout",
    },
    {
      id: 2,
      name: "Push-ups",
      primaryMuscle: "Chest",
      muscleGroup: "Upper Body",
      equipment: "Bodyweight",
      difficulty: "Beginner",
      bodyPart: "Chest",
      tags: ["bodyweight", "compound", "endurance"],
      instructions: [
        "Start in plank position with hands slightly wider than shoulders",
        "Keep body in straight line from head to heels",
        "Lower chest toward ground, keeping elbows close to body",
        "Push back up to starting position",
        "Maintain tight core throughout movement",
      ],
      sets: {
        beginner: "3 sets of 5-10 reps",
        intermediate: "3 sets of 15-20 reps",
        advanced: "4 sets of 25-30 reps",
      },
      commonMistakes: [
        "Sagging hips or raising butt too high",
        "Not going through full range of motion",
        "Placing hands too wide",
        "Looking up instead of keeping neutral neck",
      ],
      gifUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      gifAlt:
        "Push-up exercise - athlete in plank position lowering chest to ground with straight body alignment, elbows tracking close to ribs, then pressing back to starting position, demonstrating full range of motion",
    },
    {
      id: 3,
      name: "Dumbbell Flyes",
      primaryMuscle: "Chest",
      muscleGroup: "Upper Body",
      equipment: "Dumbbells",
      difficulty: "Intermediate",
      bodyPart: "Chest",
      tags: ["isolation", "hypertrophy", "stretch"],
      instructions: [
        "Lie on bench holding dumbbells above chest with slight bend in elbows",
        "Lower weights in wide arc until you feel stretch in chest",
        "Keep slight bend in elbows throughout movement",
        "Squeeze chest muscles to bring weights back to starting position",
        "Control the weight on both the lowering and lifting phases",
      ],
      sets: {
        beginner: "3 sets of 10-12 reps",
        intermediate: "3 sets of 8-10 reps",
        advanced: "4 sets of 6-8 reps",
      },
      commonMistakes: [
        "Using too much weight",
        "Lowering weights too far",
        "Straightening arms completely",
        "Using momentum instead of muscle control",
      ],
      gifUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      gifAlt:
        "Dumbbell flyes - athlete lying on bench with arms extended in wide arc, lowering dumbbells until feeling chest stretch, then squeezing chest to return to starting position",
    },
    // Upper Body - Back
    {
      id: 4,
      name: "Pull-ups",
      primaryMuscle: "Lats",
      muscleGroup: "Upper Body",
      equipment: "Pull-up Bar",
      difficulty: "Intermediate",
      bodyPart: "Back",
      tags: ["compound", "strength", "bodyweight"],
      instructions: [
        "Hang from pull-up bar with overhand grip, hands shoulder-width apart",
        "Start from dead hang with arms fully extended",
        "Pull body up until chin clears the bar",
        "Lower with control back to starting position",
        "Keep core tight and avoid swinging",
      ],
      sets: {
        beginner: "3 sets of 3-5 reps (assisted)",
        intermediate: "3 sets of 6-10 reps",
        advanced: "4 sets of 12-15 reps",
      },
      commonMistakes: [
        "Using momentum or swinging",
        "Not achieving full range of motion",
        "Gripping bar too wide or too narrow",
        "Not engaging lats properly",
      ],
      gifUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      gifAlt:
        "Pull-up exercise - athlete hanging from bar with overhand grip, pulling body upward until chin clears bar, demonstrating smooth controlled movement with engaged lats and core, returning to full dead hang position",
    },
    {
      id: 5,
      name: "Bent-over Barbell Row",
      primaryMuscle: "Rhomboids",
      muscleGroup: "Upper Body",
      equipment: "Barbell",
      difficulty: "Intermediate",
      bodyPart: "Back",
      tags: ["compound", "strength", "posture"],
      instructions: [
        "Stand with feet hip-width apart, holding barbell with overhand grip",
        "Hinge at hips, keeping back straight and chest up",
        "Let arms hang straight down from shoulders",
        "Pull bar to lower chest/upper abdomen",
        "Squeeze shoulder blades together at the top",
        "Lower with control and repeat",
      ],
      sets: {
        beginner: "3 sets of 8-10 reps",
        intermediate: "4 sets of 6-8 reps",
        advanced: "4 sets of 5-6 reps",
      },
      commonMistakes: [
        "Rounding the back",
        "Using too much momentum",
        "Not squeezing shoulder blades",
        "Standing too upright",
      ],
      gifUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      gifAlt:
        "Bent-over barbell row - athlete in hinged position with straight back, pulling barbell from arms-length to lower chest, squeezing shoulder blades together, maintaining hip hinge throughout movement",
    },
    {
      id: 6,
      name: "Lat Pulldowns",
      primaryMuscle: "Lats",
      muscleGroup: "Upper Body",
      equipment: "Cable Machine",
      difficulty: "Beginner",
      bodyPart: "Back",
      tags: ["machine", "isolation", "beginner-friendly"],
      instructions: [
        "Sit at lat pulldown machine with thighs secured under pads",
        "Grip bar with wide overhand grip",
        "Lean back slightly and pull bar down to upper chest",
        "Squeeze shoulder blades together at bottom",
        "Control the weight back to starting position",
      ],
      sets: {
        beginner: "3 sets of 10-12 reps",
        intermediate: "3 sets of 8-10 reps",
        advanced: "4 sets of 6-8 reps",
      },
      commonMistakes: [
        "Pulling bar behind neck",
        "Using too much momentum",
        "Not engaging lats properly",
        "Leaning back too far",
      ],
      gifUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      gifAlt:
        "Lat pulldown - athlete seated at machine pulling bar down to upper chest with wide grip, squeezing shoulder blades together, maintaining controlled movement",
    },
    // Upper Body - Shoulders
    {
      id: 7,
      name: "Overhead Press",
      primaryMuscle: "Shoulders",
      muscleGroup: "Upper Body",
      equipment: "Barbell",
      difficulty: "Intermediate",
      bodyPart: "Shoulders",
      tags: ["compound", "strength", "core"],
      instructions: [
        "Stand with feet shoulder-width apart, core braced",
        "Hold barbell at shoulder level with overhand grip",
        "Press bar straight up overhead until arms are locked out",
        "Keep core tight and avoid arching back excessively",
        "Lower bar back to shoulder level with control",
      ],
      sets: {
        beginner: "3 sets of 8-10 reps",
        intermediate: "4 sets of 6-8 reps",
        advanced: "5 sets of 4-6 reps",
      },
      commonMistakes: [
        "Pressing bar forward instead of straight up",
        "Excessive back arch",
        "Not engaging core",
        "Incomplete lockout at top",
      ],
      gifUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      gifAlt:
        "Overhead press - athlete standing with barbell at shoulder level, pressing weight straight overhead to full lockout, maintaining tight core and neutral spine, demonstrating vertical bar path",
    },
    {
      id: 8,
      name: "Lateral Raises",
      primaryMuscle: "Side Delts",
      muscleGroup: "Upper Body",
      equipment: "Dumbbells",
      difficulty: "Beginner",
      bodyPart: "Shoulders",
      tags: ["isolation", "aesthetics", "definition"],
      instructions: [
        "Stand with dumbbells at sides, slight bend in elbows",
        "Raise weights out to sides until arms are parallel to floor",
        "Lead with pinkies, keep slight bend in elbows",
        "Lower weights with control back to starting position",
        "Focus on feeling the burn in side delts",
      ],
      sets: {
        beginner: "3 sets of 12-15 reps",
        intermediate: "3 sets of 10-12 reps",
        advanced: "4 sets of 8-10 reps",
      },
      commonMistakes: [
        "Using too much weight",
        "Raising arms too high",
        "Using momentum",
        "Not maintaining slight elbow bend",
      ],
      gifUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      gifAlt:
        "Lateral raises - athlete standing with dumbbells, raising weights out to sides until parallel to floor, leading with pinkies, maintaining slight elbow bend throughout movement",
    },
    {
      id: 9,
      name: "Face Pulls",
      primaryMuscle: "Rear Delts",
      muscleGroup: "Upper Body",
      equipment: "Cable Machine",
      difficulty: "Beginner",
      bodyPart: "Shoulders",
      tags: ["rehabilitation", "posture", "rear-delts"],
      instructions: [
        "Set cable at face height with rope attachment",
        "Grip rope with overhand grip, step back to create tension",
        "Pull rope toward face, separating hands at the end",
        "Focus on squeezing shoulder blades together",
        "Control the weight back to starting position",
      ],
      sets: {
        beginner: "3 sets of 15-20 reps",
        intermediate: "3 sets of 12-15 reps",
        advanced: "4 sets of 10-12 reps",
      },
      commonMistakes: [
        "Using too much weight",
        "Not separating hands at the end",
        "Pulling too low or too high",
        "Not squeezing shoulder blades",
      ],
      gifUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      gifAlt:
        "Face pulls - athlete pulling cable rope toward face with hands separating at the end, squeezing shoulder blades together, maintaining good posture throughout movement",
    },
    // Upper Body - Arms
    {
      id: 10,
      name: "Barbell Curls",
      primaryMuscle: "Biceps",
      muscleGroup: "Upper Body",
      equipment: "Barbell",
      difficulty: "Beginner",
      bodyPart: "Arms",
      tags: ["isolation", "biceps", "mass"],
      instructions: [
        "Stand with feet shoulder-width apart, holding barbell with underhand grip",
        "Keep elbows close to sides throughout movement",
        "Curl bar up toward chest, squeezing biceps at top",
        "Lower bar with control back to starting position",
        "Avoid swinging or using momentum",
      ],
      sets: {
        beginner: "3 sets of 10-12 reps",
        intermediate: "3 sets of 8-10 reps",
        advanced: "4 sets of 6-8 reps",
      },
      commonMistakes: [
        "Swinging the weight",
        "Moving elbows forward",
        "Not controlling the negative",
        "Using too much weight",
      ],
      gifUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      gifAlt:
        "Barbell curls - athlete standing with barbell, curling weight toward chest while keeping elbows stationary, squeezing biceps at top, controlling the negative portion",
    },
    {
      id: 11,
      name: "Tricep Dips",
      primaryMuscle: "Triceps",
      muscleGroup: "Upper Body",
      equipment: "Bodyweight",
      difficulty: "Intermediate",
      bodyPart: "Arms",
      tags: ["bodyweight", "triceps", "compound"],
      instructions: [
        "Position hands on edge of bench or parallel bars",
        "Lower body by bending elbows until upper arms are parallel to floor",
        "Keep elbows close to body, don't flare them out",
        "Push back up to starting position",
        "Keep torso upright throughout movement",
      ],
      sets: {
        beginner: "3 sets of 5-8 reps",
        intermediate: "3 sets of 10-15 reps",
        advanced: "4 sets of 15-20 reps",
      },
      commonMistakes: [
        "Going too deep and stressing shoulders",
        "Flaring elbows out wide",
        "Leaning forward too much",
        "Not going through full range of motion",
      ],
      gifUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      gifAlt:
        "Tricep dips - athlete positioned on bench or bars, lowering body by bending elbows until upper arms parallel to floor, keeping elbows close to body, pushing back to starting position",
    },
    // Core
    {
      id: 12,
      name: "Plank",
      primaryMuscle: "Abs",
      muscleGroup: "Core",
      equipment: "Bodyweight",
      difficulty: "Beginner",
      bodyPart: "Core",
      tags: ["isometric", "stability", "endurance"],
      instructions: [
        "Start in push-up position on forearms",
        "Keep body in straight line from head to heels",
        "Engage core muscles and glutes",
        "Hold position while breathing normally",
        "Avoid sagging hips or raising butt",
      ],
      sets: {
        beginner: "3 sets of 20-30 seconds",
        intermediate: "3 sets of 45-60 seconds",
        advanced: "3 sets of 90+ seconds",
      },
      commonMistakes: ["Sagging hips", "Raising butt too high", "Holding breath", "Not engaging glutes"],
      gifUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      gifAlt:
        "Plank hold - athlete in forearm plank position maintaining straight line from head to heels, engaged core and glutes, demonstrating proper body alignment and muscle activation",
    },
    {
      id: 13,
      name: "Russian Twists",
      primaryMuscle: "Obliques",
      muscleGroup: "Core",
      equipment: "Bodyweight",
      difficulty: "Beginner",
      bodyPart: "Core",
      tags: ["obliques", "rotation", "endurance"],
      instructions: [
        "Sit on ground with knees bent, feet slightly off floor",
        "Lean back slightly, keeping back straight",
        "Clasp hands together in front of chest",
        "Rotate torso left and right, touching ground beside hips",
        "Keep core engaged throughout movement",
      ],
      sets: {
        beginner: "3 sets of 20 reps (10 each side)",
        intermediate: "3 sets of 30 reps (15 each side)",
        advanced: "3 sets of 40 reps (20 each side)",
      },
      commonMistakes: [
        "Moving too fast without control",
        "Not rotating from core",
        "Letting feet touch ground",
        "Rounding back excessively",
      ],
      gifUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      gifAlt:
        "Russian twists - athlete seated with knees bent and feet elevated, rotating torso side to side while maintaining straight back, hands touching ground beside hips, demonstrating controlled oblique engagement",
    },
    {
      id: 14,
      name: "Dead Bug",
      primaryMuscle: "Deep Core",
      muscleGroup: "Core",
      equipment: "Bodyweight",
      difficulty: "Beginner",
      bodyPart: "Core",
      tags: ["stability", "coordination", "rehabilitation"],
      instructions: [
        "Lie on back with arms extended toward ceiling",
        "Bring knees to 90-degree angle, shins parallel to floor",
        "Slowly lower opposite arm and leg toward floor",
        "Return to starting position and repeat on other side",
        "Keep lower back pressed against floor throughout",
      ],
      sets: {
        beginner: "3 sets of 10 reps each side",
        intermediate: "3 sets of 12 reps each side",
        advanced: "3 sets of 15 reps each side",
      },
      commonMistakes: [
        "Allowing lower back to arch",
        "Moving too quickly",
        "Not maintaining 90-degree knee angle",
        "Holding breath during movement",
      ],
      gifUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      gifAlt:
        "Dead bug - athlete lying on back with arms up and knees at 90 degrees, slowly lowering opposite arm and leg while keeping lower back pressed to floor, alternating sides with control",
    },
    // Lower Body
    {
      id: 15,
      name: "Barbell Back Squat",
      primaryMuscle: "Quads",
      muscleGroup: "Lower Body",
      equipment: "Barbell",
      difficulty: "Intermediate",
      bodyPart: "Legs",
      tags: ["compound", "strength", "mass"],
      instructions: [
        "Position barbell on upper back, not neck",
        "Stand with feet shoulder-width apart, toes slightly out",
        "Initiate movement by pushing hips back",
        "Lower until thighs are parallel to ground",
        "Drive through heels to return to starting position",
        "Keep chest up and core braced throughout",
      ],
      sets: {
        beginner: "3 sets of 8-10 reps",
        intermediate: "4 sets of 6-8 reps",
        advanced: "5 sets of 4-6 reps",
      },
      commonMistakes: ["Knees caving inward", "Not reaching proper depth", "Leaning too far forward", "Rising on toes"],
      gifUrl: "https://images.unsplash.com/photo-1566241134207-d4108a82e2a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      gifAlt:
        "Barbell back squat - athlete with barbell positioned on upper back, squatting down until thighs parallel to ground, knees tracking over toes, chest up, then driving through heels to stand, demonstrating full range of motion",
    },
    {
      id: 16,
      name: "Romanian Deadlift",
      primaryMuscle: "Hamstrings",
      muscleGroup: "Lower Body",
      equipment: "Barbell",
      difficulty: "Intermediate",
      bodyPart: "Legs",
      tags: ["compound", "hamstrings", "posterior-chain"],
      instructions: [
        "Hold barbell with overhand grip, hands shoulder-width apart",
        "Stand with feet hip-width apart, slight bend in knees",
        "Hinge at hips, pushing butt back",
        "Lower bar along legs, feeling stretch in hamstrings",
        "Drive hips forward to return to starting position",
        "Keep bar close to body throughout movement",
      ],
      sets: {
        beginner: "3 sets of 8-10 reps",
        intermediate: "4 sets of 6-8 reps",
        advanced: "4 sets of 5-6 reps",
      },
      commonMistakes: [
        "Rounding the back",
        "Bending knees too much",
        "Not feeling stretch in hamstrings",
        "Bar drifting away from body",
      ],
      gifUrl: "https://images.unsplash.com/photo-1566241134207-d4108a82e2a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      gifAlt:
        "Romanian deadlift - athlete holding barbell, hinging at hips while keeping slight knee bend, lowering bar along legs until feeling hamstring stretch, then driving hips forward to return upright, maintaining straight back",
    },
    {
      id: 17,
      name: "Bulgarian Split Squats",
      primaryMuscle: "Quads",
      muscleGroup: "Lower Body",
      equipment: "Bodyweight",
      difficulty: "Intermediate",
      bodyPart: "Legs",
      tags: ["unilateral", "balance", "strength"],
      instructions: [
        "Stand 2-3 feet in front of bench or elevated surface",
        "Place top of rear foot on bench behind you",
        "Lower into lunge position until front thigh is parallel to ground",
        "Keep most of weight on front leg",
        "Push through front heel to return to starting position",
      ],
      sets: {
        beginner: "3 sets of 8-10 reps each leg",
        intermediate: "3 sets of 10-12 reps each leg",
        advanced: "4 sets of 12-15 reps each leg",
      },
      commonMistakes: [
        "Putting too much weight on back foot",
        "Leaning forward too much",
        "Not going deep enough",
        "Allowing front knee to cave inward",
      ],
      gifUrl: "https://images.unsplash.com/photo-1566241134207-d4108a82e2a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      gifAlt:
        "Bulgarian split squat - athlete with rear foot elevated on bench, lowering into lunge position until front thigh parallel to ground, keeping weight on front leg, pushing through heel to return up",
    },
    {
      id: 18,
      name: "Hip Thrusts",
      primaryMuscle: "Glutes",
      muscleGroup: "Lower Body",
      equipment: "Barbell",
      difficulty: "Intermediate",
      bodyPart: "Glutes",
      tags: ["glutes", "hip-hinge", "strength"],
      instructions: [
        "Sit with upper back against bench, barbell over hips",
        "Plant feet firmly on ground, knees bent at 90 degrees",
        "Drive through heels to lift hips up",
        "Squeeze glutes hard at the top",
        "Lower hips with control back to starting position",
      ],
      sets: {
        beginner: "3 sets of 10-12 reps",
        intermediate: "3 sets of 8-10 reps",
        advanced: "4 sets of 6-8 reps",
      },
      commonMistakes: [
        "Not squeezing glutes at top",
        "Overextending at the top",
        "Not maintaining neutral spine",
        "Using knees instead of glutes",
      ],
      gifUrl: "https://images.unsplash.com/photo-1566241134207-d4108a82e2a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      gifAlt:
        "Hip thrust - athlete with upper back on bench and barbell over hips, driving through heels to lift hips up while squeezing glutes, maintaining neutral spine throughout movement",
    },
    {
      id: 19,
      name: "Calf Raises",
      primaryMuscle: "Calves",
      muscleGroup: "Lower Body",
      equipment: "Bodyweight",
      difficulty: "Beginner",
      bodyPart: "Calves",
      tags: ["isolation", "endurance", "definition"],
      instructions: [
        "Stand with balls of feet on elevated surface",
        "Let heels drop below the level of your toes",
        "Rise up on toes as high as possible",
        "Squeeze calves at the top",
        "Lower with control back to starting position",
      ],
      sets: {
        beginner: "3 sets of 15-20 reps",
        intermediate: "3 sets of 20-25 reps",
        advanced: "4 sets of 25-30 reps",
      },
      commonMistakes: [
        "Not going through full range of motion",
        "Bouncing at the bottom",
        "Not squeezing at the top",
        "Using momentum instead of muscle",
      ],
      gifUrl: "https://images.unsplash.com/photo-1566241134207-d4108a82e2a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      gifAlt:
        "Calf raises - athlete standing on elevated surface with balls of feet, rising up on toes as high as possible while squeezing calves, then lowering heels below toe level for full stretch",
    },
    // Full Body Compound
    {
      id: 20,
      name: "Burpees",
      primaryMuscle: "Full Body",
      muscleGroup: "Full-Body Compound",
      equipment: "Bodyweight",
      difficulty: "Intermediate",
      bodyPart: "Full Body",
      tags: ["cardio", "explosive", "conditioning"],
      instructions: [
        "Start standing with feet shoulder-width apart",
        "Drop into squat position, place hands on ground",
        "Jump feet back into plank position",
        "Perform push-up (optional)",
        "Jump feet back to squat position",
        "Explode up with arms overhead",
      ],
      sets: {
        beginner: "3 sets of 5-8 reps",
        intermediate: "3 sets of 10-15 reps",
        advanced: "4 sets of 15-20 reps",
      },
      commonMistakes: [
        "Not maintaining plank position",
        "Incomplete range of motion",
        "Landing hard on feet",
        "Not engaging core during plank",
      ],
      gifUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      gifAlt:
        "Burpee exercise - athlete performing complete sequence from standing to squat, plank position with push-up, back to squat, then explosive jump with arms overhead, demonstrating fluid full-body movement",
    },
    {
      id: 21,
      name: "Deadlifts",
      primaryMuscle: "Full Body",
      muscleGroup: "Full-Body Compound",
      equipment: "Barbell",
      difficulty: "Advanced",
      bodyPart: "Full Body",
      tags: ["compound", "strength", "powerlifting"],
      instructions: [
        "Stand with feet hip-width apart, bar over mid-foot",
        "Bend at hips and knees to grip bar with hands outside legs",
        "Keep chest up, back straight, and core braced",
        "Drive through heels and hips to lift bar",
        "Stand tall with shoulders back at the top",
        "Lower bar with control back to starting position",
      ],
      sets: {
        beginner: "3 sets of 5-6 reps",
        intermediate: "4 sets of 4-5 reps",
        advanced: "5 sets of 3-4 reps",
      },
      commonMistakes: [
        "Rounding the back",
        "Bar drifting away from body",
        "Not engaging lats",
        "Hyperextending at the top",
      ],
      gifUrl: "https://images.unsplash.com/photo-1566241134207-d4108a82e2a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      gifAlt:
        "Deadlift - athlete with barbell over mid-foot, bending at hips and knees to grip bar, maintaining straight back while driving through heels and hips to lift bar to standing position",
    },
    {
      id: 22,
      name: "Thrusters",
      primaryMuscle: "Full Body",
      muscleGroup: "Full-Body Compound",
      equipment: "Dumbbells",
      difficulty: "Advanced",
      bodyPart: "Full Body",
      tags: ["compound", "conditioning", "explosive"],
      instructions: [
        "Hold dumbbells at shoulder level in front squat position",
        "Perform a full squat, keeping chest up",
        "As you stand up, press dumbbells overhead",
        "Use momentum from legs to help with press",
        "Lower weights back to shoulders and repeat",
      ],
      sets: {
        beginner: "3 sets of 8-10 reps",
        intermediate: "3 sets of 10-12 reps",
        advanced: "4 sets of 12-15 reps",
      },
      commonMistakes: [
        "Not squatting deep enough",
        "Pressing too early",
        "Not using leg drive",
        "Poor coordination between squat and press",
      ],
      gifUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      gifAlt:
        "Thrusters - athlete holding dumbbells at shoulders, performing full squat then explosively standing while pressing weights overhead, demonstrating coordinated full-body movement",
    },
  ])

  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>(exercises)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("All")
  const [selectedBodyPart, setSelectedBodyPart] = useState("All")
  const [selectedEquipment, setSelectedEquipment] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"name" | "difficulty" | "muscle">("name")
  const [favorites, setFavorites] = useState<number[]>([])
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [currentReps, setCurrentReps] = useState(0)
  const [workoutLog, setWorkoutLog] = useState<WorkoutLogEntry[]>([])

  // Timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((seconds) => seconds + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const toggleTimer = () => setIsTimerRunning(!isTimerRunning)
  const resetTimer = () => {
    setTimerSeconds(0)
    setIsTimerRunning(false)
  }

  // Enhanced filtering logic
  useEffect(() => {
    let filtered = exercises

    if (searchTerm) {
      filtered = filtered.filter(
        (exercise) =>
          exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exercise.primaryMuscle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exercise.bodyPart.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exercise.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedMuscleGroup !== "All") {
      filtered = filtered.filter((exercise) => exercise.muscleGroup === selectedMuscleGroup)
    }

    if (selectedBodyPart !== "All") {
      filtered = filtered.filter((exercise) => exercise.bodyPart === selectedBodyPart)
    }

    if (selectedEquipment !== "All") {
      filtered = filtered.filter((exercise) => exercise.equipment === selectedEquipment)
    }

    if (selectedDifficulty !== "All") {
      filtered = filtered.filter((exercise) => exercise.difficulty === selectedDifficulty)
    }

    // Sort exercises
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "difficulty":
          const difficultyOrder = { "Beginner": 1, "Intermediate": 2, "Advanced": 3 }
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        case "muscle":
          return a.primaryMuscle.localeCompare(b.primaryMuscle)
        default:
          return 0
      }
    })

    setFilteredExercises(filtered)
  }, [searchTerm, selectedMuscleGroup, selectedBodyPart, selectedEquipment, selectedDifficulty, sortBy, exercises])

  const toggleFavorite = (exerciseId: number) => {
    setFavorites((prev) => (prev.includes(exerciseId) ? prev.filter((id) => id !== exerciseId) : [...prev, exerciseId]))
  }

  const logWorkout = (exercise: Exercise, sets: string, reps: string, weight: string) => {
    const logEntry = {
      id: Date.now(),
      exercise: exercise.name,
      sets,
      reps,
      weight,
      date: new Date().toLocaleDateString(),
    }
    setWorkoutLog((prev) => [...prev, logEntry])
  }

  const printWorkout = () => {
    const printContent = `
      <h1>Fit Pro - Workout Plan</h1>
      <p>Generated on: ${new Date().toLocaleDateString()}</p>
      ${filteredExercises
        .map(
          (exercise) => `
        <div style="margin-bottom: 20px; page-break-inside: avoid;">
          <h3>${exercise.name} (${exercise.primaryMuscle})</h3>
          <p><strong>Equipment:</strong> ${exercise.equipment}</p>
          <p><strong>Difficulty:</strong> ${exercise.difficulty}</p>
          <p><strong>Sets/Reps:</strong> ${exercise.sets.intermediate}</p>
        </div>
      `,
        )
        .join("")}
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Workout Plan</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            ${printContent}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const muscleGroups = ["All", "Upper Body", "Core", "Lower Body", "Full-Body Compound"]
  const bodyParts = ["All", "Chest", "Back", "Shoulders", "Arms", "Core", "Legs", "Glutes", "Calves", "Full Body"]
  const equipmentTypes = ["All", "Bodyweight", "Barbell", "Dumbbells", "Cable Machine", "Pull-up Bar"]
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"]

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Complete Workout Guide
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Master your form with detailed exercise instructions, proper technique guides, and progressive training
            programs
          </p>
        </div>

        {/* Enhanced Timer Widget */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <Clock className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
                <span className="text-3xl font-mono font-bold text-white block">{formatTime(timerSeconds)}</span>
                <span className="text-sm text-gray-400">Workout Time</span>
              </div>
              
              <div className="text-center">
                <TrendingUp className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                <span className="text-3xl font-mono font-bold text-white block">{workoutLog.length}</span>
                <span className="text-sm text-gray-400">Exercises Done</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={toggleTimer}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                  isTimerRunning
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{isTimerRunning ? "Pause" : "Start"} Timer</span>
              </button>
              <button
                onClick={resetTimer}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>
              <button
                onClick={printWorkout}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Printer className="h-4 w-4" />
                <span>Print Plan</span>
              </button>
            </div>
          </div>
          
          {/* Quick Rep Counter */}
          {isTimerRunning && (
            <div className="mt-6 bg-gray-700/30 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-cyan-400 mb-3 text-center">Quick Rep Counter</h4>
              <div className="flex items-center justify-center space-x-6">
                <button
                  onClick={() => setCurrentReps(Math.max(0, currentReps - 1))}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-3 rounded-full transition-colors"
                >
                  <Minus className="h-6 w-6" />
                </button>
                <div className="text-center">
                  <span className="text-4xl font-bold text-white block">{currentReps}</span>
                  <span className="text-sm text-gray-400">Reps</span>
                </div>
                <button
                  onClick={() => setCurrentReps(currentReps + 1)}
                  className="bg-green-500/20 hover:bg-green-500/30 text-green-400 p-3 rounded-full transition-colors"
                >
                  <Plus className="h-6 w-6" />
                </button>
              </div>
              <div className="flex justify-center mt-4 space-x-3">
                <button
                  onClick={() => setCurrentReps(0)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm transition-colors"
                >
                  Reset Reps
                </button>
                <button
                  onClick={() => {
                    // Log current set
                    alert(`Logged: ${currentReps} reps completed!`)
                    setCurrentReps(0)
                  }}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm transition-colors"
                >
                  Log Set
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8">
          {/* Search and View Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search exercises, muscles, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid" ? "bg-cyan-500 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list" ? "bg-cyan-500 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Filter Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            {/* Muscle Group Filter */}
            <select
              value={selectedMuscleGroup}
              onChange={(e) => setSelectedMuscleGroup(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              {muscleGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>

            {/* Body Part Filter */}
            <select
              value={selectedBodyPart}
              onChange={(e) => setSelectedBodyPart(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              {bodyParts.map((part) => (
                <option key={part} value={part}>
                  {part}
                </option>
              ))}
            </select>

            {/* Equipment Filter */}
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              {equipmentTypes.map((equipment) => (
                <option key={equipment} value={equipment}>
                  {equipment}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "difficulty" | "muscle")}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="difficulty">Sort by Difficulty</option>
              <option value="muscle">Sort by Muscle</option>
            </select>
          </div>

          {/* Results Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 text-gray-300">
              <span className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-1 text-cyan-400" />
                {filteredExercises.length} exercises found
              </span>
              {favorites.length > 0 && (
                <span className="flex items-center">
                  <Heart className="h-4 w-4 mr-1 text-red-400 fill-current" />
                  {favorites.length} favorites
                </span>
              )}
            </div>
            
            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm("")
                setSelectedMuscleGroup("All")
                setSelectedBodyPart("All")
                setSelectedEquipment("All")
                setSelectedDifficulty("All")
                setSortBy("name")
              }}
              className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors mt-4 sm:mt-0"
            >
              <Filter className="h-4 w-4 mr-2 inline" />
              Clear Filters
            </button>
          </div>
        </div>

        {/* Exercise Grid/List View */}
        {viewMode === "grid" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExercises.map((exercise) => (
              <div
                key={exercise.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105 group"
              >
                {/* Exercise Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={exercise.gifUrl}
                    alt={exercise.gifAlt}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                  
                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(exercise.id)}
                    className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
                      favorites.includes(exercise.id)
                        ? "bg-red-500 text-white scale-110"
                        : "bg-gray-800/80 text-gray-300 hover:text-red-400 hover:bg-gray-700"
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${
                      favorites.includes(exercise.id) ? "fill-current" : ""
                    }`} />
                  </button>
                  
                  {/* Exercise Tags */}
                  <div className="absolute top-4 left-4">
                    <div className="flex flex-wrap gap-1">
                      {exercise.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-cyan-500/80 text-white text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">{exercise.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-cyan-400 font-medium">{exercise.primaryMuscle}</p>
                      <span className="text-sm text-gray-300">{exercise.bodyPart}</span>
                    </div>
                  </div>
                </div>

                {/* Exercise Info */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        exercise.difficulty === "Beginner"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : exercise.difficulty === "Intermediate"
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {exercise.difficulty}
                    </span>
                    <span className="text-sm text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
                      {exercise.equipment}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2">Recommended Sets/Reps:</p>
                    <p className="text-cyan-400 font-medium">{exercise.sets.intermediate}</p>
                  </div>

                  <button
                    onClick={() => setSelectedExercise(exercise)}
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center group-hover:scale-105"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredExercises.map((exercise) => (
              <div
                key={exercise.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 p-6"
              >
                <div className="flex items-center space-x-6">
                  <img
                    src={exercise.gifUrl}
                    alt={exercise.gifAlt}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{exercise.name}</h3>
                        <p className="text-cyan-400">{exercise.primaryMuscle} • {exercise.bodyPart}</p>
                      </div>
                      
                      <button
                        onClick={() => toggleFavorite(exercise.id)}
                        className={`p-2 rounded-full transition-colors ${
                          favorites.includes(exercise.id)
                            ? "bg-red-500 text-white"
                            : "bg-gray-700 text-gray-300 hover:text-red-400"
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${
                          favorites.includes(exercise.id) ? "fill-current" : ""
                        }`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          exercise.difficulty === "Beginner"
                            ? "bg-green-500/20 text-green-400"
                            : exercise.difficulty === "Intermediate"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {exercise.difficulty}
                      </span>
                      <span className="text-sm text-gray-400">{exercise.equipment}</span>
                      <span className="text-sm text-cyan-400">{exercise.sets.intermediate}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {exercise.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => setSelectedExercise(exercise)}
                        className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Exercise Detail Modal */}
        {selectedExercise && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <img
                  src={selectedExercise.gifUrl || "/placeholder.svg"}
                  alt={selectedExercise.gifAlt}
                  className="w-full h-80 object-cover rounded-t-2xl"
                />
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="absolute top-4 right-4 bg-gray-900/80 text-white p-2 rounded-full hover:bg-gray-900 text-xl"
                >
                  ×
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedExercise.name}</h2>
                  <div className="flex items-center justify-between">
                    <p className="text-xl text-cyan-400 font-medium">
                      {selectedExercise.primaryMuscle} • {selectedExercise.equipment}
                    </p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedExercise.difficulty === "Beginner"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : selectedExercise.difficulty === "Intermediate"
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}>
                      {selectedExercise.difficulty}
                    </span>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedExercise.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-cyan-500/80 text-white text-sm px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-cyan-400 mb-4">Instructions</h3>
                    <ol className="space-y-2 mb-6">
                      {selectedExercise.instructions.map((instruction, index) => (
                        <li key={index} className="flex items-start text-gray-300">
                          <span className="bg-cyan-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            {index + 1}
                          </span>
                          {instruction}
                        </li>
                      ))}
                    </ol>

                    <h4 className="text-lg font-semibold text-red-400 mb-3">Common Mistakes</h4>
                    <ul className="space-y-2">
                      {selectedExercise.commonMistakes.map((mistake, index) => (
                        <li key={index} className="flex items-start text-gray-300">
                          <span className="text-red-400 mr-2">•</span>
                          {mistake}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-purple-400 mb-4">Sets & Reps by Level</h3>
                    <div className="space-y-4 mb-6">
                      <div className="bg-green-500/20 rounded-lg p-4">
                        <h5 className="font-semibold text-green-400 mb-1">Beginner</h5>
                        <p className="text-gray-300">{selectedExercise.sets.beginner}</p>
                      </div>
                      <div className="bg-yellow-500/20 rounded-lg p-4">
                        <h5 className="font-semibold text-yellow-400 mb-1">Intermediate</h5>
                        <p className="text-gray-300">{selectedExercise.sets.intermediate}</p>
                      </div>
                      <div className="bg-red-500/20 rounded-lg p-4">
                        <h5 className="font-semibold text-red-400 mb-1">Advanced</h5>
                        <p className="text-gray-300">{selectedExercise.sets.advanced}</p>
                      </div>
                    </div>

                    <h4 className="text-lg font-semibold text-cyan-400 mb-3">Log Your Workout</h4>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Sets (e.g., 3)"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                      />
                      <input
                        type="text"
                        placeholder="Reps (e.g., 10)"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                      />
                      <input
                        type="text"
                        placeholder="Weight (e.g., 135 lbs)"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                      />
                      <button
                        onClick={() => {
                          // Log workout functionality would go here
                          alert("Workout logged successfully!")
                        }}
                        className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300"
                      >
                        Log Workout
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
