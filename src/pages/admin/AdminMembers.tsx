import React, { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  Search, Filter, Download, UserPlus, Eye, Edit2, Trash2,
  ChevronLeft, ChevronRight, Users
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import { useMemberStore } from '@/store/memberStore'
import { formatDate, formatCurrency } from '@/lib/utils'
import { MemberStatus, MembershipPlan, Member } from '@/types'
import { PLANS } from '@/lib/data'

const statusLabel: Record<MemberStatus, string> = { active: 'Aktif', pending: 'Pending', expired: 'Kedaluwarsa' }
const planLabel: Record<MembershipPlan, string> = { basic: 'Basic', regular: 'Regular', premium: 'Premium' }

const PAGE_SIZE = 8

const AdminMembers: React.FC = () => {
  const { members, deleteMember, fetchMembers, loading } = useMemberStore()
  useEffect(() => { fetchMembers() }, [])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<MemberStatus | 'all'>('all')
  const [filterPlan, setFilterPlan] = useState<MembershipPlan | 'all'>('all')
  const [page, setPage] = useState(1)
  const [deleteModal, setDeleteModal] = useState<Member | null>(null)
  const [sortField, setSortField] = useState<keyof Member>('registeredAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const filtered = useMemo(() => {
    let result = members
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.phone.includes(q) ||
        m.referenceNumber.toLowerCase().includes(q)
      )
    }
    if (filterStatus !== 'all') result = result.filter(m => m.status === filterStatus)
    if (filterPlan !== 'all') result = result.filter(m => m.plan === filterPlan)
    result = [...result].sort((a, b) => {
      const av = a[sortField] as string
      const bv = b[sortField] as string
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
    return result
  }, [members, search, filterStatus, filterPlan, sortField, sortDir])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSort = (field: keyof Member) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const handleDelete = (member: Member) => setDeleteModal(member)
  const confirmDelete = async () => {
    if (deleteModal) {
      try {
        await deleteMember(deleteModal.id)
        toast.success(`Member "${deleteModal.name}" berhasil dihapus.`)
      } catch {
        toast.error('Gagal menghapus member')
      }
      setDeleteModal(null)
    }
  }

  const handleExport = () => {
    const headers = ['Nama,Email,No HP,Paket,Durasi,Status,Tanggal Daftar,Ref']
    const rows = filtered.map(m =>
      `"${m.name}","${m.email}","${m.phone}","${m.plan}","${m.duration} bln","${m.status}","${m.registeredAt}","${m.referenceNumber}"`
    )
    const csv = [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'members.csv'; a.click()
    toast.success('Data berhasil diekspor!')
  }

  const SortIcon = ({ field }: { field: keyof Member }) => (
    <span className={`ml-1 text-xs ${sortField === field ? 'text-accent' : 'text-gray-300'}`}>
      {sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Daftar Member</h1>
          <p className="text-muted text-sm mt-1">
            Total <strong>{filtered.length}</strong> member ditemukan
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={handleExport} className="rounded-xl gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Link to="/admin/members/new">
            <Button size="sm" className="rounded-xl gap-2">
              <UserPlus className="w-4 h-4" />
              Tambah
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Cari nama, email, no HP, atau nomor ref..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value as any); setPage(1) }}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="pending">Pending</option>
            <option value="expired">Kedaluwarsa</option>
          </select>
          <select
            value={filterPlan}
            onChange={e => { setFilterPlan(e.target.value as any); setPage(1) }}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent cursor-pointer"
          >
            <option value="all">Semua Paket</option>
            <option value="basic">Basic</option>
            <option value="regular">Regular</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden"
      >
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Users className="w-12 h-12 text-gray-200 mb-3" />
            <p className="text-muted font-semibold">Tidak ada member ditemukan</p>
            <p className="text-muted text-sm mt-1">Coba ubah filter pencarian Anda</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {[
                    { key: 'name', label: 'Nama' },
                    { key: 'email', label: 'Email' },
                    { key: 'phone', label: 'No. HP' },
                    { key: 'plan', label: 'Paket' },
                    { key: 'registeredAt', label: 'Tgl Daftar' },
                    { key: 'status', label: 'Status' },
                  ].map(col => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key as keyof Member)}
                      className="text-left px-6 py-3.5 text-xs font-bold text-muted uppercase tracking-wide cursor-pointer hover:text-primary transition-colors select-none"
                    >
                      {col.label}
                      <SortIcon field={col.key as keyof Member} />
                    </th>
                  ))}
                  <th className="text-left px-6 py-3.5 text-xs font-bold text-muted uppercase tracking-wide">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((member, i) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm flex-shrink-0">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-primary text-sm">{member.name}</p>
                          <p className="text-xs text-muted">{member.referenceNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">{member.email}</td>
                    <td className="px-6 py-4 text-sm text-muted">{member.phone}</td>
                    <td className="px-6 py-4">
                      <Badge variant={member.plan}>{planLabel[member.plan]}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">{formatDate(member.registeredAt)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={member.status}>{statusLabel[member.status]}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Link to={`/admin/members/${member.id}`}>
                          <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all" title="Detail">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-accent hover:bg-red-50 transition-all" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(member)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-muted">
              Menampilkan {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
                    page === p ? 'bg-accent text-white' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Delete modal */}
      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Hapus Member"
        size="sm"
      >
        <div className="text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-7 h-7 text-red-500" />
          </div>
          <p className="text-gray-700 mb-1">Apakah Anda yakin ingin menghapus member</p>
          <p className="font-bold text-primary mb-4">"{deleteModal?.name}"?</p>
          <p className="text-sm text-muted mb-6">Tindakan ini tidak dapat dibatalkan.</p>
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1 rounded-xl border border-gray-200" onClick={() => setDeleteModal(null)}>
              Batal
            </Button>
            <Button variant="destructive" className="flex-1 rounded-xl" onClick={confirmDelete}>
              Hapus
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AdminMembers
