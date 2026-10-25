import { useRef } from 'react'

export const OTP_LENGTH = 6

/** Six single-digit boxes. Handles typing, backspace, arrow keys, paste and SMS autofill. */
export default function OtpInput({ value, onChange, disabled = false, invalid = false, label = 'One-time password', length = OTP_LENGTH, autoFocus = false }) {
  const refs = useRef([])
  const focusAt = i => refs.current[Math.min(Math.max(i, 0), length - 1)]?.focus()

  const handleChange = (i, raw) => {
    const digits = raw.replace(/\D/g, '')
    if (!digits) { onChange(value.slice(0, i) + value.slice(i + 1)); return }
    const single = digits.length === 1
    const next = (single ? value.slice(0, i) + digits + value.slice(i + 1) : value.slice(0, i) + digits).slice(0, length)
    onChange(next)
    focusAt(single ? i + 1 : next.length)
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) {
      e.preventDefault()
      onChange(value.slice(0, i - 1) + value.slice(i))
      focusAt(i - 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault(); focusAt(i - 1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault(); focusAt(i + 1)
    }
  }

  const handlePaste = e => {
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!digits) return
    e.preventDefault()
    onChange(digits)
    focusAt(digits.length)
  }

  return (
    <div className="otp" role="group" aria-label={label}>
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={el => { refs.current[i] = el }}
          className="input otp-box"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          maxLength={length}
          value={value[i] ?? ''}
          disabled={disabled}
          autoFocus={autoFocus && i === 0}
          aria-label={`${label}, digit ${i + 1} of ${length}`}
          aria-invalid={invalid ? true : undefined}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={e => e.target.select()}
        />
      ))}
    </div>
  )
}
