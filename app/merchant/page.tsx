'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { sb, signOut } from '@/lib/supabase'

type Section = 'overview' | 'edit' | 'menu' | 'posts' | 'reviews' | 'claims'

export default function MerchantDashboard() {
  const [user, setUser] = useState<any>(null)
  const [restaurant, setRestaurant] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [section, setSection] = useState<Section>('overview')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSavedMsg] = useState(false)

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '', description: '', phone: '', whatsapp: '',
    opening_hours: '', address: '', cuisine_type: '', price_range: '',
  })

  // New post form
  const [newPost, setNewPost] = useState({ title: '', body: '' })
  const [postSaved, setPostSaved] = useState(false)

  useEffect(() => {
    init()
  }, [])

  async function init() {
    try {
      const { data: { user } } = await sb.auth.getUser()
      if (!user) { window.location.href = '/'; return }
      setUser(user)

      // Get their claimed restaurant
      const { data: account } = await sb
        .from('merchant_accounts')
        .select('restaurant_id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single()

      if (account) {
        const { data: rest } = await sb
          .from('restaurants')
          .select('*')
          .eq('id', account.restaurant_id)
          .single()
        if (rest) {
          setRestaurant(rest)
          setEditForm({
            name: rest.name || '',
            description: rest.description || '',
            phone: rest.phone || '',
            whatsapp: rest.whatsapp || '',
            opening_hours: rest.opening_hours || '',
            address: rest.address || '',
            cuisine_type: rest.cuisine_type || '',
            price_range: rest.price_range || '$$',
          })
          // Load reviews and posts
          const { data: revs } = await sb.from('reviews').select('*').eq('restaurant_id', rest.id).order('created_at', { ascending: false })
          const { data: pts } = await sb.from('posts').select('*').eq('restaurant_id', rest.id).order('created_at', { ascending: false })
          if (revs) setReviews(revs)
          if (pts) setPosts(pts)
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function saveRestaurant() {
    if (!restaurant) return
    setSaving(true)
    try {
      await sb.from('restaurants').update(editForm).eq('id', restaurant.id)
      setRestaurant({ ...restaurant, ...editForm })
      setSavedMsg(true)
      setTimeout(() => setSavedMsg(false), 3000)
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  async function addPost() {
    if (!newPost.title.trim() || !newPost.body.trim() || !restaurant) return
    try {
      const { data } = await sb.from('posts').insert({
        restaurant_id: restaurant.id,
        title: newPost.title,
        body: newPost.body,
      }).select().single()
      if (data) setPosts(prev => [data, ...prev])
      setNewPost({ title: '', body: '' })
      setPostSaved(true)
      setTimeout(() => setPostSaved(false), 3000)
    } catch (e) { console.error(e) }
  }

  async function deletePost(id: string) {
    if (!confirm('Delete this post?')) return
    try {
      await sb.from('posts').delete().eq('id', id)
      setPosts(prev => prev.filter(p => p.id !== id))
    } catch (e) { console.error(e) }
  }

  async function handleSignOut() {
    await signOut()
    window.location.href = '/'
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
        Loading dashboard...
      </div>
    </div>
  )

  if (!restaurant) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', textAlign: 'center', padding: 20 }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🏪</div>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>No restaurant linked yet</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 24 }}>You need to claim a restaurant first to access your dashboard.</p>
      <Link href="/" style={{ background: 'var(--orange)', color: 'white', padding: '14px 28px', borderRadius: 12, fontWeight: 700 }}>Browse Restaurants</Link>
    </div>
  )

  const menuItems = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'edit', icon: '✏️', label: 'Edit Listing' },
    { id: 'menu', icon: '🍽️', label: 'Menu' },
    { id: 'posts', icon: '📢', label: 'Posts' },
    { id: 'reviews', icon: '⭐', label: 'Reviews' },
  ]

  return (
    <div className="dash-shell">
      <nav className="dash-nav">
        <Link href="/" className="brand" style={{ color: 'white', textDecoration: 'none' }}>
          <span className="brand-mark">P</span>
          <span>PECKISH</span>
        </Link>
        <div className="dash-nav-right">
          <span>{user?.user_metadata?.full_name || user?.email}</span>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      </nav>

      <div className="dash-body">
        <aside className="dash-sidebar">
          <div style={{ padding: '0 24px 20px', borderBottom: '1px solid var(--line)', marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{restaurant.name}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{restaurant.cuisine_type}</div>
            <Link href={`/restaurant/${restaurant.slug}`} style={{ fontSize: 12, color: 'var(--orange)', fontWeight: 600, marginTop: 4, display: 'block' }}>
              View public page →
            </Link>
          </div>
          {menuItems.map(item => (
            <button key={item.id} className={`dash-menu-item ${section === item.id ? 'active' : ''}`} onClick={() => setSection(item.id as Section)}>
              <span className="dash-menu-item">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </aside>

        <main className="dash-content">

          {section === 'overview' && (
            <>
              <div className="dash-header">
                <h1>Dashboard</h1>
                <p>Overview of your restaurant performance</p>
              </div>
              <div className="dash-stats">
                <div className="stat-card">
                  <div className="stat-value stat-orange">{restaurant.rating?.toFixed(1) || '—'}</div>
                  <div className="stat-label">Average Rating</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{restaurant.review_count || reviews.length}</div>
                  <div className="stat-label">Total Reviews</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{posts.length}</div>
                  <div className="stat-label">Posts Published</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value stat-green">{restaurant.is_pro ? 'Pro' : 'Free'}</div>
                  <div className="stat-label">Current Plan</div>
                </div>
              </div>

              {!restaurant.is_pro && (
                <div style={{ background: 'linear-gradient(135deg, var(--navy), #1E3A5F)', color: 'white', borderRadius: 20, padding: 28, marginBottom: 24 }}>
                  <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Upgrade to Pro 🚀</h2>
                  <p style={{ color: 'rgba(255,255,255,.7)', marginBottom: 20, lineHeight: 1.6 }}>
                    Get a Google-indexed URL, full gallery, verified badge, analytics and more for just RM99/month.
                  </p>
                  <button style={{ background: 'var(--orange)', color: 'white', borderRadius: 12, padding: '12px 24px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                    Upgrade to Pro — RM99/month
                  </button>
                </div>
              )}

              {reviews.slice(0, 3).map(r => (
                <div key={r.id} className="review-item">
                  <div className="review-header">
                    <div className="reviewer-name">{r.user_name || 'Anonymous'}</div>
                    <div className="review-date">{new Date(r.created_at).toLocaleDateString('en-MY', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                  </div>
                  <div className="review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                  <div className="review-text">{r.comment}</div>
                </div>
              ))}
            </>
          )}

          {section === 'edit' && (
            <>
              <div className="dash-header"><h1>Edit Listing</h1><p>Update your restaurant information</p></div>
              {saved && <div className="success-toast">✓ Changes saved successfully!</div>}
              <div className="edit-form">
                <div className="form-row-2">
                  <div className="form-field">
                    <label>Restaurant Name</label>
                    <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="form-field">
                    <label>Cuisine Type</label>
                    <input value={editForm.cuisine_type} onChange={e => setEditForm(f => ({ ...f, cuisine_type: e.target.value }))} placeholder="e.g. Malay, Chinese, Western" />
                  </div>
                </div>
                <div className="form-field">
                  <label>Description</label>
                  <textarea rows={4} value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe your restaurant..." />
                </div>
                <div className="form-row-2">
                  <div className="form-field">
                    <label>Phone Number</label>
                    <input value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} placeholder="60123456789" />
                  </div>
                  <div className="form-field">
                    <label>WhatsApp Number</label>
                    <input value={editForm.whatsapp} onChange={e => setEditForm(f => ({ ...f, whatsapp: e.target.value }))} placeholder="60123456789" />
                  </div>
                </div>
                <div className="form-field">
                  <label>Address</label>
                  <input value={editForm.address} onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))} />
                </div>
                <div className="form-row-2">
                  <div className="form-field">
                    <label>Opening Hours</label>
                    <input value={editForm.opening_hours} onChange={e => setEditForm(f => ({ ...f, opening_hours: e.target.value }))} placeholder="Open 9:00 AM – 10:00 PM daily" />
                  </div>
                  <div className="form-field">
                    <label>Price Range</label>
                    <select value={editForm.price_range} onChange={e => setEditForm(f => ({ ...f, price_range: e.target.value }))}>
                      <option value="$">$ — Budget</option>
                      <option value="$$">$$ — Moderate</option>
                      <option value="$$$">$$$ — Upscale</option>
                    </select>
                  </div>
                </div>
                <button className="save-btn" onClick={saveRestaurant} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </>
          )}

          {section === 'posts' && (
            <>
              <div className="dash-header"><h1>Posts</h1><p>Share updates with your customers</p></div>
              {postSaved && <div className="success-toast">✓ Post published!</div>}
              <div className="edit-form" style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>New Post</h2>
                <div className="form-field">
                  <label>Title</label>
                  <input value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))} placeholder="e.g. New menu available!" />
                </div>
                <div className="form-field">
                  <label>Content</label>
                  <textarea rows={4} value={newPost.body} onChange={e => setNewPost(p => ({ ...p, body: e.target.value }))} placeholder="Write your update here..." />
                </div>
                <button className="save-btn" onClick={addPost} disabled={!newPost.title.trim() || !newPost.body.trim()}>
                  Publish Post
                </button>
              </div>
              {posts.map(p => (
                <div key={p.id} className="post-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div className="post-date">{new Date(p.created_at).toLocaleDateString('en-MY', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                      <div className="post-title">{p.title}</div>
                      <div className="post-body">{p.body}</div>
                    </div>
                    <button className="delete-btn" onClick={() => deletePost(p.id)}>Delete</button>
                  </div>
                </div>
              ))}
              {posts.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>No posts yet. Publish your first update above!</div>}
            </>
          )}

          {section === 'reviews' && (
            <>
              <div className="dash-header"><h1>Reviews</h1><p>{reviews.length} total reviews</p></div>
              {reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>⭐</div>
                  <p style={{ fontWeight: 600 }}>No reviews yet</p>
                </div>
              ) : reviews.map(r => (
                <div key={r.id} className="review-item">
                  <div className="review-header">
                    <div className="reviewer-name">{r.user_name || 'Anonymous'}</div>
                    <div className="review-date">{new Date(r.created_at).toLocaleDateString('en-MY', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                  </div>
                  <div className="review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                  <div className="review-text">{r.comment}</div>
                </div>
              ))}
            </>
          )}

          {section === 'menu' && (
            <div>
              <div className="dash-header"><h1>Menu</h1><p>Manage your menu items</p></div>
              <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 12, padding: '14px 18px', marginBottom: 20, fontSize: 14 }}>
                💡 Menu management via Supabase dashboard for now. Go to your Supabase project → Table Editor → menu_items to add or edit items.
              </div>
              <Link href={`/restaurant/${restaurant.slug}`} style={{ color: 'var(--orange)', fontWeight: 700, fontSize: 14 }}>
                View your public menu page →
              </Link>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
