'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

const AREAS = [
  'All Areas', 'Salmiya', 'Hawalli', 'Rumaithiya', 'Bayan', 'Mishref',
  'Kuwait City', 'Sharq', 'Jabriya', 'Surra', 'Salwa',
  'Mahboula', 'Fintas', 'Fahaheel', 'Ahmadi',
  'Shuwaikh', 'Rai', 'Ardiya', 'Farwaniya', 'Khaitan',
  'Sabah Al Salem', 'Mubarak Al Kabeer', 'Qurain',
  'Jahra', 'Egaila', 'Messila',
]

const CATEGORIES = [
  { label: 'Restaurants', emoji: '🍽️', key: 'restaurant' },
  { label: 'Cafes', emoji: '☕', key: 'cafe' },
  { label: 'Frozen Yogurt', emoji: '🍦', key: 'frozen yogurt' },
  { label: 'Bakeries', emoji: '🥐', key: 'bakery' },
  { label: 'Burgers', emoji: '🍔', key: 'burger' },
  { label: 'Pizza', emoji: '🍕', key: 'pizza' },
  { label: 'Sushi', emoji: '🍣', key: 'sushi' },
  { label: 'Shawarma', emoji: '🌯', key: 'shawarma' },
  { label: 'Gyms', emoji: '💪', key: 'gym' },
  { label: 'Salons', emoji: '💇', key: 'salon' },
  { label: 'Banks', emoji: '🏦', key: 'bank' },
  { label: 'Clinics', emoji: '🏥', key: 'clinic' },
  { label: 'Chalets', emoji: '🏖️', key: 'chalet' },
  { label: 'Hotels', emoji: '🏨', key: 'hotel' },
  { label: 'Supermarkets', emoji: '🛒', key: 'supermarket' },
  { label: 'Pharmacies', emoji: '💊', key: 'pharmacy' },
  { label: 'Schools', emoji: '🎓', key: 'school' },
  { label: 'Gas Stations', emoji: '⛽', key: 'gas station' },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: 12, color: i <= Math.round(rating) ? '#E8B94F' : '#2a2a2a' }}>★</span>
      ))}
      <span style={{ fontSize: 13, color: '#E8B94F', fontWeight: 700, marginLeft: 2 }}>{rating?.toFixed(1)}</span>
    </div>
  )
}

function PlaceImage({ photos, name }: { photos: string[] | null, name: string }) {
  const [imgError, setImgError] = useState(false)
  const firstPhoto = photos?.[0]

  if (firstPhoto && !imgError) {
    return (
      <img
        src={firstPhoto}
        alt={name}
        onError={() => setImgError(true)}
        style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}
      />
    )
  }

  const colors = ['#1a1a2e', '#16213e', '#1a2744', '#1c1c2e', '#0d1b2a']
  const color = colors[name.charCodeAt(0) % colors.length]
  return (
    <div style={{
      width: '100%', height: '160px',
      background: `linear-gradient(135deg, ${color} 0%, #1a1a1a 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 52, fontWeight: 900, color: 'rgba(232,185,79,0.25)',
      fontFamily: 'Playfair Display, serif',
    }}>
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

export default function SearchPage() {
  const supabase = createClientComponentClient()
  const [query, setQuery] = useState('')
  const [area, setArea] = useState('All Areas')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('google_score')
  const [places, setPlaces] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  const fetchPlaces = async (
    searchQuery = '', searchArea = 'All Areas',
    searchCategory = '', sortBy = 'google_score'
  ) => {
    setLoading(true)
    try {
      let q = supabase
        .from('places')
        .select('id, name_en, address_en, google_score, google_reviews, slug, is_verified_business, photos', { count: 'exact' })
        .eq('is_active', true)
        .limit(50)

      if (searchQuery.trim()) q = q.ilike('name_en', `%${searchQuery.trim()}%`)
      if (searchArea !== 'All Areas') q = q.ilike('address_en', `%${searchArea}%`)
      if (searchCategory) q = q.ilike('category', `%${searchCategory}%`)

      const orderCol = sortBy === 'google_reviews' ? 'google_reviews' : sortBy === 'created_at' ? 'created_at' : 'google_score'
      q = q.order(orderCol, { ascending: false, nullsFirst: false })

      const { data, count, error } = await q
      if (error) console.error('Supabase error:', error)
      setPlaces(data || [])
      setTotal(count || 0)
    } catch (err: any) {
      console.error(err)
      setPlaces([])
    }
    setLoading(false)
  }

  useEffect(() => { fetchPlaces() }, [])

  const handleCategoryClick = (key: string) => {
    const newCat = category === key ? '' : key
    setCategory(newCat)
    fetchPlaces(query, area, newCat, sort)
  }

  const handleSearch = () => fetchPlaces(query, area, category, sort)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --gold: #E8B94F; --gold-dark: #C49A2F; --gold-dim: rgba(232,185,79,0.1);
          --dark: #0A0A0A; --dark2: #111; --dark3: #1A1A1A;
          --border: rgba(255,255,255,0.07); --border-gold: rgba(232,185,79,0.25);
          --text: #F0EDE6; --muted: #666; --muted2: #333;
        }
        body { background: var(--dark); color: var(--text); font-family: 'DM Sans', sans-serif; }

        /* NAV */
        .nav { height: 64px; background: var(--dark2); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 32px; position: sticky; top: 0; z-index: 100; }
        .nav-logo { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 900; color: var(--gold); text-decoration: none; }
        .nav-btn { padding: 8px 20px; background: var(--gold); color: var(--dark); border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; text-decoration: none; }

        /* SEARCH HERO */
        .search-hero { background: var(--dark2); border-bottom: 1px solid var(--border); padding: 28px 32px 0; }
        .search-hero h1 { font-family: 'Playfair Display', serif; font-size: clamp(20px, 3vw, 30px); font-weight: 900; margin-bottom: 16px; }
        .search-hero h1 em { color: var(--gold); font-style: normal; }

        /* SEARCH BAR */
        .search-bar { display: flex; gap: 10px; flex-wrap: wrap; max-width: 900px; margin-bottom: 20px; }
        .search-input { flex: 1; min-width: 200px; padding: 14px 18px; background: var(--dark3); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s; }
        .search-input:focus { border-color: var(--gold); }
        .search-input::placeholder { color: #555; }
        .search-select { padding: 14px 16px; background: var(--dark3); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; cursor: pointer; min-width: 140px; }
        .search-btn { padding: 14px 28px; background: var(--gold); color: var(--dark); border: none; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; transition: background 0.2s; }
        .search-btn:hover { background: var(--gold-dark); }

        /* CATEGORY PILLS */
        .cat-row { display: flex; flex-wrap: wrap; gap: 8px; padding: 0 0 20px; }
        .cat-pill { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; background: var(--dark3); border: 1px solid var(--border); border-radius: 30px; font-size: 13px; color: var(--text); cursor: pointer; transition: all 0.15s; white-space: nowrap; user-select: none; }
        .cat-pill:hover { border-color: rgba(232,185,79,0.4); background: rgba(232,185,79,0.05); }
        .cat-pill.active { background: var(--gold-dim); border-color: var(--border-gold); color: var(--gold); font-weight: 600; }
        .cat-emoji { font-size: 15px; }

        /* RESULTS */
        .results { padding: 24px 32px; }
        .results-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
        .results-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; }
        .results-title span { color: var(--gold); }
        .results-count { font-size: 13px; color: var(--muted); margin-top: 2px; }
        .filter-select { padding: 8px 14px; background: var(--dark3); border: 1px solid var(--border); border-radius: 8px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 12px; outline: none; cursor: pointer; }

        /* GRID */
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
        .card { background: var(--dark3); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; cursor: pointer; transition: border-color 0.2s, transform 0.2s; text-decoration: none; display: block; }
        .card:hover { border-color: var(--border-gold); transform: translateY(-3px); }
        .card-img { width: 100%; height: 160px; position: relative; overflow: hidden; border-bottom: 1px solid var(--border); }
        .verified { position: absolute; top: 10px; right: 10px; background: rgba(232,185,79,0.15); border: 1px solid var(--border-gold); color: var(--gold); font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 20px; z-index: 2; }
        .card-body { padding: 16px; }
        .card-name { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .card-addr { font-size: 12px; color: var(--muted); margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .card-reviews { font-size: 11px; color: var(--muted2); margin-top: 6px; }

        /* EMPTY */
        .empty { text-align: center; padding: 80px 20px; color: var(--muted); }
        .empty-icon { font-size: 48px; margin-bottom: 16px; }
        .empty-title { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--text); margin-bottom: 8px; }

        @media (max-width: 600px) {
          .nav { padding: 0 16px; }
          .search-hero { padding: 20px 16px 0; }
          .results { padding: 16px; }
          .grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
        }
      `}</style>

      <nav className="nav">
        <Link href="/" className="nav-logo">Top965</Link>
        <Link href="/auth" className="nav-btn">Sign In</Link>
      </nav>

      <div className="search-hero">
        <h1>Find the <em>Best</em> in Kuwait</h1>

        <div className="search-bar">
          <input
            className="search-input"
            type="text"
            placeholder="Search restaurants, cafes, salons..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <select className="search-select" value={area} onChange={e => setArea(e.target.value)}>
            {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <button className="search-btn" onClick={handleSearch}>Search →</button>
        </div>

        <div className="cat-row">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              className={`cat-pill${category === cat.key ? ' active' : ''}`}
              onClick={() => handleCategoryClick(cat.key)}
            >
              <span className="cat-emoji">{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="results">
        <div className="results-header">
          <div>
            <div className="results-title">
              <span>{category ? CATEGORIES.find(c => c.key === category)?.label : query || 'All Places'}</span> in Kuwait
            </div>
            <div className="results-count">{total} places found</div>
          </div>
          <select className="filter-select" value={sort} onChange={e => { setSort(e.target.value); fetchPlaces(query, area, category, e.target.value) }}>
            <option value="google_score">Top Rated</option>
            <option value="google_reviews">Most Reviewed</option>
            <option value="created_at">Newly Added</option>
          </select>
        </div>

        {loading ? (
          <div className="empty"><div className="empty-icon">⏳</div><div className="empty-title">Loading...</div></div>
        ) : places.length === 0 ? (
          <div className="empty"><div className="empty-icon">😔</div><div className="empty-title">No places found</div></div>
        ) : (
          <div className="grid">
            {places.map(place => (
              <Link key={place.id} href={`/place/${place.slug}`} className="card">
                <div className="card-img">
                  <PlaceImage photos={place.photos} name={place.name_en} />
                  {place.is_verified_business && <span className="verified">✓ VERIFIED</span>}
                </div>
                <div className="card-body">
                  <div className="card-name">{place.name_en}</div>
                  <div className="card-addr">{place.address_en?.split(',').slice(0, 2).join(',')}</div>
                  <StarRating rating={place.google_score} />
                  <div className="card-reviews">{place.google_reviews?.toLocaleString()} Google reviews</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
