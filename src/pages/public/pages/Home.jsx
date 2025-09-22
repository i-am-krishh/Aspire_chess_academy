import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Users, Trophy, Target, Zap, ChevronRight, Star, Award } from 'lucide-react'
import axios from 'axios'
import MeetStudents from '../components/MeetStudents'
import Testimonials from '../components/Testimonials'

const Home = () => {
  const [currentPage, setCurrentPage] = useState('home')

  const stats = [
    { number: "100+", label: "Active Players", icon: Users, color: "text-cyan-400" },
    { number: "5+", label: "Rated Players", icon: Trophy, color: "text-purple-400" },
    { number: "3+", label: "Years Experience", icon: Target, color: "text-cyan-400" },
    { number: "50+", label: "Tournaments Won", icon: Award, color: "text-purple-400" }
  ]

  const programs = [
    {
      title: "Beginner Level",
      subtitle: "Foundation Building",
      icon: Target,
      color: "from-cyan-500 to-blue-600",
      borderColor: "border-cyan-500/30",
      features: [
        "Basic rules & notation",
        "Opening principles",
        "Tactical patterns",
        "Endgame basics"
      ]
    },
    {
      title: "Intermediate",
      subtitle: "Tactical Mastery",
      icon: Zap,
      color: "from-purple-500 to-pink-600",
      borderColor: "border-purple-500/30",
      features: [
        "Advanced tactics",
        "Positional play",
        "Game analysis",
        "Tournament prep"
      ]
    },
    {
      title: "Advanced",
      subtitle: "Championship Training",
      icon: Trophy,
      color: "from-cyan-500 to-purple-600",
      borderColor: "border-cyan-500/30",
      features: [
        "Grandmaster theory",
        "Opening repertoire",
        "Psychological training",
        "Elite competition"
      ]
    }
  ]

  return (
    <div className="pt-10">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 "></div>
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <motion.h1
            className="font-orbitron text-6xl md:text-8xl font-bold text-white mb-8 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            MASTER THE
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
              FUTURE OF STRATEGY
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join the elite ranks of the <span className="text-cyan-400 font-semibold">Aspire Chess Academy</span> where
            cutting-edge training meets timeless strategy to forge tomorrow's grandmasters.
          </motion.p>

          {/* <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.button
              className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover-glow animate-pulse-glow flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-5 h-5 mr-2" />
              Start Your Journey
            </motion.button>
            <motion.button
              className="border-2 border-cyan-400 text-cyan-400 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-cyan-400 hover:text-black transition-all duration-300 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Watch Demo
            </motion.button>
          </motion.div> */}

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className={`text-3xl md:text-4xl font-orbitron font-bold ${stat.color} mb-2 flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 mr-2" />
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Training Programs */}
      {/* <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-white mb-6">
              TRAINING <span className="text-cyan-400">PROGRAMS</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose your path to mastery with our scientifically designed curricula, tailored for
              every skill level and ambition.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((program, index) => {
              const IconComponent = program.icon
              return (
                <motion.div
                  key={index}
                  className={`bg-black/50 backdrop-blur-sm border ${program.borderColor} rounded-2xl p-8 hover-glow group`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${program.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-orbitron text-2xl font-bold text-white mb-2">{program.title}</h3>
                    <div className="text-cyan-400 font-semibold mb-4">{program.subtitle}</div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {program.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-300">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <motion.button
                    className={`w-full bg-gradient-to-r ${program.color} text-white py-3 rounded-lg font-semibold hover-glow`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Learn More
                  </motion.button>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section> */}

      {/* Students Section */}
      <MeetStudents setCurrentPage={setCurrentPage} />

      {/* Success Stories / Testimonials */}
      <Testimonials />
    </div>
  )
}

export default Home