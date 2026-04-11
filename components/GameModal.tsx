'use client'

import { Trophy, Target, Globe } from 'lucide-react'

interface GameModalProps {
  type: 'win' | 'lose'
  country: string
  attempts: number
  onClose: () => void
  onPlayAgain: () => void
}

export default function GameModal({
  type,
  country,
  attempts,
  onClose,
  onPlayAgain,
}: GameModalProps) {
  const isWin = type === 'win'

  const getMessage = () => {
    if (isWin) {
      if (attempts === 1) return '¡Increíble! ¡Lo adivinaste al primer intento!'
      if (attempts <= 3) return '¡Muy bien! ¡Adivinaste rápido!'
      if (attempts <= 5) return '¡Genial! ¡Lo lograste!'
      return '¡Ganaste! ¡Un poco ajustado!'
    } else {
      return `¡Qué lástima! El país era ${country}`
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border/40 rounded-2xl p-8 max-w-md w-full space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center ${
              isWin
                ? 'bg-success/20'
                : 'bg-error/20'
            }`}
          >
            {isWin ? (
              <Trophy className={`w-10 h-10 text-success`} />
            ) : (
              <Globe className={`w-10 h-10 text-error`} />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-foreground">
            {isWin ? '¡Ganaste!' : 'Game Over'}
          </h2>
          <p className="text-lg text-foreground/70">{getMessage()}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-background/50 rounded-xl">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{country}</div>
            <div className="text-xs text-foreground/60 mt-1">País</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{attempts}/6</div>
            <div className="text-xs text-foreground/60 mt-1">Intentos</div>
          </div>
        </div>

        {/* Share Section */}
        <div className="p-4 bg-background/50 rounded-xl space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Comparte tu resultado</h3>
          <button className="w-full px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors">
            📋 Copiar Resultado
          </button>
          <button className="w-full px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors">
            𝕏 Compartir en X
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-border rounded-lg text-foreground hover:bg-card transition-colors font-semibold"
          >
            Cerrar
          </button>
          <button
            onClick={onPlayAgain}
            className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            Jugar de Nuevo
          </button>
        </div>
      </div>
    </div>
  )
}
