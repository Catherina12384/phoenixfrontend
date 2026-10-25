// Mirrors the backend rules (PasswordPolicy, PhoneNumbers). The server stays the authority.
export const PASSWORD_RULES = [
  { id: 'length', label: '8 to 16 characters', test: p => p.length >= 8 && p.length <= 16 },
  { id: 'lower', label: 'A lowercase letter', test: p => /[a-z]/.test(p) },
  { id: 'upper', label: 'An uppercase letter', test: p => /[A-Z]/.test(p) },
  { id: 'digit', label: 'A digit', test: p => /\d/.test(p) },
  { id: 'symbol', label: 'A symbol, like @ # $ %', test: p => /[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/.test(p) },
  { id: 'chars', label: 'No spaces or accented characters', test: p => /^[\x21-\x7E]+$/.test(p) },
]

export const isPasswordValid = p => PASSWORD_RULES.every(rule => rule.test(p))

const INDIA_PHONE = /^(?:\+91|91|0)?([6-9]\d{9})$/
const stripPhone = raw => raw.replace(/[\s\-()]/g, '')

export const isValidPhone = raw => INDIA_PHONE.test(stripPhone(raw))
export const isValidEmail = raw => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.trim())

export function maskPhone(raw) {
  const match = INDIA_PHONE.exec(stripPhone(String(raw)))
  return match ? `+91 ${'•'.repeat(6)}${match[1].slice(-4)}` : 'your phone'
}

export function validateLogin({ identifier, password }) {
  const errors = {}
  const id = identifier.trim()
  if (!id) errors.identifier = 'Enter your email or mobile number'
  else if (id.includes('@') ? !isValidEmail(id) : !isValidPhone(id)) {
    errors.identifier = 'Enter a valid email or 10-digit mobile number'
  }
  if (!password) errors.password = 'Enter your password'
  return errors
}

export function validateRegistration(v) {
  const errors = {}
  if (!v.name.trim()) errors.name = 'Enter your name'
  if (!isValidEmail(v.email)) errors.email = 'Enter a valid email address'
  if (!isValidPhone(v.phone)) errors.phone = 'Enter a valid 10-digit Indian mobile number'
  if (!isPasswordValid(v.password)) errors.password = 'Password does not meet all the requirements'
  if (v.confirmPassword !== v.password) errors.confirmPassword = 'Passwords do not match'
  return errors
}

export function validateNewPassword(password, confirm, otherwise = {}) {
  const errors = { ...otherwise }
  if (!isPasswordValid(password)) errors.password = 'Password does not meet all the requirements'
  if (confirm !== password) errors.confirmPassword = 'Passwords do not match'
  return errors
}
