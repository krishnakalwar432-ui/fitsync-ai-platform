"use client"

import { useState, useEffect } from "react"
import { Quote, Sparkles, RefreshCw } from "lucide-react"

interface MotivationalQuotesProps {
  autoRotate?: boolean
  rotationInterval?: number
  showControls?: boolean
  variant?: "banner" | "card" | "minimal"
  className?: string
}

interface Quote {
  text: string
  author?: string
  category: "motivation" | "fitness" | "strength" | "mindset" | "perseverance"
}

export default function MotivationalQuotes({
  autoRotate = true,
  rotationInterval = 5000,
  showControls = true,
  variant = "card",
  className = ""
}: MotivationalQuotesProps) {
  const [quotes] = useState<Quote[]>([
    {
      text: "The body achieves what the mind believes.",
      author: "Napoleon Hill",
      category: "mindset"
    },
    {
      text: "Success starts with self-discipline.",
      author: "Unknown",
      category: "motivation"
    },
    {
      text: "Push yourself because no one else is going to do it for you.",
      author: "Unknown",
      category: "motivation"
    },
    {
      text: "Great things never come from comfort zones.",
      author: "Unknown",
      category: "perseverance"
    },
    {
      text: "Your only limit is your mind.",
      author: "Unknown",
      category: "mindset"
    },
    {
      text: "Wake up. Work out. Look hot. Kick ass.",
      author: "Unknown",
      category: "motivation"
    },
    {
      text: "Sweat is just fat crying.",
      author: "Unknown",
      category: "fitness"
    },
    {
      text: "Strong is the new skinny.",
      author: "Unknown",
      category: "strength"
    },
    {
      text: "Don't wish for it, work for it.",
      author: "Unknown",
      category: "motivation"
    },
    {
      text: "The pain you feel today will be the strength you feel tomorrow.",
      author: "Unknown",
      category: "perseverance"
    },
    {
      text: "Train like a beast, look like a beauty.",
      author: "Unknown",
      category: "fitness"
    },
    {
      text: "Make your body your trophy.",
      author: "Unknown",
      category: "fitness"
    },
    {
      text: "Champions train, losers complain.",
      author: "Unknown",
      category: "motivation"
    },
    {
      text: "Every workout brings you closer to your goal.",
      author: "Unknown",
      category: "perseverance"
    },
    {
      text: "Fitness is not about being better than someone else. It's about being better than you used to be.",
      author: "Unknown",
      category: "mindset"
    },
    {
      text: "The hardest step is stepping out the door.",
      author: "Unknown",
      category: "motivation"
    },
    {
      text: "Your body can do anything. It's your mind you have to convince.",
      author: "Unknown",
      category: "mindset"
    },
    {
      text: "Fall seven times, stand up eight.",
      author: "Japanese Proverb",
      category: "perseverance"
    },
    {
      text: "Believe you can and you're halfway there.",
      author: "Theodore Roosevelt",
      category: "mindset"
    },
    {
      text: "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.",
      author: "Rikki Rogers",
      category: "strength"
    }
  ])

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (!autoRotate) return

    const interval = setInterval(() => {
      nextQuote()
    }, rotationInterval)

    return () => clearInterval(interval)
  }, [autoRotate, rotationInterval, currentQuoteIndex])

  const nextQuote = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length)
      setIsAnimating(false)
    }, 300)
  }

  const previousQuote = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentQuoteIndex((prev) => (prev - 1 + quotes.length) % quotes.length)
      setIsAnimating(false)
    }, 300)
  }

  const randomQuote = () => {
    setIsAnimating(true)
    setTimeout(() => {
      let newIndex
      do {
        newIndex = Math.floor(Math.random() * quotes.length)
      } while (newIndex === currentQuoteIndex)
      setCurrentQuoteIndex(newIndex)
      setIsAnimating(false)
    }, 300)
  }

  const currentQuote = quotes[currentQuoteIndex]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "motivation":
        return "text-cyan-400"
      case "fitness":
        return "text-green-400"
      case "strength":
        return "text-red-400"
      case "mindset":
        return "text-purple-400"
      case "perseverance":
        return "text-yellow-400"
      default:
        return "text-gray-400"
    }
  }

  const getCategoryBg = (category: string) => {
    switch (category) {
      case "motivation":
        return "bg-cyan-500/20 border-cyan-500/30"
      case "fitness":
        return "bg-green-500/20 border-green-500/30"
      case "strength":
        return "bg-red-500/20 border-red-500/30"
      case "mindset":
        return "bg-purple-500/20 border-purple-500/30"
      case "perseverance":
        return "bg-yellow-500/20 border-yellow-500/30"
      default:
        return "bg-gray-500/20 border-gray-500/30"
    }
  }

  if (variant === "banner") {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <div className="bg-black/20 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-center mb-3">
            <Quote className="h-6 w-6 text-cyan-400 mr-2" />
            <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
          </div>
          <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
            <p className="text-lg md:text-xl text-white font-medium italic text-center mb-2">
              "{currentQuote.text}"
            </p>
            {currentQuote.author && (
              <p className="text-gray-400 text-center">
                — {currentQuote.author}
              </p>
            )}
          </div>
          
          {showControls && (
            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={randomQuote}
                className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-full transition-colors"
                title="Random quote"
              >
                <RefreshCw className="h-4 w-4 text-gray-300" />
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (variant === "minimal") {
    return (
      <div className={`${className}`}>
        <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          <p className="text-sm text-gray-300 italic">
            "{currentQuote.text}"
          </p>
          {currentQuote.author && (
            <p className="text-xs text-gray-500 mt-1">
              — {currentQuote.author}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Default card variant
  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Quote className="h-5 w-5 text-cyan-400" />
          <span className="text-sm font-medium text-gray-300">Daily Motivation</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs border ${getCategoryBg(currentQuote.category)} ${getCategoryColor(currentQuote.category)}`}>
            {currentQuote.category}
          </span>
          <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
        </div>
      </div>

      <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'}`}>
        <blockquote className="text-lg text-white font-medium italic mb-3 leading-relaxed">
          "{currentQuote.text}"
        </blockquote>
        
        {currentQuote.author && (
          <cite className="text-gray-400 text-sm not-italic">
            — {currentQuote.author}
          </cite>
        )}
      </div>

      {showControls && (
        <div className="flex justify-between items-center mt-6">
          <div className="flex space-x-2">
            <button
              onClick={previousQuote}
              className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors text-gray-300 hover:text-white"
              title="Previous quote"
            >
              ←
            </button>
            <button
              onClick={nextQuote}
              className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors text-gray-300 hover:text-white"
              title="Next quote"
            >
              →
            </button>
          </div>
          
          <button
            onClick={randomQuote}
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 px-3 py-2 rounded-lg transition-all duration-300 text-cyan-400 hover:text-cyan-300"
            title="Random quote"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="text-sm">Random</span>
          </button>
        </div>
      )}

      {/* Quote indicator dots */}
      <div className="flex justify-center mt-4 space-x-1">
        {quotes.slice(0, 5).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuoteIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentQuoteIndex % 5
                ? "bg-cyan-400 scale-125"
                : "bg-gray-600 hover:bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  )
}