interface Props {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: Props) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '0.7rem',
          color: '#7A6A5A',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>Pregunta {current} de {total}</span>
        <span style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '0.7rem',
          color: '#C8A97E',
          fontWeight: 700,
        }}>{pct}%</span>
      </div>
      <div style={{
        width: '100%',
        height: '6px',
        backgroundColor: 'rgba(61, 43, 31, 0.12)',
        borderRadius: '9999px',
        overflow: 'hidden',
      }}>
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: 'linear-gradient(to right, #7A9E7E, #C8A97E)',
            borderRadius: '9999px',
            transition: 'width 0.5s ease',
          }}
        />
      </div>
    </div>
  );
}
