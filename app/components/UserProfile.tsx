"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { 
  User, 
  Settings, 
  Trophy, 
  Target, 
  Calendar,
  Activity,
  Heart,
  Scale,
  Zap,
  Upload,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Clock,
  TrendingUp,
  Award,
  Star,
  MapPin,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserStats {
  totalWorkouts: number
  currentStreak: number
  longestStreak: number
  caloriesBurned: number
  minutesExercised: number
  strengthPR: Record<string, number>
  favoriteExercises: string[]
  weeklyGoal: number
  completedWeeks: number
}

interface UserGoals {
  primaryGoal: string
  targetWeight: number
  currentWeight: number
  targetDate: string
  weeklyWorkouts: number
  dailyCalories: number
  waterIntake: number
  sleepHours: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earnedDate?: string
  progress?: number
  target?: number
}

export default function UserProfile() {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Mock user data - in real app, fetch from database
  const [userStats] = useState<UserStats>({
    totalWorkouts: 156,
    currentStreak: 12,
    longestStreak: 28,
    caloriesBurned: 45600,
    minutesExercised: 8940,
    strengthPR: {
      squat: 140,
      bench: 85,
      deadlift: 160,
      pullup: 15
    },
    favoriteExercises: ["Squats", "Push-ups", "Planks", "Burpees"],
    weeklyGoal: 4,
    completedWeeks: 23
  })

  const [userGoals, setUserGoals] = useState<UserGoals>({
    primaryGoal: "Build Muscle",
    targetWeight: 75,
    currentWeight: 72,
    targetDate: "2024-12-31",
    weeklyWorkouts: 4,
    dailyCalories: 2500,
    waterIntake: 3,
    sleepHours: 8
  })

  const [achievements] = useState<Achievement[]>([
    {
      id: "first_workout",
      title: "First Steps",
      description: "Complete your first workout",
      icon: "🎯",
      earnedDate: "2024-01-15"
    },
    {
      id: "streak_7",
      title: "Week Warrior",
      description: "Maintain a 7-day workout streak",
      icon: "🔥",
      earnedDate: "2024-02-01"
    },
    {
      id: "strength_milestone",
      title: "Strength Champion",
      description: "Reach personal records in 3 exercises",
      icon: "💪",
      earnedDate: "2024-03-10"
    },
    {
      id: "consistency_king",
      title: "Consistency King",
      description: "Complete 50 workouts",
      icon: "👑",
      progress: 156,
      target: 50,
      earnedDate: "2024-04-20"
    },
    {
      id: "calorie_crusher",
      title: "Calorie Crusher",
      description: "Burn 50,000 calories total",
      icon: "🔥",
      progress: 45600,
      target: 50000
    },
    {
      id: "endurance_elite",
      title: "Endurance Elite",
      description: "Exercise for 10,000 minutes",
      icon: "⏱️",
      progress: 8940,
      target: 10000
    }
  ])

  const handleSaveProfile = () => {
    // In real app, save to database
    setIsEditing(false)
    // Show success toast
  }

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "text-purple-500"
    if (streak >= 14) return "text-blue-500"
    if (streak >= 7) return "text-green-500"
    return "text-orange-500"
  }

  if (!session) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="pt-6 text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Sign In Required</h3>
          <p className="text-muted-foreground">Please sign in to view your profile and track your fitness journey.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={session.user?.image || ""} />
                <AvatarFallback className="text-lg">
                  {session.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{session.user?.name || "Fitness Enthusiast"}</h1>
                <p className="text-muted-foreground">{session.user?.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <Trophy className="h-3 w-3" />
                    <span>Level {Math.floor(userStats.totalWorkouts / 10) + 1}</span>
                  </Badge>
                  <Badge variant="outline" className={`flex items-center space-x-1 ${getStreakColor(userStats.currentStreak)}`}>
                    <Zap className="h-3 w-3" />
                    <span>{userStats.currentStreak} day streak</span>
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
            >
              {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Workouts</p>
                    <p className="text-2xl font-bold">{userStats.totalWorkouts}</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Calories Burned</p>
                    <p className="text-2xl font-bold">{userStats.caloriesBurned.toLocaleString()}</p>
                  </div>
                  <Zap className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Exercise Time</p>
                    <p className="text-2xl font-bold">{Math.round(userStats.minutesExercised / 60)}h</p>
                  </div>
                  <Clock className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Longest Streak</p>
                    <p className="text-2xl font-bold">{userStats.longestStreak} days</p>
                  </div>
                  <Trophy className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Personal Records */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Personal Records</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(userStats.strengthPR).map(([exercise, weight]) => (
                  <div key={exercise} className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground capitalize">{exercise}</p>
                    <p className="text-xl font-bold">{weight}kg</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Favorite Exercises */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>Favorite Exercises</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {userStats.favoriteExercises.map((exercise) => (
                  <Badge key={exercise} variant="secondary">
                    {exercise}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Current Goals</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primaryGoal">Primary Goal</Label>
                    <Input
                      id="primaryGoal"
                      value={userGoals.primaryGoal}
                      onChange={(e) => setUserGoals({...userGoals, primaryGoal: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="targetWeight">Target Weight (kg)</Label>
                    <Input
                      id="targetWeight"
                      type="number"
                      value={userGoals.targetWeight}
                      onChange={(e) => setUserGoals({...userGoals, targetWeight: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="weeklyWorkouts">Weekly Workouts</Label>
                    <Input
                      id="weeklyWorkouts"
                      type="number"
                      value={userGoals.weeklyWorkouts}
                      onChange={(e) => setUserGoals({...userGoals, weeklyWorkouts: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dailyCalories">Daily Calories</Label>
                    <Input
                      id="dailyCalories"
                      type="number"
                      value={userGoals.dailyCalories}
                      onChange={(e) => setUserGoals({...userGoals, dailyCalories: Number(e.target.value)})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button onClick={handleSaveProfile} className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save Goals
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Primary Goal</span>
                      <Badge>{userGoals.primaryGoal}</Badge>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span>Weight Progress</span>
                        <span>{userGoals.currentWeight}kg / {userGoals.targetWeight}kg</span>
                      </div>
                      <Progress value={calculateProgress(userGoals.currentWeight, userGoals.targetWeight)} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span>Weekly Workout Goal</span>
                        <span>3 / {userGoals.weeklyWorkouts}</span>
                      </div>
                      <Progress value={75} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Daily Calories Target</span>
                      <span>{userGoals.dailyCalories} cal</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Water Intake Goal</span>
                      <span>{userGoals.waterIntake}L daily</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Sleep Target</span>
                      <span>{userGoals.sleepHours}h daily</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border ${
                      achievement.earnedDate 
                        ? "bg-primary/5 border-primary/20" 
                        : "bg-muted/50 border-muted"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        {achievement.earnedDate ? (
                          <Badge variant="secondary" className="mt-2">
                            Earned {new Date(achievement.earnedDate).toLocaleDateString()}
                          </Badge>
                        ) : achievement.progress && achievement.target ? (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Progress</span>
                              <span>{achievement.progress} / {achievement.target}</span>
                            </div>
                            <Progress 
                              value={calculateProgress(achievement.progress, achievement.target)} 
                              className="mt-1"
                            />
                          </div>
                        ) : (
                          <Badge variant="outline" className="mt-2">Locked</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Profile Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" value={session.user?.name || ""} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={session.user?.email || ""} disabled />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="City, Country" />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" placeholder="Tell us about your fitness journey..." />
              </div>
              <Button className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy & Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Workout Reminders</p>
                  <p className="text-sm text-muted-foreground">Get notified about your scheduled workouts</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Progress Updates</p>
                  <p className="text-sm text-muted-foreground">Weekly progress reports and insights</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Public Profile</p>
                  <p className="text-sm text-muted-foreground">Allow others to see your achievements</p>
                </div>
                <Button variant="outline" size="sm">Private</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}