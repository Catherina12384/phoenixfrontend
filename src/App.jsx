import { Routes, Route, Link, NavLink } from 'react-router-dom'
import logo from './assets/logo.png'
import Home from './pages/Home.jsx'
import Stub from './pages/Stub.jsx'

const links = [['/', 'Home'], ['/catalogue', 'Catalogue'], ['/dealers', 'Dealers'], ['/login', 'Login']]

export default function App() {
  return (
    <>
      <header className="nav">
        <Link to="/" className="brand"><img src={logo} alt="" /><span style={{fontSize: '1.5rem'}}>Phoenix Computers</span></Link>
        <nav>
          {links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>)}
          {/* <NavLink to="/cart" className="cart">Cart (0)</NavLink> */}
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogue" element={<Stub title="Catalogue" note="Product grid, filters and search come next." />} />
        <Route path="/product/:id" element={<Stub title="Product" note="Product page with price and Add to Cart comes next." />} />
        <Route path="/dealers" element={<Stub title="Dealers" note="Dealer locator comes next." />} />
        <Route path="/login" element={<Stub title="Login" note="Login and sign-up come after the Spring Boot backend." />} />
        <Route path="/cart" element={<Stub title="Cart" note="Cart and checkout come next." />} />
      </Routes>
    </>
  )
}
