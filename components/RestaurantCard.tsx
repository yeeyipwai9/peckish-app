import Link from 'next/link'
import { Restaurant } from '@/lib/types'

function getHoursText(restaurant: Restaurant) {
  if (restaurant.isOpen) {
    return restaurant.slug === 'kopi-kawan-johor-bahru'
      ? 'Closes 11pm'
      : restaurant.slug === 'siam-road-thai-johor-bahru'
        ? 'Closes 10:30pm'
        : restaurant.slug === 'min-dim-sum-house-johor-bahru'
          ? 'Closes 2pm'
          : 'Closes 9pm'
  }
  return 'Opens Tue 9am'
}

export default function RestaurantCard({
  restaurant,
  compact,
}: {
  restaurant: Restaurant
  compact?: boolean
}) {
  return (
    <Link
      href={`/restaurant/${restaurant.slug}`}
      className={`restaurant-card ${compact ? 'restaurant-card-compact' : ''}`}
    >
      <div className="image-wrap">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="card-image"
          style={{ height: compact ? '140px' : '180px' }}
        />
        <span className="verified-badge">Verified</span>
        {restaurant.isHalal && <span className="halal-badge">Halal</span>}
        {restaurant.isVeg && <span className="veg-badge">Veg</span>}
      </div>
      <div className="card-body">
        <div className="card-title">{restaurant.name}</div>
        <div className="card-stats">
          <span className="star">★ {restaurant.rating}</span>
          <span className="muted">({restaurant.reviews}) · {restaurant.distanceKm} km</span>
        </div>
        <div className="card-sub">
          {restaurant.cuisine} · {restaurant.price}
        </div>
        <div className={`card-hours ${restaurant.isOpen ? 'open' : 'closed'}`}>
          {getHoursText(restaurant)}
        </div>
      </div>
    </Link>
  )
}
