import { useState } from 'react';

export default function Header() {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <header style={{
      padding: '1rem 1.5rem',
      borderBottom: '1.5px solid rgba(122, 158, 126, 0.4)',
      backgroundColor: '#FDFAF6',
      backdropFilter: 'blur(8px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 2px 12px rgba(200, 169, 126, 0.1)',
    }}>
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          {!logoFailed ? (
            <img
              src="/assets/logo-majho.png"
              alt="Método MAJHO"
              style={{ height: 70, width: 'auto' }}
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <span style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: '1.25rem',
              color: '#C8A97E',
              letterSpacing: '0.15em',
            }}>✦ MÉTODO MAJHO ✦</span>
          )}
        </a>
        <p style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '0.7rem',
          color: '#7A9E7E',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}>Lecturas Astrales</p>
      </div>
    </header>
  );
}
