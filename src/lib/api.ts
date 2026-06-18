// API base URL — change to your backend URL in production
const API_BASE = import.meta.env.VITE_API_URL || 'https://cemer-back-production.up.railway.app/api'

// Helper: get token from localStorage
function getToken(): string | null {
  try {
    const auth = localStorage.getItem('gym-auth')
    if (!auth) return null
    return JSON.parse(auth)?.state?.token || null
  } catch {
    return null
  }
}

// Generic fetch wrapper
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  auth = false
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || `HTTP error ${res.status}`)
  }

  return data
}

// =============================================
// AUTH
// =============================================
export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<{ success: boolean; token: string; user: { email: string; name: string; role: string } }>(
      '/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }
    ),
  getProfile: () => apiFetch<{ success: boolean; user: any }>('/auth/profile', {}, true),
  updatePassword: (currentPassword: string, newPassword: string) =>
    apiFetch('/auth/password', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) }, true),
}

// =============================================
// MEMBERS
// =============================================
export const membersApi = {
  register: (data: any) =>
    apiFetch<{ success: boolean; data: any }>('/members/register', { method: 'POST', body: JSON.stringify(data) }),

  checkStatus: (q: string) =>
    apiFetch<{ success: boolean; data: any[] }>(`/members/check?q=${encodeURIComponent(q)}`),

  list: (params: { search?: string; status?: string; plan?: string; page?: number; limit?: number } = {}) => {
    const qs = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') qs.set(k, String(v)) })
    return apiFetch<{ success: boolean; data: any[]; pagination: any }>(`/members?${qs}`, {}, true)
  },

  getById: (id: string) =>
    apiFetch<{ success: boolean; data: any }>(`/members/${id}`, {}, true),

  create: (data: any) =>
    apiFetch<{ success: boolean; data: any }>('/members', { method: 'POST', body: JSON.stringify(data) }, true),

  update: (id: string, data: any) =>
    apiFetch<{ success: boolean; data: any }>(`/members/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, true),

  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/members/${id}`, { method: 'DELETE' }, true),
}

// =============================================
// DASHBOARD
// =============================================
export const dashboardApi = {
  getStats: () => apiFetch<{ success: boolean; data: any }>('/dashboard/stats', {}, true),
  getChartData: () => apiFetch<{ success: boolean; data: any[] }>('/dashboard/chart', {}, true),
  getPlanDistribution: () => apiFetch<{ success: boolean; data: any[] }>('/dashboard/plan-distribution', {}, true),
}

// =============================================
// TRAINERS
// =============================================
export const trainersApi = {
  list: () => apiFetch<{ success: boolean; data: any[] }>('/trainers'),
}

// =============================================
// NOTIFICATIONS
// =============================================
export const notificationsApi = {
  list: () => apiFetch<{ success: boolean; data: any[] }>('/notifications', {}, true),
  markRead: (id: string) =>
    apiFetch(`/notifications/${id}/read`, { method: 'PATCH' }, true),
  markAllRead: () =>
    apiFetch('/notifications/mark-all-read', { method: 'PATCH' }, true),
}

// =============================================
// SETTINGS
// =============================================
export const settingsApi = {
  get: () => apiFetch<{ success: boolean; data: any }>('/settings', {}, true),
  update: (data: any) =>
    apiFetch('/settings', { method: 'PUT', body: JSON.stringify(data) }, true),
}

// =============================================
// REPORTS
// =============================================
export const reportsApi = {
  get: (year?: number) =>
    apiFetch<{ success: boolean; data: any }>(`/reports${year ? `?year=${year}` : ''}`, {}, true),
}

// =============================================
// EQUIPMENT MAINTENANCE
// =============================================
export const equipmentApi = {
  getReport: () =>
    apiFetch<{ success: boolean; data: any[]; summary: any }>('/equipment/report', {}, true),

  list: () =>
    apiFetch<{ success: boolean; data: any[] }>('/equipment/list', {}, true),

  create: (data: { name: string; category: string; icon?: string; lastMaintenance?: string; maintenanceTips?: string[] }) =>
    apiFetch<{ success: boolean; data: any }>('/equipment', { method: 'POST', body: JSON.stringify(data) }, true),

  update: (id: string, data: any) =>
    apiFetch<{ success: boolean; data: any }>(`/equipment/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, true),

  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/equipment/${id}`, { method: 'DELETE' }, true),

  logMaintenance: (id: string, date?: string) =>
    apiFetch<{ success: boolean; data: any }>(`/equipment/${id}/maintenance`, { method: 'PATCH', body: JSON.stringify({ date }) }, true),

  getIssues: (id: string) =>
    apiFetch<{ success: boolean; data: any[] }>(`/equipment/${id}/issues`, {}, true),

  addIssue: (id: string, description: string, issueDate?: string) =>
    apiFetch<{ success: boolean; data: any }>(`/equipment/${id}/issues`, { method: 'POST', body: JSON.stringify({ description, issueDate }) }, true),

  deleteIssue: (issueId: string) =>
    apiFetch<{ success: boolean }>(`/equipment/issues/${issueId}`, { method: 'DELETE' }, true),
}

// =============================================
// TRAINER MANAGEMENT (admin)
// =============================================
export const trainerAdminApi = {
  list: () =>
    apiFetch<{ success: boolean; data: any[] }>('/admin/trainers', {}, true),

  create: (data: { name: string; specialization: string; experience?: string; avatar?: string; rating?: number; certifications?: string[]; bio?: string }) =>
    apiFetch<{ success: boolean; data: any }>('/admin/trainers', { method: 'POST', body: JSON.stringify(data) }, true),

  update: (id: string, data: any) =>
    apiFetch<{ success: boolean; data: any }>(`/admin/trainers/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, true),

  setStatus: (id: string, isActive: boolean, reason?: string) =>
    apiFetch<{ success: boolean; message: string }>(`/admin/trainers/${id}/status`, { method: 'PATCH', body: JSON.stringify({ isActive, reason }) }, true),

  delete: (id: string) =>
    apiFetch<{ success: boolean; message: string }>(`/admin/trainers/${id}`, { method: 'DELETE' }, true),

  addSchedule: (trainerId: string, day: string, time: string, slots?: number) =>
    apiFetch<{ success: boolean; data: any }>(`/admin/trainers/${trainerId}/schedules`, { method: 'POST', body: JSON.stringify({ day, time, slots }) }, true),

  updateSchedule: (scheduleId: string, data: { day?: string; time?: string; slots?: number; isActive?: boolean }) =>
    apiFetch<{ success: boolean; data: any }>(`/admin/schedules/${scheduleId}`, { method: 'PATCH', body: JSON.stringify(data) }, true),

  deleteSchedule: (scheduleId: string) =>
    apiFetch<{ success: boolean; message: string }>(`/admin/schedules/${scheduleId}`, { method: 'DELETE' }, true),
}
