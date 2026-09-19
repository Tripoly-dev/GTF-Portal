'use client'
import { useState } from 'react'
import WhatsAppIcon from '@/components/icons/WhatsAppIcon'
import { FAQS } from '@/data/packages'

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0)
  const categories = [...new Set(FAQS.map(f => f.cat))]
  const [activecat, setActiveCat] = useState('General')

  const filtered = FAQS.filter(f => f.cat === activecat)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '80vh' }}>

      {/* Header */}
      <div style={{ background: 'var(--ink)', padding: 'clamp(43px, 9vw, 72px) clamp(18px, 5vw, 56px) clamp(38px, 9vw, 64px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.62)', fontWeight: 600, marginBottom: 16 }}>Help & FAQ</div>
          <h1 className="font-display" style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 400, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 16 }}>
            Frequently Asked<br /><span style={{ fontWeight: 400, fontStyle: 'italic', color: 'var(--teal-lt)' }}>Questions</span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.62)', maxWidth: 500, lineHeight: 1.7, fontWeight: 400 }}>
            Everything you need to know about GTF Holidays, our products, and how to partner with us.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(38px, 9vw, 64px) clamp(18px, 5vw, 56px)' }}>
        <div className="rg-stack" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 56 }}>

          {/* Category sidebar */}
          <div>
            <div style={{ fontSize: 13, color: 'var(--ink-light)', fontWeight: 600, marginBottom: 16 }}>Categories</div>
            {categories.map(cat => (
              <button key={cat} onClick={() => { setActiveCat(cat); setOpen(null) }} style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '10px 14px', marginBottom: 4, border: 'none', cursor: 'pointer',
                background: activecat === cat ? 'var(--teal-lt)' : 'transparent',
                color: activecat === cat ? 'var(--teal)' : 'var(--ink-light)',
                fontSize: 13, fontWeight: activecat === cat ? 600 : 400,
                borderLeft: activecat === cat ? '2px solid var(--teal)' : '2px solid transparent',
                transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease, opacity 0.2s ease', fontFamily: 'var(--font-sans)',
              }}>{cat}</button>
            ))}
          </div>

          {/* FAQ accordion */}
          <div>
            <div style={{ fontSize: 14, color: 'var(--ink-light)', marginBottom: 32 }}>
              {filtered.length} question{filtered.length !== 1 ? 's' : ''} in <strong style={{ color: 'var(--teal)' }}>{activecat}</strong>
            </div>
            {filtered.map((faq, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--rule)', marginBottom: 0 }}>
                <button onClick={() => setOpen(open === i ? null : i)} style={{
                  width: '100%', textAlign: 'left', background: 'none', border: 'none',
                  padding: '22px 0', cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', gap: 20, fontFamily: 'var(--font-sans)',
                }}>
                  <span className="font-tight" style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
                    {faq.q}
                  </span>
                  <span style={{
                    fontSize: 18, color: open === i ? 'var(--teal)' : 'var(--ink-light)',
                    flexShrink: 0, marginTop: 2, transition: 'transform 0.2s, color 0.2s',
                    display: 'inline-block', transform: open === i ? 'rotate(45deg)' : 'none',
                  }}>+</span>
                </button>
                {open === i && (
                  <div className="animate-fade-in" style={{ paddingBottom: 24 }}>
                    <p style={{ fontSize: 15, color: 'var(--ink-mid)', lineHeight: 1.8, fontWeight: 400 }}>
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA bottom */}
        <div style={{ marginTop: 80, background: 'var(--teal-lt)', border: '1px solid var(--rule)', padding: '40px clamp(18px, 5vw, 48px)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div>
            <h3 className="font-display" style={{ fontSize: 22, fontWeight: 500, color: 'var(--ink)', marginBottom: 8, letterSpacing: '-0.01em' }}>Still have questions?</h3>
            <p style={{ fontSize: 14, color: 'var(--ink-light)', fontWeight: 400 }}>Our team is available to walk you through our products and help you get started.</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <a href="https://wa.me/918928872400" target="_blank" rel="noopener noreferrer" className="btn-teal" style={{ whiteSpace: 'nowrap' }}><WhatsAppIcon size={16} color="#fff" /> WhatsApp Us</a>
            <a href="mailto:sales@gtfholidays.com" className="btn-outline" style={{ whiteSpace: 'nowrap' }}>Email Us</a>
          </div>
        </div>
      </div>
    </div>
  )
}
