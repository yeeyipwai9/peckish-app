import { Restaurant, UgcItem } from '@/lib/types'

export const restaurants: Restaurant[] = [
  {
    id: '1', name: 'Restoran Pak Haji', slug: 'restoran-pak-haji-johor-bahru',
    cuisine: 'Malay', description: 'Authentic Johor Malay cuisine loved by locals for generations. Famous for nasi lemak, mee rebus, and daily specials cooked fresh every morning.',
    address: 'No. 12, Jalan Wong Ah Fook', city: 'Johor Bahru', phone: '60127654321', whatsapp: '60127654321',
    rating: 4.6, reviews: 248, distanceKm: 1.2, price: '$$',
    image: 'https://images.unsplash.com/photo-1512058564366-9274f6b2c7?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1200&q=80',
    ],
    isOpen: true, isHalal: true, isVeg: false,
    openingHours: 'Open 7:00 AM – 10:00 PM daily',
    ratingBars: [80, 45, 18, 10, 5],
    menu: [
      { id: 'm1', name: 'Nasi Lemak Set', description: 'Fragrant coconut rice, crispy ayam goreng, sambal, cucumber, peanuts and egg.', price: 'RM 14.90', image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=900&q=80', isPopular: true },
      { id: 'm2', name: 'Mee Rebus', description: 'Thick yellow noodles in a rich sweet potato gravy, topped with egg, tofu and lime.', price: 'RM 11.90', image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=900&q=80', isPopular: true },
      { id: 'm3', name: 'Roti Canai', description: 'Crispy layered flatbread served with dal and curry sauce.', price: 'RM 4.50', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=80' },
      { id: 'm4', name: 'Teh Tarik', description: 'Classic pulled milk tea, frothy and sweet.', price: 'RM 3.50', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=900&q=80' },
    ],
    reviewItems: [
      { id: 'r1', name: 'Aina Z.', rating: 5, comment: 'Great food, friendly staff and worth the price! The nasi lemak here is the best in JB, I come every week.', date: 'Mar 2025' },
      { id: 'r2', name: 'Hafiz M.', rating: 5, comment: 'Authentic Johor flavours. The mee rebus gravy is so rich. Will definitely come back!', date: 'Feb 2025' },
      { id: 'r3', name: 'Sarah L.', rating: 4, comment: 'Good food and reasonable prices. Can get quite crowded during lunch.', date: 'Jan 2025' },
    ],
    posts: [
      { id: 'p1', title: 'New Daily Special — Laksa Johor 🍜', body: 'We are excited to announce our new daily special — Authentic Laksa Johor, available every weekend starting this Saturday!', date: 'Apr 2025' },
    ],
    lat: 1.4655, lng: 103.7578,
  },
  {
    id: '2', name: 'Kopi Kawan', slug: 'kopi-kawan-johor-bahru',
    cuisine: 'Cafe', description: 'A cosy neighbourhood cafe serving specialty coffee, homemade desserts and all-day brunch. Popular with remote workers and coffee lovers.',
    address: '18 Jalan Dhoby', city: 'Johor Bahru', phone: '60198765432', whatsapp: '60198765432',
    rating: 4.8, reviews: 315, distanceKm: 1.4, price: '$$',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
    ],
    isOpen: true, isHalal: false, isVeg: true,
    openingHours: 'Open 8:00 AM – 11:00 PM daily',
    ratingBars: [88, 50, 12, 8, 4],
    menu: [
      { id: 'm5', name: 'Flat White', description: 'Smooth double espresso with velvety steamed milk.', price: 'RM 12.90', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80', isPopular: true },
      { id: 'm6', name: 'Butter Croissant', description: 'Fresh baked every morning. Flaky, buttery, perfect with coffee.', price: 'RM 8.50', image: 'https://images.unsplash.com/photo-1555507036-ab794f4ade2a?auto=format&fit=crop&w=900&q=80' },
      { id: 'm7', name: 'Matcha Latte', description: 'Premium Japanese matcha with oat milk.', price: 'RM 14.90', image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=900&q=80', isPopular: true },
    ],
    reviewItems: [
      { id: 'r5', name: 'Michelle T.', rating: 5, comment: 'Best coffee in JB! The flat white is absolutely perfect. Love this place.', date: 'Mar 2025' },
    ],
    posts: [
      { id: 'p3', title: 'New Menu Drop ☕', body: 'We just launched our spring menu! New seasonal drinks and fresh pastries available now.', date: 'Apr 2025' },
    ],
    lat: 1.4627, lng: 103.7601,
  },
  {
    id: '3', name: 'Min Dim Sum House', slug: 'min-dim-sum-house-johor-bahru',
    cuisine: 'Dim Sum', description: 'Traditional Hong Kong style dim sum served daily from 6AM. Fresh handmade baskets, congee and char siu prepared every morning.',
    address: '55 Jalan Serampang, Taman Pelangi', city: 'Johor Bahru', phone: '60167891234', whatsapp: '60167891234',
    rating: 4.5, reviews: 182, distanceKm: 2.1, price: '$$',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=1200&q=80',
    ],
    isOpen: true, isHalal: false, isVeg: false,
    openingHours: 'Open 6:00 AM – 2:00 PM daily',
    ratingBars: [70, 55, 20, 8, 3],
    menu: [
      { id: 'm9', name: 'Har Gao (4 pcs)', description: 'Steamed prawn dumplings in thin translucent skin.', price: 'RM 9.90', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=80', isPopular: true },
      { id: 'm10', name: 'Siew Mai (4 pcs)', description: 'Open-top steamed dumplings with pork and shrimp.', price: 'RM 9.90', image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=900&q=80', isPopular: true },
    ],
    reviewItems: [
      { id: 'r7', name: 'Jasmine F.', rating: 5, comment: 'Best dim sum in JB hands down. The har gao skin is perfectly thin. Queue early!', date: 'Mar 2025' },
    ],
    posts: [], lat: 1.4721, lng: 103.7634,
  },
  {
    id: '4', name: 'Grill Yard', slug: 'grill-yard-johor-bahru',
    cuisine: 'Western', description: 'Premium burgers, steaks and grilled food in a relaxed setting. Using fresh local ingredients with Western cooking techniques.',
    address: '23 Jalan Tebrau, Taman Setia Indah', city: 'Johor Bahru', phone: '60112345678', whatsapp: '60112345678',
    rating: 4.4, reviews: 201, distanceKm: 2.3, price: '$$',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    ],
    isOpen: false, isHalal: true, isVeg: false,
    openingHours: 'Open 11:00 AM – 10:00 PM (closed Mon)',
    ratingBars: [65, 60, 25, 10, 5],
    menu: [
      { id: 'm12', name: 'Smash Burger', description: 'Double smash patty, cheddar, caramelised onion, pickles and house sauce.', price: 'RM 26.90', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80', isPopular: true },
      { id: 'm13', name: 'Ribeye Steak 200g', description: 'Grain-fed ribeye, grilled to order. Served with fries and salad.', price: 'RM 68.90', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80' },
    ],
    reviewItems: [
      { id: 'r9', name: 'Syahid K.', rating: 5, comment: 'Absolutely the best burger in JB. The smash burger is perfectly crispy and juicy!', date: 'Mar 2025' },
    ],
    posts: [], lat: 1.4598, lng: 103.7712,
  },
  {
    id: '5', name: 'Siam Road Thai', slug: 'siam-road-thai-johor-bahru',
    cuisine: 'Thai', description: 'Authentic Southern Thai cuisine with bold flavours. Famous for tom yum, pad thai, mango sticky rice and fresh seafood.',
    address: '8 Jalan Abdul Samad', city: 'Johor Bahru', phone: '60133456789', whatsapp: '60133456789',
    rating: 4.7, reviews: 164, distanceKm: 2.6, price: '$$',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80',
    ],
    isOpen: true, isHalal: true, isVeg: false,
    openingHours: 'Open 11:30 AM – 10:30 PM daily',
    ratingBars: [75, 52, 15, 8, 2],
    menu: [
      { id: 'm14', name: 'Tom Yum Goong', description: 'Spicy and sour prawn soup with lemongrass, kaffir lime and galangal.', price: 'RM 24.90', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80', isPopular: true },
      { id: 'm15', name: 'Pad Thai', description: 'Stir-fried rice noodles with prawns, egg, bean sprouts and crushed peanuts.', price: 'RM 18.90', image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=900&q=80', isPopular: true },
    ],
    reviewItems: [
      { id: 'r10', name: 'Foodie Mira', rating: 5, comment: 'The tom yum here is incredible. Perfectly balanced. One of my fav spots in JB!', date: 'Mar 2025' },
    ],
    posts: [], lat: 1.4612, lng: 103.7689,
  },
]

export const ugc: UgcItem[] = [
  { id: 'u1', type: 'video', creator: '@syahid', restaurantSlug: 'grill-yard-johor-bahru', restaurantName: 'Grill Yard', thumbnail: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80', likes: 238, caption: 'Best burger in JB!', duration: '0:15' },
  { id: 'u2', type: 'video', creator: '@eatjb', restaurantSlug: 'restoran-pak-haji-johor-bahru', restaurantName: 'Restoran Pak Haji', thumbnail: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=900&q=80', likes: 184, caption: 'Nasi lemak heaven', duration: '0:23' },
  { id: 'u3', type: 'video', creator: '@sweettooth', restaurantSlug: 'kopi-kawan-johor-bahru', restaurantName: 'Kopi Kawan', thumbnail: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80', likes: 312, caption: 'Soft serve mood ☁️', duration: '0:18' },
  { id: 'u4', type: 'video', creator: '@jasminefoodie', restaurantSlug: 'min-dim-sum-house-johor-bahru', restaurantName: 'Min Dim Sum House', thumbnail: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=80', likes: 205, caption: 'Sunday dim sum ritual', duration: '0:20' },
  { id: 'u5', type: 'video', creator: '@foodiemira', restaurantSlug: 'siam-road-thai-johor-bahru', restaurantName: 'Siam Road Thai', thumbnail: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80', likes: 176, caption: 'Tom yum obsession 🌶️', duration: '0:17' },
]
