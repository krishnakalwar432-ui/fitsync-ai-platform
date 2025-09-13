"use client"

import { useState } from "react"
import Hero from "./components/Hero"
import WorkoutLibrary from "./components/WorkoutLibrary"
import Dashboard from "./components/Dashboard"
import NutritionPlanner from "./components/NutritionPlanner"
import CalorieCalculator from "./components/CalorieCalculator"
import AIChat from "./components/AIChat"
import Navigation from "./components/Navigation"

export default function Home() {
  const [activeSection, setActiveSection] = useState("home")

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <Hero setActiveSection={setActiveSection} />
      case "workouts":
        return <WorkoutLibrary />
      case "calculator":
        return <CalorieCalculator />
      case "dashboard":
        return <Dashboard />
      case "nutrition":
        return <NutritionPlanner />
      default:
        return <Hero setActiveSection={setActiveSection} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="pt-16">{renderSection()}</main>
      <AIChat />
    </div>
  )
}
