export default function Header() {
  return (
    <header style={{
      padding: '0.875rem 1.5rem',
      borderBottom: '1.5px solid rgba(122, 158, 126, 0.4)',
      backgroundColor: '#F5E6C8',
      backdropFilter: 'blur(8px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 2px 12px rgba(155, 120, 60, 0.15)',
    }}>
      <div style={{ maxWidth: '42rem', margin: '0 auto', textAlign: 'center' }}>
        <p style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '0.7rem',
          color: '#7A9E7E',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          fontWeight: 600,
          margin: 0,
        }}>✦ Lecturas Astrales · Método MAJHO ✦</p>
      </div>
    </header>
  );
}
