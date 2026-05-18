interface Props {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: Props) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="font-montserrat text-xs text-muted uppercase tracking-wider">Pregunta {current} de {total}</span>
        <span className="font-montserrat text-xs text-dorado font-semibold">{pct}%</span>
      </div>
      <div className="w-full h-1.5 bg-stone/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sage to-dorado rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
