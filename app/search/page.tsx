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
        .cat-scroll { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
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


On Wed, 10 Jun 2026, 21:03 Wael Lahlabat, <wael.lahlabat@gmail.com> wrote:
'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
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

const SORT_OPTIONS = [
  { id: 'rating', label: 'Top Rated' },
  { id: 'reviews', label: 'Most Reviewed' },
  { id: 'newest', label: 'Newly Added' },
]

// Mock data for UI demonstration
const MOCK_PLACES = [
  { id: '1', name: 'Pinkberry Kuwait', category: 'Frozen Yogurt', area: 'Salmiya', rating: 4.8, reviews: 234, verified: true, image: null },
  { id: '2', name: "Menchie's", category: 'Frozen Yogurt', area: 'Hawalli', rating: 4.5, reviews: 187, verified: true, image: null },
  { id: '3', name: 'llaollao', category: 'Frozen Yogurt', area: 'Rumaithiya', rating: 4.7, reviews: 312, verified: false, image: null },
  { id: '4', name: 'Berry Cool', category: 'Frozen Yogurt', area: 'Salmiya', rating: 4.2, reviews: 98, verified: false, image: null },
  { id: '5', name: 'YogurtLand', category: 'Frozen Yogurt', area: 'Jabriya', rating: 4.4, reviews: 156, verified: true, image: null },
  { id: '6', name: 'Tutti Frutti', category: 'Frozen Yogurt', area: 'Fahaheel', rating: 4.1, reviews: 74, verified: false, image: null },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{
          fontSize: 12,
          color: i <= Math.round(rating) ? '#E8B94F' : '#333',
        }}>★</span>
      ))}
      <span style={{ fontSize: 13, color: '#E8B94F', fontWeight: 700, marginLeft: 2 }}>{rating.toFixed(1)}</span>
    </div>
  )
}

function SearchContent() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [area, setArea] = useState(searchParams.get('area') || 'All Areas')
  const [sort, setSort] = useState('rating')
  const [minRating, setMinRating] = useState(0)
  const [places, setPlaces] = useState(MOCK_PLACES)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (searchParams.get('q') || searchParams.get('category')) {
      handleSearch()
    }
  }, [])

  const handleSearch = async () => {
    setLoading(true)
    setSearched(true)

    try {
      let dbQuery = supabase
        .from('places')
        .select('*')

      if (query) dbQuery = dbQuery.ilike('name', `%${query}%`)
      if (category) dbQuery = dbQuery.eq('category', category)
      if (area && area !== 'All Areas') dbQuery = dbQuery.eq('area', area)
      if (minRating > 0) dbQuery = dbQuery.gte('rating', minRating)

      if (sort === 'rating') dbQuery = dbQuery.order('rating', { ascending: false })
      else if (sort === 'reviews') dbQuery = dbQuery.order('review_count', { ascending: false })
      else if (sort === 'newest') dbQuery = dbQuery.order('created_at', { ascending: false })

      const { data, error } = await dbQuery.limit(50)

      if (error || !data || data.length === 0) {
        setPlaces(MOCK_PLACES)
      } else {
        setPlaces(data)
      }
    } catch {
      setPlaces(MOCK_PLACES)
    }

    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  const filteredPlaces = minRating > 0
    ? places.filter(p => p.rating >= minRating)
    : places

  const resultLabel = [
    category || query || 'All Places',
    area !== 'All Areas' ? `in ${area}` : 'in Kuwait',
  ].join(' ')

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

        /* NAV */
        .nav { 
          height: 64px; background: var(--dark2); border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px; position: sticky; top: 0; z-index: 100;
        }
        .nav-logo { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 900; color: var(--gold); text-decoration: none; }
        .nav-right { display: flex; align-items: center; gap: 16px; }
        .nav-link { font-size: 13px; color: var(--muted); text-decoration: none; transition: color 0.2s; }
        .nav-link:hover { color: var(--gold); }
        .nav-btn { padding: 8px 18px; background: var(--gold); color: var(--dark); border: none; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; text-decoration: none; }

        /* SEARCH HERO */
        .search-hero {
          background: var(--dark2);
          border-bottom: 1px solid var(--border);
          padding: 32px;
        }
        .search-hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(22px, 3vw, 32px);
          font-weight: 900;
          margin-bottom: 20px;
        }
        .search-hero h1 em { color: var(--gold); font-style: normal; }

        .search-bar {
          display: flex; gap: 10px; flex-wrap: wrap;
          max-width: 900px;
        }

        .search-input {
          flex: 1; min-width: 200px;
          padding: 13px 18px;
          background: var(--dark3);
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; outline: none;
          transition: border-color 0.2s;
        }
        .search-input:focus { border-color: var(--gold); }
        .search-input::placeholder { color: var(--muted2); }

        .search-select {
          padding: 13px 16px;
          background: var(--dark3);
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; outline: none;
          cursor: pointer; appearance: none;
          transition: border-color 0.2s;
          min-width: 150px;
        }
        .search-select:focus { border-color: var(--gold); }
        .search-select option { background: var(--dark3); }

        .search-btn {
          padding: 13px 28px;
          background: var(--gold); color: var(--dark);
          border: none; border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 700;
          cursor: pointer; transition: background 0.2s;
          white-space: nowrap;
        }
        .search-btn:hover { background: var(--gold-dark); }

        /* CATEGORY PILLS */
        .category-section { padding: 20px 32px; border-bottom: 1px solid var(--border); }
        .category-scroll { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
        .category-scroll::-webkit-scrollbar { display: none; }
        .cat-pill {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 16px;
          background: var(--dark3);
          border: 1px solid var(--border);
          border-radius: 20px;
          color: var(--muted);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          cursor: pointer; white-space: nowrap;
          transition: all 0.2s;
        }
        .cat-pill:hover { border-color: var(--border-gold); color: var(--text); }
        .cat-pill.active { background: var(--gold-dim); border-color: var(--gold); color: var(--gold); font-weight: 600; }

        /* RESULTS SECTION */
        .results-section { padding: 24px 32px; }

        .results-header {
          display: flex; align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap; gap: 12px;
        }

        .results-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700;
        }
        .results-title span { color: var(--gold); }
        .results-count { font-size: 13px; color: var(--muted); margin-top: 2px; }

        .filter-bar { display: flex; gap: 8px; flex-wrap: wrap; }

        .filter-select {
          padding: 8px 14px;
          background: var(--dark3);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; outline: none;
          cursor: pointer; appearance: none;
        }
        .filter-select option { background: var(--dark3); }

        .rating-filter { display: flex; gap: 6px; }
        .rating-btn {
          padding: 7px 12px;
          background: var(--dark3);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--muted);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
        }
        .rating-btn.active { background: var(--gold-dim); border-color: var(--gold); color: var(--gold); }

        /* GRID */
        .places-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }

        .place-card {
          background: var(--dark3);
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.2s, transform 0.2s;
          text-decoration: none;
          display: block;
          animation: fadeUp 0.4s ease both;
        }
        .place-card:hover { border-color: var(--border-gold); transform: translateY(-3px); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .card-image {
          width: 100%; height: 160px;
          background: linear-gradient(135deg, #1a1a1a 0%, #222 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 48px;
          border-bottom: 1px solid var(--border);
          position: relative;
        }

        .verified-badge {
          position: absolute; top: 10px; right: 10px;
          background: rgba(232,185,79,0.15);
          border: 1px solid var(--border-gold);
          color: var(--gold);
          font-size: 10px; font-weight: 700;
          padding: 3px 8px; border-radius: 20px;
          letter-spacing: 0.5px;
        }

        .card-body { padding: 16px; }
        .card-name {
          font-family: 'Playfair Display', serif;
          font-size: 17px; font-weight: 700;
          color: var(--text); margin-bottom: 6px;
          white-space: nowrap; overflow: hidden;
          text-overflow: ellipsis;
        }
        .card-meta {
          display: flex; align-items: center;
          justify-content: space-between;
          margin-top: 8px;
        }
        .card-area { font-size: 12px; color: var(--muted); }
        .card-reviews { font-size: 11px; color: var(--muted2); }
        .card-category {
          font-size: 11px; color: var(--muted);
          margin-bottom: 6px;
          text-transform: uppercase; letter-spacing: 0.5px;
        }

        /* EMPTY STATE */
        .empty-state {
          text-align: center; padding: 80px 20px;
          color: var(--muted);
        }
        .empty-icon { font-size: 48px; margin-bottom: 16px; }
        .empty-title { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--text); margin-bottom: 8px; }
        .empty-sub { font-size: 14px; line-height: 1.6; }

        /* LOADING */
        .loading-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }
        .skeleton {
          background: var(--dark3);
          border: 1px solid var(--border);
          border-radius: 14px; overflow: hidden;
        }
        .skeleton-img { height: 160px; background: linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        .skeleton-body { padding: 16px; }
        .skeleton-line { height: 12px; background: #222; border-radius: 4px; margin-bottom: 8px; animation: shimmer 1.5s infinite; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        @media (max-width: 600px) {
          .nav { padding: 0 16px; }
          .search-hero { padding: 20px 16px; }
          .category-section { padding: 16px; }
          .results-section { padding: 20px 16px; }
          .search-bar { flex-direction: column; }
          .search-input, .search-select { width: 100%; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <Link href="/" className="nav-logo">Top965</Link>
        <div className="nav-right">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/auth" className="nav-btn">Sign In</Link>
        </div>
      </nav>

      {/* SEARCH HERO */}
      <div className="search-hero">
        <h1>Find the <em>Best</em> in Kuwait</h1>
        <div className="search-bar">
          <input
            className="search-input"
            type="text"
            placeholder="Search restaurants, cafes, salons..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <select className="search-select" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
            ))}
          </select>
          <select className="search-select" value={area} onChange={e => setArea(e.target.value)}>
            {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <button className="search-btn" onClick={handleSearch}>
            Search →
          </button>
        </div>
      </div>

      {/* CATEGORY PILLS */}
      <div className="category-section">
        <div className="category-scroll">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              className={`cat-pill ${category === c.id ? 'active' : ''}`}
              onClick={() => { setCategory(c.id); handleSearch(); }}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* RESULTS */}
      <div className="results-section">
        {!searched ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">Discover Kuwait</div>
            <div className="empty-sub">Search for a place, pick a category,<br />or browse by area to get started.</div>
          </div>
        ) : loading ? (
          <div className="loading-grid">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="skeleton">
                <div className="skeleton-img" />
                <div className="skeleton-body">
                  <div className="skeleton-line" style={{ width: '70%' }} />
                  <div className="skeleton-line" style={{ width: '40%' }} />
                  <div className="skeleton-line" style={{ width: '55%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="results-header">
              <div>
                <div className="results-title">
                  <span>{category ? CATEGORIES.find(c => c.id === category)?.label || category : query || 'All Places'}</span>
                  {area !== 'All Areas' ? ` in ${area}` : ' in Kuwait'}
                </div>
                <div className="results-count">{filteredPlaces.length} places found</div>
              </div>
              <div className="filter-bar">
                <select className="filter-select" value={sort} onChange={e => setSort(e.target.value)}>
                  {SORT_OPTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
                <div className="rating-filter">
                  {[0, 3, 4].map(r => (
                    <button
                      key={r}
                      className={`rating-btn ${minRating === r ? 'active' : ''}`}
                      onClick={() => setMinRating(r)}
                    >
                      {r === 0 ? 'All' : `${r}★+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filteredPlaces.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">😔</div>
                <div className="empty-title">No places found</div>
                <div className="empty-sub">Try a different search or remove some filters.</div>
              </div>
            ) : (
              <div className="places-grid">
                {filteredPlaces.map((place, i) => (
                  <Link
                    key={place.id}
                    href={`/place/${place.id}`}
                    className="place-card"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="card-image">
                      <span>{CATEGORIES.find(c => c.id === place.category || c.label === place.category)?.icon || '🏢'}</span>
                      {place.verified && <span className="verified-badge">✓ VERIFIED</span>}
                    </div>
                    <div className="card-body">
                      <div className="card-category">{place.category}</div>
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{background:'#0D0D0D', minHeight:'100vh'}} />}>
      <SearchContent />
    </Suspense>
  )
}


On Tue, 9 Jun 2026, 23:47 Wael Lahlabat, <wael.lahlabat@gmail.com> wrote:
'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

type Mode = 'signin' | 'signup' | 'forgot' | 'otp' | 'signup2'

const KUWAIT_AREAS = [
  'Salmiya', 'Hawalli', 'Rumaithiya', 'Bayan', 'Mishref',
  'Kuwait City', 'Sharq', 'Qibla', 'Dasman',
  'Jabriya', 'Surra', 'Salwa',
  'Mahboula', 'Fintas', 'Mangaf', 'Abu Halifa', 'Fahaheel',
  'Ahmadi', 'Riqqa', 'Sabahiya',
  'Shuwaikh', 'Rai', 'Ardiya', 'Firdous',
  'Sabah Al Salem', 'Mubarak Al Kabeer', 'Qurain', 'Qusour',
  'Farwaniya', 'Khaitan', 'Omariya', 'Ashbeliah',
  'Jahra', 'Sulaibikhat', 'Doha',
  'Egaila', 'Messila', 'Zahra', 'Other',
]

const NATIONALITIES = [
  'Kuwaiti', 'Saudi', 'Emirati', 'Qatari', 'Bahraini', 'Omani',
  'Egyptian', 'Jordanian', 'Lebanese', 'Syrian', 'Palestinian', 'Iraqi',
  'Yemeni', 'Sudanese', 'Moroccan', 'Tunisian', 'Libyan', 'Algerian',
  'Indian', 'Pakistani', 'Bangladeshi', 'Sri Lankan', 'Nepali',
  'Filipino', 'Indonesian',
  'British', 'American', 'Canadian', 'Australian', 'French', 'German',
  'Iranian', 'Turkish', 'Ethiopian', 'Other',
]

const AGE_RANGES = ['Under 18', '18–24', '25–34', '35–44', '45–54', '55+']

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 20)
}

export default function AuthPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const [mode, setMode] = useState<Mode>('signin')
  const [method, setMethod] = useState<'email' | 'phone'>('email')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)

  // Step 1
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle')
  const [usernameMsg, setUsernameMsg] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otp, setOtp] = useState('')

  // Step 2
  const [gender, setGender] = useState('')
  const [nationality, setNationality] = useState('')
  const [area, setArea] = useState('')
  const [ageRange, setAgeRange] = useState('')
  const [phoneOptional, setPhoneOptional] = useState('')

  const show = (text: string, type: 'error' | 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 5000)
  }

  // Auto-generate username from full name
  useEffect(() => {
    if (fullName && mode === 'signup') {
      const suggested = slugify(fullName)
      if (suggested) {
        setUsername(suggested)
        checkUsername(suggested)
      }
    }
  }, [fullName])

  // Check username availability
  const checkUsername = useCallback(async (val: string) => {
    if (!val) { setUsernameStatus('idle'); setUsernameMsg(''); return }

    // Validate format
    if (val.length < 3) {
      setUsernameStatus('invalid')
      setUsernameMsg('Min 3 characters')
      return
    }
    if (!/^[a-z0-9_]+$/.test(val)) {
      setUsernameStatus('invalid')
      setUsernameMsg('Only letters, numbers, underscores')
      return
    }

    setUsernameStatus('checking')
    setUsernameMsg('Checking...')

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', val)
        .maybeSingle()

      if (error) {
        // Table may not exist yet — assume available
        setUsernameStatus('available')
        setUsernameMsg('Available!')
        return
      }

      if (data) {
        setUsernameStatus('taken')
        setUsernameMsg('Username taken')
      } else {
        setUsernameStatus('available')
        setUsernameMsg('Available!')
      }
    } catch {
      setUsernameStatus('available')
      setUsernameMsg('Available!')
    }
  }, [supabase])

  // Debounce username check
  useEffect(() => {
    if (mode !== 'signup') return
    const timer = setTimeout(() => checkUsername(username), 500)
    return () => clearTimeout(timer)
  }, [username, mode, checkUsername])

  const handleEmailSignIn = async () => {
    if (!email || !password) return show('Please fill in all fields.', 'error')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return show(error.message, 'error')
    router.push('/')
  }

  const handleStep1 = () => {
    if (!fullName.trim()) return show('Please enter your full name.', 'error')
    if (!username.trim()) return show('Please choose a username.', 'error')
    if (usernameStatus === 'taken') return show('Username is already taken.', 'error')
    if (usernameStatus === 'invalid') return show('Invalid username format.', 'error')
    if (usernameStatus === 'checking') return show('Please wait while we check your username.', 'error')
    if (!email || !password) return show('Please fill in all fields.', 'error')
    if (password !== confirmPassword) return show('Passwords do not match.', 'error')
    if (password.length < 6) return show('Password must be at least 6 characters.', 'error')
    setMessage(null)
    setMode('signup2')
  }

  const handleStep2 = async () => {
    if (!gender) return show('Please select your gender.', 'error')
    if (!nationality) return show('Please select your nationality.', 'error')
    if (!area) return show('Please select your area.', 'error')
    if (!ageRange) return show('Please select your age range.', 'error')

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username: username,
          gender,
          nationality,
          area,
          age_range: ageRange,
          phone: phoneOptional || null,
        },
      },
    })
    setLoading(false)
    if (error) return show(error.message, 'error')
    show('Account created! Check your email to confirm.', 'success')
    setTimeout(() => router.push('/'), 2000)
  }

  const handleSendOtp = async () => {
    if (!phone) return show('Please enter your phone number.', 'error')
    const formatted = phone.startsWith('+') ? phone : `+965${phone}`
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ phone: formatted })
    setLoading(false)
    if (error) return show(error.message, 'error')
    show('OTP sent!', 'success')
    setMode('otp')
  }

  const handleVerifyOtp = async () => {
    if (!otp) return show('Please enter the OTP.', 'error')
    const formatted = phone.startsWith('+') ? phone : `+965${phone}`
    setLoading(true)
    const { error } = await supabase.auth.verifyOtp({ phone: formatted, token: otp, type: 'sms' })
    setLoading(false)
    if (error) return show(error.message, 'error')
    router.push('/')
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    setLoading(false)
    if (error) show(error.message, 'error')
  }

  const handleForgotPassword = async () => {
    if (!email) return show('Please enter your email.', 'error')
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`,
    })
    setLoading(false)
    if (error) return show(error.message, 'error')
    show('Reset link sent to your email!', 'success')
  }

  const step2Complete = gender && nationality && area && ageRange

  const usernameColor =
    usernameStatus === 'available' ? '#4ade80' :
    usernameStatus === 'taken' || usernameStatus === 'invalid' ? '#f87171' :
    '#777'

  const usernameIcon =
    usernameStatus === 'available' ? '✓' :
    usernameStatus === 'taken' || usernameStatus === 'invalid' ? '✗' :
    usernameStatus === 'checking' ? '...' : ''

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --gold: #E8B94F; --gold-dark: #C49A2F; --gold-dim: rgba(232,185,79,0.12);
          --dark: #0D0D0D; --dark2: #131313; --dark3: #1C1C1C;
          --border: rgba(255,255,255,0.07); --border-gold: rgba(232,185,79,0.2);
          --text: #F0EDE6; --muted: #777; --muted2: #3a3a3a;
        }
        body { background: var(--dark); }
        .auth-root { min-height: 100vh; display: flex; font-family: 'DM Sans', sans-serif; color: var(--text); background: var(--dark); position: relative; overflow: hidden; }
        .glow { position: fixed; top: -300px; left: 50%; transform: translateX(-50%); width: 800px; height: 800px; background: radial-gradient(circle, rgba(232,185,79,0.06) 0%, transparent 65%); pointer-events: none; z-index: 0; }
        .left { display: none; width: 44%; background: var(--dark2); border-right: 1px solid var(--border); padding: 52px 56px; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden; }
        @media (min-width: 900px) { .left { display: flex; } }
        .left-glow { position: absolute; bottom: -120px; right: -120px; width: 450px; height: 450px; background: radial-gradient(circle, rgba(232,185,79,0.05) 0%, transparent 60%); pointer-events: none; }
        .logo { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 900; color: var(--gold); }
        .logo-sub { font-size: 11px; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; margin-top: 3px; }
        .left-headline { font-family: 'Playfair Display', serif; font-size: clamp(30px, 2.8vw, 46px); font-weight: 900; line-height: 1.15; }
        .left-headline em { color: var(--gold); font-style: normal; }
        .left-body { font-size: 14px; color: var(--muted); line-height: 1.7; margin-top: 14px; max-width: 320px; }
        .stats { display: flex; gap: 28px; margin-top: 36px; }
        .stat-num { font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 700; color: var(--gold); }
        .stat-lbl { font-size: 11px; color: var(--muted); letter-spacing: 0.5px; margin-top: 2px; }
        .insight-box { margin-top: 32px; padding: 16px 20px; background: rgba(232,185,79,0.05); border: 1px solid var(--border-gold); border-radius: 12px; font-size: 13px; color: var(--muted); line-height: 1.6; }
        .insight-box strong { color: var(--gold); font-weight: 600; }
        .left-footer { font-size: 11px; color: var(--muted2); }
        .right { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 24px; position: relative; z-index: 1; }
        .card { width: 100%; max-width: 430px; animation: up 0.45s ease both; }
        @keyframes up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .mobile-logo { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 900; color: var(--gold); margin-bottom: 28px; display: block; }
        @media (min-width: 900px) { .mobile-logo { display: none; } }
        .steps { display: flex; align-items: center; gap: 8px; margin-bottom: 24px; }
        .step-dot { width: 28px; height: 4px; border-radius: 2px; background: var(--dark3); transition: background 0.3s; }
        .step-dot.active { background: var(--gold); }
        .step-label { font-size: 11px; color: var(--muted); margin-left: 4px; letter-spacing: 0.5px; }
        .title { font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 900; line-height: 1.1; }
        .subtitle { font-size: 13px; color: var(--muted); margin-top: 5px; margin-bottom: 24px; }
        .tabs { display: flex; background: var(--dark3); border-radius: 10px; padding: 3px; margin-bottom: 20px; border: 1px solid var(--border); }
        .tab { flex: 1; padding: 9px; border: none; background: transparent; color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
        .tab.active { background: var(--gold); color: var(--dark); font-weight: 700; }
        .field { margin-bottom: 12px; }
        .field label { display: block; font-size: 11px; font-weight: 600; color: var(--muted); margin-bottom: 5px; letter-spacing: 0.8px; text-transform: uppercase; }
        .field input, .field select { width: 100%; padding: 12px 15px; background: var(--dark3); border: 1px solid var(--border); border-radius: 10px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s; appearance: none; }
        .field select { cursor: pointer; }
        .field select option { background: var(--dark3); color: var(--text); }
        .field input:focus, .field select:focus { border-color: var(--gold); }
        .field input::placeholder { color: var(--muted2); }
        .username-wrapper { position: relative; }
        .username-prefix { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--gold); font-size: 14px; font-weight: 600; pointer-events: none; }
        .username-input { padding-left: 28px !important; }
        .username-status { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-size: 13px; font-weight: 700; }
        .username-hint { font-size: 11px; margin-top: 4px; }
        .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .phone-row { display: flex; gap: 8px; }
        .phone-prefix { padding: 12px 13px; background: var(--dark3); border: 1px solid var(--border); border-radius: 10px; color: var(--gold); font-size: 13px; font-weight: 600; white-space: nowrap; font-family: 'DM Sans', sans-serif; }
        .gender-row { display: flex; gap: 8px; margin-bottom: 12px; }
        .gender-pill { flex: 1; padding: 11px; background: var(--dark3); border: 1px solid var(--border); border-radius: 10px; color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; text-align: center; transition: all 0.2s; }
        .gender-pill.active { border-color: var(--gold); color: var(--gold); background: var(--gold-dim); }
        .age-grid { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 12px; }
        .age-pill { padding: 7px 14px; background: var(--dark3); border: 1px solid var(--border); border-radius: 20px; color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .age-pill.active { border-color: var(--gold); color: var(--gold); background: var(--gold-dim); }
        .field-label-inline { font-size: 11px; font-weight: 600; color: var(--muted); letter-spacing: 0.8px; text-transform: uppercase; display: block; margin-bottom: 6px; }
        .optional-section { padding: 14px 16px; background: rgba(232,185,79,0.04); border: 1px solid var(--border-gold); border-radius: 10px; margin-bottom: 12px; }
        .optional-label { font-size: 12px; color: var(--gold); font-weight: 600; margin-bottom: 4px; }
        .optional-hint { font-size: 11px; color: var(--muted); margin-bottom: 10px; line-height: 1.5; }
        .privacy-notice { display: flex; align-items: flex-start; gap: 8px; padding: 12px 14px; background: rgba(74,222,128,0.05); border: 1px solid rgba(74,222,128,0.15); border-radius: 10px; margin-bottom: 14px; }
        .privacy-notice span { font-size: 12px; color: #86efac; line-height: 1.5; }
        .btn { width: 100%; padding: 13px; background: var(--gold); color: var(--dark); border: none; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; margin-top: 4px; transition: background 0.2s, transform 0.1s; letter-spacing: 0.3px; }
        .btn:hover:not(:disabled) { background: var(--gold-dark); }
        .btn:active:not(:disabled) { transform: scale(0.99); }
        .btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .btn-google { width: 100%; padding: 12px; background: transparent; border: 1px solid var(--border); border-radius: 10px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 9px; transition: all 0.2s; }
        .btn-google:hover { border-color: var(--border-gold); background: rgba(232,185,79,0.04); }
        .divider { display: flex; align-items: center; gap: 10px; margin: 16px 0; }
        .div-line { flex: 1; height: 1px; background: var(--border); }
        .div-text { font-size: 11px; color: var(--muted2); }
        .msg { padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 12px; font-weight: 500; }
        .msg.error { background: rgba(220,50,50,0.1); color: #f87171; border: 1px solid rgba(220,50,50,0.2); }
        .msg.success { background: rgba(232,185,79,0.08); color: var(--gold); border: 1px solid var(--border-gold); }
        .footer { margin-top: 20px; text-align: center; font-size: 13px; color: var(--muted); }
        .link-btn { background: none; border: none; color: var(--gold); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; padding: 0; }
        .link-btn:hover { text-decoration: underline; }
        .row-links { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; font-size: 13px; color: var(--muted); }
        .back-btn { display: flex; align-items: center; gap: 5px; background: none; border: none; color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; padding: 0; margin-bottom: 20px; transition: color 0.2s; }
        .back-btn:hover { color: var(--gold); }
      `}</style>

      <div className="auth-root">
        <div className="glow" />

        {/* LEFT PANEL */}
        <div className="left">
          <div className="left-glow" />
          <div>
            <div className="logo">Top965</div>
            <div className="logo-sub">Kuwait's #1 Rating Platform</div>
          </div>
          <div>
            <h2 className="left-headline">Know Kuwait<br />Better Than<br /><em>Anyone.</em></h2>
            <p className="left-body">Real reviews from real people across every area, nationality, and background in Kuwait.</p>
            <div className="stats">
              <div><div className="stat-num">5K+</div><div className="stat-lbl">Places</div></div>
              <div><div className="stat-num">31</div><div className="stat-lbl">Categories</div></div>
              <div><div className="stat-num">100%</div><div className="stat-lbl">Kuwait</div></div>
            </div>
            <div className="insight-box">
              <strong>For Businesses:</strong> Understand who your customers really are — age, nationality, area — and make data-driven decisions.
            </div>
          </div>
          <div className="left-footer">© 2025 Top965 · Made with love in Kuwait</div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right">
          <div className="card">
            <span className="mobile-logo">Top965</span>

            {/* SIGN IN */}
            {mode === 'signin' && <>
              <h1 className="title">Welcome Back</h1>
              <p className="subtitle">Sign in to your Top965 account</p>
              {message && <div className={`msg ${message.type}`}>{message.text}</div>}
              <div className="tabs">
                <button className={`tab ${method === 'email' ? 'active' : ''}`} onClick={() => setMethod('email')}>📧 Email</button>
                <button className={`tab ${method === 'phone' ? 'active' : ''}`} onClick={() => setMethod('phone')}>📱 Phone</button>
              </div>
              {method === 'email' ? <>
                <div className="field"><label>Email</label><input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
                <div className="field"><label>Password</label><input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} /></div>
                <button className="btn" onClick={handleEmailSignIn} disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
                <div className="divider"><div className="div-line" /><span className="div-text">or</span><div className="div-line" /></div>
                <button className="btn-google" onClick={handleGoogleSignIn} disabled={loading}>
                  <svg width="17" height="17" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Continue with Google
                </button>
              </> : <>
                <div className="field"><label>Phone Number</label>
                  <div className="phone-row">
                    <span className="phone-prefix">🇰🇼 +965</span>
                    <input type="tel" placeholder="9XXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} style={{flex:1}} />
                  </div>
                </div>
                <button className="btn" onClick={handleSendOtp} disabled={loading}>{loading ? 'Sending...' : 'Send OTP'}</button>
              </>}
              <div className="row-links">
                <span>No account? <button className="link-btn" onClick={() => setMode('signup')}>Sign Up</button></span>
                <button className="link-btn" onClick={() => setMode('forgot')}>Forgot password?</button>
              </div>
            </>}

            {/* OTP */}
            {mode === 'otp' && <>
              <button className="back-btn" onClick={() => setMode('signin')}>← Back</button>
              <h1 className="title">Enter Code</h1>
              <p className="subtitle">6-digit code sent to +965{phone}</p>
              {message && <div className={`msg ${message.type}`}>{message.text}</div>}
              <div className="field"><label>OTP Code</label><input type="text" placeholder="123456" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} /></div>
              <button className="btn" onClick={handleVerifyOtp} disabled={loading}>{loading ? 'Verifying...' : 'Verify & Sign In'}</button>
              <div className="footer"><button className="link-btn" onClick={handleSendOtp}>Resend code</button></div>
            </>}

            {/* FORGOT */}
            {mode === 'forgot' && <>
              <button className="back-btn" onClick={() => setMode('signin')}>← Back</button>
              <h1 className="title">Reset Password</h1>
              <p className="subtitle">We'll send a reset link to your email</p>
              {message && <div className={`msg ${message.type}`}>{message.text}</div>}
              <div className="field"><label>Email Address</label><input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
              <button className="btn" onClick={handleForgotPassword} disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
            </>}

            {/* SIGNUP STEP 1 */}
            {mode === 'signup' && <>
              <div className="steps">
                <div className="step-dot active" /><div className="step-dot" />
                <span className="step-label">STEP 1 OF 2</span>
              </div>
              <h1 className="title">Create Account</h1>
              <p className="subtitle">Start with your basic info</p>
              {message && <div className={`msg ${message.type}`}>{message.text}</div>}

              <div className="field">
                <label>Full Name</label>
                <input type="text" placeholder="Your full name" value={fullName} onChange={e => setFullName(e.target.value)} />
