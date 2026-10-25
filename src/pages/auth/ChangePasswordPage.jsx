import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { fieldErrorsOf, formMessage, formatClock } from '../../api/messages.js'
import { postLoginPath } from '../../auth/roles.js'
import { useAuth } from '../../auth/useAuth.js'
import { validateNewPassword } from '../../auth/validation.js'
import AuthLayout from '../../components/auth/AuthLayout.jsx'
import FormAlert from '../../components/auth/FormAlert.jsx'
import NewPasswordFields from '../../components/auth/NewPasswordFields.jsx'
import PasswordField from '../../components/auth/PasswordField.jsx'
import { useRetryLock } from '../../hooks/useRetryLock.js'
import { useSubmit } from '../../hooks/useSubmit.js'

/** Forced for staff with a temporary password; optional for everyone else. */
export default function ChangePasswordPage() {
  const { user, changePassword, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const from = location.state?.from
  const forced = user.mustChangePassword

  const [current, setCurrent] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [clientErrors, setClientErrors] = useState({})
  const { run, pending, error } = useSubmit(changePassword)
  const lock = useRetryLock(error)
  const errors = { ...fieldErrorsOf(error), ...clientErrors }

  const submit = async e => {
    e.preventDefault()
    const extra = {}
    if (!current) extra.currentPassword = 'Enter your current password'
    const found = validateNewPassword(password, confirm, extra)
    if (!found.password && password === current) found.password = 'New password must be different from the current one'
    setClientErrors(found)
    if (Object.keys(found).length > 0) return
    const result = await run({ currentPassword: current, newPassword: password, confirmPassword: confirm })
    if (result.ok) navigate(postLoginPath(result.value, from), { replace: true })
  }

  const signOut = async () => { await logout(); navigate('/', { replace: true }) }

  return (
    <AuthLayout
      title={forced ? 'Set a new password' : 'Change password'}
      subtitle={forced ? 'Your account uses a temporary password. Choose a new one to continue.' : 'Choose a new password for your account.'}
    >
      <form className="auth-form" onSubmit={submit} noValidate>
        <PasswordField label={forced ? 'Temporary password' : 'Current password'} name="currentPassword"
          autoComplete="current-password" value={current} onChange={setCurrent} error={errors.currentPassword} />
        <NewPasswordFields passwordLabel="New password" confirmLabel="Confirm new password"
          passwordName="newPassword" password={password} confirm={confirm}
          onPassword={setPassword} onConfirm={setConfirm}
          passwordError={errors.password ?? errors.newPassword} confirmError={errors.confirmPassword} />
        <FormAlert>{formMessage(error, clientErrors)}</FormAlert>
        <button className="btn auth-submit" type="submit" disabled={pending || lock > 0}>
          {pending ? 'Saving…' : lock > 0 ? `Try again in ${formatClock(lock)}` : 'Save new password'}
        </button>
        <p className="auth-foot">
          {forced
            ? <button type="button" className="alink-btn" onClick={signOut}>Log out instead</button>
            : <Link className="alink" to={postLoginPath(user, from)}>Cancel</Link>}
        </p>
      </form>
    </AuthLayout>
  )
}
