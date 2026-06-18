import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dumbbell, Search, ArrowLeft, CheckCircle2, Clock,
  XCircle, User, Mail, Phone, Package, Calendar,
  MapPin, Users, Scale, AlertCircle
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { membersApi } from '@/lib/api'
import { formatDate, formatCurrency, calculateBMI } from '@/lib/utils'
import { MemberStatus, MembershipPlan } from '@/types'
import { PLANS, TRAINERS } from '@/lib/data'

const planLabel: Record<MembershipPlan, string> = { basic: 'Basic', regular: 'Regular', premium: 'Premium' }
const statusLabel: Record<MemberStatus, string> = { active: 'Aktif', pending: 'Menunggu Konfirmasi', expired: 'Kedaluwarsa' }
const statusIcon = { active: CheckCircle2, pending: Clock, expired: XCircle }
const statusColor = {
  active: 'text-green-600',
  pending: 'text-yellow-600',
  expired: 'text-red-500',
}
const statusBg = {
  active: 'bg-green-50 border-green-200',
  pending: 'bg-yellow-50 border-yellow-200',
  expired: 'bg-red-50 border-red-200',
}

const CheckStatusPage: React.FC = () => {
  const [found, setFound] = React.useState<any[]>([])
  const [query, setQuery] = useState('')
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  const trimmedQuery = query.trim().toLowerCase()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trimmedQuery) return
    setLoading(true)
    try {
      const res = await membersApi.checkStatus(query.trim())
      setFound(res.data)
    } catch {
      setFound([])
    }
    setLoading(false)
    setSearched(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary py-6 shadow-xl">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="heading-display text-lg tracking-widest text-white">GYM CEMERLANG</span>
          </Link>
          <Link to="/" className="text-white/60 hover:text-white text-sm flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Beranda
          </Link>
        </div>
      </div>

      {/* Hero search */}
      <div className="bg-gradient-to-b from-primary to-secondary pt-10 pb-16 px-4">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
              Cek Status Keanggotaan
            </h1>
            <p className="text-white/60 mb-8 leading-relaxed">
              Masukkan nomor referensi, email, atau nomor HP yang digunakan saat mendaftar.
            </p>

            <form onSubmit={handleSearch} className="flex gap-3">
              <input
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setSearched(false) }}
                placeholder="Contoh: GYM-ABC123-XY1Z atau email@contoh.com"
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/40 text-sm focus:outline-none focus:border-accent focus:bg-white/15 transition-all"
              />
              <Button type="submit" loading={loading} className="rounded-xl px-6 gap-2 flex-shrink-0">
                <Search className="w-4 h-4" />
                Cari
              </Button>
            </form>

            <p className="text-white/40 text-xs mt-3">
              Contoh nomor referensi: <span className="text-accent font-mono">GYM-ABC123-XY1Z</span>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <AnimatePresence mode="wait">
          {!searched && !loading && (
            <motion.div
              key="hints"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid sm:grid-cols-3 gap-4"
            >
              {[
                { icon: '🔖', title: 'Nomor Referensi', desc: 'Tersedia di email konfirmasi pendaftaran Anda. Format: GYM-XXXXXX-XXXX' },
                { icon: '📧', title: 'Email', desc: 'Gunakan alamat email yang didaftarkan saat mengisi formulir pendaftaran.' },
                { icon: '📱', title: 'Nomor HP', desc: 'Nomor telepon aktif yang diisi pada saat proses pendaftaran berlangsung.' },
              ].map(h => (
                <div key={h.title} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
                  <div className="text-3xl mb-3">{h.icon}</div>
                  <h3 className="font-black text-primary text-sm mb-1">{h.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{h.desc}</p>
                </div>
              ))}
            </motion.div>
          )}

          {searched && found.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-xl font-black text-primary mb-2">Data Tidak Ditemukan</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed mb-6">
                Tidak ada member yang cocok dengan "<strong>{query}</strong>". Pastikan data yang dimasukkan sudah benar.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => { setQuery(''); setSearched(false) }}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cari Ulang
                </button>
                <Link to="/daftar">
                  <Button size="sm" className="rounded-xl">Daftar Sekarang</Button>
                </Link>
              </div>
            </motion.div>
          )}

          {searched && found.length > 0 && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <p className="text-gray-500 text-sm font-medium">
                Ditemukan <strong className="text-primary">{found.length}</strong> hasil untuk "<strong>{query}</strong>"
              </p>

              {found.map((member, i) => {
                const plan = PLANS.find(p => p.id === member.plan)!
                const trainer = member.trainerId ? TRAINERS.find(t => t.id === member.trainerId) : null
                const trainerSchedule = trainer?.availableSchedules.find(s => s.id === member.trainerSchedule)
                const StatusIcon = statusIcon[member.status]
                const age = member.birthDate
                  ? Math.floor((Date.now() - new Date(member.birthDate).getTime()) / (365.25 * 24 * 3600 * 1000))
                  : 25
                const bmiResult = member.heightCm && member.weightKg
                  ? calculateBMI({ heightCm: member.heightCm, weightKg: member.weightKg, gender: member.gender, age })
                  : null

                // Days remaining
                const endDate = new Date(member.endDate)
                const today = new Date()
                const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden"
                  >
                    {/* Status banner */}
                    <div className={`px-6 py-4 border-b flex items-center justify-between ${statusBg[member.status]}`}>
                      <div className="flex items-center gap-3">
                        <StatusIcon className={`w-6 h-6 ${statusColor[member.status]}`} />
                        <div>
                          <p className="font-black text-primary">{statusLabel[member.status]}</p>
                          <p className="text-xs text-gray-500">
                            {member.status === 'active' && daysRemaining > 0
                              ? `${daysRemaining} hari lagi`
                              : member.status === 'pending'
                              ? 'Menunggu verifikasi admin'
                              : 'Keanggotaan telah berakhir'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 mb-0.5">No. Referensi</p>
                        <p className="font-mono font-black text-primary text-sm">{member.referenceNumber}</p>
                      </div>
                    </div>

                    <div className="p-6 space-y-5">
                      {/* Member info */}
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-red-700 flex items-center justify-center text-white text-2xl font-black flex-shrink-0">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-primary">{member.name}</h3>
                          <Badge variant={member.plan} className="mt-1">Paket {planLabel[member.plan]}</Badge>
                        </div>
                      </div>

                      {/* Grid info */}
                      <div className="grid sm:grid-cols-2 gap-3">
                        {[
                          { icon: Mail, label: 'Email', value: member.email },
                          { icon: Phone, label: 'No. HP', value: member.phone },
                          { icon: Calendar, label: 'Mulai Aktif', value: formatDate(member.startDate) },
                          { icon: Calendar, label: 'Berakhir', value: formatDate(member.endDate) },
                          { icon: Package, label: 'Durasi', value: `${member.duration} Bulan` },
                          { icon: MapPin, label: 'Total Pembayaran', value: formatCurrency(plan.price[member.duration]) },
                        ].map(({ icon: Icon, label, value }) => (
                          <div key={label} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                            <Icon className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-gray-400 font-medium">{label}</p>
                              <p className="text-sm font-bold text-primary">{value}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Trainer info */}
                      {trainer && (
                        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                          <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" /> Personal Trainer
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                              {trainer.avatar}
                            </div>
                            <div>
                              <p className="font-black text-primary">{trainer.name}</p>
                              <p className="text-xs text-accent font-semibold">{trainer.specialization}</p>
                              {trainerSchedule && (
                                <p className="text-xs text-gray-500 mt-0.5">
                                  📅 {trainerSchedule.day} · {trainerSchedule.time}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* BMI info */}
                      {bmiResult && (
                        <div className={`rounded-xl border p-4 ${
                          bmiResult.status === 'normal' ? 'bg-green-50 border-green-100' :
                          bmiResult.status === 'underweight' ? 'bg-blue-50 border-blue-100' :
                          bmiResult.status === 'overweight' ? 'bg-yellow-50 border-yellow-100' :
                          'bg-red-50 border-red-100'
                        }`}>
                          <p className="text-xs font-bold uppercase tracking-wide mb-3 flex items-center gap-1.5 text-gray-600">
                            <Scale className="w-3.5 h-3.5" /> Data Tubuh & BMI
                          </p>
                          <div className="grid grid-cols-3 gap-3 text-center">
                            <div>
                              <p className="text-xs text-gray-400">Tinggi</p>
                              <p className="font-black text-primary">{member.heightCm} <span className="text-xs font-normal">cm</span></p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Berat</p>
                              <p className="font-black text-primary">{member.weightKg} <span className="text-xs font-normal">kg</span></p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">BMI</p>
                              <p className={`font-black ${
                                bmiResult.status === 'normal' ? 'text-green-600' :
                                bmiResult.status === 'underweight' ? 'text-blue-600' :
                                bmiResult.status === 'overweight' ? 'text-yellow-600' : 'text-red-600'
                              }`}>{bmiResult.bmi}</p>
                            </div>
                          </div>
                          <div className={`mt-3 text-center text-xs font-bold px-3 py-1.5 rounded-lg ${
                            bmiResult.difference > 0 ? 'bg-red-100 text-red-700' :
                            bmiResult.difference < 0 ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {bmiResult.difference === 0 ? '✓ Berat sudah ideal!' :
                             bmiResult.difference > 0 ? `Perlu turunkan ${Math.abs(bmiResult.difference)} kg` :
                             `Perlu naikkan ${Math.abs(bmiResult.difference)} kg`}
                          </div>
                        </div>
                      )}

                      {/* Features included */}
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Fitur Paket {planLabel[member.plan]}</p>
                        <ul className="space-y-1.5">
                          {plan.features.map(feat => (
                            <li key={feat} className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                              {feat}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Footer CTA */}
                    <div className="px-6 pb-6">
                      {member.status === 'expired' && (
                        <Link to="/daftar">
                          <Button className="w-full rounded-xl gap-2">
                            🔄 Perpanjang Keanggotaan
                          </Button>
                        </Link>
                      )}
                      {member.status === 'pending' && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                          <p className="text-yellow-700 text-sm font-semibold">⏳ Pendaftaran sedang diproses</p>
                          <p className="text-yellow-600 text-xs mt-1">Tim admin akan mengkonfirmasi dalam 1×24 jam. Cek email Anda.</p>
                        </div>
                      )}
                      {member.status === 'active' && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                          <p className="text-green-700 text-sm font-semibold">✅ Keanggotaan aktif — selamat berlatih!</p>
                          <p className="text-green-600 text-xs mt-1">Keanggotaan berakhir {formatDate(member.endDate)} ({daysRemaining} hari lagi)</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default CheckStatusPage
