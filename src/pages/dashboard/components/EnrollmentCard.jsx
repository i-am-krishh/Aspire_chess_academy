import { useEffect } from 'react'
import { format } from 'date-fns'
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  Trash2,
  MessageSquare,
  GraduationCap,
  Star,
  AlertCircle
} from 'lucide-react'

const EnrollmentCard = ({ 
  enrollment, 
  isOpen, 
  onClose, 
  onMarkContacted, 
  onDelete, 
  getStatusColor, 
  getBranchColor 
}) => {

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !enrollment) return null

  const handleMarkContacted = () => {
    if (!confirm('Are you sure you want to mark this enrollment as contacted? This action will update the status and timestamp.')) return
    onMarkContacted(enrollment._id)
    onClose()
  }

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this enrollment? This action cannot be undone.')) return
    onDelete(enrollment._id)
    onClose()
  }

  const enrollmentAge = Math.floor((Date.now() - new Date(enrollment.createdAt)) / (1000 * 60 * 60 * 24))

  return (
    <div 
      className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {enrollment.name}
                </h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(enrollment.status)}`}>
                  {enrollment.status}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Applied {enrollmentAge} days ago ({format(new Date(enrollment.createdAt), 'MMM dd, yyyy HH:mm')})</span>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 ml-4 flex-shrink-0"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-500" />
                Contact Details
              </h3>
              
              <div className="space-y-2 pl-7">
                <div>
                  <span className="text-sm text-gray-500">Email</span>
                  <p className="text-gray-900 break-words">{enrollment.email}</p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500">Phone</span>
                  <p className="text-gray-900">{enrollment.phone}</p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500">Preferred Branch</span>
                  <div className="mt-1">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getBranchColor(enrollment.branch)}`}>
                      {enrollment.branch}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-green-500" />
                Student Information
              </h3>
              
              <div className="space-y-2 pl-7">
                {enrollment.age && (
                  <div>
                    <span className="text-sm text-gray-500">Age</span>
                    <p className="text-gray-900">{enrollment.age} years old</p>
                  </div>
                )}
                
                <div>
                  <span className="text-sm text-gray-500">Experience Level</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-gray-900">{enrollment.experience}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Message/Goals */}
          {enrollment.message && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-3">
                <MessageSquare className="h-5 w-5 text-purple-500" />
                Message & Goals
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {enrollment.message}
                </p>
              </div>
            </div>
          )}

          {/* Contact Status */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-orange-500" />
              Contact Status
            </h3>
            
            {enrollment.contacted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800 mb-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Contacted</span>
                </div>
                <div className="text-sm text-green-700 space-y-1">
                  <p>Date: {format(new Date(enrollment.contactedAt), 'MMM dd, yyyy HH:mm')}</p>
                  {enrollment.contactedBy && (
                    <p>By: {enrollment.contactedBy.name} ({enrollment.contactedBy.email})</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-800 mb-2">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Pending Contact</span>
                </div>
                <p className="text-sm text-yellow-700">
                  This enrollment has not been contacted yet.
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          {enrollment.notes && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Admin Notes</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">{enrollment.notes}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="btn-secondary w-full sm:w-auto order-3 sm:order-1"
            >
              Close
            </button>
            
            {!enrollment.contacted && (
              <button
                onClick={handleMarkContacted}
                className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto order-1 sm:order-2"
              >
                <CheckCircle className="h-4 w-4" />
                Mark as Contacted
              </button>
            )}
            
            <button
              onClick={handleDelete}
              className="btn-danger flex items-center justify-center gap-2 w-full sm:w-auto order-2 sm:order-3"
            >
              <Trash2 className="h-4 w-4" />
              Delete Enrollment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnrollmentCard