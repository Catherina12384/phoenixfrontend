import { Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom'
import logo from './assets/logo.png'
import Home from './pages/Home.jsx'
import Stub from './pages/Stub.jsx'
import Dealers from './pages/Dealers.jsx'
import RoleHome from './pages/RoleHome.jsx'
import AuthPage from './pages/auth/AuthPage.jsx'
import ChangePasswordPage from './pages/auth/ChangePasswordPage.jsx'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx'
import RequireAuth from './auth/RequireAuth.jsx'
import { ROLE_HOME } from './auth/roles.js'
import { useAuth } from './auth/useAuth.js'

const links = [['/', 'Home'], ['/catalogue', 'Catalogue'], ['/dealers', 'Dealers']]

// Login link for guests; name, dashboard link (admin/staff) and Logout for signed-in users.
function AccountNav() {
  const { user, status, logout } = useAuth()
  const navigate = useNavigate()
  if (status === 'loading') return null
  if (!user) return <NavLink to="/login">Login</NavLink>

  const signOut = async () => { await logout(); navigate('/', { replace: true }) }
  return (
    <>
      {user.role !== 'CUSTOMER' && <NavLink to={ROLE_HOME[user.role]}>{user.role === 'ADMIN' ? 'Admin' : 'Staff'}</NavLink>}
      <span className="nav-user">{user.name.split(' ')[0]}</span>
      <button type="button" className="nav-logout" onClick={signOut}>Logout</button>
    </>
  )
}

export default function App() {
  return (
    <>
      <header className="nav">
        <Link to="/" className="brand"><img src={logo} alt="" /><span style={{fontSize: '1.5rem'}}>Phoenix Computers</span></Link>
        <nav>
          {links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>)}
          <AccountNav />
          {/* <NavLink to="/cart" className="cart">Cart (0)</NavLink> */}
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogue" element={<Stub title="Catalogue" note="Product grid, filters and search come next." />} />
        <Route path="/product/:id" element={<Stub title="Product" note="Product page with price and Add to Cart comes next." />} />
        <Route path="/dealers" element={<Dealers />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/change-password" element={<RequireAuth><ChangePasswordPage /></RequireAuth>} />
        <Route path="/admin" element={<RequireAuth roles={['ADMIN']}><RoleHome title="Admin dashboard" note="Products, dealers, staff and the audit log will live here." /></RequireAuth>} />
        <Route path="/staff" element={<RequireAuth roles={['STAFF', 'ADMIN']}><RoleHome title="Staff area" note="Product updates will live here." /></RequireAuth>} />
        <Route path="/cart" element={<Stub title="Cart" note="Cart and checkout come next." />} />
      </Routes>
    </>
  )
}
