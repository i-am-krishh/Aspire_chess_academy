import axios from 'axios'

// Determine the correct base URL based on environment
const baseURL = import.meta.env.MODE === 'production' 
  ? 'https://aspire-chess-academy-backend.onrender.com'  // Your production backend URL
  : 'http://localhost:5000';  // Local development

console.log('API Base URL:', baseURL);
console.log('Environment Mode:', import.meta.env.MODE);

// Create axios instance with base configuration
const api = axios.create({
  baseURL,
  timeout: 30000,  // Increased timeout for production
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data
    })
    
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token')
      window.location.href = '/dashboard/login'
    }
    return Promise.reject(error)
  }
)

export default api
