import type { Country } from '@/lib/types'

const PREFERRED_CONTINENT_ORDER = [
  'europa',
  'europe',
  'asia',
  'africa',
  'áfrica',
  'north america',
  'américa del norte',
  'south america',
  'américa del sur',
  'oceania',
  'oceanía',
  'antarctica',
  'antártida',
] as const

function normalizeContinentName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

export function getAvailableContinents(countries: Pick<Country, 'continent'>[]): string[] {
  const unique = new Map<string, string>()

  for (const country of countries) {
    const name = country.continent?.trim()
    if (!name) continue
    const normalized = normalizeContinentName(name)
    if (!unique.has(normalized)) {
      unique.set(normalized, name)
    }
  }

  return [...unique.values()].sort((left, right) => {
    const leftIndex = PREFERRED_CONTINENT_ORDER.indexOf(
      normalizeContinentName(left) as (typeof PREFERRED_CONTINENT_ORDER)[number]
    )
    const rightIndex = PREFERRED_CONTINENT_ORDER.indexOf(
      normalizeContinentName(right) as (typeof PREFERRED_CONTINENT_ORDER)[number]
    )

    if (leftIndex !== -1 || rightIndex !== -1) {
      if (leftIndex === -1) return 1
      if (rightIndex === -1) return -1
      return leftIndex - rightIndex
    }

    return left.localeCompare(right, 'es', { sensitivity: 'base' })
  })
}

export function resolveRegionContinent(
  countries: Pick<Country, 'continent'>[],
  requestedContinent?: string | null
): string | null {
  const available = getAvailableContinents(countries)
  if (available.length === 0) return null

  const requestedNormalized = requestedContinent
    ? normalizeContinentName(requestedContinent)
    : null

  if (requestedNormalized) {
    const matched = available.find(
      continent => normalizeContinentName(continent) === requestedNormalized
    )
    if (matched) return matched
  }

  const preferredDefault = available.find(continent => {
    const normalized = normalizeContinentName(continent)
    return normalized === 'europa' || normalized === 'europe'
  })

  return preferredDefault ?? available[0]
}

export function countryMatchesContinent(
  country: Pick<Country, 'continent'>,
  continent: string
): boolean {
  return normalizeContinentName(country.continent) === normalizeContinentName(continent)
}
