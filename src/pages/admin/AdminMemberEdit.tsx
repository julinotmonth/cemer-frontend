import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft, Save } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import { useMemberStore } from '@/store/memberStore'
import { formatCurrency } from '@/lib/utils'
import { PLANS } from '@/lib/data'
import { MembershipPlan, MembershipDuration, Member } from '@/types'

const schema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().min(10, 'No HP minimal 10 digit'),
  birthDate: z.string().min(1, 'Tanggal lahir wajib diisi'),
  gender: z.enum(['male', 'female']),
  address: z.string().min(10, 'Alamat minimal 10 karakter'),
  plan: z.enum(['basic', 'regular', 'premium']),
  duration: z.enum(['1', '3', '6', '12']),
  status: z.enum(['active', 'pending', 'expired']),
  heightCm: z.string().optional(),
  weightKg: z.string().optional(),
})
type FormData = z.infer<typeof schema>

const AdminMemberEdit: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { getMemberById, fetchMemberById, updateMember } = useMemberStore()
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    const load = async () => {
      if (!id) return
      let member: Member | null | undefined = getMemberById(id)
      if (!member) {
        member = await fetchMemberById(id)
      }
      if (!member) {
        setNotFound(true)
        setLoading(false)
        return
      }
      reset({
        name: member.name,
        email: member.email,
        phone: member.phone,
        birthDate: member.birthDate?.slice(0, 10),
        gender: member.gender,
        address: member.address,
        plan: member.plan,
        duration: member.duration,
        status: member.status,
        heightCm: member.heightCm ? String(member.heightCm) : '',
        weightKg: member.weightKg ? String(member.weightKg) : '',
      })
      setLoading(false)
    }
    load()
  }, [id])

  const watchedPlan = watch('plan') as MembershipPlan
  const watchedDuration = watch('duration') as MembershipDuration
  const currentPlan = PLANS.find(p => p.id === watchedPlan)
  const price = currentPlan?.price[watchedDuration] ?? 0

  const onSubmit = async (data: FormData) => {
    if (!id) return
    try {
      await updateMember(id, {
        ...data,
        heightCm: data.heightCm ? Number(data.heightCm) : undefined,
        weightKg: data.weightKg ? Number(data.weightKg) : undefined,
      } as any)
      toast.success(`Data "${data.name}" berhasil diperbarui!`)
      navigate(`/admin/members/${id}`)
    } catch (err: any) {
      toast.error(err.message || 'Gagal memperbarui data member')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <p className="text-2xl font-black text-primary mb-2">Member tidak ditemukan</p>
        <p className="text-muted mb-6">Member dengan ID "{id}" tidak ada dalam sistem.</p>
        <Link to="/admin/members"><Button>Kembali ke Daftar</Button></Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Edit Data Member</h1>
          <p className="text-muted text-sm mt-0.5">Perbarui informasi member yang sudah terdaftar.</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Data */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-7 shadow-card border border-gray-100"
            >
              <h2 className="font-bold text-primary mb-5 text-lg">Data Pribadi</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <Input
                    label="Nama Lengkap"
                    placeholder="Masukkan nama lengkap"
                    required
                    error={errors.name?.message}
                    {...register('name')}
                  />
                </div>
                <Input
                  label="Email"
                  type="email"
                  placeholder="nama@email.com"
                  required
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input
                  label="Nomor HP"
                  placeholder="08xxxxxxxxxx"
                  required
                  error={errors.phone?.message}
                  {...register('phone')}
                />
                <Input
                  label="Tanggal Lahir"
                  type="date"
                  required
                  error={errors.birthDate?.message}
                  {...register('birthDate')}
                />
                <Select
                  label="Jenis Kelamin"
                  required
                  error={errors.gender?.message}
                  options={[
                    { value: 'male', label: 'Laki-laki' },
                    { value: 'female', label: 'Perempuan' },
                  ]}
                  placeholder="Pilih jenis kelamin"
                  {...register('gender')}
                />
                <div className="sm:col-span-2">
                  <Textarea
                    label="Alamat Lengkap"
                    placeholder="Jl. Nama Jalan No. X, Kelurahan, Kota"
                    required
                    error={errors.address?.message}
                    {...register('address')}
                  />
                </div>
                <Input
                  label="Tinggi Badan (cm)"
                  type="number"
                  placeholder="contoh: 170"
                  {...register('heightCm')}
                />
                <Input
                  label="Berat Badan (kg)"
                  type="number"
                  placeholder="contoh: 65"
                  {...register('weightKg')}
                />
              </div>
            </motion.div>

            {/* Membership */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl p-7 shadow-card border border-gray-100"
            >
              <h2 className="font-bold text-primary mb-5 text-lg">Paket Keanggotaan</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <Select
                  label="Pilih Paket"
                  required
                  options={[
                    { value: 'basic', label: 'Basic' },
                    { value: 'regular', label: 'Regular (Populer)' },
                    { value: 'premium', label: 'Premium' },
                  ]}
                  {...register('plan')}
                />
                <Select
                  label="Durasi Keanggotaan"
                  required
                  options={[
                    { value: '1', label: '1 Bulan' },
                    { value: '3', label: '3 Bulan (Hemat 7%)' },
                    { value: '6', label: '6 Bulan (Hemat 13%)' },
                    { value: '12', label: '1 Tahun (Hemat 20%)' },
                  ]}
                  {...register('duration')}
                />
                <Select
                  label="Status Keanggotaan"
                  required
                  options={[
                    { value: 'active', label: 'Aktif' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'expired', label: 'Kedaluwarsa' },
                  ]}
                  {...register('status')}
                />
              </div>
            </motion.div>
          </div>

          {/* Summary sidebar */}
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 sticky top-6"
            >
              <h3 className="font-bold text-primary mb-5">Ringkasan</h3>

              {currentPlan && (
                <>
                  <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 mb-4">
                    <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-2">Paket Dipilih</p>
                    <p className="font-black text-xl text-primary capitalize">{currentPlan.name}</p>
                    <p className="text-accent font-black text-2xl mt-1">{formatCurrency(price)}</p>
                    <p className="text-xs text-muted mt-0.5">untuk {watchedDuration} bulan</p>
                  </div>

                  <div className="space-y-2 mb-5">
                    {currentPlan.features.slice(0, 4).map(f => (
                      <div key={f} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                        {f}
                      </div>
                    ))}
                    {currentPlan.features.length > 4 && (
                      <p className="text-xs text-muted pl-4">+{currentPlan.features.length - 4} fitur lainnya</p>
                    )}
                  </div>
                </>
              )}

              <Button
                type="submit"
                loading={isSubmitting}
                className="w-full rounded-xl gap-2"
                size="md"
              >
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </Button>
              <Link to={`/admin/members/${id}`} className="block mt-2">
                <Button variant="ghost" className="w-full rounded-xl border border-gray-200 text-gray-500">
                  Batal
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AdminMemberEdit