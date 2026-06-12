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

function slugify(name: string): string {
  return name.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60) + '-' + Math.random().toString(36).slice(2, 7)
}

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}

async function fetchPlaces(query: string) {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&region=kw`
  const res = await fetch(url, { cache: 'no-store' })
  return res.json()
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (token !== process.env.IMPORT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
if (searchParams.get('debug') === '1') {
    const testUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurant+Kuwait&key=${GOOGLE_API_KEY}`
    const res = await fetch(testUrl)
    const data = await res.json()
    return NextResponse.json({ status: data.status, count: data.results?.length, first: data.results?.[0]?.name })
  }
  let total = 0
  const imported: string[] = []
  const errors: string[] = []

  for (const { query, category } of SEARCHES) {
    try {
      const data = await fetchPlaces(query)
      if (!data.results) continue

      for (const place of data.results.slice(0, 20)) {
        const areaName = getArea(place.formatted_address || '')

        const record = {
          name_en: place.name,
          name_ar: null,
          slug: slugify(place.name),
          description_en: null,
          description_ar: null,
          category_id: null,
          area_id: null,
          address_en: place.formatted_address || null,
          address_ar: null,
          lat: place.geometry?.location?.lat || null,
          lng: place.geometry?.location?.lng || null,
          google_maps_url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
          phone: null,
          whatsapp: null,
          website: null,
          instagram: null,
          snapchat: null,
          cover_image_url: place.photos?.[0]?.photo_reference
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
            : null,
          photos: null,
          avg_rating: 0,
          review_count: 0,
          verified_review_count: 0,
          google_score: place.rating || null,
          google_reviews: place.user_ratings_total || 0,
          composite_score: place.rating || null,
          is_claimed: false,
          is_featured: false,
          is_verified_business: false,
          is_active: true,
          is_approved: true,
          view_count: 0,
          save_count: 0,
          search_count: 0,
          tags: [category, areaName],
        }

        const { error } = await supabase
          .from('places')
          .insert(record)

        if (!error) {
          total++
          imported.push(place.name)
        } else {
          errors.push(`${place.name}: ${error.message}`)
        }
      }

      await sleep(500)
    } catch (err: any) {
      errors.push(`${category}: ${err.message}`)
    }
  }

  return NextResponse.json({
    success: true,
    total_imported: total,
    errors: errors.slice(0, 20),
    places: imported
  })
}
