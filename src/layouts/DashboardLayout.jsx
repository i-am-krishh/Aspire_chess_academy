import React, { useState, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../pages/dashboard/contexts/AuthContext'
import api from '../utils/api'
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  LogOut, 
  Crown,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  UserPlus
} from 'lucide-react'

const DashboardLayout = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [uncontactedCount, setUncontactedCount] = useState(0)

  // Fetch uncontacted enrollments count
  const fetchUncontactedCount = async () => {
    try {
      const response = await api.get('/api/enrollments/admin?contacted=false&limit=1')
      setUncontactedCount(response.data.uncontactedCount || 0)
    } catch (error) {
      console.error('Error fetching uncontacted count:', error)
    }
  }

  // Fetch count on component mount and when location changes
  useEffect(() => {
    fetchUncontactedCount()
  }, [location.pathname])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Handle window resize - sidebar should be open by default on desktop, closed on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        // Mobile: keep sidebar collapsed but don't auto-set it
        // Mobile menu is handled separately
      } else {
        // Desktop: ensure sidebar is not collapsed by default
        if (window.innerWidth >= 1024) {
          // Only expand if we're coming from mobile size
          setSidebarCollapsed(false)
        }
      }
    }

    // Set initial state based on screen size
    if (window.innerWidth >= 1024) {
      setSidebarCollapsed(false) // Desktop: sidebar open by default
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Students', href: '/dashboard/students', icon: Users },
    { name: 'Tournaments', href: '/dashboard/tournaments', icon: Trophy },
    { name: 'Enrollments', href: '/dashboard/enrollments', icon: UserPlus },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <Crown className="h-6 w-6 text-blue-600 mr-2" />
            <span className="text-lg font-bold text-gray-900">Aspire Admin</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 bg-white shadow-lg transition-all duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64
      `}>
        {/* Desktop sidebar header */}
        <div className="hidden lg:flex h-16 items-center justify-between border-b border-gray-200 px-4 relative">
          <div className={`flex items-center transition-all duration-300 ${sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
            <Crown className="h-8 w-8 text-blue-600 mr-2 flex-shrink-0" />
            <span className="text-xl font-bold text-gray-900 whitespace-nowrap">Aspire Admin</span>
          </div>
          
          {/* Collapse button - always visible */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-200 flex-shrink-0 ${
              sidebarCollapsed ? 'mx-auto' : ''
            }`}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile sidebar header */}
        <div className="lg:hidden flex h-16 items-center justify-center border-b border-gray-200">
          <div className="flex items-center">
            <Crown className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">Aspire Admin</span>
          </div>
        </div>
        
        <nav className="mt-8 px-3">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative ${
                      active
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    } ${sidebarCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
                    title={sidebarCollapsed ? item.name : ''}
                  >
                    <Icon className={`h-5 w-5 flex-shrink-0 ${sidebarCollapsed ? 'lg:mr-0' : 'mr-3'}`} />
                    <span className={`transition-all duration-300 flex-1 ${sidebarCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden lg:ml-0' : 'opacity-100 ml-0'}`}>
                      {item.name}
                    </span>
                    
                    {/* Badge for Enrollments */}
                    {item.name === 'Enrollments' && uncontactedCount > 0 && (
                      <span className={`ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full transition-all duration-300 ${
                        sidebarCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'
                      }`}>
                        {uncontactedCount}
                      </span>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    {sidebarCollapsed && (
                      <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                        {item.name}
                        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200">
          <div className={`flex items-center ${sidebarCollapsed ? 'lg:flex-col lg:space-y-2 lg:justify-center' : 'justify-between'}`}>
            <div className={`flex items-center ${sidebarCollapsed ? 'lg:flex-col lg:items-center lg:space-x-0' : ''}`}>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div className={`ml-3 transition-all duration-300 ${sidebarCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden lg:ml-0 lg:mt-1' : 'opacity-100'}`}>
                <p className="text-sm font-medium text-gray-700 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            
            {/* Logout button */}
            <button
              onClick={logout}
              className={`p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-md hover:bg-gray-100 group relative ${
                sidebarCollapsed ? 'lg:w-full lg:flex lg:justify-center' : ''
              }`}
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
              
              {/* Tooltip for collapsed state */}
              {sidebarCollapsed && (
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                  Logout
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`
        transition-all duration-300 ease-in-out min-h-screen overflow-x-hidden
        ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'} 
        pt-16 lg:pt-0
      `}>
        <main className="py-4 sm:py-6 lg:py-8 px-4 lg:px-8 max-w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout