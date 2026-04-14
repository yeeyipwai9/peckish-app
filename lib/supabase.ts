import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder'

export const sb = createClient(url, key)

// Auth helpers
export async function getUser() {
  try {
    const { data: { user } } = await sb.auth.getUser()
    return user
  } catch { return null }
}

export async function signInWithGoogle() {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
  return sb.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${origin}/auth/callback` }
  })
}

export async function signOut() {
  return sb.auth.signOut()
}
