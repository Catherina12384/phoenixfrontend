// The only place that talks to fetch. Same-origin, cookie-based session (httpOnly, set by Spring Boot).
const BASE = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/$/, '')
// Local demo builds without a Spring Boot API should stay usable by default.
export const isMockAuthEnabled = import.meta.env.VITE_USE_MOCK_AUTH === 'true'

export class ApiError extends Error {
  constructor(status, detail, { errors = {}, retryAfterSeconds = null } = {}) {
    super(detail)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
    this.errors = errors
    this.retryAfterSeconds = retryAfterSeconds
  }
}

let unauthorizedHandler = () => {}

/** AuthProvider registers a callback here so any 401 clears the in-memory session. */
export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler ?? (() => {})
}

async function readBody(res) {
  const text = await res.text()
  if (!text) return null
  try { return JSON.parse(text) } catch { return null }
}

function toApiError(res, body) {
  const errors = { ...(body?.errors ?? {}) }
  // The backend reports a password mismatch under "passwordConfirmed"; the form field is "confirmPassword".
  if (errors.passwordConfirmed && !errors.confirmPassword) errors.confirmPassword = errors.passwordConfirmed
  const header = Number(res.headers.get('Retry-After'))
  const retryAfterSeconds = body?.retryAfterSeconds ?? (Number.isFinite(header) && header > 0 ? header : null)
  const fallback = res.status === 401 ? 'Your session has expired. Please log in again.' : 'Something went wrong. Please try again.'
  return new ApiError(res.status, body?.detail ?? body?.message ?? fallback, { errors, retryAfterSeconds })
}

export async function request(method, path, body) {
  const hasBody = body !== undefined
  let res
  try {
    res = await fetch(BASE + path, {
      method,
      credentials: 'same-origin',
      headers: { Accept: 'application/json', ...(hasBody ? { 'Content-Type': 'application/json' } : {}) },
      body: hasBody ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Check your connection and try again.')
  }
  const data = await readBody(res)
  if (res.ok) return data
  if (res.status === 401) unauthorizedHandler()
  throw toApiError(res, data)
}

export const http = {
  get: path => request('GET', path),
  post: (path, body = {}) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  delete: path => request('DELETE', path),
}
