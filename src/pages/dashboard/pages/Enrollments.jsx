import { useState, useEffect } from 'react'
import api from '../../../utils/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { 
  Search,
  Filter,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Badge
} from 'lucide-react'
import EnrollmentCard from '../components/EnrollmentCard'

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [contactedFilter, setContactedFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [branchFilter, setBranchFilter] = useState('all')
  const [selectedEnrollment, setSelectedEnrollment] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [stats, setStats] = useState({ total: 0, contacted: 0, pending: 0 })
  const [uncontactedCount, setUncontactedCount] = useState(0)

  const branches = ['Kalamboli', 'Kamothe', 'Roadpali']
  const statuses = ['pending', 'contacted', 'enrolled', 'rejected']

  const fetchEnrollments = async () => {
    try {
      const response = await api.get('/api/enrollments/admin', {
        params: {
          search: searchTerm,
          contacted: contactedFilter,
          status: statusFilter,
          branch: branchFilter,
          limit: 100
        }
      })
      setEnrollments(response.data.data)
      setStats(response.data.stats)
      setUncontactedCount(response.data.uncontactedCount)
    } catch (error) {
      toast.error('Failed to fetch enrollments')
      console.error('Error fetching enrollments:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEnrollments()
  }, [searchTerm, contactedFilter, statusFilter, branchFilter]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleViewDetails = (enrollment) => {
    setSelectedEnrollment(enrollment)
    setShowModal(true)
  }

  const handleMarkContacted = async (id) => {
    if (!confirm('Are you sure you want to mark this enrollment as contacted? This action will update the status and timestamp.')) return
    
    try {
      await api.patch(`/api/enrollments/${id}/contact`)
      toast.success('Marked as contacted!')
      fetchEnrollments()
    } catch (err) {
      console.error('Error marking as contacted:', err)
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this enrollment? This action cannot be undone.')) return
    
    try {
      await api.delete(`/api/enrollments/${id}`)
      toast.success('Enrollment deleted successfully!')
      fetchEnrollments()
    } catch (err) {
      console.error('Error deleting enrollment:', err)
      toast.error('Failed to delete enrollment')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'contacted': return 'bg-blue-100 text-blue-800'
      case 'enrolled': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getBranchColor = (branch) => {
    switch (branch) {
      case 'Kalamboli': return 'bg-purple-100 text-purple-800'
      case 'Kamothe': return 'bg-cyan-100 text-cyan-800'
      case 'Roadpali': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Enrollment Management</h1>
            {uncontactedCount > 0 && (
              <div className="flex items-center gap-2">
                <Badge className="h-5 w-5 text-red-500" />
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {uncontactedCount} pending contact{uncontactedCount !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
          <p className="text-gray-600">Manage enrollment inquiries and responses</p>
        </div>
        
        {/* Stats Cards */}
        <div className="flex gap-4 w-full lg:w-auto">
          <div className="bg-blue-50 rounded-lg p-4 text-center min-w-[100px]">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-blue-600">Total</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center min-w-[100px]">
            <div className="text-2xl font-bold text-green-600">{stats.contacted}</div>
            <div className="text-sm text-green-600">Contacted</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center min-w-[100px]">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-yellow-600">Pending</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 p-2" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              className="input-field text-sm sm:text-base min-w-[120px]"
              value={contactedFilter}
              onChange={(e) => setContactedFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="false">Not Contacted</option>
              <option value="true">Contacted</option>
            </select>
            
            <select
              className="input-field text-sm sm:text-base min-w-[120px]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Progress</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            
            <select
              className="input-field text-sm sm:text-base min-w-[120px]"
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
            >
              <option value="all">All Branches</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Enrollment Cards */}
      <div className="grid gap-4 lg:gap-6 px-4 sm:px-0">
        {enrollments.length > 0 ? (
          enrollments
            .sort((a, b) => {
              // Sort by contacted status first (false/not contacted first), then by created date (newest first)
              if (a.contacted !== b.contacted) {
                return a.contacted ? 1 : -1;
              }
              return new Date(b.createdAt) - new Date(a.createdAt);
            })
            .map((enrollment) => (
            <div key={enrollment._id} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {enrollment.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(enrollment.status)}`}>
                          {enrollment.status}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span className="truncate max-w-[200px]">{enrollment.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>{enrollment.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBranchColor(enrollment.branch)}`}>
                            {enrollment.branch}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(enrollment.createdAt), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{enrollment.experience}</span>
                        </div>
                        {enrollment.age && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{enrollment.age} years</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {!enrollment.contacted && (
                      <div className="flex items-center justify-center w-3 h-3 bg-red-500 rounded-full animate-pulse flex-shrink-0" title="Requires contact">
                      </div>
                    )}
                  </div>
                  
                  {enrollment.message && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {enrollment.message.length > 100 
                          ? `${enrollment.message.substring(0, 100)}...` 
                          : enrollment.message
                        }
                      </p>
                    </div>
                  )}
                  
                  {enrollment.contacted && enrollment.contactedAt && (
                    <div className="flex items-center gap-2 text-sm text-green-600 mb-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Contacted on {format(new Date(enrollment.contactedAt), 'MMM dd, yyyy')}</span>
                      {enrollment.contactedBy && (
                        <span className="text-gray-500">by {enrollment.contactedBy.name}</span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleViewDetails(enrollment)}
                    className="btn-secondary flex items-center gap-1 text-sm"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">View</span>
                  </button>
                  
                  {!enrollment.contacted && (
                    <button
                      onClick={() => handleMarkContacted(enrollment._id)}
                      className="btn-primary flex items-center gap-1 text-sm"
                      title="Mark as Contacted"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">Contacted</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDelete(enrollment._id)}
                    className="btn-danger flex items-center gap-1 text-sm"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center py-12 mx-4 sm:mx-0">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No enrollment inquiries found</p>
            <p className="text-gray-400 text-sm mt-2">Enrollment inquiries will appear here when students submit the contact form</p>
          </div>
        )}
      </div>

      {/* Modal for Enrollment Details */}
      {showModal && selectedEnrollment && (
        <EnrollmentCard
          enrollment={selectedEnrollment}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false)
            setSelectedEnrollment(null)
          }}
          onMarkContacted={handleMarkContacted}
          onDelete={handleDelete}
          getStatusColor={getStatusColor}
          getBranchColor={getBranchColor}
        />
      )}
    </div>
  )
}

export default Enrollments