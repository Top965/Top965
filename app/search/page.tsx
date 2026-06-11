'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

const CATEGORIES = [
  { id: 'restaurants', label: 'Restaurants', icon: '🍽️' },
  { id: 'cafes', label: 'Cafes', icon: '☕' },
  { id: 'frozen-yogurt', label: 'Frozen Yogurt', icon: '🍦' },
  { id: 'bakeries', label: 'Bakeries', icon: '🥐' },
  { id: 'burgers', label: 'Burgers', icon: '🍔' },
  { id: 'pizza', label: 'Pizza', icon: '🍕' },
  { id: 'sushi', label: 'Sushi', icon: '🍣' },
  { id: 'shawarma', label: 'Shawarma', icon: '🌯' },
  { id: 'gyms', label: 'Gyms', icon: '💪' },
  { id: 'salons', label: 'Salons', icon: '✂️' },
  { id: 'banks', label: 'Banks', icon: '🏦' },
  { id: 'clinics', label: 'Clinics', icon: '🏥' },
  { id: 'chalets', label: 'Chalets', icon: '🏖️' },
  { id: 'hotels', label: 'Hotels', icon: '🏨' },
  { id: 'supermarkets', label: 'Supermarkets', icon: '🛒' },
  { id: 'pharmacies', label: 'Pharmacies', icon: '💊' },
  { id: 'schools', label: 'Schools', icon: '🎓' },
  { id: 'gas-stations', label: 'Gas Stations', icon: '⛽' },
]

const AREAS = [
  'All Areas', 'Salmiya', 'Hawalli', 'Rumaithiya', 'Bayan', 'Mishref',
  'Kuwait City', 'Sharq', 'Jabriya', 'Surra', 'Salwa',
  'Mahboula', 'Fintas', 'Fahaheel', 'Ahmadi',
  'Shuwaikh', 'Rai', 'Ardiya', 'Farwaniya', 'Khaitan',
  'Sabah Al Salem', 'Mubarak Al Kabeer', 'Qurain',
  'Jahra', 'Egaila', 'Messila',
]

const MOCK_PLACES = [
  { id: '1', name: 'Pinkberry Kuwait', category: 'frozen-yogurt', area: 'Salmiya', rating: 4.8, reviews: 234, verified: true },
  { id: '2', name: "Menchie's", category: 'frozen-yogurt', area: 'Hawalli', rating: 4.5, reviews: 187, verified: true },
  { id: '3', name: 'llaollao', category: 'frozen-yogurt', area: 'Rumaithiya', rating: 4.7, reviews: 312, verified: false },
  { id: '4', name: 'Berry Cool', category: 'frozen-yogurt', area: 'Salmiya', rating: 4.2, reviews: 98, verified: false },
  { id: '5', name: 'YogurtLand', category: 'frozen-yogurt', area: 'Jabriya', rating: 4.4, reviews: 156, verified: true },
  { id: '6', name: 'Tutti Frutti', category: 'frozen-yogurt', area: 'Fahaheel', rating: 4.1, reviews: 74, verified: false },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: 12, color: i <= Math.round(rating) ? '#E8B94F' : '#333' }}>★</span>
      ))}
      <span style={{ fontSize: 13, color: '#E8B94F', fontWeight: 700, marginLeft: 2 }}>{rating.toFixed(1)}</span>
    </div>
  )
}

export default function SearchPage() {
  const supabase = createClientComponentClient()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [area, setArea] = useState('All Areas')
  const [sort, setSort] = useState('rating')
  const [minRating, setMinRating] = useState(0)
  const [places, setPlaces] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    setLoading(true)
    setSearched(true)
    try {
      let q = supabase.from('places').select('*')
      if (query) q = q.ilike('name', `%${query}%`)
      if (category) q = q.eq('category', category)
      if (area && area !== 'All Areas') q = q.eq('area', area)
      if (minRating > 0) q = q.gte('rating', minRating)
      if (sort === 'rating') q = q.order('rating', { ascending: false })
      else if (sort === 'reviews') q = q.order('review_count', { ascending: false })
      else q = q.order('created_at', { ascending: false })
      const { data } = await q.limit(50)
      setPlaces(data && data.length > 0 ? data : MOCK_PLACES)
    } catch {
      setPlaces(MOCK_PLACES)
    }
    setLoading(false)
  }

  const filteredPlaces = minRating > 0 ? places.filter(p => p.rating >= minRating) : places

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
        .search-input { flex: 1; min-width: 200px; padding: 13px 18px; background: var(--dark3); border: 1px solid var(--border); border-radius: 10px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s; }
        .search-input:focus { border-color: var(--gold); }
        .search-input::placeholder { color: var(--muted2); }
        .search-select { padding: 13px 16px; background: var(--dark3); border: 1px solid var(--border); border-radius: 10px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; cursor: pointer; appearance: none; min-width: 150px; }
        .search-select option { background: var(--dark3); }
        .search-btn { padding: 13px 28px; background: var(--gold); color: var(--dark); border: none; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; white-space: nowrap; }
        .search-btn:hover { background: var(--gold-dark); }
        .cat-section { padding: 20px 32px; border-bottom: 1px solid var(--border); }
        .cat-scroll { display: flex; flex-wrap: wrap; gap: 8px; padding-bottom: 4px; }
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-pill { display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: var(--dark3); border: 1px solid var(--border); border-radius: 20px; color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
        .cat-pill:hover { border-color: var(--border-gold); color: var(--text); }
        .cat-pill.active { background: var(--gold-dim); border-color: var(--gold); color: var(--gold); font-weight: 600; }
        .results { padding: 24px 32px; }
        .results-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
        .results-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; }
        .results-title span { color: var(--gold); }
        .results-count { font-size: 13px; color: var(--muted); margin-top: 2px; }
        .filter-bar { display: flex; gap: 8px; flex-wrap: wrap; }
        .filter-select { padding: 8px 14px; background: var(--dark3); border: 1px solid var(--border); border-radius: 8px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 12px; outline: none; cursor: pointer; appearance: none; }
        .rating-filter { display: flex; gap: 6px; }
        .rating-btn { padding: 7px 12px; background: var(--dark3); border: 1px solid var(--border); border-radius: 8px; color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .rating-btn.active { background: var(--gold-dim); border-color: var(--gold); color: var(--gold); }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
        .card { background: var(--dark3); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; cursor: pointer; transition: border-color 0.2s, transform 0.2s; text-decoration: none; display: block; }
        .card:hover { border-color: var(--border-gold); transform: translateY(-3px); }
        .card-img { width: 100%; height: 160px; background: linear-gradient(135deg, #1a1a1a 0%, #222 100%); display: flex; align-items: center; justify-content: center; font-size: 48px; border-bottom: 1px solid var(--border); position: relative; }
        .verified { position: absolute; top: 10px; right: 10px; background: rgba(232,185,79,0.15); border: 1px solid var(--border-gold); color: var(--gold); font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 20px; }
        .card-body { padding: 16px; }
        .card-cat { font-size: 11px; color: var(--muted); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
        .card-name { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700; color: var(--text); margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .card-meta { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; }
        .card-area { font-size: 12px; color: var(--muted); }
        .card-reviews { font-size: 11px; color: var(--muted2); }
        .empty { text-align: center; padding: 80px 20px; color: var(--muted); }
        .empty-icon { font-size: 48px; margin-bottom: 16px; }
        .empty-title { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--text); margin-bottom: 8px; }
        .empty-sub { font-size: 14px; line-height: 1.6; }
        @media (max-width: 600px) {
          .nav { padding: 0 16px; }
          .search-hero { padding: 20px 16px; }
          .cat-section { padding: 16px; }
          .results { padding: 20px 16px; }
          .search-bar { flex-direction: column; }
        }
      `}</style>

      <nav className="nav">
        <Link href="/" className="nav-logo">Top965</Link>
        <Link href="/auth" className="nav-btn">Sign In</Link>
      </nav>

      <div className="search-hero">
        <h1>Find the <em>Best</em> in Kuwait</h1>
        <div className="search-bar">
          <input className="search-input" type="text" placeholder="Search restaurants, cafes, salons..." value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
          <select className="search-select" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </select>
          <select className="search-select" value={area} onChange={e => setArea(e.target.value)}>
            {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <button className="search-btn" onClick={handleSearch}>Search →</button>
        </div>
      </div>

      <div className="cat-section">
        <div className="cat-scroll">
          {CATEGORIES.map(c => (
            <button key={c.id} className={`cat-pill ${category === c.id ? 'active' : ''}`} onClick={() => { setCategory(c.id); setSearched(true); setPlaces(MOCK_PLACES); }}>
              <span>{c.icon}</span><span>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="results">
        {!searched ? (
          <div className="empty">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">Discover Kuwait</div>
            <div className="empty-sub">Search for a place, pick a category,<br />or browse by area to get started.</div>
          </div>
        ) : loading ? (
          <div className="empty"><div className="empty-icon">⏳</div><div className="empty-title">Searching...</div></div>
        ) : (
          <>
            <div className="results-header">
              <div>
                <div className="results-title">
                  <span>{category ? CATEGORIES.find(c => c.id === category)?.label : query || 'All Places'}</span>
                  {area !== 'All Areas' ? ` in ${area}` : ' in Kuwait'}
                </div>
                <div className="results-count">{filteredPlaces.length} places found</div>
              </div>
              <div className="filter-bar">
                <select className="filter-select" value={sort} onChange={e => setSort(e.target.value)}>
                  <option value="rating">Top Rated</option>
                  <option value="reviews">Most Reviewed</option>
                  <option value="newest">Newly Added</option>
                </select>
                <div className="rating-filter">
                  {[0,3,4].map(r => (
                    <button key={r} className={`rating-btn ${minRating === r ? 'active' : ''}`} onClick={() => setMinRating(r)}>
                      {r === 0 ? 'All' : `${r}★+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {filteredPlaces.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">😔</div>
                <div className="empty-title">No places found</div>
                <div className="empty-sub">Try a different search or remove some filters.</div>
              </div>
            ) : (
              <div className="grid">
                {filteredPlaces.map(place => (
                  <Link key={place.id} href={`/place/${place.id}`} className="card">
                    <div className="card-img">
                      <span>{CATEGORIES.find(c => c.id === place.category)?.icon || '🏢'}</span>
                      {place.verified && <span className="verified">✓ VERIFIED</span>}
                    </div>
                    <div className="card-body">
                      <div className="card-cat">{place.category}</div>
                      <div className="card-name">{place.name}</div>
                      <StarRating rating={place.rating} />
                      <div className="card-meta">
                        <span className="card-area">📍 {place.area}</span>
                        <span className="card-reviews">{place.reviews} reviews</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
