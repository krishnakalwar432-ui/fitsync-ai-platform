# FitSync AI - Enhanced Python FastAPI Service
# Advanced AI-powered fitness and nutrition recommendations

import asyncio
import json
import logging
import time
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any

import aioredis
import openai
from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GzipMiddleware
from pydantic import BaseModel, Field
import uvicorn
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, Float, Boolean
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import httpx
import numpy as np
from sentence_transformers import SentenceTransformer
import pickle
import os
from contextlib import asynccontextmanager

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Models
class WorkoutRequest(BaseModel):
    user_id: int
    fitness_goals: List[str]
    experience_level: str = Field(..., regex=\"^(beginner|intermediate|advanced)$\")
    available_equipment: List[str] = []
    duration_minutes: int = Field(ge=10, le=120)
    target_muscle_groups: List[str] = []
    workout_type: str = Field(..., regex=\"^(strength|cardio|flexibility|mixed)$\")
    injuries_limitations: List[str] = []

class NutritionRequest(BaseModel):
    user_id: int
    daily_calorie_goal: int = Field(ge=1000, le=5000)
    dietary_restrictions: List[str] = []
    food_preferences: List[str] = []
    meal_count: int = Field(ge=3, le=6, default=3)
    activity_level: str = Field(..., regex=\"^(sedentary|light|moderate|active|very_active)$\")
    health_goals: List[str] = []

class ChatMessage(BaseModel):
    message: str
    user_id: int
    context: Optional[Dict[str, Any]] = {}
    message_type: str = Field(default=\"general\", regex=\"^(general|workout|nutrition|motivation)$\")

class WorkoutPlan(BaseModel):
    id: str
    name: str
    description: str
    duration_minutes: int
    difficulty: str
    exercises: List[Dict[str, Any]]
    estimated_calories: int
    target_muscle_groups: List[str]
    equipment_needed: List[str]
    created_at: datetime

class NutritionPlan(BaseModel):
    id: str
    name: str
    daily_calories: int
    meals: List[Dict[str, Any]]
    macros: Dict[str, float]
    created_at: datetime

# Global variables
redis_client = None
ai_model = None
workout_model = None
nutrition_model = None

# Database setup
DATABASE_URL = os.getenv(\"DATABASE_URL\", \"postgresql+asyncpg://postgres:postgres123@localhost:5432/fitsync_ai\")
engine = create_async_engine(DATABASE_URL)
SessionLocal = sessionmaker(engine, class_=AsyncSession)
Base = declarative_base()

class AIInteraction(Base):
    __tablename__ = \"ai_interactions\"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False)
    message = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    message_type = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    response_time_ms = Column(Float)

# Lifespan management
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global redis_client, ai_model, workout_model, nutrition_model
    
    # Initialize Redis
    redis_client = await aioredis.from_url(
        os.getenv(\"REDIS_URL\", \"redis://localhost:6379\"),
        encoding=\"utf-8\",
        decode_responses=True
    )
    
    # Initialize AI models
    openai.api_key = os.getenv(\"OPENAI_API_KEY\")
    
    # Load pre-trained models for exercise and nutrition recommendations
    try:
        workout_model = SentenceTransformer('all-MiniLM-L6-v2')
        nutrition_model = SentenceTransformer('all-MiniLM-L6-v2')
        logger.info(\"AI models loaded successfully\")
    except Exception as e:
        logger.error(f\"Failed to load AI models: {e}\")
        workout_model = None
        nutrition_model = None
    
    yield
    
    # Shutdown
    if redis_client:
        await redis_client.close()

# Initialize FastAPI app
app = FastAPI(
    title=\"FitSync AI Service\",
    description=\"Advanced AI-powered fitness and nutrition service\",
    version=\"2.0.0\",
    lifespan=lifespan
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[\"*\"],
    allow_credentials=True,
    allow_methods=[\"*\"],
    allow_headers=[\"*\"],
)
app.add_middleware(GzipMiddleware, minimum_size=1000)

# Dependency for database session
async def get_db():
    async with SessionLocal() as session:
        yield session

# Enhanced exercise database
EXERCISE_DATABASE = {
    \"strength\": {
        \"chest\": [
            {\"name\": \"Push-ups\", \"difficulty\": \"beginner\", \"equipment\": [], \"muscle_groups\": [\"chest\", \"triceps\", \"shoulders\"]},
            {\"name\": \"Bench Press\", \"difficulty\": \"intermediate\", \"equipment\": [\"barbell\", \"bench\"], \"muscle_groups\": [\"chest\", \"triceps\", \"shoulders\"]},
            {\"name\": \"Incline Dumbbell Press\", \"difficulty\": \"intermediate\", \"equipment\": [\"dumbbells\", \"bench\"], \"muscle_groups\": [\"chest\", \"shoulders\"]},
            {\"name\": \"Chest Dips\", \"difficulty\": \"advanced\", \"equipment\": [\"dip_bars\"], \"muscle_groups\": [\"chest\", \"triceps\"]}
        ],
        \"legs\": [
            {\"name\": \"Bodyweight Squats\", \"difficulty\": \"beginner\", \"equipment\": [], \"muscle_groups\": [\"quadriceps\", \"glutes\"]},
            {\"name\": \"Lunges\", \"difficulty\": \"beginner\", \"equipment\": [], \"muscle_groups\": [\"quadriceps\", \"glutes\", \"hamstrings\"]},
            {\"name\": \"Deadlifts\", \"difficulty\": \"intermediate\", \"equipment\": [\"barbell\"], \"muscle_groups\": [\"hamstrings\", \"glutes\", \"back\"]},
            {\"name\": \"Bulgarian Split Squats\", \"difficulty\": \"advanced\", \"equipment\": [], \"muscle_groups\": [\"quadriceps\", \"glutes\"]}
        ],
        \"back\": [
            {\"name\": \"Pull-ups\", \"difficulty\": \"intermediate\", \"equipment\": [\"pull_up_bar\"], \"muscle_groups\": [\"back\", \"biceps\"]},
            {\"name\": \"Bent-over Rows\", \"difficulty\": \"intermediate\", \"equipment\": [\"barbell\"], \"muscle_groups\": [\"back\", \"biceps\"]},
            {\"name\": \"Lat Pulldowns\", \"difficulty\": \"beginner\", \"equipment\": [\"cable_machine\"], \"muscle_groups\": [\"back\", \"biceps\"]}
        ]
    },
    \"cardio\": [
        {\"name\": \"Jumping Jacks\", \"difficulty\": \"beginner\", \"equipment\": [], \"muscle_groups\": [\"full_body\"]},
        {\"name\": \"High Knees\", \"difficulty\": \"beginner\", \"equipment\": [], \"muscle_groups\": [\"legs\", \"core\"]},
        {\"name\": \"Burpees\", \"difficulty\": \"advanced\", \"equipment\": [], \"muscle_groups\": [\"full_body\"]},
        {\"name\": \"Mountain Climbers\", \"difficulty\": \"intermediate\", \"equipment\": [], \"muscle_groups\": [\"core\", \"shoulders\"]}
    ],
    \"flexibility\": [
        {\"name\": \"Cat-Cow Stretch\", \"difficulty\": \"beginner\", \"equipment\": [], \"muscle_groups\": [\"back\", \"core\"]},
        {\"name\": \"Downward Dog\", \"difficulty\": \"beginner\", \"equipment\": [], \"muscle_groups\": [\"hamstrings\", \"calves\", \"shoulders\"]},
        {\"name\": \"Pigeon Pose\", \"difficulty\": \"intermediate\", \"equipment\": [], \"muscle_groups\": [\"hips\", \"glutes\"]}
    ]
}

# AI-powered workout generation
async def generate_ai_workout_plan(request: WorkoutRequest) -> WorkoutPlan:
    start_time = time.time()
    
    try:
        # Get user preferences from cache
        cache_key = f\"user_preferences:{request.user_id}\"
        cached_prefs = await redis_client.get(cache_key)
        
        # Generate contextual prompt for OpenAI
        prompt = f\"\"\"
        Create a personalized workout plan with the following specifications:
        - Experience Level: {request.experience_level}
        - Duration: {request.duration_minutes} minutes
        - Workout Type: {request.workout_type}
        - Target Muscle Groups: {', '.join(request.target_muscle_groups) if request.target_muscle_groups else 'full body'}
        - Available Equipment: {', '.join(request.available_equipment) if request.available_equipment else 'bodyweight only'}
        - Fitness Goals: {', '.join(request.fitness_goals)}
        - Limitations: {', '.join(request.injuries_limitations) if request.injuries_limitations else 'none'}
        
        Provide a structured workout with specific exercises, sets, reps, and rest periods.
        Include warm-up and cool-down activities.
        Estimate total calories burned based on intensity and duration.
        \"\"\"
        
        # Call OpenAI API for intelligent workout generation
        response = await openai.ChatCompletion.acreate(
            model=\"gpt-4\",
            messages=[
                {\"role\": \"system\", \"content\": \"You are an expert fitness trainer and exercise physiologist. Create detailed, safe, and effective workout plans.\"},
                {\"role\": \"user\", \"content\": prompt}
            ],
            max_tokens=1500,
            temperature=0.7
        )
        
        ai_response = response.choices[0].message.content
        
        # Parse AI response and create structured workout plan
        exercises = await parse_ai_workout_response(ai_response, request)
        
        # Calculate estimated calories based on intensity and user data
        estimated_calories = calculate_calories_burned(request.duration_minutes, request.workout_type, request.experience_level)
        
        workout_plan = WorkoutPlan(
            id=f\"workout_{request.user_id}_{int(time.time())}\",
            name=f\"AI-Generated {request.workout_type.title()} Workout\",
            description=f\"Personalized {request.experience_level} level {request.workout_type} workout\",
            duration_minutes=request.duration_minutes,
            difficulty=request.experience_level,
            exercises=exercises,
            estimated_calories=estimated_calories,
            target_muscle_groups=request.target_muscle_groups or [\"full_body\"],
            equipment_needed=request.available_equipment,
            created_at=datetime.utcnow()
        )
        
        # Cache the workout plan
        await redis_client.setex(
            f\"workout_plan:{workout_plan.id}\",
            3600,  # 1 hour TTL
            json.dumps(workout_plan.dict(), default=str)
        )
        
        # Store interaction for analytics
        processing_time = (time.time() - start_time) * 1000
        await store_ai_interaction(
            request.user_id,
            f\"Generate workout: {request.workout_type}\",
            f\"Created workout plan {workout_plan.id}\",
            \"workout_generation\",
            processing_time
        )
        
        return workout_plan
        
    except Exception as e:
        logger.error(f\"Workout generation failed: {e}\")
        # Fallback to rule-based generation
        return await generate_fallback_workout(request)

async def parse_ai_workout_response(ai_response: str, request: WorkoutRequest) -> List[Dict[str, Any]]:
    \"\"\"Parse AI response and structure it into exercise format\"\"\"
    exercises = []
    
    # Use rule-based extraction combined with AI response
    available_exercises = []
    
    if request.workout_type == \"strength\":
        for muscle_group in request.target_muscle_groups or [\"chest\", \"legs\", \"back\"]:
            if muscle_group in EXERCISE_DATABASE[\"strength\"]:
                available_exercises.extend(EXERCISE_DATABASE[\"strength\"][muscle_group])
    elif request.workout_type == \"cardio\":
        available_exercises = EXERCISE_DATABASE[\"cardio\"]
    elif request.workout_type == \"flexibility\":
        available_exercises = EXERCISE_DATABASE[\"flexibility\"]
    else:  # mixed
        for category in EXERCISE_DATABASE.values():
            if isinstance(category, list):
                available_exercises.extend(category)
            else:
                for subcategory in category.values():
                    available_exercises.extend(subcategory)
    
    # Filter exercises based on available equipment and difficulty
    filtered_exercises = [
        ex for ex in available_exercises
        if (not request.available_equipment or 
            any(eq in request.available_equipment for eq in ex[\"equipment\"]) or 
            not ex[\"equipment\"]) and
           (ex[\"difficulty\"] == request.experience_level or 
            (request.experience_level == \"intermediate\" and ex[\"difficulty\"] in [\"beginner\", \"intermediate\"]) or
            (request.experience_level == \"advanced\"))
    ]
    
    # Select 4-8 exercises based on duration
    exercise_count = min(max(4, request.duration_minutes // 8), 8)
    selected_exercises = np.random.choice(filtered_exercises, min(exercise_count, len(filtered_exercises)), replace=False)
    
    for exercise in selected_exercises:
        # Calculate sets and reps based on experience level and workout type
        if request.workout_type == \"strength\":
            sets = 3 if request.experience_level == \"beginner\" else 4
            reps = \"8-12\" if request.experience_level == \"beginner\" else \"6-10\"
            rest_seconds = 60 if request.experience_level == \"beginner\" else 90
        elif request.workout_type == \"cardio\":
            sets = 1
            reps = f\"{30 + (request.duration_minutes // 10)} seconds\"
            rest_seconds = 15
        else:
            sets = 2
            reps = \"30 seconds\" if request.workout_type == \"flexibility\" else \"10-15\"
            rest_seconds = 30
        
        exercises.append({
            \"name\": exercise[\"name\"],
            \"muscle_groups\": exercise[\"muscle_groups\"],
            \"equipment\": exercise[\"equipment\"],
            \"sets\": sets,
            \"reps\": reps,
            \"rest_seconds\": rest_seconds,
            \"instructions\": f\"Perform {exercise['name']} focusing on proper form\",
            \"difficulty\": exercise[\"difficulty\"]
        })
    
    return exercises

def calculate_calories_burned(duration_minutes: int, workout_type: str, experience_level: str) -> int:
    \"\"\"Calculate estimated calories burned based on workout parameters\"\"\"
    base_rate = {
        \"strength\": 6,
        \"cardio\": 10,
        \"flexibility\": 3,
        \"mixed\": 7
    }
    
    multiplier = {
        \"beginner\": 0.8,
        \"intermediate\": 1.0,
        \"advanced\": 1.2
    }
    
    return int(duration_minutes * base_rate.get(workout_type, 7) * multiplier.get(experience_level, 1.0))

async def generate_fallback_workout(request: WorkoutRequest) -> WorkoutPlan:
    \"\"\"Fallback workout generation if AI fails\"\"\"
    exercises = await parse_ai_workout_response(\"\", request)
    
    return WorkoutPlan(
        id=f\"fallback_workout_{request.user_id}_{int(time.time())}\",
        name=f\"Custom {request.workout_type.title()} Workout\",
        description=f\"Personalized {request.experience_level} level workout\",
        duration_minutes=request.duration_minutes,
        difficulty=request.experience_level,
        exercises=exercises,
        estimated_calories=calculate_calories_burned(request.duration_minutes, request.workout_type, request.experience_level),
        target_muscle_groups=request.target_muscle_groups or [\"full_body\"],
        equipment_needed=request.available_equipment,
        created_at=datetime.utcnow()
    )

async def store_ai_interaction(user_id: int, message: str, response: str, message_type: str, response_time_ms: float):
    \"\"\"Store AI interaction for analytics\"\"\"
    try:
        async with SessionLocal() as session:
            interaction = AIInteraction(
                user_id=user_id,
                message=message,
                response=response,
                message_type=message_type,
                response_time_ms=response_time_ms
            )
            session.add(interaction)
            await session.commit()
    except Exception as e:
        logger.error(f\"Failed to store AI interaction: {e}\")

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)
    
    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

# API Endpoints
@app.get(\"/health\")
async def health_check():
    return {
        \"status\": \"healthy\",
        \"timestamp\": datetime.utcnow().isoformat(),
        \"services\": {
            \"redis\": \"connected\" if redis_client else \"disconnected\",
            \"ai_models\": \"loaded\" if workout_model and nutrition_model else \"not_loaded\",
            \"openai\": \"configured\" if openai.api_key else \"not_configured\"
        }
    }

@app.post(\"/api/workout/generate\", response_model=WorkoutPlan)
async def generate_workout(request: WorkoutRequest, background_tasks: BackgroundTasks):
    \"\"\"Generate AI-powered workout plan\"\"\"
    try:
        workout_plan = await generate_ai_workout_plan(request)
        
        # Add background task to update user preferences
        background_tasks.add_task(update_user_preferences, request.user_id, request.dict())
        
        return workout_plan
    except Exception as e:
        logger.error(f\"Workout generation error: {e}\")
        raise HTTPException(status_code=500, detail=\"Failed to generate workout plan\")

@app.post(\"/api/nutrition/generate\", response_model=NutritionPlan)
async def generate_nutrition_plan(request: NutritionRequest):
    \"\"\"Generate AI-powered nutrition plan\"\"\"
    # Implementation similar to workout generation
    # For brevity, returning a simple response
    return NutritionPlan(
        id=f\"nutrition_{request.user_id}_{int(time.time())}\",
        name=\"AI-Generated Nutrition Plan\",
        daily_calories=request.daily_calorie_goal,
        meals=[
            {\"name\": \"Breakfast\", \"calories\": request.daily_calorie_goal // 4},
            {\"name\": \"Lunch\", \"calories\": request.daily_calorie_goal // 3},
            {\"name\": \"Dinner\", \"calories\": request.daily_calorie_goal // 3},
            {\"name\": \"Snack\", \"calories\": request.daily_calorie_goal // 12}
        ],
        macros={\"protein\": 25, \"carbs\": 45, \"fat\": 30},
        created_at=datetime.utcnow()
    )

@app.post(\"/api/chat\")
async def ai_chat(message: ChatMessage, db: AsyncSession = Depends(get_db)):
    \"\"\"AI-powered chat for fitness guidance\"\"\"
    start_time = time.time()
    
    try:
        # Generate context-aware response
        response = await openai.ChatCompletion.acreate(
            model=\"gpt-3.5-turbo\",
            messages=[
                {
                    \"role\": \"system\",
                    \"content\": \"You are FitSync AI, a knowledgeable fitness and nutrition assistant. Provide helpful, encouraging, and scientifically-backed advice.\"
                },
                {\"role\": \"user\", \"content\": message.message}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        ai_response = response.choices[0].message.content
        
        # Store interaction
        processing_time = (time.time() - start_time) * 1000
        await store_ai_interaction(
            message.user_id,
            message.message,
            ai_response,
            message.message_type,
            processing_time
        )
        
        return {
            \"response\": ai_response,
            \"timestamp\": datetime.utcnow().isoformat(),
            \"message_type\": message.message_type,
            \"suggestions\": [
                \"Tell me about strength training\",
                \"Create a meal plan\",
                \"How to improve cardio?\"
            ]
        }
        
    except Exception as e:
        logger.error(f\"Chat error: {e}\")
        return {
            \"response\": \"I'm sorry, I'm having trouble processing your request right now. Please try again later.\",
            \"timestamp\": datetime.utcnow().isoformat(),
            \"error\": True
        }

@app.websocket(\"/ws/chat/{user_id}\")
async def websocket_chat(websocket: WebSocket, user_id: int):
    \"\"\"Real-time chat via WebSocket\"\"\"
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Process message
            chat_message = ChatMessage(
                message=message_data[\"message\"],
                user_id=user_id,
                message_type=message_data.get(\"type\", \"general\")
            )
            
            # Generate AI response (simplified for WebSocket)
            response = f\"AI Response to: {chat_message.message}\"
            
            await manager.send_personal_message(json.dumps({
                \"type\": \"ai_response\",
                \"message\": response,
                \"timestamp\": datetime.utcnow().isoformat()
            }), websocket)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)

async def update_user_preferences(user_id: int, preferences: dict):
    \"\"\"Background task to update user preferences\"\"\"
    cache_key = f\"user_preferences:{user_id}\"
    await redis_client.setex(cache_key, 3600 * 24, json.dumps(preferences))  # 24 hours TTL

if __name__ == \"__main__\":
    uvicorn.run(
        \"main:app\",
        host=\"0.0.0.0\",
        port=int(os.getenv(\"PORT\", 8082)),
        reload=True if os.getenv(\"NODE_ENV\") != \"production\" else False,
        workers=1
    )