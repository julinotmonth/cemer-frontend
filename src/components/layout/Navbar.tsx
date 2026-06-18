import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Dumbbell, Menu, X, Bell, CheckCheck, Search, Lock } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useNotificationStore } from '@/store/notificationStore'
import { formatDate } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Program', href: '#program' },
  { label: 'Fasilitas', href: '#fasilitas' },
  { label: 'Alat Gym', href: '#alat-gym' },
  { label: 'Trainer', href: '#trainer' },
  { label: 'Harga', href: '#harga' },
  { label: 'Kontak', href: '#kontak' },
]

const typeColors: Record<string, string> = {
  info: 'bg-blue-100 text-blue-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  promo: 'bg-red-100 text-red-700',
}
const typeLabel: Record<string, string> = {
  info: 'Info', success: 'Baru', warning: 'Penting', promo: 'Promo',
}

const NotificationPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { notifications, markAsRead, markAllAsRead, fetchNotifications } = useNotificationStore()
  useEffect(() => { fetchNotifications() }, [])
  const unreadCount = notifications.filter(n => !n.read).length
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: -10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className="absolute right-0 top-14 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h3 className="font-black text-primary text-base">Notifikasi</h3>
          {unreadCount > 0 && (
            <p className="text-xs text-muted">{unreadCount} belum dibaca</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-red-700 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Tandai semua
          </button>
        )}
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-10 text-center text-muted text-sm">Tidak ada notifikasi</div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`px-5 py-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50/40' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? 'bg-accent' : 'bg-transparent'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${typeColors[n.type] || 'bg-gray-100 text-gray-600'}`}>
                      {typeLabel[n.type] || n.type}
                    </span>
                    <span className="text-xs text-muted">{formatDate(n.date)}</span>
                  </div>
                  <p className="text-sm font-bold text-primary leading-snug">{n.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed line-clamp-2">{n.message}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {notifications.length > 0 && (
        <div className="px-5 py-3 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">Klik notifikasi untuk menandai sudah dibaca</p>
        </div>
      )}
    </motion.div>
  )
}

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const { notifications } = useNotificationStore()
  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled || !isHome ? 'bg-primary/95 backdrop-blur-md shadow-xl' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="heading-display text-lg tracking-widest text-white hidden sm:block">GYM CEMERLANG</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-0.5">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="px-3 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10 whitespace-nowrap"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(v => !v)}
                className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors text-white"
                title="Notifikasi"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center leading-none">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
              </AnimatePresence>
            </div>

            {/* Cek Status button - desktop */}
            <Link to="/cek-status" className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all whitespace-nowrap">
              <Search className="w-4 h-4" />
              Cek Status
            </Link>

            {/* Admin Login - desktop */}
            <Link to="/admin/login" className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm font-medium transition-all">
              <Lock className="w-3.5 h-3.5" />
              Admin
            </Link>

            {/* Daftar button - desktop */}
            <Link to="/daftar" className="hidden lg:block">
              <Button size="sm" className="rounded-xl px-5">Daftar Sekarang</Button>
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-white hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(v => !v)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/10 pb-4 overflow-hidden"
            >
              <div className="pt-4 space-y-1">
                {NAV_LINKS.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                  >
                    {label}
                  </a>
                ))}
                {/* Mobile extra links */}
                <div className="pt-2 px-4 space-y-2 border-t border-white/10 mt-2">
                  <Link to="/cek-status" onClick={() => setMobileOpen(false)}>
                    <button className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 text-white text-sm font-semibold">
                      <Search className="w-4 h-4" /> Cek Status Keanggotaan
                    </button>
                  </Link>
                  <Link to="/admin/login" onClick={() => setMobileOpen(false)}>
                    <button className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-white/70 text-sm font-medium">
                      <Lock className="w-4 h-4" /> Login Admin
                    </button>
                  </Link>
                  <Link to="/daftar" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full rounded-xl">Daftar Sekarang</Button>
                  </Link>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export default Navbar
