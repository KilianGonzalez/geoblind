'use client'

import { Hint } from '@/lib/types'
import { Compass, Thermometer, Zap, Building, Users, Coins, Globe, Lightbulb } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'

interface HintDisplayProps {
  hint: Hint
  index: number
}

export default function HintDisplay({ hint, index }: HintDisplayProps) {
  const { t, language } = useLanguage()

  const getHintIcon = () => {
    switch (hint.type) {
      case 'distance':
        return <Zap className="w-5 h-5" />
      case 'direction':
        return <Compass className="w-5 h-5" />
      case 'temperature':
        return <Thermometer className="w-5 h-5" />
      case 'capital':
        return <Building className="w-5 h-5" />
      case 'population':
        return <Users className="w-5 h-5" />
      case 'currency':
        return <Coins className="w-5 h-5" />
      case 'language':
        return <Globe className="w-5 h-5" />
      case 'fun_fact':
        return <Lightbulb className="w-5 h-5" />
      default:
        return <Zap className="w-5 h-5" />
    }
  }

  const getHintLabel = () => {
    const labels = {
      es: {
        distance: 'Distancia',
        direction: 'Dirección', 
        temperature: 'Temperatura',
        capital: 'Capital',
        population: 'Población',
        currency: 'Moneda',
        language: 'Idioma',
        fun_fact: 'Dato Curioso'
      },
      en: {
        distance: 'Distance',
        direction: 'Direction',
        temperature: 'Temperature',
        capital: 'Capital',
        population: 'Population', 
        currency: 'Currency',
        language: 'Language',
        fun_fact: 'Fun Fact'
      }
    }
    return labels[language][hint.type]
  }

  return (
    <div className="p-4 rounded-lg border border-border/40 bg-card/50 hover:border-border/60 transition-all">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-primary">{getHintIcon()}</span>
        <span className="text-sm text-foreground/60 font-medium">{getHintLabel()}</span>
      </div>
      <div className="text-lg font-semibold text-foreground">
        {hint.revealed ? hint.value : '?'}
      </div>
    </div>
  )
}
