import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../pages/public/components/Navbar'
import Footer from '../pages/public/components/Footer'

const PublicLayout = () => {
  const location = useLocation()

  // Scroll to top when route changes
  useEffect(() => {
    // Use setTimeout to ensure the new content is rendered before scrolling
    const scrollToTop = () => {
      // Use both methods to ensure scroll restoration works
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Use 'instant' instead of 'smooth' for immediate scrolling
      })
      
      // Also scroll the document element as a fallback
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    // Immediate scroll
    scrollToTop()
    
    // Also try after a small delay to handle cases where content is still loading
    const timeoutId = setTimeout(scrollToTop, 0)
    
    return () => clearTimeout(timeoutId)
  }, [location.pathname])
  return (
    <div className="min-h-screen bg-black relative">
      {/* Animated Background Grid */}
      <motion.div
        className="grid-pattern fixed inset-0 opacity-20 -z-10"
        animate={{
          backgroundPosition: ['0px 0px', '50px 50px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Sticky Navigation */}
      <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-gray-800/50">
        <Navbar />
      </div>

      {/* Main Content */}
      <motion.main
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Outlet />
      </motion.main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default PublicLayout