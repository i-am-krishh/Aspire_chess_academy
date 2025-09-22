import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, Star, TrendingUp, Trophy, Award, Users } from 'lucide-react'
import axios from 'axios'

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch students from backend API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('/api/students')
        const students = response.data.data

        // Transform students data to testimonials format
        const transformedTestimonials = students.map((student, index) => ({
          name: student.name,
          title: student.title,
          rating: student.rating,
          quote: student.testimonial,
          achievement: student.achievements[0] || 'Academy Graduate',
          icon: getIconForIndex(index),
          color: getColorForIndex(index)
        }))

        setTestimonials(transformedTestimonials)
      } catch (error) {
        console.error('Error fetching students:', error)
        // Fallback to static data if API fails
        setTestimonials(getFallbackTestimonials())
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  const getIconForIndex = (index) => {
    const icons = [TrendingUp, Star, Trophy, Award]
    return icons[index % icons.length]
  }

  const getColorForIndex = (index) => {
    const colors = [
      "from-green-500 to-emerald-600",
      "from-blue-500 to-cyan-600",
      "from-purple-500 to-pink-600",
      "from-orange-500 to-red-600"
    ]
    return colors[index % colors.length]
  }

  const getFallbackTestimonials = () => [
    {
      name: "David Rodriguez",
      title: "FIDE Master",
      rating: "2380",
      quote: "The Aspire Chess Academy transformed my understanding of the game. The personalized coaching and cutting-edge analysis tools helped me achieve my FM title in just 18 months.",
      achievement: "Gained 400 rating points",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-600"
    },
    {
      name: "Emma Thompson",
      title: "National Champion",
      rating: "2150",
      quote: "The tactical training program here is unmatched. My pattern recognition improved dramatically, and I won my first national tournament within a year of joining.",
      achievement: "Won National Championship",
      icon: Trophy,
      color: "from-yellow-500 to-orange-600"
    },
    {
      name: "Alex Kim",
      title: "Candidate Master",
      rating: "2050",
      quote: "From a complete beginner to CM level - the structured curriculum and supportive environment at Aspire made this incredible journey possible.",
      achievement: "0 to 2050 rating in 2 years",
      icon: Star,
      color: "from-blue-500 to-cyan-600"
    },
    {
      name: "Maria Santos",
      title: "WIM",
      rating: "2280",
      quote: "The psychological training component sets Aspire apart. Learning to manage time pressure and maintain focus under stress was game-changing for my tournament performance.",
      achievement: "Women's International Master",
      icon: Award,
      color: "from-purple-500 to-pink-600"
    }
  ]

  const stats = [
    { number: "95%", label: "Rating Improvement", icon: TrendingUp, color: "text-purple-400", border: "border-purple-500/30" },
    { number: "100+", label: "Active Players", icon: Award, color: "text-cyan-400", border: "border-cyan-500/30" },
    { number: "50+", label: "Tournament Wins", icon: Trophy, color: "text-purple-400", border: "border-purple-500/30" },
    { number: "4.9/5", label: "Student Rating", icon: Star, color: "text-cyan-400", border: "border-cyan-500/30" }
  ]

  useEffect(() => {
    if (testimonials.length > 0) {
      const timer = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [testimonials.length])

  if (loading) {
    return (
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-white mb-6">
              SUCCESS <span className="text-cyan-400">STORIES</span>
            </h2>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-white mb-6">
              SUCCESS <span className="text-cyan-400">STORIES</span>
            </h2>
            <p className="text-gray-300">No testimonials available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <motion.div
        className="absolute inset-0 opacity-5"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%']
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="grid grid-cols-8 gap-4 h-full">
          {Array.from({ length: 64 }).map((_, i) => (
            <motion.div
              key={i}
              className={`${(Math.floor(i / 8) + i) % 2 === 0 ? 'bg-white' : 'bg-transparent'}`}
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.05
              }}
            />
          ))}
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="font-orbitron text-4xl md:text-5xl font-bold text-white mb-6 flex items-center justify-center"
            animate={{
              textShadow: [
                '0 0 10px rgba(0, 212, 255, 0.5)',
                '0 0 20px rgba(0, 212, 255, 0.8)',
                '0 0 10px rgba(0, 212, 255, 0.5)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Users className="w-12 h-12 mr-4 text-cyan-400" />
            SUCCESS <span className="text-cyan-400">STORIES</span>
          </motion.h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Hear from our students who have achieved remarkable success through
            our innovative training methodology and expert guidance.
          </p>
        </motion.div>

        {/* Main Testimonial Display */}
        <motion.div
          className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8 md:p-12 mb-8 hover-glow relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {/* Background Gradient */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${testimonials[currentTestimonial]?.color || 'from-cyan-500 to-purple-600'} opacity-5`}
            key={currentTestimonial}
            initial={{ scale: 0, rotate: 45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5 }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              className="text-center relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Quote Icon */}
              <motion.div
                className="flex justify-center mb-6"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Quote className="w-16 h-16 text-cyan-400 opacity-50" />
              </motion.div>

              {/* Quote */}
              <blockquote className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed italic">
                {testimonials[currentTestimonial]?.quote}
              </blockquote>

              {/* Student Info */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="text-center md:text-left">
                  <h4 className="font-orbitron text-xl font-bold text-white flex items-center justify-center md:justify-start">
                    {testimonials[currentTestimonial]?.name}
                  </h4>
                  <p className="text-cyan-400 font-semibold flex items-center justify-center md:justify-start">
                    <Star className="w-4 h-4 mr-1" />
                    {testimonials[currentTestimonial]?.title}
                  </p>
                  <p className="text-gray-400">
                    Rating: {testimonials[currentTestimonial]?.rating}
                  </p>
                </div>

                <motion.div
                  className={`bg-gradient-to-r ${testimonials[currentTestimonial]?.color || 'from-cyan-500 to-purple-600'} bg-opacity-20 border border-cyan-400 rounded-lg px-4 py-2 flex items-center`}
                  whileHover={{ scale: 1.05 }}
                >
                  {testimonials[currentTestimonial]?.icon &&
                    React.createElement(testimonials[currentTestimonial].icon, { className: "w-4 h-4 mr-2 text-cyan-400" })
                  }
                  <div className="text-sm text-cyan-400 font-semibold">
                    {testimonials[currentTestimonial]?.achievement}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Testimonial Navigation */}
        <div className="flex justify-center space-x-3 mb-8">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentTestimonial
                ? 'bg-cyan-400 glow-blue'
                : 'bg-gray-600 hover:bg-gray-500'
                }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, staggerChildren: 0.1 }}
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={index}
                className={`bg-black/50 border ${stat.border} rounded-lg p-4 hover-glow`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 10px 25px rgba(0, 212, 255, 0.2)'
                }}
              >
                <motion.div
                  className={`text-2xl font-orbitron font-bold ${stat.color} flex items-center justify-center mb-2`}
                  animate={{
                    textShadow: [
                      '0 0 10px currentColor',
                      '0 0 20px currentColor',
                      '0 0 10px currentColor'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                >
                  <IconComponent className="w-5 h-5 mr-2" />
                  {stat.number}
                </motion.div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials