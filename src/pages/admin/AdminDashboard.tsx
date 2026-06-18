import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Users, UserCheck, TrendingUp,
  UserPlus, ArrowRight, Clock
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import StatCard from '@/components/ui/StatCard'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { dashboardApi, membersApi } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import { MemberStatus, MembershipPlan, Member } from '@/types'

const statusLabel: Record<MemberStatus, string> = {
  active: 'Aktif',
  pending: 'Pending',
  expired: 'Kedaluwarsa',
}
const planLabel: Record<MembershipPlan, string> = {
  basic: 'Basic',
  regular: 'Regular',
  premium: 'Premium',
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }
  }),
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null)
  const [chartData, setChartData] = useState<any[]>([])
  const [planDist, setPlanDist] = useState<any[]>([])
  const [recentMembers, setRecentMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, chartRes, planRes, membersRes] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getChartData(),
          dashboardApi.getPlanDistribution(),
          membersApi.list({ limit: 5, page: 1 }),
        ])
        setStats(statsRes.data)
        setChartData(chartRes.data)
        setPlanDist(planRes.data)
        setRecentMembers(membersRes.data)
      } catch (err) {
        console.error('Dashboard load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <motion.div initial="hidden" animate="visible" className="space-y-8">
      {/* Page header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Dashboard</h1>
          <p className="text-muted text-sm mt-1">Selamat datang! Berikut ringkasan data keanggotaan.</p>
        </div>
        <Link to="/admin/members/new">
          <Button size="sm" className="rounded-xl gap-2">
            <UserPlus className="w-4 h-4" />
            Tambah Member
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          {
            title: 'Total Member',
            value: stats?.totalMembers?.toLocaleString('id-ID') ?? '-',
            icon: <Users className="w-6 h-6" />,
            color: 'blue' as const,
            trend: { value: 12, label: 'vs bulan lalu' },
          },
          {
            title: 'Daftar Bulan Ini',
            value: stats?.thisMonthRegistrations ?? '-',
            icon: <TrendingUp className="w-6 h-6" />,
            color: 'red' as const,
            trend: { value: 18, label: 'vs bulan lalu' },
          },
          {
            title: 'Member Aktif',
            value: stats?.activeMembers?.toLocaleString('id-ID') ?? '-',
            icon: <UserCheck className="w-6 h-6" />,
            color: 'green' as const,
            trend: { value: 5, label: 'vs bulan lalu' },
          },
        ].map((stat, i) => (
          <motion.div key={stat.title} variants={fadeUp} custom={i}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div variants={fadeUp} custom={4} className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-primary">Tren Pendaftaran</h3>
              <p className="text-xs text-muted mt-0.5">6 bulan terakhir</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}
                formatter={(val) => [`${val} member`, 'Pendaftaran']}
              />
              <Line
                type="monotone"
                dataKey="registrations"
                stroke="#E94560"
                strokeWidth={3}
                dot={{ fill: '#E94560', r: 5, strokeWidth: 0 }}
                activeDot={{ r: 7, fill: '#E94560', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={fadeUp} custom={5} className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
          <div className="mb-4">
            <h3 className="font-bold text-primary">Distribusi Paket</h3>
            <p className="text-xs text-muted mt-0.5">Komposisi keanggotaan</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={planDist}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {planDist.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => [`${val}%`, 'Porsi']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {planDist.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                  <span className="text-sm text-muted">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-primary">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent members */}
      <motion.div variants={fadeUp} custom={6} className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-primary">Member Terbaru</h3>
            <p className="text-xs text-muted mt-0.5">Pendaftaran terkini</p>
          </div>
          <Link to="/admin/members">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted hover:text-accent rounded-xl">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {['Nama', 'Email', 'Paket', 'Daftar', 'Status'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-bold text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xs">
                        {member.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-primary text-sm">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted">{member.email}</td>
                  <td className="px-6 py-4">
                    <Badge variant={member.plan}>{planLabel[member.plan]}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(member.registeredAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={member.status}>{statusLabel[member.status]}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AdminDashboard