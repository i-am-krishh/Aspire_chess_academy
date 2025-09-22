import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Trophy, Users, Clock, ExternalLink, Star, Award, X, Grid, List, Eye } from 'lucide-react'
import api from '../../../utils/api'
import { isValidImageUrl } from '../../../utils/imageUtils.jsx'

const Tournaments = () => {
  const [upcomingTournaments, setUpcomingTournaments] = useState([])
  const [pastTournaments, setPastTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTournament, setSelectedTournament] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  // Fetch tournaments from backend API
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('Tournaments: Fetching upcoming tournaments...')
        // Fetch upcoming tournaments
        const upcomingResponse = await api.get('/api/tournaments')
        const upcomingData = upcomingResponse.data.data.filter(tournament => tournament.isActive)
        console.log('Tournaments: Upcoming tournaments:', upcomingData)
        
        console.log('Tournaments: Fetching past tournaments...')
        // Fetch past tournaments with winners
        const pastResponse = await api.get('/api/tournaments/past')
        const pastData = pastResponse.data.data
        console.log('Tournaments: Past tournaments:', pastData)
        
        setUpcomingTournaments(upcomingData)
        setPastTournaments(pastData)
      } catch (error) {
        console.error('Tournaments: Error fetching tournaments:', error)
        console.error('Tournaments: Error details:', error.response?.data)
        setError('Failed to load tournaments. Please try again later.')
        setUpcomingTournaments([])
        setPastTournaments([])
      } finally {
        setLoading(false)
      }
    }

    fetchTournaments()
  }, [])

  // Cleanup body scroll on component unmount
  useEffect(() => {
    return () => {
      // Re-enable body scroll when component unmounts
      document.body.style.overflow = 'unset'
    }
  }, [])

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Open Tournament': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
      case 'Youth (Under 18)': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Online Blitz': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getParticipationPercentage = (current, max) => {
    return Math.round((current / max) * 100)
  }

  const openTournamentModal = (tournament) => {
    setSelectedTournament(tournament)
    setIsModalOpen(true)
    // Disable body scroll
    document.body.style.overflow = 'hidden'
  }

  const closeTournamentModal = () => {
    setSelectedTournament(null)
    setIsModalOpen(false)
    // Re-enable body scroll
    document.body.style.overflow = 'unset'
  }

  // Tournament Modal Component
  const TournamentModal = ({ tournament, isOpen, onClose }) => {
    if (!isOpen || !tournament) return null

    return (
      <AnimatePresence>
        <motion.div
          className="fixed bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          style={{ 
            top: '80px', // Account for navbar height
            left: '0',
            right: '0',
            bottom: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 80px)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-black/95 border border-cyan-500/30 rounded-2xl p-8 w-full max-w-4xl max-h-[calc(85vh-80px)] overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
            style={{ 
              margin: 'auto',
              position: 'relative'
            }}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-6">
                <div className="w-24 h-20 rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center flex-shrink-0">
                  {tournament.posterImage && isValidImageUrl(tournament.posterImage) ? (
                    <img
                      src={tournament.posterImage}
                      alt={tournament.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl text-gray-400">{tournament.poster || '🏆'}</div>
                  )}
                </div>
                <div>
                  <h2 className="font-orbitron text-3xl font-bold text-white mb-2">
                    {tournament.name}
                  </h2>
                  <div className={`inline-block border rounded-full px-3 py-1 text-sm font-semibold ${getCategoryColor(tournament.category)}`}>
                    {tournament.category}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Details */}
              <div>
                <h3 className="font-orbitron text-xl font-bold text-white mb-4">Tournament Details</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  {tournament.description}
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-300">
                    <Calendar className="w-5 h-5 text-cyan-400 mr-3" />
                    <div>
                      <div className="font-semibold">{new Date(tournament.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</div>
                      <div className="text-sm text-gray-400">{tournament.time}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start text-gray-300">
                    <MapPin className="w-5 h-5 text-cyan-400 mr-3 mt-1" />
                    <div>
                      <div className="font-semibold">{tournament.location}</div>
                      <div className="text-sm text-gray-400">{tournament.address}</div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-300">
                    <Clock className="w-5 h-5 text-cyan-400 mr-3" />
                    <div>
                      <div className="font-semibold">{tournament.timeControl}</div>
                      <div className="text-sm text-gray-400">{tournament.format}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Registration */}
              <div>
                <div className="bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border border-cyan-400/30 rounded-xl p-6 mb-6">
                  <h3 className="font-orbitron text-xl font-bold text-white mb-4">Prize & Entry</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Entry Fee:</span>
                      <span className="text-cyan-400 font-bold text-lg">{tournament.entryFee}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Prize Pool:</span>
                      <span className="text-purple-400 font-bold text-lg">{tournament.prizePool}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
                  <h3 className="font-orbitron text-xl font-bold text-white mb-4">Participation</h3>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-400">Registered:</span>
                    <span className="text-white font-bold">
                      {tournament.currentParticipants}/{tournament.maxParticipants}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-purple-600 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${getParticipationPercentage(tournament.currentParticipants, tournament.maxParticipants)}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-400">
                    {getParticipationPercentage(tournament.currentParticipants, tournament.maxParticipants)}% Full
                  </div>
                  <div className="text-sm text-gray-400 mt-2">
                    Registration closes: {new Date(tournament.listUntil).toLocaleDateString()}
                  </div>
                </div>

                <a
                  href={tournament.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover-glow flex items-center justify-center transition-all duration-300 text-lg"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Register Now
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  if (loading) {
    return (
      <div className="pt-20 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          <p className="ml-4 text-cyan-400">Loading tournaments...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-20 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-400 text-xl mb-4">⚠️</div>
            <p className="text-red-400">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            className="font-orbitron text-5xl md:text-6xl font-bold text-white mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            CHESS <span className="text-cyan-400">TOURNAMENTS</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join competitive tournaments designed for players of all levels. Test your skills, 
            win prizes, and connect with the chess community at Aspire Chess Academy.
          </motion.p>
          
          <motion.button
            onClick={() => window.location.reload()}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Refresh Tournaments
          </motion.button>
          
          {/* Quick Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-4 hover-glow">
              <div className="text-2xl font-orbitron font-bold text-cyan-400 flex items-center justify-center">
                <Trophy className="w-6 h-6 mr-2" />
                24+
              </div>
              <div className="text-gray-400">Annual Tournaments</div>
            </div>
            <div className="bg-black/50 border border-purple-500/30 rounded-lg p-4 hover-glow">
              <div className="text-2xl font-orbitron font-bold text-purple-400 flex items-center justify-center">
                <Users className="w-6 h-6 mr-2" />
                1200+
              </div>
              <div className="text-gray-400">Total Participants</div>
            </div>
            <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-4 hover-glow">
              <div className="text-2xl font-orbitron font-bold text-cyan-400 flex items-center justify-center">
                <Award className="w-6 h-6 mr-2" />
                $15K+
              </div>
              <div className="text-gray-400">Prize Money</div>
            </div>
            <div className="bg-black/50 border border-purple-500/30 rounded-lg p-4 hover-glow">
              <div className="text-2xl font-orbitron font-bold text-purple-400 flex items-center justify-center">
                <Star className="w-6 h-6 mr-2" />
                4.8/5
              </div>
              <div className="text-gray-400">Player Rating</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Tournaments */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <motion.h2 
              className="font-orbitron text-4xl font-bold text-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              UPCOMING <span className="text-cyan-400">TOURNAMENTS</span>
            </motion.h2>
            
            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-black/50 border border-gray-500/30 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-cyan-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'list' 
                    ? 'bg-cyan-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className={`${
            viewMode === 'grid' 
              ? 'grid gap-6 lg:grid-cols-2 xl:grid-cols-3' 
              : 'space-y-4'
          }`}>
            {viewMode === 'list' && upcomingTournaments.length > 0 && (
              /* Table Header for List View */
              <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-300">
                  <div className="col-span-1">Poster</div>
                  <div className="col-span-3">Tournament</div>
                  <div className="col-span-2">Date & Time</div>
                  <div className="col-span-2">Location</div>
                  <div className="col-span-1">Entry Fee</div>
                  <div className="col-span-1">Prize Pool</div>
                  <div className="col-span-1">Participants</div>
                  <div className="col-span-1">Action</div>
                </div>
              </div>
            )}
            
            {upcomingTournaments.length > 0 ? upcomingTournaments.map((tournament, index) => (
              viewMode === 'grid' ? (
                /* Grid View Card */
                <motion.div 
                  key={tournament.id}
                  className="bg-black/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl overflow-hidden hover-glow group cursor-pointer transition-all duration-300 p-6"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, borderColor: 'rgba(6, 182, 212, 0.6)' }}
                  onClick={() => openTournamentModal(tournament)}
                >
                  {/* Tournament Poster */}
                  <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center relative group">
                    {tournament.posterImage && isValidImageUrl(tournament.posterImage) ? (
                      <img
                        src={tournament.posterImage}
                        alt={tournament.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="text-6xl text-gray-400 group-hover:scale-110 transition-transform duration-500">
                        {tournament.poster || '🏆'}
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-cyan-500 text-white p-2 rounded-full">
                        <Eye className="w-5 h-5" />
                      </div>
                    </div>
                    
                    {/* Quick Status Badge */}
                    <div className="absolute top-2 right-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(tournament.category)}`}>
                        {tournament.category}
                      </div>
                    </div>
                  </div>

                  {/* Tournament Info */}
                  <div className="flex-1">
                    <h3 className="font-orbitron text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {tournament.name}
                    </h3>
                    
                    <p className="text-gray-300 leading-relaxed mb-4 line-clamp-3">
                      {tournament.description}
                    </p>

                    {/* Key Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-300">
                        <Calendar className="w-4 h-4 text-cyan-400 mr-2" />
                        <span className="font-semibold">
                          {new Date(tournament.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })} • {tournament.time}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-300">
                        <MapPin className="w-4 h-4 text-cyan-400 mr-2" />
                        <span>{tournament.location}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-300">
                        <Users className="w-4 h-4 text-cyan-400 mr-2" />
                        <span>{tournament.currentParticipants}/{tournament.maxParticipants} registered</span>
                      </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="flex justify-between items-center">
                      <div className="flex gap-4 text-sm">
                        <span className="text-cyan-400 font-bold">{tournament.entryFee}</span>
                        <span className="text-purple-400 font-bold">{tournament.prizePool}</span>
                      </div>
                      
                      {/* Participation Bar */}
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${getParticipationPercentage(tournament.currentParticipants, tournament.maxParticipants)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* List View Row */
                <motion.div 
                  key={tournament.id}
                  className="bg-black/30 hover:bg-black/50 border border-gray-700/30 hover:border-cyan-500/50 rounded-lg p-4 cursor-pointer transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => openTournamentModal(tournament)}
                >
                  <div className="grid grid-cols-12 gap-4 items-center text-sm">
                    {/* Poster */}
                    <div className="col-span-1">
                      <div className="w-12 h-10 rounded overflow-hidden bg-gray-700 flex items-center justify-center">
                        {tournament.posterImage && isValidImageUrl(tournament.posterImage) ? (
                          <img
                            src={tournament.posterImage}
                            alt={tournament.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="text-lg text-gray-400">{tournament.poster || '🏆'}</div>
                        )}
                      </div>
                    </div>
                    
                    {/* Tournament Name & Category */}
                    <div className="col-span-3">
                      <h3 className="font-orbitron font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
                        {tournament.name}
                      </h3>
                      <div className={`inline-block border rounded-full px-2 py-0.5 text-xs font-semibold mt-1 ${getCategoryColor(tournament.category)}`}>
                        {tournament.category}
                      </div>
                    </div>
                    
                    {/* Date & Time */}
                    <div className="col-span-2 text-gray-300">
                      <div className="font-semibold">
                        {new Date(tournament.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-xs text-gray-400">{tournament.time}</div>
                    </div>
                    
                    {/* Location */}
                    <div className="col-span-2 text-gray-300 truncate">
                      {tournament.location}
                    </div>
                    
                    {/* Entry Fee */}
                    <div className="col-span-1 text-cyan-400 font-bold">
                      {tournament.entryFee}
                    </div>
                    
                    {/* Prize Pool */}
                    <div className="col-span-1 text-purple-400 font-bold">
                      {tournament.prizePool}
                    </div>
                    
                    {/* Participants */}
                    <div className="col-span-1">
                      <div className="text-white font-semibold text-xs">
                        {tournament.currentParticipants}/{tournament.maxParticipants}
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-purple-600 h-1 rounded-full transition-all duration-1000"
                          style={{ width: `${getParticipationPercentage(tournament.currentParticipants, tournament.maxParticipants)}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Action */}
                    <div className="col-span-1 flex justify-center">
                      <div className="bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-500/30 p-2 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-cyan-400" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            )) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-white mb-4">No Upcoming Tournaments</h3>
                <p className="text-gray-300">
                  We're planning exciting tournaments for the future. Stay tuned for announcements!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tournament Modal */}
      <TournamentModal 
        tournament={selectedTournament} 
        isOpen={isModalOpen} 
        onClose={closeTournamentModal} 
      />

      {/* Past Tournaments */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="font-orbitron text-4xl font-bold text-center text-white mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            RECENT <span className="text-purple-400">CHAMPIONS</span>
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pastTournaments.length > 0 ? pastTournaments.map((tournament, index) => (
              <motion.div 
                key={index}
                className="bg-black/50 border border-purple-500/30 rounded-xl p-6 text-center hover-glow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="font-orbitron text-xl font-bold text-white mb-2">
                  {tournament.name}
                </h3>
                <p className="text-gray-400 mb-4">
                  {new Date(tournament.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-600/20 border border-yellow-400/30 rounded-lg p-3 mb-4">
                  <div className="text-yellow-400 font-bold">Champion</div>
                  <div className="text-white font-semibold">{tournament.winner || 'TBD'}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Participants</div>
                    <div className="text-cyan-400 font-bold">{tournament.finalParticipants || tournament.currentParticipants || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Prize Pool</div>
                    <div className="text-purple-400 font-bold">{tournament.prizePool}</div>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-3 text-center py-12">
                <div className="text-6xl mb-4">🏅</div>
                <h3 className="text-2xl font-bold text-white mb-4">No Past Tournaments</h3>
                <p className="text-gray-300">
                  Tournament history will appear here once we have completed events.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tournament Info */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="font-orbitron text-4xl font-bold text-center text-white mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            TOURNAMENT <span className="text-cyan-400">INFORMATION</span>
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-black/50 border border-cyan-500/30 rounded-xl p-6 text-center hover-glow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Users className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="font-orbitron text-xl font-bold text-white mb-3">All Skill Levels</h3>
              <p className="text-gray-300">
                Tournaments designed for beginners to masters, with separate categories 
                ensuring fair and competitive play for everyone.
              </p>
            </motion.div>
            <motion.div 
              className="bg-black/50 border border-purple-500/30 rounded-xl p-6 text-center hover-glow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <Trophy className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="font-orbitron text-xl font-bold text-white mb-3">Attractive Prizes</h3>
              <p className="text-gray-300">
                Substantial prize pools, trophies, and certificates for winners. 
                Every participant receives recognition for their effort.
              </p>
            </motion.div>
            <motion.div 
              className="bg-black/50 border border-cyan-500/30 rounded-xl p-6 text-center hover-glow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <Clock className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="font-orbitron text-xl font-bold text-white mb-3">Professional Organization</h3>
              <p className="text-gray-300">
                FIDE-rated tournaments with professional arbiters, live streaming, 
                and detailed game analysis for all participants.
              </p>
            </motion.div>
          </div>
          
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Tournaments