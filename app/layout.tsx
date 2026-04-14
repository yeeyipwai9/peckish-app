import './globals.css'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Peckish — Discover Food Nearby in Johor Bahru',
  description: 'Discover the best restaurants, hawker stalls and cafes in Johor Bahru. Real reviews, real photos, hyperlocal food discovery.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: 'Peckish — Discover Food Nearby',
    description: 'Find the best food in JB. Real reviews, real photos.',
    url: 'https://peckish.my',
    siteName: 'Peckish',
    type: 'website',
  },
  metadataBase: new URL('https://peckish.my'),
}

export const viewport: Viewport = {
  themeColor: '#F97316',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
