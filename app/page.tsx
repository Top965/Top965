import Link from 'next/link'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
export default async function HomePage() {
const supabase = createServerComponentClient({ cookies })
const { data: { session } } = await supabase.auth.getSession()
const userId = session?.user?.id || ''
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; }
        body { background: #0A0A0A; font-family: 'DM Sans', sans-serif; }

        .page { min-height: 100vh; display: flex; flex-direction: column; }

        /* NAV */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          height: 64px; padding: 0 40px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .nav-logo {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 900;
          color: #E8B94F; text-decoration: none; letter-spacing: -0.5px;
        }
        .nav-signin {
          padding: 8px 20px;
          border: 1px solid rgba(232,185,79,0.35);
          color: #E8B94F; border-radius: 8px;
          text-decoration: none; font-size: 13px; font-weight: 500;
          transition: background 0.2s, border-color 0.2s;
        }
        .nav-signin:hover { background: rgba(232,185,79,0.08); border-color: rgba(232,185,79,0.6); }

        /* HERO */
        .hero {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; padding: 40px;
          min-height: 100vh;
          position: relative; overflow: hidden;
        }

        /* Ambient glow */
        .hero::before {
          content: '';
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 600px; height: 400px;
          background: radial-gradient(ellipse, rgba(232,185,79,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Gold top line */
        .hero-eyebrow {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 32px;
          color: #E8B94F; font-size: 11px; font-weight: 500;
          letter-spacing: 3px; text-transform: uppercase;
        }
        .hero-eyebrow::before, .hero-eyebrow::after {
          content: '';
          width: 40px; height: 1px;
          background: linear-gradient(90deg, transparent, #E8B94F);
        }
        .hero-eyebrow::after { background: linear-gradient(90deg, #E8B94F, transparent); }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(42px, 7vw, 88px);
          font-weight: 900; line-height: 1.05;
          color: #F0EDE6; margin-bottom: 24px;
          letter-spacing: -2px;
        }
        .hero-title em {
          color: #E8B94F; font-style: italic;
        }

        .hero-sub {
          font-size: clamp(14px, 1.5vw, 17px);
          color: rgba(240,237,230,0.4);
          font-weight: 300; letter-spacing: 0.3px;
          margin-bottom: 52px; max-width: 380px;
        }

        .hero-btn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 18px 44px;
          background: #E8B94F; color: #0A0A0A;
          border-radius: 50px; text-decoration: none;
          font-size: 15px; font-weight: 700;
          letter-spacing: 0.3px;
          transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
          box-shadow: 0 0 0 0 rgba(232,185,79,0);
        }
        .hero-btn:hover {
          transform: translateY(-2px);
          background: #F0C55A;
          box-shadow: 0 8px 40px rgba(232,185,79,0.25);
        }
        .hero-btn-arrow {
          font-size: 18px; transition: transform 0.2s;
        }
        .hero-btn:hover .hero-btn-arrow { transform: translateX(4px); }

        /* Stats row */
        .hero-stats {
          position: absolute; bottom: 48px; left: 50%; transform: translateX(-50%);
          display: flex; gap: 48px; align-items: center;
        }
        .stat { text-align: center; }
        .stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700; color: #E8B94F;
        }
        .stat-label { font-size: 11px; color: rgba(240,237,230,0.3); letter-spacing: 1px; text-transform: uppercase; margin-top: 2px; }
        .stat-divider { width: 1px; height: 36px; background: rgba(255,255,255,0.07); }

        /* FOOTER */
        .footer {
          text-align: center; padding: 24px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .footer-text { font-size: 11px; color: rgba(240,237,230,0.2); letter-spacing: 1px; }

        @media (max-width: 600px) {
          .nav { padding: 0 20px; }
          .hero { padding: 80px 24px 120px; }
          .hero-stats { gap: 28px; bottom: 32px; }
          .stat-num { font-size: 18px; }
        }
      `}</style>

      <div className="page">
        <nav className="nav">
          <Link href="/" className="nav-logo">Top965</Link>
          {userId ? (
  <Link href="/profile" className="nav-signin" style={{ borderColor: 'rgba(232,185,79,0.35)', color: '#E8B94F' }}>
    My Profile
  </Link>
) : (
  <Link href="/auth" className="nav-signin">Sign In</Link>
)}
        </nav>

        <section className="hero">
          <div className="hero-eyebrow">Kuwait's Discovery Platform</div>

          <h1 className="hero-title">
            Discover the<br /><em>Best</em> of Kuwait
          </h1>

          <p className="hero-sub">
            Real reviews from real people who actually visited.
          </p>

          <Link href="/search" className="hero-btn">
            Explore Kuwait
            <span className="hero-btn-arrow">→</span>
          </Link>

          <div className="hero-stats">
            <div className="stat">
              <div className="stat-num">500+</div>
              <div className="stat-label">Places</div>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <div className="stat-num">Kuwait</div>
              <div className="stat-label">Only</div>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <div className="stat-num">Real</div>
              <div className="stat-label">Reviews</div>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-text">© 2026 TOP965 · MADE IN KUWAIT</div>
        </footer>
      </div>
    </>
  )
}
