'use client'

import { useState, useEffect } from 'react'
import { Lightbulb, MapPin, Compass, Thermometer, Building, Users, Coins, Globe, Eye, EyeOff } from 'lucide-react'
import { useGroqHints } from '@/hooks/use-groq-hints'
import type { CountryHint } from '@/hooks/use-groq-hints'
import { useLanguage } from '@/hooks/use-language'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface HintSystemProps {
  countryName: string
  targetCountry: any
  onHintRevealed?: (hintType: CountryHint['type']) => void
}

export function HintSystem({ countryName, targetCountry, onHintRevealed }: HintSystemProps) {
  const { t, language } = useLanguage()
  const { hints, loading, error, generateHints, revealHint } = useGroqHints()
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    if (countryName && targetCountry) {
      generateHints(countryName, targetCountry)
    }
  }, [countryName, targetCountry, generateHints])

  const handleRevealHint = (hintType: CountryHint['type']) => {
    revealHint(hintType)
    onHintRevealed?.(hintType)
  }

  const getHintIcon = (type: CountryHint['type']) => {
    switch (type) {
      case 'distance': return MapPin
      case 'direction': return Compass
      case 'temperature': return Thermometer
      case 'capital': return Building
      case 'population': return Users
      case 'currency': return Coins
      case 'language': return Globe
      case 'fun_fact': return Lightbulb
      default: return Lightbulb
    }
  }

  const getHintTitle = (type: CountryHint['type'], language: 'es' | 'en') => {
    const titles = {
      es: {
        distance: 'Pista de Distancia',
        direction: 'Pista de Dirección',
        temperature: 'Pista de Temperatura',
        capital: 'Capital',
        population: 'Población',
        currency: 'Moneda',
        language: 'Idioma',
        fun_fact: 'Dato Curioso'
      },
      en: {
        distance: 'Distance Hint',
        direction: 'Direction Hint',
        temperature: 'Temperature Hint',
        capital: 'Capital',
        population: 'Population',
        currency: 'Currency',
        language: 'Language',
        fun_fact: 'Fun Fact'
      }
    }
    return titles[language][type]
  }

  const basicHints = hints.filter(h => ['distance', 'direction', 'temperature'].includes(h.type))
  const advancedHints = hints.filter(h => !['distance', 'direction', 'temperature'].includes(h.type))

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Generando pistas...</span>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-4 border-red-500/40 bg-red-500/10">
        <p className="text-sm text-red-400">Error: {error}</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Basic Hints */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Pistas Básicas</h3>
        <div className="grid gap-2">
          {basicHints.map((hint) => {
            const Icon = getHintIcon(hint.type)
            return (
              <Card key={hint.type} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {getHintTitle(hint.type, language)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRevealHint(hint.type)}
                    disabled={hint.revealed}
                    className="h-8 px-2"
                  >
                    {hint.revealed ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {hint.revealed && (
                  <div className="mt-2 p-2 bg-primary/10 rounded border border-primary/20">
                    <p className="text-sm text-primary">{hint.value}</p>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>

      {/* Advanced Hints */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Pistas Avanzadas</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="h-8 px-2"
          >
            {showAll ? 'Ocultar' : 'Mostrar'}
          </Button>
        </div>
        
        {showAll && (
          <div className="grid gap-2">
            {advancedHints.map((hint) => {
              const Icon = getHintIcon(hint.type)
              return (
                <Card key={hint.type} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        {getHintTitle(hint.type, language)}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevealHint(hint.type)}
                      disabled={hint.revealed}
                      className="h-8 px-2"
                    >
                      {hint.revealed ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {hint.revealed && (
                    <div className="mt-2 p-2 bg-primary/10 rounded border border-primary/20">
                      <p className="text-sm text-primary">{hint.value}</p>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="text-xs text-muted-foreground">
        {hints.filter(h => h.revealed).length} de {hints.length} pistas reveladas
      </div>
    </div>
  )
}
