'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

function StarPicker({ value, onChange, size = 32 }: { value: number, onChange: (v: number) => void, size?: number }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1,2,3,4,5].map(i => (
        <span
          key={i}
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          style={{
            fontSize: size, cursor: 'pointer',
            color: i <= (hover || value) ? '#E8B94F' : '#2a2a2a',
            transition: 'color 0.1s'
          }}>★</span>
      ))}
    </div>
  )
}

const RATING_LABELS: Record<number, string> = {
  1: 'Terrible',
  2: 'Poor',
  3: 'Average',
  4: 'Good',
  5: 'Excellent'
}

export default function ReviewForm({ placeId, placeName, userId }: {
  placeId: string
  placeName: string
  userId: string
}) {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const [overallRating, setOverallRating] = useState(0)
  const [foodRating, setFoodRating] = useState(0)
  const [serviceRating, setServiceRating] = useState(0)
  const [ambianceRating, setAmbianceRating] = useState(0)
  const [valueRating, setValueRating] = useState(0)
  const [wouldReturn, setWouldReturn] = useState<boolean | null>(null)
  const [reviewText, setReviewText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSubRatings, setShowSubRatings] = useState(false)

  const handleSubmit = async () => {
    if (overallRating === 0) {
      setError('Please select an overall rating')
      return
    }
    setLoading(true)
    setError('')

    try {
      const { error: insertError } = await supabase
        .from('reviews')
        .insert({
          place_id: placeId,
          user_id: userId,
          overall_rating: overallRating,
          food_rating: foodRating || null,
          service_rating: serviceRating || null,
          ambiance_rating: ambianceRating || null,
          value_rating: valueRating || null,
          would_return: wouldReturn,
          review_text: reviewText.trim() || null,
          is_published: true,
          is_verified: false,
          is_flagged: false,
          helpful_count: 0,
          reply_count: 0,
          language: 'en',
        })

      if (insertError) {
  if (insertError.code === '23505') {
  setError('You already reviewed this place today. Come back after 24 hours to share your next experience!')
} else {
    setError(insertError.message)
  }
  setLoading(false)
  return
}

      // Refresh the page to show the new review
      router.refresh()
      window.scrollTo(0, 0)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        .review-form { background: #1A1A1A; border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 28px; }
        .form-section { margin-bottom: 28px; }
        .form-label { font-size: 13px; font-weight: 600; color: #F0EDE6; margin-bottom: 10px; display: block; }
        .form-sublabel { font-size: 11px; color: #666; margin-bottom: 10px; display: block; }
        .rating-hint { font-size: 12px; color: #E8B94F; margin-left: 10px; font-weight: 600; }
        .sub-ratings { background: #111; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 16px; margin-top: 12px; }
        .sub-rating-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .sub-rating-row:last-child { border-bottom: none; }
        .sub-rating-label { font-size: 13px; color: #999; }
        .toggle-sub { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #666; padding: 6px 14px; border-radius: 20px; font-size: 12px; cursor: pointer; font-family: inherit; margin-top: 12px; }
        .toggle-sub:hover { border-color: rgba(232,185,79,0.3); color: #E8B94F; }
        .return-btns { display: flex; gap: 10px; }
        .return-btn { padding: 10px 24px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; border: 1px solid rgba(255,255,255,0.1); background: transparent; color: #999; transition: all 0.15s; }
        .return-btn.yes.active { background: rgba(72,199,142,0.15); border-color: rgba(72,199,142,0.4); color: #48c78e; }
        .return-btn.no.active { background: rgba(255,99,99,0.1); border-color: rgba(255,99,99,0.3); color: #ff6363; }
        .review-textarea { width: 100%; padding: 14px 16px; background: #111; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #F0EDE6; font-family: 'DM Sans', sans-serif; font-size: 14px; resize: vertical; min-height: 120px; outline: none; line-height: 1.6; }
        .review-textarea:focus { border-color: #E8B94F; }
        .review-textarea::placeholder { color: #333; }
        .char-count { font-size: 11px; color: #444; text-align: right; margin-top: 6px; }
        .submit-btn { width: 100%; padding: 14px; background: #E8B94F; color: #0A0A0A; border: none; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: inherit; transition: background 0.2s; }
        .submit-btn:hover { background: #C49A2F; }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .error-msg { background: rgba(255,99,99,0.1); border: 1px solid rgba(255,99,99,0.3); color: #ff6363; padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }
      `}</style>

      <div className="review-form">
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, marginBottom: 24, color: '#F0EDE6' }}>
          Rate {placeName}
        </div>

        {/* OVERALL RATING */}
        <div className="form-section">
          <span className="form-label">
            Overall Rating <span style={{ color: '#E8B94F' }}>*</span>
            {overallRating > 0 && (
              <span className="rating-hint">{RATING_LABELS[overallRating]}</span>
            )}
          </span>
          <StarPicker value={overallRating} onChange={setOverallRating} size={40} />
        </div>

        {/* SUB RATINGS */}
        <div className="form-section">
          <button className="toggle-sub" onClick={() => setShowSubRatings(!showSubRatings)}>
            {showSubRatings ? '▲ Hide' : '▼ Add'} detailed ratings (optional)
          </button>

          {showSubRatings && (
            <div className="sub-ratings">
              {[
                { label: '🍽️ Food', value: foodRating, onChange: setFoodRating },
                { label: '👨‍💼 Service', value: serviceRating, onChange: setServiceRating },
                { label: '✨ Ambiance', value: ambianceRating, onChange: setAmbianceRating },
                { label: '💰 Value', value: valueRating, onChange: setValueRating },
              ].map(({ label, value, onChange }) => (
                <div key={label} className="sub-rating-row">
                  <span className="sub-rating-label">{label}</span>
                  <StarPicker value={value} onChange={onChange} size={20} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* WOULD RETURN */}
        <div className="form-section">
          <span className="form-label">Would you return?</span>
          <div className="return-btns">
            <button
              className={`return-btn yes ${wouldReturn === true ? 'active' : ''}`}
              onClick={() => setWouldReturn(wouldReturn === true ? null : true)}>
              👍 Yes
            </button>
            <button
              className={`return-btn no ${wouldReturn === false ? 'active' : ''}`}
              onClick={() => setWouldReturn(wouldReturn === false ? null : false)}>
              👎 No
            </button>
          </div>
        </div>

        {/* REVIEW TEXT */}
        <div className="form-section">
          <span className="form-label">Your Review <span style={{ color: '#666', fontWeight: 400 }}>(optional)</span></span>
          <span className="form-sublabel">Share your experience — food, service, atmosphere, parking...</span>
          <textarea
            className="review-textarea"
            placeholder="The food was amazing, especially the..."
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
            maxLength={1000}
          />
          <div className="char-count">{reviewText.length}/1000</div>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading || overallRating === 0}>
          {loading ? 'Submitting...' : '⭐ Submit Review'}
        </button>
      </div>
    </>
  )
}
