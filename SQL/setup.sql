-- ================================================================
-- PECKISH — Complete Supabase Database Setup
-- Paste this entire file into Supabase SQL Editor and run it
-- supabase.com/dashboard → your project → SQL Editor → New query
-- ================================================================

-- ── RESTAURANTS ──────────────────────────────────────────────────
create table if not exists restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  cuisine_type text,
  address text,
  city text default 'Johor Bahru',
  phone text,
  whatsapp text,
  email text,
  rating numeric(3,2) default 0,
  review_count integer default 0,
  price_range text default '$$',
  image_url text,
  is_pro boolean default false,
  is_verified boolean default false,
  is_open boolean default true,
  is_halal boolean default false,
  is_vegetarian boolean default false,
  lat numeric(10,7),
  lng numeric(10,7),
  opening_hours text,
  claim_status text default 'unclaimed',
  claimed_by_user_id uuid references auth.users(id),
  created_at timestamptz default now()
);

-- ── REVIEWS ──────────────────────────────────────────────────────
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade,
  user_id uuid references auth.users(id),
  user_name text,
  user_avatar text,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

-- ── MENU CATEGORIES ──────────────────────────────────────────────
create table if not exists menu_categories (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade,
  name text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ── MENU ITEMS ───────────────────────────────────────────────────
create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references menu_categories(id) on delete cascade,
  restaurant_id uuid references restaurants(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10,2) not null,
  image_url text,
  is_available boolean default true,
  is_popular boolean default false,
  created_at timestamptz default now()
);

-- ── POSTS ────────────────────────────────────────────────────────
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade,
  title text,
  body text,
  image_url text,
  created_at timestamptz default now()
);

-- ── UGC MEDIA ────────────────────────────────────────────────────
create table if not exists ugc_media (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade,
  user_id uuid references auth.users(id),
  user_name text,
  media_type text check (media_type in ('photo','video')),
  media_url text,
  thumbnail_url text,
  caption text,
  likes integer default 0,
  duration text,
  is_approved boolean default false,
  created_at timestamptz default now()
);

-- ── MERCHANT CLAIMS ──────────────────────────────────────────────
create table if not exists merchant_claims (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade,
  user_id uuid references auth.users(id),
  claimant_name text,
  business_email text,
  business_phone text,
  verification_video_url text,
  supporting_photo_url text,
  notes text,
  status text default 'pending' check (status in ('pending','approved','rejected')),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

-- ── MERCHANT ACCOUNTS ────────────────────────────────────────────
create table if not exists merchant_accounts (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade,
  user_id uuid references auth.users(id),
  role text default 'owner',
  is_active boolean default true,
  created_at timestamptz default now(),
  unique(restaurant_id, user_id)
);

-- ── SAVED PLACES ─────────────────────────────────────────────────
create table if not exists saved_places (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  restaurant_id uuid references restaurants(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, restaurant_id)
);

-- ── INDEXES ──────────────────────────────────────────────────────
create index if not exists idx_restaurants_slug on restaurants(slug);
create index if not exists idx_restaurants_halal on restaurants(is_halal);
create index if not exists idx_reviews_restaurant on reviews(restaurant_id);
create index if not exists idx_menu_items_restaurant on menu_items(restaurant_id);
create index if not exists idx_posts_restaurant on posts(restaurant_id);
create index if not exists idx_ugc_restaurant on ugc_media(restaurant_id);
create index if not exists idx_claims_status on merchant_claims(status);
create index if not exists idx_saved_user on saved_places(user_id);

-- ── ROW LEVEL SECURITY ───────────────────────────────────────────
alter table restaurants enable row level security;
alter table reviews enable row level security;
alter table menu_categories enable row level security;
alter table menu_items enable row level security;
alter table posts enable row level security;
alter table ugc_media enable row level security;
alter table merchant_claims enable row level security;
alter table merchant_accounts enable row level security;
alter table saved_places enable row level security;

-- Restaurants: public read, only merchants/admin can write
create policy "restaurants_public_read" on restaurants for select using (true);
create policy "restaurants_merchant_update" on restaurants for update using (
  auth.uid() = claimed_by_user_id
);

-- Reviews: public read, authenticated users can insert their own
create policy "reviews_public_read" on reviews for select using (true);
create policy "reviews_user_insert" on reviews for insert with check (
  auth.uid() = user_id or user_id is null
);

-- Menu: public read
create policy "menu_categories_public_read" on menu_categories for select using (true);
create policy "menu_items_public_read" on menu_items for select using (true);

-- Posts: public read
create policy "posts_public_read" on posts for select using (true);
create policy "posts_merchant_insert" on posts for insert with check (
  exists (select 1 from merchant_accounts where restaurant_id = posts.restaurant_id and user_id = auth.uid())
);

-- UGC: public read approved, users insert own
create policy "ugc_public_read" on ugc_media for select using (is_approved = true or user_id = auth.uid());
create policy "ugc_user_insert" on ugc_media for insert with check (auth.uid() = user_id);

-- Claims: users can read own, insert own
create policy "claims_user_read" on merchant_claims for select using (auth.uid() = user_id);
create policy "claims_user_insert" on merchant_claims for insert with check (auth.uid() = user_id);

-- Merchant accounts: users can read own
create policy "merchant_accounts_user_read" on merchant_accounts for select using (auth.uid() = user_id);

-- Saved places: users manage own
create policy "saved_user_all" on saved_places using (auth.uid() = user_id);

-- ── FUNCTION: Update review count & rating ───────────────────────
create or replace function update_restaurant_rating()
returns trigger as $$
begin
  update restaurants set
    review_count = (select count(*) from reviews where restaurant_id = NEW.restaurant_id),
    rating = (select round(avg(rating)::numeric, 1) from reviews where restaurant_id = NEW.restaurant_id)
  where id = NEW.restaurant_id;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_review_insert
  after insert on reviews
  for each row execute function update_restaurant_rating();

-- ── SAMPLE DATA ──────────────────────────────────────────────────
-- Insert 5 demo restaurants for Johor Bahru
-- You can delete these once you have real data

insert into restaurants (name, slug, description, cuisine_type, address, city, phone, whatsapp, rating, review_count, price_range, image_url, is_open, is_halal, is_vegetarian, opening_hours, lat, lng) values
(
  'Restoran Pak Haji',
  'restoran-pak-haji-johor-bahru',
  'Authentic Johor Malay cuisine loved by locals for generations. Famous for nasi lemak, mee rebus, and daily specials.',
  'Malay',
  'No. 12, Jalan Wong Ah Fook',
  'Johor Bahru',
  '60127654321',
  '60127654321',
  4.6, 248, '$$',
  'https://images.unsplash.com/photo-1512058564366-9274f6b2c7?auto=format&fit=crop&w=1200&q=80',
  true, true, false,
  'Open 7:00 AM – 10:00 PM daily',
  1.4655, 103.7578
),
(
  'Kopi Kawan',
  'kopi-kawan-johor-bahru',
  'A cosy neighbourhood cafe serving specialty coffee, homemade desserts and all-day brunch.',
  'Cafe',
  '18 Jalan Dhoby',
  'Johor Bahru',
  '60198765432',
  '60198765432',
  4.8, 315, '$$',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
  true, false, true,
  'Open 8:00 AM – 11:00 PM daily',
  1.4627, 103.7601
),
(
  'Min Dim Sum House',
  'min-dim-sum-house-johor-bahru',
  'Traditional Hong Kong style dim sum served daily from 6AM. Fresh handmade dim sum baskets, congee and char siu.',
  'Dim Sum',
  '55 Jalan Serampang, Taman Pelangi',
  'Johor Bahru',
  '60167891234',
  '60167891234',
  4.5, 182, '$$',
  'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
  true, false, false,
  'Open 6:00 AM – 2:00 PM daily',
  1.4721, 103.7634
),
(
  'Grill Yard',
  'grill-yard-johor-bahru',
  'Premium burgers, steaks and grilled food in a relaxed setting. Using fresh local ingredients.',
  'Western',
  '23 Jalan Tebrau, Taman Setia Indah',
  'Johor Bahru',
  '60112345678',
  '60112345678',
  4.4, 201, '$$',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
  false, true, false,
  'Open 11:00 AM – 10:00 PM (closed Mon)',
  1.4598, 103.7712
),
(
  'Siam Road Thai',
  'siam-road-thai-johor-bahru',
  'Authentic Southern Thai cuisine with bold flavours. Famous for tom yum, pad thai, and fresh seafood.',
  'Thai',
  '8 Jalan Abdul Samad',
  'Johor Bahru',
  '60133456789',
  '60133456789',
  4.7, 164, '$$',
  'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80',
  true, true, false,
  'Open 11:30 AM – 10:30 PM daily',
  1.4612, 103.7689
)
on conflict (slug) do nothing;

-- ── STORAGE BUCKET ───────────────────────────────────────────────
-- Run this separately in Supabase Dashboard → Storage → New Bucket
-- Bucket name: ugc
-- Public: true
-- Or uncomment and run:
-- insert into storage.buckets (id, name, public) values ('ugc', 'ugc', true) on conflict do nothing;

-- ================================================================
-- DONE. Your Peckish database is ready!
-- Next step: Set up Google OAuth in Supabase Dashboard
-- Authentication → Providers → Google → Enable
-- ================================================================
