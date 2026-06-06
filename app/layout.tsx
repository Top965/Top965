import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'Top965 — Kuwait\'s #1 Trusted Rating Platform',
  description: 'Discover and rate the best restaurants, cafes, salons and services in Kuwait.',
  keywords: 'Kuwait restaurants, Kuwait cafes, Kuwait reviews, ratings Kuwait',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
