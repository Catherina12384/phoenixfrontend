import { useState } from 'react'
import { fieldErrorsOf, formMessage, formatClock } from '../../api/messages.js'
import { maskPhone } from '../../auth/validation.js'
import FormAlert from '../../components/auth/FormAlert.jsx'
import OtpInput, { OTP_LENGTH } from '../../components/auth/OtpInput.jsx'
import ResendOtp from '../../components/auth/ResendOtp.jsx'
import { useRetryLock } from '../../hooks/useRetryLock.js'
import { useSubmit } from '../../hooks/useSubmit.js'

/** Signup step 2: enter the OTP. Verification, resend and "back" are supplied by the parent. */
export default function OtpStep({ phone, validSeconds, resendAfterSeconds, onVerify, onResend, onBack }) {
  const [code, setCode] = useState('')
  const verify = useSubmit(onVerify)
  const lock = useRetryLock(verify.error)
  const errors = fieldErrorsOf(verify.error)

  const submit = async e => {
    e.preventDefault()
    if (code.length === OTP_LENGTH) await verify.run(code)
  }

  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <p className="auth-copy">
        Enter the {OTP_LENGTH}-digit code sent to <strong>{maskPhone(phone)}</strong>.
        It is valid for {Math.max(1, Math.round(validSeconds / 60))} minutes.
      </p>
      <OtpInput value={code} onChange={setCode} invalid={Boolean(verify.error)} autoFocus />
      {errors.otp && <p className="field-error">{errors.otp}</p>}
      <FormAlert>{formMessage(verify.error)}</FormAlert>
      <button className="btn auth-submit" type="submit"
        disabled={code.length !== OTP_LENGTH || verify.pending || lock > 0}>
        {verify.pending ? 'Verifying…' : lock > 0 ? `Try again in ${formatClock(lock)}` : 'Verify and create account'}
      </button>
      <ResendOtp seconds={resendAfterSeconds} onResend={onResend}
        onResent={() => { setCode(''); verify.reset() }} />
      <p className="auth-foot">
        <button type="button" className="alink-btn" onClick={onBack}>Edit my details</button>
      </p>
    </form>
  )
}
