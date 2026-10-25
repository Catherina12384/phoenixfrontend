import logo from '../../assets/logo.png'

/** Glass card over the navy backdrop. Every auth screen renders inside this. */
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <main className="auth">
      <span className="auth-blob b1" aria-hidden="true" />
      <span className="auth-blob b2" aria-hidden="true" />
      <span className="auth-blob b3" aria-hidden="true" />
      <section className="auth-card" aria-labelledby="auth-title">
        <div className="auth-brand">
          <img className="auth-logo" src={logo} alt="" />
          <span>Phoenix Computers</span>
        </div>
        <h1 id="auth-title">{title}</h1>
        {subtitle && <p className="auth-sub">{subtitle}</p>}
        {children}
      </section>
    </main>
  )
}
