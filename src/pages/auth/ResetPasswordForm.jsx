import { useState } from 'react'
import { authApi } from '../../api/authApi.js'
import { fieldErrorsOf, formMessage, formatClock } from '../../api/messages.js'
import { maskPhone, validateNewPassword } from '../../auth/validation.js'
import FormAlert from '../../components/auth/FormAlert.jsx'
import NewPasswordFields from '../../components/auth/NewPasswordFields.jsx'
import OtpInput, { OTP_LENGTH } from '../../components/auth/OtpInput.jsx'
import ResendOtp from '../../components/auth/ResendOtp.jsx'
import { useRetryLock } from '../../hooks/useRetryLock.js'
import { useSubmit } from '../../hooks/useSubmit.js'

// Matches app.otp.resend-cooldown (60s) in application.yml; the reset endpoint does not report it.
const RESEND_SECONDS = 60

/** Reset step 2: OTP + new password in one request, as the backend expects. */
export default function ResetPasswordForm({ phone, onBack, onDone }) {
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [clientErrors, setClientErrors] = useState({})
  const { run, pending, error } = useSubmit(authApi.resetPassword)
  const lock = useRetryLock(error)
  const errors = { ...fieldErrorsOf(error), ...clientErrors }

  const submit = async e => {
    e.preventDefault()
    const found = validateNewPassword(password, confirm, otp.length === OTP_LENGTH ? {} : { otp: `Enter the ${OTP_LENGTH}-digit code` })
    setClientErrors(found)
    if (Object.keys(found).length > 0) return
    const result = await run({ phone, otp, newPassword: password, confirmPassword: confirm })
    if (result.ok) onDone()
  }

  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <FormAlert kind="info">{`If an account exists for ${maskPhone(phone)}, we have sent it an OTP.`}</FormAlert>
      <p className="auth-copy">Enter the {OTP_LENGTH}-digit code.</p>
      <OtpInput value={otp} onChange={setOtp} invalid={Boolean(errors.otp)} autoFocus />
      {errors.otp && <p className="field-error">{errors.otp}</p>}
      <NewPasswordFields passwordLabel="New password" confirmLabel="Confirm new password"
        passwordName="newPassword" password={password} confirm={confirm}
        onPassword={setPassword} onConfirm={setConfirm}
        passwordError={errors.password ?? errors.newPassword} confirmError={errors.confirmPassword} />
      <FormAlert>{formMessage(error, clientErrors)}</FormAlert>
      <button className="btn auth-submit" type="submit" disabled={pending || lock > 0}>
        {pending ? 'Saving…' : lock > 0 ? `Try again in ${formatClock(lock)}` : 'Reset password'}
      </button>
      <ResendOtp seconds={RESEND_SECONDS} onResend={() => authApi.requestPasswordResetOtp(phone)}
        onResent={() => setOtp('')} />
      <p className="auth-foot">
        <button type="button" className="alink-btn" onClick={onBack}>Use a different number</button>
      </p>
    </form>
  )
}
