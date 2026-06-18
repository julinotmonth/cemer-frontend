import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Dumbbell, Zap, Shield, Clock, Users, Star,
  CheckCircle2, ArrowRight, ChevronDown, Phone,
  Mail, MapPin, Instagram, Facebook, Youtube,
  ClipboardList, Bell, Calendar, ChevronRight,
  Scale, TrendingDown, TrendingUp, Info, X
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Button from '@/components/ui/Button'
import { formatCurrency, calculateBMI } from '@/lib/utils'
import { PLANS, TESTIMONIALS, PROGRAMS, GYM_EQUIPMENTS } from '@/lib/data'
import { trainersApi } from '@/lib/api'
import { GymEquipment, Trainer, Gender } from '@/types'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
  }),
}

const SectionWrapper: React.FC<{ children: React.ReactNode; className?: string; id?: string }> = ({ children, className = '', id }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      id={id}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── HERO ──
const Hero: React.FC = () => (
  <section id="beranda" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient">
    <div className="absolute inset-0 bg-noise opacity-30" />
    <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />
    <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-surface/40 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-white/80 text-sm font-medium mb-6"
          >
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            Sistem Pendaftaran Online Resmi
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="heading-display text-6xl sm:text-7xl lg:text-8xl text-white leading-none mb-6"
          >
            MULAI
            <br />
            <span className="gradient-text">PERJALANAN</span>
            <br />
            FITNESSMU
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-white/70 text-lg max-w-md leading-relaxed mb-8"
          >
            Daftar online dalam 5 menit. Akses 200+ alat gym, trainer bersertifikat, kelas group, dan jadwal personal trainer pilihan Anda.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/daftar">
              <Button size="lg" className="rounded-2xl px-8 gap-2">
                Daftar Sekarang
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/cek-status">
              <Button variant="outline" size="lg" className="rounded-2xl px-8 border-white/30 text-white hover:bg-white/10 gap-2">
                🔍 Cek Status
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-6 mt-10"
          >
            {[['500+', 'Member Aktif'], ['15+', 'Trainer Pro'], ['200+', 'Alat Gym']].map(([n, l]) => (
              <div key={l}>
                <div className="text-2xl font-black text-white">{n}</div>
                <div className="text-sm text-white/50">{l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:block"
        >
          <div className="relative">
            <div className="w-full aspect-square max-w-lg mx-auto bg-gradient-to-br from-accent/20 to-white/5 rounded-3xl border border-white/10 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-8xl mb-6">🏋️</div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: '🔔', label: 'Notifikasi Real-time' },
                    { icon: '👨‍🏫', label: 'Pilih Trainer' },
                    { icon: '⚖️', label: 'Hitung BMI Ideal' },
                    { icon: '📚', label: 'Panduan Alat Gym' },
                  ].map(({ icon, label }) => (
                    <div key={label} className="bg-white/10 rounded-xl p-3 text-center">
                      <div className="text-2xl mb-1">{icon}</div>
                      <p className="text-white/80 text-xs font-semibold">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>

    <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown className="w-6 h-6 text-white/40" />
      </motion.div>
    </div>
  </section>
)

// ── FEATURES ──
const Features: React.FC = () => (
  <SectionWrapper id="fasilitas" className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div variants={fadeUp} className="text-center mb-16">
        <span className="text-accent text-sm font-bold uppercase tracking-widest">Keunggulan Kami</span>
        <h2 className="text-4xl sm:text-5xl font-black text-primary mt-3 mb-4 tracking-tight">
          Kenapa Gym Cemerlang?
        </h2>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { icon: Zap, title: 'Daftar Online Cepat', desc: 'Proses pendaftaran 5 menit, langsung aktif. Tidak perlu antri atau datang ke lokasi.' },
          { icon: Shield, title: 'Trainer Bersertifikat', desc: 'Semua trainer memiliki sertifikasi internasional dan pengalaman minimal 5 tahun.' },
          { icon: Clock, title: 'Akses 24/7', desc: 'Gym terbuka sepanjang waktu untuk member Regular dan Premium.' },
          { icon: Users, title: 'Kelas Grup Variatif', desc: 'Lebih dari 20 jenis kelas grup setiap minggu, dari yoga hingga HIIT.' },
          { icon: Bell, title: 'Notifikasi Real-time', desc: 'Dapatkan update promo, jadwal, dan informasi penting langsung di notifikasi.' },
          { icon: ClipboardList, title: 'Tracking Progress', desc: 'Monitor perkembangan fitness Anda dengan fitur body metrics dan workout tracker.' },
        ].map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            variants={fadeUp}
            custom={i}
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-gray-50 rounded-2xl p-7 border border-gray-100 hover:shadow-card transition-all duration-300"
          >
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
              <Icon className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-black text-primary mb-2">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </SectionWrapper>
)

// ── PROGRAMS ──
const Programs: React.FC = () => (
  <SectionWrapper id="program" className="py-24 bg-primary">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div variants={fadeUp} className="text-center mb-16">
        <span className="text-accent text-sm font-bold uppercase tracking-widest">Program Latihan</span>
        <h2 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4 tracking-tight">
          Program Untuk Semua Level
        </h2>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PROGRAMS.map((p, i) => (
          <motion.div
            key={p.id}
            variants={fadeUp}
            custom={i}
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`bg-gradient-to-br ${p.gradient} rounded-2xl p-7 cursor-pointer`}
          >
            <div className="text-4xl mb-4">{p.icon}</div>
            <span className="text-xs font-bold text-white/60 uppercase tracking-widest">{p.level}</span>
            <h3 className="text-xl font-black text-white mt-1 mb-2">{p.name}</h3>
            <p className="text-white/70 text-sm leading-relaxed mb-4">{p.description}</p>
            <div className="flex items-center gap-1.5 text-white/60 text-sm">
              <Clock className="w-4 h-4" />
              {p.duration}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </SectionWrapper>
)

// ── GYM EQUIPMENT GUIDE ──
const EquipmentModal: React.FC<{ eq: GymEquipment; onClose: () => void }> = ({ eq, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      onClick={e => e.stopPropagation()}
    >
      <div className="p-7">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{eq.icon}</div>
            <div>
              <h3 className="text-2xl font-black text-primary">{eq.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{eq.category}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  eq.difficulty === 'Pemula' ? 'bg-green-100 text-green-700' :
                  eq.difficulty === 'Menengah' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>{eq.difficulty}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <p className="text-gray-600 leading-relaxed mb-5">{eq.description}</p>

        <div className="space-y-4">
          <div>
            <h4 className="font-black text-primary text-sm uppercase tracking-wide mb-2">Otot yang Dilatih</h4>
            <div className="flex flex-wrap gap-2">
              {eq.muscleGroups.map(m => (
                <span key={m} className="text-xs bg-accent/10 text-accent font-semibold px-3 py-1 rounded-full">{m}</span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-black text-primary text-sm uppercase tracking-wide mb-2">Manfaat Utama</h4>
            <ul className="space-y-1.5">
              {eq.benefits.map(b => (
                <li key={b} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black text-primary text-sm uppercase tracking-wide mb-2">Tips Penggunaan</h4>
            <ul className="space-y-1.5">
              {eq.tips.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
)

const EquipmentGuide: React.FC = () => {
  const [selected, setSelected] = useState<GymEquipment | null>(null)
  const [filter, setFilter] = useState('Semua')
  const categories = ['Semua', 'Kardio', 'Beban Bebas', 'Mesin Beban', 'Beban Badan', 'Recovery']
  const filtered = filter === 'Semua' ? GYM_EQUIPMENTS : GYM_EQUIPMENTS.filter(e => e.category === filter)

  return (
    <SectionWrapper id="alat-gym" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeUp} className="text-center mb-10">
          <span className="text-accent text-sm font-bold uppercase tracking-widest">Panduan Pemula</span>
          <h2 className="text-4xl sm:text-5xl font-black text-primary mt-3 mb-4 tracking-tight">
            Kenali Alat Gym Kami
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Klik pada setiap alat untuk melihat fungsi, manfaat, dan tips penggunaan yang tepat. Panduan lengkap untuk pemula!
          </p>
        </motion.div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                filter === cat ? 'bg-accent text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((eq, i) => (
            <motion.div
              key={eq.id}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={() => setSelected(eq)}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm cursor-pointer hover:shadow-card transition-all duration-300 group"
            >
              <div className="text-4xl mb-3">{eq.icon}</div>
              <h3 className="font-black text-primary text-lg mb-1">{eq.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-500 font-medium">{eq.category}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  eq.difficulty === 'Pemula' ? 'bg-green-100 text-green-700' :
                  eq.difficulty === 'Menengah' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>{eq.difficulty}</span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">{eq.description}</p>
              <div className="flex items-center gap-1 text-accent text-xs font-bold group-hover:gap-2 transition-all">
                <Info className="w-3.5 h-3.5" />
                Lihat Detail
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && <EquipmentModal eq={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </SectionWrapper>
  )
}

// ── TRAINERS ──
const TrainersSection: React.FC = () => {
  const [selected, setSelected] = useState<Trainer | null>(null)
  const [trainers, setTrainers] = useState<Trainer[]>([])

  useEffect(() => {
    trainersApi.list().then(res => setTrainers(res.data)).catch(() => {})
  }, [])

  return (
    <SectionWrapper id="trainer" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeUp} className="text-center mb-16">
          <span className="text-accent text-sm font-bold uppercase tracking-widest">Tim Trainer</span>
          <h2 className="text-4xl sm:text-5xl font-black text-primary mt-3 mb-4 tracking-tight">
            Trainer Profesional Kami
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Semua trainer bersertifikat internasional dan berpengalaman. Pilih trainer dan jadwal sesuai kebutuhan Anda saat mendaftar.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trainers.map((t, i) => (
            <motion.div
              key={t.id}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-card transition-all duration-300"
            >
              <div className="bg-gradient-to-br from-primary to-secondary p-6 text-center">
                <div className="w-20 h-20 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl font-black text-white">
                  {t.avatar}
                </div>
                <h3 className="font-black text-white text-lg">{t.name}</h3>
                <p className="text-white/60 text-sm">{t.specialization}</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className={`w-3.5 h-3.5 ${j < Math.floor(t.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'}`} />
                  ))}
                  <span className="text-white/70 text-xs ml-1">{t.rating}</span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <Clock className="w-4 h-4 text-accent" />
                  Pengalaman: <strong>{t.experience}</strong>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{t.bio}</p>
                <div className="space-y-1.5 mb-4">
                  {t.availableSchedules.slice(0, 2).map(s => (
                    <div key={s.id} className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{s.day}</span>
                      <span className={`font-bold ${s.slots - s.bookedSlots <= 1 ? 'text-red-500' : 'text-green-600'}`}>
                        {s.slots - s.bookedSlots} slot tersisa
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setSelected(t)}
                  className="w-full text-center text-accent text-sm font-bold hover:underline flex items-center justify-center gap-1"
                >
                  Lihat Jadwal Lengkap <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl max-w-md w-full overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="bg-gradient-to-br from-primary to-secondary p-7 text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center text-xl font-black">
                        {selected.avatar}
                      </div>
                      <div>
                        <h3 className="text-xl font-black">{selected.name}</h3>
                        <p className="text-white/60 text-sm">{selected.specialization}</p>
                        <p className="text-white/50 text-xs mt-0.5">Pengalaman: {selected.experience}</p>
                      </div>
                    </div>
                    <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-white/70 text-sm mt-4 leading-relaxed">{selected.bio}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selected.certifications.map(c => (
                      <span key={c} className="text-xs bg-white/10 px-2 py-1 rounded-lg">{c}</span>
                    ))}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-black text-primary mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-accent" />
                    Jadwal Tersedia
                  </h4>
                  <div className="space-y-3">
                    {selected.availableSchedules.map(s => {
                      const remaining = s.slots - s.bookedSlots
                      return (
                        <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <div>
                            <p className="font-bold text-primary text-sm">{s.day}</p>
                            <p className="text-gray-500 text-xs">{s.time}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-black ${remaining <= 1 ? 'text-red-500' : remaining <= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                              {remaining} slot
                            </p>
                            <p className="text-xs text-gray-400">dari {s.slots}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <Link to="/daftar" className="block mt-5">
                    <Button className="w-full rounded-xl gap-2">
                      Pilih Trainer Ini
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  )
}

// ── BMI CALCULATOR ──
const BMICalculator: React.FC = () => {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<Gender>('male')
  const [result, setResult] = useState<ReturnType<typeof calculateBMI> | null>(null)

  const handleCalculate = () => {
    const h = parseFloat(height)
    const w = parseFloat(weight)
    const a = parseFloat(age)
    if (!h || !w || !a || h < 100 || h > 250 || w < 20 || w > 300) return
    setResult(calculateBMI({ heightCm: h, weightKg: w, gender, age: a }))
  }

  const statusConfig = {
    underweight: { color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', icon: TrendingDown, label: 'Kurang' },
    normal: { color: 'text-green-600', bg: 'bg-green-50 border-green-200', icon: CheckCircle2, label: 'Ideal' },
    overweight: { color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200', icon: TrendingUp, label: 'Lebih' },
    obese: { color: 'text-red-600', bg: 'bg-red-50 border-red-200', icon: TrendingUp, label: 'Obesitas' },
  }

  return (
    <SectionWrapper id="bmi" className="py-24 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeUp}>
            <span className="text-accent text-sm font-bold uppercase tracking-widest">Cek Kondisi Tubuhmu</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4 tracking-tight">
              Kalkulator Berat Badan Ideal
            </h2>
            <p className="text-white/60 leading-relaxed mb-8">
              Masukkan tinggi dan berat badanmu untuk mengetahui BMI dan berat badan ideal. Ketahui berapa kg yang perlu diturunkan atau dinaikkan untuk mencapai kondisi optimal.
            </p>

            <div className="space-y-4">
              {/* Gender */}
              <div>
                <label className="text-white/60 text-sm font-medium mb-2 block">Jenis Kelamin</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['male', 'female'] as Gender[]).map(g => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`py-3 rounded-xl font-bold text-sm transition-all ${
                        gender === g ? 'bg-accent text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {g === 'male' ? '👨 Laki-laki' : '👩 Perempuan'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-white/60 text-sm font-medium mb-2 block">Tinggi (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={e => setHeight(e.target.value)}
                    placeholder="170"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-sm font-medium mb-2 block">Berat (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    placeholder="70"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-sm font-medium mb-2 block">Usia (tahun)</label>
                  <input
                    type="number"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    placeholder="25"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <Button className="w-full rounded-xl py-3 gap-2" onClick={handleCalculate}>
                <Scale className="w-5 h-5" />
                Hitung Sekarang
              </Button>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} custom={1}>
            {!result ? (
              <div className="bg-white/5 rounded-3xl border border-white/10 p-10 text-center">
                <div className="text-6xl mb-4">⚖️</div>
                <p className="text-white/50 text-sm">Isi data di sebelah kiri untuk melihat hasil kalkulasi berat badan ideal Anda</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-7 shadow-2xl"
              >
                {/* BMI Score */}
                <div className={`rounded-2xl p-5 border mb-5 ${statusConfig[result.status].bg}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Indeks Massa Tubuh (BMI)</p>
                      <p className={`text-5xl font-black mt-1 ${statusConfig[result.status].color}`}>{result.bmi}</p>
                      <p className={`font-bold mt-1 ${statusConfig[result.status].color}`}>{result.category}</p>
                    </div>
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${statusConfig[result.status].color} bg-white/60`}>
                      {React.createElement(statusConfig[result.status].icon, { className: 'w-8 h-8' })}
                    </div>
                  </div>
                </div>

                {/* BMI Scale */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Kurang (&lt;18.5)</span>
                    <span>Normal</span>
                    <span>Lebih (&gt;25)</span>
                  </div>
                  <div className="h-3 rounded-full bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-400 relative">
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-800 rounded-full shadow-md"
                      style={{ left: `${Math.min(Math.max(((result.bmi - 10) / 30) * 100, 0), 100)}%`, transform: 'translateX(-50%) translateY(-50%)' }}
                    />
                  </div>
                </div>

                {/* Ideal weight */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Berat Ideal</p>
                    <p className="font-black text-primary">{result.idealWeightMin} – {result.idealWeightMax} kg</p>
                  </div>
                  <div className={`rounded-xl p-4 ${result.difference > 0 ? 'bg-red-50' : result.difference < 0 ? 'bg-blue-50' : 'bg-green-50'}`}>
                    <p className="text-xs text-gray-400 mb-1">
                      {result.difference > 0 ? 'Perlu Turunkan' : result.difference < 0 ? 'Perlu Naikkan' : 'Status'}
                    </p>
                    <p className={`font-black text-lg ${result.difference > 0 ? 'text-red-600' : result.difference < 0 ? 'text-blue-600' : 'text-green-600'}`}>
                      {result.difference === 0 ? '✓ Ideal!' : `${Math.abs(result.difference)} kg`}
                    </p>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="bg-accent/5 rounded-xl p-4 border border-accent/20">
                  <p className="text-xs font-bold text-accent uppercase tracking-wide mb-1">Rekomendasi</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{result.recommendation}</p>
                </div>

                <Link to="/daftar" className="block mt-4">
                  <Button className="w-full rounded-xl gap-2" size="sm">
                    Mulai Program Fitness Sekarang
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  )
}

// ── PRICING ──
const Pricing: React.FC = () => (
  <SectionWrapper id="harga" className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div variants={fadeUp} className="text-center mb-16">
        <span className="text-accent text-sm font-bold uppercase tracking-widest">Harga</span>
        <h2 className="text-4xl sm:text-5xl font-black text-primary mt-3 mb-4 tracking-tight">
          Pilih Paket Terbaik
        </h2>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-8 items-center">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.id}
            variants={fadeUp}
            custom={i}
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`rounded-3xl overflow-hidden border transition-all duration-300 ${
              plan.popular ? 'border-accent shadow-2xl scale-105' : 'border-gray-200 hover:shadow-card'
            }`}
          >
            {plan.popular && (
              <div className="bg-accent py-2 text-center">
                <span className="text-white text-xs font-black uppercase tracking-widest">⭐ Paling Populer</span>
              </div>
            )}
            <div className={`p-7 ${plan.popular ? 'bg-primary' : 'bg-white'}`}>
              <h3 className={`text-2xl font-black mb-1 ${plan.popular ? 'text-white' : 'text-primary'}`}>{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className={`text-3xl font-black ${plan.popular ? 'text-accent' : 'text-primary'}`}>{formatCurrency(plan.price['1'])}</span>
                <span className={`text-sm ${plan.popular ? 'text-white/60' : 'text-muted'}`}>/bulan</span>
              </div>
            </div>
            <div className={`p-7 ${plan.popular ? 'bg-secondary' : 'bg-gray-50'}`}>
              <ul className="space-y-3 mb-6">
                {plan.features.map(feat => (
                  <li key={feat} className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-accent' : 'text-green-500'}`} />
                    <span className={`text-sm ${plan.popular ? 'text-white/80' : 'text-gray-700'}`}>{feat}</span>
                  </li>
                ))}
              </ul>
              <Link to="/daftar">
                <Button className={`w-full rounded-xl ${!plan.popular ? 'bg-primary hover:bg-secondary' : ''}`}>Pilih {plan.name}</Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </SectionWrapper>
)

// ── TESTIMONIALS ──
const Testimonials: React.FC = () => (
  <SectionWrapper className="py-24 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div variants={fadeUp} className="text-center mb-16">
        <span className="text-accent text-sm font-bold uppercase tracking-widest">Testimoni</span>
        <h2 className="text-4xl sm:text-5xl font-black text-primary mt-3 mb-4 tracking-tight">Kata Member Kami</h2>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.id}
            variants={fadeUp}
            custom={i}
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-white rounded-2xl p-6 shadow-card border border-gray-100"
          >
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-gray-700 text-sm leading-relaxed mb-5">"{t.text}"</p>
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent font-bold text-sm">{t.avatar}</div>
              <div>
                <p className="font-bold text-primary text-sm">{t.name}</p>
                <p className="text-muted text-xs">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </SectionWrapper>
)

// ── CTA ──
const CTABanner: React.FC = () => (
  <SectionWrapper className="py-24 bg-hero-gradient relative overflow-hidden">
    <div className="absolute inset-0 bg-noise opacity-20" />
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <motion.div variants={fadeUp}>
        <h2 className="heading-display text-5xl sm:text-7xl text-white mb-4 leading-none">SIAP BERGABUNG?</h2>
        <p className="text-white/70 text-xl mb-8 max-w-2xl mx-auto">
          Daftar sekarang dan dapatkan <span className="text-accent font-bold">sesi konsultasi pertama gratis!</span>
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/daftar">
            <Button size="lg" className="rounded-2xl px-10 text-lg gap-2">
              Daftar Gratis Sekarang
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/cek-status">
            <button className="flex items-center gap-2 px-8 py-3.5 rounded-2xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all text-base">
              🔍 Cek Status Keanggotaan
            </button>
          </Link>
        </div>
        <p className="mt-6 text-white/30 text-sm">
          Sudah daftar? <Link to="/cek-status" className="text-white/60 hover:text-accent underline transition-colors">Cek status keanggotaan Anda</Link>
          {' '} · {' '}
          <Link to="/admin/login" className="text-white/60 hover:text-accent underline transition-colors">Login Admin</Link>
        </p>
      </motion.div>
    </div>
  </SectionWrapper>
)

// ── FOOTER ──
const Footer: React.FC = () => (
  <footer id="kontak" className="bg-primary text-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="heading-display text-xl tracking-widest">GYM CEMERLANG</span>
          </div>
          <p className="text-white/50 text-sm leading-relaxed mb-5">
            Platform pendaftaran member gym online terpercaya. Bergabung dan mulai perjalanan fitnessmu bersama kami.
          </p>
          <div className="flex gap-3">
            {[Instagram, Facebook, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-accent transition-colors duration-200">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="font-bold uppercase tracking-widest text-sm mb-4">Menu</p>
          <ul className="space-y-2.5">
            {['Beranda', 'Program', 'Fasilitas', 'Harga', 'Alat Gym', 'Trainer', 'Kontak'].map(l => (
              <li key={l}>
                <a href={`#${l.toLowerCase().replace(' ', '-')}`} className="text-white/50 hover:text-white text-sm transition-colors">{l}</a>
              </li>
            ))}
            <li className="pt-1 border-t border-white/10">
              <Link to="/cek-status" className="text-white/50 hover:text-accent text-sm transition-colors">🔍 Cek Status Keanggotaan</Link>
            </li>
            <li>
              <Link to="/daftar" className="text-white/50 hover:text-accent text-sm transition-colors">📝 Daftar Member</Link>
            </li>
            <li>
              <Link to="/admin/login" className="text-white/30 hover:text-white/60 text-sm transition-colors">🔒 Login Admin</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-bold uppercase tracking-widest text-sm mb-4">Program</p>
          <ul className="space-y-2.5">
            {['Fitness Dasar', 'Cardio Intensif', 'Strength Training', 'Yoga & Pilates'].map(l => (
              <li key={l}><a href="#program" className="text-white/50 hover:text-white text-sm transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-bold uppercase tracking-widest text-sm mb-4">Kontak</p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-white/50 text-sm">
              <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
              Jl. Raya Fitness No. 88, Surabaya, Jawa Timur 60111
            </li>
            <li className="flex items-center gap-3 text-white/50 text-sm">
              <Phone className="w-4 h-4 text-accent flex-shrink-0" />
              +62 31 1234 5678
            </li>
            <li className="flex items-center gap-3 text-white/50 text-sm">
              <Mail className="w-4 h-4 text-accent flex-shrink-0" />
              info@gymcemerlang.com
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-white/40 text-sm">© 2026 Gym Cemerlang. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Privasi</a>
          <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Syarat & Ketentuan</a>
        </div>
      </div>
    </div>
  </footer>
)

// ── MAIN ──
const LandingPage: React.FC = () => (
  <div className="min-h-screen">
    <Navbar />
    <Hero />
    <Features />
    <Programs />
    <EquipmentGuide />
    <TrainersSection />
    <BMICalculator />
    <Pricing />
    <Testimonials />
    <CTABanner />
    <Footer />
  </div>
)

export default LandingPage
