import { useId } from 'react'
import PasswordChecklist from './PasswordChecklist.jsx'
import PasswordField from './PasswordField.jsx'

/** New password + live checklist + confirm field with a match indicator. Used by signup, reset and change. */
export default function NewPasswordFields({
  password, confirm, onPassword, onConfirm, passwordError, confirmError,
  passwordLabel = 'Password', confirmLabel = 'Confirm password',
  passwordName = 'password', confirmName = 'confirmPassword',
}) {
  const listId = useId()
  // 'idle' while the confirm field is still a prefix of the password, so typing is not flagged as wrong.
  const match = !confirm ? 'idle' : confirm === password ? 'match' : password.startsWith(confirm) ? 'idle' : 'mismatch'

  return (
    <>
      <PasswordField label={passwordLabel} name={passwordName} value={password} onChange={onPassword}
        error={passwordError} autoComplete="new-password" describedBy={listId}>
        <PasswordChecklist id={listId} password={password} />
      </PasswordField>
      <PasswordField label={confirmLabel} name={confirmName} value={confirm} onChange={onConfirm}
        error={confirmError ?? (match === 'mismatch' ? 'Passwords do not match' : undefined)} autoComplete="new-password">
        {match === 'match' && <p className="field-ok" role="status">✓ Passwords match</p>}
      </PasswordField>
    </>
  )
}
