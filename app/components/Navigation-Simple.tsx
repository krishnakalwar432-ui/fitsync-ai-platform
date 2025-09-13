"use client"

import { useState } from "react"
import { Menu, X, Dumbbell, BarChart3, Apple, User, LogOut, LogIn, Users, Bot, Crown } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"

interface NavigationProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export default function Navigation({ activeSection, setActiveSection }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout, isDemo } = useAuth()

  const navItems = [
    { id: "home", label: "Home", icon: Dumbbell },
    { id: "workouts", label: "Workouts", icon: BarChart3 },
    { id: "nutrition", label: "Nutrition", icon: Apple, requireAuth: true },
    { id: "community", label: "Community", icon: Users, requireAuth: true },
    { id: "ai-chat", label: "AI Coach", icon: Bot },
    { id: "subscription", label: "Premium", icon: Crown, requireAuth: true },
  ]

  const filteredNavItems = navItems.filter(item => !item.requireAuth || user)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-glass-primary backdrop-blur-3xl border-b border-neon-cyan/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Dumbbell className="h-8 w-8 text-neon-cyan" />
            <span 
              className="text-2xl font-bold text-neon-gradient cursor-pointer" 
              onClick={() => setActiveSection('home')}
            >
              FitSync AI
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {filteredNavItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50"
                      : "text-gray-300 hover:text-neon-cyan hover:bg-glass-secondary"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
            
            {/* Auth Button */}
            {user ? (
              <Button
                onClick={() => logout()}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
                {isDemo && <span className="text-yellow-400">(Demo)</span>}
              </Button>
            ) : (
              <Button
                onClick={() => setActiveSection('auth')}
                className="btn-neon-primary flex items-center space-x-2"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-gray-300 hover:text-neon-cyan p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-neon-cyan/30">
            <div className="space-y-2">
              {filteredNavItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id)
                      setIsOpen(false)
                    }}
                    className={`flex items-center space-x-3 w-full px-4 py-3 text-left transition-all duration-300 ${
                      isActive
                        ? "bg-neon-cyan/20 text-neon-cyan border-r-4 border-neon-cyan"
                        : "text-gray-300 hover:text-neon-cyan hover:bg-glass-secondary"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                )
              })}
              
              {/* Mobile Auth */}
              {user ? (
                <button
                  onClick={() => {
                    logout()
                    setIsOpen(false)
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-left text-gray-300 hover:text-red-400"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout {isDemo && "(Demo)"}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveSection('auth')
                    setIsOpen(false)
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-left text-neon-cyan hover:bg-neon-cyan/10"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}