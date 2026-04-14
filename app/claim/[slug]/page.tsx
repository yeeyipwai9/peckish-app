import { restaurants } from '@/data/mock'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface Props { params: Promise<{ slug: string }> }

export default async function ClaimPage({ params }: Props) {
  const { slug } = await params
  const restaurant = restaurants.find(r => r.slug === slug)
  if (!restaurant) return notFound()

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 40 }}>
      <div className="section">
        <Link href={`/restaurant/${restaurant.slug}`} style={{ color: 'var(--orange)', fontWeight: 700, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>← Back</Link>
        <div className="card-panel claim-card">
          <h1>Claim Your Business</h1>
          <p>Claim <strong>{restaurant.name}</strong> to manage your listing, respond to reviews, and upgrade to Pro for more visibility.</p>
          <div className="form-grid">
            <div>
              <label className="form-label">Your Full Name *</label>
              <input className="form-input" placeholder="e.g. Ahmad bin Ali" />
            </div>
            <div>
              <label className="form-label">Business Email *</label>
              <input className="form-input" type="email" placeholder="your@email.com" />
            </div>
            <div>
              <label className="form-label">Business Phone *</label>
              <input className="form-input" placeholder="+60 12 345 6789" />
            </div>
            <div>
              <label className="form-label">Upload Verification Video *</label>
              <div className="upload-box">📹 Tap to upload a short video verifying you are the owner</div>
            </div>
            <div>
              <label className="form-label">Supporting Photo (optional)</label>
              <div className="upload-box" style={{ padding: 20 }}>📸 Upload a photo of your business signboard or IC</div>
            </div>
            <div>
              <label className="form-label">Additional Notes</label>
              <textarea className="form-input" style={{ minHeight: 80, resize: 'vertical' }} placeholder="Any additional information..." />
            </div>
            <button className="form-submit">Submit Claim Request</button>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 16, textAlign: 'center' }}>
            Claims are reviewed within 2–3 business days. You will be notified by email.
          </p>
        </div>
      </div>
    </main>
  )
}
