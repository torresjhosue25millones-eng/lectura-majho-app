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
  sunSign: string;
  moonSign: string;
  ascendantSign: string;
}

const SIGNS = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
const PLANET_SYMBOLS: Record<string, string> = {
  Sol: '☉', Luna: '☽', Mercurio: '☿', Venus: '♀', Marte: '♂',
  Júpiter: '♃', Saturno: '♄', Urano: '♅', Neptuno: '♆', Plutón: '♇',
};

const CITY_COORDS: Record<string, { lat: number; lon: number }> = {
  bogota: { lat: 4.711, lon: -74.072 }, medellin: { lat: 6.244, lon: -75.581 },
  cali: { lat: 3.451, lon: -76.532 }, barranquilla: { lat: 10.968, lon: -74.781 },
  cartagena: { lat: 10.391, lon: -75.479 }, bucaramanga: { lat: 7.119, lon: -73.122 },
  'ciudad de mexico': { lat: 19.432, lon: -99.133 }, guadalajara: { lat: 20.659, lon: -103.349 },
  monterrey: { lat: 25.686, lon: -100.316 }, puebla: { lat: 19.042, lon: -98.206 },
  'buenos aires': { lat: -34.603, lon: -58.381 }, cordoba: { lat: -31.413, lon: -64.181 },
  rosario: { lat: -32.957, lon: -60.639 }, mendoza: { lat: -32.889, lon: -68.845 },
  lima: { lat: -12.046, lon: -77.042 }, arequipa: { lat: -16.408, lon: -71.537 },
  cusco: { lat: -13.531, lon: -71.967 }, trujillo: { lat: -8.112, lon: -79.028 },
  santiago: { lat: -33.448, lon: -70.669 }, valparaiso: { lat: -33.046, lon: -71.619 },
  caracas: { lat: 10.480, lon: -66.903 }, maracaibo: { lat: 10.631, lon: -71.633 },
  quito: { lat: -0.180, lon: -78.467 }, guayaquil: { lat: -2.196, lon: -79.886 },
  'la paz': { lat: -16.5, lon: -68.119 }, cochabamba: { lat: -17.389, lon: -66.156 },
  asuncion: { lat: -25.263, lon: -57.575 }, montevideo: { lat: -34.901, lon: -56.164 },
  'santo domingo': { lat: 18.486, lon: -69.931 }, 'la habana': { lat: 23.113, lon: -82.366 },
  panama: { lat: 8.993, lon: -79.519 }, 'ciudad de panama': { lat: 8.993, lon: -79.519 },
  managua: { lat: 12.136, lon: -86.313 }, tegucigalpa: { lat: 14.072, lon: -87.206 },
  'san jose': { lat: 9.928, lon: -84.090 }, 'san salvador': { lat: 13.692, lon: -89.218 },
  guatemala: { lat: 14.641, lon: -90.512 }, 'ciudad de guatemala': { lat: 14.641, lon: -90.512 },
  madrid: { lat: 40.416, lon: -3.703 }, barcelona: { lat: 41.385, lon: 2.173 },
  miami: { lat: 25.761, lon: -80.191 }, 'new york': { lat: 40.712, lon: -74.005 },
  'los angeles': { lat: 34.052, lon: -118.243 }, houston: { lat: 29.760, lon: -95.369 },
};

const COUNTRY_CAPITALS: Record<string, { lat: number; lon: number }> = {
  colombia: { lat: 4.711, lon: -74.072 }, mexico: { lat: 19.432, lon: -99.133 },
  argentina: { lat: -34.603, lon: -58.381 }, peru: { lat: -12.046, lon: -77.042 },
  chile: { lat: -33.448, lon: -70.669 }, venezuela: { lat: 10.480, lon: -66.903 },
  ecuador: { lat: -0.180, lon: -78.467 }, bolivia: { lat: -16.5, lon: -68.119 },
  paraguay: { lat: -25.263, lon: -57.575 }, uruguay: { lat: -34.901, lon: -56.164 },
  españa: { lat: 40.416, lon: -3.703 }, spain: { lat: 40.416, lon: -3.703 },
  'estados unidos': { lat: 38.895, lon: -77.036 }, 'united states': { lat: 38.895, lon: -77.036 },
  usa: { lat: 38.895, lon: -77.036 }, brasil: { lat: -15.779, lon: -47.929 },
  brazil: { lat: -15.779, lon: -47.929 }, panama: { lat: 8.993, lon: -79.519 },
  'costa rica': { lat: 9.928, lon: -84.090 }, guatemala: { lat: 14.641, lon: -90.512 },
  honduras: { lat: 14.072, lon: -87.206 }, nicaragua: { lat: 12.136, lon: -86.313 },
  'el salvador': { lat: 13.692, lon: -89.218 }, 'republica dominicana': { lat: 18.486, lon: -69.931 },
  cuba: { lat: 23.113, lon: -82.366 },
};

function getCityCoords(city: string, country: string): { lat: number; lon: number } {
  const normalizedCity = city.toLowerCase().trim();
  const normalizedCountry = country.toLowerCase().trim();
  return CITY_COORDS[normalizedCity] || COUNTRY_CAPITALS[normalizedCountry] || { lat: 4.711, lon: -74.072 };
}

function toJulianDay(year: number, month: number, day: number, hour: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  return jdn + (hour - 12) / 24;
}

function normalizeDeg(d: number): number {
  return ((d % 360) + 360) % 360;
}

function getSignFromLon(lon: number): string {
  return SIGNS[Math.floor(normalizeDeg(lon) / 30)];
}

function getDegInSign(lon: number): number {
  return normalizeDeg(lon) % 30;
}

function getSunLongitude(jd: number): number {
  const n = jd - 2451545.0;
  const L = normalizeDeg(280.460 + 0.9856474 * n);
  const g = normalizeDeg(357.528 + 0.9856003 * n) * (Math.PI / 180);
  return normalizeDeg(L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g));
}

function getMoonLongitude(jd: number): number {
  const n = jd - 2451545.0;
  const L = normalizeDeg(218.316 + 13.176396 * n);
  const M = normalizeDeg(134.963 + 13.064993 * n) * (Math.PI / 180);
  const F = normalizeDeg(93.272 + 13.229350 * n) * (Math.PI / 180);
  return normalizeDeg(L + 6.289 * Math.sin(M) - 1.274 * Math.sin(2 * F - M) + 0.658 * Math.sin(2 * F));
}

function getMercuryLongitude(jd: number): number {
  const n = jd - 2451545.0;
  const L = normalizeDeg(252.251 + 4.09233 * n);
  const M = normalizeDeg(174.794 + 4.09233 * n) * (Math.PI / 180);
  return normalizeDeg(L + 23.439 * Math.sin(M) + 2.995 * Math.sin(2 * M));
}

function getVenusLongitude(jd: number): number {
  const n = jd - 2451545.0;
  const L = normalizeDeg(181.979 + 1.60213 * n);
  const M = normalizeDeg(50.416 + 1.60213 * n) * (Math.PI / 180);
  return normalizeDeg(L + 0.775 * Math.sin(M) + 0.013 * Math.sin(2 * M));
}

function getMarsLongitude(jd: number): number {
  const n = jd - 2451545.0;
  const L = normalizeDeg(355.433 + 0.52403 * n);
  const M = normalizeDeg(19.373 + 0.52403 * n) * (Math.PI / 180);
  return normalizeDeg(L + 10.691 * Math.sin(M) + 0.623 * Math.sin(2 * M));
}

function getJupiterLongitude(jd: number): number {
  const n = jd - 2451545.0;
  const L = normalizeDeg(34.351 + 0.08309 * n);
  const M = normalizeDeg(20.020 + 0.08309 * n) * (Math.PI / 180);
  return normalizeDeg(L + 5.555 * Math.sin(M) + 0.168 * Math.sin(2 * M));
}

function getSaturnLongitude(jd: number): number {
  const n = jd - 2451545.0;
  const L = normalizeDeg(50.077 + 0.03346 * n);
  const M = normalizeDeg(317.020 + 0.03346 * n) * (Math.PI / 180);
  return normalizeDeg(L + 6.393 * Math.sin(M) + 0.171 * Math.sin(2 * M));
}

function getUranus(jd: number): number {
  const n = jd - 2451545.0;
  return normalizeDeg(314.055 + 0.01177 * n);
}

function getNeptune(jd: number): number {
  const n = jd - 2451545.0;
  return normalizeDeg(304.348 + 0.00599 * n);
}

function getPluto(jd: number): number {
  const n = jd - 2451545.0;
  return normalizeDeg(238.956 + 0.00397 * n);
}

function getAscendant(jd: number, hour: number, lat: number, lon: number): number {
  const T = (jd - 2451545.0) / 36525;
  const GMST = normalizeDeg(280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T);
  const LST = normalizeDeg(GMST + lon);
  const RAMC = LST * (Math.PI / 180);
  const latRad = lat * (Math.PI / 180);
  const eps = 23.4392911 * (Math.PI / 180);
  const y = Math.cos(RAMC);
  const x = -(Math.sin(RAMC) * Math.cos(eps) + Math.tan(latRad) * Math.sin(eps));
  let asc = Math.atan2(y, x) * (180 / Math.PI);
  if (x < 0) asc += 180;
  return normalizeDeg(asc);
}

function getHouseNumber(planetLon: number, ascLon: number): number {
  const diff = normalizeDeg(planetLon - ascLon);
  return Math.floor(diff / 30) + 1;
}

export function calculateChart(
  year: number, month: number, day: number,
  hour: number, city: string, country: string
): AstralChart {
  const coords = getCityCoords(city, country);
  const jd = toJulianDay(year, month, day, hour);

  const ascLon = getAscendant(jd, hour, coords.lat, coords.lon);

  const rawPlanets = [
    { name: 'Sol', lon: getSunLongitude(jd), symbol: '☉' },
    { name: 'Luna', lon: getMoonLongitude(jd), symbol: '☽' },
    { name: 'Mercurio', lon: getMercuryLongitude(jd), symbol: '☿' },
    { name: 'Venus', lon: getVenusLongitude(jd), symbol: '♀' },
    { name: 'Marte', lon: getMarsLongitude(jd), symbol: '♂' },
    { name: 'Júpiter', lon: getJupiterLongitude(jd), symbol: '♃' },
    { name: 'Saturno', lon: getSaturnLongitude(jd), symbol: '♄' },
    { name: 'Urano', lon: getUranus(jd), symbol: '♅' },
    { name: 'Neptuno', lon: getNeptune(jd), symbol: '♆' },
    { name: 'Plutón', lon: getPluto(jd), symbol: '♇' },
  ];

  const planets: PlanetInfo[] = rawPlanets.map(p => ({
    name: p.name,
    longitude: p.lon,
    sign: getSignFromLon(p.lon),
    degree: Math.round(getDegInSign(p.lon)),
    house: getHouseNumber(p.lon, ascLon),
    symbol: PLANET_SYMBOLS[p.name] || p.name[0],
  }));

  const houses: HouseInfo[] = Array.from({ length: 12 }, (_, i) => {
    const lon = normalizeDeg(ascLon + i * 30);
    return { number: i + 1, longitude: lon, sign: getSignFromLon(lon), degree: Math.round(getDegInSign(lon)) };
  });

  const ascInfo = { sign: getSignFromLon(ascLon), degree: Math.round(getDegInSign(ascLon)), longitude: ascLon };

  return {
    planets,
    houses,
    ascendant: ascInfo,
    sunSign: planets[0].sign,
    moonSign: planets[1].sign,
    ascendantSign: ascInfo.sign,
  };
}
