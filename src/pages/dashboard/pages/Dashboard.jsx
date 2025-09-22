import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../../utils/api'
import { Users, Trophy, Calendar, TrendingUp, Plus, Eye } from 'lucide-react'
import { isValidImageUrl } from '../../../utils/imageUtils'

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        activeStudents: 0,
        totalTournaments: 0,
        upcomingTournaments: 0
    })
    const [recentStudents, setRecentStudents] = useState([])
    const [upcomingTournaments, setUpcomingTournaments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            const [studentsRes, tournamentsRes, recentStudentsRes, upcomingTournamentsRes] = await Promise.all([
                api.get('/api/students/admin?limit=1000'),
                api.get('/api/tournaments/admin?limit=1000'),
                api.get('/api/students/admin?limit=5'),
                api.get('/api/tournaments?limit=5')
            ])

            const students = studentsRes.data.data
            const tournaments = tournamentsRes.data.data

            setStats({
                totalStudents: students.length,
                activeStudents: students.filter(s => s.isActive).length,
                totalTournaments: tournaments.length,
                upcomingTournaments: tournaments.filter(t => t.status === 'upcoming').length
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
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome to Aspire Chess Academy Admin Panel</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Students</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Active Students</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.activeStudents}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Trophy className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Tournaments</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalTournaments}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Calendar className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.upcomingTournaments}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Students */}
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Students</h2>
                        <Link to="/dashboard/students" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            View all
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {recentStudents.length > 0 ? (
                            recentStudents.map((student) => (
                                <div key={student._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3 overflow-hidden">
                                            {student.image && isValidImageUrl(student.image) ? (
                                                <img 
                                                    src={student.image} 
                                                    alt={student.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-xl text-gray-500">👤</div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{student.name}</p>
                                            <p className="text-sm text-gray-600">{student.title}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">{student.rating}</p>
                                        <p className={`text-xs ${student.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                            {student.isActive ? 'Active' : 'Inactive'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No students found</p>
                        )}
                    </div>

                    <div className="mt-6">
                        <Link to="/dashboard/students" className="btn-primary w-full flex items-center justify-center">
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Student
                        </Link>
                    </div>
                </div>

                {/* Upcoming Tournaments */}
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Upcoming Tournaments</h2>
                        <Link to="/dashboard/tournaments" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            View all
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {upcomingTournaments.length > 0 ? (
                            upcomingTournaments.map((tournament) => (
                                <div key={tournament._id} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-medium text-gray-900">{tournament.name}</h3>
                                        <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center overflow-hidden">
                                            {tournament.poster && isValidImageUrl(tournament.poster) ? (
                                                <img 
                                                    src={tournament.poster} 
                                                    alt={tournament.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Trophy className="h-4 w-4 text-gray-500" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <p>{new Date(tournament.date).toLocaleDateString()} at {tournament.time}</p>
                                        <p>{tournament.location}</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                            {tournament.category}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            {tournament.currentParticipants}/{tournament.maxParticipants} registered
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No upcoming tournaments</p>
                        )}
                    </div>

                    <div className="mt-6">
                        <Link to="/dashboard/tournaments" className="btn-primary w-full flex items-center justify-center">
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Tournament
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to="/dashboard/students" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <Users className="h-8 w-8 text-blue-600 mb-2" />
                        <h3 className="font-medium text-gray-900">Manage Students</h3>
                        <p className="text-sm text-gray-600">Add, edit, or remove student testimonials</p>
                    </Link>

                    <Link to="/dashboard/tournaments" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <Trophy className="h-8 w-8 text-purple-600 mb-2" />
                        <h3 className="font-medium text-gray-900">Manage Tournaments</h3>
                        <p className="text-sm text-gray-600">Create and manage chess tournaments</p>
                    </Link>

                    <a
                        href="https://aspire-chess-academy.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Eye className="h-8 w-8 text-green-600 mb-2" />
                        <h3 className="font-medium text-gray-900">View Website</h3>
                        <p className="text-sm text-gray-600">Preview the public website</p>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Dashboard