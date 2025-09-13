"use client"

import { useState } from "react"
import Hero from "./components/Hero"
import WorkoutLibrary from "./components/WorkoutLibrary"
import WorkoutGuide from "./components/WorkoutGuide"
import TrainerProfiles from "./components/TrainerProfiles"
import ProgressCharts from "./components/ProgressCharts"
import Dashboard from "./components/Dashboard"
import NutritionPlanner from "./components/NutritionPlanner"
import CalorieCalculator from "./components/CalorieCalculator"
import AIChat from "./components/AIChat"
import Navigation from "./components/Navigation"
import UserProfile from "./components/UserProfile"
import WorkoutTracker from "./components/WorkoutTracker"
import SocialHub from "./components/SocialHub"

export default function Home() {
  const [activeSection, setActiveSection] = useState("home")

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <Hero setActiveSection={setActiveSection} />
      case "workouts":
        return <WorkoutLibrary />
      case "workout-tracker":
        return <WorkoutTracker />
      case "ai-chat":
        return (
          <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2 text-neon-gradient">AI Fitness Coach</h1>
              <p className="text-gray-300">Get personalized advice, workout plans, and nutrition guidance from our AI assistant.</p>
            </div>
            <div className="relative">
              <AIChat />
            </div>
          </div>
        )
      case "guides":
        return <WorkoutGuide />
      case "trainers":
        return <TrainerProfiles />
      case "calculator":
        return <CalorieCalculator />
      case "social":
        return <SocialHub />
      case "challenges":
        return <SocialHub />
      case "dashboard":
        return <Dashboard />
      case "progress":
        return <ProgressCharts />
      case "nutrition":
        return <NutritionPlanner />
      case "profile":
        return <UserProfile />
      default:
        return <Hero setActiveSection={setActiveSection} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-gray-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-radial opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-noise pointer-events-none" />
      
      {/* Main content */}
      <div className="relative z-10">
        <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
        <main className="pt-16">
          <div className="animate-fadeIn">
            {renderSection()}
          </div>
        </main>
        {/* AI Chat available on all pages except dedicated ai-chat page */}
        {activeSection !== "ai-chat" && <AIChat />}
      </div>
      
      {/* Floating neon orbs for ambiance */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}} />
      <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-pink-500/10 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}} />
    </div>
  )
}
