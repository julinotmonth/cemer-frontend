import React, { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar, Package,
  Clock, Shield, Edit2, RefreshCw, User, Dumbbell, Scale, Users
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useMemberStore } from '@/store/memberStore'
import { formatDate, formatCurrency, calculateBMI } from '@/lib/utils'
import { MemberStatus, MembershipPlan, Member } from '@/types'
import { PLANS } from '@/lib/data'
import { membersApi } from '@/lib/api'

const statusLabel: Record<MemberStatus, string> = { active: 'Aktif', pending: 'Pending', expired: 'Kedaluwarsa' }
const planLabel: Record<MembershipPlan, string> = { basic: 'Basic', regular: 'Regular', premium: 'Premium' }

const AdminMemberDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getMemberById, updateMember, fetchMemberById } = useMemberStore()
  const [member, setMember] = React.useState<Member | null>(getMemberById(id!) || null)

  useEffect(() => {
    if (!member && id) {
      fetchMemberById(id).then(m => { if (m) setMember(m) })
    }
  }, [id])

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <p className="text-2xl font-black text-primary mb-2">Member tidak ditemukan</p>
        <p className="text-muted mb-6">Member dengan ID "{id}" tidak ada dalam sistem.</p>
        <Link to="/admin/members"><Button>Kembali ke Daftar</Button></Link>
      </div>
    )
  }

  const plan = PLANS.find(p => p.id === member.plan)!
  const trainer = member.trainerId ? {
    id: member.trainerId,
    name: (member as any).trainerName,
    specialization: (member as any).trainerSpecialization,
    avatar: (member as any).trainerAvatar,
    experience: (member as any).trainerExperience,
  } : null
  const trainerSchedule = member.trainerSchedule
    ? { id: member.trainerSchedule, day: (member as any).scheduleDay, time: (member as any).scheduleTime }
    : null

  // Calculate BMI if data available
  const age = member.birthDate
    ? Math.floor((Date.now() - new Date(member.birthDate).getTime()) / (365.25 * 24 * 3600 * 1000))
    : 25
  const bmiResult = member.heightCm && member.weightKg
    ? calculateBMI({ heightCm: member.heightCm, weightKg: member.weightKg, gender: member.gender, age })
    : null

  const handleActivate = async () => {
    try {
      await updateMember(member.id, { status: 'active' })
      setMember((prev: any) => prev ? { ...prev, status: 'active' } : prev)
      toast.success('Status member berhasil diubah menjadi Aktif.')
    } catch {
      toast.error('Gagal mengubah status member')
    }
  }

  const handleRenew = () => {
    toast.success('Fitur perpanjang keanggotaan akan segera tersedia.')
  }

  const infoItems = [
    { icon: Mail, label: 'Email', value: member.email },
    { icon: Phone, label: 'No. HP', value: member.phone },
    { icon: Calendar, label: 'Tanggal Lahir', value: formatDate(member.birthDate) },
    { icon: User, label: 'Jenis Kelamin', value: member.gender === 'male' ? 'Laki-laki' : 'Perempuan' },
    { icon: MapPin, label: 'Alamat', value: member.address },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Detail Member</h1>
          <p className="text-muted text-sm mt-0.5">Ref: {member.referenceNumber}</p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-card border border-gray-100 p-6"
        >
          <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-gray-100">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-red-700 flex items-center justify-center text-white text-3xl font-black mb-4 shadow-glow">
              {member.name.charAt(0)}
            </div>
            <h2 className="text-xl font-black text-primary">{member.name}</h2>
            <Badge variant={member.status} className="mt-2">{statusLabel[member.status]}</Badge>
          </div>

          <div className="space-y-4">
            {infoItems.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-muted" />
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wide font-semibold">{label}</p>
                  <p className="text-sm font-semibold text-primary mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
            <Link to={`/admin/members/${member.id}/edit`}>
              <Button className="w-full rounded-xl gap-2" size="sm">
                <Edit2 className="w-4 h-4" /> Edit Data Member
              </Button>
            </Link>
            <Button variant="secondary" className="w-full rounded-xl gap-2" size="sm" onClick={handleRenew}>
              <RefreshCw className="w-4 h-4" /> Perpanjang Keanggotaan
            </Button>
            {member.status === 'pending' && (
              <Button
                variant="outline"
                className="w-full rounded-xl gap-2 border-green-400 text-green-600 hover:bg-green-50 hover:text-green-700"
                size="sm"
                onClick={handleActivate}
              >
                <Shield className="w-4 h-4" /> Aktifkan Member
              </Button>
            )}
          </div>
        </motion.div>

        {/* Right Side */}
        <div className="lg:col-span-2 space-y-5">
          {/* Membership Info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl shadow-card border border-gray-100 p-6"
          >
            <h3 className="font-bold text-primary mb-5 flex items-center gap-2">
              <Package className="w-5 h-5 text-accent" />
              Informasi Keanggotaan
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { label: 'Paket', value: planLabel[member.plan], badge: true, badgeVariant: member.plan },
                { label: 'Durasi', value: `${member.duration} Bulan` },
                { label: 'Total Bayar', value: formatCurrency(plan.price[member.duration]) },
                { label: 'Tanggal Daftar', value: formatDate(member.registeredAt) },
                { label: 'Mulai Aktif', value: formatDate(member.startDate) },
                { label: 'Berakhir', value: formatDate(member.endDate) },
              ].map(({ label, value, badge, badgeVariant }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-1.5">{label}</p>
                  {badge ? (
                    <Badge variant={badgeVariant as MembershipPlan}>{value}</Badge>
                  ) : (
                    <p className="font-bold text-primary">{value}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Trainer Info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="bg-white rounded-2xl shadow-card border border-gray-100 p-6"
          >
            <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Personal Trainer
            </h3>
            {trainer ? (
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                  {trainer.avatar}
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-primary">{trainer.name}</h4>
                  <p className="text-accent text-sm font-semibold">{trainer.specialization}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{trainer.experience} pengalaman</p>
                  {trainerSchedule && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                      <Clock className="w-3.5 h-3.5 text-accent" />
                      <span className="font-semibold">{trainerSchedule.day}</span>
                      <span>·</span>
                      <span>{trainerSchedule.time}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-5 text-gray-400 text-sm bg-gray-50 rounded-xl">
                <Dumbbell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                Belum memilih personal trainer
              </div>
            )}
          </motion.div>

          {/* Body Metrics & BMI */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-card border border-gray-100 p-6"
          >
            <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-accent" />
              Data Tubuh & BMI
            </h3>
            {bmiResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-muted uppercase tracking-wide mb-1">Tinggi</p>
                    <p className="font-black text-primary text-xl">{member.heightCm}</p>
                    <p className="text-xs text-gray-400">cm</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-muted uppercase tracking-wide mb-1">Berat</p>
                    <p className="font-black text-primary text-xl">{member.weightKg}</p>
                    <p className="text-xs text-gray-400">kg</p>
                  </div>
                  <div className={`rounded-xl p-4 text-center ${
                    bmiResult.status === 'normal' ? 'bg-green-50' :
                    bmiResult.status === 'underweight' ? 'bg-blue-50' :
                    bmiResult.status === 'overweight' ? 'bg-yellow-50' : 'bg-red-50'
                  }`}>
                    <p className="text-xs text-muted uppercase tracking-wide mb-1">BMI</p>
                    <p className={`font-black text-xl ${
                      bmiResult.status === 'normal' ? 'text-green-600' :
                      bmiResult.status === 'underweight' ? 'text-blue-600' :
                      bmiResult.status === 'overweight' ? 'text-yellow-600' : 'text-red-600'
                    }`}>{bmiResult.bmi}</p>
                    <p className={`text-xs font-bold ${
                      bmiResult.status === 'normal' ? 'text-green-600' :
                      bmiResult.status === 'underweight' ? 'text-blue-600' :
                      bmiResult.status === 'overweight' ? 'text-yellow-600' : 'text-red-600'
                    }`}>{bmiResult.category}</p>
                  </div>
                </div>
                <div className="p-4 bg-accent/5 rounded-xl border border-accent/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-primary">Berat Ideal</span>
                    <span className="text-sm font-black text-accent">{bmiResult.idealWeightMin}–{bmiResult.idealWeightMax} kg</span>
                  </div>
                  <div className={`text-center py-1.5 px-3 rounded-lg text-sm font-bold mb-2 ${
                    bmiResult.difference > 0 ? 'bg-red-100 text-red-700' :
                    bmiResult.difference < 0 ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {bmiResult.difference === 0 ? '✓ Berat badan sudah ideal!' :
                     bmiResult.difference > 0 ? `Perlu menurunkan ${Math.abs(bmiResult.difference)} kg` :
                     `Perlu menaikkan ${Math.abs(bmiResult.difference)} kg`}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{bmiResult.recommendation}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-5 text-gray-400 text-sm bg-gray-50 rounded-xl">
                <Scale className="w-8 h-8 mx-auto mb-2 opacity-30" />
                Data tinggi dan berat badan belum diisi
              </div>
            )}
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="bg-white rounded-2xl shadow-card border border-gray-100 p-6"
          >
            <h3 className="font-bold text-primary mb-5 flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              Fitur Paket {planLabel[member.plan]}
            </h3>
            <ul className="space-y-2.5">
              {plan.features.map(feat => (
                <li key={feat} className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  {feat}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Activity */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl shadow-card border border-gray-100 p-6"
          >
            <h3 className="font-bold text-primary mb-5 flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" />
              Riwayat Aktivitas
            </h3>
            <div className="space-y-4">
              {[
                { action: 'Pendaftaran berhasil', time: formatDate(member.registeredAt), color: 'bg-green-400' },
                { action: `Paket ${planLabel[member.plan]} diaktifkan`, time: formatDate(member.startDate), color: 'bg-accent' },
                { action: 'Konfirmasi email terkirim', time: formatDate(member.registeredAt), color: 'bg-blue-400' },
                ...(member.trainerId && trainer ? [{ action: `Trainer ${trainer.name} dipilih`, time: formatDate(member.registeredAt), color: 'bg-purple-400' }] : []),
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color} mt-1.5 flex-shrink-0`} />
                  <div>
                    <p className="text-sm font-semibold text-primary">{item.action}</p>
                    <p className="text-xs text-muted mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AdminMemberDetail