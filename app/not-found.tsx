import Link from 'next/link'
export default function NotFound() {
  return (
    <div className="not-found">
      <div style={{ fontSize: 64 }}>🍽️</div>
      <h1>Page Not Found</h1>
      <p>Looks like this page went out for food and never came back.</p>
      <Link href="/">Back to Home</Link>
    </div>
  )
}
