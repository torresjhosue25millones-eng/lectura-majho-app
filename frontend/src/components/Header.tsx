import { useState } from 'react';

export default function Header() {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <header className="py-5 px-6 border-b border-stone/10 bg-cream/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          {!logoFailed ? (
            <img
              src="/assets/logo-majho.png"
              alt="Método MAJHO"
              className="h-14 w-auto"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <span className="font-cormorant text-xl text-dorado tracking-widest">✦ MÉTODO MAJHO ✦</span>
          )}
        </a>
        <p className="font-montserrat text-xs text-muted tracking-[3px] uppercase">Lecturas Astrales</p>
      </div>
    </header>
  );
}
