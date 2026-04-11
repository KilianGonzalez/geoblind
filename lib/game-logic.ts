import type { Country } from './types'

export interface CountryData {
  name: string
  flag: string
  continent: string
  latitude: number
  longitude: number
  temperature: number
}

const COUNTRIES: Record<string, CountryData> = {
  'España':          { name: 'España',          flag: '🇪🇸', continent: 'Europa',        latitude: 40.5,  longitude: -3.7,   temperature: 14 },
  'Francia':         { name: 'Francia',          flag: '🇫🇷', continent: 'Europa',        latitude: 46.2,  longitude: 2.2,    temperature: 12 },
  'Alemania':        { name: 'Alemania',          flag: '🇩🇪', continent: 'Europa',        latitude: 51.2,  longitude: 10.5,   temperature: 10 },
  'Italia':          { name: 'Italia',            flag: '🇮🇹', continent: 'Europa',        latitude: 41.9,  longitude: 12.6,   temperature: 14 },
  'Portugal':        { name: 'Portugal',          flag: '🇵🇹', continent: 'Europa',        latitude: 39.4,  longitude: -8.2,   temperature: 16 },
  'Turquía':         { name: 'Turquía',           flag: '🇹🇷', continent: 'Asia',          latitude: 38.9,  longitude: 35.2,   temperature: 16 },
  'Japón':           { name: 'Japón',             flag: '🇯🇵', continent: 'Asia',          latitude: 36.2,  longitude: 138.3,  temperature: 13 },
  'China':           { name: 'China',             flag: '🇨🇳', continent: 'Asia',          latitude: 35.9,  longitude: 104.1,  temperature: 15 },
  'India':           { name: 'India',             flag: '🇮🇳', continent: 'Asia',          latitude: 20.6,  longitude: 78.9,   temperature: 26 },
  'Corea del Sur':   { name: 'Corea del Sur',     flag: '🇰🇷', continent: 'Asia',          latitude: 35.9,  longitude: 127.8,  temperature: 11 },
  'Tailandia':       { name: 'Tailandia',         flag: '🇹🇭', continent: 'Asia',          latitude: 15.9,  longitude: 100.9,  temperature: 28 },
  'Vietnam':         { name: 'Vietnam',           flag: '🇻🇳', continent: 'Asia',          latitude: 14.1,  longitude: 108.8,  temperature: 25 },
  'Indonesia':       { name: 'Indonesia',         flag: '🇮🇩', continent: 'Asia',          latitude: -0.8,  longitude: 113.9,  temperature: 27 },
  'Rusia':           { name: 'Rusia',             flag: '🇷🇺', continent: 'Europa/Asia',   latitude: 61.5,  longitude: 105.3,  temperature: 3  },
  'Estados Unidos':  { name: 'Estados Unidos',    flag: '🇺🇸', continent: 'América Norte', latitude: 37.1,  longitude: -95.7,  temperature: 15 },
  'Canadá':          { name: 'Canadá',            flag: '🇨🇦', continent: 'América Norte', latitude: 56.1,  longitude: -106.3, temperature: 5  },
  'México':          { name: 'México',            flag: '🇲🇽', continent: 'América Norte', latitude: 23.6,  longitude: -102.5, temperature: 22 },
  'Brasil':          { name: 'Brasil',            flag: '🇧🇷', continent: 'América Sur',   latitude: -14.2, longitude: -51.9,  temperature: 24 },
  'Argentina':       { name: 'Argentina',         flag: '🇦🇷', continent: 'América Sur',   latitude: -38.4, longitude: -63.6,  temperature: 18 },
  'Colombia':        { name: 'Colombia',          flag: '🇨🇴', continent: 'América Sur',   latitude: 4.6,   longitude: -74.3,  temperature: 24 },
  'Egipto':          { name: 'Egipto',            flag: '🇪🇬', continent: 'África',        latitude: 26.8,  longitude: 30.8,   temperature: 28 },
  'Nigeria':         { name: 'Nigeria',           flag: '🇳🇬', continent: 'África',        latitude: 9.1,   longitude: 8.7,    temperature: 26 },
  'Sudáfrica':       { name: 'Sudáfrica',         flag: '🇿🇦', continent: 'África',        latitude: -30.6, longitude: 22.9,   temperature: 18 },
  'Marruecos':       { name: 'Marruecos',         flag: '🇲🇦', continent: 'África',        latitude: 31.8,  longitude: -7.1,   temperature: 20 },
  'Kenia':           { name: 'Kenia',             flag: '🇰🇪', continent: 'África',        latitude: -0.0,  longitude: 37.9,   temperature: 26 },
  'Australia':       { name: 'Australia',         flag: '🇦🇺', continent: 'Oceanía',       latitude: -27.0, longitude: 133.8,  temperature: 21 },
  'Nueva Zelanda':   { name: 'Nueva Zelanda',     flag: '🇳🇿', continent: 'Oceanía',       latitude: -40.9, longitude: 174.9,  temperature: 12 },
  'Arabia Saudita':  { name: 'Arabia Saudita',    flag: '🇸🇦', continent: 'Asia',          latitude: 23.9,  longitude: 45.1,   temperature: 30 },
  'Irán':            { name: 'Irán',              flag: '🇮🇷', continent: 'Asia',          latitude: 32.4,  longitude: 53.7,   temperature: 17 },
  'Pakistán':        { name: 'Pakistán',          flag: '🇵🇰', continent: 'Asia',          latitude: 30.4,  longitude: 69.3,   temperature: 23 },
}

// Target country: France (mock for daily challenge)
const TARGET: CountryData = COUNTRIES['Francia']

export function getCountryOfDay(): CountryData {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  const entries = Object.values(COUNTRIES)
  return entries[dayOfYear % entries.length]
}

export function getMockTarget(): CountryData {
  return TARGET
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) ** 2
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

export function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const rlat1 = lat1 * (Math.PI / 180)
  const rlat2 = lat2 * (Math.PI / 180)
  const y = Math.sin(dLon) * Math.cos(rlat2)
  const x = Math.cos(rlat1) * Math.sin(rlat2) - Math.sin(rlat1) * Math.cos(rlat2) * Math.cos(dLon)
  const bearing = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360
  return bearing
}

export function bearingToDirection(bearing: number): { label: string; arrow: string } {
  const dirs = [
    { label: 'N',  arrow: '↑' },
    { label: 'NE', arrow: '↗' },
    { label: 'E',  arrow: '→' },
    { label: 'SE', arrow: '↘' },
    { label: 'S',  arrow: '↓' },
    { label: 'SO', arrow: '↙' },
    { label: 'O',  arrow: '←' },
    { label: 'NO', arrow: '↖' },
  ]
  const index = Math.round(bearing / 45) % 8
  return dirs[index]
}

export function calculateProximity(distance: number): number {
  // Max meaningful distance ~20000 km (antipode), returns 0–100
  const maxDist = 20000
  return Math.max(0, Math.round((1 - distance / maxDist) * 100))
}

export function getProximityColor(pct: number): string {
  if (pct >= 100) return 'rgba(76, 175, 80, 0.5)'
  if (pct >= 81)  return 'rgba(255, 107, 53, 0.4)'
  if (pct >= 51)  return 'rgba(201, 168, 76, 0.3)'
  if (pct >= 21)  return 'rgba(45, 106, 79, 0.5)'
  return 'rgba(27, 58, 75, 0.8)'
}

export function getProximityBorderColor(pct: number): string {
  if (pct >= 100) return '#4CAF50'
  if (pct >= 81)  return '#FF6B35'
  if (pct >= 51)  return '#C9A84C'
  if (pct >= 21)  return '#2D6A4F'
  return '#1B3A4B'
}

export function getProximityMarkerColor(pct: number): string {
  if (pct >= 100) return '#4CAF50'
  if (pct >= 81)  return '#FF6B35'
  if (pct >= 51)  return '#C9A84C'
  if (pct >= 21)  return '#2D6A4F'
  return '#1E6091'
}

export interface GuessResult {
  country: CountryData
  distance: number
  bearing: number
  direction: { label: string; arrow: string }
  proximityPct: number
  isCorrect: boolean
}

export function evaluateGuess(guessName: string, target: CountryData): GuessResult | null {
  const country = COUNTRIES[guessName]
  if (!country) return null
  const distance = calculateDistance(country.latitude, country.longitude, target.latitude, target.longitude)
  const bearing = calculateBearing(country.latitude, country.longitude, target.latitude, target.longitude)
  const direction = bearingToDirection(bearing)
  const proximityPct = distance === 0 ? 100 : calculateProximity(distance)
  return {
    country,
    distance,
    bearing,
    direction,
    proximityPct,
    isCorrect: distance < 100,
  }
}

export function getAllCountriesData(): CountryData[] {
  return Object.values(COUNTRIES)
}

export function searchCountries(query: string): CountryData[] {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  return Object.values(COUNTRIES)
    .filter(c => c.name.toLowerCase().includes(q))
    .slice(0, 6)
}

// Legacy helpers kept for any existing components
export function getCountryData(name: string): CountryData | null {
  return COUNTRIES[name] || null
}

export function getAllCountries(): string[] {
  return Object.keys(COUNTRIES)
}

export function checkGuess(guessName: string, secretCountry: string): boolean {
  return guessName.toLowerCase() === secretCountry.toLowerCase()
}

export function getHints(secretCountry: string) {
  const c = COUNTRIES[secretCountry]
  if (!c) return []
  return [
    { type: 'distance' as const, value: '?', revealed: false },
    { type: 'direction' as const, value: '?', revealed: false },
    { type: 'temperature' as const, value: `${c.temperature - 5}°C – ${c.temperature + 5}°C`, revealed: false },
  ]
}
