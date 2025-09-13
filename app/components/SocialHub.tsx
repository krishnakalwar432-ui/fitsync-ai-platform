"use client"

import { useState } from "react"
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Trophy, 
  Target,
  TrendingUp,
  Calendar,
  Clock,
  Flame,
  Heart,
  Award,
  Camera,
  Image,
  Video,
  MapPin,
  Filter,
  Search,
  Plus,
  UserPlus,
  Bell,
  Star,
  Send,
  Bookmark,
  Flag,
  MoreVertical,
  Zap,
  Medal,
  Activity
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

interface User {
  id: string
  name: string
  avatar: string
  level: number
  streak: number
  totalWorkouts: number
  followers: number
  following: number
  isFollowing?: boolean
  location?: string
  favoriteExercise?: string
}

interface Post {
  id: string
  user: User
  content: string
  media?: {
    type: 'image' | 'video'
    url: string
    thumbnail?: string
  }[]
  workout?: {
    name: string
    duration: number
    calories: number
    exercises: string[]
  }
  achievement?: {
    title: string
    description: string
    icon: string
  }
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  isBookmarked: boolean
  timestamp: Date
  location?: string
  tags: string[]
}

interface Challenge {
  id: string
  title: string
  description: string
  type: 'individual' | 'team'
  category: 'strength' | 'cardio' | 'flexibility' | 'mindfulness'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  participants: number
  reward: string
  requirements: string[]
  isJoined: boolean
  progress?: number
  startDate: Date
  endDate: Date
  creator: User
}

interface Group {
  id: string
  name: string
  description: string
  category: string
  members: number
  posts: number
  isJoined: boolean
  privacy: 'public' | 'private'
  avatar: string
  moderators: User[]
  recentActivity: string
}

export default function SocialHub() {
  const [activeTab, setActiveTab] = useState("feed")
  const [newPost, setNewPost] = useState("")
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data
  const [posts] = useState<Post[]>([
    {
      id: "1",
      user: {
        id: "user1",
        name: "Sarah Johnson",
        avatar: "/avatars/sarah.jpg",
        level: 12,
        streak: 15,
        totalWorkouts: 156,
        followers: 1250,
        following: 890,
        location: "New York, NY",
        favoriteExercise: "Deadlifts"
      },
      content: "Just crushed my personal record on deadlifts! 💪 Finally hit that 150kg mark I've been working towards for months.",
      workout: {
        name: "Strength Training - Back & Legs",
        duration: 65,
        calories: 420,
        exercises: ["Deadlifts", "Squats", "Romanian Deadlifts", "Bulgarian Split Squats"]
      },
      achievement: {
        title: "Personal Record Crusher",
        description: "Set a new personal record in deadlifts",
        icon: "🏆"
      },
      likes: 89,
      comments: 23,
      shares: 7,
      isLiked: false,
      isBookmarked: true,
      timestamp: new Date("2024-01-15T14:30:00"),
      tags: ["deadlifts", "PR", "strength", "powerlifting"]
    }
  ])

  const [challenges] = useState<Challenge[]>([
    {
      id: "challenge1",
      title: "30-Day Push-up Challenge",
      description: "Build upper body strength with progressive push-up training",
      type: "individual",
      category: "strength",
      difficulty: "beginner",
      duration: 30,
      participants: 1250,
      reward: "Push-up Master Badge",
      requirements: ["Complete daily push-up sets", "Track progress", "Share weekly updates"],
      isJoined: true,
      progress: 45,
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-01-31"),
      creator: {
        id: "trainer1",
        name: "Fitness Coach Alex",
        avatar: "/avatars/coach-alex.jpg",
        level: 25,
        streak: 365,
        totalWorkouts: 800,
        followers: 5000,
        following: 200
      }
    }
  ])

  const [groups] = useState<Group[]>([
    {
      id: "group1",
      name: "Powerlifting Community",
      description: "For serious lifters focused on strength training and powerlifting competitions",
      category: "Strength Training",
      members: 3400,
      posts: 2100,
      isJoined: true,
      privacy: "public",
      avatar: "/groups/powerlifting.jpg",
      moderators: [],
      recentActivity: "Latest post 2 hours ago"
    }
  ])

  const handleLikePost = (postId: string) => {
    console.log("Liked post:", postId)
  }

  const handleJoinChallenge = (challengeId: string) => {
    console.log("Joined challenge:", challengeId)
  }

  const handleJoinGroup = (groupId: string) => {
    console.log("Joined group:", groupId)
  }

  const createPost = () => {
    if (!newPost.trim()) return
    console.log("Creating post:", newPost)
    setNewPost("")
    setIsCreatingPost(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strength': return <Trophy className="h-4 w-4" />
      case 'cardio': return <Heart className="h-4 w-4" />
      case 'flexibility': return <Zap className="h-4 w-4" />
      case 'mindfulness': return <Star className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">FitSync Community</h1>
              <p className="text-muted-foreground">Connect, motivate, and achieve together</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button onClick={() => setIsCreatingPost(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Users className="h-5 w-5 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">Following</p>
              <p className="font-bold">156</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <MessageSquare className="h-5 w-5 mx-auto mb-2 text-green-500" />
              <p className="text-sm text-muted-foreground">Posts</p>
              <p className="font-bold">43</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Trophy className="h-5 w-5 mx-auto mb-2 text-yellow-500" />
              <p className="text-sm text-muted-foreground">Challenges</p>
              <p className="font-bold">3</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Users className="h-5 w-5 mx-auto mb-2 text-blue-500" />
              <p className="text-sm text-muted-foreground">Groups</p>
              <p className="font-bold">7</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        {/* Feed Tab */}
        <TabsContent value="feed" className="space-y-6">
          {/* Create Post */}
          {isCreatingPost && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Share your fitness journey..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    rows={3}
                  />
                  <div className="flex justify-between">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Photo
                      </Button>
                      <Button variant="outline" size="sm">
                        <Activity className="h-4 w-4 mr-2" />
                        Workout
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => setIsCreatingPost(false)} variant="outline" size="sm">
                        Cancel
                      </Button>
                      <Button onClick={createPost} size="sm">
                        <Send className="h-4 w-4 mr-2" />
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Posts */}
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="pt-6">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={post.user.avatar} />
                      <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold">{post.user.name}</p>
                        <Badge variant="outline" className="text-xs">
                          Level {post.user.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{post.timestamp.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                {/* Post Content */}
                <div className="space-y-4">
                  <p className="text-sm">{post.content}</p>

                  {/* Achievement */}
                  {post.achievement && (
                    <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                      <CardContent className="pt-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{post.achievement.icon}</div>
                          <div>
                            <p className="font-semibold text-yellow-800">{post.achievement.title}</p>
                            <p className="text-sm text-yellow-700">{post.achievement.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Workout Summary */}
                  {post.workout && (
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <Clock className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                            <p className="text-xs text-blue-700">Duration</p>
                            <p className="text-sm font-semibold text-blue-800">{post.workout.duration} min</p>
                          </div>
                          <div>
                            <Flame className="h-4 w-4 mx-auto mb-1 text-orange-600" />
                            <p className="text-xs text-orange-700">Calories</p>
                            <p className="text-sm font-semibold text-orange-800">{post.workout.calories}</p>
                          </div>
                          <div>
                            <Activity className="h-4 w-4 mx-auto mb-1 text-green-600" />
                            <p className="text-xs text-green-700">Exercises</p>
                            <p className="text-sm font-semibold text-green-800">{post.workout.exercises.length}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <Button onClick={() => handleLikePost(post.id)} variant="ghost" size="sm">
                      <Heart className="h-4 w-4 mr-1" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      {post.shares}
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Challenges Tab */}
        <TabsContent value="challenges" className="space-y-6">
          <div className="flex items-center justify-between">
            <Input
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Challenge
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                      <Trophy className="h-5 w-5 text-yellow-500" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg">{challenge.title}</h3>
                      <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="text-sm font-bold">{challenge.duration} days</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Participants</p>
                        <p className="text-sm font-bold">{challenge.participants.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Reward</p>
                        <p className="text-sm font-bold">{challenge.reward}</p>
                      </div>
                    </div>

                    {challenge.isJoined && challenge.progress !== undefined && (
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{challenge.progress}%</span>
                        </div>
                        <Progress value={challenge.progress} />
                      </div>
                    )}

                    <Button
                      onClick={() => handleJoinChallenge(challenge.id)}
                      className="w-full"
                      variant={challenge.isJoined ? "outline" : "default"}
                    >
                      {challenge.isJoined ? "View Progress" : "Join Challenge"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Groups Tab */}
        <TabsContent value="groups" className="space-y-6">
          <div className="flex items-center justify-between">
            <Input
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Card key={group.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={group.avatar} />
                        <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">{group.name}</h3>
                        <p className="text-sm text-muted-foreground">{group.category}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm">{group.description}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>{group.members.toLocaleString()} members</span>
                      <span>{group.posts} posts</span>
                    </div>
                    
                    <Button
                      onClick={() => handleJoinGroup(group.id)}
                      className="w-full"
                      variant={group.isJoined ? "outline" : "default"}
                    >
                      {group.isJoined ? "View Group" : "Join Group"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((rank) => (
                  <div key={rank} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      rank === 1 ? 'bg-yellow-500 text-white' :
                      rank === 2 ? 'bg-gray-400 text-white' :
                      rank === 3 ? 'bg-amber-600 text-white' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {rank}
                    </div>
                    <Avatar>
                      <AvatarFallback>U{rank}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">User {rank}</p>
                      <p className="text-sm text-muted-foreground">{1000 - (rank * 50)} points</p>
                    </div>
                    <Badge variant="secondary">Level {20 - rank}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}