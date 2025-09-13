"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, TrendingUp, Target, Calendar, Clock, Award,
  Flame, Heart, Activity, Zap, Download, Share2, Filter
} from "lucide-react"

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("30d")
  const [activeTab, setActiveTab] = useState("overview")

  const stats = {
    totalWorkouts: 127,
    totalHours: 89.5,
    caloriesBurned: 12750,
    avgHeartRate: 142,
    personalRecords: 23,
    streakDays: 15
  }

  const workoutTypes = [
    { name: "Strength", count: 45, percentage: 35, color: "text-neon-cyan" },
    { name: "Cardio", count: 38, percentage: 30, color: "text-neon-purple" },
    { name: "HIIT", count: 25, percentage: 20, color: "text-neon-orange" },
    { name: "Yoga", count: 19, percentage: 15, color: "text-neon-green" }
  ]

  const monthlyProgress = [
    { month: "Jan", workouts: 28, calories: 2100, hours: 18.5 },
    { month: "Feb", workouts: 25, calories: 1890, hours: 16.2 },
    { month: "Mar", workouts: 32, calories: 2450, hours: 21.3 },
    { month: "Apr", workouts: 29, calories: 2180, hours: 19.1 },
    { month: "May", workouts: 35, calories: 2650, hours: 23.8 },
    { month: "Jun", workouts: 31, calories: 2340, hours: 20.5 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 py-8 px-4 particles-bg">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-neon-gradient mb-4">Analytics</h1>
            <p className="text-gray-300 text-lg">Comprehensive fitness insights and performance tracking</p>
          </div>
          <div className="flex space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 glass-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="glass-card">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <Card className="glass-card-hover">
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-neon-cyan mx-auto mb-2" />
              <div className="text-2xl font-bold text-neon-cyan">{stats.totalWorkouts}</div>
              <div className="text-sm text-gray-400">Total Workouts</div>
            </CardContent>
          </Card>

          <Card className="glass-card-hover">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-neon-purple mx-auto mb-2" />
              <div className="text-2xl font-bold text-neon-purple">{stats.totalHours}h</div>
              <div className="text-sm text-gray-400">Training Hours</div>
            </CardContent>
          </Card>

          <Card className="glass-card-hover">
            <CardContent className="p-6 text-center">
              <Flame className="h-8 w-8 text-neon-orange mx-auto mb-2" />
              <div className="text-2xl font-bold text-neon-orange">{stats.caloriesBurned.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Calories Burned</div>
            </CardContent>
          </Card>

          <Card className="glass-card-hover">
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 text-neon-red mx-auto mb-2" />
              <div className="text-2xl font-bold text-neon-red">{stats.avgHeartRate}</div>
              <div className="text-sm text-gray-400">Avg Heart Rate</div>
            </CardContent>
          </Card>

          <Card className="glass-card-hover">
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-neon-green mx-auto mb-2" />
              <div className="text-2xl font-bold text-neon-green">{stats.personalRecords}</div>
              <div className="text-sm text-gray-400">Personal Records</div>
            </CardContent>
          </Card>

          <Card className="glass-card-hover">
            <CardContent className="p-6 text-center">
              <Zap className="h-8 w-8 text-neon-yellow mx-auto mb-2" />
              <div className="text-2xl font-bold text-neon-yellow">{stats.streakDays}</div>
              <div className="text-sm text-gray-400">Day Streak</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass-card">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Workout Types */}
              <Card className="glass-card-hover">
                <CardHeader>
                  <CardTitle className="text-neon-cyan">Workout Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {workoutTypes.map((type) => (
                      <div key={type.name} className="space-y-2">
                        <div className="flex justify-between">
                          <span className={type.color}>{type.name}</span>
                          <span className="text-gray-400">{type.count} sessions</span>
                        </div>
                        <Progress value={type.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Trends */}
              <Card className="glass-card-hover">
                <CardHeader>
                  <CardTitle className="text-neon-purple">Monthly Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyProgress.map((month) => (
                      <div key={month.month} className="flex justify-between items-center p-3 glass-card rounded-lg">
                        <span className="font-medium">{month.month}</span>
                        <div className="text-right">
                          <div className="text-sm font-bold text-neon-cyan">{month.workouts} workouts</div>
                          <div className="text-xs text-gray-400">{month.calories} cal | {month.hours}h</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="workouts" className="space-y-6">
            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle className="text-neon-green">Workout Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 glass-card rounded-xl">
                    <div className="text-3xl font-bold text-neon-cyan">4.2</div>
                    <div className="text-sm text-gray-400">Avg Sessions/Week</div>
                  </div>
                  <div className="text-center p-4 glass-card rounded-xl">
                    <div className="text-3xl font-bold text-neon-purple">45min</div>
                    <div className="text-sm text-gray-400">Avg Duration</div>
                  </div>
                  <div className="text-center p-4 glass-card rounded-xl">
                    <div className="text-3xl font-bold text-neon-orange">87%</div>
                    <div className="text-sm text-gray-400">Consistency Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle className="text-neon-pink">Fitness Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Strength Improvement</span>
                      <span className="text-neon-cyan">+23%</span>
                    </div>
                    <Progress value={78} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Endurance Gains</span>
                      <span className="text-neon-purple">+18%</span>
                    </div>
                    <Progress value={65} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Flexibility</span>
                      <span className="text-neon-green">+12%</span>
                    </div>
                    <Progress value={45} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle className="text-neon-orange">Goal Achievement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 glass-card rounded-lg">
                    <span>Weekly Workout Goal</span>
                    <Badge className="bg-green-500/20 text-green-400">Achieved</Badge>
                  </div>
                  <div className="flex justify-between items-center p-4 glass-card rounded-lg">
                    <span>Monthly Calorie Target</span>
                    <Badge className="bg-yellow-500/20 text-yellow-400">85% Complete</Badge>
                  </div>
                  <div className="flex justify-between items-center p-4 glass-card rounded-lg">
                    <span>Strength Milestone</span>
                    <Badge className="bg-blue-500/20 text-blue-400">In Progress</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}