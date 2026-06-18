import React, { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Dumbbell, Eye, EyeOff, Lock, Mail, ArrowLeft, Shield } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'

const schema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  remember: z.boolean().optional(),
})
type FormData = z.infer<typeof schema>

const AdminLogin: React.FC = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  if (isAuthenticated) return <Navigate to="/admin" replace />

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const success = await login(data.email, data.password)
    setLoading(false)
    if (success) {
      toast.success('Login berhasil! Selamat datang kembali.')
      navigate('/admin')
    } else {
      toast.error('Email atau password salah. Coba gunakan kredensial demo di bawah.')
    }
  }

  const fillDemo = () => {
    setValue('email', 'admin@gymcemerlang.com')
    setValue('password', 'admin123')
  }

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-surface/30 rounded-full blur-2xl" />
      <div className="absolute inset-0 bg-noise opacity-20" />

      {/* Back link */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Beranda
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card */}
        <div className="glass-card rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow"
            >
              <Dumbbell className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="heading-display text-2xl text-white tracking-widest mb-1">GYM CEMERLANG</h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 mt-1">
              <Shield className="w-3.5 h-3.5 text-accent" />
              <span className="text-white/70 text-xs font-medium">Admin Panel</span>
            </div>
            <p className="text-white/40 text-sm mt-2">Masuk untuk mengelola data member</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-white/70 text-sm font-semibold mb-1.5">
                Email <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="admin@gymcemerlang.com"
                  autoComplete="email"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-200 ${
                    errors.email ? 'border-red-400 bg-red-500/10' : 'border-white/20'
                  }`}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <span>⚠</span> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-white/70 text-sm font-semibold mb-1.5">
                Password <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full pl-10 pr-12 py-3 rounded-xl bg-white/10 border text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-200 ${
                    errors.password ? 'border-red-400 bg-red-500/10' : 'border-white/20'
                  }`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <span>⚠</span> {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 accent-accent"
                {...register('remember')}
              />
              <label htmlFor="remember" className="text-white/60 text-sm cursor-pointer">
                Ingat saya selama 30 hari
              </label>
            </div>

            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="w-full rounded-xl mt-2"
            >
              Masuk ke Dashboard
            </Button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-5 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-white/50 text-xs text-center mb-3 font-medium uppercase tracking-wide">
              🔑 Kredensial Demo
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="bg-white/5 rounded-lg px-3 py-2">
                <p className="text-white/40 mb-0.5">Email</p>
                <p className="text-accent font-mono font-semibold">admin@gymcemerlang.com</p>
              </div>
              <div className="bg-white/5 rounded-lg px-3 py-2">
                <p className="text-white/40 mb-0.5">Password</p>
                <p className="text-accent font-mono font-semibold">admin123</p>
              </div>
            </div>
            <button
              type="button"
              onClick={fillDemo}
              className="w-full py-2 rounded-lg bg-accent/20 hover:bg-accent/30 text-accent text-xs font-bold transition-colors border border-accent/30"
            >
              ✨ Isi Otomatis Kredensial Demo
            </button>
          </div>

          {/* Bottom links */}
          <div className="mt-5 flex items-center justify-center gap-4 text-xs">
            <Link to="/cek-status" className="text-white/40 hover:text-white/70 transition-colors flex items-center gap-1">
              🔍 Cek Status Member
            </Link>
            <span className="text-white/20">|</span>
            <Link to="/daftar" className="text-white/40 hover:text-white/70 transition-colors">
              📝 Daftar Member Baru
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin
