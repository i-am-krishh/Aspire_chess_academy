import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import api from '../../../utils/api'
import toast from 'react-hot-toast'
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
  Camera
} from 'lucide-react'
import CropModal from '../../../components/CropModal'
import { isValidImageUrl } from '../../../utils/imageUtils'
import StudentCard from '../components/StudentCard'

const Students = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

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

  const fetchStudents = async () => {
    try {
      const response = await api.get('/api/students/admin', {
        params: {
          search: searchTerm,
          status: statusFilter,
          limit: 100
        }
      })
      setStudents(response.data.data)
    } catch (error) {
      toast.error('Failed to fetch students')
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [searchTerm, statusFilter]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreateOrUpdate = async (data) => {
    try {
      console.log('Submitting student data:', data)

      const formData = new FormData()

      // Append all form fields
      Object.keys(data).forEach(key => {
        if (key !== 'image') {
          if (key === 'achievements' && Array.isArray(data[key])) {
            // Handle achievements array properly
            data[key].forEach((achievement, index) => {
              formData.append(`achievements[${index}]`, achievement)
            })
          } else {
            formData.append(key, data[key])
          }
        }
      })

      // Handle cropped image upload
      if (croppedImage) {
        formData.append('image', croppedImage, 'student-image.jpg')
      }

      if (editingStudent) {
        await api.put(`/api/students/${editingStudent._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Student updated successfully!')
      } else {
        await api.post('/api/students', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Student created successfully!')
      }

      setShowModal(false)
      setEditingStudent(null)
      reset()
      resetImageStates()
      fetchStudents()
    } catch (error) {
      console.error('Error submitting student:', error)
      console.error('Error response:', error.response?.data)

      if (error.response?.data?.errors) {
        // Show validation errors
        error.response.data.errors.forEach(err => {
          toast.error(`${err.path || err.field || 'Field'}: ${err.msg || err.message}`)
        })
      } else {
        toast.error(error.response?.data?.message || 'Error saving student')
      }
    }
  }

  const handleEdit = (student) => {
    setEditingStudent(student)
    reset({
      name: student.name,
      title: student.title,
      rating: student.rating,
      peakRating: student.peakRating,
      program: student.program,
      achievements: student.achievements.join('\n'),
      joinDate: student.joinDate,
      testimonial: student.testimonial,
      bio: student.bio,
      featured: student.featured || false
    })

    // Set existing image preview if available
    if (student.image && isValidImageUrl(student.image)) {
      setImagePreview(student.image)
    } else {
      resetImageStates()
    }

    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return
    
    try {
      await api.delete(`/api/students/${id}`)
      toast.success('Student deleted successfully!')
      fetchStudents()
    } catch (err) {
      console.error('Error deleting student:', err)
      toast.error('Failed to delete student')
    }
  }

  const toggleStatus = async (id) => {
    if (!confirm('Are you sure you want to toggle this student\'s status?')) return

    try {
      await api.patch(`/api/students/${id}/toggle-status`)
      toast.success('Student status updated!')
      fetchStudents()
    } catch (err) {
      console.error('Error toggling status:', err)
      toast.error('Failed to update status')
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
      // Check file size (500KB = 500 * 1024 bytes = 512000 bytes)
      const maxSize = 500 * 1024 // 500KB in bytes
      if (file.size > maxSize) {
        toast.error('Image size must be less than 500KB. Please choose a smaller image.')
        if (fileInputRef.current) {
          fileInputRef.current.value = '' // Clear the input
        }
        return
      }

      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setSelectedImage(e.target.result)
          setShowCropModal(true)
        }
        reader.readAsDataURL(file)
      } else {
        toast.error('Please select a valid image file')
        if (fileInputRef.current) {
          fileInputRef.current.value = '' // Clear the input
        }
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
    setEditingStudent(null)
    reset({
      name: '',
      title: '',
      rating: '',
      peakRating: '',
      program: '',
      achievements: '',
      joinDate: '',
      testimonial: '',
      bio: ''
    })
    resetImageStates()
    setShowModal(true)
  }

  const onSubmit = (data) => {
    // Convert achievements from textarea to array
    const formattedData = {
      ...data,
      achievements: data.achievements ? data.achievements.split('\n').filter(a => a.trim()) : []
    }
    console.log('Form data being submitted:', formattedData)
    handleCreateOrUpdate(formattedData)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-4 sm:px-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Students Management</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage student testimonials and profiles</p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center justify-center w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="card mx-4 sm:mx-0 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search students..."
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <select
              className="input-field text-sm sm:text-base"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="grid gap-4 lg:gap-6 px-4 sm:px-0">
        {students.length > 0 ? (
          students.map((student) => (
            <StudentCard
              key={student._id}
              student={student}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={toggleStatus}
              isValidImageUrl={isValidImageUrl}
            />
          ))
        ) : (
          <div className="card text-center py-12 mx-4 sm:mx-0">
            <p className="text-gray-500">No students found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/85  flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false)
            }
          }}
        >
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  {editingStudent ? 'Edit Student' : 'Add New Student'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      className="input-field"
                      placeholder="Student name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      {...register('title', { required: 'Title is required' })}
                      className="input-field"
                      placeholder="e.g., FIDE Master, National Champion"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Rating *
                    </label>
                    <input
                      {...register('rating', { required: 'Rating is required' })}
                      className="input-field"
                      placeholder="e.g., 2380"
                    />
                    {errors.rating && (
                      <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Peak Rating *
                    </label>
                    <input
                      {...register('peakRating', { required: 'Peak rating is required' })}
                      className="input-field"
                      placeholder="e.g., 2400"
                    />
                    {errors.peakRating && (
                      <p className="text-red-500 text-sm mt-1">{errors.peakRating.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Program *
                    </label>
                    <input
                      {...register('program', { required: 'Program is required' })}
                      className="input-field"
                      placeholder="e.g., Elite Training Program"
                    />
                    {errors.program && (
                      <p className="text-red-500 text-sm mt-1">{errors.program.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Join Date *
                    </label>
                    <input
                      {...register('joinDate', { required: 'Join date is required' })}
                      className="input-field"
                      placeholder="e.g., January 2023"
                    />
                    {errors.joinDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.joinDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student Image
                    </label>
                    <div className="space-y-3">
                      {/* Image Preview */}
                      {imagePreview && (
                        <div className="flex items-center space-x-3">
                          <img
                            src={imagePreview}
                            alt="Student preview"
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
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
                          {imagePreview ? 'Change Image' : 'Upload Image'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('featured')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Featured on Home Page
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Achievements * (one per line)
                  </label>
                  <textarea
                    {...register('achievements', { required: 'At least one achievement is required' })}
                    className="input-field"
                    rows="4"
                    placeholder="Gained 400 rating points in 18 months&#10;FIDE Master title achieved&#10;Regional Championship Winner"
                  />
                  {errors.achievements && (
                    <p className="text-red-500 text-sm mt-1">{errors.achievements.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Testimonial *
                  </label>
                  <textarea
                    {...register('testimonial', { required: 'Testimonial is required' })}
                    className="input-field"
                    rows="3"
                    placeholder="Student's testimonial about their experience..."
                  />
                  {errors.testimonial && (
                    <p className="text-red-500 text-sm mt-1">{errors.testimonial.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio *
                  </label>
                  <textarea
                    {...register('bio', { required: 'Bio is required' })}
                    className="input-field"
                    rows="3"
                    placeholder="Brief biography of the student..."
                  />
                  {errors.bio && (
                    <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
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
                    {editingStudent ? 'Update' : 'Create'} Student
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
        aspectRatio={1} // 1:1 ratio for student images
        cropShape="round"
        title="Crop Student Image"
      />
    </div>
  )
}

export default Students