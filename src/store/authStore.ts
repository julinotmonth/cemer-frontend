import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AdminUser } from '@/types'
import { authApi } from '@/lib/api'

interface AuthState {
  user: AdminUser | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        try {
          const res = await authApi.login(email, password)
          if (res.success && res.token) {
            set({ user: res.user, token: res.token, isAuthenticated: true })
            return true
          }
          return false
        } catch {
          return false
        }
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    { name: 'gym-auth' }
  )
)
