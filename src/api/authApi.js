import { http, isMockAuthEnabled } from './http.js'

function readDemoUser() {
  try {
    return JSON.parse(localStorage.getItem('phoenix-demo-user') ?? 'null')
  } catch {
    return null
  }
}

function writeDemoUser(user) {
  if (!user) {
    localStorage.removeItem('phoenix-demo-user')
    return
  }
  localStorage.setItem('phoenix-demo-user', JSON.stringify(user))
}

function makeDemoUser(identifier, password) {
  const normalized = String(identifier ?? '').trim()
  const lowered = normalized.toLowerCase()
  const role = lowered.includes('admin') ? 'ADMIN' : lowered.includes('staff') || lowered.includes('employee') ? 'STAFF' : 'CUSTOMER'
  const name = role === 'ADMIN' ? 'Demo Admin' : role === 'STAFF' ? 'Demo Staff Member' : 'Demo Customer'

  return {
    id: 'demo-user',
    name,
    email: normalized.includes('@') ? normalized : `${normalized || 'demo'}@phoenix.local`,
    role,
    mustChangePassword: false,
    lastLoginAt: new Date().toISOString(),
    password,
  }
}

const mockAuthApi = {
  async login(identifier, password) {
    const user = makeDemoUser(identifier, password)
    writeDemoUser(user)
    return { user }
  },
  async logout() {
    writeDemoUser(null)
    return { ok: true }
  },
  async me() {
    const user = readDemoUser()
    if (!user) throw new Error('No active demo session')
    return user
  },
  async requestRegistrationOtp(form) {
    return { ok: true, form }
  },
  async verifyRegistration(registrationId, otp) {
    const user = makeDemoUser(registrationId || 'demo@phoenix.local', otp || 'demo-password')
    writeDemoUser(user)
    return { user }
  },
  async requestPasswordResetOtp(phone) {
    return { ok: true, phone }
  },
  async resetPassword(payload) {
    return { ok: true, payload }
  },
  async changePassword(payload) {
    const current = readDemoUser() ?? makeDemoUser('demo@phoenix.local', 'demo-password')
    const updated = { ...current, ...payload, mustChangePassword: false }
    writeDemoUser(updated)
    return { user: updated }
  },
}

// One function per backend endpoint. No state, no UI.
export const authApi = isMockAuthEnabled ? mockAuthApi : {
  login: (identifier, password) => http.post('/auth/login', { identifier, password }),
  logout: () => http.post('/auth/logout'),
  me: () => http.get('/auth/me'),
  requestRegistrationOtp: form => http.post('/auth/register/request-otp', form),
  verifyRegistration: (registrationId, otp) => http.post('/auth/register/verify', { registrationId, otp }),
  requestPasswordResetOtp: phone => http.post('/auth/forgot-password/request-otp', { phone }),
  resetPassword: payload => http.post('/auth/forgot-password/reset', payload),
  changePassword: payload => http.post('/auth/change-password', payload),
}
