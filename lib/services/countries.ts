import { createClient } from '@/lib/supabase/client'
import type { Country } from '@/lib/types'
import { getCountryName } from './country-translations'
import { useLanguage } from '@/hooks/use-language'

let countriesCache: Country[] | null = null

function mapCountryRow(row: Record<string, unknown>, language: 'es' | 'en' = 'es'): Country {
  return {
    id: String(row.id),
    name: getCountryName(String(row.iso_code), language),
    iso_code: String(row.iso_code),
    lat: Number(row.lat),
    lng: Number(row.lng),
    continent: String(row.continent),
    region: String(row.region),
    subregion: row.subregion != null ? String(row.subregion) : null,
    neighbor_codes: row.neighbor_codes != null ? (row.neighbor_codes as string[]) : [],
    population: row.population != null ? Number(row.population) : null,
    area_km2: row.area_km2 != null ? Number(row.area_km2) : null,
    flag_emoji: String(row.flag_emoji ?? '🏳️'),
    difficulty_tier: (row.difficulty_tier as Country['difficulty_tier']) ?? null,
  }
}

export async function getAllCountries(): Promise<Country[]> {
  if (countriesCache) return countriesCache

  const supabase = createClient()
  const { data, error } = await supabase
    .from('countries')
    .select('id, name, iso_code, lat, lng, continent, region, subregion, neighbor_codes, population, area_km2, flag_emoji, difficulty_tier')
    .order('name', { ascending: true })

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[getAllCountries]', error.message)
    }
    throw new Error(error.message)
  }

  const list = (data ?? []).map(row => mapCountryRow(row as Record<string, unknown>, 'es')) // Por defecto español
  countriesCache = list
  return list
}

/** Invalida la caché (p. ej. tras hot reload en desarrollo). */
export function clearCountriesCache(): void {
  countriesCache = null
}

export async function getCountryById(id: string): Promise<Country | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from('countries').select('id, name, iso_code, lat, lng, continent, region, subregion, neighbor_codes, population, area_km2, flag_emoji, difficulty_tier').eq('id', id).maybeSingle()

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[getCountryById]', error.message)
    }
    throw new Error(error.message)
  }
  if (!data) return null
  return mapCountryRow(data as Record<string, unknown>)
}

export async function getCountryByIsoCode(isoCode: string): Promise<Country | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('countries')
    .select('id, name, iso_code, lat, lng, continent, region, subregion, neighbor_codes, population, area_km2, flag_emoji, difficulty_tier')
    .eq('iso_code', isoCode)
    .maybeSingle()

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[getCountryByIsoCode]', error.message)
    }
    throw new Error(error.message)
  }
  if (!data) return null
  return mapCountryRow(data as Record<string, unknown>)
}

export async function searchCountries(
  query: string,
  tier?: 'standard' | 'extended'
): Promise<Country[]> {
  const q = query.trim()
  if (!q) return []

  const supabase = createClient()
  let builder = supabase
    .from('countries')
    .select('id, name, iso_code, lat, lng, continent, region, subregion, neighbor_codes, population, area_km2, flag_emoji, difficulty_tier')
    .ilike('name', `%${q}%`)
    .order('name', { ascending: true })
    .limit(8)

  if (tier) {
    builder = builder.eq('difficulty_tier', tier)
  }

  const { data, error } = await builder

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[searchCountries]', error.message)
    }
    throw new Error(error.message)
  }

  return (data ?? []).map(row => mapCountryRow(row as Record<string, unknown>))
}

export async function getCountriesByContinent(continent: string): Promise<Country[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('countries')
    .select('id, name, iso_code, lat, lng, continent, region, subregion, neighbor_codes, population, area_km2, flag_emoji, difficulty_tier')
    .eq('continent', continent)
    .order('name', { ascending: true })

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[getCountriesByContinent]', error.message)
    }
    throw new Error(error.message)
  }

  return (data ?? []).map(row => mapCountryRow(row as Record<string, unknown>))
}
