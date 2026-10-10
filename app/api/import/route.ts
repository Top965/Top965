import { NextResponse } from 'next/server'

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const SEARCHES = [
  { query: 'restaurants Kuwait', category: 'Restaurants' },
  { query: 'cafes Kuwait', category: 'Cafes' },
  { query: 'gyms Kuwait', category: 'Gyms' },
  { query: 'salons Kuwait', category: 'Salons' },
  { query: 'clinics Kuwait', category: 'Clinics' },
  { query: 'pharmacies Kuwait', category: 'Clinics' },
  { query: 'hotels Kuwait', category: 'Hotels' },
  { query: 'shopping malls Kuwait', category: 'Shopping' },
  { query: 'fast food Kuwait', category: 'Fast Food' },
  { query: 'desserts Kuwait', category: 'Desserts' },
  { query: 'bakeries Kuwait', category: 'Cafes' },
  { query: 'spas Kuwait', category: 'Salons' },
  { query: 'hospitals Kuwait', category: 'Clinics' },
  { query: 'supermarkets Kuwait', category: 'Shopping' },
  { query: 'car wash Kuwait', category: 'Services' },
  { query: 'dental Kuwait', category: 'Clinics' },
  { query: 'entertainment Kuwait', category: 'Entertainment' },
  { query: 'Asian restaurants Kuwait', category: 'Restaurants' },
  { query: 'Indian restaurants Kuwait', category: 'Restaurants' },
  { query: 'healthy food Kuwait', category: 'Restaurants' },
]

function slugify(name: string): string {
  return name.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60) + '-' + Date.now().toString(36)
}

function buildPhotoUrl(photoReference: string): string {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${photoReference}&key=${GOOGLE_API_KEY}`
}

async function fetchPlaceDetails(placeId: string, logs: string[]) {
  const fields = 'formatted_phone_number,website,opening_hours,photos,rating,user_ratings_total'
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_API_KEY}`

  try {
    const res = await fetch(url)
    const body = await res.json()

    if (body.status !== 'OK') {
      logs.push(`[Details] Non-OK for ${placeId}: ${body.status}`)
      return null
    }

    const r = body.result
    const photoRefs: string[] = (r.photos || []).slice(0, 5).map((p: { photo_reference: string }) => p.photo_reference)
    const photos = photoRefs.map(buildPhotoUrl)

    return {
      phone: r.formatted_phone_number || null,
      website: r.website || null,
      opening_hours: r.opening_hours?.weekday_text || null,
      is_open_now: r.opening_hours?.open_now ?? null,
      photos,
      cover_image_url: photos[0] || null,
      google_score: r.rating || null,
      google_reviews: r.user_ratings_total || 0,
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown'
    logs.push(`[Details] EXCEPTION for ${placeId}: ${msg}`)
    return null
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (token !== process.env.IMPORT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let total = 0
  let skipped = 0
  const imported: string[] = []
  const errors: string[] = []
  const logs: string[] = []

  for (const { query, category } of SEARCHES) {
    try {
      const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&region=kw`
      logs.push(`[Search] ${query}`)

      const res = await fetch(searchUrl)
      const data = await res.json()

      if (!data.results || data.results.length === 0) {
        logs.push(`[Search] No results for: ${query} (status: ${data.status})`)
        continue
      }

      logs.push(`[Search] ${data.results.length} results for: ${query}`)

      for (const place of data.results) {
        try {
          const details = await fetchPlaceDetails(place.place_id, logs)
          const photos = details?.photos || []

          const record = {
            google_place_id: place.place_id,
            name_en: place.name,
            slug: slugify(place.name),
            address_en: place.formatted_address || null,
            lat: place.geometry?.location?.lat || null,
            lng: place.geometry?.location?.lng || null,
            google_maps_url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
            google_score: details?.google_score ?? place.rating ?? null,
            google_reviews: details?.google_reviews ?? place.user_ratings_total ?? 0,
            phone: details?.phone || null,
            website: details?.website || null,
            opening_hours: details?.opening_hours || null,
            is_open_now: details?.is_open_now ?? null,
            cover_image_url: photos[0] || null,
            photos: photos.length > 0 ? photos : null,
            avg_rating: 0,
            review_count: 0,
            verified_review_count: 0,
            is_claimed: false,
            is_featured: false,
            is_verified_business: false,
            is_active: true,
            is_approved: true,
            view_count: 0,
            save_count: 0,
            search_count: 0,
            updated_at: new Date().toISOString(),
          }

          const upsertRes = await fetch(`${SUPABASE_URL}/rest/v1/places`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_KEY!,
              'Authorization': `Bearer ${SUPABASE_KEY}`,
              'Prefer': 'resolution=merge-duplicates,return=minimal',
              'on-conflict': 'google_place_id',
            },
            body: JSON.stringify(record),
          })

          if (upsertRes.ok || upsertRes.status === 201) {
            total++
            imported.push(place.name)
            logs.push(`[OK] ${place.name}`)
          } else {
            const errText = await upsertRes.text()
            if (errText.includes('duplicate') || upsertRes.status === 409) {
              skipped++
              logs.push(`[SKIP] ${place.name}: already exists`)
            } else {
              errors.push(`${place.name}: ${errText.slice(0, 150)}`)
              logs.push(`[FAIL] ${place.name}: ${errText.slice(0, 150)}`)
            }
          }

          await new Promise(r => setTimeout(r, 80))

        } catch (placeErr: unknown) {
          const msg = placeErr instanceof Error ? placeErr.message : 'Unknown'
          errors.push(`${place.name}: ${msg}`)
          logs.push(`[ERROR] ${place.name}: ${msg}`)
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown'
      errors.push(`${query}: ${msg}`)
      logs.push(`[ERROR] Search ${query}: ${msg}`)
    }
  }

  return NextResponse.json({
    success: true,
    total_upserted: total,
    skipped,
    errors,
    places: imported,
    logs,
  })
}
