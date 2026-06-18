# 🏋️ Gym Cemerlang — Sistem Informasi Pendaftaran Member

Platform web-based untuk pendaftaran keanggotaan gym secara online.

## 🚀 Cara Menjalankan

### Persyaratan
- Node.js v18+ 
- npm atau pnpm

### Langkah Instalasi

```bash
# 1. Masuk ke folder project
cd gym-cemerlang

# 2. Install dependencies
npm install

# 3. Jalankan development server
npm run dev
```

Buka browser dan akses: **http://localhost:5173**

---

## 📄 Halaman & Fitur

| Halaman | URL | Keterangan |
|---|---|---|
| Landing Page | `/` | Homepage publik dengan semua section |
| Pendaftaran | `/daftar` | Form multi-step (3 langkah) |
| Login Admin | `/admin/login` | Halaman login admin |
| Dashboard Admin | `/admin` | Statistik & grafik |
| Daftar Member | `/admin/members` | Tabel dengan filter & search |
| Detail Member | `/admin/members/:id` | Profil lengkap member |
| Tambah Member | `/admin/members/new` | Form tambah manual |
| Laporan | `/admin/reports` | Chart & analitik |
| Pengaturan | `/admin/settings` | Konfigurasi sistem |

---

## 🔑 Demo Login Admin

```
Email    : admin@gymcemerlang.com
Password : admin123
```

---

## 🛠️ Tech Stack

- **Vite + React + TypeScript**
- **Tailwind CSS v3** — Styling
- **Framer Motion** — Animasi
- **React Router DOM v6** — Routing
- **React Hook Form + Zod** — Form & Validasi
- **Zustand** — State Management
- **Recharts** — Grafik & Chart
- **Sonner** — Toast Notifications
- **Lucide React** — Icons

---

## 🎨 Desain

- **Primary**: #1A1A2E (Deep Navy)
- **Accent**: #E94560 (Energetic Red)
- **Font**: Bebas Neue (display) + DM Sans (body)
- Dark theme untuk hero & admin navbar
- Light theme untuk konten & form
- Glassmorphism cards pada elemen dark section

---

## 📁 Struktur Folder

```
src/
├── components/
│   ├── ui/          # Komponen reusable (Button, Card, Badge, dll)
│   ├── layout/      # Navbar, AdminLayout
│   └── admin/       # Sidebar admin
├── pages/
│   ├── LandingPage.tsx
│   ├── RegisterPage.tsx
│   └── admin/
│       ├── AdminLogin.tsx
│       ├── AdminDashboard.tsx
│       ├── AdminMembers.tsx
│       ├── AdminMemberDetail.tsx
│       ├── AdminMemberNew.tsx
│       ├── AdminReports.tsx
│       └── AdminSettings.tsx
├── store/           # Zustand stores
├── lib/             # Utils & data
└── types/           # TypeScript types
```
