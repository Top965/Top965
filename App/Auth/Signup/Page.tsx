'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#0F0E0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>✅</div>
          <h2 style={{ fontFamily: 'serif', fontSize: '28px', color: '#fff', marginBottom: '12px' }}>Check your email</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', marginBottom: '24px' }}>We sent a confirmation link to <strong style={{ color: '#C8963E' }}>{email}</strong></p>
          <Link href="/auth/login" style={{ color: '#C8963E', textDecoration: 'none', fontWeight: 600 }}>← Back to Sign In</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0F0E0A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: 'serif', fontSize: '28px', fontWeight: 900, color: '#C8963E', marginBottom: '40px' }}>
            Top<span style={{ color: '#fff' }}>965</span>
          </div>
        </Link>
        <h1 style={{ fontFamily: 'serif', fontSize: '36px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Create account</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', marginBottom: '36px' }}>Join Kuwait's #1 review platform</p>

        <form onSubmit={handleSignup}>
          {error && <div style={{ background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.3)', color: '#e74c3c', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '6px' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" required
                style={{ width: '100%', padding: '12px 14px 12px 44px', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '6px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required
                style={{ width: '100%', padding: '12px 14px 12px 44px', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '6px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" required minLength={8}
                style={{ width: '100%', padding: '12px 44px 12px 44px', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)' }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#C8963E', color: '#0F0E0A', border: 'none', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '24px' }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: '#C8963E', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
