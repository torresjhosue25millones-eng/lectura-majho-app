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
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-md w-full">

        {/* Animación central */}
        <div className="relative mb-10">
          <div className="w-28 h-28 mx-auto relative">
            <div className="absolute inset-0 rounded-full border-2 border-dorado/40 animate-spin" style={{ animationDuration: '8s' }} />
            <div className="absolute inset-3 rounded-full border border-sage/40 animate-spin" style={{ animationDuration: '5s', animationDirection: 'reverse' }} />
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-sage/15 to-dorado/20 flex items-center justify-center text-3xl">
              ✦
            </div>
          </div>
        </div>

        <h2 className="font-cormorant text-3xl text-stone mb-2">Leyendo los astros</h2>
        <p className="font-cormorant text-xl text-dorado/80 italic mb-8">para {childName}...</p>

        {/* Steps */}
        <div className="space-y-3 text-left mb-10">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="flex items-center gap-3 animate-pulse"
              style={{ animationDelay: `${i * 0.5}s`, animationDuration: '2s' }}
            >
              <span className="text-xl">{step.icon}</span>
              <span className="font-montserrat text-sm text-muted">{step.text}</span>
            </div>
          ))}
        </div>

        <div className="border border-dorado/25 rounded-2xl p-5 bg-sand/60">
          <p className="font-cormorant text-lg text-stone/70 italic">
            "Las estrellas no hablan en prisas —<br />cada lectura es única y merece tiempo."
          </p>
          <p className="font-montserrat text-xs text-dorado/50 mt-2 uppercase tracking-widest">— Método MAJHO</p>
        </div>

        <p className="font-montserrat text-xs text-muted/50 mt-6">
          Esto puede tomar 30–60 segundos. Por favor no cierres esta página.
        </p>
      </div>
    </div>
  );
}
