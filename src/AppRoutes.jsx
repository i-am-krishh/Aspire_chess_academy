import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Public pages
import { Home, About, Programs, Students, Tournaments, Contact } from "./pages/public"

// Dashboard pages
import { Dashboard, Login, Students as AdminStudents, Tournaments as AdminTournaments } from "./pages/dashboard"
import ProtectedRoute from './pages/dashboard/components/ProtectedRoute'

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="programs" element={<Programs />} />
                <Route path="students" element={<Students />} />
                <Route path="tournaments" element={<Tournaments />} />
                <Route path="contact" element={<Contact />} />
            </Route>

            {/* Dashboard Login Route */}
            <Route path="/dashboard/login" element={<Login />} />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <DashboardLayout />
                </ProtectedRoute>
            }>
                <Route index element={<Dashboard />} />
                <Route path="students" element={<AdminStudents />} />
                <Route path="tournaments" element={<AdminTournaments />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes 