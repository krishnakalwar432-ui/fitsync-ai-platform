"use client"

import { useState, useEffect } from "react"
import { Menu, X, Dumbbell, BarChart3, Apple, Calculator, User, LogOut, LogIn, BookOpen, Users, TrendingUp, Bot, MessageSquare, Trophy, Timer, Activity, Sparkles, Target, Mic, Watch, Crown, Bell, Bookmark, CreditCard, BrainCircuit } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface NavigationProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

// Floating particles component
function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([])

  useEffect(() => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 6
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-neon-cyan rounded-full opacity-60"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: `particle-float 6s ease-out infinite`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}
    </div>
  )
}

export default function Navigation({ activeSection, setActiveSection }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout, isDemo } = useAuth()

  const navItems = [
    { id: "home", label: "Home", icon: Dumbbell },
    { id: "workouts", label: "Workout Plans", icon: Target },
    { id: "motion-tracker", label: "Form Tracker", icon: Activity, requireAuth: true },
    { id: "voice-coach", label: "Voice Coach", icon: Mic, requireAuth: true },
    { id: "voice-assistant", label: "Voice Assistant", icon: BrainCircuit, requireAuth: true },
    { id: "nutrition", label: "Nutrition", icon: Apple, requireAuth: true },
    { id: "community", label: "Community", icon: Users, requireAuth: true },
    { id: "wearables", label: "Wearables", icon: Watch, requireAuth: true },
    { id: "analytics", label: "Analytics", icon: BarChart3, requireAuth: true },
    { id: "recommendations", label: "AI Recommendations", icon: Sparkles, requireAuth: true },
    { id: "ai-chat", label: "AI Coach", icon: Bot },
    { id: "subscription", label: "Subscription", icon: Crown, requireAuth: true },
    { id: "education", label: "Academy", icon: BookOpen },
    { id: "goals", label: "Goals", icon: Bell, requireAuth: true },
  ]

  const filteredNavItems = navItems.filter(item => !item.requireAuth || user)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 particles-bg">
      <FloatingParticles />
      <div className="glass-card border-b border-neon-cyan/30 bg-glass-primary backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative transform-3d perspective-1000">
                <div className="relative hover-lift-3d cursor-pointer group">
                  <Dumbbell className="h-8 w-8 text-neon-cyan animate-float-3d group-hover:animate-rotate-3d" />
                  <div className="absolute inset-0 h-8 w-8 text-neon-cyan blur-sm animate-neon-pulse opacity-50" />
                  <div className="absolute -inset-2 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
              <span 
                className="text-2xl font-bold text-neon-gradient hover-glow cursor-pointer group relative" 
                onClick={() => setActiveSection('home')}
              >
                <span className="relative z-10">FitSync AI</span>
                <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-purple blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                <Sparkles className="absolute -top-1 -right-6 h-4 w-4 text-neon-pink animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </span>
            </div>

            {/* Enhanced Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {filteredNavItems.slice(0, 8).map((item, index) => {
                const Icon = item.icon
                const isActive = activeSection === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-500 hover-lift-3d group relative overflow-hidden transform-gpu ${
                      isActive
                        ? "bg-gradient-to-r from-neon-cyan/20 via-neon-purple/20 to-neon-pink/20 text-neon-cyan border border-neon-cyan/50 shadow-neon-cyan"
                        : "text-gray-300 hover:text-neon-cyan hover:bg-glass-secondary border border-transparent hover:border-neon-cyan/30 hover:shadow-neon-cyan/50"
                    }`}
                    style={{
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <Icon className={`h-4 w-4 transition-all duration-500 transform-gpu ${
                      isActive 
                        ? 'text-neon-cyan animate-neon-pulse scale-110' 
                        : 'group-hover:text-neon-cyan group-hover:scale-110 group-hover:rotate-12'
                    }`} />
                    <span className="font-medium relative z-10">{item.label}</span>
                    {isActive && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-neon-purple/5 to-neon-pink/5 rounded-xl animate-gradient-shift" />
                        <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-xl blur opacity-30 animate-neon-pulse" />
                      </>
                    )}
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/0 via-neon-purple/0 to-neon-pink/0 group-hover:from-neon-cyan/10 group-hover:via-neon-purple/10 group-hover:to-neon-pink/10 rounded-xl transition-all duration-500" />
                    )}
                  </button>
                )
              })}
              
              {/* More Menu for Additional Items */}
              {filteredNavItems.length > 8 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative px-4 py-2 rounded-xl hover-lift-3d text-gray-300 hover:text-neon-cyan border border-transparent hover:border-neon-cyan/30">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      <span>More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 glass-card border border-neon-cyan/30" align="end">
                    {filteredNavItems.slice(8).map((item) => {
                      const Icon = item.icon
                      return (
                        <DropdownMenuItem
                          key={item.id}
                          className="cursor-pointer hover:bg-neon-cyan/10"
                          onSelect={() => setActiveSection(item.id)}
                        >
                          <Icon className="mr-2 h-4 w-4" />
                          {item.label}
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              {/* Authentication Section */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full hover-lift-3d">
                      <Avatar className="h-8 w-8 border-2 border-neon-cyan/50">
                        <AvatarImage src={user.image || ""} alt={user.name || ""} />
                        <AvatarFallback className="bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-semibold">
                          {user.name?.charAt(0) || <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      {isDemo && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 glass-card border border-neon-cyan/30" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {user.name && (
                          <p className="font-medium text-neon-cyan">{user.name}</p>
                        )}
                        {user.email && (
                          <p className="w-[200px] truncate text-sm text-gray-400">
                            {user.email}
                          </p>
                        )}
                        {isDemo && (
                          <p className="text-xs text-yellow-400">Demo Mode</p>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-neon-cyan/30" />
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-neon-cyan/10"
                      onSelect={() => setActiveSection("profile")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-neon-cyan/30" />
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-red-500/10 text-red-400"
                      onSelect={() => logout()}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => setActiveSection('auth')}
                  className="btn-neon-primary text-sm px-6 py-2 flex items-center space-x-2 hover-lift group relative overflow-hidden"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </Button>
              )}
            </div>

            {/* Enhanced Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="text-gray-300 hover:text-neon-cyan p-2 rounded-lg transition-all duration-500 hover:bg-glass-secondary border border-transparent hover:border-neon-cyan/30 hover-lift-3d group relative overflow-hidden"
              >
                <div className="relative z-10">
                  {isOpen ? 
                    <X className="h-6 w-6 transition-transform duration-300 group-hover:rotate-90" /> : 
                    <Menu className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                  }
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/0 to-neon-purple/0 group-hover:from-neon-cyan/20 group-hover:to-neon-purple/20 rounded-lg transition-all duration-500" />
              </button>
            </div>
          </div>

          {/* Enhanced Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden py-4 border-t border-neon-cyan/30 glass-card backdrop-blur-3xl">
              <div className="space-y-1">
                {filteredNavItems.map((item, index) => {
                  const Icon = item.icon
                  const isActive = activeSection === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id)
                        setIsOpen(false)
                      }}
                      className={`flex items-center space-x-3 w-full px-4 py-3 text-left transition-all duration-500 hover-lift group relative overflow-hidden ${
                        isActive
                          ? "bg-gradient-to-r from-neon-cyan/20 via-neon-purple/20 to-neon-pink/20 text-neon-cyan border-r-4 border-neon-cyan shadow-neon-cyan/50"
                          : "text-gray-300 hover:text-neon-cyan hover:bg-glass-secondary hover:border-r-4 hover:border-neon-cyan/50"
                      }`}
                      style={{
                        animationDelay: `${index * 0.05}s`
                      }}
                    >
                      <Icon className={`h-5 w-5 transition-all duration-500 ${
                        isActive 
                          ? 'text-neon-cyan animate-neon-pulse scale-110' 
                          : 'group-hover:text-neon-cyan group-hover:scale-110 group-hover:rotate-12'
                      }`} />
                      <span className="font-medium relative z-10">{item.label}</span>
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-neon-purple/5 to-neon-pink/5 animate-gradient-shift" />
                      )}
                      <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-neon-cyan to-neon-purple transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom" />
                    </button>
                  )
                })}
              </div>
              
              {/* Enhanced Mobile Auth */}
              <div className="border-t border-neon-cyan/30 mt-4 pt-4 px-4">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 px-2 py-2 rounded-lg bg-glass-secondary border border-neon-cyan/20">
                      <Avatar className="h-8 w-8 border-2 border-neon-cyan/50">
                        <AvatarImage src={user.image || ""} />
                        <AvatarFallback className="bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-semibold">
                          {user.name?.charAt(0) || <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neon-gradient truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        {isDemo && (
                          <p className="text-xs text-yellow-400">Demo Mode</p>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        setActiveSection("profile")
                        setIsOpen(false)
                      }}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start glass-card hover:bg-neon-cyan/10"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                    <Button
                      onClick={() => {
                        logout()
                        setIsOpen(false)
                      }}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start hover:bg-neon-red/10 hover:text-neon-red border border-transparent hover:border-neon-red/30"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      setActiveSection('auth')
                      setIsOpen(false)
                    }}
                    className="w-full btn-neon-primary hover-lift group relative overflow-hidden"
                  >
                    <LogIn className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                    Sign In
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  </Button>
                )}
              </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    )
}