"use client"

import { useState } from "react"
import { Star, MapPin, Calendar, MessageCircle, Award, Clock } from "lucide-react"

export default function TrainerProfiles() {
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null)

  const trainers = [
    {
      id: 1,
      name: "Sarah Johnson",
      specialty: "HIIT & Weight Loss",
      rating: 4.9,
      reviews: 127,
      location: "New York, NY",
      experience: "8 years",
      price: "$75/session",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Certified personal trainer specializing in high-intensity interval training and sustainable weight loss programs.",
      certifications: ["NASM-CPT", "HIIT Specialist", "Nutrition Coach"],
      availability: ["Mon 9AM-5PM", "Wed 9AM-5PM", "Fri 9AM-5PM"],
      achievements: ["500+ clients transformed", "Featured in Fitness Magazine", "Marathon finisher"],
    },
    {
      id: 2,
      name: "Mike Rodriguez",
      specialty: "Strength Training",
      rating: 4.8,
      reviews: 89,
      location: "Los Angeles, CA",
      experience: "12 years",
      price: "$85/session",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Former competitive powerlifter with expertise in strength training and muscle building programs.",
      certifications: ["CSCS", "Powerlifting Coach", "Sports Nutrition"],
      availability: ["Tue 6AM-8PM", "Thu 6AM-8PM", "Sat 8AM-4PM"],
      achievements: ["National Powerlifting Champion", "1000+ lbs total", "Strength Coach of the Year"],
    },
    {
      id: 3,
      name: "Emma Chen",
      specialty: "Yoga & Flexibility",
      rating: 5.0,
      reviews: 156,
      location: "San Francisco, CA",
      experience: "10 years",
      price: "$65/session",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Certified yoga instructor with a focus on flexibility, mindfulness, and holistic wellness.",
      certifications: ["RYT-500", "Yin Yoga Specialist", "Meditation Teacher"],
      availability: ["Mon 7AM-7PM", "Wed 7AM-7PM", "Sun 9AM-5PM"],
      achievements: ["10,000+ hours taught", "Retreat leader", "Published author"],
    },
    {
      id: 4,
      name: "David Kim",
      specialty: "Functional Training",
      rating: 4.7,
      reviews: 94,
      location: "Chicago, IL",
      experience: "6 years",
      price: "$70/session",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Movement specialist focused on functional training and injury prevention for everyday activities.",
      certifications: ["FMS", "Corrective Exercise", "TRX Instructor"],
      availability: ["Tue 8AM-6PM", "Thu 8AM-6PM", "Sat 9AM-3PM"],
      achievements: ["Injury prevention expert", "Corporate wellness programs", "Movement screening specialist"],
    },
  ]

  const handleBookSession = (trainer: any) => {
    alert(`🗓️ Booking session with ${trainer.name}! You'll be redirected to the scheduling system.`)
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Expert Trainers
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Connect with certified fitness professionals who will guide you to achieve your goals
          </p>
        </div>

        {/* Trainer Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {trainers.map((trainer) => (
            <div
              key={trainer.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="relative">
                <img
                  src={trainer.image || "/placeholder.svg"}
                  alt={trainer.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-1">{trainer.name}</h3>
                  <p className="text-cyan-400 font-medium">{trainer.specialty}</p>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(trainer.rating) ? "text-yellow-400 fill-current" : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">
                      {trainer.rating} ({trainer.reviews} reviews)
                    </span>
                  </div>
                  <span className="text-lg font-bold text-cyan-400">{trainer.price}</span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-400">
                    <MapPin className="h-4 w-4 mr-2 text-cyan-400" />
                    {trainer.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Award className="h-4 w-4 mr-2 text-purple-400" />
                    {trainer.experience} experience
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock className="h-4 w-4 mr-2 text-green-400" />
                    Available {trainer.availability.length} days/week
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-6 line-clamp-3">{trainer.bio}</p>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setSelectedTrainer(trainer)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    View Profile
                  </button>
                  <button
                    onClick={() => handleBookSession(trainer)}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Session
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trainer Detail Modal */}
        {selectedTrainer && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <img
                  src={selectedTrainer.image || "/placeholder.svg"}
                  alt={selectedTrainer.name}
                  className="w-full h-80 object-cover rounded-t-2xl"
                />
                <button
                  onClick={() => setSelectedTrainer(null)}
                  className="absolute top-4 right-4 bg-gray-900/80 text-white p-2 rounded-full hover:bg-gray-900 text-xl"
                >
                  ×
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedTrainer.name}</h2>
                  <p className="text-xl text-cyan-400 font-medium">{selectedTrainer.specialty}</p>
                </div>
              </div>

              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-cyan-400 mb-4">About</h3>
                    <p className="text-gray-300 mb-6">{selectedTrainer.bio}</p>

                    <h4 className="text-lg font-semibold text-purple-400 mb-3">Certifications</h4>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedTrainer.certifications.map((cert: string, index: number) => (
                        <span key={index} className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                          {cert}
                        </span>
                      ))}
                    </div>

                    <h4 className="text-lg font-semibold text-green-400 mb-3">Achievements</h4>
                    <ul className="space-y-2">
                      {selectedTrainer.achievements.map((achievement: string, index: number) => (
                        <li key={index} className="flex items-center text-gray-300">
                          <Award className="h-4 w-4 text-green-400 mr-2" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-cyan-400 mb-4">Session Details</h3>

                    <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Session Rate</span>
                        <span className="text-2xl font-bold text-cyan-400">{selectedTrainer.price}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Experience</span>
                        <span className="font-semibold">{selectedTrainer.experience}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Rating</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="font-semibold">{selectedTrainer.rating}</span>
                        </div>
                      </div>
                    </div>

                    <h4 className="text-lg font-semibold text-yellow-400 mb-3">Availability</h4>
                    <div className="space-y-2 mb-6">
                      {selectedTrainer.availability.map((slot: string, index: number) => (
                        <div key={index} className="bg-gray-700/30 rounded-lg p-3 flex items-center">
                          <Clock className="h-4 w-4 text-yellow-400 mr-2" />
                          <span className="text-gray-300">{slot}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleBookSession(selectedTrainer)}
                      className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center"
                    >
                      <Calendar className="mr-2 h-5 w-5" />
                      Book Session with {selectedTrainer.name}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
