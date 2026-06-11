import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY

const SEARCHES = [
  { query: 'restaurant Kuwait City', category: 'Restaurants' },
  { query: 'cafe Kuwait City', category: 'Cafes' },
  { query: 'frozen yogurt Kuwait', category: 'Frozen Yogurt' },
  { query: 'bakery Kuwait', category: 'Bakeries' },
  { query: 'burger Kuwait', category: 'Burgers' },
  { query: 'pizza Kuwait', category: 'Pizza' },
  { query: 'sushi Kuwait', category: 'Sushi' },
  { query: 'shawarma Kuwait', category: 'Shawarma' },
  { query: 'gym Kuwait', category: 'Gyms' },
  { query: 'salon Kuwait', category: 'Salons' },
  { query: 'bank Kuwait', category: 'Banks' },
  { query: 'clinic Kuwait', category: 'Clinics' },
  { query: 'hotel Kuwait', category: 'Hotels' },
  { query: 'supermarket Kuwait', category: 'Supermarkets' },
  { query: 'pharmacy Kuwait', category: 'Pharmacies' },
]

const AREA_MAP: Record<string, string> = {
  'salmiya': 'Salmiya', 'hawalli': 'Hawalli', 'rumaithiya': 'Rumaithiya',
  'bayan': 'Bayan', 'mishref': 'Mishref', 'kuwait city': 'Kuwait City',
  'sharq': 'Sharq', 'jabriya': 'Jabriya', 'surra': 'Surra', 'salwa': 'Salwa',
  'mahboula': 'Mahboula', 'fintas': 'Fintas', 'fahaheel': 'Fahaheel',
  'ahmadi': 'Ahmadi', 'shuwaikh': 'Shuwaikh', 'rai': 'Rai',
  'ardiya': 'Ardiya', 'farwaniya': 'Farwaniya', 'khaitan': 'Khaitan',
  'jahra': 'Jahra', 'egaila': 'Egaila', 'messila': 'Messila',
  'qurain': 'Qurain', 'sabah al salem': 'Sabah Al Salem',
  'mubarak': 'Mubarak Al Kabeer',
}

function getArea(address: string): string {
  if (!address) return 'Kuwait'
  const lower = address.toLowerCase()
  for (const [key, val] of Object.entries(AREA_MAP)) {
    if (lower.includes(key)) return val
  }
  return 'Kuwait'
}

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}

async function fetchPlaces(query: string) {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&region=kw`
  const res = await fetch(url)
  return res.json()
}

export async function GET(request: Request) {
  // Security check - require a secret token
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  
  if (token !== process.env.IMPORT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let total = 0
  const results: any[] = []

  for (const { query, category } of SEARCHES) {
    try {
      const data = await fetchPlaces(query)
      
      if (!data.results) continue

      for (const place of data.results.slice(0, 20)) {
        const record = {
          google_place_id: place.place_id,
          name: place.name,
          category,
          area: getArea(place.formatted_address || ''),
          address: place.formatted_address || null,
          google_rating: place.rating || null,
          google_review_count: place.user_ratings_total || 0,
          rating: 0,
          review_count: 0,
          photo_url: place.photos?.[0]?.photo_reference
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
            : null,
          lat: place.geometry?.location?.lat || null,
          lng: place.geometry?.location?.lng || null,
          country: 'KW',
          verified: false,
        }

        const { error } = await supabase
          .from('places')
          .upsert(record, { onConflict: 'google_place_id' })

        if (!error) {
          total++
          results.push(place.name)
        }
      }

      await sleep(500)
    } catch (err: any) {
      console.error(`Error for ${category}:`, err.message)
    }
  }

  return NextResponse.json({
    success: true,
    total_imported: total,
    places: results
  })
}
