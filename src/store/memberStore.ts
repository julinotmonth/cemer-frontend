import { create } from 'zustand'
import { Member, RegistrationFormData } from '@/types'
import { membersApi } from '@/lib/api'

interface MemberState {
  members: Member[]
  loading: boolean
  error: string | null
  pagination: { total: number; page: number; limit: number; pages: number } | null
  fetchMembers: (params?: { search?: string; status?: string; plan?: string; page?: number }) => Promise<void>
  addMember: (data: RegistrationFormData) => Promise<Member>
  updateMember: (id: string, data: Partial<Member>) => Promise<void>
  deleteMember: (id: string) => Promise<void>
  getMemberById: (id: string) => Member | undefined
  fetchMemberById: (id: string) => Promise<Member | null>
}

function formatMember(raw: any): Member {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    phone: raw.phone,
    birthDate: raw.birthDate || raw.birth_date,
    gender: raw.gender,
    address: raw.address,
    plan: raw.plan,
    duration: raw.duration,
    status: raw.status,
    registeredAt: raw.registeredAt || raw.registered_at,
    startDate: raw.startDate || raw.start_date,
    endDate: raw.endDate || raw.end_date,
    referenceNumber: raw.referenceNumber || raw.reference_number,
    trainerId: raw.trainerId || raw.trainer_id,
    trainerSchedule: raw.trainerScheduleId || raw.trainer_schedule_id,
    heightCm: raw.heightCm || raw.height_cm,
    weightKg: raw.weightKg || raw.weight_kg,
  }
}

export const useMemberStore = create<MemberState>()((set, get) => ({
  members: [],
  loading: false,
  error: null,
  pagination: null,

  fetchMembers: async (params = {}) => {
    set({ loading: true, error: null })
    try {
      const res = await membersApi.list(params)
      set({
        members: res.data.map(formatMember),
        pagination: res.pagination,
        loading: false,
      })
    } catch (err: any) {
      set({ error: err.message, loading: false })
    }
  },

  addMember: async (data: RegistrationFormData) => {
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      birthDate: data.birthDate,
      gender: data.gender,
      address: data.address,
      plan: data.plan,
      duration: data.duration,
      trainerId: data.trainerId,
      trainerSchedule: data.trainerSchedule,
      heightCm: data.heightCm,
      weightKg: data.weightKg,
    }
    const res = await membersApi.register(payload)
    const newMember = formatMember(res.data)
    set((state) => ({ members: [newMember, ...state.members] }))
    return newMember
  },

  updateMember: async (id, data) => {
    const res = await membersApi.update(id, data)
    const updated = formatMember(res.data)
    set((state) => ({
      members: state.members.map((m) => (m.id === id ? updated : m)),
    }))
  },

  deleteMember: async (id) => {
    await membersApi.delete(id)
    set((state) => ({ members: state.members.filter((m) => m.id !== id) }))
  },

  getMemberById: (id) => get().members.find((m) => m.id === id),

  fetchMemberById: async (id) => {
    try {
      const res = await membersApi.getById(id)
      return formatMember(res.data)
    } catch {
      return null
    }
  },
}))
