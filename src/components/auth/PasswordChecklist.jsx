import { PASSWORD_RULES } from '../../auth/validation.js'

/** Ticks each backend password rule live as the user types. */
export default function PasswordChecklist({ password, id }) {
  return (
    <ul className="checklist" id={id} aria-label="Password requirements">
      {PASSWORD_RULES.map(rule => {
        const ok = rule.test(password)
        return (
          <li key={rule.id} className={ok ? 'ok' : undefined}>
            <span aria-hidden="true">{ok ? '✓' : '○'}</span>
            <span className="sr-only">{ok ? 'Met: ' : 'Not met: '}</span>
            {rule.label}
          </li>
        )
      })}
    </ul>
  )
}
