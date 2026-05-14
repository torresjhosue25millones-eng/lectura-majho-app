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
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md w-full">
          <div className="text-5xl mb-6">😔</div>
          <h2 className="font-cormorant text-3xl text-beige mb-4">Algo salió mal</h2>
          <p className="font-montserrat text-sm text-beige/50 mb-6 leading-relaxed">
            {errorMessage || 'Ocurrió un error al generar la lectura.'}
          </p>
          <div className="border border-red-400/20 rounded-xl p-4 bg-red-400/5 mb-8">
            <p className="font-montserrat text-xs text-beige/40 leading-relaxed">
              Si el error persiste, verifica que el servidor backend esté corriendo y que las credenciales de correo en el archivo <code className="text-dorado">.env</code> sean correctas.
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-lg w-full">

        {/* Éxito */}
        <div className="float inline-block text-6xl mb-6">🌟</div>

        <div className="mb-2">
          <span className="font-montserrat text-xs text-verde/80 uppercase tracking-[4px]">¡Listo!</span>
        </div>
        <h2 className="font-cormorant text-4xl md:text-5xl text-beige mb-3">
          La lectura de {childName}
        </h2>
        <p className="font-cormorant text-2xl text-dorado italic mb-8">está en camino ✦</p>

        <div className="w-16 h-px bg-gradient-to-r from-transparent via-dorado to-transparent mx-auto mb-8" />

        {/* Email confirmación */}
        <div className="card p-6 mb-8 text-left">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-verde/20 rounded-full flex items-center justify-center text-2xl flex-shrink-0">💌</div>
            <div>
              <p className="font-montserrat text-sm text-beige/70 leading-relaxed">
                El reporte PDF completo de {childName} ha sido enviado a:
              </p>
              <p className="font-montserrat text-sm text-dorado font-semibold mt-1">{momEmail}</p>
              <p className="font-montserrat text-xs text-beige/30 mt-2">
                Revisa también tu carpeta de spam si no lo ves en los próximos minutos.
              </p>
            </div>
          </div>
        </div>

        {/* Lo que incluye */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            { icon: '🌌', text: 'Carta astral completa' },
            { icon: '☉', text: 'Sol, Luna y Ascendente' },
            { icon: '🏠', text: 'Las 12 casas astrológicas' },
            { icon: '✨', text: 'Tipo de vibración' },
            { icon: '💫', text: 'Propósito de vida' },
            { icon: '🌿', text: 'Consejos del Método MAJHO' },
          ].map(item => (
            <div key={item.text} className="border border-white/10 rounded-xl p-3 flex items-center gap-2">
              <span>{item.icon}</span>
              <span className="font-montserrat text-xs text-beige/50">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Mensaje final */}
        <div className="border border-dorado/20 rounded-2xl p-6 bg-dorado/5 mb-8">
          <p className="font-cormorant text-lg text-beige/80 italic leading-relaxed">
            "Recuerda: {childName} eligió nacer en este momento preciso,
            bajo estas estrellas, en esta familia. Te eligió a ti."
          </p>
          <p className="font-montserrat text-xs text-dorado/50 mt-3 uppercase tracking-widest">— Método MAJHO</p>
        </div>

        <button onClick={onRetry} className="btn-secondary text-sm">
          Generar otra lectura
        </button>
      </div>
    </div>
  );
}
