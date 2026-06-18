import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  Dumbbell, ArrowLeft, ArrowRight, CheckCircle2, Copy, Home,
  Star, Clock, Scale, TrendingDown, TrendingUp, Users
} from 'lucide-react'
import Stepper from '@/components/ui/Stepper'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { PLANS } from '@/lib/data'
import { trainersApi } from '@/lib/api'
import { formatCurrency, formatDate, calculateBMI } from '@/lib/utils'
import { useMemberStore } from '@/store/memberStore'
import { MembershipPlan, MembershipDuration, RegistrationFormData, Member, Trainer, Gender } from '@/types'

const step1Schema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  phone: z.string().min(10, 'Nomor HP minimal 10 digit').max(15, 'Nomor HP terlalu panjang'),
  birthDate: z.string().min(1, 'Tanggal lahir wajib diisi'),
  gender: z.enum(['male', 'female'], { required_error: 'Pilih jenis kelamin' }),
  address: z.string().min(10, 'Alamat minimal 10 karakter'),
})
type Step1Data = z.infer<typeof step1Schema>

const STEPS = [
  { id: 1, label: 'Data Pribadi', description: 'Isi data diri' },
  { id: 2, label: 'Pilih Paket', description: 'Pilih keanggotaan' },
  { id: 3, label: 'Pilih Trainer', description: 'Trainer & jadwal' },
  { id: 4, label: 'Data Tubuh', description: 'Tinggi & berat' },
  { id: 5, label: 'Konfirmasi', description: 'Review & kirim' },
]

const DURATION_OPTIONS: { value: MembershipDuration; label: string; discount?: string }[] = [
  { value: '1', label: '1 Bulan' },
  { value: '3', label: '3 Bulan', discount: 'Hemat 7%' },
  { value: '6', label: '6 Bulan', discount: 'Hemat 13%' },
  { value: '12', label: '1 Tahun', discount: 'Hemat 20%' },
]

const slideVariants = {
  enter: (dir: number) => ({ x: dir * 60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -60, opacity: 0 }),
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const { addMember } = useMemberStore()

  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan>('regular')
  const [selectedDuration, setSelectedDuration] = useState<MembershipDuration>('1')
  const [trainers, setTrainers] = React.useState<any[]>([])
  useEffect(() => {
    trainersApi.list().then(res => setTrainers(res.data)).catch(() => {})
  }, [])
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>('')
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>('')
  const [heightCm, setHeightCm] = useState('')
  const [weightKg, setWeightKg] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [newMember, setNewMember] = useState<Member | null>(null)
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
  })

  const currentPlan = PLANS.find(p => p.id === selectedPlan)!
  const price = currentPlan.price[selectedDuration]
  const selectedTrainer = trainers.find(t => t.id === selectedTrainerId)
  const selectedSchedule = selectedTrainer?.availableSchedules.find(s => s.id === selectedScheduleId)

  // BMI result if body data available
  const bmiResult = heightCm && weightKg && step1Data
    ? calculateBMI({
        heightCm: parseFloat(heightCm),
        weightKg: parseFloat(weightKg),
        gender: step1Data.gender,
        age: step1Data.birthDate ? Math.floor((Date.now() - new Date(step1Data.birthDate).getTime()) / (365.25 * 24 * 3600 * 1000)) : 25,
      })
    : null

  const goNext = () => { setDirection(1); setCurrentStep(s => s + 1) }
  const goPrev = () => { setDirection(-1); setCurrentStep(s => s - 1) }

  const handleStep1Submit = (data: Step1Data) => { setStep1Data(data); goNext() }

  const handleFinalSubmit = async () => {
    if (!agreeTerms) { toast.error('Anda harus menyetujui syarat & ketentuan'); return }
    if (!step1Data) return

    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))

    const formData: RegistrationFormData = {
      ...step1Data,
      plan: selectedPlan,
      duration: selectedDuration,
      trainerId: selectedTrainerId || undefined,
      trainerSchedule: selectedScheduleId || undefined,
      heightCm: heightCm ? parseFloat(heightCm) : undefined,
      weightKg: weightKg ? parseFloat(weightKg) : undefined,
      agreeTerms,
    }

    try {
      const member = await addMember(formData)
      setNewMember(member)
      setSubmitted(true)
      toast.success('Pendaftaran berhasil!')
    } catch (err: any) {
      toast.error(err.message || 'Pendaftaran gagal. Silahkan coba lagi.')
    }
    setSubmitting(false)
  }

  if (submitted && newMember) return <SuccessState member={newMember} />

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="heading-display text-lg tracking-widest text-white">GYM CEMERLANG</span>
          </Link>
          <Link to="/" className="text-white/60 hover:text-white text-sm flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white border-b border-gray-100 py-5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Stepper steps={STEPS} currentStep={currentStep} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Step 1: Data Pribadi */}
            {currentStep === 1 && (
              <form onSubmit={handleSubmit(handleStep1Submit)}>
                <div className="bg-white rounded-2xl p-7 shadow-card border border-gray-100">
                  <h2 className="text-2xl font-black text-primary mb-1">Data Pribadi</h2>
                  <p className="text-muted text-sm mb-6">Isi informasi diri Anda dengan lengkap dan benar.</p>
                  <div className="space-y-5">
                    <Input label="Nama Lengkap" placeholder="Contoh: Budi Santoso" error={errors.name?.message} {...register('name')} />
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Input label="Email" type="email" placeholder="email@contoh.com" error={errors.email?.message} {...register('email')} />
                      <Input label="No. HP / WhatsApp" type="tel" placeholder="081234567890" error={errors.phone?.message} {...register('phone')} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Input label="Tanggal Lahir" type="date" error={errors.birthDate?.message} {...register('birthDate')} />
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Jenis Kelamin</label>
                        <div className="grid grid-cols-2 gap-3">
                          {(['male', 'female'] as Gender[]).map(g => (
                            <label key={g} className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${errors.gender ? 'border-red-300' : 'border-gray-200'}`}>
                              <input type="radio" value={g} {...register('gender')} className="accent-accent" />
                              <span className="text-sm font-medium text-gray-700">{g === 'male' ? '👨 Laki-laki' : '👩 Perempuan'}</span>
                            </label>
                          ))}
                        </div>
                        {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
                      </div>
                    </div>
                    <Textarea label="Alamat Lengkap" placeholder="Jl. Nama Jalan No. X, Kelurahan, Kota" rows={3} error={errors.address?.message} {...register('address')} />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button type="submit" size="lg" className="rounded-xl gap-2">
                    Lanjutkan <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </form>
            )}

            {/* Step 2: Pilih Paket */}
            {currentStep === 2 && (
              <div>
                <div className="bg-white rounded-2xl p-7 shadow-card border border-gray-100">
                  <h2 className="text-2xl font-black text-primary mb-1">Pilih Paket</h2>
                  <p className="text-muted text-sm mb-6">Pilih paket keanggotaan dan durasi yang sesuai kebutuhan Anda.</p>

                  {/* Plans */}
                  <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    {PLANS.map(plan => (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`rounded-2xl border-2 p-5 cursor-pointer transition-all duration-200 ${
                          selectedPlan === plan.id ? 'border-accent bg-accent/5 shadow-md' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5"
                            style={{ borderColor: selectedPlan === plan.id ? '#E94560' : '#D1D5DB' }}>
                            {selectedPlan === plan.id && <div className="w-2 h-2 rounded-full bg-accent" />}
                          </div>
                          {plan.popular && <span className="text-xs font-bold bg-accent text-white px-2 py-0.5 rounded-full">Populer</span>}
                        </div>
                        <h3 className="font-black text-primary text-lg">{plan.name}</h3>
                        <p className="text-accent font-black text-xl">{formatCurrency(plan.price['1'])}<span className="text-sm text-muted font-normal">/bln</span></p>
                        <ul className="mt-3 space-y-1.5">
                          {plan.features.slice(0, 3).map(f => (
                            <li key={f} className="text-xs text-gray-500 flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Duration */}
                  <div>
                    <h3 className="font-black text-primary mb-3">Durasi Keanggotaan</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {DURATION_OPTIONS.map(opt => (
                        <div
                          key={opt.value}
                          onClick={() => setSelectedDuration(opt.value)}
                          className={`rounded-xl border-2 p-3 text-center cursor-pointer transition-all ${
                            selectedDuration === opt.value ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <p className="font-black text-primary text-sm">{opt.label}</p>
                          {opt.discount && <p className="text-xs text-green-600 font-semibold mt-0.5">{opt.discount}</p>}
                          <p className="text-xs text-accent font-bold mt-1">{formatCurrency(currentPlan.price[opt.value])}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted">Paket {currentPlan.name} × {selectedDuration} bulan</span>
                      <span className="font-black text-xl text-primary">{formatCurrency(price)}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" size="lg" onClick={goPrev} className="rounded-xl gap-2 border-gray-300 text-gray-600">
                    <ArrowLeft className="w-5 h-5" /> Kembali
                  </Button>
                  <Button size="lg" onClick={goNext} className="rounded-xl gap-2">
                    Lanjutkan <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Pilih Trainer */}
            {currentStep === 3 && (
              <div>
                <div className="bg-white rounded-2xl p-7 shadow-card border border-gray-100">
                  <h2 className="text-2xl font-black text-primary mb-1">Pilih Trainer & Jadwal</h2>
                  <p className="text-muted text-sm mb-2">Opsional — pilih personal trainer dan jadwal yang Anda inginkan.</p>
                  <p className="text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg mb-6">
                    💡 Pilihan trainer tersedia untuk semua paket. Untuk paket Premium, personal trainer sudah termasuk 2x/minggu.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    {trainers.map(trainer => (
                      <div
                        key={trainer.id}
                        onClick={() => { setSelectedTrainerId(trainer.id); setSelectedScheduleId('') }}
                        className={`rounded-2xl border-2 p-4 cursor-pointer transition-all ${
                          selectedTrainerId === trainer.id ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center font-black text-primary text-sm flex-shrink-0">
                            {trainer.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-black text-primary text-sm">{trainer.name}</h4>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                <span className="text-xs font-bold text-gray-600">{trainer.rating}</span>
                              </div>
                            </div>
                            <p className="text-xs text-accent font-semibold">{trainer.specialization}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{trainer.experience} pengalaman</p>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {trainer.certifications.slice(0, 2).map(c => (
                                <span key={c} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{c}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Schedule selection */}
                  {selectedTrainerId && selectedTrainer && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <h3 className="font-black text-primary mb-3 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-accent" />
                        Pilih Jadwal — {selectedTrainer.name}
                      </h3>
                      <div className="space-y-2">
                        {selectedTrainer.availableSchedules.map(s => {
                          const remaining = s.slots - s.bookedSlots
                          const isFull = remaining === 0
                          return (
                            <div
                              key={s.id}
                              onClick={() => !isFull && setSelectedScheduleId(s.id)}
                              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                                isFull ? 'opacity-50 cursor-not-allowed border-gray-100 bg-gray-50' :
                                selectedScheduleId === s.id ? 'border-accent bg-accent/5 cursor-pointer' :
                                'border-gray-200 hover:border-gray-300 cursor-pointer'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedScheduleId === s.id ? 'border-accent' : 'border-gray-300'}`}>
                                  {selectedScheduleId === s.id && <div className="w-2 h-2 rounded-full bg-accent" />}
                                </div>
                                <div>
                                  <p className="font-bold text-primary text-sm">{s.day}</p>
                                  <p className="text-gray-500 text-xs">{s.time}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`text-sm font-black ${remaining === 0 ? 'text-red-500' : remaining <= 2 ? 'text-yellow-600' : 'text-green-600'}`}>
                                  {remaining === 0 ? 'Penuh' : `${remaining} slot`}
                                </p>
                                <p className="text-xs text-gray-400">dari {s.slots} slot</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}

                  {!selectedTrainerId && (
                    <div className="text-center py-4 text-gray-400 text-sm">
                      Pilih trainer di atas untuk melihat jadwal yang tersedia
                    </div>
                  )}

                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-xs text-yellow-700">
                    <strong>Lewati langkah ini?</strong> Anda tetap bisa memilih trainer setelah mendaftar melalui admin kami.
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" size="lg" onClick={goPrev} className="rounded-xl gap-2 border-gray-300 text-gray-600">
                    <ArrowLeft className="w-5 h-5" /> Kembali
                  </Button>
                  <Button size="lg" onClick={goNext} className="rounded-xl gap-2">
                    Lanjutkan <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Data Tubuh & BMI */}
            {currentStep === 4 && (
              <div>
                <div className="bg-white rounded-2xl p-7 shadow-card border border-gray-100">
                  <h2 className="text-2xl font-black text-primary mb-1">Data Tubuh & BMI</h2>
                  <p className="text-muted text-sm mb-6">Opsional — masukkan tinggi dan berat badan untuk menghitung berat ideal Anda.</p>

                  <div className="grid sm:grid-cols-2 gap-5 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Tinggi Badan (cm)</label>
                      <input
                        type="number"
                        value={heightCm}
                        onChange={e => setHeightCm(e.target.value)}
                        placeholder="Contoh: 170"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Berat Badan (kg)</label>
                      <input
                        type="number"
                        value={weightKg}
                        onChange={e => setWeightKg(e.target.value)}
                        placeholder="Contoh: 65"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                  </div>

                  {/* BMI Result */}
                  {bmiResult && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      <div className={`rounded-2xl p-5 border-2 ${
                        bmiResult.status === 'normal' ? 'bg-green-50 border-green-200' :
                        bmiResult.status === 'underweight' ? 'bg-blue-50 border-blue-200' :
                        bmiResult.status === 'overweight' ? 'bg-yellow-50 border-yellow-200' :
                        'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-gray-500 text-sm">Indeks Massa Tubuh (BMI)</p>
                            <p className={`text-4xl font-black ${
                              bmiResult.status === 'normal' ? 'text-green-600' :
                              bmiResult.status === 'underweight' ? 'text-blue-600' :
                              bmiResult.status === 'overweight' ? 'text-yellow-600' : 'text-red-600'
                            }`}>{bmiResult.bmi}</p>
                            <p className={`font-bold text-sm ${
                              bmiResult.status === 'normal' ? 'text-green-700' :
                              bmiResult.status === 'underweight' ? 'text-blue-700' :
                              bmiResult.status === 'overweight' ? 'text-yellow-700' : 'text-red-700'
                            }`}>{bmiResult.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-500 text-xs mb-1">Berat Ideal</p>
                            <p className="font-black text-primary">{bmiResult.idealWeightMin}–{bmiResult.idealWeightMax} kg</p>
                            <div className={`mt-2 px-3 py-1.5 rounded-lg text-sm font-black ${
                              bmiResult.difference > 0 ? 'bg-red-100 text-red-700' :
                              bmiResult.difference < 0 ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {bmiResult.difference === 0 ? '✓ Sudah Ideal!' :
                               bmiResult.difference > 0 ? `↓ Turunkan ${Math.abs(bmiResult.difference)} kg` :
                               `↑ Naikkan ${Math.abs(bmiResult.difference)} kg`}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 bg-white/60 rounded-xl p-3 leading-relaxed">
                          💡 {bmiResult.recommendation}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {(!heightCm || !weightKg) && (
                    <div className="text-center py-8 text-gray-400">
                      <Scale className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">Masukkan tinggi dan berat badan untuk melihat BMI dan berat ideal Anda</p>
                    </div>
                  )}
                </div>
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" size="lg" onClick={goPrev} className="rounded-xl gap-2 border-gray-300 text-gray-600">
                    <ArrowLeft className="w-5 h-5" /> Kembali
                  </Button>
                  <Button size="lg" onClick={goNext} className="rounded-xl gap-2">
                    Lanjutkan <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5: Konfirmasi */}
            {currentStep === 5 && step1Data && (
              <div>
                <div className="bg-white rounded-2xl p-7 shadow-card border border-gray-100">
                  <h2 className="text-2xl font-black text-primary mb-1">Konfirmasi Data</h2>
                  <p className="text-muted text-sm mb-6">Periksa kembali data Anda sebelum mengirim pendaftaran.</p>

                  <div className="space-y-4">
                    {/* Data Pribadi */}
                    <div className="rounded-xl border border-gray-100 overflow-hidden">
                      <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
                        <p className="text-sm font-bold text-primary uppercase tracking-wide">Data Pribadi</p>
                      </div>
                      <div className="px-5 py-4 grid sm:grid-cols-2 gap-4">
                        {[
                          { label: 'Nama Lengkap', value: step1Data.name },
                          { label: 'Email', value: step1Data.email },
                          { label: 'No. HP', value: step1Data.phone },
                          { label: 'Tanggal Lahir', value: formatDate(step1Data.birthDate) },
                          { label: 'Jenis Kelamin', value: step1Data.gender === 'male' ? 'Laki-laki' : 'Perempuan' },
                          { label: 'Alamat', value: step1Data.address },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <p className="text-xs text-muted uppercase tracking-wide mb-0.5">{label}</p>
                            <p className="text-sm font-semibold text-primary">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Paket */}
                    <div className="rounded-xl border border-accent/30 bg-red-50 overflow-hidden">
                      <div className="bg-accent px-5 py-3">
                        <p className="text-sm font-bold text-white uppercase tracking-wide">Paket Keanggotaan</p>
                      </div>
                      <div className="px-5 py-4 grid sm:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-muted uppercase tracking-wide mb-0.5">Paket</p>
                          <p className="text-sm font-bold text-primary capitalize">{selectedPlan}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted uppercase tracking-wide mb-0.5">Durasi</p>
                          <p className="text-sm font-bold text-primary">{selectedDuration} Bulan</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted uppercase tracking-wide mb-0.5">Total</p>
                          <p className="text-lg font-black text-accent">{formatCurrency(price)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Trainer */}
                    {selectedTrainer && (
                      <div className="rounded-xl border border-blue-200 bg-blue-50 overflow-hidden">
                        <div className="bg-blue-600 px-5 py-3">
                          <p className="text-sm font-bold text-white uppercase tracking-wide">Personal Trainer</p>
                        </div>
                        <div className="px-5 py-4 grid sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted uppercase tracking-wide mb-0.5">Trainer</p>
                            <p className="text-sm font-bold text-primary">{selectedTrainer.name}</p>
                            <p className="text-xs text-blue-600">{selectedTrainer.specialization}</p>
                          </div>
                          {selectedSchedule && (
                            <div>
                              <p className="text-xs text-muted uppercase tracking-wide mb-0.5">Jadwal</p>
                              <p className="text-sm font-bold text-primary">{selectedSchedule.day}</p>
                              <p className="text-xs text-gray-500">{selectedSchedule.time}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* BMI */}
                    {bmiResult && (
                      <div className="rounded-xl border border-green-200 bg-green-50 overflow-hidden">
                        <div className="bg-green-600 px-5 py-3">
                          <p className="text-sm font-bold text-white uppercase tracking-wide">Data Tubuh & BMI</p>
                        </div>
                        <div className="px-5 py-4 grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-muted uppercase tracking-wide mb-0.5">Tinggi</p>
                            <p className="text-sm font-bold text-primary">{heightCm} cm</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted uppercase tracking-wide mb-0.5">Berat</p>
                            <p className="text-sm font-bold text-primary">{weightKg} kg</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted uppercase tracking-wide mb-0.5">BMI</p>
                            <p className="text-sm font-bold text-primary">{bmiResult.bmi} — {bmiResult.category}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreeTerms}
                      onChange={e => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 mt-0.5 accent-accent cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer leading-relaxed">
                      Saya menyetujui{' '}
                      <a href="#" className="text-accent font-semibold hover:underline">Syarat & Ketentuan</a>
                      {' '}dan{' '}
                      <a href="#" className="text-accent font-semibold hover:underline">Kebijakan Privasi</a>
                      {' '}Gym Cemerlang.
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <Button variant="outline" size="lg" onClick={goPrev} className="rounded-xl gap-2 border-gray-300 text-gray-600">
                    <ArrowLeft className="w-5 h-5" /> Kembali
                  </Button>
                  <Button size="lg" onClick={handleFinalSubmit} loading={submitting} disabled={!agreeTerms} className="rounded-xl gap-2">
                    Kirim Pendaftaran <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Success State ──
const SuccessState: React.FC<{ member: Member }> = ({ member }) => {
  const copyRef = () => {
    navigator.clipboard.writeText(member.referenceNumber)
    toast.success('Nomor referensi disalin!')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-3xl p-10 shadow-card-hover border border-gray-100 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h2 className="text-3xl font-black text-primary mb-2">Selamat Datang! 🎉</h2>
          <p className="text-muted mb-6">
            Pendaftaran Anda berhasil dikirim. Tim kami akan segera memproses keanggotaan Anda.
          </p>

          <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100">
            <p className="text-sm text-muted mb-1">Nomor Referensi Anda</p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-xl font-black text-primary tracking-wider">{member.referenceNumber}</p>
              <button onClick={copyRef} className="p-1.5 rounded-lg hover:bg-gray-200 text-muted transition-colors">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-accent/5 rounded-xl p-4 border border-accent/20 text-left mb-6">
            <p className="text-xs text-muted uppercase tracking-wide mb-2 font-semibold">Ringkasan Pendaftaran</p>
            <div className="space-y-1.5">
              {[
                ['Nama', member.name],
                ['Paket', member.plan],
                ['Durasi', `${member.duration} Bulan`],
                ['Status', 'Menunggu Konfirmasi'],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between text-sm">
                  <span className="text-muted">{l}</span>
                  <span className={`font-semibold ${l === 'Status' ? 'text-yellow-600' : 'text-primary capitalize'}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-muted mb-6">
            Konfirmasi akan dikirim ke <strong>{member.email}</strong>. Simpan nomor referensi Anda.
          </p>

          <Link to="/" className="block">
            <Button size="lg" className="w-full rounded-xl gap-2">
              <Home className="w-5 h-5" />
              Kembali ke Beranda
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default RegisterPage
