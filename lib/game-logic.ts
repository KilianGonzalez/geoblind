import type { Country } from '@/lib/types'

const EARTH_RADIUS_KM = 6371

export type CountryData = Pick<
  Country,
  'id' | 'name' | 'iso_code' | 'flag_emoji' | 'continent' | 'lat' | 'lng'
>

const DIRECTION_LABELS = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'] as const
export type DirectionLabel = (typeof DIRECTION_LABELS)[number]

const DIRECTION_ARROWS: Record<DirectionLabel, string> = {
  N: '↑',
  NE: '↗',
  E: '→',
  SE: '↘',
  S: '↓',
  SO: '↙',
  O: '←',
  NO: '↖',
}

export interface GuessResult {
  country: CountryData
  distance: number
  bearing: number
  direction: { label: string; arrow: string }
  proximityPct: number
  isCorrect: boolean
  attemptNumber: number
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const rlat1 = (lat1 * Math.PI) / 180
  const rlat2 = (lat2 * Math.PI) / 180
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return EARTH_RADIUS_KM * c
}

export function calculateBearingDegrees(fromLat: number, fromLng: number, toLat: number, toLng: number): number {
  const dLng = ((toLng - fromLng) * Math.PI) / 180
  const rlat1 = (fromLat * Math.PI) / 180
  const rlat2 = (toLat * Math.PI) / 180
  const y = Math.sin(dLng) * Math.cos(rlat2)
  const x =
    Math.cos(rlat1) * Math.sin(rlat2) -
    Math.sin(rlat1) * Math.cos(rlat2) * Math.cos(dLng)
  const bearing = (Math.atan2(y, x) * 180) / Math.PI
  return (bearing + 360) % 360
}

export function calculateDirection(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): DirectionLabel {
  const deg = calculateBearingDegrees(fromLat, fromLng, toLat, toLng)
  const idx = Math.floor((deg + 22.5) / 45) % 8
  return DIRECTION_LABELS[idx]
}

export function directionToArrowLabel(dir: string): { label: string; arrow: string } {
  const arrow = DIRECTION_ARROWS[dir as DirectionLabel] ?? '·'
  return { label: dir, arrow }
}

export function calculateProximity(distanceKm: number): number {
  return Math.max(0, Math.round((1 - distanceKm / 20000) * 100))
}

export function calculateScore(attemptsUsed: number, timeElapsedSec: number, won: boolean): number {
  if (!won) return 0
  const baseScore = 1000
  const attemptPenalty = (attemptsUsed - 1) * 100
  const timePenalty = Math.floor(timeElapsedSec / 10) * 5
  return Math.max(0, baseScore - attemptPenalty - timePenalty)
}

function hashSeed(value: string): number {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function getRankedCountry(countries: Country[], seedKey: string, rank: number): Country {
  if (countries.length === 0) {
    throw new Error('getRankedCountry: countries array is empty')
  }

  const ranked = [...countries].sort((left, right) => {
    const leftHash = hashSeed(`${seedKey}:${left.id}`)
    const rightHash = hashSeed(`${seedKey}:${right.id}`)
    return leftHash - rightHash
  })

  return ranked[rank % ranked.length]
}

export function pickRandomCountry(
  countries: Country[],
  excludedCountryIds: string[] = []
): Country {
  if (countries.length === 0) {
    throw new Error('pickRandomCountry: countries array is empty')
  }

  const excluded = new Set(excludedCountryIds)
  const filtered = countries.filter(country => !excluded.has(country.id))
  const pool = filtered.length > 0 ? filtered : countries
  return pool[Math.floor(Math.random() * pool.length)]
}

export function getDailyCountry(countries: Country[], date: Date): Country {
  const seedKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  return getRankedCountry(countries, seedKey, 0)
}

export function getModeCountry(params: {
  countries: Country[]
  mode: 'daily' | 'infinite' | 'region' | 'timed' | 'hard'
  date: Date
  regionKey?: string | null
}): Country {
  const { countries, mode, date, regionKey } = params
  const daySeed = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

  if (mode === 'region') {
    return getRankedCountry(countries, `region:${regionKey ?? 'default'}:${daySeed}`, 0)
  }

  if (mode === 'infinite') {
    const reserved = [
      getRankedCountry(countries, daySeed, 0).id,
      getRankedCountry(countries, daySeed, 1).id,
      getRankedCountry(countries, daySeed, 2).id,
    ]
    return pickRandomCountry(countries, reserved)
  }

  const rankByMode = {
    daily: 0,
    timed: 1,
    hard: 2,
  } as const

  return getRankedCountry(countries, daySeed, rankByMode[mode])
}

export function countryToCountryData(c: Country): CountryData {
  return {
    id: c.id,
    name: c.name,
    iso_code: c.iso_code,
    flag_emoji: c.flag_emoji,
    continent: c.continent,
    lat: c.lat,
    lng: c.lng,
  }
}

export function buildGuessResult(params: {
  guessed: Country
  target: Country
  attemptNumber: number
}): GuessResult {
  const { guessed, target, attemptNumber } = params
  const distance = calculateDistance(
    guessed.lat,
    guessed.lng,
    target.lat,
    target.lng
  )
  const bearing = calculateBearingDegrees(
    guessed.lat,
    guessed.lng,
    target.lat,
    target.lng
  )
  const dir = calculateDirection(
    guessed.lat,
    guessed.lng,
    target.lat,
    target.lng
  )
  const proximityPct = calculateProximity(distance)
  const isCorrect = proximityPct === 100 || guessed.id === target.id
  return {
    country: countryToCountryData(guessed),
    distance: Math.round(distance),
    bearing,
    direction: directionToArrowLabel(dir),
    proximityPct,
    isCorrect,
    attemptNumber,
  }
}

export function getProximityColor(pct: number): string {
  if (pct >= 100) return 'rgba(76, 175, 80, 0.5)'
  if (pct >= 81) return 'rgba(255, 107, 53, 0.4)'
  if (pct >= 51) return 'rgba(201, 168, 76, 0.3)'
  if (pct >= 21) return 'rgba(45, 106, 79, 0.5)'
  return 'rgba(27, 58, 75, 0.8)'
}

export function getProximityBorderColor(pct: number): string {
  if (pct >= 100) return '#4CAF50'
  if (pct >= 81) return '#FF6B35'
  if (pct >= 51) return '#C9A84C'
  if (pct >= 21) return '#2D6A4F'
  return '#1B3A4B'
}

export function getProximityMarkerColor(pct: number): string {
  if (pct >= 100) return '#4CAF50'
  if (pct >= 81) return '#FF6B35'
  if (pct >= 51) return '#C9A84C'
  if (pct >= 21) return '#2D6A4F'
  return '#1E6091'
}

/** Compatibilidad con `GameBoard` (comparación por nombre). */
export function checkGuess(guessName: string, secretCountry: string): boolean {
  return guessName.trim().toLowerCase() === secretCountry.trim().toLowerCase()
}

/**
 * @deprecated Los países vienen de Supabase; este listado ya no se mantiene aquí.
 */
export function getAllCountries(): string[] {
  return []
}
