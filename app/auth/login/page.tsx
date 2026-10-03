'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else { window.location.href = '/' }
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` }
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0F0E0A', display: 'flex', overflow: 'hidden' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 80px', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 80% at 20% 50%, rgba(200,150,62,0.08), transparent 60%)' }} />
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '400px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 900, color: '#C8963E', marginBottom: '48px' }}>
              Top<span style={{ color: '#fff' }}>965</span>
            </div>
          </Link>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Welcome back</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', marginBottom: '36px' }}>Sign in to your Top965 account</p>
          <button onClick={handleGoogleLogin} style={{ width: '100%', padding: '13px', borderRadius: '12px', border: '1.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '24px' }}>
            🔵 Continue with Google
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>or sign in with email</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          </div>
          <form onSubmit={handleLogin}>
            {error && <div style={{ background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.3)', color: '#e74c3c', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '6px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required style={{ width: '100%', padding: '12px 14px 12px 44px', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none' }} />
              </div>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" required style={{ width: '100%', padding: '12px 44px 12px 44px', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div style={{ textAlign: 'right', marginBottom: '24px' }}>
              <Link href="/auth/forgot" style={{ fontSize: '12px', color: '#C8963E', textDecoration: 'none' }}>Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#C8963E', color: '#0F0E0A', border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '24px' }}>
            Don't have an account?{' '}
            <Link href="/auth/signup" style={{ color: '#C8963E', fontWeight: 600, textDecoration: 'none' }}>Create one free</Link>
          </p>
        </div>
      </div>
      <div style={{ width: '45%', background: 'linear-gradient(135deg, #1A1915, #252319)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', position: 'relative', overflow: 'hidden' }} className="auth-right-panel">
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 30%, rgba(200,150,62,0.1), transparent 70%)' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🇰🇼</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Kuwait's Most<br />Trusted Reviews</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', lineHeight: 1.7, maxWidth: '320px' }}>Join thousands of Kuwaitis discovering and sharing the best restaurants, cafes, and services.</p>
          <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', marginTop: '40px' }}>
            {[['2,400+', 'Places'], ['18K+', 'Reviews'], ['94%', 'Verified']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: 700, color: '#C8963E' }}>{num}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .auth-right-panel { display: none !important; } }`}</style>
    </div>
  )
                                                }
