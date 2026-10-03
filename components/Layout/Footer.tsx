'use client'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: '#111', borderTop: '1px solid #222', padding: '2rem', textAlign: 'center', color: '#666' }}>
      <p style={{ marginBottom: '1rem' }}>
        <Link href="/auth/login" style={{ color: '#ccc', textDecoration: 'none', marginRight: '1.5rem' }}>Login</Link>
        <Link href="/auth/signup" style={{ color: '#ccc', textDecoration: 'none', marginRight: '1.5rem' }}>Sign Up</Link>
        <Link href="/search" style={{ color: '#ccc', textDecoration: 'none' }}>Search</Link>
      </p>
      <p style={{ fontSize: '0.85rem' }}>© {new Date().getFullYear()} Top965 — Kuwait's Rating Platform</p>
    </footer>
  )
}
