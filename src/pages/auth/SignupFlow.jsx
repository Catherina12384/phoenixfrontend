import { useState } from 'react'
import { authApi } from '../../api/authApi.js'
import { useAuth } from '../../auth/useAuth.js'
import OtpStep from './OtpStep.jsx'
import RegisterForm from './RegisterForm.jsx'

const EMPTY = { name: '', email: '', phone: '', password: '', confirmPassword: '' }

/**
 * Two-step signup. Details stay in memory only until the account is created. The backend has no
 * separate "resend" endpoint: resending repeats step 1, which replaces the pending signup and OTP.
 */
export default function SignupFlow() {
  const { completeRegistration } = useAuth()
  const [form, setForm] = useState(EMPTY)
  const [challenge, setChallenge] = useState(null)

  const handleOtpSent = (submitted, response) => { setForm(submitted); setChallenge(response) }
  const resend = async () => {
    const response = await authApi.requestRegistrationOtp(form)
    setChallenge(response)
    return response
  }

  if (!challenge) return <RegisterForm initialValues={form} onOtpSent={handleOtpSent} />

  return (
    <OtpStep
      phone={form.phone}
      validSeconds={challenge.otpValidSeconds}
      resendAfterSeconds={challenge.resendAfterSeconds}
      onVerify={otp => completeRegistration(challenge.registrationId, otp)}
      onResend={resend}
      onBack={() => setChallenge(null)}
    />
  )
}
