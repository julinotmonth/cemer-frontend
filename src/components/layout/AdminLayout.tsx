import React, { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import Sidebar from '@/components/admin/Sidebar'
import { useAuthStore } from '@/store/authStore'
import { Toaster } from 'sonner'

const AdminLayout: React.FC = () => {
  const { isAuthenticated } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main content */}
      <div className="flex-1 lg:ml-64 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-primary heading-display tracking-widest">GYM CEMERLANG</span>
        </div>

        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-4 sm:p-6 lg:p-8 min-h-screen"
        >
          <Outlet />
        </motion.main>
      </div>

      <Toaster position="top-right" richColors />
    </div>
  )
}

export default AdminLayout
