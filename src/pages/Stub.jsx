import { Link } from 'react-router-dom'
export default function Stub({ title, note }) {
  return <main className="stub"><h1>{title}</h1><p>{note}</p><Link className="btn" to="/">Back to home</Link></main>
}
