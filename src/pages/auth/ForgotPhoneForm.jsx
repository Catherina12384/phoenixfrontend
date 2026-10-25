import { useState } from 'react'
import { authApi } from '../../api/authApi.js'
import { fieldErrorsOf, formMessage, formatClock } from '../../api/messages.js'
import { isValidPhone } from '../../auth/validation.js'
import FormAlert from '../../components/auth/FormAlert.jsx'
import TextField from '../../components/auth/TextField.jsx'
import { useRetryLock } from '../../hooks/useRetryLock.js'
import { useSubmit } from '../../hooks/useSubmit.js'

/** Reset step 1: ask for the registered mobile number and send an OTP. */
export default function ForgotPhoneForm({ onSent }) {
  const [phone, setPhone] = useState('')
  const [clientErrors, setClientErrors] = useState({})
  const { run, pending, error } = useSubmit(authApi.requestPasswordResetOtp)
  const lock = useRetryLock(error)
  const errors = { ...fieldErrorsOf(error), ...clientErrors }

  const submit = async e => {
    e.preventDefault()
    const found = isValidPhone(phone) ? {} : { phone: 'Enter a valid 10-digit Indian mobile number' }
    setClientErrors(found)
    if (Object.keys(found).length > 0) return
    const result = await run(phone.trim())
    if (result.ok) onSent(phone.trim())
  }

  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <TextField label="Registered mobile number" name="phone" type="tel" inputMode="tel" autoComplete="tel"
        value={phone} onChange={setPhone} error={errors.phone} />
      <FormAlert>{formMessage(error, clientErrors)}</FormAlert>
      <button className="btn auth-submit" type="submit" disabled={pending || lock > 0}>
        {pending ? 'Sending OTP…' : lock > 0 ? `Try again in ${formatClock(lock)}` : 'Send OTP'}
      </button>
    </form>
  )
}
