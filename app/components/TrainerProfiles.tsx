"use client"

import { useState, useEffect } from "react"
import { Star, MapPin, Calendar, MessageCircle, Award, Clock, Phone, Mail, Send, ChevronLeft, ChevronRight, User } from "lucide-react"

interface Review {
  id: number
  userName: string
  rating: number
  comment: string
  date: string
  verified: boolean
}

interface BookingSlot {
  date: string
  time: string
  available: boolean
  price: number
}

interface Trainer {
  id: number
  name: string
  specialty: string
  rating: number
  reviews: Review[]
  location: string
  experience: string
  price: string
  basePrice: number
  image: string
  bio: string
  certifications: string[]
  availability: string[]
  achievements: string[]
  phone: string
  email: string
  socialMedia: {
    instagram?: string
    youtube?: string
    website?: string
  }
  bookingSlots: BookingSlot[]
}

export default function TrainerProfiles() {
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null)
  const [showBookingCalendar, setShowBookingCalendar] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [showReviews, setShowReviews] = useState(false)

  const trainers: Trainer[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      specialty: "HIIT & Weight Loss",
      rating: 4.9,
      reviews: [
        {
          id: 1,
          userName: "Mike R.",
          rating: 5,
          comment: "Sarah helped me lose 30 pounds in 4 months! Her HIIT workouts are intense but incredibly effective. Highly recommend!",
          date: "2024-01-10",
          verified: true
        },
        {
          id: 2,
          userName: "Jessica L.",
          rating: 5,
          comment: "Amazing trainer! Very knowledgeable about nutrition and really pushes you to reach your goals. Worth every penny.",
          date: "2024-01-08",
          verified: true
        },
        {
          id: 3,
          userName: "David K.",
          rating: 4,
          comment: "Great workouts and very professional. Only wish she had more availability on weekends.",
          date: "2024-01-05",
          verified: true
        }
      ],
      location: "New York, NY",
      experience: "8 years",
      price: "$75/session",
      basePrice: 75,
      image: "/placeholder.svg?height=300&width=300",
      bio: "Certified personal trainer specializing in high-intensity interval training and sustainable weight loss programs. I've helped over 500 clients achieve their fitness goals through personalized training and nutrition guidance.",
      certifications: ["NASM-CPT", "HIIT Specialist", "Nutrition Coach", "Weight Loss Specialist"],
      availability: ["Mon 9AM-5PM", "Wed 9AM-5PM", "Fri 9AM-5PM"],
      achievements: ["500+ clients transformed", "Featured in Fitness Magazine", "Marathon finisher", "Certified Nutrition Coach"],
      phone: "+1 (555) 123-4567",
      email: "sarah.johnson@fitsync.ai",
      socialMedia: {
        instagram: "@sarahfitnyc",
        website: "www.sarahjohnsonfit.com"
      },
      bookingSlots: [
        { date: "2024-01-20", time: "9:00 AM", available: true, price: 75 },
        { date: "2024-01-20", time: "11:00 AM", available: false, price: 75 },
        { date: "2024-01-22", time: "10:00 AM", available: true, price: 75 },
        { date: "2024-01-22", time: "2:00 PM", available: true, price: 75 },
        { date: "2024-01-24", time: "9:00 AM", available: true, price: 75 },
        { date: "2024-01-24", time: "3:00 PM", available: false, price: 75 }
      ]
    },
    {
      id: 2,
      name: "Mike Rodriguez",
      specialty: "Strength Training",
      rating: 4.8,
      reviews: [
        {
          id: 4,
          userName: "Tom S.",
          rating: 5,
          comment: "Mike knows strength training inside and out. Helped me increase my deadlift by 100 pounds safely and effectively!",
          date: "2024-01-12",
          verified: true
        },
        {
          id: 5,
          userName: "Lisa M.",
          rating: 5,
          comment: "Excellent form coaching and progressive programming. Saw gains I never thought possible as a woman in strength training.",
          date: "2024-01-09",
          verified: true
        }
      ],
      location: "Los Angeles, CA",
      experience: "12 years",
      price: "$85/session",
      basePrice: 85,
      image: "/placeholder.svg?height=300&width=300",
      bio: "Former competitive powerlifter with expertise in strength training and muscle building programs. I focus on proper form, progressive overload, and injury prevention to help clients reach their strength goals safely.",
      certifications: ["CSCS", "Powerlifting Coach", "Sports Nutrition", "Olympic Lifting Certified"],
      availability: ["Tue 6AM-8PM", "Thu 6AM-8PM", "Sat 8AM-4PM"],
      achievements: ["National Powerlifting Champion", "1000+ lbs total", "Strength Coach of the Year", "12 years coaching experience"],
      phone: "+1 (555) 234-5678",
      email: "mike.rodriguez@fitsync.ai",
      socialMedia: {
        instagram: "@mikestrengthla",
        youtube: "Mike Rodriguez Strength"
      },
      bookingSlots: [
        { date: "2024-01-21", time: "6:00 AM", available: true, price: 85 },
        { date: "2024-01-21", time: "7:00 PM", available: true, price: 85 },
        { date: "2024-01-23", time: "6:30 AM", available: false, price: 85 },
        { date: "2024-01-23", time: "6:00 PM", available: true, price: 85 },
        { date: "2024-01-25", time: "8:00 AM", available: true, price: 85 },
        { date: "2024-01-25", time: "2:00 PM", available: true, price: 85 }
      ]
    },
    {
      id: 3,
      name: "Emma Chen",
      specialty: "Yoga & Flexibility",
      rating: 5.0,
      reviews: [
        {
          id: 6,
          userName: "Sarah P.",
          rating: 5,
          comment: "Emma's yoga classes are transformative. My flexibility and mental clarity have improved dramatically in just 2 months.",
          date: "2024-01-14",
          verified: true
        },
        {
          id: 7,
          userName: "James W.",
          rating: 5,
          comment: "As a runner, Emma helped me prevent injuries and improve my performance through targeted yoga and flexibility work.",
          date: "2024-01-11",
          verified: true
        }
      ],
      location: "San Francisco, CA",
      experience: "10 years",
      price: "$65/session",
      basePrice: 65,
      image: "/placeholder.svg?height=300&width=300",
      bio: "Certified yoga instructor with a focus on flexibility, mindfulness, and holistic wellness. I combine traditional yoga practices with modern movement science to help clients achieve physical and mental balance.",
      certifications: ["RYT-500", "Yin Yoga Specialist", "Meditation Teacher", "Mobility Coach"],
      availability: ["Mon 7AM-7PM", "Wed 7AM-7PM", "Sun 9AM-5PM"],
      achievements: ["10,000+ hours taught", "Retreat leader", "Published author", "International yoga certification"],
      phone: "+1 (555) 345-6789",
      email: "emma.chen@fitsync.ai",
      socialMedia: {
        instagram: "@emmayogasf",
        website: "www.emmachenyoga.com"
      },
      bookingSlots: [
        { date: "2024-01-20", time: "7:00 AM", available: true, price: 65 },
        { date: "2024-01-20", time: "6:00 PM", available: true, price: 65 },
        { date: "2024-01-22", time: "8:00 AM", available: false, price: 65 },
        { date: "2024-01-22", time: "5:00 PM", available: true, price: 65 },
        { date: "2024-01-26", time: "9:00 AM", available: true, price: 65 },
        { date: "2024-01-26", time: "3:00 PM", available: true, price: 65 }
      ]
    },
    {
      id: 4,
      name: "David Kim",
      specialty: "Functional Training",
      rating: 4.7,
      reviews: [
        {
          id: 8,
          userName: "Maria G.",
          rating: 5,
          comment: "David's functional training approach helped me with everyday movements and eliminated my back pain. Fantastic results!",
          date: "2024-01-13",
          verified: true
        },
        {
          id: 9,
          userName: "Alex T.",
          rating: 4,
          comment: "Great focus on movement quality and injury prevention. Very knowledgeable about corrective exercises.",
          date: "2024-01-07",
          verified: true
        }
      ],
      location: "Chicago, IL",
      experience: "6 years",
      price: "$70/session",
      basePrice: 70,
      image: "/placeholder.svg?height=300&width=300",
      bio: "Movement specialist focused on functional training and injury prevention for everyday activities. I help clients move better, feel better, and perform better in their daily lives through corrective exercise and functional movement patterns.",
      certifications: ["FMS", "Corrective Exercise", "TRX Instructor", "Movement Screen Specialist"],
      availability: ["Tue 8AM-6PM", "Thu 8AM-6PM", "Sat 9AM-3PM"],
      achievements: ["Injury prevention expert", "Corporate wellness programs", "Movement screening specialist", "6 years experience"],
      phone: "+1 (555) 456-7890",
      email: "david.kim@fitsync.ai",
      socialMedia: {
        instagram: "@davidfunctionalchi"
      },
      bookingSlots: [
        { date: "2024-01-21", time: "8:00 AM", available: true, price: 70 },
        { date: "2024-01-21", time: "4:00 PM", available: true, price: 70 },
        { date: "2024-01-23", time: "10:00 AM", available: false, price: 70 },
        { date: "2024-01-23", time: "2:00 PM", available: true, price: 70 },
        { date: "2024-01-25", time: "9:00 AM", available: true, price: 70 },
        { date: "2024-01-25", time: "1:00 PM", available: true, price: 70 }
      ]
    },
  ]

  const handleBookSession = (trainer: Trainer) => {
    setSelectedTrainer(trainer)
    setShowBookingCalendar(true)
  }

  const handleContactTrainer = (trainer: Trainer) => {
    setSelectedTrainer(trainer)
    setShowContactForm(true)
  }

  const handleBookSlot = (slot: BookingSlot) => {
    if (slot.available) {
      alert(`🎉 Session booked successfully!\n\nTrainer: ${selectedTrainer?.name}\nDate: ${slot.date}\nTime: ${slot.time}\nPrice: $${slot.price}\n\nYou'll receive a confirmation email shortly.`)
      setShowBookingCalendar(false)
      setSelectedTrainer(null)
    }
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      alert(`✉️ Message sent to ${selectedTrainer?.name}!\n\n"${message}"\n\nThey'll get back to you within 24 hours.`)
      setMessage("")
      setShowContactForm(false)
      setSelectedTrainer(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
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
                      {trainer.rating} ({trainer.reviews.length} reviews)
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
                    onClick={() => handleContactTrainer(trainer)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <Mail className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleBookSession(trainer)}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Now
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
                    <ul className="space-y-2 mb-6">
                      {selectedTrainer.achievements.map((achievement: string, index: number) => (
                        <li key={index} className="flex items-center text-gray-300">
                          <Award className="h-4 w-4 text-green-400 mr-2" />
                          {achievement}
                        </li>
                      ))}
                    </ul>

                    <h4 className="text-lg font-semibold text-blue-400 mb-3">Contact Information</h4>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-300">
                        <Phone className="h-4 w-4 text-blue-400 mr-3" />
                        <span>{selectedTrainer.phone}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Mail className="h-4 w-4 text-blue-400 mr-3" />
                        <span>{selectedTrainer.email}</span>
                      </div>
                      {selectedTrainer.socialMedia.instagram && (
                        <div className="flex items-center text-gray-300">
                          <span className="text-pink-400 mr-3">→</span>
                          <span>{selectedTrainer.socialMedia.instagram}</span>
                        </div>
                      )}
                      {selectedTrainer.socialMedia.website && (
                        <div className="flex items-center text-gray-300">
                          <span className="text-cyan-400 mr-3">🌐</span>
                          <span>{selectedTrainer.socialMedia.website}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setShowReviews(true)
                        }}
                        className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                      >
                        <Star className="h-4 w-4 mr-2" />
                        View Reviews
                      </button>
                      <button
                        onClick={() => handleContactTrainer(selectedTrainer)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </button>
                    </div>
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

        {/* Reviews Modal */}
        {showReviews && selectedTrainer && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-yellow-400">Client Reviews</h3>
                  <button
                    onClick={() => setShowReviews(false)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-400 mt-2">{selectedTrainer.name} • {selectedTrainer.reviews.length} reviews</p>
              </div>
              
              <div className="p-6 space-y-6">
                {selectedTrainer.reviews.map((review) => (
                  <div key={review.id} className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-cyan-500 p-2 rounded-full">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{review.userName}</p>
                          <p className="text-sm text-gray-400">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "text-yellow-400 fill-current" : "text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                        {review.verified && (
                          <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Booking Calendar Modal */}
        {showBookingCalendar && selectedTrainer && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-2xl max-w-2xl w-full">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-cyan-400">Book with {selectedTrainer.name}</h3>
                  <button
                    onClick={() => setShowBookingCalendar(false)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-400 mt-2">{selectedTrainer.specialty} • {selectedTrainer.price}</p>
              </div>
              
              <div className="p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Available Time Slots</h4>
                <div className="grid gap-3">
                  {selectedTrainer.bookingSlots.map((slot, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                        slot.available
                          ? "border-cyan-500/30 bg-cyan-500/10 hover:border-cyan-500/50 cursor-pointer"
                          : "border-gray-600 bg-gray-700/30 opacity-50 cursor-not-allowed"
                      }`}
                      onClick={() => slot.available && handleBookSlot(slot)}
                    >
                      <div className="flex items-center space-x-4">
                        <Calendar className="h-5 w-5 text-cyan-400" />
                        <div>
                          <p className="font-semibold text-white">{formatDate(slot.date)}</p>
                          <p className="text-sm text-gray-400">{slot.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-cyan-400">${slot.price}</p>
                        <p className={`text-sm ${
                          slot.available ? "text-green-400" : "text-red-400"
                        }`}>
                          {slot.available ? "Available" : "Booked"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">📝 Booking Information:</p>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Sessions are 60 minutes long</li>
                    <li>• Cancellation allowed up to 24 hours before</li>
                    <li>• Payment processed after session completion</li>
                    <li>• First session includes fitness assessment</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Form Modal */}
        {showContactForm && selectedTrainer && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-2xl max-w-lg w-full">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-purple-400">Contact {selectedTrainer.name}</h3>
                  <button
                    onClick={() => setShowContactForm(false)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-400 mt-2">Send a message to discuss your fitness goals</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Your Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Hi! I'm interested in your training services. I'd like to discuss my fitness goals and see if we'd be a good fit..."
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      rows={6}
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowContactForm(false)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </button>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                  <p className="text-sm text-purple-300 mb-2">💬 Quick Contact Options:</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Phone:</span>
                      <span className="text-sm text-white">{selectedTrainer.phone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Email:</span>
                      <span className="text-sm text-white">{selectedTrainer.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Response Time:</span>
                      <span className="text-sm text-green-400">Within 24 hours</span>
                    </div>
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
