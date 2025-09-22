// Simple test script to verify API connectivity
import api from './api.js'

export const testApiConnection = async () => {
  try {
    console.log('Testing API connection...')
    console.log('Base URL:', api.defaults.baseURL)
    
    const response = await api.get('/api/health')
    console.log('✅ API Health Check Successful:', response.data)
    return true
  } catch (error) {
    console.error('❌ API Health Check Failed:', error)
    return false
  }
}

export const testAuthEndpoint = async () => {
  try {
    console.log('Testing Auth endpoint...')
    // This should return 401 but not 405
    const response = await api.post('/api/auth/login', {
      email: 'test@test.com',
      password: 'wrongpass'
    })
    console.log('Unexpected success:', response.data)
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Auth endpoint working (401 as expected)')
      return true
    } else {
      console.error('❌ Auth endpoint error:', error)
      return false
    }
  }
}

// Auto-run tests when imported
if (typeof window !== 'undefined') {
  window.testApiConnection = testApiConnection
  window.testAuthEndpoint = testAuthEndpoint
}