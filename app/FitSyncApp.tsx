"use client"

import { useState } from "react"
import Navigation from "./components/Navigation-Simple"
import Hero3D from "./components/Hero3D"
import Dashboard from "./components/Dashboard"
import WorkoutVisualizer3D from "./components/WorkoutVisualizer3D"
import PersonalizedWorkoutPlanner from "./components/PersonalizedWorkoutPlanner"
import MotionTracker from "./components/MotionTracker"
import RealtimeFeedback from "./components/RealtimeFeedback"
import NutritionAnalysis from "./components/NutritionAnalysis"
import CommunityHub from "./components/CommunityHub"
import WearableIntegration from "./components/WearableIntegration"
import AnalyticsDashboard from "./components/AnalyticsDashboard"
import AIChatbot from "./components/AIChatbot"
import SmartRecommendations from "./components/SmartRecommendations"
import VoiceAssistant from "./components/VoiceAssistant"
import SubscriptionManagement from "./components/SubscriptionManagement"
import EducationalContent from "./components/EducationalContent"
import GoalSetting from "./components/GoalSetting"

export default function App() {
  const [activeSection, setActiveSection] = useState("home")

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <Hero3D />
      case "dashboard":
        return <Dashboard />
      case "workouts":
        return <PersonalizedWorkoutPlanner />
      case "workout-visualizer":
        return <WorkoutVisualizer3D />
      case "motion-tracker":
        return <MotionTracker />
      case "voice-coach":
        return <RealtimeFeedback />
      case "nutrition":
        return <NutritionAnalysis />
      case "community":
        return <CommunityHub />
      case "wearables":
        return <WearableIntegration />
      case "analytics":
        return <AnalyticsDashboard />
      case "ai-chat":
        return <AIChatbot />
      case "recommendations":
        return <SmartRecommendations />
      case "voice-assistant":
        return <VoiceAssistant />
      case "subscription":
        return <SubscriptionManagement />
      case "education":
        return <EducationalContent />
      case "goals":
        return <GoalSetting />
      default:
        return <Hero3D />
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="pt-16">
        {renderSection()}
      </main>
    </div>
  )
}