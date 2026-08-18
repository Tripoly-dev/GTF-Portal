'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    full_name: '', agency_name: '', city: '', mobile: '',
    email: '', password: '', confirmPassword: '',
    iata_number: '', how_did_you_hear: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.full_name, agency_name: form.agency_name,
          city: form.city, mobile: form.mobile, email: form.email,
          password: form.password, iata_number: form.iata_number,
          how_did_you_hear: form.how_did_you_hear,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Registration failed'); return }
      setSuccess(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 520, width: '100%', textAlign: 'center', padding: '64px 48px', background: 'white', border: '1px solid var(--rule)' }}>
          <div style={{ width: 64, height: 64, background: 'var(--teal-lt)', border: '2px solid var(--teal)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', fontSize: 28 }}>✓</div>
          <h2 className="font-tight" style={{ fontSize: 28, fontWeight: 800, color: 'var(--ink)', marginBottom: 16, letterSpacing: '-0.02em' }}>Application Submitted!</h2>
          <p style={{ fontSize: 15, color: 'var(--ink-light)', lineHeight: 1.8, marginBottom: 32, fontWeight: 300 }}>
            Thank you for applying to become a GTF Connect partner. Our team will review your application and approve your account within <strong style={{ color: 'var(--ink)' }}>24–48 hours</strong>.
          </p>
          <div style={{ padding: '20px 24px', background: 'var(--teal-lt)', border: '1px solid var(--rule)', marginBottom: 32, textAlign: 'left' }}>
            <div style={{ fontSize: 12, color: 'var(--teal)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 10 }}>WHAT HAPPENS NEXT</div>
            {['Our team reviews your application', 'You receive an approval email at ' + form.email, 'Log in and access all GTF packages'].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--ink-mid)', marginBottom: 8 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--teal)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                {step}
              </div>
            ))}
          </div>
          <Link href="/" className="btn-teal" style={{ display: 'inline-flex', justifyContent: 'center' }}>BACK TO HOME</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

      {/* Left — visual panel */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&q=85"
          alt="GTF" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(7,26,23,0.5) 0%, rgba(7,26,23,0.85) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 52px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="https://static.wixstatic.com/media/226760_114b9cd3484842c7997b35e8f455c25b~mv2.png/v1/crop/x_0,y_7,w_1285,h_1028/fill/w_200,h_160,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/GTF%20Logo_edited.png" alt="GTF Holidays" style={{ height: 32, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
            <span style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: 19, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>GTF <span style={{ fontWeight: 300 }}>Connect</span></span>
          </Link>
          <div>
            <h2 className="font-tight" style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 24 }}>
              Join 100s of<br />travel professionals<br /><span style={{ fontWeight: 300, fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>selling GTF.</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['100% B2B — we never compete with you', 'White label solutions under your brand', '15+ Europe packages ready to sell', 'Africa safari circuits — unique in B2B market', '24/7 operations support for your clients'].map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: 300 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', flexShrink: 0 }} />
                  {p}
                </div>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
            Already have an account? <Link href="/login" style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 600, textDecoration: 'none' }}>Sign in →</Link>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div style={{ background: 'var(--bg)', overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '48px 56px' }}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <div style={{ marginBottom: 40 }}>
            <h1 className="font-tight" style={{ fontSize: 28, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 8 }}>Partner Registration</h1>
            <p style={{ fontSize: 14, color: 'var(--ink-light)', lineHeight: 1.6, fontWeight: 300 }}>
              Register your travel agency to access GTF's full B2B platform. All registrations are reviewed by our team before approval.
            </p>
          </div>

          {error && (
            <div style={{ padding: '12px 16px', background: '#FEE2E2', border: '1px solid #FECACA', color: '#991B1B', fontSize: 13, marginBottom: 24 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* Section: Agency Info */}
            <div style={{ fontSize: 10, color: 'var(--teal)', letterSpacing: '0.14em', fontWeight: 700, marginBottom: 16 }}>AGENCY INFORMATION</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>FULL NAME *</label>
                <input className="input-field" required placeholder="Your full name" value={form.full_name} onChange={set('full_name')} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>AGENCY / COMPANY NAME *</label>
                <input className="input-field" required placeholder="Your travel agency name" value={form.agency_name} onChange={set('agency_name')} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>CITY *</label>
                  <input className="input-field" required placeholder="Mumbai" value={form.city} onChange={set('city')} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>MOBILE *</label>
                  <input className="input-field" required placeholder="+91 98765 43210" value={form.mobile} onChange={set('mobile')} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>IATA / TAFI NUMBER (Optional)</label>
                <input className="input-field" placeholder="Your IATA or TAFI number if applicable" value={form.iata_number} onChange={set('iata_number')} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>HOW DID YOU HEAR ABOUT US?</label>
                <select className="input-field" value={form.how_did_you_hear} onChange={set('how_did_you_hear')}>
                  <option value="">Select an option</option>
                  <option>Travel Exhibition (IITM / TTF / TAAI)</option>
                  <option>Referred by another agent</option>
                  <option>Social Media</option>
                  <option>GTF Sales Team</option>
                  <option>Google Search</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {/* Section: Login Details */}
            <div style={{ fontSize: 10, color: 'var(--teal)', letterSpacing: '0.14em', fontWeight: 700, marginBottom: 16 }}>LOGIN DETAILS</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>BUSINESS EMAIL *</label>
                <input className="input-field" type="email" required placeholder="you@youragency.com" value={form.email} onChange={set('email')} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>PASSWORD *</label>
                <input className="input-field" type="password" required placeholder="Minimum 8 characters" value={form.password} onChange={set('password')} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>CONFIRM PASSWORD *</label>
                <input className="input-field" type="password" required placeholder="Repeat your password" value={form.confirmPassword} onChange={set('confirmPassword')} />
              </div>
            </div>

            <button type="submit" className="btn-teal" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: 14 }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="animate-spin" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', display: 'inline-block' }} />
                  SUBMITTING APPLICATION...
                </span>
              ) : 'SUBMIT APPLICATION →'}
            </button>

            <p style={{ fontSize: 11, color: 'var(--ink-light)', marginTop: 16, lineHeight: 1.6, textAlign: 'center' }}>
              By registering, you confirm this is a B2B travel agency account.<br />
              Already registered? <Link href="/login" style={{ color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}>Sign in here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
