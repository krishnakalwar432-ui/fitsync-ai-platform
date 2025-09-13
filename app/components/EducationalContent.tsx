"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BookOpen, Play, Clock, Star, Search, Filter, Bookmark, BookmarkCheck,
  Video, FileText, Headphones, Download, Share2, ThumbsUp, MessageCircle,
  Award, Target, Zap, Brain, Heart, Activity, Calendar, ChevronRight,
  User, TrendingUp, CheckCircle, PlayCircle, PauseCircle
} from "lucide-react"

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  instructorAvatar: string
  duration: number // in minutes
  lessons: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
  rating: number
  reviews: number
  enrolled: boolean
  progress: number
  thumbnail: string
  tags: string[]
  premium: boolean
}

interface Lesson {
  id: string
  title: string
  type: 'video' | 'article' | 'interactive' | 'quiz'
  duration: number
  completed: boolean
  locked: boolean
  description: string
}

interface Article {
  id: string
  title: string
  excerpt: string
  author: string
  publishedDate: Date
  readTime: number
  category: string
  likes: number
  bookmarked: boolean
  thumbnail: string
  tags: string[]
}

export default function EducationalContent() {
  const [activeTab, setActiveTab] = useState("courses")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")

  const [courses] = useState<Course[]>([
    {
      id: "1",
      title: "Master Your Form: Perfect Exercise Technique",
      description: "Learn proper form for all major exercises to maximize results and prevent injury. Comprehensive biomechanics guide.",
      instructor: "Dr. Sarah Johnson",
      instructorAvatar: "/instructor-1.jpg",
      duration: 240,
      lessons: 12,
      difficulty: "beginner",
      category: "Technique",
      rating: 4.8,
      reviews: 1247,
      enrolled: true,
      progress: 35,
      thumbnail: "/course-1.jpg",
      tags: ["form", "technique", "safety", "biomechanics"],
      premium: false
    },
    {
      id: "2",
      title: "Advanced Strength Training Principles",
      description: "Dive deep into progressive overload, periodization, and advanced programming for serious lifters.",
      instructor: "Mike Chen",
      instructorAvatar: "/instructor-2.jpg", 
      duration: 180,
      lessons: 8,
      difficulty: "advanced",
      category: "Strength",
      rating: 4.9,
      reviews: 856,
      enrolled: false,
      progress: 0,
      thumbnail: "/course-2.jpg",
      tags: ["strength", "programming", "periodization"],
      premium: true
    },
    {
      id: "3",
      title: "Nutrition Science for Athletes",
      description: "Evidence-based nutrition strategies for performance, recovery, and body composition.",
      instructor: "Dr. Emma Wilson",
      instructorAvatar: "/instructor-3.jpg",
      duration: 200,
      lessons: 10,
      difficulty: "intermediate",
      category: "Nutrition",
      rating: 4.7,
      reviews: 2103,
      enrolled: true,
      progress: 80,
      thumbnail: "/course-3.jpg",
      tags: ["nutrition", "performance", "recovery"],
      premium: false
    }
  ])

  const [lessons] = useState<Lesson[]>([
    {
      id: "1",
      title: "Introduction to Biomechanics",
      type: "video",
      duration: 15,
      completed: true,
      locked: false,
      description: "Understanding how your body moves during exercise"
    },
    {
      id: "2",
      title: "Squat Fundamentals",
      type: "video", 
      duration: 20,
      completed: true,
      locked: false,
      description: "Master the king of all exercises"
    },
    {
      id: "3",
      title: "Deadlift Technique",
      type: "video",
      duration: 25,
      completed: false,
      locked: false,
      description: "Safe and effective deadlifting"
    },
    {
      id: "4",
      title: "Upper Body Mechanics",
      type: "interactive",
      duration: 30,
      completed: false,
      locked: true,
      description: "Push and pull movement patterns"
    }
  ])

  const [articles] = useState<Article[]>([
    {
      id: "1",
      title: "The Science of Muscle Recovery",
      excerpt: "Understanding the biological processes behind muscle repair and growth, and how to optimize your recovery protocol.",
      author: "Dr. James Martinez",
      publishedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      readTime: 8,
      category: "Recovery",
      likes: 342,
      bookmarked: true,
      thumbnail: "/article-1.jpg",
      tags: ["recovery", "muscle", "science"]
    },
    {
      id: "2",
      title: "HIIT vs Steady State: What the Research Says",
      excerpt: "A comprehensive analysis of different cardio approaches and their effects on fat loss, endurance, and overall health.",
      author: "Lisa Thompson",
      publishedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      readTime: 12,
      category: "Cardio",
      likes: 289,
      bookmarked: false,
      thumbnail: "/article-2.jpg",
      tags: ["cardio", "HIIT", "research"]
    },
    {
      id: "3",
      title: "Meal Timing and Performance",
      excerpt: "How when you eat can be just as important as what you eat for athletic performance and body composition.",
      author: "Dr. Amanda Lee",
      publishedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      readTime: 6,
      category: "Nutrition",
      likes: 156,
      bookmarked: true,
      thumbnail: "/article-3.jpg",
      tags: ["nutrition", "timing", "performance"]
    }
  ])

  const categories = ["All", "Technique", "Strength", "Cardio", "Nutrition", "Recovery", "Flexibility"]
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400 border-green-500'
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500'
      case 'advanced': return 'bg-red-500/20 text-red-400 border-red-500'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500'
    }
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />
      case 'article': return <FileText className="h-4 w-4" />
      case 'interactive': return <Target className="h-4 w-4" />
      case 'quiz': return <Brain className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
    }
  }

  const handleEnrollCourse = (courseId: string) => {
    console.log(`Enrolling in course: ${courseId}`)
    // Handle course enrollment
  }

  const handleBookmarkArticle = (articleId: string) => {
    console.log(`Bookmarking article: ${articleId}`)
    // Handle article bookmarking
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || course.category.toLowerCase() === selectedCategory.toLowerCase()
    const matchesDifficulty = selectedDifficulty === "all" || course.difficulty === selectedDifficulty.toLowerCase()
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || article.category.toLowerCase() === selectedCategory.toLowerCase()
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 py-8 px-4 particles-bg">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-neon-gradient mb-4">FitSync Academy</h1>
          <p className="text-gray-300 text-lg">Master your fitness journey with expert-led courses and evidence-based content</p>
        </div>

        {/* Search and Filters */}
        <Card className="glass-card-hover">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search courses, articles, and topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 glass-card"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 glass-card rounded-lg border border-gray-600 text-gray-300 bg-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category.toLowerCase()}>{category}</option>
                  ))}
                </select>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-4 py-2 glass-card rounded-lg border border-gray-600 text-gray-300 bg-transparent"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty.toLowerCase()}>{difficulty}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass-card">
            <TabsTrigger value="courses" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Courses</span>
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Articles</span>
            </TabsTrigger>
            <TabsTrigger value="my-learning" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>My Learning</span>
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className="flex items-center space-x-2">
              <Bookmark className="h-4 w-4" />
              <span>Bookmarks</span>
            </TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="glass-card-hover group">
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-t-xl flex items-center justify-center">
                      <PlayCircle className="h-16 w-16 text-white/80 group-hover:scale-110 transition-transform" />
                    </div>
                    {course.premium && (
                      <Badge className="absolute top-3 right-3 bg-yellow-500/20 text-yellow-400 border-yellow-500">
                        Premium
                      </Badge>
                    )}
                    {course.enrolled && (
                      <Badge className="absolute top-3 left-3 bg-green-500/20 text-green-400 border-green-500">
                        Enrolled
                      </Badge>
                    )}
                  </div>
                  
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-neon-cyan line-clamp-2">{course.title}</CardTitle>
                        <CardDescription className="mt-2 line-clamp-2">{course.description}</CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={course.instructorAvatar} />
                        <AvatarFallback>{course.instructor[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-400">{course.instructor}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{Math.floor(course.duration / 60)}h {course.duration % 60}m</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4 text-gray-400" />
                          <span>{course.lessons} lessons</span>
                        </div>
                      </div>
                      <Badge className={getDifficultyColor(course.difficulty)}>
                        {course.difficulty}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{course.rating}</span>
                        </div>
                        <span className="text-sm text-gray-400">({course.reviews})</span>
                      </div>
                      <span className="text-sm text-neon-purple">{course.category}</span>
                    </div>

                    {course.enrolled && course.progress > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {course.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button 
                      onClick={() => handleEnrollCourse(course.id)}
                      className={`w-full ${course.enrolled ? 'glass-card' : 'btn-neon-primary'}`}
                    >
                      {course.enrolled ? (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Continue Learning
                        </>
                      ) : (
                        <>
                          <BookOpen className="h-4 w-4 mr-2" />
                          Enroll Now
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="glass-card-hover">
                  <div className="aspect-video bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 rounded-t-xl flex items-center justify-center">
                    <FileText className="h-12 w-12 text-white/80" />
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-neon-cyan line-clamp-2">{article.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{article.excerpt}</CardDescription>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400 pt-2">
                      <span>By {article.author}</span>
                      <span>{article.publishedDate.toLocaleDateString()}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{article.readTime} min read</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {article.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{article.likes}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleBookmarkArticle(article.id)}
                          className="p-1"
                        >
                          {article.bookmarked ? (
                            <BookmarkCheck className="h-4 w-4 text-neon-cyan" />
                          ) : (
                            <Bookmark className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                      <Button size="sm" className="btn-neon-primary">
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Learning Tab */}
          <TabsContent value="my-learning" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Enrolled Courses */}
              <Card className="glass-card-hover">
                <CardHeader>
                  <CardTitle className="text-neon-green">Courses in Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courses.filter(c => c.enrolled).map((course) => (
                      <div key={course.id} className="p-4 glass-card rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-neon-cyan">{course.title}</h4>
                          <Badge className={getDifficultyColor(course.difficulty)}>
                            {course.difficulty}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                        <Button size="sm" className="w-full mt-3 btn-neon-primary">
                          <Play className="h-4 w-4 mr-2" />
                          Continue
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Course Lessons */}
              <Card className="glass-card-hover">
                <CardHeader>
                  <CardTitle className="text-neon-purple">Current Course: Form Mastery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lessons.map((lesson) => (
                      <div key={lesson.id} className={`p-4 rounded-lg border transition-all ${
                        lesson.completed 
                          ? 'bg-green-500/10 border-green-500/30' 
                          : lesson.locked
                            ? 'bg-gray-500/10 border-gray-500/30 opacity-50'
                            : 'glass-card border-gray-600 hover:border-neon-cyan/50'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {lesson.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-400" />
                            ) : lesson.locked ? (
                              <div className="h-5 w-5 bg-gray-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-gray-300 rounded-full" />
                              </div>
                            ) : (
                              <div className="h-5 w-5 bg-neon-cyan rounded-full flex items-center justify-center">
                                {getLessonIcon(lesson.type)}
                              </div>
                            )}
                            <div>
                              <h4 className={`font-medium ${lesson.locked ? 'text-gray-500' : 'text-neon-cyan'}`}>
                                {lesson.title}
                              </h4>
                              <p className="text-sm text-gray-400">{lesson.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1 text-sm text-gray-400">
                              <Clock className="h-4 w-4" />
                              <span>{lesson.duration}m</span>
                            </div>
                            {!lesson.locked && (
                              <Button size="sm" variant="outline" className="glass-card">
                                {lesson.completed ? 'Review' : 'Start'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Learning Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass-card-hover">
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-8 w-8 text-neon-cyan mx-auto mb-2" />
                  <div className="text-2xl font-bold text-neon-cyan">3</div>
                  <div className="text-sm text-gray-400">Courses Enrolled</div>
                </CardContent>
              </Card>
              <Card className="glass-card-hover">
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 text-neon-purple mx-auto mb-2" />
                  <div className="text-2xl font-bold text-neon-purple">24h</div>
                  <div className="text-sm text-gray-400">Time Spent Learning</div>
                </CardContent>
              </Card>
              <Card className="glass-card-hover">
                <CardContent className="p-6 text-center">
                  <Award className="h-8 w-8 text-neon-green mx-auto mb-2" />
                  <div className="text-2xl font-bold text-neon-green">2</div>
                  <div className="text-sm text-gray-400">Certificates Earned</div>
                </CardContent>
              </Card>
              <Card className="glass-card-hover">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-neon-orange mx-auto mb-2" />
                  <div className="text-2xl font-bold text-neon-orange">89%</div>
                  <div className="text-sm text-gray-400">Average Score</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookmarks Tab */}
          <TabsContent value="bookmarks" className="space-y-6">
            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle className="text-neon-pink">Bookmarked Content</CardTitle>
                <CardDescription>Quick access to your saved articles and resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {articles.filter(article => article.bookmarked).map((article) => (
                    <div key={article.id} className="flex items-center space-x-4 p-4 glass-card rounded-lg">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-white/80" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-neon-cyan">{article.title}</h4>
                        <p className="text-sm text-gray-400 line-clamp-2">{article.excerpt}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>{article.author}</span>
                          <span>{article.readTime} min read</span>
                          <Badge variant="outline" className="text-xs">
                            {article.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="glass-card">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="btn-neon-primary">
                          Read
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}