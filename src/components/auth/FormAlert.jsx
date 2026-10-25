/** Error (announced immediately) or info (announced politely) banner. Renders nothing when empty. */
export default function FormAlert({ kind = 'error', children }) {
  if (!children) return null
  return (
    <p className={`alert ${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      {children}
    </p>
  )
}
