import { restaurants as mockRestaurants } from '@/data/mock'
import { sb } from '@/lib/supabase'
import { fromDB } from '@/lib/types'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import RestaurantDetail from '@/components/RestaurantDetail'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const r = mockRestaurants.find(r => r.slug === slug)
  if (!r) return { title: 'Not Found — Peckish' }
  return {
    title: `${r.name} — ${r.cuisine} in ${r.city} | Peckish`,
    description: `${r.name} is a ${r.cuisine} restaurant in ${r.city}. Rated ${r.rating}/5 from ${r.reviews} reviews.${r.isHalal ? ' Halal certified.' : ''} Find menu, reviews, photos and directions on Peckish.`,
    openGraph: {
      title: `${r.name} — Peckish`,
      description: `${r.cuisine} in ${r.city}. Rated ${r.rating}/5.${r.isHalal ? ' Halal.' : ''}`,
      images: [{ url: r.image }],
      url: `https://peckish.my/restaurant/${r.slug}`,
    },
    alternates: { canonical: `https://peckish.my/restaurant/${r.slug}` },
  }
}

export function generateStaticParams() {
  return mockRestaurants.map(r => ({ slug: r.slug }))
}

export default async function RestaurantPage({ params }: Props) {
  const { slug } = await params

  // Try Supabase first, fall back to mock
  let restaurant = null
  try {
    const { data } = await sb.from('restaurants').select('*').eq('slug', slug).single()
    if (data) restaurant = fromDB(data)
  } catch { }
  if (!restaurant) restaurant = mockRestaurants.find(r => r.slug === slug) ?? null
  if (!restaurant) return notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: restaurant.name,
    url: `https://peckish.my/restaurant/${restaurant.slug}`,
    image: restaurant.image,
    description: restaurant.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: restaurant.address,
      addressLocality: restaurant.city,
      addressRegion: 'Johor',
      addressCountry: 'MY',
    },
    aggregateRating: restaurant.reviews > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: restaurant.rating,
      reviewCount: restaurant.reviews,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    servesCuisine: restaurant.cuisine,
    priceRange: restaurant.price,
    telephone: `+${restaurant.phone}`,
    openingHours: 'Mo-Su 08:00-22:00',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RestaurantDetail restaurant={restaurant} />
    </>
  )
}
