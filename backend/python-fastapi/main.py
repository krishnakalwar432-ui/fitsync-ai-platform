# FitSync AI - Python FastAPI Backend
# High-performance backend with ML capabilities

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
import asyncio
import asyncpg
import redis.asyncio as redis
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from contextlib import asynccontextmanager
import uvicorn
import logging
import time
from typing import Optional, List
import jwt
from datetime import datetime, timedelta
import openai
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from pydantic import BaseModel, EmailStr
import hashlib
import bcrypt

# Logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Database configuration
DATABASE_URL = "postgresql+asyncpg://user:password@localhost/fitsync_ai"
engine = create_async_engine(DATABASE_URL, echo=True)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# Redis configuration
redis_client = redis.Redis.from_url("redis://localhost:6379", decode_responses=True)

# Pydantic models
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    activity_level: Optional[str] = None
    fitness_goals: List[str] = []

class WorkoutRequest(BaseModel):
    user_id: str
    difficulty: str
    duration: int
    equipment: List[str] = []
    muscle_groups: List[str] = []
    workout_type: str

class NutritionRequest(BaseModel):
    user_id: str
    calorie_target: int
    dietary_restrictions: List[str] = []
    meal_preferences: List[str] = []

class AIMessage(BaseModel):
    message: str
    topic: Optional[str] = "general"
    context: dict = {}

# ML Models for fitness predictions
class FitnessML:
    def __init__(self):
        self.workout_model = RandomForestRegressor(n_estimators=100)
        self.nutrition_model = RandomForestRegressor(n_estimators=100)
        self.load_models()
    
    def load_models(self):
        # In production, load pre-trained models from files
        # For demo, we'll use dummy training data
        logger.info("Loading ML models...")
        
    async def predict_optimal_workout(self, user_data: dict) -> dict:
        """Predict optimal workout parameters based on user data and progress"""
        # Feature engineering
        features = np.array([[
            user_data.get('age', 25),
            user_data.get('weight', 70),
            user_data.get('height', 170),
            user_data.get('activity_level_numeric', 3),
            user_data.get('fitness_experience', 1)
        ]])
        
        # Mock prediction (replace with actual model)
        predicted_intensity = np.random.uniform(0.6, 0.9)
        predicted_duration = int(np.random.uniform(30, 90))
        
        return {
            "recommended_intensity": predicted_intensity,
            "optimal_duration": predicted_duration,
            "recovery_time": int(24 + (1 - predicted_intensity) * 24)
        }
    
    async def predict_nutrition_needs(self, user_data: dict) -> dict:
        """Predict nutritional needs based on goals and activity"""
        bmr = self.calculate_bmr(user_data)
        tdee = bmr * user_data.get('activity_multiplier', 1.4)
        
        return {
            "daily_calories": int(tdee),
            "protein_grams": int(user_data.get('weight', 70) * 2.2),
            "carb_grams": int(tdee * 0.45 / 4),
            "fat_grams": int(tdee * 0.25 / 9)
        }
    
    def calculate_bmr(self, user_data: dict) -> float:
        """Calculate Basal Metabolic Rate"""
        weight = user_data.get('weight', 70)
        height = user_data.get('height', 170)
        age = user_data.get('age', 25)
        gender = user_data.get('gender', 'male')
        
        if gender.lower() == 'male':
            return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
        else:
            return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)

# Initialize ML models
fitness_ml = FitnessML()

# Application lifecycle
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("🚀 Starting FitSync AI Backend")
    
    # Initialize database connections
    await redis_client.ping()
    logger.info("✅ Redis connected")
    
    yield
    
    # Shutdown
    logger.info("🔄 Shutting down FitSync AI Backend")
    await redis_client.close()

# FastAPI application
app = FastAPI(
    title="FitSync AI Backend",
    description="High-performance fitness platform backend with ML capabilities",
    version="2.0.0",
    lifespan=lifespan
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

# Security
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Validate JWT token and return current user"""
    try:
        payload = jwt.decode(
            credentials.credentials, 
            "your-secret-key", 
            algorithms=["HS256"]
        )
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Middleware for request logging and metrics
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    logger.info(
        f"{request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Time: {process_time:.4f}s"
    )
    
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test Redis connection
        await redis_client.ping()
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "services": {
                "redis": "connected",
                "ml_models": "loaded"
            }
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
        )

# Authentication endpoints
@app.post("/api/auth/register")
async def register_user(user_data: UserCreate):
    """Register a new user"""
    try:
        # Hash password
        password_hash = bcrypt.hashpw(
            user_data.password.encode('utf-8'), 
            bcrypt.gensalt()
        ).decode('utf-8')
        
        # Save user to database (implement with SQLAlchemy)
        user_id = f"user_{int(time.time())}"
        
        # Cache user data
        await redis_client.hset(f"user:{user_id}", mapping={
            "name": user_data.name,
            "email": user_data.email,
            "password_hash": password_hash,
            "created_at": datetime.utcnow().isoformat()
        })
        
        # Generate JWT token
        token = jwt.encode(
            {
                "sub": user_id,
                "exp": datetime.utcnow() + timedelta(days=30)
            },
            "your-secret-key",
            algorithm="HS256"
        )
        
        return {
            "message": "User registered successfully",
            "user_id": user_id,
            "token": token
        }
        
    except Exception as e:
        logger.error(f"User registration failed: {e}")
        raise HTTPException(status_code=500, detail="Registration failed")

# AI-powered workout generation
@app.post("/api/ai/workout-plan")
async def generate_workout_plan(
    request: WorkoutRequest,
    current_user: str = Depends(get_current_user)
):
    """Generate AI-powered workout plan"""
    try:
        # Get user data
        user_data = await redis_client.hgetall(f"user:{current_user}")
        
        # ML prediction for optimal workout
        ml_prediction = await fitness_ml.predict_optimal_workout(user_data)
        
        # Generate workout using OpenAI
        openai_prompt = f"""
        Create a {request.difficulty} {request.workout_type} workout plan for:
        - Duration: {request.duration} minutes
        - Equipment: {', '.join(request.equipment)}
        - Target muscles: {', '.join(request.muscle_groups)}
        - Recommended intensity: {ml_prediction['recommended_intensity']}
        
        Return structured JSON with exercises, sets, reps, and rest periods.
        """
        
        # OpenAI API call (implement with actual API)
        ai_response = {
            "workout_name": f"{request.difficulty.title()} {request.workout_type.title()}",
            "exercises": [
                {
                    "name": "Push-ups",
                    "sets": 3,
                    "reps": 12,
                    "rest_seconds": 60
                },
                {
                    "name": "Squats",
                    "sets": 3,
                    "reps": 15,
                    "rest_seconds": 60
                }
            ],
            "estimated_calories": int(request.duration * 8 * ml_prediction['recommended_intensity']),
            "ml_recommendations": ml_prediction
        }
        
        # Cache workout plan
        workout_id = f"workout_{int(time.time())}"
        await redis_client.setex(
            f"workout_plan:{workout_id}",
            3600,  # 1 hour TTL
            str(ai_response)
        )
        
        return {
            "workout_id": workout_id,
            "workout_plan": ai_response,
            "ml_insights": ml_prediction
        }
        
    except Exception as e:
        logger.error(f"Workout generation failed: {e}")
        raise HTTPException(status_code=500, detail="Workout generation failed")

# AI-powered nutrition planning
@app.post("/api/ai/nutrition-plan")
async def generate_nutrition_plan(
    request: NutritionRequest,
    current_user: str = Depends(get_current_user)
):
    """Generate AI-powered nutrition plan"""
    try:
        # Get user data
        user_data = await redis_client.hgetall(f"user:{current_user}")
        
        # ML prediction for nutrition needs
        nutrition_needs = await fitness_ml.predict_nutrition_needs(user_data)
        
        # Generate meal plan
        meal_plan = {
            "daily_target": nutrition_needs,
            "meals": {
                "breakfast": {
                    "calories": int(nutrition_needs["daily_calories"] * 0.25),
                    "foods": ["Oatmeal with berries", "Greek yogurt"]
                },
                "lunch": {
                    "calories": int(nutrition_needs["daily_calories"] * 0.35),
                    "foods": ["Grilled chicken salad", "Brown rice"]
                },
                "dinner": {
                    "calories": int(nutrition_needs["daily_calories"] * 0.30),
                    "foods": ["Salmon", "Quinoa", "Steamed vegetables"]
                },
                "snacks": {
                    "calories": int(nutrition_needs["daily_calories"] * 0.10),
                    "foods": ["Nuts", "Apple"]
                }
            }
        }
        
        return {
            "nutrition_plan": meal_plan,
            "ml_recommendations": nutrition_needs
        }
        
    except Exception as e:
        logger.error(f"Nutrition planning failed: {e}")
        raise HTTPException(status_code=500, detail="Nutrition planning failed")

# AI Chat endpoint
@app.post("/api/ai/chat")
async def ai_chat(
    message: AIMessage,
    current_user: str = Depends(get_current_user)
):
    """AI-powered fitness chat"""
    try:
        # Get user context
        user_data = await redis_client.hgetall(f"user:{current_user}")
        
        # Prepare context for AI
        fitness_context = f"""
        User Profile:
        - Goals: {user_data.get('fitness_goals', 'general fitness')}
        - Experience: {user_data.get('experience_level', 'beginner')}
        - Equipment: {user_data.get('available_equipment', 'basic')}
        
        Topic: {message.topic}
        """
        
        # Mock AI response (implement with OpenAI)
        ai_response = f"""
        Based on your {message.topic} question about "{message.message}", 
        here's my personalized recommendation:
        
        {self.generate_contextual_response(message.message, message.topic)}
        
        Would you like me to create a specific plan for you?
        """
        
        return {
            "response": ai_response,
            "suggestions": [
                "Create workout plan",
                "Design meal plan",
                "Track progress",
                "Set new goals"
            ]
        }
        
    except Exception as e:
        logger.error(f"AI chat failed: {e}")
        raise HTTPException(status_code=500, detail="AI chat failed")

# Background task for data processing
@app.post("/api/analytics/process")
async def process_analytics(
    background_tasks: BackgroundTasks,
    current_user: str = Depends(get_current_user)
):
    """Process user analytics in background"""
    
    async def analyze_user_progress():
        """Background task to analyze user progress"""
        logger.info(f"Processing analytics for user {current_user}")
        
        # Simulate analytics processing
        await asyncio.sleep(5)
        
        # Store results in Redis
        analytics_result = {
            "processed_at": datetime.utcnow().isoformat(),
            "insights": ["Consistency improved", "Strength gains detected"],
            "recommendations": ["Increase workout intensity", "Add more protein"]
        }
        
        await redis_client.setex(
            f"analytics:{current_user}",
            86400,  # 24 hours
            str(analytics_result)
        )
        
        logger.info(f"Analytics completed for user {current_user}")
    
    background_tasks.add_task(analyze_user_progress)
    
    return {"message": "Analytics processing started"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        workers=4
    )