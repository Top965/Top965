import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getTopPlaces() {
  const { data } = await supabase
    .from('places')
    .select('id, name_en, address_en, google_score, google_reviews, slug')
    .eq('is_active', true)
    .order('google_score', { ascending: false })
    .limit(6)
  return data || []
}

export default async function HomePage() {
  const places = await getTopPlaces()

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

      <section style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'serif', fontSize: '32px', fontWeight: 900, color: '#0F0E0A', marginBottom: '8px' }}>
          Top Rated Places
        </h2>
        <p style={{ color: '#888', marginBottom: '40px' }}>Highest rated in Kuwait</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {places.map((place) => (
            <Link key={place.id} href={`/place/${place.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#fff', borderRadius: '16px', padding: '24px',
                border: '1px solid rgba(0,0,0,0.08)', cursor: 'pointer',
                transition: 'transform 0.2s', display: 'block',
              }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#0F0E0A', marginBottom: '8px' }}>
                  {place.name_en}
                </div>
                <div style={{ color: '#888', fontSize: '14px', marginBottom: '12px' }}>
                  {place.address_en?.split(',').slice(0, 2).join(',')}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#C8963E', fontWeight: 700, fontSize: '16px' }}>
                    ★ {place.google_score}
                  </span>
                  <span style={{ color: '#aaa', fontSize: '13px' }}>
                    ({place.google_reviews?.toLocaleString()} reviews on Google)
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
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
