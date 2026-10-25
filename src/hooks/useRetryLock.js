import { useEffect } from 'react'
import { useCountdown } from './useCountdown.js'

/** When an error is a 429, returns the seconds left until the caller may try again (0 otherwise). */
export function useRetryLock(error) {
  const { remaining, start } = useCountdown()
  useEffect(() => {
    if (error?.status === 429 && error.retryAfterSeconds) start(error.retryAfterSeconds)
  }, [error, start])
  return remaining
}
