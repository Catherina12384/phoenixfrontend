import { useState } from 'react'
import { authApi } from '../../api/authApi.js'
import { fieldErrorsOf, formMessage, formatClock } from '../../api/messages.js'
import { validateRegistration } from '../../auth/validation.js'
import FormAlert from '../../components/auth/FormAlert.jsx'
import NewPasswordFields from '../../components/auth/NewPasswordFields.jsx'
import TextField from '../../components/auth/TextField.jsx'
import { useRetryLock } from '../../hooks/useRetryLock.js'
import { useSubmit } from '../../hooks/useSubmit.js'

/** Signup step 1: collect details and ask the backend to send an OTP. */
export default function RegisterForm({ initialValues, onOtpSent }) {
  const [values, setValues] = useState(initialValues)
  const [clientErrors, setClientErrors] = useState({})
  const { run, pending, error } = useSubmit(authApi.requestRegistrationOtp)
  const lock = useRetryLock(error)
  const errors = { ...fieldErrorsOf(error), ...clientErrors }
  const set = key => value => setValues(v => ({ ...v, [key]: value }))

  const submit = async e => {
    e.preventDefault()
    const found = validateRegistration(values)
    setClientErrors(found)
    if (Object.keys(found).length > 0) return
    const form = {
      name: values.name.trim(), email: values.email.trim(), phone: values.phone.trim(),
      password: values.password, confirmPassword: values.confirmPassword,
    }
    const result = await run(form)
    if (result.ok) onOtpSent(form, result.value)
  }

  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <TextField label="Full name" name="name" autoComplete="name" maxLength={120}
        value={values.name} onChange={set('name')} error={errors.name} />
      <TextField label="Email" name="email" type="email" autoComplete="email" maxLength={255}
        value={values.email} onChange={set('email')} error={errors.email} />
      <TextField label="Mobile number" name="phone" type="tel" inputMode="tel" autoComplete="tel"
        hint="10-digit Indian number. We send an OTP to verify it."
        value={values.phone} onChange={set('phone')} error={errors.phone} />
      <NewPasswordFields password={values.password} confirm={values.confirmPassword}
        onPassword={set('password')} onConfirm={set('confirmPassword')}
        passwordError={errors.password} confirmError={errors.confirmPassword} />
      <FormAlert>{formMessage(error, clientErrors)}</FormAlert>
      <button className="btn auth-submit" type="submit" disabled={pending || lock > 0}>
        {pending ? 'Sending OTP…' : lock > 0 ? `Try again in ${formatClock(lock)}` : 'Send OTP'}
      </button>
    </form>
  )
}
