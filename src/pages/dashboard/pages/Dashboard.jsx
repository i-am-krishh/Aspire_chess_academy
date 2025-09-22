import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../../utils/api'
import { Users, Trophy, Calendar, TrendingUp, Plus, Eye, UserPlus } from 'lucide-react'
import { isValidImageUrl } from '../../../utils/imageUtils'

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        activeStudents: 0,
        totalTournaments: 0,
        upcomingTournaments: 0,
        totalEnrollments: 0,
        pendingEnrollments: 0
    })
    const [recentStudents, setRecentStudents] = useState([])
    const [upcomingTournaments, setUpcomingTournaments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            const [studentsRes, tournamentsRes, recentStudentsRes, upcomingTournamentsRes, enrollmentsRes] = await Promise.all([
                api.get('/api/students/admin?limit=1000'),
                api.get('/api/tournaments/admin?limit=1000'),
                api.get('/api/students/admin?limit=5'),
                api.get('/api/tournaments?limit=5'),
                api.get('/api/enrollments/admin?limit=1000')
            ])

            const students = studentsRes.data.data
            const tournaments = tournamentsRes.data.data
            const enrollments = enrollmentsRes.data.data

            setStats({
                totalStudents: students.length,
                activeStudents: students.filter(s => s.isActive).length,
                totalTournaments: tournaments.length,
                upcomingTournaments: tournaments.filter(t => t.status === 'upcoming').length,
                totalEnrollments: enrollments.length,
                pendingEnrollments: enrollments.filter(e => !e.contacted).length
            })

            setRecentStudents(recentStudentsRes.data.data)
            setUpcomingTournaments(upcomingTournamentsRes.data.data)
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
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
        <div className="space-y-6 lg:space-y-8">
            {/* Header */}
            <div className="px-4 sm:px-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome to Aspire Chess Academy Admin Panel</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6 px-4 sm:px-0">
                <div className="card p-4 lg:p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                            <Users className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
                        </div>
                        <div className="ml-3 lg:ml-4 min-w-0">
                            <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">Total Students</p>
                            <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                        </div>
                    </div>
                </div>

                <div className="card p-4 lg:p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                            <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
                        </div>
                        <div className="ml-3 lg:ml-4 min-w-0">
                            <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">Active Students</p>
                            <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.activeStudents}</p>
                        </div>
                    </div>
                </div>

                <div className="card p-4 lg:p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                            <Trophy className="h-5 w-5 lg:h-6 lg:w-6 text-purple-600" />
                        </div>
                        <div className="ml-3 lg:ml-4 min-w-0">
                            <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">Total Tournaments</p>
                            <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.totalTournaments}</p>
                        </div>
                    </div>
                </div>

                <div className="card p-4 lg:p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                            <Calendar className="h-5 w-5 lg:h-6 lg:w-6 text-orange-600" />
                        </div>
                        <div className="ml-3 lg:ml-4 min-w-0">
                            <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">Upcoming Events</p>
                            <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.upcomingTournaments}</p>
                        </div>
                    </div>
                </div>

                <div className="card p-4 lg:p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-cyan-100 rounded-lg flex-shrink-0">
                            <UserPlus className="h-5 w-5 lg:h-6 lg:w-6 text-cyan-600" />
                        </div>
                        <div className="ml-3 lg:ml-4 min-w-0">
                            <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">Total Enrollments</p>
                            <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.totalEnrollments}</p>
                        </div>
                    </div>
                </div>

                <div className="card p-4 lg:p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                            <Calendar className="h-5 w-5 lg:h-6 lg:w-6 text-red-600" />
                        </div>
                        <div className="ml-3 lg:ml-4 min-w-0">
                            <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">Pending Contact</p>
                            <div className="flex items-center gap-2">
                                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.pendingEnrollments}</p>
                                {stats.pendingEnrollments > 0 && (
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 px-4 sm:px-0">
                {/* Recent Students */}
                <div className="card p-4 lg:p-6">
                    <div className="flex items-center justify-between mb-4 lg:mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Students</h2>
                        <Link to="/dashboard/students" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            View all
                        </Link>
                    </div>

                    <div className="space-y-3 lg:space-y-4">
                        {recentStudents.length > 0 ? (
                            recentStudents.map((student) => (
                                <div key={student._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center min-w-0 flex-1">
                                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3 overflow-hidden flex-shrink-0">
                                            {student.image && isValidImageUrl(student.image) ? (
                                                <img 
                                                    src={student.image} 
                                                    alt={student.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-lg lg:text-xl text-gray-500">👤</div>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-gray-900 text-sm lg:text-base truncate">{student.name}</p>
                                            <p className="text-xs lg:text-sm text-gray-600 truncate">{student.title}</p>
                                        </div>
                                    </div>
                                    <div className="text-right ml-3 flex-shrink-0">
                                        <p className="text-sm font-medium text-gray-900">{student.rating}</p>
                                        <p className={`text-xs ${student.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                            {student.isActive ? 'Active' : 'Inactive'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-8 text-sm lg:text-base">No students found</p>
                        )}
                    </div>

                    <div className="mt-4 lg:mt-6">
                        <Link to="/dashboard/students" className="btn-primary w-full flex items-center justify-center text-sm lg:text-base py-2 lg:py-3">
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Student
                        </Link>
                    </div>
                </div>

                {/* Upcoming Tournaments */}
                <div className="card p-4 lg:p-6">
                    <div className="flex items-center justify-between mb-4 lg:mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Upcoming Tournaments</h2>
                        <Link to="/dashboard/tournaments" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            View all
                        </Link>
                    </div>

                    <div className="space-y-3 lg:space-y-4">
                        {upcomingTournaments.length > 0 ? (
                            upcomingTournaments.map((tournament) => (
                                <div key={tournament._id} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-medium text-gray-900 text-sm lg:text-base truncate flex-1 mr-2">{tournament.name}</h3>
                                        <div className="w-6 h-6 lg:w-8 lg:h-8 rounded bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {tournament.poster && isValidImageUrl(tournament.poster) ? (
                                                <img 
                                                    src={tournament.poster} 
                                                    alt={tournament.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Trophy className="h-3 w-3 lg:h-4 lg:w-4 text-gray-500" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-xs lg:text-sm text-gray-600 space-y-1">
                                        <p className="truncate">{new Date(tournament.date).toLocaleDateString()} at {tournament.time}</p>
                                        <p className="truncate">{tournament.location}</p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 gap-2">
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded w-fit">
                                            {tournament.category}
                                        </span>
                                        <span className="text-xs lg:text-sm text-gray-600">
                                            {tournament.currentParticipants}/{tournament.maxParticipants} registered
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-8 text-sm lg:text-base">No upcoming tournaments</p>
                        )}
                    </div>

                    <div className="mt-4 lg:mt-6">
                        <Link to="/dashboard/tournaments" className="btn-primary w-full flex items-center justify-center text-sm lg:text-base py-2 lg:py-3">
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Tournament
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card p-4 lg:p-6 mx-4 sm:mx-0">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link to="/dashboard/students" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <Users className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600 mb-2" />
                        <h3 className="font-medium text-gray-900 text-sm lg:text-base">Manage Students</h3>
                        <p className="text-xs lg:text-sm text-gray-600 mt-1">Add, edit, or remove student testimonials</p>
                    </Link>

                    <Link to="/dashboard/tournaments" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <Trophy className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600 mb-2" />
                        <h3 className="font-medium text-gray-900 text-sm lg:text-base">Manage Tournaments</h3>
                        <p className="text-xs lg:text-sm text-gray-600 mt-1">Create and manage chess tournaments</p>
                    </Link>

                    <a
                        href="https://aspire-chess-academy.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors sm:col-span-2 lg:col-span-1"
                    >
                        <Eye className="h-6 w-6 lg:h-8 lg:w-8 text-green-600 mb-2" />
                        <h3 className="font-medium text-gray-900 text-sm lg:text-base">View Website</h3>
                        <p className="text-xs lg:text-sm text-gray-600 mt-1">Preview the public website</p>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Dashboard