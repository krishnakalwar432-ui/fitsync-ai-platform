"use client"

import { useState } from "react"
import { Target, Plus, Save, Calendar, TrendingUp, Award, X } from "lucide-react"

interface Goal {
  id: string
  title: string
  description: string
  targetValue: number
  currentValue: number
  unit: string
  category: "fitness" | "nutrition" | "health"
  deadline: string
  priority: "low" | "medium" | "high"
  completed: boolean
}

export default function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Lose Weight",
      description: "Reach target weight for summer",
      targetValue: 70,
      currentValue: 74.2,
      unit: "kg",
      category: "health",
      deadline: "2024-06-01",
      priority: "high",
      completed: false
    },
    {
      id: "2", 
      title: "Workout Consistency",
      description: "Maintain regular workout schedule",
      targetValue: 20,
      currentValue: 12,
      unit: "workouts",
      category: "fitness",
      deadline: "2024-02-29",
      priority: "high",
      completed: false
    },
    {
      id: "3",
      title: "Protein Intake",
      description: "Meet daily protein requirements",
      targetValue: 140,
      currentValue: 135,
      unit: "g/day",
      category: "nutrition", 
      deadline: "2024-01-31",
      priority: "medium",
      completed: false
    }
  ])

  const [showAddGoal, setShowAddGoal] = useState(false)
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    category: "fitness",
    priority: "medium"
  })

  const addGoal = () => {
    if (!newGoal.title || !newGoal.targetValue) return
    
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description || "",
      targetValue: newGoal.targetValue,
      currentValue: 0,
      unit: newGoal.unit || "",
      category: newGoal.category || "fitness",
      deadline: newGoal.deadline || "",
      priority: newGoal.priority || "medium",
      completed: false
    }
    
    setGoals([...goals, goal])
    setNewGoal({ category: "fitness", priority: "medium" })
    setShowAddGoal(false)
  }

  const updateGoalProgress = (goalId: string, newValue: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, currentValue: newValue, completed: newValue >= goal.targetValue }
        : goal
    ))
  }

  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId))
  }

  const getProgressPercentage = (goal: Goal) => {
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "fitness": return "from-cyan-400 to-blue-500"
      case "nutrition": return "from-green-400 to-emerald-500" 
      case "health": return "from-purple-400 to-pink-500"
      default: return "from-gray-400 to-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400 border-red-400"
      case "medium": return "text-yellow-400 border-yellow-400"
      case "low": return "text-green-400 border-green-400"
      default: return "text-gray-400 border-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neon-gradient flex items-center">
          <Target className="h-6 w-6 mr-2" />
          Goal Tracker
        </h2>
        <button
          onClick={() => setShowAddGoal(true)}
          className="btn-neon-primary flex items-center space-x-2 px-4 py-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <div key={goal.id} className="glass-card p-6 hover-lift">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white mb-1">{goal.title}</h3>
                <p className="text-sm text-gray-400">{goal.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(goal.priority)}`}>
                  {goal.priority}
                </span>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Progress</span>
                <span className="text-sm font-semibold text-neon-cyan">
                  {goal.currentValue}/{goal.targetValue} {goal.unit}
                </span>
              </div>
              <div className="bg-gray-700 rounded-full h-3">
                <div 
                  className={`bg-gradient-to-r ${getCategoryColor(goal.category)} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${getProgressPercentage(goal)}%` }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {Math.round(getProgressPercentage(goal))}% complete
              </div>
            </div>

            {/* Update Progress */}
            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-2">Update Progress</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={goal.currentValue}
                  onChange={(e) => updateGoalProgress(goal.id, Number(e.target.value))}
                  className="flex-1 input-neon text-sm py-2"
                  min="0"
                  max={goal.targetValue * 1.5}
                />
                <span className="text-xs text-gray-400 flex items-center">{goal.unit}</span>
              </div>
            </div>

            {/* Deadline */}
            {goal.deadline && (
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                </div>
                <span className={`px-2 py-1 rounded ${goal.category === 'fitness' ? 'bg-cyan-500/20 text-cyan-400' : goal.category === 'nutrition' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>
                  {goal.category}
                </span>
              </div>
            )}

            {/* Completed Badge */}
            {goal.completed && (
              <div className="mt-3 flex items-center justify-center bg-green-500/20 border border-green-500/50 rounded-lg py-2">
                <Award className="h-4 w-4 text-green-400 mr-2" />
                <span className="text-green-400 text-sm font-semibold">Completed!</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-neon-cyan">Add New Goal</h3>
              <button
                onClick={() => setShowAddGoal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Goal Title *</label>
                <input
                  type="text"
                  value={newGoal.title || ""}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  className="w-full input-neon"
                  placeholder="e.g., Lose 5kg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={newGoal.description || ""}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  className="w-full input-neon resize-none"
                  rows={3}
                  placeholder="Describe your goal..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Target Value *</label>
                  <input
                    type="number"
                    value={newGoal.targetValue || ""}
                    onChange={(e) => setNewGoal({...newGoal, targetValue: Number(e.target.value)})}
                    className="w-full input-neon"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Unit</label>
                  <input
                    type="text"
                    value={newGoal.unit || ""}
                    onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                    className="w-full input-neon"
                    placeholder="kg, reps, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({...newGoal, category: e.target.value as any})}
                    className="w-full input-neon"
                  >
                    <option value="fitness">Fitness</option>
                    <option value="nutrition">Nutrition</option>
                    <option value="health">Health</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                  <select
                    value={newGoal.priority}
                    onChange={(e) => setNewGoal({...newGoal, priority: e.target.value as any})}
                    className="w-full input-neon"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Deadline</label>
                <input
                  type="date"
                  value={newGoal.deadline || ""}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                  className="w-full input-neon"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAddGoal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addGoal}
                  disabled={!newGoal.title || !newGoal.targetValue}
                  className="flex-1 btn-neon-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Add Goal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-neon-cyan mb-4">Goal Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{goals.filter(g => g.completed).length}</div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{goals.filter(g => !g.completed).length}</div>
            <div className="text-sm text-gray-400">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{goals.filter(g => g.priority === 'high').length}</div>
            <div className="text-sm text-gray-400">High Priority</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">
              {goals.length > 0 ? Math.round(goals.reduce((acc, goal) => acc + getProgressPercentage(goal), 0) / goals.length) : 0}%
            </div>
            <div className="text-sm text-gray-400">Avg Progress</div>
          </div>
        </div>
      </div>
    </div>
  )
}