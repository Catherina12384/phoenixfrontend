import { useCallback, useEffect, useState } from 'react'

/** Counts down whole seconds. start(n) (re)starts it; remaining is 0 when idle. */
export function useCountdown() {
  const [endsAt, setEndsAt] = useState(0)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (endsAt <= Date.now()) return undefined
    const id = setInterval(() => {
      const t = Date.now()
      setNow(t)
      if (t >= endsAt) clearInterval(id)
    }, 250)
    return () => clearInterval(id)
  }, [endsAt])

  const start = useCallback(seconds => {
    const t = Date.now()
    setNow(t)
    setEndsAt(t + seconds * 1000)
  }, [])

  return { remaining: Math.max(0, Math.ceil((endsAt - now) / 1000)), start }
}
