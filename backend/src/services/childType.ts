export type ChildTypeName = 'Índigo' | 'Cristal' | 'Arcoíris' | 'Diamante';

export interface ChildTypeResult {
  type: ChildTypeName;
  color: string;
  gradient: string;
  emoji: string;
  description: string;
  subtitle: string;
  gifts: string[];
  challenges: string[];
  majhoTips: string[];
  scores: { indigo: number; cristal: number; arcoiris: number; diamante: number };
}

export const QUESTIONS = [
  { id: 1, text: '¿Tu hijo/a cuestiona las reglas y necesita saber el "por qué" de cada cosa?', type: 'indigo' },
  { id: 2, text: '¿Tu hijo/a absorbe las emociones de los demás como si fueran propias?', type: 'cristal' },
  { id: 3, text: '¿Tu hijo/a irradia una alegría contagiosa y trae luz a todos a su alrededor?', type: 'arcoiris' },
  { id: 4, text: '¿Tu hijo/a demuestra sabiduría o conocimientos que parecen ir más allá de su edad?', type: 'diamante' },
  { id: 5, text: '¿Tu hijo/a tiene un fuerte sentido de justicia y se rebela ante situaciones injustas?', type: 'indigo' },
  { id: 6, text: '¿Tu hijo/a prefiere ambientes tranquilos y se afecta mucho con el ruido o el caos?', type: 'cristal' },
  { id: 7, text: '¿Tu hijo/a da sin esperar nada a cambio, compartiendo naturalmente sus cosas?', type: 'arcoiris' },
  { id: 8, text: '¿Tu hijo/a parece aprender ciertas habilidades sin necesidad de enseñanza formal?', type: 'diamante' },
  { id: 9, text: '¿Tu hijo/a tiene dificultades con sistemas educativos o estructuras convencionales?', type: 'indigo' },
  { id: 10, text: '¿Tu hijo/a tiene una conexión especial con la naturaleza, los animales o las plantas?', type: 'cristal' },
  { id: 11, text: '¿Tu hijo/a tiene una energía muy alta, positiva y transformadora en su ambiente?', type: 'arcoiris' },
  { id: 12, text: '¿Tu hijo/a habla de sueños vívidos, experiencias espirituales o "recuerdos" inusuales?', type: 'diamante' },
];

const TYPE_DATA: Record<ChildTypeName, Omit<ChildTypeResult, 'type' | 'scores'>> = {
  Índigo: {
    color: '#5C3D8F',
    gradient: 'linear-gradient(135deg, #3D1A6B 0%, #7B5EA7 100%)',
    emoji: '🔵',
    subtitle: 'El Guerrero de la Luz',
    description: 'Los niños Índigo son almas guerreras que llegaron a transformar los sistemas establecidos. Son altamente intuitivos, con un sentido de justicia innato y una misión poderosa: cuestionar lo que no funciona para crear algo mejor. A menudo son etiquetados como "difíciles" o diagnosticados con TDAH, pero su rebeldía es parte de su propósito sagrado. Necesitan razones lógicas, no obediencia ciega.',
    gifts: ['Liderazgo natural y carismático', 'Intuición poderosa y detector de falsedad', 'Sentido de justicia inquebrantable', 'Capacidad para ver la verdad más allá de las apariencias', 'Energía transformadora de sistemas obsoletos'],
    challenges: ['Frustración con reglas arbitrarias', 'Sensibilidad emocional intensa', 'Dificultad con figuras de autoridad tradicional', 'Tendencia al aislamiento cuando no se siente comprendido'],
    majhoTips: ['Siempre explica el "por qué" detrás de cada regla — nunca digas "porque sí"', 'Dales roles de liderazgo y responsabilidades reales en casa', 'Usa el diálogo abierto, no el castigo o la confrontación directa', 'Canaliza su energía hacia causas sociales o proyectos que importen', 'Valida su necesidad de cuestionarlo todo — es su superpoder', 'Apoya terapias alternativas: artes marciales, música, meditación guiada'],
  },
  Cristal: {
    color: '#5C8A6E',
    gradient: 'linear-gradient(135deg, #3A6B50 0%, #8BC4A8 100%)',
    emoji: '💎',
    subtitle: 'El Sanador del Amor',
    description: 'Los niños Cristal son almas de amor puro y compasión infinita. Son la segunda generación de niños especiales y llegaron para sanar al mundo desde adentro. Son extremadamente sensibles, profundamente empáticos y con una conexión espiritual natural. Pueden sentir las emociones de todos a su alrededor, lo que a veces los abruma. Necesitan ambientes de paz para florecer.',
    gifts: ['Sanación natural — su presencia calma a los demás', 'Empatía profunda y amor incondicional', 'Conexión especial con la naturaleza y los animales', 'Dones telepáticos o de comunicación no verbal', 'Capacidad innata de perdonar y reconciliar'],
    challenges: ['Absorber las emociones negativas del entorno', 'Sensibilidad extrema al ruido, luces o multitudes', 'Puede tardar más en hablar o expresarse verbalmente', 'Necesita mucha soledad y tiempo en naturaleza'],
    majhoTips: ['Crea espacios tranquilos y sagrados en el hogar', 'Enseña técnicas de limpieza energética (visualizaciones, cristales, naturaleza)', 'Limita la exposición a noticias violentas, discusiones o energías pesadas', 'Fomenta el contacto con la naturaleza diariamente', 'Respeta sus tiempos y no fuerces la socialización', 'Usa la música, el arte y el color como herramientas de expresión'],
  },
  Arcoíris: {
    color: '#C9A84C',
    gradient: 'linear-gradient(135deg, #B8860B 0%, #FFD700 100%)',
    emoji: '🌈',
    subtitle: 'La Alegría Encarnada',
    description: 'Los niños Arcoíris son la tercera generación de niños especiales: pura alegría encarnada. Llegaron completamente nuevos, sin karma previo que resolver, con el único propósito de dar amor y felicidad. Su energía es tan alta y positiva que transforma el ambiente solo con su presencia. Son generosos de forma natural y su risa es contagiosa. Llegaron para recordarnos que la vida es celebración.',
    gifts: ['Alegría incondicional que eleva a todos', 'Generosidad sin límites ni expectativas', 'Energía transformadora del ambiente', 'Capacidad natural de sanar con su presencia', 'Conexión con la música, el color y la expresión'],
    challenges: ['Dificultad para manejar ambientes negativos o pesados', 'Necesitan constante estimulación positiva', 'Pueden sentirse incomprendidos en entornos rígidos', 'Susceptibles a absorber negatividad si no se protegen'],
    majhoTips: ['Crea un hogar lleno de colores, música y arte', 'Celebra cada pequeño logro — les encanta ser reconocidos', 'Fomenta la expresión artística: pintura, baile, teatro, canto', 'Asegúrate de que su círculo social sea positivo y amoroso', 'Enseña que pueden decir "no" a situaciones que los drenan', 'Usa rituales de gratitud familiares todos los días'],
  },
  Diamante: {
    color: '#7B5EA7',
    gradient: 'linear-gradient(135deg, #4A3070 0%, #9B82C7 100%)',
    emoji: '✨',
    subtitle: 'El Maestro Multidimensional',
    description: 'Los niños Diamante son la cuarta y más reciente generación de almas especiales. Son multidimensionales, extremadamente avanzados y llegaron con capacidades que aún no comprendemos completamente. Parecen descargar conocimiento directamente, sin necesitar aprendizaje convencional. Son maestros en múltiples niveles y su presencia eleva la vibración de todo su entorno. Son muy raros y extraordinariamente especiales.',
    gifts: ['Multidimensionalidad — acceden a múltiples planos de consciencia', 'Descarga directa de conocimiento sin aprendizaje previo', 'Maestría natural en diversas áreas simultáneamente', 'Consciencia expandida y presencia espiritual poderosa', 'Capacidad de ver patrones y conexiones invisibles'],
    challenges: ['Dificultad para adaptarse al mundo material tridimensional', 'Sensaciones físicas intensas — hipersensibilidad', 'Puede parecer "ausente" o en su propio mundo', 'Requiere alimentación, sueño y rutinas muy específicas'],
    majhoTips: ['Respeta profundamente sus tiempos y ritmos — son únicos', 'Ofrece ambientes de estimulación intelectual y espiritual avanzados', 'Investiga pedagogías alternativas: Waldorf, Montessori, homeschooling', 'Alimentación consciente: limita ultraprocesados, fomenta lo natural', 'Practica la comunicación a través del arte, no solo palabras', 'Conecta con comunidades de padres de niños especiales'],
  },
};

export function determineChildType(answers: number[], birthYear: number): ChildTypeResult {
  const scores = { indigo: 0, cristal: 0, arcoiris: 0, diamante: 0 };
  const typeMap = ['indigo', 'cristal', 'arcoiris', 'diamante'];

  QUESTIONS.forEach((q, i) => {
    const typeKey = typeMap.indexOf(q.type);
    if (typeKey !== -1) {
      const key = q.type as keyof typeof scores;
      scores[key] += answers[i] ?? 0;
    }
  });

  // Bonus por año de nacimiento
  if (birthYear >= 2008) scores.diamante += 2;
  else if (birthYear >= 2000) scores.arcoiris += 1;
  else if (birthYear >= 1990) scores.cristal += 1;

  const maxScore = Math.max(...Object.values(scores));
  let winnerType: ChildTypeName = 'Índigo';

  if (scores.diamante === maxScore) winnerType = 'Diamante';
  else if (scores.arcoiris === maxScore) winnerType = 'Arcoíris';
  else if (scores.cristal === maxScore) winnerType = 'Cristal';
  else winnerType = 'Índigo';

  return {
    type: winnerType,
    scores,
    ...TYPE_DATA[winnerType],
  };
}
