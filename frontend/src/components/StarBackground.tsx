import { useMemo } from 'react';

export default function StarBackground() {
  const dots = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1.5,
      color: i % 3 === 0 ? '#B8935A' : i % 3 === 1 ? '#7A9E7E' : '#7A6A5A',
      opacity: Math.random() * 0.07 + 0.02,
      duration: Math.random() * 5 + 4,
      delay: Math.random() * 6,
    })), []
  );

  return (
    <div className="stars-bg" aria-hidden="true">
      {dots.map(s => (
        <div
          key={s.id}
          className="star-dot"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: s.color,
            '--opacity': s.opacity,
            '--duration': `${s.duration}s`,
            '--delay': `${s.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
