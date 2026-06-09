'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

type Mode = 'signin' | 'signup' | 'forgot' | 'otp' | 'signup2'

const KUWAIT_AREAS = [
  'Salmiya', 'Hawalli', 'Rumaithiya', 'Bayan', 'Mishref',
  'Kuwait City', 'Sharq', 'Qibla', 'Dasman',
  'Jabriya', 'Surra', 'Salwa',
  'Mahboula', 'Fintas', 'Mangaf', 'Abu Halifa', 'Fahaheel',
  'Ahmadi', 'Riqqa', 'Sabahiya',
  'Shuwaikh', 'Rai', 'Ardiya', 'Firdous',
  'Sabah Al Salem', 'Mubarak Al Kabeer', 'Qurain', 'Qusour',
  'Farwaniya', 'Khaitan', 'Omariya', 'Ashbeliah',
  'Jahra', 'Sulaibikhat', 'Doha',
  'Egaila', 'Messila', 'Zahra',
  'Other',
]

const NATIONALITIES = [
  'Kuwaiti', 'Saudi', 'Emirati', 'Qatari', 'Bahraini', 'Omani',
  'Egyptian', 'Jordanian', 'Lebanese', 'Syrian', 'Palestinian', 'Iraqi', 'Yemeni', 'Sudanese', 'Moroccan', 'Tunisian', 'Libyan', 'Algerian',
  'Indian', 'Pakistani', 'Bangladeshi', 'Sri Lankan', 'Nepali',
  'Filipino', 'Indonesian',
  'British', 'American', 'Canadian', 'Australian', 'French', 'German',
  'Iranian', 'Turkish', 'Ethiopian', 'Other',
]

const AGE_RANGES = ['Under 18', '18–24', '25–34', '35–44', '45–54', '55+']

export default function AuthPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const [mode, setMode] = useState<Mode>('signin')
  const [method, setMethod] = useState<'email' | 'phone'>('email')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)

  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [otp, setOtp] = useState('')

  const [gender, setGender] = useState('')
  const [nationality, setNationality] = useState('')
  const [area, setArea] = useState('')
  const [ageRange, setAgeRange] = useState('')
  const [phoneOptional, setPhoneOptional] = useState('')

  const show = (text: string, type: 'error' | 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleEmailSignIn = async () => {
    if (!email || !password) return show('Please fill in all fields.', 'error')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return show(error.message, 'error')
    router.push('/')
  }

  const handleStep1 = () => {
    if (!fullName.trim()) return show('Please enter your name.', 'error')
    if (!email || !password) return show('Please fill in all fields.', 'error')
    if (password !== confirmPassword) return show('Passwords do not match.', 'error')
    if (password.length < 6) return show('Password must be at least 6 characters.', 'error')
    setMessage(null)
    setMode('signup2')
  }

  const handleStep2 = async (skip = false) => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          gender: skip ? null : gender || null,
          nationality: skip ? null : nationality || null,
          area: skip ? null : area || null,
          age_range: skip ? null : ageRange || null,
          phone: skip ? null : phoneOptional || null,
        },
      },
    })
    setLoading(false)
    if (error) return show(error.message, 'error')
    show('Account created! Check your email to confirm.', 'success')
    setTimeout(() => router.push('/'), 2000)
  }

  const handleSendOtp = async () => {
    if (!phone) return show('Please enter your phone number.', 'error')
    const formatted = phone.startsWith('+') ? phone : `+965${phone}`
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ phone: formatted })
    setLoading(false)
    if (error) return show(error.message, 'error')
    show('OTP sent!', 'success')
    setMode('otp')
  }

  const handleVerifyOtp = async () => {
    if (!otp) return show('Please enter the OTP.', 'error')
    const formatted = phone.startsWith('+') ? phone : `+965${phone}`
    setLoading(true)
    const { error } = await supabase.auth.verifyOtp({ phone: formatted, token: otp, type: 'sms' })
    setLoading(false)
    if (error) return show(error.message, 'error')
    router.push('/')
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    setLoading(false)
    if (error) show(error.message, 'error')
  }

  const handleForgotPassword = async () => {
    if (!email) return show('Please enter your email.', 'error')
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`,
    })
    setLoading(false)
    if (error) return show(error.message, 'error')
    show('Reset link sent to your email!', 'success')
  }

  const step2Complete = gender && nationality && area && ageRange

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --gold: #E8B94F; --gold-dark: #C49A2F; --gold-dim: rgba(232,185,79,0.12);
          --dark: #0D0D0D; --dark2: #131313; --dark3: #1C1C1C;
          --border: rgba(255,255,255,0.07); --border-gold: rgba(232,185,79,0.2);
          --text: #F0EDE6; --muted: #777; --muted2: #3a3a3a;
        }
        body { background: var(--dark); }
        .auth-root { min-height: 100vh; display: flex; font-family: 'DM Sans', sans-serif; color: var(--text); background: var(--dark); position: relative; overflow: hidden; }
        .glow { position: fixed; top: -300px; left: 50%; transform: translateX(-50%); width: 800px; height: 800px; background: radial-gradient(circle, rgba(232,185,79,0.06) 0%, transparent 65%); pointer-events: none; z-index: 0; }
        .left { display: none; width: 44%; background: var(--dark2); border-right: 1px solid var(--border); padding: 52px 56px; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden; }
        @media (min-width: 900px) { .left { display: flex; } }
        .left-glow { position: absolute; bottom: -120px; right: -120px; width: 450px; height: 450px; background: radial-gradient(circle, rgba(232,185,79,0.05) 0%, transparent 60%); pointer-events: none; }
        .logo { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 900; color: var(--gold); }
        .logo-sub { font-size: 11px; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; margin-top: 3px; }
        .left-headline { font-family: 'Playfair Display', serif; font-size: clamp(30px, 2.8vw, 46px); font-weight: 900; line-height: 1.15; }
        .left-headline em { color: var(--gold); font-style: normal; }
        .left-body { font-size: 14px; color: var(--muted); line-height: 1.7; margin-top: 14px; max-width: 320px; }
        .stats { display: flex; gap: 28px; margin-top: 36px; }
        .stat-num { font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 700; color: var(--gold); }
        .stat-lbl { font-size: 11px; color: var(--muted); letter-spacing: 0.5px; margin-top: 2px; }
        .insight-box { margin-top: 32px; padding: 16px 20px; background: rgba(232,185,79,0.05); border: 1px solid var(--border-gold); border-radius: 12px; font-size: 13px; color: var(--muted); line-height: 1.6; }
        .insight-box strong { color: var(--gold); font-weight: 600; }
        .left-footer { font-size: 11px; color: var(--muted2); }
        .right { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 24px; position: relative; z-index: 1; }
        .card { width: 100%; max-width: 430px; animation: up 0.45s ease both; }
        @keyframes up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .mobile-logo { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 900; color: var(--gold); margin-bottom: 28px; display: block; }
        @media (min-width: 900px) { .mobile-logo { display: none; } }
        .steps { display: flex; align-items: center; gap: 8px; margin-bottom: 24px; }
        .step-dot { width: 28px; height: 4px; border-radius: 2px; background: var(--dark3); transition: background 0.3s; }
        .step-dot.active { background: var(--gold); }
        .step-label { font-size: 11px; color: var(--muted); margin-left: 4px; letter-spacing: 0.5px; }
        .title { font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 900; line-height: 1.1; }
        .subtitle { font-size: 13px; color: var(--muted); margin-top: 5px; margin-bottom: 24px; }
        .tabs { display: flex; background: var(--dark3); border-radius: 10px; padding: 3px; margin-bottom: 20px; border: 1px solid var(--border); }
        .tab { flex: 1; padding: 9px; border: none; background: transparent; color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
        .tab.active { background: var(--gold); color: var(--dark); font-weight: 700; }
        .field { margin-bottom: 12px; }
        .field label { display: block; font-size: 11px; font-weight: 600; color: var(--muted); margin-bottom: 5px; letter-spacing: 0.8px; text-transform: uppercase; }
        .field input, .field select { width: 100%; padding: 12px 15px; background: var(--dark3); border: 1px solid var(--border); border-radius: 10px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s; appearance: none; }
        .field select { cursor: pointer; }
        .field select option { background: var(--dark3); color: var(--text); }
        .field input:focus, .field select:focus { border-color: var(--gold); }
        .field input::placeholder { color: var(--muted2); }
        .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .phone-row { display: flex; gap: 8px; }
        .phone-prefix { padding: 12px 13px; background: var(--dark3); border: 1px solid var(--border); border-radius: 10px; color: var(--gold); font-size: 13px; font-weight: 600; white-space: nowrap; font-family: 'DM Sans', sans-serif; }
        .gender-row { display: flex; gap: 8px; margin-bottom: 12px; }
        .gender-pill { flex: 1; padding: 11px; background: var(--dark3); border: 1px solid var(--border); border-radius: 10px; color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; text-align: center; transition: all 0.2s; }
        .gender-pill.active { border-color: var(--gold); color: var(--gold); background: var(--gold-dim); }
        .age-grid { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 12px; }
        .age-pill { padding: 7px 14px; background: var(--dark3); border: 1px solid var(--border); border-radius: 20px; color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .age-pill.active { border-color: var(--gold); color: var(--gold); background: var(--gold-dim); }
        .field-label-inline { font-size: 11px; font-weight: 600; color: var(--muted); letter-spacing: 0.8px; text-transform: uppercase; display: block; margin-bottom: 6px; }
        .optional-section { padding: 14px 16px; background: rgba(232,185,79,0.04); border: 1px solid var(--border-gold); border-radius: 10px; margin-bottom: 12px; }
        .optional-label { font-size: 12px; color: var(--gold); font-weight: 600; margin-bottom: 4px; }
        .optional-hint { font-size: 11px; color: var(--muted); margin-bottom: 10px; line-height: 1.5; }
        .btn { width: 100%; padding: 13px; background: var(--gold); color: var(--dark); border: none; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; margin-top: 4px; transition: background 0.2s, transform 0.1s; letter-spacing: 0.3px; }
        .btn:hover:not(:disabled) { background: var(--gold-dark); }
        .btn:active:not(:disabled) { transform: scale(0.99); }
        .btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .btn-outline { width: 100%; padding: 12px; background: transparent; border: 1px solid var(--border); border-radius: 10px; color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; margin-top: 8px; transition: all 0.2s; }
        .btn-outline:hover { border-color: var(--border-gold); color: var(--text); }
        .btn-google { width: 100%; padding: 12px; background: transparent; border: 1px solid var(--border); border-radius: 10px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 9px; transition: all 0.2s; }
        .btn-google:hover { border-color: var(--border-gold); background: rgba(232,185,79,0.04); }
        .divider { display: flex; align-items: center; gap: 10px; margin: 16px 0; }
        .div-line { flex: 1; height: 1px; background: var(--border); }
        .div-text { font-size: 11px; color: var(--muted2); }
        .msg { padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 12px; font-weight: 500; }
        .msg.error { background: rgba(220,50,50,0.1); color: #f87171; border: 1px solid rgba(220,50,50,0.2); }
        .msg.success { background: rgba(232,185,79,0.08); color: var(--gold); border: 1px solid var(--border-gold); }
        .footer { margin-top: 20px; text-align: center; font-size: 13px; color: var(--muted); }
        .link-btn { background: none; border: none; color: var(--gold); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; padding: 0; }
        .link-btn:hover { text-decoration: underline; }
        .row-links { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; font-size: 13px; color: var(--muted); }
        .back-btn { display: flex; align-items: center; gap: 5px; background: none; border: none; color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; padding: 0; margin-bottom: 20px; transition: color 0.2s; }
        .back-btn:hover { color: var(--gold); }
      `}</style>

      <div className="auth-root">
        <div className="glow" />

        {/* LEFT PANEL */}
        <div className="left">
          <div className="left-glow" />
          <div>
            <div className="logo">Top965</div>
            <div className="logo-sub">Kuwait's #1 Rating Platform</div>
          </div>
          <div>
            <h2 className="left-headline">Know Kuwait<br />Better Than<br /><em>Anyone.</em></h2>
            <p className="left-body">Real reviews from real people across every area, nationality, and background in Kuwait.</p>
            <div className="stats">
              <div><div className="stat-num">5K+</div><div className="stat-lbl">Places</div></div>
              <div><div className="stat-num">31</div><div className="stat-lbl">Categories</div></div>
              <div><div className="stat-num">100%</div><div className="stat-lbl">Kuwait</div></div>
            </div>
            <div className="insight-box">
              <strong>For Businesses:</strong> Understand who your customers really are — age, nationality, area — and make data-driven decisions.
            </div>
          </div>
          <div className="left-footer">© 2025 Top965 · Made with love in Kuwait</div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right">
          <div className="card">
            <span className="mobile-logo">Top965</span>

            {/* SIGN IN */}
            {mode === 'signin' && <>
              <h1 className="title">Welcome Back</h1>
              <p className="subtitle">Sign in to your Top965 account</p>
              {message && <div className={`msg ${message.type}`}>{message.text}</div>}
              <div className="tabs">
                <button className={`tab ${method === 'email' ? 'active' : ''}`} onClick={() => setMethod('email')}>📧 Email</button>
                <button className={`tab ${method === 'phone' ? 'active' : ''}`} onClick={() => setMethod('phone')}>📱 Phone</button>
              </div>
              {method === 'email' ? <>
                <div className="field"><label>Email</label><input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
                <div className="field"><label>Password</label><input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} /></div>
                <button className="btn" onClick={handleEmailSignIn} disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
                <div className="divider"><div className="div-line" /><span className="div-text">or</span><div className="div-line" /></div>
                <button className="btn-google" onClick={handleGoogleSignIn} disabled={loading}>
                  <svg width="17" height="17" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Continue with Google
                </button>
              </> : <>
                <div className="field"><label>Phone Number</label>
                  <div className="phone-row">
                    <span className="phone-prefix">🇰🇼 +965</span>
                    <input type="tel" placeholder="9XXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} style={{flex:1}} />
                  </div>
                </div>
                <button className="btn" onClick={handleSendOtp} disabled={loading}>{loading ? 'Sending...' : 'Send OTP'}</button>
              </>}
              <div className="row-links">
                <span>No account? <button className="link-btn" onClick={() => setMode('signup')}>Sign Up</button></span>
                <button className="link-btn" onClick={() => setMode('forgot')}>Forgot password?</button>
              </div>
            </>}

            {/* OTP */}
            {mode === 'otp' && <>
              <button className="back-btn" onClick={() => setMode('signin')}>← Back</button>
              <h1 className="title">Enter Code</h1>
              <p className="subtitle">6-digit code sent to +965{phone}</p>
              {message && <div className={`msg ${message.type}`}>{message.text}</div>}
              <div className="field"><label>OTP Code</label><input type="text" placeholder="123456" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} /></div>
              <button className="btn" onClick={handleVerifyOtp} disabled={loading}>{loading ? 'Verifying...' : 'Verify & Sign In'}</button>
              <div className="footer"><button className="link-btn" onClick={handleSendOtp}>Resend code</button></div>
            </>}

            {/* FORGOT */}
            {mode === 'forgot' && <>
              <button className="back-btn" onClick={() => setMode('signin')}>← Back</button>
              <h1 className="title">Reset Password</h1>
              <p className="subtitle">We'll send a reset link to your email</p>
              {message && <div className={`msg ${message.type}`}>{message.text}</div>}
              <div className="field"><label>Email Address</label><input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
              <button className="btn" onClick={handleForgotPassword} disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
            </>}

            {/* SIGNUP STEP 1 */}
            {mode === 'signup' && <>
              <div className="steps">
                <div className="step-dot active" /><div className="step-dot" />
                <span className="step-label">STEP 1 OF 2</span>
              </div>
              <h1 className="title">Create Account</h1>
              <p className="subtitle">Start with your basic info</p>
              {message && <div className={`msg ${message.type}`}>{message.text}</div>}
              <div className="field"><label>Full Name</label><input type="text" placeholder="Your name" value={fullName} onChange={e => setFullName(e.target.value)} /></div>
              <div className="field"><label>Email Address</label><input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
              <div className="field"><label>Password</label><input type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} /></div>
              <div className="field"><label>Confirm Password</label><input type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} /></div>
              <button className="btn" onClick={handleStep1}>Continue →</button>
              <div className="footer" style={{marginTop:16}}>Already have an account? <button className="link-btn" onClick={() => setMode('signin')}>Sign In</button></div>
            </>}

            {/* SIGNUP STEP 2 */}
            {mode === 'signup2' && <>
              <div className="steps">
                <div className="step-dot active" /><div className="step-dot active" />
                <span className="step-label">STEP 2 OF 2</span>
              </div>
              <h1 className="title">About You</h1>
              <p className="subtitle">Help us personalise your experience</p>
              {message && <div className={`msg ${message.type}`}>{message.text}</div>}

              <span className="field-label-inline">Gender</span>
              <div className="gender-row">
                {['Male', 'Female'].map(g => (
                  <button key={g} className={`gender-pill ${gender === g ? 'active' : ''}`} onClick={() => setGender(g)}>{g}</button>
                ))}
              </div>

              <div className="row2">
                <div className="field"><label>Nationality</label>
                  <select value={nationality} onChange={e => setNationality(e.target.value)}>
                    <option value="">Select...</option>
                    {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="field"><label>Area in Kuwait</label>
                  <select value={area} onChange={e => setArea(e.target.value)}>
                    <option value="">Select...</option>
                    {KUWAIT_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>

              <span className="field-label-inline">Age Range</span>
              <div className="age-grid">
                {AGE_RANGES.map(a => (
                  <button key={a} className={`age-pill ${ageRange === a ? 'active' : ''}`} onClick={() => setAgeRange(a)}>{a}</button>
                ))}
              </div>

              <div className="optional-section">
                <div className="optional-label">📱 Add Phone (Optional)</div>
                <div className="optional-hint">Get exclusive Kuwait deals and faster support</div>
                <div className="phone-row">
                  <span className="phone-prefix">🇰🇼 +965</span>
                  <input type="tel" placeholder="9XXXXXXX" value={phoneOptional} onChange={e => setPhoneOptional(e.target.value)}
                    style={{flex:1, padding:'10px 13px', background:'var(--dark3)', border:'1px solid var(--border)', borderRadius:8, color:'var(--text)', fontFamily:'DM Sans,sans-serif', fontSize:14, outline:'none'}} />
                </div>
              </div>

              <button className="btn" onClick={() => handleStep2(false)} disabled={loading || !step2Complete}>
                {loading ? 'Creating account...' : 'Create Account 🎉'}
              </button>
            </>}

          </div>
        </div>
      </div>
    </>
  )
}

