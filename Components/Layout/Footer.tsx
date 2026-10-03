import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: '#0F0E0A', borderTop: '1px solid rgba(200,150,62,0.1)', padding: '48px 40px 32px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          <div>
            <div style={{ fontFamily: 'serif', fontSize: '24px', fontWeight: 900, color: '#C8963E', marginBottom: '12px' }}>
              Top<span style={{ color: '#fff' }}>965</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', lineHeight: 1.7 }}>
              Kuwait's #1 trusted rating and review platform for restaurants, cafes, salons and services.
            </p>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>Discover</div>
            {[['Restaurants', '/search?category=food-dining'], ['Cafes', '/
