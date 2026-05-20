interface Props {
  childName: string;
}

const STEPS = [
  { icon: '🌌', text: 'Trazando la carta astral...' },
  { icon: '☉', text: 'Calculando posiciones planetarias...' },
  { icon: '🔮', text: 'Determinando el tipo de vibración...' },
  { icon: '✨', text: 'Redactando el propósito de vida...' },
  { icon: '📜', text: 'Generando el reporte PDF...' },
  { icon: '💌', text: 'Enviando al correo...' },
];

export default function ProcessingPage({ childName }: Props) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '28rem', width: '100%' }}>

        {/* Animación central */}
        <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
          <div style={{ width: '7rem', height: '7rem', margin: '0 auto', position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '9999px',
              border: '2px solid rgba(200, 169, 126, 0.7)',
              animation: 'spin 8s linear infinite',
            }} />
            <div style={{
              position: 'absolute', inset: '0.75rem', borderRadius: '9999px',
              border: '1.5px solid rgba(122, 158, 126, 0.6)',
              animation: 'spin 5s linear infinite reverse',
            }} />
            <div style={{
              position: 'absolute', inset: '1.5rem', borderRadius: '9999px',
              background: 'linear-gradient(135deg, rgba(122,158,126,0.35), rgba(200,169,126,0.45))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem',
              border: '1px solid rgba(200, 169, 126, 0.4)',
            }}>
              ✦
            </div>
          </div>
        </div>

        <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.875rem', color: '#3D2B1F', marginBottom: '0.5rem' }}>
          Leyendo los astros
        </h2>
        <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.25rem', color: '#C8A97E', fontStyle: 'italic', marginBottom: '2rem' }}>
          para {childName}...
        </p>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left', marginBottom: '2.5rem' }}>
          {STEPS.map((step, i) => (
            <div
              key={i}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', animation: 'pulse 2s ease-in-out infinite', animationDelay: `${i * 0.5}s` }}
            >
              <span style={{ fontSize: '1.25rem' }}>{step.icon}</span>
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.875rem', color: '#7A6A5A' }}>{step.text}</span>
            </div>
          ))}
        </div>

        <div style={{
          border: '1.5px solid rgba(200, 169, 126, 0.55)',
          borderRadius: '1rem',
          padding: '1.25rem',
          backgroundColor: '#F5EFE6',
        }}>
          <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.125rem', color: '#5A4030', fontStyle: 'italic', lineHeight: 1.6 }}>
            "Las estrellas no hablan en prisas —<br />cada lectura es única y merece tiempo."
          </p>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', color: '#C8A97E', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
            — Método MAJHO
          </p>
        </div>

        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.75rem', color: '#7A6A5A', marginTop: '1.5rem', opacity: 0.7 }}>
          Esto puede tomar 30–60 segundos. Por favor no cierres esta página.
        </p>
      </div>
    </div>
  );
}
