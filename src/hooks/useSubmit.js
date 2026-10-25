import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Wraps an async action with pending/error state and blocks double submits.
 * run() never throws: it resolves to { ok: true, value } or { ok: false }.
 */
export function useSubmit(action) {
  const actionRef = useRef(action)
  const inFlight = useRef(false)
  const [state, setState] = useState({ pending: false, error: null })

  useEffect(() => { actionRef.current = action })

  const run = useCallback(async (...args) => {
    if (inFlight.current) return { ok: false }
    inFlight.current = true
    setState({ pending: true, error: null })
    try {
      const value = await actionRef.current(...args)
      setState({ pending: false, error: null })
      return { ok: true, value }
    } catch (error) {
      setState({ pending: false, error })
      return { ok: false }
    } finally {
      inFlight.current = false
    }
  }, [])

  const reset = useCallback(() => setState(s => ({ ...s, error: null })), [])

  return { run, reset, pending: state.pending, error: state.error }
}
