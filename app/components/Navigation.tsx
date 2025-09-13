"use client"

import { useState } from "react"
import { Menu, X, Dumbbell, BarChart3, Apple, Calculator, User, LogOut, LogIn, BookOpen, Users, TrendingUp, Bot, MessageSquare, Trophy, Timer, Activity } from "lucide-react"
import { useSession, signIn, signOut } from "next-auth/react"
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

export default function Navigation({ activeSection, setActiveSection }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session, status } = useSession()

  const navItems = [
    { id: "home", label: "Home", icon: Dumbbell },
    { id: "workouts", label: "Workouts", icon: Dumbbell },
    { id: "workout-tracker", label: "Workout Tracker", icon: Timer, requireAuth: true },
    { id: "ai-chat", label: "AI Coach", icon: Bot },
    { id: "guides", label: "Exercise Guide", icon: BookOpen },
    { id: "trainers", label: "Trainers", icon: Users },
    { id: "calculator", label: "Nutrition Center", icon: Calculator },
    { id: "social", label: "Community", icon: MessageSquare, requireAuth: true },
    { id: "challenges", label: "Challenges", icon: Trophy, requireAuth: true },
    { id: "dashboard", label: "Dashboard", icon: BarChart3, requireAuth: true },
    { id: "progress", label: "Analytics", icon: TrendingUp, requireAuth: true },
    { id: "nutrition", label: "Meal Planner", icon: Apple, requireAuth: true },
  ]

  const filteredNavItems = navItems.filter(item => !item.requireAuth || session)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-neon bg-card/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Dumbbell className="h-8 w-8 text-neon-cyan animate-neon-pulse" />
              <div className="absolute inset-0 h-8 w-8 text-neon-cyan blur-sm animate-neon-pulse opacity-50" />
            </div>
            <span className="text-2xl font-bold text-neon-gradient hover-glow cursor-pointer" onClick={() => setActiveSection('home')}>
              FitSync AI
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {filteredNavItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 hover-lift group relative overflow-hidden ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-neon-cyan border border-neon shadow-neon"
                      : "text-gray-300 hover:text-neon-cyan hover:bg-gray-800/50 border border-transparent hover:border-cyan-500/30"
                  }`}
                >
                  <Icon className={`h-4 w-4 transition-all duration-300 ${
                    activeSection === item.id ? 'text-neon-cyan animate-neon-pulse' : 'group-hover:text-neon-cyan'
                  }`} />
                  <span className="font-medium">{item.label}</span>
                  {activeSection === item.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl animate-pulse" />
                  )}
                </button>
              )
            })}
            
            {/* Authentication Section */}
            {status === "loading" ? (
              <div className="h-8 w-8 animate-pulse bg-accent rounded-full" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                      <AvatarFallback>
                        {session.user?.name?.charAt(0) || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user?.name && (
                        <p className="font-medium">{session.user.name}</p>
                      )}
                      {session.user?.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {session.user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={() => setActiveSection("profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => signIn()}
                className="btn-neon-primary text-sm px-6 py-2 flex items-center space-x-2 hover-lift"
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
              className="text-gray-300 hover:text-neon-cyan p-2 rounded-lg transition-all duration-300 hover:bg-gray-800/50 border border-transparent hover:border-cyan-500/30"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-700/50 glass-card-hover">
            {filteredNavItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id)
                    setIsOpen(false)
                  }}
                  className={`flex items-center space-x-3 w-full px-4 py-3 text-left transition-all duration-300 hover-lift ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-neon-cyan border-r-2 border-neon-cyan shadow-neon"
                      : "text-gray-300 hover:text-neon-cyan hover:bg-gray-800/30"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${
                    activeSection === item.id ? 'text-neon-cyan animate-neon-pulse' : ''
                  }`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
            
            {/* Mobile Auth */}
            <div className="border-t mt-4 pt-4 px-4">
              {session ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 px-2 py-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={session.user?.image || ""} />
                      <AvatarFallback>
                        {session.user?.name?.charAt(0) || <User className="h-3 w-3" />}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{session.user?.name}</span>
                  </div>
                  <Button
                    onClick={() => {
                      setActiveSection("profile")
                      setIsOpen(false)
                    }}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                  <Button
                    onClick={() => signOut()}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    signIn()
                    setIsOpen(false)
                  }}
                  variant="default"
                  size="sm"
                  className="w-full"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
