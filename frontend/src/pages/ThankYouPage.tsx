interface Props {
  childName: string;
  momEmail: string;
  success: boolean;
  errorMessage?: string;
  onRetry: () => void;
}

export default function ThankYouPage({ childName, momEmail, success, errorMessage, onRetry }: Props) {
  if (!success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '28rem', width: '100%' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>😔</div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.875rem', color: '#3D2B1F', marginBottom: '1rem' }}>
            Algo salió mal
          </h2>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.875rem', color: '#7A6A5A', marginBottom: '1.5rem', lineHeight: 1.7 }}>
            {errorMessage || 'Ocurrió un error al generar la lectura.'}
          </p>
          <div style={{ border: '1px solid #fca5a5', borderRadius: '0.75rem', padding: '1rem', backgroundColor: '#fef2f2', marginBottom: '2rem' }}>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.75rem', color: '#5A4030', lineHeight: 1.7 }}>
              Si el error persiste, verifica que las variables de entorno SMTP estén configuradas correctamente en Railway.
            </p>
          </div>
          <button onClick={onRetry} className="btn-primary">
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '36rem', width: '100%' }}>

        <div className="float" style={{ display: 'inline-block', fontSize: '3.5rem', marginBottom: '1.5rem' }}>🌟</div>

        <div style={{ marginBottom: '0.5rem' }}>
          <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.7rem', color: '#1A4D28', textTransform: 'uppercase', letterSpacing: '0.25em', fontWeight: 700 }}>
            ¡Listo!
          </span>
        </div>
        <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '2.5rem', color: '#3D2B1F', marginBottom: '0.75rem' }}>
          La lectura de {childName}
        </h2>
        <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.5rem', color: '#5C3010', fontStyle: 'italic', marginBottom: '2rem' }}>
          está en camino ✦
        </p>

        <div style={{ width: '4rem', height: '1px', background: 'linear-gradient(to right, transparent, #B8935A, transparent)', margin: '0 auto 2rem' }} />

        {/* Email confirmación */}
        <div style={{
          backgroundColor: '#C4A882',
          border: '1px solid rgba(155, 120, 60, 0.35)',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          textAlign: 'left',
          boxShadow: '0 2px 10px rgba(155, 120, 60, 0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{
              width: '3rem', height: '3rem', flexShrink: 0,
              backgroundColor: 'rgba(122, 158, 126, 0.25)',
              borderRadius: '9999px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.375rem',
            }}>💌</div>
            <div>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.875rem', color: '#3D2B1F', lineHeight: 1.7 }}>
                El reporte PDF completo de {childName} ha sido enviado a:
              </p>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.875rem', color: '#3D2B1F', fontWeight: 700, marginTop: '0.25rem' }}>
                {momEmail}
              </p>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.75rem', color: '#2A1A0E', marginTop: '0.5rem' }}>
                Revisa también tu carpeta de spam si no lo ves en los próximos minutos.
              </p>
            </div>
          </div>
        </div>

        {/* Lo que incluye */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
          {[
            { icon: '🌌', text: 'Carta astral completa' },
            { icon: '☉', text: 'Sol, Luna y Ascendente' },
            { icon: '🏠', text: 'Las 12 casas astrológicas' },
            { icon: '✨', text: 'Tipo de vibración' },
            { icon: '💫', text: 'Propósito de vida' },
            { icon: '🌿', text: 'Consejos del Método MAJHO' },
          ].map(item => (
            <div key={item.text} style={{
              border: '1px solid #C4A882',
              borderRadius: '0.75rem',
              padding: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#C4A882',
            }}>
              <span>{item.icon}</span>
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.78rem', color: '#3D2B1F' }}>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Mensaje final */}
        <div style={{
          border: '1.5px solid rgba(155, 120, 60, 0.35)',
          borderRadius: '1rem',
          padding: '1.5rem',
          backgroundColor: '#C4A882',
          marginBottom: '2rem',
        }}>
          <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.125rem', color: '#3D2B1F', fontStyle: 'italic', lineHeight: 1.7 }}>
            "Recuerda: {childName} eligió nacer en este momento preciso,
            bajo estas estrellas, en esta familia. Te eligió a ti."
          </p>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', color: '#5C3010', marginTop: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
            — Método MAJHO
          </p>
        </div>

        <button onClick={onRetry} className="btn-secondary" style={{ fontSize: '0.875rem' }}>
          Generar otra lectura
        </button>
      </div>
    </div>
  );
}
