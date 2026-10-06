import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

const N = 96
const src = i => `/frames/f${String(i + 1).padStart(3, '0')}.webp`

// Business details: edit here.
const WHATSAPP = 'https://wa.me/919500288164'
const MAP_EMBED = 'https://www.google.com/maps?q=8.7956453,78.1330339&z=17&output=embed'
const MAP_DIRECTIONS = 'https://www.google.com/maps/dir/?api=1&destination=8.7956453,78.1330339'

// `side` = where the text sits; the device slides to the other side so they never overlap.
const panels = ['hero', 'offers', 'location', 'contact']
const sides = { hero: 'left', offers: 'right', location: 'left', contact: 'right' }
const shift = { hero: 20, offers: -19, location: 22, contact: -19 } // device offset in vw

export default function Home() {
  const wrap = useRef(null), canvas = useRef(null), imgs = useRef([])
  const [active, setActive] = useState(0), [ready, setReady] = useState(false)

  useEffect(() => {
    let loaded = 0
    const c = canvas.current
    function draw(i) {
      const im = imgs.current[i]
      if (!im || !im.complete || !im.naturalWidth) return
      c.width = im.naturalWidth; c.height = im.naturalHeight
      c.getContext('2d').drawImage(im, 0, 0)
    }
    imgs.current = Array.from({ length: N }, (_, i) => {
      const im = new Image(); im.src = src(i)
      im.onload = () => { if (++loaded === 1) { draw(0); setReady(true) } }
      return im
    })
    let raf, last = -1
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = wrap.current.getBoundingClientRect()
        const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)))
        const f = Math.min(N - 1, Math.floor(p * N))
        if (f !== last) { last = f; draw(f) }
        setActive(Math.min(panels.length - 1, Math.floor(p * panels.length)))
      })
    }
    addEventListener('scroll', onScroll, { passive: true }); onScroll()
    return () => { removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  const cls = id => `panel ${id} ${sides[id]} ${panels[active] === id ? 'show' : ''}`
  const inert = id => (panels[active] === id ? undefined : '')

  return (
    <>
      <div className="scroll" ref={wrap}>
        <div className="stage" style={{ '--shift': `${shift[panels[active]]}vw` }}>
          <canvas ref={canvas} className={ready ? 'on' : ''} aria-label="Phoenix Fold device rotating" />

          <section className={cls('hero')} inert={inert('hero')}>
            <p className="eyebrow">Est. 2002 · Tuticorin, India</p>
            <h1>Phoenix Computers</h1>
            <h2>A 24-year legacy of trust, <em>evolved</em> for the <u>future.</u></h2>
            <p className="lead">Browse our catalogue and ping us on WhatsApp — we'll give you the best price, always.</p>
            <div className="row">
              <Link className="btn" to="/catalogue">Browse catalogue</Link>
              <a className="btn ghost" href={WHATSAPP} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
            </div>
          </section>

          <section className={cls('offers') + ' dark'} inert={inert('offers')}>
            <h2>Launch offer: ₹10,000 off.</h2>
            <p>Free keyboard cover and 12-month no-cost EMI on every Phoenix Fold.</p>
            <Link className="btn" to="/catalogue">See offers in catalogue</Link>
          </section>

          <section className={cls('location') + ' dark'} inert={inert('location')}>
            <h2>Visit our store.</h2>
            <iframe title="Phoenix Computers on Google Maps" src={MAP_EMBED} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            <p>Phoenix Computers, Tuticorin, Tamil Nadu</p>
            <a className="btn" href={MAP_DIRECTIONS} target="_blank" rel="noreferrer">Get directions</a>
          </section>

          <section className={cls('contact') + ' dark'} inert={inert('contact')}>
            <h2>Talk to a Phoenix expert.</h2>
            <p>WhatsApp: +91 9500288164<br />Email: phoenixmarketers@gmail.com</p>
            <a className="btn" href={WHATSAPP} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
          </section>

          <ol className="dots" aria-hidden="true">{panels.map((id, i) => <li key={id} className={i === active ? 'on' : ''}>{id}</li>)}</ol>
        </div>
      </div>

      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-col about">
            <div className="footer-brand"><img src={logo} alt="" /><span>Phoenix Marketers</span></div>
            <p>Laptops, desktops, CCTV, accessories and refilling park.<br />Tuticorin, India</p>
            <p className="owner">S.W. John Mohan<br />B.Sc., HDCM., PGDCA., MBA.<br /><small>Proprietor</small></p>
          </div>

          <div className="footer-col">
            <h2>Address</h2>
            <p><span className="footer-icon address-icon" aria-hidden="true">𖤣</span> 16/3, Chidambara Nagar<br />Main Road, Opp. CSI Church<br />Tuticorin — 628 008</p>
            <a className="flink" href={MAP_DIRECTIONS} target="_blank" rel="noreferrer"><span className="footer-icon address-icon" aria-hidden="true">🖈</span>View on Google Maps</a>
            <h2 className="gap">Hours</h2>
            <p><span className="footer-icon" aria-hidden="true">🕒</span> Mon–Sat, 10 AM – 8 PM</p>
          </div>

          <div className="footer-col">
            <h2>Contact</h2>
            <p><span className="footer-icon" aria-hidden="true">☎</span> <a className="flink" href="tel:+919500288164">+91 95002 88164</a><br /><span className="footer-icon" aria-hidden="true">☎</span> <a className="flink" href="tel:+919842125620">+91 98421 25620</a></p>
            <p><span className="footer-icon" aria-hidden="true">💬</span> <a className="flink" href={WHATSAPP} target="_blank" rel="noreferrer">WhatsApp Us</a></p>
            <p><span className="footer-icon" aria-hidden="true">✉</span> <a className="flink" href="mailto:phoenixmarketers@gmail.com">phoenixmarketers@gmail.com</a></p>
            <a className="btn" href={WHATSAPP} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
          </div>

          <nav className="footer-col" aria-label="Footer">
            <h2>Shop</h2>
            <Link className="flink" to="/catalogue">Catalogue</Link>
            <Link className="flink" to="/dealers">Dealers</Link>
            <Link className="flink" to="/login">Login</Link>
            <Link className="flink" to="/cart">Cart</Link>
          </nav>
        </div>
        <p className="footer-bottom">© 2003–2026 Phoenix Computers. All rights reserved.</p>
      </footer>
    </>
  )
}
