import type { Country, Hint } from './types'

// Country database with coordinates and temperatures
const COUNTRIES: Record<string, Country> = {
  'Argentina': { name: 'Argentina', latitude: -38.4, longitude: -63.6, temperature: 18 },
  'Australia': { name: 'Australia', latitude: -27.0, longitude: 133.8, temperature: 21 },
  'Brazil': { name: 'Brazil', latitude: -14.2, longitude: -51.9, temperature: 24 },
  'Canada': { name: 'Canada', latitude: 56.1, longitude: -106.3, temperature: 5 },
  'China': { name: 'China', latitude: 35.9, longitude: 104.1, temperature: 15 },
  'Egypt': { name: 'Egypt', latitude: 26.8, longitude: 30.8, temperature: 28 },
  'France': { name: 'France', latitude: 46.2, longitude: 2.2, temperature: 12 },
  'Germany': { name: 'Germany', latitude: 51.2, longitude: 10.5, temperature: 10 },
  'India': { name: 'India', latitude: 20.6, longitude: 78.9, temperature: 26 },
  'Indonesia': { name: 'Indonesia', latitude: -0.8, longitude: 113.9, temperature: 27 },
  'Italy': { name: 'Italy', latitude: 41.9, longitude: 12.6, temperature: 14 },
  'Japan': { name: 'Japan', latitude: 36.2, longitude: 138.3, temperature: 13 },
  'Mexico': { name: 'Mexico', latitude: 23.6, longitude: -102.5, temperature: 22 },
  'Nigeria': { name: 'Nigeria', latitude: 9.1, longitude: 8.7, temperature: 26 },
  'Russia': { name: 'Russia', latitude: 61.5, longitude: 105.3, temperature: 3 },
  'South Africa': { name: 'South Africa', latitude: -30.6, longitude: 22.9, temperature: 18 },
  'South Korea': { name: 'South Korea', latitude: 35.9, longitude: 127.8, temperature: 11 },
  'Spain': { name: 'Spain', latitude: 40.5, longitude: -3.7, temperature: 14 },
  'Thailand': { name: 'Thailand', latitude: 15.9, longitude: 100.9, temperature: 28 },
  'Turkey': { name: 'Turkey', latitude: 38.9, longitude: 35.2, temperature: 16 },
  'United Kingdom': { name: 'United Kingdom', latitude: 55.4, longitude: -3.4, temperature: 9 },
  'United States': { name: 'United States', latitude: 37.1, longitude: -95.7, temperature: 15 },
  'Vietnam': { name: 'Vietnam', latitude: 14.1, longitude: 108.8, temperature: 25 },
}

// Default reference point (New York)
const REFERENCE_LAT = 40.7128
const REFERENCE_LON = -74.0060

export function getCountryOfDay(): string {
  // Use a deterministic function based on the date
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  const countries = Object.keys(COUNTRIES)
  const index = dayOfYear % countries.length
  return countries[index]
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  // Haversine formula
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

export function calculateDirection(lat1: number, lon1: number, lat2: number, lon2: number): string {
  const dLat = lat2 - lat1
  const dLon = lon2 - lon1
  const angle = Math.atan2(dLon, dLat) * (180 / Math.PI)
  
  if (angle >= -22.5 && angle < 22.5) return 'Norte'
  if (angle >= 22.5 && angle < 67.5) return 'Noreste'
  if (angle >= 67.5 && angle < 112.5) return 'Este'
  if (angle >= 112.5 && angle < 157.5) return 'Sureste'
  if (angle >= 157.5 || angle < -157.5) return 'Sur'
  if (angle >= -157.5 && angle < -112.5) return 'Suroeste'
  if (angle >= -112.5 && angle < -67.5) return 'Oeste'
  return 'Noroeste'
}

export function getHints(secretCountry: string): Hint[] {
  const country = COUNTRIES[secretCountry]
  
  if (!country) {
    return [
      { type: 'distance', value: '?', revealed: false },
      { type: 'direction', value: '?', revealed: false },
      { type: 'temperature', value: '?', revealed: false },
    ]
  }

  const distance = calculateDistance(REFERENCE_LAT, REFERENCE_LON, country.latitude, country.longitude)
  const direction = calculateDirection(REFERENCE_LAT, REFERENCE_LON, country.latitude, country.longitude)
  const tempMin = Math.max(-50, country.temperature - 5)
  const tempMax = Math.min(50, country.temperature + 5)

  return [
    { type: 'distance', value: `${distance} km`, revealed: false },
    { type: 'direction', value: direction, revealed: false },
    { type: 'temperature', value: `${tempMin}°C - ${tempMax}°C`, revealed: false },
  ]
}

export function checkGuess(guessName: string, secretCountry: string): boolean {
  return guessName.toLowerCase() === secretCountry.toLowerCase()
}

export function getAllCountries(): string[] {
  return Object.keys(COUNTRIES)
}

export function getCountryData(countryName: string): Country | null {
  return COUNTRIES[countryName] || null
}
