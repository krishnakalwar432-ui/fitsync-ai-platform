"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { authApi, userApi, apiClient } from "@/lib/api-client"

interface User {
  id: string
  name: string
  email: string
  image?: string
  fitnessLevel?: string
  goals?: string[]
  profile?: any
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  loading: boolean
  isDemo: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setLoading(true)
      
      // Check if we're in demo mode
      const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
      
      if (demoMode) {
        // Demo mode - use localStorage mock user
        const savedUser = localStorage.getItem('fitSync_demo_user')
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
        setIsDemo(true)
      } else {
        // Production mode - check with backend
        const token = apiClient.getAuthToken()
        if (token) {
          const response = await userApi.getProfile()
          if (response.success && response.data) {
            setUser(response.data)
          } else {
            apiClient.removeAuthToken()
          }
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      // Fallback to demo mode if backend is unavailable
      setIsDemo(true)
      const savedUser = localStorage.getItem('fitSync_demo_user')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      if (isDemo || process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
        // Demo login
        const demoUser: User = {
          id: '1',
          name: 'FitSync Demo User',
          email: email,
          image: '/avatar-placeholder.jpg',
          fitnessLevel: 'INTERMEDIATE',
          goals: ['STRENGTH', 'WEIGHT_LOSS']
        }
        
        setUser(demoUser)
        localStorage.setItem('fitSync_demo_user', JSON.stringify(demoUser))
        localStorage.setItem('fitSync_token', 'demo-token')
      } else {
        // Production login
        const response = await authApi.login(email, password)
        
        if (response.success && response.data) {
          const { user: userData, token } = response.data
          setUser(userData)
          apiClient.setAuthToken(token)
        } else {
          throw new Error(response.error || 'Login failed')
        }
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: any) => {
    setLoading(true)
    try {
      if (isDemo || process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
        // Demo registration
        const demoUser: User = {
          id: Date.now().toString(),
          name: userData.name,
          email: userData.email,
          fitnessLevel: userData.fitnessLevel,
          goals: userData.goals || []
        }
        
        setUser(demoUser)
        localStorage.setItem('fitSync_demo_user', JSON.stringify(demoUser))
        localStorage.setItem('fitSync_token', 'demo-token')
      } else {
        // Production registration
        const response = await authApi.register(userData)
        
        if (response.success && response.data) {
          const { user: newUser, token } = response.data
          setUser(newUser)
          apiClient.setAuthToken(token)
        } else {
          throw new Error(response.error || 'Registration failed')
        }
      }
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    if (isDemo) {
      localStorage.removeItem('fitSync_demo_user')
    } else {
      authApi.logout().catch(console.error)
    }
    apiClient.removeAuthToken()
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isDemo
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}