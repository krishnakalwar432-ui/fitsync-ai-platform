"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Target, Calendar, Clock, Bell, Award, TrendingUp, Plus, Edit,
  CheckCircle, AlertCircle, Zap, Brain, Heart, Activity, Star,
  Trash2, Settings, Repeat, Flag, Timer, BarChart3, Gift
} from "lucide-react"

interface Goal {
  id: string
  title: string
  description: string
  category: 'fitness' | 'nutrition' | 'health' | 'lifestyle'
  type: 'numeric' | 'boolean' | 'duration'
  targetValue: number
  currentValue: number
  unit: string
  deadline: Date
  startDate: Date
  priority: 'low' | 'medium' | 'high'
  status: 'active' | 'completed' | 'paused' | 'failed'
  milestones: Milestone[]
  reminders: Reminder[]
  isRecurring: boolean
  recurringPattern?: 'daily' | 'weekly' | 'monthly'
}

interface Milestone {
  id: string
  title: string
  targetValue: number
  completed: boolean
  completedDate?: Date
  reward?: string
}

interface Reminder {
  id: string
  type: 'push' | 'email' | 'sms'
  frequency: 'daily' | 'weekly' | 'custom'
  time: string
  message: string
  enabled: boolean
}

export default function GoalSetting() {
  const [activeTab, setActiveTab] = useState("goals")
  const [showNewGoalForm, setShowNewGoalForm] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Lose 20 pounds",
      description: "Reach my target weight of 160 lbs for better health and confidence",
      category: "fitness",
      type: "numeric",
      targetValue: 20,
      currentValue: 8,
      unit: "lbs",
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      priority: "high",
      status: "active",
      isRecurring: false,
      milestones: [
        { id: "1", title: "First 5 lbs", targetValue: 5, completed: true, completedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
        { id: "2", title: "Halfway Point", targetValue: 10, completed: false, reward: "New workout clothes" },
        { id: "3", title: "Final Goal", targetValue: 20, completed: false, reward: "Weekend spa trip" }
      ],
      reminders: [
        { id: "1", type: "push", frequency: "daily", time: "08:00", message: "Time for your morning weigh-in!", enabled: true },
        { id: "2", type: "push", frequency: "weekly", time: "18:00", message: "Weekly progress check - you've got this!", enabled: true }
      ]
    },
    {
      id: "2",
      title: "Run 5K without stopping",
      description: "Build endurance to complete a 5K run in under 30 minutes",
      category: "fitness",
      type: "boolean",
      targetValue: 1,
      currentValue: 0,
      unit: "goal",
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      priority: "medium",
      status: "active",
      isRecurring: false,
      milestones: [
        { id: "1", title: "Run 1K continuously", targetValue: 1, completed: true, completedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
        { id: "2", title: "Run 2.5K continuously", targetValue: 1, completed: false },
        { id: "3", title: "Complete 5K", targetValue: 1, completed: false, reward: "New running shoes" }
      ],
      reminders: [
        { id: "1", type: "push", frequency: "daily", time: "17:00", message: "Time for your evening run!", enabled: true }
      ]
    },
    {
      id: "3",
      title: "Drink 8 glasses of water daily",
      description: "Stay properly hydrated for better health and energy",
      category: "health",
      type: "numeric",
      targetValue: 8,
      currentValue: 6,
      unit: "glasses",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      priority: "medium",
      status: "active",
      isRecurring: true,
      recurringPattern: "daily",
      milestones: [],
      reminders: [
        { id: "1", type: "push", frequency: "custom", time: "10:00", message: "💧 Time for a hydration break!", enabled: true },
        { id: "2", type: "push", frequency: "custom", time: "14:00", message: "💧 Afternoon hydration reminder!", enabled: true },
        { id: "3", type: "push", frequency: "custom", time: "18:00", message: "💧 Evening water check!", enabled: true }
      ]
    }
  ])

  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "fitness",
    type: "numeric",
    targetValue: "",
    unit: "",
    deadline: "",
    priority: "medium"
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fitness': return <Activity className="h-5 w-5" />
      case 'nutrition': return <Heart className="h-5 w-5" />
      case 'health': return <Zap className="h-5 w-5" />
      case 'lifestyle': return <Star className="h-5 w-5" />
      default: return <Target className="h-5 w-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fitness': return 'text-neon-cyan'
      case 'nutrition': return 'text-neon-green'
      case 'health': return 'text-neon-purple'
      case 'lifestyle': return 'text-neon-orange'
      default: return 'text-gray-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500'
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400'
      case 'completed': return 'bg-blue-500/20 text-blue-400'
      case 'paused': return 'bg-yellow-500/20 text-yellow-400'
      case 'failed': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const calculateProgress = (goal: Goal) => {
    if (goal.type === 'boolean') {
      return goal.currentValue > 0 ? 100 : 0
    }
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100)
  }

  const getDaysRemaining = (deadline: Date) => {
    const now = new Date()
    const diffTime = deadline.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleCreateGoal = () => {
    if (newGoal.title && newGoal.targetValue) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description,
        category: newGoal.category as any,
        type: newGoal.type as any,
        targetValue: parseFloat(newGoal.targetValue),
        currentValue: 0,
        unit: newGoal.unit,
        deadline: new Date(newGoal.deadline),
        startDate: new Date(),
        priority: newGoal.priority as any,
        status: 'active',
        isRecurring: false,
        milestones: [],
        reminders: []
      }
      
      setGoals(prev => [...prev, goal])
      setShowNewGoalForm(false)
      setNewGoal({
        title: "",
        description: "",
        category: "fitness",
        type: "numeric",
        targetValue: "",
        unit: "",
        deadline: "",
        priority: "medium"
      })
    }
  }

  const handleUpdateProgress = (goalId: string, newValue: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, currentValue: newValue }
        : goal
    ))
  }

  const handleToggleReminder = (goalId: string, reminderId: string) => {
    setGoals(prev => prev.map(goal =>
      goal.id === goalId
        ? {
            ...goal,
            reminders: goal.reminders.map(reminder =>
              reminder.id === reminderId
                ? { ...reminder, enabled: !reminder.enabled }
                : reminder
            )
          }
        : goal
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 py-8 px-4 particles-bg">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-neon-gradient mb-4">Goal Achievement</h1>
          <p className="text-gray-300 text-lg">Set, track, and achieve your fitness goals with AI-powered insights</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass-card">
            <TabsTrigger value="goals">My Goals</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-neon-gradient">Active Goals</h2>
              <Button onClick={() => setShowNewGoalForm(true)} className="btn-neon-primary">
                <Plus className="h-4 w-4 mr-2" />
                New Goal
              </Button>
            </div>

            {showNewGoalForm && (
              <Card className="glass-card-hover">
                <CardHeader>
                  <CardTitle className="text-neon-cyan">Create New Goal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Goal Title</Label>
                      <Input
                        value={newGoal.title}
                        onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                        placeholder="e.g., Run a marathon"
                        className="glass-card"
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select value={newGoal.category} onValueChange={(value) => setNewGoal({...newGoal, category: value})}>
                        <SelectTrigger className="glass-card">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fitness">Fitness</SelectItem>
                          <SelectItem value="nutrition">Nutrition</SelectItem>
                          <SelectItem value="health">Health</SelectItem>
                          <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Target Value</Label>
                      <Input
                        type="number"
                        value={newGoal.targetValue}
                        onChange={(e) => setNewGoal({...newGoal, targetValue: e.target.value})}
                        placeholder="10"
                        className="glass-card"
                      />
                    </div>
                    <div>
                      <Label>Unit</Label>
                      <Input
                        value={newGoal.unit}
                        onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                        placeholder="lbs, km, minutes"
                        className="glass-card"
                      />
                    </div>
                    <div>
                      <Label>Deadline</Label>
                      <Input
                        type="date"
                        value={newGoal.deadline}
                        onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                        className="glass-card"
                      />
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <Select value={newGoal.priority} onValueChange={(value) => setNewGoal({...newGoal, priority: value})}>
                        <SelectTrigger className="glass-card">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={newGoal.description}
                      onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                      placeholder="Describe your goal and why it's important to you"
                      className="glass-card"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <Button onClick={handleCreateGoal} className="btn-neon-primary">
                      Create Goal
                    </Button>
                    <Button onClick={() => setShowNewGoalForm(false)} variant="outline" className="glass-card">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal) => (
                <Card key={goal.id} className="glass-card-hover">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <div className={getCategoryColor(goal.category)}>
                          {getCategoryIcon(goal.category)}
                        </div>
                        <div>
                          <CardTitle className="text-neon-cyan">{goal.title}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getPriorityColor(goal.priority)}>
                              {goal.priority}
                            </Badge>
                            <Badge className={getStatusColor(goal.status)}>
                              {goal.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 text-sm">{goal.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>
                          {goal.currentValue} / {goal.targetValue} {goal.unit}
                        </span>
                      </div>
                      <Progress value={calculateProgress(goal)} className="h-3" />
                      <div className="text-xs text-gray-400 text-center">
                        {Math.round(calculateProgress(goal))}% complete
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Days remaining</span>
                        <div className="font-bold text-neon-purple">
                          {getDaysRemaining(goal.deadline)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400">Milestones</span>
                        <div className="font-bold text-neon-green">
                          {goal.milestones.filter(m => m.completed).length} / {goal.milestones.length}
                        </div>
                      </div>
                    </div>

                    {goal.milestones.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-400 text-sm">Next Milestone</h4>
                        {goal.milestones.find(m => !m.completed) && (
                          <div className="p-2 glass-card rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Flag className="h-4 w-4 text-neon-orange" />
                              <span className="text-sm">{goal.milestones.find(m => !m.completed)?.title}</span>
                            </div>
                            {goal.milestones.find(m => !m.completed)?.reward && (
                              <div className="flex items-center space-x-2 mt-1">
                                <Gift className="h-4 w-4 text-neon-pink" />
                                <span className="text-xs text-gray-400">
                                  Reward: {goal.milestones.find(m => !m.completed)?.reward}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="flex-1 btn-neon-primary"
                        onClick={() => handleUpdateProgress(goal.id, goal.currentValue + 1)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Update
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="glass-card"
                        onClick={() => setSelectedGoal(goal)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="glass-card-hover">
                <CardContent className="p-6 text-center">
                  <Target className="h-8 w-8 text-neon-cyan mx-auto mb-2" />
                  <div className="text-2xl font-bold text-neon-cyan">{goals.length}</div>
                  <div className="text-sm text-gray-400">Total Goals</div>
                </CardContent>
              </Card>
              <Card className="glass-card-hover">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-8 w-8 text-neon-green mx-auto mb-2" />
                  <div className="text-2xl font-bold text-neon-green">
                    {goals.filter(g => g.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-400">Completed</div>
                </CardContent>
              </Card>
              <Card className="glass-card-hover">
                <CardContent className="p-6 text-center">
                  <Activity className="h-8 w-8 text-neon-purple mx-auto mb-2" />
                  <div className="text-2xl font-bold text-neon-purple">
                    {goals.filter(g => g.status === 'active').length}
                  </div>
                  <div className="text-sm text-gray-400">Active</div>
                </CardContent>
              </Card>
              <Card className="glass-card-hover">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-neon-orange mx-auto mb-2" />
                  <div className="text-2xl font-bold text-neon-orange">
                    {Math.round(goals.reduce((acc, goal) => acc + calculateProgress(goal), 0) / goals.length)}%
                  </div>
                  <div className="text-sm text-gray-400">Avg Progress</div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Charts */}
            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle className="text-neon-green">Goal Progress Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {goals.map((goal) => (
                    <div key={goal.id} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className={getCategoryColor(goal.category)}>
                            {getCategoryIcon(goal.category)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-neon-cyan">{goal.title}</h4>
                            <div className="text-sm text-gray-400">
                              {goal.currentValue} / {goal.targetValue} {goal.unit}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-neon-purple">
                            {Math.round(calculateProgress(goal))}%
                          </div>
                          <div className="text-xs text-gray-400">
                            {getDaysRemaining(goal.deadline)} days left
                          </div>
                        </div>
                      </div>
                      <Progress value={calculateProgress(goal)} className="h-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reminders Tab */}
          <TabsContent value="reminders" className="space-y-6">
            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-neon-orange">
                  <Bell className="h-6 w-6" />
                  <span>Active Reminders</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goals.flatMap(goal => 
                    goal.reminders.map(reminder => (
                      <div key={reminder.id} className="flex items-center justify-between p-4 glass-card rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Bell className={`h-5 w-5 ${reminder.enabled ? 'text-neon-cyan' : 'text-gray-400'}`} />
                          <div>
                            <h4 className="font-medium text-neon-cyan">{goal.title}</h4>
                            <p className="text-sm text-gray-400">{reminder.message}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {reminder.frequency}
                              </Badge>
                              <span className="text-xs text-gray-500">{reminder.time}</span>
                            </div>
                          </div>
                        </div>
                        <Switch 
                          checked={reminder.enabled}
                          onCheckedChange={() => handleToggleReminder(goal.id, reminder.id)}
                        />
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card-hover">
                <CardHeader>
                  <CardTitle className="text-neon-pink">Achievement Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 glass-card rounded-lg">
                      <Brain className="h-5 w-5 text-neon-green mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Peak Performance Time</p>
                        <p className="text-xs text-gray-400">You're most likely to achieve goals started on Mondays</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 glass-card rounded-lg">
                      <BarChart3 className="h-5 w-5 text-neon-purple mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Success Pattern</p>
                        <p className="text-xs text-gray-400">Fitness goals have 85% higher completion rate than lifestyle goals</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 glass-card rounded-lg">
                      <Timer className="h-5 w-5 text-neon-orange mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Optimal Duration</p>
                        <p className="text-xs text-gray-400">Goals with 60-90 day timeframes show best completion rates</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card-hover">
                <CardHeader>
                  <CardTitle className="text-neon-yellow">Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg">
                      <h4 className="font-medium text-neon-cyan mb-2">🎯 Focus Suggestion</h4>
                      <p className="text-sm text-gray-300">
                        Concentrate on your weight loss goal - you're making great progress!
                      </p>
                    </div>
                    <div className="p-3 bg-neon-purple/10 border border-neon-purple/30 rounded-lg">
                      <h4 className="font-medium text-neon-purple mb-2">⏰ Time Management</h4>
                      <p className="text-sm text-gray-300">
                        Consider breaking your 5K goal into smaller weekly targets.
                      </p>
                    </div>
                    <div className="p-3 bg-neon-green/10 border border-neon-green/30 rounded-lg">
                      <h4 className="font-medium text-neon-green mb-2">🏆 Motivation Boost</h4>
                      <p className="text-sm text-gray-300">
                        You're on track to complete 3 goals this month! Keep it up!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}