'use client'

import { Hint } from '@/lib/types'
import { Compass, Thermometer, Zap } from 'lucide-react'

interface HintDisplayProps {
  hint: Hint
  index: number
}

export default function HintDisplay({ hint, index }: HintDisplayProps) {
  const getHintIcon = () => {
    switch (hint.type) {
      case 'distance':
        return <Zap className="w-5 h-5" />
      case 'direction':
        return <Compass className="w-5 h-5" />
      case 'temperature':
        return <Thermometer className="w-5 h-5" />
    }
  }

  const getHintLabel = () => {
    switch (hint.type) {
      case 'distance':
        return 'Distancia'
      case 'direction':
        return 'Dirección'
      case 'temperature':
        return 'Temperatura'
    }
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
