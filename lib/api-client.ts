import { API_BASE_URL, API_ENDPOINTS, HTTP_CONFIG, API_ERRORS } from './api-config';

// Types
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  requireAuth?: boolean;
}

// HTTP Client Class
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultHeaders = HTTP_CONFIG.headers;
  }

  // Get auth token from localStorage
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('fitSync_token');
  }

  // Set auth token
  public setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fitSync_token', token);
    }
  }

  // Remove auth token
  public removeAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fitSync_token');
    }
  }

  // Build headers
  private buildHeaders(options: RequestOptions): Record<string, string> {
    const headers = { ...this.defaultHeaders, ...options.headers };
    
    if (options.requireAuth !== false) {
      const token = this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return headers;
  }

  // Main request method
  public async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { method = 'GET', body, requireAuth = true } = options;
    
    try {
      const config: RequestInit = {
        method,
        headers: this.buildHeaders(options),
        signal: AbortSignal.timeout(HTTP_CONFIG.timeout)
      };

      if (body) {
        config.body = JSON.stringify(body);
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      // Handle different response status codes
      if (response.status === 401) {
        this.removeAuthToken();
        throw new Error(API_ERRORS.UNAUTHORIZED);
      }
      
      if (response.status === 403) {
        throw new Error(API_ERRORS.FORBIDDEN);
      }
      
      if (response.status === 404) {
        throw new Error(API_ERRORS.NOT_FOUND);
      }
      
      if (response.status === 429) {
        throw new Error(API_ERRORS.RATE_LIMITED);
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || API_ERRORS.SERVER_ERROR);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data.data || data,
        message: data.message
      };
      
    } catch (error) {
      console.error('API Request Error:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout. Please try again.');
        }
        return {
          success: false,
          error: error.message
        };
      }
      
      return {
        success: false,
        error: API_ERRORS.NETWORK_ERROR
      };
    }
  }

  // Convenience methods
  public get<T = any>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T = any>(endpoint: string, body?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  public put<T = any>(endpoint: string, body?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}) {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  public delete<T = any>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  public patch<T = any>(endpoint: string, body?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}) {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// API Service Functions
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password }, { requireAuth: false }),
  
  register: (userData: any) =>
    apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData, { requireAuth: false }),
  
  refreshToken: (token: string) =>
    apiClient.post(API_ENDPOINTS.AUTH.REFRESH, { token }, { requireAuth: false }),
  
  logout: () =>
    apiClient.post(API_ENDPOINTS.AUTH.LOGOUT),
  
  forgotPassword: (email: string) =>
    apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }, { requireAuth: false }),
  
  resetPassword: (token: string, newPassword: string) =>
    apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword }, { requireAuth: false })
};

export const userApi = {
  getProfile: () =>
    apiClient.get(API_ENDPOINTS.USERS.PROFILE),
  
  updateProfile: (profileData: any) =>
    apiClient.put(API_ENDPOINTS.USERS.PROFILE, profileData),
  
  getStats: () =>
    apiClient.get(API_ENDPOINTS.USERS.STATS),
  
  getAchievements: () =>
    apiClient.get(API_ENDPOINTS.USERS.ACHIEVEMENTS),
  
  deleteAccount: () =>
    apiClient.delete(API_ENDPOINTS.USERS.DELETE_ACCOUNT)
};

export const workoutApi = {
  getPlans: () =>
    apiClient.get(API_ENDPOINTS.WORKOUTS.PLANS),
  
  createPlan: (planData: any) =>
    apiClient.post(API_ENDPOINTS.WORKOUTS.PLANS, planData),
  
  updatePlan: (planId: string, planData: any) =>
    apiClient.put(`${API_ENDPOINTS.WORKOUTS.PLANS}/${planId}`, planData),
  
  deletePlan: (planId: string) =>
    apiClient.delete(`${API_ENDPOINTS.WORKOUTS.PLANS}/${planId}`),
  
  getExercises: () =>
    apiClient.get(API_ENDPOINTS.WORKOUTS.EXERCISES),
  
  startSession: (planId: string) =>
    apiClient.post(`${API_ENDPOINTS.WORKOUTS.SESSIONS}/start`, { planId }),
  
  updateSession: (sessionId: string, sessionData: any) =>
    apiClient.put(`${API_ENDPOINTS.WORKOUTS.SESSIONS}/${sessionId}`, sessionData),
  
  completeSession: (sessionId: string, sessionData: any) =>
    apiClient.post(`${API_ENDPOINTS.WORKOUTS.SESSIONS}/${sessionId}/complete`, sessionData)
};

export const nutritionApi = {
  searchFoods: (query: string) =>
    apiClient.get(`${API_ENDPOINTS.NUTRITION.SEARCH}?q=${encodeURIComponent(query)}`),
  
  getMealPlans: () =>
    apiClient.get(API_ENDPOINTS.NUTRITION.MEAL_PLANS),
  
  createMealPlan: (planData: any) =>
    apiClient.post(API_ENDPOINTS.NUTRITION.MEAL_PLANS, planData),
  
  logFood: (logData: any) =>
    apiClient.post(API_ENDPOINTS.NUTRITION.LOGS, logData),
  
  getNutritionLogs: (date?: string) =>
    apiClient.get(`${API_ENDPOINTS.NUTRITION.LOGS}${date ? `?date=${date}` : ''}`)
};

export const aiApi = {
  sendMessage: (message: string, context?: any) =>
    apiClient.post(API_ENDPOINTS.AI.CHAT, { message, context }),
  
  getRecommendations: () =>
    apiClient.get(API_ENDPOINTS.AI.RECOMMENDATIONS),
  
  analyzeForm: (videoData: any) =>
    apiClient.post(API_ENDPOINTS.AI.FORM_ANALYSIS, videoData),
  
  processVoiceCommand: (audioData: any) =>
    apiClient.post(API_ENDPOINTS.AI.VOICE, audioData)
};

export const analyticsApi = {
  getDashboard: () =>
    apiClient.get(API_ENDPOINTS.ANALYTICS.DASHBOARD),
  
  getProgress: (timeRange?: string) =>
    apiClient.get(`${API_ENDPOINTS.ANALYTICS.PROGRESS}${timeRange ? `?range=${timeRange}` : ''}`),
  
  getInsights: () =>
    apiClient.get(API_ENDPOINTS.ANALYTICS.INSIGHTS)
};

export const communityApi = {
  getPosts: (limit?: number, offset?: number) =>
    apiClient.get(`${API_ENDPOINTS.COMMUNITY.POSTS}?limit=${limit || 20}&offset=${offset || 0}`),
  
  createPost: (postData: any) =>
    apiClient.post(API_ENDPOINTS.COMMUNITY.POSTS, postData),
  
  getChallenges: () =>
    apiClient.get(API_ENDPOINTS.COMMUNITY.CHALLENGES),
  
  getLeaderboard: () =>
    apiClient.get(API_ENDPOINTS.COMMUNITY.LEADERBOARD)
};

export const subscriptionApi = {
  getPlans: () =>
    apiClient.get(API_ENDPOINTS.SUBSCRIPTIONS.PLANS, { requireAuth: false }),
  
  getCurrentSubscription: () =>
    apiClient.get(API_ENDPOINTS.SUBSCRIPTIONS.CURRENT),
  
  upgrade: (planId: string, paymentData: any) =>
    apiClient.post(API_ENDPOINTS.SUBSCRIPTIONS.UPGRADE, { planId, ...paymentData }),
  
  cancel: () =>
    apiClient.post(API_ENDPOINTS.SUBSCRIPTIONS.CANCEL)
};

// File upload utility
export const uploadFile = async (file: File, type: 'images' | 'videos' | 'documents') => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.UPLOADS[type.toUpperCase() as keyof typeof API_ENDPOINTS.UPLOADS]}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiClient.getAuthToken()}`
    },
    body: formData
  });
  
  if (!response.ok) {
    throw new Error('Upload failed');
  }
  
  return response.json();
};

export { apiClient };
export default apiClient;