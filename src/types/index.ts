export type MembershipPlan = 'basic' | 'regular' | 'premium'
export type MemberStatus = 'active' | 'pending' | 'expired'
export type MembershipDuration = '1' | '3' | '6' | '12'
export type Gender = 'male' | 'female'
export type NotificationType = 'info' | 'success' | 'warning' | 'promo'

export interface Member {
  id: string
  name: string
  email: string
  phone: string
  birthDate: string
  gender: Gender
  address: string
  plan: MembershipPlan
  duration: MembershipDuration
  status: MemberStatus
  registeredAt: string
  startDate: string
  endDate: string
  referenceNumber: string
  trainerId?: string
  trainerSchedule?: string
  heightCm?: number
  weightKg?: number
}

export interface PlanDetail {
  id: MembershipPlan
  name: string
  price: {
    '1': number
    '3': number
    '6': number
    '12': number
  }
  features: string[]
  popular?: boolean
  color: string
}

export interface RegistrationFormData {
  name: string
  email: string
  phone: string
  birthDate: string
  gender: Gender
  address: string
  plan: MembershipPlan
  duration: MembershipDuration
  trainerId?: string
  trainerSchedule?: string
  heightCm?: number
  weightKg?: number
  agreeTerms: boolean
}

export interface AdminUser {
  email: string
  name: string
  role: string
}

export interface DashboardStats {
  totalMembers: number
  thisMonthRegistrations: number
  activeMembers: number
  monthlyRevenue: number
}

export interface ChartData {
  month: string
  registrations: number
  revenue: number
}

export interface Trainer {
  id: string
  name: string
  specialization: string
  experience: string
  avatar: string
  rating: number
  certifications: string[]
  availableSchedules: TrainerSchedule[]
  bio: string
}

export interface TrainerSchedule {
  id: string
  day: string
  time: string
  slots: number
  bookedSlots: number
}

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  date: string
  read: boolean
}

export interface GymEquipment {
  id: string
  name: string
  category: string
  icon: string
  description: string
  benefits: string[]
  muscleGroups: string[]
  difficulty: 'Pemula' | 'Menengah' | 'Lanjutan'
  tips: string[]
}

export interface BodyMetrics {
  heightCm: number
  weightKg: number
  gender: Gender
  age: number
}

export interface EquipmentIssue {
  id: string
  name: string
  category: string
  icon: string
  issues: {
    month: string
    count: number
    description: string
  }[]
  totalIssues: number
  lastMaintenance: string
  status: 'baik' | 'perlu-perhatian' | 'kritis'
  maintenanceTips: string[]
}

export interface BMIResult {
  bmi: number
  category: string
  idealWeightMin: number
  idealWeightMax: number
  difference: number
  status: 'underweight' | 'normal' | 'overweight' | 'obese'
  recommendation: string
}
