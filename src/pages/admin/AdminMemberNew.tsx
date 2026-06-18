import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
import { MembershipPlan, MembershipDuration } from '@/types'

const schema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().min(10, 'No HP minimal 10 digit'),
  birthDate: z.string().min(1, 'Tanggal lahir wajib diisi'),
  gender: z.enum(['male', 'female']),
  address: z.string().min(10, 'Alamat minimal 10 karakter'),
  plan: z.enum(['basic', 'regular', 'premium']),
  duration: z.enum(['1', '3', '6', '12']),
  agreeTerms: z.boolean(),
})
type FormData = z.infer<typeof schema>

const AdminMemberNew: React.FC = () => {
  const navigate = useNavigate()
  const { addMember } = useMemberStore()

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { plan: 'regular', duration: '1', agreeTerms: true },
  })

  const watchedPlan = watch('plan') as MembershipPlan
  const watchedDuration = watch('duration') as MembershipDuration
  const currentPlan = PLANS.find(p => p.id === watchedPlan)
  const price = currentPlan?.price[watchedDuration] ?? 0

  const onSubmit = async (data: FormData) => {
    try {
      await addMember(data as any)
      toast.success(`Member "${data.name}" berhasil ditambahkan!`)
      navigate('/admin/members')
    } catch (err: any) {
      toast.error(err.message || 'Gagal menambahkan member')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Tambah Member Baru</h1>
          <p className="text-muted text-sm mt-0.5">Isi form untuk mendaftarkan member secara manual.</p>
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
                Simpan Member
              </Button>
              <Link to="/admin/members" className="block mt-2">
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

export default AdminMemberNew
