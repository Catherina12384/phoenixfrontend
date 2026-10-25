// Where each role lands after login. Change a destination here and nowhere else.
export const ROLE_HOME = { ADMIN: '/admin', STAFF: '/staff', CUSTOMER: '/catalogue' }

const AUTH_PATHS = ['/login', '/signup', '/forgot-password', '/change-password']

/** Turns a router location (or string) into a safe in-app path, or null. */
function safePath(from) {
  if (!from) return null
  const path = typeof from === 'string' ? from : `${from.pathname ?? ''}${from.search ?? ''}${from.hash ?? ''}`
  if (!path.startsWith('/') || path.startsWith('//')) return null
  const isAuthPage = AUTH_PATHS.some(p => path === p || path.startsWith(`${p}?`) || path.startsWith(`${p}/`))
  return isAuthPage ? null : path
}

/** Customers return to where they came from; staff and admins go to their own home. */
export function postLoginPath(user, from) {
  if (user.mustChangePassword) return '/change-password'
  if (user.role === 'CUSTOMER') return safePath(from) ?? ROLE_HOME.CUSTOMER
  return ROLE_HOME[user.role] ?? '/'
}
