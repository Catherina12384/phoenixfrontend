import { useCallback, useEffect, useMemo, useState } from 'react'
import { authApi } from '../api/authApi.js'
import { setUnauthorizedHandler } from '../api/http.js'
import { AuthContext } from './authContext.js'

/**
 * Holds the signed-in user. The session itself is an httpOnly cookie that JavaScript cannot read,
 * so on load we ask /api/auth/me who we are. Any 401 from the API clears the user.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'ready'

  useEffect(() => {
    let active = true
    setUnauthorizedHandler(() => { if (active) setUser(null) })
    authApi.me()
      .then(me => { if (active) setUser(me) })
      .catch(() => {})
      .finally(() => { if (active) setStatus('ready') })
    return () => { active = false; setUnauthorizedHandler(null) }
  }, [])

  const adopt = useCallback(({ user: next }) => { setUser(next); return next }, [])

  const login = useCallback(async (identifier, password) => adopt(await authApi.login(identifier, password)), [adopt])
  const completeRegistration = useCallback(
    async (registrationId, otp) => adopt(await authApi.verifyRegistration(registrationId, otp)), [adopt])
  const changePassword = useCallback(async payload => adopt(await authApi.changePassword(payload)), [adopt])
  const logout = useCallback(async () => {
    try { await authApi.logout() } catch { /* the local session is cleared either way */ }
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, status, login, completeRegistration, changePassword, logout }),
    [user, status, login, completeRegistration, changePassword, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
