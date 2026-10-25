import { useId, useState } from 'react'

/** Password input with a show/hide toggle. Children render under the input (e.g. a checklist). */
export default function PasswordField({ label, value, onChange, error, describedBy, children, ...inputProps }) {
  const id = useId()
  const errorId = `${id}-err`
  const [visible, setVisible] = useState(false)
  const described = [error ? errorId : null, describedBy].filter(Boolean).join(' ') || undefined

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="input-wrap">
        <input
          id={id}
          className="input"
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={described}
          {...inputProps}
        />
        <button type="button" className="toggle-vis" aria-pressed={visible} aria-label="Show password" onClick={() => setVisible(v => !v)}>
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
      {error && <p id={errorId} className="field-error">{error}</p>}
      {children}
    </div>
  )
}
