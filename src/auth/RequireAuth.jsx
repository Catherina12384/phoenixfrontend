import { Navigate, useLocation } from 'react-router-dom'
import { ROLE_HOME } from './roles.js'
import { useAuth } from './useAuth.js'

/** Route guard. <RequireAuth roles={['ADMIN']}>...</RequireAuth> */
export default function RequireAuth({ roles, children }) {
  const { user, status } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <p className="auth-loading" role="status">Loading…</p>
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  if (user.mustChangePassword && location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace state={{ from: location }} />
  }
  if (roles && !roles.includes(user.role)) return <Navigate to={ROLE_HOME[user.role] ?? '/'} replace />
  return children
}
