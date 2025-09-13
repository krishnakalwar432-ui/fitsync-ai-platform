"use client"

import { useState } from "react"
import Navigation from "@/components/Navigation"
import HomePage from "@/components/HomePage"
import WorkoutLibrary from "@/components/WorkoutLibrary"
import TrainerProfiles from "@/components/TrainerProfiles"
import CalorieCalculator from "@/components/CalorieCalculator"
import FitnessWorkoutGuide from "@/components/FitnessWorkoutGuide"
import UserProfile from "@/components/UserProfile"
import WorkoutTracker from "@/components/WorkoutTracker"
import AIChat from "@/components/AIChat"
import SocialHub from "@/components/SocialHub"
import NutritionPlanner from "@/components/NutritionPlanner"
import DashboardAnalytics from "@/components/DashboardAnalytics"

export default function MainApp() {
  const [activeSection, setActiveSection] = useState("home")

  const renderActiveSection = () => {
    switch (activeSection) {
      case "home":
        return <HomePage setActiveSection={setActiveSection} />
      case "workouts":
        return <WorkoutLibrary />
      case "workout-tracker":
        return <WorkoutTracker />
      case "ai-chat":
        return (
          <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">AI Fitness Coach</h1>
              <p className="text-muted-foreground">Get personalized advice, workout plans, and nutrition guidance from our AI assistant.</p>
            </div>
            <AIChat />
          </div>
        )
      case "guides":
        return <FitnessWorkoutGuide />
      case "trainers":
        return <TrainerProfiles />
      case "calculator":
        return <CalorieCalculator />
      case "social":
        return <SocialHub />
      case "challenges":
        return (
          <div className="max-w-6xl mx-auto p-6">
            <SocialHub />
          </div>
        )
      case "dashboard":
        return <DashboardAnalytics />
      case "progress":
        return <DashboardAnalytics />
      case "nutrition":
        return <NutritionPlanner />
      case "profile":
        return <UserProfile />
      default:
        return <HomePage setActiveSection={setActiveSection} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="pt-16">
        {renderActiveSection()}
      </main>
    </div>
  )
}