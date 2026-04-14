import { NextRequest, NextResponse } from 'next/server'
import { sb } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') ?? '/'

  if (code) {
    try {
      await sb.auth.exchangeCodeForSession(code)
    } catch (e) {
      console.error('Auth callback error:', e)
    }
  }

  return NextResponse.redirect(new URL(next, url.origin))
}
