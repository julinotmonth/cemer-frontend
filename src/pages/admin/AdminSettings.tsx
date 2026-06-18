import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Save, Building2, Lock, Bell, Palette } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useAuthStore } from '@/store/authStore'
import { settingsApi } from '@/lib/api'

const AdminSettings: React.FC = () => {
  const { user } = useAuthStore()
  const [saving, setSaving] = useState(false)
  const [gymSettings, setGymSettings] = useState<any>({})
  const [settingValues, setSettingValues] = useState<Record<string, string>>({})

  useEffect(() => {
    settingsApi.get().then(res => {
      if (res.success) {
        setGymSettings(res.data)
        setSettingValues({
          'Nama Gym': res.data.gymName || '',
          'Alamat': res.data.address || '',
          'Nomor Telepon': res.data.phone || '',
          'Email Bisnis': res.data.email || '',
        })
      }
    }).catch(() => {})
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await settingsApi.update({
        gymName: settingValues['Nama Gym'] || gymSettings.gymName,
        address: settingValues['Alamat'] || gymSettings.address,
        phone: settingValues['Nomor Telepon'] || gymSettings.phone,
        email: settingValues['Email Bisnis'] || gymSettings.email,
      })
      toast.success('Pengaturan berhasil disimpan!')
    } catch {
      toast.error('Gagal menyimpan pengaturan')
    }
    setSaving(false)
  }

  type FieldConfig = {
    label: string
    placeholder?: string
    defaultValue?: string
    type?: string
    readOnly?: boolean
  }

  type SectionConfig = {
    icon: React.ElementType
    title: string
    fields: FieldConfig[]
  }

  const sections: SectionConfig[] = [
    {
      icon: Building2,
      title: 'Informasi Gym',
      fields: [
        { label: 'Nama Gym', placeholder: 'Gym Cemerlang', defaultValue: 'Gym Cemerlang' },
        { label: 'Alamat', placeholder: 'Jl. Raya Fitness No. 88, Surabaya' },
        { label: 'Nomor Telepon', placeholder: '+62 31 1234 5678' },
        { label: 'Email Bisnis', placeholder: 'info@gymcemerlang.com' },
      ],
    },
    {
      icon: Lock,
      title: 'Keamanan Akun',
      fields: [
        { label: 'Email Admin', defaultValue: user?.email, readOnly: true },
        { label: 'Password Baru', placeholder: '••••••••', type: 'password' },
        { label: 'Konfirmasi Password', placeholder: '••••••••', type: 'password' },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-primary tracking-tight">Pengaturan</h1>
        <p className="text-muted text-sm mt-1">Kelola informasi dan konfigurasi sistem.</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {sections.map((section, si) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.1 }}
              className="bg-white rounded-2xl p-7 shadow-card border border-gray-100"
            >
              <h2 className="font-bold text-primary mb-5 flex items-center gap-2">
                <section.icon className="w-5 h-5 text-accent" />
                {section.title}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {section.fields.map((field) => (
                  <Input
                    key={field.label}
                    label={field.label}
                    placeholder={field.placeholder}
                    defaultValue={field.defaultValue}
                    type={field.type || 'text'}
                    readOnly={field.readOnly}
                    className={field.readOnly ? 'bg-gray-50 cursor-not-allowed' : ''}
                  />
                ))}
              </div>
            </motion.div>
          ))}

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-7 shadow-card border border-gray-100"
          >
            <h2 className="font-bold text-primary mb-5 flex items-center gap-2">
              <Bell className="w-5 h-5 text-accent" />
              Notifikasi
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Email konfirmasi pendaftaran baru', desc: 'Kirim email otomatis ke member baru', defaultChecked: true },
                { label: 'Notifikasi keanggotaan akan kedaluwarsa', desc: 'Ingatkan member 7 hari sebelum expired', defaultChecked: true },
                { label: 'Laporan mingguan via email', desc: 'Rekap data setiap Senin pagi', defaultChecked: false },
                { label: 'Notifikasi pendaftaran baru ke admin', desc: 'Alert ketika ada member baru mendaftar', defaultChecked: true },
              ].map((notif) => (
                <label key={notif.label} className="flex items-start gap-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    defaultChecked={notif.defaultChecked}
                    className="w-4 h-4 accent-accent mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-semibold text-primary group-hover:text-accent transition-colors">{notif.label}</p>
                    <p className="text-xs text-muted mt-0.5">{notif.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl p-6 shadow-card border border-gray-100"
          >
            <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-accent" />
              Profil Admin
            </h3>
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-white text-2xl font-black mb-3 shadow-glow-sm">
                {user?.name.charAt(0)}
              </div>
              <p className="font-bold text-primary">{user?.name}</p>
              <p className="text-sm text-muted">{user?.role}</p>
              <p className="text-xs text-muted mt-1">{user?.email}</p>
            </div>
            <Button onClick={handleSave} loading={saving} className="w-full rounded-xl gap-2">
              <Save className="w-4 h-4" />
              Simpan Perubahan
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-red-50 rounded-2xl p-5 border border-red-100"
          >
            <h3 className="font-bold text-red-700 mb-2">Zona Berbahaya</h3>
            <p className="text-xs text-red-500 mb-4">Tindakan ini tidak dapat dibatalkan. Harap berhati-hati.</p>
            <Button variant="destructive" size="sm" className="w-full rounded-xl">
              Reset Semua Data
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings