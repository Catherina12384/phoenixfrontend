import { useEffect, useState } from 'react'
import { formatClock, messageFor } from '../../api/messages.js'
import { useCountdown } from '../../hooks/useCountdown.js'
import { useRetryLock } from '../../hooks/useRetryLock.js'
import { useSubmit } from '../../hooks/useSubmit.js'
import FormAlert from './FormAlert.jsx'

/** "Resend OTP" with a countdown. The first countdown starts on mount (an OTP was just sent). */
export default function ResendOtp({ seconds, onResend, onResent }) {
  const { remaining, start } = useCountdown()
  const [sent, setSent] = useState(false)
  const resend = useSubmit(onResend)
  const lock = useRetryLock(resend.error)

  useEffect(() => { start(seconds) }, [start, seconds])

  const wait = Math.max(remaining, lock)
  const click = async () => {
    setSent(false)
    const result = await resend.run()
    if (!result.ok) return
    start(result.value?.resendAfterSeconds ?? seconds)
    setSent(true)
    onResent?.(result.value)
  }

  return (
    <div className="resend">
      <FormAlert>{messageFor(resend.error)}</FormAlert>
      <FormAlert kind="info">{sent ? 'A new OTP has been sent.' : ''}</FormAlert>
      <p className="auth-copy">
        Didn't get the code?{' '}
        <button type="button" className="alink-btn" onClick={click} disabled={wait > 0 || resend.pending}>
          {resend.pending ? 'Sending…' : wait > 0 ? `Resend in ${formatClock(wait)}` : 'Resend OTP'}
        </button>
      </p>
    </div>
  )
}
