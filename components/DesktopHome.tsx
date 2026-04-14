'use client'
import Link from 'next/link'
import { useState } from 'react'
import { restaurants, ugc } from '@/data/mock'
import RestaurantCard from './RestaurantCard'
import UgcCard from './UgcCard'

const heroBanners = [
  {
    title: 'Claim your business now',
    body: 'Boost visibility with SEO and GEO so your restaurant can be found in Google and AI search.',
    cta: 'Claim now',
    theme: 'claim',
  },
  {
    title: 'Lunch break ideas',
    body: 'Quick bites and easy lunch spots for busy weekdays near you.',
    cta: 'Explore lunch',
    image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Family dinner time',
    body: 'Great places for sharing plates, comfort food and dinner plans.',
    cta: 'Explore dinner',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80',
  },
]

const campaignBanners = [
  {
    title: 'Lunch break specials',
    body: 'Quick bites, set lunch, and office-hour favourites.',
    cta: 'View lunch ideas',
    image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Family dinner deals',
    body: 'Weekend sharing meals and comfortable spots for everyone.',
    cta: 'See dinner picks',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Weekend cravings',
    body: 'Treat yourself with burgers, desserts and late-night bites.',
    cta: 'Explore now',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
  },
]

const positiveReviews = restaurants.flatMap((r) =>
  r.reviewItems
    .filter((rv) => rv.rating >= 4)
    .slice(0, 1)
    .map((rv) => ({
      id: `${r.id}-${rv.id}`,
      restaurant: r.name,
      image: r.image,
      reviewer: rv.name,
      date: rv.date,
      text: rv.comment,
      rating: rv.rating,
    }))
)

const mostViewed = [...restaurants].sort((a, b) => b.reviews - a.reviews)
const topRank = [...restaurants].sort((a, b) => b.rating - a.rating)
const mostVotedFoods = restaurants
  .flatMap((r) =>
    r.menu
      .slice(0, 2)
      .map((item, idx) => ({ ...item, restaurant: r.name, votes: 420 - idx * 37 - Number(r.id) * 15 }))
  )
  .sort((a, b) => b.votes - a.votes)
  .slice(0, 5)

const heroRestaurant = restaurants[0]

export default function DesktopHome() {
  const [heroIndex, setHeroIndex] = useState(0)
  const [campaignIndex, setCampaignIndex] = useState(0)
  const activeHero = heroBanners[heroIndex]
  const activeCampaign = campaignBanners[campaignIndex]

  return (
    <div className="desktop-only v5-shell">
      <header className="section topbar v5-topbar">
        <Link href="/" className="brand v5-brand">
          <img src="/peckish-logo.png" alt="Peckish" className="brand-logo-img" />
          <span>PECKISH</span>
        </Link>
        <nav className="nav-links">
          <a className="active">Explore</a>
          <a>Nearby</a>
          <a>Deals</a>
          <a>Feed</a>
          <a>About</a>
        </nav>
        <div className="top-actions">
          <span className="location-pill">📍 Johor Bahru ▾</span>
          <span className="avatar">👤</span>
        </div>
      </header>

      <section className="section card-panel hero v5-hero-frame">
        <div className="hero-copy">
          <h1>Discover what<br />to eat <span>near you</span></h1>
          <p>Real food, real reviews, real people.<br />Find the best eats around you.</p>
          <div className="search-row">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input placeholder="Search food, restaurant or area" />
            </div>
            <button>📍 Near me</button>
          </div>
          <div className="chips">
            {['All', 'Cheap Eats', 'Halal', 'Coffee', 'Late Night', 'Dessert'].map((label, i) => (
              <span key={label} className={`chip ${i === 0 ? 'active' : ''}`}>{label}</span>
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <img src={heroRestaurant.gallery[0] || heroRestaurant.image} alt="hero food" className="hero-food" />
          <div className="hero-ugc-card">
            <img src={ugc[0].thumbnail} alt={ugc[0].caption} />
            <div className="hero-ugc-overlay">
              <div style={{ fontWeight: 800, fontSize: 15 }}>The best curry mee in JB!</div>
              <div className="ugc-likes"><span>♥</span> 1.2k</div>
              <div className="creator">@aina_eats</div>
            </div>
          </div>
          <div className="hero-map-card v5-map-card">
            <div className="map-img" />
            <div className="map-label">See more places here</div>
            <div className="map-sub">📍 Near you</div>
          </div>
        </div>
      </section>

      {/* HERO CAROUSEL BANNER */}
      <section className="section">
        <div className="carousel-banner card-panel">
          <button className="carousel-arrow left" onClick={() => setHeroIndex((heroIndex + heroBanners.length - 1) % heroBanners.length)}>←</button>
          <div className={`banner-slide ${activeHero.theme === 'claim' ? 'claim' : ''}`}>
            <div className="banner-slide-copy">
              <div className="banner-kicker">{heroIndex === 0 ? 'Merchant growth banner' : 'Featured campaign'}</div>
              <h3>{activeHero.title}</h3>
              <p>{activeHero.body}</p>
              <button>{activeHero.cta}</button>
            </div>
            {activeHero.theme === 'claim' ? (
              <div className="banner-slide-claim-art">
                <img src="/peckish-logo.png" alt="Peckish pin" />
              </div>
            ) : (
              <img src={(activeHero as any).image} alt={activeHero.title} className="banner-slide-image" />
            )}
          </div>
          <button className="carousel-arrow right" onClick={() => setHeroIndex((heroIndex + 1) % heroBanners.length)}>→</button>
          <div className="carousel-dots">
            {heroBanners.map((_, idx) => (
              <button key={idx} className={`dot-btn ${idx === heroIndex ? 'active' : ''}`} onClick={() => setHeroIndex(idx)} />
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR */}
      <section className="section">
        <div className="section-head">
          <div className="section-head-left">
            <h2>Popular this week <span className="section-sub-inline">(within 15 km · most viewed)</span></h2>
            <p>Restaurants getting the most attention near you this week.</p>
          </div>
          <span className="view-all">View all →</span>
        </div>
        <div className="grid-5">{mostViewed.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}</div>
      </section>

      {/* TOP RANK */}
      <section className="section">
        <div className="section-head">
          <div className="section-head-left">
            <h2>Top rank restaurants <span className="section-sub-inline">(within 5 km · highest rank)</span></h2>
            <p>Best-rated restaurants close to you.</p>
          </div>
          <span className="view-all">View all →</span>
        </div>
        <div className="grid-5 rank-grid">
          {topRank.map((r, idx) => (
            <div key={r.id} className="rank-card-wrap">
              <span className="rank-badge">{idx + 1}</span>
              <RestaurantCard restaurant={r} />
            </div>
          ))}
        </div>
      </section>

      {/* MOST VOTED FOOD */}
      <section className="section">
        <div className="section-head">
          <div className="section-head-left">
            <h2>Weekly most voted food items</h2>
            <p>Most voted dishes this week during the MVP period.</p>
          </div>
          <span className="view-all">View all →</span>
        </div>
        <div className="food-vote-grid">
          {mostVotedFoods.map((item) => (
            <div key={item.id} className="food-vote-card">
              <img src={item.image} alt={item.name} />
              <div className="food-vote-body">
                <div className="food-vote-name">{item.name}</div>
                <div className="food-vote-merchant">{item.restaurant}</div>
                <div className="food-vote-count">{item.votes} votes</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CAMPAIGN BANNER */}
      <section className="section">
        <div className="carousel-banner campaign-banner card-panel compact">
          <button className="carousel-arrow left" onClick={() => setCampaignIndex((campaignIndex + campaignBanners.length - 1) % campaignBanners.length)}>←</button>
          <div className="banner-slide compact campaign">
            <div className="banner-slide-copy">
              <div className="banner-kicker">Internal campaign</div>
              <h3>{activeCampaign.title}</h3>
              <p>{activeCampaign.body}</p>
              <button>{activeCampaign.cta}</button>
            </div>
            <img src={activeCampaign.image} alt={activeCampaign.title} className="banner-slide-image" />
          </div>
          <button className="carousel-arrow right" onClick={() => setCampaignIndex((campaignIndex + 1) % campaignBanners.length)}>→</button>
          <div className="carousel-dots">
            {campaignBanners.map((_, idx) => (
              <button key={idx} className={`dot-btn ${idx === campaignIndex ? 'active' : ''}`} onClick={() => setCampaignIndex(idx)} />
            ))}
          </div>
        </div>
      </section>

      {/* PEOPLE VOICE */}
      <section className="section">
        <div className="section-head">
          <div className="section-head-left">
            <h2>People voice</h2>
            <p>Positive review highlights only.</p>
          </div>
        </div>
        <div className="voice-grid">
          {positiveReviews.map((item) => (
            <div key={item.id} className="voice-card">
              <img src={item.image} alt={item.restaurant} className="voice-image" />
              <div className="voice-body">
                <div className="voice-header">
                  <div className="voice-name">{item.reviewer}</div>
                  <div className="voice-date">{item.date}</div>
                </div>
                <div className="voice-stars">{'★'.repeat(item.rating)}</div>
                <div className="voice-text">{item.text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ENDLESS SCROLL */}
      <section className="section">
        <div className="section-head">
          <div className="section-head-left">
            <h2>Endless scroll videos and photos</h2>
            <p>Keep discovering what people are eating around you.</p>
          </div>
        </div>
        <div className="masonry-feed">{[...ugc, ...ugc].map((u, idx) => <UgcCard key={`${u.id}-${idx}`} item={u} />)}</div>
      </section>

      {/* APP CTA */}
      <section className="section app-cta">
        <div>
          <div className="brand" style={{ color: 'white' }}>
            <img src="/peckish-logo.png" alt="Peckish" className="brand-logo-img" style={{ filter: 'brightness(10)' }} />
            <span>PECKISH</span>
          </div>
          <h3 style={{ fontSize: 28, fontWeight: 800, margin: '12px 0 8px' }}>Hungry? Let&apos;s Peckish.</h3>
          <p style={{ color: 'rgba(255,255,255,.6)' }}>Your local food discovery companion.</p>
          <div className="stores" style={{ marginTop: 16 }}>
            <button className="store-btn">🍎 App Store</button>
            <button className="store-btn">▶ Google Play</button>
          </div>
        </div>
        <div />
        <div className="qr-box"><div style={{ fontSize: 9 }}>Scan to download<br />Peckish App</div></div>
      </section>

      {/* FOOTER */}
      <footer className="footer-main">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="brand"><img src="/peckish-logo.png" alt="Peckish" className="brand-logo-img" /><span>PECKISH</span></div>
            <p>Real food. Real people. Real nearby.</p>
          </div>
          <div className="footer-col"><h4>Discover</h4><a>Explore</a><a>Nearby</a><a>Deals</a><a>Feed</a></div>
          <div className="footer-col"><h4>Business</h4><a>For Restaurants</a><a>Claim Page</a><a>Advertise</a><a>Pricing</a></div>
          <div className="footer-col"><h4>Company</h4><a>About</a><a>Support</a><a>Privacy</a><a>Terms</a></div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Peckish · Johor Bahru, Malaysia</span>
          <div className="social-icons">
            <span className="social-icon">📸</span>
            <span className="social-icon">🎵</span>
            <span className="social-icon">📘</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
