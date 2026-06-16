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
  { label: 'Restaurants', emoji: '🍽️', key: 'restaurant', id: '6aeefe1d-bc07-4cbb-a08c-cad2f6265ae4' },
  { label: 'Cafes', emoji: '☕', key: 'cafe', id: 'fe8fe534-590b-4720-b360-afc1d999a5c8' },
  { label: 'Fast Food', emoji: '🍔', key: 'fastfood', id: '30db5faf-c7f2-428a-bf1c-4da11d899b3f' },
  { label: 'Asian', emoji: '🍣', key: 'asian', id: '3d878bdd-2651-478f-80fe-5db4c73a2b52' },
  { label: 'Desserts', emoji: '🍦', key: 'dessert', id: 'a342f804-572e-41d2-a5b8-14faae1e3ada' },
  { label: 'Healthy', emoji: '🥗', key: 'healthy', id: 'e5899f7c-f61a-44df-9963-d4776d2288a0' },
  { label: 'Gyms', emoji: '💪', key: 'gym', id: '17b006ca-9551-45e2-99eb-b41b4277d318' },
  { label: 'Salons', emoji: '💇', key: 'salon', id: '27b356bd-a857-4002-b41a-92d9fde78672' },
  { label: 'Clinics', emoji: '🏥', key: 'clinic', id: '97b642f2-ff2e-42dc-9787-98995e03acd1' },
  { label: 'Shopping', emoji: '🛒', key: 'shopping', id: 'c3d89c10-7e2c-45bb-9be5-a6603ccd3374' },
  { label: 'Entertainment', emoji: '🎭', key: 'entertainment', id: '4768b6eb-859a-4329-bc8a-85b865850364' },
]

// Clearbit logo domains for known brands
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
  'applebee': 'applebees.com',
  'chili': 'chilis.com',
  'ihop': 'ihop.com',
  'domino': 'dominos.com',
  'papa john': 'papajohns.com',
  'baskin': 'baskinrobbins.com',
  'dunkin': 'dunkindonuts.com',
  'krispy kreme': 'krispykreme.com',
  'cinnabon': 'cinnabon.com',
  'dairy queen': 'dairyqueen.com',
  'fitness first': 'fitnessfirst.com',
  'gold\'s gym': 'goldsgym.com',
}

function getLogoUrl(name: string): string | null {
  const lower = name.toLowerCase()
  for (const [brand, domain] of Object.entries(BRAND_LOGOS)) {
    if (lower.includes(brand)) {
      return `https://logo.clearbit.com/${domain}`
    }
  }
  return null
}

function PlaceImage({ photos, name }: { photos: string[] | null, name: string }) {
  const [imgError, setImgError] = useState(false)
  const [logoError, setLogoError] = useState(false)

  const firstPhoto = photos?.[0]
  const logoUrl = getLogoUrl(name)

  if (firstPhoto && !imgError) {
    return (
      <img src={firstPhoto} alt={name} onError={() => setImgError(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    )
  }

  if (logoUrl && !logoError) {
    return (
      <div style={{
        width: '100%', height: '100%',
        background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
      }}>
        <img src={logoUrl} alt={name} onError={() => setLogoError(true)}
          style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} />
      </div>
    )
  }

  const colors = ['#1a1a2e', '#16213e', '#1a2744', '#0d1b2a', '#1c1c2e']
  const color = colors[name.charCodeAt(0) % colors.length]
  return (
    <div style={{
      width: '100%', height: '100%',
      background: `linear-gradient(135deg, ${color} 0%, #1a1a1a 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 40, fontWeight: 900, color: 'rgba(232,185,79,0.25)',
      fontFamily: 'Playfair Display, serif',
    }}>
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: 11, color: i <= Math.round(rating) ? '#E8B94F' : '#2a2a2a' }}>★</span>
      ))}
      <span style={{ fontSize: 12, color: '#E8B94F', fontWeight: 700, marginLeft: 2 }}>{rating?.toFixed(1)}</span>
    </div>
  )
}

export default function SearchPage() {
  const supabase = createClientComponentClient()
  const [userId, setUserId] = useState('')

useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUserId(session?.user?.id || '')
  })
}, [])
  const [query, setQuery] = useState('')
  const [area, setArea] = useState('All Areas')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('google_score')
  const [view, setView] = useState<'discover' | 'grid'>('discover')
  const [places, setPlaces] = useState<any[]>([])
  const [discoverData, setDiscoverData] = useState<Record<string, any[]>>({})
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  // Fetch for grid view
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
      const catObj = CATEGORIES.find(c => c.key === searchCategory)
      if (catObj?.id) q = q.eq('category_id', catObj.id)

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

  // Fetch top 5 per category for discover view
  const fetchDiscoverData = async () => {
    setLoading(true)
    const result: Record<string, any[]> = {}
    for (const cat of CATEGORIES) {
      const { data } = await supabase
        .from('places')
        .select('id, name_en, address_en, google_score, google_reviews, slug, photos')
        .eq('is_active', true)
        .eq('category_id', cat.id)
        .order('google_score', { ascending: false, nullsFirst: false })
        .limit(5)
      if (data && data.length > 0) result[cat.key] = data
    }
    setDiscoverData(result)
    setLoading(false)
  }

  useEffect(() => {
    if (view === 'discover') {
      fetchDiscoverData()
    } else {
      fetchPlaces(query, area, category, sort)
    }
  }, [view])

  const handleCategoryClick = (key: string) => {
    const newCat = category === key ? '' : key
    setCategory(newCat)
    if (newCat) {
      setView('grid')
      fetchPlaces(query, area, newCat, sort)
    } else {
      setView('discover')
      fetchDiscoverData()
    }
  }

  const handleSearch = () => {
    setView('grid')
    fetchPlaces(query, area, category, sort)
  }

  const activeCatLabel = CATEGORIES.find(c => c.key === category)?.label

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --gold: #E8B94F; --gold-dark: #C49A2F; --gold-dim: rgba(232,185,79,0.08);
          --dark: #0A0A0A; --dark2: #111; --dark3: #1A1A1A;
          --border: rgba(255,255,255,0.07); --border-gold: rgba(232,185,79,0.25);
          --text: #F0EDE6; --muted: #666; --muted2: #333;
        }
        body { background: var(--dark); color: var(--text); font-family: 'DM Sans', sans-serif; }
        .nav { height: 64px; background: var(--dark2); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 32px; position: sticky; top: 0; z-index: 100; }
        .nav-logo { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 900; color: var(--gold); text-decoration: none; }
        .nav-btn { padding: 8px 20px; background: var(--gold); color: var(--dark); border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; text-decoration: none; }
        .search-hero { background: var(--dark2); border-bottom: 1px solid var(--border); padding: 28px 32px 0; }
        .search-hero h1 { font-family: 'Playfair Display', serif; font-size: clamp(20px, 3vw, 30px); font-weight: 900; margin-bottom: 16px; }
        .search-hero h1 em { color: var(--gold); font-style: normal; }
        .search-bar { display: flex; gap: 10px; flex-wrap: wrap; max-width: 900px; margin-bottom: 16px; }
        .search-input { flex: 1; min-width: 200px; padding: 13px 18px; background: var(--dark3); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s; }
        .search-input:focus { border-color: var(--gold); }
        .search-input::placeholder { color: #444; }
        .search-select { padding: 13px 16px; background: var(--dark3); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; cursor: pointer; min-width: 130px; }
        .search-btn { padding: 13px 28px; background: var(--gold); color: var(--dark); border: none; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; }
        .search-btn:hover { background: var(--gold-dark); }
        .cat-row { display: flex; flex-wrap: wrap; gap: 7px; padding: 0 0 14px; }
        .cat-pill { display: inline-flex; align-items: center; gap: 5px; padding: 6px 13px; background: var(--dark3); border: 1px solid var(--border); border-radius: 30px; font-size: 12px; color: var(--text); cursor: pointer; transition: all 0.15s; white-space: nowrap; font-family: 'DM Sans', sans-serif; }
        .cat-pill:hover { border-color: rgba(232,185,79,0.4); background: rgba(232,185,79,0.05); }
        .cat-pill.active { background: var(--gold-dim); border-color: var(--border-gold); color: var(--gold); font-weight: 600; }
        .results-bar { display: flex; align-items: center; justify-content: space-between; padding: 10px 0 14px; }
        .results-count { font-size: 12px; color: var(--muted); }
        .view-toggle { display: flex; background: var(--dark3); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
        .view-btn { padding: 6px 14px; border: none; cursor: pointer; font-size: 12px; font-weight: 600; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
        .view-btn.active { background: var(--gold); color: var(--dark); }
        .view-btn.inactive { background: transparent; color: var(--muted); }
        .results { padding: 24px 32px; }

        /* DISCOVER */
        .cat-section { margin-bottom: 40px; }
        .cat-section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
        .cat-section-title { display: flex; align-items: center; gap: 10px; }
        .cat-section-name { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; }
        .cat-badge { font-size: 10px; color: var(--gold); font-weight: 700; background: rgba(232,185,79,0.08); border: 1px solid rgba(232,185,79,0.2); padding: 2px 8px; border-radius: 20px; }
        .see-all-btn { background: transparent; border: 1px solid var(--border); color: var(--muted); padding: 4px 12px; border-radius: 20px; font-size: 11px; cursor: pointer; font-family: 'DM Sans', sans-serif; }
        .scroll-row { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 6px; scrollbar-width: none; }
        .scroll-row::-webkit-scrollbar { display: none; }

        /* MINI CARD (discover) */
        .mini-card { min-width: 150px; max-width: 150px; flex-shrink: 0; background: var(--dark3); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; cursor: pointer; transition: border-color 0.2s, transform 0.2s; text-decoration: none; display: block; }
        .mini-card:hover { border-color: var(--border-gold); transform: translateY(-3px); }
        .mini-img { width: 100%; height: 90px; position: relative; border-bottom: 1px solid var(--border); overflow: hidden; }
        .rank-badge { position: absolute; top: 7px; left: 7px; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 800; z-index: 2; }
        .rank-1 { background: var(--gold); color: var(--dark); }
        .rank-other { background: rgba(255,255,255,0.06); border: 1px solid var(--border); color: var(--muted); }
        .mini-body { padding: 9px 10px; }
        .mini-name { font-family: 'Playfair Display', serif; font-size: 12px; font-weight: 700; color: var(--text); margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .mini-area { font-size: 10px; color: var(--muted); margin-bottom: 5px; }
        .mini-reviews { font-size: 10px; color: var(--muted2); margin-top: 3px; }

        /* GRID CARD */
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 18px; }
        .card { background: var(--dark3); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; cursor: pointer; transition: border-color 0.2s, transform 0.2s; text-decoration: none; display: block; }
        .card:hover { border-color: var(--border-gold); transform: translateY(-3px); }
        .card-img { width: 100%; height: 150px; position: relative; overflow: hidden; border-bottom: 1px solid var(--border); }
        .verified { position: absolute; top: 10px; right: 10px; background: rgba(232,185,79,0.15); border: 1px solid var(--border-gold); color: var(--gold); font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 20px; z-index: 2; }
        .card-body { padding: 14px; }
        .card-name { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .card-addr { font-size: 12px; color: var(--muted); margin-bottom: 7px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .card-reviews { font-size: 11px; color: var(--muted2); margin-top: 5px; }

        .empty { text-align: center; padding: 60px 20px; color: var(--muted); }
        .empty-icon { font-size: 40px; margin-bottom: 12px; }
        .empty-title { font-family: 'Playfair Display', serif; font-size: 20px; color: var(--text); }

        @media (max-width: 600px) {
          .nav, .search-hero { padding-left: 16px; padding-right: 16px; }
          .results { padding: 16px; }
          .grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
        }
      `}</style>

      <nav className="nav">
        <Link href="/" className="nav-logo">Top965</Link>
{userId ? (
  <Link href="/profile" className="nav-btn" style={{ background: 'transparent', border: '1px solid rgba(232,185,79,0.35)', color: '#E8B94F' }}>
    My Profile
  </Link>
) : (
  <Link href="/auth" className="nav-btn">Sign In</Link>
)}
      </nav>

      <div className="search-hero">
        <h1>Find the <em>Best</em> in Kuwait</h1>

        <div className="search-bar">
          <input className="search-input" type="text" placeholder="Search restaurants, cafes, salons..."
            value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()} />
          <select className="search-select" value={area} onChange={e => setArea(e.target.value)}>
            {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <button className="search-btn" onClick={handleSearch}>Search →</button>
        </div>

        <div className="cat-row">
          {CATEGORIES.map(cat => (
            <button key={cat.key}
              className={`cat-pill${category === cat.key ? ' active' : ''}`}
              onClick={() => handleCategoryClick(cat.key)}>
              <span style={{ fontSize: 14 }}>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="results-bar">
          <span className="results-count">
            {view === 'grid' ? `${total} places found` : '500+ places · Kuwait'}
          </span>
          <div className="view-toggle">
            <button className={`view-btn ${view === 'discover' ? 'active' : 'inactive'}`}
              onClick={() => { setView('discover'); setCategory(''); fetchDiscoverData() }}>
              ≡ Discover
            </button>
            <button className={`view-btn ${view === 'grid' ? 'active' : 'inactive'}`}
              onClick={() => { setView('grid'); fetchPlaces(query, area, category, sort) }}>
              ⊞ Grid
            </button>
          </div>
        </div>
      </div>

      <div className="results">
        {loading ? (
          <div className="empty"><div className="empty-icon">⏳</div><div className="empty-title">Loading...</div></div>
        ) : view === 'discover' ? (
          <>
            {CATEGORIES.slice(0, 8).map(cat => {
              const rows = discoverData[cat.key]
              if (!rows || rows.length === 0) return null
              return (
                <div key={cat.key} className="cat-section">
                  <div className="cat-section-header">
                    <div className="cat-section-title">
                      <span style={{ fontSize: 20 }}>{cat.emoji}</span>
                      <span className="cat-section-name">{cat.label}</span>
                      <span className="cat-badge">TOP 5</span>
                    </div>
                    <button className="see-all-btn"
                      onClick={() => handleCategoryClick(cat.key)}>See all →</button>
                  </div>
                  <div className="scroll-row">
                    {rows.map((place, idx) => (
                      <Link key={place.id} href={`/place/${place.slug}`} className="mini-card">
                        <div className="mini-img">
                          <PlaceImage photos={place.photos} name={place.name_en} />
                          <div className={`rank-badge ${idx === 0 ? 'rank-1' : 'rank-other'}`}>{idx + 1}</div>
                        </div>
                        <div className="mini-body">
                          <div className="mini-name">{place.name_en}</div>
                          <div className="mini-area">{place.address_en?.split(',')[0]}</div>
                          <StarRating rating={place.google_score} />
                          <div className="mini-reviews">{place.google_reviews?.toLocaleString()} reviews</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700 }}>
                  <span style={{ color: '#E8B94F' }}>{activeCatLabel || query || 'All Places'}</span> in Kuwait
                </div>
                <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{total} places found</div>
              </div>
              <select style={{ padding: '7px 12px', background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, color: '#F0EDE6', fontSize: 12, outline: 'none', cursor: 'pointer' }}
                value={sort} onChange={e => { setSort(e.target.value); fetchPlaces(query, area, category, e.target.value) }}>
                <option value="google_score">Top Rated</option>
                <option value="google_reviews">Most Reviewed</option>
                <option value="created_at">Newly Added</option>
              </select>
            </div>
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
          </>
        )}
      </div>
    </>
  )
}
