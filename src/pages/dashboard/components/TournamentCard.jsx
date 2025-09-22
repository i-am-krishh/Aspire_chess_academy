import React, { useState } from 'react'
import { Edit, Trash2, Eye, EyeOff, X, Calendar, MapPin, Users, ExternalLink, DollarSign, Clock, Trophy, Target } from 'lucide-react'
import { format } from 'date-fns'

const TournamentCard = ({ 
  tournament, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  getStatusColor,
  isValidImageUrl 
}) => {
  const [showDialog, setShowDialog] = useState(false)

  const truncateText = (text, limit = 50) => {
    if (!text) return ''
    return text.length > limit ? text.substring(0, limit) + '...' : text
  }

  const handleCardClick = (e) => {
    // Prevent dialog from opening when clicking action buttons
    if (e.target.closest('button')) return
    setShowDialog(true)
  }

  const TournamentDialog = () => (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Dialog Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Tournament Details</h2>
          <button
            onClick={() => setShowDialog(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dialog Content */}
        <div className="p-6">
          {/* Tournament Header */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                {tournament.posterImage && isValidImageUrl(tournament.posterImage) ? (
                  <img
                    src={tournament.posterImage}
                    alt={tournament.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-2xl md:text-4xl text-gray-400">
                    {tournament.poster || '🏆'}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{tournament.name}</h3>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(tournament.status)}`}>
                  {tournament.status}
                </span>
                <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                  tournament.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {tournament.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="px-3 py-1 text-sm rounded-full font-medium bg-blue-100 text-blue-800">
                  {tournament.category}
                </span>
              </div>
            </div>
          </div>

          {/* Key Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <div>
                <div className="font-semibold text-gray-900">{format(new Date(tournament.date), 'EEEE, MMMM d, yyyy')}</div>
                <div className="text-gray-600">at {tournament.time}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <MapPin className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div className="text-gray-900 font-medium">{tournament.location}</div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
              <Users className="h-6 w-6 text-purple-600 flex-shrink-0" />
              <div>
                <div className="font-semibold text-gray-900">
                  {tournament.currentParticipants}/{tournament.maxParticipants} participants
                </div>
                <div className="text-gray-600">registered</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-yellow-600 flex-shrink-0" />
              <div>
                <div className="font-semibold text-gray-900">Entry: {tournament.entryFee}</div>
                <div className="text-green-600 font-medium">Prize: {tournament.prizePool}</div>
              </div>
            </div>
          </div>

          {/* Tournament Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="text-sm text-gray-600">Format</div>
                  <div className="font-semibold text-gray-900">{tournament.format}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="text-sm text-gray-600">Time Control</div>
                  <div className="font-semibold text-gray-900">{tournament.timeControl}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">List Until</div>
                <div className="font-semibold text-gray-900">
                  {format(new Date(tournament.listUntil), 'MMM d, yyyy')}
                </div>
              </div>
              
              {tournament.winner && (
                <div className="flex items-center gap-3">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <div>
                    <div className="text-sm text-gray-600">Winner</div>
                    <div className="font-semibold text-green-600">{tournament.winner}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">About Tournament</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">{tournament.description}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <a
              href={tournament.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors flex items-center justify-center"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Register for Tournament
            </a>
            
            <button
              onClick={() => {
                setShowDialog(false)
                onEdit(tournament)
              }}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Edit Tournament
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-4 md:p-6"
        onClick={handleCardClick}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Tournament Poster */}
          <div className="flex-shrink-0 self-center sm:self-start">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              {tournament.posterImage && isValidImageUrl(tournament.posterImage) ? (
                <img
                  src={tournament.posterImage}
                  alt={tournament.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-xl md:text-2xl text-gray-400">
                  {tournament.poster || '🏆'}
                </div>
              )}
            </div>
          </div>

          {/* Tournament Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 truncate">{tournament.name}</h3>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(tournament.status)}`}>
                {tournament.status}
              </span>
              <span className="px-2 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-800">
                {tournament.category}
              </span>
            </div>

            {/* Key Info */}
            <div className="space-y-1 mb-3 text-xs md:text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                <span>{format(new Date(tournament.date), 'MMM d, yyyy')} at {tournament.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                <span>{tournament.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3 md:h-4 md:w-4" />
                <span>{tournament.currentParticipants}/{tournament.maxParticipants} participants</span>
              </div>
            </div>

            {/* Truncated Description with Read More */}
            <div className="mb-3">
              <p className="text-xs md:text-sm text-gray-600">
                {truncateText(tournament.description, 50)}
                {tournament.description && tournament.description.length > 50 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowDialog(true)
                    }}
                    className="text-blue-600 hover:text-blue-800 ml-1 font-medium"
                  >
                    Read more
                  </button>
                )}
              </p>
            </div>

            {/* Prize Info */}
            <div className="flex items-center justify-between text-xs md:text-sm">
              <div className="flex gap-4">
                <span className="text-gray-600">Entry: <span className="font-medium text-gray-900">{tournament.entryFee}</span></span>
                <span className="text-gray-600">Prize: <span className="font-medium text-green-600">{tournament.prizePool}</span></span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex sm:flex-col sm:items-center justify-end sm:justify-start gap-1 sm:gap-1 flex-shrink-0 mt-2 sm:mt-0">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleStatus(tournament._id)
              }}
              className="p-2 sm:p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title={tournament.isActive ? 'Deactivate' : 'Activate'}
            >
              {tournament.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit(tournament)
              }}
              className="p-2 sm:p-2.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(tournament._id)
              }}
              className="p-2 sm:p-2.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Dialog */}
      {showDialog && <TournamentDialog />}
    </>
  )
}

export default TournamentCard
