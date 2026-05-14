export default function Header() {
  return (
    <header className="py-6 px-4 text-center border-b border-dorado/10">
      <div className="flex items-center justify-center gap-3">
        <div className="w-10 h-px bg-gradient-to-r from-transparent to-dorado/60" />
        <h1 className="font-cormorant text-2xl text-dorado tracking-widest">✦ MÉTODO MAJHO ✦</h1>
        <div className="w-10 h-px bg-gradient-to-l from-transparent to-dorado/60" />
      </div>
      <p className="font-montserrat text-xs text-beige/40 tracking-[4px] uppercase mt-1">Lecturas Astrales Personalizadas</p>
    </header>
  );
}
