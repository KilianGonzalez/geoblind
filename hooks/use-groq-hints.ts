'use client'

import { useState, useEffect } from 'react'

interface CountryHint {
  type: 'distance' | 'direction' | 'temperature' | 'capital' | 'population' | 'currency' | 'language' | 'fun_fact'
  value: string | number
  revealed: boolean
}

interface GroqResponse {
  hints: {
    distance: string
    direction: string
    temperature: string
    capital: string
    population: string
    currency: string
    language: string
    fun_fact: string
  }
  country_info: {
    name: string
    capital: string
    population: string
    area: string
    currency: string
    languages: string[]
  }
}

export type { CountryHint }

export function useGroqHints() {
  const [hints, setHints] = useState<CountryHint[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateHints = async (countryName: string, targetCountry: any) => {
    setLoading(true)
    setError(null)

    try {
      // Simulación de llamada a Groq API
      // En producción, esto sería una llamada real a la API
      const mockGroqResponse: GroqResponse = {
        hints: {
          distance: `${Math.floor(Math.random() * 5000 + 100)} km`,
          direction: ['Norte', 'Sur', 'Este', 'Oeste', 'Noreste', 'Noroeste', 'Sureste', 'Suroeste'][Math.floor(Math.random() * 8)],
          temperature: `${Math.floor(Math.random() * 30 + 10)}°C - ${Math.floor(Math.random() * 30 + 40)}°C`,
          capital: targetCountry.capital || 'Capital desconocida',
          population: targetCountry.population ? `${(targetCountry.population / 1000000).toFixed(1)} millones` : 'Desconocido',
          currency: targetCountry.currency || 'Moneda desconocida',
          language: targetCountry.languages?.[0] || 'Idioma desconocido',
          fun_fact: generateFunFact(countryName, targetCountry)
        },
        country_info: {
          name: countryName,
          capital: targetCountry.capital || 'Capital desconocida',
          population: targetCountry.population || 'Desconocido',
          area: targetCountry.area || 'Desconocido',
          currency: targetCountry.currency || 'Moneda desconocida',
          languages: targetCountry.languages || ['Idioma desconocido']
        }
      }

      // Convertir la respuesta a hints
      const countryHints: CountryHint[] = [
        { type: 'distance', value: mockGroqResponse.hints.distance, revealed: false },
        { type: 'direction', value: mockGroqResponse.hints.direction, revealed: false },
        { type: 'temperature', value: mockGroqResponse.hints.temperature, revealed: false },
        { type: 'capital', value: mockGroqResponse.hints.capital, revealed: false },
        { type: 'population', value: mockGroqResponse.hints.population, revealed: false },
        { type: 'currency', value: mockGroqResponse.hints.currency, revealed: false },
        { type: 'language', value: mockGroqResponse.hints.language, revealed: false },
        { type: 'fun_fact', value: mockGroqResponse.hints.fun_fact, revealed: false }
      ]

      setHints(countryHints)
    } catch (err) {
      setError('Error al generar pistas')
      console.error('Error generating hints:', err)
    } finally {
      setLoading(false)
    }
  }

  const revealHint = (hintType: CountryHint['type']) => {
    setHints(prev => 
      prev.map(hint => 
        hint.type === hintType ? { ...hint, revealed: true } : hint
      )
    )
  }

  const resetHints = () => {
    setHints([])
    setError(null)
  }

  return {
    hints,
    loading,
    error,
    generateHints,
    revealHint,
    resetHints
  }
}

function generateFunFact(countryName: string, country: any): string {
  const funFacts = [
    `${countryName} es conocido por su rica historia cultural.`,
    `La gastronomía de ${countryName} es famosa mundialmente.`,
    `${countryName} tiene paisajes naturales impresionantes.`,
    `La arquitectura de ${countryName} refleja su patrimonio único.`,
    `${countryName} ha contribuido significativamente al arte mundial.`,
    `El clima de ${countryName} es muy diverso en todo su territorio.`,
    `${countryName} es hogar de especies animales únicas.`,
    `La música tradicional de ${countryName} es muy característica.`,
    `${countryName} tiene una posición geográfica estratégica.`,
    `Los festivales de ${countryName} atraen visitantes de todo el mundo.`
  ]
  
  return funFacts[Math.floor(Math.random() * funFacts.length)]
}
