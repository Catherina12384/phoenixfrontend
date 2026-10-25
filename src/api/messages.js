import { ApiError } from './http.js'

export function formatWait(seconds) {
  const s = Math.max(1, Math.ceil(seconds))
  if (s < 60) return `${s} ${s === 1 ? 'second' : 'seconds'}`
  const m = Math.ceil(s / 60)
  if (m < 60) return `${m} ${m === 1 ? 'minute' : 'minutes'}`
  const h = Math.ceil(m / 60)
  return `${h} ${h === 1 ? 'hour' : 'hours'}`
}

/** m:ss, for countdown labels. */
export function formatClock(seconds) {
  const s = Math.max(0, Math.ceil(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

function rateLimitMessage({ detail, retryAfterSeconds }) {
  const wait = retryAfterSeconds ? formatWait(retryAfterSeconds) : null
  if (/wait before requesting/i.test(detail)) return wait ? `Please wait ${wait} before requesting another OTP.` : detail
  const base = detail.replace(/\s*(please\s+)?try again later\.?\s*$/i, '').trim()
  return wait ? `${base} Please try again in ${wait}.` : detail
}

/** Human message for an error thrown by the API client. */
export function messageFor(error) {
  if (!error) return ''
  if (!(error instanceof ApiError)) return 'Something went wrong. Please try again.'
  if (error.status === 429) return rateLimitMessage(error)
  if (error.status === 400 && Object.keys(error.errors).length > 0) return 'Please check the highlighted fields.'
  return error.detail
}

/** Per-field messages from a 400 validation response ({} for anything else). */
export const fieldErrorsOf = error => (error instanceof ApiError ? error.errors : {})

/** The banner text for a form: client-side validation wins, otherwise the server error. */
export function formMessage(error, clientErrors = {}) {
  return Object.keys(clientErrors).length > 0 ? 'Please check the highlighted fields.' : messageFor(error)
}
