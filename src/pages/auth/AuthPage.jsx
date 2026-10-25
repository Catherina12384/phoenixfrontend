import { Link, Navigate, useLocation } from 'react-router-dom'
import { postLoginPath } from '../../auth/roles.js'
import { useAuth } from '../../auth/useAuth.js'
import AuthLayout from '../../components/auth/AuthLayout.jsx'
import LoginForm from './LoginForm.jsx'
import SignupFlow from './SignupFlow.jsx'

/** /login and /signup. One page, two tabs. Already signed in? Go to the role's landing page. */
export default function AuthPage({ mode }) {
  const { user, status } = useAuth()
  const location = useLocation()
  const isLogin = mode === 'login'

  if (status === 'loading') {
    return <AuthLayout title="Phoenix Computers"><p className="auth-copy" role="status">Loading…</p></AuthLayout>
  }
  if (user) return <Navigate to={postLoginPath(user, location.state?.from)} replace />

  return (
    <AuthLayout
      title={isLogin ? 'Welcome back' : 'Create your account'}
      subtitle={isLogin ? 'Customers, staff and admins log in here.' : 'Sign up with your mobile number to shop with Phoenix.'}
    >
      <div className="auth-tabs" role="group" aria-label="Log in or sign up">
        <Link to="/login" state={location.state} aria-current={isLogin ? 'page' : undefined}>Log in</Link>
        <Link to="/signup" state={location.state} aria-current={isLogin ? undefined : 'page'}>Sign up</Link>
      </div>
      {isLogin ? <LoginForm notice={location.state?.notice} /> : <SignupFlow />}
    </AuthLayout>
  )
}
