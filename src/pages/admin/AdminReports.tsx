import React, { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { TrendingUp, Users, Package, Printer, AlertTriangle, CheckCircle, AlertCircle, Wrench, Calendar, Plus, Trash2, X, Edit2 } from 'lucide-react'
import { toast } from 'sonner'
import StatCard from '@/components/ui/StatCard'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { dashboardApi, reportsApi, equipmentApi } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'

const STATUS_CONFIG = {
  'kritis': { label: 'Kritis', color: '#EF4444', bg: '#FEE2E2', icon: AlertTriangle },
  'perlu-perhatian': { label: 'Perlu Perhatian', color: '#F59E0B', bg: '#FEF3C7', icon: AlertCircle },
  'baik': { label: 'Baik', color: '#10B981', bg: '#D1FAE5', icon: CheckCircle },
}

const AdminReports: React.FC = () => {
  const [stats, setStats] = useState<any>({ totalMembers: 0, thisMonthRegistrations: 0, activeMembers: 0, monthlyRevenue: 0 })
  const [chartData, setChartData] = useState<any[]>([])
  const [planDist, setPlanDist] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Equipment maintenance state
  const [equipmentList, setEquipmentList] = useState<any[]>([])
  const [equipmentSummary, setEquipmentSummary] = useState({ kritis: 0, perluPerhatian: 0, baik: 0 })
  const [showEquipmentModal, setShowEquipmentModal] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState<any | null>(null)
  const [equipmentForm, setEquipmentForm] = useState({ name: '', category: '', icon: '🏋️', tipsText: '' })
  const [issueModalFor, setIssueModalFor] = useState<{ id: string; name: string } | null>(null)
  const [newIssueDesc, setNewIssueDesc] = useState('')

  const loadEquipment = async () => {
    try {
      const res = await equipmentApi.getReport()
      setEquipmentList(res.data)
      setEquipmentSummary({
        kritis: res.summary.kritis,
        perluPerhatian: res.summary.perluPerhatian,
        baik: res.summary.baik,
      })
    } catch (err) {
      console.error('Equipment load error:', err)
    }
  }

  const openAddEquipment = () => {
    setEditingEquipment(null)
    setEquipmentForm({ name: '', category: '', icon: '🏋️', tipsText: '' })
    setShowEquipmentModal(true)
  }

  const openEditEquipment = (eq: any) => {
    setEditingEquipment(eq)
    setEquipmentForm({
      name: eq.name,
      category: eq.category,
      icon: eq.icon,
      tipsText: (eq.maintenanceTips || []).join('\n'),
    })
    setShowEquipmentModal(true)
  }

  const handleSaveEquipment = async () => {
    if (!equipmentForm.name || !equipmentForm.category) {
      toast.error('Nama dan kategori alat wajib diisi')
      return
    }
    const maintenanceTips = equipmentForm.tipsText
      .split('\n')
      .map(t => t.trim())
      .filter(Boolean)

    const payload = {
      name: equipmentForm.name,
      category: equipmentForm.category,
      icon: equipmentForm.icon || '🏋️',
      maintenanceTips,
    }

    try {
      if (editingEquipment) {
        await equipmentApi.update(editingEquipment.id, payload)
        toast.success(`Alat "${payload.name}" berhasil diperbarui`)
      } else {
        await equipmentApi.create(payload)
        toast.success(`Alat "${payload.name}" berhasil ditambahkan`)
      }
      setShowEquipmentModal(false)
      loadEquipment()
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan data alat')
    }
  }

  const handleDeleteEquipment = async (id: string, name: string) => {
    if (!confirm(`Hapus alat "${name}" beserta seluruh riwayat kerusakannya?`)) return
    try {
      await equipmentApi.delete(id)
      toast.success(`Alat "${name}" berhasil dihapus`)
      loadEquipment()
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus alat')
    }
  }

  const handleAddIssue = async () => {
    if (!issueModalFor || !newIssueDesc.trim()) {
      toast.error('Deskripsi kerusakan wajib diisi')
      return
    }
    try {
      await equipmentApi.addIssue(issueModalFor.id, newIssueDesc.trim())
      toast.success('Catatan kerusakan berhasil ditambahkan')
      setIssueModalFor(null)
      setNewIssueDesc('')
      loadEquipment()
    } catch (err: any) {
      toast.error(err.message || 'Gagal menambahkan catatan kerusakan')
    }
  }

  const handleLogMaintenance = async (id: string, name: string) => {
    if (!confirm(`Catat maintenance hari ini untuk "${name}"?`)) return
    try {
      await equipmentApi.logMaintenance(id)
      toast.success('Tanggal maintenance berhasil diperbarui')
      loadEquipment()
    } catch (err: any) {
      toast.error(err.message || 'Gagal mencatat maintenance')
    }
  }

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, chartRes, planRes] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getChartData(),
          dashboardApi.getPlanDistribution(),
        ])
        setStats(statsRes.data)
        setChartData(chartRes.data)
        setPlanDist(planRes.data)
        await loadEquipment()
      } catch (err) {
        console.error('Reports load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])


  const handlePrint = () => {
    const now = new Date()
    const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

    const equipmentRows = equipmentList.map((eq: any) => {
      const statusClass = eq.status === 'kritis' ? 'kritis' : eq.status === 'perlu-perhatian' ? 'perhatian' : 'baik'
      const statusLabel = (STATUS_CONFIG as any)[eq.status].label
      const monthlyData = eq.issues.map((m: any) =>
        `<div class="month-cell"><div class="month-label">${m.month}</div><div class="month-count" style="color:${m.count >= 3 ? '#EF4444' : m.count >= 2 ? '#F59E0B' : m.count === 0 ? '#9CA3AF' : '#10B981'}">${m.count === 0 ? '—' : m.count + 'x'}</div></div>`
      ).join('')
      return `
        <tr>
          <td>${eq.icon} <strong>${eq.name}</strong><br><span style="color:#6B7280;font-size:10px">${eq.category}</span></td>
          <td style="text-align:center;font-weight:900;font-size:18px;color:#E94560">${eq.totalIssues}x</td>
          <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
          <td><div class="monthly-grid">${monthlyData}</div></td>
          <td style="font-size:11px;color:#6B7280">${eq.lastMaintenance}</td>
        </tr>
        <tr class="tips-row">
          <td colspan="5" style="padding:8px 12px 14px;background:#F8FAFC">
            <div style="font-size:11px;font-weight:600;color:#374151;margin-bottom:4px">💡 Tips Perawatan:</div>
            <ul style="margin:0;padding-left:16px">${eq.maintenanceTips.map((t: string) => `<li style="font-size:11px;color:#6B7280;margin-bottom:2px">${t}</li>`).join('')}</ul>
          </td>
        </tr>
      `
    }).join('')

    const revenueRows = chartData.map(d =>
      `<tr><td>${d.month}</td><td style="text-align:center">${d.registrations} orang</td><td>${formatCurrency(d.revenue)}</td></tr>`
    ).join('')

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan Gym Cemerlang</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 24px; color: #111; background: white; font-size: 13px; }
          .print-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #E94560; padding-bottom: 16px; margin-bottom: 24px; }
          .print-header h1 { font-size: 22px; font-weight: 900; color: #0F3460; margin: 0 0 4px; }
          .print-header p { font-size: 11px; color: #6B7280; margin: 0; }
          .gym-badge { background: #E94560; color: white; padding: 8px 16px; border-radius: 8px; font-weight: 800; font-size: 14px; }
          .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
          .stat-box { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 10px; padding: 14px; }
          .stat-label { font-size: 10px; color: #6B7280; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
          .stat-value { font-size: 20px; font-weight: 900; color: #0F3460; margin-top: 4px; }
          .stat-trend { font-size: 11px; color: #10B981; margin-top: 2px; }
          .section-title { font-size: 15px; font-weight: 800; color: #0F3460; margin: 22px 0 12px; border-left: 4px solid #E94560; padding-left: 10px; }
          table.equipment { width: 100%; border-collapse: collapse; font-size: 12px; }
          table.equipment th { background: #0F3460; color: white; padding: 10px 12px; text-align: left; font-weight: 700; font-size: 11px; }
          table.equipment td { padding: 10px 12px; border-bottom: 1px solid #F3F4F6; vertical-align: middle; }
          table.equipment tr:hover td { background: #F9FAFB; }
          .status-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-weight: 700; font-size: 10px; }
          .kritis { background: #FEE2E2; color: #EF4444; }
          .perhatian { background: #FEF3C7; color: #D97706; }
          .baik { background: #D1FAE5; color: #10B981; }
          .monthly-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 4px; text-align: center; }
          .month-cell { font-size: 10px; }
          .month-label { color: #6B7280; margin-bottom: 2px; font-size: 9px; }
          .month-count { font-weight: 800; }
          table.revenue { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px; }
          table.revenue th { background: #F3F4F6; padding: 9px 12px; text-align: left; font-weight: 700; color: #374151; border-bottom: 2px solid #E5E7EB; }
          table.revenue td { padding: 9px 12px; border-bottom: 1px solid #F3F4F6; }
          .plan-dist { display: flex; gap: 16px; margin-bottom: 20px; }
          .plan-item { flex: 1; padding: 14px 16px; border-radius: 10px; }
          .plan-name { font-size: 12px; font-weight: 700; }
          .plan-pct { font-size: 26px; font-weight: 900; margin-top: 2px; }
          .tips-row td { border-bottom: 2px solid #E5E7EB !important; }
          .print-footer { margin-top: 32px; border-top: 1px solid #E5E7EB; padding-top: 12px; display: flex; justify-content: space-between; font-size: 10px; color: #9CA3AF; }
          @media print { body { padding: 10px; } @page { margin: 1cm; } }
        </style>
      </head>
      <body>
        <div class="print-header">
          <div>
            <h1>🏋️ Laporan Operasional Gym Cemerlang</h1>
            <p>Dicetak pada: ${dateStr} pukul ${timeStr}</p>
          </div>
          <div class="gym-badge">GYM CEMERLANG</div>
        </div>

        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-label">Total Member</div>
            <div class="stat-value">${stats.totalMembers.toLocaleString()}</div>
            <div class="stat-trend">↑ 12% vs bulan lalu</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Pendaftaran Bulan Ini</div>
            <div class="stat-value">${stats.thisMonthRegistrations}</div>
            <div class="stat-trend">↑ 18% vs bulan lalu</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Member Aktif</div>
            <div class="stat-value">${stats.activeMembers.toLocaleString()}</div>
            <div class="stat-trend">↑ 5% vs bulan lalu</div>
          </div>

        </div>

        <div class="section-title">📊 Data Pendapatan & Pendaftaran (6 Bulan Terakhir)</div>
        <table class="revenue">
          <thead><tr><th>Bulan</th><th>Pendaftaran</th><th>Pendapatan</th></tr></thead>
          <tbody>${revenueRows}</tbody>
        </table>

        <div class="section-title">📦 Distribusi Paket Keanggotaan</div>
        <div class="plan-dist">
          ${planDist.map(p => `
            <div class="plan-item" style="background:${p.color}18;border:1px solid ${p.color}40">
              <div class="plan-name" style="color:${p.color}">${p.name}</div>
              <div class="plan-pct" style="color:${p.color}">${p.value}%</div>
            </div>
          `).join('')}
        </div>

        <div class="section-title">🔧 Rekap Kerusakan Alat per Bulan</div>
        <table class="equipment">
          <thead>
            <tr>
              <th>Nama Alat</th>
              <th style="text-align:center;width:100px">Total Kerusakan</th>
              <th style="width:130px">Status</th>
              <th>Kerusakan per Bulan (Sep–Feb)</th>
              <th style="width:130px">Maintenance Terakhir</th>
            </tr>
          </thead>
          <tbody>${equipmentRows}</tbody>
        </table>

        <div class="print-footer">
          <span>Gym Cemerlang — Sistem Manajemen Gym</span>
          <span>Dokumen ini bersifat rahasia dan hanya untuk penggunaan internal</span>
          <span>Dicetak: ${dateStr}</span>
        </div>

        <script>window.onload = function(){ window.print(); }</script>
      </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Laporan</h1>
          <p className="text-muted text-sm mt-1">Analitik, laporan keanggotaan, dan status alat gym.</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-md hover:shadow-lg active:scale-95 shrink-0"
        >
          <Printer className="w-4 h-4" />
          Cetak Laporan
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          { title: 'Total Member', value: stats.totalMembers.toLocaleString(), icon: <Users className="w-6 h-6" />, color: 'blue' as const, trend: { value: 12, label: 'vs bulan lalu' } },
          { title: 'Pendaftaran Bulan Ini', value: stats.thisMonthRegistrations, icon: <TrendingUp className="w-6 h-6" />, color: 'red' as const, trend: { value: 18, label: 'vs bulan lalu' } },
          { title: 'Member Aktif', value: stats.activeMembers.toLocaleString(), icon: <Package className="w-6 h-6" />, color: 'green' as const, trend: { value: 5, label: 'vs bulan lalu' } },

        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Plan Distribution */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
        <h3 className="font-bold text-primary mb-1">Distribusi Paket Keanggotaan</h3>
        <p className="text-xs text-muted mb-6">Persentase member per paket</p>
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <ResponsiveContainer width="100%" height={220} className="flex-1 max-w-xs mx-auto">
            <PieChart>
              <Pie data={planDist} cx="50%" cy="50%" outerRadius={100} paddingAngle={4} dataKey="value">
                {planDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={val => [`${val}%`, 'Porsi']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-4">
            {planDist.map(item => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                    <span className="text-sm font-semibold text-primary">{item.name}</span>
                  </div>
                  <span className="text-sm font-black text-primary">{item.value}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${item.value}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ===== Equipment Issues Section ===== */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-primary">Rekap Kerusakan Alat</h2>
              <p className="text-xs text-muted">Monitoring alat yang sering mengalami kerusakan per bulan — untuk membantu jadwal maintenance</p>
            </div>
          </div>
          <Button size="sm" className="rounded-xl gap-1.5 shrink-0" onClick={openAddEquipment}>
            <Plus className="w-4 h-4" /> Tambah Alat
          </Button>
        </div>

        {/* Status summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {(['kritis', 'perlu-perhatian', 'baik'] as const).map(status => {
            const cfg = STATUS_CONFIG[status]
            const StatusIcon = cfg.icon
            const count = status === 'kritis' ? equipmentSummary.kritis : status === 'perlu-perhatian' ? equipmentSummary.perluPerhatian : equipmentSummary.baik
            return (
              <div key={status} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-card flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: cfg.bg }}>
                  <StatusIcon className="w-5 h-5" style={{ color: cfg.color }} />
                </div>
                <div>
                  <div className="text-2xl font-black" style={{ color: cfg.color }}>{count}</div>
                  <div className="text-xs text-muted font-medium">{cfg.label}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Equipment cards */}
        {equipmentList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center text-muted">
            Belum ada data alat. Klik "Tambah Alat" untuk mulai memonitor kerusakan.
          </div>
        ) : (
        <div className="space-y-4">
          {equipmentList.map((eq, idx) => {
            const cfg = STATUS_CONFIG[eq.status as keyof typeof STATUS_CONFIG]
            const EqStatusIcon = cfg.icon
            return (
              <motion.div
                key={eq.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + idx * 0.07 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-5 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{eq.icon}</span>
                    <div>
                      <div className="font-bold text-primary text-base">{eq.name}</div>
                      <div className="text-xs text-muted">{eq.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-black text-red-500">{eq.totalIssues}x</div>
                      <div className="text-xs text-muted">Total kerusakan (6 bln)</div>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: cfg.bg, color: cfg.color }}>
                      <EqStatusIcon className="w-3.5 h-3.5" />
                      {cfg.label}
                    </div>
                    <button
                      onClick={() => openEditEquipment(eq)}
                      className="p-2 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-colors"
                      title="Edit alat & tips perawatan"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEquipment(eq.id, eq.name)}
                      className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      title="Hapus alat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Monthly breakdown */}
                <div className="px-5 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-semibold text-muted uppercase tracking-wide">Kerusakan per Bulan</div>
                    <button
                      onClick={() => setIssueModalFor({ id: eq.id, name: eq.name })}
                      className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Catat Kerusakan
                    </button>
                  </div>
                  {eq.issues.length === 0 ? (
                    <p className="text-xs text-muted italic py-2">Belum ada catatan kerusakan dalam 6 bulan terakhir.</p>
                  ) : (
                    <div className="grid grid-cols-6 gap-2">
                      {eq.issues.map((m: any) => (
                        <div key={m.month} className="text-center">
                          <div className="text-xs text-muted mb-1">{m.month}</div>
                          <div
                            className="rounded-lg py-1.5 text-sm font-black"
                            title={m.description}
                            style={{
                              background: m.count >= 3 ? '#FEE2E2' : m.count >= 2 ? '#FEF3C7' : m.count === 0 ? '#F3F4F6' : '#D1FAE5',
                              color: m.count >= 3 ? '#EF4444' : m.count >= 2 ? '#D97706' : m.count === 0 ? '#9CA3AF' : '#10B981',
                            }}
                          >
                            {m.count === 0 ? '—' : `${m.count}x`}
                          </div>
                          <div className="text-[9px] text-muted mt-1 leading-tight truncate" title={m.description}>
                            {m.count > 0 ? m.description.split(',')[0] : ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer: maintenance date + tips */}
                <div className="border-t border-gray-50 px-5 py-3 bg-gray-50/50 flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="flex items-center gap-2 text-xs text-muted shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Maintenance terakhir: <strong className="text-primary">{eq.lastMaintenance ? new Date(eq.lastMaintenance).toLocaleDateString('id-ID') : '-'}</strong></span>
                    <button
                      onClick={() => handleLogMaintenance(eq.id, eq.name)}
                      className="text-accent font-semibold hover:underline ml-1"
                    >
                      Catat hari ini
                    </button>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-muted mb-1.5">💡 Tips Perawatan:</div>
                    {eq.maintenanceTips.length === 0 ? (
                      <button
                        onClick={() => openEditEquipment(eq)}
                        className="text-xs text-accent font-semibold hover:underline"
                      >
                        Belum ada tips — klik untuk menambahkan
                      </button>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {eq.maintenanceTips.map((tip: string, i: number) => (
                          <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                            {tip}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
        )}
      </motion.div>

      {/* Modal: Tambah/Edit Alat */}
      <Modal isOpen={showEquipmentModal} onClose={() => setShowEquipmentModal(false)} title={editingEquipment ? `Edit Alat: ${editingEquipment.name}` : 'Tambah Alat Baru'}>
        <div className="space-y-4">
          <Input
            label="Nama Alat"
            placeholder="contoh: Leg Press Machine"
            value={equipmentForm.name}
            onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.target.value })}
            required
          />
          <Input
            label="Kategori"
            placeholder="contoh: Mesin Beban"
            value={equipmentForm.category}
            onChange={(e) => setEquipmentForm({ ...equipmentForm, category: e.target.value })}
            required
          />
          <Input
            label="Icon (emoji)"
            placeholder="🏋️"
            value={equipmentForm.icon}
            onChange={(e) => setEquipmentForm({ ...equipmentForm, icon: e.target.value })}
          />
          <Textarea
            label="Tips Perawatan"
            placeholder={'Tulis satu tips per baris, contoh:\nBersihkan setiap minggu\nLumasi bagian gerak setiap bulan'}
            value={equipmentForm.tipsText}
            onChange={(e) => setEquipmentForm({ ...equipmentForm, tipsText: e.target.value })}
          />
          <p className="text-xs text-muted -mt-2">Pisahkan setiap tips dengan baris baru (Enter). Tips ini ditentukan oleh admin gym, bukan otomatis dari sistem.</p>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1 rounded-xl border border-gray-200" onClick={() => setShowEquipmentModal(false)}>
              Batal
            </Button>
            <Button className="flex-1 rounded-xl" onClick={handleSaveEquipment}>
              Simpan
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Catat Kerusakan */}
      <Modal isOpen={!!issueModalFor} onClose={() => { setIssueModalFor(null); setNewIssueDesc('') }} title={`Catat Kerusakan: ${issueModalFor?.name || ''}`}>
        <div className="space-y-4">
          <Textarea
            label="Deskripsi Kerusakan"
            placeholder="contoh: Belt slip saat dipakai kecepatan tinggi"
            value={newIssueDesc}
            onChange={(e) => setNewIssueDesc(e.target.value)}
            required
          />
          <p className="text-xs text-muted">Tanggal kerusakan otomatis tercatat hari ini.</p>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1 rounded-xl border border-gray-200" onClick={() => { setIssueModalFor(null); setNewIssueDesc('') }}>
              Batal
            </Button>
            <Button className="flex-1 rounded-xl" onClick={handleAddIssue}>
              Simpan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AdminReports