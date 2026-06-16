'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProfilePage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/auth')
      } else {
        setUser(session.user)
      }
      setLoading(false)
    })
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E8B94F', fontFamily: 'sans-serif' }}>
      Loading...
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0A0A0A; color: #F0EDE6; font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
        {/* NAV */}
        <nav style={{ height: 64, background: '#111', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 100 }}>
          <Link href="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 900, color: '#E8B94F', textDecoration: 'none' }}>Top965</Link>
          <Link href="/search" style={{ color: '#666', fontSize: 13, textDecoration: 'none' }}>← Back to Search</Link>
        </nav>

        {/* PROFILE */}
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
          
          {/* Avatar */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1a2744 0%, #E8B94F 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: 32, fontWeight: 900, color: '#0A0A0A',
              fontFamily: 'Playfair Display, serif'
            }}>
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
              {user?.user_metadata?.full_name || 'Top965 User'}
            </div>
            <div style={{ fontSize: 13, color: '#666' }}>{user?.email}</div>
          </div>

          {/* Info cards */}
          <div style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#666', letterSpacing: 1, marginBottom: 16, textTransform: 'uppercase' }}>Account Info</div>
            {[
              { label: 'Email', value: user?.email },
              { label: 'Gender', value: user?.user_metadata?.gender || '—' },
              { label: 'Nationality', value: user?.user_metadata?.nationality || '—' },
              { label: 'Area', value: user?.user_metadata?.area || '—' },
              { label: 'Age Range', value: user?.user_metadata?.age_range || '—' },
              { label: 'Member Since', value: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  : '—' 
},
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 13 }}>
                <span style={{ color: '#666' }}>{label}</span>
                <span style={{ color: '#F0EDE6', fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Reviews count */}
          <div style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24, marginBottom: 24, textAlign: 'center' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, fontWeight: 900, color: '#E8B94F' }}>0</div>
            <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Reviews Written</div>
          </div>

          {/* Sign Out */}
          <button onClick={handleSignOut} style={{
            width: '100%', padding: '13px',
            background: 'transparent',
            border: '1px solid rgba(255,99,99,0.3)',
            borderRadius: 10, color: '#ff6363',
            fontFamily: 'DM Sans, sans-serif', fontSize: 14,
            fontWeight: 600, cursor: 'pointer'
          }}>
            Sign Out
          </button>
        </div>
      </div>
    </>
  )
}
