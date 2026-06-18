import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'

// Layouts
import AdminLayout from '@/components/layout/AdminLayout'

// Public Pages
import LandingPage from '@/pages/LandingPage'
import RegisterPage from '@/pages/RegisterPage'
import CheckStatusPage from '@/pages/CheckStatusPage'

// Admin Pages
import AdminLogin from '@/pages/admin/AdminLogin'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminMembers from '@/pages/admin/AdminMembers'
import AdminMemberDetail from '@/pages/admin/AdminMemberDetail'
import AdminMemberEdit from '@/pages/admin/AdminMemberEdit'
import AdminMemberNew from '@/pages/admin/AdminMemberNew'
import AdminTrainers from '@/pages/admin/AdminTrainers'
import AdminReports from '@/pages/admin/AdminReports'
import AdminSettings from '@/pages/admin/AdminSettings'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/daftar" element={<RegisterPage />} />
        <Route path="/cek-status" element={<CheckStatusPage />} />

        {/* Admin Auth */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Protected */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="members" element={<AdminMembers />} />
          <Route path="members/new" element={<AdminMemberNew />} />
          <Route path="members/:id" element={<AdminMemberDetail />} />
          <Route path="members/:id/edit" element={<AdminMemberEdit />} />
          <Route path="trainers" element={<AdminTrainers />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>

      <Toaster position="top-right" richColors />
    </BrowserRouter>
  )
}

export default App
