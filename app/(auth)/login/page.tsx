'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Login failed'); return }
      if (data.role === 'admin') router.push('/admin')
      else router.push('/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

      {/* Left panel */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=85"
          alt="GTF" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(7,26,23,0.55) 0%, rgba(7,26,23,0.88) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 52px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="https://static.wixstatic.com/media/226760_114b9cd3484842c7997b35e8f455c25b~mv2.png/v1/crop/x_0,y_7,w_1285,h_1028/fill/w_200,h_160,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/GTF%20Logo_edited.png" alt="GTF Holidays" style={{ height: 32, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
            <span style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: 18, fontWeight: 700, color: '#fff' }}>GTF <span style={{ fontWeight: 300 }}>Portal</span></span>
          </Link>
          <div>
            <h2 className="font-tight" style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 20 }}>
              Welcome back<br />to GTF Portal.
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, fontWeight: 300, maxWidth: 360 }}>
              Access your partner dashboard, browse packages, download itineraries and manage your business with GTF.
            </p>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
            Not yet a partner? <Link href="/register" style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 600, textDecoration: 'none' }}>Register here →</Link>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div style={{ background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 56px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ marginBottom: 40 }}>
            <h1 className="font-tight" style={{ fontSize: 28, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 8 }}>Agent Login</h1>
            <p style={{ fontSize: 14, color: 'var(--ink-light)', fontWeight: 300 }}>Sign in to your GTF Partner account</p>
          </div>

          {error && (
            <div style={{ padding: '12px 16px', background: '#FEE2E2', border: '1px solid #FECACA', color: '#991B1B', fontSize: 13, marginBottom: 24 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>EMAIL ADDRESS</label>
              <input className="input-field" type="email" required placeholder="you@youragency.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>PASSWORD</label>
              <input className="input-field" type="password" required placeholder="Your password"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>

            <button type="submit" className="btn-teal" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: 14 }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="animate-spin" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', display: 'inline-block' }} />
                  SIGNING IN...
                </span>
              ) : 'SIGN IN →'}
            </button>
          </form>

          <div style={{ marginTop: 32, padding: '20px 24px', background: 'var(--paper)', border: '1px solid var(--rule)' }}>
            <div style={{ fontSize: 11, color: 'var(--ink-light)', marginBottom: 8, fontWeight: 600, letterSpacing: '0.06em' }}>DEMO CREDENTIALS</div>
            <div style={{ fontSize: 12, color: 'var(--ink-mid)', lineHeight: 1.8 }}>
              <div>Admin: <strong>it@gtfholidays.com</strong></div>
              <div>Password: <strong>GTFAdmin@2025</strong></div>
            </div>
          </div>

          <p style={{ fontSize: 12, color: 'var(--ink-light)', marginTop: 20, textAlign: 'center' }}>
            Don't have an account? <Link href="/register" style={{ color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}>Register as partner →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
