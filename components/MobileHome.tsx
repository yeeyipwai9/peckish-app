'use client'
import { useState } from 'react'
import { restaurants, ugc } from '@/data/mock'
import RestaurantCard from './RestaurantCard'
import UgcCard from './UgcCard'

const tabs = ['home', 'find', 'lucky', 'profile'] as const
type Tab = typeof tabs[number]

const heroBanners = [
  { title: 'Claim your business now', body: 'Boost visibility with SEO + GEO (AI search).', cta: 'Claim now' },
  {
    title: 'Lunch break ideas',
    body: 'Quick nearby lunch picks.',
    cta: 'Explore lunch',
    image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Family dinner time',
    body: 'Warm spots for sharing.',
    cta: 'Explore dinner',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80',
  },
]

export default function MobileHome() {
  const [tab, setTab] = useState<Tab>('home')
  const [showSheet, setShowSheet] = useState(false)
  const [bannerIndex, setBannerIndex] = useState(0)
  const [activeCuisine, setActiveCuisine] = useState('All')
  const [luckyResult, setLuckyResult] = useState<typeof restaurants[0] | null>(null)
  const [spinning, setSpinning] = useState(false)

  const popular = [...restaurants].sort((a, b) => b.reviews - a.reviews).slice(0, 3)
  const topRank = [...restaurants].sort((a, b) => b.rating - a.rating).slice(0, 3)
  const mostVoted = restaurants
    .flatMap((r) => r.menu.slice(0, 1).map((m, i) => ({ ...m, restaurant: r.name, votes: 300 - i * 20 - Number(r.id) * 11 })))
    .slice(0, 3)

  const activeBanner = heroBanners[bannerIndex]

  const CUISINES = ['All','Kopitiam','Hawker','Japanese','Korean','Western','Malay','Chinese','Indian','Cafe']
  const filtered = activeCuisine === 'All' ? restaurants : restaurants.filter(r => r.cuisine.toLowerCase().includes(activeCuisine.toLowerCase()))

  function spinLucky() {
    setSpinning(true)
    setLuckyResult(null)
    setTimeout(() => {
      setLuckyResult(restaurants[Math.floor(Math.random() * restaurants.length)])
      setSpinning(false)
    }, 1400)
  }

  function getGreeting() {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="mobile-only">
      <div className="mobile-shell v5-mobile-shell">
        {tab === 'home' && (
          <>
            <div className="mobile-header v5-mobile-header">
              <div className="mobile-header-top">
                <div className="mobile-brand-line">
                  <img src="/peckish-logo.png" alt="Peckish" className="mobile-logo-img" />
                  <span className="mobile-brand-text">PECKISH</span>
                </div>
                <div className="mobile-location">📍 Johor Bahru ▾</div>
              </div>
              <div className="mobile-greeting">{getGreeting()}, foodie! 👋</div>
              <h1 className="mobile-hero-title">What are you <span>craving</span> today?</h1>
              <div className="mobile-search-wrap">
                <span className="mobile-search-icon">🔎</span>
                <input className="mobile-search" placeholder="Search restaurants, cuisine..." />
              </div>
            </div>

            <section className="mobile-section">
              <div className="mobile-carousel card-panel">
                <button className="carousel-arrow left" onClick={() => setBannerIndex((bannerIndex + heroBanners.length - 1) % heroBanners.length)}>←</button>
                <div className={`mobile-carousel-slide ${bannerIndex === 0 ? 'claim' : ''}`}>
                  <div className="mobile-banner-copy">
                    <h3>{activeBanner.title}</h3>
                    <p>{activeBanner.body}</p>
                    <button>{activeBanner.cta}</button>
                  </div>
                  {bannerIndex === 0 ? (
                    <img src="/peckish-logo.png" alt="pin" className="mobile-banner-pin" />
                  ) : (
                    <img src={(activeBanner as any).image} alt={activeBanner.title} className="mobile-banner-photo" />
                  )}
                </div>
                <button className="carousel-arrow right" onClick={() => setBannerIndex((bannerIndex + 1) % heroBanners.length)}>→</button>
                <div className="carousel-dots mobile">
                  {heroBanners.map((_, idx) => (
                    <button key={idx} className={`dot-btn ${idx === bannerIndex ? 'active' : ''}`} onClick={() => setBannerIndex(idx)} />
                  ))}
                </div>
              </div>
            </section>

            <section className="mobile-section">
              <div className="mobile-section-head"><h2>Popular this week</h2><a>15 km</a></div>
              <div className="scroll-row">{popular.map((r) => <RestaurantCard key={r.id} restaurant={r} compact />)}</div>
            </section>

            <section className="mobile-section">
              <div className="mobile-section-head"><h2>Top rank restaurants</h2><a>5 km</a></div>
              <div className="scroll-row">{topRank.map((r) => <RestaurantCard key={r.id} restaurant={r} compact />)}</div>
            </section>

            <section className="mobile-section">
              <div className="mobile-section-head"><h2>Weekly most voted food</h2><a>View all</a></div>
              <div className="food-vote-mobile-list">
                {mostVoted.map((item) => (
                  <div key={item.id} className="food-vote-mobile-card">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <div className="food-vote-name">{item.name}</div>
                      <div className="food-vote-merchant">{item.restaurant}</div>
                      <div className="food-vote-count">{item.votes} votes</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mobile-section">
              <div className="mobile-section-head"><h2>People voice</h2><a>Good reviews</a></div>
              <div className="voice-mobile-list">
                {restaurants.slice(0, 3).map((r) => (
                  <div key={r.id} className="voice-mobile-card">
                    <img src={r.image} alt={r.name} className="voice-image" />
                    <div className="voice-body">
                      <div className="voice-header">
                        <div className="voice-name">{r.reviewItems[0]?.name}</div>
                        <div className="voice-date">{r.reviewItems[0]?.date}</div>
                      </div>
                      <div className="voice-stars">{'★'.repeat(r.reviewItems[0]?.rating || 5)}</div>
                      <div className="voice-text">{r.reviewItems[0]?.comment}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mobile-section">
              <div className="mobile-section-head"><h2>Endless scroll videos & photos</h2><a>View all</a></div>
              <div className="stack">{[...ugc, ...ugc].map((u, idx) => <UgcCard key={`${u.id}-${idx}`} item={u} />)}</div>
            </section>
          </>
        )}

        {tab === 'find' && (
          <>
            <div style={{ background: 'var(--navy)', color: 'white', padding: '52px 18px 24px' }}>
              <div className="mobile-brand-text" style={{ fontSize: 22, marginBottom: 8 }}>Find Food</div>
              <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 13 }}>Browse by cuisine type</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, padding: 16 }}>
              {[{e:'☕',l:'Kopitiam'},{e:'🍜',l:'Hawker'},{e:'🍱',l:'Japanese'},{e:'🥘',l:'Korean'},{e:'🍔',l:'Western'},{e:'🍚',l:'Malay'},{e:'🥟',l:'Chinese'},{e:'🍛',l:'Indian'},{e:'🧋',l:'Cafe'},{e:'🍦',l:'Desserts'}].map(cat => (
                <button key={cat.l} onClick={() => setActiveCuisine(cat.l)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, padding:'14px 8px', borderRadius:14, background: activeCuisine===cat.l ? 'var(--navy)' : 'white', color: activeCuisine===cat.l ? 'white' : 'var(--navy)', border:'1.5px solid var(--line)', cursor:'pointer', fontFamily:'inherit', fontWeight:600, fontSize:12 }}>
                  <span style={{ fontSize: 22 }}>{cat.e}</span>{cat.l}
                </button>
              ))}
            </div>
            {activeCuisine !== 'All' && (
              <div style={{ padding: '0 16px' }}>
                <div style={{ fontWeight: 700, marginBottom: 14 }}>{filtered.length} {activeCuisine} spots</div>
                <div className="stack">{filtered.map(r => <RestaurantCard key={r.id} restaurant={r} />)}</div>
              </div>
            )}
          </>
        )}

        {tab === 'lucky' && (
          <>
            <div style={{ background: 'linear-gradient(160deg, var(--navy) 0%, #1E3A5F 100%)', padding: '52px 20px 40px', textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: 'white', marginBottom: 8 }}>Feelin&apos; Lucky? 🎲</div>
              <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 14 }}>Let us pick a restaurant for you</div>
            </div>
            <div style={{ padding: '32px 20px', textAlign: 'center' }}>
              <button onClick={spinLucky} disabled={spinning} style={{ width:160, height:160, borderRadius:'50%', background: spinning ? '#9B9189' : 'linear-gradient(135deg, #F97316, #EA6C0A)', border:'none', cursor: spinning?'not-allowed':'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', margin:'0 auto 32px', boxShadow:'0 8px 32px rgba(249,115,22,.40)', fontSize:48 }}>
                <span style={{ display:'block' }}>{spinning ? '🎰' : '🎲'}</span>
                <span style={{ color:'white', fontWeight:700, fontSize:14, marginTop:8 }}>{spinning ? 'Rolling...' : 'SPIN!'}</span>
              </button>
              {!luckyResult && !spinning && <p style={{ color:'var(--muted)', fontSize:14 }}>Tap SPIN and we&apos;ll randomly pick a restaurant in JB!</p>}
              {luckyResult && !spinning && (
                <div style={{ background:'white', borderRadius:20, overflow:'hidden', boxShadow:'0 8px 32px rgba(0,0,0,.12)' }}>
                  <img src={luckyResult.image} alt={luckyResult.name} style={{ width:'100%', height:180, objectFit:'cover' }} />
                  <div style={{ padding:20 }}>
                    <div style={{ background:'var(--orange)', color:'white', fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:999, display:'inline-block', marginBottom:10 }}>🎯 YOUR PICK</div>
                    <div style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>{luckyResult.name}</div>
                    <div style={{ color:'var(--muted)', fontSize:14, marginBottom:12 }}>{luckyResult.cuisine} · {luckyResult.price}</div>
                    <div style={{ display:'flex', gap:10 }}>
                      <a href={`/restaurant/${luckyResult.slug}`} style={{ flex:1, background:'var(--orange)', color:'white', borderRadius:12, padding:12, fontWeight:700, textAlign:'center', fontSize:14, textDecoration:'none' }}>View Restaurant</a>
                      <button onClick={spinLucky} style={{ padding:'12px 16px', borderRadius:12, background:'var(--bg)', fontWeight:600, fontSize:14, border:'1.5px solid var(--line)', cursor:'pointer' }}>🔄 Respin</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {tab === 'profile' && (
          <>
            <div style={{ background: 'var(--navy)', padding: '52px 20px 32px', color: 'white' }}>
              <div style={{ fontSize: 26, fontWeight: 800 }}>Profile</div>
              <div style={{ color: 'rgba(255,255,255,.6)', marginTop: 4 }}>Sign in to save favourites</div>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ background:'white', borderRadius:20, padding:28, textAlign:'center', boxShadow:'0 4px 20px rgba(0,0,0,.08)' }}>
                <div style={{ fontSize:64, marginBottom:16 }}>🍽️</div>
                <div style={{ fontWeight:800, fontSize:20, marginBottom:8 }}>Join Peckish</div>
                <p style={{ color:'var(--muted)', fontSize:14, marginBottom:28, lineHeight:1.6 }}>Save your favourite spots, write reviews, and get personalised recommendations.</p>
                <button style={{ width:'100%', padding:14, borderRadius:12, background:'white', border:'1.5px solid var(--line)', display:'flex', alignItems:'center', justifyContent:'center', gap:12, cursor:'pointer', fontWeight:600, fontSize:15, boxShadow:'0 2px 8px rgba(0,0,0,.08)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Continue with Google
                </button>
              </div>
            </div>
          </>
        )}

        <button className="fab" onClick={() => setShowSheet(true)}>+</button>

        <nav className="bottom-nav">
          {tabs.map((t) => (
            <button key={t} className={`bottom-nav-item ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              <span className="nav-icon">{t==='home'?'🏠':t==='find'?'🔎':t==='lucky'?'🎲':'👤'}</span>
              <span>{t==='home'?'Home':t==='find'?'Find':t==='lucky'?'Lucky':'Me'}</span>
            </button>
          ))}
        </nav>

        {showSheet && (
          <div className="sheet-overlay" onClick={() => setShowSheet(false)}>
            <div className="upload-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="sheet-handle" />
              <div className="sheet-title">Upload to Gallery</div>
              <button className="sheet-option"><span className="opt-icon">🖼️</span>Upload Photo</button>
              <button className="sheet-option"><span className="opt-icon">🎥</span>Upload Video</button>
              <button className="sheet-cancel" onClick={() => setShowSheet(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
