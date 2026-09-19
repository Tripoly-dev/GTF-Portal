'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Logo from '@/components/ui/Logo'

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
      else router.push('/dashboard/packages')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rg-stack" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

      {/* Left panel */}
      <div className="rg-hide-m" style={{ position: 'relative', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=85"
          alt="GTF" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(7,26,23,0.55) 0%, rgba(7,26,23,0.88) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px clamp(18px, 5vw, 52px)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <Logo tone="light" size={28} />
          </Link>
          <div>
            <h2 className="font-display" style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 400, color: '#fff', lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 20 }}>
              Welcome back<br />to GTF Connect.
            </h2>
            <p style={{ fontSize: 15, color: 'var(--on-dark)', lineHeight: 1.7, fontWeight: 400, maxWidth: 360 }}>
              Access your partner dashboard, browse packages, download itineraries and manage your business with GTF.
            </p>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.62)' }}>
            Not yet a partner? <Link href="/register" style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 600, textDecoration: 'none' }}>Register here →</Link>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div style={{ background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px clamp(18px, 5vw, 56px)' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ marginBottom: 40 }}>
            <h1 className="font-display" style={{ fontSize: 28, fontWeight: 400, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 8 }}>Agent Login</h1>
            <p style={{ fontSize: 14, color: 'var(--ink-light)', fontWeight: 400 }}>Sign in to your GTF Partner account</p>
          </div>

          {error && (
            <div style={{ padding: '12px 16px', background: 'var(--danger-bg)', border: '1px solid var(--danger-bg)', color: 'var(--danger)', fontSize: 13, marginBottom: 24 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-mid)', display: 'block', marginBottom: 8 }}>Email address</label>
              <input className="input-field" type="email" required placeholder="you@youragency.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-mid)', display: 'block', marginBottom: 8 }}>Password</label>
              <input className="input-field" type="password" required placeholder="Your password"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>

            <button type="submit" className="btn-teal" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: 14 }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="animate-spin" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', display: 'inline-block' }} />
                  Signing in...
                </span>
              ) : 'SIGN IN →'}
            </button>
          </form>

          <p style={{ fontSize: 12, color: 'var(--ink-light)', marginTop: 20, textAlign: 'center' }}>
            Don't have an account? <Link href="/register" style={{ color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}>Register as partner →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
