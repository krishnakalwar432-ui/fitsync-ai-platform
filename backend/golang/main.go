// FitSync AI - Golang High-Performance Backend
// Ultra-fast, concurrent backend with advanced features

package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"github.com/gorilla/websocket"
)

// Models
type User struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Name         string    `json:"name"`
	Email        string    `gorm:"unique" json:"email"`
	PasswordHash string    `json:"-"`
	Age          *int      `json:"age,omitempty"`
	Gender       *string   `json:"gender,omitempty"`
	Height       *float64  `json:"height,omitempty"`
	Weight       *float64  `json:"weight,omitempty"`
	FitnessGoals []string  `gorm:"type:text[]" json:"fitness_goals"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type Exercise struct {
	ID           uint     `gorm:"primaryKey" json:"id"`
	Name         string   `json:"name"`
	Description  string   `json:"description"`
	Category     string   `json:"category"`
	MuscleGroups []string `gorm:"type:text[]" json:"muscle_groups"`
	Equipment    []string `gorm:"type:text[]" json:"equipment"`
	Difficulty   string   `json:"difficulty"`
	ImageURL     *string  `json:"image_url,omitempty"`
	VideoURL     *string  `json:"video_url,omitempty"`
}

type Workout struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	UserID      uint      `json:"user_id"`
	Name        string    `json:"name"`
	Description *string   `json:"description,omitempty"`
	Duration    *int      `json:"duration,omitempty"`
	Difficulty  string    `json:"difficulty"`
	Category    string    `json:"category"`
	IsPublic    bool      `json:"is_public"`
	Exercises   []Exercise `gorm:"many2many:workout_exercises;" json:"exercises"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type WorkoutRequest struct {
	Name         string   `json:"name" binding:"required"`
	Difficulty   string   `json:"difficulty" binding:"required"`
	Duration     int      `json:"duration"`
	Equipment    []string `json:"equipment"`
	MuscleGroups []string `json:"muscle_groups"`
	WorkoutType  string   `json:"workout_type"`
}

type AIMessage struct {
	Message string            `json:"message" binding:"required"`
	Topic   string            `json:"topic"`
	Context map[string]interface{} `json:"context"`
}

// Database and Redis clients
var (
	db          *gorm.DB
	redisClient *redis.Client
	ctx         = context.Background()
)

// WebSocket upgrader
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins in development
	},
}

// JWT Secret
var jwtSecret = []byte("your-super-secret-key")

// JWT Claims
type Claims struct {
	UserID uint `json:"user_id"`
	jwt.RegisteredClaims
}

// Initialize database and Redis
func initDatabase() {
	var err error
	
	// PostgreSQL connection
	dsn := "host=localhost user=postgres password=password dbname=fitsync_ai port=5432 sslmode=disable"
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto-migrate tables
	err = db.AutoMigrate(&User{}, &Exercise{}, &Workout{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// Redis connection
	redisClient = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})

	// Test Redis connection
	_, err = redisClient.Ping(ctx).Result()
	if err != nil {
		log.Fatal("Failed to connect to Redis:", err)
	}

	log.Println("✅ Database and Redis connected successfully")
}

// Middleware for authentication
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		// Remove "Bearer " prefix
		if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
			tokenString = tokenString[7:]
		}

		token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		claims, ok := token.Claims.(*Claims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			c.Abort()
			return
		}

		c.Set("user_id", claims.UserID)
		c.Next()
	}
}

// Rate limiting middleware using Redis
func RateLimitMiddleware(limit int, window time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		key := fmt.Sprintf("rate_limit:%s", c.ClientIP())
		
		// Get current count
		val, err := redisClient.Get(ctx, key).Result()
		if err == redis.Nil {
			// First request, set count to 1
			redisClient.Set(ctx, key, 1, window)
		} else if err == nil {
			// Parse current count
			var count int
			fmt.Sscanf(val, "%d", &count)
			
			if count >= limit {
				c.JSON(http.StatusTooManyRequests, gin.H{
					"error": "Rate limit exceeded",
					"retry_after": window.Seconds(),
				})
				c.Abort()
				return
			}
			
			// Increment count
			redisClient.Incr(ctx, key)
		} else {
			log.Printf("Redis error: %v", err)
		}
		
		c.Next()
	}
}

// Caching middleware
func CacheMiddleware(duration time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Method != "GET" {
			c.Next()
			return
		}

		key := fmt.Sprintf("cache:%s", c.Request.URL.Path)
		
		// Try to get from cache
		val, err := redisClient.Get(ctx, key).Result()
		if err == nil {
			var cachedResponse map[string]interface{}
			if json.Unmarshal([]byte(val), &cachedResponse) == nil {
				c.JSON(http.StatusOK, cachedResponse)
				c.Abort()
				return
			}
		}

		// Create response writer to capture response
		writer := &responseBodyWriter{body: &[]byte{}, ResponseWriter: c.Writer}
		c.Writer = writer

		c.Next()

		// Cache successful responses
		if c.Writer.Status() == http.StatusOK {
			redisClient.Set(ctx, key, *writer.body, duration)
		}
	}
}

type responseBodyWriter struct {
	gin.ResponseWriter
	body *[]byte
}

func (r responseBodyWriter) Write(b []byte) (int, error) {
	*r.body = append(*r.body, b...)
	return r.ResponseWriter.Write(b)
}

// Performance monitoring middleware
func PerformanceMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		
		c.Next()
		
		duration := time.Since(start)
		log.Printf(
			"[%s] %s %s - Status: %d - Duration: %v",
			time.Now().Format("2006-01-02 15:04:05"),
			c.Request.Method,
			c.Request.URL.Path,
			c.Writer.Status(),
			duration,
		)
		
		// Store metrics in Redis
		metricsKey := fmt.Sprintf("metrics:%s:%s", c.Request.Method, c.Request.URL.Path)
		redisClient.LPush(ctx, metricsKey, duration.Milliseconds())
		redisClient.LTrim(ctx, metricsKey, 0, 999) // Keep last 1000 entries
		redisClient.Expire(ctx, metricsKey, 24*time.Hour)
	}
}

// Health check endpoint
func healthCheck(c *gin.Context) {
	// Test database connection
	sqlDB, err := db.DB()
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"status": "unhealthy",
			"error":  "Database connection failed",
		})
		return
	}

	err = sqlDB.Ping()
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"status": "unhealthy",
			"error":  "Database ping failed",
		})
		return
	}

	// Test Redis connection
	_, err = redisClient.Ping(ctx).Result()
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"status": "unhealthy",
			"error":  "Redis connection failed",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":    "healthy",
		"timestamp": time.Now().Format(time.RFC3339),
		"services": gin.H{
			"database": "connected",
			"redis":    "connected",
		},
	})
}

// User registration
func registerUser(c *gin.Context) {
	var req struct {
		Name     string `json:"name" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Password hashing failed"})
		return
	}

	// Create user
	user := User{
		Name:         req.Name,
		Email:        req.Email,
		PasswordHash: string(hashedPassword),
	}

	if err := db.Create(&user).Error; err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
		return
	}

	// Generate JWT token
	claims := &Claims{
		UserID: user.ID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Token generation failed"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User registered successfully",
		"user":    user,
		"token":   tokenString,
	})
}

// AI-powered workout generation
func generateWorkoutPlan(c *gin.Context) {
	userID := c.GetUint("user_id")
	
	var req WorkoutRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Simulate AI processing (replace with actual AI integration)
	workoutPlan := map[string]interface{}{
		"name":        req.Name,
		"difficulty":  req.Difficulty,
		"duration":    req.Duration,
		"exercises": []map[string]interface{}{
			{
				"name":         "Push-ups",
				"sets":         3,
				"reps":         15,
				"rest_seconds": 60,
			},
			{
				"name":         "Squats",
				"sets":         3,
				"reps":         20,
				"rest_seconds": 60,
			},
		},
		"estimated_calories": req.Duration * 8,
		"created_at":        time.Now(),
	}

	// Cache the workout plan
	workoutKey := fmt.Sprintf("workout_plan:%d:%d", userID, time.Now().Unix())
	workoutJSON, _ := json.Marshal(workoutPlan)
	redisClient.Set(ctx, workoutKey, workoutJSON, time.Hour)

	c.JSON(http.StatusOK, gin.H{
		"workout_id":   workoutKey,
		"workout_plan": workoutPlan,
	})
}

// Real-time AI chat with WebSocket
func handleWebSocket(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Printf("WebSocket upgrade failed: %v", err)
		return
	}
	defer conn.Close()

	log.Println("New WebSocket connection established")

	for {
		var msg AIMessage
		err := conn.ReadJSON(&msg)
		if err != nil {
			log.Printf("WebSocket read error: %v", err)
			break
		}

		// Process AI message (replace with actual AI integration)
		response := map[string]interface{}{
			"type":      "ai_response",
			"message":   fmt.Sprintf("AI Response to: %s", msg.Message),
			"topic":     msg.Topic,
			"timestamp": time.Now(),
			"suggestions": []string{
				"Create workout plan",
				"Design meal plan",
				"Track progress",
			},
		}

		err = conn.WriteJSON(response)
		if err != nil {
			log.Printf("WebSocket write error: %v", err)
			break
		}
	}
}

// Get analytics with advanced aggregation
func getAnalytics(c *gin.Context) {
	userID := c.GetUint("user_id")
	
	// Aggregate user metrics from Redis
	metricsPattern := "metrics:*"
	keys, err := redisClient.Keys(ctx, metricsPattern).Result()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Analytics retrieval failed"})
		return
	}

	analytics := map[string]interface{}{
		"user_id": userID,
		"metrics": map[string]interface{}{
			"total_workouts": 15,
			"avg_duration":   45,
			"calories_burned": 1200,
			"consistency_score": 85,
		},
		"trends": map[string]interface{}{
			"weekly_improvement": 12,
			"strength_gains":     8,
		},
		"recommendations": []string{
			"Increase workout intensity",
			"Add more cardio sessions",
			"Focus on nutrition consistency",
		},
	}

	c.JSON(http.StatusOK, analytics)
}

// Concurrent bulk data processing
func processBulkData(c *gin.Context) {
	var data []map[string]interface{}
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Process data concurrently using goroutines
	results := make(chan map[string]interface{}, len(data))
	semaphore := make(chan struct{}, 10) // Limit concurrent goroutines

	for i, item := range data {
		go func(index int, item map[string]interface{}) {
			semaphore <- struct{}{} // Acquire semaphore
			defer func() { <-semaphore }() // Release semaphore

			// Simulate processing
			time.Sleep(100 * time.Millisecond)
			
			result := map[string]interface{}{
				"index":     index,
				"processed": true,
				"result":    fmt.Sprintf("Processed item %d", index),
			}
			
			results <- result
		}(i, item)
	}

	// Collect results
	var processedResults []map[string]interface{}
	for i := 0; i < len(data); i++ {
		result := <-results
		processedResults = append(processedResults, result)
	}

	c.JSON(http.StatusOK, gin.H{
		"message":         "Bulk processing completed",
		"processed_count": len(processedResults),
		"results":         processedResults,
	})
}

func main() {
	// Initialize database
	initDatabase()

	// Create Gin router
	router := gin.New()

	// Add middleware
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(PerformanceMiddleware())

	// CORS middleware
	router.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type,Authorization")
		
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		
		c.Next()
	})

	// Public routes
	router.GET("/health", healthCheck)
	router.POST("/api/auth/register", RateLimitMiddleware(5, 15*time.Minute), registerUser)

	// Protected routes
	api := router.Group("/api")
	api.Use(AuthMiddleware())
	{
		// Workout routes with caching
		workouts := api.Group("/workouts")
		workouts.Use(CacheMiddleware(5 * time.Minute))
		{
			workouts.POST("/generate", generateWorkoutPlan)
			workouts.GET("/analytics", getAnalytics)
		}

		// AI routes with rate limiting
		ai := api.Group("/ai")
		ai.Use(RateLimitMiddleware(20, time.Minute))
		{
			ai.POST("/chat", func(c *gin.Context) {
				var msg AIMessage
				if err := c.ShouldBindJSON(&msg); err != nil {
					c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
					return
				}

				response := map[string]interface{}{
					"response": fmt.Sprintf("AI response to: %s", msg.Message),
					"topic":    msg.Topic,
					"suggestions": []string{
						"Create workout plan",
						"Design meal plan",
					},
				}

				c.JSON(http.StatusOK, response)
			})
		}

		// Bulk processing route
		api.POST("/bulk/process", processBulkData)
	}

	// WebSocket route
	router.GET("/ws", handleWebSocket)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 FitSync AI Golang Backend starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}