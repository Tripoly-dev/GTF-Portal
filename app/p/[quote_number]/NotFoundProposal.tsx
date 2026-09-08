export default function NotFoundProposal() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 10, background: '#fff', fontFamily: "'Archivo', Arial, sans-serif",
      padding: 24, textAlign: 'center',
    }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#06316D' }}>Proposal not found</div>
      <div style={{ fontSize: 14, color: '#757575' }}>This link may be invalid or no longer available.</div>
    </div>
  )
}
