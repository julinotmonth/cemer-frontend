import { create } from 'zustand'
import { Notification } from '@/types'
import { notificationsApi } from '@/lib/api'

interface NotificationState {
  notifications: Notification[]
  loading: boolean
  fetchNotifications: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  unreadCount: () => number
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: [],
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true })
    try {
      const res = await notificationsApi.list()
      set({ notifications: res.data, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  markAsRead: async (id) => {
    await notificationsApi.markRead(id)
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }))
  },

  markAllAsRead: async () => {
    await notificationsApi.markAllRead()
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }))
  },

  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}))
