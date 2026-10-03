'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Search, User, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) window.location.href = `/search?q=${searchInput}`
  }

  return (
    <nav style={{
      background: '#0F0E0A', height: '68px', padding: '0 40px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 100,
      borderBottom: '1px solid rgba(200,150,62,0.1)',
    }}>
      <Link href="/" style={{ textDecoration: 'none', fontFamily: 'serif', fontSize: '22px', fontWeight: 900, color: '#C8963E', flexShrink: 0 }}>
        Top<span style={{ color: '#fff' }}>965</span>
      </Link>

      <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '400px', margin: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,150,62,0.2)', borderRadius: '8px', overflow: 'hidden' }}>
          <Search size={14} style={{ margin: '0 10px', color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
          <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search restaurants, cafes..."
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '13px', padding: '9px 0' }} />
        </div>
      </form>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href="/search" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '13px' }}>Explore</Link>
        {user ? (
          <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(200,150,62,0.1)', border: '1px solid rgba(200,150,62,0.3)', color: '#C8963E', padding: '7px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px' }}>
            <User size={14} /> Profile
          </Link>
        ) : (
          <Link href="/auth/login" style={{ background: '#C8963E', color: '#0F0E0A', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
            Sign In
          </Link>
        )}
      </div>
    </nav>
  )
}
