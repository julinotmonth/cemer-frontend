import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  Plus, Edit2, Trash2, Power, PowerOff,
  Clock, Star, ChevronDown, ChevronUp
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Modal from '@/components/ui/Modal'
import { trainerAdminApi } from '@/lib/api'

const emptyTrainerForm = {
  name: '', specialization: '', experience: '', bio: '', rating: '4.5', certifications: '',
}

const AdminTrainers: React.FC = () => {
  const [trainers, setTrainers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const [showTrainerModal, setShowTrainerModal] = useState(false)
  const [editingTrainer, setEditingTrainer] = useState<any | null>(null)
  const [trainerForm, setTrainerForm] = useState(emptyTrainerForm)

  const [deactivateTarget, setDeactivateTarget] = useState<any | null>(null)
  const [deactivateReason, setDeactivateReason] = useState('')

  const [scheduleModalFor, setScheduleModalFor] = useState<any | null>(null)
  const [scheduleForm, setScheduleForm] = useState({ day: '', time: '', slots: '4' })

  const loadTrainers = async () => {
    try {
      const res = await trainerAdminApi.list()
      setTrainers(res.data)
    } catch (err) {
      console.error('Load trainers error:', err)
      toast.error('Gagal memuat data trainer')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadTrainers() }, [])

  const openAddTrainer = () => {
    setEditingTrainer(null)
    setTrainerForm(emptyTrainerForm)
    setShowTrainerModal(true)
  }

  const openEditTrainer = (trainer: any) => {
    setEditingTrainer(trainer)
    setTrainerForm({
      name: trainer.name,
      specialization: trainer.specialization,
      experience: trainer.experience,
      bio: trainer.bio || '',
      rating: String(trainer.rating),
      certifications: (trainer.certifications || []).join(', '),
    })
    setShowTrainerModal(true)
  }

  const handleSaveTrainer = async () => {
    if (!trainerForm.name || !trainerForm.specialization) {
      toast.error('Nama dan spesialisasi wajib diisi')
      return
    }
    const payload = {
      name: trainerForm.name,
      specialization: trainerForm.specialization,
      experience: trainerForm.experience || '1 tahun',
      bio: trainerForm.bio,
      rating: parseFloat(trainerForm.rating) || 4.5,
      certifications: trainerForm.certifications.split(',').map(c => c.trim()).filter(Boolean),
    }
    try {
      if (editingTrainer) {
        await trainerAdminApi.update(editingTrainer.id, payload)
        toast.success(`Data trainer "${payload.name}" berhasil diperbarui`)
      } else {
        await trainerAdminApi.create(payload)
        toast.success(`Trainer "${payload.name}" berhasil ditambahkan`)
      }
      setShowTrainerModal(false)
      loadTrainers()
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan data trainer')
    }
  }

  const handleToggleActive = async (trainer: any) => {
    if (trainer.isActive) {
      setDeactivateTarget(trainer)
      setDeactivateReason('')
    } else {
      try {
        await trainerAdminApi.setStatus(trainer.id, true)
        toast.success(`${trainer.name} diaktifkan kembali`)
        loadTrainers()
      } catch (err: any) {
        toast.error(err.message || 'Gagal mengaktifkan trainer')
      }
    }
  }

  const confirmDeactivate = async () => {
    if (!deactivateTarget) return
    try {
      await trainerAdminApi.setStatus(deactivateTarget.id, false, deactivateReason || 'Tidak aktif')
      toast.success(`${deactivateTarget.name} dinonaktifkan. Data member yang sudah ada tetap aman.`)
      setDeactivateTarget(null)
      loadTrainers()
    } catch (err: any) {
      toast.error(err.message || 'Gagal menonaktifkan trainer')
    }
  }

  const handleDeleteTrainer = async (trainer: any) => {
    if (!confirm(`Hapus permanen trainer "${trainer.name}"? Aksi ini hanya berhasil jika tidak ada member yang terhubung dengannya.`)) return
    try {
      await trainerAdminApi.delete(trainer.id)
      toast.success(`Trainer "${trainer.name}" berhasil dihapus`)
      loadTrainers()
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus trainer')
    }
  }

  const openAddSchedule = (trainer: any) => {
    setScheduleModalFor(trainer)
    setScheduleForm({ day: '', time: '', slots: '4' })
  }

  const handleAddSchedule = async () => {
    if (!scheduleModalFor) return
    if (!scheduleForm.day || !scheduleForm.time) {
      toast.error('Hari dan jam wajib diisi')
      return
    }
    try {
      await trainerAdminApi.addSchedule(
        scheduleModalFor.id,
        scheduleForm.day,
        scheduleForm.time,
        parseInt(scheduleForm.slots) || 4
      )
      toast.success('Jadwal berhasil ditambahkan')
      setScheduleModalFor(null)
      loadTrainers()
    } catch (err: any) {
      toast.error(err.message || 'Gagal menambahkan jadwal')
    }
  }

  const handleToggleScheduleActive = async (schedule: any) => {
    try {
      await trainerAdminApi.updateSchedule(schedule.id, { isActive: !schedule.isActive })
      toast.success(schedule.isActive ? 'Jadwal dinonaktifkan' : 'Jadwal diaktifkan kembali')
      loadTrainers()
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengubah status jadwal')
    }
  }

  const handleDeleteSchedule = async (schedule: any) => {
    if (!confirm('Hapus jadwal ini?')) return
    try {
      await trainerAdminApi.deleteSchedule(schedule.id)
      toast.success('Jadwal berhasil dihapus')
      loadTrainers()
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus jadwal')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Manajemen Trainer</h1>
          <p className="text-muted text-sm mt-1">Kelola data trainer dan jadwal latihan supaya tidak bentrok satu sama lain.</p>
        </div>
        <Button size="sm" className="rounded-xl gap-2" onClick={openAddTrainer}>
          <Plus className="w-4 h-4" /> Tambah Trainer
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-blue-700">
        💡 <strong>Trainer resign / cuti?</strong> Gunakan tombol nonaktifkan — datanya tidak dihapus (riwayat member yang sudah ditangani tetap aman), tapi trainer & jadwalnya otomatis tidak muncul lagi di halaman pendaftaran member baru. Saat menambah jadwal baru, sistem otomatis menolak jika jamnya bentrok dengan jadwal trainer yang sama.
      </div>

      <div className="space-y-4">
        {trainers.map((trainer) => (
          <motion.div
            key={trainer.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-2xl border shadow-card overflow-hidden ${trainer.isActive ? 'border-gray-100' : 'border-red-100 bg-red-50/30'}`}
          >
            <div className="flex items-center justify-between p-5 flex-wrap gap-3">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg text-white ${trainer.isActive ? 'bg-primary' : 'bg-gray-400'}`}>
                  {trainer.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-primary">{trainer.name}</h3>
                    {!trainer.isActive && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                        NON-AKTIF{trainer.inactiveReason ? `: ${trainer.inactiveReason}` : ''}
                      </span>
                    )}
                  </div>
                  <p className="text-accent text-sm font-semibold">{trainer.specialization}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {trainer.experience}</span>
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {trainer.rating}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setExpandedId(expandedId === trainer.id ? null : trainer.id)}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1"
                >
                  Jadwal ({trainer.schedules.length})
                  {expandedId === trainer.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => openEditTrainer(trainer)}
                  className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50"
                  title="Edit data trainer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleToggleActive(trainer)}
                  className={`p-2 rounded-xl border ${trainer.isActive ? 'border-orange-200 text-orange-500 hover:bg-orange-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}
                  title={trainer.isActive ? 'Nonaktifkan (resign/cuti)' : 'Aktifkan kembali'}
                >
                  {trainer.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleDeleteTrainer(trainer)}
                  className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500"
                  title="Hapus permanen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {expandedId === trainer.id && (
              <div className="border-t border-gray-50 bg-gray-50/50 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-muted uppercase tracking-wide">Jadwal Latihan</span>
                  <button
                    onClick={() => openAddSchedule(trainer)}
                    className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Jadwal
                  </button>
                </div>
                {trainer.schedules.length === 0 ? (
                  <p className="text-xs text-muted italic">Belum ada jadwal untuk trainer ini.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {trainer.schedules.map((s: any) => (
                      <div
                        key={s.id}
                        className={`rounded-xl border p-3 flex items-center justify-between gap-2 ${s.isActive ? 'bg-white border-gray-200' : 'bg-gray-100 border-gray-200 opacity-60'}`}
                      >
                        <div>
                          <p className="font-semibold text-sm text-primary">{s.day}</p>
                          <p className="text-xs text-muted">{s.time}</p>
                          <p className="text-xs text-muted mt-0.5">{s.bookedSlots}/{s.slots} slot terisi</p>
                          {!s.isActive && <p className="text-[10px] text-red-500 font-semibold mt-0.5">Non-aktif</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleToggleScheduleActive(s)}
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
                            title={s.isActive ? 'Nonaktifkan jadwal' : 'Aktifkan jadwal'}
                          >
                            {s.isActive ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(s)}
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500"
                            title="Hapus jadwal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <Modal isOpen={showTrainerModal} onClose={() => setShowTrainerModal(false)} title={editingTrainer ? 'Edit Trainer' : 'Tambah Trainer Baru'}>
        <div className="space-y-4">
          <Input
            label="Nama Lengkap"
            placeholder="contoh: Budi Santoso"
            value={trainerForm.name}
            onChange={(e) => setTrainerForm({ ...trainerForm, name: e.target.value })}
            required
          />
          <Input
            label="Spesialisasi"
            placeholder="contoh: Strength & Muscle Building"
            value={trainerForm.specialization}
            onChange={(e) => setTrainerForm({ ...trainerForm, specialization: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Pengalaman"
              placeholder="contoh: 5 tahun"
              value={trainerForm.experience}
              onChange={(e) => setTrainerForm({ ...trainerForm, experience: e.target.value })}
            />
            <Input
              label="Rating (1-5)"
              type="number"
              step="0.1"
              min="1"
              max="5"
              value={trainerForm.rating}
              onChange={(e) => setTrainerForm({ ...trainerForm, rating: e.target.value })}
            />
          </div>
          <Input
            label="Sertifikasi (pisahkan dengan koma)"
            placeholder="contoh: ACE Certified PT, NSCA-CPT"
            value={trainerForm.certifications}
            onChange={(e) => setTrainerForm({ ...trainerForm, certifications: e.target.value })}
          />
          <Textarea
            label="Bio Singkat"
            placeholder="Deskripsi singkat tentang trainer ini..."
            value={trainerForm.bio}
            onChange={(e) => setTrainerForm({ ...trainerForm, bio: e.target.value })}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1 rounded-xl border border-gray-200" onClick={() => setShowTrainerModal(false)}>
              Batal
            </Button>
            <Button className="flex-1 rounded-xl" onClick={handleSaveTrainer}>
              Simpan
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!deactivateTarget} onClose={() => setDeactivateTarget(null)} title={`Nonaktifkan ${deactivateTarget?.name || ''}`}>
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Trainer ini tidak akan muncul lagi di pilihan pendaftaran member baru. Data member yang sudah pernah ditangani tetap aman dan tidak hilang.
          </p>
          <Input
            label="Alasan (opsional)"
            placeholder="contoh: Resign, Cuti melahirkan, Sakit jangka panjang"
            value={deactivateReason}
            onChange={(e) => setDeactivateReason(e.target.value)}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1 rounded-xl border border-gray-200" onClick={() => setDeactivateTarget(null)}>
              Batal
            </Button>
            <Button className="flex-1 rounded-xl bg-orange-500 hover:bg-orange-600" onClick={confirmDeactivate}>
              Nonaktifkan
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!scheduleModalFor} onClose={() => setScheduleModalFor(null)} title={`Tambah Jadwal: ${scheduleModalFor?.name || ''}`}>
        <div className="space-y-4">
          <Input
            label="Hari"
            placeholder="contoh: Senin & Rabu"
            value={scheduleForm.day}
            onChange={(e) => setScheduleForm({ ...scheduleForm, day: e.target.value })}
            required
          />
          <Input
            label="Jam"
            placeholder="contoh: 07:00 - 09:00"
            value={scheduleForm.time}
            onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
            required
          />
          <Input
            label="Jumlah Slot"
            type="number"
            min="1"
            value={scheduleForm.slots}
            onChange={(e) => setScheduleForm({ ...scheduleForm, slots: e.target.value })}
          />
          <p className="text-xs text-muted">Sistem akan otomatis menolak jika hari & jam ini bentrok dengan jadwal trainer yang sama.</p>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1 rounded-xl border border-gray-200" onClick={() => setScheduleModalFor(null)}>
              Batal
            </Button>
            <Button className="flex-1 rounded-xl" onClick={handleAddSchedule}>
              Simpan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AdminTrainers
