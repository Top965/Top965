import { NextResponse } from 'next/server'

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

function buildPhotoUrl(photoReference: string): string {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${photoReference}&key=${GOOGLE_API_KEY}`
}

function extractPlaceId(googleMapsUrl: string): string | null {
  const match = googleMapsUrl?.match(/place_id:([A-Za-z0-9_-]+)/)
  return match ? match[1] : null
}

async function fetchPlaceDetails(placeId: string) {
  const fields = 'rating,user_ratings_total,opening_hours,photos,business_status'
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_API_KEY}`
  const res = await fetch(url)
  const body = await res.json()
  if (body.status !== 'OK') return null
  const r = body.result
  const photoRefs: string[] = (r.photos || []).slice(0, 5).map((p: { photo_reference: string }) => p.photo_reference)
  const photos = photoRefs.map(buildPhotoUrl)
  return {
    google_score: r.rating || null,
    google_reviews: r.user_ratings_total || 0,
    is_open_now: r.opening_hours?.open_now ?? null,
    opening_hours: r.opening_hours?.weekday_text || null,
    cover_image_url: photos[0] || null,
    photos: photos.length > 0 ? photos : null,
    updated_at: new Date().toISOString(),
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (token !== process.env.IMPORT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const listRes = await fetch(
    `${SUPABASE_URL}/rest/v1/places?select=id,name_en,google_maps_url&google_maps_url=not.is.null&limit=1000`,
    {
      headers: {
        'apikey': SUPABASE_KEY!,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    }
  )

  if (!listRes.ok) {
    return NextResponse.json({ error: 'Failed to fetch places from Supabase' }, { status: 500 })
  }

  const places = await listRes.json()
  const logs: string[] = []
  let updated = 0
  let failed = 0

  for (const place of places) {
    const placeId = extractPlaceId(place.google_maps_url)
    if (!placeId) {
      logs.push(`SKIP ${place.name_en}: no place_id in URL`)
      continue
    }

    try {
      const details = await fetchPlaceDetails(placeId)
      if (!details) {
        logs.push(`SKIP ${place.name_en}: Google returned no data`)
        failed++
        continue
      }

      const updateRes = await fetch(
        `${SUPABASE_URL}/rest/v1/places?id=eq.${place.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY!,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify(details),
        }
      )

      if (updateRes.ok) {
        updated++
        logs.push(`OK ${place.name_en}: score=${details.google_score} reviews=${details.google_reviews}`)
      } else {
        const err = await updateRes.text()
        logs.push(`FAIL ${place.name_en}: ${err.slice(0, 100)}`)
        failed++
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      logs.push(`ERROR ${place.name_en}: ${msg}`)
      failed++
    }

    await new Promise(r => setTimeout(r, 100))
  }

  return NextResponse.json({
    success: true,
    total: places.length,
    updated,
    failed,
    logs,
  })
}
