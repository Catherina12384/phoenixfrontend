import { useId } from 'react'

export default function TextField({ label, value, onChange, error, hint, type = 'text', ...inputProps }) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-err`
  const showHint = Boolean(hint) && !error
  const describedBy = [showHint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        className="input"
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...inputProps}
      />
      {showHint && <p id={hintId} className="field-hint">{hint}</p>}
      {error && <p id={errorId} className="field-error">{error}</p>}
    </div>
  )
}
