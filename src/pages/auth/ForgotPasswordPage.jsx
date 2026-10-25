import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/auth/AuthLayout.jsx'
import ForgotPhoneForm from './ForgotPhoneForm.jsx'
import ResetPasswordForm from './ResetPasswordForm.jsx'

const DONE_NOTICE = 'Password updated. Log in with your new password.'

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState(null)
  const navigate = useNavigate()

  return (
    <AuthLayout title="Reset your password"
      subtitle={phone ? 'Enter the OTP and choose a new password.' : 'We will send an OTP to your registered mobile number.'}>
      {phone
        ? <ResetPasswordForm phone={phone} onBack={() => setPhone(null)}
            onDone={() => navigate('/login', { replace: true, state: { notice: DONE_NOTICE } })} />
        : <ForgotPhoneForm onSent={setPhone} />}
      <p className="auth-foot"><Link className="alink" to="/login">Back to log in</Link></p>
    </AuthLayout>
  )
}
