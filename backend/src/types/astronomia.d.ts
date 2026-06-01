// Type declarations for packages without official @types

declare module 'tz-lookup' {
  function tzlookup(lat: number, lon: number): string;
  export = tzlookup;
}

// astronomia sub-module declarations

declare module 'astronomia/solar' {
  export function apparentLongitude(T: number): number;
  export function trueLongitude(T: number): { lon: number; ano: number };
}

declare module 'astronomia/moonposition' {
  export function position(jde: number): { lon: number; lat: number; range: number };
}

declare module 'astronomia/planetposition' {
  export class Planet {
    constructor(data: any);
    position(jde: number): { lon: number; lat: number; range: number };
    position2000(jde: number): { lon: number; lat: number; range: number };
  }
  export function toFK5(lon: number, lat: number, jde: number): { lon: number; lat: number };
}

declare module 'astronomia/julian' {
  export function CalendarGregorianToJD(y: number, m: number, d: number): number;
}

declare module 'astronomia/pluto' {
  export function heliocentric(jde: number): { lon: number; lat: number; range: number } | null;
}

declare module 'astronomia/data/vsop87Bearth'   { const data: any; export = data; }
declare module 'astronomia/data/vsop87Bmercury' { const data: any; export = data; }
declare module 'astronomia/data/vsop87Bvenus'   { const data: any; export = data; }
declare module 'astronomia/data/vsop87Bmars'    { const data: any; export = data; }
declare module 'astronomia/data/vsop87Bjupiter' { const data: any; export = data; }
declare module 'astronomia/data/vsop87Bsaturn'  { const data: any; export = data; }
declare module 'astronomia/data/vsop87Buranus'  { const data: any; export = data; }
declare module 'astronomia/data/vsop87Bneptune' { const data: any; export = data; }
