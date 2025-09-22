import React from 'react'
import { motion } from 'framer-motion'
import { Play, Zap, Users, Trophy, Target, ChevronDown } from 'lucide-react'

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-5, 5, -5],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const stats = [
    { number: "500+", label: "Students Trained", icon: Users, color: "text-cyan-400" },
    { number: "15", label: "Grandmasters", icon: Trophy, color: "text-purple-400" },
    { number: "98%", label: "Success Rate", icon: Target, color: "text-cyan-400" },
    { number: "10", label: "Years Excellence", icon: Zap, color: "text-purple-400" }
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <motion.div 
        className="absolute inset-0 bg-gradient-radial"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Animated Chess Piece Silhouettes */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          className="absolute top-20 left-10 text-6xl"
          variants={floatingVariants}
          animate="animate"
        >
          ♔
        </motion.div>
        <motion.div 
          className="absolute top-40 right-20 text-4xl"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 1 }}
        >
          ♕
        </motion.div>
        <motion.div 
          className="absolute bottom-40 left-20 text-5xl"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 2 }}
        >
          ♖
        </motion.div>
        <motion.div 
          className="absolute bottom-20 right-10 text-3xl"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 3 }}
        >
          ♗
        </motion.div>
      </div>

      <motion.div 
        className="relative z-10 text-center max-w-4xl mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Heading */}
        <motion.h1 
          className="font-orbitron text-5xl md:text-7xl font-bold mb-6 mt-16"
          variants={itemVariants}
        >
          <motion.span 
            className="text-white block"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            MASTER THE
          </motion.span>
          <motion.span 
            className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 text-glow block "
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            FUTURE OF STRATEGY
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Join the elite ranks at The <span className='text-cyan-400'>Aspire Chess Academy</span>, where cutting-edge training meets 
          timeless strategy to forge tomorrow's grandmasters.
        </motion.p>

        {/* CTA Buttons */}
        {/* <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          variants={itemVariants}
        >
          <motion.button 
            className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover-glow animate-pulse-glow flex items-center"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 30px rgba(0, 212, 255, 0.8)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Zap className="w-5 h-5 mr-2" />
            Begin Your Journey
          </motion.button>
          <motion.button 
            className="border-2 border-cyan-400 text-cyan-400 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-cyan-400 hover:text-black transition-all duration-300 flex items-center"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: '#00d4ff',
              color: '#000000'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-5 h-5 mr-2" />
            Watch Demo
          </motion.button>
        </motion.div> */}

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-cyan-500/30"
          variants={itemVariants}
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div 
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                whileHover={{ scale: 1.1 }}
              >
                <motion.div 
                  className={`text-3xl font-orbitron font-bold ${stat.color} flex items-center justify-center mb-2`}
                  animate={{
                    textShadow: [
                      '0 0 10px currentColor',
                      '0 0 20px currentColor',
                      '0 0 10px currentColor'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                >
                  <IconComponent className="w-6 h-6 mr-2" />
                  {stat.number}
                </motion.div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div 
          className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center cursor-pointer"
          whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(0, 212, 255, 0.6)' }}
        >
          <motion.div 
            className="w-1 h-3 bg-cyan-400 rounded-full mt-2"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
        <ChevronDown className="w-6 h-6 text-cyan-400 mx-auto mt-2 animate-bounce" />
      </motion.div>
    </section>
  )
}

export default Hero