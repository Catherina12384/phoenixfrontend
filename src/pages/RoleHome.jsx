import { useAuth } from '../auth/useAuth.js'

/** Placeholder landing page for ADMIN and STAFF until the real dashboards exist. */
export default function RoleHome({ title, note }) {
  const { user } = useAuth()
  return (
    <main className="stub">
      <h1>{title}</h1>
      <p>Signed in as {user.name} ({user.role.toLowerCase()}).</p>
      <p>{note}</p>
    </main>
  )
}
