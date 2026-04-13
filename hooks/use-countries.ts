import { useCallback } from 'react'
import { getAllCountries, getCountryById, searchCountries, getCountriesByContinent } from '@/lib/services/countries'
import { useLanguage } from './use-language'
import type { Country } from '@/lib/types'

export function useCountries() {
  const { language } = useLanguage()

  const getAllCountriesWithTranslations = useCallback(async () => {
    const countries = await getAllCountries()
    return countries.map(country => ({
      ...country,
      name: country.name // El nombre ya viene traducido desde getAllCountries
    }))
  }, [language])

  const getCountryByIdWithTranslation = useCallback(async (id: string) => {
    const country = await getCountryById(id)
    if (!country) return null
    
    return {
      ...country,
      name: country.name // El nombre ya viene traducido desde getCountryById
    }
  }, [language])

  const searchCountriesWithTranslations = useCallback(async (
    query: string,
    tier?: 'standard' | 'extended'
  ) => {
    const countries = await searchCountries(query, tier)
    return countries.map(country => ({
      ...country,
      name: country.name // El nombre ya viene traducido desde searchCountries
    }))
  }, [language])

  const getCountriesByContinentWithTranslations = useCallback(async (continent: string) => {
    const countries = await getCountriesByContinent(continent)
    return countries.map(country => ({
      ...country,
      name: country.name // El nombre ya viene traducido desde getCountriesByContinent
    }))
  }, [language])

  return {
    getAllCountries: getAllCountriesWithTranslations,
    getCountryById: getCountryByIdWithTranslation,
    searchCountries: searchCountriesWithTranslations,
    getCountriesByContinent: getCountriesByContinentWithTranslations
  }
}
