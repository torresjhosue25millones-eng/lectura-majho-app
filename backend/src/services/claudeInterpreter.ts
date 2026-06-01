/**
 * Uses Claude (Anthropic API) to generate personalized astrological
 * interpretations based on exact chart data computed by VSOP87.
 *
 * Returns null if ANTHROPIC_API_KEY is not set — callers fall back to
 * the static text already in pdfGenerator / contentLibrary.
 */

import Anthropic from '@anthropic-ai/sdk';
import { AstralChart } from './astrology';
import { ChildTypeResult } from './childType';

export interface ChartInterpretation {
  sunSection: string;
  moonSection: string;
  ascendantSection: string;
  planetsSection: string;
  purposeSection: string;
  majhoTips: string[];
}

export async function generateChartInterpretation(
  chart: AstralChart,
  childName: string,
  childSex: string,
  childType: ChildTypeResult,
  birthDate: string,
  birthCity: string
): Promise<ChartInterpretation | null> {

  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('[CLAUDE] ANTHROPIC_API_KEY no configurada — usando texto estático.');
    return null;
  }

  const gender    = childSex === 'F' ? 'niña' : 'niño';
  const adjSuffix = childSex === 'F' ? 'a' : 'o';
  const sunPlanet  = chart.planets.find(p => p.name === 'Sol')!;
  const moonPlanet = chart.planets.find(p => p.name === 'Luna')!;

  const planetsList = chart.planets
    .map(p => `${p.symbol} ${p.name}: ${p.sign} ${p.degree}° — Casa ${p.house}${p.retrograde ? ' ℞' : ''}`)
    .join('\n');

  const prompt = `Eres el intérprete oficial del Método MAJHO, metodología de crianza consciente con 4 pilares: Neurociencia, Consciencia, Espiritualidad e Integración práctica.

Los datos fueron calculados con precisión astronómica profesional (VSOP87/ELP2000).

═══════════════════════════════════
CARTA ASTRAL: ${childName.toUpperCase()}
${gender.toUpperCase()} · ${birthDate} · ${birthCity}
Tipo MAJHO: ${childType.type} — ${childType.subtitle}
═══════════════════════════════════

POSICIONES (VSOP87):
${planetsList}

ASCENDENTE: ${chart.ascendant.sign} ${chart.ascendant.degree}°
${chart.mc ? `MEDIO CIELO: ${chart.mc.sign} ${chart.mc.degree}°` : ''}

CASAS: ${chart.houses.map(h => `C${h.number}:${h.sign}`).join(' · ')}
═══════════════════════════════════

Genera este JSON exacto (sin texto antes/después, sin markdown):

{
  "sunSection": "Sol en ${sunPlanet.sign} ${sunPlanet.degree}° Casa ${sunPlanet.house}. Esencia y misión de vida desde el Método MAJHO. Máx 180 palabras.",
  "moonSection": "Luna en ${moonPlanet.sign} ${moonPlanet.degree}° Casa ${moonPlanet.house}. Mundo emocional y necesidades de este ${gender}. Máx 180 palabras.",
  "ascendantSection": "Ascendente en ${chart.ascendant.sign} ${chart.ascendant.degree}°. Máscara social y expresión en el mundo. Máx 150 palabras.",
  "planetsSection": "Las 3-4 posiciones más significativas de la carta. Menciona planetas retrógrados y aspectos clave. Máx 180 palabras.",
  "purposeSection": "Síntesis del propósito de alma de ${childName} integrando Sol+Luna+ASC+tipo ${childType.type}. Máx 150 palabras.",
  "majhoTips": ["tip1", "tip2", "tip3", "tip4", "tip5", "tip6"]
}

Idioma: español. Tono: cálido, empoderador, desde el amor. Usa grados exactos.`;

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== 'text') throw new Error('Respuesta inesperada');

    const raw = content.text.trim().replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
    const interpretation = JSON.parse(raw) as ChartInterpretation;

    if (!interpretation.sunSection || !Array.isArray(interpretation.majhoTips)) {
      throw new Error('Estructura inválida');
    }

    console.log('[CLAUDE] Interpretación generada para', childName);
    return interpretation;

  } catch (err) {
    console.error('[CLAUDE] Error — usando texto estático:', (err as Error).message);
    return null;
  }
}
