"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, MessageSquare, Trophy, Flame, Heart, Share2, Medal, Crown,
  Star, TrendingUp, Zap, Target, Calendar, Clock, Award, Gift,
  ThumbsUp, MessageCircle, Send, Filter, Search, Plus, Camera
} from "lucide-react"

interface User {
  id: string
  name: string
  avatar: string
  level: number
  xp: number
  streak: number
  badges: Badge[]
  rank: number
}

interface Challenge {
  id: string
  title: string
  description: string
  type: 'individual' | 'group'
  difficulty: 'easy' | 'medium' | 'hard'
  duration: number
  participants: number
  reward: number
  deadline: Date
  progress: number
  isJoined: boolean
}

interface Post {
  id: string
  user: User
  content: string
  image?: string
  likes: number
  comments: number
  timestamp: Date
  tags: string[]
  isLiked: boolean
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockedAt?: Date
  progress: number
  maxProgress: number
}

export default function CommunityHub() {
  const [activeTab, setActiveTab] = useState("feed")
  const [newPost, setNewPost] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  
  const [user] = useState<User>({
    id: "1",
    name: "You",
    avatar: "/avatar-placeholder.jpg",
    level: 15,
    xp: 2450,
    streak: 7,
    badges: [],
    rank: 1247
  })

  const [challenges] = useState<Challenge[]>([
    {
      id: "1",
      title: "30-Day Push-up Challenge",
      description: "Complete 1000 push-ups in 30 days",
      type: "group",
      difficulty: "medium",
      duration: 30,
      participants: 1234,
      reward: 500,
      deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      progress: 65,
      isJoined: true
    },
    {
      id: "2", 
      title: "Morning Runner",
      description: "Run 5km every morning for a week",
      type: "individual",
      difficulty: "hard",
      duration: 7,
      participants: 567,
      reward: 300,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      progress: 0,
      isJoined: false
    },
    {
      id: "3",
      title: "Yoga Master",
      description: "Complete 10 yoga sessions this month",
      type: "individual",
      difficulty: "easy",
      duration: 30,
      participants: 890,
      reward: 200,
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      progress: 80,
      isJoined: true
    }
  ])

  const [posts] = useState<Post[]>([
    {
      id: "1",
      user: {
        id: "2",
        name: "Sarah Johnson",
        avatar: "/avatar-2.jpg",
        level: 22,
        xp: 3200,
        streak: 12,
        badges: [],
        rank: 156
      },
      content: "Just completed my first marathon! 🏃‍♀️ The training was intense but so worth it. Thanks to everyone who supported me along the way! #Marathon #Achievement #NeverGiveUp",
      image: "/marathon-photo.jpg",
      likes: 127,
      comments: 23,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      tags: ["marathon", "achievement"],
      isLiked: false
    },
    {
      id: "2", 
      user: {
        id: "3",
        name: "Mike Chen",
        avatar: "/avatar-3.jpg",
        level: 18,
        xp: 2800,
        streak: 5,
        badges: [],
        rank: 423
      },
      content: "New PR on deadlifts today! 💪 Finally hit 300lbs. The journey continues! Who's joining me for leg day tomorrow?",
      likes: 89,
      comments: 15,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      tags: ["strength", "pr", "deadlift"],
      isLiked: true
    }
  ])

  const [achievements] = useState<Achievement[]>([
    {
      id: "1",
      title: "First Steps",
      description: "Complete your first workout",
      icon: "👟",
      rarity: "common",
      unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      progress: 1,
      maxProgress: 1
    },
    {
      id: "2",
      title: "Streak Master",
      description: "Maintain a 7-day workout streak",
      icon: "🔥",
      rarity: "rare",
      unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      progress: 7,
      maxProgress: 7
    },
    {
      id: "3",
      title: "Iron Will",
      description: "Complete 100 strength workouts",
      icon: "🏋️",
      rarity: "epic",
      progress: 67,
      maxProgress: 100
    },
    {
      id: "4",
      title: "Community Leader",
      description: "Get 1000 likes on your posts",
      icon: "👑",
      rarity: "legendary",
      progress: 234,
      maxProgress: 1000
    }
  ])

  const [leaderboard] = useState([
    { name: "Alex Rodriguez", level: 45, xp: 12500, streak: 89, avatar: "/avatar-1.jpg" },
    { name: "Emma Thompson", level: 42, xp: 11800, streak: 67, avatar: "/avatar-2.jpg" },
    { name: "David Kim", level: 38, xp: 10200, streak: 45, avatar: "/avatar-3.jpg" },
    { name: "You", level: user.level, xp: user.xp, streak: user.streak, avatar: user.avatar },
    { name: "Lisa Parker", level: 33, xp: 8900, streak: 23, avatar: "/avatar-4.jpg" }
  ])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400'
      case 'rare': return 'text-blue-400 border-blue-400'
      case 'epic': return 'text-purple-400 border-purple-400'
      case 'legendary': return 'text-yellow-400 border-yellow-400'
      default: return 'text-gray-400 border-gray-400'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500'
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500'
    }
  }

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      // Add new post logic here
      setNewPost("")
    }
  }

  const handleLike = (postId: string) => {
    // Toggle like logic here
  }

  const handleJoinChallenge = (challengeId: string) => {
    // Join challenge logic here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 py-8 px-4 particles-bg">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-neon-gradient mb-4">Community Hub</h1>
          <p className="text-gray-300 text-lg">Connect, compete, and celebrate with fellow fitness enthusiasts</p>
        </div>

        {/* User Stats Banner */}
        <Card className="glass-card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 ring-4 ring-neon-cyan/50">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-neon-gradient">{user.name}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-300">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span>Level {user.level}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Flame className="h-4 w-4 text-red-400" />
                      <span>{user.streak} day streak</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Trophy className="h-4 w-4 text-neon-cyan" />
                      <span>Rank #{user.rank}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-neon-purple">{user.xp}</div>
                <div className="text-sm text-gray-400">Total XP</div>
                <Progress value={75} className="w-32 h-2 mt-2" />
                <div className="text-xs text-gray-400 mt-1">250 XP to next level</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 glass-card">
            <TabsTrigger value="feed" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Feed</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Challenges</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center space-x-2">
              <Crown className="h-4 w-4" />
              <span>Leaderboard</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center space-x-2">
              <Award className="h-4 w-4" />
              <span>Achievements</span>
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Groups</span>
            </TabsTrigger>
          </TabsList>

          {/* Feed Tab */}
          <TabsContent value="feed" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Create Post */}
                <Card className="glass-card-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-neon-cyan">
                      <Plus className="h-5 w-5" />
                      <span>Share Your Progress</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="What's your fitness win today?"
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="glass-card resize-none"
                      rows={3}
                    />
                    <div className="flex justify-between items-center">
                      <Button variant="outline" size="sm" className="glass-card">
                        <Camera className="h-4 w-4 mr-2" />
                        Add Photo
                      </Button>
                      <Button onClick={handlePostSubmit} className="btn-neon-primary">
                        <Send className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Posts Feed */}
                <div className="space-y-6">
                  {posts.map((post) => (
                    <Card key={post.id} className="glass-card-hover">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={post.user.avatar} />
                            <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-neon-cyan">{post.user.name}</h3>
                              <Badge variant="outline" className="text-xs">
                                Level {post.user.level}
                              </Badge>
                              <span className="text-xs text-gray-400">
                                {post.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-gray-200 mb-4">{post.content}</p>
                            {post.image && (
                              <div className="mb-4 rounded-xl overflow-hidden">
                                <img src={post.image} alt="Post" className="w-full h-64 object-cover" />
                              </div>
                            )}
                            <div className="flex items-center space-x-6">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleLike(post.id)}
                                className={`flex items-center space-x-2 ${post.isLiked ? 'text-red-400' : 'text-gray-400'}`}
                              >
                                <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                                <span>{post.likes}</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-400">
                                <MessageCircle className="h-4 w-4" />
                                <span>{post.comments}</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-400">
                                <Share2 className="h-4 w-4" />
                                <span>Share</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Active Challenges */}
                <Card className="glass-card-hover">
                  <CardHeader>
                    <CardTitle className="text-neon-purple">My Challenges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {challenges.filter(c => c.isJoined).map((challenge) => (
                        <div key={challenge.id} className="glass-card p-3 rounded-lg">
                          <h4 className="font-semibold text-sm text-neon-cyan mb-1">{challenge.title}</h4>
                          <Progress value={challenge.progress} className="h-2 mb-2" />
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>{challenge.progress}% complete</span>
                            <span>{Math.ceil((challenge.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="glass-card-hover">
                  <CardHeader>
                    <CardTitle className="text-neon-green">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Workouts This Week</span>
                        <span className="font-bold text-neon-cyan">5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Calories Burned</span>
                        <span className="font-bold text-neon-purple">2,340</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Personal Records</span>
                        <span className="font-bold text-neon-pink">3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Friends Online</span>
                        <span className="font-bold text-neon-green">12</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-neon-gradient">Fitness Challenges</h2>
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-48 glass-card">
                  <SelectValue placeholder="Filter challenges" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Challenges</SelectItem>
                  <SelectItem value="joined">My Challenges</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="glass-card-hover">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-neon-cyan">{challenge.title}</CardTitle>
                        <CardDescription className="mt-2">{challenge.description}</CardDescription>
                      </div>
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{challenge.duration} days</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{challenge.participants} joined</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Gift className="h-4 w-4 text-gray-400" />
                        <span>{challenge.reward} XP</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{Math.ceil((challenge.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left</span>
                      </div>
                    </div>

                    {challenge.isJoined && (
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{challenge.progress}%</span>
                        </div>
                        <Progress value={challenge.progress} className="h-2" />
                      </div>
                    )}

                    <Button
                      onClick={() => handleJoinChallenge(challenge.id)}
                      className={challenge.isJoined ? "w-full glass-card" : "w-full btn-neon-primary"}
                      variant={challenge.isJoined ? "outline" : "default"}
                    >
                      {challenge.isJoined ? "View Progress" : "Join Challenge"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-neon-orange">
                  <Crown className="h-6 w-6" />
                  <span>Global Leaderboard</span>
                </CardTitle>
                <CardDescription>Top fitness enthusiasts this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((user, index) => (
                    <div key={index} className={`flex items-center space-x-4 p-4 rounded-xl ${
                      user.name === "You" ? "bg-neon-cyan/10 border border-neon-cyan/30" : "glass-card"
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? "bg-yellow-500 text-black" :
                          index === 1 ? "bg-gray-400 text-black" :
                          index === 2 ? "bg-orange-600 text-white" :
                          "bg-gray-600 text-white"
                        }`}>
                          {index + 1}
                        </div>
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-neon-cyan">{user.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>Level {user.level}</span>
                          <span>{user.xp} XP</span>
                          <span>{user.streak} day streak</span>
                        </div>
                      </div>
                      {index < 3 && (
                        <Medal className={`h-6 w-6 ${
                          index === 0 ? "text-yellow-500" :
                          index === 1 ? "text-gray-400" :
                          "text-orange-600"
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={`glass-card-hover ${
                  achievement.unlockedAt ? "ring-2 ring-neon-cyan/50" : ""
                }`}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="text-4xl">{achievement.icon}</div>
                      <div>
                        <CardTitle className="text-neon-cyan">{achievement.title}</CardTitle>
                        <Badge className={getRarityColor(achievement.rarity)} variant="outline">
                          {achievement.rarity}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 text-sm">{achievement.description}</p>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{achievement.progress} / {achievement.maxProgress}</span>
                      </div>
                      <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                    </div>

                    {achievement.unlockedAt ? (
                      <div className="flex items-center space-x-2 text-green-400 text-sm">
                        <CheckCircle className="h-4 w-4" />
                        <span>Unlocked {achievement.unlockedAt.toLocaleDateString()}</span>
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm">
                        {achievement.maxProgress - achievement.progress} more to unlock
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups" className="space-y-6">
            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-neon-pink">
                  <Users className="h-6 w-6" />
                  <span>Fitness Groups</span>
                </CardTitle>
                <CardDescription>Join communities that match your interests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">Groups Coming Soon</h3>
                  <p className="text-gray-400 mb-6">Join interest-based fitness communities, local workout groups, and training partners.</p>
                  <Button className="btn-neon-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Get Notified
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}