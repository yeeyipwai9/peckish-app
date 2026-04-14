export type MenuItem = {
  id: string
  name: string
  description: string
  price: string
  image: string
  isPopular?: boolean
}

export type ReviewItem = {
  id: string
  name: string
  avatar?: string
  rating: number
  comment: string
  date: string
}

export type Post = {
  id: string
  title: string
  body: string
  image?: string
  date: string
}

export type Restaurant = {
  id: string
  name: string
  slug: string
  cuisine: string
  description: string
  address: string
  city: string
  phone: string
  whatsapp: string
  rating: number
  reviews: number
  distanceKm: number
  price: string
  image: string
  gallery: string[]
  isOpen: boolean
  isHalal: boolean
  isVeg: boolean
  openingHours: string
  menu: MenuItem[]
  reviewItems: ReviewItem[]
  posts: Post[]
  ratingBars: number[]
  lat?: number
  lng?: number
}

export type UgcItem = {
  id: string
  type: 'video' | 'photo'
  creator: string
  restaurantSlug: string
  restaurantName: string
  thumbnail: string
  likes: number
  caption: string
  duration?: string
}

// Supabase DB types (snake_case from DB)
export type DBRestaurant = {
  id: string
  name: string
  slug: string
  description: string
  cuisine_type: string
  address: string
  city: string
  phone: string
  whatsapp: string
  rating: number
  review_count: number
  price_range: string
  image_url: string
  is_open: boolean
  is_halal: boolean
  is_vegetarian: boolean
  opening_hours: string
  lat?: number
  lng?: number
  is_pro?: boolean
  is_verified?: boolean
  claim_status?: string
}

// Convert DB format to app format
export function fromDB(r: DBRestaurant): Restaurant {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    cuisine: r.cuisine_type ?? '',
    description: r.description ?? '',
    address: r.address ?? '',
    city: r.city ?? 'Johor Bahru',
    phone: r.phone ?? '',
    whatsapp: r.whatsapp ?? '',
    rating: r.rating ?? 0,
    reviews: r.review_count ?? 0,
    distanceKm: 0,
    price: r.price_range ?? '$$',
    image: r.image_url ?? 'https://images.unsplash.com/photo-1512058564366-9274f6b2c7?auto=format&fit=crop&w=1200&q=80',
    gallery: [],
    isOpen: r.is_open ?? true,
    isHalal: r.is_halal ?? false,
    isVeg: r.is_vegetarian ?? false,
    openingHours: r.opening_hours ?? '',
    menu: [],
    reviewItems: [],
    posts: [],
    ratingBars: [80, 45, 18, 10, 5],
    lat: r.lat,
    lng: r.lng,
  }
}
