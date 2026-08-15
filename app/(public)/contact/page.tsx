'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', agency: '', email: '', mobile: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await new Promise(r => setTimeout(r, 800))
    setSent(true)
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '80vh' }}>

      {/* Header */}
      <div style={{ background: 'var(--paper)', borderBottom: '1px solid var(--rule)', padding: '64px 56px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ fontSize: 11, color: 'var(--teal)', letterSpacing: '0.14em', fontWeight: 600, marginBottom: 16 }}>GET IN TOUCH</div>
          <h1 className="font-tight" style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.03em', lineHeight: 1 }}>
            Let's talk about<br /><span style={{ fontWeight: 300, fontStyle: 'italic', color: 'var(--teal)' }}>your travel business.</span>
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80 }}>

          {/* Contact info */}
          <div>
            <div style={{ marginBottom: 48 }}>
              <div style={{ fontSize: 11, color: 'var(--teal)', letterSpacing: '0.14em', fontWeight: 600, marginBottom: 20 }}>OFFICE</div>
              <p style={{ fontSize: 15, color: 'var(--ink-mid)', lineHeight: 1.9, fontWeight: 300 }}>
                Office No.102, Mahant Chambers<br />
                Plot A-315, Road No. 34<br />
                Wagle Industrial Estate<br />
                Thane West, Maharashtra 400604
              </p>
            </div>

            <div style={{ marginBottom: 48 }}>
              <div style={{ fontSize: 11, color: 'var(--teal)', letterSpacing: '0.14em', fontWeight: 600, marginBottom: 20 }}>PHONE</div>
              {['+91 89288 72400', '+91 93727 33424', '+91 93727 33428'].map(p => (
                <div key={p} style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 500, marginBottom: 8 }}>{p}</div>
              ))}
            </div>

            <div style={{ marginBottom: 48 }}>
              <div style={{ fontSize: 11, color: 'var(--teal)', letterSpacing: '0.14em', fontWeight: 600, marginBottom: 20 }}>EMAIL</div>
              {['sales@gtfholidays.com', 'fit@gtfholidays.com'].map(e => (
                <div key={e} style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 500, marginBottom: 8 }}>{e}</div>
              ))}
            </div>

            {/* Quick links */}
            <div style={{ padding: '28px 32px', background: 'var(--teal-lt)', border: '1px solid var(--rule)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 16 }}>Quick Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <a href="https://wa.me/918928872400" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: 'var(--teal)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                  📱 WhatsApp us directly
                </a>
                <Link href="/register" style={{ fontSize: 14, color: 'var(--teal)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                  ✓ Register as B2B partner
                </Link>
                <Link href="/faq" style={{ fontSize: 14, color: 'var(--teal)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                  ? Browse FAQ
                </Link>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '80px 40px', background: 'white', border: '1px solid var(--rule)' }}>
                <div style={{ fontSize: 48, marginBottom: 20 }}>✓</div>
                <h3 className="font-tight" style={{ fontSize: 24, fontWeight: 700, color: 'var(--teal)', marginBottom: 12 }}>Message sent!</h3>
                <p style={{ fontSize: 15, color: 'var(--ink-light)', lineHeight: 1.7 }}>Our team will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>FULL NAME *</label>
                    <input className="input-field" required placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>AGENCY NAME *</label>
                    <input className="input-field" required placeholder="Agency or company" value={form.agency} onChange={e => setForm(f => ({ ...f, agency: e.target.value }))} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>EMAIL *</label>
                    <input className="input-field" type="email" required placeholder="you@agency.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>MOBILE</label>
                    <input className="input-field" placeholder="+91 98765 43210" value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mid)', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>MESSAGE *</label>
                  <textarea className="input-field" required rows={5} placeholder="Tell us about your agency and what you're looking for..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} style={{ resize: 'vertical' }} />
                </div>
                <button type="submit" className="btn-teal" style={{ alignSelf: 'flex-start' }}>
                  SEND MESSAGE →
                </button>
                <p style={{ fontSize: 12, color: 'var(--ink-light)' }}>
                  Or register directly as a B2B partner — <Link href="/register" style={{ color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}>Click here →</Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
