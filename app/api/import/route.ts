import { NextResponse } from 'next/server'

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const SEARCHES = [
  { query: 'restaurant Kuwait City', category: 'Restaurants' },
]

function slugify(name: string): string {
  return name.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60) + '-' + Date.now().toString(36)
}

// Build a real image URL from a Google photo_reference
function buildPhotoUrl(photoReference: string): string {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${photoReference}&key=${GOOGLE_API_KEY}`
}

// Fetch phone, website, hours, and photos for a single place using Place Details
async function fetchPlaceDetails(placeId: string, logs: string[]) {
  const fields = 'formatted_phone_number,website,opening_hours,photos'
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_API_KEY}`

  try {
    const res = await fetch(url)
    const body = await res.json()

    if (body.status !== 'OK') {
      logs.push(`[Details] Non-OK status for ${placeId}: ${body.status}`)
      return null
    }

    const result = body.result
    const photoRefs: string[] = (result.photos || [])
      .slice(0, 5)
      .map((p: { photo_reference: string }) => p.photo_reference)

    return {
      phone: result.formatted_phone_number || null,
      website: result.website || null,
      hours: result.opening_hours?.weekday_text || null,
      photos: photoRefs.map(buildPhotoUrl),
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown details error'
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
  const imported: string[] = []
  const errors: string[] = []
  const logs: string[] = []

  for (const { query, category } of SEARCHES) {
    try {
      const actualUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&region=kw`

      logs.push(`[Google] Calling text search for: ${query}`)
      console.log(`[Google] Calling text search for: ${query}`)

      let res: Response
      try {
        res = await fetch(actualUrl)
        logs.push(`[Google] HTTP status: ${res.status}`)
      } catch (fetchErr: unknown) {
        const msg = fetchErr instanceof Error ? `${fetchErr.message}\n${fetchErr.stack}` : 'Unknown fetch error'
        logs.push(`[Google] FETCH EXCEPTION: ${msg}`)
        console.error(`[Google] FETCH EXCEPTION: ${msg}`)
        errors.push(`${category}: FETCH EXCEPTION - ${msg}`)
        continue
      }

      const body = await res.text()
      const data = JSON.parse(body)

      if (!data.results || data.results.length === 0) {
        errors.push(`${category}: No results (status: ${data.status})`)
        continue
      }

      logs.push(`[Google] Got ${data.results.length} results`)
      console.log(`[Google] Got ${data.results.length} results`)

      for (const place of data.results.slice(0, 5)) {
        try {
          // Second call: get phone, website, hours, photos for this specific place
          logs.push(`[Details] Fetching details for: ${place.name}`)
          const details = await fetchPlaceDetails(place.place_id, logs)

          const photos = details?.photos || []

          const record = {
            name_en: place.name,
            slug: slugify(place.name),
            address_en: place.formatted_address || null,
            lat: place.geometry?.location?.lat || null,
            lng: place.geometry?.location?.lng || null,
            google_maps_url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
            google_score: place.rating || null,
            google_reviews: place.user_ratings_total || 0,
            phone: details?.phone || null,
            website: details?.website || null,
            hours: details?.hours || null,
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
          }

          logs.push(`[Supabase] Inserting: ${place.name} (${photos.length} photos)`)
          console.log(`[Supabase] Inserting: ${place.name} (${photos.length} photos)`)

          const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/places`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_KEY!,
              'Authorization': `Bearer ${SUPABASE_KEY}`,
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify(record),
          })

          logs.push(`[Supabase] Insert status: ${insertRes.status}`)

          if (insertRes.ok || insertRes.status === 201) {
            total++
            imported.push(place.name)
          } else {
            const errText = await insertRes.text()
            logs.push(`[Supabase] Insert error: ${errText.slice(0, 200)}`)
            console.error(`[Supabase] Insert error: ${errText.slice(0, 200)}`)
            errors.push(`${place.name}: ${errText.slice(0, 200)}`)
          }
        } catch (placeErr: unknown) {
          const msg = placeErr instanceof Error ? `${placeErr.message}\n${placeErr.stack}` : 'Unknown'
          logs.push(`[Place] EXCEPTION for ${place.name}: ${msg}`)
          console.error(`[Place] EXCEPTION for ${place.name}: ${msg}`)
          errors.push(`${place.name}: ${msg}`)
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? `${err.message}\n${err.stack}` : 'Unknown'
      logs.push(`[Category] EXCEPTION for ${category}: ${msg}`)
      console.error(`[Category] EXCEPTION for ${category}: ${msg}`)
      errors.push(`${category}: ${msg}`)
    }
  }

  return NextResponse.json({
    success: true,
    total_imported: total,
    errors,
    places: imported,
    logs,
  })
}
