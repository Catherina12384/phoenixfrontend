import { useSearchParams } from 'react-router-dom'

// The dealer filter lives in the URL: /catalogue?dealer=hp&dealer=dell
// Shareable, survives refresh, and the back button works. Dealers and Catalogue pages both use this hook.
export function useDealerFilter() {
  const [params, setParams] = useSearchParams()
  const selected = params.getAll('dealer')

  const write = next =>
    setParams(prev => {
      const q = new URLSearchParams(prev)
      q.delete('dealer')
      next.forEach(id => q.append('dealer', id))
      return q
    }, { replace: true })

  const toggle = id => write(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id])
  const clear = () => write([])
  const catalogueUrl = '/catalogue' + (selected.length ? '?' + new URLSearchParams(selected.map(id => ['dealer', id])) : '')

  return { selected, toggle, clear, catalogueUrl }
}