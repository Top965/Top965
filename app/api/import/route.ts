export const runtime = 'edge'

import { NextResponse } from 'next/server'

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

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

async function insertPlace(record: Record<string, unknown>) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/places`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY!,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(record),
  })
  return res
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (token !== process.env.IMPORT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Debug mode
  if (searchParams.get('debug') === '1') {
    try {
      const testUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurant+Kuwait&key=${GOOGLE_API_KEY}`
      const res = await fetch(testUrl)
      const data = await res.json()

      const sbRes = await fetch(`${SUPABASE_URL}/rest/v1/places?limit=1`, {
        headers: {
          'apikey': SUPABASE_KEY!,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
      })

      return NextResponse.json({
        google_status: data.status,
        google_count: data.results?.length,
        first_place: data.results?.[0]?.name,
        supabase_status: sbRes.status,
        supabase_url_set: !!SUPABASE_URL,
        supabase_key_set: !!SUPABASE_KEY,
      })
    } catch (err: unknown) {
      return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  let total = 0
  const imported: string[] = []
  const errors: string[] = []

  for (const { query, category } of SEARCHES) {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&region=kw`
      const res = await fetch(url)
      const data = await res.json()

      if (!data.results || data.results.length === 0) {
        errors.push(`${category}: No results (status: ${data.status})`)
        continue
      }

      for (const place of data.results.slice(0, 20)) {
        try {
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
            cover_image_url: null,
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
            tags: null,
          }

          const insertRes = await insertPlace(record)

          if (insertRes.ok || insertRes.status === 201) {
            total++
            imported.push(place.name)
          } else {
            const errText = await insertRes.text()
            errors.push(`${place.name}: HTTP ${insertRes.status} - ${errText.slice(0, 100)}`)
          }
        } catch (placeErr: unknown) {
          errors.push(`${place.name}: ${placeErr instanceof Error ? placeErr.message : 'Unknown'}`)
        }
      }
    } catch (err: unknown) {
      errors.push(`${category}: ${err instanceof Error ? err.message : 'Unknown'}`)
    }
  }

  return NextResponse.json({
    success: true,
    total_imported: total,
    errors: errors.slice(0, 20),
    places: imported,
  })
}
