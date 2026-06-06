'use client'

import Link from 'next/link'

const CATEGORIES = [
  { icon: '🍽️', name: 'Restaurants', slug: 'food-dining', count: '840+' },
  { icon: '☕', name: 'Cafes', slug: 'cafes-drinks', count: '310+' },
  { icon: '🍰', name: 'Desserts', slug: 'desserts', count: '185+' },
  { icon: '💇', name: 'Beauty & Salons', slug: 'beauty-care', count: '230+' },
  { icon: '🏋️', name: 'Fitness', slug: 'health-fitness', count: '94+' },
  { icon: '🏥', name: 'Medical', slug: 'medical', count: '178+' },
  { icon: '🚗', name: 'Automotive', slug: 'automotive', count: '150+' },
  { icon: '🏨', name: 'Hotels', slug: 'hotels', count: '120+' },
  { icon: '🛒', name: 'Shopping', slug: 'shopping', count: '260+' },
        background: '#0F0E0A', padding: '100px 40px 80px', textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'rgba(200,150,62,0.12)', border: '1px solid rgba(200,150,62,0.3)',
          color: '#E8B86D', padding: '7px 18px', borderRadius: '100px',
          fontSize: '13px', fontWeight: 600, marginBottom: '28px',
        }}>
          🇰🇼 Kuwait's #1 Trusted Review Platform
        </div>
        <h1 style={{
          fontFamily: 'serif', fontSize: '72px', fontWeight: 900,
          color: '#fff', lineHeight: 1.1, marginBottom: '20px',
        }}>
          Discover the{' '}
          <span style={{ color: '#C8963E' }}>Best</span>
          <br />of Kuwait
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px', marginBottom: '48px' }}>
          Real reviews from real visits — verified with receipts.
        </p>
        <form action="/search" style={{ maxWidth: '600px', margin: '0 auto 48px' }}>
          <div style={{
            display: 'flex', background: 'rgba(255,255,255,0.07)',
            border: '1.5px solid rgba(200,150,62,0.3)', borderRadius: '14px', overflow: 'hidden',
          }}>
            <input name="q" placeholder="Search restaurants, cafes, salons..."
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: '#fff', padding: '18px 20px', fontSize: '15px',
              }}
            />
            <button type="submit" style={{
              background: '#C8963E', border: 'none', padding: '18px 28px',
              color: '#0F0E0A', fontWeight: 700, cursor: 'pointer', fontSize: '15px',
            }}>
              Search
            </button>
          </div>
        </form>
        <div style={{ display: 'flex', gap: '48px', justifyContent: 'center' }}>
          {[['2,400+', 'PLACES'], ['18K+', 'REVIEWS'], ['94%', 'VERIFIED']].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#C8963E' }}>{num}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: '80px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '36px' }}>
            <h2 style={{ fontFamily: 'serif', fontSize: '34px', fontWeight: 700 }}>Browse by Category</h2>
            <Link href="/search" style={{ color: '#C8963E', textDecoration: 'none', fontSize: '13px' }}>View all →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '16px' }}>
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/search?category=${cat.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#fff', border: '1px solid #EEEBE4', borderRadius: '16px',
                  padding: '24px 16px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>{cat.icon}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#2C2A24' }}>{cat.name}</div>
                  <div style={{ fontSize: '11px', color: '#7A7468', marginTop: '3px' }}>{cat.count} places</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '0 40px 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            background: '#0F0E0A', borderRadius: '24px', padding: '64px',
            textAlign: 'center',
          }}>
            <h2 style={{ fontFamily: 'serif', fontSize: '42px', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>
              Own a Business in <span style={{ color: '#C8963E' }}>Kuwait?</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', marginBottom: '32px' }}>
              Claim your free listing and connect with thousands of customers.
            </p>
            <Link href="/auth/signup" style={{
              background: '#C8963E', color: '#0F0E0A', textDecoration: 'none',
              padding: '14px 32px', borderRadius: '12px', fontWeight: 700, fontSize: '15px',
            }}>
              Join Top965 Free →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0F0E0A', padding: '40px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'serif', fontSize: '24px', fontWeight: 900, color: '#C8963E', marginBottom: '8px' }}>
          Top965
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
          © 2026 Top965 · Made with ❤️ in Kuwait 🇰🇼
        </p>
      </footer>

    </div>
  )
}
