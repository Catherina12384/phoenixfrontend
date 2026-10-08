import { DEALERS } from '../data/dealers.js'
import { useDealerFilter } from '../hooks/useDealerFilter.js'
import '../dealers.css'

// Drop this at the top of the Catalogue page: <DealerChips />
// Products should then be filtered with: selected.length === 0 || selected.includes(product.dealerId)
export default function DealerChips() {
  const { selected, toggle, clear } = useDealerFilter()
  if (!selected.length) return null
  const name = id => DEALERS.find(d => d.id === id)?.name ?? id
  return (
    <fieldset className="dealer-chips" aria-label="Active dealer filters">
      {selected.map(id => (
        <button key={id} type="button" className="chip" onClick={() => toggle(id)} aria-label={`Remove ${name(id)} filter`}>
          {name(id)} <span aria-hidden="true">×</span>
        </button>
      ))}
      <button type="button" className="linkbtn" onClick={clear}>Clear all</button>
    </fieldset>
  )
}