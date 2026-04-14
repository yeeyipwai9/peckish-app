'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { Restaurant } from '@/lib/types'
import { restaurants, ugc } from '@/data/mock'

export default function RestaurantDetail({ restaurant }: { restaurant: Restaurant }) {
  const [saved, setSaved] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewName, setReviewName] = useState('')
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [localReviews, setLocalReviews] = useState(restaurant.reviewItems)

  const related = restaurants.filter((r) => r.slug !== restaurant.slug).slice(0, 3)

  const media = useMemo(
    () => [
      ...restaurant.gallery.map((src, i) => ({ id: `photo-${i}`, type: 'photo' as const, src })),
      ...ugc
        .filter((u) => u.restaurantSlug === restaurant.slug)
        .map((u, i) => ({ id: `video-${i}`, type: 'video' as const, src: u.thumbnail, duration: u.duration })),
    ],
    [restaurant.slug, restaurant.gallery]
  )

  const activeMedia = media[galleryIndex] || { type: 'photo' as const, src: restaurant.image }

  const whatsappBooking = `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(
    `Hello, this booking is from Peckish.\nName:\nDate:\nTime:\nPax:\nSpecial request:`
  )}`

  function submitReview() {
    if (!reviewComment.trim()) return
    setLocalReviews(prev => [{
      id: Date.now().toString(),
      name: reviewName.trim() || 'Anonymous',
      rating: reviewRating,
      comment: reviewComment.trim(),
      date: new Date().toLocaleDateString('en-MY', { year: 'numeric', month: 'short', day: 'numeric' }),
    }, ...prev])
    setReviewName('')
    setReviewComment('')
    setReviewRating(5)
    setReviewSubmitted(true)
    setTimeout(() => setReviewSubmitted(false), 3000)
  }

  return (
    <div className="merchant-v5-shell">
      <div className="merchant-v5-head card-panel">
        <div className="merchant-v5-media">
          <img src={activeMedia.src} alt={restaurant.name} className="merchant-v5-hero" />
        </div>

        <div className="merchant-v5-main">
          <div className="merchant-top-badges">
            <span className="verified-tag">✓ Verified</span>
            {restaurant.isHalal && <span className="halal-tag">Halal</span>}
            {restaurant.isVeg && <span className="veg-tag">Vegetarian</span>}
          </div>

          <h1>{restaurant.name}</h1>
          <div className="merchant-v5-sub">{restaurant.cuisine} · {restaurant.price}</div>

          <div className="merchant-v5-stats">
            <span className="star">★ {restaurant.rating}</span>
            <span>({restaurant.reviews} reviews)</span>
            <span>·</span>
            <span>{restaurant.distanceKm} km away</span>
          </div>

          <div className="merchant-v5-hours">
            <span className={`dot ${restaurant.isOpen ? 'open' : 'closed'}`} />
            {restaurant.isOpen ? 'Closes 9pm' : 'Opens Tue 9am'}
          </div>

          <div className="merchant-v5-address">📍 {restaurant.address}, {restaurant.city}, Johor Bahru</div>

          <div className="merchant-action-icons">
            <a className="merchant-action-circle" href={`tel:+${restaurant.phone}`}>
              <span className="merchant-action-icon line">☎</span>
              <span>Call</span>
            </a>
            <a className="merchant-action-circle" href={`https://waze.com/ul?q=${encodeURIComponent(restaurant.address + ', ' + restaurant.city)}`} target="_blank" rel="noopener noreferrer">
              <span className="merchant-action-icon line">🗺️</span>
              <span>Waze</span>
            </a>
            <a className="merchant-action-circle" href={`https://wa.me/${restaurant.whatsapp}`} target="_blank" rel="noopener noreferrer">
              <span className="merchant-action-icon line">💬</span>
              <span>WhatsApp</span>
            </a>
            <button className="merchant-action-circle" onClick={() => setSaved(!saved)}>
              <span className="merchant-action-icon line">🔖</span>
              <span>{saved ? 'Saved' : 'Save'}</span>
            </button>
          </div>

          <a href={whatsappBooking} target="_blank" rel="noopener noreferrer" className="merchant-book-button">
            Book Now
          </a>
          <div className="merchant-book-note">Simple booking via WhatsApp from Peckish</div>
        </div>
      </div>

      <div className="merchant-content-grid">
        <section className="merchant-main-col">

          <div className="merchant-section card-panel" id="gallery">
            <div className="merchant-section-head">
              <h2>Gallery</h2>
              <a style={{ cursor: 'pointer', color: 'var(--orange)', fontWeight: 800, fontSize: 14 }}>View more</a>
            </div>
            <div className="merchant-gallery-preview">
              {media.slice(0, 5).map((item, i) => (
                <button key={item.id} className={`merchant-gallery-thumb ${galleryIndex === i ? 'active' : ''}`} onClick={() => setGalleryIndex(i)}>
                  <img src={item.src} alt={`${restaurant.name} media ${i + 1}`} />
                  {item.type === 'video' && <span className="thumb-video-tag">▶ {item.duration}</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="merchant-section card-panel" id="menu">
            <div className="merchant-section-head"><h2>Menu</h2></div>
            {restaurant.menu.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 32, color: 'var(--muted)' }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🍽️</div>
                <p style={{ fontWeight: 600 }}>No menu added yet</p>
              </div>
            ) : (
              <div className="menu-grid">
                {restaurant.menu.map(item => (
                  <div key={item.id} className="menu-card">
                    <img src={item.image} alt={item.name} className="menu-img" />
                    <div className="menu-info">
                      <div className="menu-name">{item.name}{item.isPopular && <span className="popular-tag">Popular</span>}</div>
                      <div className="menu-desc">{item.description}</div>
                      <div className="menu-price">{item.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="merchant-section card-panel" id="reviews">
            <div className="merchant-section-head">
              <h2>Reviews</h2>
              <span style={{ color: 'var(--orange)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Write a review</span>
            </div>
            <div style={{ background: 'var(--bg)', borderRadius: 14, padding: 18, marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={() => setReviewRating(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 26, color: s <= reviewRating ? 'var(--orange)' : '#D1D5DB', padding: 0 }}>★</button>
                ))}
              </div>
              <input style={{ width: '100%', border: '1.5px solid var(--line)', borderRadius: 10, padding: '10px 13px', fontSize: 14, outline: 'none', marginBottom: 10, fontFamily: 'inherit', boxSizing: 'border-box' as const }} placeholder="Your name (optional)" value={reviewName} onChange={e => setReviewName(e.target.value)} />
              <textarea style={{ width: '100%', border: '1.5px solid var(--line)', borderRadius: 10, padding: '10px 13px', fontSize: 14, outline: 'none', fontFamily: 'inherit', resize: 'vertical' as const, minHeight: 80, boxSizing: 'border-box' as const, marginBottom: 10 }} placeholder="Share your experience..." value={reviewComment} onChange={e => setReviewComment(e.target.value)} />
              {reviewSubmitted && <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', borderRadius: 10, padding: '10px 14px', marginBottom: 10, fontWeight: 600, fontSize: 14 }}>✓ Review posted! Thank you.</div>}
              <button onClick={submitReview} disabled={!reviewComment.trim()} style={{ background: reviewComment.trim() ? 'var(--orange)' : 'var(--line)', color: reviewComment.trim() ? 'white' : 'var(--muted)', borderRadius: 12, padding: '12px 24px', fontWeight: 700, fontSize: 14, border: 'none', cursor: reviewComment.trim() ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>Post Review</button>
            </div>
            {localReviews.map((review) => (
              <div key={review.id} className="merchant-review-row">
                <div className="merchant-review-top">
                  <strong>{review.name}</strong>
                  <span>{review.date}</span>
                </div>
                <div className="voice-stars">{'★'.repeat(review.rating)}</div>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>

          {restaurant.posts.length > 0 && (
            <div className="merchant-section card-panel">
              <div className="merchant-section-head"><h2>Posts</h2></div>
              {restaurant.posts.map(p => (
                <div key={p.id} className="post-card">
                  <div className="post-date">{p.date}</div>
                  <div className="post-title">{p.title}</div>
                  <div className="post-body">{p.body}</div>
                </div>
              ))}
            </div>
          )}

          <div className="merchant-section card-panel merchant-claim-panel">
            <div className="merchant-section-head"><h2>Claim this business</h2></div>
            <p>Own this restaurant? Claim your profile to unlock more visibility with SEO + GEO, respond to reviews, and manage your page on Peckish.</p>
            <div className="claim-inline-actions">
              <Link href={`/claim/${restaurant.slug}`} className="claim-inline-button">Claim the business</Link>
              <span className="claim-inline-note">Requires your business email and a short verification video.</span>
            </div>
          </div>
        </section>

        <aside className="merchant-side-col">
          <div className="merchant-section card-panel">
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>About Restaurant</h2>
            {restaurant.description && <p style={{ color: 'var(--muted)', lineHeight: 1.7, fontSize: 14, marginBottom: 20 }}>{restaurant.description}</p>}
            <div className="merchant-info-list">
              <div><span>📍</span><div><strong>Address</strong><p>{restaurant.address}, {restaurant.city}</p></div></div>
              <div><span>📞</span><div><strong>Phone</strong><p><a href={`tel:+${restaurant.phone}`} style={{ color: 'var(--blue)' }}>+{restaurant.phone}</a></p></div></div>
              <div><span>💬</span><div><strong>WhatsApp</strong><p><a href={`https://wa.me/${restaurant.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green)' }}>Chat on WhatsApp</a></p></div></div>
              <div><span>🕐</span><div><strong>Opening Hours</strong><p>{restaurant.openingHours}</p></div></div>
              <div><span>🍽️</span><div><strong>Category</strong><p>{restaurant.cuisine} · Restaurant</p></div></div>
              <div><span>💰</span><div><strong>Price</strong><p>{restaurant.price}</p></div></div>
              {restaurant.isHalal && <div><span>☪️</span><div><strong>Halal</strong><p style={{ color: 'var(--green)' }}>Halal Certified</p></div></div>}
            </div>
          </div>

          <div className="merchant-section card-panel">
            <div className="merchant-section-head"><h2>Other merchants you may like</h2></div>
            <div className="merchant-related-list">
              {related.map((r) => (
                <Link key={r.id} href={`/restaurant/${r.slug}`} className="merchant-related-item">
                  <img src={r.image} alt={r.name} />
                  <div>
                    <strong>{r.name}</strong>
                    <p>{r.cuisine} · {r.distanceKm} km</p>
                    <span>★ {r.rating}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
