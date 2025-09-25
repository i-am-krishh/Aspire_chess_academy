import React, { useState } from 'react'
import { Edit, Trash2, Eye, EyeOff, X, Star, Calendar, Trophy, User } from 'lucide-react'

const StudentCard = ({ 
  student, 
  onEdit, 
  onDelete, 
  onToggleStatus,
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

  const StudentDialog = () => (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Dialog Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Student Details</h2>
          <button
            onClick={() => setShowDialog(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dialog Content */}
        <div className="p-6">
          {/* Student Header */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                {student.image && isValidImageUrl(student.image) ? (
                  <img
                    src={student.image}
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 md:h-16 md:w-16 text-gray-400" />
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{student.name}</h3>
                  <p className="text-blue-600 font-medium text-lg">{student.title}</p>
                </div>
                {student.featured && (
                  <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                    <Star className="h-4 w-4 mr-1" />
                    Featured
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Trophy className="h-4 w-4 mr-1" />
                  Rating: {student.rating}
                </div>
                <div className="flex items-center">
                  <Trophy className="h-4 w-4 mr-1" />
                  Peak: {student.peakRating}
                </div>
                {student.fideId && (
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 mr-1" />
                    FIDE ID: {student.fideId}
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Joined: {student.joinDate}
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-900 font-medium">{student.program}</p>
              </div>
            </div>
          </div>

          {/* Biography */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Biography</h4>
            <p className="text-gray-700 leading-relaxed">{student.bio}</p>
          </div>

          {/* Testimonial */}
          {student.testimonial && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Testimonial</h4>
              <blockquote className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-gray-700 italic">"{student.testimonial}"</p>
              </blockquote>
            </div>
          )}

          {/* Achievements */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Achievements</h4>
            <div className="space-y-2">
              {student.achievements.map((achievement, idx) => (
                <div key={idx} className="flex items-start bg-green-50 p-3 rounded-lg">
                  <Trophy className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-green-800">{achievement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              student.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {student.isActive ? 'Active' : 'Inactive'}
            </span>
            
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowDialog(false)
                  onEdit(student)
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Student
              </button>
            </div>
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
          {/* Student Image */}
          <div className="flex-shrink-0 self-center sm:self-start">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {student.image && isValidImageUrl(student.image) ? (
                <img
                  src={student.image}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 md:h-10 md:w-10 text-gray-400" />
              )}
            </div>
          </div>

          {/* Student Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 truncate">{student.name}</h3>
                {student.featured && (
                  <div className="flex items-center text-yellow-600 text-sm mt-1">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    Featured
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-blue-600 font-medium mb-1 text-sm md:text-base">{student.title}</p>
            <p className="text-gray-600 mb-2 text-sm md:text-base">{student.program}</p>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs md:text-sm text-gray-500 mb-3">
              <span>Rating: {student.rating}</span>
              <span>Peak: {student.peakRating}</span>
              {student.fideId && <span>FIDE ID: {student.fideId}</span>}
              <span>Joined: {student.joinDate}</span>
            </div>

            {/* Truncated Bio with Read More */}
            <div className="mb-3">
              <p className="text-xs md:text-sm text-gray-600">
                {truncateText(student.bio, 50)}
                {student.bio && student.bio.length > 50 && (
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

            {/* Status */}
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                student.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {student.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex sm:flex-col sm:items-center justify-end sm:justify-start gap-1 sm:gap-1 flex-shrink-0 mt-2 sm:mt-0">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleStatus(student._id)
              }}
              className="p-2 sm:p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title={student.isActive ? 'Deactivate' : 'Activate'}
            >
              {student.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit(student)
              }}
              className="p-2 sm:p-2.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(student._id)
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
      {showDialog && <StudentDialog />}
    </>
  )
}

export default StudentCard
