// app/place/[slug]/page.tsx
import { createClient } from '@supabase/supabase-js'
import PlaceTabs from './PlaceTabs'
import Link from 'next/link'
import { notFound } from 'next/navigation'
const BRAND_LOGOS: Record<string, string> = {
  'starbucks': 'starbucks.com',
  'mcdonald': 'mcdonalds.com',
  'kfc': 'kfc.com',
  'pizza hut': 'pizzahut.com',
  'burger king': 'burgerking.com',
  'subway': 'subway.com',
  'tim hortons': 'timhortons.com',
  'costa': 'costa.co.uk',
  'caribou': 'cariboucoffee.com',
  'hardee': 'hardees.com',
  'popeyes': 'popeyes.com',
  'shake shack': 'shakeshack.com',
  'five guys': 'fiveguys.com',
  'domino': 'dominos.com',
  'papa john': 'papajohns.com',
  'baskin': 'baskinrobbins.com',
  'dunkin': 'dunkindonuts.com',
  'krispy kreme': 'krispykreme.com',
  'cinnabon': 'cinnabon.com',
  'dairy queen': 'dairyqueen.com',
  'fitness first': 'fitnessfirst.com',
  'pizza express': 'pizzaexpress.com',
  'applebee': 'applebees.com',
  'ihop': 'ihop.com',
}

function getClearbitLogo(name: string): string | null {
  const lower = name.toLowerCase()
  for (const [brand, domain] of Object.entries(BRAND_LOGOS)) {
    if (lower.includes(brand)) {
      return `https://logo.clearbit.com/${domain}`
    }
  }
  return null
}
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getPlace(slug: string) {
  const { data } = await supabase
    .from('places')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  return data
}

async function getReviews(placeId: string) {
  const { data } = await supabase
    .from('reviews')
    .select('*, profiles(username, avatar_url)')
    .eq('place_id', placeId)
    .order('created_at', { ascending: false })
    .limit(20)
  return data || []
}

function Stars({ rating, size = 14 }: { rating: number, size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: size, color: i <= Math.round(rating) ? '#E8B94F' : '#2a2a2a' }}>★</span>
      ))}
    </div>
  )
}

export default async function PlacePage({ params }: { params: { slug: string } }) {
  const place = await getPlace(params.slug)
  if (!place) notFound()

  const reviews = await getReviews(place.id)
  const { data: { session } } = await supabase.auth.getSession()
  const userId = session?.user?.id || ''
  const initial = place.name_en?.charAt(0).toUpperCase()
  const colors = ['#1a1a2e', '#16213e', '#1a2744', '#0d1b2a', '#1c1c2e']
  const bgColor = colors[place.name_en?.charCodeAt(0) % colors.length]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --gold: #E8B94F; --gold-dark: #C49A2F; --gold-dim: rgba(232,185,79,0.08);
          --dark: #0A0A0A; --dark2: #111; --dark3: #1A1A1A; --dark4: #222;
          --border: rgba(255,255,255,0.07); --border-gold: rgba(232,185,79,0.25);
          --text: #F0EDE6; --muted: #666; --muted2: #2a2a2a;
        }
        body { background: var(--dark); color: var(--text); font-family: 'DM Sans', sans-serif; }

        .nav { height: 64px; background: var(--dark2); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 32px; position: sticky; top: 0; z-index: 100; }
        .nav-logo { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 900; color: var(--gold); text-decoration: none; }
        .nav-back { color: var(--muted); font-size: 13px; text-decoration: none; display: flex; align-items: center; gap: 6px; }
        .nav-back:hover { color: var(--text); }
        .nav-btn { padding: 8px 20px; background: var(--gold); color: var(--dark); border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; text-decoration: none; }

        .cover { height: 280px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .cover-letter { font-family: 'Playfair Display', serif; font-size: 100px; font-weight: 900; color: rgba(232,185,79,0.15); }
        .cover-img { width: 100%; height: 100%; object-fit: cover; }
        .cat-badge { position: absolute; top: 16px; left: 16px; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); border: 1px solid var(--border); border-radius: 20px; padding: 4px 12px; font-size: 11px; color: var(--muted); }

        .container { max-width: 960px; margin: 0 auto; padding: 0 24px; }

        .place-header { padding: 28px 0 24px; border-bottom: 1px solid var(--border); margin-bottom: 28px; }
        .place-name { font-family: 'Playfair Display', serif; font-size: clamp(26px, 4vw, 40px); font-weight: 900; color: var(--text); margin-bottom: 4px; }
        .place-name-ar { font-size: 16px; color: var(--muted); margin-bottom: 20px; direction: rtl; }
        .place-address { font-size: 13px; color: var(--muted); margin-top: 6px; }

        .ratings-row { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 24px; }
        .rating-box { background: var(--dark3); border-radius: 12px; padding: 14px 18px; text-align: center; min-width: 110px; }
        .rating-box.gold { border: 1px solid var(--border-gold); }
        .rating-box.grey { border: 1px solid var(--border); }
        .rating-label { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 6px; }
        .rating-num { font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 900; line-height: 1; margin-bottom: 4px; }
        .rating-sub { font-size: 11px; color: var(--muted); }

        .actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .btn-primary { padding: 12px 24px; background: var(--gold); color: var(--dark); border: none; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
        .btn-primary:hover { background: var(--gold-dark); }
        .btn-secondary { padding: 12px 20px; background: transparent; border: 1px solid var(--border); color: var(--text); border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
        .btn-secondary:hover { border-color: rgba(255,255,255,0.2); }

        .layout { display: flex; gap: 28px; align-items: flex-start; }
        .main { flex: 1; min-width: 0; }
        .sidebar { width: 260px; flex-shrink: 0; }

        .tabs { display: flex; border-bottom: 1px solid var(--border); margin-bottom: 24px; }
        .tab { padding: 10px 20px; background: transparent; border: none; border-bottom: 2px solid transparent; color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; margin-bottom: -1px; }
        .tab.active { border-bottom-color: var(--gold); color: var(--gold); font-weight: 700; }

        .review-cta { background: var(--dark3); border: 1px solid var(--border-gold); border-radius: 14px; padding: 28px; text-align: center; margin-bottom: 24px; }
        .review-cta-icon { font-size: 36px; margin-bottom: 10px; }
        .review-cta-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; margin-bottom: 8px; }
        .review-cta-sub { font-size: 13px; color: var(--muted); margin-bottom: 20px; }

        .review-card { background: var(--dark3); border: 1px solid var(--border); border-radius: 12px; padding: 16px; margin-bottom: 12px; }
        .review-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .reviewer { font-size: 14px; font-weight: 700; }
        .review-date { font-size: 11px; color: var(--muted); }
        .review-text { font-size: 13px; color: var(--muted); line-height: 1.6; }

        .sidebar-card { background: var(--dark3); border: 1px solid var(--border); border-radius: 14px; padding: 16px; margin-bottom: 16px; }
        .sidebar-title { font-size: 12px; font-weight: 700; margin-bottom: 12px; }
        .map-placeholder { height: 180px; background: var(--dark4); border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; margin-bottom: 10px; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 12px; }
        .info-row:last-child { border-bottom: none; }
        .info-label { color: var(--muted); }
        .info-val { color: var(--text); font-weight: 500; text-align: right; max-width: 140px; }
        .delivery-btn { width: 100%; padding: 9px 12px; background: var(--dark4); border: 1px solid var(--border); border-radius: 8px; color: var(--text); font-size: 12px; cursor: pointer; font-family: 'DM Sans', sans-serif; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; text-decoration: none; }
        .delivery-btn:last-child { margin-bottom: 0; }
        .delivery-btn:hover { border-color: rgba(255,255,255,0.15); }

        .contact-row { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
        .contact-row:last-child { border-bottom: none; }
        .contact-val { color: var(--gold); text-decoration: none; }
        .contact-val:hover { text-decoration: underline; }

        .hours-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
        .hours-row:last-child { border-bottom: none; }

        .empty-state { text-align: center; padding: 40px 20px; color: var(--muted); }
        .empty-icon { font-size: 36px; margin-bottom: 10px; }

        @media (max-width: 700px) {
          .layout { flex-direction: column; }
          .sidebar { width: 100%; }
          .nav { padding: 0 16px; }
          .container { padding: 0 16px; }
          .cover { height: 200px; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link href="/search" className="nav-back">← Back</Link>
          <Link href="/" className="nav-logo">Top965</Link>
        </div>
        <Link href="/auth" className="nav-btn">Sign In</Link>
      </nav>

      {/* COVER */}
      <div className="cover" style={{ background: `linear-gradient(135deg, ${bgColor} 0%, #0A0A0A 100%)` }}>
  {place.cover_image_url ? (
    <img src={place.cover_image_url} alt={place.name_en} className="cover-img" />
  ) : getClearbitLogo(place.name_en) ? (
    <div style={{ background: '#fff', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <img src={getClearbitLogo(place.name_en)!} alt={place.name_en}
        style={{ maxWidth: '60%', maxHeight: '60%', objectFit: 'contain' }} />
    </div>
  ) : (
    <span className="cover-letter">{initial}</span>
  )}
        <div className="cat-badge">🍽️ {place.category_id ? 'Restaurant' : 'Place'}</div>
      </div>

      <div className="container">
        {/* PLACE HEADER */}
        <div className="place-header">
          <h1 className="place-name">{place.name_en}</h1>
          {place.name_ar && <div className="place-name-ar">{place.name_ar}</div>}

          {/* Ratings */}
          <div className="ratings-row">
            <div className="rating-box gold">
              <div className="rating-label" style={{ color: '#E8B94F' }}>Top965</div>
              <div className="rating-num" style={{ color: '#E8B94F' }}>
                {place.avg_rating > 0 ? place.avg_rating.toFixed(1) : '—'}
              </div>
              <div className="rating-sub">
                {place.review_count > 0 ? `${place.review_count} reviews` : 'No reviews yet'}
              </div>
            </div>

            {place.google_score > 0 && (
              <div className="rating-box grey">
                <div className="rating-label" style={{ color: '#666' }}>Google</div>
                <div className="rating-num" style={{ color: '#F0EDE6' }}>{place.google_score?.toFixed(1)}</div>
                <div className="rating-sub">{place.google_reviews?.toLocaleString()} reviews</div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {place.address_en && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <span style={{ fontSize: 14, marginTop: 1 }}>📍</span>
                  <div>
                    <div style={{ fontSize: 14, color: '#F0EDE6', fontWeight: 500 }}>Kuwait</div>
                    <div className="place-address">{place.address_en}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="actions">
            <Link href="/auth" className="btn-primary">✍️ Write a Review</Link>
            {place.google_maps_url && (
              <a href={place.google_maps_url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                🗺️ Get Directions
              </a>
            )}
            {place.phone && (
              <a href={`tel:${place.phone}`} className="btn-secondary">📞 Call</a>
            )}
          </div>
        </div>

        {/* LAYOUT */}
        <div className="layout">
          {/* MAIN */}
          <div className="main">
            <PlaceTabs place={place} reviews={reviews} userId={userId} />
          </div>

          {/* SIDEBAR */}
          <div className="sidebar">
            {/* Map */}
            <div className="sidebar-card">
              <div className="map-placeholder">
                <span style={{ fontSize: 32 }}>🗺️</span>
                <span style={{ fontSize: 12, color: '#666' }}>{place.address_en?.split(',')[0]}</span>
                {place.google_maps_url && (
                  <a href={place.google_maps_url} target="_blank" rel="noopener noreferrer" style={{
                    padding: '5px 14px', background: 'transparent',
                    border: '1px solid rgba(232,185,79,0.25)', color: '#E8B94F',
                    borderRadius: 20, fontSize: 11, cursor: 'pointer', textDecoration: 'none'
                  }}>Open in Maps →</a>
                )}
              </div>
            </div>

            {/* Quick Info */}
            <div className="sidebar-card">
              <div className="sidebar-title">Quick Info</div>
              <div className="info-row">
                <span className="info-label">Category</span>
                <span className="info-val">Restaurant</span>
              </div>
              {place.price_range && (
                <div className="info-row">
                  <span className="info-label">Price Range</span>
                  <span className="info-val">{place.price_range}</span>
                </div>
              )}
              {place.cuisine_type && (
                <div className="info-row">
                  <span className="info-label">Cuisine</span>
                  <span className="info-val">{place.cuisine_type}</span>
                </div>
              )}
              {place.address_en && (
                <div className="info-row">
                  <span className="info-label">Address</span>
                  <span className="info-val">{place.address_en}</span>
                </div>
              )}
            </div>

            {/* Contact */}
            {(place.phone || place.website || place.instagram) && (
              <div className="sidebar-card">
                <div className="sidebar-title">Contact</div>
                {place.phone && (
                  <div className="contact-row">
                    <span>📞</span>
                    <a href={`tel:${place.phone}`} className="contact-val">{place.phone}</a>
                  </div>
                )}
                {place.website && (
                  <div className="contact-row">
                    <span>🌐</span>
                    <a href={`https://${place.website}`} target="_blank" rel="noopener noreferrer" className="contact-val">{place.website}</a>
                  </div>
                )}
                {place.instagram && (
                  <div className="contact-row">
                    <span>📸</span>
                    <a href={`https://instagram.com/${place.instagram}`} target="_blank" rel="noopener noreferrer" className="contact-val">{place.instagram}</a>
                  </div>
                )}
              </div>
            )}

            {/* Delivery */}
            <div className="sidebar-card">
              <div className="sidebar-title">🛵 Order Delivery</div>
              {['Talabat', 'Keeta', 'Deliveroo'].map(app => (
                <a key={app} href="#" className="delivery-btn">
                  <span>{app}</span>
                  <span style={{ color: '#666' }}>→</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ height: 60 }} />
      </div>
    </>
  )
}
