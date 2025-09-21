import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import api from '../../../utils/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search,
  Filter,
  Save,
  X,
  Calendar,
  MapPin,
  Users,
  Trophy,
  ExternalLink,
  CheckCircle,
  Camera
} from 'lucide-react'
import CropModal from '../../../components/CropModal'

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTournament, setEditingTournament] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  
  // Image cropping states
  const [showCropModal, setShowCropModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false)
      }
    }
    
    if (showModal) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden' // Prevent background scroll
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [showModal])

  const categories = [
    'Open Tournament',
    'Youth (Under 18)',
    'Online Blitz',
    'Rapid',
    'Classical',
    'Blitz'
  ]

  useEffect(() => {
    fetchTournaments()
  }, [searchTerm, statusFilter, categoryFilter])

  const fetchTournaments = async () => {
    try {
      const response = await api.get('/api/tournaments/admin', {
        params: {
          search: searchTerm,
          status: statusFilter,
          category: categoryFilter,
          limit: 100
        }
      })
      setTournaments(response.data.data)
    } catch (error) {
      toast.error('Failed to fetch tournaments')
      console.error('Error fetching tournaments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOrUpdate = async (data) => {
    try {
      console.log('Submitting tournament data:', data)
      
      const formData = new FormData()
      
      // Append all form fields
      Object.keys(data).forEach(key => {
        if (key !== 'posterImage') {
          formData.append(key, data[key])
        }
      })
      
      // Handle cropped poster image upload
      if (croppedImage) {
        formData.append('posterImage', croppedImage, 'tournament-poster.jpg')
      }

      if (editingTournament) {
        await api.put(`/api/tournaments/${editingTournament._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Tournament updated successfully!')
      } else {
        await api.post('/api/tournaments', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Tournament created successfully!')
      }
      
      setShowModal(false)
      setEditingTournament(null)
      reset()
      resetImageStates()
      fetchTournaments()
    } catch (error) {
      console.error('Error submitting tournament:', error)
      console.error('Error response:', error.response?.data)
      
      if (error.response?.data?.errors) {
        // Show validation errors
        error.response.data.errors.forEach(err => {
          toast.error(`${err.path || err.field || 'Field'}: ${err.msg || err.message}`)
        })
      } else {
        toast.error(error.response?.data?.message || 'Error saving tournament')
      }
    }
  }

  const handleEdit = (tournament) => {
    setEditingTournament(tournament)
    reset({
      name: tournament.name,
      date: format(new Date(tournament.date), 'yyyy-MM-dd'),
      time: tournament.time,
      location: tournament.location,
      address: tournament.address,
      entryFee: tournament.entryFee,
      prizePool: tournament.prizePool,
      maxParticipants: tournament.maxParticipants,
      currentParticipants: tournament.currentParticipants,
      format: tournament.format,
      timeControl: tournament.timeControl,
      category: tournament.category,
      registrationLink: tournament.registrationLink,
      poster: tournament.poster,
      description: tournament.description,
      listUntil: format(new Date(tournament.listUntil), 'yyyy-MM-dd')
    })
    
    // Set existing poster image preview if available
    if (tournament.posterImage && tournament.posterImage.startsWith('/uploads/')) {
      setImagePreview(tournament.posterImage)
    } else {
      resetImageStates()
    }
    
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this tournament?')) return
    
    try {
      await api.delete(`/api/tournaments/${id}`)
      toast.success('Tournament deleted successfully!')
      fetchTournaments()
    } catch (error) {
      toast.error('Failed to delete tournament')
    }
  }

  const toggleStatus = async (id) => {
    try {
      await api.patch(`/api/tournaments/${id}/toggle-status`)
      toast.success('Tournament status updated!')
      fetchTournaments()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const markCompleted = async (id) => {
    const winner = prompt('Enter the winner name:')
    if (!winner) return

    try {
      await api.patch(`/api/tournaments/${id}/complete`, { winner })
      toast.success('Tournament marked as completed!')
      fetchTournaments()
    } catch (error) {
      toast.error('Failed to mark tournament as completed')
    }
  }

  const updateParticipants = async (id, currentCount) => {
    const newCount = prompt('Enter new participant count:', currentCount)
    if (newCount === null) return

    try {
      await api.patch(`/api/tournaments/${id}/participants`, {
        currentParticipants: parseInt(newCount)
      })
      toast.success('Participant count updated!')
      fetchTournaments()
    } catch (error) {
      toast.error('Failed to update participant count')
    }
  }

  const resetImageStates = () => {
    setSelectedImage(null)
    setCroppedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleImageSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setSelectedImage(e.target.result)
          setShowCropModal(true)
        }
        reader.readAsDataURL(file)
      } else {
        toast.error('Please select a valid image file')
      }
    }
  }

  const handleCropComplete = (croppedImageBlob) => {
    setCroppedImage(croppedImageBlob)
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(croppedImageBlob)
    setImagePreview(previewUrl)
    
    setShowCropModal(false)
    setSelectedImage(null)
  }

  const openCreateModal = () => {
    setEditingTournament(null)
    reset({
      name: '',
      date: '',
      time: '',
      location: '',
      address: '',
      entryFee: '',
      prizePool: '',
      maxParticipants: '',
      currentParticipants: 0,
      format: '',
      timeControl: '',
      category: 'Open Tournament',
      registrationLink: '',
      poster: '🏆',
      description: '',
      listUntil: ''
    })
    resetImageStates()
    setShowModal(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'ongoing': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tournament Management</h1>
          <p className="text-gray-600">Create and manage chess tournaments</p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Tournament
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search tournaments..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              className="input-field"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tournaments List */}
      <div className="grid gap-6">
        {tournaments.length > 0 ? (
          tournaments.map((tournament) => (
            <div key={tournament._id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-20 h-16 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                    {tournament.posterImage && tournament.posterImage.startsWith('/uploads/') ? (
                      <img
                        src={tournament.posterImage}
                        alt={tournament.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'block'
                        }}
                      />
                    ) : null}
                    <div className={`text-2xl text-gray-400 ${tournament.posterImage && tournament.posterImage.startsWith('/uploads/') ? 'hidden' : ''}`}>
                      {tournament.poster || '🏆'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{tournament.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(tournament.status)}`}>
                        {tournament.status}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        tournament.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tournament.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {tournament.category}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-3">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {format(new Date(tournament.date), 'PPP')} at {tournament.time}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {tournament.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          <button
                            onClick={() => updateParticipants(tournament._id, tournament.currentParticipants)}
                            className="hover:text-blue-600 cursor-pointer"
                          >
                            {tournament.currentParticipants}/{tournament.maxParticipants} participants
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="text-gray-600">Entry Fee: </span>
                          <span className="font-medium">{tournament.entryFee}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Prize Pool: </span>
                          <span className="font-medium text-green-600">{tournament.prizePool}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Format: </span>
                          <span className="font-medium">{tournament.format}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3">{tournament.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">
                        Time Control: {tournament.timeControl}
                      </span>
                      <span className="text-gray-600">
                        List Until: {format(new Date(tournament.listUntil), 'PP')}
                      </span>
                      {tournament.winner && (
                        <span className="text-green-600 font-medium">
                          Winner: {tournament.winner}
                        </span>
                      )}
                    </div>

                    <div className="mt-3">
                      <a
                        href={tournament.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Registration Link
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {tournament.status === 'upcoming' && (
                    <button
                      onClick={() => markCompleted(tournament._id)}
                      className="p-2 text-green-600 hover:text-green-800"
                      title="Mark as Completed"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => toggleStatus(tournament._id)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title={tournament.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {tournament.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleEdit(tournament)}
                    className="p-2 text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(tournament._id)}
                    className="p-2 text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center py-12">
            <p className="text-gray-500">No tournaments found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false)
            }
          }}
        >
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  {editingTournament ? 'Edit Tournament' : 'Add New Tournament'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit(handleCreateOrUpdate)} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tournament Name *
                    </label>
                    <input
                      {...register('name', { required: 'Tournament name is required' })}
                      className="input-field"
                      placeholder="Tournament name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      {...register('date', { required: 'Date is required' })}
                      className="input-field"
                    />
                    {errors.date && (
                      <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time *
                    </label>
                    <input
                      {...register('time', { required: 'Time is required' })}
                      className="input-field"
                      placeholder="09:00 AM"
                    />
                    {errors.time && (
                      <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location *
                    </label>
                    <input
                      {...register('location', { required: 'Location is required' })}
                      className="input-field"
                      placeholder="Tournament venue"
                    />
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <input
                      {...register('address', { required: 'Address is required' })}
                      className="input-field"
                      placeholder="Full address"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Entry Fee *
                    </label>
                    <input
                      {...register('entryFee', { required: 'Entry fee is required' })}
                      className="input-field"
                      placeholder="$50"
                    />
                    {errors.entryFee && (
                      <p className="text-red-500 text-sm mt-1">{errors.entryFee.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prize Pool *
                    </label>
                    <input
                      {...register('prizePool', { required: 'Prize pool is required' })}
                      className="input-field"
                      placeholder="$2,500"
                    />
                    {errors.prizePool && (
                      <p className="text-red-500 text-sm mt-1">{errors.prizePool.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Participants *
                    </label>
                    <input
                      type="number"
                      {...register('maxParticipants', { required: 'Max participants is required' })}
                      className="input-field"
                      placeholder="64"
                    />
                    {errors.maxParticipants && (
                      <p className="text-red-500 text-sm mt-1">{errors.maxParticipants.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Participants
                    </label>
                    <input
                      type="number"
                      {...register('currentParticipants')}
                      className="input-field"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Format *
                    </label>
                    <input
                      {...register('format', { required: 'Format is required' })}
                      className="input-field"
                      placeholder="Swiss System - 7 Rounds"
                    />
                    {errors.format && (
                      <p className="text-red-500 text-sm mt-1">{errors.format.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time Control *
                    </label>
                    <input
                      {...register('timeControl', { required: 'Time control is required' })}
                      className="input-field"
                      placeholder="90 min + 30 sec increment"
                    />
                    {errors.timeControl && (
                      <p className="text-red-500 text-sm mt-1">{errors.timeControl.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      {...register('category', { required: 'Category is required' })}
                      className="input-field"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      List Until *
                    </label>
                    <input
                      type="date"
                      {...register('listUntil', { required: 'List until date is required' })}
                      className="input-field"
                    />
                    {errors.listUntil && (
                      <p className="text-red-500 text-sm mt-1">{errors.listUntil.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Poster Emoji (Fallback)
                    </label>
                    <input
                      {...register('poster')}
                      className="input-field"
                      placeholder="🏆"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tournament Poster Image
                    </label>
                    <div className="space-y-3">
                      {/* Image Preview */}
                      {imagePreview && (
                        <div className="flex items-center space-x-3">
                          <img
                            src={imagePreview}
                            alt="Tournament poster preview"
                            className="w-24 h-18 rounded-lg object-cover border-2 border-gray-300"
                            style={{ aspectRatio: '4/3' }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null)
                              setCroppedImage(null)
                            }}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove Image
                          </button>
                        </div>
                      )}
                      
                      {/* Upload Button */}
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          {imagePreview ? 'Change Poster' : 'Upload Poster'}
                        </button>
                        <p className="text-xs text-gray-500 mt-1">
                          Recommended: 4:3 aspect ratio (e.g., 800x600px)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Link *
                  </label>
                  <input
                    type="url"
                    {...register('registrationLink', { required: 'Registration link is required' })}
                    className="input-field"
                    placeholder="https://forms.google.com/..."
                  />
                  {errors.registrationLink && (
                    <p className="text-red-500 text-sm mt-1">{errors.registrationLink.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    {...register('description', { required: 'Description is required' })}
                    className="input-field"
                    rows="4"
                    placeholder="Tournament description..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex items-center justify-center w-full sm:w-auto"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingTournament ? 'Update' : 'Create'} Tournament
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Crop Modal */}
      <CropModal
        isOpen={showCropModal}
        onClose={() => {
          setShowCropModal(false)
          setSelectedImage(null)
        }}
        imageSrc={selectedImage}
        onCropComplete={handleCropComplete}
        aspectRatio={4/3} // 4:3 ratio for tournament posters
        cropShape="rect"
        title="Crop Tournament Poster"
      />
    </div>
  )
}

export default Tournaments