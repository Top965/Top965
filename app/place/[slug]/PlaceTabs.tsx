'use client'

import ReviewForm from './ReviewForm'
import { useState } from 'react'
import Link from 'next/link'

export default function PlaceTabs({ place, reviews }: { place: any, reviews: any[] }) {
  const [activeTab, setActiveTab] = useState('reviews')

  return (
    <>
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}>
          Reviews ({place.review_count || 0})
        </button>
        <button
          className={`tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}>
          Info
        </button>
      </div>

      {activeTab === 'reviews' ? (
        <div>
          <ReviewForm 
  placeId={place.id} 
  placeName={place.name_en} 
  userId="" 
/>

          {reviews.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: '#F0EDE6', marginBottom: 6 }}>
                No reviews yet
              </div>
              <div style={{ fontSize: 13 }}>Be the first Kuwaiti to rate this place</div>
            </div>
          )}

          {reviews.map((review: any) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div>
                  <span className="reviewer">{review.profiles?.username || 'Anonymous'}</span>
                  <span className="review-date" style={{ marginLeft: 8 }}>
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {review.review_text && (
                <div className="review-text">{review.review_text}</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>
          {/* Hours */}
          {place.opening_hours && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: '#F0EDE6' }}>🕐 Opening Hours</div>
              {Object.entries(place.opening_hours).map(([day, hours]: any) => (
                <div key={day} className="hours-row">
                  <span style={{ color: '#666' }}>{day}</span>
                  <span>{hours}</span>
                </div>
              ))}
            </div>
          )}

          {/* Contact */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: '#F0EDE6' }}>📞 Contact</div>
            {place.phone && (
              <div className="contact-row">
                <span>📞</span>
                <a href={`tel:${place.phone}`} className="contact-val">{place.phone}</a>
              </div>
            )}
            {place.website && (
              <div className="contact-row">
                <span>🌐</span>
                <a href={`https://${place.website}`} target="_blank" rel="noopener noreferrer" className="contact-val">{place.website}</a>
              </div>
            )}
            {place.instagram && (
              <div className="contact-row">
                <span>📸</span>
                <a href={`https://instagram.com/${place.instagram}`} target="_blank" rel="noopener noreferrer" className="contact-val">{place.instagram}</a>
              </div>
            )}
            {!place.phone && !place.website && !place.instagram && (
              <div style={{ fontSize: 13, color: '#666' }}>No contact info available yet</div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
