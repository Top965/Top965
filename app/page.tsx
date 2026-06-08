'use client'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ background: '#FAF6EE', minHeight: '100vh' }}>
      <nav style={{
        background: '#0F0E0A', padding: '0 40px', height: '68px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ fontFamily: 'serif', fontSize: '22px', fontWeight: 900, color: '#C8963E' }}>
          Top<span style={{ color: '#fff' }}>965</span>
        </div>
        <Link href="/auth" style={{
          border: '1px solid rgba(200,150,62,0.4)', color: '#E8B86D',
          padding: '8px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px',
        }}>Sign In</Link>
      </nav>

      <section style={{ background: '#0F0E0A', padding: '100px 40px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'serif', fontSize: '64px', fontWeight: 900, color: '#fff', marginBottom: '20px' }}>
          Discover the <span style={{ color: '#C8963E' }}>Best</span> of Kuwait
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px', marginBottom: '40px' }}>
          Real reviews from real visits
        </p>
        <Link href="/search" style={{
          background: '#C8963E', color: '#0F0E0A', textDecoration: 'none',
          padding: '16px 40px', borderRadius: '12px', fontWeight: 700, fontSize: '16px',
        }}>
          Explore Kuwait →
        </Link>
      </section>

      <footer style={{ background: '#0F0E0A', padding: '40px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'serif', fontSize: '24px', fontWeight: 900, color: '#C8963E' }}>
          Top965
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '8px' }}>
          Made with love in Kuwait
        </p>
      </footer>
    </div>
  )
}
