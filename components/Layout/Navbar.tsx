'use client'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav style={{ background: '#111', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link href="/" style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none' }}>
        Top965
      </Link>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <Link href="/search" style={{ color: '#ccc', textDecoration: 'none' }}>Search</Link>
        <Link href="/auth/login" style={{ color: '#ccc', textDecoration: 'none' }}>Login</Link>
        <Link href="/auth/signup" style={{ color: '#fff', background: '#e63946', padding: '0.4rem 1rem', borderRadius: '6px', textDecoration: 'none' }}>Sign Up</Link>
      </div>
    </nav>
  )
}
