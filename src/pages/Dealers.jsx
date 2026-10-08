import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDealers } from '../data/dealers.js'
import { useDealerFilter } from '../hooks/useDealerFilter.js'
import '../dealers.css'

export default function Dealers() {
  const [dealers, setDealers] = useState(null)
  const [error, setError] = useState(false)
  const [q, setQ] = useState('')
  const { selected, toggle, clear, catalogueUrl } = useDealerFilter()

  useEffect(() => {
    let on = true
    getDealers().then(d => on && setDealers(d)).catch(() => on && setError(true))
    return () => { on = false }
  }, [])

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase()
    return (dealers ?? []).filter(d => d.name.toLowerCase().includes(t))
  }, [dealers, q])

  return (
    <main className="dealers">
      <h1>Our dealers</h1>
      <p className="intro">Select one or more dealers, then open the catalogue to see only their products.</p>

      <input className="dealer-search" type="search" placeholder="Search dealers" aria-label="Search dealers"
        value={q} onChange={e => setQ(e.target.value)} />

      {error && <p role="alert">Couldn't load dealers. Refresh the page to try again.</p>}
      {!error && !dealers && <p>Loading dealers…</p>}
      {dealers && shown.length === 0 && <p>No dealer matches "{q}". Clear the search to see all dealers.</p>}

      <ul className="dealer-grid">
        {shown.map(d => {
          const on = selected.includes(d.id)
          return (
            <li key={d.id}>
              <button type="button" className={'dealer-tile' + (on ? ' on' : '')} aria-pressed={on} onClick={() => toggle(d.id)}>
                <span className="dealer-logo">
                  {d.logo ? <img src={d.logo} alt="" loading="lazy" /> : <span aria-hidden="true">{d.name[0]}</span>}
                </span>
                <span className="dealer-name">{d.name}</span>
              </button>
            </li>
          )
        })}
      </ul>

      {selected.length > 0 && (
        <section className="dealer-bar" aria-label="Selected dealers">
          <span>{selected.length} {selected.length === 1 ? 'dealer' : 'dealers'} selected</span>
          <button type="button" className="linkbtn" onClick={clear}>Clear</button>
          <Link className="btn" to={catalogueUrl}>View in catalogue</Link>
        </section>
      )}
    </main>
  )
}