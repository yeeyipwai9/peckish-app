'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { sb, signOut } from '@/lib/supabase'

type AdminTab = 'restaurants' | 'claims' | 'reviews' | 'ugc'

export default function AdminPanel() {
  const [user, setUser] = useState<any>(null)
  const [tab, setTab] = useState<AdminTab>('restaurants')
  const [restaurants, setRestaurants] = useState<any[]>([])
  const [claims, setClaims] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [ugc, setUgc] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [unauthorized, setUnauthorized] = useState(false)

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL

  useEffect(() => { init() }, [])

  async function init() {
    try {
      const { data: { user } } = await sb.auth.getUser()
      if (!user || (adminEmail && user.email !== adminEmail)) {
        setUnauthorized(true)
        setLoading(false)
        return
      }
      setUser(user)
      await loadData()
    } catch (e) {
      setUnauthorized(true)
    }
    setLoading(false)
  }

  async function loadData() {
    const [r, c, rev, u] = await Promise.all([
      sb.from('restaurants').select('*').order('created_at', { ascending: false }),
      sb.from('merchant_claims').select('*, restaurants(name, slug)').order('created_at', { ascending: false }),
      sb.from('reviews').select('*, restaurants(name)').order('created_at', { ascending: false }).limit(50),
      sb.from('ugc_media').select('*, restaurants(name)').order('created_at', { ascending: false }).limit(50),
    ])
    if (r.data) setRestaurants(r.data)
    if (c.data) setClaims(c.data)
    if (rev.data) setReviews(rev.data)
    if (u.data) setUgc(u.data)
  }

  async function approveClaim(claimId: string, restaurantId: string, userId: string) {
    try {
      await sb.from('merchant_claims').update({ status: 'approved', reviewed_at: new Date().toISOString() }).eq('id', claimId)
      await sb.from('merchant_accounts').upsert({ restaurant_id: restaurantId, user_id: userId, role: 'owner', is_active: true })
      await sb.from('restaurants').update({ claim_status: 'claimed', claimed_by_user_id: userId }).eq('id', restaurantId)
      setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: 'approved' } : c))
    } catch (e) { console.error(e) }
  }

  async function rejectClaim(claimId: string) {
    try {
      await sb.from('merchant_claims').update({ status: 'rejected', reviewed_at: new Date().toISOString() }).eq('id', claimId)
      setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: 'rejected' } : c))
    } catch (e) { console.error(e) }
  }

  async function approveUgc(id: string) {
    try {
      await sb.from('ugc_media').update({ is_approved: true }).eq('id', id)
      setUgc(prev => prev.map(u => u.id === id ? { ...u, is_approved: true } : u))
    } catch (e) { console.error(e) }
  }

  async function deleteReview(id: string) {
    if (!confirm('Delete this review?')) return
    try {
      await sb.from('reviews').delete().eq('id', id)
      setReviews(prev => prev.filter(r => r.id !== id))
    } catch (e) { console.error(e) }
  }

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--muted)' }}>Loading admin panel...</div>

  if (unauthorized) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', textAlign: 'center', padding: 20 }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🔒</div>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Access Denied</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 24 }}>You do not have permission to access the admin panel.</p>
      <Link href="/" style={{ background: 'var(--orange)', color: 'white', padding: '12px 24px', borderRadius: 12, fontWeight: 700 }}>Go Home</Link>
    </div>
  )

  const pendingClaims = claims.filter(c => c.status === 'pending').length
  const pendingUgc = ugc.filter(u => !u.is_approved).length

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <Link href="/" className="brand" style={{ color: 'white', textDecoration: 'none' }}>
          <span className="brand-mark">P</span><span>PECKISH Admin</span>
        </Link>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', fontSize: 14, color: 'rgba(255,255,255,.7)' }}>
          <span>{user?.email}</span>
          <button onClick={async () => { await signOut(); window.location.href = '/' }} style={{ background: 'rgba(255,255,255,.15)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontWeight: 600 }}>Sign Out</button>
        </div>
      </div>

      <div style={{ padding: 32 }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Restaurants', value: restaurants.length, color: 'var(--navy)' },
            { label: 'Pending Claims', value: pendingClaims, color: pendingClaims > 0 ? 'var(--orange)' : 'var(--navy)' },
            { label: 'Total Reviews', value: reviews.length, color: 'var(--navy)' },
            { label: 'Pending UGC', value: pendingUgc, color: pendingUgc > 0 ? 'var(--orange)' : 'var(--green)' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="admin-tabs">
          {(['restaurants', 'claims', 'reviews', 'ugc'] as AdminTab[]).map(t => (
            <button key={t} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'claims' && pendingClaims > 0 ? `Claims (${pendingClaims} pending)` : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'restaurants' && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Restaurant</th>
                <th>Cuisine</th>
                <th>Status</th>
                <th>Halal</th>
                <th>Rating</th>
                <th>Claim</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map(r => (
                <tr key={r.id}>
                  <td><strong>{r.name}</strong><br /><span style={{ color: 'var(--muted)', fontSize: 12 }}>{r.address}</span></td>
                  <td>{r.cuisine_type}</td>
                  <td><span className={`badge ${r.is_open ? 'badge-green' : 'badge-red'}`}>{r.is_open ? 'Open' : 'Closed'}</span></td>
                  <td><span className={`badge ${r.is_halal ? 'badge-green' : 'badge-gray'}`}>{r.is_halal ? 'Halal' : 'N/A'}</span></td>
                  <td>★ {r.rating || '—'}</td>
                  <td><span className={`badge ${r.claim_status === 'claimed' ? 'badge-green' : 'badge-gray'}`}>{r.claim_status || 'unclaimed'}</span></td>
                  <td>
                    <Link href={`/restaurant/${r.slug}`} style={{ color: 'var(--orange)', fontWeight: 700, fontSize: 13 }}>View →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'claims' && (
          <table className="data-table">
            <thead>
              <tr><th>Restaurant</th><th>Claimant</th><th>Email</th><th>Phone</th><th>Date</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {claims.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>No claims yet</td></tr>
              ) : claims.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.restaurants?.name || '—'}</strong></td>
                  <td>{c.claimant_name}</td>
                  <td>{c.business_email}</td>
                  <td>{c.business_phone}</td>
                  <td style={{ fontSize: 13, color: 'var(--muted)' }}>{new Date(c.created_at).toLocaleDateString('en-MY')}</td>
                  <td><span className={`badge ${c.status === 'approved' ? 'badge-green' : c.status === 'rejected' ? 'badge-red' : 'badge-orange'}`}>{c.status}</span></td>
                  <td>
                    {c.status === 'pending' && (
                      <>
                        <button className="approve-btn" onClick={() => approveClaim(c.id, c.restaurant_id, c.user_id)}>Approve</button>
                        <button className="reject-btn" onClick={() => rejectClaim(c.id)}>Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'reviews' && (
          <table className="data-table">
            <thead>
              <tr><th>Restaurant</th><th>Reviewer</th><th>Rating</th><th>Comment</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>No reviews yet</td></tr>
              ) : reviews.map(r => (
                <tr key={r.id}>
                  <td>{r.restaurants?.name || '—'}</td>
                  <td>{r.user_name || 'Anonymous'}</td>
                  <td style={{ color: 'var(--orange)' }}>{'★'.repeat(r.rating)}</td>
                  <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.comment}</td>
                  <td style={{ fontSize: 13, color: 'var(--muted)' }}>{new Date(r.created_at).toLocaleDateString('en-MY')}</td>
                  <td><button className="reject-btn" onClick={() => deleteReview(r.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'ugc' && (
          <table className="data-table">
            <thead>
              <tr><th>Restaurant</th><th>Creator</th><th>Type</th><th>Caption</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {ugc.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>No UGC yet</td></tr>
              ) : ugc.map(u => (
                <tr key={u.id}>
                  <td>{u.restaurants?.name || '—'}</td>
                  <td>{u.user_name || '—'}</td>
                  <td><span className={`badge ${u.media_type === 'video' ? 'badge-orange' : 'badge-gray'}`}>{u.media_type}</span></td>
                  <td>{u.caption}</td>
                  <td><span className={`badge ${u.is_approved ? 'badge-green' : 'badge-orange'}`}>{u.is_approved ? 'Approved' : 'Pending'}</span></td>
                  <td>{!u.is_approved && <button className="approve-btn" onClick={() => approveUgc(u.id)}>Approve</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
