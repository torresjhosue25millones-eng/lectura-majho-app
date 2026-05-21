import { chromium } from 'playwright';
import { AstralChart } from './astrology';
import { ChildTypeResult } from './childType';
import { getPlanetText, PARENTING_GUIDE, AFFIRMATIONS_BY_SUN, AFFIRMATIONS_BY_MOON, COMPATIBILITY_TEXTS } from './contentLibrary';

interface ReportData {
  momName: string;
  childName: string;
  childSex: string;
  birthDate: string;
  birthTime: string;
  birthCity: string;
  birthCountry: string;
  chart: AstralChart;
  childType: ChildTypeResult;
}

const SIGN_SYMBOLS: Record<string, string> = {
  Aries: '♈', Tauro: '♉', Géminis: '♊', Cáncer: '♋', Leo: '♌', Virgo: '♍',
  Libra: '♎', Escorpio: '♏', Sagitario: '♐', Capricornio: '♑', Acuario: '♒', Piscis: '♓',
};

const SIGN_ORDER = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];

const SIGN_DESCRIPTIONS: Record<string, string> = {
  Aries: 'Pionero, valiente y lleno de energía iniciadora. Ama los nuevos comienzos.',
  Tauro: 'Estable, sensual y profundamente conectado con la belleza y la abundancia.',
  Géminis: 'Curioso, comunicativo y con una mente brillante y ágil.',
  Cáncer: 'Sensible, intuitivo y con un profundo amor por el hogar y la familia.',
  Leo: 'Creativo, generoso y con un corazón que brilla como el sol.',
  Virgo: 'Analítico, servicial y con un don innato para el detalle y el orden.',
  Libra: 'Armonioso, justo y con una sensibilidad estética extraordinaria.',
  Escorpio: 'Intenso, transformador y con una profundidad emocional inigualable.',
  Sagitario: 'Optimista, aventurero y en constante búsqueda de significado.',
  Capricornio: 'Disciplinado, ambicioso y con una sabiduría que supera su edad.',
  Acuario: 'Innovador, humanitario y con ideas que trascienden su tiempo.',
  Piscis: 'Intuitivo, compasivo y con una conexión profunda con lo espiritual.',
};

const MOON_DESCRIPTIONS: Record<string, string> = {
  Aries: 'Sus emociones son rápidas e intensas. Necesita acción para procesar lo que siente.',
  Tauro: 'Busca seguridad y constancia para sentirse emocionalmente estable.',
  Géminis: 'Procesa las emociones a través de palabras y conversación.',
  Cáncer: 'Mundo emocional muy rico y profundo. Necesita sentirse seguro/a y amado/a.',
  Leo: 'Necesita reconocimiento y afecto para florecer emocionalmente.',
  Virgo: 'Procesa las emociones con análisis. Necesita rutinas para sentirse bien.',
  Libra: 'Busca armonía y equilibrio emocional. Las discusiones lo/la afectan profundamente.',
  Escorpio: 'Emociones intensas y profundas. Necesita confianza para abrirse.',
  Sagitario: 'Emociones expansivas y optimistas. Necesita libertad y aventura.',
  Capricornio: 'Gestiona sus emociones con madurez. Puede parecer reservado/a.',
  Acuario: 'Procesa las emociones desde la lógica. Necesita su espacio e independencia.',
  Piscis: 'Extremadamente sensible y empático/a. Absorbe el ambiente emocional.',
};

const ASC_DESCRIPTIONS: Record<string, string> = {
  Aries: 'Se presenta al mundo con energía, dinamismo y entusiasmo contagioso.',
  Tauro: 'Proyecta calma, confianza y una presencia cálida y reconfortante.',
  Géminis: 'Se expresa con fluidez verbal, curiosidad y una actitud juguetona.',
  Cáncer: 'Proyecta ternura, calidez y un instinto protector natural.',
  Leo: 'Tiene una presencia magnética que ilumina cualquier espacio.',
  Virgo: 'Proyecta pulcritud, inteligencia y una actitud de servicio genuino.',
  Libra: 'Encanta con gracia, diplomacia y una belleza natural que atrae.',
  Escorpio: 'Tiene una presencia magnética, misteriosa e intensa.',
  Sagitario: 'Proyecta optimismo, libertad y un entusiasmo que inspira a todos.',
  Capricornio: 'Proyecta seriedad, responsabilidad y una madurez sorprendente.',
  Acuario: 'Proyecta originalidad, independencia y una energía futurista única.',
  Piscis: 'Proyecta dulzura, misticismo y una sensibilidad que toca los corazones.',
};

const LIFE_PURPOSE: Record<string, string> = {
  Aries: 'iniciar nuevos caminos con valentía y despertar la acción en quienes le rodean',
  Tauro: 'crear belleza, construir estabilidad y manifestar abundancia en el mundo',
  Géminis: 'comunicar ideas, conectar mentes y ser puente entre diferentes perspectivas',
  Cáncer: 'nutrir, proteger y crear un hogar sagrado donde todos se sientan amados',
  Leo: 'brillar con autenticidad e inspirar a otros con su creatividad y corazón',
  Virgo: 'servir con maestría y ayudar a crear orden, salud y bienestar en el mundo',
  Libra: 'traer armonía, justicia y belleza a todas sus relaciones',
  Escorpio: 'transformar lo que está roto y revelar verdades que necesitan ser vistas',
  Sagitario: 'buscar y compartir sabiduría, expandir horizontes e inspirar la búsqueda de significado',
  Capricornio: 'construir estructuras duraderas y demostrar que la disciplina es poder',
  Acuario: 'revolucionar el pensamiento e innovar para el bien de la humanidad',
  Piscis: 'disolver fronteras y ser puente entre lo espiritual y lo humano',
};

const HOUSE_MEANINGS: Record<number, string> = {
  1: 'Casa de la Identidad y el Yo',
  2: 'Casa de los Recursos y los Valores',
  3: 'Casa de la Comunicación y el Aprendizaje',
  4: 'Casa del Hogar y las Raíces',
  5: 'Casa de la Creatividad y el Juego',
  6: 'Casa del Servicio y la Salud',
  7: 'Casa de las Relaciones y Asociaciones',
  8: 'Casa de la Transformación y el Misterio',
  9: 'Casa de la Filosofía y los Viajes',
  10: 'Casa del Propósito y el Legado',
  11: 'Casa de la Comunidad y los Sueños',
  12: 'Casa del Alma y lo Espiritual',
};

function generateZodiacWheel(chart: AstralChart): string {
  const cx = 200, cy = 200, r = 175, inner = 125, planetR = 100;
  const PLANET_COLORS: Record<string, string> = {
    Sol: '#FFD700', Luna: '#C8C8D8', Mercurio: '#90EE90', Venus: '#FFB6C1',
    Marte: '#FF6B6B', Júpiter: '#FFA500', Saturno: '#D4A574', Urano: '#87CEEB',
    Neptuno: '#6495ED', Plutón: '#9B7BB8',
  };

  let paths = '';
  // Sectors
  for (let i = 0; i < 12; i++) {
    const startAngle = (i * 30 - 180) * (Math.PI / 180);
    const endAngle = ((i + 1) * 30 - 180) * (Math.PI / 180);
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const xi = cx + inner * Math.cos(startAngle);
    const yi = cy + inner * Math.sin(startAngle);

    const fill = i % 2 === 0 ? 'rgba(201,168,76,0.08)' : 'rgba(123,94,167,0.08)';
    paths += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z" fill="${fill}" stroke="#C9A84C" stroke-width="0.5" opacity="0.6"/>`;

    // Sign symbol
    const midAngle = (i * 30 + 15 - 180) * (Math.PI / 180);
    const symR = (r + inner) / 2;
    const sx = cx + symR * Math.cos(midAngle);
    const sy = cy + symR * Math.sin(midAngle);
    const sym = SIGN_SYMBOLS[SIGN_ORDER[i]] || '';
    paths += `<text x="${sx}" y="${sy}" text-anchor="middle" dominant-baseline="middle" font-size="13" fill="#C9A84C" opacity="0.9">${sym}</text>`;

    // Separator line
    paths += `<line x1="${xi}" y1="${yi}" x2="${x1}" y2="${y1}" stroke="#C9A84C" stroke-width="0.4" opacity="0.5"/>`;
  }

  // Inner circle
  paths += `<circle cx="${cx}" cy="${cy}" r="${inner}" fill="#120820" stroke="#C9A84C" stroke-width="1"/>`;
  paths += `<circle cx="${cx}" cy="${cy}" r="${planetR + 10}" fill="none" stroke="#7B5EA7" stroke-width="0.3" stroke-dasharray="3,3" opacity="0.4"/>`;

  // Ascendant line
  const ascAngle = (-(chart.ascendant.longitude) - 180) * (Math.PI / 180);
  const ax = cx + r * Math.cos(ascAngle);
  const ay = cy + r * Math.sin(ascAngle);
  paths += `<line x1="${cx}" y1="${cy}" x2="${ax}" y2="${ay}" stroke="#FFD700" stroke-width="1.5" opacity="0.8"/>`;
  paths += `<text x="${ax + 5}" y="${ay - 5}" font-size="9" fill="#FFD700" opacity="0.9">AC</text>`;

  // Planets
  for (const planet of chart.planets) {
    const pAngle = (-(planet.longitude) - 180) * (Math.PI / 180);
    const px = cx + planetR * Math.cos(pAngle);
    const py = cy + planetR * Math.sin(pAngle);
    const color = PLANET_COLORS[planet.name] || '#FFFFFF';
    paths += `<circle cx="${px}" cy="${py}" r="7" fill="${color}" opacity="0.9"/>`;
    paths += `<text x="${px}" y="${py}" text-anchor="middle" dominant-baseline="middle" font-size="9" fill="#0a0018">${planet.symbol}</text>`;
  }

  // Center
  paths += `<circle cx="${cx}" cy="${cy}" r="12" fill="#C9A84C" opacity="0.8"/>`;
  paths += `<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle" font-size="10" fill="#0a0018">✦</text>`;

  return `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" width="300" height="300">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#0d0520" stroke="#C9A84C" stroke-width="1.5"/>
    ${paths}
  </svg>`;
}

function formatBirthDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  return `${Number(d)} de ${months[Number(m) - 1]} de ${y}`;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateHTML(data: ReportData): string {
  const { momName, childName, childSex, birthDate, birthTime, birthCity, birthCountry, chart, childType } = data;
  const pronoun = childSex === 'F' ? 'ella' : 'él';
  const article = childSex === 'F' ? 'la' : 'el';
  const adjSuffix = childSex === 'F' ? 'a' : 'o';
  const formattedDate = formatBirthDate(birthDate);
  const zodiacWheel = generateZodiacWheel(chart);
  const sunPlanet = chart.planets.find(p => p.name === 'Sol')!;
  const moonPlanet = chart.planets.find(p => p.name === 'Luna')!;

  const planetsInHouses: Record<number, string[]> = {};
  for (let i = 1; i <= 12; i++) planetsInHouses[i] = [];
  for (const planet of chart.planets) {
    planetsInHouses[planet.house]?.push(`${planet.symbol} ${planet.name}`);
  }

  const tipsList = childType.majhoTips.map(t => `
    <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:14px;">
      <span style="color:#C9A84C;font-size:18px;flex-shrink:0;line-height:1.4;">✦</span>
      <p style="margin:0;color:#3d2b1f;font-size:14px;line-height:1.7;font-family:Montserrat,sans-serif;">${t}</p>
    </div>`).join('');

  const giftsList = childType.gifts.map(g => `
    <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;">
      <span style="color:#5C8A6E;font-size:16px;flex-shrink:0;">💫</span>
      <p style="margin:0;color:#3d2b1f;font-size:13px;font-family:Montserrat,sans-serif;">${g}</p>
    </div>`).join('');

  const challengesList = childType.challenges.map(c => `
    <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;">
      <span style="color:#7B5EA7;font-size:16px;flex-shrink:0;">🌀</span>
      <p style="margin:0;color:#3d2b1f;font-size:13px;font-family:Montserrat,sans-serif;">${c}</p>
    </div>`).join('');

  const planetRows = chart.planets.map(p => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid rgba(201,168,76,0.2);font-family:Georgia,serif;font-size:18px;color:${p.name === 'Sol' ? '#FFD700' : p.name === 'Luna' ? '#C8C8D8' : '#C9A84C'}">${p.symbol}</td>
      <td style="padding:8px 12px;border-bottom:1px solid rgba(201,168,76,0.2);font-family:Montserrat,sans-serif;font-size:12px;color:#3d2b1f;font-weight:600;">${p.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid rgba(201,168,76,0.2);font-family:Montserrat,sans-serif;font-size:12px;color:#3d2b1f;">${SIGN_SYMBOLS[p.sign]} ${p.sign}</td>
      <td style="padding:8px 12px;border-bottom:1px solid rgba(201,168,76,0.2);font-family:Montserrat,sans-serif;font-size:12px;color:#7B5EA7;">${p.degree}°</td>
      <td style="padding:8px 12px;border-bottom:1px solid rgba(201,168,76,0.2);font-family:Montserrat,sans-serif;font-size:12px;color:#5C8A6E;">Casa ${p.house}</td>
    </tr>`).join('');

  const housesGrid = chart.houses.map((h, i) => `
    <div style="background:${planetsInHouses[h.number].length > 0 ? 'rgba(123,94,167,0.08)' : 'rgba(245,239,224,0.5)'};border:1px solid rgba(201,168,76,0.25);border-radius:8px;padding:12px;">
      <div style="font-family:Montserrat,sans-serif;font-size:10px;color:#7B5EA7;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Casa ${h.number}</div>
      <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:13px;color:#C9A84C;margin-bottom:4px;">${SIGN_SYMBOLS[h.sign]} ${h.sign}</div>
      <div style="font-family:Montserrat,sans-serif;font-size:10px;color:#5C8A6E;margin-bottom:6px;">${HOUSE_MEANINGS[h.number]}</div>
      ${planetsInHouses[h.number].length > 0 ? `<div style="font-family:Montserrat,sans-serif;font-size:11px;color:#3d2b1f;font-style:italic;">${planetsInHouses[h.number].join(', ')}</div>` : ''}
    </div>`).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: white; }
    .page {
      width: 210mm;
      min-height: 297mm;
      page-break-after: always;
      position: relative;
      overflow: hidden;
      background: #F5EFE0;
    }
    .page:last-child { page-break-after: avoid; }
    @media print {
      .page { page-break-after: always; }
    }
    .star { position: absolute; background: white; border-radius: 50%; }
  </style>
</head>
<body>

<!-- ============ PÁGINA 1: PORTADA ============ -->
<div class="page" style="background: linear-gradient(160deg, #0d0520 0%, #1e0a3c 35%, #2d1b4e 60%, #1a0a2e 100%); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px 30px; text-align:center;">

  <!-- Estrellas decorativas -->
  <div style="position:absolute;top:0;left:0;right:0;bottom:0;overflow:hidden;">
    ${Array.from({length: 60}, (_, i) => {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.random() * 2.5 + 0.5;
      const opacity = Math.random() * 0.6 + 0.2;
      return `<div style="position:absolute;left:${x}%;top:${y}%;width:${size}px;height:${size}px;background:white;border-radius:50%;opacity:${opacity};"></div>`;
    }).join('')}
  </div>

  <!-- Círculo decorativo exterior -->
  <div style="position:relative;z-index:2;width:520px;border:1px solid rgba(201,168,76,0.3);border-radius:50%;padding:40px;display:flex;flex-direction:column;align-items:center;">

    <div style="color:#C9A84C;font-family:'Cormorant Garamond',Georgia,serif;font-size:13px;letter-spacing:4px;text-transform:uppercase;margin-bottom:24px;opacity:0.9;">✦ &nbsp; Método MAJHO &nbsp; ✦</div>

    <div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,#C9A84C,transparent);margin-bottom:24px;"></div>

    <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:14px;color:rgba(245,239,224,0.7);letter-spacing:5px;text-transform:uppercase;margin-bottom:36px;font-weight:300;">Lectura Astral Personalizada</h1>

    <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:52px;color:#F5EFE0;font-weight:300;line-height:1.2;margin-bottom:12px;font-style:italic;">${childName}</h2>

    <div style="width:80px;height:2px;background:linear-gradient(90deg,transparent,#C9A84C,transparent);margin:20px auto;"></div>

    <div style="background:${childType.gradient};border-radius:30px;padding:10px 28px;margin-bottom:32px;box-shadow:0 4px 20px rgba(0,0,0,0.4);">
      <span style="font-family:Montserrat,sans-serif;font-size:14px;color:white;letter-spacing:3px;text-transform:uppercase;font-weight:600;">${childType.emoji} ${childType.type} — ${childType.subtitle}</span>
    </div>

    <p style="font-family:Montserrat,sans-serif;font-size:12px;color:rgba(245,239,224,0.65);letter-spacing:1px;">Nacid${adjSuffix} el ${formattedDate}</p>
    <p style="font-family:Montserrat,sans-serif;font-size:12px;color:rgba(245,239,224,0.65);margin-top:4px;letter-spacing:1px;">${capitalize(birthTime)} horas · ${capitalize(birthCity)}, ${capitalize(birthCountry)}</p>

    <div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,#C9A84C,transparent);margin:28px auto 16px;"></div>

    <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:14px;color:rgba(245,239,224,0.5);font-style:italic;">Preparado con amor para ${momName}</p>

  </div>

  <!-- Sol Luna Ascendente badges -->
  <div style="position:relative;z-index:2;display:flex;gap:20px;margin-top:32px;">
    <div style="text-align:center;">
      <div style="font-size:22px;">☉</div>
      <div style="font-family:Montserrat,sans-serif;font-size:9px;color:rgba(201,168,76,0.7);text-transform:uppercase;letter-spacing:1px;margin-top:4px;">Sol</div>
      <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:13px;color:#F5EFE0;">${chart.sunSign}</div>
    </div>
    <div style="width:1px;background:rgba(201,168,76,0.3);"></div>
    <div style="text-align:center;">
      <div style="font-size:22px;">☽</div>
      <div style="font-family:Montserrat,sans-serif;font-size:9px;color:rgba(201,168,76,0.7);text-transform:uppercase;letter-spacing:1px;margin-top:4px;">Luna</div>
      <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:13px;color:#F5EFE0;">${chart.moonSign}</div>
    </div>
    <div style="width:1px;background:rgba(201,168,76,0.3);"></div>
    <div style="text-align:center;">
      <div style="font-size:22px;">↑</div>
      <div style="font-family:Montserrat,sans-serif;font-size:9px;color:rgba(201,168,76,0.7);text-transform:uppercase;letter-spacing:1px;margin-top:4px;">Ascendente</div>
      <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:13px;color:#F5EFE0;">${chart.ascendantSign}</div>
    </div>
  </div>
</div>

<!-- ============ PÁGINA 2: CARTA ASTRAL ============ -->
<div class="page" style="background:#F5EFE0;padding:40px 35px;">

  <div style="text-align:center;margin-bottom:30px;">
    <p style="font-family:Montserrat,sans-serif;font-size:10px;color:#7B5EA7;letter-spacing:4px;text-transform:uppercase;margin-bottom:8px;">Método MAJHO</p>
    <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:36px;color:#3d2b1f;font-weight:400;">Carta Astral de ${childName}</h2>
    <div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,#C9A84C,transparent);margin:12px auto;"></div>
  </div>

  <div style="display:flex;gap:30px;align-items:flex-start;">

    <!-- Rueda zodiacal -->
    <div style="flex-shrink:0;text-align:center;">
      ${zodiacWheel}
      <p style="font-family:Montserrat,sans-serif;font-size:9px;color:#7B5EA7;margin-top:8px;letter-spacing:2px;text-transform:uppercase;">Mapa Celeste de Nacimiento</p>
    </div>

    <!-- Tabla de planetas -->
    <div style="flex:1;">
      <table style="width:100%;border-collapse:collapse;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
        <thead>
          <tr style="background:linear-gradient(135deg,#1a0a2e,#2d1b4e);">
            <th style="padding:10px 12px;text-align:left;font-family:Montserrat,sans-serif;font-size:9px;color:#C9A84C;letter-spacing:2px;text-transform:uppercase;" colspan="2">Planeta</th>
            <th style="padding:10px 12px;text-align:left;font-family:Montserrat,sans-serif;font-size:9px;color:#C9A84C;letter-spacing:2px;text-transform:uppercase;">Signo</th>
            <th style="padding:10px 12px;text-align:left;font-family:Montserrat,sans-serif;font-size:9px;color:#C9A84C;letter-spacing:2px;text-transform:uppercase;">Grado</th>
            <th style="padding:10px 12px;text-align:left;font-family:Montserrat,sans-serif;font-size:9px;color:#C9A84C;letter-spacing:2px;text-transform:uppercase;">Casa</th>
          </tr>
        </thead>
        <tbody>
          ${planetRows}
        </tbody>
      </table>

      <div style="margin-top:20px;background:white;border-radius:12px;padding:16px;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
        <div style="font-family:Montserrat,sans-serif;font-size:9px;color:#7B5EA7;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;">Ascendente</div>
        <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;color:#C9A84C;">${SIGN_SYMBOLS[chart.ascendantSign]} ${chart.ascendantSign} ${chart.ascendant.degree}°</div>
        <p style="font-family:Montserrat,sans-serif;font-size:11px;color:#5C8A6E;margin-top:6px;line-height:1.5;">${ASC_DESCRIPTIONS[chart.ascendantSign]}</p>
      </div>
    </div>
  </div>
</div>

<!-- ============ PÁGINA 3: SOL, LUNA, ASCENDENTE ============ -->
<div class="page" style="background:#F5EFE0;padding:40px 35px;">

  <div style="text-align:center;margin-bottom:32px;">
    <p style="font-family:Montserrat,sans-serif;font-size:10px;color:#7B5EA7;letter-spacing:4px;text-transform:uppercase;margin-bottom:8px;">La Trinidad Astral</p>
    <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:36px;color:#3d2b1f;font-weight:400;">Sol, Luna y Ascendente</h2>
    <div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,#C9A84C,transparent);margin:12px auto;"></div>
  </div>

  <!-- Sol -->
  <div style="background:white;border-radius:16px;padding:28px;margin-bottom:20px;box-shadow:0 2px 16px rgba(0,0,0,0.06);border-left:4px solid #FFD700;">
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;">
      <div style="width:52px;height:52px;background:linear-gradient(135deg,#FFD700,#FFA500);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0;">☉</div>
      <div>
        <div style="font-family:Montserrat,sans-serif;font-size:10px;color:#999;letter-spacing:2px;text-transform:uppercase;">Sol en</div>
        <h3 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;color:#C9A84C;font-weight:400;">${SIGN_SYMBOLS[chart.sunSign]} ${chart.sunSign}</h3>
      </div>
    </div>
    <div style="background:#FFFBF0;border-radius:8px;padding:16px;">
      <p style="font-family:Montserrat,sans-serif;font-size:11px;color:#7B5EA7;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Esencia y propósito</p>
      <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:15px;color:#3d2b1f;line-height:1.7;">${SIGN_DESCRIPTIONS[chart.sunSign]}</p>
      <p style="font-family:Montserrat,sans-serif;font-size:12px;color:#5C8A6E;margin-top:10px;line-height:1.6;">El Sol revela la esencia más profunda de ${childName}: su misión es <em>${LIFE_PURPOSE[chart.sunSign]}</em>. Esta energía solar guiará todas sus decisiones importantes.</p>
    </div>
  </div>

  <!-- Luna -->
  <div style="background:white;border-radius:16px;padding:28px;margin-bottom:20px;box-shadow:0 2px 16px rgba(0,0,0,0.06);border-left:4px solid #C8C8D8;">
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;">
      <div style="width:52px;height:52px;background:linear-gradient(135deg,#9090B0,#C8C8D8);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0;">☽</div>
      <div>
        <div style="font-family:Montserrat,sans-serif;font-size:10px;color:#999;letter-spacing:2px;text-transform:uppercase;">Luna en</div>
        <h3 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;color:#7B5EA7;font-weight:400;">${SIGN_SYMBOLS[chart.moonSign]} ${chart.moonSign}</h3>
      </div>
    </div>
    <div style="background:#FAF7FF;border-radius:8px;padding:16px;">
      <p style="font-family:Montserrat,sans-serif;font-size:11px;color:#7B5EA7;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Mundo emocional</p>
      <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:15px;color:#3d2b1f;line-height:1.7;">${MOON_DESCRIPTIONS[chart.moonSign]}</p>
      <p style="font-family:Montserrat,sans-serif;font-size:12px;color:#5C8A6E;margin-top:10px;line-height:1.6;">La Luna revela cómo ${childName} siente y necesita ser nutrido${adjSuffix}. Respetar esta energía lunar es clave para su bienestar emocional y seguridad interna.</p>
    </div>
  </div>

  <!-- Ascendente -->
  <div style="background:white;border-radius:16px;padding:28px;box-shadow:0 2px 16px rgba(0,0,0,0.06);border-left:4px solid #5C8A6E;">
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;">
      <div style="width:52px;height:52px;background:linear-gradient(135deg,#3A6B50,#5C8A6E);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0;color:white;">↑</div>
      <div>
        <div style="font-family:Montserrat,sans-serif;font-size:10px;color:#999;letter-spacing:2px;text-transform:uppercase;">Ascendente en</div>
        <h3 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;color:#5C8A6E;font-weight:400;">${SIGN_SYMBOLS[chart.ascendantSign]} ${chart.ascendantSign}</h3>
      </div>
    </div>
    <div style="background:#F5FAF7;border-radius:8px;padding:16px;">
      <p style="font-family:Montserrat,sans-serif;font-size:11px;color:#7B5EA7;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Máscara y presencia</p>
      <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:15px;color:#3d2b1f;line-height:1.7;">${ASC_DESCRIPTIONS[chart.ascendantSign]}</p>
      <p style="font-family:Montserrat,sans-serif;font-size:12px;color:#5C8A6E;margin-top:10px;line-height:1.6;">El Ascendente muestra cómo ${childName} se presenta al mundo y cómo los demás lo/la perciben al conocerle por primera vez.</p>
    </div>
  </div>
</div>

<!-- ============ PÁGINA 4: LAS 12 CASAS ============ -->
<div class="page" style="background:#F5EFE0;padding:40px 35px;">

  <div style="text-align:center;margin-bottom:28px;">
    <p style="font-family:Montserrat,sans-serif;font-size:10px;color:#7B5EA7;letter-spacing:4px;text-transform:uppercase;margin-bottom:8px;">Mapa del Alma</p>
    <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:36px;color:#3d2b1f;font-weight:400;">Las 12 Casas Astrológicas</h2>
    <div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,#C9A84C,transparent);margin:12px auto;"></div>
    <p style="font-family:Montserrat,sans-serif;font-size:11px;color:#5C8A6E;line-height:1.6;max-width:500px;margin:0 auto;">Las casas revelan las áreas de vida donde ${childName} expresará su energía y desplegará sus talentos únicos.</p>
  </div>

  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
    ${housesGrid}
  </div>
</div>

<!-- ============ PÁGINA 5: TIPO DE VIBRACIÓN ============ -->
<div class="page" style="background:#F5EFE0;padding:0;overflow:hidden;">

  <!-- Header con gradiente del tipo -->
  <div style="background:${childType.gradient};padding:36px 35px 28px;text-align:center;position:relative;">
    <div style="position:absolute;top:0;left:0;right:0;bottom:0;opacity:0.1;">
      ${Array.from({length:30},(_,i)=>`<div style="position:absolute;left:${Math.random()*100}%;top:${Math.random()*100}%;width:${Math.random()*3+1}px;height:${Math.random()*3+1}px;background:white;border-radius:50%;"></div>`).join('')}
    </div>
    <div style="position:relative;z-index:2;">
      <p style="font-family:Montserrat,sans-serif;font-size:10px;color:rgba(255,255,255,0.7);letter-spacing:4px;text-transform:uppercase;margin-bottom:12px;">Vibración de Alma</p>
      <div style="font-size:48px;margin-bottom:12px;">${childType.emoji}</div>
      <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:44px;color:white;font-weight:400;margin-bottom:8px;">Niño${adjSuffix} ${childType.type}</h2>
      <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;color:rgba(255,255,255,0.85);font-style:italic;">${childType.subtitle}</p>
    </div>
  </div>

  <div style="padding:30px 35px;">

    <!-- Descripción -->
    <div style="background:white;border-radius:16px;padding:24px;margin-bottom:20px;box-shadow:0 2px 16px rgba(0,0,0,0.06);">
      <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:15px;color:#3d2b1f;line-height:1.8;">${childType.description}</p>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">

      <!-- Dones -->
      <div style="background:white;border-radius:16px;padding:20px;box-shadow:0 2px 16px rgba(0,0,0,0.06);">
        <h4 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;color:#5C8A6E;margin-bottom:14px;">✨ Sus Dones</h4>
        ${giftsList}
      </div>

      <!-- Desafíos -->
      <div style="background:white;border-radius:16px;padding:20px;box-shadow:0 2px 16px rgba(0,0,0,0.06);">
        <h4 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;color:#7B5EA7;margin-bottom:14px;">🌀 Sus Desafíos</h4>
        ${challengesList}
      </div>
    </div>
  </div>
</div>

<!-- ============ PÁGINA 6: PROPÓSITO DE VIDA ============ -->
<div class="page" style="background:#F5EFE0;padding:40px 35px;">

  <div style="text-align:center;margin-bottom:32px;">
    <p style="font-family:Montserrat,sans-serif;font-size:10px;color:#7B5EA7;letter-spacing:4px;text-transform:uppercase;margin-bottom:8px;">Misión de Alma</p>
    <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:36px;color:#3d2b1f;font-weight:400;">El Propósito de Vida de ${childName}</h2>
    <div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,#C9A84C,transparent);margin:12px auto;"></div>
  </div>

  <div style="background:linear-gradient(160deg,#0d0520,#1e0a3c);border-radius:20px;padding:36px;text-align:center;margin-bottom:24px;position:relative;overflow:hidden;">
    <div style="position:absolute;top:0;left:0;right:0;bottom:0;opacity:0.15;">
      ${Array.from({length:25},(_,i)=>`<div style="position:absolute;left:${Math.random()*100}%;top:${Math.random()*100}%;width:${Math.random()*2+1}px;height:${Math.random()*2+1}px;background:white;border-radius:50%;"></div>`).join('')}
    </div>
    <div style="position:relative;z-index:2;">
      <div style="font-size:36px;margin-bottom:16px;">🌟</div>
      <h3 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:24px;color:#F5EFE0;font-weight:300;line-height:1.6;margin-bottom:16px;">
        "${childName} llegó a este mundo para<br><em style="color:#C9A84C;">${LIFE_PURPOSE[chart.sunSign]}</em>"
      </h3>
      <p style="font-family:Montserrat,sans-serif;font-size:11px;color:rgba(201,168,76,0.7);letter-spacing:2px;text-transform:uppercase;">Sol en ${chart.sunSign}</p>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:24px;">
    <div style="background:white;border-radius:12px;padding:20px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
      <div style="font-size:24px;margin-bottom:10px;">☉</div>
      <div style="font-family:Montserrat,sans-serif;font-size:9px;color:#999;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">Energía Solar</div>
      <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;color:#C9A84C;">${chart.sunSign}</div>
      <p style="font-family:Montserrat,sans-serif;font-size:10px;color:#3d2b1f;line-height:1.5;margin-top:8px;">Esencia y propósito consciente</p>
    </div>
    <div style="background:white;border-radius:12px;padding:20px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
      <div style="font-size:24px;margin-bottom:10px;">☽</div>
      <div style="font-family:Montserrat,sans-serif;font-size:9px;color:#999;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">Energía Lunar</div>
      <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;color:#7B5EA7;">${chart.moonSign}</div>
      <p style="font-family:Montserrat,sans-serif;font-size:10px;color:#3d2b1f;line-height:1.5;margin-top:8px;">Necesidades emocionales del alma</p>
    </div>
    <div style="background:white;border-radius:12px;padding:20px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
      <div style="font-size:24px;margin-bottom:10px;">↑</div>
      <div style="font-family:Montserrat,sans-serif;font-size:9px;color:#999;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">Energía Ascendente</div>
      <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;color:#5C8A6E;">${chart.ascendantSign}</div>
      <p style="font-family:Montserrat,sans-serif;font-size:10px;color:#3d2b1f;line-height:1.5;margin-top:8px;">Camino y expresión en el mundo</p>
    </div>
  </div>

  <div style="background:white;border-radius:16px;padding:24px;box-shadow:0 2px 16px rgba(0,0,0,0.06);">
    <h4 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;color:#C9A84C;margin-bottom:14px;">💛 Su Combinación Única</h4>
    <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:15px;color:#3d2b1f;line-height:1.8;">
      Con el Sol en <strong>${chart.sunSign}</strong>, la Luna en <strong>${chart.moonSign}</strong> y el Ascendente en <strong>${chart.ascendantSign}</strong>,
      ${childName} es un alma con una combinación extraordinariamente única. Su energía solar de ${chart.sunSign} le da una misión clara y poderosa,
      mientras que su Luna en ${chart.moonSign} le regala una vida emocional ${MOON_DESCRIPTIONS[chart.moonSign].toLowerCase()}
      Su Ascendente en ${chart.ascendantSign} asegura que todo lo que trae al mundo sea recibido con gracia.
    </p>
    <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:15px;color:#3d2b1f;line-height:1.8;margin-top:12px;">
      Como niñ${adjSuffix} <strong style="color:${childType.color};">${childType.type}</strong>, esta combinación astral se amplifica:
      ${pronoun} no llegó solo a vivir una vida, llegó a <em>${LIFE_PURPOSE[chart.sunSign]}</em>,
      y todos los planetas en su carta confirman y apoyan esta misión sagrada.
    </p>
  </div>
</div>

<!-- ============ PÁGINA 7: CONSEJOS MAJHO ============ -->
<div class="page" style="background:#F5EFE0;padding:0;overflow:hidden;">

  <div style="background:linear-gradient(135deg,#5C8A6E,#3A6B50);padding:32px 35px 24px;text-align:center;">
    <p style="font-family:Montserrat,sans-serif;font-size:10px;color:rgba(245,239,224,0.7);letter-spacing:4px;text-transform:uppercase;margin-bottom:8px;">Guía Práctica</p>
    <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:36px;color:#F5EFE0;font-weight:400;">Consejos del Método MAJHO</h2>
    <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:15px;color:rgba(245,239,224,0.8);font-style:italic;margin-top:8px;">Para acompañar a tu niñ${adjSuffix} ${childType.type}</p>
  </div>

  <div style="padding:30px 35px;">

    <div style="background:white;border-radius:16px;padding:28px;margin-bottom:20px;box-shadow:0 2px 16px rgba(0,0,0,0.06);">
      <h4 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;color:#5C8A6E;margin-bottom:20px;">🌿 Estrategias de Crianza Consciente</h4>
      ${tipsList}
    </div>

    <div style="background:linear-gradient(135deg,rgba(123,94,167,0.08),rgba(201,168,76,0.08));border:1px solid rgba(201,168,76,0.3);border-radius:16px;padding:24px;">
      <h4 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;color:#C9A84C;margin-bottom:12px;">💛 Recuerda Siempre</h4>
      <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:15px;color:#3d2b1f;line-height:1.8;font-style:italic;">
        "${childName} eligió nacer en este momento preciso, en este lugar, bajo estas estrellas.
        No eligió a cualquier madre: ${article} eligió a ti, porque sabía que eras exactamente
        quien necesitaba para cumplir su misión. Tu amor, tu presencia y tu guía consciente
        son el regalo más poderoso que puedes darle. El Método MAJHO es solo un mapa —
        tú eres la brújula."
      </p>
      <p style="font-family:Montserrat,sans-serif;font-size:11px;color:#7B5EA7;text-align:right;margin-top:12px;letter-spacing:1px;">— Método MAJHO</p>
    </div>
  </div>
</div>

<!-- ============ PÁGINA 8: INTERPRETACIÓN DE PLANETAS ============ -->
<div class="page" style="background:#F5EFE0;padding:36px 32px;">
  <div style="text-align:center;margin-bottom:24px;">
    <p style="font-family:Montserrat,sans-serif;font-size:10px;color:#7B5EA7;letter-spacing:4px;text-transform:uppercase;margin-bottom:6px;">Mapa Celeste Personal</p>
    <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:32px;color:#3d2b1f;font-weight:400;">Los Planetas de ${childName}</h2>
    <div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,#C9A84C,transparent);margin:10px auto;"></div>
    <p style="font-family:Montserrat,sans-serif;font-size:11px;color:#5C8A6E;line-height:1.6;max-width:480px;margin:0 auto;">Cada planeta en su carta revela una dimensión única de quién es ${childName} y cómo expresa su energía en el mundo.</p>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
    ${chart.planets.map(p => {
      const interpretation = getPlanetText(p.name, p.sign, p.house, childName, adjSuffix);
      const colors: Record<string,string> = { Sol:'#FFD700', Luna:'#9090B0', Mercurio:'#5C8A6E', Venus:'#C9A84C', Marte:'#E07070', Júpiter:'#FFA500', Saturno:'#8B7355', Urano:'#6495ED', Neptuno:'#7B5EA7', Plutón:'#8B6B9E' };
      const color = colors[p.name] || '#C9A84C';
      return `<div style="background:white;border-radius:10px;padding:14px;box-shadow:0 1px 8px rgba(0,0,0,0.06);border-top:3px solid ${color};">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
          <span style="font-size:18px;color:${color};">${p.symbol}</span>
          <div>
            <div style="font-family:Montserrat,sans-serif;font-size:10px;font-weight:700;color:#3d2b1f;text-transform:uppercase;letter-spacing:1px;">${p.name}</div>
            <div style="font-family:Montserrat,sans-serif;font-size:9px;color:#7B5EA7;">${SIGN_SYMBOLS[p.sign]} ${p.sign} · Casa ${p.house}</div>
          </div>
        </div>
        <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:12.5px;color:#3d2b1f;line-height:1.65;margin:0;">${interpretation}</p>
      </div>`;
    }).join('')}
  </div>
</div>

<!-- ============ PÁGINA 9: GUÍA DE CRIANZA ============ -->
<div class="page" style="background:#F5EFE0;padding:0;overflow:hidden;">
  <div style="background:linear-gradient(135deg,#3A6B50,#5C8A6E);padding:30px 32px 22px;text-align:center;">
    <p style="font-family:Montserrat,sans-serif;font-size:10px;color:rgba(245,239,224,0.75);letter-spacing:4px;text-transform:uppercase;margin-bottom:6px;">Crianza Consciente</p>
    <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:32px;color:#F5EFE0;font-weight:400;">Guía Personalizada para ${childName}</h2>
    <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:13px;color:rgba(245,239,224,0.8);font-style:italic;margin-top:6px;">Basada en Sol en ${chart.sunSign} · Luna en ${chart.moonSign}</p>
  </div>
  <div style="padding:24px 32px;">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      ${(PARENTING_GUIDE[chart.sunSign] ? PARENTING_GUIDE[chart.sunSign](childName, adjSuffix) : []).map((tip, i) => `
        <div style="background:white;border-radius:10px;padding:14px 16px;box-shadow:0 1px 8px rgba(0,0,0,0.06);display:flex;gap:10px;align-items:flex-start;">
          <div style="width:24px;height:24px;background:linear-gradient(135deg,#3A6B50,#5C8A6E);border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-family:Montserrat,sans-serif;font-size:10px;color:white;font-weight:700;">${i+1}</div>
          <p style="font-family:Montserrat,sans-serif;font-size:11.5px;color:#3d2b1f;line-height:1.65;margin:0;">${tip}</p>
        </div>`).join('')}
    </div>
    <div style="background:linear-gradient(135deg,rgba(201,168,76,0.12),rgba(92,138,110,0.12));border:1px solid rgba(201,168,76,0.3);border-radius:12px;padding:16px 20px;margin-top:14px;">
      <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:14px;color:#3d2b1f;line-height:1.7;font-style:italic;text-align:center;margin:0;">"No hay crianza perfecta. Hay crianza consciente, presente y llena de amor. Eso es exactamente lo que estás haciendo."</p>
      <p style="font-family:Montserrat,sans-serif;font-size:9px;color:#7B5EA7;text-align:right;margin-top:8px;letter-spacing:1px;">— Método MAJHO</p>
    </div>
  </div>
</div>

<!-- ============ PÁGINA 10: AFIRMACIONES ============ -->
<div class="page" style="background:linear-gradient(160deg,#0d0520 0%,#1e0a3c 50%,#0d0520 100%);padding:36px 32px;">
  <div style="text-align:center;margin-bottom:26px;">
    <p style="font-family:Montserrat,sans-serif;font-size:10px;color:rgba(201,168,76,0.7);letter-spacing:4px;text-transform:uppercase;margin-bottom:6px;">Palabras del Alma</p>
    <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:32px;color:#F5EFE0;font-weight:400;">Afirmaciones para ${childName}</h2>
    <div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,#C9A84C,transparent);margin:10px auto;"></div>
    <p style="font-family:Montserrat,sans-serif;font-size:11px;color:rgba(245,239,224,0.6);line-height:1.6;">Basadas en Sol en ${chart.sunSign} y Luna en ${chart.moonSign}. Léelas con ${childName} cada mañana.</p>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
    ${[
      ...(AFFIRMATIONS_BY_SUN[chart.sunSign] || []),
      ...(AFFIRMATIONS_BY_MOON[chart.moonSign] || [])
    ].map((aff, i) => `
      <div style="background:rgba(245,239,224,0.06);border:1px solid rgba(201,168,76,0.2);border-radius:10px;padding:14px 16px;display:flex;gap:10px;align-items:flex-start;">
        <span style="color:#C9A84C;font-size:14px;flex-shrink:0;margin-top:1px;">✦</span>
        <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:13.5px;color:#F5EFE0;line-height:1.6;margin:0;font-style:italic;">${aff}</p>
      </div>`).join('')}
  </div>
</div>

<!-- ============ PÁGINA 11: COMPATIBILIDAD CON LOS PADRES ============ -->
<div class="page" style="background:#F5EFE0;padding:0;overflow:hidden;">
  <div style="background:linear-gradient(135deg,#1e0a3c,#2d1b4e);padding:30px 32px 22px;text-align:center;">
    <p style="font-family:Montserrat,sans-serif;font-size:10px;color:rgba(201,168,76,0.7);letter-spacing:4px;text-transform:uppercase;margin-bottom:6px;">Vínculo Sagrado</p>
    <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:32px;color:#F5EFE0;font-weight:400;">Tu Niñ${adjSuffix} ${chart.sunSign} y Tú</h2>
    <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:13px;color:rgba(245,239,224,0.75);font-style:italic;margin-top:6px;">Cómo acompañar a ${childName} desde su esencia</p>
  </div>
  <div style="padding:26px 32px;">
    <div style="background:white;border-radius:16px;padding:24px;box-shadow:0 2px 16px rgba(0,0,0,0.06);margin-bottom:16px;">
      ${(COMPATIBILITY_TEXTS[chart.sunSign] ? COMPATIBILITY_TEXTS[chart.sunSign](childName, adjSuffix) : '').split('\n\n').map(paragraph => {
        if (paragraph.startsWith('✦')) {
          const [title, ...rest] = paragraph.split(': ');
          return `<div style="margin-bottom:14px;">
            <p style="font-family:Montserrat,sans-serif;font-size:11px;font-weight:700;color:#C9A84C;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px;">${title}</p>
            <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:14px;color:#3d2b1f;line-height:1.7;margin:0;">${rest.join(': ')}</p>
          </div>`;
        }
        return `<p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:15px;color:#3d2b1f;line-height:1.75;margin-bottom:16px;">${paragraph}</p>`;
      }).join('')}
    </div>
    <div style="background:linear-gradient(135deg,rgba(201,168,76,0.1),rgba(123,94,167,0.1));border:1px solid rgba(201,168,76,0.25);border-radius:12px;padding:18px 22px;text-align:center;">
      <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:15px;color:#3d2b1f;line-height:1.75;font-style:italic;margin:0;">"${childName} te eligió a ti. No a otra madre, no a otra familia. A ti. Confía en ese amor que ya existe entre los dos."</p>
      <p style="font-family:Montserrat,sans-serif;font-size:9px;color:#7B5EA7;text-align:right;margin-top:10px;letter-spacing:1px;">— Método MAJHO</p>
    </div>
  </div>
</div>

<!-- ============ PÁGINA 12: CIERRE ============ -->
<div class="page" style="background:linear-gradient(160deg,#0d0520 0%,#1e0a3c 40%,#2d1b4e 70%,#0d0520 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 35px;text-align:center;">

  <div style="position:absolute;top:0;left:0;right:0;bottom:0;overflow:hidden;">
    ${Array.from({length:80},(_,i)=>{
      const x=Math.random()*100, y=Math.random()*100, s=Math.random()*2+0.5, o=Math.random()*0.6+0.2;
      return `<div style="position:absolute;left:${x}%;top:${y}%;width:${s}px;height:${s}px;background:white;border-radius:50%;opacity:${o};"></div>`;
    }).join('')}
  </div>

  <div style="position:relative;z-index:2;max-width:480px;">

    <div style="width:80px;height:80px;background:linear-gradient(135deg,#C9A84C,#FFD700);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 28px;font-size:36px;box-shadow:0 0 30px rgba(201,168,76,0.4);">✦</div>

    <p style="font-family:Montserrat,sans-serif;font-size:10px;color:rgba(201,168,76,0.7);letter-spacing:5px;text-transform:uppercase;margin-bottom:12px;">Método MAJHO</p>

    <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:38px;color:#F5EFE0;font-weight:300;margin-bottom:20px;line-height:1.3;">Este reporte fue creado<br>con amor para</h2>

    <h3 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:48px;color:#C9A84C;font-weight:400;font-style:italic;margin-bottom:32px;">${childName}</h3>

    <div style="width:100px;height:1px;background:linear-gradient(90deg,transparent,#C9A84C,transparent);margin:0 auto 32px;"></div>

    <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:16px;color:rgba(245,239,224,0.75);line-height:1.8;font-style:italic;margin-bottom:32px;">
      "Cada niñ${adjSuffix} especial llega con un mapa estelar único. <br>
      El tuyo, ${childName}, es extraordinario."
    </p>

    <div style="background:rgba(245,239,224,0.07);border:1px solid rgba(201,168,76,0.3);border-radius:16px;padding:24px;margin-bottom:32px;">
      <p style="font-family:Montserrat,sans-serif;font-size:11px;color:rgba(245,239,224,0.6);margin-bottom:12px;letter-spacing:1px;">Generado el ${new Date().toLocaleDateString('es-ES', {day:'numeric',month:'long',year:'numeric'})}</p>
      <p style="font-family:Montserrat,sans-serif;font-size:11px;color:rgba(201,168,76,0.8);letter-spacing:2px;text-transform:uppercase;">metodomajho.com</p>
    </div>

    <div style="display:flex;align-items:center;gap:16px;justify-content:center;">
      <div style="width:40px;height:1px;background:rgba(201,168,76,0.4);"></div>
      <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;color:#C9A84C;">✦ MAJHO ✦</p>
      <div style="width:40px;height:1px;background:rgba(201,168,76,0.4);"></div>
    </div>
  </div>
</div>

</body>
</html>`;
}

export async function generatePDF(data: ReportData): Promise<Buffer> {
  const html = generateHTML(data);

  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
