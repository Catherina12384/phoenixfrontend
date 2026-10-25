import { useState } from 'react'
import { Link } from 'react-router-dom'
import { fieldErrorsOf, formMessage, formatClock } from '../../api/messages.js'
import { useAuth } from '../../auth/useAuth.js'
import { validateLogin } from '../../auth/validation.js'
import FormAlert from '../../components/auth/FormAlert.jsx'
import PasswordField from '../../components/auth/PasswordField.jsx'
import TextField from '../../components/auth/TextField.jsx'
import { useRetryLock } from '../../hooks/useRetryLock.js'
import { useSubmit } from '../../hooks/useSubmit.js'

/** Login for customers, staff and admins: email or mobile number + password. */
export default function LoginForm({ notice }) {
  const { login } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [clientErrors, setClientErrors] = useState({})
  const { run, pending, error } = useSubmit(login)
  const lock = useRetryLock(error)
  const errors = { ...fieldErrorsOf(error), ...clientErrors }

  const submit = async e => {
    e.preventDefault()
    const found = validateLogin({ identifier, password })
    setClientErrors(found)
    if (Object.keys(found).length > 0) return
    await run(identifier.trim(), password)
  }

  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <FormAlert kind="info">{notice}</FormAlert>
      <TextField label="Email or mobile number" name="identifier" autoComplete="username"
        value={identifier} onChange={setIdentifier} error={errors.identifier} />
      <PasswordField label="Password" name="password" autoComplete="current-password"
        value={password} onChange={setPassword} error={errors.password} />
      <p className="auth-row"><Link className="alink" to="/forgot-password">Forgot password?</Link></p>
      <FormAlert>{formMessage(error, clientErrors)}</FormAlert>
      <button className="btn auth-submit" type="submit" disabled={pending || lock > 0}>
        {pending ? 'Logging in…' : lock > 0 ? `Try again in ${formatClock(lock)}` : 'Log in'}
      </button>
    </form>
  )
}
