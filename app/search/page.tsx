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

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: 12, color: i <= Math.round(rating) ? '#E8B94F' : '#333' }}>★</span>
      ))}
      <span style={{ fontSize: 13, color: '#E8B94F', fontWeight: 700, marginLeft: 2 }}>{rating?.toFixed(1)}</span>
    </div>
  )
}

export default function SearchPage() {
  const supabase = createClientComponentClient()
  const [query, setQuery] = useState('')
  const [area, setArea] = useState('All Areas')
  const [sort, setSort] = useState('google_score')
  const [places, setPlaces] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [debugMsg, setDebugMsg] = useState('')

  const fetchPlaces = async (searchQuery = '', searchArea = 'All Areas', sortBy = 'google_score') => {
    setLoading(true)
    try {
      const { data, count, error } = await supabase
        .from('places')
        .select('id, name_en, address_en, google_score, google_reviews, slug, is_verified_business', { count: 'exact' })
        .eq('is_active', true)
        .order('google_score', { ascending: false, nullsFirst: false })
        .limit(50)

      console.log('DATA:', data)
      console.log('COUNT:', count)
      console.log('ERROR:', error)
      setDebugMsg(`count:${count} error:${error?.message || 'none'} rows:${data?.length}`)
      setPlaces(data || [])
      setTotal(count || 0)
    } catch (err: any) {
      console.error(err)
      setDebugMsg('EXCEPTION: ' + err.message)
      setPlaces([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPlaces()
  }, [])

  const handleSearch = () => fetchPlaces(query, area, sort)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --gold: #E8B94F; --gold-dark: #C49A2F; --gold-dim: rgba(232,185,79,0.1);
          --dark: #0D0D0D; --dark2: #131313; --dark3: #1C1C1C;
          --border: rgba(255,255,255,0.07); --border-gold: rgba(232,185,79,0.2);
          --text: #F0EDE6; --muted: #777; --muted2: #3a3a3a;
        }
        body { background: var(--dark); color: var(--text); font-family: 'DM Sans', sans-serif; }
        .nav { height: 64px; background: var(--dark2); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 32px; position: sticky; top: 0; z-index: 100; }
        .nav-logo { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 900; color: var(--gold); text-decoration: none; }
        .nav-btn { padding: 8px 18px; background: var(--gold); color: var(--dark); border: none; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; text-decoration: none; }
        .search-hero { background: var(--dark2); border-bottom: 1px solid var(--border); padding: 32px; }
        .search-hero h1 { font-family: 'Playfair Display', serif; font-size: clamp(22px, 3vw, 32px); font-weight: 900; margin-bottom: 20px; }
        .search-hero h1 em { color: var(--gold); font-style: normal; }
        .search-bar { display: flex; gap: 10px; flex-wrap: wrap; max-width: 900px; }
        .search-input { flex: 1; min-width: 200px; padding: 16px 18px; background: var(--dark3); border: 1px solid var(--border); border-radius: 10px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s; }
        .search-input:focus { border-color: var(--gold); }
        .search-input::placeholder { color: var(--muted2); }
        .search-select { padding: 16px 16px; background: var(--dark3); border: 1px solid var(--border); border-radius: 10px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; cursor: pointer; min-width: 150px; }
        .search-btn { padding: 16px 28px; background: var(--gold); color: var(--dark); border: none; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; }
        .search-btn:hover { background: var(--gold-dark); }
        .results { padding: 24px 32px; }
        .results-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
        .results-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; }
        .results-title span { color: var(--gold); }
        .results-count { font-size: 13px; color: var(--muted); margin-top: 2px; }
        .filter-bar { display: flex; gap: 8px; }
        .filter-select { padding: 8px 14px; background: var(--dark3); border: 1px solid var(--border); border-radius: 8px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 12px; outline: none; cursor: pointer; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
        .card { background: var(--dark3); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; cursor: pointer; transition: border-color 0.2s, transform 0.2s; text-decoration: none; display: block; }
        .card:hover { border-color: var(--border-gold); transform: translateY(-3px); }
        .card-img { width: 100%; height: 160px; background: linear-gradient(135deg, #1a1a1a 0%, #222 100%); display: flex; align-items: center; justify-content: center; font-size: 48px; border-bottom: 1px solid var(--border); position: relative; }
        .verified { position: absolute; top: 10px; right: 10px; background: rgba(232,185,79,0.15); border: 1px solid var(--border-gold); color: var(--gold); font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 20px; }
        .card-body { padding: 16px; }
        .card-name { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700; color: var(--text); margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .card-addr { font-size: 12px; color: var(--muted); margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .card-meta { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; }
        .card-reviews { font-size: 11px; color: var(--muted2); }
        .empty { text-align: center; padding: 80px 20px; color: var(--muted); }
        .empty-icon { font-size: 48px; margin-bottom: 16px; }
        .empty-title { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--text); margin-bottom: 8px; }
        .debug { background: #1a1a00; border: 1px solid #444; color: #ff0; padding: 12px; margin: 16px 32px; border-radius: 8px; font-size: 13px; font-family: monospace; }
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
      </div>

      {debugMsg && <div className="debug">DEBUG: {debugMsg}</div>}

      <div className="results">
        <div className="results-header">
          <div>
            <div className="results-title">
              <span>{query || 'All Places'}</span> in Kuwait
            </div>
            <div className="results-count">{total} places found</div>
          </div>
          <div className="filter-bar">
            <select className="filter-select" value={sort} onChange={e => { setSort(e.target.value); fetchPlaces(query, area, e.target.value) }}>
              <option value="google_score">Top Rated</option>
              <option value="google_reviews">Most Reviewed</option>
              <option value="created_at">Newly Added</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="empty"><div className="empty-icon">⏳</div><div className="empty-title">Loading...</div></div>
        ) : places.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">😔</div>
            <div className="empty-title">No places found</div>
          </div>
        ) : (
          <div className="grid">
            {places.map(place => (
              <Link key={place.id} href={`/place/${place.slug}`} className="card">
                <div className="card-img">
                  <span>🏢</span>
                  {place.is_verified_business && <span className="verified">✓ VERIFIED</span>}
                </div>
                <div className="card-body">
                  <div className="card-name">{place.name_en}</div>
                  <div className="card-addr">{place.address_en?.split(',').slice(0, 2).join(',')}</div>
                  <StarRating rating={place.google_score} />
                  <div className="card-meta">
                    <span className="card-reviews">{place.google_reviews?.toLocaleString()} Google reviews</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
