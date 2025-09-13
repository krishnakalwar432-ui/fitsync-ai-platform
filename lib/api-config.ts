// API Configuration for FitSync AI Frontend
// This file handles all backend API connections

const API_CONFIG = {
  // Backend URLs for different environments
  DEVELOPMENT: {
    BASE_URL: 'http://localhost:8000',
    WS_URL: 'ws://localhost:8000'
  },
  PRODUCTION: {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://your-backend.onrender.com',
    WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'wss://your-backend.onrender.com'
  }
};

// Get current environment
const isDevelopment = process.env.NODE_ENV === 'development';
const currentConfig = isDevelopment ? API_CONFIG.DEVELOPMENT : API_CONFIG.PRODUCTION;

export const API_BASE_URL = currentConfig.BASE_URL;
export const WS_BASE_URL = currentConfig.WS_URL;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password'
  },
  
  // User Management
  USERS: {
    PROFILE: '/api/users/profile',
    STATS: '/api/users/stats',
    ACHIEVEMENTS: '/api/users/achievements',
    DELETE_ACCOUNT: '/api/users/account'
  },
  
  // Workouts
  WORKOUTS: {
    PLANS: '/api/workouts/plans',
    EXERCISES: '/api/workouts/exercises',
    SESSIONS: '/api/workouts/sessions',
    TEMPLATES: '/api/workouts/templates'
  },
  
  // Nutrition
  NUTRITION: {
    FOODS: '/api/nutrition/foods',
    MEAL_PLANS: '/api/nutrition/meal-plans',
    LOGS: '/api/nutrition/logs',
    SEARCH: '/api/nutrition/search'
  },
  
  // AI Services
  AI: {
    CHAT: '/api/ai/chat',
    RECOMMENDATIONS: '/api/ai/recommendations',
    FORM_ANALYSIS: '/api/ai/form-analysis',
    VOICE: '/api/ai/voice'
  },
  
  // Analytics
  ANALYTICS: {
    DASHBOARD: '/api/analytics/dashboard',
    PROGRESS: '/api/analytics/progress',
    INSIGHTS: '/api/analytics/insights'
  },
  
  // Community
  COMMUNITY: {
    POSTS: '/api/community/posts',
    CHALLENGES: '/api/community/challenges',
    LEADERBOARD: '/api/community/leaderboard',
    SOCIAL: '/api/community/social'
  },
  
  // Subscriptions
  SUBSCRIPTIONS: {
    PLANS: '/api/subscriptions/plans',
    CURRENT: '/api/subscriptions/current',
    UPGRADE: '/api/subscriptions/upgrade',
    CANCEL: '/api/subscriptions/cancel'
  },
  
  // File Uploads
  UPLOADS: {
    IMAGES: '/api/uploads/images',
    VIDEOS: '/api/uploads/videos',
    DOCUMENTS: '/api/uploads/documents'
  }
};

// HTTP Client Configuration
export const HTTP_CONFIG = {
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// WebSocket Configuration
export const WS_CONFIG = {
  reconnectInterval: 5000,
  maxReconnectAttempts: 5
};

// Error Messages
export const API_ERRORS = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  RATE_LIMITED: 'Too many requests. Please wait a moment and try again.'
};

export default {
  API_BASE_URL,
  WS_BASE_URL,
  API_ENDPOINTS,
  HTTP_CONFIG,
  WS_CONFIG,
  API_ERRORS
};