/**
 * Precision astrological calculations using:
 * - VSOP87 planetary theory (astronomia package) — sub-arcminute accuracy
 * - ELP 2000-82 lunar theory — ~1' accuracy
 * - OpenStreetMap Nominatim for geocoding
 * - geo-tz + luxon for correct UTC conversion (handles historical DST)
 */

import tzlookup from 'tz-lookup';
import { DateTime } from 'luxon';
import { Planet } from 'astronomia/planetposition';
import * as solar from 'astronomia/solar';
import * as moonposition from 'astronomia/moonposition';
import * as julianMod from 'astronomia/julian';
import * as plutoMod from 'astronomia/pluto';

// ✅ CORRECCIÓN: import default (sin "* as") para que los datos VSOP87 lleguen correctamente
import vsopEarth   from 'astronomia/data/vsop87Bearth';
import vsopMercury from 'astronomia/data/vsop87Bmercury';
import vsopVenus   from 'astronomia/data/vsop87Bvenus';
import vsopMars    from 'astronomia/data/vsop87Bmars';
import vsopJupiter from 'astronomia/data/vsop87Bjupiter';
import vsopSaturn  from 'astronomia/data/vsop87Bsaturn';
import vsopUranus  from 'astronomia/data/vsop87Buranus';
import vsopNeptune from 'astronomia/data/vsop87Bneptune';

// ─── Public interfaces ────────────────────────────────────────────────────────

export interface PlanetInfo {
  name: string;
  longitude: number;
  sign: string;
  degree: number;
  house: number;
  symbol: string;
  retrograde?: boolean;
}

export interface HouseInfo {
  number: number;
  longitude: number;
  sign: string;
  degree: number;
}

export interface AstralChart {
  planets: PlanetInfo[];
  houses: HouseInfo[];
  ascendant: { sign: string; degree: number; longitude: number };
  mc?: { sign: string; degree: number; longitude: number };
  sunSign: string;
  moonSign: string;
  ascendantSign: string;
  geocodedCity?: string;
  timezone?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SIGNS = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
  'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];

const PLANET_SYMBOLS: Record<string, string> = {
  Sol: '☉', Luna: '☽', Mercurio: '☿', Venus: '♀', Marte: '♂',
  Júpiter: '♃', Saturno: '♄', Urano: '♅', Neptuno: '♆', Plutón: '♇',
};

const FALLBACK_CITY: Record<string, { lat: number; lon: number }> = {
  'bogota': { lat: 4.711, lon: -74.072 }, 'bogotá': { lat: 4.711, lon: -74.072 },
  'medellin': { lat: 6.244, lon: -75.581 }, 'medellín': { lat: 6.244, lon: -75.581 },
  'cali': { lat: 3.451, lon: -76.532 }, 'barranquilla': { lat: 10.968, lon: -74.781 },
  'cartagena': { lat: 10.391, lon: -75.479 }, 'bucaramanga': { lat: 7.119, lon: -73.122 },
  'ciudad de mexico': { lat: 19.432, lon: -99.133 }, 'ciudad de méxico': { lat: 19.432, lon: -99.133 },
  'guadalajara': { lat: 20.659, lon: -103.349 }, 'monterrey': { lat: 25.686, lon: -100.316 },
  'buenos aires': { lat: -34.603, lon: -58.381 }, 'cordoba': { lat: -31.413, lon: -64.181 },
  'lima': { lat: -12.046, lon: -77.042 }, 'arequipa': { lat: -16.408, lon: -71.537 },
  'santiago': { lat: -33.448, lon: -70.669 }, 'valparaiso': { lat: -33.046, lon: -71.619 },
  'caracas': { lat: 10.480, lon: -66.903 }, 'quito': { lat: -0.180, lon: -78.467 },
  'guayaquil': { lat: -2.196, lon: -79.886 }, 'madrid': { lat: 40.416, lon: -3.703 },
  'barcelona': { lat: 41.385, lon: 2.173 }, 'miami': { lat: 25.761, lon: -80.191 },
  'new york': { lat: 40.712, lon: -74.005 }, 'nueva york': { lat: 40.712, lon: -74.005 },
  'los angeles': { lat: 34.052, lon: -118.243 },
};

const FALLBACK_COUNTRY: Record<string, { lat: number; lon: number }> = {
  'colombia': { lat: 4.711, lon: -74.072 }, 'mexico': { lat: 19.432, lon: -99.133 },
  'méxico': { lat: 19.432, lon: -99.133 }, 'argentina': { lat: -34.603, lon: -58.381 },
  'peru': { lat: -12.046, lon: -77.042 }, 'perú': { lat: -12.046, lon: -77.042 },
  'chile': { lat: -33.448, lon: -70.669 }, 'venezuela': { lat: 10.480, lon: -66.903 },
  'ecuador': { lat: -0.180, lon: -78.467 }, 'bolivia': { lat: -16.5, lon: -68.119 },
  'españa': { lat: 40.416, lon: -3.703 }, 'spain': { lat: 40.416, lon: -3.703 },
  'estados unidos': { lat: 38.895, lon: -77.036 }, 'usa': { lat: 38.895, lon: -77.036 },
  'brasil': { lat: -15.779, lon: -47.929 }, 'costa rica': { lat: 9.928, lon: -84.090 },
  'guatemala': { lat: 14.641, lon: -90.512 }, 'panama': { lat: 8.993, lon: -79.519 },
};

// ─── Geocoding ────────────────────────────────────────────────────────────────

async function geocodeCity(city: string, country: string): Promise<{ lat: number; lon: number; displayName: string }> {
  try {
    const q = encodeURIComponent(`${city}, ${country}`);
    const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&accept-language=es`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000);
    const res = await fetch(url, { headers: { 'User-Agent': 'LecturaMajho/1.0' }, signal: ctrl.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json() as Array<{ lat: string; lon: string; display_name: string }>;
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
          displayName: data[0].display_name.split(',').slice(0, 2).join(', ').trim(),
        };
      }
    }
  } catch { /* fallback below */ }
  const cityKey = city.toLowerCase().trim();
  const countryKey = country.toLowerCase().trim();
  const coords = FALLBACK_CITY[cityKey] || FALLBACK_COUNTRY[countryKey] || { lat: 4.711, lon: -74.072 };
  return { ...coords, displayName: `${city}, ${country}` };
}

// ─── Timezone + Julian Day ────────────────────────────────────────────────────

function localToJde(dateStr: string, timeStr: string, lat: number, lon: number): { jde: number; timezone: string } {
  let timezone = 'UTC';
  try {
    timezone = tzlookup(lat, lon) || 'UTC';
  } catch { /* use UTC */ }

  const localDt = DateTime.fromFormat(`${dateStr} ${timeStr}`, 'yyyy-MM-dd HH:mm', { zone: timezone });
  const utcDt = localDt.isValid ? localDt.toUTC()
    : DateTime.fromFormat(`${dateStr} ${timeStr}`, 'yyyy-MM-dd HH:mm', { zone: 'UTC' });

  const dayFraction = utcDt.day + utcDt.hour / 24 + utcDt.minute / 1440 + utcDt.second / 86400;
  const jde = (julianMod as any).CalendarGregorianToJD(utcDt.year, utcDt.month, dayFraction);
  return { jde, timezone };
}

// ─── Math helpers ─────────────────────────────────────────────────────────────

function normDeg(d: number): number { return ((d % 360) + 360) % 360; }
function r2d(r: number): number { return r * 180 / Math.PI; }
function d2r(d: number): number { return d * Math.PI / 180; }
function getSign(lon: number): string { return SIGNS[Math.floor(normDeg(lon) / 30)]; }
function getDeg(lon: number): number { return normDeg(lon) % 30; }

// ─── Geocentric ecliptic longitude from VSOP87 ───────────────────────────────

function geocentricLon(
  planetData: any, earthData: any, jde: number
): { lon: number; retrograde: boolean } {

  // ✅ CORRECCIÓN: extraer el default export si viene envuelto en { default: ... }
  const pData = planetData?.default ?? planetData;
  const eData = earthData?.default ?? earthData;

  const planet = new Planet(pData);
  const earth  = new Planet(eData);

  // ✅ CORRECCIÓN: usar position2000() que sí devuelve { lon, lat, range }
  function computeXYZ(jdePlanet: number, jdeEarth: number): [number, number, number] {
    const e = earth.position2000(jdeEarth);
    const p = planet.position2000(jdePlanet);
    const x = p.range * Math.cos(p.lat) * Math.cos(p.lon) - e.range * Math.cos(e.lat) * Math.cos(e.lon);
    const y = p.range * Math.cos(p.lat) * Math.sin(p.lon) - e.range * Math.cos(e.lat) * Math.sin(e.lon);
    const z = p.range * Math.sin(p.lat) - e.range * Math.sin(e.lat);
    return [x, y, z];
  }

  // First pass (no light-time correction)
  const [x0, y0, z0] = computeXYZ(jde, jde);
  const delta = Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0);
  const tau = 0.0057755183 * delta; // light-time in days

  // Second pass (with light-time correction)
  const [x, y] = computeXYZ(jde - tau, jde);
  const lon = normDeg(r2d(Math.atan2(y, x)));

  // Retrograde: compare current geocentric longitude with yesterday's
  const [xY, yY] = computeXYZ(jde - 1 - tau, jde - 1);
  const lonYest = normDeg(r2d(Math.atan2(yY, xY)));
  let diff = lon - lonYest;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;

  return { lon, retrograde: diff < 0 };
}

// ─── House cusps + Ascendant + MC ─────────────────────────────────────────────

function computeHouses(jde: number, lat: number, lon: number): { cusps: number[]; asc: number; mc: number } {
  const T    = (jde - 2451545.0) / 36525;
  const eps  = d2r(23.4392911 - 0.013004 * T);
  const gmst = normDeg(280.46061837 + 360.98564736629 * (jde - 2451545.0) + 0.000387933 * T * T);
  const lst  = normDeg(gmst + lon);
  const ramcR = d2r(lst);

  // Ascendant
  const y = Math.cos(ramcR);
  const x = -(Math.sin(ramcR) * Math.cos(eps) + Math.tan(d2r(lat)) * Math.sin(eps));
  let asc = normDeg(r2d(Math.atan2(y, x)));
  if (x < 0) asc = normDeg(asc + 180);

  // Midheaven
  const mc = normDeg(r2d(Math.atan2(Math.tan(ramcR), Math.cos(eps))));

  // House cusps (equal-division from ASC and MC — Placidus approximation)
  const cusps = new Array(13).fill(0);
  cusps[1]  = asc;                cusps[4]  = normDeg(mc + 180);
  cusps[7]  = normDeg(asc + 180); cusps[10] = mc;
  cusps[11] = normDeg(mc + 30);   cusps[12] = normDeg(mc + 60);
  cusps[2]  = normDeg(asc + 30);  cusps[3]  = normDeg(asc + 60);
  cusps[5]  = normDeg(mc + 210);  cusps[6]  = normDeg(mc + 240);
  cusps[8]  = normDeg(asc + 210); cusps[9]  = normDeg(asc + 240);

  return { cusps, asc, mc };
}

function getPlanetHouse(planetLon: number, cusps: number[]): number {
  const lon = normDeg(planetLon);
  for (let h = 1; h <= 12; h++) {
    const c1 = normDeg(cusps[h]);
    const c2 = normDeg(cusps[h === 12 ? 1 : h + 1]);
    if (c2 > c1) { if (lon >= c1 && lon < c2) return h; }
    else          { if (lon >= c1 || lon < c2) return h; }
  }
  return 1;
}

// ─── Main exported function ───────────────────────────────────────────────────

export async function calculateChart(
  year: number, month: number, day: number,
  time: string,
  city: string,
  country: string
): Promise<AstralChart> {

  // 1. Geocoding
  const { lat, lon, displayName } = await geocodeCity(city, country);

  // 2. Julian Ephemeris Day
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const { jde, timezone } = localToJde(dateStr, time, lat, lon);
  const T = (jde - 2451545.0) / 36525;

  // 3. Sol
  const sunLon = normDeg(r2d((solar as any).apparentLongitude(T)));

  // 4. Luna
  const moonPos = (moonposition as any).position(jde);
  const moonLon = normDeg(r2d(moonPos.lon));

  // 5. Planetas VSOP87
  const pMercury = geocentricLon(vsopMercury, vsopEarth, jde);
  const pVenus   = geocentricLon(vsopVenus,   vsopEarth, jde);
  const pMars    = geocentricLon(vsopMars,    vsopEarth, jde);
  const pJupiter = geocentricLon(vsopJupiter, vsopEarth, jde);
  const pSaturn  = geocentricLon(vsopSaturn,  vsopEarth, jde);
  const pUranus  = geocentricLon(vsopUranus,  vsopEarth, jde);
  const pNeptune = geocentricLon(vsopNeptune, vsopEarth, jde);

  // 6. Plutón
  let plutonLon = normDeg(238.956 + 0.003968789 * (jde - 2451545.0));
  try {
    const ph = (plutoMod as any).heliocentric(jde);
    if (ph && typeof ph.lon === 'number') plutonLon = normDeg(r2d(ph.lon));
  } catch { /* use linear fallback */ }

  // 7. Casas + Ascendente + MC
  const { cusps, asc, mc } = computeHouses(jde, lat, lon);

  // 8. Ensamblar
  const rawPlanets = [
    { name: 'Sol',      lon: sunLon,       retro: false },
    { name: 'Luna',     lon: moonLon,      retro: false },
    { name: 'Mercurio', lon: pMercury.lon, retro: pMercury.retrograde },
    { name: 'Venus',    lon: pVenus.lon,   retro: pVenus.retrograde },
    { name: 'Marte',    lon: pMars.lon,    retro: pMars.retrograde },
    { name: 'Júpiter',  lon: pJupiter.lon, retro: pJupiter.retrograde },
    { name: 'Saturno',  lon: pSaturn.lon,  retro: pSaturn.retrograde },
    { name: 'Urano',    lon: pUranus.lon,  retro: pUranus.retrograde },
    { name: 'Neptuno',  lon: pNeptune.lon, retro: pNeptune.retrograde },
    { name: 'Plutón',   lon: plutonLon,    retro: false },
  ];

  const planets: PlanetInfo[] = rawPlanets.map(p => ({
    name: p.name,
    longitude: Math.round(p.lon * 100) / 100,
    sign: getSign(p.lon),
    degree: Math.round(getDeg(p.lon) * 10) / 10,
    house: getPlanetHouse(p.lon, cusps),
    symbol: PLANET_SYMBOLS[p.name] || p.name[0],
    retrograde: p.retro,
  }));

  const houses: HouseInfo[] = Array.from({ length: 12 }, (_, i) => {
    const l = normDeg(cusps[i + 1]);
    return { number: i + 1, longitude: l, sign: getSign(l), degree: Math.round(getDeg(l) * 10) / 10 };
  });

  const ascInfo = { sign: getSign(asc), degree: Math.round(getDeg(asc) * 10) / 10, longitude: asc };
  const mcInfo  = { sign: getSign(mc),  degree: Math.round(getDeg(mc) * 10) / 10,  longitude: mc };

  return {
    planets,
    houses,
    ascendant: ascInfo,
    mc: mcInfo,
    sunSign:       planets[0].sign,
    moonSign:      planets[1].sign,
    ascendantSign: ascInfo.sign,
    geocodedCity:  displayName,
    timezone,
  };
}
